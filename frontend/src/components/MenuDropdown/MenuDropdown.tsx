import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { PATHS } from "@/router/paths";
import { MenuElement } from "./MenuElement";

export interface MenuElementProps {
  label: string;
  onClick: () => void;
}

export const MenuDropdown = () => {
  const authorName = localStorage.getItem("userName");

  const [menuIsDropped, setMenuIsDropped] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleMousedown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuIsDropped(false);
      }
    };

    document.addEventListener("mousedown", handleMousedown);

    return () => document.removeEventListener("mousedown", handleMousedown);
  }, []);

  const menuElements: Array<MenuElementProps> = [
    { label: "Главная", onClick: () => navigate(PATHS.ROOT) },
    { label: "Мои карточки", onClick: () => navigate(PATHS.MY_CARDS) },
    { label: "Настройки", onClick: () => navigate(PATHS.SETTINGS) },
    {
      label: "Выход",
      onClick: () => {
        authService.logout();
        navigate(PATHS.LOGIN);
      },
    },
  ];

  return (
    <div
      ref={menuRef}
      onClick={() => setMenuIsDropped((prev) => !prev)}
      className="relative"
    >
      <div className="flex justify-center items-center gap-[10px] bg-gray-100 hover:opacity-75 px-4 py-6 cursor-pointer">
        <div className="flex flex-col justify-center h-[24px] w-[24px] gap-[4px] hover:gap-[6px] transition-gap duration-[200ms]">
          <div className="h-[4px] w-[24px] bg-[#000000a0] rounded-md"></div>
          <div className="h-[4px] w-[24px] bg-[#000000a0] rounded-md"></div>
          <div className="h-[4px] w-[24px] bg-[#000000a0] rounded-md"></div>
        </div>
        <p className="max-h-[28px] text-xl font-medium text-center select-none truncate">
          {authorName || "Логин пользователя"}
        </p>
      </div>

      {menuIsDropped && (
        <div className="absolute top-full left-[10%] w-[80%] mt-1 bg-[#FFFFFF] rounded-lg border border-gray-300 overflow-hidden">
          {menuElements.map(({ label, onClick }, index) => {
            return (
              <Fragment key={label}>
                {index !== 0 && (
                  <div className="border-t border-gray-100 mx-1" />
                )}
                <MenuElement label={label} onClick={onClick} />
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};
