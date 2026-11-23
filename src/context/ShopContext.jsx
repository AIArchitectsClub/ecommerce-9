import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { api } from '../lib/api'

const Ctx = createContext(null)
export const useShop = () => useContext(Ctx)

export function ShopProvider({ children }) {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([]) // [{id, qty}]
  const [wishlist, setWishlist] = useState([])
  const [orders, setOrders] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error
  const [toast, setToast] = useState('')

  const refreshProducts = useCallback(async () => setProducts(await api('/products')), [])
  const refreshOrders = useCallback(async () => setOrders(await api('/orders')), [])

  useEffect(() => {
    Promise.all([refreshProducts(), api('/cart').then(setCart), api('/wishlist').then(setWishlist), refreshOrders()])
      .then(() => setStatus('ready'))
      .catch((e) => { console.error(e); setStatus('error') })
  }, [refreshProducts, refreshOrders])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 2200)
    return () => clearTimeout(t)
  }, [toast])

  // Run an API call; surface failures as a toast instead of crashing the UI.
  const run = useCallback(async (fn) => {
    try { return await fn() } catch (e) { setToast(e.message); return undefined }
  }, [])

  const putQty = (id, qty) => api(`/cart/${id}`, { method: 'PUT', body: { qty } }).then(setCart)

  const addToCart = useCallback((product, qty = 1) => run(async () => {
    const cur = cart.find((l) => l.id === product.id)?.qty || 0
    await putQty(product.id, cur + qty)
    setToast(`Added “${product.name}” to cart`)
  }), [cart, run])
  const setQty = useCallback((id, qty) => run(() => putQty(id, qty)), [run])
  const removeFromCart = useCallback((id) => run(() => putQty(id, 0)), [run])
  const toggleWishlist = useCallback((id) =>
    run(() => api(`/wishlist/${id}/toggle`, { method: 'POST' }).then(setWishlist)), [run])

  // Throws on failure so the checkout form can show the error.
  const placeOrder = useCallback(async (customer) => {
    const order = await api('/orders', { method: 'POST', body: { customer } })
    setCart([])
    await Promise.all([refreshOrders(), refreshProducts()])
    return order
  }, [refreshOrders, refreshProducts])

  const value = useMemo(() => ({
    products, cart, wishlist, orders, toast, status, addToCart, setQty, removeFromCart, toggleWishlist, placeOrder,
    cartCount: cart.reduce((n, l) => n + l.qty, 0),
  }), [products, cart, wishlist, orders, toast, status, addToCart, setQty, removeFromCart, toggleWishlist, placeOrder])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
