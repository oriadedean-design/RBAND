import React from 'react';

const getYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
};

const getVimeoId = (url: string): string | null => {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match?.[1] || null;
};

interface VideoEmbedProps {
  url: string;
  title?: string;
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({ url, title = 'Embedded video' }) => {
  const youtubeId = getYouTubeId(url);
  const vimeoId = getVimeoId(url);

  const embedUrl = youtubeId
    ? `https://www.youtube-nocookie.com/embed/${youtubeId}`
    : vimeoId
      ? `https://player.vimeo.com/video/${vimeoId}`
      : url;

  return (
    <div className="aspect-video overflow-hidden rounded-2xl my-8 bg-black/80">
      <iframe
        src={embedUrl}
        title={title}
        loading="lazy"
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
};
