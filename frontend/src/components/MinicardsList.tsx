import { FC, useState, useEffect } from "react";
import {
  generatePath,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

import { CardMini } from "@/components/CardMini";
import { StarIcon } from "@/components/icons";
import { PATHS } from "@/router/paths";
import { cardService } from "@/services/cardService";
import { CardData } from "@/types/card";

interface Props {
  isMyCardsPage?: boolean;
  modalCardId?: string | null;
  setModalCardId?: (arg: string | null) => void;
  refreshKey?: number;
}

export const MinicardsList: FC<Props> = ({
  isMyCardsPage = false,
  modalCardId,
  setModalCardId,
  refreshKey = 0,
}: Props) => {
  const navigate = useNavigate();
  const { cardId } = useParams();
  const location = useLocation();
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCards = async () => {
    try {
      setLoading(true);
      setError("");

      if (isMyCardsPage) {
        const userCards = await cardService.getUserCards();
        setCards(userCards);
      } else {
        const likedCards = await cardService.getLikedCards();
        setCards(likedCards);
      }
    } catch (err) {
      console.error("Ошибка загрузки карточек:", err);
      setError(err instanceof Error ? err.message : "Ошибка загрузки карточек");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, [isMyCardsPage, refreshKey]);

  useEffect(() => {
    if (location.state?.refreshCards) {
      loadCards();
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state?.refreshCards]);

  const onCardClick = (cardId: string) => {
    isMyCardsPage
      ? navigate(generatePath(PATHS.MY_CARDS_EDIT, { cardId }))
      : setModalCardId && setModalCardId(cardId);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-lg">Загрузка...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="text-red-600 text-center">{error}</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-row justify-center items-center gap-1 py-3">
        <p className="text-base">
          {isMyCardsPage ? "Мои карточки" : "Мои лайки"}
        </p>
        <StarIcon />
      </div>
      <div className="border-t border-gray-200 mx-4" />
      <div className="flex flex-wrap justify-center bg-[#FFFFF5] py-4 pl-[12px] pr-[6px] gap-8 max-h-[calc(100vh-124.8px)] overflow-y-auto [scrollbar-gutter:stable] custom-scrollbar">
        {cards.map((card) => (
          <CardMini
            key={card.id}
            cardData={card}
            isSelected={card.id === cardId || card.id === modalCardId}
            onClick={() => onCardClick(card.id)}
          />
        ))}
        {cards.length === 0 && (
          <div className="text-gray-500 text-center py-8">
            {isMyCardsPage
              ? "У вас пока нет карточек"
              : "У вас пока нет лайков"}
          </div>
        )}
      </div>
    </div>
  );
};
