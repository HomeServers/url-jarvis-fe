'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { POLLING_INTERVAL } from '@/lib/constants';
import { usePolling } from '@/hooks/use-polling';
import { UrlRegisterForm } from '@/components/url/url-register-form';
import { UrlListItem } from '@/components/url/url-list-item';
import { Pagination } from '@/components/ui/pagination';
import { UrlListSkeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import type { PaginatedData } from '@/types/api';
import type { UrlResponse } from '@/types/url';

export default function DashboardPage() {
  const [urls, setUrls] = useState<UrlResponse[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

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

      {loading ? (
        <UrlListSkeleton />
      ) : urls.length === 0 ? (
        <EmptyState
          title="등록된 URL이 없습니다"
          description="위 입력란에 URL을 등록해보세요."
        />
      ) : (
        <div className="space-y-3">
          {urls.map((url) => (
            <UrlListItem key={url.id} url={url} />
          ))}
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
