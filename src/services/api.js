const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get headers with auth token
  getHeaders() {
    const token = localStorage.getItem('token');
    console.log('Sending token:', token); // <-- Add this line here
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }
  // Helper method to handle API responses
  // Helper method to handle API responses
  async handleResponse(response) {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      console.error('API Error Details:', JSON.stringify(error, null, 2));
      console.error('Response Status:', response.status);
      throw new Error(error.error || error.message || 'Something went wrong');
    }
    return response.json();
  }

  // Authentication endpoints
  async register(userData) {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(userData)
    });
    return this.handleResponse(response);
  }

  async login(email, password) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, password })
    });
    return this.handleResponse(response);
  }

  async getProfile() {
    const response = await fetch(`${this.baseURL}/auth/profile`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async updateProfile(profileData) {
    const response = await fetch(`${this.baseURL}/auth/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(profileData)
    });
    return this.handleResponse(response);
  }

  async logout() {
    const response = await fetch(`${this.baseURL}/auth/logout`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // News endpoints
  async getNews(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${this.baseURL}/news?${queryParams}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getNewsById(id) {
    const response = await fetch(`${this.baseURL}/news/${id}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async submitNews(newsData) {
    const response = await fetch(`${this.baseURL}/news`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(newsData)
    });
    return this.handleResponse(response);
  }

  async updateNews(id, newsData) {
    const response = await fetch(`${this.baseURL}/news/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(newsData)
    });
    return this.handleResponse(response);
  }

  async deleteNews(id) {
    const response = await fetch(`${this.baseURL}/news/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getUserSubmissions(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${this.baseURL}/news/user/submissions?${queryParams}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async likeNews(id) {
    const response = await fetch(`${this.baseURL}/news/${id}/like`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async shareNews(id) {
    const response = await fetch(`${this.baseURL}/news/${id}/share`, {
      method: 'POST',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async uploadImage(imageFile) {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${this.baseURL}/news/upload-image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: formData
    });
    return this.handleResponse(response);
  }

  // Admin endpoints
  async getDashboardStats() {
    const response = await fetch(`${this.baseURL}/admin/dashboard`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getPendingSubmissions(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${this.baseURL}/admin/pending?${queryParams}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getAllSubmissions(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${this.baseURL}/admin/submissions?${queryParams}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async approveNews(id) {
    const response = await fetch(`${this.baseURL}/admin/approve/${id}`, {
      method: 'PUT',
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async rejectNews(id, reason) {
    const response = await fetch(`${this.baseURL}/admin/reject/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ reason })
    });
    return this.handleResponse(response);
  }

  async getAllUsers(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${this.baseURL}/admin/users?${queryParams}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async updateUserStatus(id, isActive) {
    const response = await fetch(`${this.baseURL}/admin/users/${id}/status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ isActive })
    });
    return this.handleResponse(response);
  }

  async getAnalytics(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${this.baseURL}/admin/analytics?${queryParams}`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // User endpoints
  async getUserStats() {
    const response = await fetch(`${this.baseURL}/user/stats`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async getUserProfile() {
    const response = await fetch(`${this.baseURL}/user/profile`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  async updateUserProfile(profileData) {
    const response = await fetch(`${this.baseURL}/user/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(profileData)
    });
    return this.handleResponse(response);
  }

  async getUserPerformance() {
    const response = await fetch(`${this.baseURL}/user/performance`, {
      headers: this.getHeaders()
    });
    return this.handleResponse(response);
  }

  // Health check
  async healthCheck() {
    const response = await fetch(`${this.baseURL}/health`);
    return this.handleResponse(response);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
