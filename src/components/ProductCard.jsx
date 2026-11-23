import { Link } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import { money } from '../lib/storage'

export default function ProductCard({ p }) {
  const { addToCart, wishlist, toggleWishlist } = useShop()
  const liked = wishlist.includes(p.id)
  return (
    <article className="card">
      <button className={`heart ${liked ? 'on' : ''}`} onClick={() => toggleWishlist(p.id)} aria-label="Toggle wishlist">
        {liked ? '♥' : '♡'}
      </button>
      <Link to={`/product/${p.id}`} className="thumb" style={{ background: p.color }}>{p.emoji}</Link>
      <div className="body">
        <small>{p.category}</small>
        <Link to={`/product/${p.id}`} className="title">{p.name}</Link>
        <div className="rating">★ {p.rating}</div>
        <div className="row">
          <strong>{money(p.price)}</strong>
          {p.stock === 0
            ? <span className="oos">Out of stock</span>
            : <button className="btn sm" onClick={() => addToCart(p)}>Add</button>}
        </div>
      </div>
    </article>
  )
}
