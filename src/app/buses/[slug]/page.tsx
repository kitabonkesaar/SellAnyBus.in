import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/modules/core/db';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { EnquiryDrawer } from '@/components/marketplace/EnquiryDrawer';
import { BusCard } from '@/components/marketplace/BusCard';
import { ShareButton, ReportListingButton } from '@/components/marketplace/ShareAndReportButtons';
import { formatINR, formatIndianNumber, formatDate } from '@/modules/i18n';
import { PublicationStatus, DocumentType, DocumentStatus } from '@prisma/client';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  MapPin,
  Calendar,
  Fuel,
  Gauge,
  Users,
  Settings2,
  FileCheck,
  Share2,
  Flag,
  ArrowLeft,
  Wrench,
  Sparkles,
} from 'lucide-react';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

interface BusDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BusDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = await prisma.listing.findUnique({
    where: { slug },
    include: { vehicle: true },
  });

  if (!listing) {
    return { title: 'Bus Not Found | SellAnyBus.in' };
  }

  const title = `${listing.vehicle.manufactureYear} ${listing.vehicle.make} ${listing.vehicle.model} - ${formatINR(listing.askingPrice)} | SellAnyBus.in`;
  const desc = `Verified used commercial bus in ${listing.vehicle.city}, ${listing.vehicle.district}, Odisha. 14-point inspected, RTO document verified.`;

  return {
    title,
    description: desc,
    alternates: {
      canonical: `https://sellanybus.in/buses/${slug}`,
    },
    openGraph: {
      title,
      description: desc,
      locale: 'en_IN',
      type: 'website',
    },
    // Noindex tombstone if sold
    robots: listing.publicationStatus === PublicationStatus.SOLD ? { index: false, follow: false } : undefined,
  };
}

