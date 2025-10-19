import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Church,
  Users,
  Calendar,
  Image,
  BookOpen,
  Home,
  LogOut,
  Megaphone,
  FileText,
} from "lucide-react";

const Dashboard = () => {
  const { user, signOut } = useAuth();

  const menuItems = [
    {
      title: "Announcements",
      description: "Manage church announcements",
      icon: Megaphone,
      href: "/admin/announcements",
    },
    {
      title: "Events",
      description: "Create and manage events",
      icon: Calendar,
      href: "/admin/events",
    },
    {
      title: "Leaders",
      description: "Manage leadership team",
      icon: Users,
      href: "/admin/leaders",
    },
    {
      title: "Ministries",
      description: "Manage church ministries",
      icon: Church,
      href: "/admin/ministries",
    },
    {
      title: "Gallery",
      description: "Upload and manage photos",
      icon: Image,
      href: "/admin/gallery",
    },
    {
      title: "Welcome Section",
      description: "Manage homepage welcome section",
      icon: FileText,
      href: "/admin/welcome",
    },
    {
      title: "Notice Board",
      description: "Manage notice board items",
      icon: FileText,
      href: "/admin/notice-board",
    },
    {
      title: "Hero Carousel",
      description: "Manage homepage hero images",
      icon: Image,
      href: "/admin/hero-carousel",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">CMS Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.email}</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" asChild>
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                View Website
              </Link>
            </Button>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link key={item.href} to={item.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
