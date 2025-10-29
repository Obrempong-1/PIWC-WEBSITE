import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Database } from "@/types/Supabase";
import 'react-quill/dist/quill.snow.css';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFileUpload } from "@/hooks/useFileUpload";
import LazyQuill from "@/components/ui/LazyQuill";

type Notice = Database['public']['Tables']['notice_board']['Row'];

const NoticeBoardManagement = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Notice, 'id' | 'created_at' | 'updated_at'>>({
    title: "",
    description: "",
    content: "",
    image_url: "",
    video_url: "",
    published: false,
    display_order: 0,
    media_type: "image",
    media_url: "",
  });
  const { toast } = useToast();
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const { uploadFile, uploading } = useFileUpload();

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("notice_board")
      .select("*")
      .order("display_order");

    if (error) {
      toast({ title: "Error fetching notices", description: error.message, variant: "destructive" });
    } else {
      setNotices(data || []);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

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
        .from("notice_board")
        .update(dataToSubmit)
        .eq("id", editingId);

      if (error) {
        toast({ title: "Error updating notice", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Notice updated successfully" });
        resetForm();
        fetchNotices();
      }
    } else {
      const { error } = await supabase.from("notice_board").insert([dataToSubmit]);

      if (error) {
        toast({ title: "Error creating notice", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Notice created successfully" });
        resetForm();
        fetchNotices();
      }
    }
  };

  const handleEdit = (notice: Notice) => {
    setEditingId(notice.id);
    setFormData({
      title: notice.title,
      description: notice.description || '',
      content: notice.content || '',
      image_url: notice.image_url || '',
      video_url: notice.video_url || '',
      published: notice.published,
      display_order: notice.display_order,
      media_type: notice.media_type || 'image',
      media_url: notice.media_url || '',
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;

    const { error } = await supabase.from("notice_board").delete().eq("id", id);

    if (error) {
      toast({ title: "Error deleting notice", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Notice deleted successfully" });
      fetchNotices();
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
      display_order: 0,
      media_type: "image",
      media_url: "",
    });
    setMediaFile(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Notice Board Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Notice" : "Add New Notice"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                placeholder="Title *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <Textarea
                placeholder="Description *"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                required
              />
              
              <div>
                <label className="font-medium">Content</label>
                <LazyQuill 
                  theme="snow"
                  value={formData.content}
                  onChange={(value) => setFormData({ ...formData, content: value })}
                  className="mt-1 bg-white"
                />
              </div>

              <Select value={formData.media_type || 'image'} onValueChange={(value) => setFormData({ ...formData, media_type: value as 'image' | 'video' })}>
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

              <Input
                type="number"
                placeholder="Display Order"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              />

              <div className="flex items-center gap-2">
                <Switch
                  id="published-switch"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
                <label htmlFor="published-switch" className="text-sm font-medium">
                  Published
                </label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={uploading}>
                  <Save className="mr-2 h-4 w-4" />
                  {editingId ? "Update Notice" : "Create Notice"}
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Current Notices</h2>
            {notices.map((notice) => (
                <Card key={notice.id}>
                <CardContent className="pt-6">
                    <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{notice.title}</h3>
                        <div className="text-muted-foreground mb-2 line-clamp-2" dangerouslySetInnerHTML={{ __html: notice.description || '' }} />
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span>Order: {notice.display_order}</span>
                        <span className={`font-medium ${notice.published ? 'text-green-600' : 'text-yellow-600'}`}>{notice.published ? "Published" : "Draft"}</span>
                        </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(notice)}>
                        Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(notice.id)}>
                        <Trash2 className="h-4 w-4"/>
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

export default NoticeBoardManagement;
