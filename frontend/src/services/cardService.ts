import { CreateCardRequest, CardResponse, CardData } from "@/types/card";

const API_BASE_URL = "/api/cards";

export const cardService = {
  async createCard(cardData: CreateCardRequest): Promise<CardResponse> {
    const authorId = localStorage.getItem("authorId");

    if (!authorId) {
      throw new Error("Не авторизован — войдите заново");
    }

    const formData = new FormData();

    formData.append("authorId", authorId);
    formData.append("type", cardData.type);
    formData.append("subject", cardData.subject);
    formData.append("title", cardData.title);
    formData.append("course", cardData.course.toString());
    formData.append("description", cardData.description || "");
    formData.append("study", cardData.study || "");
    formData.append("city", cardData.city || "");

    if (cardData.files && cardData.files.length > 0) {
      cardData.files.forEach((file: any) => {
        if (file instanceof File) {
          formData.append("files", file);
        }
      });
    } else {
      const emptyFile = new File([""], "__NO_FILES__", { type: "text/plain" });
      formData.append("files", emptyFile);
    }

    const url = `${API_BASE_URL}/user`;

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Ошибка создания карточки: ${response.status} - ${errorText}`
      );
    }

    return response.json();
  },

  async getAllCards(
    type: string | undefined,
    city: string | undefined,
    study: string | undefined,
    course: number | undefined
  ): Promise<CardData[]> {
    let url = API_BASE_URL;
    if (type || city || study || course) url += "/filter?";

    const params = new URLSearchParams();
    if (type) params.append("type", type);
    if (city) params.append("city", city);
    if (study) params.append("study", study);
    if (course) params.append("course", String(course));

    url += params.toString();

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка загрузки карточек: ${response.status}`);
    }

    return response.json();
  },

  async getUserCards(): Promise<CardData[]> {
    const authorId = localStorage.getItem("authorId");

    if (!authorId) {
      throw new Error("Пользователь не авторизован");
    }

    const response = await fetch(`${API_BASE_URL}/user/${authorId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Ошибка загрузки пользовательских карточек: ${response.status}`
      );
    }

    return response.json();
  },

  async updateCard(cardId: string, cardData: any): Promise<CardData> {
    const authorId = localStorage.getItem("authorId");

    if (!authorId) {
      throw new Error("Пользователь не авторизован");
    }

    const formData = new FormData();
    formData.append("id", cardId);

    if (cardData.type) formData.append("type", cardData.type);
    if (cardData.subject) formData.append("subject", cardData.subject);
    if (cardData.title) formData.append("title", cardData.title);
    if (cardData.description)
      formData.append("description", cardData.description);
    if (cardData.study) formData.append("study", cardData.study);
    if (cardData.city) formData.append("city", cardData.city);
    if (cardData.course) formData.append("course", cardData.course.toString());

    if (cardData.files && cardData.files.length > 0) {
      cardData.files.forEach((file: any) => {
        if (file instanceof File) {
          formData.append("files", file);
        }
      });
    }

    console.log("Отправка данных для обновления через FormData");

    const response = await fetch(`${API_BASE_URL}/user`, {
      method: "PATCH",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Ошибка обновления:", response.status, errorText);
      throw new Error(`Ошибка обновления карточки: ${response.status}`);
    }

    return response.json();
  },

  async deleteCard(cardId: string): Promise<void> {
    const authorId = localStorage.getItem("authorId");

    if (!authorId) {
      throw new Error("Пользователь не авторизован");
    }

    const response = await fetch(`${API_BASE_URL}/user/${cardId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Ошибка удаления:", response.status, errorText);
      throw new Error(`Ошибка удаления карточки: ${response.status}`);
    }
  },

  async getLikedCards(): Promise<CardData[]> {
    const userId = localStorage.getItem("authorId");

    if (!userId) {
      throw new Error("Пользователь не авторизован");
    }

    const response = await fetch(`${API_BASE_URL}/user/${userId}/liked`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка загрузки лайкнутых карточек: ${response.status}`);
    }

    return response.json();
  },
};
