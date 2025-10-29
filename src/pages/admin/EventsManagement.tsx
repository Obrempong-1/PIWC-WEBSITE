
import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileUpload } from "@/components/ui/FileUpload";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { Database } from "@/types/Supabase";

type Event = Database['public']['Tables']['events']['Row'];

const EventsManagement = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Event, 'id' | 'created_at' | 'updated_at' | 'icon'>>({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    event_time: "",
    location: "",
    image_url: "",
    media_type: "image",
    video_url: "",
    category: "event",
    published: false,
  });
  const { uploadFile, deleteFile, uploading } = useFileUpload();
  const { toast } = useToast();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("start_date", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching events",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleFileSelect = async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];

      
      if (editingId && originalImageUrl) {
        const success = await deleteFile(originalImageUrl, "images");
        if (!success) {
          toast({
            title: "Error Deleting Old Image",
            description: "Could not delete the old image from storage. Please try again.",
            variant: "destructive",
          });
          return;
        }
      }

      const url = await uploadFile(file, "images");
      if (url) {
        setFormData(prev => ({ ...prev, image_url: url }));
        toast({ title: "Image uploaded successfully!" });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSubmit: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'icon'> = { ...formData };
    if (dataToSubmit.media_type === 'image') {
      dataToSubmit.video_url = null;
    } else {
      dataToSubmit.image_url = null;
    }

    if (editingId) {
      const { error } = await supabase
        .from("events")
        .update(dataToSubmit)
        .eq("id", editingId);

      if (error) {
        toast({
          title: "Error updating event",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({ title: "Event updated successfully" });
        setEditingId(null);
        resetForm();
        fetchEvents();
      }
    } else {
      const { error } = await supabase.from("events").insert([dataToSubmit]);

      if (error) {
        toast({
          title: "Error creating event",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({ title: "Event created successfully" });
        resetForm();
        fetchEvents();
      }
    }
  };

  const handleEdit = (event: Event) => {
    setEditingId(event.id);
    setOriginalImageUrl(event.image_url);
    setFormData({
      title: event.title,
      description: event.description || "",
      start_date: event.start_date || "",
      end_date: event.end_date || "",
      event_time: event.event_time || "",
      location: event.location || "",
      image_url: event.image_url || "",
      media_type: event.media_type,
      video_url: event.video_url || "",
      category: event.category || "event",
      published: event.published || false,
    });
  };

  const handleDelete = async (eventToDelete: Event) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    
    if (eventToDelete.image_url && eventToDelete.media_type === 'image') {
      const success = await deleteFile(eventToDelete.image_url, "images");
      if (!success) {
        toast({
          title: "Error Deleting Image",
          description: "The event's image could not be deleted from storage. Please try again.",
          variant: "destructive",
        });
        return; 
      }
    }

    const { error } = await supabase.from("events").delete().eq("id", eventToDelete.id);

    if (error) {
      toast({
        title: "Error deleting event",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Event deleted successfully" });
      fetchEvents();
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setOriginalImageUrl(null);
    setFormData({
      title: "",
      description: "",
      start_date: "",
      end_date: "",
      event_time: "",
      location: "",
      image_url: "",
      media_type: "image",
      video_url: "",
      category: "event",
      published: false,
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" asChild>
          <Link to="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Events Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Event" : "Add New Event"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  placeholder="Event Title *"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />

                <Textarea
                  placeholder="Event Description *"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start_date" className="text-sm font-medium">Start Date</label>
                  <Input
                    id="start_date"
                    type="date"
                    placeholder="Start Date (Optional)"
                    value={formData.start_date || ''}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="end_date" className="text-sm font-medium">End Date</label>
                  <Input
                    id="end_date"
                    type="date"
                    placeholder="End Date (Optional)"
                    value={formData.end_date || ''}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>

                <Input
                  placeholder="Event Time (e.g., 9:00 AM - 5:00 PM) (Optional)"
                  value={formData.event_time || ''}
                  onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
                />

                <Input
                  placeholder="Location"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />

                <Select value={formData.media_type} onValueChange={(value) => setFormData({ ...formData, media_type: value as 'image' | 'video' })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select media type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>

                {formData.media_type === 'image' ? (
                  <FileUpload 
                    label="Event Image"
                    onFileSelect={handleFileSelect}
                    uploading={uploading}
                    uploaded={!!formData.image_url}
                    accept="image/*"
                  />
                ) : (
                  <Input
                    placeholder="Video URL"
                    value={formData.video_url || ''}
                    onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  />
                )}
                {formData.image_url && formData.media_type === 'image' && (
                    <img src={formData.image_url} alt="Preview" className="mt-2 h-32 object-cover rounded" />
                )}

                <Select value={formData.category || ''} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="event">Event</SelectItem>
                    <SelectItem value="worship">Worship</SelectItem>
                    <SelectItem value="conference">Conference</SelectItem>
                    <SelectItem value="outreach">Outreach</SelectItem>
                    <SelectItem value="fellowship">Fellowship</SelectItem>
                  </SelectContent>
                </Select>

              <div className="flex items-center gap-2">
                <Switch
                  id="published"
                  checked={formData.published || false}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, published: checked })
                  }
                />
                <label htmlFor="published" className="text-sm font-medium">Published</label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={uploading}>
                  <Save className="mr-2 h-4 w-4" />
                  {editingId ? "Update Event" : "Create Event"}
                </Button>
                {editingId && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                  >
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">All Events ({events.length})</h2>
          {events.map((event) => (
            <Card key={event.id}>
              <CardContent className="pt-6">
                <div className="flex gap-4 items-start">
                  {event.media_type === 'image' && event.image_url && (
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-32 h-24 object-cover rounded"
                    />
                  )}
                  {event.media_type === 'video' && event.video_url && (
                     <div className="w-32 h-24 bg-black flex items-center justify-center rounded">
                        <p className="text-white">Video</p>
                      </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {event.start_date} {event.end_date && `- ${event.end_date}`}
                    </p>
                    <p className="text-sm text-muted-foreground">{event.event_time}</p>
                    <p className="text-xs text-muted-foreground">{event.location}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${event.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        {event.published ? "Published" : "Draft"}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                        {event.category}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                        {event.media_type}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(event)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(event)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsManagement;