export default async function BusDetailPage({ params }: BusDetailPageProps) {
  const { slug } = await params;

  const listing = await prisma.listing.findUnique({
    where: { slug },
    include: {
      vehicle: {
        include: {
          seller: {
            include: { sellerProfile: true },
          },
          media: {
            orderBy: { position: 'asc' },
          },
          documents: true,
          inspections: {
            where: { status: 'APPROVED' },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
        },
      },
    },
  });

  if (!listing) {
    notFound();
  }

  // Section 7 Visibility Rule: SUSPENDED, REJECTED, ARCHIVED are not public
  if (
    listing.publicationStatus === PublicationStatus.SUSPENDED ||
    listing.publicationStatus === PublicationStatus.ARCHIVED ||
    listing.publicationStatus === PublicationStatus.DRAFT
  ) {
    notFound();
  }

  const isSold = listing.publicationStatus === PublicationStatus.SOLD;
  const { vehicle } = listing;
  const title = `${vehicle.manufactureYear} ${vehicle.make} ${vehicle.model}`;

  // Fetch similar vehicles
  const similarListings = await prisma.listing.findMany({
    where: {
      publicationStatus: PublicationStatus.PUBLISHED,
      id: { not: listing.id },
      vehicle: {
        category: vehicle.category,
      },
    },
    take: 3,
    include: {
      vehicle: {
        include: {
          media: { where: { isPrimary: true }, take: 1 },
        },
      },
    },
  });

  // Document verification checklist state (Per item: Verified / Seller-stated / Not provided)
  const allDocTypes: { type: DocumentType; label: string }[] = [
    { type: DocumentType.RC, label: 'Registration Certificate (RC)' },
    { type: DocumentType.FITNESS, label: 'Commercial Fitness Certificate' },
    { type: DocumentType.PERMIT, label: 'Stage Carriage / Tourist Permit' },
    { type: DocumentType.INSURANCE, label: 'Commercial Vehicle Insurance' },
    { type: DocumentType.TAX, label: 'Odisha Road Tax Token' },
    { type: DocumentType.OWNER_ID, label: 'Registered Owner ID Verification' },
    { type: DocumentType.NOC_HYPOTHECATION, label: 'Bank Lien Release / NOC' },
  ];

  const docMap = new Map(vehicle.documents.map((d) => [d.docType, d.status]));

  // Inspection Checklist
  const latestInspection = vehicle.inspections[0];
  const checklist = (latestInspection?.checklistResults as Record<string, { status: string; note: string }>) || null;

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: title,
    description: vehicle.conditionSummary,
    image: vehicle.media.map((m) => `https://sellanybus.in/uploads/${m.storageKey}`),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: listing.askingPrice,
      availability: isSold ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
    },
    vehicleConfiguration: vehicle.bodyType,
    numberOfDoors: 2,
    fuelType: vehicle.fuelType,
    vehicleTransmission: vehicle.transmission,
    mileageFromOdometer: {
      '@type': 'QuantitativeValue',
      value: vehicle.odometerKm,
      unitCode: 'KMT',
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Top Back & Actions */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/buses"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-[#0B3C8C]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Buses in Odisha</span>
          </Link>

          <div className="flex items-center gap-3">
            <ShareButton title={title} slug={listing.slug} />
          </div>
        </div>

        {/* SOLD Tombstone Alert */}
        {isSold && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-amber-600 text-white font-black text-xs uppercase tracking-wider">
                Vehicle Sold
              </span>
              <p className="text-xs sm:text-sm font-semibold text-amber-950">
                This vehicle has been sold and ownership transfer successfully mediated via SellAnyBus.
              </p>
            </div>
            <Link href="/buses" className="text-xs font-bold text-[#0B3C8C] hover:underline whitespace-nowrap">
              Explore Available Buses →
            </Link>
          </div>
        )}

        {/* Header Block */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0B3C8C] font-bold text-xs uppercase">
                  {vehicle.category.replace('_', ' ')}
                </span>
                <span className="flex items-center gap-1 text-xs text-slate-500 font-semibold">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {vehicle.city}, {vehicle.district}, Odisha
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-xs flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Bus
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                {title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Body: {vehicle.bodyType} • RTO District: {vehicle.district} • Reg Year: {vehicle.registrationYear}
              </p>
            </div>

            <div className="text-left md:text-right flex flex-col md:items-end justify-center">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                Seller-Approved Asking Price
              </span>
              <div className="text-3xl sm:text-4xl font-black text-[#0B3C8C] mt-0.5">
                {formatINR(listing.askingPrice)}
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5">
                Indicative Valuation Approved • RTO Guidance Included
              </span>
            </div>
          </div>
        </div>

        {/* Layout Grid: Gallery & Details (Left) + Enquiry Drawer & Seller Block (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLS: Gallery, Specs, Verification, Condition, Inspection */}
          <div className="lg:col-span-2 space-y-8">
            {/* PHOTO GALLERY */}
            <section className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
              {/* Main Photo Showcase */}
              <div className="relative aspect-[16/9] bg-slate-900 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                <div
                  className="w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: vehicle.media[0]
                      ? `url(/uploads/${vehicle.media[0].storageKey})`
                      : `linear-gradient(135deg, #072458 0%, #0B3C8C 100%)`,
                  }}
                />
                {!vehicle.media[0] && (
                  <div className="text-white/40 font-black text-3xl uppercase tracking-widest">
                    {vehicle.make} {vehicle.model}
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {vehicle.media.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-3">
                  {vehicle.media.map((m, idx) => (
                    <div
                      key={m.id}
                      className="aspect-[4/3] rounded-lg bg-slate-100 border border-slate-200 overflow-hidden cursor-pointer hover:border-[#0B3C8C]"
                    >
                      <div
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url(/uploads/${m.storageKey})` }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* SPECS TABLE */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-[#0B3C8C]" />
                Technical & Commercial Specifications
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Make & Brand</span>
                  <span className="font-bold text-slate-800 text-sm">{vehicle.make}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Model Variant</span>
                  <span className="font-bold text-slate-800 text-sm">{vehicle.model}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Manufacture Year</span>
                  <span className="font-bold text-slate-800 text-sm">{vehicle.manufactureYear}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Registration Year</span>
                  <span className="font-bold text-slate-800 text-sm">{vehicle.registrationYear}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Odometer Reading</span>
                  <span className="font-bold text-slate-800 text-sm">{formatIndianNumber(vehicle.odometerKm)} km</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Seating Capacity</span>
                  <span className="font-bold text-slate-800 text-sm">{vehicle.seatingCapacity} Passengers</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Sleeper Configuration</span>
                  <span className="font-bold text-slate-800 text-sm">{vehicle.sleeperConfig || 'None (Seater Layout)'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">AC Cooling System</span>
                  <span className="font-bold text-slate-800 text-sm">{vehicle.acType === 'AC' ? 'Air Conditioned' : 'Non-AC'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Fuel Type</span>
                  <span className="font-bold text-slate-800 text-sm capitalize">{vehicle.fuelType.toLowerCase()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Transmission</span>
                  <span className="font-bold text-slate-800 text-sm capitalize">{vehicle.transmission.toLowerCase()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Body Style</span>
                  <span className="font-bold text-slate-800 text-sm">{vehicle.bodyType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Exterior Colour</span>
                  <span className="font-bold text-slate-800 text-sm">{vehicle.colour}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Ownership Serial</span>
                  <span className="font-bold text-slate-800 text-sm">{vehicle.ownersCount} Owner(s) on RC</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Commercial Permit</span>
                  <span className="font-bold text-slate-800 text-sm">{vehicle.permitType || 'State Carriage Valid'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Hypothecation (Bank Loan)</span>
                  <span className="font-bold text-slate-800 text-sm">
                    {vehicle.hypothecated ? 'Active (NOC Required)' : 'Clean Title (No Loan)'}
                  </span>
                </div>
              </div>
            </section>

            {/* DOCUMENT VERIFICATION CHECKLIST (NEVER SHOWS PRIVATE DOCS) */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-emerald-600" />
                    Document Verification Checklist
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    RTO compliance audited by SellAnyBus. Physical document files remain private.
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-3 text-[11px] font-semibold text-slate-600">
                  <span className="flex items-center gap-1 text-emerald-700">✔ Verified</span>
                  <span className="flex items-center gap-1 text-amber-600">● Seller-stated</span>
                  <span className="flex items-center gap-1 text-slate-400">○ Not provided</span>
                </div>
              </div>

              <div className="space-y-3">
                {allDocTypes.map((doc) => {
                  const status = docMap.get(doc.type);
                  const isVerified = status === DocumentStatus.VERIFIED;
                  const isPending = status === DocumentStatus.PENDING;

                  return (
                    <div
                      key={doc.type}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <span className="font-bold text-slate-800">{doc.label}</span>

                      {isVerified ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          Verified by SellAnyBus
                        </span>
                      ) : isPending ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          Seller-Stated (Verification in progress)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 text-slate-600 font-medium text-[11px]">
                          <span>○ Not Provided</span>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Privacy Protection: RC details, chassis numbers, and owner IDs are never published.
                </span>
              </div>
            </section>

            {/* CONDITION SUMMARY & DISCLOSED DEFECTS */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-900 mb-3">Vehicle Condition & History</h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {vehicle.conditionSummary}
              </p>

              {vehicle.disclosedDefects && (
                <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Seller Disclosed Defects / Imperfections
                  </h4>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    {vehicle.disclosedDefects}
                  </p>
                </div>
              )}

              {vehicle.serviceHistory && (
                <div className="mt-4 pt-4 border-t border-slate-100 text-xs">
                  <span className="font-bold text-slate-800 block mb-1">Maintenance & Service Log</span>
                  <p className="text-slate-600">{vehicle.serviceHistory}</p>
                </div>
              )}
            </section>

            {/* 14-POINT INSPECTION REPORT SUMMARY */}
            {latestInspection && checklist && (
              <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-[#0B3C8C]" />
                      Certified 14-Point Inspection Report
                    </h2>
                    <span className="text-xs text-slate-500">
                      Evaluated on {formatDate(latestInspection.submittedAt || new Date())}
                    </span>
                  </div>
                  {latestInspection.overallScore && (
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block font-semibold">Overall Score</span>
                      <span className="text-xl font-black text-emerald-600">
                        {latestInspection.overallScore.toFixed(1)} / 100
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {Object.entries(checklist).map(([key, item]) => (
                    <div
                      key={key}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-800 capitalize">
                          {key.replace(/([A-Z])/g, ' $1')}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            item.status === 'PASSED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight">{item.note}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* RIGHT 1 COL: Sticky Enquiry Box & Seller Verification Block */}
          <div className="space-y-6">
            {/* ENQUIRY DRAWER / FORM */}
            {!isSold ? (
              <EnquiryDrawer listingId={listing.id} busTitle={title} />
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-slate-500 text-xs shadow-sm">
                This listing is sold. Enquiries are disabled.
              </div>
            )}

            {/* SELLER BLOCK (NEVER EXPOSES PHONE OR SENSITIVE INFO) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
                Seller Information
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0B3C8C] flex items-center justify-center font-bold text-sm">
                  {vehicle.seller.sellerProfile?.businessName?.[0] || 'O'}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-900">
                    {vehicle.seller.sellerProfile?.businessName || 'Verified Fleet Owner'}
                  </div>
                  <span className="text-xs text-slate-500">
                    {vehicle.seller.sellerProfile?.sellerType.replace('_', ' ') || 'Fleet Operator'} • {vehicle.city}
                  </span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified Seller: Identity & Authority confirmed</span>
              </div>
              <p className="text-[11px] text-slate-400">
                To protect seller and buyer privacy, direct contact numbers are never shared publicly. All communication is professionally facilitated by SellAnyBus.
              </p>
            </div>

            {/* REPORT LISTING FORM */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
              <span>Notice incorrect specs or suspect fraud?</span>
              <ReportListingButton listingId={listing.id} />
            </div>
          </div>
        </div>

        {/* SIMILAR VEHICLES */}
        {similarListings.length > 0 && (
          <section className="mt-16 pt-12 border-t border-slate-200">
            <h2 className="text-2xl font-black text-slate-900 mb-6">
              Similar Commercial Buses in Odisha
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarListings.map((sim) => (
                <BusCard
                  key={sim.id}
                  id={sim.id}
                  slug={sim.slug}
                  make={sim.vehicle.make}
                  model={sim.vehicle.model}
                  manufactureYear={sim.vehicle.manufactureYear}
                  askingPrice={sim.askingPrice}
                  odometerKm={sim.vehicle.odometerKm}
                  seatingCapacity={sim.vehicle.seatingCapacity}
                  sleeperConfig={sim.vehicle.sleeperConfig}
                  fuelType={sim.vehicle.fuelType}
                  acType={sim.vehicle.acType}
                  district={sim.vehicle.district}
                  city={sim.vehicle.city}
                  featured={sim.featured}
                  primaryImageUrl={
                    sim.vehicle.media[0]
                      ? `/uploads/${sim.vehicle.media[0].storageKey}`
                      : undefined
                  }
                />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* MOBILE STICKY BOTTOM ENQUIRY BAR */}
      {!isSold && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl flex items-center justify-between z-40">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Asking Price</span>
            <span className="text-lg font-black text-[#0B3C8C]">{formatINR(listing.askingPrice)}</span>
          </div>
          <a
            href="#enquiry"
            className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md transition-colors min-h-[44px] flex items-center justify-center"
          >
            Enquire Now
          </a>
        </div>
      )}

      <Footer />
    </div>
  );
}
