import axios from 'axios'

export const getInventorySnapshots = async () => {
  const res = await axios.get('/api/inventory/snapshots')
  return res.data
}

export const createInventorySnapshot = async (snapshot) => {
  const res = await axios.post('/api/inventory/snapshots', snapshot)
  return res.data
}
