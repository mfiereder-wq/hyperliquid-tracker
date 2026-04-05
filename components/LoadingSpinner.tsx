"use client";

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className={`${sizes[size]} animate-spin`}>
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="bg-bg-card border border-border rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="skeleton h-3 w-20 rounded mb-3"></div>
          <div className="skeleton h-8 w-28 rounded"></div>
          <div className="skeleton h-2 w-16 rounded mt-2"></div>
        </div>
        <div className="skeleton w-12 h-12 rounded-xl"></div>
      </div>
    </div>
  );
}

export function LoadingTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-bg-card border border-border rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-border">
        <div className="skeleton h-6 w-32 rounded"></div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border-b border-border flex gap-4">
          <div className="skeleton h-4 w-20 rounded"></div>
          <div className="skeleton h-4 w-16 rounded"></div>
          <div className="skeleton h-4 w-24 rounded"></div>
          <div className="skeleton h-4 w-20 rounded"></div>
          <div className="skeleton h-4 w-16 rounded flex-1"></div>
        </div>
      ))}
    </div>
  );
}

export function LoadingDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <LoadingCard key={i} />
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-bg-card border border-border rounded-2xl p-5">
          <div className="skeleton h-6 w-40 rounded mb-4"></div>
          <div className="skeleton h-[250px] rounded-xl"></div>
        </div>
        <div className="bg-bg-card border border-border rounded-2xl p-5">
          <div className="skeleton h-6 w-40 rounded mb-4"></div>
          <div className="skeleton h-[250px] rounded-xl"></div>
        </div>
      </div>

      {/* Main Chart Skeleton */}
      <div className="bg-bg-card border border-border rounded-2xl p-5">
        <div className="skeleton h-6 w-48 rounded mb-4"></div>
        <div className="skeleton h-[300px] rounded-xl"></div>
      </div>

      {/* Table Skeleton */}
      <LoadingTable rows={8} />
    </div>
  );
}

export default LoadingDashboard;
