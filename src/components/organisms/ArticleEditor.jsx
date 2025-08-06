import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { toast } from "react-toastify";

const ArticleEditor = ({ isOpen, onClose, onSubmit, article = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    thumbnailUrl: "",
    excerpt: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || "",
        content: article.content || "",
        thumbnailUrl: article.thumbnailUrl || "",
        excerpt: article.excerpt || ""
      });
    } else {
      setFormData({
        title: "",
        content: "",
        thumbnailUrl: "",
        excerpt: ""
      });
    }
  }, [article, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("제목을 입력해주세요");
      return;
    }
    
    if (!formData.content.trim()) {
      toast.error("내용을 입력해주세요");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const articleData = {
        ...formData,
        excerpt: formData.excerpt || formData.content.substring(0, 150) + "..."
      };
      
      await onSubmit(articleData);
      
      setFormData({
        title: "",
        content: "",
        thumbnailUrl: "",
        excerpt: ""
      });
      
      toast.success(article ? "아티클이 수정되었습니다" : "아티클이 작성되었습니다");
      onClose();
    } catch (error) {
      toast.error("저장 중 오류가 발생했습니다");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContentChange = (e) => {
    const content = e.target.value;
    setFormData(prev => ({
      ...prev,
      content,
      excerpt: prev.excerpt || content.substring(0, 150) + (content.length > 150 ? "..." : "")
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-accent/5 to-accent/10">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
              {article ? "아티클 수정" : "새 아티클 작성"}
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
            {/* Article Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <ApperIcon name="FileText" size={20} className="text-accent" />
                아티클 정보
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="아티클 제목"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="아티클 제목을 입력하세요"
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
                  요약 (선택사항)
                </label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  placeholder="아티클 요약을 입력하세요 (비워두면 자동 생성됩니다)"
                  rows={2}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-accent focus:ring-4 focus:ring-accent/10 transition-all duration-200 placeholder:text-gray-400 resize-none"
                />
              </div>
            </div>

            {/* Content Editor */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <ApperIcon name="Edit3" size={20} className="text-accent" />
                내용 작성
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  아티클 내용
                </label>
                <textarea
                  value={formData.content}
                  onChange={handleContentChange}
                  placeholder="아티클 내용을 작성하세요..."
                  rows={15}
                  className="rich-editor w-full"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  {formData.content.length}자 | 마크다운 형식을 지원합니다
                </p>
              </div>
            </div>

            {/* Preview */}
            {formData.title && formData.content && (
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ApperIcon name="Eye" size={20} className="text-accent" />
                  미리보기
                </h3>
                
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    {formData.thumbnailUrl && (
                      <div className="aspect-video mb-4 rounded-lg overflow-hidden bg-gray-200">
                        <img 
                          src={formData.thumbnailUrl} 
                          alt={formData.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    <h4 className="text-xl font-bold text-gray-900 mb-3">
                      {formData.title}
                    </h4>
                    
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {formData.excerpt || formData.content.substring(0, 150) + (formData.content.length > 150 ? "..." : "")}
                    </p>
                    
                    <div className="text-xs text-gray-500 flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <ApperIcon name="Calendar" size={12} />
                        {new Date().toLocaleDateString("ko-KR")}
                      </span>
                      <span className="flex items-center gap-1">
                        <ApperIcon name="Clock" size={12} />
                        {Math.ceil(formData.content.length / 500)}분 읽기
                      </span>
                    </div>
                  </div>
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
                variant="accent"
                loading={isSubmitting}
                icon={article ? "Save" : "Send"}
                className="flex-1"
              >
                {article ? "수정 완료" : "게시하기"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditor;