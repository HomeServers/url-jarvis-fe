import { Card } from '@/components/ui/card';
import { RichText } from '@/components/ui/rich-text';
import { UrlStatusBadge } from './url-status-badge';
import type { UrlResponse } from '@/types/url';

interface UrlDetailCardProps {
  url: UrlResponse;
}

export function UrlDetailCard({ url }: UrlDetailCardProps) {
  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {url.title ?? 'URL 상세'}
          </h2>
          <UrlStatusBadge status={url.status} />
        </div>

        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-gray-500 dark:text-gray-400">URL</dt>
            <dd className="mt-0.5 break-all text-gray-900 dark:text-white">
              <a
                href={url.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400"
              >
                {url.url}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">도메인</dt>
            <dd className="mt-0.5 text-gray-900 dark:text-white">{url.domain}</dd>
          </div>
          {url.description && (
            <div className="sm:col-span-2">
              <dt className="text-gray-500 dark:text-gray-400">설명</dt>
              <dd className="mt-0.5 text-gray-900 dark:text-white">
                <RichText content={url.description} />
              </dd>
            </div>
          )}
          {url.status === 'FAILED' && url.failReason && (
            <div className="sm:col-span-2">
              <dt className="text-gray-500 dark:text-gray-400">실패 사유</dt>
              <dd className="mt-0.5 text-red-600 dark:text-red-400">{url.failReason}</dd>
            </div>
          )}
          <div>
            <dt className="text-gray-500 dark:text-gray-400">등록일</dt>
            <dd className="mt-0.5 text-gray-900 dark:text-white">
              {new Date(url.createdAt).toLocaleString('ko-KR')}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">수정일</dt>
            <dd className="mt-0.5 text-gray-900 dark:text-white">
              {new Date(url.updatedAt).toLocaleString('ko-KR')}
            </dd>
          </div>
        </dl>
      </div>
    </Card>
  );
}
