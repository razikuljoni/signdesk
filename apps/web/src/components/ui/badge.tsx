import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors',
  {
    variants: {
      variant: {
        draft: 'bg-surface-raised text-ink-soft border border-border',
        waiting: 'bg-pine-100 text-pine-900 border border-pine-500/20',
        inProgress: 'bg-pine-600 text-white',
        completed: 'bg-[#E2F2E8] text-success border border-success/30 font-bold',
        declined: 'bg-[#FDECEA] text-danger border border-danger/30',
        expired: 'bg-[#FDECEA] text-danger border border-danger/30',
        voided: 'bg-[#FDECEA] text-danger border border-danger/30',
        verified: 'bg-surface border-2 border-brass-500 text-brass-600 font-bold',
      },
    },
    defaultVariants: {
      variant: 'draft',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

function Badge({ className, variant, icon, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </div>
  );
}

export { Badge, badgeVariants };
