import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArticleGrid from "@/components/organisms/ArticleGrid";
import ArticleEditor from "@/components/organisms/ArticleEditor";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { articleService } from "@/services/api/articleService";
import { toast } from "react-toastify";

const InsightsPage = () => {
  const navigate = useNavigate();
  const { articleId } = useParams();
  const [articles, setArticles] = useState([]);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  
  // Mock user role - in real app this would come from auth context
  const userRole = "admin";
  const canManageContent = userRole === "admin" || userRole === "master";

  const loadArticles = async () => {
    setLoading(true);
    setError("");
    
    try {
      const allArticles = await articleService.getAll();
      setArticles(allArticles);
      
      if (articleId) {
        const article = allArticles.find(a => a.Id === parseInt(articleId));
        if (article) {
          setCurrentArticle(article);
        }
      }
    } catch (err) {
      setError("아티클 목록을 불러오는데 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, [articleId]);

  const handleArticleClick = (article) => {
    if (articleId) {
      navigate(`/insights/${article.Id}`);
    } else {
      setCurrentArticle(article);
      navigate(`/insights/${article.Id}`);
    }
  };

  const handleArticleEdit = (article) => {
    setEditingArticle(article);
    setIsEditorOpen(true);
  };

  const handleArticleDelete = async (article) => {
    if (window.confirm("정말 이 아티클을 삭제하시겠습니까?")) {
      try {
        await articleService.delete(article.Id);
        toast.success("아티클이 삭제되었습니다");
        loadArticles();
        
        if (currentArticle?.Id === article.Id) {
          setCurrentArticle(null);
          navigate("/insights");
        }
      } catch (err) {
        toast.error("아티클 삭제에 실패했습니다");
      }
    }
  };

  const handleEditorSubmit = async (articleData) => {
    try {
      if (editingArticle) {
        await articleService.update(editingArticle.Id, articleData);
      } else {
        await articleService.create(articleData);
      }
      
      loadArticles();
      setEditingArticle(null);
    } catch (err) {
      throw new Error("저장에 실패했습니다");
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show individual article view
  if (currentArticle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Navigation */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => {
                setCurrentArticle(null);
                navigate("/insights");
              }}
              className="p-2 rounded-lg hover:bg-white/60 transition-colors"
            >
              <ApperIcon name="ArrowLeft" size={20} className="text-gray-600" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent/80 rounded-lg flex items-center justify-center">
                <ApperIcon name="Lightbulb" size={16} className="text-white" />
              </div>
              <span className="bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent font-semibold text-sm">
                인사이트 아티클
              </span>
            </div>
            
            {canManageContent && (
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  icon="Edit"
                  onClick={() => handleArticleEdit(currentArticle)}
                >
                  수정
                </Button>
                <Button
                  variant="accent"
                  size="sm"
                  icon="Plus"
                  onClick={() => {
                    setEditingArticle(null);
                    setIsEditorOpen(true);
                  }}
                >
                  새 아티클
                </Button>
              </div>
            )}
          </div>

          {/* Article Content */}
          <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Featured Image */}
            {currentArticle.thumbnailUrl && (
              <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300">
                <img 
                  src={currentArticle.thumbnailUrl} 
                  alt={currentArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-8">
              {/* Article Header */}
              <div className="mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {currentArticle.title}
                </h1>
                
                <div className="flex items-center gap-6 text-gray-600 mb-6">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Calendar" size={16} />
                    <span>{new Date(currentArticle.publishedAt).toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long", 
                      day: "numeric"
                    })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Clock" size={16} />
                    <span>{Math.ceil((currentArticle.content?.length || 0) / 500)}분 읽기</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Eye" size={16} />
                    <span>{currentArticle.views || 0}회 조회</span>
                  </div>
                </div>
                
                <div className="w-24 h-1 bg-gradient-to-r from-accent to-accent/60 rounded-full"></div>
              </div>

              {/* Article Body */}
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {currentArticle.content}
                </div>
              </div>
              
              {/* Article Footer */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center">
                      <ApperIcon name="User" size={20} className="text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">스킬업 플러스 에디터</div>
                      <div className="text-sm text-gray-600">전문 콘텐츠 작성자</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" icon="Share2">
                      공유하기
                    </Button>
                    <Button variant="outline" size="sm" icon="Bookmark">
                      북마크
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Related Articles */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">관련 아티클</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles
                .filter(article => article.Id !== currentArticle.Id)
                .slice(0, 4)
                .map(article => (
                  <div 
                    key={article.Id}
                    onClick={() => handleArticleClick(article)}
                    className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  >
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-accent transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                      {article.excerpt}
                    </p>
                    <div className="text-xs text-gray-500">
                      {new Date(article.publishedAt).toLocaleDateString("ko-KR")}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Article Editor */}
        <ArticleEditor
          isOpen={isEditorOpen}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingArticle(null);
          }}
          onSubmit={handleEditorSubmit}
          article={editingArticle}
        />
      </div>
    );
  }

  // Show article grid view
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/80 rounded-xl flex items-center justify-center">
              <ApperIcon name="Lightbulb" size={24} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
              인사이트
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            업계 트렌드와 실무 노하우가 담긴 인사이트 아티클을 만나보세요.<br />
            블로그 스타일의 깔끔한 레이아웃으로 편리하게 읽어보세요.
          </p>
          
          <SearchBar 
            placeholder="인사이트 아티클을 검색해보세요"
            onSearch={handleSearch}
            className="max-w-2xl mx-auto"
          />
        </div>

        {/* Action Buttons */}
        {canManageContent && (
          <div className="flex justify-end mb-8">
            <Button
              variant="accent"
              icon="Plus"
              onClick={() => {
                setEditingArticle(null);
                setIsEditorOpen(true);
              }}
            >
              새 아티클 작성
            </Button>
          </div>
        )}

        {/* Articles Grid */}
        <ArticleGrid
          articles={filteredArticles}
          loading={loading}
          error={error}
          onArticleClick={handleArticleClick}
          onArticleEdit={handleArticleEdit}
          onArticleDelete={handleArticleDelete}
          showActions={canManageContent}
          onRetry={loadArticles}
          emptyTitle="인사이트 아티클이 없습니다"
          emptyDescription="새로운 인사이트 아티클을 작성해보세요"
        />

        {/* Article Editor */}
        <ArticleEditor
          isOpen={isEditorOpen}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingArticle(null);
          }}
          onSubmit={handleEditorSubmit}
          article={editingArticle}
        />
      </div>
    </div>
  );
};

export default InsightsPage;