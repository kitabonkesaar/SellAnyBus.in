import React from 'react';
import Link from 'next/link';
import prisma from '@/modules/core/db';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BusCard } from '@/components/marketplace/BusCard';
import { BusCategory, FuelType, AcType, PublicationStatus, Prisma } from '@prisma/client';
import { Filter, SlidersHorizontal, ArrowUpDown, BellRing, RotateCcw } from 'lucide-react';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Search Used Commercial Buses & Coaches in Odisha | SellAnyBus.in',
  description:
    'Browse verified used commercial buses across all 30 districts of Odisha. Filter by category (AC Sleeper, Route Seater, School Bus), make, district, and price. 100% RTO verified papers.',
  keywords: [
    'buy used bus in odisha',
    'used buses for sale bhubaneswar',
    'commercial bus cuttack',
    'route bus sambalpur',
    'ashok leyland bus odisha',
    'tata school bus sale',
    'ac sleeper bus for sale',
  ],
  alternates: {
    canonical: 'https://sellanybus.in/buses',
  },
  openGraph: {
    title: 'Search Used Commercial Buses & Coaches in Odisha | SellAnyBus.in',
    description: 'Browse verified used commercial buses across all 30 districts of Odisha with certified 14-point mechanical inspections and RTO clearance.',
    locale: 'en_IN',
    type: 'website',
    url: 'https://sellanybus.in/buses',
  },
};

