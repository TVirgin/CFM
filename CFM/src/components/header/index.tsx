import * as React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useUserAuth } from "@/context/userAuthContext";
import { Menu, X, Search, ShoppingCart } from 'lucide-react';
import logoImage from '@/assets/images/logo.webp'; 
import addIcon from "@/assets/icons/add.svg";
import logoutIcon from "@/assets/icons/logout.svg";
import settingsIcon from "@/assets/icons/settings.svg";
import profileIcon from "@/assets/icons/profile.svg";
import listIcon from "@/assets/icons/listIcon.svg";

// --- 1. Update the NavItem interface ---
interface NavItem {
  name: string;
  link: string;
  icon: string;
  authRequired?: boolean;
  hideWhenLoggedIn?: boolean; // Add this new property
}

// --- 2. Update the navItems array ---
const navItems: NavItem[] = [
  // Add hideWhenLoggedIn: true to the Subscribe link
  { name: "SUBSCRIBE", link: "/subscribe", icon: addIcon, authRequired: false, hideWhenLoggedIn: true },
  { name: "SHOP", link: "/shop", icon: listIcon, authRequired: false },
  { name: "THIS WEEKS LESSONS", link: "/lessons", icon: settingsIcon, authRequired: false },
  { name: "FREE LESSON HELP", link: "/free-help", icon: settingsIcon, authRequired: false },
];

const memberLinks = [
  { name: "My Account", href: "/account" },
  { name: "Downloads", href: "/downloads" },
  { name: "Order History", href: "/order-history" },
];

const MemberLinks: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => {
  if (isMobile) {
    return (
      <div className="flex flex-col items-start w-full">
        {memberLinks.map((link) => (
          <Link key={link.name} to={link.href} className="text-lg w-full p-4 text-gray-300 hover:bg-slate-700">
            {link.name}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="border-l border-gray-300 h-6"></div>
      {memberLinks.map((link) => (
         <Link
          key={link.name}
          to={link.href}
          className="px-2 py-2 text-sm font-medium text-gray-500 hover:text-black"
        >
          {link.name}
        </Link>
      ))}
    </div>
  );
};


const Header: React.FunctionComponent = () => {
  const { pathname } = useLocation();
  const { user, logOut } = useUserAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };
  
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const NavLinks: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => (
    <>
      {navItems.map((item) => {
        // --- 3. Add the new condition here ---
        if (item.hideWhenLoggedIn && user) return null;

        if (item.authRequired && !user) return null;
        const isActive = pathname === item.link;
        return (
          <Link
            key={item.name}
            to={item.link}
            onClick={handleLinkClick}
            className={cn(
              "flex items-center transition-colors duration-150",
              isMobile 
                ? "text-lg w-full p-4 hover:bg-slate-700"
                : "px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-black", 
              isActive && !isMobile && "text-black"
            )}
          >
            {isMobile && <img src={item.icon} className="w-5 h-5 mr-3" alt="" style={{ filter: "brightness(0) invert(1)" }} />}
            {item.name}
          </Link>
        );
      })}
    </>
  );

  const AuthLinks: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => (
    <>
      {user ? (
        <button
          onClick={handleLogout}
          className={cn(
            "flex items-center transition-colors duration-150",
            isMobile 
              ? "text-lg w-full p-4 text-red-300 hover:bg-red-600 hover:text-white"
              : "px-4 py-2 rounded-md text-sm font-medium text-white bg-[#bf857a] hover:bg-opacity-90"
          )}
        >
          {isMobile && <img src={logoutIcon} className="w-5 h-5 mr-3" alt="" style={{ filter: "brightness(0) invert(1)" }} />}
          Logout
        </button>
      ) : (
        <Link
          to="/login"
          onClick={handleLinkClick}
          className={cn(
            "flex items-center transition-colors duration-150",
            isMobile 
              ? "text-lg w-full p-4 hover:bg-slate-700"
              : "px-4 py-2 rounded-md text-sm font-medium text-white bg-[#bf857a] hover:bg-opacity-90"
          )}
        >
          {isMobile && <img src={profileIcon} className="w-5 h-5 mr-3" alt="" style={{ filter: "brightness(0) invert(1)" }} />}
          LOG IN
        </Link>
      )}
    </>
  );

  return (
    <header className="bg-white text-black shadow-md sticky top-0 z-40">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          
          <div className="flex-shrink-0">
            <Link to="/">
              <img className="h-14 w-auto" src={logoImage} alt="Cemetery Admin" />
            </Link>
          </div>

          <div className="hidden md:flex flex-1 justify-center">
             <div className="flex items-center space-x-2 lg:space-x-4">
                <NavLinks />
             </div>
          </div>

          {/* === RIGHT SIDE CONTAINER: Updated for better spacing control === */}
          <div className="flex items-center">
            <div className="hidden md:flex md:items-center">

              {/* Group 1: Member links (only shows if user is logged in) */}
              {user && (
                <div className="flex items-center space-x-4 pr-4">
                  <div className="border-l border-gray-300 h-6"></div>
                  {memberLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="text-sm font-medium text-gray-500 hover:text-black"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* Group 2: Icons and Auth Button */}
              <div className="flex items-center space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Search size={20} />
                </button>
                <button className="relative p-2 rounded-full hover:bg-gray-100">
                  <ShoppingCart size={20} />
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#bf857a] text-white text-xs">
                    0
                  </span>
                </button>
                <AuthLinks />
              </div>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu updated to render links directly */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 text-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-start">
            <NavLinks isMobile />
          </div>
          
          {user && (
            <div className="py-2 border-t border-slate-700 w-full">
               <div className="flex flex-col items-start w-full">
                {memberLinks.map((link) => (
                  <Link key={link.name} to={link.href} className="text-lg w-full p-4 text-gray-300 hover:bg-slate-700">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 pb-3 border-t border-slate-700 px-2">
            <AuthLinks isMobile />
          </div>
        </div>
      )}
    </header>
  );
};


export default Header;