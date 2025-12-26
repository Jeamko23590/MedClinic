import { Users, Clock, TrendingUp, Activity } from 'lucide-react'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area 
} from 'recharts'
import StatCard from '../components/StatCard'
import ChartCard from '../components/ChartCard'
import { patientForecastData, waitTimeTrend, insights } from '../data/mockData'

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Predictive analytics overview for your clinic</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Today's Patients" 
          value="127" 
          change="12%" 
          trend="up"
          icon={Users} 
        />
        <StatCard 
          title="Avg Wait Time" 
          value="18 min" 
          change="25%" 
          trend="down"
          icon={Clock} 
        />
        <StatCard 
          title="Forecast Accuracy" 
          value="94.2%" 
          change="2.1%" 
          trend="up"
          icon={TrendingUp} 
        />
        <StatCard 
          title="Resource Utilization" 
          value="76%" 
          change="5%" 
          trend="up"
          icon={Activity} 
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard 
          title="Patient Volume Forecast" 
          subtitle="ARIMA-based prediction with confidence interval"
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={patientForecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="upper" 
                stroke="transparent" 
                fill="#dbeafe" 
              />
              <Area 
                type="monotone" 
                dataKey="lower" 
                stroke="transparent" 
                fill="#ffffff" 
              />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#1d4ed8" 
                strokeWidth={2}
                dot={{ fill: '#1d4ed8', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#60a5fa" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#60a5fa', r: 4 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard 
          title="Wait Time Improvement" 
          subtitle="Before vs after predictive scheduling"
        >
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={waitTimeTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} unit=" min" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="before" 
                stroke="#94a3b8" 
                strokeWidth={2}
                name="Before"
              />
              <Line 
                type="monotone" 
                dataKey="after" 
                stroke="#2563eb" 
                strokeWidth={2}
                name="After"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Decision Insights */}
      <ChartCard title="Decision Insights" subtitle="AI-powered recommendations">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight) => (
            <div 
              key={insight.id}
              className={`p-4 rounded-lg border ${
                insight.type === 'warning' 
                  ? 'bg-amber-50 border-amber-200' 
                  : insight.type === 'success'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-blue-50 border-blue-200'
              }`}
            >
              <h4 className="font-semibold text-gray-900">{insight.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
              <button className="mt-3 text-sm font-medium text-primary-600 hover:text-primary-700">
                {insight.action} →
              </button>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  )
}
