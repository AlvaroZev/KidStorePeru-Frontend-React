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
  const [creatorCode, setCreatorCode] = useState("KIDDX");
  const [searchName, setSearchName] = useState("");
  const [searchResult, setSearchResult] = useState<Friend | null>(null);
  const [searchStatus, setSearchStatus] = useState<"none" | "loading" | "error" | "success">("none");
  const [errorMessage, setErrorMessage] = useState("");

  const token = Cookies.get("session");

  if (!selectedItem || !selectedAccount) {
    return (
      <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <motion.div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
          <h2 className="text-xl text-white mb-4">Error</h2>
          <p className="mb-2 text-white">Por favor selecciona un ítem y una cuenta</p>
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded text-white">Cerrar</button>
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
    onSend(searchResult, creatorCode);
    onClose();
  };

  return (
    <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <motion.div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl text-white mb-4">Enviar regalo</h2>

        <p className="mb-2 text-white">
          Has seleccionado: <strong>{selectedItem.itemDisplay.name}</strong> – {selectedItem.finalPrice} V-Bucks
        </p>

        <div className="mt-3">
          <label className="block mb-1 font-semibold text-white">Buscar amigo:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className="flex-grow px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            />
            <button
              onClick={handleSearchFriend}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            >
              Buscar
            </button>
          </div>
          {searchStatus === "success" && (
            <div className="mt-2 text-green-400 text-sm">
              ✓ Usuario listo para recibir regalos.
            </div>
          )}
          {searchStatus === "error" && (
            <div className="mt-2 text-red-400 text-sm">
              ✗ {errorMessage}
            </div>
          )}
        </div>

        <div className="mt-4">
          <label className="block mb-1 font-semibold text-white">Código de creador:</label>
          <input
            type="text"
            value={creatorCode}
            onChange={(e) => setCreatorCode(e.target.value)}
            className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded text-white">
            Cancelar
          </button>
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-600 rounded text-white"
            disabled={searchStatus !== "success"}
          >
            Enviar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GiftModal;
