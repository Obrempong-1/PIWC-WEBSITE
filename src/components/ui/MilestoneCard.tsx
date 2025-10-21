import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Milestone {
  id: string;
  year: string;
  event: string;
  description: string;
  image_url: string;
}

interface MilestoneCardProps {
  milestone: Milestone;
}

const MilestoneCard = ({ milestone }: MilestoneCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFlipped(prev => !prev);
    }, 3000); // Flip every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const plainTextDescription = milestone.description.replace(/<[^>]+>/g, '').substring(0, 100) + '...';

  return (
    <Link to={`/milestone/${milestone.id}`} className="w-full aspect-[4/3] [perspective:1000px] block group">
      <div
        className={`relative w-full h-full [transform-style:preserve-3d] transition-transform duration-700 ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        <div className="absolute w-full h-full [backface-visibility:hidden]">
            <div className="relative w-full h-full bg-black rounded-xl shadow-lg overflow-hidden">
                <img 
                    src={milestone.image_url}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover filter blur-md scale-110"
                />
                <img 
                    src={milestone.image_url}
                    alt={milestone.event}
                    className="relative w-full h-full object-contain z-10"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-xl z-20">
                    <div className="text-white text-xs font-semibold flex items-center">
                        Read More <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </div>
        </div>
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <Card className="w-full h-full flex flex-col justify-center items-center bg-primary/90 text-primary-foreground p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-2 text-center">{milestone.year} - {milestone.event}</h3>
                <p className="text-center text-sm">{plainTextDescription}</p>
                <div className="mt-4 text-xs font-semibold flex items-center">
                    Read More <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
            </Card>
        </div>
      </div>
    </Link>
  );
};

export default MilestoneCard;