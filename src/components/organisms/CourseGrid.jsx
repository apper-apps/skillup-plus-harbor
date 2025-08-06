import React from "react";
import VideoCard from "@/components/molecules/VideoCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const CourseGrid = ({ 
  courses, 
  loading, 
  error, 
  onCourseClick, 
  onCourseEdit, 
  onCourseDelete,
  showActions = false,
  emptyTitle,
  emptyDescription,
  onRetry
}) => {
  if (loading) {
    return <Loading type="grid" />;
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} />;
  }

  if (!courses || courses.length === 0) {
    return (
      <Empty 
        title={emptyTitle || "강의가 없습니다"}
        description={emptyDescription || "새로운 강의를 추가해보세요"}
        icon="PlayCircle"
      />
    );
  }

  return (
    <div className="course-grid grid gap-6">
      {courses.map((course) => (
        <VideoCard
          key={course.Id}
          course={course}
          onClick={() => onCourseClick?.(course)}
          onEdit={() => onCourseEdit?.(course)}
          onDelete={() => onCourseDelete?.(course)}
          showActions={showActions}
        />
      ))}
    </div>
  );
};

export default CourseGrid;