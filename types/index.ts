export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  level: number;
  points: number;
  totalPoints: number;
  streak: number;
  isPremium?: boolean;
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
  progress: number;
  isLocked: boolean;
  videos: Video[];
  quizzes: Quiz[];
  order: number;
}

export interface Quiz {
  id: string;
  title: string;
  moduleId: string;
  questions: QuizQuestion[];
  completed: boolean;
  score?: number;
  courseId?: string;
  courseName?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer?: number;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  likes: number;
  isLiked: boolean;
  createdAt: Date;
}

export interface Source {
  id: string;
  title: string;
  url: string;
  domain: string;
  isVerified: boolean;
}

export interface VideoProgress {
  videoId: string;
  watchedSeconds: number;
  totalSeconds: number;
  completed: boolean;
  lastWatchedAt: Date;
}

export interface CourseProgress {
  courseId: string;
  progress: number;
  completedModules: string[];
  completedVideos: string[];
  completedQuizzes: string[];
  lastAccessed: Date;
  certificateEarned: boolean;
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
  points: number;
  isEnrolled: boolean;
  isSaved: boolean;
  lastAccessed?: Date;
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