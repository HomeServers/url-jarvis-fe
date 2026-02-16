export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ??
  '469407659650-5291ms90hc5v4fgjuvs9455eebrckiqp.apps.googleusercontent.com';

export const GOOGLE_REDIRECT_URI =
  typeof window !== 'undefined'
    ? `${window.location.origin}/oauth/callback/google`
    : 'https://url-jarvis.nuhgnod.site/oauth/callback/google';

export const CRAWL_STATUS_MAP = {
  PENDING: { label: '대기 중', color: 'gray' },
  CRAWLING: { label: '크롤링 중...', color: 'blue' },
  CRAWLED: { label: '완료', color: 'green' },
  FAILED: { label: '실패', color: 'red' },
} as const;

export const POLLING_INTERVAL = 4000;
export const TOKEN_REFRESH_BUFFER = 60; // seconds before expiry
