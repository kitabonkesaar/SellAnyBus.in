import React from 'react';
import Link from 'next/link';
import prisma from '@/modules/core/db';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BusCard } from '@/components/marketplace/BusCard';
import { BusCategory, PublicationStatus } from '@prisma/client';
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  Wrench,
  Award,
  ArrowRight,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  PhoneCall,
  MessageSquare,
  HelpCircle,
  Truck,
} from 'lucide-react';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'SellAnyBus.in | Verified Used Commercial Buses & Coaches in Odisha',
  description:
    'Buy and sell verified used buses in Odisha with 14-point mechanical inspection, RTO document checks, and seller-approved pricing across all 30 districts.',
  openGraph: {
    title: 'SellAnyBus.in - Odisha Verified Commercial Bus Marketplace',
    description: 'Verified AC Sleepers, Route Seaters, School Buses, and Coaches in Odisha.',
    locale: 'en_IN',
    type: 'website',
  },
};

const CATEGORIES = [
  {
    key: 'AC_SLEEPER',
    name: 'AC Sleeper Coach',
    desc: 'Interstate luxury sleepers with upper/lower berths',
    count: '6 Available',
    icon: '🛌',
  },
  {
    key: 'SEATER',
    name: 'Express Route Seater',
    desc: '32 to 55 seat stage carriage & express route buses',
    count: '8 Available',
    icon: '💺',
  },
  {
    key: 'SCHOOL_BUS',
    name: 'School & College Bus',
    desc: 'Supreme court guideline compliant safety buses',
    count: '4 Available',
    icon: '🎒',
  },
  {
    key: 'STAFF_BUS',
    name: 'Staff & Industrial Bus',
    desc: 'Corporate & worker executive transport buses',
    count: '3 Available',
    icon: '🏢',
  },
  {
    key: 'TOURIST_COACH',
    name: 'Luxury Tourist Coach',
    desc: 'Air-suspended coaches with AITP national permits',
    count: '4 Available',
    icon: '🌴',
  },
  {
    key: 'MINI_BUS',
    name: 'Mini Bus / Traveller',
    desc: '17 to 26 seater commercial passenger vans',
    count: '5 Available',
    icon: '🚐',
  },
];

