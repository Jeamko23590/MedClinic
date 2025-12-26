import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
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
  Package,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
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
  const location = useLocation()
  
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  const navItems = navConfig[user?.role] || []

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Close mobile sidebar on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const toggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="min-h-screen flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed h-full flex flex-col bg-white border-r border-gray-200 z-50
        transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
        w-64
      `}>
        {/* Header */}
        <div className="p-4 lg:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'lg:justify-center' : ''}`}>
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
              <div className={`${sidebarCollapsed ? 'lg:hidden' : ''}`}>
                <h1 className="font-bold text-gray-900">MedClinic</h1>
                <p className="text-xs text-gray-500">Analytics Platform</p>
              </div>
            </div>
            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item, index) => (
            item.divider ? (
              <div key={index} className={`pt-4 pb-2 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
                <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {item.label}
                </p>
              </div>
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                title={sidebarCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    sidebarCollapsed ? 'lg:justify-center lg:px-2' : ''
                  } ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className={`${sidebarCollapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
              </NavLink>
            )
          ))}
        </nav>

        {/* Collapse toggle button - desktop only */}
        <div className="hidden lg:block px-4 py-2 border-t border-gray-200">
          <button
            onClick={toggleCollapse}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-gray-200">
          <div className={`flex items-center gap-3 mb-3 ${sidebarCollapsed ? 'lg:justify-center' : ''}`}>
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div className={`flex-1 min-w-0 ${sidebarCollapsed ? 'lg:hidden' : ''}`}>
              <p className="font-medium text-gray-900 truncate">{user?.name}</p>
              <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${roleColors[user?.role]}`}>
                {roleLabels[user?.role]}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title={sidebarCollapsed ? 'Sign Out' : undefined}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition ${
              sidebarCollapsed ? 'lg:px-2' : ''
            }`}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span className={`${sidebarCollapsed ? 'lg:hidden' : ''}`}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`
        flex-1 min-h-screen bg-gray-50 transition-all duration-300
        ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
        ml-0
      `}>
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
              aria-label="Toggle navigation"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">MedClinic</span>
            </div>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
