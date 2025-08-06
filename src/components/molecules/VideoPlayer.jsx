import React from "react";
import { cn } from "@/utils/cn";

const VideoPlayer = ({ videoUrl, title, className }) => {
  // Extract video ID from various URL formats
  const getVideoId = (url) => {
    if (!url) return null;
    
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^[a-zA-Z0-9_-]{11}$/ // Direct video ID
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1] || match[0];
    }
    
    return null;
  };

  const videoId = getVideoId(videoUrl);
  
  if (!videoId) {
    return (
      <div className={cn(
        "w-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center aspect-video",
        className
      )}>
        <div className="text-center">
          <div className="text-gray-400 mb-2">동영상을 불러올 수 없습니다</div>
          <div className="text-sm text-gray-500">올바른 YouTube URL을 입력해주세요</div>
        </div>
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0`;

  return (
    <div className={cn("video-player-container", className)}>
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="border-0 rounded-xl shadow-lg"
      />
    </div>
  );
};

export default VideoPlayer;