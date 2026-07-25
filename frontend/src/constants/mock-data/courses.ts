export interface Course {
  id: string;
  title: string;
  teacherName: string;
  teacherAvatar: string;
  price: number;
  originalPrice?: number;
  studentsCount: number;
  rating: number;
  duration: string;
  thumbnail: string;
  stage: "primary" | "preparatory" | "secondary";
}

export const mockCourses: Course[] = [
  {
    id: "c1",
    title: "Advanced Algebra & Calculus Basics",
    teacherName: "Mr. Ahmed Ali",
    teacherAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    price: 49,
    originalPrice: 99,
    studentsCount: 1240,
    rating: 4.8,
    duration: "24 Hours",
    thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80",
    stage: "secondary",
  },
  {
    id: "c2",
    title: "Introduction to General Chemistry",
    teacherName: "Dr. Sarah Kamal",
    teacherAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    price: 39,
    studentsCount: 850,
    rating: 4.7,
    duration: "18 Hours",
    thumbnail: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=600&auto=format&fit=crop&q=80",
    stage: "secondary",
  },
  {
    id: "c3",
    title: "Preparatory English Grammar & Syntax",
    teacherName: "Miss Layla Hassan",
    teacherAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80",
    price: 29,
    originalPrice: 59,
    studentsCount: 940,
    rating: 4.9,
    duration: "15 Hours",
    thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80",
    stage: "preparatory",
  },
  {
    id: "c4",
    title: "Basic Science and Discovery Experiments",
    teacherName: "Mr. Tarek Hosny",
    teacherAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    price: 19,
    studentsCount: 2150,
    rating: 4.6,
    duration: "12 Hours",
    thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
    stage: "primary",
  },
];
