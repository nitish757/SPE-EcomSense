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
        <nav>
          <Link to="/">Products</Link> | <Link to="/inventory">Inventory</Link> | <Link to="/forecasts">Forecasts</Link>
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
