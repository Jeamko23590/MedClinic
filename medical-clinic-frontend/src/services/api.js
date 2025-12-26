import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Dashboard
export const getDashboardStats = () => api.get('/dashboard/stats')
export const getDashboardInsights = () => api.get('/dashboard/insights')

// Forecast
export const getPatientForecast = () => api.get('/forecast/patients')
export const getWeeklyDistribution = () => api.get('/forecast/weekly')
export const getArimaForecast = () => api.get('/forecast/arima')

// Resources
export const getResourceUtilization = () => api.get('/resources/utilization')
export const getDepartments = () => api.get('/resources/departments')
export const getCapacity = () => api.get('/resources/capacity')

// Trends
export const getDiseaseTrends = () => api.get('/trends/diseases')
export const getSeasonalPatterns = () => api.get('/trends/seasonal')
export const getWaitTimeImpact = () => api.get('/trends/wait-time')

// Schedule
export const getHourlyRequirements = () => api.get('/schedule/hourly')
export const getWeeklySchedule = () => api.get('/schedule/weekly')
export const getStaffPerformance = () => api.get('/schedule/staff-performance')
export const getScheduleRecommendations = () => api.get('/schedule/recommendations')

export default api
