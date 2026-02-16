import { CRAWL_STATUS_MAP } from '@/lib/constants';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import type { CrawlStatus } from '@/types/url';

interface UrlStatusBadgeProps {
  status: CrawlStatus;
}

export function UrlStatusBadge({ status }: UrlStatusBadgeProps) {
  const { label, color } = CRAWL_STATUS_MAP[status];

  return (
    <Badge color={color}>
      {status === 'CRAWLING' && <Spinner className="h-3 w-3" />}
      {label}
    </Badge>
  );
}
