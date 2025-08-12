// src/components/products/ItemCard.tsx
import React, { useEffect, useState } from "react";
import { ShopEntry } from "../../pages/ProductsPage";

// 🎨 Estilos según rareza
const estilosPorRareza: Record<string, string> = {
  legendary: "shadow-[inset_0_0_150px_-50px_orange] border-orange-400",
  epic: "shadow-[inset_0_0_150px_-50px_purple] border-purple-500",
  rare: "shadow-[inset_0_0_150px_-50px_blue] border-blue-400",
  uncommon: "shadow-[inset_0_0_150px_-50px_limegreen] border-lime-400",
  common: "shadow-[inset_0_0_150px_-50px_gray] border-gray-400",
  marvel: "shadow-[inset_0_0_150px_-50px_red] border-red-500",
  dc: "shadow-[inset_0_0_150px_-50px_darkblue] border-blue-600",
  starwars: "shadow-[inset_0_0_150px_-50px_white] border-gray-300",
  idol: "shadow-[inset_0_0_150px_-50px_gold] border-yellow-400",
  gaminglegends: "shadow-[inset_0_0_150px_-50px_indigo] border-indigo-500",
  creatorcollab: "shadow-[inset_0_0_150px_-50px_gold] border-yellow-400",
};

interface Props {
  item: ShopEntry;
  selected?: boolean;
  onClick?: (item: ShopEntry) => void;
  onAction?: (item: ShopEntry, action: "buy" | "gift") => void;
}

const ItemCard: React.FC<Props> = ({ item, selected, onClick, onAction }) => {
  const display = item.itemDisplay;
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const nextReset = new Date();
      nextReset.setUTCHours(0, 0, 0, 0);
      if (now >= nextReset) nextReset.setUTCDate(nextReset.getUTCDate() + 1);

      const diff = nextReset.getTime() - now.getTime();
      const hours = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const minutes = String(Math.floor((diff % 3600000) / 60000)).padStart(
        2,
        "0"
      );
      const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(
        2,
        "0"
      );

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const rareza = display.rarity?.toLowerCase() || "common";
  const estilo = estilosPorRareza[rareza] || "border-slate-700";

  function withAlpha(color: string, alpha: number) {
    // Convert hex (#RRGGBB) to rgba
    if (color.startsWith("#")) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    // If already rgb/rgba, just replace alpha
    if (color.startsWith("rgb")) {
      return color.replace(/rgba?\(([^)]+)\)/, (_, values) => {
        const [r, g, b] = values.split(",").map((v) => v.trim());
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      });
    }

    // Fallback to grey
    return `rgba(135, 135, 135, ${alpha})`;
  }

  const fixedColor = withAlpha(
    display.backgroundColor ||
      display.backgroundColor2 ||
      display.color ||
      display.color2 ||
      display.color3 ||
      "transparent",
    0.3 // make it clearer
  );

  const style = {};
  return (
    <div
      onClick={() => onClick?.(item)}
      className={`w-full max-w-[260px] h-[340px] rounded-lg p-3 flex flex-col items-center justify-between border ${estilo} 
        ${selected ? "ring-2 ring-blue-400" : ""} 
        transition-transform duration-150 hover:scale-105 cursor-pointer`}
    >
      <img
        style={{
          background: `linear-gradient(to bottom, ${fixedColor}, ${
            display.backgroundColor ||
            display.backgroundColor2 ||
            display.color ||
            display.color2 ||
            display.color3 ||
            "transparent"
          })`,
        }}
        src={display.image}
        alt={display.name}
        className="w-full h-[140px] object-contain object-center rounded"
        loading="lazy"
      />

      <div className="text-center mt-2 w-full flex-1 px-1 flex flex-col justify-between">
        <h2
          className="text-sm font-burbankBold uppercase truncate"
          title={display.name}
        >
          {display.name}
        </h2>

        <div className="flex items-center justify-center mt-1">
          <img
            src="https://static.wikia.nocookie.net/fortnite/images/e/eb/V-Bucks_-_Icon_-_Fortnite.png"
            alt="V-Bucks"
            className="w-4 h-4 mr-1"
          />
          <p className="text-sm font-medium">{display.vBucks} PAVOS</p>
        </div>

        <p className="text-xs mt-1 text-gray-400 font-medium">
          ⏳ Disponible por: {timeLeft}
        </p>
      </div>

      <div className="flex gap-2 mt-4 w-full justify-center">
        {/* <button
          onClick={(e) => {
            e.stopPropagation();
            onAction?.(item, "buy");
          }}
          title="Comprar este objeto"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded shadow-sm transition"
        >
          Comprar
        </button> */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(item);
          }}
          title="Enviar este objeto como regalo"
          className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1 rounded shadow-sm transition"
        >
          Regalar
        </button>
      </div>
    </div>
  );
};

export default ItemCard;
