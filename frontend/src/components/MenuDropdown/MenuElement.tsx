import { FC } from "react";

import type { MenuElementProps } from "./MenuDropdown";

export const MenuElement: FC<MenuElementProps> = ({
  label,
  onClick,
}: MenuElementProps) => {
  return (
    <p
      onClick={onClick}
      className="px-6 py-2 text-base text-center hover:bg-gray-100 select-none"
    >
      {label}
    </p>
  );
};
