import Link from 'next/link';
import { UrlStatusBadge } from './url-status-badge';
import type { UrlResponse } from '@/types/url';

interface UrlListItemProps {
  url: UrlResponse;
}

export function UrlListItem({ url }: UrlListItemProps) {
  return (
    <Link
      href={`/dashboard/urls/${url.id}`}
      className="block rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/50 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-800 dark:hover:bg-blue-950/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-medium text-gray-900 dark:text-white">
            {url.title ?? url.url}
          </h3>
          {url.description && (
            <p className="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">
              {url.description}
            </p>
          )}
          <p className="mt-1 truncate text-xs text-gray-400 dark:text-gray-500">
            {url.domain}
          </p>
        </div>
        <UrlStatusBadge status={url.status} />
      </div>
      {url.status === 'FAILED' && url.failReason && (
        <p className="mt-2 text-xs text-red-500">{url.failReason}</p>
      )}
    </Link>
  );
}
