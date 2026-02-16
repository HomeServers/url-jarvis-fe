interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 28, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logo-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="7" ry="7" fill="url(#logo-bg)" />
      {/* 체인 링크 (중앙) */}
      <path d="M11.5 18a3.5 3.5 0 010-4.95l1.24-1.24a3.5 3.5 0 014.95 0" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M20.5 14a3.5 3.5 0 010 4.95l-1.24 1.24a3.5 3.5 0 01-4.95 0" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <line x1="13.5" y1="18.5" x2="18.5" y2="13.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      {/* AI 스파클 */}
      <path d="M7 8l1.2-3L9.4 8 8.2 11z" fill="white" />
      <path d="M24.5 6l.9-2.2.9 2.2.9 2.2-.9-2.2z" fill="white" opacity="0.9" />
      <path d="M25.5 23l1-2.5 1 2.5 1 2.5-1-2.5z" fill="white" opacity="0.85" />
      {/* 뉴런 연결선 */}
      <circle cx="5.5" cy="22" r="1.3" fill="white" opacity="0.7" />
      <line x1="6.5" y1="21.3" x2="11.5" y2="18" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
      <circle cx="26" cy="14" r="1.3" fill="white" opacity="0.7" />
      <line x1="25" y1="14.3" x2="20.5" y2="15" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}
