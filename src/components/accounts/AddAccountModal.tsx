import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "../../App";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

const AddAccountModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [deviceCode, setDeviceCode] = useState<string | null>(null);
  const [statusColor, setStatusColor] = useState<"none" | "success" | "error">("none");
  const [userCode, setUserCode] = useState<string>("");

  const handleInit = async () => {
    try {
      const token = Cookies.get("session");
      const res = await axios.post(
        `${API_URL}/connectfaccount`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.status === 200 && res.data.success && res.data.verification_uri_complete && res.data.device_code) {
        setUserCode(res.data.user_code);
        setDeviceCode(res.data.device_code);
        setStep(2);

        // Wait 1 second before opening the URL
        setTimeout(() => {
          window.open(res.data.verification_uri_complete, "_blank");
        }, 1000);
      } else {
        setStatusColor("error");
      }
    } catch (err) {
      console.error("Init failed:", err);
      setStatusColor("error");
    }
  };

  const handleDeviceSync = async () => {
    if (!deviceCode) return;

    try {
      const token = Cookies.get("session");
      const res = await axios.post(
        `${API_URL}/finishconnectfaccount`,
        { device_code: deviceCode },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDeviceCode(null);
      setUserCode("");

      if (res.status === 200) {
        setStatusColor("success");
        onSuccess();
        onClose();
      } else {
        setStatusColor("error");
      }
    } catch (err) {
      console.error("Device sync failed:", err);
      setStatusColor("error");
    }
  };

  return (
    <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <motion.div className="bg-gray-800 rounded-2xl p-8 w-full max-w-lg text-center">
        <h2 className="text-2xl text-white mb-6 font-bold">Vincular Cuenta de Fortnite</h2>

        {step === 1 && (
          <>
            <p className="text-base text-gray-300 mb-6">
              Haz clic en el botón para iniciar el proceso de vinculación.
            </p>
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handleInit}
                className="text-xl px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-semibold shadow"
              >
                Iniciar Vinculación
              </button>
              <button
                onClick={onClose}
                className="text-sm text-gray-400 hover:text-gray-300 underline mt-2"
              >
                Cancelar
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="bg-gray-900 text-white text-4xl font-bold py-8 px-6 rounded-2xl mb-6">
              {userCode}
            </div>
            <div className="flex flex-col items-center gap-4">
              <button
                onClick={handleDeviceSync}
                className={`text-xl px-8 py-4 rounded-2xl font-semibold text-white shadow ${
                  statusColor === "success"
                    ? "bg-green-600 hover:bg-green-700"
                    : statusColor === "error"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Ya he iniciado sesión
              </button>
              <button
                onClick={onClose}
                className="text-sm text-gray-400 hover:text-gray-300 underline mt-2"
              >
                Cancelar
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AddAccountModal;
