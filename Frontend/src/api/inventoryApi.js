import axios from 'axios';

// Use environment variable for the inventory service base URL
const INVENTORY_API_URL = import.meta.env.VITE_INVENTORY_API_URL;


// Helper to prefix all requests with the correct base URL
const api = axios.create({
  baseURL: INVENTORY_API_URL,
});

// Fetch snapshots by date (YYYY-MM-DD)
export const getInventorySnapshotsByDate = async (date) => {
  const res = await api.get(`/api/inventory/date/${date}`);
  return res.data;
};

export const updateInventorySnapshot = async (id, updatedSnapshot) => {
  const res = await api.put(`/api/inventory/snapshots/${id}`, updatedSnapshot);
  return res.data;
};

export const deleteInventorySnapshot = async (id) => {
  await api.delete(`/api/inventory/snapshots/${id}`);
};

export const getInventorySnapshots = async () => {
  const res = await api.get('/api/inventory/snapshots');
  return res.data;
};

export const getInventorySnapshotsByYear = async (year) => {
  const res = await api.get(`/api/inventory/year/${year}`);
  return res.data;
};

export const getInventorySnapshotsByYearAndMonth = async (year, month) => {
  const res = await api.get(`/api/inventory/year/${year}/month/${month}`);
  return res.data;
};
