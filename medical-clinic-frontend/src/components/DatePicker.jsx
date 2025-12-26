import { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function DatePicker({ selectedDate, onSelect, blockedDates = [], minDate }) {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())

  const minDateObj = minDate ? new Date(minDate) : today
  minDateObj.setHours(0, 0, 0, 0)

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay()
  }

  const formatDate = (day) => {
    const month = String(currentMonth + 1).padStart(2, '0')
    const dayStr = String(day).padStart(2, '0')
    return `${currentYear}-${month}-${dayStr}`
  }

  const isBlocked = (day) => {
    const dateStr = formatDate(day)
    return blockedDates.includes(dateStr)
  }

  const isPast = (day) => {
    const date = new Date(currentYear, currentMonth, day)
    date.setHours(0, 0, 0, 0)
    return date < minDateObj
  }

  const isToday = (day) => {
    return day === today.getDate() && 
           currentMonth === today.getMonth() && 
           currentYear === today.getFullYear()
  }

  const isSelected = (day) => {
    return selectedDate === formatDate(day)
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleSelectDate = (day) => {
    if (isBlocked(day) || isPast(day)) return
    onSelect(formatDate(day))
  }

  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
  const days = []

  // Empty cells for days before the first day of month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-10" />)
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const blocked = isBlocked(day)
    const past = isPast(day)
    const selected = isSelected(day)
    const todayDate = isToday(day)
    const disabled = blocked || past

    days.push(
      <button
        key={day}
        onClick={() => handleSelectDate(day)}
        disabled={disabled}
        className={`
          h-10 w-10 rounded-lg text-sm font-medium transition-all relative
          ${selected ? 'bg-primary-600 text-white' : ''}
          ${todayDate && !selected ? 'ring-2 ring-primary-300' : ''}
          ${blocked ? 'bg-red-100 text-red-400 cursor-not-allowed line-through' : ''}
          ${past && !blocked ? 'text-gray-300 cursor-not-allowed' : ''}
          ${!disabled && !selected ? 'hover:bg-primary-50 text-gray-700' : ''}
        `}
        title={blocked ? 'Doctor unavailable' : past ? 'Past date' : ''}
      >
        {day}
        {blocked && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <X className="w-3 h-3 text-white" />
          </span>
        )}
      </button>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h3 className="font-semibold text-gray-900">
          {MONTHS[currentMonth]} {currentYear}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map(day => (
          <div key={day} className="h-10 flex items-center justify-center text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary-600"></div>
          <span className="text-gray-600">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-100 relative">
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </div>
          <span className="text-gray-600">Unavailable</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded ring-2 ring-primary-300"></div>
          <span className="text-gray-600">Today</span>
        </div>
      </div>
    </div>
  )
}
