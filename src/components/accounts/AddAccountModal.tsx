import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "../../App"; // Adjust path as needed

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const AddAccountModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [authCode, setAuthCode] = useState("");
  const [statusColor, setStatusColor] = useState<"none" | "success" | "error">("none");

  const handleConnect = async () => {
    try {
      const token = Cookies.get("session");
      const res = await axios.post(
        `${API_URL}/connectfaccount`,
        { code: authCode },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 200) {
        setStatusColor("success");
        onSuccess();
        onClose();
      } else {
        setStatusColor("error");
      }
    } catch (err) {
      console.error("Connection failed:", err);
      setStatusColor("error");
    }
  };

  return (
    <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <motion.div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl text-white mb-4 text-center">Vincular Cuenta de Fortnite</h2>

        <ol className="text-sm text-gray-300 mb-4 list-decimal list-inside space-y-2">
          <li>Inicia sesión en <a href="https://accounts.epicgames.com/login/" target="_blank" className="text-blue-400 underline">accounts.epicgames.com</a></li>
          <li>
            Luego abre: <a href="https://www.epicgames.com/id/api/redirect?clientId=ec684b8c687f479fadea3cb2ad83f5c6&responseType=code" target="_blank" className="text-blue-400 underline">epicgames.com/id/api/redirect...</a>
          </li>
          <li>Pega el <strong>authorizationCode</strong> aquí abajo:</li>
        </ol>

        <input
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white border border-gray-600"
          placeholder="authorizationCode"
          value={authCode}
          onChange={(e) => setAuthCode(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded text-white">
            Cancelar
          </button>
          <button
            onClick={handleConnect}
            className={`px-4 py-2 rounded text-white ${
              statusColor === "success"
                ? "bg-green-600 hover:bg-green-700"
                : statusColor === "error"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Conectar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddAccountModal;
