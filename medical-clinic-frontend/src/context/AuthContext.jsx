import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    // Mock authentication - replace with real API call
    const mockUsers = {
      'admin@clinic.com': { id: 1, name: 'Admin User', email: 'admin@clinic.com', role: 'admin' },
      'doctor@clinic.com': { id: 2, name: 'Dr. Smith', email: 'doctor@clinic.com', role: 'doctor' },
      'staff@clinic.com': { id: 3, name: 'Jane Staff', email: 'staff@clinic.com', role: 'staff' },
      'patient@clinic.com': { id: 4, name: 'John Patient', email: 'patient@clinic.com', role: 'patient' },
    }

    const foundUser = mockUsers[email]
    if (foundUser && password === 'password123') {
      localStorage.setItem('user', JSON.stringify(foundUser))
      setUser(foundUser)
      return { success: true }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