export default async function HomePage() {
  // Fetch featured listings
  const featuredListings = await prisma.listing.findMany({
    where: {
      publicationStatus: PublicationStatus.PUBLISHED,
      featured: true,
    },
    take: 6,
    orderBy: { publishedAt: 'desc' },
    include: {
      vehicle: {
        include: {
          media: { where: { isPrimary: true }, take: 1 },
        },
      },
    },
  });

  // Fetch recently listed buses
  const recentListings = await prisma.listing.findMany({
    where: {
      publicationStatus: PublicationStatus.PUBLISHED,
    },
    take: 8,
    orderBy: { publishedAt: 'desc' },
    include: {
      vehicle: {
        include: {
          media: { where: { isPrimary: true }, take: 1 },
        },
      },
    },
  });

  // Fetch testimonials & FAQs from ContentItem table sequentially
  const testimonials = await prisma.contentItem.findMany({
    where: { type: 'TESTIMONIAL', active: true },
    orderBy: { order: 'asc' },
    take: 3,
  });
  const faqs = await prisma.contentItem.findMany({
    where: { type: 'FAQ', active: true },
    orderBy: { order: 'asc' },
    take: 5,
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative bg-gradient-to-br from-[#072458] via-[#0B3C8C] to-[#1e3a8a] text-white py-16 lg:py-24 overflow-hidden">
          {/* Subtle grid pattern background */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              {/* Trust Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-amber-300 mb-6">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Odisha&apos;s #1 Verified Commercial Bus Marketplace</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
                Buy & Sell Verified Used Buses in Odisha with{' '}
                <span className="text-amber-400 underline decoration-amber-400/50 underline-offset-8">
                  Total Confidence
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed font-normal">
                No random classifieds. Every bus features verified RTO documents, a certified 14-point mechanical report, and seller-approved pricing across all 30 districts.
              </p>

              {/* SEARCH BOX */}
              <form
                action="/buses"
                method="GET"
                className="bg-white p-3 rounded-2xl shadow-2xl flex flex-col sm:flex-row gap-3 items-stretch max-w-2xl"
              >
                <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
                  <Search className="w-5 h-5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    name="q"
                    placeholder="Search Tata, Volvo, Sleeper, School Bus, Cuttack..."
                    className="w-full bg-transparent text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    name="district"
                    className="bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none min-h-[44px]"
                  >
                    <option value="">All Odisha</option>
                    <option value="Khordha">Bhubaneswar</option>
                    <option value="Cuttack">Cuttack</option>
                    <option value="Puri">Puri</option>
                    <option value="Sambalpur">Sambalpur</option>
                    <option value="Sundargarh">Rourkela</option>
                    <option value="Ganjam">Berhampur</option>
                  </select>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 min-h-[44px]"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Quick stats banner */}
              <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-white/10 text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">100%</div>
                  <div className="text-xs text-blue-200 mt-0.5">RTO Verified Documents</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">14-Point</div>
                  <div className="text-xs text-blue-200 mt-0.5">Physical Inspection</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-amber-400">30</div>
                  <div className="text-xs text-blue-200 mt-0.5">Odisha Districts Covered</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORY TILES */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0B3C8C]">
                Explore Fleet Inventory
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Commercial Bus Categories
              </h2>
            </div>
            <Link
              href="/buses"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0B3C8C] hover:text-[#082a63]"
            >
              <span>View All 24 Buses</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.key}
                href={`/buses?category=${cat.key}`}
                className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-[#0B3C8C] hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl mb-3">{cat.icon}</div>
                  <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#0B3C8C] transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-[#0B3C8C]">
                  <span>{cat.count}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* FEATURED LISTINGS */}
        {featuredListings.length > 0 && (
          <section className="py-16 bg-white border-y border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider mb-2">
                    Verified Highlights
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                    Featured Commercial Buses
                  </h2>
                </div>
                <Link
                  href="/buses?featured=true"
                  className="text-sm font-bold text-[#0B3C8C] hover:underline"
                >
                  Explore All Featured
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredListings.map((item) => (
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
          </section>
        )}

        {/* RECENTLY LISTED INVENTORY */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0B3C8C]">
                Freshly Inspected
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Recently Listed Inventory
              </h2>
            </div>
            <Link
              href="/buses"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0B3C8C] hover:text-[#082a63]"
            >
              <span>See All Listings ({recentListings.length})</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentListings.map((item) => (
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
        </section>

        {/* HOW IT WORKS */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Managed Trust Model
              </span>
              <h2 className="text-3xl sm:text-4xl font-black mt-2">
                How SellAnyBus Works for You
              </h2>
              <p className="text-slate-400 text-sm mt-3">
                We handle document verification, mechanical condition, and price validation before a single buyer enquiry is made.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* For Sellers */}
              <div className="p-8 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4">
                  For Bus Sellers & Operators
                </div>
                <h3 className="text-xl font-bold mb-4">Sell at True Value in 4 Steps</h3>
                <div className="space-y-4 text-sm text-slate-300">
                  <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">1</span>
                    <div>
                      <strong className="text-white block">Submit Bus Online:</strong>
                      Fill vehicle specs and upload RC, fitness, insurance, and min 6 photos.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">2</span>
                    <div>
                      <strong className="text-white block">Physical 14-Point Inspection:</strong>
                      Our certified inspector evaluates engine, air brakes, chassis, and tyres.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">3</span>
                    <div>
                      <strong className="text-white block">Approve Recommended Price:</strong>
                      Review our data-backed market valuation and approve the final asking price.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">4</span>
                    <div>
                      <strong className="text-white block">Direct Qualified Buyers:</strong>
                      Enquiries flow through our sales advisors. Receive verified offers.
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-700">
                  <Link
                    href="/seller/vehicles/new"
                    className="inline-flex items-center gap-2 text-amber-400 font-bold hover:underline"
                  >
                    <span>Start Selling Your Bus</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* For Buyers */}
              <div className="p-8 rounded-2xl bg-slate-800/80 border border-slate-700">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-4">
                  For Fleet Buyers & Tour Companies
                </div>
                <h3 className="text-xl font-bold mb-4">Buy Zero-Risk Commercial Buses</h3>
                <div className="space-y-4 text-sm text-slate-300">
                  <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#0B3C8C] text-white font-black text-xs flex items-center justify-center shrink-0">1</span>
                    <div>
                      <strong className="text-white block">Search Verified Fleet:</strong>
                      Filter by seating capacity, sleeper config, Odisha district, make, and AC type.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#0B3C8C] text-white font-black text-xs flex items-center justify-center shrink-0">2</span>
                    <div>
                      <strong className="text-white block">Transparent Inspection Report:</strong>
                      Review mechanical scores, tyre tread depth, and document checklist status.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#0B3C8C] text-white font-black text-xs flex items-center justify-center shrink-0">3</span>
                    <div>
                      <strong className="text-white block">Qualified Commercial Advisory:</strong>
                      Submit enquiry to connect directly with dedicated sales advisors.
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#0B3C8C] text-white font-black text-xs flex items-center justify-center shrink-0">4</span>
                    <div>
                      <strong className="text-white block">Guided RTO Transfer:</strong>
                      Complete Form 29/30, permit transfer, and NOC with end-to-end guidance.
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-700">
                  <Link
                    href="/buses"
                    className="inline-flex items-center gap-2 text-blue-400 font-bold hover:underline"
                  >
                    <span>Browse All Available Buses</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 14-POINT INSPECTION BANNER */}
        <section className="py-16 bg-blue-50 border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0B3C8C] text-white text-xs font-bold uppercase tracking-wider mb-4">
                  <Wrench className="w-3.5 h-3.5" />
                  Technical Excellence
                </div>
                <h2 className="text-3xl font-black text-slate-900 leading-tight">
                  Every Bus Evaluated Across 14 Commercial Checklist Points
                </h2>
                <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                  Heavy passenger vehicles require rigorous safety assessment. Our certified inspectors conduct thorough physical and diagnostic evaluations before recommending market valuations.
                </p>

                <div className="grid grid-cols-2 gap-3 mt-6 text-xs text-slate-800 font-semibold">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Engine & Turbo Blow-by</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Transmission & Clutch Free Play</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Full Air Brake Pressure Build</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Air Bellows & Leaf Springs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Radial Tyre Tread Depth (mm)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Chassis Alignment & Rust Check</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Emergency Exits & SC Compliance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Chassis Plate & RC Matching</span>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href="/inspection-services"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0B3C8C] hover:bg-[#082a63] text-white font-bold text-sm shadow-md transition-colors"
                  >
                    <span>Read Full Inspection Standard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-blue-200 shadow-md">
                <h3 className="font-bold text-base text-slate-900 mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  Sample Certified Inspection Summary
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Inspection Standard:</span>
                    <span className="font-bold text-slate-800">Commercial Bus 14-Point v2.0</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Mechanical Health Score:</span>
                    <span className="font-black text-emerald-600 text-sm">91.5 / 100</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Air Brakes Build Time:</span>
                    <span className="font-bold text-slate-800">2 min 40 sec (Pass)</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-100">
                    <span className="text-slate-500">Average Tyre Tread:</span>
                    <span className="font-bold text-slate-800">8.2 mm (75% Life Left)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Physical Engine Stamp:</span>
                    <span className="font-bold text-emerald-600">Matched with RTO records</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        {testimonials.length > 0 && (
          <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0B3C8C]">
                Real Operator Feedback
              </span>
              <h2 className="text-3xl font-black text-slate-900 mt-1">
                Trusted by Fleet Owners Across Odisha
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div
                  key={t.id}
                  className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="text-amber-400 text-base mb-3">★★★★★</div>
                    <h3 className="font-bold text-base text-slate-900 mb-2">
                      &quot;{t.title}&quot;
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {t.body}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-500 font-semibold">
                    {/* Author from meta */}
                    {(t.meta as { author?: string })?.author || 'Fleet Operator, Odisha'}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ ACCORDION */}
        {faqs.length > 0 && (
          <section className="py-16 bg-white border-t border-slate-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0B3C8C]">
                  Clear Answers
                </span>
                <h2 className="text-3xl font-black text-slate-900 mt-1">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-4">
                {faqs.map((f) => (
                  <details
                    key={f.id}
                    className="group p-5 rounded-xl border border-slate-200 bg-slate-50 open:bg-white open:shadow-sm transition-all"
                  >
                    <summary className="font-bold text-sm text-slate-900 cursor-pointer list-none flex justify-between items-center">
                      <span>{f.title}</span>
                      <span className="text-[#0B3C8C] group-open:rotate-180 transition-transform font-bold text-lg">
                        ↓
                      </span>
                    </summary>
                    <p className="text-xs sm:text-sm text-slate-600 mt-3 pt-3 border-t border-slate-200 leading-relaxed">
                      {f.body}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* BOTTOM CTA STRIP */}
        <section className="bg-amber-500 text-slate-950 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black">
                Ready to Sell Your Bus in Odisha?
              </h2>
              <p className="text-slate-900 text-sm mt-1 font-medium">
                Get RTO document clearance, certified inspection, and qualified buyers with zero upfront listing fees.
              </p>
            </div>
            <Link
              href="/seller/vehicles/new"
              className="px-8 py-3.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-black text-sm shadow-xl whitespace-nowrap min-h-[48px] flex items-center justify-center gap-2"
            >
              <span>List Your Bus Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
