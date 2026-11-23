import { Link, useLocation } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import { money } from '../lib/storage'

export default function Orders() {
  const { orders } = useShop()
  const placed = useLocation().state?.placed
  return (
    <>
      <h1>Your orders</h1>
      {placed && <div className="success">🎉 Order {placed} placed! Thanks for shopping.</div>}
      {orders.length === 0 ? <p className="empty">No orders yet. <Link to="/">Start shopping</Link></p> :
        orders.map((o) => (
          <section className="panel order" key={o.id}>
            <div className="row"><strong>{o.id}</strong><span>{new Date(o.date).toLocaleString()}</span></div>
            <ul>{o.items.map((i) => <li key={i.id}>{i.emoji} {i.name} × {i.qty} <span>{money(i.price * i.qty)}</span></li>)}</ul>
            <div className="row"><small>Ship to {o.customer.name}, {o.customer.city}</small><strong>Total {money(o.total)}</strong></div>
          </section>
        ))}
    </>
  )
}
