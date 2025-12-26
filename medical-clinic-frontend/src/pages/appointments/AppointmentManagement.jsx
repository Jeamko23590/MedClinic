import { useState } from 'react'
import { Calendar, Clock, User, Check, X, Search, Filter } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import ChartCard from '../../components/ChartCard'
import StatCard from '../../components/StatCard'

const initialAppointments = [
  { id: 1, patient: 'John Doe', doctor: 'Dr. Smith', doctorId: 1, date: '2025-12-26', time: '09:00 AM', status: 'pending', reason: 'Regular checkup', phone: '555-0101' },
  { id: 2, patient: 'Jane Wilson', doctor: 'Dr. Smith', doctorId: 1, date: '2025-12-26', time: '10:00 AM', status: 'confirmed', reason: 'Follow-up', phone: '555-0102' },
  { id: 3, patient: 'Mike Brown', doctor: 'Dr. Johnson', doctorId: 2, date: '2025-12-27', time: '02:00 PM', status: 'pending', reason: 'Heart consultation', phone: '555-0103' },
  { id: 4, patient: 'Sarah Davis', doctor: 'Dr. Williams', doctorId: 3, date: '2025-12-27', time: '03:30 PM', status: 'confirmed', reason: 'Child vaccination', phone: '555-0104' },
  { id: 5, patient: 'Tom Miller', doctor: 'Dr. Brown', doctorId: 4, date: '2025-12-28', time: '11:00 AM', status: 'pending', reason: 'Knee pain', phone: '555-0105' },
  { id: 6, patient: 'Emily Clark', doctor: 'Dr. Smith', doctorId: 1, date: '2025-12-28', time: '09:30 AM', status: 'cancelled', reason: 'Flu symptoms', phone: '555-0106' },
]

export default function AppointmentManagement() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState(initialAppointments)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')

  const canManageAll = user?.role === 'admin' || user?.role === 'staff'
  const isDoctor = user?.role === 'doctor'

  const getFilteredAppointments = () => {
    let filtered = appointments
    if (isDoctor) {
      filtered = filtered.filter(apt => apt.doctor === 'Dr. Smith')
    }
    if (searchTerm) {
      filtered = filtered.filter(apt => 
        apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctor.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter)
    }
    if (dateFilter) {
      filtered = filtered.filter(apt => apt.date === dateFilter)
    }
    return filtered
  }

  const updateStatus = (id, newStatus) => {
    setAppointments(appointments.map(apt =>
      apt.id === id ? { ...apt, status: newStatus } : apt
    ))
  }

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  }

  const filteredAppointments = getFilteredAppointments()

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: 'bg-green-100 text-green-700',
      pending: 'bg-amber-100 text-amber-700',
      cancelled: 'bg-gray-100 text-gray-500'
    }
    return styles[status] || styles.cancelled
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Appointment Management</h1>
        <p className="text-sm text-gray-500">
          {canManageAll ? 'Manage all clinic appointments' : 'Manage your appointments'}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Total" value={stats.total} icon={Calendar} />
        <StatCard title="Pending" value={stats.pending} icon={Clock} />
        <StatCard title="Confirmed" value={stats.confirmed} icon={Check} />
        <StatCard title="Cancelled" value={stats.cancelled} icon={X} />
      </div>

      <ChartCard title="Appointments" subtitle="Filter and manage appointments">
        <div className="flex flex-col gap-3 mb-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-3">
          {filteredAppointments.map((apt) => (
            <div key={apt.id} className="p-3 border border-gray-200 rounded-lg bg-white">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-900 text-sm">{apt.patient}</p>
                  <p className="text-xs text-gray-500">{apt.phone}</p>
                </div>
                <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadge(apt.status)}`}>
                  {apt.status}
                </span>
              </div>
              <div className="text-xs text-gray-600 space-y-1">
                <p><span className="text-gray-400">Date:</span> {apt.date} at {apt.time}</p>
                {canManageAll && <p><span className="text-gray-400">Doctor:</span> {apt.doctor}</p>}
                <p><span className="text-gray-400">Reason:</span> {apt.reason}</p>
              </div>
              {apt.status === 'pending' && (
                <div className="flex gap-2 mt-3 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => updateStatus(apt.id, 'confirmed')}
                    className="flex-1 py-1.5 text-xs bg-green-50 text-green-700 rounded-lg"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => updateStatus(apt.id, 'cancelled')}
                    className="flex-1 py-1.5 text-xs bg-red-50 text-red-700 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              )}
              {apt.status === 'confirmed' && (
                <div className="mt-3 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => updateStatus(apt.id, 'cancelled')}
                    className="w-full py-1.5 text-xs text-red-600 bg-red-50 rounded-lg"
                  >
                    Cancel Appointment
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Patient</th>
                {canManageAll && <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Doctor</th>}
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date & Time</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Reason</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900 text-sm">{apt.patient}</p>
                    <p className="text-xs text-gray-500">{apt.phone}</p>
                  </td>
                  {canManageAll && <td className="py-3 px-4 text-sm text-gray-600">{apt.doctor}</td>}
                  <td className="py-3 px-4">
                    <p className="text-sm text-gray-900">{apt.date}</p>
                    <p className="text-xs text-gray-500">{apt.time}</p>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{apt.reason}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(apt.status)}`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {apt.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(apt.id, 'confirmed')} className="p-1 text-green-600 hover:bg-green-50 rounded">
                          <Check className="w-5 h-5" />
                        </button>
                        <button onClick={() => updateStatus(apt.id, 'cancelled')} className="p-1 text-red-600 hover:bg-red-50 rounded">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                    {apt.status === 'confirmed' && (
                      <button onClick={() => updateStatus(apt.id, 'cancelled')} className="text-sm text-red-600">Cancel</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAppointments.length === 0 && (
          <p className="text-center py-8 text-gray-500 text-sm">No appointments found</p>
        )}
      </ChartCard>
    </div>
  )
}
