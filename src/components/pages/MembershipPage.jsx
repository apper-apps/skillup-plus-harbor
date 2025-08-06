import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourseGrid from "@/components/organisms/CourseGrid";
import CurriculumSidebar from "@/components/organisms/CurriculumSidebar";
import UploadModal from "@/components/organisms/UploadModal";
import VideoPlayer from "@/components/molecules/VideoPlayer";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { videoService } from "@/services/api/videoService";
import { toast } from "react-toastify";

const MembershipPage = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [courses, setCourses] = useState([]);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  // Mock user role - in real app this would come from auth context
  const userRole = "admin";
  const canManageContent = userRole === "admin" || userRole === "master";

  const loadCourses = async () => {
    setLoading(true);
    setError("");
    
    try {
      const allCourses = await courseService.getAll();
      const membershipCourses = allCourses.filter(course => course.type === "membership");
      
      // Get video counts for courses
      const coursesWithVideos = await Promise.all(
        membershipCourses.map(async (course) => {
          try {
            const courseVideos = await videoService.getByCourseId(course.Id);
            return {
              ...course,
              videoCount: courseVideos.length,
              totalDuration: courseVideos.reduce((acc, video) => acc + (video.duration || 0), 0)
            };
          } catch {
            return { ...course, videoCount: 0, totalDuration: 0 };
          }
        })
      );

      setCourses(coursesWithVideos);
      
      if (courseId) {
        const course = coursesWithVideos.find(c => c.Id === parseInt(courseId));
        if (course) {
          setCurrentCourse(course);
          await loadVideos(course.Id);
        }
      }
    } catch (err) {
      setError("강의 목록을 불러오는데 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  const loadVideos = async (courseIdParam) => {
    setVideosLoading(true);
    
    try {
      const courseVideos = await videoService.getByCourseId(courseIdParam);
      setVideos(courseVideos);
      
      if (courseVideos.length > 0 && !currentVideo) {
        setCurrentVideo(courseVideos[0]);
      }
    } catch (err) {
      toast.error("강의 영상을 불러오는데 실패했습니다");
    } finally {
      setVideosLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [courseId]);

  const handleCourseClick = (course) => {
    navigate(`/membership/${course.Id}`);
  };

  const handleCourseEdit = (course) => {
    // Edit functionality would be implemented here
    toast.info("수정 기능은 준비 중입니다");
  };

  const handleCourseDelete = async (course) => {
    if (window.confirm("정말 이 강의를 삭제하시겠습니까?")) {
      try {
        await courseService.delete(course.Id);
        toast.success("강의가 삭제되었습니다");
        loadCourses();
        
        if (currentCourse?.Id === course.Id) {
          setCurrentCourse(null);
          setVideos([]);
          setCurrentVideo(null);
          navigate("/membership");
        }
      } catch (err) {
        toast.error("강의 삭제에 실패했습니다");
      }
    }
  };

  const handleUploadSubmit = async (courseData) => {
    try {
      const newCourse = await courseService.create(courseData);
      
      // Create videos for the course
      for (const videoData of courseData.videos) {
        await videoService.create({
          ...videoData,
          courseId: newCourse.Id
        });
      }
      
      loadCourses();
    } catch (err) {
      throw new Error("업로드에 실패했습니다");
    }
  };

  const handleVideoSelect = (video) => {
    setCurrentVideo(video);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show video player view if we have a current course
  if (currentCourse) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-6">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => {
                  setCurrentCourse(null);
                  setVideos([]);
                  setCurrentVideo(null);
                  navigate("/membership");
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ApperIcon name="ArrowLeft" size={20} className="text-gray-600" />
              </button>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                    <ApperIcon name="Users" size={16} className="text-white" />
                  </div>
                  <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent font-semibold text-sm">
                    멤버십 강의
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">{currentCourse.title}</h1>
                <p className="text-gray-600">{currentCourse.description}</p>
              </div>
              
              {canManageContent && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon="Edit"
                    onClick={() => handleCourseEdit(currentCourse)}
                  >
                    수정
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon="Upload"
                    onClick={() => setIsUploadModalOpen(true)}
                  >
                    새 강의 추가
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Video Player */}
          <div className="flex-1 p-6">
            {currentVideo ? (
              <div className="space-y-6">
                <VideoPlayer
                  videoUrl={currentVideo.videoUrl}
                  title={currentVideo.title}
                  className="w-full"
                />
                
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{currentVideo.title}</h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <ApperIcon name="Clock" size={14} />
                      {currentVideo.duration || 0}분
                    </span>
                    <span className="flex items-center gap-1">
                      <ApperIcon name="Calendar" size={14} />
                      {new Date().toLocaleDateString("ko-KR")}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    이 강의에서는 {currentVideo.title}에 대해 상세히 다룹니다. 
                    실습을 통해 실무에 바로 적용할 수 있는 내용들을 학습해보세요.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="PlayCircle" size={32} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">강의를 선택해주세요</h3>
                  <p className="text-gray-600">오른쪽 커리큘럼에서 시청할 강의를 선택하세요</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Curriculum Sidebar */}
        <CurriculumSidebar
          course={currentCourse}
          videos={videos}
          currentVideoId={currentVideo?.Id}
          onVideoSelect={handleVideoSelect}
          loading={videosLoading}
        />
      </div>
    );
  }

  // Show course grid view
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
              <ApperIcon name="Users" size={24} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              멤버십 강의
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            체계적인 커리큘럼으로 구성된 멤버십 전용 강의를 수강하세요.<br />
            단계별 학습으로 확실한 실력 향상을 경험해보세요.
          </p>
          
          <SearchBar 
            placeholder="멤버십 강의를 검색해보세요"
            onSearch={handleSearch}
            className="max-w-2xl mx-auto"
          />
        </div>

        {/* Action Buttons */}
        {canManageContent && (
          <div className="flex justify-end mb-8">
            <Button
              variant="primary"
              icon="Upload"
              onClick={() => setIsUploadModalOpen(true)}
            >
              새 강의 업로드
            </Button>
          </div>
        )}

        {/* Course Grid */}
        <CourseGrid
          courses={filteredCourses}
          loading={loading}
          error={error}
          onCourseClick={handleCourseClick}
          onCourseEdit={handleCourseEdit}
          onCourseDelete={handleCourseDelete}
          showActions={canManageContent}
          onRetry={loadCourses}
          emptyTitle="멤버십 강의가 없습니다"
          emptyDescription="새로운 멤버십 강의를 업로드해보세요"
        />

        {/* Upload Modal */}
        <UploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onSubmit={handleUploadSubmit}
          type="membership"
        />
      </div>
    </div>
  );
};

export default MembershipPage;