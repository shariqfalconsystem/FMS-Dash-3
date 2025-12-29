import EcommerceMetrics from "../../components/fleet-widgets/EcommerceMetrics";
import StatisticsChart from "../../components/fleet-widgets/StatisticsChart";
import MonthlyTarget from "../../components/fleet-widgets/MonthlyTarget";
import RecentOrders from "../../components/fleet-widgets/XirgoDataTable";
import DemographicCard from "../../components/fleet-widgets/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import { useEffect, useState } from "react";
import { getLiveVehicles } from "../../services/xirgoApi";


export default function Home() {
  const [vehicles, setVehicles] = useState();
  useEffect(() => {
  getLiveVehicles().then(setVehicles);
}, []);

  return (
    <>
      <PageMeta
        title="React.js Ecommerce Dashboard | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />
          <EcommerceMetrics />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        {/* <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div> */}

        {/* <div className="col-span-12">
          <StatisticsChart />
        </div> */}

        <div className="col-span-12 xl:col-span-12">
          <RecentOrders />
        </div>
      </div>
    </>
  );
}
