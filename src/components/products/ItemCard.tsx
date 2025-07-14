import React from "react";
import { ShopEntry } from "../../pages/ProductsPage";

interface Props {
  item: ShopEntry;
  selected?: boolean;
  onClick?: (item: ShopEntry) => void;
}

const ItemCard: React.FC<Props> = ({ item, selected, onClick }) => {
  const display = item.itemDisplay;

  return (
    <div
      onClick={() => onClick?.(item)}
      className={`p-3 rounded-2xl transition-all cursor-pointer border 
        ${selected ? "border-blue-500" : "border-gray-700"} 
        bg-gray-800 hover:border-blue-400`}
    >
      <div
  style={{
    background: `linear-gradient(to bottom, ${
      display.backgroundColor ||
      display.backgroundColor2 ||
      display.color ||
      display.color2 ||
      display.color3 ||
      "transparent"
    }, rgba(255,255,255,0.9), ${
      display.backgroundColor ||
      display.backgroundColor2 ||
      display.color ||
      display.color2 ||
      display.color3 ||
      "transparent"
    })`,
  }}
  className="w-full h-36 rounded mb-2 flex items-center justify-center"
>
  <img
    src={display.image}
    alt={display.name}
    className="max-h-full max-w-full object-contain"
  />
</div>
      <div
        className="text-white font-semibold text-sm leading-tight line-clamp-2"
        title={display?.name}
      >
        {display?.name}
      </div>
      <div className="text-sm text-gray-400 line-clamp-2" title={display?.type}>
        {display?.type}
      </div>
      <div className="text-blue-400 mt-1">{display?.vBucks} V-Bucks</div>
    </div>
  );
};

export default ItemCard;
