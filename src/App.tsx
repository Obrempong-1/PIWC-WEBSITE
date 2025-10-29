import { useState, useEffect, Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import SplashScreen from "./components/SplashScreen";
import ProtectedRoute from "./components/ProtectedRoute";
import Loading from "./components/Loading";
import ScrollToTop from "./components/ScrollToTop";
import LenisSmoothScroll from "./components/LenisSmoothScroll";

const queryClient = new QueryClient();

// Lazy-loaded components
const Layout = lazy(() => import("./components/Layout"));
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Events = lazy(() => import("./pages/Events"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Ministries = lazy(() => import("./pages/Ministries"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const AnnouncementsManagement = lazy(() => import("./pages/admin/AnnouncementsManagement"));
const LeadersManagement = lazy(() => import("./pages/admin/LeadersManagement"));
const MinistriesManagement = lazy(() => import("./pages/admin/MinistriesManagement"));
const EventsManagement = lazy(() => import("./pages/admin/EventsManagement"));
const GalleryManagement = lazy(() => import("./pages/admin/GalleryManagement"));
const WelcomeSectionManagement = lazy(() => import("./pages/admin/WelcomeSectionManagement"));
const NoticeBoardManagement = lazy(() => import("./pages/admin/NoticeBoardManagement"));
const MilestoneManager = lazy(() => import("./pages/admin/MilestoneManager"));
const SermonsManagement = lazy(() => import("./pages/admin/SermonsManagement"));
const Notices = lazy(() => import("./pages/Notices"));
const AnnouncementDetail = lazy(() => import("./pages/AnnouncementDetail"));
const NoticeDetail = lazy(() => import("./pages/NoticeDetail"));
const LeaderDetail = lazy(() => import("./pages/LeaderDetail"));
const EventDetail = lazy(() => import("./pages/EventDetail"));
const MilestoneDetail = lazy(() => import("./pages/MilestoneDetail"));
const ImageViewer = lazy(() => import("./components/ui/ImageViewer"));
const Sermons = lazy(() => import("./pages/Sermons"));
const SermonDetail = lazy(() => import("./pages/SermonDetail"));

const AppRoutes = ({ isLoadingVisible }: { isLoadingVisible: boolean }) => {
  const location = useLocation();
  return (
    <Suspense fallback={isLoadingVisible ? <Loading /> : null}>
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
        <Route
          path="/admin/milestones"
          element={
            <ProtectedRoute requireAdmin>
              <MilestoneManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/sermons"
          element={
            <ProtectedRoute requireAdmin>
              <SermonsManagement />
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
        <Route path="/milestone/:id" element={<Layout><MilestoneDetail /></Layout>} />
        <Route path="/image-viewer" element={<ImageViewer />} />
        <Route path="/sermons" element={<Layout><Sermons /></Layout>} />
        <Route path="/sermons/:id" element={<Layout><SermonDetail /></Layout>} />
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </Suspense>
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
          <LenisSmoothScroll>
            <ScrollToTop />
            <AppRoutes isLoadingVisible={!showSplash} />
          </LenisSmoothScroll>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
