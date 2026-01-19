import { RegisterResponse } from "@/types/auth";
import { ChangePasswordDto, UserUpdateRequest } from "@/types/settings";
import { User } from "@/types/user";

const API_BASE_URL = "/api/settings";

export const settingsService = {
  changePassword: async (passwordData: ChangePasswordDto): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE_URL}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(passwordData),
      });

      if (!response.ok) {
        let errorMessage = "ошибка изменения пароля";

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage += ` (HTTP error ${response.status})`;
        }

        throw new Error(errorMessage);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Не удалось изменить пароль: ${error.message}`);
      }

      throw new Error("Произошла неизвестная ошибка при изменении пароля");
    }
  },
  changeProfile: async (
    userUpdateData: UserUpdateRequest
  ): Promise<RegisterResponse> => {
    try {
      const response = await fetch(
        `/api/users/${localStorage.getItem("authorId")}`, // метод из profile-controller возвращает json с рекурсией
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(userUpdateData),
        }
      );

      if (!response.ok) {
        let errorMessage = "ошибка редактирования профиля";

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage += ` (HTTP error ${response.status})`;
        }

        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Не удалось редактировать профиль: ${error.message}`);
      }

      throw new Error(
        "Произошла неизвестная ошибка при редактировании профиля"
      );
    }
  },
};
