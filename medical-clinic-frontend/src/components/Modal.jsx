import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react'

const icons = {
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
  error: XCircle,
}

const colors = {
  success: 'text-green-600 bg-green-100',
  warning: 'text-amber-600 bg-amber-100',
  info: 'text-blue-600 bg-blue-100',
  error: 'text-red-600 bg-red-100',
}

export function NotificationModal({ isOpen, onClose, type = 'info', title, message }) {
  if (!isOpen) return null

  const Icon = icons[type]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4 animate-in fade-in zoom-in duration-200">
        <div className="text-center">
          <div className={`w-16 h-16 rounded-full ${colors[type]} flex items-center justify-center mx-auto mb-4`}>
            <Icon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'warning' }) {
  if (!isOpen) return null

  const Icon = icons[type]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4">
        <div className="text-center">
          <div className={`w-16 h-16 rounded-full ${colors[type]} flex items-center justify-center mx-auto mb-4`}>
            <Icon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              {cancelText}
            </button>
            <button
              onClick={() => { onConfirm(); onClose(); }}
              className={`flex-1 px-4 py-2 rounded-lg transition ${
                type === 'error' ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FormModal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-60px)]">
          {children}
        </div>
      </div>
    </div>
  )
}
