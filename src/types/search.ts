export interface SearchRequest {
  query: string;
  topK?: number;
}

export interface SearchSource {
  urlId: number;
  url: string;
  title: string;
  thumbnail: string | null;
  domain: string;
  matchedContent: string;
  score: number;
}

export interface SearchResult {
  answer: string;
  sources: SearchSource[];
}
