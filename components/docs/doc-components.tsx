'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

// ── Page Header ──────────────────────────────────────────────────────────────
export function DocPageHeader({
  badge,
  title,
  description,
}: {
  badge: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-10 pb-8 border-b border-gray-200">
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100 mb-4">
        {badge}
      </span>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 leading-tight">{title}</h1>
      <p className="text-lg text-gray-500 leading-relaxed max-w-2xl">{description}</p>
    </div>
  );
}

// ── Section ───────────────────────────────────────────────────────────────────
export function DocSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-12 scroll-mt-24">
      <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
        <span className="w-1 h-5 rounded-full bg-gradient-to-b from-teal-500 to-cyan-500 inline-block" />
        {title}
      </h2>
      {children}
    </section>
  );
}

// ── Sub-section ───────────────────────────────────────────────────────────────
export function DocSubSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      <h3 className="text-base font-semibold text-gray-800 mb-3">{title}</h3>
      {children}
    </div>
  );
}

// ── Code Block ────────────────────────────────────────────────────────────────
export function CodeBlock({
  code,
  language = 'bash',
  title,
}: {
  code: string;
  language?: string;
  title?: string;
}) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 mb-4">
      {title && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 border-b border-gray-700">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-xs text-gray-400 font-mono ml-1">{title}</span>
        </div>
      )}
      <pre className={`bg-gray-900 text-gray-100 text-sm font-mono p-5 overflow-x-auto leading-relaxed ${!title ? 'rounded-xl' : ''}`}>
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}

// ── Info Card ─────────────────────────────────────────────────────────────────
export function InfoCard({
  type = 'info',
  title,
  children,
}: {
  type?: 'info' | 'warning' | 'success' | 'danger';
  title?: string;
  children: React.ReactNode;
}) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    danger: 'bg-red-50 border-red-200 text-red-800',
  };
  const icons = { info: 'ℹ️', warning: '⚠️', success: '✅', danger: '🚨' };

  return (
    <div className={`rounded-xl border p-4 mb-4 ${styles[type]}`}>
      {title && (
        <p className="font-semibold text-sm mb-1.5">
          {icons[type]} {title}
        </p>
      )}
      <div className="text-sm leading-relaxed">{children}</div>
    </div>
  );
}

// ── Property Table ────────────────────────────────────────────────────────────
export function PropTable({
  rows,
}: {
  rows: { name: string; type: string; required?: boolean; description: string }[];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 mb-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-semibold text-gray-700">Field</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-700">Type</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-700">Required</th>
            <th className="text-left px-4 py-3 font-semibold text-gray-700">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
              <td className="px-4 py-3 font-mono text-teal-700 font-medium">{row.name}</td>
              <td className="px-4 py-3 font-mono text-blue-600 text-xs">{row.type}</td>
              <td className="px-4 py-3">
                {row.required !== false ? (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-100">required</span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">optional</span>
                )}
              </td>
              <td className="px-4 py-3 text-gray-600">{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── API Endpoint Card ─────────────────────────────────────────────────────────
export function ApiEndpoint({
  method,
  path,
  description,
  children,
}: {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
  path: string;
  description: string;
  children?: React.ReactNode;
}) {
  const methodColors = {
    GET: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    POST: 'bg-blue-100 text-blue-700 border-blue-200',
    PATCH: 'bg-amber-100 text-amber-700 border-amber-200',
    DELETE: 'bg-red-100 text-red-700 border-red-200',
    PUT: 'bg-orange-100 text-orange-700 border-orange-200',
  };

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden mb-5">
      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-b border-gray-200">
        <span className={`px-2.5 py-1 rounded-md text-xs font-bold border font-mono ${methodColors[method]}`}>
          {method}
        </span>
        <code className="text-sm font-mono text-gray-800 font-medium">{path}</code>
      </div>
      <div className="px-4 py-3">
        <p className="text-sm text-gray-600 mb-3">{description}</p>
        {children}
      </div>
    </div>
  );
}

// ── Feature Card ──────────────────────────────────────────────────────────────
export function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 hover:border-teal-200 hover:shadow-sm transition-all duration-200">
      <div className="text-2xl mb-3">{icon}</div>
      <h4 className="font-semibold text-gray-900 mb-1.5">{title}</h4>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

// ── Step List ─────────────────────────────────────────────────────────────────
export function StepList({ steps }: { steps: { title: string; description: string }[] }) {
  return (
    <ol className="space-y-4 mb-4">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-4">
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-xs font-bold flex items-center justify-center mt-0.5 shadow-sm">
            {i + 1}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{step.title}</p>
            <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{step.description}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

// ── Breadcrumb ────────────────────────────────────────────────────────────────
export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6">
      {items.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 && <ChevronRightIcon className="w-3 h-3" />}
          {item.href ? (
            <Link href={item.href} className="hover:text-teal-600 transition-colors">{item.label}</Link>
          ) : (
            <span className="text-gray-600 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

// ── Next/Prev Navigation ──────────────────────────────────────────────────────
export function DocNavigation({
  prev,
  next,
}: {
  prev?: { href: string; label: string };
  next?: { href: string; label: string };
}) {
  return (
    <div className="flex items-center justify-between mt-16 pt-8 border-t border-gray-200">
      {prev ? (
        <Link href={prev.href} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors group">
          <ChevronRightIcon className="w-4 h-4 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
          <div>
            <p className="text-xs text-gray-400">Previous</p>
            <p>{prev.label}</p>
          </div>
        </Link>
      ) : <div />}
      {next ? (
        <Link href={next.href} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors group text-right">
          <div>
            <p className="text-xs text-gray-400">Next</p>
            <p>{next.label}</p>
          </div>
          <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      ) : <div />}
    </div>
  );
}
