import * as React from "react";
import homeIcon from "@/assets/icons/home.svg";
import addIcon from "@/assets/icons/add.svg";
import logoutIcon from "@/assets/icons/logout.svg";
import settingsIcon from "@/assets/icons/settings.svg";
import profileIcon from "@/assets/icons/profile.svg"; // Will use this for the Login button
import listIcon from "@/assets/icons/listIcon.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";
import { useUserAuth } from "@/context/userAuthContext";

interface ISidebarProps {}

const navItems = [
  {
    name: "Home",
    link: "/",
    icon: homeIcon,
    authRequired: false,
  },
  {
    name: "Add Record",
    link: "/admin/record",
    icon: addIcon,
    authRequired: true,
  },
  {
    name: "Records",
    link: "/recordsList",
    icon: listIcon,
    authRequired: false, // This remains public as per last update
  },
  {
    name: "Settings",
    link: "/admin/settings",
    icon: settingsIcon,
    authRequired: true,
  },
];

const Sidebar: React.FunctionComponent<ISidebarProps> = (props) => {
  const { pathname } = useLocation();
  const { user, logOut } = useUserAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <nav className="flex flex-col relative h-screen max-w-sm w-full bg-slate-800 text-white">
      <div className="flex justify-center m-5 p-4 border-b border-slate-700">
        <div className="text-xl font-semibold">Cemetery</div>
      </div>
      <div className="flex-grow">
        {navItems.map((item) => {
          if (item.authRequired && !user) {
            return null;
          }

          const isActive = pathname === item.link;

          return (
            <div
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full rounded-none justify-start text-base px-6 py-3",
                isActive
                  ? "bg-sky-600 text-white hover:bg-sky-700"
                  : "hover:bg-slate-700 hover:text-white"
              )}
              key={item.name}
            >
              <Link to={item.link} className="flex items-center w-full">
                <img
                  src={item.icon}
                  className="w-5 h-5 mr-3"
                  alt={item.name}
                  style={{
                    filter: isActive ? "none" : "brightness(0) invert(1)",
                  }}
                />
                <span>{item.name}</span>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Authentication Links Section (Login/Logout) */}
      <div className="mt-auto border-t border-slate-700">
        {user ? (
          // Logout Button - If user is logged in
          <div
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full rounded-none justify-start text-base px-6 py-3",
              "hover:bg-red-700 hover:text-white" // Specific hover for logout
            )}
          >
            <button onClick={handleLogout} className="flex items-center w-full">
              <img
                src={logoutIcon}
                className="w-5 h-5 mr-3"
                alt="Logout"
                style={{ filter: "brightness(0) invert(1)" }} // Keep icon white
              />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          // Login Button - If user is NOT logged in
          <div
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full rounded-none justify-start text-base px-6 py-3",
              pathname === "/login" // Check if current page is the login page
                ? "bg-sky-600 text-white hover:bg-sky-700" // Active style if on /login
                : "hover:bg-slate-700 hover:text-white"   // Inactive style
            )}
          >
            <Link to="/login" className="flex items-center w-full">
              <img
                src={profileIcon} // Using profileIcon for Login, change if you have a specific login icon
                className="w-5 h-5 mr-3"
                alt="Login"
                style={{
                  filter: pathname === "/login" ? "none" : "brightness(0) invert(1)",
                }}
              />
              <span>Login</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Sidebar;