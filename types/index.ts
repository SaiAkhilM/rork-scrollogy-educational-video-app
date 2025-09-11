export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: number;
  points: number;
  totalPoints: number;
  streak: number;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  course: {
    id: string;
    name: string;
    thumbnail: string;
  };
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  likes: number;
  views: number;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface Module {
  id: string;
  title: string;
  thumbnailUrl: string;
  videos: Video[];
  quizzes: Quiz[];
  progress: number;
  isLocked: boolean;
  order: number;
}

export interface Quiz {
  id: string;
  title: string;
  questions: number;
  completed: boolean;
  score?: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  modules: Module[];
  progress: number;
  totalVideos: number;
  completedVideos: number;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  pointsEarned: number;
  totalPoints: number;
  isLiked: boolean;
  lastAccessedAt?: Date;
  completedAt?: Date;
  enrolledAt?: Date;
  certificateUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  videoCount: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progress?: number;
  maxProgress?: number;
}