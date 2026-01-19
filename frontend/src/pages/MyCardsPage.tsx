import { FC } from "react";

import labsterQuestionMarks from "@/assets/labster-question-marks.png";

const MyCardsPage: FC = () => {

  return (
    <div className="h-[calc(100vh-76px)] flex flex-col justify-center items-center">
      <img
        src={labsterQuestionMarks}
        alt="Labster questions"
        className="w-[250px]"
      />
      <p className="text-lg text-center mb-4">
        Создайте новые карточки или нажмите на них, чтобы редактировать
      </p>
    </div>
  );
};

export default MyCardsPage;