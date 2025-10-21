import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Event {
  id: string;
  title: string;
  description: string;
  start_date: string | null;
  end_date: string | null;
  event_time: string;
  location: string;
  image_url: string | null;
  video_url: string | null;
}

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching event:", error);
      } else {
        setEvent(data as unknown as Event);
      }
      setLoading(false);
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!event) {
    return <div className="flex justify-center items-center min-h-screen">Event not found.</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
       <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
        <div className="flex items-center text-muted-foreground mb-6 space-x-4">
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
            <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4"/>
                <span>{event.location}</span>
            </div>
        </div>
        
        {event.image_url && (
          <img src={event.image_url} alt={event.title} className="w-full h-auto rounded-md mb-6" />
        )}

        {event.description && <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: event.description }}></div>}

        {event.video_url && (
          <div className="mt-6">
            <iframe 
              width="100%" 
              height="400"
              src={event.video_url.replace("watch?v=", "embed/")}
              title="Event Video"
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventDetail;
