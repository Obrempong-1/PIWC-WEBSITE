import { useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const slides = [
  {
    id: "1",
    title: "Welcome to PIWC Asokwa",
    subtitle:
      "A vibrant community of believers passionate about worship, fellowship, and spreading the love of Christ.",
    image_url:
      "https://vhovhjnupqdfmdjfbtrr.supabase.co/storage/v1/object/public/images/welcome.webp",
    cta_text: "Learn More About Us",
    cta_link: "/about",
  },
  {
    id: "2",
    title: "Experience Spirit-Filled Worship",
    subtitle:
      "Join us for our weekly services and special events, where we encounter God together.",
    image_url:
      "https://vhovhjnupqdfmdjfbtrr.supabase.co/storage/v1/object/public/images/worship.webp",
    cta_text: "View Service Times",
    cta_link: "/events",
  },
  {
    id: "3",
    title: "Connect with Our Community",
    subtitle:
      "Find your place in our diverse ministries and fellowship groups. There is something for everyone.",
    image_url:
      "https://vhovhjnupqdfmdjfbtrr.supabase.co/storage/v1/object/public/images/ministries.webp",
    cta_text: "Explore Ministries",
    cta_link: "/ministries",
  },
];

const HeroCarousel = () => {
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  return (
    <div className="relative min-h-screen overflow-hidden bg-black will-change-transform">
      <style>{`
        .text-shadow {
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7);
        }
        .optimized-img {
          transform: translateZ(0);
          backface-visibility: hidden;
          will-change: opacity, transform;
        }
        @media (min-width: 1024px) {
          .blur-bg {
            position: absolute;
            inset: 0;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            filter: blur(25px) brightness(0.6);
            transform: scale(1.1);
            z-index: 0;
            will-change: transform, filter;
            opacity: 0;
            animation: fadeInBlur 1s ease forwards;
          }
          @keyframes fadeInBlur {
            to {
              opacity: 1;
            }
          }
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
              <div className="relative min-h-screen overflow-hidden">
                {/* ✅ First slide: blur background on desktop only */}
                {index === 0 && (
                  <div
                    className="blur-bg hidden lg:block"
                    style={{
                      backgroundImage: `url(${slide.image_url}?width=800)`,
                    }}
                  ></div>
                )}

                {/* ✅ Responsive image behavior */}
                <img
                  src={slide.image_url}
                  alt={slide.title}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className={`absolute inset-0 w-full h-full optimized-img ${
                    index === 0
                      ? "object-cover lg:object-contain lg:object-top"
                      : "object-cover object-center"
                  }`}
                  sizes="100vw"
                  suppressHydrationWarning
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/30" />

                {/* Text content */}
                <div className="relative z-10 container mx-auto px-4 min-h-screen flex items-center">
                  <div className="max-w-3xl animate-fade-up">
                    <div className="p-10 lg:rounded-2xl lg:shadow-lg lg:bg-black/20 lg:backdrop-blur-md">
                      <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 font-heading text-shadow lg:[text-shadow:none]">
                        {slide.title}
                      </h1>
                      {slide.subtitle && (
                        <p className="text-2xl lg:text-3xl font-semibold text-white mb-8 text-shadow lg:[text-shadow:none]">
                          {slide.subtitle}
                        </p>
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

        {/* Arrows (desktop only) */}
        <div className="hidden lg:block">
          <CarouselPrevious className="left-8 h-12 w-12 border-2 border-white/50 bg-white/10 backdrop-blur-sm" />
          <CarouselNext className="right-8 h-12 w-12 border-2 border-white/50 bg-white/10 backdrop-blur-sm" />
        </div>
      </Carousel>
    </div>
  );
};

export default HeroCarousel;
