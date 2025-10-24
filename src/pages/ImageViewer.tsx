import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import LazyImage from '@/components/ui/LazyImage';
import { useLenis } from '@/context/LenisContext';

const ImageViewer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const lenis = useLenis();
  const imageUrl = searchParams.get('src');
  const altText = searchParams.get('alt') || 'Full screen image view';

  useEffect(() => {
    
    lenis?.stop();
   
    return () => {
      lenis?.start();
    };
  }, [lenis]);

  useEffect(() => {
    
    if (!imageUrl) {
      navigate(-1);
    }
  }, [imageUrl, navigate]);

  const handleClose = () => {
    navigate(-1); 
  };

  
  if (!imageUrl) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-[100] flex items-center justify-center p-5 animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="relative"
        style={{
          maxWidth: 'calc(100vw - 40px)',
          maxHeight: 'calc(100vh - 40px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <LazyImage
          src={decodeURIComponent(imageUrl)}
          alt={altText}
          className="block object-contain w-full h-full rounded-lg shadow-2xl"
          priority={true}
        />
        <div className="absolute top-0 right-0 m-4">
          <button
            onClick={handleClose}
            className="text-white bg-black/50 rounded-full p-2 hover:bg-black/75 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close image view"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageViewer;
