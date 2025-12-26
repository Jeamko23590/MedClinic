import { useState } from 'react'
import { Calendar, Clock, Lock, Unlock, Plus, Trash2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import ChartCard from '../../components/ChartCard'

const doctors = [
  { id: 1, name: 'Dr. Smith', specialty: 'General Practice' },
  { id: 2, name: 'Dr. Johnson', specialty: 'Cardiology' },
  { id: 3, name: 'Dr. Williams', specialty: 'Pediatrics' },
  { id: 4, name: 'Dr. Brown', specialty: 'Orthopedics' },
]

export default function ScheduleManagement() {
  const { user } = useAuth()
  const [selectedDoctor, setSelectedDoctor] = useState(user?.role === 'doctor' ? 1 : null)
  const [blockedDates, setBlockedDates] = useState({
    1: [
      { date: '2025-12-28', reason: 'Personal leave' },
      { date: '2025-12-29', reason: 'Conference' },
    ],
    2: [{ date: '2025-12-27', reason: 'Training' }],
    3: [],
    4: [
      { date: '2025-12-30', reason: 'Holiday' },
      { date: '2025-12-31', reason: 'Holiday' },
    ],
  })
  const [newBlockDate, setNewBlockDate] = useState('')
  const [newBlockReason, setNewBlockReason] = useState('')

  const canManageAll = user?.role === 'admin' || user?.role === 'staff'
  const isDoctor = user?.role === 'doctor'

  const addBlockedDate = () => {
    if (!selectedDoctor || !newBlockDate) return

    setBlockedDates(prev => ({
      ...prev,
      [selectedDoctor]: [
        ...(prev[selectedDoctor] || []),
        { date: newBlockDate, reason: newBlockReason || 'Unavailable' }
      ]
    }))
    setNewBlockDate('')
    setNewBlockReason('')
  }

  const removeBlockedDate = (doctorId, date) => {
    setBlockedDates(prev => ({
      ...prev,
      [doctorId]: prev[doctorId].filter(d => d.date !== date)
    }))
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Schedule Management</h1>
        <p className="text-sm sm:text-base text-gray-500">
          {canManageAll ? 'Manage doctor availability and blocked dates' : 'Manage your availability'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Doctor Selection (Admin/Staff only) */}
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
                    <p className="font-medium text-gray-900 text-sm">{doctor.name}</p>
                    <p className="text-xs text-gray-500">{doctor.specialty}</p>
                  </button>
                ))}
              </div>
            </ChartCard>
          </div>
        )}

        {/* Block Date Form */}
        <div className={canManageAll ? 'lg:col-span-2' : 'lg:col-span-3'}>
          {selectedDoctor && (
            <div className="space-y-4 sm:space-y-6">
              <ChartCard title="Block New Date" subtitle="Mark dates as unavailable">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={newBlockDate}
                      min={getMinDate()}
                      onChange={(e) => setNewBlockDate(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                    <input
                      type="text"
                      value={newBlockReason}
                      onChange={(e) => setNewBlockReason(e.target.value)}
                      placeholder="e.g., Personal leave"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={addBlockedDate}
                      disabled={!newBlockDate}
                      className="w-full sm:w-auto px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                    >
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                      Block Date
                    </button>
                  </div>
                </div>
              </ChartCard>

              {/* Blocked Dates List */}
              <ChartCard 
                title="Blocked Dates" 
                subtitle={`Currently blocked dates for ${doctors.find(d => d.id === selectedDoctor)?.name}`}
              >
                {blockedDates[selectedDoctor]?.length > 0 ? (
                  <div className="space-y-3">
                    {blockedDates[selectedDoctor].map((block, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between p-3 sm:p-4 bg-red-50 border border-red-100 rounded-lg"
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 text-sm">{block.date}</p>
                            <p className="text-xs text-gray-500 truncate">{block.reason}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeBlockedDate(selectedDoctor, block.date)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Unlock className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No blocked dates</p>
                    <p className="text-xs text-gray-400">All dates are available for appointments</p>
                  </div>
                )}
              </ChartCard>
            </div>
          )}

          {!selectedDoctor && canManageAll && (
            <div className="bg-gray-50 rounded-xl p-6 sm:p-8 text-center">
              <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Select a doctor to manage their schedule</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
