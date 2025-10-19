import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save } from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";

interface WelcomeSection {
  id: string;
  title: string;
  content: string;
  video_url: string | null;
  published: boolean;
  display_order: number;
}

const WelcomeSectionManagement = () => {
  const [sections, setSections] = useState<WelcomeSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    video_url: "",
    published: false,
    display_order: 0,
  });
  const { toast } = useToast();
  const { uploading, uploadFile } = useFileUpload();

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    const { data, error } = await supabase
      .from("welcome_section")
      .select("*")
      .order("display_order");

    if (error) {
      toast({ title: "Error fetching sections", description: error.message, variant: "destructive" });
    } else {
      setSections(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      const { error } = await supabase
        .from("welcome_section")
        .update(formData)
        .eq("id", editingId);

      if (error) {
        toast({ title: "Error updating section", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Section updated successfully" });
        resetForm();
        fetchSections();
      }
    } else {
      const { error } = await supabase.from("welcome_section").insert([formData]);

      if (error) {
        toast({ title: "Error creating section", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Section created successfully" });
        resetForm();
        fetchSections();
      }
    }
  };

  const handleEdit = (section: WelcomeSection) => {
    setEditingId(section.id);
    setFormData({
      title: section.title,
      content: section.content,
      video_url: section.video_url || "",
      published: section.published,
      display_order: section.display_order,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return;

    const { error } = await supabase.from("welcome_section").delete().eq("id", id);

    if (error) {
      toast({ title: "Error deleting section", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Section deleted successfully" });
      fetchSections();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadFile(file, "videos");
    if (url) {
      setFormData({ ...formData, video_url: url });
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      content: "",
      video_url: "",
      published: false,
      display_order: 0,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Welcome Section Management</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingId ? "Edit Section" : "Add New Section"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={4}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Video Upload</label>
              <Input type="file" accept="video/*" onChange={handleFileChange} disabled={uploading} />
              {formData.video_url && (
                <p className="text-sm text-muted-foreground mt-2">Video uploaded</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Display Order</label>
              <Input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              />
              <label htmlFor="published" className="text-sm font-medium">
                Published
              </label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={uploading}>
                <Save className="mr-2 h-4 w-4" />
                {editingId ? "Update" : "Create"}
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

      <div className="grid gap-4">
        {sections.map((section) => (
          <Card key={section.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">{section.title}</h3>
                  <p className="text-muted-foreground mb-2">{section.content}</p>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Order: {section.display_order}</span>
                    <span>{section.published ? "Published" : "Draft"}</span>
                    {section.video_url && <span>Has Video</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleEdit(section)}>
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(section.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WelcomeSectionManagement;
