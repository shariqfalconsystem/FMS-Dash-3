import { useEffect, useRef, useState } from "react";

export default function DownloadMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(prev => !prev)}
        className="rounded-full border p-2 hover:bg-gray-100"
        aria-label="Download reports"
      >
        ⬇️
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-40 rounded-md border bg-white shadow-lg text-sm">
          <button
            onClick={() => {
              setOpen(false);
              console.log("Download Excel");
            }}
            className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-50"
          >
            📊 Download Excel
          </button>

          <button
            onClick={() => {
              setOpen(false);
              console.log("Download PDF");
            }}
            className="flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-50"
          >
            📄 Download PDF
          </button>
        </div>
      )}
    </div>
  );
}
