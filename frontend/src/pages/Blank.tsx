import { useEffect, useState } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
/* ---------------------------------------------
   1️⃣ TYPE DEFINITIONS (IMPORTANT)
---------------------------------------------- */
interface EventItem {
  eventId: string;
  eventType: string;
  dateTime: string;
  location: string;
  tripId: string;
  vehicleId: string;
  vin: string;
}

/* ---------------------------------------------
   2️⃣ FALLBACK DUMMY DATA
---------------------------------------------- */
const dummyEvents: EventItem[] = [
  {
    eventId: "EV155275",
    eventType: "Harsh Braking",
    dateTime: "12/25/2025 | 05:00 am IST",
    location: "Jogeshwari East, Mumbai, Maharashtra, India",
    tripId: "TR34727",
    vehicleId: "VHCI435",
    vin: "ANUJTESTTESTESTE",
  },
  {
    eventId: "EV155276",
    eventType: "Harsh Cornering",
    dateTime: "12/23/2025 | 06:57 pm IST",
    location: "Taloja, Navi Mumbai, Maharashtra, India",
    tripId: "TR33744",
    vehicleId: "VHCI435",
    vin: "ANUJTESTTESTESTE",
  },
  {
    eventId: "EV155277",
    eventType: "Harsh Braking",
    dateTime: "12/22/2025 | 11:40 am IST",
    location: "Andheri West, Mumbai, Maharashtra, India",
    tripId: "TR33745",
    vehicleId: "VHCI436",
    vin: "ANUJTESTTESTESTE",
  },
  {
    eventId: "EV155278",
    eventType: "Harsh Cornering",
    dateTime: "12/21/2025 | 04:15 pm IST",
    location: "Vashi, Navi Mumbai, Maharashtra, India",
    tripId: "TR33746",
    vehicleId: "VHCI437",
    vin: "ANUJTESTTESTESTE",
  },
];

/* ---------------------------------------------
   3️⃣ COMPONENT
---------------------------------------------- */
export default function Events() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  /* ---------------------------------------------
     4️⃣ API FETCH (READY FOR REAL API)
  ---------------------------------------------- */
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");

      // 🔁 Replace with real API later
      // const response = await fetch("/api/events");
      // if (!response.ok) throw new Error("Failed to fetch events");
      // const data: EventItem[] = await response.json();
      // setEvents(data);

      // TEMP: Dummy data
      setTimeout(() => {
        setEvents(dummyEvents);
        setLoading(false);
      }, 800);
    } catch (err) {
      console.error(err);
      setError("Unable to load events");
      setEvents(dummyEvents);
      setLoading(false);
    }
  };

  /* ---------------------------------------------
     5️⃣ LOAD DATA ON MOUNT
  ---------------------------------------------- */
  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div>
      {/* <PageMeta title="Events Dashboard | FMS" /> */}
      <PageBreadcrumb pageTitle="All Events" />

      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-6 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-8">
        <div className="w-full overflow-hidden rounded-xl">

          {/* HEADER */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4 dark:border-gray-800">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              All Events
            </h2>

            <div className="flex gap-2">
              <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                Export
              </button>
              <button className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
                Filters
              </button>
            </div>
          </div>

          {/* TABLE */}
          <div className="relative overflow-x-auto">
            {loading ? (
              <div className="p-10 text-center text-gray-500">
                Loading events...
              </div>
            ) : error ? (
              <div className="p-10 text-center text-red-500">
                {error}
              </div>
            ) : events.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                No events found
              </div>
            ) : (
              <table className="w-full table-auto text-sm">
                <thead className="sticky top-0 z-10 bg-gray-100 text-xs uppercase text-gray-600 dark:bg-gray-900 dark:text-gray-400">
                  <tr>
                    <th className="px-5 py-3 text-left">Event ID</th>
                    <th className="px-5 py-3 text-left">Event Type</th>
                    <th className="px-5 py-3 text-left">Date & Time</th>
                    <th className="px-5 py-3 text-left">Location</th>
                    <th className="px-5 py-3 text-left">Trip ID</th>
                    <th className="px-5 py-3 text-left">Vehicle ID</th>
                    <th className="px-5 py-3 text-left">VIN</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {events.map((event, index) => (
                    <tr
                      key={`${event.eventId}-${index}`}
                      className={`transition hover:bg-gray-50 dark:hover:bg-gray-800 ${
                        index % 2 === 0
                          ? "bg-white dark:bg-transparent"
                          : "bg-gray-50/50 dark:bg-gray-900/20"
                      }`}
                    >
                      <td className="px-5 py-4 font-medium text-gray-800 dark:text-white">
                        {event.eventId}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            event.eventType === "Harsh Braking"
                              ? "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400"
                          }`}
                        >
                          {event.eventType}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                        {event.dateTime}
                      </td>

                      <td className="px-5 py-4 max-w-md truncate text-gray-600 dark:text-gray-300">
                        {event.location}
                      </td>

                      <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                        {event.tripId}
                      </td>

                      <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                        {event.vehicleId}
                      </td>

                      <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                        {event.vin}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
