import Mail from "lucide-react/dist/esm/icons/mail";
import Phone from "lucide-react/dist/esm/icons/phone";
import MapPin from "lucide-react/dist/esm/icons/map-pin";
import Facebook from "lucide-react/dist/esm/icons/facebook";
import Instagram from "lucide-react/dist/esm/icons/instagram";
import Youtube from "lucide-react/dist/esm/icons/youtube";
import Music2 from "lucide-react/dist/esm/icons/music-2";
import { Link } from "react-router-dom";
import React from "react";
import churchLogo from "@/assets/church-logo.webp";


const quickLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Events", path: "/events" },
  { name: "Ministries", path: "/ministries" },
];

const socialLinks = [
  { icon: Facebook, url: "#", label: "Facebook" },
  { icon: Instagram, url: "#", label: "Instagram" },
  { icon: Youtube, url: "#", label: "Youtube" },
  { icon: Music2, url: "#", label: "TikTok" },
];

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center group footer-logo-container">
               <img
                src={churchLogo}
                alt="PIWC Logo"
                width="56"
                height="56"
                className="logo-icon h-14 w-14 logo-spin object-contain"
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
            </Link>
            <p className="text-sm text-white/80 leading-relaxed">
              A vibrant community of believers dedicated to worship, fellowship, and spreading the Gospel of Jesus Christ.
            </p>
          </div>

          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-white/80 hover:text-white transition-colors inline-block hover:translate-x-1 duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-white/80">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <span>Asokwa, Kumasi<br />Ashanti Region, Ghana</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/80">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>+233 XX XXX XXXX</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-white/80">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span>piwcasokwaac1@gmail.com</span>
              </li>
            </ul>
          </div>

          
          <div>
            <h4 className="text-lg font-semibold mb-4">Service Times</h4>
            <ul className="space-y-2 mb-6">
              <li className="text-sm text-white/80">
                <span className="font-medium text-white">Sunday Service:</span> 8:00 AM
              </li>
              <li className="text-sm text-white/80">
                <span className="font-medium text-white">Wednesday Service:</span> 5:30 PM
              </li>
              <li className="text-sm text-white/80">
                <span className="font-medium text-white">Friday Service:</span> 5:30 PM
              </li>
            </ul>
            <div>
              <h5 className="text-sm font-semibold mb-3">Follow Us</h5>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.url}
                    aria-label={social.label}
                    className="rounded-full bg-white/10 p-2 hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-sm text-white/70">
            © {new Date().getFullYear()} PIWC Asokwa. All rights reserved.
          </p>
        </div>
      </div>
      <style>{`
        .footer-logo-container .logo-text-container, 
        .footer-logo-container .piwc-text, 
        .footer-logo-container .asokwa-text, 
        .footer-logo-container .subtitle-text {
          font-family: 'Poppins', sans-serif;
        }

        .footer-logo-container .logo-text-container {
          display: flex;
          flex-direction: column;
          justify-content: center;
          line-height: 1;
          margin-left: 4px;
          align-items: flex-start;
        }

        .footer-logo-container .main-title-lockup {
          display: flex;
          align-items: center;
          position: relative;
        }

        .footer-logo-container .piwc-text {
          font-size: 2.4rem;
          font-weight: 800;
          text-transform: uppercase;
          color: white;
          margin-right: 0;
          display: flex;
          align-items: center;
        }

        .footer-logo-container .asokwa-lockup {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          margin-left: -4px;
        }

        .footer-logo-container .asokwa-bar {
          height: 4px;
          width: 80%;
          background: white;
          border-radius: 9px;
        }

        .footer-logo-container .asokwa-text {
          font-size: 1rem;
          font-weight: 700;
          text-transform: uppercase;
          padding: 3px 10px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          letter-spacing: 1px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          margin: 2px 0;
        }

        .footer-logo-container .subtitle-text {
          font-size: 0.81rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: -1px;
          color: rgba(255, 255, 255, 0.9);
          white-space: nowrap;
          margin-left: 2px;
        }

        .footer-logo-container .logo-icon {
          height: 60px;
          width: 60px;
          border-radius: 50%;
          overflow: hidden;
          will-change: transform;
        }
        
        @keyframes logo-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (prefers-reduced-motion: no-preference) {
          .footer-logo-container .logo-spin {
            animation: logo-spin infinite 20s linear;
          }
        }
      `}</style>
    </footer>
  );
};

export default React.memo(Footer);
