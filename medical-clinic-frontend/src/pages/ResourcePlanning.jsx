import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, Cell, PieChart, Pie, Legend 
} from 'recharts'
import { Activity, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import ChartCard from '../components/ChartCard'
import StatCard from '../components/StatCard'
import { resourceUtilization } from '../data/mockData'

const utilizationColors = {
  low: '#22c55e',
  optimal: '#3b82f6',
  high: '#f59e0b',
  critical: '#ef4444'
}

const getUtilizationColor = (value, optimal) => {
  if (value < optimal - 15) return utilizationColors.low
  if (value <= optimal + 5) return utilizationColors.optimal
  if (value <= optimal + 15) return utilizationColors.high
  return utilizationColors.critical
}

const departmentData = [
  { name: 'General Practice', value: 35, color: '#3b82f6' },
  { name: 'Pediatrics', value: 20, color: '#60a5fa' },
  { name: 'Cardiology', value: 18, color: '#93c5fd' },
  { name: 'Orthopedics', value: 15, color: '#bfdbfe' },
  { name: 'Other', value: 12, color: '#dbeafe' },
]

export default function ResourcePlanning() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Resource Planning</h1>
        <p className="text-gray-500">Optimize clinic resources based on predictions</p>
      </div>

      {/* Resource Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Overall Utilization" 
          value="76%" 
          change="3%" 
          trend="up"
          icon={Activity} 
        />
        <StatCard 
          title="Bottlenecks" 
          value="1" 
          icon={AlertCircle} 
        />
        <StatCard 
          title="Optimal Resources" 
          value="3/4" 
          icon={CheckCircle} 
        />
        <StatCard 
          title="Avg Turnaround" 
          value="24 min" 
          change="8%" 
          trend="down"
          icon={Clock} 
        />
      </div>

      {/* Resource Utilization Chart */}
      <ChartCard 
        title="Resource Utilization vs Optimal" 
        subtitle="Current utilization compared to optimal levels"
      >
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={resourceUtilization} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" domain={[0, 100]} unit="%" stroke="#6b7280" fontSize={12} />
            <YAxis type="category" dataKey="resource" stroke="#6b7280" fontSize={12} width={100} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }}
              formatter={(value, name) => [`${value}%`, name === 'current' ? 'Current' : 'Optimal']}
            />
            <Bar dataKey="current" name="Current" radius={[0, 4, 4, 0]}>
              {resourceUtilization.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={getUtilizationColor(entry.current, entry.optimal)} 
                />
              ))}
            </Bar>
            <Bar dataKey="optimal" fill="#94a3b8" name="Optimal" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <ChartCard 
          title="Patient Distribution by Department" 
          subtitle="Current allocation of patient visits"
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value) => [`${value}%`, 'Share']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Resource Details */}
        <ChartCard 
          title="Resource Capacity Details" 
          subtitle="Current status and recommendations"
        >
          <div className="space-y-4">
            {resourceUtilization.map((resource) => {
              const status = resource.current > resource.optimal + 5 
                ? 'warning' 
                : resource.current < resource.optimal - 10 
                ? 'underutilized' 
                : 'optimal'
              
              return (
                <div key={resource.resource} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900">{resource.resource}</h4>
                      <p className="text-sm text-gray-500">Capacity: {resource.capacity} units</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      status === 'warning' 
                        ? 'bg-amber-100 text-amber-700'
                        : status === 'underutilized'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {status === 'warning' ? 'High Load' : status === 'underutilized' ? 'Available' : 'Optimal'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all"
                      style={{ 
                        width: `${resource.current}%`,
                        backgroundColor: getUtilizationColor(resource.current, resource.optimal)
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>Current: {resource.current}%</span>
                    <span>Target: {resource.optimal}%</span>
                  </div>
                </div>
              )
            })}
          </div>
        </ChartCard>
      </div>
    </div>
  )
}
