"use client";

import {
  FcEngineering,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode,
} from "react-icons/fc";

import { IconType } from "react-icons";

import { Category } from "@prisma/client";
import { CategoryItem } from "./category-item";

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
  // prettier-ignore
  "Music": FcMusic,
  // prettier-ignore
  "Photography": FcOldTimeCamera,
  // prettier-ignore
  "Fitness": FcSportsMode,
  // prettier-ignore
  "Accounting": FcSalesPerformance,
  // prettier-ignore
  "Computer Science": FcMultipleDevices,
  // prettier-ignore
  "Filming": FcFilmReel,
  // prettier-ignore
  "Engineering": FcEngineering,
};

export function Categories({ items }: CategoriesProps) {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  );
}
