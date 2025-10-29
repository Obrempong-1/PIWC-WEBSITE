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
import { ArrowLeft, Save, Trash2, Edit } from "lucide-react";
import { Database } from "@/types/Supabase";

type Gallery = Database['public']['Tables']['galleries']['Row'] & { gallery_sections: { name: string } };
type GallerySection = Database['public']['Tables']['gallery_sections']['Row'];

const GalleryManagement = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [sections, setSections] = useState<GallerySection[]>([]);
  const [editingSection, setEditingSection] = useState<GallerySection | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Database['public']['Tables']['galleries']['Row'], 'id' | 'created_at' | 'updated_at'>>({
    title: "",
    description: "",
    image_urls: [],
    video_url: "",
    gallery_date: "",
    display_order: 0,
    published: false,
    section_id: null
  });
  const { uploadFile, uploading } = useFileUpload();
  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [galleriesRes, sectionsRes] = await Promise.all([
      supabase.from("galleries").select("*, gallery_sections ( name )"),
      supabase.from("gallery_sections").select("*").order("display_order"),
    ]);

    if (galleriesRes.error || sectionsRes.error) {
      toast({
        title: "Error fetching data",
        description: galleriesRes.error?.message || sectionsRes.error?.message,
        variant: "destructive",
      });
    } else {
      setGalleries((galleriesRes.data as Gallery[]) || []);
      setSections(sectionsRes.data || []);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFileSelect = async (files: File[]) => {
    if (files.length > 0) {
      const uploadPromises = files.map(file => uploadFile(file, "images"));
      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter((url) => url !== null) as string[];
      setFormData(prev => ({ ...prev, image_urls: [...(prev.image_urls || []), ...validUrls] }));
      toast({ title: `${validUrls.length} image(s) uploaded successfully!` });
    }
  };

  const handleVideoFileSelect = async (files: File[]) => {
    if (files.length > 0) {
      const url = await uploadFile(files[0], "videos");
      if (url) {
        setFormData(prev => ({ ...prev, video_url: url }));
        toast({ title: "Video uploaded successfully!" });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSubmit = { ...formData };

    if (editingId) {
      const { error } = await supabase.from("galleries").update(dataToSubmit).eq("id", editingId);
      if (error) {
        toast({ title: "Error updating gallery", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Gallery updated successfully" });
        setEditingId(null);
        resetForm();
        fetchData();
      }
    } else {
      const { error } = await supabase.from("galleries").insert([dataToSubmit]);
      if (error) {
        toast({ title: "Error creating gallery", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Gallery created successfully" });
        resetForm();
        fetchData();
      }
    }
  };

  const handleEdit = (gallery: Gallery) => {
    setEditingId(gallery.id);
    setFormData({
      title: gallery.title,
      description: gallery.description || "",
      image_urls: gallery.image_urls || [],
      video_url: gallery.video_url || "",
      gallery_date: gallery.gallery_date || "",
      display_order: gallery.display_order || 0,
      published: gallery.published || false,
      section_id: gallery.section_id
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;

    const { error } = await supabase.from("galleries").delete().eq("id", id);
    if (error) {
      toast({ title: "Error deleting gallery", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Gallery deleted successfully" });
      fetchData();
    }
  };

  const handleSectionNameChange = (id: string, name: string) => {
    setSections(sections.map(s => s.id === id ? { ...s, name } : s));
  };

  const handleUpdateSectionName = async (section: GallerySection) => {
    const { error } = await supabase.from('gallery_sections').update({ name: section.name }).eq('id', section.id);
    if (error) {
      toast({ title: 'Error updating section name', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Section name updated successfully' });
      setEditingSection(null);
      fetchData();
    }
  };


  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      image_urls: [],
      video_url: "",
      gallery_date: "",
      display_order: 0,
      published: false,
      section_id: null
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
        <h1 className="text-3xl font-bold">Gallery Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Gallery Item" : "Add New Gallery Item"}</CardTitle>
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
                placeholder="Description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />

              <Select value={formData.section_id || ''} onValueChange={(value) => setFormData({ ...formData, section_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.map(section => (
                    <SelectItem key={section.id} value={section.id}>{section.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FileUpload 
                label="Images (can select multiple)"
                onFileSelect={handleFileSelect}
                uploading={uploading}
                uploaded={(formData.image_urls || []).length > 0}
                accept="image/*"
                multiple
              />

              <FileUpload 
                label="Video"
                onFileSelect={handleVideoFileSelect}
                uploading={uploading}
                uploaded={!!formData.video_url}
                accept="video/*"
              />

              <div className="flex flex-wrap gap-2">
                {(formData.image_urls || []).map((url, index) => (
                  <img key={index} src={url} alt={`Preview ${index}`} className="h-24 w-24 object-cover rounded" />
                ))}
                 {formData.video_url && (
                  <video src={formData.video_url} className="h-24 w-24 object-cover rounded" controls />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="date"
                  placeholder="Date"
                  value={formData.gallery_date || ''}
                  onChange={(e) => setFormData({ ...formData, gallery_date: e.target.value })}
                />
                <Input
                  type="number"
                  placeholder="Display Order"
                  value={formData.display_order || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, published: checked })
                  }
                />
                <label htmlFor="published" className="text-sm font-medium">Published</label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={uploading}>
                  <Save className="mr-2 h-4 w-4" />
                  {editingId ? "Update Item" : "Create Item"}
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
          <Card>
            <CardHeader>
                <CardTitle>Gallery Sections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {sections.map(section => (
                    <div key={section.id} className="flex items-center gap-2">
                        {editingSection?.id === section.id ? (
                            <Input
                                value={section.name}
                                onChange={(e) => handleSectionNameChange(section.id, e.target.value)}
                                className="flex-grow"
                            />
                        ) : (
                            <p className="flex-grow font-semibold text-blue-600">{section.name}</p>
                        )}
                        {editingSection?.id === section.id ? (
                            <Button size="sm" onClick={() => handleUpdateSectionName(section)}><Save className="h-4 w-4" /></Button>
                        ) : (
                            <Button size="sm" variant="outline" onClick={() => setEditingSection(section)}><Edit className="h-4 w-4" /></Button>
                        )}
                    </div>
                ))}
            </CardContent>
          </Card>

          {sections.map(section => (
            <div key={section.id}>
              <h2 className="text-xl font-semibold mb-2 text-blue-600">{section.name} ({galleries.filter(g => g.section_id === section.id).length})</h2>
              <div className="space-y-4">
                {galleries.filter(g => g.section_id === section.id).map((gallery) => (
                  <Card key={gallery.id}>
                    <CardContent className="pt-6">
                      <div className="flex gap-4 items-start">
                        <div className="flex-shrink-0 grid grid-cols-2 gap-2">
                        {(gallery.image_urls || []).map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt={`${gallery.title} image ${index + 1}`}
                            className="w-16 h-12 object-cover rounded"
                          />
                        ))}
                        </div>
                        {gallery.video_url && (
                          <div className="w-32 h-24 bg-black flex items-center justify-center rounded">
                              <video src={gallery.video_url} className="w-full h-full object-cover rounded" controls />
                            </div>
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold">{gallery.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{gallery.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${gallery.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                              {gallery.published ? "Published" : "Draft"}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(gallery)}>
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(gallery.id)}
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryManagement;
