import { Routes, Route, Link, NavLink } from 'react-router-dom'
import { useShop } from './context/ShopContext'
import Home from './pages/Home'
import ProductPage from './pages/ProductPage'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import Wishlist from './pages/Wishlist'

export default function App() {
  const { cartCount, wishlist, toast, status } = useShop()
  return (
    <>
      <header className="nav">
        <Link to="/" className="logo">🛍️ ShopEase</Link>
        <nav>
          <NavLink to="/" end>Shop</NavLink>
          <NavLink to="/wishlist">♥ Wishlist{wishlist.length > 0 && <b className="badge">{wishlist.length}</b>}</NavLink>
          <NavLink to="/orders">Orders</NavLink>
          <NavLink to="/cart">🛒 Cart{cartCount > 0 && <b className="badge">{cartCount}</b>}</NavLink>
        </nav>
      </header>
      <main>
        {status === 'loading' && <p className="empty">Loading…</p>}
        {status === 'error' && <p className="empty">Couldn’t reach the server. Check that it’s running and the database is configured.</p>}
        {status === 'ready' && <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="*" element={<p className="empty">Page not found. <Link to="/">Back to shop</Link></p>} />
        </Routes>}
      </main>
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  )
}
