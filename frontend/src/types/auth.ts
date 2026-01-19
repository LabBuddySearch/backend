export interface AuthRequest {
  email: string;
  password: string;
}

export interface UserRegisterDto {
  email: string;
  password: string;
  name: string;
  city: string;
  study: string;
}

export interface AuthResponse {
  id: string;
  name: string;
  email: string;
  city: string;
  study: string;
  description: string | null;
  photoUrl: string | null;
  socialLinks: Record<string, string> | null;
  createdAt: string;
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
  city: string;
  study: string;
  description: string | null;
  photoUrl: string | null;
  socialLinks: Record<string, string> | null;
  createdAt: string;
}