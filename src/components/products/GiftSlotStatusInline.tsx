import React, { useState, useEffect } from "react";
import { Clock, Gift } from "lucide-react";
import { GiftSlotStatus } from "../accounts/types";

interface GiftSlotStatusInlineProps {
  giftSlotStatus?: GiftSlotStatus;
  onStatusUpdate?: (status: GiftSlotStatus) => void;
}

const GiftSlotStatusInline: React.FC<GiftSlotStatusInlineProps> = ({
  giftSlotStatus,
  onStatusUpdate,
}) => {
  const [timeUntilNext, setTimeUntilNext] = useState<string>("");

  const calculateTimeUntilNext = () => {
    if (!giftSlotStatus?.next_slot_available) {
      // If no next slot available but gifts are used, show a default message
      if (giftSlotStatus && giftSlotStatus.used_gifts > 0) {
        return "24h";
      }
      return "";
    }

    const now = new Date();
    const nextAvailable = new Date(giftSlotStatus.next_slot_available);
    const diff = nextAvailable.getTime() - now.getTime();

    if (diff <= 0) {
      return "Ahora";
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return "1m";
    }
  };

  useEffect(() => {
    // Set initial time
    setTimeUntilNext(calculateTimeUntilNext());
    
    // Set up interval for updates
    const interval = setInterval(() => {
      setTimeUntilNext(calculateTimeUntilNext());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [giftSlotStatus]);

  if (!giftSlotStatus) {
    return (
      <div className="text-gray-400 text-xs py-1">
        -
      </div>
    );
  }

  const isAvailable = giftSlotStatus.remaining_gifts > 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1">
          <Gift className={`${isAvailable ? 'text-green-400' : 'text-yellow-400'}`} size={12} />
          <span className={`font-semibold ${isAvailable ? 'text-green-400' : 'text-yellow-400'}`}>
            {giftSlotStatus.remaining_gifts}/{giftSlotStatus.max_gifts}
          </span>
        </span>
        <span className="text-gray-400 text-xs">
          {giftSlotStatus.used_gifts} usados
        </span>
      </div>
      
      {giftSlotStatus.remaining_gifts < giftSlotStatus.max_gifts && giftSlotStatus.next_slot_available && (
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Clock size={10} />
          <span className="font-mono">{timeUntilNext}</span>
        </div>
      )}
      
      <div className="w-full bg-gray-700 rounded-full h-1">
        <div
          className={`h-1 rounded-full transition-all duration-300 ${
            isAvailable ? 'bg-green-500' : 'bg-yellow-500'
          }`}
          style={{ width: `${(giftSlotStatus.remaining_gifts / giftSlotStatus.max_gifts) * 100}%` }}
        ></div>
      </div>
      
             <div className="text-center">
         <span className={`text-xs font-semibold ${
           isAvailable ? 'text-green-400' : 'text-yellow-400'
         }`}>
           {isAvailable ? '✅ Listo' : `⏳ ${timeUntilNext}`}
         </span>
       </div>
    </div>
  );
};

export default GiftSlotStatusInline;
