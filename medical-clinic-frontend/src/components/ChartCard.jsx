export default function ChartCard({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm overflow-hidden">
      <div className="mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-xs sm:text-sm text-gray-500">{subtitle}</p>}
      </div>
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        {children}
      </div>
    </div>
  )
}
