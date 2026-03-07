'use client';

import Markdown from 'react-markdown';

interface RichTextProps {
  content: string;
  className?: string;
}

const HTML_TAG_REGEX = /<\/?[a-z][\s\S]*?>/i;

export function RichText({ content, className = '' }: RichTextProps) {
  const isHtml = HTML_TAG_REGEX.test(content);

  if (isHtml) {
    return (
      <div
        className={`prose prose-sm dark:prose-invert max-w-none ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  return (
    <div className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
      <Markdown>{content}</Markdown>
    </div>
  );
}
