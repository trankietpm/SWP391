import { Suspense } from 'react';
import VehicleList from '../../components/VehicleList/VehicleList';

export default function VehiclesPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <VehicleList />
    </Suspense>
  );
}
