'use client';

import { useState, FormEvent } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { UrlResponse } from '@/types/url';

interface UrlRegisterFormProps {
  onRegistered: (url: UrlResponse) => void;
}

export function UrlRegisterForm({ onRegistered }: UrlRegisterFormProps) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);

    try {
      const res = await apiClient<UrlResponse>('/api/urls', {
        method: 'POST',
        body: JSON.stringify({ url: trimmed }),
      });
      onRegistered(res.data);
      setUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'URL 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <div className="flex-1">
        <Input
          type="url"
          placeholder="https://example.com/article"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          error={error ?? undefined}
          required
        />
      </div>
      <Button type="submit" loading={loading} className="shrink-0">
        URL 등록
      </Button>
    </form>
  );
}
