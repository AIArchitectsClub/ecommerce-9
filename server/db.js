import pg from 'pg'
import { products } from './seed.js'

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set. Copy .env.example to .env and add your Neon connection string.')
  process.exit(1)
}

export const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 5 })

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id serial PRIMARY KEY, name text NOT NULL, category text NOT NULL,
      price numeric(10,2) NOT NULL, emoji text, color text, rating real,
      description text, stock int NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS cart_items (
      client_id text NOT NULL, product_id int NOT NULL REFERENCES products(id),
      qty int NOT NULL CHECK (qty > 0), PRIMARY KEY (client_id, product_id)
    );
    CREATE TABLE IF NOT EXISTS wishlist_items (
      client_id text NOT NULL, product_id int NOT NULL REFERENCES products(id),
      PRIMARY KEY (client_id, product_id)
    );
    CREATE TABLE IF NOT EXISTS orders (
      id text PRIMARY KEY, client_id text NOT NULL, total numeric(10,2) NOT NULL,
      customer jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS order_items (
      order_id text NOT NULL REFERENCES orders(id), product_id int NOT NULL,
      name text NOT NULL, emoji text, price numeric(10,2) NOT NULL, qty int NOT NULL
    );
    CREATE INDEX IF NOT EXISTS orders_client_idx ON orders (client_id, created_at DESC);
  `)
  const { rows } = await pool.query('SELECT count(*)::int AS n FROM products')
  if (rows[0].n === 0) {
    for (const p of products) {
      await pool.query(
        `INSERT INTO products (id,name,category,price,emoji,color,rating,description,stock)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [p.id, p.name, p.category, p.price, p.emoji, p.color, p.rating, p.description, p.stock])
    }
    await pool.query(`SELECT setval(pg_get_serial_sequence('products','id'), (SELECT max(id) FROM products))`)
    console.log(`Seeded ${products.length} products`)
  }
}
