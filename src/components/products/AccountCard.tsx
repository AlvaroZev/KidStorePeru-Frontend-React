import React, { useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { Account } from "../accounts";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "../../App";

interface AccountCardProps {
  account: Account;
  selected?: boolean;
  onClick?: () => void;
  onRefresh?: () => void;
}

const AccountCard: React.FC<AccountCardProps> = ({
  account,
  selected,
  onClick,
  onRefresh,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const token = Cookies.get("session");

  // Function to refresh pavos for a specific account
  const refreshPavos = async (accountId: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/refreshpavos`,
        {
          account_id: accountId
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const data = response.data;
      
      if (data.success) {
        console.log('Pavos refreshed successfully:', data.data);
        // Update your UI with the new pavos value
        return data.data;
      } else {
        console.error('Failed to refresh pavos:', data.error);
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error refreshing pavos:', error);
      throw error;
    }
  };

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      const result = await refreshPavos(account.id);
      // Call the parent's onRefresh callback to update the UI
      onRefresh?.();
      console.log('Pavos updated:', result);
    } catch (error) {
      console.error('Failed to refresh pavos:', error);
      // You could add a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer border rounded-xl p-3 sm:p-5 shadow-xl transition transform hover:scale-105 ${
        selected
          ? "bg-blue-800 border-blue-500"
          : "bg-slate-800 border-slate-600"
      }`}
    >
      <button
        onClick={handleRefresh}
        disabled={isLoading}
        className="absolute top-1 right-1 bg-slate-700 p-1 rounded-full hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
        title="Actualizar pavos"
      >
        <FiRefreshCw className={`text-white text-sm ${isLoading ? 'animate-spin' : ''}`} />
      </button>

      <h3 className="text-lg sm:text-xl font-burbankBold mb-2 text-center text-pink-400">
        {account.displayName}
      </h3>
      <p className="text-xs sm:text-sm">💰 Pavos: {account.pavos}</p>
      <p className="text-xs sm:text-sm">📤 Enviados: {5-(account.remainingGifts  ?? 0)}</p>
      <p className="text-xs sm:text-sm">
        🎁 Disponibles: {account.remainingGifts ?? 5}
      </p>
    </div>
  );
};

export default AccountCard;
