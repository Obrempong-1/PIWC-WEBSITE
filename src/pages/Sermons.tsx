
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Sermon = {
  guid: string;
  title: string;
  description: string;
  pubDate: string;
  enclosure: {
    url: string;
  };
  itunes?: {
    image?: string;
  };
  'podcast:transcript'?: {
    $: {
      url: string;
    }
  }
};

const Sermons = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        const feedUrl = `https://anchor.fm/s/10b0a2fec/podcast/rss?t=${new Date().getTime()}`;
        const proxyUrl = 'https://corsproxy.io/?';
        const response = await fetch(`${proxyUrl}${encodeURIComponent(feedUrl)}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, "application/xml");
        
        const parserError = xml.querySelector("parsererror");
        if (parserError) {
          console.error("XML Parsing Error:", parserError.textContent);
          throw new Error("Failed to parse the sermon feed. The format may be incorrect.");
        }

        const items = Array.from(xml.querySelectorAll("item")).map((item, index) => {
          const enclosure = item.querySelector("enclosure");
          const itunesImage = item.getElementsByTagName('itunes:image')[0];
          const podcastTranscript = item.getElementsByTagName('podcast:transcript')[0];
          const guid = item.querySelector("guid")?.textContent || enclosure?.getAttribute("url") || String(index);

          return {
            guid,
            title: item.querySelector("title")?.textContent || "",
            description: item.querySelector("description")?.textContent || "",
            pubDate: item.querySelector("pubDate")?.textContent || "",
            enclosure: {
              url: enclosure?.getAttribute("url") || "",
            },
            itunes: {
              image: itunesImage?.getAttribute("href") || undefined,
            },
            'podcast:transcript': podcastTranscript
              ? {
                  $: {
                    url: podcastTranscript.getAttribute("url") || "",
                  },
                }
              : undefined,
          } as Sermon;
        });

        if (items.length === 0) {
            setError("Sermon feed fetched successfully, but it contains no sermons.");
        } else {
            setSermons(items);
        }

      } catch (e: any) {
        console.error("Failed to fetch or parse sermons:", e);
        setError(`Failed to load sermons. Error: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchSermons();
  }, []);

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
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sermons.map((sermon) => (
                <Link to={`/sermons/${encodeURIComponent(sermon.guid)}`} state={{sermon}} key={sermon.guid}>
                  <Card className="frosted-glass hover:bg-primary/10 transition-colors h-full flex flex-col border-2 border-yellow-400">
                    {sermon.itunes?.image ? (
                        <div className="aspect-video overflow-hidden rounded-t-lg">
                            <img src={sermon.itunes.image} alt={sermon.title} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                      <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded-t-lg flex items-center justify-center">
                        <p className="text-gray-500">No Image</p>
                      </div>
                    )}
                    <CardContent className="pt-6 flex-grow">
                      <div>
                        <h3 className="text-lg font-semibold text-primary">{sermon.title}</h3>
                        <p className="text-sm text-muted-foreground">{new Date(sermon.pubDate).toLocaleDateString()}</p>
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
