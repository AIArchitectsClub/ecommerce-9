import { Link } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import { detailedCart, totals } from '../lib/cart'
import { money } from '../lib/storage'
import Summary from '../components/Summary'

export default function Cart() {
  const { cart, products, setQty, removeFromCart } = useShop()
  const lines = detailedCart(cart, products)
  if (!lines.length) return <><h1>Your cart</h1><p className="empty">Your cart is empty. <Link to="/">Start shopping</Link></p></>
  return (
    <>
      <h1>Your cart</h1>
      <div className="two-col">
        <div>
          {lines.map(({ product: p, qty }) => (
            <div className="line" key={p.id}>
              <div className="mini" style={{ background: p.color }}>{p.emoji}</div>
              <div className="grow">
                <Link to={`/product/${p.id}`} className="title">{p.name}</Link>
                <div>{money(p.price)}</div>
                <button className="link" onClick={() => removeFromCart(p.id)}>Remove</button>
              </div>
              <div className="qty">
                <button onClick={() => setQty(p.id, qty - 1)}>−</button>
                <span>{qty}</span>
                <button disabled={qty >= p.stock} onClick={() => setQty(p.id, qty + 1)}>+</button>
              </div>
              <strong className="lt">{money(p.price * qty)}</strong>
            </div>
          ))}
        </div>
        <aside className="panel">
          <h3>Order summary</h3>
          <Summary t={totals(lines)} />
          <Link to="/checkout" className="btn block">Checkout</Link>
        </aside>
      </div>
    </>
  )
}
