export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  category: NewsCategory;
  village: string;
  author: string | { name: string; email: string; village: string };
  authorPhone?: string;
  publishedAt: string;
  status: 'pending' | 'published' | 'rejected';
  location?: {
    latitude: number;
    longitude: number;
  };
  audioUrl?: string;
  images?: Array<{
    url: string;
    caption?: string;
    alt?: string;
  }>;
  tags: string[];
  viewCount: number;
  isGeoTagged: boolean;
  translated?: boolean;
  originalLanguage?: string;
  targetLanguage?: string;
}

export type NewsCategory = 'news' | 'scheme' | 'culture' | 'issue' | 'event' | 'agriculture' | 'education' | 'health' | 'infrastructure' | 'other';

export interface NewsSubmission {
  id: string;
  title: string;
  content: string;
  category: NewsCategory;
  village: string;
  authorName: string;
  authorPhone: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  location?: {
    latitude: number;
    longitude: number;
  };
  audioFile?: File;
  audioUrl?: string;
  imageFiles?: File[];
  images?: Array<{
    url: string;
    caption?: string;
    alt?: string;
  }>;
  tags: string[];
  adminNotes?: string;
}

export interface Village {
  id: string;
  name: string;
  district: string;
  state: string;
  population: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface AdminStats {
  totalSubmissions: number;
  pendingReviews: number;
  publishedArticles: number;
  rejectedArticles: number;
  totalVillages: number;
  activeReporters: number;
  monthlyStats: MonthlyStats;
  dailyStats: DailyStats[];
  topVillages: VillageStats[];
  categoryBreakdown: CategoryStats[];
}

export interface MonthlyStats {
  month: string;
  submissions: number;
  published: number;
  rejected: number;
  views: number;
  newUsers: number;
}

export interface DailyStats {
  date: string;
  submissions: number;
  published: number;
  views: number;
  activeUsers: number;
}

export interface VillageStats {
  village: string;
  submissions: number;
  published: number;
  views: number;
  reporters: number;
}

export interface CategoryStats {
  category: NewsCategory;
  count: number;
  percentage: number;
  views: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  phone: string;
  village: string;
  role: 'admin' | 'reporter';
  joinedAt: string;
  lastActive: string;
  avatar?: string;
  bio?: string;
  isTrusted: boolean;
  trustLevel: 'new' | 'trusted' | 'verified';
  stats: UserStats;
}

export interface UserStats {
  totalSubmissions: number;
  approvedSubmissions: number;
  rejectedSubmissions: number;
  pendingSubmissions: number;
  totalViews: number;
  thisMonthSubmissions: number;
  lastMonthSubmissions: number;
  averageViewsPerArticle: number;
  topCategory: NewsCategory;
  recentActivity: UserActivity[];
}

export interface UserActivity {
  id: string;
  type: 'submission' | 'approval' | 'rejection' | 'view';
  title: string;
  timestamp: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export interface LiveVideo {
  id: string;
  title: string;
  description: string;
  streamUrl: string;
  thumbnailUrl: string;
  isLive: boolean;
  viewerCount: number;
  startedAt: string;
  endedAt?: string;
  host: {
    id: string;
    name: string;
    avatar?: string;
  };
  village: string;
  category: NewsCategory;
  tags: string[];
}

export interface AudioRecording {
  id: string;
  blob: Blob;
  url: string;
  duration: number;
  timestamp: string;
}

export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: string;
}

export interface SMSSubmission {
  phoneNumber: string;
  message: string;
  timestamp: string;
  village?: string;
  category?: NewsCategory;
}

export interface IVRSubmission {
  phoneNumber: string;
  audioUrl: string;
  duration: number;
  timestamp: string;
  village?: string;
  category?: NewsCategory;
  transcription?: string;
}
