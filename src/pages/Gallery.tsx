import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { supabase } from '@/integrations/supabase/client';
import { X, PlayCircle } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';
import { Tables } from '@/integrations/supabase/types';
import { ServiceItem } from '@/components/ui/ServiceItem';
import GallerySkeleton from '@/components/ui/GallerySkeleton';
import LazyImage from '@/components/ui/LazyImage';

type Gallery = Tables<'galleries'> & { gallery_sections: { name: string } };
type GallerySection = Tables<'gallery_sections'>;

const GalleryPage = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [sections, setSections] = useState<GallerySection[]>([]);
  const [selectedItem, setSelectedItem] = useState<{ item: Gallery; initialIndex: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  
  useEffect(() => {
    if (selectedItem && carouselApi) {
      carouselApi.scrollTo(selectedItem.initialIndex, true);
    }
  }, [selectedItem, carouselApi]);

  
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (selectedItem) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = '0px';
    }

    return () => {
      document.body.style.overflow = originalStyle;
      document.body.style.paddingRight = '0px';
    };
  }, [selectedItem]);

 
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (!loading) {
      const elementsToAnimate = document.querySelectorAll('.fade-up, .zoom-in');
      elementsToAnimate.forEach((el) => observer.observe(el));

      return () => {
        elementsToAnimate.forEach((el) => observer.unobserve(el));
      };
    }
  }, [loading]);

  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const [galleriesRes, sectionsRes] = await Promise.all([
      supabase.from('galleries').select('*, gallery_sections ( name )').eq('published', true).order('display_order'),
      supabase.from('gallery_sections').select('*').order('display_order'),
    ]);

    if (galleriesRes.error || sectionsRes.error) {
      console.error(galleriesRes.error || sectionsRes.error);
    } else {
      setGalleries((galleriesRes.data as Gallery[]) || []);
      setSections(sectionsRes.data || []);
    }
    setLoading(false);
  };

  const openModal = (item: Gallery, initialIndex = 0) => {
    setSelectedItem({ item, initialIndex });
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!selectedItem) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') carouselApi?.scrollPrev();
      if (e.key === 'ArrowRight') carouselApi?.scrollNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedItem, carouselApi]);

  if (loading) {
    return <GallerySkeleton />;
  }

  
  const modalContent = selectedItem && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 animate-fade-in"
      onClick={closeModal}
    >
      <button
        className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-20"
        onClick={closeModal}
      >
        <X className="h-8 w-8 text-white" />
      </button>

      <div
        className="relative max-w-6xl max-h-full w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {selectedItem.item.video_url ? (
          <video
            src={selectedItem.item.video_url}
            className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg"
            controls
            autoPlay
            onCanPlay={(e) => (e.currentTarget.volume = 0.5)}
          />
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
            <Carousel
              setApi={setCarouselApi}
              opts={{ loop: true, startIndex: selectedItem.initialIndex }}
              className="w-full h-full"
            >
              <CarouselContent className="h-full relative">
                {(selectedItem.item.image_urls || []).map((url, index) => (
                  <CarouselItem
                    key={index}
                    className="flex items-center justify-center h-full px-4"
                  >
                    <div className="relative w-auto h-auto max-h-[90vh] max-w-[95vw] flex items-center justify-center">
                      <img
                        src={url}
                        alt={`${selectedItem.item.title} ${index + 1}`}
                        className="w-auto h-auto max-h-[90vh] max-w-full object-contain rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-[1.02]"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

             
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 p-3 rounded-full backdrop-blur-md transition"
                onClick={(e) => {
                  e.stopPropagation();
                  carouselApi?.scrollPrev();
                }}
              >
                ‹
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 p-3 rounded-full backdrop-blur-md transition"
                onClick={(e) => {
                  e.stopPropagation();
                  carouselApi?.scrollNext();
                }}
              >
                ›
              </button>
            </Carousel>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <style>{`
        .zoom-in, .fade-up {
          opacity: 0;
          transform: scale(0.9);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .visible.zoom-in, .visible.fade-up {
          opacity: 1;
          transform: scale(1);
        }
        .gradient-text {
          background: -webkit-linear-gradient(45deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <section className="relative py-24 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto zoom-in">
            <h1
              className="text-6xl lg:text-7xl font-extrabold mb-6 gradient-text"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              PIWC ASOKWA GALLERY
            </h1>
            <p className="text-xl text-gray-600">
              Capturing the joy of worship, the unity of fellowship, and the undeniable faithfulness of God at PIWC ASOKWA
            </p>
          </div>
        </div>
      </section>

      {sections.map((section, sectionIndex) => {
        const sectionItems = galleries.filter((item) => item.section_id === section.id);
        if (sectionItems.length === 0) return null;

        const isVideoSection = section.name.toLowerCase().includes('video');
        const isServiceSection = section.name.toLowerCase().includes('service');

        return (
          <section key={section.id} className={`py-20 ${sectionIndex % 2 === 0 ? 'bg-white' : 'bg-blue-50/50'}`}>
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold mb-16 text-center text-gray-800 zoom-in">{section.name}</h2>

              {isServiceSection ? (
                <div className="max-w-6xl mx-auto space-y-28">
                  {sectionItems.map((item, index) => (
                    <ServiceItem key={item.id} item={item} isReversed={index % 2 !== 0} openModal={openModal} />
                  ))}
                </div>
              ) : isVideoSection ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                  {sectionItems.map((item, i) => {
                    if (!item.video_url) return null;
                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-xl shadow-lg overflow-hidden fade-up cursor-pointer group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                        style={{ transitionDelay: `${i * 100}ms` }}
                        onClick={() => openModal(item)}
                      >
                        <div className="aspect-video bg-black relative">
                          <video src={item.video_url} className="w-full h-full object-cover" muted playsInline />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <PlayCircle className="h-16 w-16 text-white" />
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                          {item.description && (
                            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.description}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4 max-w-full mx-auto">
                  {(() => {
                    const allImages = sectionItems.flatMap((item) =>
                      (item.image_urls || []).map((url, index) => ({ item, url, index }))
                    );

                    return allImages.map(({ item, url, index }, imgIndex) => (
                      <div
                        key={`${item.id}-${imgIndex}`}
                        className="group relative overflow-hidden rounded-xl cursor-pointer fade-up break-inside-avoid shadow-md hover:shadow-2xl transition-all duration-300"
                        style={{ transitionDelay: `${imgIndex * 50}ms` }}
                        onClick={() => openModal(item, index)}
                      >
                        <LazyImage
                          src={url}
                          alt={`${item.title} image`}
                          className="w-full aspect-[3/4]"
                          imageClassName="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-lg font-bold text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>
          </section>
        );
      })}

      {modalContent && ReactDOM.createPortal(modalContent, document.body)}
    </div>
  );
};

export default GalleryPage;
