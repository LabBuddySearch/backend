import { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CardForm } from "@/components/CardForm";
import { cardService } from "@/services/cardService";
import { setLocalStorageWithEvent } from "@/hooks/useLocalStorage";
import { PATHS } from "@/router/paths";

const MyCardsCreatePage: FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState({
    university: "",
    city: "",
    course: "",
  });

  // Не понял, зачем здесь стейт для трёх полей, и в эффекте их дополнение данными из локалстораджа
  useEffect(() => {
    const loadUserData = () => {
      const userCity = localStorage.getItem("userCity");
      const userStudy = localStorage.getItem("userStudy");

      let userCourse = "1";
      const userFromStorage = localStorage.getItem("user");
      if (userFromStorage) {
        try {
          const parsedUser = JSON.parse(userFromStorage);
          if (parsedUser.course) {
            const courseMatch = parsedUser.course.match(/\d+/);
            userCourse = courseMatch ? courseMatch[0] : "1";
          }
        } catch (error) {
          console.error("Ошибка парсинга user данных:", error);
        }
      }

      setUserData({
        university: userStudy || "",
        city: userCity || "",
        course: userCourse,
      });
    };

    loadUserData();
  }, []);

  const handleSubmit = async (data: any) => {
    setLoading(true);
    setError("");

    try {
      const authorId = localStorage.getItem("authorId");

      if (!authorId) {
        throw new Error("Не авторизован — войдите заново");
      }

      // Валидация обязательных полей
      if (!data.workType || data.workType.trim() === "") {
        setError("Пожалуйста, выберите тип работы");
        setLoading(false);
        return;
      }

      if (!data.subject || data.subject.trim() === "") {
        setError("Пожалуйста, укажите предмет");
        setLoading(false);
        return;
      }

      if (!data.title || data.title.trim() === "") {
        setError("Пожалуйста, укажите название работы");
        setLoading(false);
        return;
      }

      const courseNumber = parseInt(data.course) || 1;

      const cardData = {
        authorId: authorId,
        type: data.workType.trim(),
        subject: data.subject.trim(),
        title: data.title.trim(),
        course: courseNumber,
        description: data.description || "",
        study: data.university || userData.university || "",
        city: data.city || userData.city || "",
        files: data.files || [],
      };

      console.log("Отправка данных карточки:", cardData);

      const response = await cardService.createCard(cardData);

      setLocalStorageWithEvent(`card_color_${response.id}`, data.color);
      setLocalStorageWithEvent(`card_shadow_${response.id}`, data.shadow);

      navigate(PATHS.MY_CARDS, { state: { refreshCards: true } });
    } catch (err) {
      console.error("Ошибка создания карточки:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Произошла ошибка при создании карточки"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(PATHS.MY_CARDS);
  };

  // Временно так
  const userCity =
    localStorage.getItem("userCity") ||
    JSON.parse(localStorage.getItem("user") || "").city ||
    "";
  const userStudy =
    localStorage.getItem("userStudy") ||
    JSON.parse(localStorage.getItem("user") || "").study ||
    "";

  let userCourse = "1";
  const courseFromStorage = localStorage.getItem("userCourse");
  if (courseFromStorage) {
    userCourse = courseFromStorage[0] || "1";
  }

  const initialData = {
    university: userStudy || userData.university,
    city: userCity || userData.city,
    course: userCourse || userData.course,
  };

  return (
    <>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mx-6 mt-4">
          {error}
          <div className="mt-2">
            <button
              onClick={() => navigate("/login")}
              className="text-sm underline hover:no-underline"
            >
              Войти заново
            </button>
          </div>
        </div>
      )}
      <CardForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={false}
        loading={loading}
        initialData={initialData}
      />
    </>
  );
};

export default MyCardsCreatePage;
