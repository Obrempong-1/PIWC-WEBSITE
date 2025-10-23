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

type Leader = Tables<"leaders">;

const LeadersManagement = () => {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Leader, 'id' | 'created_at' | 'updated_at'>>({
    name: "",
    role: "",
    ministry: "",
    contact: "",
    bio: "",
    image_url: "",
    display_order: 0,
    published: false,
  });
  const { uploadFile, deleteFile, uploading } = useFileUpload();
  const { toast } = useToast();

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("leaders")
      .select("*")
      .order("display_order");

    if (error) {
      toast({
        title: "Error fetching leaders",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setLeaders(data || []);
    }
    setLoading(false);
  };

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

    const dataToSubmit = { ...formData };

    if (editingId) {
      const { error } = await supabase
        .from("leaders")
        .update(dataToSubmit)
        .eq("id", editingId);

      if (error) {
        toast({
          title: "Error updating leader",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({ title: "Leader updated successfully" });
        setEditingId(null);
        resetForm();
        fetchLeaders();
      }
    } else {
      const { error } = await supabase.from("leaders").insert([dataToSubmit]);

      if (error) {
        toast({
          title: "Error creating leader",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({ title: "Leader created successfully" });
        resetForm();
        fetchLeaders();
      }
    }
  };

  const handleEdit = (leader: Leader) => {
    setEditingId(leader.id);
    setOriginalImageUrl(leader.image_url);
    setFormData({
      name: leader.name,
      role: leader.role,
      ministry: leader.ministry || "",
      contact: leader.contact || "",
      bio: leader.bio || "",
      image_url: leader.image_url || "",
      display_order: leader.display_order || 0,
      published: leader.published || false,
    });
  };

  const handleDelete = async (leader: Leader) => {
    if (!confirm("Are you sure you want to delete this leader?")) return;

    if (leader.image_url) {
      const success = await deleteFile(leader.image_url, "images");
      if (!success) {
        toast({
          title: "Error Deleting Image",
          description: "Could not delete the leader's image from storage. Aborting deletion.",
          variant: "destructive",
        });
        return;
      }
    }

    const { error } = await supabase.from("leaders").delete().eq("id", leader.id);

    if (error) {
      toast({
        title: "Error deleting leader",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Leader deleted successfully" });
      fetchLeaders();
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setOriginalImageUrl(null);
    setFormData({
      name: "",
      role: "",
      ministry: "",
      contact: "",
      bio: "",
      image_url: "",
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
        <h1 className="text-3xl font-bold">Leaders Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Leader" : "Add New Leader"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                placeholder="Full Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Input
                placeholder="Role/Title *"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
              />

              <Input
                placeholder="Ministry"
                value={formData.ministry || ''}
                onChange={(e) => setFormData({ ...formData, ministry: e.target.value })}
              />

              <Input
                placeholder="Contact Information"
                value={formData.contact || ''}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              />

              <Textarea
                placeholder="Short Bio"
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
              />

              <FileUpload 
                label="Leader's Photo"
                onFileSelect={handleFileSelect}
                uploading={uploading}
                uploaded={!!formData.image_url}
                accept="image/*"
              />
              {formData.image_url && (
                  <img src={formData.image_url} alt="Preview" className="mt-2 h-32 w-32 object-cover rounded-full" />
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
                  {editingId ? "Update Leader" : "Create Leader"}
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
          <h2 className="text-xl font-semibold">All Leaders ({leaders.length})</h2>
          {leaders.map((leader) => (
            <Card key={leader.id}>
              <CardContent className="pt-6">
                <div className="flex gap-4 items-center">
                  {leader.image_url && (
                    <img
                      src={leader.image_url}
                      alt={leader.name}
                      className="w-24 h-24 object-cover rounded-full"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{leader.name}</h3>
                    <p className="text-sm text-muted-foreground">{leader.role}</p>
                    {leader.ministry && (
                      <p className="text-xs text-muted-foreground">{leader.ministry}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${leader.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        {leader.published ? "Published" : "Draft"}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                        Order: {leader.display_order}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(leader)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(leader)}
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

export default LeadersManagement;