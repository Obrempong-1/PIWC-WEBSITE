import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Notice {
  id: string;
  title: string;
  description: string;
  content: string | null;
  image_url: string | null;
  video_url: string | null;
  published: boolean;
  created_at: string;
}

const NoticeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [notice, setNotice] = useState<Notice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotice();
  }, [id]);

  const fetchNotice = async () => {
    if (!id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("notice_board")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching notice:", error);
    } else {
      setNotice(data as Notice);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!notice) {
    return <div className="flex justify-center items-center min-h-screen">Notice not found.</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
       <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/notices">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Notices
          </Link>
        </Button>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-4">{notice.title}</h1>
        <p className="text-muted-foreground mb-6">{new Date(notice.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        {notice.image_url && (
          <img src={notice.image_url} alt={notice.title} className="w-full h-auto rounded-md mb-6" />
        )}

        {notice.content && <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: notice.content }}></div>}

        {notice.video_url && (
          <div className="mt-6">
            <iframe 
              width="100%" 
              height="400"
              src={notice.video_url.replace("watch?v=", "embed/")}
              title="Notice Video"
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

export default NoticeDetail;
