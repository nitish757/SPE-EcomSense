// import React, { useState } from 'react';
// import { predictLatest } from '../api/inventoryApi';

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

//     return (
//         <div className="mt-4">
//             <button
//                 className="btn btn-success"
//                 onClick={handlePredict}
//                 disabled={loading}
//             >
//                 {loading ? "Predicting..." : "Run Forecast"}
//             </button>

//             {error && (
//                 <div className="alert alert-danger mt-3" role="alert">
//                     {error}
//                 </div>
//             )}

//             {prediction && (
//                 <div className="mt-3">
//                     <h5>Prediction Result</h5>
//                     <ul className="list-group">
//                         <li className="list-group-item"><strong>1 Day Forecast:</strong> {prediction['1_day_forecast']}</li>
//                         <li className="list-group-item"><strong>7 Days Forecast:</strong> {prediction['7_day_forecast']}</li>
//                         <li className="list-group-item"><strong>14 Days Forecast:</strong> {prediction['14_day_forecast']}</li>
//                         <li className="list-group-item"><strong>28 Days Forecast:</strong> {prediction['28_day_forecast']}</li>
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Forecast;