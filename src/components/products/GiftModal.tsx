import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GameAccount, ShopEntry } from "../../pages/ProductsPage";

interface Friend {
  id: string;
  username: string;
}

interface GiftModalProps {
  onClose: () => void;
  selectedItem: ShopEntry | null;
  selectedAccount: GameAccount | null;
  onSend: (recipient: string, creatorCode: string, quantity: number) => void;
}

const GiftModal: React.FC<GiftModalProps> = ({ onClose, selectedItem, selectedAccount, onSend }) => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [recipient, setRecipient] = useState("");
  const [creatorCode, setCreatorCode] = useState("KIDDX");
  const [quantity, setQuantity] = useState(1);

    //small popup to show the user that they need to select an item or an account
    if (!selectedItem) {
        return (
            <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <motion.div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
                <h2 className="text-xl text-white mb-4">Error</h2>
                <p className="mb-2 text-white">Por favor selecciona un item o una cuenta</p>
                <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded text-white">
                Cerrar
                </button>
            </motion.div>
            </motion.div>
        );
    
    }
    if (!selectedAccount) {
    
        return (
            <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <motion.div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
                <h2 className="text-xl text-white mb-4">Error</h2>
                <p className="mb-2 text-white">Por favor selecciona una cuenta</p>
                <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded text-white">
                Cerrar
                </button>
            </motion.div>
            </motion.div>
        );
    }
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await fetch("http://localhost:8080/fetchfortnitefriends", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ GameAccountId: selectedAccount.id }),
        });
        const data = await res.json();
        setFriends(data);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    fetchFriends();
  }, [selectedAccount.id]);

  const handleSend = () => {
    if (!recipient) return;
    onSend(recipient, creatorCode, quantity);
    onClose();
  };

  return (
    <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <motion.div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl text-white mb-4">Enviar regalo</h2>

        <p className="mb-2 text-white">
          Has seleccionado: <strong>{selectedItem?.brItems?.[0].name ?? ""}</strong> – {selectedItem.finalPrice} V-Bucks
        </p>

        <div className="mt-3">
          <label className="block mb-1 font-semibold text-white">Cantidad:</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
          />
        </div>

        <div className="mt-3">
          <label className="block mb-1 font-semibold text-white">Destinatario:</label>
          <select
            className="w-full px-3 py-2 rounded bg-gray-700 border border-gray-600 text-white"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          >
            <option value="">Selecciona un amigo</option>
            {friends.map((friend) => (
              <option key={friend.id} value={friend.username}>
                {friend.username}
              </option>
            ))}
          </select>
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
          <button onClick={handleSend} className="px-4 py-2 bg-blue-600 rounded text-white">
            Enviar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GiftModal;
