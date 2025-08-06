import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const VideoCard = ({ 
  course, 
  onClick, 
  onEdit, 
  onDelete, 
  showActions = false,
  className 
}) => {
  const formatDuration = (minutes) => {
    if (!minutes) return "0분";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}시간 ${mins}분` : `${mins}분`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className={cn(
      "bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer group",
      className
    )}>
      <div className="relative" onClick={onClick}>
        <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 relative overflow-hidden">
          {course.thumbnailUrl ? (
            <img 
              src={course.thumbnailUrl} 
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <ApperIcon name="Play" size={48} className="text-primary/60" />
            </div>
          )}
          <div className="absolute top-3 right-3">
            <Badge variant="default" className="bg-black/70 text-white backdrop-blur-sm">
              {formatDuration(course.totalDuration)}
            </Badge>
          </div>
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
              <ApperIcon name="Play" size={24} className="text-primary" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ApperIcon name="Calendar" size={14} />
              {formatDate(course.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <ApperIcon name="Users" size={14} />
              {course.videoCount || 0}개 강의
            </span>
          </div>
          
          {showActions && (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(course);
                }}
                className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                title="수정"
              >
                <ApperIcon name="Edit" size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(course);
                }}
                className="p-2 rounded-full bg-error/10 text-error hover:bg-error/20 transition-colors"
                title="삭제"
              >
                <ApperIcon name="Trash2" size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;