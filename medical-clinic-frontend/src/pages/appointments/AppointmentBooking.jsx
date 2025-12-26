import { useState } from 'react'
import { Calendar, Clock, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { NotificationModal, ConfirmModal } from '../../components/Modal'
import { useNotification, useConfirm } from '../../hooks/useNotification'
import ChartCard from '../../components/ChartCard'
import DatePicker from '../../components/DatePicker'

const doctors = [
  { id: 1, name: 'Dr. Smith', specialty: 'General Practice', avatar: 'S' },
  { id: 2, name: 'Dr. Johnson', specialty: 'Cardiology', avatar: 'J' },
  { id: 3, name: 'Dr. Williams', specialty: 'Pediatrics', avatar: 'W' },
  { id: 4, name: 'Dr. Brown', specialty: 'Orthopedics', avatar: 'B' },
]

const timeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
]

const blockedDates = {
  1: ['2025-12-28', '2025-12-29', '2025-12-31'],
  2: ['2025-12-27', '2025-12-30'],
  3: ['2025-12-26'],
  4: ['2025-12-30', '2025-12-31', '2026-01-01'],
}

const bookedSlots = {
  '2025-12-27-1': ['09:00 AM', '10:00 AM'],
  '2025-12-28-2': ['02:00 PM'],
  '2025-12-26-3': ['09:30 AM', '11:00 AM'],
}

export default function AppointmentBooking() {
  const { user } = useAuth()
  const { notification, closeNotification, success, error } = useNotification()
  const { confirm, showConfirm, closeConfirm } = useConfirm()
  
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [reason, setReason] = useState('')
  const [appointments, setAppointments] = useState([
    { id: 1, doctor: 'Dr. Smith', date: '2025-12-26', time: '10:00 AM', status: 'confirmed', reason: 'Regular checkup' },
    { id: 2, doctor: 'Dr. Johnson', date: '2025-12-30', time: '02:30 PM', status: 'pending', reason: 'Heart consultation' },
  ])

  const isSlotBooked = (date, doctorId, time) => {
    const key = `${date}-${doctorId}`
    return bookedSlots[key]?.includes(time)
  }

  const getAvailableSlots = () => {
    if (!selectedDoctor || !selectedDate) return timeSlots
    return timeSlots.filter(slot => !isSlotBooked(selectedDate, selectedDoctor.id, slot))
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setSelectedTime('')
  }

  const handleBookAppointment = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      error('Missing Information', 'Please select a doctor, date, and time slot')
      return
    }
    
    const newAppointment = {
      id: appointments.length + 1,
      doctor: selectedDoctor.name,
      date: selectedDate,
      time: selectedTime,
      status: 'pending',
      reason: reason
    }
    
    setAppointments([...appointments, newAppointment])
    success('Appointment Booked', `Your appointment with ${selectedDoctor.name} on ${selectedDate} at ${selectedTime} has been submitted for confirmation.`)
    setSelectedDoctor(null)
    setSelectedDate('')
    setSelectedTime('')
    setReason('')
  }

  const cancelAppointment = (apt) => {
    showConfirm(
      'Cancel Appointment',
      `Are you sure you want to cancel your appointment with ${apt.doctor} on ${apt.date}?`,
      () => {
        setAppointments(appointments.map(a => 
          a.id === apt.id ? { ...a, status: 'cancelled' } : a
        ))
        success('Appointment Cancelled', 'Your appointment has been cancelled successfully')
      },
      'error'
    )
  }

  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  const availableSlots = getAvailableSlots()

  return (
    <div className="space-y-6">
      <NotificationModal {...notification} onClose={closeNotification} />
      <ConfirmModal {...confirm} onClose={closeConfirm} onConfirm={confirm.onConfirm} />

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
        <p className="text-gray-500">Schedule your visit with our doctors</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Select Doctor */}
          <ChartCard title="1. Select Doctor" subtitle="Choose your preferred physician">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {doctors.map((doctor) => (
                <button
                  key={doctor.id}
                  onClick={() => {
                    setSelectedDoctor(doctor)
                    setSelectedDate('')
                    setSelectedTime('')
                  }}
                  className={`p-4 rounded-lg border-2 text-left transition ${
                    selectedDoctor?.id === doctor.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-primary-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-semibold">
                      {doctor.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{doctor.name}</p>
                      <p className="text-sm text-gray-500">{doctor.specialty}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ChartCard>

          {/* Select Date with Visual Calendar */}
          {selectedDoctor && (
            <ChartCard 
              title="2. Select Date" 
              subtitle={`Choose an available date for ${selectedDoctor.name}`}
            >
              <DatePicker
                selectedDate={selectedDate}
                onSelect={handleDateSelect}
                blockedDates={blockedDates[selectedDoctor.id] || []}
                minDate={getMinDate()}
              />
              {blockedDates[selectedDoctor.id]?.length > 0 && (
                <p className="mt-4 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                  ⚠️ Dates marked with red are unavailable for {selectedDoctor.name}
                </p>
              )}
            </ChartCard>
          )}

          {/* Select Time */}
          {selectedDate && (
            <ChartCard title="3. Select Time" subtitle="Available time slots">
              {availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {availableSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 rounded-lg border text-sm font-medium transition ${
                        selectedTime === time
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-primary-200'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No available slots for this date</p>
                  <p className="text-sm">Please select another date</p>
                </div>
              )}
            </ChartCard>
          )}

          {/* Reason */}
          {selectedTime && (
            <ChartCard title="4. Reason for Visit" subtitle="Brief description of your concern">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                placeholder="Describe your symptoms or reason for visit..."
              />
              
              {/* Summary */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Appointment Summary</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-500">Doctor:</span> {selectedDoctor.name}</p>
                  <p><span className="text-gray-500">Date:</span> {selectedDate}</p>
                  <p><span className="text-gray-500">Time:</span> {selectedTime}</p>
                  {reason && <p><span className="text-gray-500">Reason:</span> {reason}</p>}
                </div>
              </div>

              <button
                onClick={handleBookAppointment}
                className="mt-4 w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition"
              >
                Confirm Booking
              </button>
            </ChartCard>
          )}
        </div>

        {/* My Appointments */}
        <div>
          <ChartCard title="My Appointments" subtitle="Upcoming and past visits">
            <div className="space-y-3">
              {appointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No appointments yet</p>
                </div>
              ) : (
                appointments.map((apt) => (
                  <div key={apt.id} className={`p-4 rounded-lg border ${
                    apt.status === 'cancelled' ? 'bg-gray-50 border-gray-200 opacity-60' : 'bg-white border-gray-200'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-medium text-gray-900">{apt.doctor}</p>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        apt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        apt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> {apt.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {apt.time}
                      </span>
                    </div>
                    {apt.reason && <p className="text-sm text-gray-600 mt-2">{apt.reason}</p>}
                    {apt.status !== 'cancelled' && (
                      <button
                        onClick={() => cancelAppointment(apt)}
                        className="mt-3 text-sm text-red-600 hover:text-red-700"
                      >
                        Cancel Appointment
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </ChartCard>
        </div>
      </div>
    </div>
  )
}
