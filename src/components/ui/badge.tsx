type BadgeColor = 'gray' | 'blue' | 'green' | 'red';

const colorStyles: Record<BadgeColor, string> = {
  gray: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  green: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
};

interface BadgeProps {
  color?: BadgeColor;
  children: React.ReactNode;
}

export function Badge({ color = 'gray', children }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${colorStyles[color]}`}>
      {children}
    </span>
  );
}
