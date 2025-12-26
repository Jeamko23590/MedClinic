import { useState, useEffect } from 'react'
import { Calendar, Clock, User, Check, X, Search, Filter } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import ChartCard from '../../components/ChartCard'
import StatCard from '../../components/StatCard'
import api from '../../services/api'

export default function AppointmentManagement() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')

  const canManageAll = user?.role === 'admin' || user?.role === 'staff'
  const isDoctor = user?.role === 'doctor'

  // Fetch appointments from API
  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const response = await api.get('/appointments')
      setAppointments(response.data)
    } catch (error) {
      console.error('Failed to fetch appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter appointments based on role
  const getFilteredAppointments = () => {
    let filtered = appointments

    // Doctors only see their own appointments
    if (isDoctor) {
      filtered = filtered.filter(apt => apt.doctor === 'Dr. Smith')
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

  const updateStatus = async (id, newStatus) => {
    try {
      if (newStatus === 'cancelled') {
        await api.delete(`/appointments/${id}`)
        setAppointments(appointments.filter(apt => apt.id !== id))
      } else {
        await api.put(`/appointments/${id}`, { status: newStatus })
        setAppointments(appointments.map(apt =>
          apt.id === id ? { ...apt, status: newStatus } : apt
        ))
      }
    } catch (error) {
      console.error('Failed to update appointment:', error)
      alert('Failed to update appointment. Please try again.')
    }
  }

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  }

  const filteredAppointments = getFilteredAppointments()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading appointments...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>
        <p className="text-gray-500">
          {canManageAll ? 'Manage all clinic appointments' : 'Manage your appointments'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total" value={stats.total} icon={Calendar} />
        <StatCard title="Pending" value={stats.pending} icon={Clock} />
        <StatCard title="Confirmed" value={stats.confirmed} icon={Check} />
        <StatCard title="Cancelled" value={stats.cancelled} icon={X} />
      </div>

      {/* Filters */}
      <ChartCard title="Appointments" subtitle="Filter and manage appointments">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patient or doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
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
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          />
        </div>

        {/* Appointments Table */}
        <div className="overflow-x-auto">
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
                    <div>
                      <p className="font-medium text-gray-900">{apt.patient}</p>
                      <p className="text-sm text-gray-500">{apt.phone}</p>
                    </div>
                  </td>
                  {canManageAll && (
                    <td className="py-3 px-4 text-gray-600">{apt.doctor}</td>
                  )}
                  <td className="py-3 px-4">
                    <div className="text-sm">
                      <p className="text-gray-900">{apt.date}</p>
                      <p className="text-gray-500">{apt.time}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{apt.reason}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      apt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {apt.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateStatus(apt.id, 'confirmed')}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Confirm"
                        >
                          <Check className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => updateStatus(apt.id, 'cancelled')}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Cancel"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                    {apt.status === 'confirmed' && (
                      <button
                        onClick={() => updateStatus(apt.id, 'cancelled')}
                        className="text-sm text-red-600 hover:text-red-700"
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
            <p className="text-center py-8 text-gray-500">No appointments found</p>
          )}
        </div>
      </ChartCard>
    </div>
  )
}
