import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";
import XirgoDataTable from "../../components/fleet-widgets/XirgoDataTable";
import StatCardGrid from "../../components/cards/StatCardGrid";
import { DashboardFilterProvider } from "../../context/DashboardFilterContext";
import FleetMap from "../../components/fleet-widgets/FleetMap";
import { getDevices } from "../../api/deviceApi";
import FleetOverviewCard from "../../components/cards/FleetOverviewCard";

export default function Home() {
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await getDevices();
        setVehicles(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch devices:", err);
      }
    };

    fetchVehicles();
    const interval = setInterval(fetchVehicles, 30000); // auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | FMS"
        description="This is React.js Ecommerce Dashboard page for FMS"
      />
      <DashboardFilterProvider>
        <div className="grid grid-cols-12 gap-4 md:gap-6">
          {/* Stats & Vehicle Table */}
          <div className="col-span-12 space-y-6 xl:col-span-12">
            <StatCardGrid />
          </div>

          {/* Fleet Map */}
          <div className="col-span-12 xl:col-span-7">
            <FleetMap devices={vehicles} /> {/* Pass vehicles to map */}
          </div>

          <div className="col-span-12 xl:col-span-5">
            <FleetOverviewCard />
          </div>


          {/* Xirgo Data Table */}
          <div className="col-span-12 xl:col-span-12">
            <XirgoDataTable />
          </div>
        </div>
      </DashboardFilterProvider>
    </>
  );
}