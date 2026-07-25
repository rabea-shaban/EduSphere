export interface Course {
  id: string;
  titleKey: string;
  teacherNameKey: string;
  teacherAvatar: string;
  price: number;
  originalPrice?: number;
  studentsCount: number;
  rating: number;
  duration: string;
  thumbnail: string;
  stageKey: string;
}

export const mockCourses: Course[] = [
  {
    id: "c1",
    titleKey: "physics",
    teacherNameKey: "mohammed",
    teacherAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80",
    price: 49,
    originalPrice: 99,
    studentsCount: 1240,
    rating: 4.8,
    duration: "24 Hours",
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80",
    stageKey: "secondary3",
  },
  {
    id: "c2",
    titleKey: "chemistry",
    teacherNameKey: "ahmed",
    teacherAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    price: 39,
    studentsCount: 850,
    rating: 4.7,
    duration: "18 Hours",
    thumbnail: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=600&auto=format&fit=crop&q=80",
    stageKey: "secondary2",
  },
  {
    id: "c3",
    titleKey: "math",
    teacherNameKey: "mohammed",
    teacherAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80",
    price: 29,
    originalPrice: 59,
    studentsCount: 940,
    rating: 4.9,
    duration: "15 Hours",
    thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80",
    stageKey: "prep",
  },
  {
    id: "c4",
    titleKey: "english",
    teacherNameKey: "sarah",
    teacherAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    price: 19,
    studentsCount: 2150,
    rating: 4.6,
    duration: "12 Hours",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
    stageKey: "primary",
  },
];
