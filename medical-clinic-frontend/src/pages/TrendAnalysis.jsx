import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts'
import { TrendingUp, TrendingDown, Activity, AlertTriangle } from 'lucide-react'
import ChartCard from '../components/ChartCard'
import StatCard from '../components/StatCard'
import { diseasesTrend, waitTimeTrend } from '../data/mockData'

const seasonalPatterns = [
  { month: 'Jan', flu: 85, allergies: 20, injuries: 45 },
  { month: 'Feb', flu: 75, allergies: 25, injuries: 42 },
  { month: 'Mar', flu: 45, allergies: 55, injuries: 48 },
  { month: 'Apr', flu: 25, allergies: 80, injuries: 55 },
  { month: 'May', flu: 15, allergies: 90, injuries: 65 },
  { month: 'Jun', flu: 10, allergies: 70, injuries: 75 },
  { month: 'Jul', flu: 8, allergies: 50, injuries: 85 },
  { month: 'Aug', flu: 10, allergies: 45, injuries: 80 },
  { month: 'Sep', flu: 20, allergies: 60, injuries: 60 },
  { month: 'Oct', flu: 35, allergies: 40, injuries: 50 },
  { month: 'Nov', flu: 55, allergies: 25, injuries: 45 },
  { month: 'Dec', flu: 70, allergies: 15, injuries: 40 },
]

export default function TrendAnalysis() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Trend Analysis</h1>
        <p className="text-gray-500">Historical patterns and seasonal insights</p>
      </div>

      {/* Trend Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Respiratory Cases" 
          value="-23%" 
          change="vs last month" 
          trend="down"
          icon={TrendingDown} 
        />
        <StatCard 
          title="Cardiovascular" 
          value="+8%" 
          change="vs last month" 
          trend="up"
          icon={TrendingUp} 
        />
        <StatCard 
          title="Diabetes Visits" 
          value="+12%" 
          change="vs last month" 
          trend="up"
          icon={Activity} 
        />
        <StatCard 
          title="Seasonal Alert" 
          value="Flu Season" 
          icon={AlertTriangle} 
        />
      </div>

      {/* Disease Category Trends */}
      <ChartCard 
        title="Disease Category Trends" 
        subtitle="6-month trend analysis by condition type"
      >
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={diseasesTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }} 
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="respiratory" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Respiratory"
            />
            <Line 
              type="monotone" 
              dataKey="cardiovascular" 
              stroke="#ef4444" 
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Cardiovascular"
            />
            <Line 
              type="monotone" 
              dataKey="diabetes" 
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Diabetes"
            />
            <Line 
              type="monotone" 
              dataKey="orthopedic" 
              stroke="#22c55e" 
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Orthopedic"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Seasonal Patterns */}
        <ChartCard 
          title="Seasonal Patterns" 
          subtitle="Annual cycle of common conditions"
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={seasonalPatterns}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="flu" 
                stackId="1"
                stroke="#3b82f6" 
                fill="#93c5fd"
                name="Flu/Cold"
              />
              <Area 
                type="monotone" 
                dataKey="allergies" 
                stackId="1"
                stroke="#22c55e" 
                fill="#86efac"
                name="Allergies"
              />
              <Area 
                type="monotone" 
                dataKey="injuries" 
                stackId="1"
                stroke="#f59e0b" 
                fill="#fcd34d"
                name="Injuries"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Wait Time Impact */}
        <ChartCard 
          title="Wait Time Reduction Impact" 
          subtitle="Before vs after predictive analytics implementation"
        >
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={waitTimeTrend}>
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
              <Legend />
              <Area 
                type="monotone" 
                dataKey="before" 
                stroke="#94a3b8" 
                fill="#e2e8f0"
                name="Before Analytics"
              />
              <Area 
                type="monotone" 
                dataKey="after" 
                stroke="#3b82f6" 
                fill="#93c5fd"
                name="After Analytics"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Key Insights */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Trend Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="font-medium text-blue-900">Respiratory Decline</h4>
            <p className="text-sm text-blue-700 mt-2">
              Respiratory cases dropping as winter ends. Expect 40% reduction by May.
            </p>
          </div>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
            <h4 className="font-medium text-amber-900">Diabetes Rising</h4>
            <p className="text-sm text-amber-700 mt-2">
              Steady 3% monthly increase in diabetes-related visits. Consider expanding endocrinology.
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <h4 className="font-medium text-green-900">Wait Time Success</h4>
            <p className="text-sm text-green-700 mt-2">
              54% reduction in average wait time since implementing predictive scheduling.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
