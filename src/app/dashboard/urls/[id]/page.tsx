'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { POLLING_INTERVAL } from '@/lib/constants';
import { usePolling } from '@/hooks/use-polling';
import { UrlDetailCard } from '@/components/url/url-detail-card';
import { UrlDeleteModal } from '@/components/url/url-delete-modal';
import { SearchInput } from '@/components/search/search-input';
import { SearchAnswer } from '@/components/search/search-answer';
import { SourceCard } from '@/components/search/source-card';
import { Button } from '@/components/ui/button';
import { UrlDetailSkeleton, SearchResultSkeleton } from '@/components/ui/skeleton';
import type { UrlResponse } from '@/types/url';
import type { SearchResult } from '@/types/search';

export default function UrlDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [url, setUrl] = useState<UrlResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [recrawling, setRecrawling] = useState(false);

  // 검색 상태
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchUrl = useCallback(async () => {
    try {
      const res = await apiClient<UrlResponse>(`/api/urls/${id}`);
      setUrl(res.data);
    } catch {
      // 404 등
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    fetchUrl().finally(() => setLoading(false));
  }, [fetchUrl]);

  // PENDING/CRAWLING 상태면 폴링
  const isActive = url?.status === 'PENDING' || url?.status === 'CRAWLING';
  usePolling(() => fetchUrl(), POLLING_INTERVAL, isActive);

  const handleRecrawl = async () => {
    setRecrawling(true);
    try {
      const res = await apiClient<UrlResponse>(`/api/urls/${id}/recrawl`, {
        method: 'POST',
      });
      setUrl(res.data);
    } catch {
      // 409 등
    } finally {
      setRecrawling(false);
    }
  };

  const handleDelete = async () => {
    await apiClient(`/api/urls/${id}`, { method: 'DELETE' });
    router.replace('/dashboard');
  };

  const handleSearch = async (query: string) => {
    setSearchLoading(true);
    setSearchResult(null);
    try {
      const res = await apiClient<SearchResult>(`/api/urls/${id}/search`, {
        method: 'POST',
        body: JSON.stringify({ query, topK: 5 }),
      });
      setSearchResult(res.data);
    } catch {
      // 에러 처리
    } finally {
      setSearchLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <UrlDetailSkeleton />
      </div>
    );
  }

  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-gray-500">URL을 찾을 수 없습니다.</p>
        <Button variant="ghost" className="mt-4" onClick={() => router.replace('/dashboard')}>
          목록으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        뒤로가기
      </button>

      <UrlDetailCard url={url} />

      <div className="flex gap-3">
        {(url.status === 'FAILED' || url.status === 'CRAWLED') && (
          <Button variant="secondary" onClick={handleRecrawl} loading={recrawling}>
            재크롤링
          </Button>
        )}
        <Button variant="danger" onClick={() => setDeleteOpen(true)}>
          삭제
        </Button>
      </div>

      {url.status === 'CRAWLED' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            이 URL에서 검색
          </h3>
          <SearchInput onSearch={handleSearch} loading={searchLoading} />

          {searchLoading && <SearchResultSkeleton />}

          {searchResult && (
            <div className="space-y-4">
              <SearchAnswer answer={searchResult.answer} />
              {searchResult.sources.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400">출처</h4>
                  {searchResult.sources.map((source, i) => (
                    <SourceCard key={i} source={source} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <UrlDeleteModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        urlTitle={url.title ?? url.url}
      />
    </div>
  );
}
