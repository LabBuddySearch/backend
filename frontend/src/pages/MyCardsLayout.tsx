import { FC } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/Button";
import { MenuDropdown } from "@/components/MenuDropdown";
import { MinicardsList } from "@/components/MinicardsList";

const MyCardsLayout: FC = () => {
  const url = useLocation().pathname;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-[#FFFFF5]">
      <aside className="w-[174.8px] sm:w-[348.8px] flex-shrink-0 border-r border-gray-200">
        <MenuDropdown />
        <MinicardsList isMyCardsPage />
      </aside>
      <main className="flex-1">
        <header className="h-[76px] flex justify-between items-center px-6">
          <h1 className="text-2xl">
            {url.includes("create")
              ? "Режим создания"
              : url.includes("edit")
              ? "Режим редактирования"
              : "Мои карточки"}
          </h1>
          <div className="flex gap-4">
            <Button onClick={() => navigate("/my-cards/create")}>
              Создать
            </Button>
            <Button onClick={() => navigate("/")}>На главную</Button>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
};

export default MyCardsLayout;
