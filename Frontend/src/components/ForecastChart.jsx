import React, { useEffect, useState } from 'react'
import { getForecasts } from '../api/forecastApi'

export default function ForecastChart() {
  const [forecasts, setForecasts] = useState([])

  useEffect(() => {
    getForecasts().then(setForecasts)
  }, [])

  return (
    <div>
      <h2>Forecast Results</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th><th>Store</th><th>Date</th><th>Predicted</th>
          </tr>
        </thead>
        <tbody>
          {forecasts.map(f => (
            <tr key={f.id}>
              <td>{f.productld}</td>
              <td>{f.storeld}</td>
              <td>{f.forecastDate}</td>
              <td>{f.predictedDemand}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
