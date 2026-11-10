import * as React from 'react';

export function WaxSeal({ size = 48, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="SignDesk Authentic Wax Seal"
    >
      {/* Outer scalloped/irregular wax edge */}
      <circle cx="32" cy="32" r="30" fill="#9A2E1E" />
      <circle cx="32" cy="32" r="28.5" fill="#B3402A" />

      {/* Brass verification ring */}
      <circle
        cx="32"
        cy="32"
        r="24"
        stroke="#C9A227"
        strokeWidth="1.5"
        strokeDasharray="2 1.5"
      />

      {/* Inner seal circle */}
      <circle cx="32" cy="32" r="20" fill="#9A2E1E" />
      <circle cx="32" cy="32" r="18.5" fill="#B3402A" />

      {/* Stylized monogram / quill stamp in center */}
      <path
        d="M26 40V24L38 32L26 40Z"
        fill="#C9A227"
        opacity="0.9"
      />
      <circle cx="32" cy="32" r="4" fill="#FAF7F1" />
      <circle cx="32" cy="32" r="2" fill="#0C2E29" />
    </svg>
  );
}
