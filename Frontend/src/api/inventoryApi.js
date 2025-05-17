// import axios from 'axios'

// export const createInventorySnapshot = async (snapshot) => {
//   const res = await axios.post('/api/inventory/snapshots', snapshot)
//   return res.data
// }

import axios from 'axios';

// Fetch snapshots by date (YYYY-MM-DD)
export const getInventorySnapshotsByDate = async (date) => {
  const res = await axios.get(`/api/inventory/date/${date}`);
  return res.data;
};

// Update a snapshot by ID (assuming your backend supports PUT /api/inventory/snapshots/{id})
export const updateInventorySnapshot = async (id, updatedSnapshot) => {
  const res = await axios.put(`/api/inventory/snapshots/${id}`, updatedSnapshot);
  return res.data;
};

// Delete a snapshot by ID (assuming your backend supports DELETE /api/inventory/snapshots/{id})
export const deleteInventorySnapshot = async (id) => {
  await axios.delete(`/api/inventory/snapshots/${id}`);
};

export const getInventorySnapshots = async () => {
  const res = await axios.get('/api/inventory/snapshots')
  return res.data
}


export const getInventorySnapshotsByYear = async (year) => {
  const res = await axios.get(`/api/inventory/year/${year}`);
  return res.data;
};

export const getInventorySnapshotsByYearAndMonth = async (year, month) => {
  const res = await axios.get(`/api/inventory/year/${year}/month/${month}`);
  return res.data;
};

