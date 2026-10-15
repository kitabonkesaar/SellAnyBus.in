import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Phone, Mail, MapPin, MessageSquare, Clock } from 'lucide-react';

export const metadata = {
  title: 'Contact SellAnyBus.in | Commercial Bus Support Bhubaneswar, Odisha',
  description:
    'Contact SellAnyBus.in operations desk in Bhubaneswar, Odisha. Speak to commercial fleet advisors, schedule on-site depot inspections, or request RTO permit guidance.',
  keywords: [
    'sellanybus contact',
    'commercial bus dealer bhubaneswar phone',
    'used bus inspection request odisha',
    'bus rto assistance odisha phone',
  ],
  alternates: {
    canonical: 'https://sellanybus.in/contact',
  },
  openGraph: {
    title: 'Contact SellAnyBus.in | Commercial Fleet Advisors in Odisha',
    description: 'Reach our transport operations desk in Bhubaneswar, Odisha for vehicle listings, physical inspections, and RTO transfers.',
    locale: 'en_IN',
    type: 'website',
    url: 'https://sellanybus.in/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B3C8C]">We Are Here to Help</span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
              Get in Touch with Our Commercial Team
            </h1>
            <p className="text-slate-600 text-sm mt-3">
              Have questions regarding bus listings, physical inspection scheduling, or RTO documentation? Contact our dedicated advisors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0B3C8C] flex items-center justify-center mx-auto mb-4 font-bold">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Direct Phone Support</h3>
              <a href="tel:+919876543210" className="text-sm font-black text-[#0B3C8C] hover:underline block">
                +91 98765 43210
              </a>
              <span className="text-xs text-slate-500 block mt-1">Mon - Sat, 9:00 AM - 7:00 PM</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 font-bold">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">WhatsApp Commercial Desk</h3>
              <a href="https://wa.me/919876543210" target="_blank" className="text-sm font-black text-emerald-700 hover:underline block">
                Chat on WhatsApp
              </a>
              <span className="text-xs text-slate-500 block mt-1">Instant photo & inspection requests</span>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 font-bold">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 mb-1">Official Email</h3>
              <a href="mailto:support@sellanybus.in" className="text-sm font-black text-slate-900 hover:underline block">
                support@sellanybus.in
              </a>
              <span className="text-xs text-slate-500 block mt-1">Institutional & fleet tie-ups</span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <MapPin className="w-6 h-6 text-[#0B3C8C] shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-base text-slate-900">Registered Odisha Office</h3>
              <p className="text-sm text-slate-600 mt-1">
                SellAnyBus India Pvt. Ltd.<br />
                Tower 3, Infocity IT Park, Patia, Bhubaneswar, Odisha 751024
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
