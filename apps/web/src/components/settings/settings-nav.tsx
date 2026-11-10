'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  User,
  Building2,
  Users,
  Key,
  Receipt,
  Shield,
  ChevronRight,
} from 'lucide-react';

const SETTINGS_LINKS = [
  {
    href: '/settings/profile',
    label: 'Profile & Legal Identity',
    icon: User,
  },
  {
    href: '/settings/workspace',
    label: 'Workspace & Entity',
    icon: Building2,
  },
  {
    href: '/settings/team',
    label: 'Team & Signatories',
    icon: Users,
  },
  {
    href: '/settings/developer',
    label: 'API Keys & Webhooks',
    icon: Key,
  },
  {
    href: '/settings/billing',
    label: 'Billing & Mushak-6.3',
    icon: Receipt,
  },
  {
    href: '/settings/security',
    label: 'Security & Vault Preservation',
    icon: Shield,
  },
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-surface rounded-xl border border-border p-2 shadow-subtle space-y-1">
      <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-ink-faint">
        Settings Rail
      </div>
      {SETTINGS_LINKS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
              isActive
                ? 'bg-pine-900 text-paper font-semibold shadow-sm'
                : 'text-ink-soft hover:bg-paper hover:text-ink'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Icon className={`w-4 h-4 ${isActive ? 'text-brass' : 'text-ink-faint'}`} />
              <span>{item.label}</span>
            </div>
            {isActive && <ChevronRight className="w-3.5 h-3.5 text-paper/60" />}
          </Link>
        );
      })}
    </nav>
  );
}
