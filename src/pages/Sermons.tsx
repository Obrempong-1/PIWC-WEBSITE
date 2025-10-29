import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/types/Supabase";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Sermons = () => {
  const [sermons, setSermons] = useState<Database['public']['Tables']['sermons']['Row'][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSermons();
  }, []);

  const fetchSermons = async () => {
    const { data, error } = await supabase
      .from("sermons")
      .select("*")
      .order("date", { ascending: false });

    if (!error && data) {
      console.log("Sermon data:", data);
      setSermons(data);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-24">
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
              Sermons
            </h1>
            <p className="text-xl text-foreground/90">
              Listen to life-changing messages from the pulpit.
            </p>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="frosted-glass">
                  <div className="aspect-video bg-gray-300 rounded-t-lg animate-pulse" />
                  <CardContent className="pt-6">
                    <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse mb-2" />
                    <div className="h-3 w-1/2 bg-gray-300 rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sermons.map((sermon) => (
                <Link to={`/sermons/${sermon.id}`} key={sermon.id}>
                  <Card className="frosted-glass hover:bg-primary/10 transition-colors h-full flex flex-col">
                    {sermon.snapshot_url && (
                        <div className="aspect-video overflow-hidden rounded-t-lg">
                            <img src={sermon.snapshot_url} alt={sermon.title} className="w-full h-full object-cover" />
                        </div>
                    )}
                    <CardContent className="pt-6 flex-grow">
                      <div>
                        <h3 className="text-lg font-semibold text-primary">{sermon.title}</h3>
                        <p className="text-sm text-muted-foreground">{sermon.preacher} - {sermon.date ? new Date(sermon.date).toLocaleDateString() : 'Date not available'}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Sermons;
