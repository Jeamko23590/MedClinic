import { useState, useEffect } from 'react'
import { Calendar, Clock, FileText, Heart, User, Bell } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ChartCard from '../../components/ChartCard'
import StatCard from '../../components/StatCard'
import api from '../../services/api'

const medicalHistory = [
  { id: 1, date: '2025-11-15', doctor: 'Dr. Smith', diagnosis: 'Annual checkup', notes: 'All vitals normal' },
  { id: 2, date: '2025-10-20', doctor: 'Dr. Johnson', diagnosis: 'Blood pressure monitoring', notes: 'Slightly elevated, follow-up recommended' },
  { id: 3, date: '2025-09-05', doctor: 'Dr. Williams', diagnosis: 'Flu symptoms', notes: 'Prescribed rest and fluids' },
]

const notifications = [
  { id: 1, message: 'Your appointment with Dr. Smith is confirmed for Dec 28', time: '2 hours ago', read: false },
  { id: 2, message: 'Lab results are ready for viewing', time: '1 day ago', read: false },
  { id: 3, message: 'Reminder: Annual checkup due next month', time: '3 days ago', read: true },
]

export default function PatientDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      // Fetch appointments for this patient
      const response = await api.get('/appointments', { params: { patient_id: user?.id || 4 } })
      setAppointments(response.data)
    } catch (err) {
      console.error('Failed to fetch appointments:', err)
    } finally {
      setLoading(false)
    }
  }

  const upcomingAppointments = appointments.filter(a => a.status !== 'cancelled' && a.status !== 'completed')
  const unreadNotifications = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
          <p className="text-gray-500">Manage your health and appointments</p>
        </div>
        <Link
          to="/appointments/book"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
        >
          Book Appointment
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Upcoming Appointments" value={upcomingAppointments.length} icon={Calendar} />
        <StatCard title="Completed Visits" value={appointments.filter(a => a.status === 'completed').length} icon={FileText} />
        <StatCard title="Prescriptions" value="3" icon={Heart} />
        <StatCard title="Unread Notifications" value={unreadNotifications} icon={Bell} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Upcoming Appointments" subtitle="Your scheduled visits">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No upcoming appointments</p>
                <Link to="/appointments/book" className="text-primary-600 hover:text-primary-700 text-sm">
                  Book an appointment →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{apt.doctor}</p>
                        <p className="text-sm text-gray-500">{apt.reason || 'Consultation'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{apt.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{apt.time}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full ${
                      apt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                ))}
                <Link
                  to="/appointments/book"
                  className="block text-center py-3 text-primary-600 hover:text-primary-700 font-medium"
                >
                  View All Appointments →
                </Link>
              </div>
            )}
          </ChartCard>
        </div>

        <div>
          <ChartCard title="Notifications" subtitle="Recent updates">
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  className={`p-3 rounded-lg ${notif.read ? 'bg-gray-50' : 'bg-blue-50 border border-blue-100'}`}
                >
                  <p className={`text-sm ${notif.read ? 'text-gray-600' : 'text-gray-900'}`}>
                    {notif.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>

      <ChartCard title="Recent Medical History" subtitle="Your past visits and diagnoses">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Doctor</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Diagnosis</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Notes</th>
              </tr>
            </thead>
            <tbody>
              {medicalHistory.map((record) => (
                <tr key={record.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-600">{record.date}</td>
                  <td className="py-3 px-4 text-gray-900">{record.doctor}</td>
                  <td className="py-3 px-4 text-gray-600">{record.diagnosis}</td>
                  <td className="py-3 px-4 text-gray-500 text-sm">{record.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  )
}
