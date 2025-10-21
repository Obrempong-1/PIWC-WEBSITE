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
                 <div className="max-w-5xl mx-auto space-y-16">
                 {sectionItems.map((item, index) => (
                   <div key={item.id} className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center fade-up`}>
                     <div className={`rounded-lg overflow-hidden ${index % 2 !== 0 ? 'md:order-last' : ''}`}>
                       <Carousel className="w-full" opts={{ loop: true }}>
                         <CarouselContent>
                           {(item.image_urls || []).map((url, imgIndex) => (
                             <CarouselItem key={imgIndex} onClick={() => openModal(item)} className="cursor-pointer">
                               <img src={url} alt={`${item.title} ${imgIndex + 1}`} className="w-full h-full object-cover aspect-square"/>
                             </CarouselItem>
                           ))}
                         </CarouselContent>
                         {(item.image_urls || []).length > 1 && <><CarouselPrevious /><CarouselNext /></>}
                       </Carousel>
                     </div>
                     <div className={`flex flex-col justify-center ${index % 2 !== 0 ? 'md:order-first' : ''}`}>
                       <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                       <p className="text-muted-foreground text-lg">{item.description}</p>
                     </div>
                   </div>
                 ))}
               </div>
              ) : isVideoSection ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                  {sectionItems.map((item) => {
                    if (!item.video_url) return null;

                    return (
                      <div key={item.id} className="frosted-glass rounded-lg overflow-hidden fade-up cursor-pointer" onClick={() => openModal(item)}>
                        <div className="aspect-video bg-black">
                          <video src={item.video_url} className="w-full h-full object-contain" />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold">{item.title}</h3>
                          {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 max-w-7xl mx-auto">
                  {(() => {
                    const allImages = sectionItems.flatMap(item =>
                      (item.image_urls || []).map(url => ({ item, url }))
                    );

                    return allImages.map(({ item, url }, index) => (
                      <div
                        key={`${item.id}-${index}`}
                        className="group relative aspect-square overflow-hidden frosted-glass cursor-pointer fade-up"
                        style={{ transitionDelay: `${index * 30}ms` }}
                        onClick={() => openModal(item)}
                      >
                        <img
                          src={url}
                          alt={`${item.title} image`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <h3 className="text-sm font-bold text-white truncate">{item.title}</h3>
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
          <div className="relative max-w-4xl w-full">
            {selectedItem.video_url ? (
                <video src={selectedItem.video_url} className="w-full max-h-[80vh] object-contain rounded-lg" controls autoPlay />
              ) : (
              <Carousel opts={{ loop: true }}>
                <CarouselContent>
                  {(selectedItem.image_urls || []).map((url, index) => (
                    <CarouselItem key={index}>
                      <img
                        src={url}
                        alt={`${selectedItem.title} ${index + 1}`}
                        className="max-w-full max-h-[80vh] object-contain rounded-lg mx-auto"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {(selectedItem.image_urls || []).length > 1 && (
                  <>
                    <CarouselPrevious className="-left-10" />
                    <CarouselNext className="-right-10" />
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
