export const userService = {
  getUserById: async (
    authorId: string
  ): Promise<{
    additionalProp1: string;
    additionalProp2: string;
    additionalProp3: string;
  } | null> => {
    try {
      const response = await fetch(
        `/api/users/${authorId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        let errorMessage = "ошибка получения профиля";

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          errorMessage += ` (HTTP error ${response.status})`;
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();

      return data.socialLinks;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(
          `Не удалось получить профиль пользователя: ${error.message}`
        );
      }

      throw new Error(
        "Произошла неизвестная ошибка при получении профиля пользователя"
      );
    }
  },
};
