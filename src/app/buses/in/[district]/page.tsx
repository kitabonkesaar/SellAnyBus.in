import React from 'react';
import Link from 'next/link';
import prisma from '@/modules/core/db';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BusCard } from '@/components/marketplace/BusCard';
import { PublicationStatus } from '@prisma/client';
import {
  MapPin,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Bus,
  FileCheck2,
  PhoneCall,
  Sparkles,
} from 'lucide-react';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface DistrictPageProps {
  params: Promise<{ district: string }>;
}

const DISTRICT_RTO_MAP: Record<string, string> = {
  Balasore: 'OD-01',
  Khordha: 'OD-02 / OD-33 (Bhubaneswar)',
  Bolangir: 'OD-03',
  Chandikhol: 'OD-04',
  Cuttack: 'OD-05 / OD-34',
  Dhenkanal: 'OD-06',
  Ganjam: 'OD-07 / OD-32 (Berhampur / Bhanjanagar)',
  Kalahandi: 'OD-08 (Bhawanipatna)',
  Keonjhar: 'OD-09',
  Koraput: 'OD-10 (Jeypore)',
  Mayurbhanj: 'OD-11 (Baripada / Rairangpur)',
  Phulbani: 'OD-12 (Kandhamal)',
  Puri: 'OD-13',
  Sundargarh: 'OD-14 / OD-16 (Rourkela)',
  Sambalpur: 'OD-15',
  Bargarh: 'OD-17',
  Rayagada: 'OD-18',
  Angul: 'OD-19',
  Gajapati: 'OD-20 (Paralakhemundi)',
  Jagatsinghpur: 'OD-21',
  Bhadrak: 'OD-22',
  Jharsuguda: 'OD-23',
  Nabarangpur: 'OD-24',
  Nayagarh: 'OD-25',
  Nuapada: 'OD-26',
  Boudh: 'OD-27',
  Debagarh: 'OD-28 (Deogarh)',
  Kendrapara: 'OD-29',
  Malkangiri: 'OD-30',
  Subarnapur: 'OD-31 (Sonepur)',
};

const POPULAR_DISTRICTS = [
  'Khordha',
  'Cuttack',
  'Sambalpur',
  'Sundargarh',
  'Ganjam',
  'Balasore',
  'Angul',
  'Jharsuguda',
  'Puri',
  'Bargarh',
];

export async function generateMetadata({ params }: DistrictPageProps): Promise<Metadata> {
  const { district: rawDistrict } = await params;
  const district = decodeURIComponent(rawDistrict);
  const rto = DISTRICT_RTO_MAP[district] || 'Odisha';

  const title = `Used Commercial Buses & Coaches for Sale in ${district} (${rto}) | SellAnyBus.in`;
  const description = `Browse 100% verified used buses, AC sleepers, school buses, and trucks in ${district}, Odisha. 14-point mechanical inspection, RTO title clearance, and ₹0 buyer brokerage.`;

  return {
    title,
    description,
    keywords: [
      `sell bus in ${district}`,
      `used bus for sale ${district}`,
      `buy bus in ${district} odisha`,
      `commercial bus ${district}`,
      `school bus for sale ${district}`,
      `RTO ${district} bus transfer`,
      `tourist coach ${district}`,
    ],
    alternates: {
      canonical: `https://sellanybus.in/buses/in/${encodeURIComponent(district)}`,
    },
    openGraph: {
      title,
      description,
      locale: 'en_IN',
      type: 'website',
      url: `https://sellanybus.in/buses/in/${encodeURIComponent(district)}`,
    },
  };
}

