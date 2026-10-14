import React from 'react';
import Link from 'next/link';
import prisma from '@/modules/core/db';
import { formatINR, formatIndianNumber, formatDate } from '@/modules/i18n';
import {
  Users,
  Bus,
  FileCheck2,
  Wrench,
  MessageSquare,
  TrendingUp,
  Receipt,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const totalUsers = await prisma.user.count();
  const publishedCount = await prisma.listing.count({ where: { publicationStatus: 'PUBLISHED' } });
  const pendingDocsCount = await prisma.vehicleDocument.count({ where: { status: 'PENDING' } });
  const inspectionQueueCount = await prisma.inspection.count({ where: { status: { in: ['SCHEDULED', 'IN_PROGRESS'] } } });
  const totalEnquiries = await prisma.enquiry.count();
  const qualifiedLeadsCount = await prisma.lead.count({ where: { stage: { in: ['QUALIFIED', 'NEGOTIATION', 'BOOKING_AGREEMENT'] } } });
  const transactions = await prisma.transaction.findMany({
    where: { paymentStatus: 'CONFIRMED' },
    select: { agreedPrice: true, feeAmount: true },
  });
  const recentEnquiries = await prisma.enquiry.findMany({
    take: 6,
    orderBy: { createdAt: 'desc' },
    include: {
      listing: {
        include: {
          vehicle: { select: { make: true, model: true, registrationNumber: true } },
        },
      },
      lead: true,
    },
  });

  const totalGMV = transactions.reduce((acc, t) => acc + t.agreedPrice, 0);
  const totalCommission = transactions.reduce((acc, t) => acc + t.feeAmount, 0);
  const conversionRate = totalEnquiries > 0 ? ((transactions.length / totalEnquiries) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Executive Operations Dashboard</h1>
        <p className="text-xs text-slate-500 mt-1">
          Real-time metrics on Odisha vehicle verification throughput, inspections, and mediated transactions.
        </p>
      </div>

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span>ACTIVE INVENTORY</span>
            <Bus className="w-4 h-4 text-[#0B3C8C]" />
          </div>
          <div className="text-2xl font-black text-slate-900">{publishedCount}</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            Published & Verified Live
          </span>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span>DOCUMENT QUEUE</span>
            <FileCheck2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-600">{pendingDocsCount}</div>
          <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
            Pending RTO verification
          </span>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span>INSPECTION QUEUE</span>
            <Wrench className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-700">{inspectionQueueCount}</div>
          <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
            Assigned to field inspectors
          </span>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
            <span>QUALIFIED LEADS</span>
            <MessageSquare className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{qualifiedLeadsCount}</div>
          <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
            Of {totalEnquiries} total buyer enquiries
          </span>
        </div>
      </div>

      {/* REVENUE & CONVERSION SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-[#072458] to-[#0B3C8C] text-white shadow-md">
          <span className="text-xs font-bold text-blue-200 uppercase tracking-wider block mb-1">
            Settled Transaction GMV
          </span>
          <div className="text-3xl font-black text-amber-400">{formatINR(totalGMV)}</div>
          <div className="mt-3 text-xs text-blue-100 flex items-center justify-between pt-3 border-t border-white/10">
            <span>Commission Revenue:</span>
            <strong className="text-white font-bold">{formatINR(totalCommission)}</strong>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Enquiry to Sale Conversion
            </span>
            <div className="text-3xl font-black text-slate-900">{conversionRate}%</div>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {transactions.length} buses completed ownership transfer in Odisha.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Registered Users
            </span>
            <div className="text-3xl font-black text-slate-900">{totalUsers}</div>
          </div>
          <div className="text-xs text-slate-500 flex gap-2">
            <Link href="/admin/verifications" className="text-[#0B3C8C] font-bold hover:underline">
              Review Documents →
            </Link>
          </div>
        </div>
      </div>

      {/* RECENT ENQUIRIES & LEADS TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900">Recent Qualified Buyer Enquiries</h2>
            <p className="text-xs text-slate-500">Flowing into sales pipeline with buyer contact details</p>
          </div>
          <Link href="/admin/leads" className="text-xs font-bold text-[#0B3C8C] hover:underline flex items-center gap-1">
            <span>View Full Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100">
              <tr>
                <th className="p-4">Buyer Name</th>
                <th className="p-4">Mobile</th>
                <th className="p-4">Bus Requested</th>
                <th className="p-4">Application</th>
                <th className="p-4">Stage</th>
                <th className="p-4">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {recentEnquiries.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-900">{e.name}</td>
                  <td className="p-4 font-semibold text-slate-600">+91 {e.phone}</td>
                  <td className="p-4">
                    <span className="font-bold text-slate-900 block">
                      {e.listing.vehicle.make} {e.listing.vehicle.model}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Reg: {e.listing.vehicle.registrationNumber}
                    </span>
                  </td>
                  <td className="p-4">{e.intendedUse}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-blue-100 text-[#0B3C8C] font-bold text-[10px]">
                      {e.lead?.stage || 'NEW'}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{formatDate(e.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
