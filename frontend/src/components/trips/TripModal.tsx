// components/trips/TripModal.tsx
import { useState, useEffect, ChangeEvent, FormEvent } from "react";

interface Trip {
  id: number;
  tripName: string;
  vehicle: string;
  driver: string;
  startLocation: string;
  endLocation: string;
  date: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Cancelled";
}

interface TripModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (trip: Trip) => void;
  editingTrip?: Trip;
}

export default function TripModal({ open, onClose, onSave, editingTrip }: TripModalProps) {
  const [tripName, setTripName] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [driver, setDriver] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<Trip["status"]>("Scheduled");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (editingTrip) {
      setTripName(editingTrip.tripName);
      setVehicle(editingTrip.vehicle);
      setDriver(editingTrip.driver);
      setStartLocation(editingTrip.startLocation);
      setEndLocation(editingTrip.endLocation);
      setDate(editingTrip.date);
      setStatus(editingTrip.status);
    } else {
      setTripName("");
      setVehicle("");
      setDriver("");
      setStartLocation("");
      setEndLocation("");
      setDate("");
      setStatus("Scheduled");
    }
    setErrors({});
  }, [editingTrip, open]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!tripName.trim()) newErrors.tripName = "Trip name is required";
    if (!vehicle.trim()) newErrors.vehicle = "Vehicle is required";
    if (!driver.trim()) newErrors.driver = "Driver is required";
    if (!startLocation.trim()) newErrors.startLocation = "Start location is required";
    if (!endLocation.trim()) newErrors.endLocation = "End location is required";
    if (!date.trim()) newErrors.date = "Date is required";
    return newErrors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const trip: Trip = {
      id: editingTrip?.id || Date.now(),
      tripName,
      vehicle,
      driver,
      startLocation,
      endLocation,
      date,
      status,
    };
    onSave(trip);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md p-6 relative shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          {editingTrip ? "Edit Trip" : "Add Trip"}
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-gray-700 dark:text-gray-200 text-sm font-medium">Trip Name</label>
            <input
              type="text"
              value={tripName}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTripName(e.target.value)}
              className={`w-full px-3 py-2 mt-1 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.tripName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.tripName && <p className="text-red-500 text-xs mt-1">{errors.tripName}</p>}
          </div>

          <div>
            <label className="text-gray-700 dark:text-gray-200 text-sm font-medium">Vehicle</label>
            <input
              type="text"
              value={vehicle}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setVehicle(e.target.value)}
              className={`w-full px-3 py-2 mt-1 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.vehicle ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.vehicle && <p className="text-red-500 text-xs mt-1">{errors.vehicle}</p>}
          </div>

          <div>
            <label className="text-gray-700 dark:text-gray-200 text-sm font-medium">Driver</label>
            <input
              type="text"
              value={driver}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDriver(e.target.value)}
              className={`w-full px-3 py-2 mt-1 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.driver ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.driver && <p className="text-red-500 text-xs mt-1">{errors.driver}</p>}
          </div>

          <div>
            <label className="text-gray-700 dark:text-gray-200 text-sm font-medium">Start Location</label>
            <input
              type="text"
              value={startLocation}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setStartLocation(e.target.value)}
              className={`w-full px-3 py-2 mt-1 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.startLocation ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.startLocation && <p className="text-red-500 text-xs mt-1">{errors.startLocation}</p>}
          </div>

          <div>
            <label className="text-gray-700 dark:text-gray-200 text-sm font-medium">End Location</label>
            <input
              type="text"
              value={endLocation}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setEndLocation(e.target.value)}
              className={`w-full px-3 py-2 mt-1 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.endLocation ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.endLocation && <p className="text-red-500 text-xs mt-1">{errors.endLocation}</p>}
          </div>

          <div>
            <label className="text-gray-700 dark:text-gray-200 text-sm font-medium">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
              className={`w-full px-3 py-2 mt-1 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.date ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>

          <div>
            <label className="text-gray-700 dark:text-gray-200 text-sm font-medium">Status</label>
            <select
              value={status}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as Trip["status"])}
              className="w-full px-3 py-2 mt-1 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingTrip ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
