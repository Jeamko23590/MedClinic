export default function StatCard({ title, value, change, icon: Icon, trend }) {
  const isPositive = trend === 'up'
  
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm text-gray-500 mb-1 truncate">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{value}</p>
          {change && (
            <p className={`text-xs sm:text-sm mt-1 sm:mt-2 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '↑' : '↓'} {change}
              <span className="hidden sm:inline"> from last period</span>
            </p>
          )}
        </div>
        {Icon && (
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600" />
          </div>
        )}
      </div>
    </div>
  )
}
