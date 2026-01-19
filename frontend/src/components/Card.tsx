import { FC } from "react";
import { CardData } from "@/types/card";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface CardProps {
  onClick?: () => void;
  cardData: CardData;
}

export const Card: FC<CardProps> = ({ cardData, onClick }) => {

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Ошибка форматирования даты:', error);
      return dateString; 
    }
  };

  const borderColor = useLocalStorage(`card_color_${cardData.id}`, "#FFB4A7");
  const rawShadow = useLocalStorage(`card_shadow_${cardData.id}`, "0_0_20px_rgba(255,180,167,0.3)");

  return (
    <div
      onClick={onClick}
      style={{
        borderColor: borderColor || "#FFB4A7",
        boxShadow: rawShadow ? rawShadow.replace(/_/g, " ") :
          "0 0 20px rgba(255,180,167,0.3)"
      }}
      className="h-96 w-72 bg-[#FFFFF5] border-2 p-6 rounded-xl flex flex-col cursor-pointer
        transition-all hover:scale-[1.02] hover:-translate-y-1"
    >
      <h2 className="text-xl font-bold text-black text-center">
        {cardData.title}
      </h2>

      <p className="text-lg text-gray-700 mt-2 text-center">{cardData.subject}</p>
      <p className="text-lg text-gray-700 text-center">{cardData.type}</p>

      <div className="max-h-[150px] mt-4 rounded-md flex-grow overflow-y-auto custom-scrollbar">
        <p className="text-base font-light px-2 mt-2 text-gray-700">
          {cardData.description}
        </p>
      </div>

      <div className="mt-auto text-right">
        <p className="text-base text-gray-900 font-light">{cardData.study}</p>
        <p className="text-base text-gray-900 font-light">{cardData.course} курс</p>
        <p className="text-base text-gray-900 font-light">{formatDate(cardData.createdAt)}</p>
      </div>
    </div>
  );
};