// components/CustomImage.tsx
import Image from 'next/image';
import React from 'react';

interface CustomImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  fetchPriority?: 'high' | 'low' | 'auto';
}

const CustomImage: React.FC<CustomImageProps> = ({ src, alt, width, height, fetchPriority }) => {
  return (
    <div {...(fetchPriority ? { fetchpriority: fetchPriority } : {})}>
      <Image src={src} alt={alt} width={width} height={height} />
    </div>
  );
};

export default CustomImage;
