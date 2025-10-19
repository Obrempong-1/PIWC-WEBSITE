
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import HeroCarousel from "@/components/HeroCarousel";
import { Calendar, Users, Heart, Book, Megaphone, ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import AnimatedGradientText from "@/components/AnimatedGradientText";
import FloatingIcons from "@/components/FloatingIcons";

interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string;
  image_url: string;
}

interface WelcomeSection {
  title: string;
  content: string;
  video_url: string;
}

interface Announcement {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  image_url: string | null;
}

interface Notice {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  image_url: string | null;
}

const Index = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [welcomeSection, setWelcomeSection] = useState<WelcomeSection | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [eventsRes, welcomeSectionRes, announcementsRes, noticesRes] = await Promise.all([
      supabase
        .from("events")
        .select("*, event_videos(video_url)")
        .eq("published", true)
        .order("start_date", { ascending: false })
        .limit(3),
      supabase
        .from("welcome_section")
        .select("*")
        .eq("published", true)
        .single(),
      supabase
        .from("announcements")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3),
      supabase
        .from("notice_board")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(3),
    ]);

    if (eventsRes.data) {
      setEvents(eventsRes.data as unknown as Event[]);
    }
    if (welcomeSectionRes.data) {
      setWelcomeSection(welcomeSectionRes.data as WelcomeSection);
    }
    if (announcementsRes.data) {
      setAnnouncements(announcementsRes.data as unknown as Announcement[]);
    }
    if (noticesRes.data) {
      setNotices(noticesRes.data as unknown as Notice[]);
    }
    setLoading(false);
  };

  const features = [
    {
      icon: Heart,
      title: "Worship & Prayer",
      description: "Join us for spirit-filled worship services every Sunday and midweek gatherings.",
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect with fellow believers and grow together in faith and fellowship.",
    },
    {
      icon: Book,
      title: "Bible Study",
      description: "Deepen your understanding of God's Word through our teaching and study programs.",
    },
    {
      icon: Calendar,
      title: "Events",
      description: "Participate in life-changing events, conferences, and outreach programs.",
    },
  ];

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", delay: i * 0.15 },
    }),
  };

  const videoVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HeroCarousel />

      <motion.section
        className="py-20"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={sectionVariants}>
              <AnimatedGradientText text={welcomeSection?.title || ""} className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }} />
              <p className="text-lg text-foreground/80 leading-relaxed mb-8">
                {welcomeSection?.content}
              </p>
              <Button asChild size="lg" className="button-glow">
                <Link to="/about">Learn More About Us</Link>
              </Button>
            </motion.div>
            <motion.div
              variants={videoVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
            >
              {welcomeSection?.video_url && (
                <div className="rounded-lg overflow-hidden shadow-2xl">
                  <video src={welcomeSection.video_url} controls className="w-full" />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        className="py-20 bg-primary/5"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <motion.div variants={sectionVariants} className="text-center mb-16">
            <AnimatedGradientText text="Notice Board" className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }} />
            <p className="text-muted-foreground">Important notices for the congregation</p>
          </motion.div>
          {loading ? (
            <div className="text-center py-8">Loading notices...</div>
          ) : notices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {notices.map((notice, index) => (
                <motion.div
                  key={notice.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <Card className="frosted-glass overflow-hidden h-full">
                    <CardContent className="p-0">
                      {notice.image_url && (
                        <img src={notice.image_url} alt={notice.title} className="w-full h-48 object-cover" />
                      )}
                      <div className="p-6">
                        <div className="flex items-center text-sm text-primary/80 font-semibold mb-2">
                          <ClipboardList className="h-4 w-4 mr-2" />
                          <span>{new Date(notice.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-primary mb-3">{notice.title}</h3>
                        <p
                          className="text-muted-foreground line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: notice.content || "" }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No notices available at the moment.
            </div>
          )}
          <motion.div variants={sectionVariants} className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="button-glow">
              <Link to="/notices">View All Notices</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="py-20"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <motion.div variants={sectionVariants} className="text-center mb-16">
            <AnimatedGradientText text="What We Offer" className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }} />
            <p className="text-muted-foreground">Experience the fullness of Christian life and community</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
              >
                <Card className="frosted-glass text-center h-full">
                  <CardContent className="pt-8">
                    <FloatingIcons delay={index * 0.2}>
                      <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-4 mb-6">
                        <feature.icon className="h-8 w-8 gradient-text" />
                      </div>
                    </FloatingIcons>
                    <h3 className="text-xl font-semibold text-primary mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        className="py-20 bg-primary/5"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <motion.div variants={sectionVariants} className="text-center mb-16">
            <AnimatedGradientText text="Recent Events" className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }} />
            <p className="text-muted-foreground">Stay updated with our latest events and programs</p>
          </motion.div>
          {loading ? (
            <div className="text-center py-8">Loading events...</div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <Card className="frosted-glass overflow-hidden h-full">
                    <CardContent className="p-0">
                      {event.image_url && (
                        <img src={event.image_url} alt={event.title} className="w-full h-48 object-cover" />
                      )}
                      <div className="p-6">
                        {event.start_date && (
                          <div className="text-sm text-primary/80 font-semibold mb-2">
                            {new Date(event.start_date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        )}
                        <h3 className="text-xl font-semibold text-primary mb-3">{event.title}</h3>
                        <p className="text-muted-foreground line-clamp-3">{event.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No recent events available at the moment.
            </div>
          )}
          <motion.div variants={sectionVariants} className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="button-glow">
              <Link to="/events">View All Events</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="py-20"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4">
          <motion.div variants={sectionVariants} className="text-center mb-16">
            <AnimatedGradientText text="Announcements" className="text-3xl lg:text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }} />
            <p className="text-muted-foreground">Stay informed with the latest church announcements</p>
          </motion.div>
          {loading ? (
            <div className="text-center py-8">Loading announcements...</div>
          ) : announcements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {announcements.map((announcement, index) => (
                <motion.div
                  key={announcement.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <Card className="frosted-glass overflow-hidden h-full">
                    <CardContent className="p-0">
                      {announcement.image_url && (
                        <img src={announcement.image_url} alt={announcement.title} className="w-full h-48 object-cover" />
                      )}
                      <div className="p-6">
                        <div className="flex items-center text-sm text-primary/80 font-semibold mb-2">
                          <Megaphone className="h-4 w-4 mr-2" />
                          <span>{new Date(announcement.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-primary mb-3">{announcement.title}</h3>
                        <p
                          className="text-muted-foreground line-clamp-3"
                          dangerouslySetInnerHTML={{ __html: announcement.description || "" }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No announcements available at the moment.
            </div>
          )}
          <motion.div variants={sectionVariants} className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="button-glow">
              <Link to="/events">View All Announcements</Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      <motion.section
        className="py-20 bg-primary/5"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.div variants={sectionVariants} className="max-w-3xl mx-auto">
            <AnimatedGradientText text="Join Us This Sunday" className="text-3xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }} />
            <p className="text-xl text-foreground/80 mb-8">
              Experience the presence of God and connect with our loving community. 
              All are welcome to worship with us!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="button-glow">
                <Link to="/contact">Get Directions</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="button-glow">
                <Link to="/contact">View Service Times</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default Index;
