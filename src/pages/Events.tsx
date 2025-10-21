import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Clock, MapPin, Megaphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string | null;
  end_date: string | null;
  event_time: string;
  location: string;
  image_url: string | null;
  category: string | null;
}

interface Announcement {
  id: string;
  title: string;
  description: string;
  created_at: string;
  image_url: string | null;
  video_url: string | null;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [eventsRes, announcementsRes] = await Promise.all([
      supabase
        .from("events")
        .select("*")
        .eq("published", true)
        .neq("category", "Weekly Service")
        .order("start_date", { ascending: false }),
      supabase
        .from("announcements")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false }),
    ]);

    if (eventsRes.data) {
      setEvents(eventsRes.data as unknown as Event[]);
    }
    if (announcementsRes.data) {
      setAnnouncements(announcementsRes.data as unknown as Announcement[]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-primary/10 py-16 text-center mt-16">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
            Events & Announcements
          </h1>
          <p className="text-lg text-muted-foreground mt-4">Join us for worship, fellowship, and growth</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20">
        <section id="announcements" className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
            Announcements
          </h2>
          {loading ? (
            <div className="text-center">Loading announcements...</div>
          ) : announcements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {announcements.map((announcement) => (
                <Link to={`/announcements/${announcement.id}`} key={announcement.id}>
                  <Card className="frosted-glass overflow-hidden group h-full">
                    <CardContent className="p-0">
                        {announcement.video_url ? (
                          <video src={announcement.video_url} controls className="w-full h-48 object-cover" />
                        ) : announcement.image_url && (
                          <img src={announcement.image_url} alt={announcement.title} className="w-full h-48 object-cover" />
                        )}
                        <div className="p-6">
                          <div className="flex items-center text-sm text-primary/80 font-semibold mb-2">
                            <Megaphone className="h-4 w-4 mr-2" />
                            <span>{new Date(announcement.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                          </div>
                          <h3 className="text-xl font-semibold text-primary mb-3">{announcement.title}</h3>
                          <p className="text-muted-foreground line-clamp-3">{announcement.description}</p>
                        </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">No announcements available at the moment.</div>
          )}
        </section>

        <section id="upcoming-events">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
            All Events
          </h2>
          {loading ? (
            <div className="text-center">Loading events...</div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <Link to={`/events/${event.id}`} key={event.id}>
                  <Card className="frosted-glass overflow-hidden group h-full">
                      {event.image_url && (
                          <div className="overflow-hidden">
                              <img 
                                  src={event.image_url} 
                                  alt={event.title} 
                                  className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                              />
                          </div>
                      )}
                    <CardContent className="p-6">
                      <div className="flex items-center text-sm text-primary/90 mb-3 space-x-4">
                          <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4"/> 
                              <span>
                                  {event.start_date && new Date(event.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                              </span>
                          </div>
                          <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4"/>
                              <span>{event.event_time}</span>
                          </div>
                      </div>
                      <h3 className="text-2xl font-bold text-primary mb-3">{event.title}</h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{event.description}</p>
                      <div className="flex items-center text-sm text-muted-foreground space-x-2">
                          <MapPin className="h-4 w-4"/>
                          <span>{event.location}</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">No events to display. Please check back later.</div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Events;
