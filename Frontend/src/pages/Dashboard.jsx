// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import ForecastChart from "../components/ForecastChart";
// import PriceAdjuster from "../components/PriceAdjuster";

const Dashboard = () => {
//   const [products, setProducts] = useState([]);

  // Fetch products on mount
//   useEffect(() => {
//     axios.get("http://localhost:8080/products")
//       .then(res => setProducts(res.data))
//       .catch(err => console.error("Error fetching products", err));
//   }, []);

//   // Update product list after price change
//   const handlePriceUpdate = (id, newPrice) => {
//     axios.put(`http://localhost:8080/products/${id}/price?price=${newPrice}`)
//       .then(res => {
//         const updated = products.map(p =>
//           p.id === id ? { ...p, price: newPrice, forecasted: false } : p
//         );
//         setProducts(updated);
//       })
//       .catch(err => console.error("Price update failed", err));
//   };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">📈 Product Forecast Dashboard</h2>

      {/* {products.map(product => (
        <div className="card mb-4 shadow-sm" key={product.id}>
          <div className="card-body">
            <h5 className="card-title">{product.name}</h5>

            <p className="card-text">Current Price: ₹{product.price}</p>

            {product.forecasted ? (
              <>
                <ForecastChart data={product.forecast} />
                <PriceAdjuster
                  currentPrice={product.price}
                  onUpdate={(newPrice) => handlePriceUpdate(product.id, newPrice)}
                />
              </>
            ) : (
              <div className="alert alert-success mt-3">
                Forecast disabled — price has been adjusted.
              </div>
            )}
          </div>
        </div>
      ))} */}
    </div>
  );
};

export default Dashboard;
