import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ClipboardList } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import LazyImage from "@/components/ui/LazyImage";

interface Notice {
  id: string;
  title: string;
  description: string;
  created_at: string;
  media_url: string | null;
}

const Notices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("notice_board")
      .select("id, title, description, created_at, media_url")
      .eq("published", true)
      .order("created_at", { ascending: false });

    if (data) {
      setNotices(data as Notice[]);
    }
    setLoading(false);
  };

  const isVideo = (url: string | null): boolean => {
    if (!url) return false;
    return /\.(mp4|webm|ogg)$/i.test(url);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pt-28">
      <header className="bg-primary/10 py-16 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
            Notice Board
          </h1>
          <p className="text-lg text-muted-foreground mt-4">Important notices for the congregation</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-20">
        {loading ? (
          <div className="text-center">Loading notices...</div>
        ) : notices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {notices.map((notice) => (
              <Link to={`/notices/${notice.id}`} key={notice.id} className="flex">
                <Card className="frosted-glass overflow-hidden h-full hover:shadow-lg transition-shadow w-full flex flex-col">
                  {notice.media_url && (
                    <div className="w-full aspect-video relative bg-gray-100 dark:bg-gray-800">
                      {isVideo(notice.media_url) ? (
                        <video
                          src={notice.media_url}
                          controls
                          playsInline
                          className="w-full h-full object-cover"
                        >
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <LazyImage
                          src={notice.media_url}
                          alt={notice.title}
                          className="w-full h-full"
                          imageClassName="object-cover"
                        />
                      )}
                    </div>
                  )}
                  <CardContent className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center text-sm text-primary/80 font-semibold mb-2">
                      <ClipboardList className="h-4 w-4 mr-2" />
                      <span>{new Date(notice.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-primary mb-3">{notice.title}</h3>
                    <p className="text-muted-foreground line-clamp-3 flex-grow">{notice.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">No notices available at the moment.</div>
        )}
      </main>
    </div>
  );
};

export default Notices;
