import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "../../App";
import { Clock, Gift, AlertCircle } from "lucide-react";
import "./GiftSlotStatus.css";

interface GiftSlotStatusProps {
  accountId: string;
  accountName: string;
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

const GiftSlotStatus: React.FC<GiftSlotStatusProps> = ({
  accountId,
  accountName,
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
        setError(response.data.error || "Error al obtener el estado de regalos");
      }
    } catch (err) {
      console.error("Error fetching gift slot status:", err);
      setError("Error de conexión");
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
      return "Disponible ahora";
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  useEffect(() => {
    fetchGiftSlotStatus();
  }, [accountId]);

  useEffect(() => {
    if (status?.next_available_slot) {
      const interval = setInterval(() => {
        setTimeUntilNext(calculateTimeUntilNext());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [status]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4 bg-gray-700 rounded-lg">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-300">Cargando...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
        <AlertCircle className="text-red-400 mr-2" size={20} />
        <span className="text-red-400 text-sm">{error}</span>
      </div>
    );
  }

  if (!status) {
    return null;
  }

  const isAvailable = status.is_available && status.remaining_gifts > 0;

  return (
    <div className="gift-slot-status bg-gray-800/50 border border-gray-600 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-200">{accountName}</h4>
        <div className="flex items-center gap-2">
          <Gift className="text-purple-400" size={16} />
          <span className="text-sm text-gray-300">
            {status.remaining_gifts}/5 disponibles
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Regalos usados:</span>
          <span className="text-gray-300">{status.used_gifts}</span>
        </div>

        {status.remaining_gifts < 5 && status.next_available_slot && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-400 flex items-center">
              <Clock className="mr-1" size={12} />
              Próximo slot:
            </span>
            <span className={`gift-slot-timer font-mono ${isAvailable ? 'text-green-400' : 'text-yellow-400'}`}>
              {timeUntilNext}
            </span>
          </div>
        )}

        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`gift-slot-progress h-2 rounded-full transition-all duration-300 ${
              isAvailable ? 'bg-green-500' : 'bg-yellow-500'
            }`}
            style={{ width: `${(status.remaining_gifts / 5) * 100}%` }}
          ></div>
        </div>

        <div className="text-center">
          <span className={`text-xs font-semibold ${
            isAvailable ? 'text-green-400 gift-slot-available' : 'text-yellow-400 gift-slot-cooldown'
          }`}>
            {isAvailable ? '✅ Listo para enviar' : '⏳ Esperando cooldown'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GiftSlotStatus;
