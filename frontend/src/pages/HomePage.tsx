import { FC, useEffect, useState, useCallback } from "react";

import { CardsList } from "@/components/CardsList";
import { MenuDropdown } from "@/components/MenuDropdown";
import { MinicardsList } from "@/components/MinicardsList";
import { ModalCard } from "@/components/ModalCard";
import { cardService } from "@/services/cardService";
import { CardData } from "@/types/card";
import { likeService } from "@/services/likeService";
import { universities } from "@/hooks/universities";
import { cities } from "@/hooks/cities";
import { courses } from "@/hooks/courses";
import { workTypes } from "@/hooks/workTypes";

const HomePage: FC = () => {
  const [modalCardId, setModalCardId] = useState<string | null>(null);
  const [currentCard, setCurrentCard] = useState<CardData | null>(null);
  const [isFromMiniList, setIsFromMiniList] = useState(false);
  const [allCards, setAllCards] = useState<CardData[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [cityFilter, setCityFilter] = useState<string | undefined>(undefined);
  const [studyFilter, setStudyFilter] = useState<string | undefined>(undefined);
  const [courseFilter, setCourseFilter] = useState<number | undefined>(
    undefined
  );

  const loadAllCards = useCallback(async () => {
    try {
      const cards = await cardService.getAllCards(
        typeFilter,
        cityFilter,
        studyFilter,
        courseFilter
      );
      setAllCards(cards);
    } catch (error) {
      console.error("Ошибка загрузки карточек:", error);
    }
  }, [typeFilter, cityFilter, studyFilter, courseFilter]);

  useEffect(() => {
    loadAllCards();
  }, [loadAllCards, refreshKey]);

  useEffect(() => {
    if (modalCardId) {
      const foundCard = allCards.find((card) => card.id === modalCardId);
      setCurrentCard(foundCard || null);
    }
  }, [modalCardId, allCards]);
  const refreshAllCards = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const handleLike = async () => {
    if (!modalCardId) return;

    try {
      console.log("Добавить в лайкнутые:", modalCardId);
      await likeService.likeCard(modalCardId);
      refreshAllCards();
      const updatedCards = await cardService.getAllCards(
        typeFilter,
        cityFilter,
        studyFilter,
        courseFilter
      );
      const updatedCard = updatedCards.find((card) => card.id === modalCardId);
      setCurrentCard(updatedCard || null);

      setModalCardId(null);
    } catch (error) {
      console.error("Ошибка при лайке:", error);
      alert("Не удалось лайкнуть карточку");
    }
  };

  const handleUnlike = async () => {
    if (!modalCardId) return;

    try {
      console.log("Удалить из лайкнутых:", modalCardId);
      await likeService.dislikeCard(modalCardId);

      refreshAllCards();
      if (isFromMiniList) {
        setModalCardId(null);
        setCurrentCard(null);
      } else {
        const updatedCards = await cardService.getAllCards(
          typeFilter,
          cityFilter,
          studyFilter,
          courseFilter
        );
        const updatedCard = updatedCards.find(
          (card) => card.id === modalCardId
        );
        setCurrentCard(updatedCard || null);
      }
    } catch (error) {
      console.error("Ошибка при удалении лайка:", error);
      alert("Не удалось убрать лайк");
    }
  };

  const handleCloseModal = () => {
    setModalCardId(null);
    setCurrentCard(null);
  };

  return (
    <div className="min-h-screen flex bg-[#FFFFF5]">
      <aside
        className={`w-[174.8px] sm:w-[348.8px] flex-shrink-0 border-r border-gray-200`}
      >
        <MenuDropdown />
        <MinicardsList
          modalCardId={modalCardId}
          setModalCardId={(id) => {
            setModalCardId(id);
            setIsFromMiniList(true);
          }}
          refreshKey={refreshKey}
        />
      </aside>
      <main className="flex-1 grid grid-rows-[auto_1fr] h-[100vh]">
        <header className="p-4 flex flex-wrap gap-4 justify-center border-b border-gray-200">
          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value === "" ? undefined : e.target.value)
            }
            className="text-sm p-3 border border-gray-300 rounded-lg bg-white focus:border-[#FF684D] focus:outline-none"
          >
            <option value="">Выберите тип работы</option>
            {workTypes.map((workType) => (
              <option key={workType} value={workType}>
                {workType}
              </option>
            ))}
          </select>
          <select
            value={cityFilter}
            onChange={(e) =>
              setCityFilter(e.target.value === "" ? undefined : e.target.value)
            }
            className="text-sm p-3 border border-gray-300 rounded-lg bg-white focus:border-[#FF684D] focus:outline-none"
          >
            <option value="">Выберите город</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <select
            value={studyFilter}
            onChange={(e) =>
              setStudyFilter(e.target.value === "" ? undefined : e.target.value)
            }
            className="text-sm p-3 border border-gray-300 rounded-lg bg-white focus:border-[#FF684D] focus:outline-none"
          >
            <option value="">Выберите учебное заведение</option>
            {universities.map((university) => (
              <option key={university} value={university}>
                {university}
              </option>
            ))}
          </select>
          <select
            value={courseFilter}
            onChange={(e) =>
              setCourseFilter(
                e.target.value === "" ? undefined : Number(e.target.value)
              )
            }
            className="text-sm p-3 border border-gray-300 rounded-lg bg-white focus:border-[#FF684D] focus:outline-none"
          >
            <option value="">Выберите курс</option>
            {courses.map((course) => (
              <option key={course} value={course[0]}>
                {course}
              </option>
            ))}
          </select>
        </header>
        <CardsList
          modalCardId={modalCardId}
          setModalCardId={(id) => {
            setModalCardId(id);
            setIsFromMiniList(false);
          }}
          refreshKey={refreshKey}
          typeFilter={typeFilter}
          cityFilter={cityFilter}
          studyFilter={studyFilter}
          courseFilter={courseFilter}
        />
      </main>

      {modalCardId && currentCard && (
        <ModalCard
          cardData={currentCard}
          onClose={handleCloseModal}
          isFromMiniList={isFromMiniList}
          onLike={handleLike}
          onUnlike={handleUnlike}
          onLikeToggle={refreshAllCards}
        />
      )}
    </div>
  );
};

export default HomePage;
