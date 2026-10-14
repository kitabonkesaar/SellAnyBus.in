import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import {
  LayoutDashboard,
  Bus,
  FileCheck2,
  Wrench,
  Users2,
  Receipt,
  History,
  Settings,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-5 border-b border-slate-800 bg-white">
          <Logo />
        </div>

        <div className="px-4 py-3 bg-slate-800/60 border-b border-slate-800 text-[11px] font-bold text-amber-400 flex items-center justify-between">
          <span>OPERATIONS CONSOLE</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[9px]">LIVE</span>
        </div>

        <nav className="flex-1 p-3 space-y-1 text-xs font-semibold">
          <Link
            href="/admin"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LayoutDashboard className="w-4 h-4 text-blue-400" />
            <span>KPI Dashboard</span>
          </Link>
          <Link
            href="/admin/listings"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Bus className="w-4 h-4 text-amber-400" />
            <span>Listings Management</span>
          </Link>
          <Link
            href="/admin/verifications"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
          >
            <FileCheck2 className="w-4 h-4 text-emerald-400" />
            <span>Document Queue</span>
          </Link>
          <Link
            href="/admin/leads"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Users2 className="w-4 h-4 text-purple-400" />
            <span>CRM & Leads Pipeline</span>
          </Link>
          <Link
            href="/admin/transactions"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Receipt className="w-4 h-4 text-indigo-400" />
            <span>Transactions & Settlement</span>
          </Link>
          <Link
            href="/admin/audit-logs"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
          >
            <History className="w-4 h-4 text-cyan-400" />
            <span>Audit Trail Logs</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between text-xs text-slate-400 hover:text-white py-1"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between">
          <div className="text-xs font-semibold text-slate-500">
            SellAnyBus Operations Platform • Odisha Region
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-slate-800">Master Admin Logged In</span>
          </div>
        </header>

        <div className="p-8 flex-1">{children}</div>
      </div>
    </div>
  );
}
