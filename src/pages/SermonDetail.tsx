import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/types/Supabase';
import { PlayCircle, FileText } from 'lucide-react';

const SermonDetail = () => {
  const { id } = useParams();
  const [sermon, setSermon] = useState<Database['public']['Tables']['sermons']['Row'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSermon = async () => {
      if (!id) return;
      const { data, error } = await supabase
        .from('sermons')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching sermon:', error);
      } else {
        setSermon(data);
      }
      setLoading(false);
    };

    fetchSermon();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!sermon) {
    return <div className="flex justify-center items-center min-h-screen">Sermon not found.</div>;
  }

  // Correctly formats the Spotify URL for embedding
  const getSpotifyEmbedUrl = (url: string) => {
    try {
      const spotifyUrl = new URL(url);
      spotifyUrl.pathname = '/embed' + spotifyUrl.pathname;
      return spotifyUrl.toString();
    } catch (error) {
      console.error('Invalid Spotify URL:', error);
      // Fallback for older replace logic, just in case
      return url.replace('open.spotify.com/', 'open.spotify.com/embed/');
    }
  };

  return (
    <div className="min-h-screen pt-24">
      <section className="relative py-20 bg-primary/5">
        <div className="container mx-auto px-4 z-10 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
              {sermon.title}
            </h1>
            <p className="text-xl text-foreground/90">
              {sermon.preacher} - {sermon.date ? new Date(sermon.date).toLocaleDateString() : 'Date not available'}
            </p>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {sermon.snapshot_url && (
              <div className="aspect-video rounded-lg overflow-hidden shadow-lg mb-8">
                <img src={sermon.snapshot_url} alt={sermon.title} className="w-full h-full object-cover" />
              </div>
            )}
            
            <div className="space-y-8">
              {sermon.audio_url && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 flex items-center"><PlayCircle className="mr-2"/> Listen to the Sermon</h2>
                  <iframe 
                    src={getSpotifyEmbedUrl(sermon.audio_url)} 
                    width="100%" 
                    height="152" 
                    frameBorder="0" 
                    allowTransparency={true} 
                    allow="encrypted-media"
                    className="rounded-lg shadow-lg"
                  ></iframe>
                </div>
              )}

              {sermon.presentation_url && (
                <div>
                  <h2 className="text-2xl font-bold mb-4 flex items-center"><FileText className="mr-2"/> Sermon Notes</h2>
                  <a 
                    href={sermon.presentation_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                  >
                    Download Notes
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SermonDetail;
