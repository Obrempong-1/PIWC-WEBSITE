import { useRef } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const slides = [
    {
        id: '1',
        title: 'Welcome to PIWC Asokwa',
        subtitle: 'A vibrant community of believers passionate about worship, fellowship, and spreading the love of Christ.',
        image_url: 'https://vhovhjnupqdfmdjfbtrr.supabase.co/storage/v1/object/public/images/welcome.webp',
        cta_text: 'Learn More About Us',
        cta_link: '/about',
    },
    {
        id: '2',
        title: 'Experience Spirit-Filled Worship',
        subtitle: 'Join us for our weekly services and special events, where we encounter God together.',
        image_url: 'https://vhovhjnupqdfmdjfbtrr.supabase.co/storage/v1/object/public/images/worship.webp',
        cta_text: 'View Service Times',
        cta_link: '/events',
    },
    {
        id: '3',
        title: 'Connect with Our Community',
        subtitle: 'Find your place in our diverse ministries and fellowship groups. There is something for everyone.',
        image_url: 'https://vhovhjnupqdfmdjfbtrr.supabase.co/storage/v1/object/public/images/ministries.webp',
        cta_text: 'Explore Ministries',
        cta_link: '/ministries',
    },
];

const HeroCarousel = () => {
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
       <style>{`
        .text-shadow {
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
        }
      `}</style>
      <Carousel
        opts={{ align: "start", loop: true }}
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id}>
              <div className="relative min-h-screen">
                
                
                <img
                  src={slide.image_url}
                  alt={slide.title}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  loading={index === 0 ? "eager" : "lazy"}
                  className="absolute inset-0 w-full h-full object-cover object-center lg:object-contain lg:object-top"
                  suppressHydrationWarning
                />

                
                <div className="absolute inset-0 bg-black/50" />

                
                <div className="relative z-10 container mx-auto px-4 min-h-screen flex items-center">
                  <div className="max-w-3xl animate-fade-up transform-gpu">
                    
                    <div className="p-10 lg:rounded-2xl lg:shadow-lg lg:bg-black/20 lg:backdrop-blur-md">
                      <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 font-heading text-shadow lg:[text-shadow:none]">{slide.title}</h1>
                      {slide.subtitle && (
                        <p className="text-2xl lg:text-3xl font-semibold text-white mb-8 text-shadow lg:[text-shadow:none]">{slide.subtitle}</p>
                      )}
                      {slide.cta_text && slide.cta_link && (
                        <Button asChild size="lg" className="btn-gradient-glow">
                          <Link to={slide.cta_link}>{slide.cta_text}</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden lg:block">
          <CarouselPrevious className="left-8 h-12 w-12 border-2 border-white/50 bg-white/10 backdrop-blur-sm" />
          <CarouselNext className="right-8 h-12 w-12 border-2 border-white/50 bg-white/10 backdrop-blur-sm" />
        </div>
      </Carousel>
    </div>
  );
};

export default HeroCarousel;
