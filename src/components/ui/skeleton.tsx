interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse rounded-md bg-gray-200 dark:bg-gray-700 ${className}`} />
  );
}

/** URL 목록 아이템 스켈레톤 */
export function UrlListItemSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-1/3" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  );
}

/** URL 목록 스켈레톤 (여러 아이템) */
export function UrlListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <UrlListItemSkeleton key={i} />
      ))}
    </div>
  );
}

/** URL 카드 아이템 스켈레톤 */
export function UrlCardItemSkeleton() {
  return (
    <div className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-start justify-between gap-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="mt-2 space-y-1.5">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
      <Skeleton className="mt-auto pt-3 h-3 w-1/3" />
    </div>
  );
}

/** URL 그리드 스켈레톤 (카드 뷰) */
export function UrlGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <UrlCardItemSkeleton key={i} />
      ))}
    </div>
  );
}

/** URL 상세 카드 스켈레톤 */
export function UrlDetailSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-6 w-1/2" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="space-y-1">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
}

/** 검색 결과 스켈레톤 */
export function SearchResultSkeleton() {
  return (
    <div className="space-y-4">
      {/* 답변 스켈레톤 */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <Skeleton className="mb-3 h-4 w-16" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
      {/* 출처 카드 스켈레톤 */}
      <Skeleton className="h-4 w-10" />
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
          <div className="flex gap-3">
            <Skeleton className="h-16 w-16 shrink-0 rounded-md" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-3 w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
