import React from 'react';

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  eager?: boolean;
}

export const SmartImage: React.FC<SmartImageProps> = ({ eager = false, ...props }) => (
  <img
    loading={eager ? 'eager' : 'lazy'}
    decoding="async"
    fetchPriority={eager ? 'high' : 'auto'}
    referrerPolicy="no-referrer"
    {...props}
  />
);
