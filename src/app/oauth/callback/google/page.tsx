'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { API_BASE_URL, GOOGLE_REDIRECT_URI } from '@/lib/constants';
import { useAuthStore } from '@/stores/auth-store';
import { Spinner } from '@/components/ui/spinner';
import type { ApiResponse } from '@/types/api';
import type { AuthTokens } from '@/types/auth';

function GoogleCallbackInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    const code = searchParams.get('code');
    if (!code) {
      setError('인증 코드가 없습니다.');
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, redirectUri: GOOGLE_REDIRECT_URI }),
        });

        const json: ApiResponse<AuthTokens> = await res.json();

        if (!json.success || !json.data) {
          setError(json.error ?? '로그인에 실패했습니다.');
          return;
        }

        login(json.data.accessToken, json.data.refreshToken);
        router.replace('/dashboard');
      } catch {
        setError('로그인 처리 중 오류가 발생했습니다.');
      }
    })();
  }, [searchParams, login, router]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p className="text-red-500">{error}</p>
        <button
          className="text-sm text-blue-600 underline"
          onClick={() => router.replace('/login')}
        >
          로그인 페이지로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Spinner />
        <p className="text-sm text-gray-500">로그인 처리 중...</p>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <Spinner />
        </div>
      }
    >
      <GoogleCallbackInner />
    </Suspense>
  );
}
