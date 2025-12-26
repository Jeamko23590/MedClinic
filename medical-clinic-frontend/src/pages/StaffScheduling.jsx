import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart, Area
} from 'recharts'
import { Users, Clock, Calendar, CheckCircle } from 'lucide-react'
import ChartCard from '../components/ChartCard'
import StatCard from '../components/StatCard'
import { staffScheduleData } from '../data/mockData'

const weeklySchedule = [
  { day: 'Mon', morning: 8, afternoon: 10, evening: 4, predicted: 85 },
  { day: 'Tue', morning: 9, afternoon: 11, evening: 5, predicted: 92 },
  { day: 'Wed', morning: 7, afternoon: 9, evening: 3, predicted: 78 },
  { day: 'Thu', morning: 10, afternoon: 12, evening: 5, predicted: 95 },
  { day: 'Fri', morning: 8, afternoon: 10, evening: 4, predicted: 88 },
  { day: 'Sat', morning: 5, afternoon: 4, evening: 0, predicted: 45 },
  { day: 'Sun', morning: 3, afternoon: 2, evening: 0, predicted: 25 },
]

const staffEfficiency = [
  { name: 'Dr. Smith', efficiency: 94, patients: 28, satisfaction: 4.8 },
  { name: 'Dr. Johnson', efficiency: 91, patients: 25, satisfaction: 4.7 },
  { name: 'Dr. Williams', efficiency: 88, patients: 24, satisfaction: 4.9 },
  { name: 'Dr. Brown', efficiency: 92, patients: 26, satisfaction: 4.6 },
  { name: 'Dr. Davis', efficiency: 89, patients: 23, satisfaction: 4.8 },
]

export default function StaffScheduling() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Staff Scheduling</h1>
        <p className="text-gray-500">Optimize staff allocation based on patient forecasts</p>
      </div>

      {/* Scheduling Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Staff on Duty" 
          value="24" 
          icon={Users} 
        />
        <StatCard 
          title="Coverage Score" 
          value="92%" 
          change="5%" 
          trend="up"
          icon={CheckCircle} 
        />
        <StatCard 
          title="Avg Shift Length" 
          value="8.2 hrs" 
          icon={Clock} 
        />
        <StatCard 
          title="Schedule Efficiency" 
          value="89%" 
          change="3%" 
          trend="up"
          icon={Calendar} 
        />
      </div>

      {/* Hourly Staff Requirements */}
      <ChartCard 
        title="Hourly Staff Requirements vs Scheduled" 
        subtitle="Predicted patient load and staffing alignment"
      >
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={staffScheduleData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="hour" stroke="#6b7280" fontSize={12} />
            <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} />
            <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px'
              }} 
            />
            <Legend />
            <Bar 
              yAxisId="left"
              dataKey="required" 
              fill="#3b82f6" 
              name="Required Staff"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              yAxisId="left"
              dataKey="scheduled" 
              fill="#93c5fd" 
              name="Scheduled Staff"
              radius={[4, 4, 0, 0]}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="patients" 
              stroke="#f59e0b" 
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Expected Patients"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Schedule Overview */}
        <ChartCard 
          title="Weekly Staff Distribution" 
          subtitle="Staff allocation by shift"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklySchedule}>
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
              <Legend />
              <Bar dataKey="morning" stackId="a" fill="#3b82f6" name="Morning" />
              <Bar dataKey="afternoon" stackId="a" fill="#60a5fa" name="Afternoon" />
              <Bar dataKey="evening" stackId="a" fill="#93c5fd" name="Evening" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Staff Efficiency */}
        <ChartCard 
          title="Staff Performance" 
          subtitle="Efficiency and patient satisfaction"
        >
          <div className="space-y-3">
            {staffEfficiency.map((staff) => (
              <div key={staff.name} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{staff.name}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">{staff.patients} patients/day</span>
                    <span className="text-amber-600">★ {staff.satisfaction}</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-primary-500 transition-all"
                    style={{ width: `${staff.efficiency}%` }}
                  />
                </div>
                <div className="text-right text-xs text-gray-500 mt-1">
                  {staff.efficiency}% efficiency
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Scheduling Recommendations */}
      <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheduling Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <h4 className="font-medium text-amber-900">Peak Hour Alert</h4>
                <p className="text-sm text-amber-700 mt-1">
                  Add 2 staff members between 9-11 AM and 2-4 PM to meet predicted demand.
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-green-900">Optimal Coverage</h4>
                <p className="text-sm text-green-700 mt-1">
                  Weekend staffing is well-aligned with predicted patient volume.
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900">Thursday Surge</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Thursday shows highest patient volume. Consider flexible scheduling.
                </p>
              </div>
            </div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-purple-900">Next Week Forecast</h4>
                <p className="text-sm text-purple-700 mt-1">
                  Expected 8% increase in patient volume. Pre-approve overtime requests.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
