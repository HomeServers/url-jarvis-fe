'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { SearchInput } from '@/components/search/search-input';
import { SearchAnswer } from '@/components/search/search-answer';
import { SourceCard } from '@/components/search/source-card';
import { Spinner } from '@/components/ui/spinner';
import type { SearchResult } from '@/types/search';

export default function SearchPage() {
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await apiClient<SearchResult>('/api/search', {
        method: 'POST',
        body: JSON.stringify({ query, topK: 5 }),
      });
      setResult(res.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '검색에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">전체 검색</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          등록한 모든 URL에서 AI로 검색합니다.
        </p>
      </div>

      <SearchInput onSearch={handleSearch} loading={loading} />

      {loading && (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      )}

      {error && (
        <p className="text-center text-sm text-red-500">{error}</p>
      )}

      {result && (
        <div className="space-y-4">
          <SearchAnswer answer={result.answer} />

          {result.sources.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">출처</h3>
              {result.sources.map((source, i) => (
                <SourceCard key={i} source={source} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
