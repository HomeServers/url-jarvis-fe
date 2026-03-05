'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { POLLING_INTERVAL } from '@/lib/constants';
import { usePolling } from '@/hooks/use-polling';
import { UrlRegisterForm } from '@/components/url/url-register-form';
import { UrlListItem } from '@/components/url/url-list-item';
import { UrlCardItem } from '@/components/url/url-card-item';
import { Pagination } from '@/components/ui/pagination';
import { UrlListSkeleton, UrlGridSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import type { PaginatedData } from '@/types/api';
import type { UrlResponse } from '@/types/url';

type ViewMode = 'list' | 'grid';

const VIEW_MODE_KEY = 'url-view-mode';

function getInitialViewMode(): ViewMode {
  if (typeof window === 'undefined') return 'list';
  const stored = localStorage.getItem(VIEW_MODE_KEY);
  return stored === 'grid' ? 'grid' : 'list';
}

function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 5.25h16.5m-16.5-10.5h16.5" />
    </svg>
  );
}

function GridIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
  );
}

export default function DashboardPage() {
  const [urls, setUrls] = useState<UrlResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>(getInitialViewMode);

  const toggleViewMode = () => {
    setViewMode((prev) => {
      const next = prev === 'list' ? 'grid' : 'list';
      localStorage.setItem(VIEW_MODE_KEY, next);
      return next;
    });
  };

  const fetchUrls = useCallback(async (pageNum: number, showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await apiClient<PaginatedData<UrlResponse>>(
        `/api/urls?page=${pageNum}&size=20`,
      );
      setUrls(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch {
      // 401 시 auth guard가 리다이렉트 처리
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUrls(page, true);
  }, [page, fetchUrls]);

  // PENDING 또는 CRAWLING URL이 있으면 폴링
  const hasActiveUrls = urls.some(
    (u) => u.status === 'PENDING' || u.status === 'CRAWLING',
  );

  usePolling(
    () => fetchUrls(page),
    POLLING_INTERVAL,
    hasActiveUrls,
  );

  const handleRegistered = (newUrl: UrlResponse) => {
    // 첫 페이지면 목록 앞에 추가, 아니면 첫 페이지로 이동
    if (page === 0) {
      setUrls((prev) => [newUrl, ...prev]);
    } else {
      setPage(0);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">URL 관리</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          URL을 등록하면 자동으로 크롤링하여 검색할 수 있습니다.
        </p>
      </div>

      <UrlRegisterForm onRegistered={handleRegistered} />

      <div className="flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={toggleViewMode}
          aria-label={viewMode === 'list' ? '카드 뷰로 전환' : '리스트 뷰로 전환'}
          className="rounded-md p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
        >
          {viewMode === 'list' ? (
            <GridIcon className="h-5 w-5" />
          ) : (
            <ListIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {loading ? (
        viewMode === 'list' ? <UrlListSkeleton /> : <UrlGridSkeleton />
      ) : urls.length === 0 ? (
        <EmptyState
          title="등록된 URL이 없습니다"
          description="위 입력란에 URL을 등록해보세요."
        />
      ) : (
        <>
          {viewMode === 'list' ? (
            <div className="space-y-3">
              {urls.map((url) => (
                <UrlListItem key={url.id} url={url} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {urls.map((url) => (
                <UrlCardItem key={url.id} url={url} />
              ))}
            </div>
          )}
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}
