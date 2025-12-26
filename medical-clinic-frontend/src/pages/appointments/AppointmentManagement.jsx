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

  // Filter appointments based on role
  const getFilteredAppointments = () => {
    let filtered = appointments

    // Doctors only see their own appointments
    if (isDoctor) {
      filtered = filtered.filter(apt => apt.doctor === 'Dr. Smith') // Mock: assume logged in doctor is Dr. Smith
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(apt => 
        apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.doctor.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter)
    }

    // Apply date filter
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

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Appointment Management</h1>
        <p className="text-sm sm:text-base text-gray-500">
          {canManageAll ? 'Manage all clinic appointments' : 'Manage your appointments'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Total" value={stats.total} icon={Calendar} />
        <StatCard title="Pending" value={stats.pending} icon={Clock} />
        <StatCard title="Confirmed" value={stats.confirmed} icon={Check} />
        <StatCard title="Cancelled" value={stats.cancelled} icon={X} />
      </div>

      {/* Filters */}
      <ChartCard title="Appointments" subtitle="Filter and manage appointments">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patient or doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2 sm:gap-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
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
              className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
            />
          </div>
        </div>

        {/* Appointments Table */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">Patient</th>
                {canManageAll && <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 hidden sm:table-cell">Doctor</th>}
                <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">Date & Time</th>
                <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 hidden md:table-cell">Reason</th>
                <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAppointments.map((apt) => (
                <tr key={apt.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-3 sm:px-4">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{apt.patient}</p>
                      <p className="text-xs text-gray-500">{apt.phone}</p>
                    </div>
                  </td>
                  {canManageAll && (
                    <td className="py-3 px-3 sm:px-4 text-gray-600 text-sm hidden sm:table-cell">{apt.doctor}</td>
                  )}
                  <td className="py-3 px-3 sm:px-4">
                    <div className="text-xs sm:text-sm">
                      <p className="text-gray-900">{apt.date}</p>
                      <p className="text-gray-500">{apt.time}</p>
                    </div>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-600 hidden md:table-cell">{apt.reason}</td>
                  <td className="py-3 px-3 sm:px-4">
                    <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                      apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      apt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 sm:px-4">
                    {apt.status === 'pending' && (
                      <div className="flex gap-1 sm:gap-2">
                        <button
                          onClick={() => updateStatus(apt.id, 'confirmed')}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Confirm"
                        >
                          <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                          onClick={() => updateStatus(apt.id, 'cancelled')}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Cancel"
                        >
                          <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    )}
                    {apt.status === 'confirmed' && (
                      <button
                        onClick={() => updateStatus(apt.id, 'cancelled')}
                        className="text-xs sm:text-sm text-red-600 hover:text-red-700"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAppointments.length === 0 && (
            <p className="text-center py-8 text-gray-500 text-sm">No appointments found</p>
          )}
        </div>
      </ChartCard>
    </div>
  )
}
