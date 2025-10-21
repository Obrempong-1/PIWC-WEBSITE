import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";
import { ArrowLeft, Edit, Trash } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const MilestoneManager = () => {
  const [milestones, setMilestones] = useState<Database['public']['Tables']['milestones']['Row'][]>([]);
  const [year, setYear] = useState("");
  const [event, setEvent] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [editingMilestone, setEditingMilestone] = useState<Database['public']['Tables']['milestones']['Row'] | null>(null);
  const [editingDescription, setEditingDescription] = useState("");

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    const { data, error } = await supabase.from("milestones").select("*").order("created_at");
    if (data) {
      setMilestones(data);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!imageFile) {
        toast({ title: "Error", description: "Please select an image to upload.", variant: "destructive" });
      return;
    }
    if (year === "") {
        toast({ title: "Error", description: "Please enter a valid year.", variant: "destructive" });
        return;
    }

    setLoading(true);

    try {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `milestone-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;

      const { data, error: insertError } = await supabase
        .from("milestones")
        .insert([{ year, event, description, image_url: imageUrl }])
        .select();

      if (insertError) throw insertError;

      if(data) {
        setMilestones([...milestones, data[0]]);
      }

      toast({ title: "Success", description: "Milestone added successfully!" });
      setYear("");
      setEvent("");
      setDescription("");
      setImageFile(null);
      const fileInput = document.getElementById('imageFile') as HTMLInputElement;
      if(fileInput) fileInput.value = '';

    } catch (error: unknown) {
        let errorMessage = "An unknown error occurred.";
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this milestone?")) {
      try {
        const { error } = await supabase.from("milestones").delete().eq("id", id);
        if (error) throw error;
        setMilestones(milestones.filter(m => m.id !== id));
        toast({ title: "Success", description: "Milestone deleted successfully!" });
      } catch (error: unknown) {
        let errorMessage = "An unknown error occurred.";
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        toast({ title: "Error", description: errorMessage, variant: "destructive" });
      }
    }
  };

  const handleEdit = (milestone: Database['public']['Tables']['milestones']['Row']) => {
    setEditingMilestone(milestone);
    setEditingDescription(milestone.description);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingMilestone) return;

    setLoading(true);

    try {
      let imageUrl = editingMilestone.image_url;
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `milestone-images/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("images")
          .getPublicUrl(filePath);

        imageUrl = urlData.publicUrl;
      }

      const { data, error } = await supabase
        .from("milestones")
        .update({
          year: editingMilestone.year,
          event: editingMilestone.event,
          description: editingDescription,
          image_url: imageUrl,
        })
        .eq("id", editingMilestone.id)
        .select();

      if (error) throw error;

      if(data) {
        const updatedMilestone = data[0];
        setMilestones(milestones.map(m => m.id === updatedMilestone.id ? updatedMilestone : m));
      }

      toast({ title: "Success", description: "Milestone updated successfully!" });
      setEditingMilestone(null);
      setEditingDescription("");
      setImageFile(null);
    } catch (error: unknown) {
      let errorMessage = "An unknown error occurred.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 bg-gray-50/50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Milestone Manager</h1>
            <Button asChild variant="outline">
                <Link to="/admin">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Link>
            </Button>
        </div>

        {editingMilestone ? (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Edit Milestone</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdate}>
                <div className="grid w-full items-center gap-4">
                  <Input
                    type="number"
                    placeholder="Year"
                    value={editingMilestone.year}
                    onChange={(e) =>
                      setEditingMilestone({
                        ...editingMilestone,
                        year: e.target.value,
                      })
                    }
                    required
                  />
                  <Input
                    placeholder="Event"
                    value={editingMilestone.event}
                    onChange={(e) =>
                      setEditingMilestone({
                        ...editingMilestone,
                        event: e.target.value,
                      })
                    }
                    required
                  />
                  <ReactQuill
                    theme="snow"
                    value={editingDescription}
                    onChange={setEditingDescription}
                  />
                  <div>
                    <label htmlFor="imageFile" className="text-sm font-medium">
                      Milestone Image (optional, leave blank to keep existing)
                    </label>
                    <Input
                      id="imageFile"
                      type="file"
                      onChange={handleFileChange}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Updating..." : "Update Milestone"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setEditingMilestone(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Add New Milestone</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid w-full items-center gap-4">
                  <Input id="year" type="number" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} required />
                  <Input id="event" placeholder="Event" value={event} onChange={(e) => setEvent(e.target.value)} required />
                  <ReactQuill theme="snow" value={description} onChange={setDescription} />
                  <div>
                      <label htmlFor="imageFile" className="text-sm font-medium">Milestone Image</label>
                      <Input id="imageFile" type="file" onChange={handleFileChange} required className="mt-1"/>
                  </div>
                  <Button type="submit" disabled={loading}>{loading ? "Adding..." : "Add Milestone"}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div>
            <h2 className="text-xl font-semibold mb-4">Existing Milestones</h2>
            <div className="space-y-4">
                {milestones.map((milestone) => (
                    <Card key={milestone.id}>
                        <CardContent className="flex items-center justify-between p-4">
                            <div className="flex items-center gap-4">
                                <img src={milestone.image_url ?? ''} alt={milestone.event ?? ''} className="w-24 h-24 object-cover rounded-md"/>
                                <div>
                                    <h3 className="font-bold">{milestone.year} - {milestone.event}</h3>
                                    <div dangerouslySetInnerHTML={{ __html: milestone.description.substring(0, 100) + '...' }} className="text-sm text-gray-600"/>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="icon" onClick={() => handleEdit(milestone)}>
                                    <Edit className="h-4 w-4"/>
                                </Button>
                                <Button variant="destructive" size="icon" onClick={() => handleDelete(milestone.id)}>
                                    <Trash className="h-4 w-4"/>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default MilestoneManager;