import { useState, useEffect, useRef } from 'react';
import { Tables } from '@/integrations/supabase/types';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from '@/components/ui/carousel';
import LazyImage from '@/components/ui/LazyImage';

type ServiceItemProps = {
  item: Tables<'galleries'>;
  isReversed: boolean;
  openModal: (item: Tables<'galleries'>, initialIndex: number) => void;
};

export const ServiceItem = ({ item, isReversed, openModal }: ServiceItemProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center fade-up`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105 hover:shadow-blue-200 ${isReversed ? 'md:order-last' : ''}`}>
        <Carousel setApi={setApi} className="w-full group" opts={{ loop: true }}>
          <CarouselContent>
            {(item.image_urls || []).map((url, imgIndex) => (
              <CarouselItem key={imgIndex} onClick={() => openModal(item, imgIndex)} className="cursor-pointer">
                <LazyImage
                  src={url}
                  alt={`${item.title} ${imgIndex + 1}`}
                  className="w-full h-full"
                  imageClassName="object-contain"
                  width={16}
                  height={9}
                  disableLqip={true}
                  placeholderClassName="bg-black"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
          {(item.image_urls || []).map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                api?.scrollTo(i);
              }}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${current === i ? 'w-6 bg-white' : 'bg-white/50'}`}
            />
          ))}
        </div>
      </div>
      <div className={`flex flex-col justify-center text-center md:text-left ${isReversed ? 'md:order-first' : ''}`}>
        <h3 className="text-4xl font-extrabold mb-4 text-gray-900 tracking-tight gradient-text">{item.title}</h3>
        <p className="text-gray-600 text-xl leading-relaxed">{item.description}</p>
      </div>
    </div>
  );
};
