import * as React from 'react';
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Menu from "lucide-react/dist/esm/icons/menu";
import X from "lucide-react/dist/esm/icons/x";
import { Button } from "@/components/ui/button";
import LazyImage from '@/components/ui/LazyImage';
import { ChevronDown } from 'lucide-react';
import churchLogo from "@/assets/church-logo.webp";


const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isTransparent = isHomePage && !isScrolled && !isMobileMenuOpen;

  const navItems = [
    { name: "Home", path: "/", sublinks: [
        { name: "Notice Board", path: "/#notice-board" },
        { name: "Welcome", path: "/#welcome" },
        { name: "Presbytery", path: "/#presbytery" },
        { name: "Recent Events", path: "/#recent-events" },
        { name: "Announcements", path: "/#announcements" },
      ] 
    },
    {
      name: "About Us",
      path: "/about",
      sublinks: [
        { name: "Our Vision & Mission", path: "/about#our-vision-mission" },
        { name: "Our Tenets", path: "/about#tenets" },
        { name: "Our Journey", path: "/about#milestones" },
        { name: "Our Leaders", path: "/about#leaders" },
      ],
    },
    { name: "Events", path: "/events", sublinks: [
        { name: "Announcements", path: "/events#announcements" },
        { name: "All Events", path: "/events#upcoming-events" },
    ] },
    { name: "Gallery", path: "/gallery" },
    { name: "Ministries", path: "/ministries", sublinks: [
        { name: "Our Ministries", path: "/ministries#our-ministries" },
        { name: "Find Your Place to Serve", path: "/ministries#serve" },
    ] },
    { name: "Contact Us", path: "/contact", special: true, sublinks: [
        { name: "Contact Info", path: "/contact#contact-info" },
        { name: "Send Us a Message", path: "/contact#send-message" },
        { name: "Find Us", path: "/contact#find-us" },
        { name: "Connect With Us", path: "/contact#connect-with-us" },
    ] },
  ];

  const getLinkClassName = (isActive: boolean, isSpecial: boolean = false) => {
    const baseClasses = "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative";

    if (isSpecial) {
      if (isTransparent) {
        return `${baseClasses} font-bold text-white border border-white/50 hover:bg-white/10`;
      }
      return `${baseClasses} font-bold contact-us-gradient`;
    }

    const activeClasses = isTransparent ? "text-white font-semibold" : "text-blue-600 font-semibold";
    const inactiveClasses = isTransparent ? "text-white/80 hover:text-white" : "text-gray-700 hover:text-blue-500";

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };
  
  const handleMouseEnter = (itemName: string) => {
    setOpenDropdown(itemName);
  };

  const handleMouseLeave = () => {
    setOpenDropdown(null);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isTransparent ? "bg-transparent py-4" : "bg-white shadow-md py-2"
      } ${isTransparent ? "nav-transparent" : ""}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="flex items-center group">
            <LazyImage
              src={churchLogo}
              alt="PIWC Logo"
              className="logo-icon logo-spin-reversed"
              imageClassName="object-contain"
              sizes="96px"
            />
            <div className="logo-text-container">
              <div className="main-title-lockup">
                <span className="piwc-text">PIWC</span>
                <div className="asokwa-lockup">
                  <div className="asokwa-bar"></div>
                  <span className="asokwa-text">ASOKWA</span>
                  <div className="asokwa-bar"></div>
                </div>
              </div>
              <div className="subtitle-text">THE CHURCH OF PENTECOST</div>
            </div>
          </NavLink>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <div
                key={item.path}
                className="relative"
                onMouseEnter={() => item.sublinks && handleMouseEnter(item.name)}
                onMouseLeave={handleMouseLeave}
              >
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `${getLinkClassName(isActive, item.special)} flex items-center gap-1`}
                >
                  {item.name}
                  {item.sublinks && <ChevronDown className="h-4 w-4" />}
                </NavLink>
                {item.sublinks && openDropdown === item.name && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-md shadow-lg py-2 z-50">
                    {item.sublinks.map(sublink => (
                      <NavLink
                        key={sublink.path}
                        to={sublink.path}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {sublink.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className={`lg:hidden hover:bg-gray-100/20 ${isTransparent ? 'text-white' : 'text-gray-800'}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4 animate-fade-in bg-white rounded-lg shadow-xl z-50">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <div key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => {
                        if (!item.sublinks) {
                          setIsMobileMenuOpen(false);
                        }
                        setOpenDropdown(openDropdown === item.name ? null : item.name);
                      }}
                    className={({ isActive }) => {
                        const baseClasses = "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative text-gray-700 flex justify-between items-center";
                        const activeClasses = "text-blue-600 font-semibold";
                        const hoverClasses = "hover:text-blue-500";
                        const specialClasses = "font-bold contact-us-gradient";
                        return `${baseClasses} ${isActive && !item.sublinks ? activeClasses : ""} ${hoverClasses} ${item.special ? specialClasses : ""}`;
                    }}
                  >
                    {item.name}
                    {item.sublinks && <ChevronDown className={`h-4 w-4 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} />}
                  </NavLink>
                  {item.sublinks && openDropdown === item.name && (
                     <div className="pl-4 mt-2 flex flex-col gap-1">
                       {item.sublinks.map(sublink => (
                         <NavLink
                           key={sublink.path}
                           to={sublink.path}
                           onClick={() => setIsMobileMenuOpen(false)}
                           className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
                         >
                           {sublink.name}
                         </NavLink>
                       ))}
                     </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <style>{`
        .nav-transparent .piwc-text,
        .nav-transparent .subtitle-text {
          background-image: none;
          -webkit-background-clip: unset;
          background-clip: unset;
          color: white;
        }
        .nav-transparent .asokwa-bar {
          background-image: none;
          background-color: white;
        }
        .nav-transparent .asokwa-text {
          background-image: none;
          background-color: white;
          color: #002f91;
        }

        .logo-text-container, .piwc-text, .asokwa-text, .subtitle-text {
          font-family: 'Poppins', sans-serif;
        }

        .logo-text-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          line-height: 1;
          margin-left: 4px; /* Adjust this value to control space */
          align-items: flex-start; /* Align items to the start (left) */
        }

        .main-title-lockup {
          display: flex;
          align-items: center;
          position: relative;
        }

        .piwc-text {
          font-size: 2.4rem;
          font-weight: 800;
          text-transform: uppercase;
          background-image: linear-gradient(90deg, #007bff, #0056d6, #002f91);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          margin-right: 0;
          display: flex;
          align-items: center;
        }

        /* ASOKWA capsule at mouth of C */
        .asokwa-lockup {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          margin-left: -4px; /* sits inside the open C */
        }

        .asokwa-bar {
          height: 4px; /* Make bars thicker */
          width: 80%;
          background-image: linear-gradient(90deg, #007bff, #0056d6, #002f91);
          border-radius: 9px;
        }

        .asokwa-text {
          font-size: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 999px;
          background-image: linear-gradient(90deg, #007bff, #0056d6, #002f91);
          color: white;
          letter-spacing: 1px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1;

         
          margin: 2px 0;
        }

        .subtitle-text {
          font-size: 0.80rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: -1px;
          background-image: linear-gradient(90deg, #007bff, #0056d6, #002f91);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          white-space: nowrap;
          margin-left: 2px; /* Indent subtitle slightly */
        }

        .logo-icon {
          height: 60px;
          width: 60px;
          border-radius: 50%;
          overflow: hidden;
          background: transparent;
        }

        .contact-us-gradient {
            background-image: linear-gradient(90deg, #007bff, #0056d6, #002f91);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }

        @keyframes logo-spin-reversed {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @media (prefers-reduced-motion: no-preference) {
          .logo-spin-reversed {
            animation: logo-spin-reversed infinite 20s linear;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
