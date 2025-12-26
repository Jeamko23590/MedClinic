import { useState } from 'react'
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, Banknote, Receipt, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { NotificationModal, ConfirmModal } from '../../components/Modal'
import { useNotification, useConfirm } from '../../hooks/useNotification'
import ChartCard from '../../components/ChartCard'

const medicationsData = [
  { id: 1, name: 'Paracetamol 500mg', category: 'Pain Relief', price: 5.99, stock: 150, sku: 'MED001' },
  { id: 2, name: 'Ibuprofen 400mg', category: 'Pain Relief', price: 7.99, stock: 120, sku: 'MED002' },
  { id: 3, name: 'Amoxicillin 500mg', category: 'Antibiotics', price: 12.99, stock: 80, sku: 'MED003' },
  { id: 4, name: 'Omeprazole 20mg', category: 'Digestive', price: 9.99, stock: 95, sku: 'MED004' },
  { id: 5, name: 'Loratadine 10mg', category: 'Allergy', price: 8.49, stock: 110, sku: 'MED005' },
  { id: 6, name: 'Metformin 500mg', category: 'Diabetes', price: 6.99, stock: 200, sku: 'MED006' },
  { id: 7, name: 'Lisinopril 10mg', category: 'Blood Pressure', price: 11.99, stock: 75, sku: 'MED007' },
  { id: 8, name: 'Atorvastatin 20mg', category: 'Cholesterol', price: 14.99, stock: 60, sku: 'MED008' },
  { id: 9, name: 'Cetirizine 10mg', category: 'Allergy', price: 6.49, stock: 130, sku: 'MED009' },
  { id: 10, name: 'Vitamin D3 1000IU', category: 'Supplements', price: 8.99, stock: 180, sku: 'MED010' },
]

const categories = ['All', 'Pain Relief', 'Antibiotics', 'Digestive', 'Allergy', 'Diabetes', 'Blood Pressure', 'Cholesterol', 'Supplements']

export default function POSSystem() {
  const { user } = useAuth()
  const { notification, closeNotification, success, error, warning } = useNotification()
  const { confirm, showConfirm, closeConfirm } = useConfirm()
  
  const [medications, setMedications] = useState(medicationsData)
  const [cart, setCart] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [showReceipt, setShowReceipt] = useState(false)
  const [lastSale, setLastSale] = useState(null)
  const [customerName, setCustomerName] = useState('')

  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         med.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || med.category === selectedCategory
    return matchesSearch && matchesCategory && med.stock > 0
  })

  const addToCart = (medication) => {
    const existing = cart.find(item => item.id === medication.id)
    if (existing) {
      if (existing.quantity >= medication.stock) {
        warning('Stock Limit', `Only ${medication.stock} units available`)
        return
      }
      setCart(cart.map(item =>
        item.id === medication.id ? { ...item, quantity: item.quantity + 1 } : item
      ))
    } else {
      setCart([...cart, { ...medication, quantity: 1 }])
    }
  }

  const updateQuantity = (id, delta) => {
    const item = cart.find(i => i.id === id)
    const med = medications.find(m => m.id === id)
    
    if (delta > 0 && item.quantity >= med.stock) {
      warning('Stock Limit', `Only ${med.stock} units available`)
      return
    }

    setCart(cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta
        return newQty > 0 ? { ...item, quantity: newQty } : item
      }
      return item
    }).filter(item => item.quantity > 0))
  }

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id))
  }

  const clearCart = () => {
    if (cart.length === 0) return
    showConfirm('Clear Cart', 'Are you sure you want to clear all items from the cart?', () => {
      setCart([])
      setCustomerName('')
    })
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  const completeSale = () => {
    if (cart.length === 0) {
      error('Empty Cart', 'Please add items to the cart before completing the sale')
      return
    }

    // Update stock
    setMedications(medications.map(med => {
      const cartItem = cart.find(item => item.id === med.id)
      if (cartItem) {
        return { ...med, stock: med.stock - cartItem.quantity }
      }
      return med
    }))

    // Save sale record
    const sale = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      items: [...cart],
      subtotal,
      tax,
      total,
      paymentMethod,
      customerName: customerName || 'Walk-in Customer',
      cashier: user?.name,
    }
    setLastSale(sale)
    setShowReceipt(true)
    setCart([])
    setCustomerName('')
    success('Sale Complete', `Transaction of $${total.toFixed(2)} completed successfully`)
  }

  return (
    <div className="space-y-6">
      <NotificationModal {...notification} onClose={closeNotification} />
      <ConfirmModal {...confirm} onClose={closeConfirm} onConfirm={confirm.onConfirm} />

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Point of Sale</h1>
        <p className="text-gray-500">Sell medications to patients</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search and Filter */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMedications.map((med) => (
              <button
                key={med.id}
                onClick={() => addToCart(med)}
                className="p-4 bg-white border border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-md transition text-left"
              >
                <p className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">{med.name}</p>
                <p className="text-xs text-gray-500 mb-2">{med.category}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary-600">${med.price.toFixed(2)}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    med.stock < 20 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {med.stock} left
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cart */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 sticky top-4">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900">Cart ({cart.length})</h3>
              </div>
              <button onClick={clearCart} className="text-sm text-red-600 hover:text-red-700">
                Clear
              </button>
            </div>

            {/* Customer Name */}
            <div className="p-4 border-b border-gray-100">
              <input
                type="text"
                placeholder="Customer name (optional)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>

            {/* Cart Items */}
            <div className="max-h-[300px] overflow-y-auto">
              {cart.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Cart is empty</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <div key={item.id} className="p-4">
                      <div className="flex justify-between mb-2">
                        <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="p-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Tax (10%)</span>
                <span className="text-gray-900">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span className="text-primary-600">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="p-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Payment Method</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 rounded-lg border flex items-center justify-center gap-2 transition ${
                    paymentMethod === 'cash' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200'
                  }`}
                >
                  <Banknote className="w-5 h-5" />
                  Cash
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-lg border flex items-center justify-center gap-2 transition ${
                    paymentMethod === 'card' ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-200'
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  Card
                </button>
              </div>
            </div>

            {/* Complete Sale Button */}
            <div className="p-4">
              <button
                onClick={completeSale}
                disabled={cart.length === 0}
                className="w-full py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Receipt className="w-5 h-5" />
                Complete Sale
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && lastSale && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md mx-4 max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Receipt</h3>
                  <p className="text-sm text-gray-500">{lastSale.date}</p>
                </div>
                <button onClick={() => setShowReceipt(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="border-t border-b border-dashed border-gray-300 py-4 mb-4">
                <p className="text-center font-bold text-lg">MedClinic Pharmacy</p>
                <p className="text-center text-sm text-gray-500">123 Medical Center Drive</p>
              </div>

              <div className="mb-4">
                <p className="text-sm"><span className="text-gray-500">Customer:</span> {lastSale.customerName}</p>
                <p className="text-sm"><span className="text-gray-500">Cashier:</span> {lastSale.cashier}</p>
                <p className="text-sm"><span className="text-gray-500">Payment:</span> {lastSale.paymentMethod.toUpperCase()}</p>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-4">
                {lastSale.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm mb-2">
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${lastSale.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${lastSale.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2">
                  <span>Total</span>
                  <span>${lastSale.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-gray-500">
                <p>Thank you for your purchase!</p>
              </div>

              <button
                onClick={() => setShowReceipt(false)}
                className="w-full mt-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
