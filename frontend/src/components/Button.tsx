import { FC, ReactNode } from "react";

interface Props {
  onClick: () => void;
  children: ReactNode;
}

export const Button: FC<Props> = ({ onClick, children }: Props) => {
  return (
    <button
      className="bg-[#FF684D] inline-block px-6 py-2 text-white font-medium rounded-md hover:bg-orange-600 transition"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
