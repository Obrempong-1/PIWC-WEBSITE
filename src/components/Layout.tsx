import * as React from 'react';
import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollProgress from "./ScrollProgress";
import ScrollToTop from "./ScrollToTop";

interface LayoutProps {
  children: ReactNode;
}


const preloadResources = () => {
  const images = [
    'https://vhovhjnupqdfmdjfbtrr.supabase.co/storage/v1/object/public/images/welcome.jpg',
    'https://vhovhjnupqdfmdjfbtrr.supabase.co/storage/v1/object/public/images/worship.jpg',
    'https://vhovhjnupqdfmdjfbtrr.supabase.co/storage/v1/object/public/images/ministries.jpg',
  ];
  images.forEach((image) => {
    new Image().src = image;
  });
};


const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  useEffect(() => {
    preloadResources();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow" style={{ transform: 'translateZ(0)' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
