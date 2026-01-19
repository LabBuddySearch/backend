import {
  AuthRequest,
  AuthResponse,
  RegisterResponse,
  UserRegisterDto,
} from "@/types/auth";

const API_BASE_URL = "/api/users";
const API_BASE_URL_AUTH = "/api/auth";

export const authService = {
  async login(credentials: AuthRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error("Ошибка авторизации");
    }

    const tokenResponse = await fetch(`${API_BASE_URL_AUTH}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const token = (await tokenResponse.json()).token;

    const authResponse = await response.json();

    localStorage.setItem("user", JSON.stringify(authResponse));
    localStorage.setItem("authorId", authResponse.id);
    localStorage.setItem("token", token);

    return authResponse;
  },

  async register(userData: UserRegisterDto): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Ошибка регистрации");
    }

    const tokenResponse = await fetch(`${API_BASE_URL_AUTH}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
      }),
    });

    const token = (await tokenResponse.json()).token;

    localStorage.setItem("token", token);

    return response.json();
  },

  async logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("authorId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userStudy");
    localStorage.removeItem("userCity");
    localStorage.removeItem("userCourse");
    localStorage.removeItem("token");
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  },
};
