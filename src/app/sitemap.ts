import { MetadataRoute } from 'next';
import prisma from '@/modules/core/db';
import { PublicationStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sellanybus.in';

  // Static Pages
  const staticRoutes = [
    '',
    '/buses',
    '/sell-your-bus',
    '/how-it-works',
    '/inspection-services',
    '/about',
    '/contact',
    '/faq',
    '/privacy',
    '/terms',
    '/grievance',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  const ODISHA_DISTRICTS = [
    'Khordha', 'Cuttack', 'Balasore', 'Puri', 'Sundargarh',
    'Sambalpur', 'Ganjam', 'Jharsuguda', 'Mayurbhanj', 'Angul',
    'Bargarh', 'Bhadrak', 'Bolangir', 'Boudh', 'Deogarh',
    'Dhenkanal', 'Gajapati', 'Jagatsinghpur', 'Jajpur', 'Kalahandi',
    'Kandhamal', 'Kendrapara', 'Keonjhar', 'Koraput', 'Malkangiri',
    'Nabarangpur', 'Nayagarh', 'Nuapada', 'Rayagada', 'Subarnapur',
  ];

  const districtRoutes = ODISHA_DISTRICTS.map((district) => ({
    url: `${baseUrl}/buses/in/${encodeURIComponent(district)}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }));

  // Published Listings
  const publishedListings = await prisma.listing.findMany({
    where: { publicationStatus: PublicationStatus.PUBLISHED },
    select: { slug: true, updatedAt: true },
  });

  const listingRoutes = publishedListings.map((l) => ({
    url: `${baseUrl}/buses/${l.slug}`,
    lastModified: l.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...districtRoutes, ...listingRoutes];
}
