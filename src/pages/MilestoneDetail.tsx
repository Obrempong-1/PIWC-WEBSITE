import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import MilestoneDetailSkeleton from "@/components/ui/MilestoneDetailSkeleton";

const MilestoneDetail = () => {
  const { id } = useParams();
  const [milestone, setMilestone] = useState<Database['public']['Tables']['milestones']['Row'] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMilestone = async () => {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from("milestones")
          .select("*")
          .eq("id", id)
          .single();
        if (error) throw error;
        setMilestone(data);
      } catch (error) {
        console.error("Error fetching milestone:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMilestone();
  }, [id]);

  if (loading) {
    return <MilestoneDetailSkeleton />;
  }

  if (!milestone) {
    return <div className="min-h-screen pt-24 flex justify-center items-center">Milestone not found.</div>;
  }

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{milestone.year} - {milestone.event}</h1>
          <img src={milestone.image_url ?? ''} alt={milestone.event ?? ''} className="w-full h-auto object-cover rounded-lg mb-8"/>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: milestone.description }} />
        </div>
      </div>
    </div>
  );
};

export default MilestoneDetail;
