import axios from 'axios'

export const getForecasts = async () => {
  const res = await axios.get('/forecasts')
  return res.data
}