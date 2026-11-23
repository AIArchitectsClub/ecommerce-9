import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import { detailedCart, totals } from '../lib/cart'
import Summary from '../components/Summary'

export default function Checkout() {
  const { cart, products, placeOrder } = useShop()
  const nav = useNavigate()
  const lines = detailedCart(cart, products)
  const [busy, setBusy] = useState(false)
  const [f, setF] = useState({ name: '', email: '', address: '', city: '', zip: '' })
  const [err, setErr] = useState({})
  if (!lines.length) return <p className="empty">Nothing to check out. <Link to="/">Back to shop</Link></p>
  const t = totals(lines)

  const submit = async (e) => {
    e.preventDefault()
    const er = {}
    if (!f.name.trim()) er.name = 'Required'
    if (!/^\S+@\S+\.\S+$/.test(f.email)) er.email = 'Enter a valid email'
    if (!f.address.trim()) er.address = 'Required'
    if (!f.city.trim()) er.city = 'Required'
    if (!/^\d{4,6}$/.test(f.zip)) er.zip = '4–6 digits'
    setErr(er)
    if (Object.keys(er).length) return
    setBusy(true)
    try {
      const order = await placeOrder(f)
      nav('/orders', { state: { placed: order.id } })
    } catch (ex) {
      setErr({ form: ex.message })
      setBusy(false)
    }
  }
  const field = (k, label, type = 'text') => (
    <label>{label}
      <input type={type} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} />
      {err[k] && <span className="err">{err[k]}</span>}
    </label>
  )
  return (
    <>
      <h1>Checkout</h1>
      <div className="two-col">
        <form className="panel form" onSubmit={submit} noValidate>
          {field('name', 'Full name')}
          {field('email', 'Email', 'email')}
          {field('address', 'Address')}
          {field('city', 'City')}
          {field('zip', 'ZIP / Postal code')}
          <p className="note">Demo only — no payment is taken.</p>
          {err.form && <p className="err">{err.form}</p>}
          <button className="btn block" disabled={busy}>{busy ? 'Placing order…' : 'Place order'}</button>
        </form>
        <aside className="panel"><h3>Order summary</h3><Summary t={t} /></aside>
      </div>
    </>
  )
}
