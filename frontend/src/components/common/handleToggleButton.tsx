import { useState } from "react";
import { useSidebar } from "../../context/SidebarContext";

export function handleToggleButton() {
    const { toggleSidebar, toggleMobileSidebar } = useSidebar();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const isDesktop = () => window.innerWidth >= 1024;

    const openSidebar = () => {
        if (!isSidebarOpen) {
            isDesktop() ? toggleSidebar() : toggleMobileSidebar();
            setIsSidebarOpen(true);
        }
    };

    const closeSidebar = () => {
        if (isSidebarOpen) {
            isDesktop() ? toggleSidebar() : toggleMobileSidebar();
            setIsSidebarOpen(false);
        }
    };

    const toggle = () => {
        isDesktop() ? toggleSidebar() : toggleMobileSidebar();
        setIsSidebarOpen((prev) => !prev);
    };

    return {
        isSidebarOpen,
        openSidebar,
        closeSidebar,
        toggle
    };
}

