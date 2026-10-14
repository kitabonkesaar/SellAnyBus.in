import { redirect } from 'next/navigation';

export default async function DistrictLandingPage({ params }: { params: Promise<{ district: string }> }) {
  const { district } = await params;
  redirect(`/buses?district=${encodeURIComponent(district)}`);
}
