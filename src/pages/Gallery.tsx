import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Tables } from "@/integrations/supabase/types";

type Gallery = Tables<"galleries"> & { gallery_sections: { name: string } };
type GallerySection = Tables<"gallery_sections">;

const Gallery = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [sections, setSections] = useState<GallerySection[]>([]);
  const [selectedItem, setSelectedItem] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (!loading) {
      const elementsToAnimate = document.querySelectorAll(".fade-up");
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
      supabase.from("galleries").select("*, gallery_sections ( name )").eq("published", true).order("display_order"),
      supabase.from("gallery_sections").select("*").order("display_order"),
    ]);

    if (!galleriesRes.error && galleriesRes.data) {
      setGalleries(galleriesRes.data as Gallery[]);
    }
    if (!sectionsRes.error && sectionsRes.data) {
      setSections(sectionsRes.data);
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
    <div className="min-h-screen pt-24">
      <section className="relative py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center fade-up">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 gradient-text" style={{ fontFamily: "'Playfair Display', serif" }}>
              Gallery
            </h1>
            <p className="text-xl text-foreground/90">
              Moments of worship, fellowship, and God's faithfulness captured.
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
          <section key={section.id} className={`py-10 ${sectionIndex % 2 !== 0 ? 'bg-primary/5' : ''}`}>
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8 text-center text-blue-600">{section.name}</h2>
              
              {isServiceSection ? (
                 <div className="max-w-5xl mx-auto space-y-24">
                 {sectionItems.map((item, index) => (
                   <div key={item.id} className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-center fade-up`}>
                     <div className={`rounded-lg overflow-hidden shadow-2xl ${index % 2 !== 0 ? 'md:order-last' : ''}`}>
                       <Carousel className="w-full group" opts={{ loop: true }}>
                         <CarouselContent>
                           {(item.image_urls || []).map((url, imgIndex) => (
                             <CarouselItem key={imgIndex} onClick={() => openModal(item)} className="cursor-pointer">
                               <div className="aspect-w-16 aspect-h-9 bg-black">
                                <img src={url} alt={`${item.title} ${imgIndex + 1}`} className="w-full h-full object-contain"/>
                               </div>
                             </CarouselItem>
                           ))}
                         </CarouselContent>
                         <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                           <CarouselPrevious className="-ml-2 bg-white/50 hover:bg-white/80" />
                           <CarouselNext className="-mr-2 bg-white/50 hover:bg-white/80" />
                         </div>
                       </Carousel>
                     </div>
                     <div className={`flex flex-col justify-center text-center md:text-left ${index % 2 !== 0 ? 'md:order-first' : ''}`}>
                       <h3 className="text-3xl font-bold mb-4 tracking-tight">{item.title}</h3>
                       <p className="text-muted-foreground text-xl leading-relaxed">{item.description}</p>
                     </div>
                   </div>
                 ))}
               </div>
              ) : isVideoSection ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                  {sectionItems.map((item) => {
                    if (!item.video_url) return null;

                    return (
                      <div key={item.id} className="frosted-glass rounded-lg overflow-hidden fade-up cursor-pointer transition-transform duration-300 hover:-translate-y-2" onClick={() => openModal(item)}>
                        <div className="aspect-video bg-black">
                          <video src={item.video_url} className="w-full h-full object-contain" />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold">{item.title}</h3>
                          {item.description && <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-4 space-y-4 max-w-7xl mx-auto">
                  {(() => {
                    const allImages = sectionItems.flatMap(item =>
                      (item.image_urls || []).map(url => ({ item, url }))
                    );

                    return allImages.map(({ item, url }, index) => (
                      <div
                        key={`${item.id}-${index}`}
                        className="group relative overflow-hidden rounded-lg cursor-pointer fade-up break-inside-avoid"
                        style={{ transitionDelay: `${index * 30}ms` }}
                        onClick={() => openModal(item)}
                      >
                        <img
                          src={url}
                          alt={`${item.title} image`}
                          className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                          <h3 className="text-md font-bold text-white truncate">{item.title}</h3>
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 animate-fade-in"
          onClick={() => setSelectedItem(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            onClick={() => setSelectedItem(null)}
          >
            <X className="h-6 w-6 text-white" />
          </button>
          <div className="relative max-w-5xl w-full">
            {selectedItem.video_url ? (
                <video src={selectedItem.video_url} className="w-full max-h-[90vh] object-contain rounded-lg" controls autoPlay />
              ) : (
              <Carousel opts={{ loop: true }}>
                <CarouselContent>
                  {(selectedItem.image_urls || []).map((url, index) => (
                    <CarouselItem key={index}>
                      <img
                        src={url}
                        alt={`${selectedItem.title} ${index + 1}`}
                        className="max-w-full max-h-[90vh] object-contain rounded-lg mx-auto"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {(selectedItem.image_urls || []).length > 1 && (
                  <>
                    <CarouselPrevious className="-left-12 text-white bg-white/20 hover:bg-white/40" />
                    <CarouselNext className="-right-12 text-white bg-white/20 hover:bg-white/40" />
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

export default Gallery;
