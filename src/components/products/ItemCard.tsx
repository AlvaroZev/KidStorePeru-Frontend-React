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
      <img
        src={display?.image}
        alt={display?.name}
        className="w-full h-36 object-contain rounded mb-2"
      />
      <div className="text-white font-semibold">{display?.name}</div>
      <div className="text-sm text-gray-400">{display?.rarity}</div>
      <div className="text-blue-400 mt-1">{display?.vBucks} V-Bucks</div>
    </div>
  );
};

export default ItemCard;