export default async function DistrictLandingPage({ params }: DistrictPageProps) {
  const { district: rawDistrict } = await params;
  const district = decodeURIComponent(rawDistrict);
  const rtoCode = DISTRICT_RTO_MAP[district] || 'Odisha Commercial RTO';

  // Fetch listings for this specific district
  const listings = await prisma.listing.findMany({
    where: {
      publicationStatus: PublicationStatus.PUBLISHED,
      vehicle: {
        district: {
          equals: district,
          mode: 'insensitive',
        },
      },
    },
    orderBy: { publishedAt: 'desc' },
    include: {
      vehicle: {
        include: {
          media: { where: { isPrimary: true }, take: 1 },
        },
      },
    },
  });

  // If no buses in this district, fetch other featured listings across Odisha
  const fallbackListings =
    listings.length === 0
      ? await prisma.listing.findMany({
          where: { publicationStatus: PublicationStatus.PUBLISHED },
          take: 6,
          orderBy: { publishedAt: 'desc' },
          include: {
            vehicle: {
              include: {
                media: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        })
      : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Used Commercial Buses in ${district}, Odisha`,
    description: `Verified used commercial buses and coaches available in ${district}, Odisha with 14-point mechanical inspection reports and verified RTO documents.`,
    url: `https://sellanybus.in/buses/in/${encodeURIComponent(district)}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://sellanybus.in' },
        { '@type': 'ListItem', position: 2, name: 'Buses', item: 'https://sellanybus.in/buses' },
        { '@type': 'ListItem', position: 3, name: district, item: `https://sellanybus.in/buses/in/${encodeURIComponent(district)}` },
      ],
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1 pb-16">
        {/* Header Hero */}
        <section className="bg-gradient-to-br from-[#061e47] via-[#0B3C8C] to-[#123977] text-white py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-xs text-blue-200/80 mb-6 font-medium">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <Link href="/buses" className="hover:text-white transition-colors">Buses</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white font-bold">{district}</span>
            </nav>

            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300 mb-4">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>RTO Jurisdiction: {rtoCode}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
                Verified Used Commercial Buses in {district}, Odisha
              </h1>

              <p className="text-base sm:text-lg text-blue-100/90 max-w-2xl font-normal leading-relaxed">
                Explore inspected stage carriage, contract carriage, school buses, and tourist coaches in {district}. Every vehicle comes with verified RTO documents and a certified 14-point mechanical report.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-white/15 text-xs text-blue-100">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% RTO Title Verified</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  <span>Odisha Fitness & Tax Clearance</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Zero Buyer Brokerage</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Content & Listings */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                {listings.length > 0
                  ? `Active Commercial Buses in ${district} (${listings.length})`
                  : `No Current Listings in ${district} Yet`}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {listings.length > 0
                  ? `Inspected and available for immediate viewing in ${district} transport hubs.`
                  : `Be the first to list a bus in ${district} or explore available stock from nearby districts below.`}
              </p>
            </div>

            <Link
              href="/seller/vehicles/new"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-sm shrink-0"
            >
              <Bus className="w-4 h-4" />
              <span>Sell a Bus in {district}</span>
            </Link>
          </div>

          {/* Active Listings Grid */}
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {listings.map((item) => (
                <BusCard
                  key={item.id}
                  id={item.id}
                  slug={item.slug}
                  make={item.vehicle.make}
                  model={item.vehicle.model}
                  manufactureYear={item.vehicle.manufactureYear}
                  askingPrice={item.askingPrice}
                  odometerKm={item.vehicle.odometerKm}
                  seatingCapacity={item.vehicle.seatingCapacity}
                  sleeperConfig={item.vehicle.sleeperConfig}
                  fuelType={item.vehicle.fuelType}
                  acType={item.vehicle.acType}
                  district={item.vehicle.district}
                  city={item.vehicle.city}
                  featured={item.featured}
                  primaryImageUrl={
                    item.vehicle.media[0]
                      ? `/uploads/${item.vehicle.media[0].storageKey}`
                      : undefined
                  }
                />
              ))}
            </div>
          ) : (
            <div className="mb-16 space-y-10">
              <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 text-center max-w-2xl mx-auto shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 font-black">
                  <Bus className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">
                  Selling a Bus in {district}?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
                  Qualified buyers in {district} are searching for commercial buses right now. List your vehicle with zero upfront cost and our mobile engineers will inspect it at your garage.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/seller/vehicles/new"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0B3C8C] hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                  >
                    List Vehicle for Free (5 Mins)
                  </Link>
                  <Link
                    href="/sell-your-bus"
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                  >
                    How Valuation Works
                  </Link>
                </div>
              </div>

              {fallbackListings.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-slate-900">
                      Featured Buses Available Across Odisha
                    </h3>
                    <Link
                      href="/buses"
                      className="text-xs font-bold text-[#0B3C8C] hover:underline"
                    >
                      View All 24 Buses →
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {fallbackListings.map((item) => (
                      <BusCard
                        key={item.id}
                        id={item.id}
                        slug={item.slug}
                        make={item.vehicle.make}
                        model={item.vehicle.model}
                        manufactureYear={item.vehicle.manufactureYear}
                        askingPrice={item.askingPrice}
                        odometerKm={item.vehicle.odometerKm}
                        seatingCapacity={item.vehicle.seatingCapacity}
                        sleeperConfig={item.vehicle.sleeperConfig}
                        fuelType={item.vehicle.fuelType}
                        acType={item.vehicle.acType}
                        district={item.vehicle.district}
                        city={item.vehicle.city}
                        featured={item.featured}
                        primaryImageUrl={
                          item.vehicle.media[0]
                            ? `/uploads/${item.vehicle.media[0].storageKey}`
                            : undefined
                        }
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* District RTO & Inspection Assistance Callout */}
          <section className="bg-gradient-to-r from-slate-900 to-[#0B3C8C] text-white rounded-3xl p-8 sm:p-12 shadow-lg mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Local Odisha RTO Handholding
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Need Help with Ownership Transfer in {district}?
                </h3>
                <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-2xl">
                  Our compliance team handles the complete transfer cycle at {rtoCode}: Form 28 (NOC), Form 29 & 30 (Notice of Transfer), Tax Token updates, and State Transport Authority (STA) route permit transfers.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3">
                <a
                  href="tel:+919876543210"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call {district} Desk</span>
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-colors border border-white/20"
                >
                  <span>Contact Compliance Team</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Interlinked Districts Cloud for SEO */}
          <section className="p-8 rounded-3xl bg-white border border-slate-200">
            <h3 className="font-black text-base text-slate-900 mb-2">
              Browse Used Commercial Buses in Other Odisha Districts
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Explore regional commercial vehicle markets connected via NH-16, NH-55, and state transit routes.
            </p>

            <div className="flex flex-wrap gap-2.5">
              {POPULAR_DISTRICTS.map((d) => (
                <Link
                  key={d}
                  href={`/buses/in/${encodeURIComponent(d)}`}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    d.toLowerCase() === district.toLowerCase()
                      ? 'bg-[#0B3C8C] text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#0B3C8C] border border-slate-200/80'
                  }`}
                >
                  {d} ({DISTRICT_RTO_MAP[d]?.split(' ')[0] || 'Odisha'})
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
