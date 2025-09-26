export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: number;
  points: number;
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

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videos: Video[];
  progress: number;
  totalVideos: number;
  completedVideos: number;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
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