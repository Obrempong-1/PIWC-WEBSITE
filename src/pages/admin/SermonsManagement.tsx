import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";

interface Sermon {
  id: string;
  title: string;
  preacher: string;
  date: string;
  snapshot_url: string | null;
  audio_url: string | null;
  presentation_url: string | null;
  published: boolean;
  created_at: string;
}

const SermonsManagement = () => {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    preacher: "",
    date: "",
    snapshot_url: "",
    audio_url: "",
    presentation_url: "",
    published: false,
  });
  const [snapshotFile, setSnapshotFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { uploadFile, uploading } = useFileUpload();

  const fetchSermons = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("sermons")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      toast({
        title: "Error fetching sermons",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setSermons(data as unknown as Sermon[]);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchSermons();
  }, [fetchSermons]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let snapshotUrlToSubmit = null;
    if (snapshotFile) {
      snapshotUrlToSubmit = await uploadFile(snapshotFile, 'images');
    }

    const dataToSubmit = { 
      ...formData, 
      snapshot_url: snapshotUrlToSubmit || formData.snapshot_url,
    };

    if (editingId) {
      const { error } = await supabase
        .from("sermons")
        .update(dataToSubmit)
        .eq("id", editingId);

      if (error) {
        toast({
          title: "Error updating sermon",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({ title: "Sermon updated successfully" });
        setEditingId(null);
        resetForm();
        fetchSermons();
      }
    } else {
      const { error } = await supabase.from("sermons").insert([dataToSubmit]);

      if (error) {
        toast({
          title: "Error creating sermon",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({ title: "Sermon created successfully" });
        resetForm();
        fetchSermons();
      }
    }
  };

  const handleEdit = (sermon: Sermon) => {
    setEditingId(sermon.id);
    setFormData({
      title: sermon.title,
      preacher: sermon.preacher || "",
      date: sermon.date || "",
      snapshot_url: sermon.snapshot_url || "",
      audio_url: sermon.audio_url || "",
      presentation_url: sermon.presentation_url || "",
      published: sermon.published || false,
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sermon?")) return;

    const { error } = await supabase.from("sermons").delete().eq("id", id);

    if (error) {
      toast({
        title: "Error deleting sermon",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({ title: "Sermon deleted successfully" });
      fetchSermons();
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
        title: "",
        preacher: "",
        date: "",
        snapshot_url: "",
        audio_url: "",
        presentation_url: "",
        published: false,
    });
    setSnapshotFile(null);
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
        <h1 className="text-3xl font-bold">Sermons Management</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Sermon" : "Add New Sermon"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                placeholder="Sermon Title *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <Input
                placeholder="Preacher *"
                value={formData.preacher}
                onChange={(e) => setFormData({ ...formData, preacher: e.target.value })}
                required
              />

              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />

              <div className="space-y-2">
                <label className="font-medium">Snapshot Image</label>
                <div className="flex items-center gap-4">
                    <Input
                        type="file"
                        onChange={(e) => setSnapshotFile(e.target.files ? e.target.files[0] : null)}
                        className="flex-1"
                        accept="image/*"
                    />
                </div>
                <Input
                    placeholder="Or enter image URL"
                    value={formData.snapshot_url || ''}
                    onChange={(e) => setFormData({ ...formData, snapshot_url: e.target.value })}
                />
                {formData.snapshot_url && !snapshotFile && (
                  <div className="mt-2">
                    <img src={formData.snapshot_url} alt="Current snapshot" className="max-w-xs rounded-md"/>
                  </div>
                )}
              </div>

              <Input
                placeholder="Spotify Audio URL"
                value={formData.audio_url || ''}
                onChange={(e) => setFormData({ ...formData, audio_url: e.target.value })}
              />

              <Input
                placeholder="Google Drive Presentation URL"
                value={formData.presentation_url || ''}
                onChange={(e) => setFormData({ ...formData, presentation_url: e.target.value })}
              />

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
                  {editingId ? "Update Sermon" : "Create Sermon"}
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
          <h2 className="text-xl font-semibold">All Sermons ({sermons.length})</h2>
          {sermons.map((sermon) => (
            <Card key={sermon.id}>
              <CardContent className="pt-6">
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{sermon.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{sermon.preacher} - {new Date(sermon.date).toLocaleDateString()}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${sermon.published ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        {sermon.published ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(sermon)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(sermon.id)}
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

export default SermonsManagement;
