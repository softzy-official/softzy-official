"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

const ImageGallery = ({ images, productName }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const hasImages = images.length > 0;
  const activeImage = hasImages
    ? images[Math.min(selectedImage, images.length - 1)]
    : null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-3 sm:gap-4">
      {/* Thumbnails */}
      <div className="flex lg:flex-col gap-2 sm:gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-125 pb-2 lg:pb-0 lg:pr-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 bg-white transition-all ${
              selectedImage === index
                ? "border-secondary ring-2 ring-secondary/20"
                : "border-border/40 hover:border-secondary/50"
            }`}
          >
            <Image
              src={image}
              alt={`${productName} - Image ${index + 1}`}
              fill
              className="object-contain p-1"
              sizes="80px"
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div
        className={`relative flex-1 aspect-square sm:aspect-4/5 rounded-2xl overflow-hidden bg-gray-100 group ${
          hasImages ? "cursor-zoom-in" : "cursor-default"
        }`}
        onMouseEnter={() => hasImages && setIsZoomed(true)}
        onMouseLeave={() => hasImages && setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        {activeImage ? (
          <Image
            src={activeImage}
            alt={productName}
            fill
            className={`object-contain p-2 transition-transform duration-300 ${
              isZoomed ? "scale-150" : "scale-100"
            }`}
            sizes="(max-width: 768px) 100vw, 50vw"
            style={
              isZoomed
                ? {
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }
                : undefined
            }
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            No image available
          </div>
        )}

        {/* Zoom Indicator */}
        {hasImages && (
          <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/60 text-white text-xs rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity poppins">
            <ZoomIn className="w-3.5 h-3.5" />
            Hover to zoom
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;