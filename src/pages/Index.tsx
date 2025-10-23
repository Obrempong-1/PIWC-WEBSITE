
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import HeroCarousel from "@/components/HeroCarousel";
import { Calendar, Users, Heart, Book, Megaphone, ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AnimatedGradientText from "@/components/AnimatedGradientText";
import FloatingIcons from "@/components/FloatingIcons";
import { Skeleton } from "@/components/ui/skeleton";

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
  video_url: string | null;
}

interface Notice {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  image_url: string | null;
  video_url: string | null;
}

interface Leader {
    id: string;
    name: string;
    role: string;
    image_url: string | null;
}

const features = [
  {
    icon: Heart,
    title: "Worship & Prayer",
    description: "Join us for spirit-filled worship services every Sunday and midweek gatherings.",
    path: "/events",
  },
  {
    icon: Users,
    title: "Community",
    description: "Connect with fellow believers and grow together in faith and fellowship.",
    path: "/gallery",
  },
  {
    icon: Book,
    title: "Bible Study",
    description: "Deepen your understanding of God's Word through our teaching and study programs.",
    path: "/ministries",
  },
  {
    icon: Calendar,
    title: "Events",
    description: "Participate in life-changing events, conferences, and outreach programs.",
    path: "/events",
  },
];

const Index = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [welcomeSection, setWelcomeSection] = useState<WelcomeSection | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [eventsRes, welcomeSectionRes, announcementsRes, noticesRes, leadersRes] = await Promise.all([
      supabase
        .from("events")
        .select("*")
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
        supabase
        .from("leaders")
        .select("*")
        .eq("published", true)
        .order("display_order")
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
    if (leadersRes.data) {
        setLeaders(leadersRes.data as unknown as Leader[]);
    }
    setLoading(false);
  };

  return (
    <div>
      <HeroCarousel />

      <section
        className="py-20"
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <AnimatedGradientText text={welcomeSection?.title || ""} className="text-4xl lg:text-5xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }} />
              <p className="text-lg text-foreground/80 leading-relaxed mb-8">
                {welcomeSection?.content}
              </p>
              <Button asChild size="lg" className="button-glow">
                <Link to="/about">Learn More About Us</Link>
              </Button>
            </div>
            <div>
              {welcomeSection?.video_url && (
                <div className="rounded-lg overflow-hidden shadow-2xl">
                  <video src={welcomeSection.video_url} controls className="w-full" />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        className="py-20 bg-primary/5"
      >
         <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
              PIWC ASOKWA PRESBYTERY
            </h2>
            <p className="text-muted-foreground">The highest decision making body of the church.</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="frosted-glass overflow-hidden group h-full">
                        <Skeleton className="h-64 w-full" />
                        <div className="pt-4 text-center">
                            <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                            <Skeleton className="h-4 w-1/2 mx-auto" />
                        </div>
                    </div>
                ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {leaders.map((leader, index) => (
                <Link to={`/leader/${leader.id}`} key={leader.id}>
                  <Card
                    className="frosted-glass overflow-hidden group h-full"
                  >
                    <div className="relative h-64 overflow-hidden bg-black">
                      {leader.image_url ? (
                        <>
                          <img
                            src={leader.image_url}
                            alt=""
                            aria-hidden="true"
                            className="absolute inset-0 w-full h-full object-cover filter blur-md scale-110"
                          />
                          <img
                            src={leader.image_url}
                            alt={leader.name}
                            className="relative w-full h-full object-contain z-10 transition-transform duration-500 group-hover:scale-110"
                          />
                        </>
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-20 w-20 text-primary/30" />
                        </div>
                      )}
                    </div>
                    <CardContent className="pt-4 text-center">
                      <h3 className="text-lg font-semibold text-primary mb-1">{leader.name}</h3>
                      <p className="text-sm text-primary/70 font-medium">{leader.role}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link to="/about#leaders">
              <Button size="lg" className="button-glow">View All Leaders</Button>
            </Link>
          </div>
        </div>
      </section>

      <section
        className="py-20 bg-primary/5"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
              NOTICE BOARD
            </h2>
            <p className="text-muted-foreground">Important notices for the congregation</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="frosted-glass overflow-hidden h-full">
                        <Skeleton className="h-48 w-full" />
                        <div className="p-6">
                            <Skeleton className="h-4 w-1/2 mb-4" />
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full mt-2" />
                        </div>
                    </div>
                ))}
            </div>
          ) : notices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {notices.map((notice, index) => (
                <div
                  key={notice.id}
                >
                  <Link to={`/notices/${notice.id}`}>
                    <Card className="frosted-glass overflow-hidden h-full">
                      <CardContent className="p-0">
                        {notice.video_url ? (
                          <video src={notice.video_url} controls className="w-full h-48 object-cover" />
                        ) : notice.image_url && (
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
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No notices available at the moment.
            </div>
          )}
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="button-glow">
              <Link to="/notices">View All Notices</Link>
            </Button>
          </div>
        </div>
      </section>

      <section
        className="py-20"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
              A PLACE TO WORSHIP, SERVE, AND GROW
            </h2>
            <p className="text-muted-foreground">Experience the fullness of Christian life, grow in your faith, and find a place to serve in our vibrant community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
              >
                <Link to={feature.path}>
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
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-20 bg-primary/5"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
              RECENT EVENTS
            </h2>
            <p className="text-muted-foreground">Stay updated with our latest events and programs</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="frosted-glass overflow-hidden h-full">
                        <Skeleton className="h-48 w-full" />
                        <div className="p-6">
                            <Skeleton className="h-4 w-1/2 mb-4" />
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                    </div>
                ))}
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {events.map((event, index) => (
                <div
                  key={event.id}
                >
                  <Link to="/events">
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
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No recent events available at the moment.
            </div>
          )}
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="button-glow">
              <Link to="/events">View All Events</Link>
            </Button>
          </div>
        </div>
      </section>

      <section
        className="py-20"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
              ANNOUNCEMENTS
            </h2>
            <p className="text-muted-foreground">Stay informed with the latest church announcements</p>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="frosted-glass overflow-hidden h-full">
                        <Skeleton className="h-48 w-full" />
                        <div className="p-6">
                            <Skeleton className="h-4 w-1/2 mb-4" />
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full mt-2" />
                        </div>
                    </div>
                ))}
            </div>
          ) : announcements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {announcements.map((announcement, index) => (
                <div
                  key={announcement.id}
                >
                  <Link to={`/announcements/${announcement.id}`}>
                    <Card className="frosted-glass overflow-hidden h-full">
                      <CardContent className="p-0">
                        {announcement.video_url ? (
                          <video src={announcement.video_url} controls className="w-full h-48 object-cover" />
                        ) : announcement.image_url ? (
                          <img src={announcement.image_url} alt={announcement.title} className="w-full h-48 object-cover" />
                        ) : (
                          <div className="w-full h-48 bg-primary/10 flex items-center justify-center">
                            <Megaphone className="h-20 w-20 text-primary/30" />
                          </div>
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
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No announcements available at the moment.
            </div>
          )}
          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="button-glow">
              <Link to="/events#announcements">View All Announcements</Link>
            </Button>
          </div>
        </div>
      </section>

      <section
        className="py-20 bg-primary/5"
      >
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6 gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
              Join Us This Sunday
            </h2>
            <p className="text-xl text-foreground/80 mb-8">
              Experience the presence of God and connect with our loving community. 
              All are welcome to worship with us
            </p>
            <div className="flex flex-col sm:flew-row gap-4 justify-center">
              <Button asChild size="lg" className="button-glow">
                <Link to="/contact">Get Directions</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="button-glow">
                <Link to="/contact">View Service Times</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
