import React, { useEffect, useState } from "react";
import {
  getInventorySnapshots,
  addInventorySnapshot, // Ensure this function accepts an array
  getInventorySnapshotsByDate,
  getInventorySnapshotsByYearAndMonth,
  getInventorySnapshotsByYear
} from "../api/inventoryApi";
import "bootstrap/dist/css/bootstrap.min.css";

export default function InventoryList() {
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [jsonInput, setJsonInput] = useState(""); // To store the JSON input
  const [error, setError] = useState(""); // To store validation errors
  const [showAddForm, setShowAddForm] = useState(false); // Toggle form visibility

  // Date filters
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  // Helper to get months
  const months = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Generate year options (e.g., 2018-2025)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: 10 },
    (_, i) => `${currentYear - i}`
  );

  // Generate day options (1-31)
  const dayOptions = Array.from({ length: 31 }, (_, i) =>
    `${i + 1}`.padStart(2, "0")
  );

  // Fetch data based on selection
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        if (year && month && day) {
          // Full date selected
          const dateStr = `${year}-${month.padStart(2, "0")}-${day.padStart(
            2,
            "0"
          )}`;
          setSnapshots(await getInventorySnapshotsByDate(dateStr));
        } else if (year && month) {
          setSnapshots(await getInventorySnapshotsByYearAndMonth(year, month));
        } else if (year) {
          setSnapshots(await getInventorySnapshotsByYear(year));
        } else if (showAll) {
          setSnapshots(await getInventorySnapshots());
        } else {
          setSnapshots(await getInventorySnapshots());
        }
      } catch (error) {
        console.error("Error fetching inventory snapshots:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    // eslint-disable-next-line
  }, [year, month, day, showAll]);

  const handleYearChange = (e) => {
    setYear(e.target.value);
    setMonth("");
    setDay("");
    setShowAll(false);
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setDay("");
    setShowAll(false);
  };

  const handleDayChange = (e) => {
    setDay(e.target.value);
    setShowAll(false);
  };

  const handleShowAll = () => {
    setYear("");
    setMonth("");
    setDay("");
    setShowAll(true);
  };

  const handleClear = () => {
    setYear("");
    setMonth("");
    setDay("");
    setShowAll(false);
  };

  // Helper function to validate date format
  const isValidDate = (dateString) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
    return dateRegex.test(dateString);
  };

  const handleJsonInputChange = (e) => {
    const value = e.target.value;
    setJsonInput(value);

    // Clear previous error
    setError("");

    try {
      // Attempt to parse the JSON input
      const inputData = JSON.parse(value);

      // Ensure the input is an array
      if (!Array.isArray(inputData)) {
        setError("Input must be an array of inventory snapshots.");
        return;
      }

      // Validate each item in the array
      inputData.forEach((snapshot, index) => {
        const requiredFields = [
          "date",
          "storeId",
          "productId",
          "inventoryLevel",
          "unitsSold",
          "unitsOrdered",
          "price",
          "competitorPricing",
        ];

        // Check for missing fields
        const missingFields = requiredFields.filter(
          (field) => !(field in snapshot)
        );
        if (missingFields.length > 0) {
          throw new Error(
            `Snapshot at index ${index} is missing required fields: ${missingFields.join(
              ", "
            )}`
          );
        }

        // Validate field types
        if (!isValidDate(snapshot.date)) {
          throw new Error(`Invalid date format in snapshot at index ${index}.`);
        }
        if (
          typeof snapshot.inventoryLevel !== "number" ||
          typeof snapshot.unitsSold !== "number" ||
          typeof snapshot.unitsOrdered !== "number" ||
          typeof snapshot.price !== "number" ||
          typeof snapshot.competitorPricing !== "number"
        ) {
          throw new Error(
            `Numeric fields must be valid numbers in snapshot at index ${index}.`
          );
        }
      });
    } catch (err) {
      // Set error message if validation fails
      setError(err.message);
    }
  };

  const handleSubmitJson = async () => {
    setLoading(true);
    setError("");

    try {
      // Parse the JSON input
      const inputData = JSON.parse(jsonInput);

      // Send the JSON data to the backend
      await addInventorySnapshot(inputData);

      // Refetch data to include the newly added snapshot
      setSnapshots(await getInventorySnapshots());

      // Reset the form
      setJsonInput("");
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding inventory snapshot:", error);
      setError("Failed to save snapshot. Please check your input and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      {/* Button to toggle the form */}
      <button
        className="btn btn-success mb-3"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        {showAddForm ? "Cancel" : "Add New Snapshot"}
      </button>

      {/* Form to input JSON data */}
      {showAddForm && (
        <div className="card p-3 mb-3">
          <h5>Add New Inventory Snapshot</h5>
          <p className="text-muted small">
            Enter an array of inventory snapshots in JSON format.
          </p>
          <textarea
            className="form-control"
            rows="10"
            placeholder='[
  {
    "date": "2025-01-02",
    "storeId": "S002",
    "productId": "P0002",
    "inventoryLevel": 250,
    "unitsSold": 95,
    "unitsOrdered": 100,
    "price": 70.0,
    "competitorPricing": 68.0
  }
]'
            value={jsonInput}
            onChange={handleJsonInputChange}
            required
          />
          {error && <div className="text-danger small">{error}</div>}
          <button
            className="btn btn-primary mt-3"
            onClick={handleSubmitJson}
            disabled={loading || !!error}
          >
            {loading ? "Saving..." : "Save Snapshot"}
          </button>
        </div>
      )}

      {/* Date filters */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <h2>Inventory Snapshots</h2>
        <div className="d-flex flex-wrap align-items-center gap-2">
          <label className="fw-bold">Year:</label>
          <select
            className="form-select"
            style={{ width: 100 }}
            value={year}
            onChange={handleYearChange}
          >
            <option value="">--</option>
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <label className="fw-bold ms-2">Month:</label>
          <select
            className="form-select"
            style={{ width: 120 }}
            value={month}
            onChange={handleMonthChange}
            disabled={!year}
          >
            <option value="">--</option>
            {months.slice(1).map((m, idx) => (
              <option key={idx + 1} value={`${idx + 1}`.padStart(2, "0")}>
                {m}
              </option>
            ))}
          </select>
          <label className="fw-bold ms-2">Day:</label>
          <select
            className="form-select"
            style={{ width: 80 }}
            value={day}
            onChange={handleDayChange}
            disabled={!year || !month}
          >
            <option value="">--</option>
            {dayOptions.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <button
            className="btn btn-primary ms-2"
            onClick={handleShowAll}
            disabled={showAll}
          >
            Show All
          </button>
          <button className="btn btn-secondary ms-2" onClick={handleClear}>
            Clear
          </button>
        </div>
      </div>

      {/* Table to display inventory snapshots */}
      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-primary">
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Store</th>
              <th>Inventory Level</th>
              <th>Units Sold</th>
              <th>Units Ordered</th>
              <th>Price</th>
              <th>Competitor Price</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center text-muted">
                  Loading...
                </td>
              </tr>
            ) : snapshots.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center text-muted">
                  No data available.
                </td>
              </tr>
            ) : (
              snapshots.map((s) => (
                <tr key={s.id}>
                  <td>{s.date}</td>
                  <td>{s.productId}</td>
                  <td>{s.storeId}</td>
                  <td>{s.inventoryLevel}</td>
                  <td>{s.unitsSold}</td>
                  <td>{s.unitsOrdered}</td>
                  <td>{s.price}</td>
                  <td>{s.competitorPricing}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}