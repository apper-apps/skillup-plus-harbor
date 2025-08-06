import React, { useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { toast } from "react-toastify";

const UploadModal = ({ isOpen, onClose, onSubmit, type = "course" }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnailUrl: "",
    videos: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentVideo, setCurrentVideo] = useState({
    title: "",
    videoUrl: "",
    duration: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("제목을 입력해주세요");
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error("설명을 입력해주세요");
      return;
    }

    if (formData.videos.length === 0) {
      toast.error("최소 하나의 강의를 추가해주세요");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const courseData = {
        ...formData,
        type: type,
        totalDuration: formData.videos.reduce((acc, video) => acc + (video.duration || 0), 0),
        videoCount: formData.videos.length
      };
      
      await onSubmit(courseData);
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        thumbnailUrl: "",
        videos: []
      });
      setCurrentVideo({
        title: "",
        videoUrl: "",
        duration: 0
      });
      
      toast.success("성공적으로 업로드되었습니다");
      onClose();
    } catch (error) {
      toast.error("업로드 중 오류가 발생했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addVideo = () => {
    if (!currentVideo.title.trim() || !currentVideo.videoUrl.trim()) {
      toast.error("강의 제목과 URL을 입력해주세요");
      return;
    }

    const newVideo = {
      Id: Date.now() + Math.random(),
      ...currentVideo,
      order: formData.videos.length + 1
    };

    setFormData(prev => ({
      ...prev,
      videos: [...prev.videos, newVideo]
    }));

    setCurrentVideo({
      title: "",
      videoUrl: "",
      duration: 0
    });

    toast.success("강의가 추가되었습니다");
  };

  const removeVideo = (videoId) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter(v => v.Id !== videoId)
    }));
    toast.success("강의가 제거되었습니다");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {type === "membership" ? "멤버십" : "마스터"} 강의 업로드
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" size={24} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <ApperIcon name="BookOpen" size={20} className="text-primary" />
                강의 정보
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="강의 제목"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="강의 제목을 입력하세요"
                  required
                />
                
                <Input
                  label="썸네일 URL"
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, thumbnailUrl: e.target.value }))}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  강의 설명
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="강의 설명을 입력하세요"
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 placeholder:text-gray-400 resize-none"
                  required
                />
              </div>
            </div>

            {/* Add Video Section */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <ApperIcon name="Video" size={20} className="text-secondary" />
                강의 영상 추가
              </h3>
              
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="영상 제목"
                    value={currentVideo.title}
                    onChange={(e) => setCurrentVideo(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="영상 제목을 입력하세요"
                  />
                  
                  <Input
                    label="재생 시간 (분)"
                    type="number"
                    value={currentVideo.duration}
                    onChange={(e) => setCurrentVideo(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                    placeholder="재생 시간"
                    min="0"
                  />
                </div>
                
                <Input
                  label="YouTube URL"
                  value={currentVideo.videoUrl}
                  onChange={(e) => setCurrentVideo(prev => ({ ...prev, videoUrl: e.target.value }))}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                
                <Button
                  type="button"
                  onClick={addVideo}
                  variant="accent"
                  icon="Plus"
                  className="w-full sm:w-auto"
                >
                  강의 추가
                </Button>
              </div>
            </div>

            {/* Video List */}
            {formData.videos.length > 0 && (
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ApperIcon name="List" size={20} className="text-accent" />
                  추가된 강의 ({formData.videos.length}개)
                </h3>
                
                <div className="space-y-3">
                  {formData.videos.map((video, index) => (
                    <div
                      key={video.Id}
                      className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-4"
                    >
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{video.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <ApperIcon name="Clock" size={14} />
                            {video.duration}분
                          </span>
                          <span className="flex items-center gap-1">
                            <ApperIcon name="Youtube" size={14} />
                            YouTube
                          </span>
                        </div>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => removeVideo(video.Id)}
                        className="p-2 rounded-lg text-error hover:bg-error/10 transition-colors"
                        title="제거"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                className="flex-1 sm:flex-none"
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                icon="Upload"
                className="flex-1"
              >
                업로드
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;