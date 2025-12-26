import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts'
import { TrendingUp, Calendar, AlertTriangle, CheckCircle } from 'lucide-react'
import ChartCard from '../components/ChartCard'
import StatCard from '../components/StatCard'
import { patientForecastData, weeklyDistribution } from '../data/mockData'

export default function PatientForecast() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Patient Volume Forecast</h1>
        <p className="text-gray-500">ARIMA-based time series predictions</p>
      </div>

      {/* Forecast Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Next Month Forecast" 
          value="535" 
          change="5.2%" 
          trend="up"
          icon={TrendingUp} 
        />
        <StatCard 
          title="Peak Day Predicted" 
          value="Thursday" 
          icon={Calendar} 
        />
        <StatCard 
          title="Model Accuracy" 
          value="94.2%" 
          change="1.8%" 
          trend="up"
          icon={CheckCircle} 
        />
        <StatCard 
          title="Confidence Level" 
          value="95%" 
          icon={AlertTriangle} 
        />
      </div>

      {/* Main Forecast Chart */}
      <ChartCard 
        title="12-Month Patient Volume Forecast" 
        subtitle="Actual data (solid) vs Predicted (dashed) with 95% confidence interval"
      >
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={patientForecastData}>
            <defs>
              <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }} 
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="upper" 
              stroke="transparent" 
              fill="url(#confidenceGradient)"
              name="Upper Bound"
            />
            <Area 
              type="monotone" 
              dataKey="lower" 
              stroke="transparent" 
              fill="#ffffff"
              name="Lower Bound"
            />
            <Line 
              type="monotone" 
              dataKey="actual" 
              stroke="#1d4ed8" 
              strokeWidth={3}
              dot={{ fill: '#1d4ed8', r: 5 }}
              name="Actual"
            />
            <Line 
              type="monotone" 
              dataKey="predicted" 
              stroke="#60a5fa" 
              strokeWidth={2}
              strokeDasharray="8 4"
              dot={{ fill: '#60a5fa', r: 4 }}
              name="Predicted"
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Weekly Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard 
          title="Weekly Patient Distribution" 
          subtitle="Average patients per day of week"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="patients" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard 
          title="Wait Time by Day" 
          subtitle="Average wait time in minutes"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} unit=" min" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="avgWait" fill="#60a5fa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Forecast Methodology */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Forecast Methodology</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-primary-50 rounded-lg">
            <h4 className="font-medium text-primary-900">ARIMA Model</h4>
            <p className="text-sm text-primary-700 mt-2">
              Auto-Regressive Integrated Moving Average for time series forecasting
            </p>
          </div>
          <div className="p-4 bg-primary-50 rounded-lg">
            <h4 className="font-medium text-primary-900">Seasonal Decomposition</h4>
            <p className="text-sm text-primary-700 mt-2">
              Identifies weekly, monthly, and yearly patterns in patient visits
            </p>
          </div>
          <div className="p-4 bg-primary-50 rounded-lg">
            <h4 className="font-medium text-primary-900">Confidence Intervals</h4>
            <p className="text-sm text-primary-700 mt-2">
              95% confidence bounds for uncertainty quantification
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
