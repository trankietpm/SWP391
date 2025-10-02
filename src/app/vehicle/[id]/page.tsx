import DetailVehicle from '@/components/DetailVehicle/DetailVehicle';

interface VehicleDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function VehicleDetailPage({ params }: VehicleDetailPageProps) {
  const resolvedParams = await params;
  const vehicleId = parseInt(resolvedParams.id);
  return <DetailVehicle vehicleId={vehicleId} />;
}
