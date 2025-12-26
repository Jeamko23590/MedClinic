import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  LayoutDashboard, 
  TrendingUp, 
  Calendar, 
  Activity,
  Stethoscope,
  Users,
  CalendarPlus,
  CalendarClock,
  LogOut,
  User,
  ShoppingCart,
  Package
} from 'lucide-react'

const navConfig = {
  admin: [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { divider: true, label: 'Appointments' },
    { path: '/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/schedule', icon: CalendarClock, label: 'Schedule' },
    { divider: true, label: 'Pharmacy' },
    { path: '/pos', icon: ShoppingCart, label: 'Point of Sale' },
    { path: '/inventory', icon: Package, label: 'Inventory' },
    { divider: true, label: 'Management' },
    { path: '/users', icon: Users, label: 'User Management' },
    { divider: true, label: 'Analytics' },
    { path: '/forecast', icon: TrendingUp, label: 'Patient Forecast' },
    { path: '/resources', icon: Activity, label: 'Resources' },
    { path: '/trends', icon: TrendingUp, label: 'Trend Analysis' },
    { path: '/staff-scheduling', icon: Users, label: 'Staff Scheduling' },
  ],
  staff: [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { divider: true, label: 'Appointments' },
    { path: '/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/schedule', icon: CalendarClock, label: 'Schedule' },
    { divider: true, label: 'Pharmacy' },
    { path: '/pos', icon: ShoppingCart, label: 'Point of Sale' },
    { path: '/inventory', icon: Package, label: 'Inventory' },
    { divider: true, label: 'Analytics' },
    { path: '/forecast', icon: TrendingUp, label: 'Patient Forecast' },
    { path: '/resources', icon: Activity, label: 'Resources' },
    { path: '/trends', icon: TrendingUp, label: 'Trend Analysis' },
    { path: '/staff-scheduling', icon: Users, label: 'Staff Scheduling' },
  ],
  doctor: [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/appointments', icon: Calendar, label: 'My Appointments' },
    { path: '/schedule', icon: CalendarClock, label: 'My Schedule' },
  ],
  patient: [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/appointments/book', icon: CalendarPlus, label: 'Book Appointment' },
  ],
}

const roleLabels = {
  admin: 'Administrator',
  staff: 'Staff Member',
  doctor: 'Doctor',
  patient: 'Patient',
}

const roleColors = {
  admin: 'bg-purple-100 text-purple-700',
  staff: 'bg-green-100 text-green-700',
  doctor: 'bg-blue-100 text-blue-700',
  patient: 'bg-gray-100 text-gray-700',
}

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  const navItems = navConfig[user?.role] || []

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">MedClinic</h1>
              <p className="text-xs text-gray-500">Analytics Platform</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item, index) => (
            item.divider ? (
              <div key={index} className="pt-4 pb-2">
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {item.label}
                </p>
              </div>
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            )
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{user?.name}</p>
              <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${roleColors[user?.role]}`}>
                {roleLabels[user?.role]}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8 bg-gray-50 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
