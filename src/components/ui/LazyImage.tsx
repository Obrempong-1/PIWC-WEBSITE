import React, { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  placeholderClassName?: string;
  sizes?: string;
  priority?: boolean;
  width?: number;
  height?: number;
}

const imageWidths = [320, 480, 640, 750, 828, 1080, 1200, 1920];

const getSupabaseRenderUrl = (src: string): string | null => {
  if (src && src.includes('supabase.co') && (src.includes('/storage/v1/object/public/') || src.includes('/storage/v1/render/image/public/'))) {
    return src.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
  }
  return null;
};

const generateImageProps = (src: string) => {
  const renderUrl = getSupabaseRenderUrl(src);
  if (!renderUrl) {
    return { src: src };
  }

  const srcSet = imageWidths
    .map(width => {
      const url = new URL(renderUrl);
      url.searchParams.set('width', `${width}`);
      url.searchParams.set('quality', '75');
      return `${url.href} ${width}w`;
    })
    .join(', ');

  const fallbackUrl = new URL(renderUrl);
  fallbackUrl.searchParams.set('width', '800');
  fallbackUrl.searchParams.set('quality', '75');

  return { src: fallbackUrl.href, srcSet };
};

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  imageClassName,
  placeholderClassName,
  sizes,
  priority = false,
  width,
  height,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority || !ref.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(ref.current);

    return () => {
      observer.disconnect();
    };
  }, [priority]);

  const mainImageProps = generateImageProps(src);
  
  let thumbSrc = '';
  const thumbUrl = getSupabaseRenderUrl(src);
  if (thumbUrl) {
    const url = new URL(thumbUrl);
    url.searchParams.set('width', '20');
    url.searchParams.set('quality', '20');
    url.searchParams.set('blur', '10');
    thumbSrc = url.href;
  }

  const aspectRatio = width && height ? `${width} / ${height}` : undefined;

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className} ${!aspectRatio && (placeholderClassName || 'bg-gray-200')}`}
      style={{ aspectRatio }}
    >
      {thumbSrc && (
        <img
          src={thumbSrc}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover filter blur-md scale-105 transition-opacity duration-300 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
        />
      )}
      
      {(isInView || priority) && (
        <img
          {...mainImageProps}
          sizes={sizes || "100vw"}
          alt={alt}
          className={`relative w-full h-full transition-opacity duration-700 ease-in-out ${isLoaded ? 'opacity-100' : 'opacity-0'} ${imageClassName}`}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={() => setIsLoaded(true)}
          fetchPriority={priority ? 'high' : 'auto'}
          width={width}
          height={height}
        />
      )}
    </div>
  );
};

export default LazyImage;
