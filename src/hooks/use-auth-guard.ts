'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';

export function useAuthGuard() {
  const router = useRouter();
  const { accessToken, isHydrated } = useAuthStore();

  useEffect(() => {
    if (isHydrated && !accessToken) {
      router.replace('/login');
    }
  }, [isHydrated, accessToken, router]);

  return { isReady: isHydrated && !!accessToken };
}
