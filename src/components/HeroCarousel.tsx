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
        image_url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        cta_text: 'Learn More About Us',
        cta_link: '/about',
    },
    {
        id: '2',
        title: 'Experience Spirit-Filled Worship',
        subtitle: 'Join us for our weekly services and special events, where we encounter God together.',
        image_url: 'https://images.unsplash.com/photo-1604079628040-94301bb21b91?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        cta_text: 'View Service Times',
        cta_link: '/events',
    },
    {
        id: '3',
        title: 'Connect with Our Community',
        subtitle: 'Find your place in our diverse ministries and fellowship groups. There is something for everyone.',
        image_url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        cta_text: 'Explore Ministries',
        cta_link: '/ministries',
    },
];

const HeroCarousel = () => {
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Carousel
        opts={{ align: "start", loop: true }}
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="relative min-h-screen">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${slide.image_url})` }}
                />
                <div className="absolute inset-0 bg-black/30" />
                
                <div className="relative z-10 container mx-auto px-4 min-h-screen flex items-center">
                  <div className="max-w-3xl animate-fade-up">
                    <div className="frosted-glass bg-black/25 backdrop-blur-lg p-10 rounded-2xl shadow-lg">
                      <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 font-heading">
                        {slide.title}
                      </h1>
                      {slide.subtitle && (
                        <p className="text-xl lg:text-2xl text-white/90 mb-8">{slide.subtitle}</p>
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
