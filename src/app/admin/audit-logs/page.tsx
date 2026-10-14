import React from 'react';
import prisma from '@/modules/core/db';
import { formatDate } from '@/modules/i18n';
import { History, ShieldCheck, User } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminAuditLogsPage() {
  const logs = await prisma.auditLog.findMany({
    take: 50,
    orderBy: { createdAt: 'desc' },
    include: {
      actor: {
        select: { name: true, phone: true, role: true },
      },
    },
  });

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Audit Trail & Compliance Logs</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Append-only statutory audit trail logging every document review, price approval, publication transition, and private document view.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Action</th>
                <th className="p-4">Entity</th>
                <th className="p-4">Reason / Notes</th>
                <th className="p-4">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {formatDate(log.createdAt)} {new Date(log.createdAt).toLocaleTimeString()}
                  </td>

                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">
                      {log.actor?.name || 'System / Unauth'}
                    </span>
                    {log.actor && (
                      <span className="text-[10px] text-slate-400">
                        {log.actor.role} • +91 {log.actor.phone}
                      </span>
                    )}
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[10px] font-bold text-slate-800">
                      {log.action}
                    </span>
                  </td>

                  <td className="p-4 font-semibold text-slate-700">
                    {log.entityType} ({log.entityId.slice(0, 8)}...)
                  </td>

                  <td className="p-4 text-slate-600 text-[11px] max-w-xs truncate">
                    {log.reason || 'Standard operational event'}
                  </td>

                  <td className="p-4 font-mono text-slate-400 text-[11px]">{log.ip || '127.0.0.1'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
