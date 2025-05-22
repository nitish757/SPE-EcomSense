// import React, { useState } from 'react';
// import { predictLatest } from '../api/inventoryApi';
// import { Line } from 'react-chartjs-2';
// import 'chart.js/auto'; // Import this to ensure Chart.js works correctly
// import 'bootstrap/dist/css/bootstrap.min.css';

// const Forecast = () => {
//     const [prediction, setPrediction] = useState(null);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const handlePredict = async () => {
//         setLoading(true);
//         setError(null);

//         try {
//             const result = await predictLatest();
//             console.log('Received prediction:', result); // Log the response
//             setPrediction(result);
//         } catch (err) {
//             console.error('Error fetching prediction:', err);
//             setError("Failed to get prediction");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Prepare data for the chart
//     const chartData = {
//         labels: ['1 Day', '7 Days', '14 Days', '28 Days'], // Forecast periods
//         datasets: [
//             {
//                 label: 'Units Sold Forecast',
//                 data: prediction
//                     ? [
//                           prediction['1_day_forecast'],
//                           prediction['7_day_forecast'],
//                           prediction['14_day_forecast'],
//                           prediction['28_day_forecast'],
//                       ]
//                     : [],
//                 borderColor: 'rgba(75, 192, 192, 1)', // Teal color
//                 backgroundColor: 'rgba(75, 192, 192, 0.2)', // Light teal
//                 fill: true,
//             },
//         ],
//     };

//     // Chart options for better sizing and responsiveness
//     const chartOptions = {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 display: true,
//                 position: 'top',
//             },
//         },
//         scales: {
//             x: {
//                 grid: {
//                     display: false, // Remove gridlines for cleaner look
//                 },
//             },
//             y: {
//                 beginAtZero: true, // Start Y-axis at zero
//                 grid: {
//                     display: true,
//                 },
//             },
//         },
//     };

//     return (
//         <div className="mt-4">
//             {/* Button to trigger prediction */}
//             <button
//                 className="btn btn-success"
//                 onClick={handlePredict}
//                 disabled={loading}
//             >
//                 {loading ? "Predicting..." : "Run Forecast"}
//             </button>

//             {/* Error Message */}
//             {error && (
//                 <div className="alert alert-danger mt-3" role="alert">
//                     {error}
//                 </div>
//             )}

//             {/* Display Prediction Results */}
//             {prediction && (
//                 <div className="mt-3">
//                     <h5>Prediction Result</h5>
//                     <ul className="list-group mb-3">
//                         <li className="list-group-item">
//                             <strong>1 Day Forecast:</strong> {prediction['1_day_forecast']}
//                         </li>
//                         <li className="list-group-item">
//                             <strong>7 Days Forecast:</strong> {prediction['7_day_forecast']}
//                         </li>
//                         <li className="list-group-item">
//                             <strong>14 Days Forecast:</strong> {prediction['14_day_forecast']}
//                         </li>
//                         <li className="list-group-item">
//                             <strong>28 Days Forecast:</strong> {prediction['28_day_forecast']}
//                         </li>
//                     </ul>

//                     {/* Chart Visualization */}
//                     <div className="card p-3" style={{ height: '300px' }}>
//                         <h6 className="mb-3">Forecast Chart</h6>
//                         <div style={{ height: '100%', width: '100%' }}>
//                             <Line data={chartData} options={chartOptions} />
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Forecast;