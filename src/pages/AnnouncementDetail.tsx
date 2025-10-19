import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Announcement {
  id: string;
  title: string;
  description: string;
  content: string | null;
  image_url: string | null;
  video_url: string | null;
  published: boolean;
  created_at: string;
}

const AnnouncementDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncement();
  }, [id]);

  const fetchAnnouncement = async () => {
    if (!id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching announcement:", error);
    } else {
      setAnnouncement(data as Announcement);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!announcement) {
    return <div className="flex justify-center items-center min-h-screen">Announcement not found.</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
       <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events & Announcements
          </Link>
        </Button>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">{announcement.title}</h1>
        <p className="text-muted-foreground mb-6">{new Date(announcement.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        {announcement.image_url && (
          <img src={announcement.image_url} alt={announcement.title} className="w-full h-auto rounded-md mb-6" />
        )}

        {announcement.content && <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: announcement.content }}></div>}

        {announcement.video_url && (
          <div className="mt-6">
            <iframe 
              width="100%" 
              height="400"
              src={announcement.video_url.replace("watch?v=", "embed/")}
              title="Announcement Video"
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

export default AnnouncementDetail;
