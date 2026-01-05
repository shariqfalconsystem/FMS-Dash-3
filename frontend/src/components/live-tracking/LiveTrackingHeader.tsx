export default function LiveTrackingHeader() {
  return (
    <div className="flex items-center justify-between border-b bg-white px-6 py-3 dark:bg-black">
      <h2 className="text-lg font-semibold">Live Tracking</h2>

      <div className="flex gap-3">
        <input
          placeholder="Search vehicle / driver"
          className="rounded-md border px-3 py-1 text-sm"
        />

        <button className="rounded bg-green-600 px-3 py-1 text-sm text-white">
          Online
        </button>
        <button className="rounded bg-blue-600 px-3 py-1 text-sm text-white">
          Idle
        </button>
        <button className="rounded bg-red-600 px-3 py-1 text-sm text-white">
          Offline
        </button>
      </div>
    </div>
  );
}
