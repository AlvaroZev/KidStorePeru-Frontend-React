import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "../../App";
import { Clock, Gift } from "lucide-react";

interface GiftSlotStatusCardProps {
  accountId: string;
  onStatusUpdate?: (status: GiftSlotStatus) => void;
}

export interface GiftSlotStatus {
  account_id: string;
  remaining_gifts: number;
  used_gifts: number;
  next_available_slot?: string;
  last_gift_time?: string;
  is_available: boolean;
}

const GiftSlotStatusCard: React.FC<GiftSlotStatusCardProps> = ({
  accountId,
  onStatusUpdate,
}) => {
  const [status, setStatus] = useState<GiftSlotStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeUntilNext, setTimeUntilNext] = useState<string>("");

  const token = Cookies.get("session");

  const fetchGiftSlotStatus = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        `${API_URL}/giftslotstatus`,
        {
          account_id: accountId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const giftStatus: GiftSlotStatus = response.data.data;
        setStatus(giftStatus);
        onStatusUpdate?.(giftStatus);
      } else {
        setError(response.data.error || "Error");
      }
    } catch (err) {
      console.error("Error fetching gift slot status:", err);
      setError("Error");
    } finally {
      setLoading(false);
    }
  };

  const calculateTimeUntilNext = () => {
    if (!status?.next_available_slot) return "";

    const now = new Date();
    const nextAvailable = new Date(status.next_available_slot);
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
    fetchGiftSlotStatus();
  }, [accountId]);

  useEffect(() => {
    if (status?.next_available_slot) {
      const interval = setInterval(() => {
        setTimeUntilNext(calculateTimeUntilNext());
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [status]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 text-xs py-1">
        Error
      </div>
    );
  }

  if (!status) {
    return (
      <div className="text-gray-400 text-xs py-1">
        -
      </div>
    );
  }

  const isAvailable = status.is_available && status.remaining_gifts > 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1">
          <Gift className={`${isAvailable ? 'text-green-400' : 'text-yellow-400'}`} size={12} />
          <span className={`font-semibold ${isAvailable ? 'text-green-400' : 'text-yellow-400'}`}>
            {status.remaining_gifts}/5
          </span>
        </span>
        <span className="text-gray-400 text-xs">
          {status.used_gifts} usados
        </span>
      </div>
      
      {status.remaining_gifts < 5 && status.next_available_slot && (
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
          style={{ width: `${(status.remaining_gifts / 5) * 100}%` }}
        ></div>
      </div>
      
      <div className="text-center">
        <span className={`text-xs font-semibold ${
          isAvailable ? 'text-green-400' : 'text-yellow-400'
        }`}>
          {isAvailable ? '✅ Listo' : '⏳ Cooldown'}
        </span>
      </div>
    </div>
  );
};

export default GiftSlotStatusCard;
