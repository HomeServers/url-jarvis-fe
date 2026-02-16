import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface SearchAnswerProps {
  answer: string;
}

/** 마크다운 링크 [text](url)를 <a> 태그로 변환 */
function renderMarkdownLinks(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const regex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
      >
        {match[1]}
      </a>,
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

export function SearchAnswer({ answer }: SearchAnswerProps) {
  return (
    <Card>
      <h3 className="mb-3 text-sm font-semibold text-gray-500 dark:text-gray-400">AI 답변</h3>
      <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-900 dark:text-gray-100">
        {renderMarkdownLinks(answer)}
      </div>
    </Card>
  );
}
