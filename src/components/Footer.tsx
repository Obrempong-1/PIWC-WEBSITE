import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, Music2 } from "lucide-react";
import { Link } from "react-router-dom";
import churchLogo from "@/assets/church-logo.png";

const Footer = () => {
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

  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Church Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white/10 rounded-lg p-2">
                <img src={churchLogo} alt="PIWC Logo" className="h-10 w-10 object-contain" />
              </div>
              <div>
                <h3 className="text-lg font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  PIWC Asokwa
                </h3>
                <p className="text-sm text-white/80">The Church of Pentecost</p>
              </div>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              A vibrant community of believers dedicated to worship, fellowship, and spreading the Gospel of Jesus Christ.
            </p>
          </div>

          {/* Quick Links */}
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

          {/* Contact Info */}
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
                <span>info@piwcasokwa.org</span>
              </li>
            </ul>
          </div>

          {/* Service Times & Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Service Times</h4>
            <ul className="space-y-2 mb-6">
              <li className="text-sm text-white/80">
                <span className="font-medium text-white">Sunday Service:</span> 8:00 AM
              </li>
              <li className="text-sm text-white/80">
                <span className="font-medium text-white">Wednesday Service:</span> 6:00 PM
              </li>
              <li className="text-sm text-white/80">
                <span className="font-medium text-white">Friday Service:</span> 6:00 PM
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
    </footer>
  );
};

export default Footer;
