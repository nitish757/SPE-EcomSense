import React, { useEffect, useState } from 'react'
import { getInventorySnapshots, createInventorySnapshot } from '../api/inventoryApi'

export default function InventoryList() {
  const [snapshots, setSnapshots] = useState([])
  const [form, setForm] = useState({
    productld: '', storeld: '', snapshotDate: '', quantityAtBod: '', quantityAtEod: '', unitPrice: ''
  })

  useEffect(() => {
    getInventorySnapshots().then(setSnapshots)
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await createInventorySnapshot(form)
    setForm({ productld: '', storeld: '', snapshotDate: '', quantityAtBod: '', quantityAtEod: '', unitPrice: '' })
    setSnapshots(await getInventorySnapshots())
  }

  return (
    <div>
      <h2>Inventory Snapshots</h2>
      <form onSubmit={handleSubmit}>
        <input name="productld" placeholder="Product ID" value={form.productld} onChange={handleChange} required />
        <input name="storeld" placeholder="Store ID" value={form.storeld} onChange={handleChange} required />
        <input name="snapshotDate" placeholder="Date (YYYY-MM-DD)" value={form.snapshotDate} onChange={handleChange} required />
        <input name="quantityAtBod" placeholder="Qty BOD" type="number" value={form.quantityAtBod} onChange={handleChange} required />
        <input name="quantityAtEod" placeholder="Qty EOD" type="number" value={form.quantityAtEod} onChange={handleChange} required />
        <input name="unitPrice" placeholder="Unit Price" type="number" value={form.unitPrice} onChange={handleChange} required />
        <button type="submit">Add Snapshot</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Date</th><th>Product</th><th>Store</th><th>BOD</th><th>EOD</th><th>Price</th>
          </tr>
        </thead>
        <tbody>
          {snapshots.map(s => (
            <tr key={s.id}>
              <td>{s.snapshotDate}</td>
              <td>{s.productld}</td>
              <td>{s.storeld}</td>
              <td>{s.quantityAtBod}</td>
              <td>{s.quantityAtEod}</td>
              <td>{s.unitPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
