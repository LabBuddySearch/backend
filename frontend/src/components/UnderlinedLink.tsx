import { FC, ReactNode } from "react";

interface Props {
  onClick: () => void;
  className?: string;
  children: ReactNode;
}

export const UnderlinedLink: FC<Props> = ({
  onClick,
  className,
  children,
}: Props) => {
  return (
    <p
      className={`inline text-blue-500 hover:underline cursor-pointer${
        className ? ` ${className}` : ""
      }`}
      onClick={onClick}
    >
      {children}
    </p>
  );
};
