export interface Teacher {
  id: string;
  nameKey: string;
  specializationKey: string;
  experience: string;
  rating: number;
  avatar: string;
}

export const mockTeachers: Teacher[] = [
  {
    id: "t1",
    nameKey: "ahmed",
    specializationKey: "ahmedSpecialty",
    experience: "12",
    rating: 4.8,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "t2",
    nameKey: "sarah",
    specializationKey: "sarahSpecialty",
    experience: "8",
    rating: 4.9,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80",
  },
  {
    id: "t3",
    nameKey: "mohammed",
    specializationKey: "mohammedSpecialty",
    experience: "15",
    rating: 4.8,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80",
  },
];
