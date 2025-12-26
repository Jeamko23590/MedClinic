import { useState, useCallback } from 'react'

export function useNotification() {
  const [notification, setNotification] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
  })

  const showNotification = useCallback((type, title, message) => {
    setNotification({ isOpen: true, type, title, message })
  }, [])

  const closeNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, isOpen: false }))
  }, [])

  const success = useCallback((title, message) => showNotification('success', title, message), [showNotification])
  const error = useCallback((title, message) => showNotification('error', title, message), [showNotification])
  const warning = useCallback((title, message) => showNotification('warning', title, message), [showNotification])
  const info = useCallback((title, message) => showNotification('info', title, message), [showNotification])

  return {
    notification,
    closeNotification,
    success,
    error,
    warning,
    info,
  }
}

export function useConfirm() {
  const [confirm, setConfirm] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning',
    onConfirm: () => {},
  })

  const showConfirm = useCallback((title, message, onConfirm, type = 'warning') => {
    setConfirm({ isOpen: true, title, message, onConfirm, type })
  }, [])

  const closeConfirm = useCallback(() => {
    setConfirm(prev => ({ ...prev, isOpen: false }))
  }, [])

  return {
    confirm,
    showConfirm,
    closeConfirm,
  }
}
