import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
  strokeWidth?: number;
}

/**
 * Minimal necktie silhouette — represents the Classic world.
 * Drawn in the same thin-stroke style as Lucide icons.
 */
export const TieIcon = ({ size = 18, strokeWidth = 1.5, className, ...rest }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...rest}
  >
    {/* Collar / knot top */}
    <path d="M9 2h6l-1.2 3H10.2L9 2z" />
    {/* Knot */}
    <path d="M10.2 5h3.6l.6 2.2-2.4 1.3-2.4-1.3L10.2 5z" />
    {/* Tie body tapering to a point */}
    <path d="M9.8 8.5l-1.3 9.2L12 22l3.5-4.3-1.3-9.2" />
  </svg>
);

/**
 * Low-top sneaker side profile — represents the Streetwear world.
 * Sole, upper, laces and one accent stripe in a clean thin stroke.
 */
export const SneakerIcon = ({ size = 18, strokeWidth = 1.5, className, ...rest }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...rest}
  >
    {/* Upper + toe box silhouette */}
    <path d="M2.5 17V13.5c0-.4.3-.8.7-.9l3.6-.9c.3-.1.6-.3.8-.6L9.6 8c.3-.5.9-.8 1.5-.7l2 .3c.5.1.9.4 1.1.8l1.3 2.4c.2.4.6.7 1 .8l4 1.1c.7.2 1.2.8 1.2 1.5V17" />
    {/* Sole */}
    <path d="M2 17h20" />
    {/* Heel detail */}
    <path d="M3.5 13.5v3.5" />
    {/* Laces (3 short cross strokes on the upper) */}
    <path d="M10 9.5l1.8 1" />
    <path d="M11 11l1.8 1" />
    <path d="M12 12.5l1.8 1" />
  </svg>
);
