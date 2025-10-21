import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import SplashScreen from "./components/SplashScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import Ministries from "./pages/Ministries";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Dashboard from "./pages/admin/Dashboard";
import AnnouncementsManagement from "./pages/admin/AnnouncementsManagement";
import LeadersManagement from "./pages/admin/LeadersManagement";
import MinistriesManagement from "./pages/admin/MinistriesManagement";
import EventsManagement from "./pages/admin/EventsManagement";
import GalleryManagement from "./pages/admin/GalleryManagement";
import WelcomeSectionManagement from "./pages/admin/WelcomeSectionManagement";
import NoticeBoardManagement from "./pages/admin/NoticeBoardManagement";
import Notices from "./pages/Notices";
import AnnouncementDetail from "./pages/AnnouncementDetail";
import NoticeDetail from "./pages/NoticeDetail";
import LeaderDetail from "./pages/LeaderDetail";
import EventDetail from "./pages/EventDetail";
import { AnimatePresence } from "framer-motion";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <ScrollToTop />
      <Routes location={location} key={location.pathname}>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/announcements"
          element={
            <ProtectedRoute requireAdmin>
              <AnnouncementsManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/leaders"
          element={
            <ProtectedRoute requireAdmin>
              <LeadersManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/ministries"
          element={
            <ProtectedRoute requireAdmin>
              <MinistriesManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute requireAdmin>
              <EventsManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/gallery"
          element={
            <ProtectedRoute requireAdmin>
              <GalleryManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/welcome"
          element={
            <ProtectedRoute requireAdmin>
              <WelcomeSectionManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/notice-board"
          element={
            <ProtectedRoute requireAdmin>
              <NoticeBoardManagement />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Layout><Index /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/events" element={<Layout><Events /></Layout>} />
        <Route path="/events/:id" element={<Layout><EventDetail /></Layout>} />
        <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
        <Route path="/ministries" element={<Layout><Ministries /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/notices" element={<Layout><Notices /></Layout>} />
        <Route path="/notices/:id" element={<Layout><NoticeDetail /></Layout>} />
        <Route path="/announcements/:id" element={<Layout><AnnouncementDetail /></Layout>} />
        <Route path="/leader/:id" element={<Layout><LeaderDetail /></Layout>} />
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {showSplash && <SplashScreen />}
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
