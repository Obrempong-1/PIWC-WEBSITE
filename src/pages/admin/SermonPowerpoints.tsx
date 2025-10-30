
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

type Sermon = {
  guid: string;
  title: string;
  pubDate: string;
};

type SermonPowerpoint = {
  sermon_guid: string;
  powerpoint_url: string;
};

const SermonPowerpoints = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [powerpoints, setPowerpoints] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSermonsAndPowerpoints();
  }, []);

  const fetchSermonsAndPowerpoints = async () => {
    setLoading(true);
    try {
      const feedUrl = `https://anchor.fm/s/10b0a2fec/podcast/rss?t=${new Date().getTime()}`;
      const proxyUrl = "https://corsproxy.io/?";
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
        const guid = item.querySelector("guid")?.textContent || enclosure?.getAttribute("url") || String(index);
        return {
          guid,
          title: item.querySelector("title")?.textContent || "",
          pubDate: item.querySelector("pubDate")?.textContent || "",
        };
      });

      if (items.length === 0) {
        throw new Error("Sermon feed fetched successfully, but it contains no sermons.");
      }

      setSermons(items);

      const { data: powerpointData, error: powerpointError } = await supabase
        .from("sermon_powerpoints")
        .select("*");

      if (powerpointError) {
        throw powerpointError;
      }

      const powerpointMap = powerpointData.reduce((acc, pp: SermonPowerpoint) => {
        acc[pp.sermon_guid] = pp.powerpoint_url;
        return acc;
      }, {} as Record<string, string>);
      setPowerpoints(powerpointMap);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Error fetching data",
        description: error.message,
        variant: "destructive",
      });
       setSermons([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUrlChange = (guid: string, url: string) => {
    setPowerpoints((prev) => ({ ...prev, [guid]: url }));
  };

  const convertToDownloadUrl = (googleDriveUrl: string) => {
    const regex = /drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/;
    const match = googleDriveUrl.match(regex);

    if (match && match[1]) {
      const fileId = match[1];
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }

    return googleDriveUrl;
  };

  const handleSave = async (guid: string) => {
    const url = powerpoints[guid];
    if (!url) {
      toast({
        title: "URL is empty",
        description: "Please provide a URL.",
        variant: "destructive",
      });
      return;
    }

    const downloadUrl = convertToDownloadUrl(url);

    try {
      const { error } = await supabase
        .from("sermon_powerpoints")
        .upsert(
          [
            {
              sermon_guid: guid,
              powerpoint_url: downloadUrl,
            },
          ],
          { onConflict: "sermon_guid" }
        );

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Powerpoint link saved successfully.",
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Error saving link",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (guid: string) => {
    try {
      const { error } = await supabase
        .from("sermon_powerpoints")
        .delete()
        .eq("sermon_guid", guid);

      if (error) {
        throw error;
      }

      setPowerpoints((prev) => {
        const newPowerpoints = { ...prev };
        delete newPowerpoints[guid];
        return newPowerpoints;
      });

      toast({
        title: "Success",
        description: "Powerpoint link deleted successfully.",
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Error deleting link",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen pt-24">
      <section className="py-10">
        <div className="container mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle>Manage Sermon Powerpoints</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div>Loading...</div>
              ) : sermons.length > 0 ? (
                <div className="space-y-4">
                  {sermons.map((sermon) => (
                    <div
                      key={sermon.guid}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-grow mb-4 sm:mb-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{sermon.title}</h3>
                          {powerpoints[sermon.guid] && (
                            <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                              File Attached
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(sermon.pubDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex w-full sm:w-auto sm:space-x-2">
                        <Input
                          type="url"
                          placeholder="Google Drive URL"
                          value={powerpoints[sermon.guid] || ""}
                          onChange={(e) =>
                            handleUrlChange(sermon.guid, e.target.value)
                          }
                          className="flex-grow"
                        />
                        <Button
                          onClick={() => handleSave(sermon.guid)}
                          className="ml-2 sm:ml-0"
                        >
                          Save
                        </Button>
                        {powerpoints[sermon.guid] && (
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(sermon.guid)}
                            className="ml-2 sm:ml-0"
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Could not load sermons. Please try again later.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default SermonPowerpoints;
