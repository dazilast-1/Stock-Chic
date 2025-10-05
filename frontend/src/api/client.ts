import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  ApiResponse, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  User,
  ArticleWithDeclinaisons,
  CreateArticleRequest,
  UpdateArticleRequest,
  PaginatedResponse,
  StockAlert
} from '../types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Intercepteur pour ajouter le token d'authentification
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Intercepteur pour gérer les erreurs de réponse
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // Token expiré ou invalide
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Méthodes d'authentification
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data.data!;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    return response.data.data!;
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<ApiResponse<User>>('/auth/me');
    return response.data.data!;
  }

  async refreshToken(): Promise<{ token: string }> {
    const response = await this.client.post<ApiResponse<{ token: string }>>('/auth/refresh');
    return response.data.data!;
  }

  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
  }

  // Méthodes pour les articles
  async getArticles(params?: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    collection?: string;
    marque?: string;
    search?: string;
  }): Promise<PaginatedResponse<ArticleWithDeclinaisons>> {
    const response = await this.client.get<ApiResponse<PaginatedResponse<ArticleWithDeclinaisons>>>('/articles', {
      params
    });
    return response.data.data!;
  }

  async getArticleById(id: string): Promise<ArticleWithDeclinaisons> {
    const response = await this.client.get<ApiResponse<ArticleWithDeclinaisons>>(`/articles/${id}`);
    return response.data.data!;
  }

  async getArticleByReference(reference: string): Promise<ArticleWithDeclinaisons> {
    const response = await this.client.get<ApiResponse<ArticleWithDeclinaisons>>(`/articles/reference/${reference}`);
    return response.data.data!;
  }

  async createArticle(articleData: CreateArticleRequest): Promise<ArticleWithDeclinaisons> {
    const response = await this.client.post<ApiResponse<ArticleWithDeclinaisons>>('/articles', articleData);
    return response.data.data!;
  }

  async updateArticle(id: string, articleData: UpdateArticleRequest): Promise<ArticleWithDeclinaisons> {
    const response = await this.client.put<ApiResponse<ArticleWithDeclinaisons>>(`/articles/${id}`, articleData);
    return response.data.data!;
  }

  async deleteArticle(id: string): Promise<void> {
    await this.client.delete(`/articles/${id}`);
  }

  async getStockAlerts(): Promise<StockAlert[]> {
    const response = await this.client.get<ApiResponse<StockAlert[]>>('/articles/alerts/stock-bas');
    return response.data.data!;
  }

  // Méthodes pour les ventes
  get(url: string) {
    return this.client.get(url);
  }

  post(url: string, data?: any) {
    return this.client.post(url, data);
  }

  put(url: string, data?: any) {
    return this.client.put(url, data);
  }

  delete(url: string) {
    return this.client.delete(url);
  }

  // Méthodes utilitaires
  setAuthToken(token: string): void {
    localStorage.setItem('token', token);
  }

  removeAuthToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getAuthToken(): string | null {
    return localStorage.getItem('token');
  }
}

// Instance singleton
export const apiClient = new ApiClient();
export default apiClient;

