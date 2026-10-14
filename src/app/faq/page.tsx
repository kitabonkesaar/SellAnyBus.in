import React from 'react';
import prisma from '@/modules/core/db';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Frequently Asked Questions | SellAnyBus.in',
  description: 'Common questions about buying, selling, inspecting, and transferring used buses in Odisha.',
};

export default async function FaqPage() {
  const faqs = await prisma.contentItem.findMany({
    where: { type: 'FAQ', active: true },
    orderBy: { order: 'asc' },
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B3C8C]">Help & Support</span>
            <h1 className="text-3xl font-black text-slate-900 mt-2">Frequently Asked Questions</h1>
            <p className="text-sm text-slate-500 mt-2">
              Everything you need to know about buying, selling, and inspecting commercial buses on SellAnyBus.in.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((f) => (
              <details
                key={f.id}
                className="group p-6 rounded-2xl border border-slate-200 bg-white open:shadow-sm transition-all"
              >
                <summary className="font-bold text-sm text-slate-900 cursor-pointer list-none flex justify-between items-center">
                  <span>{f.title}</span>
                  <span className="text-[#0B3C8C] group-open:rotate-180 transition-transform font-bold text-lg">
                    ↓
                  </span>
                </summary>
                <p className="text-xs sm:text-sm text-slate-600 mt-3 pt-3 border-t border-slate-100 leading-relaxed">
                  {f.body}
                </p>
              </details>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
