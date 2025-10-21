import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';
import Loading from '@/components/Loading';

type Leader = Tables<'leaders'>;

const LeaderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [leader, setLeader] = useState<Leader | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeader = async () => {
      if (!id) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('leaders')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching leader:', error);
      } else {
        setLeader(data);
      }
      setLoading(false);
    };

    fetchLeader();
  }, [id]);

  if (loading) {
    return <Loading message="Loading leader's profile..." />;
  }

  if (!leader) {
    return <div className='flex justify-center items-center min-h-screen'>Leader not found.</div>;
  }

  return (
    <div className='container mx-auto p-6 pt-24 max-w-4xl'>
        <div className='bg-white rounded-lg shadow-xl overflow-hidden'>
          <img src={leader.image_url!} alt={leader.name} className='w-full h-96 object-contain' />
          <div className='p-8'>
            <h1 className='text-4xl font-bold mb-2'>{leader.name}</h1>
            <p className='text-xl text-gray-600 mb-4'>{leader.role}</p>
            <div className='prose max-w-none text-gray-700'>
              {leader.bio}
            </div>
          </div>
        </div>
    </div>
  );
};

export default LeaderDetail;
