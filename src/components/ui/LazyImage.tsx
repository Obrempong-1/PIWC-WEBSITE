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
  disableLqip?: boolean;
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
    return { src: src, srcSet: null };
  }

  const createImageUrl = (width: number) => {
    const url = new URL(renderUrl);
    url.searchParams.set('width', `${width}`);
    url.searchParams.set('quality', '60');
    url.searchParams.set('resize', 'contain');
    return url.href;
  };

  const srcSet = imageWidths
    .map(width => `${createImageUrl(width)} ${width}w`)
    .join(', ');

  const fallbackSrc = createImageUrl(800);

  return { src: fallbackSrc, srcSet };
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
  disableLqip = false,
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
      className={`relative overflow-hidden ${className || ''} ${placeholderClassName || 'bg-gray-200'}`}
      style={{ aspectRatio }}
    >
      {!disableLqip && thumbSrc && (
        <img
          src={thumbSrc}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover filter blur-md scale-105 transition-opacity duration-300 ${isLoaded ? 'opacity-0' : 'opacity-100'}`}
        />
      )}
      
      {(isInView || priority) && (
        <img
          src={mainImageProps.src}
          srcSet={mainImageProps.srcSet || undefined}
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
