export interface CardData {
  id: string;
  title: string;
  subject: string;
  type: string;
  description: string;
  study: string;
  city: string;
  course: number;
  createdAt: string;
  authorId: string;
  authorName: string;
  status?: string;
  currentHelpers?: number;
  contact?: string;
  files?: string[];
  original?: string[];
  storage?: string[];
}

export interface CreateCardRequest {
  type: string;
  subject: string;
  title: string;
  description: string;
  study: string;
  city: string;
  course: number;
  contact?: string;
  files?: string[];
  original?: string[];
  storage?: string[];
}

export interface CardResponse {
  id: string;
  authorId: string;
  type: string;
  subject: string;
  title: string;
  course: number;
  description: string;
  study: string;
  city: string;
  createdAt: string;
}

export interface Like {
  userId: string;
  cardId: string;
}
