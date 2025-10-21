import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { X, PlayCircle } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Tables } from '@/integrations/supabase/types';
import { ServiceItem } from '@/components/ui/ServiceItem';

type Gallery = Tables<'galleries'> & { gallery_sections: { name: string } };
type GallerySection = Tables<'gallery_sections'>;

const GalleryPage = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [sections, setSections] = useState<GallerySection[]>([]);
  const [selectedItem, setSelectedItem] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState(true);

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

  const openModal = (item: Gallery) => {
    setSelectedItem(item);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading gallery...</div>;
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      <style>{`
        .zoom-in {
          opacity: 0;
          transform: scale(0.9);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        .visible.zoom-in {
          opacity: 1;
          transform: scale(1);
        }
        .gradient-text {
          background: -webkit-linear-gradient(45deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
      <section className="relative py-24 text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto zoom-in">
            <h1 className="text-6xl lg:text-7xl font-extrabold mb-6 gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
              Our Living Gallery
            </h1>
            <p className="text-xl text-gray-600">
              Explore vibrant moments of worship, joyful fellowship, and the tangible faithfulness of God in our church family.
            </p>
          </div>
        </div>
      </section>

      {sections.map((section, sectionIndex) => {
        const sectionItems = galleries.filter(item => item.section_id === section.id);
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
                      <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden fade-up cursor-pointer group transition-all duration-300 hover:shadow-2xl hover:-translate-y-2" style={{transitionDelay: `${i*100}ms`}} onClick={() => openModal(item)}>
                        <div className="aspect-video bg-black relative">
                          <video src={item.video_url} className="w-full h-full object-contain" />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <PlayCircle className="h-16 w-16 text-white" />
                          </div>
                        </div>
                        <div className="p-5">
                          <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
                          {item.description && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.description}</p>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4 max-w-full mx-auto">
                  {(() => {
                    const allImages = sectionItems.flatMap(item =>
                      (item.image_urls || []).map(url => ({ item, url }))
                    );

                    return allImages.map(({ item, url }, index) => (
                      <div
                        key={`${item.id}-${index}`}
                        className="group relative overflow-hidden rounded-xl cursor-pointer fade-up break-inside-avoid shadow-md hover:shadow-2xl transition-all duration-300"
                        style={{ transitionDelay: `${index * 50}ms` }}
                        onClick={() => openModal(item)}
                      >
                        <img src={url} alt={`${item.title} image`} className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-lg font-bold text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">{item.title}</h3>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>
          </section>
        )
      })}

      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-fade-in" onClick={() => setSelectedItem(null)}>
          <button className="absolute top-6 right-6 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-20" onClick={() => setSelectedItem(null)}>
            <X className="h-8 w-8 text-white" />
          </button>
          <div className="relative max-w-6xl w-full h-full flex items-center justify-center">
            {selectedItem.video_url ? (
                <video src={selectedItem.video_url} className="w-auto max-h-full object-contain rounded-lg" controls autoPlay onCanPlay={e => e.currentTarget.volume = 0.5} />
              ) : (
              <Carousel opts={{ loop: true }} className="w-full h-full">
                <CarouselContent className="h-full">
                  {(selectedItem.image_urls || []).map((url, index) => (
                    <CarouselItem key={index} className="flex items-center justify-center h-full">
                      <img src={url} alt={`${selectedItem.title} ${index + 1}`} className="max-w-full max-h-full object-contain rounded-lg"/>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {(selectedItem.image_urls || []).length > 1 && (
                  <>
                    <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/20 text-white hover:bg-white/40" />
                    <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/20 text-white hover:bg-white/40" />
                  </>
                )}
              </Carousel>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
