import CountryMap from "../map/CountryMap";

export default function DemographicCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Fleet Distribution
        </h3>
        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
          Active vehicles across regions
        </p>
      </div>

      {/* Map Container */}
      <div className="mt-6 overflow-hidden border border-gray-200 rounded-2xl dark:border-gray-800">
        <div className="h-[264px] w-full">
          <CountryMap />
        </div>
      </div>
    </div>
  );
}
