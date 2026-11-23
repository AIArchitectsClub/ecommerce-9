import { money } from '../lib/storage'
export default function Summary({ t }) {
  return (
    <dl className="summary">
      <dt>Subtotal</dt><dd>{money(t.subtotal)}</dd>
      <dt>Shipping</dt><dd>{t.shipping ? money(t.shipping) : 'Free'}</dd>
      <dt>Tax (8%)</dt><dd>{money(t.tax)}</dd>
      <dt className="total">Total</dt><dd className="total">{money(t.total)}</dd>
    </dl>
  )
}
