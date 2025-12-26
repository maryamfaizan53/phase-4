/**
 * SkeletonLoader Components
 *
 * Loading placeholder components for dashboard sections.
 * Provides visual feedback while data is being fetched.
 */

export function KPISkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="glass-card rounded-xl p-6 animate-pulse"
        >
          {/* Icon placeholder */}
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-lg"></div>
          </div>

          {/* Value placeholder */}
          <div className="h-8 bg-white/10 rounded w-20 mb-2"></div>

          {/* Label placeholder */}
          <div className="h-4 bg-white/10 rounded w-32"></div>
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton({ title }) {
  return (
    <div className="glass-panel rounded-xl p-6 border border-white/20 animate-pulse">
      {/* Title placeholder */}
      {title && (
        <div className="h-6 bg-white/10 rounded w-48 mb-4"></div>
      )}

      {/* Chart area placeholder */}
      <div className="h-80 bg-white/5 rounded-lg flex items-center justify-center">
        <div className="text-white/40 text-sm">Loading chart...</div>
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="glass-panel rounded-xl p-6 border border-white/20">
      {/* Header placeholder */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 bg-white/10 rounded w-48 animate-pulse"></div>
        <div className="flex space-x-2">
          <div className="h-10 bg-white/10 rounded w-32 animate-pulse"></div>
          <div className="h-10 bg-white/10 rounded w-32 animate-pulse"></div>
        </div>
      </div>

      {/* Table rows placeholder */}
      <div className="space-y-3">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg animate-pulse"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Checkbox */}
            <div className="w-5 h-5 bg-white/10 rounded"></div>

            {/* Title */}
            <div className="flex-1 h-4 bg-white/10 rounded"></div>

            {/* Status badge */}
            <div className="w-20 h-6 bg-white/10 rounded-full"></div>

            {/* Date */}
            <div className="w-24 h-4 bg-white/10 rounded"></div>

            {/* Actions */}
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-white/10 rounded"></div>
              <div className="w-8 h-8 bg-white/10 rounded"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination placeholder */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-white/10">
        <div className="h-4 bg-white/10 rounded w-32 animate-pulse"></div>
        <div className="flex space-x-2">
          <div className="h-10 bg-white/10 rounded w-24 animate-pulse"></div>
          <div className="h-10 bg-white/10 rounded w-24 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
