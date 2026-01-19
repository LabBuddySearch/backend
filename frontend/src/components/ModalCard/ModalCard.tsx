import { FC, useEffect, useState } from "react";
import { CardData } from "@/types/card";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { likeService } from "@/services/likeService";
import { userService } from "@/services/userService";

interface Props {
  onClose: () => void;
  cardData: CardData;
  isFromMiniList?: boolean;
  onLike?: () => void;
  onUnlike?: () => void;
  onLikeToggle?: () => void;
}

export const ModalCard: FC<Props> = ({
  cardData,
  onClose,
  isFromMiniList = false,
  onLike,
  onUnlike,
  onLikeToggle,
}: Props) => {
  const handleClose = () => {
    onClose();
  };

  const [socialLinks, setSocialLinks] = useState<{
    additionalProp1: string;
    additionalProp2: string;
    additionalProp3: string;
  } | null>(null);

  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const socialLinks = await userService.getUserById(cardData.authorId);

        setSocialLinks(socialLinks);
      } catch (error) {
        console.error(error);
      }
    };

    fetchSocialLinks();
  }, []);

  const borderColor = useLocalStorage(`card_color_${cardData.id}`, "#FF684D");
  const rawShadow = useLocalStorage(
    `card_shadow_${cardData.id}`,
    "0_0_20px_rgba(255,104,77,0.7)"
  );

  const handleLikeAction = async () => {
    try {
      if (isFromMiniList) {
        await likeService.dislikeCard(cardData.id);
        if (onUnlike) onUnlike();
      } else {
        await likeService.likeCard(cardData.id);
        if (onLike) onLike();
      }

      if (onLikeToggle) {
        onLikeToggle();
      }

      onClose();
    } catch (err) {
      console.error("Ошибка при лайке/дизлайке:", err);
      alert("Не удалось выполнить действие. Попробуйте снова.");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      console.error("Ошибка форматирования даты:", error);
      return dateString;
    }
  };

  const files = cardData.original || cardData.storage || cardData.files || [];

  const shadowStyle = rawShadow
    ? { boxShadow: rawShadow.replace(/_/g, " ") }
    : { boxShadow: "0 0 20px rgba(255,104,77,0.7)" };

  return (
    <div
      className="fixed min-w-[400px] bottom-12 right-12 h-[calc(100%-96px)] w-[calc(100%-96px)] bg-[#FFFFF5] border rounded-3xl overflow-hidden p-4"
      style={{
        borderColor: borderColor || "#FF684D",
        ...shadowStyle,
      }}
    >
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-[#FFFFF5] border border-[#FF684D] rounded-full hover:bg-[#FFF0ED] transition-colors duration-200 z-10"
        aria-label="Закрыть модальное окно"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1L13 13M13 1L1 13"
            stroke="#FF684D"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div className="h-full w-full flex flex-col">
        <div className="border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-2xl font-bold text-black text-center">
            {cardData.title}
          </h2>
          <div className="flex justify-center gap-4 mt-2">
            <p className="text-lg text-gray-700">{cardData.subject}</p>
            <p className="text-lg text-gray-700">{cardData.type}</p>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
          <div className="col-span-1 flex flex-col min-h-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Описание
            </h3>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 min-h-0">
              <p className="text-xl font-light text-gray-700">
                {cardData.description}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Файлы
              </h3>
              <div className="bg-gray-100 rounded-lg p-3">
                {(() => {
                  const filteredFiles = files.filter((file) => {
                    const fileName = file.split("/").pop() || file;
                    return (
                      !fileName.includes("__NO_FILES__") &&
                      !fileName.includes("empty") &&
                      fileName.trim() !== ""
                    );
                  });

                  return filteredFiles.length > 0 ? (
                    <ul className="text-sm text-gray-600 space-y-1">
                      {filteredFiles.map((file, index) => {
                        const storageFileName =
                          cardData.storage?.[index] || file;
                        const originalFileName =
                          cardData.original?.[index] || file;
                        const displayName =
                          originalFileName.split("/").pop() || originalFileName;
                        const cleanDisplayName =
                          displayName.split("?")[0] || `file_${index + 1}`;

                        const downloadPath = (
                          storageFileName.split("/").pop() || storageFileName
                        ).trim();

                        if (
                          cleanDisplayName.includes("__NO_FILES__") ||
                          cleanDisplayName.includes("empty") ||
                          cleanDisplayName.trim() === ""
                        ) {
                          return null;
                        }

                        return (
                          <li key={index} className="truncate group">
                            <button
                              onClick={async () => {
                                try {
                                  const downloadUrl = `/api/cards/download/${encodeURIComponent(
                                    downloadPath
                                  )}`;

                                  const response = await fetch(downloadUrl);

                                  if (response.ok) {
                                    const blob = await response.blob();
                                    const url =
                                      window.URL.createObjectURL(blob);
                                    const a = document.createElement("a");
                                    a.href = url;
                                    a.download = cleanDisplayName;
                                    document.body.appendChild(a);
                                    a.click();
                                    document.body.removeChild(a);
                                    window.URL.revokeObjectURL(url);
                                  } else {
                                    console.error("Ошибка скачивания файла:", response.status, response.statusText);
                                    // Показываем ошибку в консоли, но не блокируем пользователя alert
                                  }
                                } catch (error) {
                                  console.error("Ошибка скачивания файла:", error);
                                  // Ошибка логируется, но не показывается через alert
                                }
                              }}
                              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors inline-flex items-center cursor-pointer bg-transparent border-none p-0 text-left"
                              title={`Скачать ${cleanDisplayName}`}
                            >
                              {cleanDisplayName}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                />
                              </svg>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-600 text-center">
                      Нет файлов
                    </p>
                  );
                })()}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Способы связи
              </h3>
              <div className="bg-gray-100 rounded-lg p-3">
                {socialLinks ? (
                  <>
                    {Boolean(socialLinks?.additionalProp1) && (
                      <p className="text-sm text-gray-600 text-center">
                        {socialLinks.additionalProp1}
                      </p>
                    )}
                    {Boolean(socialLinks?.additionalProp2) && (
                      <p className="text-sm text-gray-600 text-center">
                        {socialLinks.additionalProp2}
                      </p>
                    )}
                    {Boolean(socialLinks?.additionalProp3) && (
                      <p className="text-sm text-gray-600 text-center">
                        {socialLinks.additionalProp3}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-600 text-center">
                    Нет контактов для связи
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Автор
                </h3>
                <div className="bg-gray-100 rounded-lg p-2">
                  <p className="text-sm text-gray-600 text-start">
                    {cardData.authorName || "Неизвестный автор"}
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Опубликовано
                </h3>
                <p className="text-base text-gray-900 font-light">
                  {formatDate(cardData.createdAt)}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleLikeAction}
                className={`w-full py-3 rounded-lg transition-colors ${
                  isFromMiniList
                    ? "bg-gray-500 text-white hover:bg-gray-600"
                    : "bg-[#FF684D] text-white hover:bg-[#E55A40]"
                }`}
              >
                {isFromMiniList ? "Убрать из лайкнутых" : "Лайкнуть"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
