// src/components/GiftModal.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShopEntry } from "../../pages/ProductsPage";
import { Account } from "../accounts";
import axios from "axios";
import { API_URL } from "../../App";
import Cookies from "js-cookie";

export interface Friend {
  id: string;
  username: string;
  isGiftable: boolean;
}

interface GiftModalProps {
  onClose: () => void;
  selectedItem: ShopEntry | null;
  selectedAccount: Account | null;
  onSend: (recipient: Friend, creatorCode: string) => void;
}

const GiftModal: React.FC<GiftModalProps> = ({ onClose, selectedItem, selectedAccount, onSend }) => {
  const [searchName, setSearchName] = useState("");
  const [searchResult, setSearchResult] = useState<Friend | null>(null);
  const [searchStatus, setSearchStatus] = useState<"none" | "loading" | "error" | "success">("none");
  const [errorMessage, setErrorMessage] = useState("");

  const token = Cookies.get("session");

  if (!selectedItem || !selectedAccount) {
    return (
      <motion.div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <motion.div className="bg-[#1e293b] p-6 rounded-lg w-full max-w-md text-white relative">
          <h2 className="text-2xl font-bold mb-3 text-center text-blue-400">Error</h2>
          <p className="mb-2 text-white text-center">Por favor selecciona un ítem y una cuenta</p>
          <button onClick={onClose} className="w-full bg-gray-600 hover:bg-gray-700 py-2 rounded font-semibold">Cerrar</button>
        </motion.div>
      </motion.div>
    );
  }

  const handleSearchFriend = async () => {
    try {
      setSearchStatus("loading");
      setErrorMessage("");

      const res = await axios.post(
        `${API_URL}/searchfortnitefriend`,
        { display_name: searchName, account_id: selectedAccount.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = res.data;

      // Manejo de respuesta de error
      if (data.error) {
        if (data.error === "Could not refresh access token") {
          //close modal and redirect to users
          onClose();
          window.location.href = "/fortniteaccounts";
          return;
        }

        setSearchStatus("error");
        setSearchResult(null);
        setErrorMessage(data.error);
        return;
      }

      // Datos correctos
      const friendObj: Friend = {
        id: data.accountId,
        username: data.displayName,
        isGiftable: data.giftable,
      };

      setSearchResult(friendObj);

      if (data.giftable) {
        setSearchStatus("success");
      } else {
        setSearchStatus("error");
        setErrorMessage(data.error || "Este usuario no es elegible para recibir regalos.");
      }
    } catch (error: any) {
      console.error("Error searching friend:", error);
      setSearchStatus("error");
      setSearchResult(null);
      setErrorMessage(error?.response?.data?.error || "Error al buscar amigo.");
    }
  };

  const handleSend = () => {
    if (!searchResult) return;
    onSend(searchResult, "KIDDX"); // Default creator code
    onClose();
  };

  return (
    <motion.div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <motion.div className="bg-[#1e293b] p-6 rounded-lg w-full max-w-md text-white relative">
        <h2 className="text-2xl font-bold mb-3 text-center text-blue-400">
          🎁 Enviar Regalo
        </h2>
        
        <img 
          src={selectedItem.itemDisplay.image} 
          alt={selectedItem.itemDisplay.name} 
          className="w-32 mx-auto mb-3 rounded shadow-lg" 
        />
        
        <p className="text-center font-semibold mb-1">{selectedItem.itemDisplay.name}</p>
        
        <p className="text-center text-sm mb-2">💸 Precio: {selectedItem.finalPrice} V-BUCKS</p>
        
        <p className="text-center text-sm mb-4 text-gray-300">📤 Enviando desde: <span className="text-blue-400 font-semibold">{selectedAccount.displayName}</span></p>

        <div className="mb-4">
          <label className="block text-sm mb-1">Buscar amigo:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="flex-grow px-3 py-2 rounded bg-slate-700 border border-slate-600 text-sm text-white"
              placeholder="Nombre del amigo..."
            />
            <button
              onClick={handleSearchFriend}
              disabled={searchStatus === "loading"}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-sm"
            >
              {searchStatus === "loading" ? "..." : "Buscar"}
            </button>
          </div>
          
          {searchStatus === "success" && (
            <div className="mt-2 text-green-400 text-sm text-center">
              ✓ Usuario listo para recibir regalos: <strong>{searchResult?.username}</strong>
            </div>
          )}
          {searchStatus === "error" && (
            <div className="mt-2 text-red-400 text-sm text-center">
              ✗ {errorMessage}
            </div>
          )}
        </div>

        <button
          onClick={handleSend}
          disabled={searchStatus !== "success"}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold mb-2 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          Enviar Regalo
        </button>

        <button
          onClick={onClose}
          className="w-full text-sm text-gray-400 hover:text-white border border-slate-600 py-2 rounded"
        >
          Cancelar
        </button>
      </motion.div>
    </motion.div>
  );
};

export default GiftModal;
