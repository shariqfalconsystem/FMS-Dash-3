export function DriverPopup({
    vehicleNo,
    onClose,
}: {
    vehicleNo: string;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-[480px] rounded-xl bg-white p-6">
                {/* HEADER */}
                <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Modify Driver</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        ✕
                    </button>
                </div>

                {/* VEHICLE */}
                <div className="mb-4 flex justify-between text-sm text-gray-600">
                    <span>Vehicle</span>
                    <span className="font-medium text-gray-900">{vehicleNo}</span>
                </div>

                {/* DRIVER NAME */}
                <div className="mb-4">
                    <label className="mb-1 block text-sm font-medium">
                        <span className="text-red-500">*</span> Driver Name
                    </label>
                    <input
                        placeholder="Enter driver's name"
                        className="w-full rounded-lg border px-3 py-2 text-sm"
                    />
                </div>

                {/* PHONE */}
                <div className="mb-6">
                    <label className="mb-1 block text-sm font-medium">
                        <span className="text-red-500">*</span> Phone Number
                    </label>
                    <input
                        placeholder="Enter driver's phone number"
                        className="w-full rounded-lg border px-3 py-2 text-sm"
                    />
                </div>

                {/* ACTIONS */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-lg border px-4 py-2 text-sm"
                    >
                        Cancel
                    </button>
                    <button className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white">
                        Add Driver
                    </button>
                </div>
            </div>
        </div>
    );
}