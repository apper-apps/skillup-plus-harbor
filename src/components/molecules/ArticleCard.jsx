import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";

const ArticleCard = ({ 
  article, 
  onClick, 
  onEdit, 
  onDelete, 
  showActions = false,
  className 
}) => {
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
          {article.thumbnailUrl ? (
            <img 
              src={article.thumbnailUrl} 
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/10 to-accent/20">
              <ApperIcon name="FileText" size={48} className="text-accent/60" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-4 left-4 right-4">
              <Badge variant="accent" className="bg-white/90 text-accent backdrop-blur-sm">
                인사이트 아티클
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-5 space-y-3">
        <div>
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-2 group-hover:text-accent transition-colors">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
            {article.excerpt}
          </p>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ApperIcon name="Calendar" size={14} />
              {formatDate(article.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <ApperIcon name="Eye" size={14} />
              {article.views || 0}회 조회
            </span>
          </div>
          
          {showActions && (
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(article);
                }}
                className="p-2 rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
                title="수정"
              >
                <ApperIcon name="Edit" size={14} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(article);
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

export default ArticleCard;