const ODISHA_DISTRICTS = [
  'Khordha',
  'Cuttack',
  'Puri',
  'Balasore',
  'Sundargarh',
  'Sambalpur',
  'Ganjam',
  'Jharsuguda',
  'Mayurbhanj',
  'Angul',
  'Bargarh',
  'Bhadrak',
  'Bolangir',
  'Jajpur',
  'Kalahandi',
  'Keonjhar',
  'Koraput',
];

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    make?: string;
    district?: string;
    acType?: string;
    fuelType?: string;
    minPrice?: string;
    maxPrice?: string;
    minSeats?: string;
    maxSeats?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function BusesSearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;

  const page = parseInt(params.page || '1', 10);
  const pageSize = 24;
  const skip = (page - 1) * pageSize;

  // Build Prisma Where clause
  const where: Prisma.ListingWhereInput = {
    publicationStatus: PublicationStatus.PUBLISHED,
  };

  const vehicleWhere: Prisma.VehicleWhereInput = {};

  if (params.q) {
    const query = params.q.trim();
    vehicleWhere.OR = [
      { make: { contains: query, mode: 'insensitive' } },
      { model: { contains: query, mode: 'insensitive' } },
      { bodyType: { contains: query, mode: 'insensitive' } },
      { district: { contains: query, mode: 'insensitive' } },
      { city: { contains: query, mode: 'insensitive' } },
    ];
  }

  if (params.category && Object.values(BusCategory).includes(params.category as BusCategory)) {
    vehicleWhere.category = params.category as BusCategory;
  }

  if (params.make) {
    vehicleWhere.make = { equals: params.make, mode: 'insensitive' };
  }

  if (params.district) {
    vehicleWhere.district = { equals: params.district, mode: 'insensitive' };
  }

  if (params.acType && Object.values(AcType).includes(params.acType as AcType)) {
    vehicleWhere.acType = params.acType as AcType;
  }

  if (params.fuelType && Object.values(FuelType).includes(params.fuelType as FuelType)) {
    vehicleWhere.fuelType = params.fuelType as FuelType;
  }

  if (params.minSeats) {
    vehicleWhere.seatingCapacity = {
      ...(vehicleWhere.seatingCapacity as object),
      gte: parseInt(params.minSeats, 10),
    };
  }

  if (params.maxSeats) {
    vehicleWhere.seatingCapacity = {
      ...(vehicleWhere.seatingCapacity as object),
      lte: parseInt(params.maxSeats, 10),
    };
  }

  if (params.minPrice) {
    where.askingPrice = {
      ...(where.askingPrice as object),
      gte: parseInt(params.minPrice, 10),
    };
  }

  if (params.maxPrice) {
    where.askingPrice = {
      ...(where.askingPrice as object),
      lte: parseInt(params.maxPrice, 10),
    };
  }

  where.vehicle = vehicleWhere;

  // Sorting
  let orderBy: Prisma.ListingOrderByWithRelationInput = { publishedAt: 'desc' };
  if (params.sort === 'price_asc') {
    orderBy = { askingPrice: 'asc' };
  } else if (params.sort === 'price_desc') {
    orderBy = { askingPrice: 'desc' };
  } else if (params.sort === 'year_desc') {
    orderBy = { vehicle: { manufactureYear: 'desc' } };
  }

  const totalCount = await prisma.listing.count({ where });
  const listings = await prisma.listing.findMany({
    where,
    skip,
    take: pageSize,
    orderBy,
    include: {
      vehicle: {
        include: {
          media: { where: { isPrimary: true }, take: 1 },
        },
      },
    },
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />

      <main className="flex-1 py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Breadcrumb & Header */}
        <div className="mb-6">
          <nav className="text-xs text-slate-500 flex items-center gap-2 mb-2">
            <Link href="/" className="hover:text-[#0B3C8C]">Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Buses in Odisha</span>
          </nav>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Verified Used Buses in Odisha
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Showing {listings.length} of {totalCount} verified buses ready for inspection & transfer
              </p>
            </div>

            {/* Sort Dropdown */}
            <form method="GET" action="/buses" className="flex items-center gap-2">
              {/* Preserve existing query parameters */}
              {params.q && <input type="hidden" name="q" value={params.q} />}
              {params.category && <input type="hidden" name="category" value={params.category} />}
              {params.district && <input type="hidden" name="district" value={params.district} />}
              {params.acType && <input type="hidden" name="acType" value={params.acType} />}

              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-300 shadow-sm text-xs font-semibold text-slate-700">
                <ArrowUpDown className="w-4 h-4 text-slate-400" />
                <label htmlFor="sort-select" className="sr-only">Sort by</label>
                <select
                  id="sort-select"
                  name="sort"
                  defaultValue={params.sort || 'newest'}
                  // Auto-submit on change
                  className="bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="newest">Newest Listed</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="year_desc">Year: Newest First</option>
                </select>
                <button type="submit" className="text-xs text-[#0B3C8C] font-bold px-1.5 py-0.5 rounded bg-blue-50">
                  Apply
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Layout Grid: Sidebar Filters + Bus Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* SIDEBAR FILTERS */}
          <aside className="lg:col-span-1">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm sticky top-24 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
                  <SlidersHorizontal className="w-4 h-4 text-[#0B3C8C]" />
                  <span>Filter Inventory</span>
                </div>
                <Link
                  href="/buses"
                  className="text-xs text-slate-500 hover:text-red-600 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </Link>
              </div>

              <form method="GET" action="/buses" className="space-y-5 text-xs">
                {/* Search Term */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Keywords</label>
                  <input
                    type="text"
                    name="q"
                    defaultValue={params.q || ''}
                    placeholder="Make, model, city..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0B3C8C]"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Vehicle Category</label>
                  <select
                    name="category"
                    defaultValue={params.category || ''}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0B3C8C]"
                  >
                    <option value="">All Commercial Categories</option>
                    <optgroup label="Commercial Buses & Coaches">
                      <option value="AC_SLEEPER">AC Sleeper Coach</option>
                      <option value="SEATER">Express Route Seater</option>
                      <option value="SCHOOL_BUS">School & College Bus</option>
                      <option value="STAFF_BUS">Staff & Industrial Bus</option>
                      <option value="TOURIST_COACH">Luxury Tourist Coach</option>
                      <option value="MINI_BUS">Mini Bus / Traveller</option>
                    </optgroup>
                    <optgroup label="Trucks & Commercial Vehicles">
                      <option value="TRUCK">Heavy Cargo Haulage Truck</option>
                      <option value="PICKUP_VAN">Commercial Pickup Van / Mini Truck</option>
                      <option value="TIPPER">Mining & Construction Tipper</option>
                    </optgroup>
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Odisha District</label>
                  <select
                    name="district"
                    defaultValue={params.district || ''}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#0B3C8C]"
                  >
                    <option value="">All 30 Districts</option>
                    {ODISHA_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                {/* AC / Non-AC */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">AC Specification</label>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                      <input
                        type="radio"
                        name="acType"
                        value="AC"
                        defaultChecked={params.acType === 'AC'}
                      />
                      <span>Air Conditioned</span>
                    </label>
                    <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 cursor-pointer hover:bg-slate-50">
                      <input
                        type="radio"
                        name="acType"
                        value="NON_AC"
                        defaultChecked={params.acType === 'NON_AC'}
                      />
                      <span>Non-AC</span>
                    </label>
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Price Range (₹)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="minPrice"
                      placeholder="Min ₹"
                      defaultValue={params.minPrice || ''}
                      className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      placeholder="Max ₹"
                      defaultValue={params.maxPrice || ''}
                      className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                {/* Seating Capacity */}
                <div>
                  <label className="block font-bold text-slate-800 mb-1.5">Seating Capacity</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="minSeats"
                      placeholder="Min seats"
                      defaultValue={params.minSeats || ''}
                      className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    />
                    <input
                      type="number"
                      name="maxSeats"
                      placeholder="Max seats"
                      defaultValue={params.maxSeats || ''}
                      className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                {/* Submit Filters */}
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#0B3C8C] hover:bg-[#082a63] text-white font-bold text-xs shadow-md transition-colors min-h-[44px]"
                >
                  Apply Filters
                </button>
              </form>
            </div>
          </aside>

          {/* BUS LISTINGS GRID */}
          <section className="lg:col-span-3">
            {listings.length === 0 ? (
              /* Empty state with Saved Search Alert */
              <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center shadow-sm">
                <div className="w-14 h-14 rounded-full bg-blue-50 text-[#0B3C8C] flex items-center justify-center mx-auto mb-4">
                  <BellRing className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-slate-900 mb-2">
                  No matching commercial buses found
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6">
                  We frequently onboard newly inspected buses across Odisha. Save this search alert to receive an instant SMS or notification as soon as a matching vehicle is listed.
                </p>

                <form
                  action="/api/v1/me/alerts"
                  method="POST"
                  className="max-w-md mx-auto flex flex-col sm:flex-row gap-2"
                >
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="Enter mobile (+91)"
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#0B3C8C]"
                  />
                  <input type="hidden" name="filters" value={JSON.stringify(params)} />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-sm whitespace-nowrap min-h-[44px]"
                  >
                    Notify Me When Listed
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-slate-100">
                  <Link
                    href="/buses"
                    className="text-xs text-[#0B3C8C] font-bold hover:underline"
                  >
                    Clear all filters and see all buses
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const p = idx + 1;
                      const isCurrent = p === page;
                      return (
                        <Link
                          key={p}
                          href={`/buses?page=${p}${params.category ? `&category=${params.category}` : ''}${params.district ? `&district=${params.district}` : ''}${params.sort ? `&sort=${params.sort}` : ''}`}
                          className={`w-10 h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-colors min-h-[40px] min-w-[40px] ${
                            isCurrent
                              ? 'bg-[#0B3C8C] text-white shadow-md'
                              : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'
                          }`}
                        >
                          {p}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
