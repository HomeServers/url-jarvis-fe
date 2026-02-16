export type CrawlStatus = 'PENDING' | 'CRAWLING' | 'CRAWLED' | 'FAILED';

export interface UrlResponse {
  id: number;
  url: string;
  title: string | null;
  description: string | null;
  domain: string;
  status: CrawlStatus;
  failReason: string | null;
  createdAt: string;
  updatedAt: string;
}
