import React, { useEffect, useState } from "react";
import {
  getInventorySnapshots,
  getInventorySnapshotsByDate,
  getInventorySnapshotsByYear,
  getInventorySnapshotsByYearAndMonth,
} from "../api/inventoryApi";
import "bootstrap/dist/css/bootstrap.min.css";

export default function InventoryList() {
  const [snapshots, setSnapshots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

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
      setLoading(false);
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

  return (
    <div className="container mt-4">
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
                <td colSpan="13" className="text-center text-muted">
                  Loading...
                </td>
              </tr>
            ) : snapshots.length === 0 ? (
              <tr>
                <td colSpan="13" className="text-center text-muted">
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
