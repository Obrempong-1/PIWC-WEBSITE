import { useSearchParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import LazyImage from '@/components/ui/LazyImage';
import { useEffect } from 'react';

const ImageViewer = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const imageUrl = searchParams.get('src');
    const altText = searchParams.get('alt') || 'Image';
    const fallbackPath = searchParams.get('fallback') || '/';

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'auto';
        };
    }, []);

    const handleClose = () => {
        navigate(fallbackPath);
    };

    if (!imageUrl) {
        navigate('/about');
        return null;
    }

    const decodedImageUrl = decodeURIComponent(imageUrl);

    return (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center animate-viewer-fade-in"
          onClick={handleClose}
        >
            
            <div className="absolute inset-0 w-full h-full overflow-hidden" aria-hidden="true">
                <LazyImage
                    src={decodedImageUrl}
                    alt=""
                    className="w-full h-full"
                    imageClassName="w-full h-full object-cover filter blur-2xl scale-110"
                    disableLqip={true}
                />
            </div>
            <div className="absolute inset-0 bg-black/70" />

            
            <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-20 text-white bg-black/30 rounded-full p-2 hover:bg-black/50 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close image view"
            >
                <X className="h-8 w-8" />
            </button>

            
            <div
                className="relative w-full h-full flex items-center justify-center p-4 md:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <LazyImage
                    src={decodedImageUrl}
                    alt={altText}
                    className="w-auto h-auto max-w-full max-h-full"
                    imageClassName="object-contain rounded-xl shadow-2xl"
                    priority={true}
                />
            </div>

            
            <style>{`
                @keyframes viewer-fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-viewer-fade-in {
                    animation: viewer-fade-in 0.3s ease-out;
                }
            `}</style>
        </div>
      );
    };

export default ImageViewer;
