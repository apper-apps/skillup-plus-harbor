import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "콘텐츠가 없습니다", 
  description = "새로운 콘텐츠를 추가해보세요", 
  actionText,
  onAction,
  icon = "Package"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-full p-8 mb-6">
        <ApperIcon name={icon} size={64} className="text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-3">
        {title}
      </h3>
      <p className="text-gray-600 text-center mb-8 max-w-md text-lg">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3"
        >
          <ApperIcon name="Plus" size={20} />
          {actionText}
        </button>
      )}
    </div>
  );
};

export default Empty;