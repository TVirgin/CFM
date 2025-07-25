// src/components/layout.tsx
import * as React from "react";
// import Sidebar from "../sidebar"; // Adjust path if your Sidebar is elsewhere
import Header from "../header";
import { Menu, X } from "lucide-react"; // Icons for hamburger/close
import { cn } from "@/lib/utils"; // For conditional classNames

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout: React.FunctionComponent<ILayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* The Header is now a self-contained component. 
        It handles its own mobile menu state and responsiveness.
      */}
      <Header />

      {/* The main content area. The 'sticky' header in Header.tsx
        will stay at the top, and this main section will scroll underneath.
      */}
      <main className="flex-1">
        {/* The header has a height of h-16 (4rem). We add top padding here
          to ensure the content isn't hidden underneath the sticky header.
        */}
        <div className="w-full max-w-7xl mx-auto pt-6 px-4 sm:px-6 lg:px-8 pb-8">
            {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
