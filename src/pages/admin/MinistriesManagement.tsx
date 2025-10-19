import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { FileUpload } from "@/components/ui/FileUpload";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type Ministry = Tables<"ministries">;

const MinistriesManagement = () => {
  const [ministries, setMinistries] = useState<Ministry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Ministry, 'id' | 'created_at' | 'updated_at'>>({
    title: "",
    description: "",
    long_description: "",
    leader_name: "",
    age_group: "",
    schedule: "",
    image_url: "",
    icon_name: "",
    display_order: 0,
    published: false,
  });
  const { uploadFile, uploading } = useFileUpload();
  const { toast } = useToast();

  useEffect(() => {
    fetchMinistries();
  }, []);

  const fetchMinistries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("ministries")
      .select("*")
      .order("display_order");

    if (error) {
      toast({
        title: "Error fetching ministries",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setMinistries(data || []);
    }
    setLoading(false);
  };

  const handleFileSelect = async (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      const url = await uploadFile(file, "images");
      if (url) {
        setFormData(prev => ({ ...prev, image_url: url }));
        toast({ title: "Image uploaded successfully!" });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSubmit = { ...formData };

    if (editingId) {
      const { error } = await supabase
        .from("ministries")
        .update(dataToSubmit)
        .eq("id", editingId);

      if (error) {
        toast({
          title: "Error updating ministry",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({ title: "Ministry updated successfully" });
        setEditingId(null);
        resetForm();
        fetchMinistries();
      }
    } else {
      const { error } = await supabase.from("ministries").insert([dataToSubmit]);

      if (error) {
        toast({
          title: "Error creating ministry",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({ title: "Ministry created successfully" });
        resetForm();
        fetchMinistries();
      }
    }
  };

  const handleEdit = (ministry: Ministry) => {
    setEditingId(ministry.id);
    setFormData({
      title: ministry.title,
      description: ministry.description,
      long_description: ministry.long_description || "",
      leader_name: ministry.leader_name || "",
      age_group: ministry.age_group || "",
      schedule: ministry.schedule || "",
      image_url: ministry.image_url || "",
      icon_name: ministry.icon_name || "",
      display_order: ministry.display_order || 0,
      published: ministry.published || false,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this ministry?")) return;

    const { error } = await supabase.from("ministries").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting ministry",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Ministry deleted successfully" });
      fetchMinistries();
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      long_description: "",
      leader_name: "",
      age_group: "",
      schedule: "",
      image_url: "",
      icon_name: "",
      display_order: 0,
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
        <h1 className="text-3xl font-bold">Ministries Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Ministry" : "Add New Ministry"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                placeholder="Ministry Title *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <Textarea
                placeholder="Short Description *"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={3}
              />

              <Textarea
                placeholder="Long Description"
                value={formData.long_description || ''}
                onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                rows={5}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Leader Name"
                  value={formData.leader_name || ''}
                  onChange={(e) => setFormData({ ...formData, leader_name: e.target.value })}
                />
                <Input
                  placeholder="Age Group (e.g., All Ages)"
                  value={formData.age_group || ''}
                  onChange={(e) => setFormData({ ...formData, age_group: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Schedule (e.g., Sundays 9 AM)"
                  value={formData.schedule || ''}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                />
                <Input
                  placeholder="Icon Name (e.g., Heart)"
                  value={formData.icon_name || ''}
                  onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                />
              </div>
              
              <FileUpload 
                label="Ministry Image"
                onFileSelect={handleFileSelect}
                uploading={uploading}
                uploaded={!!formData.image_url}
                accept="image/*"
              />
              {formData.image_url && (
                  <img src={formData.image_url} alt="Preview" className="mt-2 h-32 object-cover rounded" />
              )}

              <Input
                type="number"
                placeholder="Display Order"
                value={formData.display_order || ''}
                onChange={(e) =>
                  setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })
                }
              />

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
                  {editingId ? "Update Ministry" : "Create Ministry"}
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
          <h2 className="text-xl font-semibold">All Ministries ({ministries.length})</h2>
          {ministries.map((ministry) => (
            <Card key={ministry.id}>
              <CardContent className="pt-6">
                <div className="flex gap-4 items-start">
                  {ministry.image_url && (
                    <img
                      src={ministry.image_url}
                      alt={ministry.title}
                      className="w-32 h-24 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{ministry.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{ministry.description}</p>
                    {ministry.leader_name && (
                      <p className="text-xs text-muted-foreground">Leader: {ministry.leader_name}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${ministry.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        {ministry.published ? "Published" : "Draft"}
                      </span>
                      {ministry.age_group && (
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                          {ministry.age_group}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(ministry)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(ministry.id)}
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

export default MinistriesManagement;
