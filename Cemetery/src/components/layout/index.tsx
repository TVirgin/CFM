// src/components/layout.tsx
import * as React from "react";
import Sidebar from "../sidebar"; // Adjust path if your Sidebar is elsewhere
import { Menu, X } from "lucide-react"; // Icons for hamburger/close
import { cn } from "@/lib/utils"; // For conditional classNames

interface ILayoutProps {
  children: React.ReactNode;
}

const DESKTOP_SIDEBAR_WIDTH = "w-64"; // 16rem or 256px (Tailwind class)
const DESKTOP_SIDEBAR_MARGIN = "lg:ml-30"; // Corresponding margin for main content

const Layout: React.FunctionComponent<ILayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100"> {/* Base page background */}
      {/* Sidebar Container (aside) */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex-shrink-0 bg-slate-800", // Common styles for the sidebar container
          "transform transition-transform duration-300 ease-in-out", // Animation
          "w-72 sm:w-80", // Width when open on mobile/tablet (can be same as DESKTOP_SIDEBAR_WIDTH if preferred)
          isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full", // Mobile slide in/out
          `lg:translate-x-0 lg:static lg:shadow-none ${DESKTOP_SIDEBAR_WIDTH}` // Desktop: static, part of flow
        )}
        aria-hidden={!isMobileMenuOpen && true} // Hide from screen readers when closed on mobile
      >
        {/* Sidebar component now receives onLinkClick to close itself on mobile */}
        <Sidebar onLinkClick={closeMobileMenu} />
      </aside>

      {/* Hamburger Menu Button - visible only on mobile (lg:hidden) */}
      <div className="lg:hidden fixed top-4 left-4 z-[60]"> {/* Higher z-index to be above overlay and sidebar */}
        <button
          onClick={toggleMobileMenu}
          className="p-2 bg-slate-800 text-white rounded-md shadow-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="sidebar-navigation" // Assuming your <nav> inside Sidebar has id="sidebar-navigation"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Main Content Area */}
      <main className={cn(
          "flex-1 overflow-y-auto transition-all duration-300 ease-in-out",
          DESKTOP_SIDEBAR_MARGIN // Apply margin on desktop to make space for static sidebar
      )}>
        {/* Top padding to avoid content being hidden by a fixed header or the mobile hamburger button area */}
        <div className="w-full pt-20 lg:pt-6 px-4 sm:px-6 lg:px-8 pb-8">
             {children}
        </div>
      </main>

      {/* Overlay for mobile when menu is open */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden" // Semi-transparent overlay
          onClick={closeMobileMenu}
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
};

export default Layout;