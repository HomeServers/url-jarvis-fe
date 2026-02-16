import Image from 'next/image';
import Link from 'next/link';
import type { SearchSource } from '@/types/search';

interface SourceCardProps {
  source: SearchSource;
}

export function SourceCard({ source }: SourceCardProps) {
  const similarityPercent = Math.round(source.similarity * 100);

  return (
    <Link
      href={`/dashboard/urls/${source.urlId}`}
      className="block rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:border-blue-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-blue-800"
    >
      <div className="flex gap-3">
        {source.thumbnail && (
          <Image
            src={source.thumbnail}
            alt=""
            width={64}
            height={64}
            className="h-16 w-16 shrink-0 rounded-md object-cover"
            unoptimized
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="truncate text-sm font-medium text-gray-900 dark:text-white">
              {source.title}
            </h4>
            <span className="shrink-0 rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              {similarityPercent}%
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{source.domain}</p>
          <p className="mt-1 line-clamp-2 text-xs text-gray-600 dark:text-gray-400">
            {source.matchedContent}
          </p>
        </div>
      </div>
    </Link>
  );
}
