import { useEffect, useState } from 'react';
import churchLogo from "@/assets/church-logo.webp";
import LazyImage from '@/components/ui/LazyImage';

const SplashScreen = () => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
        }, 2500); 

        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) {
        return null;
    }

    return (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-blue-600 animate-splash-fade"
          style={{ willChange: 'opacity' }} 
        >
          <div
            className="text-center animate-logo-scale"
            style={{ willChange: 'transform' }} 
          >
            <div className="mb-6 flex justify-center">
                <div className="h-32 w-32 rounded-full overflow-hidden shadow-blue">
                  <LazyImage
                    src={churchLogo}
                    alt="PIWC Logo"
                    className="h-full w-full"
                    imageClassName="object-cover h-full w-full"
                    sizes="128px"
                  />
                </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              PIWC Asokwa
            </h1>
            <p className="text-lg text-white/90">Pentecost International Worship Centre</p>
          </div>
        </div>
      );
    };

export default SplashScreen;
