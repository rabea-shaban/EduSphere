export interface Teacher {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  avatar: string;
}

export const mockTeachers: Teacher[] = [
  {
    id: "t1",
    name: "Mr. Ahmed Ali",
    specialization: "Mathematics & Statistics",
    experience: "12 Years",
    rating: 4.8,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "t2",
    name: "Dr. Sarah Kamal",
    specialization: "Physics & Chemistry",
    experience: "15 Years",
    rating: 4.7,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "t3",
    name: "Miss Layla Hassan",
    specialization: "English Literature",
    experience: "8 Years",
    rating: 4.9,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
  },
];
