import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import 'react-quill/dist/quill.snow.css';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFileUpload } from "@/hooks/useFileUpload";
import LazyQuill from "@/components/ui/LazyQuill";

interface Announcement {
  id: string;
  title: string;
  description: string;
  content: string | null;
  image_url: string | null;
  video_url: string | null;
  published: boolean;
  created_at: string;
  media_type: 'image' | 'video';
}

const AnnouncementsManagement = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    image_url: "",
    video_url: "",
    published: false,
    media_type: 'image' as 'image' | 'video',
  });
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { uploadFile, uploading } = useFileUpload();

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching announcements",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setAnnouncements(data as unknown as Announcement[]);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let mediaUrlToSubmit = null;
    if (mediaFile) {
      const bucket = formData.media_type === 'image' ? 'images' : 'videos';
      mediaUrlToSubmit = await uploadFile(mediaFile, bucket);
    }

    const dataToSubmit = { 
      ...formData, 
      image_url: formData.media_type === 'image' ? (mediaUrlToSubmit || formData.image_url) : null,
      video_url: formData.media_type === 'video' ? (mediaUrlToSubmit || formData.video_url) : null,
    };

    if (editingId) {
      const { error } = await supabase
        .from("announcements")
        .update(dataToSubmit)
        .eq("id", editingId);

      if (error) {
        toast({
          title: "Error updating announcement",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({ title: "Announcement updated successfully" });
        setEditingId(null);
        resetForm();
        fetchAnnouncements();
      }
    } else {
      const { error } = await supabase.from("announcements").insert([dataToSubmit]);

      if (error) {
        toast({
          title: "Error creating announcement",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({ title: "Announcement created successfully" });
        resetForm();
        fetchAnnouncements();
      }
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setFormData({
      title: announcement.title,
      description: announcement.description || "",
      content: announcement.content || "",
      image_url: announcement.image_url || "",
      video_url: announcement.video_url || "",
      published: announcement.published || false,
      media_type: announcement.media_type || 'image',
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;

    const { error } = await supabase.from("announcements").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting announcement",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Announcement deleted successfully" });
      fetchAnnouncements();
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      content: "",
      image_url: "",
      video_url: "",
      published: false,
      media_type: 'image',
    });
    setMediaFile(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" asChild>
          <Link to="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Announcements Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Announcement" : "Add New Announcement"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                placeholder="Announcement Title *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <Textarea
                placeholder="Announcement Description *"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
              />

              <div>
                <label className="font-medium">Content</label>
                <LazyQuill 
                  theme="snow"
                  value={formData.content || ''}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  className="mt-1 bg-white"
                />
              </div>

              <Select value={formData.media_type} onValueChange={(value) => setFormData({ ...formData, media_type: value as 'image' | 'video' })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select media type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                </SelectContent>
              </Select>

              <div className="space-y-2">
                <label className="font-medium">{formData.media_type === 'image' ? 'Image' : 'Video'}</label>
                <div className="flex items-center gap-4">
                  <Input
                    type="file"
                    onChange={(e) => setMediaFile(e.target.files ? e.target.files[0] : null)}
                    className="flex-1"
                    accept={formData.media_type === 'image' ? 'image/*' : 'video/*'}
                  />
                </div>
                {formData.image_url && formData.media_type === 'image' && !mediaFile && (
                  <div className="mt-2">
                    <img src={formData.image_url} alt="Current image" className="max-w-xs rounded-md"/>
                  </div>
                )}
                {formData.video_url && formData.media_type === 'video' && !mediaFile && (
                  <div className="mt-2">
                    <video src={formData.video_url} controls className="max-w-xs rounded-md" />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-4">
                <Switch
                  id="published"
                  checked={formData.published || false}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, published: checked })
                  }
                />
                <label htmlFor="published" className="text-sm font-medium">Published</label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={uploading}>
                  <Save className="mr-2 h-4 w-4" />
                  {editingId ? "Update Announcement" : "Create Announcement"}
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
          <h2 className="text-xl font-semibold">All Announcements ({announcements.length})</h2>
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardContent className="pt-6">
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{announcement.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{announcement.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${announcement.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        {announcement.published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(announcement)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(announcement.id)}
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

export default AnnouncementsManagement;
