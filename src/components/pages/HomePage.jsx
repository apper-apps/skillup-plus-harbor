import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseGrid from "@/components/organisms/CourseGrid";
import ArticleGrid from "@/components/organisms/ArticleGrid";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { courseService } from "@/services/api/courseService";
import { videoService } from "@/services/api/videoService";
import { articleService } from "@/services/api/articleService";

const HomePage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    membershipCourses: [],
    masterCourses: [],
    articles: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [courses, articles] = await Promise.all([
        courseService.getAll(),
        articleService.getAll()
      ]);

      // Get video counts for courses
      const coursesWithVideos = await Promise.all(
        courses.map(async (course) => {
          try {
            const videos = await videoService.getByCourseId(course.Id);
            return {
              ...course,
              videoCount: videos.length,
              totalDuration: videos.reduce((acc, video) => acc + (video.duration || 0), 0)
            };
          } catch {
            return { ...course, videoCount: 0, totalDuration: 0 };
          }
        })
      );

      const membershipCourses = coursesWithVideos
        .filter(course => course.type === "membership")
        .slice(0, 4);
      
      const masterCourses = coursesWithVideos
        .filter(course => course.type === "master")
        .slice(0, 4);

      setData({
        membershipCourses,
        masterCourses,
        articles: articles.slice(0, 6)
      });
    } catch (err) {
      setError("데이터를 불러오는데 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCourseClick = (course) => {
    if (course.type === "membership") {
      navigate(`/membership/${course.Id}`);
    } else {
      navigate(`/master/${course.Id}`);
    }
  };

  const handleArticleClick = (article) => {
    navigate(`/insights/${article.Id}`);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    // Implement search functionality here
  };

  const filteredMembershipCourses = data.membershipCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMasterCourses = data.masterCourses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredArticles = data.articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              스킬업 플러스
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            전문적인 온라인 학습으로 여러분의 실력을 한 단계 높여보세요.<br />
            멤버십, 마스터 클래스, 인사이트까지 모든 것을 한 곳에서.
          </p>
          
          <SearchBar 
            placeholder="강의나 아티클을 검색해보세요"
            onSearch={handleSearch}
            className="max-w-2xl mx-auto mb-8"
          />
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              variant="primary" 
              size="lg"
              icon="GraduationCap"
              onClick={() => navigate("/membership")}
            >
              멤버십 강의 보기
            </Button>
            <Button 
              variant="secondary" 
              size="lg"
              icon="Crown"
              onClick={() => navigate("/master")}
            >
              마스터 클래스
            </Button>
            <Button 
              variant="accent" 
              size="lg"
              icon="Lightbulb"
              onClick={() => navigate("/insights")}
            >
              인사이트 읽기
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                <ApperIcon name="Users" size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  {data.membershipCourses.length}+
                </h3>
                <p className="text-gray-600">멤버십 강의</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary/80 rounded-xl flex items-center justify-center">
                <ApperIcon name="Crown" size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-secondary to-secondary/80 bg-clip-text text-transparent">
                  {data.masterCourses.length}+
                </h3>
                <p className="text-gray-600">마스터 클래스</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent/80 rounded-xl flex items-center justify-center">
                <ApperIcon name="FileText" size={24} className="text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-accent to-accent/80 bg-clip-text text-transparent">
                  {data.articles.length}+
                </h3>
                <p className="text-gray-600">인사이트 아티클</p>
              </div>
            </div>
          </div>
        </div>

        {/* Membership Courses Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">인기 멤버십 강의</h2>
              <p className="text-gray-600">체계적인 학습으로 실력을 향상시켜보세요</p>
            </div>
            <Button 
              variant="outline" 
              icon="ArrowRight"
              onClick={() => navigate("/membership")}
            >
              전체 보기
            </Button>
          </div>
          
          <CourseGrid
            courses={filteredMembershipCourses}
            loading={loading}
            error={error}
            onCourseClick={handleCourseClick}
            onRetry={loadData}
            emptyTitle="멤버십 강의가 없습니다"
            emptyDescription="새로운 멤버십 강의를 기다려주세요"
          />
        </section>

        {/* Master Classes Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">프리미엄 마스터 클래스</h2>
              <p className="text-gray-600">전문가가 전수하는 고급 기술과 노하우</p>
            </div>
            <Button 
              variant="outline" 
              icon="ArrowRight"
              onClick={() => navigate("/master")}
            >
              전체 보기
            </Button>
          </div>
          
          <CourseGrid
            courses={filteredMasterCourses}
            loading={loading}
            error={error}
            onCourseClick={handleCourseClick}
            onRetry={loadData}
            emptyTitle="마스터 클래스가 없습니다"
            emptyDescription="새로운 마스터 클래스를 기다려주세요"
          />
        </section>

        {/* Articles Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">최신 인사이트</h2>
              <p className="text-gray-600">업계 트렌드와 실무 팁을 확인해보세요</p>
            </div>
            <Button 
              variant="outline" 
              icon="ArrowRight"
              onClick={() => navigate("/insights")}
            >
              전체 보기
            </Button>
          </div>
          
          <ArticleGrid
            articles={filteredArticles}
            loading={loading}
            error={error}
            onArticleClick={handleArticleClick}
            onRetry={loadData}
            emptyTitle="인사이트 아티클이 없습니다"
            emptyDescription="새로운 아티클을 기다려주세요"
          />
        </section>
      </div>
    </div>
  );
};

export default HomePage;