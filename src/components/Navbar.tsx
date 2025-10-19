import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import churchLogo from "@/assets/church-logo.png";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Events", path: "/events" },
    { name: "Gallery", path: "/gallery" },
    { name: "Ministries", path: "/ministries" },
    { name: "Contact", path: "/contact" },
  ];

  const getLinkClassName = (isActive: boolean, isContact: boolean = false) => {
    const baseClasses = "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative";
    const activeClasses = "text-primary bg-secondary";
    const hoverClasses = "hover:text-primary hover:bg-secondary/50";

    if (isContact) {
      return `${baseClasses} contact-link`;
    }

    return `${baseClasses} ${isActive ? activeClasses : ''} ${hoverClasses}`;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-white/95 backdrop-blur-sm py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="transition-transform group-hover:scale-110">
              <img src={churchLogo} alt="PIWC Logo" className="h-12 w-12 object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary" style={{ fontFamily: "'Playfair Display', serif" }}>
                PIWC Asokwa
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">The Church of Pentecost</p>
            </div>
          </NavLink>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => getLinkClassName(isActive, item.name === "Contact")}
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-border pt-4 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => getLinkClassName(isActive, item.name === "Contact")}
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`
        .contact-link {
          background-image: linear-gradient(90deg, #0066ff, #3399ff, #00ccff);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 10px rgba(0, 102, 255, 0.3);
          transition: transform 0.3s ease-in-out;
        }
        .contact-link:hover {
          transform: scale(1.05);
        }
        .contact-link.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background-image: linear-gradient(90deg, #0066ff, #3399ff, #00ccff);
          animation: underline-animation 0.5s ease-out;
        }
        @keyframes underline-animation {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
