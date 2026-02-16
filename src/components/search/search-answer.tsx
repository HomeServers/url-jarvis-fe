import { Card } from '@/components/ui/card';

interface SearchAnswerProps {
  answer: string;
}

export function SearchAnswer({ answer }: SearchAnswerProps) {
  return (
    <Card>
      <h3 className="mb-3 text-sm font-semibold text-gray-500 dark:text-gray-400">AI 답변</h3>
      <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-900 dark:text-gray-100">
        {answer}
      </div>
    </Card>
  );
}
