import { FC } from "react";
import { useNavigate } from "react-router-dom";

import notFoundImage from "@/assets/not-found-image.png";
import { Button } from "@/components/Button";

const NotFoundPage: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFFF5]">
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center md:w-1/3 p-6">
          <h1 className="text-8xl text-[#D81212] font-bold">404</h1>
          <p className="text-2xl text-[#D81212] my-4">Страница не найдена</p>
          <Button onClick={() => navigate("/")}>На главную</Button>
        </div>
        <div className="flex items-center justify-center md:w-1/2 p-6">
          <img
            src={notFoundImage}
            alt="Not Found"
            className="w-full max-w-xs"
          />
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
