/**
 * PageSkeleton — pulsing placeholder rendered while a lazy route loads.
 * Mimics the common page shell: breadcrumb bar, title row, and a card grid
 * so the transition from spinner to content feels seamless.
 */
export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8" aria-busy aria-label="Loading…">
      {/* Breadcrumb placeholder */}
      <div className="h-3 w-32 animate-pulse rounded bg-border" />

      {/* Title + action row */}
      <div className="mt-5 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-40 animate-pulse rounded bg-border" />
          <div className="h-3 w-24 animate-pulse rounded bg-border" />
        </div>
        <div className="hidden h-8 w-28 animate-pulse rounded-lg bg-border sm:block" />
      </div>

      {/* Tab bar placeholder */}
      <div className="mt-6 flex gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 w-16 animate-pulse rounded-lg bg-border" />
        ))}
      </div>

      {/* Card grid placeholder */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-border bg-bg-secondary p-6">
            <div className="h-9 w-9 animate-pulse rounded-lg bg-border" />
            <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-border" />
            <div className="mt-2 space-y-1.5">
              <div className="h-3 w-full animate-pulse rounded bg-border" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-border" />
            </div>
            <div className="mt-4 flex gap-2">
              <div className="h-5 w-12 animate-pulse rounded-full bg-border" />
              <div className="h-5 w-12 animate-pulse rounded-full bg-border" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
