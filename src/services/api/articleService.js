import articleData from "@/services/mockData/articles.json";

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ArticleService {
  constructor() {
    this.articles = [...articleData];
  }

  async getAll() {
    await delay(300);
    return [...this.articles].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  }

  async getById(id) {
    await delay(200);
    const article = this.articles.find(a => a.Id === parseInt(id));
    if (!article) {
      throw new Error("Article not found");
    }
    
    // Increment view count
    const index = this.articles.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      this.articles[index].views = (this.articles[index].views || 0) + 1;
    }
    
    return { ...this.articles[index] };
  }

  async create(articleData) {
    await delay(400);
    const highestId = Math.max(...this.articles.map(a => a.Id), 0);
    const newArticle = {
      Id: highestId + 1,
      ...articleData,
      authorId: 1, // Mock author ID
      publishedAt: new Date().toISOString(),
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.articles.push(newArticle);
    return { ...newArticle };
  }

  async update(id, updateData) {
    await delay(300);
    const index = this.articles.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Article not found");
    }
    
    this.articles[index] = {
      ...this.articles[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.articles[index] };
  }

  async delete(id) {
    await delay(200);
    const index = this.articles.findIndex(a => a.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Article not found");
    }
    
    this.articles.splice(index, 1);
    return true;
  }
}

export const articleService = new ArticleService();