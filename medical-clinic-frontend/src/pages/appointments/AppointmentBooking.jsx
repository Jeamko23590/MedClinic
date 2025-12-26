import { useState, useEffect } from 'react'
import { Calendar, Clock, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { NotificationModal, ConfirmModal } from '../../components/Modal'
import { useNotification, useConfirm } from '../../hooks/useNotification'
import ChartCard from '../../components/ChartCard'
import DatePicker from '../../components/DatePicker'
import api from '../../services/api'

export default function AppointmentBooking() {
  const { user } = useAuth()
  const { notification, closeNotification, success, error } = useNotification()
  const { confirm, showConfirm, closeConfirm } = useConfirm()
  
  const [doctors, setDoctors] = useState([])
  const [timeSlots, setTimeSlots] = useState([])
  const [blockedDates, setBlockedDates] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [reason, setReason] = useState('')
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    if (selectedDoctor) {
      fetchBlockedDates(selectedDoctor.id)
    }
  }, [selectedDoctor])

  const fetchInitialData = async () => {
    try {
      setLoading(true)
      const [doctorsRes, timeSlotsRes, appointmentsRes] = await Promise.all([
        api.get('/appointments/doctors'),
        api.get('/appointments/time-slots'),
        api.get('/appointments', { params: { patient_id: user?.id || 4 } })
      ])
      setDoctors(doctorsRes.data)
      setTimeSlots(timeSlotsRes.data)
      setAppointments(appointmentsRes.data)
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchBlockedDates = async (doctorId) => {
    try {
      const response = await api.get(`/appointments/blocked-dates/${doctorId}`)
      setBlockedDates(response.data.map(b => b.date))
    } catch (err) {
      console.error('Failed to fetch blocked dates:', err)
    }
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setSelectedTime('')
  }

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      error('Missing Information', 'Please select a doctor, date, and time slot')
      return
    }
    
    try {
      const response = await api.post('/appointments', {
        doctor_id: selectedDoctor.id,
        date: selectedDate,
        time: selectedTime,
        reason: reason,
        patient: user?.name || 'Patient',
        patient_id: user?.id || 4,
      })

      const newAppointment = {
        id: response.data.appointment.id,
        doctor: selectedDoctor.name,
        doctor_id: selectedDoctor.id,
        date: selectedDate,
        time: selectedTime,
        status: 'pending',
        reason: reason
      }
      
      setAppointments([...appointments, newAppointment])
      success('Appointment Booked', `Your appointment with ${selectedDoctor.name} on ${selectedDate} at ${selectedTime} has been submitted.`)
      setSelectedDoctor(null)
      setSelectedDate('')
      setSelectedTime('')
      setReason('')
    } catch (err) {
      error('Booking Failed', err.response?.data?.message || 'Failed to book appointment')
    }
  }

  const cancelAppointment = (apt) => {
    showConfirm(
      'Cancel Appointment',
      `Are you sure you want to cancel your appointment with ${apt.doctor} on ${apt.date}?`,
      async () => {
        try {
          await api.delete(`/appointments/${apt.id}`)
          setAppointments(appointments.filter(a => a.id !== apt.id))
          success('Appointment Cancelled', 'Your appointment has been cancelled successfully')
        } catch (err) {
          error('Error', 'Failed to cancel appointment')
        }
      },
      'error'
    )
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
      <ConfirmModal {...confirm} onClose={closeConfirm} onConfirm={confirm.onConfirm} />

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
        <p className="text-gray-500">Schedule your visit with our doctors</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
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
                      {doctor.name.charAt(4)}
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

          {selectedDoctor && (
            <ChartCard title="2. Select Date" subtitle={`Choose an available date for ${selectedDoctor.name}`}>
              <DatePicker
                selectedDate={selectedDate}
                onSelect={handleDateSelect}
                blockedDates={blockedDates}
                minDate={getMinDate()}
              />
              {blockedDates.length > 0 && (
                <p className="mt-4 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                  ⚠️ Dates marked with red are unavailable for {selectedDoctor.name}
                </p>
              )}
            </ChartCard>
          )}

          {selectedDate && (
            <ChartCard title="3. Select Time" subtitle="Available time slots">
              {timeSlots.length > 0 ? (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {timeSlots.map((time) => (
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
                  <p>No available slots</p>
                </div>
              )}
            </ChartCard>
          )}

          {selectedTime && (
            <ChartCard title="4. Reason for Visit" subtitle="Brief description of your concern">
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                placeholder="Describe your symptoms or reason for visit..."
              />
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
                  <div key={apt.id} className="p-4 rounded-lg border bg-white border-gray-200">
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
