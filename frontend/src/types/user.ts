import { CardData } from "./card";

// unfinished
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  socialLinks: Record<string, string> | null;
  photoUrl: string | null;
  description: string | null;
  study: string;
  city: string;
  createdAt: string;
  cards: CardData[];
}
