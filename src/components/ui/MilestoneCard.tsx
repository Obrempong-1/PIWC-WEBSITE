import { useState, useEffect, useRef, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const intervalRef = useRef<number | undefined>();

  const stopAutoRotation = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
  }, []);

  const startAutoRotation = useCallback(() => {
    stopAutoRotation();
    intervalRef.current = window.setInterval(() => {
      setIsFlipped(prev => !prev);
    }, 3000); // 3 seconds
  }, [stopAutoRotation]);

  useEffect(() => {
    startAutoRotation();
    return () => stopAutoRotation();
  }, [startAutoRotation, stopAutoRotation]);

  const handleInteraction = () => {
    if (isMobile) {
      stopAutoRotation();
      setIsFlipped(prev => !prev);
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile) {
      stopAutoRotation();
      setIsFlipped(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsFlipped(false);
      startAutoRotation();
    }
  };

  const plainTextDescription = milestone.description.replace(/<[^>]+>/g, '').substring(0, 100) + '...';

  return (
    <div
      className="w-full h-[500px] sm:h-auto sm:aspect-[4/3] [perspective:1000px] block group"
      onClick={handleInteraction}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`relative w-full h-full [transform-style:preserve-3d] transition-transform duration-700 ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:translateZ(0)]">
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
                    className="absolute inset-0 w-full h-full object-contain z-10"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 rounded-b-xl z-20">
                    <div className="text-white text-xs font-semibold flex items-center">
                        Read More <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </div>
        </div>
        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)_translateZ(0)]">
            <Card className="w-full h-full flex flex-col justify-center items-center bg-primary/90 text-primary-foreground p-6 rounded-xl shadow-lg select-none">
                <h3 className="text-xl font-bold mb-2 text-center">{milestone.year} - {milestone.event}</h3>
                <p className="text-center text-sm">{plainTextDescription}</p>
                <Link to={`/milestone/${milestone.id}`} className="mt-4 text-xs font-semibold flex items-center">
                    Read More <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default MilestoneCard;
