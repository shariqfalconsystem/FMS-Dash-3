import { useEffect, useRef, useState } from "react";
import { useSidebar } from "../context/SidebarContext";
import NotificationDropdown from "../components/header/NotificationDropdown";
import UserDropdown from "../components/header/UserDropdown";

const AppHeader: React.FC = () => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
  const [notificationCount] = useState(3);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // 🔹 icon rotation state

  const { toggleSidebar, toggleMobileSidebar } = useSidebar();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleToggle = () => {
    if (window.innerWidth >= 1024) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
    setIsSidebarOpen((prev) => !prev); // 🔹 rotate icon
  };

  const toggleApplicationMenu = () =>
    setApplicationMenuOpen((prev) => !prev);

  // Keyboard shortcut (Ctrl / Cmd + K)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800 shadow-md">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">

        {/* 🔹 Sidebar Toggle */}
        <button
          onClick={handleToggle}
          aria-label="Toggle Sidebar"
          className="flex items-center justify-center w-10 h-10 rounded-lg
                     text-gray-600 dark:text-gray-300
                     hover:bg-gray-100 dark:hover:bg-gray-800
                     transition-all duration-300"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? "rotate-0" : "rotate-180"
            }`}
          >
            <path
              d="M9 6L15 12L9 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Center (empty / logo / search later) */}
        <div className="flex-1 flex items-center justify-center lg:justify-start gap-4" />

        {/* 🔹 Right Section */}
        <div className="flex items-center gap-3 lg:gap-4">

          {/* Desktop Notifications */}
          <div className="relative hidden lg:flex">
            <NotificationDropdown />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 text-xs
                               bg-red-500 text-white rounded-full
                               flex items-center justify-center animate-pulse">
                {notificationCount}
              </span>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10
                       text-gray-700 dark:text-gray-400
                       hover:bg-gray-100 dark:hover:bg-gray-800
                       rounded-lg lg:hidden transition"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z"
                fill="currentColor"
              />
            </svg>
          </button>

          {/* User Dropdown */}
          <UserDropdown />
        </div>

        {/* 🔹 Mobile Menu */}
        {isApplicationMenuOpen && (
          <div className="absolute top-16 right-4 w-56
                          bg-white dark:bg-gray-800
                          shadow-lg rounded-xl p-3
                          flex flex-col gap-3
                          lg:hidden z-50 animate-fadeIn">
            <NotificationDropdown />
            <UserDropdown />
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
