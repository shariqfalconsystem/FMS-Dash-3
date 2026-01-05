import React from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteVehicleModal: React.FC<Props> = ({
  open,
  onClose,
  onConfirm,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-96 shadow-lg">
        <h2 className="text-lg font-semibold mb-2">
          Delete Vehicle
        </h2>
        <p className="text-gray-500 mb-6">
          Are you sure you want to delete this vehicle?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-red-600 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
