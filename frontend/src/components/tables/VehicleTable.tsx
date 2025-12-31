import { useDashboardFilter } from "../../context/DashboardFilterContext";

export default function VehicleTable({ vehicles = [] }: any) {
  const { filter } = useDashboardFilter();

  if (!Array.isArray(vehicles)) {
    return <div>No vehicle data</div>;
  }

  const filteredVehicles = vehicles.filter((v: any) => {
    if (filter === "ACTIVE") return v.Online;
    if (filter === "IDLE") return !v.Online;
    return true;
  });

  return (
    <div>
      {filteredVehicles.map((v: any, index: number) => (
        <div key={`${v.DeviceID ?? "vehicle"}-${index}`}>
          {v.SerialNo}
        </div>
      ))}
    </div>
  );
}
