import { useState, useEffect } from 'react'
import { Search, Plus, Edit, Trash2, Package, AlertTriangle, TrendingDown, Filter } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { NotificationModal, ConfirmModal, FormModal } from '../../components/Modal'
import { useNotification, useConfirm } from '../../hooks/useNotification'
import ChartCard from '../../components/ChartCard'
import StatCard from '../../components/StatCard'
import api from '../../services/api'

const categories = ['All', 'Pain Relief', 'Antibiotics', 'Digestive', 'Allergy', 'Diabetes', 'Blood Pressure', 'Cholesterol', 'Supplements']
const suppliers = ['PharmaCorp', 'MedSupply Inc', 'HealthMeds', 'Generic Meds Co']

const emptyForm = {
  name: '', category: 'Pain Relief', price: '', cost: '', stock: '', minStock: '', sku: '', supplier: 'PharmaCorp', expiryDate: ''
}

export default function InventoryManagement() {
  const { user } = useAuth()
  const { notification, closeNotification, success, error } = useNotification()
  const { confirm, showConfirm, closeConfirm } = useConfirm()
  
  const [medications, setMedications] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [stockFilter, setStockFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingMed, setEditingMed] = useState(null)
  const [formData, setFormData] = useState(emptyForm)

  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    fetchMedications()
  }, [])

  const fetchMedications = async () => {
    try {
      setLoading(true)
      const response = await api.get('/pharmacy/medications')
      setMedications(response.data)
    } catch (err) {
      console.error('Failed to fetch medications:', err)
      error('Error', 'Failed to load medications')
    } finally {
      setLoading(false)
    }
  }

  const filteredMedications = medications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         med.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || med.category === selectedCategory
    const matchesStock = stockFilter === 'all' || 
                        (stockFilter === 'low' && med.stock <= med.minStock) ||
                        (stockFilter === 'out' && med.stock === 0)
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
      setFormData({
        name: med.name,
        category: med.category,
        price: med.price.toString(),
        cost: med.cost.toString(),
        stock: med.stock.toString(),
        minStock: med.minStock.toString(),
        sku: med.sku,
        supplier: med.supplier,
        expiryDate: med.expiryDate ? med.expiryDate.split('T')[0] : '',
      })
    } else {
      setEditingMed(null)
      setFormData(emptyForm)
    }
    setShowModal(true)
  }

  const saveMedication = async () => {
    if (!formData.name || !formData.price || !formData.sku) {
      error('Validation Error', 'Please fill in all required fields')
      return
    }

    const medData = {
      ...formData,
      price: parseFloat(formData.price),
      cost: parseFloat(formData.cost) || 0,
      stock: parseInt(formData.stock) || 0,
      minStock: parseInt(formData.minStock) || 0,
    }

    try {
      if (editingMed) {
        await api.put(`/pharmacy/medications/${editingMed.id}`, medData)
        setMedications(medications.map(m => m.id === editingMed.id ? { ...m, ...medData } : m))
        success('Updated', 'Medication updated successfully')
      } else {
        const response = await api.post('/pharmacy/medications', medData)
        setMedications([...medications, response.data.medication])
        success('Added', 'New medication added to inventory')
      }
      setShowModal(false)
    } catch (err) {
      console.error('Failed to save medication:', err)
      error('Error', err.response?.data?.message || 'Failed to save medication')
    }
  }

  const deleteMedication = (med) => {
    showConfirm(
      'Delete Medication',
      `Are you sure you want to delete "${med.name}" from inventory?`,
      async () => {
        try {
          await api.delete(`/pharmacy/medications/${med.id}`)
          setMedications(medications.filter(m => m.id !== med.id))
          success('Deleted', 'Medication removed from inventory')
        } catch (err) {
          console.error('Failed to delete medication:', err)
          error('Error', 'Failed to delete medication')
        }
      },
      'error'
    )
  }

  const adjustStock = async (id, amount) => {
    try {
      const response = await api.post(`/pharmacy/medications/${id}/adjust-stock`, { adjustment: amount })
      setMedications(medications.map(m => m.id === id ? response.data.medication : m))
    } catch (err) {
      console.error('Failed to adjust stock:', err)
      error('Error', 'Failed to adjust stock')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading inventory...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <NotificationModal {...notification} onClose={closeNotification} />
      <ConfirmModal {...confirm} onClose={closeConfirm} onConfirm={confirm.onConfirm} />

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-500">Manage medication stock and details</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => openModal()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Medication
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Products" value={stats.total} icon={Package} />
        <StatCard title="Low Stock" value={stats.lowStock} icon={TrendingDown} />
        <StatCard title="Out of Stock" value={stats.outOfStock} icon={AlertTriangle} />
        <StatCard title="Inventory Value" value={`${stats.totalValue.toFixed(2)}`} icon={Package} />
      </div>

      {/* Filters */}
      <ChartCard title="Medications" subtitle="View and manage inventory">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="all">All Stock</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Product</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">SKU</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Category</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Price</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Stock</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Expiry</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMedications.map((med) => (
                <tr key={med.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{med.name}</p>
                    <p className="text-sm text-gray-500">{med.supplier}</p>
                  </td>
                  <td className="py-3 px-4 text-gray-600 font-mono text-sm">{med.sku}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                      {med.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">${parseFloat(med.price).toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Cost: ${parseFloat(med.cost).toFixed(2)}</p>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => adjustStock(med.id, -10)}
                        className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm"
                      >
                        -
                      </button>
                      <span className={`font-medium min-w-[40px] text-center ${
                        med.stock === 0 ? 'text-red-600' : med.stock <= med.minStock ? 'text-amber-600' : 'text-gray-900'
                      }`}>
                        {med.stock}
                      </span>
                      <button
                        onClick={() => adjustStock(med.id, 10)}
                        className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-sm"
                      >
                        +
                      </button>
                      {med.stock <= med.minStock && (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{med.expiryDate ? med.expiryDate.split('T')[0] : '-'}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openModal(med)}
                        className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => deleteMedication(med)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      {/* Add/Edit Modal */}
      <FormModal isOpen={showModal} onClose={() => setShowModal(false)} title={editingMed ? 'Edit Medication' : 'Add New Medication'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              placeholder="e.g., Paracetamol 500mg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="MED001"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              >
                {categories.filter(c => c !== 'All').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price *</label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="0.00"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock Level</label>
              <input
                type="number"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                placeholder="0"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
              <select
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              >
                {suppliers.map(sup => (
                  <option key={sup} value={sup}>{sup}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={saveMedication}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            >
              {editingMed ? 'Save Changes' : 'Add Medication'}
            </button>
          </div>
        </div>
      </FormModal>
    </div>
  )
}
