import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PatientForecast from './pages/PatientForecast'
import ResourcePlanning from './pages/ResourcePlanning'
import TrendAnalysis from './pages/TrendAnalysis'
import StaffScheduling from './pages/StaffScheduling'
import AppointmentBooking from './pages/appointments/AppointmentBooking'
import AppointmentManagement from './pages/appointments/AppointmentManagement'
import ScheduleManagement from './pages/appointments/ScheduleManagement'
import UserManagement from './pages/admin/UserManagement'
import PatientDashboard from './pages/patient/PatientDashboard'
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import POSSystem from './pages/pharmacy/POSSystem'
import InventoryManagement from './pages/pharmacy/InventoryManagement'

function RoleBasedHome() {
  const { user } = useAuth()
  
  if (!user) return <Navigate to="/login" />
  
  switch (user.role) {
    case 'patient':
      return <PatientDashboard />
    case 'doctor':
      return <DoctorDashboard />
    default:
      return <Dashboard />
  }
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<RoleBasedHome />} />
        
        {/* Analytics - Admin & Staff only */}
        <Route path="forecast" element={
          <ProtectedRoute allowedRoles={['admin', 'staff']}>
            <PatientForecast />
          </ProtectedRoute>
        } />
        <Route path="resources" element={
          <ProtectedRoute allowedRoles={['admin', 'staff']}>
            <ResourcePlanning />
          </ProtectedRoute>
        } />
        <Route path="trends" element={
          <ProtectedRoute allowedRoles={['admin', 'staff']}>
            <TrendAnalysis />
          </ProtectedRoute>
        } />
        <Route path="staff-scheduling" element={
          <ProtectedRoute allowedRoles={['admin', 'staff']}>
            <StaffScheduling />
          </ProtectedRoute>
        } />
        
        {/* Appointments */}
        <Route path="appointments/book" element={
          <ProtectedRoute allowedRoles={['patient']}>
            <AppointmentBooking />
          </ProtectedRoute>
        } />
        <Route path="appointments" element={
          <ProtectedRoute allowedRoles={['admin', 'staff', 'doctor']}>
            <AppointmentManagement />
          </ProtectedRoute>
        } />
        <Route path="schedule" element={
          <ProtectedRoute allowedRoles={['admin', 'staff', 'doctor']}>
            <ScheduleManagement />
          </ProtectedRoute>
        } />
        
        {/* Pharmacy - Admin & Staff */}
        <Route path="pos" element={
          <ProtectedRoute allowedRoles={['admin', 'staff']}>
            <POSSystem />
          </ProtectedRoute>
        } />
        <Route path="inventory" element={
          <ProtectedRoute allowedRoles={['admin', 'staff']}>
            <InventoryManagement />
          </ProtectedRoute>
        } />
        
        {/* Admin only */}
        <Route path="users" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserManagement />
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
