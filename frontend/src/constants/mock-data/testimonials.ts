export interface Testimonial {
  id: string;
  rating: number;
  avatar: string;
}

export const mockTestimonials: Testimonial[] = [
  {
    id: "r1",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "r2",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
  },
  {
    id: "r3",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80",
  },
];
