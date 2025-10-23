import * as React from 'react';
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Menu from "lucide-react/dist/esm/icons/menu";
import X from "lucide-react/dist/esm/icons/x";
import { Button } from "@/components/ui/button";
import churchLogo from "@/assets/church-logo.webp";
import LazyImage from '@/components/ui/LazyImage';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Events", path: "/events" },
    { name: "Gallery", path: "/gallery" },
    { name: "Ministries", path: "/ministries" },
    { name: "Contact Us", path: "/contact", special: true },
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
              className="logo-icon logo-spin"
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
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => getLinkClassName(isActive, item.special)}
              >
                {item.name}
              </NavLink>
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
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => {
                      const baseClasses = "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative text-gray-700";
                      const activeClasses = "text-blue-600 font-semibold";
                      const hoverClasses = "hover:text-blue-500";
                      const specialClasses = "font-bold contact-us-gradient";
                      return `${baseClasses} ${isActive ? activeClasses : ""} ${hoverClasses} ${item.special ? specialClasses : ""}`;
                  }}
                >
                  {item.name}
                </NavLink>
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
          font-size: 0.81rem;
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
        }

        .contact-us-gradient {
            background-image: linear-gradient(90deg, #007bff, #0056d6, #002f91);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }

        @keyframes logo-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @media (prefers-reduced-motion: no-preference) {
          .logo-spin {
            animation: logo-spin infinite 20s linear;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
