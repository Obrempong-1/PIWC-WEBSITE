import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AudioPlayer from '@/components/ui/AudioPlayer';

const SermonDetail = () => {
  const location = useLocation();
  const { sermon } = location.state;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [transcript, setTranscript] = useState<any | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const transcriptUrl = sermon['podcast:transcript']?.$?.url;
    if (transcriptUrl) {
      const proxyUrl = 'https://cors.eu.org/';
      fetch(`${proxyUrl}${transcriptUrl}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to fetch transcript: ${res.statusText}`);
          }
          return res.json();
        })
        .then(setTranscript)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .catch((e: any) => {
          console.error("Failed to fetch or parse transcript:", e);
          setError(`Failed to load transcript. Error: ${e.message}`);
        });
    }
  }, [sermon]);

  return (
    <div className="min-h-screen pt-24">
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
              {sermon.title}
            </h1>
            <p className="text-xl text-foreground/90">
              {new Date(sermon.pubDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {sermon.itunes?.image ? (
              <div className="aspect-video mb-8">
                <img src={sermon.itunes.image} alt={sermon.title} className="w-full h-full object-cover rounded-lg" />
              </div>
            ) : (
              <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-8">
                <p className="text-gray-500">No Image</p>
              </div>
            )}
            {error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : (
              <AudioPlayer audioUrl={sermon.enclosure.url} transcript={{ json: transcript }} />
            )}
            <div className="mt-8" dangerouslySetInnerHTML={{ __html: sermon.description }} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default SermonDetail;
