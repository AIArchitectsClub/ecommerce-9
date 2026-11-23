import { useMemo, useState } from 'react'
import { useShop } from '../context/ShopContext'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const { products } = useShop()
  const categories = useMemo(() => ['All', ...new Set(products.map((p) => p.category))], [products])
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const [sort, setSort] = useState('featured')

  const list = useMemo(() => {
    let l = products.filter((p) =>
      (cat === 'All' || p.category === cat) && p.name.toLowerCase().includes(q.trim().toLowerCase()))
    if (sort === 'low') l = [...l].sort((a, b) => a.price - b.price)
    if (sort === 'high') l = [...l].sort((a, b) => b.price - a.price)
    if (sort === 'rating') l = [...l].sort((a, b) => b.rating - a.rating)
    return l
  }, [products, q, cat, sort])

  return (
    <>
      <div className="toolbar">
        <input placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="featured">Featured</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
          <option value="rating">Top rated</option>
        </select>
      </div>
      <div className="chips">
        {categories.map((c) => (
          <button key={c} className={`chip ${c === cat ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      {list.length === 0 ? <p className="empty">No products match your search.</p> : (
        <div className="grid">{list.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      )}
    </>
  )
}
