import { useState } from 'react'
import { Users, UserPlus, Edit, Trash2, Search, Shield, Stethoscope, User, Heart } from 'lucide-react'
import ChartCard from '../../components/ChartCard'
import StatCard from '../../components/StatCard'

const initialUsers = [
  { id: 1, name: 'Admin User', email: 'admin@clinic.com', role: 'admin', status: 'active', created: '2024-01-15' },
  { id: 2, name: 'Dr. Smith', email: 'doctor@clinic.com', role: 'doctor', status: 'active', created: '2024-02-20' },
  { id: 3, name: 'Dr. Johnson', email: 'johnson@clinic.com', role: 'doctor', status: 'active', created: '2024-03-10' },
  { id: 4, name: 'Jane Staff', email: 'staff@clinic.com', role: 'staff', status: 'active', created: '2024-04-05' },
  { id: 5, name: 'John Patient', email: 'patient@clinic.com', role: 'patient', status: 'active', created: '2024-05-12' },
  { id: 6, name: 'Sarah Wilson', email: 'sarah@email.com', role: 'patient', status: 'active', created: '2024-06-18' },
  { id: 7, name: 'Mike Brown', email: 'mike@email.com', role: 'patient', status: 'inactive', created: '2024-07-22' },
]

const roleIcons = {
  admin: Shield,
  doctor: Stethoscope,
  staff: User,
  patient: Heart,
}

const roleColors = {
  admin: 'bg-purple-100 text-purple-700',
  doctor: 'bg-blue-100 text-blue-700',
  staff: 'bg-green-100 text-green-700',
  patient: 'bg-gray-100 text-gray-700',
}

export default function UserManagement() {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', role: 'patient', status: 'active' })

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    doctors: users.filter(u => u.role === 'doctor').length,
    patients: users.filter(u => u.role === 'patient').length,
  }

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user)
      setFormData({ name: user.name, email: user.email, role: user.role, status: user.status })
    } else {
      setEditingUser(null)
      setFormData({ name: '', email: '', role: 'patient', status: 'active' })
    }
    setShowModal(true)
  }

  const saveUser = () => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u))
    } else {
      setUsers([...users, { id: users.length + 1, ...formData, created: new Date().toISOString().split('T')[0] }])
    }
    setShowModal(false)
  }

  const deleteUser = (id) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id))
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-sm sm:text-base text-gray-500">Manage clinic users and their roles</p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <StatCard title="Total Users" value={stats.total} icon={Users} />
        <StatCard title="Admins" value={stats.admins} icon={Shield} />
        <StatCard title="Doctors" value={stats.doctors} icon={Stethoscope} />
        <StatCard title="Patients" value={stats.patients} icon={Heart} />
      </div>

      {/* Users Table */}
      <ChartCard title="All Users" subtitle="Manage user accounts and permissions">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
              />
            </div>
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
            <option value="staff">Staff</option>
            <option value="patient">Patient</option>
          </select>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">User</th>
                <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">Role</th>
                <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-500 hidden sm:table-cell">Created</th>
                <th className="text-left py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const RoleIcon = roleIcons[user.role]
                return (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-3 sm:px-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${roleColors[user.role]}`}>
                          <RoleIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 sm:px-4">
                      <span className={`px-2 py-1 text-xs rounded-full capitalize ${roleColors[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 sm:px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">{user.created}</td>
                    <td className="py-3 px-3 sm:px-4">
                      <div className="flex gap-1 sm:gap-2">
                        <button
                          onClick={() => openModal(user)}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        >
                          <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </ChartCard>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="admin">Admin</option>
                  <option value="doctor">Doctor</option>
                  <option value="staff">Staff</option>
                  <option value="patient">Patient</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={saveUser}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
              >
                {editingUser ? 'Save Changes' : 'Add User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
