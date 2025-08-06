import React from "react";

const Loading = ({ type = "grid" }) => {
  if (type === "player") {
    return (
      <div className="w-full bg-gray-200 animate-pulse rounded-xl">
        <div className="aspect-video bg-gradient-to-br from-gray-300 to-gray-400 rounded-xl"></div>
      </div>
    );
  }

  if (type === "sidebar") {
    return (
      <div className="space-y-4 p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-5 bg-gradient-to-r from-gray-300 to-gray-400 rounded animate-pulse"></div>
            <div className="space-y-1 pl-4">
              {[...Array(3)].map((_, j) => (
                <div key={j} className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-pulse w-5/6"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "article") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
            <div className="aspect-video bg-gradient-to-br from-gray-300 to-gray-400 rounded-lg mb-4"></div>
            <div className="space-y-2">
              <div className="h-5 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-3/4"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="course-grid grid gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
          <div className="aspect-video bg-gradient-to-br from-gray-300 to-gray-400"></div>
          <div className="p-4 space-y-3">
            <div className="h-5 bg-gradient-to-r from-gray-300 to-gray-400 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3"></div>
            </div>
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
              <div className="h-6 bg-gradient-to-r from-primary/20 to-primary/30 rounded-full w-16"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loading;