import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { userProgressService } from '@/services/api/userProgressService';
import { courseService } from '@/services/api/courseService';

const DashboardPage = () => {
  const [userProgress, setUserProgress] = useState(null);
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [progressData, coursesData] = await Promise.all([
        userProgressService.getUserProgress(1), // Mock user ID
        courseService.getAll()
      ]);

      setUserProgress(progressData);
      
      // Get recent courses based on progress data
      const recentCourseIds = progressData.recentActivity.slice(0, 4);
      const recentCoursesData = recentCourseIds.map(activity => {
        const course = coursesData.find(c => c.Id === activity.courseId);
        return {
          ...course,
          lastAccessed: activity.lastAccessed,
          progress: activity.progress
        };
      }).filter(Boolean);
      
      setRecentCourses(recentCoursesData);
    } catch (err) {
      setError(err.message);
      toast.error('대시보드 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}시간 ${mins}분`;
    }
    return `${mins}분`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;
  if (!userProgress) return <Error message="데이터를 찾을 수 없습니다." />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <ApperIcon name="BarChart3" size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">학습 대시보드</h1>
              <p className="text-gray-600">나의 학습 현황과 진도를 확인해보세요</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">전체 진도율</p>
                  <p className="text-2xl font-bold text-primary">{userProgress.overallProgress}%</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-lg flex items-center justify-center">
                  <ApperIcon name="TrendingUp" size={24} className="text-primary" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">완료한 강의</p>
                  <p className="text-2xl font-bold text-success">{userProgress.completedCourses}개</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-success/10 to-success/20 rounded-lg flex items-center justify-center">
                  <ApperIcon name="CheckCircle" size={24} className="text-success" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">학습 시간</p>
                  <p className="text-2xl font-bold text-secondary">{formatDuration(userProgress.totalStudyTime)}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-secondary/10 to-secondary/20 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Clock" size={24} className="text-secondary" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">획득한 배지</p>
                  <p className="text-2xl font-bold text-accent">{userProgress.achievements}개</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-accent/10 to-accent/20 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Award" size={24} className="text-accent" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Courses */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <ApperIcon name="BookOpen" size={20} />
                  최근 학습 강의
                </h2>
                <Link to="/membership">
                  <Button variant="ghost" size="sm" icon="ArrowRight" iconPosition="right">
                    전체 보기
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {recentCourses.map((course) => (
                  <div key={course.Id} className="flex items-center gap-4 p-4 rounded-lg border border-gray-100 hover:border-primary/20 hover:bg-gradient-to-r hover:from-primary/5 hover:to-transparent transition-all">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{course.description}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-600">진도율</span>
                            <span className="text-xs font-semibold text-primary">{course.progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>
                        <Badge variant={course.type === 'membership' ? 'primary' : 'secondary'}>
                          {course.type === 'membership' ? '멤버십' : '마스터'}
                        </Badge>
                      </div>
                    </div>
                    <Link to={`/${course.type}/${course.Id}`}>
                      <Button variant="outline" size="sm" icon="Play">
                        계속 학습
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Progress & Achievements */}
          <div className="space-y-6">
            {/* Weekly Progress */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ApperIcon name="Calendar" size={20} />
                주간 학습 현황
              </h2>
              <div className="space-y-3">
                {userProgress.weeklyProgress.map((day, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">{day.day}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-primary to-primary/80 h-2 rounded-full"
                          style={{ width: `${(day.minutes / 120) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8 text-right">{day.minutes}분</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ApperIcon name="Trophy" size={20} />
                최근 달성한 배지
              </h2>
              <div className="space-y-3">
                {userProgress.recentAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center">
                      <ApperIcon name="Award" size={16} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                      <p className="text-xs text-gray-600">{formatDate(achievement.unlockedAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Streak */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ApperIcon name="Flame" size={20} />
                학습 연속 기록
              </h2>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{userProgress.learningStreak}일</div>
                <p className="text-sm text-gray-600 mb-4">연속 학습 중</p>
                <div className="flex justify-center gap-1">
                  {[...Array(7)].map((_, index) => (
                    <div
                      key={index}
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold",
                        index < userProgress.learningStreak % 7 
                          ? "bg-gradient-to-br from-primary to-primary/80 text-white" 
                          : "bg-gray-200 text-gray-500"
                      )}
                    >
                      {index + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;