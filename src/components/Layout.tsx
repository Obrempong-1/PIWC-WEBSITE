import * as React from 'react';
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ScrollProgress from "./ScrollProgress";
import ScrollToTop from "./ScrollToTop";
import Chatbot from "./Chatbot"; 

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <ScrollProgress />
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow" style={{ transform: 'translateZ(0)' }}>
        {children}
      </main>
      <Footer />
      <Chatbot /> 
    </div>
  );
};

export default Layout;
