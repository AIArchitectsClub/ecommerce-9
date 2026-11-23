import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import { money } from '../lib/storage'

export default function ProductPage() {
  const { id } = useParams()
  const p = products.find((x) => x.id === Number(id))
  const { products, addToCart, wishlist, toggleWishlist } = useShop()
  const [qty, setQty] = useState(1)
  if (!p) return <p className="empty">Product not found. <Link to="/">Back to shop</Link></p>
  const liked = wishlist.includes(p.id)
  return (
    <div className="detail">
      <div className="hero" style={{ background: p.color }}>{p.emoji}</div>
      <div>
        <Link to="/">← Back</Link>
        <h1>{p.name}</h1>
        <small>{p.category} · ★ {p.rating}</small>
        <p className="price">{money(p.price)}</p>
        <p>{p.description}</p>
        <p>{p.stock === 0 ? <span className="oos">Out of stock</span> : p.stock <= 5 ? `Only ${p.stock} left!` : 'In stock'}</p>
        {p.stock > 0 && (
          <div className="row gap">
            <div className="qty">
              <button onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span>{qty}</span>
              <button onClick={() => setQty(Math.min(p.stock, qty + 1))}>+</button>
            </div>
            <button className="btn" onClick={() => addToCart(p, qty)}>Add to cart</button>
          </div>
        )}
        <button className="btn ghost" onClick={() => toggleWishlist(p.id)}>{liked ? '♥ In wishlist' : '♡ Add to wishlist'}</button>
      </div>
    </div>
  )
}
