export interface Testimonial {
  id: string;
  name: string;
  course: string;
  review: string;
  rating: number;
  avatar: string;
}

export const mockTestimonials: Testimonial[] = [
  {
    id: "r1",
    name: "Youssef Ibrahim",
    course: "Secondary Algebra",
    review: "The interactive quizzes and AI tutor helped me understand calculus concepts so much faster. Highly recommended platform!",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "r2",
    name: "Mariam Mahmoud",
    course: "General Chemistry",
    review: "Dr. Sarah's video explanations make even complex organic chemistry equations seem simple. The dashboard layout is super clean.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "r3",
    name: "Kareem Tarek",
    course: "English Grammar",
    review: "The step-by-step learning stages made it very easy to track my language vocabulary progress. Simply the best EdTech app.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80",
  },
];
