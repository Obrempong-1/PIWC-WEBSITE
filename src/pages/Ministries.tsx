
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import MinistryDialog from "@/components/MinistryDialog";
import { type LucideIcon } from "lucide-react";
import { BookOpen, ShieldCheck, UserCheck, Cross, HandHeart, Droplets, Wind, Church, HandCoins, Heart, Users, Book, Megaphone, ClipboardList, PlayCircle, Calendar, Clock, MapPin, MoreHorizontal, GripVertical, Search, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Check, Circle, Dot, UploadCloud, File as FileIcon, CheckCircle, Loader, Edit, PanelLeft, X, Save, Trash2, ArrowLeft } from "lucide-react";
import Loading from "@/components/Loading";
import { motion, Variants } from "framer-motion";
import { EASE_CURVE, EASE_DURATION } from "@/lib/constants";

interface Ministry {
  id: string;
  title: string;
  description: string;
  long_description: string | null;
  image_url: string | null;
  icon_name: string | null;
  age_group: string | null;
  schedule: string | null;
  leader_name: string | null;
}

const iconComponents: { [key: string]: LucideIcon } = {
  BookOpen,
  ShieldCheck,
  UserCheck,
  Cross,
  HandHeart,
  Droplets,
  Wind,
  Church,
  HandCoins,
  Heart,
  Users,
  Book,
  Megaphone,
  ClipboardList,
  PlayCircle,
  Calendar,
  Clock,
  MapPin,
  MoreHorizontal,
  GripVertical,
  Search,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Circle,
  Dot,
  UploadCloud,
  FileIcon,
  CheckCircle,
  Loader,
  Edit,
  PanelLeft,
  X,
  Save,
  Trash2,
  ArrowLeft
};

const Ministries = () => {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [selectedMinistry, setSelectedMinistry] = useState<Ministry | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMinistries();
  }, []);

  const fetchMinistries = async () => {
    const { data, error } = await supabase
      .from("ministries")
      .select("*")
      .eq("published", true)
      .order("display_order");

    if (!error && data) {
      setMinistries(data);
    }
    setLoading(false);
  };

  const handleMinistryClick = (ministry: Ministry) => {
    setSelectedMinistry(ministry);
    setDialogOpen(true);
  };

  if (loading) {
    return <Loading message="Loading ministries..." />;
  }

  const getIconComponent = (iconName: string | null): LucideIcon => {
    if (iconName && Object.prototype.hasOwnProperty.call(iconComponents, iconName)) {
      return iconComponents[iconName];
    }
    return Church;
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: EASE_DURATION, ease: EASE_CURVE },
    },
  };

  return (
    <div className="min-h-screen pt-24">
      <motion.section 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: EASE_DURATION, ease: EASE_CURVE }}
        className="relative py-20"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
              Our Ministries
            </h1>
            <p className="text-xl text-foreground/90">
              Discover where you can serve, grow, and make an impact in our community
            </p>
          </div>
        </div>
      </motion.section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {ministries.map((ministry) => (
              <motion.div key={ministry.id} variants={itemVariants}>
                <Card
                  className="frosted-glass cursor-pointer h-full"
                  onClick={() => handleMinistryClick(ministry)}
                >
                  {ministry.image_url && (
                    <div className="aspect-video overflow-hidden rounded-t-lg relative bg-black">
                      <img 
                        src={ministry.image_url} 
                        alt="" 
                        aria-hidden="true" 
                        className="absolute inset-0 w-full h-full object-cover filter blur-md scale-110"
                      />
                      <motion.img 
                        src={ministry.image_url} 
                        alt={ministry.title}
                        className="relative w-full h-full object-contain z-10"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.4, ease: EASE_CURVE }}
                      />
                    </div>
                  )}
                  <CardContent className="pt-6">
                    <h3 className="text-2xl font-bold mb-2 gradient-text">{ministry.title}</h3>
                    {ministry.leader_name && (
                      <p className="text-sm text-primary/80 font-medium mb-4">{ministry.leader_name}</p>
                    )}
                    <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">{ministry.description}</p>
                    <div className="space-y-2 mb-6">
                      {ministry.age_group && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-semibold text-primary">Age Group:</span>
                          <span className="text-muted-foreground">{ministry.age_group}</span>
                        </div>
                      )}
                      {ministry.schedule && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-semibold text-primary">Schedule:</span>
                          <span className="text-muted-foreground">{ministry.schedule}</span>
                        </div>
                      )}
                    </div>
                    <Button className="w-full button-glow">View Details</Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <motion.section 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }} 
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: EASE_DURATION, ease: EASE_CURVE }}
        className="py-20 bg-primary/5"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
              Find Your Place to Serve
            </h2>
            <p className="text-xl text-foreground/90 mb-8">
              Every member has unique gifts and talents. Let us help you discover where you can make the greatest impact.
            </p>
            <Link to="/contact">
              <Button size="lg" className="button-glow">
                Get Involved Today
              </Button>
            </Link>
          </div>
        </div>
      </motion.section>

      <MinistryDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        ministry={selectedMinistry ? {
          icon: getIconComponent(selectedMinistry.icon_name),
          title: selectedMinistry.title,
          description: selectedMinistry.description,
          longDescription: selectedMinistry.long_description || '',
          age: selectedMinistry.age_group || 'N/A',
          schedule: selectedMinistry.schedule || 'N/A',
          leader: selectedMinistry.leader_name || 'N/A',
          image: selectedMinistry.image_url || '',
        } : null}
      />
    </div>
  );
};

export default Ministries;
