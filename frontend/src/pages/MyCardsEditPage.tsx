import { FC, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CardForm } from "@/components/CardForm";
import { cardService } from "@/services/cardService";
import { CardData } from "@/types/card";
import { setLocalStorageWithEvent } from "@/hooks/useLocalStorage";

const MyCardsEditPage: FC = () => {
  const navigate = useNavigate();
  const { cardId } = useParams();
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (cardId) {
      loadCardData(cardId);
    } else {
      setLoading(false);
    }
  }, [cardId]);

  const loadCardData = async (id: string) => {
    try {
      setLoading(true);
      const userCards = await cardService.getUserCards();
      const foundCard = userCards.find(card => card.id === id);
      
      if (foundCard) {
        setCardData(foundCard);
      } else {
        setError("Карточка не найдена");
      }
    } catch (err) {
      console.error('Ошибка загрузки карточки:', err);
      setError(err instanceof Error ? err.message : "Ошибка загрузки карточки");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    setError("");
    
    // Валидация обязательных полей
    if (!data.workType || data.workType.trim() === "") {
      setError("Пожалуйста, выберите тип работы");
      return;
    }

    if (!data.subject || data.subject.trim() === "") {
      setError("Пожалуйста, укажите предмет");
      return;
    }

    if (!data.title || data.title.trim() === "") {
      setError("Пожалуйста, укажите название работы");
      return;
    }

    try {
      if (cardId) {
        const backendData = {
          workType: data.workType.trim(),
          subject: data.subject.trim(),
          title: data.title.trim(),
          description: data.description || "",
          university: data.university || "",
          course: data.course,
          city: data.city || "",
          files: data.files || []
        };

        await cardService.updateCard(cardId, backendData);
        
        setLocalStorageWithEvent(`card_color_${cardId}`, data.color);
        setLocalStorageWithEvent(`card_shadow_${cardId}`, data.shadow);
        
        navigate("/my-cards", { state: { refreshCards: true } });
      }
    } catch (err) {
      console.error('Ошибка обновления карточки:', err);
      setError(err instanceof Error ? err.message : "Ошибка при обновлении карточки");
    }
  };

  const handleCancel = () => {
    navigate("/my-cards");
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-76px)] flex flex-col justify-center items-center">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  if (!cardData) {
    return (
      <div className="h-[calc(100vh-76px)] flex flex-col justify-center items-center">
        <div className="text-lg text-red-600">{error || "Карточка не найдена"}</div>
        <button
          onClick={() => navigate("/my-cards")}
          className="mt-4 px-6 py-2 bg-[#FF684D] text-white rounded-lg hover:bg-[#E55A40] transition-colors"
        >
          Вернуться к моим карточкам
        </button>
      </div>
    );
  }

  const handleDelete = async () => {
    if (!cardId) return;
    
    const confirmed = window.confirm("Вы уверены, что хотите удалить эту карточку?");
    if (!confirmed) return;
    
    try {
      setDeleting(true);
      await cardService.deleteCard(cardId);
      
      localStorage.removeItem(`card_color_${cardId}`);
      localStorage.removeItem(`card_shadow_${cardId}`);
      
      navigate("/my-cards", { state: { refreshCards: true } });
    } catch (err) {
      console.error('Ошибка удаления карточки:', err);
      setError(err instanceof Error ? err.message : "Ошибка при удалении карточки");
      setDeleting(false);
    }
  };

  const getFileNames = () => {
    if (!cardData.original || cardData.original.length === 0) {
      return [];
    }
    
    return cardData.original.filter(fileName => {
      const cleanName = fileName.split('/').pop() || fileName;
      return !cleanName.includes('__NO_FILES__') && 
             !cleanName.includes('empty') && 
             cleanName.trim() !== '';
    });
  };

  const initialData = {
    cardId: cardData.id,
    title: cardData.title,
    subject: cardData.subject,
    workType: cardData.type,
    description: cardData.description,
    university: cardData.study,
    course: cardData.course.toString(),
    city: cardData.city,
    existingFiles: getFileNames()
  };

  return (
    <>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 mx-6 mt-4">
          {error}
        </div>
      )}
      <CardForm
        initialData={initialData}
        cardId={cardId}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={true}
        onDelete={handleDelete}
        deleting={deleting}
      />
    </>
  );
};

export default MyCardsEditPage;