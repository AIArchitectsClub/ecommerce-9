import { Router } from 'express'
import crypto from 'node:crypto'
import { pool } from './db.js'

const r = Router()
const wrap = (fn) => (req, res, next) => fn(req, res).catch(next)

// Until real auth exists, each browser identifies itself with an anonymous id.
r.use((req, res, next) => {
  const id = req.get('x-client-id')
  if (!id || !/^[\w-]{8,64}$/.test(id)) return res.status(400).json({ error: 'Missing or invalid X-Client-Id' })
  req.clientId = id
  next()
})

const PRODUCT_COLS = `id, name, category, price::float8 AS price, emoji, color, rating, description, stock`
const getCart = async (cid) =>
  (await pool.query('SELECT product_id AS id, qty FROM cart_items WHERE client_id=$1 ORDER BY product_id', [cid])).rows
const getWishlist = async (cid) =>
  (await pool.query('SELECT product_id FROM wishlist_items WHERE client_id=$1 ORDER BY product_id', [cid])).rows.map((x) => x.product_id)

r.get('/products', wrap(async (req, res) => {
  res.json((await pool.query(`SELECT ${PRODUCT_COLS} FROM products ORDER BY id`)).rows)
}))

r.get('/cart', wrap(async (req, res) => res.json(await getCart(req.clientId))))

r.put('/cart/:id', wrap(async (req, res) => {
  const pid = Number(req.params.id), qty = Math.floor(Number(req.body.qty))
  if (!Number.isInteger(pid) || !Number.isFinite(qty)) return res.status(400).json({ error: 'Invalid input' })
  if (qty <= 0) {
    await pool.query('DELETE FROM cart_items WHERE client_id=$1 AND product_id=$2', [req.clientId, pid])
  } else {
    const p = (await pool.query('SELECT stock FROM products WHERE id=$1', [pid])).rows[0]
    if (!p) return res.status(404).json({ error: 'Product not found' })
    const q = Math.min(qty, p.stock)
    if (q <= 0) return res.status(409).json({ error: 'Out of stock' })
    await pool.query(
      `INSERT INTO cart_items (client_id, product_id, qty) VALUES ($1,$2,$3)
       ON CONFLICT (client_id, product_id) DO UPDATE SET qty = EXCLUDED.qty`, [req.clientId, pid, q])
  }
  res.json(await getCart(req.clientId))
}))

r.get('/wishlist', wrap(async (req, res) => res.json(await getWishlist(req.clientId))))

r.post('/wishlist/:id/toggle', wrap(async (req, res) => {
  const pid = Number(req.params.id)
  const del = await pool.query('DELETE FROM wishlist_items WHERE client_id=$1 AND product_id=$2', [req.clientId, pid])
  if (del.rowCount === 0) {
    try {
      await pool.query('INSERT INTO wishlist_items (client_id, product_id) VALUES ($1,$2)', [req.clientId, pid])
    } catch { return res.status(404).json({ error: 'Product not found' }) }
  }
  res.json(await getWishlist(req.clientId))
}))

const orderQuery = `
  SELECT o.id, o.total::float8 AS total, o.customer, o.created_at AS date,
    COALESCE(json_agg(json_build_object('id', i.product_id, 'name', i.name, 'emoji', i.emoji,
      'price', i.price::float8, 'qty', i.qty)) FILTER (WHERE i.order_id IS NOT NULL), '[]') AS items
  FROM orders o LEFT JOIN order_items i ON i.order_id = o.id
  WHERE o.client_id = $1 GROUP BY o.id ORDER BY o.created_at DESC`

r.get('/orders', wrap(async (req, res) => res.json((await pool.query(orderQuery, [req.clientId])).rows)))

r.post('/orders', wrap(async (req, res) => {
  const c = req.body.customer || {}
  const customer = {
    name: String(c.name || '').trim(), email: String(c.email || '').trim(),
    address: String(c.address || '').trim(), city: String(c.city || '').trim(), zip: String(c.zip || '').trim(),
  }
  if (!customer.name || !/^\S+@\S+\.\S+$/.test(customer.email) || !customer.address || !customer.city || !/^\d{4,6}$/.test(customer.zip))
    return res.status(400).json({ error: 'Invalid customer details' })

  const db = await pool.connect()
  try {
    await db.query('BEGIN')
    const { rows: lines } = await db.query(
      `SELECT p.id, p.name, p.emoji, p.price::float8 AS price, p.stock, c.qty
       FROM cart_items c JOIN products p ON p.id = c.product_id
       WHERE c.client_id=$1 ORDER BY p.id FOR UPDATE OF p`, [req.clientId])
    if (!lines.length) { await db.query('ROLLBACK'); return res.status(400).json({ error: 'Cart is empty' }) }
    const short = lines.find((l) => l.qty > l.stock)
    if (short) { await db.query('ROLLBACK'); return res.status(409).json({ error: `Not enough stock for ${short.name}` }) }

    const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0)
    const shipping = subtotal >= 100 ? 0 : 7.99
    const total = Math.round((subtotal + shipping + subtotal * 0.08) * 100) / 100
    const id = 'ORD-' + crypto.randomBytes(4).toString('hex').toUpperCase()

    await db.query('INSERT INTO orders (id, client_id, total, customer) VALUES ($1,$2,$3,$4)',
      [id, req.clientId, total, customer])
    for (const l of lines) {
      await db.query('INSERT INTO order_items (order_id, product_id, name, emoji, price, qty) VALUES ($1,$2,$3,$4,$5,$6)',
        [id, l.id, l.name, l.emoji, l.price, l.qty])
      await db.query('UPDATE products SET stock = stock - $1 WHERE id=$2', [l.qty, l.id])
    }
    await db.query('DELETE FROM cart_items WHERE client_id=$1', [req.clientId])
    await db.query('COMMIT')
    res.status(201).json({ id, total })
  } catch (e) {
    await db.query('ROLLBACK').catch(() => {})
    throw e
  } finally { db.release() }
}))

export default r
