import userProgressData from "@/services/mockData/userProgress.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserProgressService {
  constructor() {
    this.userProgress = { ...userProgressData };
  }

  async getUserProgress(userId) {
    await delay(300);
    // In a real app, this would fetch user-specific data
    return { ...this.userProgress };
  }

  async updateCourseProgress(userId, courseId, progress) {
    await delay(200);
    
    // Find existing activity or create new one
    const activityIndex = this.userProgress.recentActivity.findIndex(
      activity => activity.courseId === courseId
    );

    if (activityIndex >= 0) {
      // Update existing activity
      this.userProgress.recentActivity[activityIndex] = {
        ...this.userProgress.recentActivity[activityIndex],
        progress,
        lastAccessed: new Date().toISOString()
      };
    } else {
      // Add new activity
      this.userProgress.recentActivity.unshift({
        courseId,
        progress,
        lastAccessed: new Date().toISOString()
      });
    }

    // Keep only recent 10 activities
    this.userProgress.recentActivity = this.userProgress.recentActivity.slice(0, 10);

    // Update overall progress (simplified calculation)
    const totalProgress = this.userProgress.recentActivity.reduce((sum, activity) => sum + activity.progress, 0);
    this.userProgress.overallProgress = Math.round(totalProgress / this.userProgress.recentActivity.length);

    return { ...this.userProgress };
  }

  async addStudyTime(userId, minutes) {
    await delay(100);
    this.userProgress.totalStudyTime += minutes;
    
    // Update today's study time
    const today = new Date().toLocaleDateString('ko-KR', { weekday: 'short' });
    const todayProgress = this.userProgress.weeklyProgress.find(day => day.day === today);
    if (todayProgress) {
      todayProgress.minutes += minutes;
    }

    return { ...this.userProgress };
  }

  async unlockAchievement(userId, achievement) {
    await delay(200);
    
    const newAchievement = {
      ...achievement,
      unlockedAt: new Date().toISOString()
    };

    this.userProgress.recentAchievements.unshift(newAchievement);
    this.userProgress.recentAchievements = this.userProgress.recentAchievements.slice(0, 5);
    this.userProgress.achievements += 1;

    return { ...this.userProgress };
  }

  async updateLearningStreak(userId) {
    await delay(100);
    const lastActivity = new Date(this.userProgress.lastActivityDate);
    const today = new Date();
    const diffInDays = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      // Same day, no change
      return { ...this.userProgress };
    } else if (diffInDays === 1) {
      // Next day, continue streak
      this.userProgress.learningStreak += 1;
    } else {
      // Streak broken, reset
      this.userProgress.learningStreak = 1;
    }

    this.userProgress.lastActivityDate = today.toISOString();
    return { ...this.userProgress };
  }
}

export const userProgressService = new UserProgressService();