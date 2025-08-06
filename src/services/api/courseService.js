import courseData from "@/services/mockData/courses.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CourseService {
  constructor() {
    this.courses = [...courseData];
  }

  async getAll() {
    await delay(300);
    return [...this.courses];
  }

  async getById(id) {
    await delay(200);
    const course = this.courses.find(c => c.Id === parseInt(id));
    if (!course) {
      throw new Error("Course not found");
    }
    return { ...course };
  }

  async getByType(type) {
    await delay(300);
    return this.courses.filter(course => course.type === type);
  }

  async create(courseData) {
    await delay(400);
    const highestId = Math.max(...this.courses.map(c => c.Id), 0);
    const newCourse = {
      Id: highestId + 1,
      ...courseData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.courses.push(newCourse);
    return { ...newCourse };
  }

  async update(id, updateData) {
    await delay(300);
    const index = this.courses.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Course not found");
    }
    
    this.courses[index] = {
      ...this.courses[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.courses[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.courses.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Course not found");
    }
    
    this.courses.splice(index, 1);
    return true;
  }
}

export const courseService = new CourseService();