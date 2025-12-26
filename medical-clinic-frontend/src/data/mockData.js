// Patient Volume Forecast Data (ARIMA-style predictions)
export const patientForecastData = [
  { date: 'Jan', actual: 420, predicted: 415, lower: 390, upper: 440 },
  { date: 'Feb', actual: 380, predicted: 385, lower: 360, upper: 410 },
  { date: 'Mar', actual: 450, predicted: 445, lower: 420, upper: 470 },
  { date: 'Apr', actual: 520, predicted: 510, lower: 485, upper: 535 },
  { date: 'May', actual: 480, predicted: 490, lower: 465, upper: 515 },
  { date: 'Jun', actual: 510, predicted: 505, lower: 480, upper: 530 },
  { date: 'Jul', actual: null, predicted: 535, lower: 505, upper: 565 },
  { date: 'Aug', actual: null, predicted: 560, lower: 525, upper: 595 },
  { date: 'Sep', actual: null, predicted: 545, lower: 510, upper: 580 },
  { date: 'Oct', actual: null, predicted: 580, lower: 540, upper: 620 },
  { date: 'Nov', actual: null, predicted: 620, lower: 575, upper: 665 },
  { date: 'Dec', actual: null, predicted: 590, lower: 545, upper: 635 },
]

// Weekly Patient Distribution
export const weeklyDistribution = [
  { day: 'Mon', patients: 85, avgWait: 22 },
  { day: 'Tue', patients: 92, avgWait: 28 },
  { day: 'Wed', patients: 78, avgWait: 18 },
  { day: 'Thu', patients: 95, avgWait: 32 },
  { day: 'Fri', patients: 88, avgWait: 25 },
  { day: 'Sat', patients: 45, avgWait: 12 },
  { day: 'Sun', patients: 25, avgWait: 8 },
]

// Resource Utilization
export const resourceUtilization = [
  { resource: 'Exam Rooms', current: 78, optimal: 85, capacity: 12 },
  { resource: 'Lab Equipment', current: 65, optimal: 75, capacity: 8 },
  { resource: 'Imaging', current: 82, optimal: 80, capacity: 4 },
  { resource: 'Pharmacy', current: 70, optimal: 70, capacity: 6 },
]

// Staff Schedule Optimization
export const staffScheduleData = [
  { hour: '8AM', required: 8, scheduled: 10, patients: 12 },
  { hour: '9AM', required: 12, scheduled: 10, patients: 18 },
  { hour: '10AM', required: 15, scheduled: 14, patients: 24 },
  { hour: '11AM', required: 14, scheduled: 14, patients: 22 },
  { hour: '12PM', required: 10, scheduled: 12, patients: 15 },
  { hour: '1PM', required: 8, scheduled: 10, patients: 12 },
  { hour: '2PM', required: 14, scheduled: 12, patients: 20 },
  { hour: '3PM', required: 16, scheduled: 14, patients: 26 },
  { hour: '4PM', required: 12, scheduled: 12, patients: 18 },
  { hour: '5PM', required: 8, scheduled: 8, patients: 10 },
]

// Trend Analysis - Disease Categories
export const diseasesTrend = [
  { month: 'Jan', respiratory: 120, cardiovascular: 85, diabetes: 95, orthopedic: 60 },
  { month: 'Feb', respiratory: 145, cardiovascular: 82, diabetes: 98, orthopedic: 58 },
  { month: 'Mar', respiratory: 110, cardiovascular: 88, diabetes: 102, orthopedic: 65 },
  { month: 'Apr', respiratory: 85, cardiovascular: 90, diabetes: 105, orthopedic: 70 },
  { month: 'May', respiratory: 70, cardiovascular: 92, diabetes: 108, orthopedic: 75 },
  { month: 'Jun', respiratory: 65, cardiovascular: 95, diabetes: 110, orthopedic: 72 },
]

// Wait Time Trends
export const waitTimeTrend = [
  { week: 'W1', before: 35, after: 35 },
  { week: 'W2', before: 38, after: 32 },
  { week: 'W3', before: 42, after: 28 },
  { week: 'W4', before: 40, after: 25 },
  { week: 'W5', before: 45, after: 22 },
  { week: 'W6', before: 43, after: 20 },
  { week: 'W7', before: 48, after: 18 },
  { week: 'W8', before: 46, after: 16 },
]

// Decision Insights
export const insights = [
  {
    id: 1,
    type: 'warning',
    title: 'High Volume Expected',
    description: 'Patient volume predicted to increase 15% next month. Consider adding 2 staff members.',
    impact: 'high',
    action: 'Review staffing'
  },
  {
    id: 2,
    type: 'success',
    title: 'Wait Time Improved',
    description: 'Average wait time reduced by 45% since implementing predictive scheduling.',
    impact: 'positive',
    action: 'Continue monitoring'
  },
  {
    id: 3,
    type: 'info',
    title: 'Seasonal Pattern Detected',
    description: 'Respiratory cases typically peak in January-February. Prepare resources accordingly.',
    impact: 'medium',
    action: 'Plan ahead'
  },
  {
    id: 4,
    type: 'warning',
    title: 'Resource Bottleneck',
    description: 'Imaging department at 82% capacity. May cause delays during peak hours.',
    impact: 'medium',
    action: 'Optimize scheduling'
  },
]
