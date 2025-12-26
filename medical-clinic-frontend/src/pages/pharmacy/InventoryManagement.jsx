import { useState } from 'react'
import { Search, Plus, Edit, Trash2, Package, AlertTriangle, TrendingDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { NotificationModal, ConfirmModal, FormModal } from '../../components/Modal'
import { useNotification, useConfirm } from '../../hooks/useNotification'
import ChartCard from '../../components/ChartCard'
import StatCard from '../../components/StatCard'

const initialMedications = [
  { id: 1, name: 'Paracetamol 500mg', category: 'Pain Relief', price: 5.99, cost: 3.50, stock: 150, minStock: 50, sku: 'MED001', supplier: 'PharmaCorp', expiryDate: '2026-06-15' },
  { id: 2, name: 'Ibuprofen 400mg', category: 'Pain Relief', price: 7.99, cost: 4.50, stock: 120, minStock: 40, sku: 'MED002', supplier: 'MedSupply Inc', expiryDate: '2026-08-20' },
  { id: 3, name: 'Amoxicillin 500mg', category: 'Antibiotics', price: 12.99, cost: 8.00, stock: 15, minStock: 30, sku: 'MED003', supplier: 'PharmaCorp', expiryDate: '2025-12-10' },
  { id: 4, name: 'Omeprazole 20mg', category: 'Digestive', price: 9.99, cost: 5.50, stock: 95, minStock: 35, sku: 'MED004', supplier: 'HealthMeds', expiryDate: '2026-03-25' },
  { id: 5, name: 'Loratadine 10mg', category: 'Allergy', price: 8.49, cost: 4.00, stock: 110, minStock: 40, sku: 'MED005', supplier: 'MedSupply Inc', expiryDate: '2026-09-30' },
  { id: 6, name: 'Metformin 500mg', category: 'Diabetes', price: 6.99, cost: 3.80, stock: 200, minStock: 60, sku: 'MED006', supplier: 'PharmaCorp', expiryDate: '2026-11-15' },
  { id: 7, name: 'Lisinopril 10mg', category: 'Blood Pressure', price: 11.99, cost: 7.00, stock: 25, minStock: 30, sku: 'MED007', supplier: 'HealthMeds', expiryDate: '2026-04-20' },
  { id: 8, name: 'Atorvastatin 20mg', category: 'Cholesterol', price: 14.99, cost: 9.50, stock: 60, minStock: 25, sku: 'MED008', supplier: 'PharmaCorp', expiryDate: '2026-07-10' },
  { id: 9, name: 'Cetirizine 10mg', category: 'Allergy', price: 6.49, cost: 3.20, stock: 8, minStock: 40, sku: 'MED009', supplier: 'MedSupply Inc', expiryDate: '2026-02-28' },
  { id: 10, name: 'Vitamin D3 1000IU', category: 'Supplements', price: 8.99, cost: 4.50, stock: 180, minStock: 50, sku: 'MED010', supplier: 'HealthMeds', expiryDate: '2027-01-15' },
]

const categories = ['All', 'Pain Relief', 'Antibiotics', 'Digestive', 'Allergy', 'Diabetes', 'Blood Pressure', 'Cholesterol', 'Supplements']
const suppliers = ['PharmaCorp', 'MedSupply Inc', 'HealthMeds', 'Generic Meds Co']

const emptyForm = { name: '', category: 'Pain Relief', price: '', cost: '', stock: '', minStock: '', sku: '', supplier: 'PharmaCorp', expiryDate: '' }

export default function InventoryManagement() {
  const { user } = useAuth()
  const { notification, closeNotification, success, error } = useNotification()
  const { confirm, showConfirm, closeConfirm } = useConfirm()
  
  const [medications, setMedications] = useState(initialMedications)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [stockFilter, setStockFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingMed, setEditingMed] = useState(null)
  const [formData, setFormData] = useState(emptyForm)

  const isAdmin = user?.role === 'admin'

  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) || med.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || med.category === selectedCategory
    const matchesStock = stockFilter === 'all' || (stockFilter === 'low' && med.stock <= med.minStock) || (stockFilter === 'out' && med.stock === 0)
    return matchesSearch && matchesCategory && matchesStock
  })

  const stats = {
    total: medications.length,
    lowStock: medications.filter(m => m.stock <= m.minStock && m.stock > 0).length,
    outOfStock: medications.filter(m => m.stock === 0).length,
    totalValue: medications.reduce((sum, m) => sum + (m.cost * m.stock), 0),
  }

  const openModal = (med = null) => {
    if (med) {
      setEditingMed(med)
      setFormData({ name: med.name, category: med.category, price: med.price.toString(), cost: med.cost.toString(), stock: med.stock.toString(), minStock: med.minStock.toString(), sku: med.sku, supplier: med.supplier, expiryDate: med.expiryDate })
    } else {
      setEditingMed(null)
      setFormData(emptyForm)
    }
    setShowModal(true)
  }

  const saveMedication = () => {
    if (!formData.name || !formData.price || !formData.sku) {
      error('Validation Error', 'Please fill in all required fields')
      return
    }
    const medData = { ...formData, price: parseFloat(formData.price), cost: parseFloat(formData.cost) || 0, stock: parseInt(formData.stock) || 0, minStock: parseInt(formData.minStock) || 0 }
    if (editingMed) {
      setMedications(medications.map(m => m.id === editingMed.id ? { ...m, ...medData } : m))
      success('Updated', 'Medication updated successfully')
    } else {
      setMedications([...medications, { id: Date.now(), ...medData }])
      success('Added', 'New medication added to inventory')
    }
    setShowModal(false)
  }

  const deleteMedication = (med) => {
    showConfirm('Delete Medication', `Are you sure you want to delete "${med.name}"?`, () => {
      setMedications(medications.filter(m => m.id !== med.id))
      success('Deleted', 'Medication removed from inventory')
    }, 'error')
  }

  const adjustStock = (id, amount) => {
    setMedications(medications.map(m => m.id === id ? { ...m, stock: Math.max(0, m.stock + amount) } : m))
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <NotificationModal {...notification} onClose={closeNotification} />
      <ConfirmModal {...confirm} onClose={closeConfirm} onConfirm={confirm.onConfirm} />

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-sm text-gray-500">Manage medication stock and details</p>
        </div>
        {isAdmin && (
          <button onClick={() => openModal()} className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 flex items-center justify-center gap-2 text-sm">
            <Plus className="w-4 h-4" />
            Add Medication
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard title="Total" value={stats.total} icon={Package} />
        <StatCard title="Low Stock" value={stats.lowStock} icon={TrendingDown} />
        <StatCard title="Out of Stock" value={stats.outOfStock} icon={AlertTriangle} />
        <StatCard title="Value" value={`$${stats.totalValue.toFixed(0)}`} icon={Package} />
      </div>

      <ChartCard title="Medications" subtitle="View and manage inventory">
        <div className="flex flex-col gap-3 mb-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm" />
          </div>
          <div className="flex gap-2">
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
              {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm">
              <option value="all">All Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-3">
          {filteredMedications.map((med) => (
            <div key={med.id} className="p-3 border border-gray-200 rounded-lg bg-white">
              <div className="flex justify-between items-start mb-2">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm truncate">{med.name}</p>
                  <p className="text-xs text-gray-500">{med.sku} • {med.category}</p>
                </div>
                <p className="font-bold text-primary-600 text-sm ml-2">${med.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <button onClick={() => adjustStock(med.id, -10)} className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-sm">-</button>
                  <span className={`font-medium text-sm min-w-[30px] text-center ${med.stock === 0 ? 'text-red-600' : med.stock <= med.minStock ? 'text-amber-600' : 'text-gray-900'}`}>
                    {med.stock}
                  </span>
                  <button onClick={() => adjustStock(med.id, 10)} className="w-6 h-6 rounded bg-gray-100 flex items-center justify-center text-sm">+</button>
                  {med.stock <= med.minStock && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openModal(med)} className="p-1.5 text-gray-600 hover:bg-gray-100 rounded">
                    <Edit className="w-4 h-4" />
                  </button>
                  {isAdmin && (
                    <button onClick={() => deleteMedication(med)} className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Product</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Category</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Price</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Stock</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedications.map((med) => (
                <tr key={med.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900 text-sm">{med.name}</p>
                    <p className="text-xs text-gray-500">{med.sku}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">{med.category}</span>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900 text-sm">${med.price.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => adjustStock(med.id, -10)} className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm">-</button>
                      <span className={`font-medium min-w-[40px] text-center text-sm ${med.stock === 0 ? 'text-red-600' : med.stock <= med.minStock ? 'text-amber-600' : 'text-gray-900'}`}>{med.stock}</span>
                      <button onClick={() => adjustStock(med.id, 10)} className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm">+</button>
                      {med.stock <= med.minStock && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => openModal(med)} className="p-1 text-gray-600 hover:bg-gray-100 rounded"><Edit className="w-5 h-5" /></button>
                      {isAdmin && <button onClick={() => deleteMedication(med)} className="p-1 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-5 h-5" /></button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      <FormModal isOpen={showModal} onClose={() => setShowModal(false)} title={editingMed ? 'Edit Medication' : 'Add New Medication'}>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm" placeholder="e.g., Paracetamol 500mg" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
              <input type="text" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm" placeholder="MED001" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm">
                {categories.filter(c => c !== 'All').map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
              <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm" placeholder="0.00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost</label>
              <input type="number" step="0.01" value={formData.cost} onChange={(e) => setFormData({ ...formData, cost: e.target.value })} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm" placeholder="0.00" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock</label>
              <input type="number" value={formData.minStock} onChange={(e) => setFormData({ ...formData, minStock: e.target.value })} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm" placeholder="0" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
              <select value={formData.supplier} onChange={(e) => setFormData({ ...formData, supplier: e.target.value })} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm">
                {suppliers.map(sup => <option key={sup} value={sup}>{sup}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry</label>
              <input type="date" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} className="w-full p-2.5 border border-gray-200 rounded-lg text-sm" />
            </div>
          </div>
          <div className="flex gap-3 pt-3">
            <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
            <button onClick={saveMedication} className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm">{editingMed ? 'Save' : 'Add'}</button>
          </div>
        </div>
      </FormModal>
    </div>
  )
}
