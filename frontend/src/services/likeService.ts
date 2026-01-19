import { Like } from "@/types/card";

const API_BASE_URL = "/api/like";

export const likeService = {
  async likeCard(cardId: string): Promise<number> {
    const authorId = localStorage.getItem("authorId");

    if (!authorId) {
      throw new Error("Не авторизован — войдите заново");
    }

    const payload: Like = {
      userId: authorId,
      cardId,
    };

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Ошибка:", response.status, errorText);
      throw new Error(`Ошибка лайка карточки: ${response.status}`);
    }

    return response.status;
  },

  async dislikeCard(cardId: string): Promise<number> {
    const authorId = localStorage.getItem("authorId");

    if (!authorId) {
      throw new Error("Не авторизован — войдите заново");
    }

    const payload: Like = {
      userId: authorId,
      cardId,
    };

    const response = await fetch(API_BASE_URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Ошибка:", response.status, errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(`Ошибка дизлайка карточки: ${response.status} - ${errorData.message || errorText}`);
      } catch {
        throw new Error(`Ошибка дизлайка карточки: ${response.status} - ${errorText}`);
      }
    }

    return response.status;
  },
};
