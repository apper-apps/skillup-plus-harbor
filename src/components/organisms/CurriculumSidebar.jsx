import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Badge from "@/components/atoms/Badge";

const CurriculumSidebar = ({ 
  course, 
  videos, 
  currentVideoId, 
  onVideoSelect, 
  loading,
  className 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const formatDuration = (minutes) => {
    if (!minutes) return "0분";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}:${mins.toString().padStart(2, '0')}` : `${mins}분`;
  };

  const totalDuration = videos?.reduce((acc, video) => acc + (video.duration || 0), 0) || 0;
  const completedCount = videos?.filter(video => video.completed).length || 0;

  return (
    <div className={cn(
      "bg-white border-l border-gray-200 transition-all duration-300 flex flex-col",
      isCollapsed ? "w-16" : "w-80 lg:w-96",
      className
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center justify-between mb-2">
          <h3 className={cn(
            "font-bold text-gray-900 transition-opacity duration-200",
            isCollapsed ? "opacity-0" : "opacity-100"
          )}>
            커리큘럼
          </h3>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-white/60 transition-colors"
            title={isCollapsed ? "사이드바 열기" : "사이드바 접기"}
          >
            <ApperIcon 
              name={isCollapsed ? "ChevronLeft" : "ChevronRight"} 
              size={20} 
              className="text-gray-600" 
            />
          </button>
        </div>
        
        {!isCollapsed && course && (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-gray-800 line-clamp-2">
              {course.title}
            </h4>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <ApperIcon name="Clock" size={12} />
                {formatDuration(totalDuration)}
              </div>
              <div className="flex items-center gap-1">
                <ApperIcon name="CheckCircle" size={12} />
                {completedCount}/{videos?.length || 0}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                style={{ width: `${videos?.length ? (completedCount / videos.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <Loading type="sidebar" />
        ) : (
          <div className="custom-scrollbar overflow-y-auto h-full">
            {!isCollapsed && (
              <div className="p-4 space-y-3">
                {videos?.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <ApperIcon name="PlayCircle" size={32} className="mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">강의가 없습니다</p>
                  </div>
                ) : (
                  videos?.map((video, index) => {
                    const isActive = video.Id === currentVideoId;
                    return (
                      <div
                        key={video.Id}
                        onClick={() => onVideoSelect?.(video)}
                        className={cn(
                          "p-3 rounded-lg cursor-pointer transition-all duration-200 group border",
                          isActive 
                            ? "bg-gradient-to-r from-primary to-primary/90 text-white border-primary shadow-lg" 
                            : "bg-gray-50 hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 border-gray-200 hover:border-primary/20"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                            isActive 
                              ? "bg-white/20 text-white" 
                              : "bg-gray-200 text-gray-600 group-hover:bg-primary/20 group-hover:text-primary"
                          )}>
                            {index + 1}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h5 className={cn(
                              "font-medium text-sm leading-5 line-clamp-2 mb-1",
                              isActive ? "text-white" : "text-gray-900 group-hover:text-primary"
                            )}>
                              {video.title}
                            </h5>
                            
                            <div className="flex items-center justify-between">
                              <span className={cn(
                                "text-xs",
                                isActive ? "text-white/80" : "text-gray-500"
                              )}>
                                {formatDuration(video.duration)}
                              </span>
                              
                              {video.completed && (
                                <Badge 
                                  variant="success" 
                                  className={cn(
                                    "text-xs px-2 py-0.5",
                                    isActive && "bg-white/20 text-white"
                                  )}
                                >
                                  <ApperIcon name="Check" size={10} />
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CurriculumSidebar;