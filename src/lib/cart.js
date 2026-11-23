export function detailedCart(cart, products) {
  return cart.map((l) => ({ ...l, product: products.find((p) => p.id === l.id) })).filter((l) => l.product)
}
// Display only — the server recomputes the authoritative total when the order is placed.
export function totals(lines) {
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0)
  const shipping = subtotal === 0 || subtotal >= 100 ? 0 : 7.99
  const tax = subtotal * 0.08
  return { subtotal, shipping, tax, total: subtotal + shipping + tax }
}
