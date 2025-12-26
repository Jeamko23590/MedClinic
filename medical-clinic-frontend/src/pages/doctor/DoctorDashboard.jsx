import { useState, useEffect } from 'react'
import { Calendar, Clock, Users, CheckCircle, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useAuth } from '../../context/AuthContext'
import ChartCard from '../../components/ChartCard'
import StatCard from '../../components/StatCard'
import api from '../../services/api'

const weeklyPatients = [
  { day: 'Mon', patients: 12 },
  { day: 'Tue', patients: 15 },
  { day: 'Wed', patients: 10 },
  { day: 'Thu', patients: 18 },
  { day: 'Fri', patients: 14 },
  { day: 'Sat', patients: 6 },
]

const statusColors = {
  completed: 'bg-green-100 text-green-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-amber-100 text-amber-700',
  scheduled: 'bg-gray-100 text-gray-600',
}

export default function DoctorDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      // Fetch appointments for this doctor (doctor_id = 1 for Dr. Smith)
      const response = await api.get('/appointments', { params: { doctor_id: 1 } })
      setAppointments(response.data)
    } catch (err) {
      console.error('Failed to fetch appointments:', err)
    } finally {
      setLoading(false)
    }
  }

  const todayStr = new Date().toISOString().split('T')[0]
  const todayAppointments = appointments.filter(a => a.date === todayStr)

  const stats = {
    todayTotal: todayAppointments.length,
    completed: todayAppointments.filter(a => a.status === 'completed').length,
    pending: todayAppointments.filter(a => a.status !== 'completed').length,
    weeklyTotal: weeklyPatients.reduce((sum, d) => sum + d.patients, 0),
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading...</div></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <p className="text-gray-500">Here's your schedule for today</p>
        </div>
        <Link
          to="/schedule"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
        >
          Manage Schedule
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Today's Appointments" value={stats.todayTotal} icon={Calendar} />
        <StatCard title="Completed" value={stats.completed} icon={CheckCircle} />
        <StatCard title="Remaining" value={stats.pending} icon={Clock} />
        <StatCard title="This Week" value={appointments.length} icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Today's Schedule" subtitle="Your appointments for today">
            <div className="space-y-3">
              {todayAppointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No appointments today</p>
                </div>
              ) : (
                todayAppointments.map((apt) => (
                  <div 
                    key={apt.id} 
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-white"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center min-w-[60px]">
                        <p className="text-sm font-medium text-gray-900">{apt.time}</p>
                      </div>
                      <div className="h-10 w-px bg-gray-200"></div>
                      <div>
                        <p className="font-medium text-gray-900">{apt.patient}</p>
                        <p className="text-sm text-gray-500">{apt.reason}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full capitalize ${statusColors[apt.status] || 'bg-gray-100 text-gray-600'}`}>
                      {apt.status}
                    </span>
                  </div>
                ))
              )}
            </div>
            <Link
              to="/appointments"
              className="block text-center py-3 mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              View All Appointments →
            </Link>
          </ChartCard>
        </div>

        <div>
          <ChartCard title="Weekly Overview" subtitle="Patients seen this week">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={weeklyPatients}>
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
                <Line 
                  type="monotone" 
                  dataKey="patients" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="mt-6 space-y-3">
            <Link
              to="/appointments"
              className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-200 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Manage Appointments</p>
                  <p className="text-sm text-gray-500">View and update patient appointments</p>
                </div>
              </div>
            </Link>
            <Link
              to="/schedule"
              className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-200 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Block Dates</p>
                  <p className="text-sm text-gray-500">Set unavailable dates</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
