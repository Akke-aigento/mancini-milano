import { sanitizeHtml } from '@/lib/sanitizeHtml';

interface SafeHtmlProps {
  html: string | null | undefined;
  className?: string;
  as?: 'div' | 'span' | 'article' | 'section';
}

export function SafeHtml({ html, className, as: Component = 'div' }: SafeHtmlProps) {
  return (
    <Component
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  );
}
