import { FC } from "react";
import { CardData } from "@/types/card";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface Props {
  cardData: CardData;
  isSelected: boolean;
  onClick: () => void;
}

export const CardMini: FC<Props> = ({ cardData, isSelected, onClick }) => {
  const borderColor = useLocalStorage(`card_color_${cardData.id}`, "#FFB4A7");
  const rawShadow = useLocalStorage(
    `card_shadow_${cardData.id}`,
    "0_0_20px_rgba(255,180,167,0.3)"
  );

  const shadowValue = rawShadow
    ? rawShadow.replace(/_/g, " ")
    : "0 0 20px rgba(255,180,167,0.3)";

  return (
    <div
      onClick={onClick}
      style={{
        borderColor: borderColor || "#FFB4A7",
        outline: isSelected ? "2px solid black" : "none",
        outlineOffset: "2px",
        boxShadow: shadowValue,
      }}
      className="h-48 w-36 bg-[#FFFFF5] border p-3 rounded-xl flex flex-col cursor-pointer"
    >
      <h2 className="text-base font-bold text-black text-center leading-tight">
        {cardData.title}
      </h2>

      <div className="mt-auto text-center">
        <p className="text-sm text-gray-600">{cardData.study}</p>
        <p className="text-sm text-gray-600">{cardData.subject}</p>
        <p className="text-sm text-gray-600">{cardData.type}</p>
      </div>
    </div>
  );
};
