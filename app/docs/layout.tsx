'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpenIcon,
  ServerIcon,
  CpuChipIcon,
  CircleStackIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  CloudArrowUpIcon,
  WrenchScrewdriverIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronRightIcon,
  HomeIcon,
  BeakerIcon,
  CommandLineIcon,
} from '@heroicons/react/24/outline';

const navSections = [
  {
    label: 'Getting Started',
    icon: BookOpenIcon,
    color: 'text-teal-600',
    items: [
      { href: '/docs', label: 'Overview', icon: HomeIcon },
      { href: '/docs/quickstart', label: 'Quick Start', icon: CommandLineIcon },
    ],
  },
  {
    label: 'Architecture',
    icon: CpuChipIcon,
    color: 'text-blue-600',
    items: [
      { href: '/docs/architecture', label: 'System Architecture', icon: CpuChipIcon },
      { href: '/docs/agents', label: 'AI Agents', icon: BeakerIcon },
    ],
  },
  {
    label: 'Backend',
    icon: ServerIcon,
    color: 'text-emerald-600',
    items: [
      { href: '/docs/api', label: 'API Reference', icon: ServerIcon },
      { href: '/docs/database', label: 'Database & Models', icon: CircleStackIcon },
    ],
  },
  {
    label: 'Integrations',
    icon: ChatBubbleLeftRightIcon,
    color: 'text-cyan-600',
    items: [
      { href: '/docs/whatsapp', label: 'WhatsApp Integration', icon: ChatBubbleLeftRightIcon },
      { href: '/docs/auth', label: 'Authentication', icon: ShieldCheckIcon },
    ],
  },
  {
    label: 'Deployment',
    icon: CloudArrowUpIcon,
    color: 'text-sky-600',
    items: [
      { href: '/docs/deployment', label: 'Deployment Guide', icon: CloudArrowUpIcon },
      { href: '/docs/configuration', label: 'Configuration', icon: WrenchScrewdriverIcon },
    ],
  },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      {/* Mobile top bar */}
      <div className={`fixed top-16 md:top-20 left-0 right-0 z-30 flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 md:hidden transition-shadow ${scrolled ? 'shadow-sm' : ''}`}>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Open docs navigation"
        >
          <Bars3Icon className="w-5 h-5 text-gray-600" />
        </button>
        <span className="text-sm font-semibold text-gray-700">Documentation</span>
      </div>

      <div className="flex max-w-screen-2xl mx-auto">
        {/* ── SIDEBAR ── */}
        {/* Desktop */}
        <aside className="hidden md:flex flex-col w-64 xl:w-72 shrink-0 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto border-r border-gray-200 bg-white">
          <SidebarContent pathname={pathname} />
        </aside>

        {/* Mobile drawer */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col overflow-y-auto">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <span className="font-bold text-gray-800">Documentation</span>
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                  <XMarkIcon className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <SidebarContent pathname={pathname} onNavigate={() => setSidebarOpen(false)} />
            </aside>
          </div>
        )}

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 min-w-0 mt-12 md:mt-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 px-3 py-6 space-y-6">
      {/* Brand */}
      <div className="px-3 mb-2">
        <Link href="/docs" onClick={onNavigate} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-sm">
            <BookOpenIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-none">Arogya AI</p>
            <p className="text-xs text-gray-400 mt-0.5">Documentation</p>
          </div>
        </Link>
      </div>

      <div className="h-px bg-gray-100" />

      {navSections.map((section) => (
        <div key={section.label}>
          <div className="flex items-center gap-2 px-3 mb-2">
            <section.icon className={`w-3.5 h-3.5 ${section.color}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{section.label}</span>
          </div>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group ${
                      active
                        ? 'bg-teal-50 text-teal-700 border border-teal-100'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className={`w-4 h-4 shrink-0 ${active ? 'text-teal-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
                    <span>{item.label}</span>
                    {active && <ChevronRightIcon className="w-3 h-3 ml-auto text-teal-500" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div className="h-px bg-gray-100" />

      <div className="px-3 py-3 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100">
        <p className="text-xs font-semibold text-teal-800 mb-1">Live API</p>
        <p className="text-xs text-teal-600 leading-relaxed">
          Backend running at{' '}
          <a href="https://arogyaai.duckdns.org" target="_blank" rel="noopener noreferrer" className="underline font-medium">
            arogyaai.duckdns.org
          </a>
        </p>
      </div>
    </nav>
  );
}
