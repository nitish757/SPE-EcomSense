import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductList from './components/ProductList'
import InventoryList from './components/InventoryList'
import ForecastChart from './components/ForecastChart'

function App() {
  return (
    <Router>
      <div className="d-flex flex-column min-vh-100 w-100 bg-light">
        <nav className="d-flex justify-content-center align-items-center fs-3">
            <Link to="/" className="mx-5">Products</Link>
            <span className="fs-5 text-muted">|</span>
            <Link to="/inventory" className="mx-5">Inventory</Link>
            <span className="fs-5 text-muted">|</span>
            <Link to="/forecasts" className="mx-5">Forecasts</Link>
        </nav>
        <div style={{ flex: 1, padding: '1rem' }}>
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/inventory" element={<InventoryList />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
