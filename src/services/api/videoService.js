import videoData from "@/services/mockData/videos.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class VideoService {
  constructor() {
    this.videos = [...videoData];
  }

  async getAll() {
    await delay(300);
    return [...this.videos];
  }

  async getById(id) {
    await delay(200);
    const video = this.videos.find(v => v.Id === parseInt(id));
    if (!video) {
      throw new Error("Video not found");
    }
    return { ...video };
  }

  async getByCourseId(courseId) {
    await delay(250);
    return this.videos
      .filter(video => video.courseId === parseInt(courseId))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async create(videoData) {
    await delay(400);
    const highestId = Math.max(...this.videos.map(v => v.Id), 0);
    const newVideo = {
      Id: highestId + 1,
      ...videoData,
      completed: false,
      createdAt: new Date().toISOString()
    };
    this.videos.push(newVideo);
    return { ...newVideo };
  }

  async update(id, updateData) {
    await delay(300);
    const index = this.videos.findIndex(v => v.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Video not found");
    }
    
    this.videos[index] = {
      ...this.videos[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.videos[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.videos.findIndex(v => v.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Video not found");
    }
    
    this.videos.splice(index, 1);
    return true;
  }

  async markCompleted(id) {
    await delay(200);
    return this.update(id, { completed: true });
  }
}

export const videoService = new VideoService();