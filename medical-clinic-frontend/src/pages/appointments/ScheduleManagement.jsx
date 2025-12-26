import { useState, useEffect } from 'react'
import { Calendar, Clock, Lock, Unlock, Plus, Trash2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { NotificationModal } from '../../components/Modal'
import { useNotification } from '../../hooks/useNotification'
import ChartCard from '../../components/ChartCard'
import api from '../../services/api'

export default function ScheduleManagement() {
  const { user } = useAuth()
  const { notification, closeNotification, success, error } = useNotification()
  
  const [doctors, setDoctors] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [blockedDates, setBlockedDates] = useState([])
  const [newBlockDate, setNewBlockDate] = useState('')
  const [newBlockReason, setNewBlockReason] = useState('')
  const [loading, setLoading] = useState(true)

  const canManageAll = user?.role === 'admin' || user?.role === 'staff'
  const isDoctor = user?.role === 'doctor'

  useEffect(() => {
    fetchDoctors()
  }, [])

  useEffect(() => {
    if (selectedDoctor) {
      fetchBlockedDates(selectedDoctor)
    }
  }, [selectedDoctor])

  const fetchDoctors = async () => {
    try {
      setLoading(true)
      const response = await api.get('/appointments/doctors')
      setDoctors(response.data)
      if (isDoctor) {
        setSelectedDoctor(1) // Default to first doctor for doctor role
      }
    } catch (err) {
      console.error('Failed to fetch doctors:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchBlockedDates = async (doctorId) => {
    try {
      const response = await api.get(`/appointments/blocked-dates/${doctorId}`)
      setBlockedDates(response.data)
    } catch (err) {
      console.error('Failed to fetch blocked dates:', err)
    }
  }

  const addBlockedDate = async () => {
    if (!selectedDoctor || !newBlockDate) return

    try {
      await api.post('/appointments/block-date', {
        doctor_id: selectedDoctor,
        date: newBlockDate,
        reason: newBlockReason || 'Unavailable'
      })
      
      setBlockedDates([...blockedDates, { date: newBlockDate, reason: newBlockReason || 'Unavailable' }])
      setNewBlockDate('')
      setNewBlockReason('')
      success('Date Blocked', 'The date has been blocked successfully')
    } catch (err) {
      error('Error', 'Failed to block date')
    }
  }

  const removeBlockedDate = async (date) => {
    try {
      await api.post('/appointments/unblock-date', {
        doctor_id: selectedDoctor,
        date: date
      })
      
      setBlockedDates(blockedDates.filter(d => d.date !== date))
      success('Date Unblocked', 'The date is now available')
    } catch (err) {
      error('Error', 'Failed to unblock date')
    }
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading...</div></div>
  }

  return (
    <div className="space-y-6">
      <NotificationModal {...notification} onClose={closeNotification} />

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Schedule Management</h1>
        <p className="text-gray-500">
          {canManageAll ? 'Manage doctor availability and blocked dates' : 'Manage your availability'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {canManageAll && (
          <div className="lg:col-span-1">
            <ChartCard title="Select Doctor" subtitle="Choose doctor to manage">
              <div className="space-y-2">
                {doctors.map((doctor) => (
                  <button
                    key={doctor.id}
                    onClick={() => setSelectedDoctor(doctor.id)}
                    className={`w-full p-3 rounded-lg border text-left transition ${
                      selectedDoctor === doctor.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-200'
                    }`}
                  >
                    <p className="font-medium text-gray-900">{doctor.name}</p>
                    <p className="text-sm text-gray-500">{doctor.specialty}</p>
                  </button>
                ))}
              </div>
            </ChartCard>
          </div>
        )}

        <div className={canManageAll ? 'lg:col-span-2' : 'lg:col-span-3'}>
          {selectedDoctor && (
            <div className="space-y-6">
              <ChartCard title="Block New Date" subtitle="Mark dates as unavailable">
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={newBlockDate}
                      min={getMinDate()}
                      onChange={(e) => setNewBlockDate(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                    <input
                      type="text"
                      value={newBlockReason}
                      onChange={(e) => setNewBlockReason(e.target.value)}
                      placeholder="e.g., Personal leave, Conference"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={addBlockedDate}
                      disabled={!newBlockDate}
                      className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50 flex items-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Block Date
                    </button>
                  </div>
                </div>
              </ChartCard>

              <ChartCard 
                title="Blocked Dates" 
                subtitle={`Currently blocked dates for ${doctors.find(d => d.id === selectedDoctor)?.name}`}
              >
                {blockedDates.length > 0 ? (
                  <div className="space-y-3">
                    {blockedDates.map((block, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-4 bg-red-50 border border-red-100 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <Lock className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{block.date}</p>
                            <p className="text-sm text-gray-500">{block.reason}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeBlockedDate(block.date)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Unlock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No blocked dates</p>
                    <p className="text-sm text-gray-400">All dates are available for appointments</p>
                  </div>
                )}
              </ChartCard>
            </div>
          )}

          {!selectedDoctor && canManageAll && (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Select a doctor to manage their schedule</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
