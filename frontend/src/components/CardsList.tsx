import { FC, useState, useEffect } from "react";
import { Card } from "@/components/Card";
import { ModalCard } from "@/components/ModalCard";
import { cardService } from "@/services/cardService";
import { CardData } from "@/types/card";
import { likeService } from "@/services/likeService";

interface Props {
  modalCardId: string | null;
  setModalCardId: (id: string | null) => void;
  refreshKey?: number;
  typeFilter?: string | undefined;
  cityFilter?: string | undefined;
  studyFilter?: string | undefined;
  courseFilter?: number | undefined;
}

export const CardsList: FC<Props> = ({
  modalCardId,
  setModalCardId,
  refreshKey = 0,
  typeFilter,
  cityFilter,
  studyFilter,
  courseFilter,
}: Props) => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [currentCard, setCurrentCard] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCards = async () => {
    try {
      setLoading(true);
      const cardsData = await cardService.getAllCards(
        typeFilter,
        cityFilter,
        studyFilter,
        courseFilter
      );
      setCards(cardsData);
    } catch (err) {
      console.error("Ошибка загрузки карточек:", err);
      setError(err instanceof Error ? err.message : "Ошибка загрузки карточек");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, [refreshKey, typeFilter, cityFilter, studyFilter, courseFilter]);

  useEffect(() => {
    if (modalCardId) {
      const foundCard = cards.find((card) => card.id === modalCardId);
      setCurrentCard(foundCard || null);
    }
  }, [modalCardId, cards]);

  const refreshCurrentCard = async () => {
    if (!modalCardId) return;

    try {
      const allCards = await cardService.getAllCards(
        typeFilter,
        cityFilter,
        studyFilter,
        courseFilter
      );
      const updatedCard = allCards.find((card) => card.id === modalCardId);
      if (updatedCard) {
        setCurrentCard(updatedCard);
        setCards((prev) =>
          prev.map((card) => (card.id === modalCardId ? updatedCard : card))
        );
      }
    } catch (err) {
      console.error("Ошибка обновления карточки:", err);
    }
  };
  const handleLike = async () => {
    if (!modalCardId) return;

    try {
      await likeService.likeCard(modalCardId);
      await refreshCurrentCard();
      setModalCardId(null);
    } catch (err) {
      console.error("Ошибка лайка:", err);
      alert("Не удалось лайкнуть карточку");
    }
  };
  const handleUnlike = async () => {
    if (!modalCardId) return;

    try {
      await likeService.dislikeCard(modalCardId);
      await refreshCurrentCard();
      setModalCardId(null);
    } catch (err) {
      console.error("Ошибка дизлайка:", err);
      alert("Не удалось убрать лайк");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Загрузка карточек...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!cards.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Карточки не найдены</div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-wrap justify-center bg-[#FFFFF5] py-3 pl-[6px] gap-16 overflow-y-auto [scrollbar-gutter:stable] custom-scrollbar">
      {cards.map((card) => (
        <Card
          key={card.id}
          cardData={card}
          onClick={() => setModalCardId(card.id)}
        />
      ))}
    </div>
  );
};
