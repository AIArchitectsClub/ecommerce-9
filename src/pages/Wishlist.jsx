import { Link } from 'react-router-dom'
import { useShop } from '../context/ShopContext'
import ProductCard from '../components/ProductCard'

export default function Wishlist() {
  const { products, wishlist } = useShop()
  const list = products.filter((p) => wishlist.includes(p.id))
  return (
    <>
      <h1>Wishlist</h1>
      {list.length === 0 ? <p className="empty">Nothing saved yet. <Link to="/">Browse products</Link></p>
        : <div className="grid">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>}
    </>
  )
}
