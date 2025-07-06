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
        window.open(res.data.verification_uri_complete, "_blank");
        setDeviceCode(res.data.device_code);
        setStep(2);
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
      <motion.div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl text-white mb-4 text-center">Vincular Cuenta de Fortnite</h2>
        <p className="text-sm text-red-400 mb-4 text-center font-semibold">
          ⚠️ IMPORTANTE: Abre los siguientes enlaces en una ventana de incógnito.
          Esto es obligatorio para evitar conflictos con cuentas agregadas previamente.
        </p>

        {step === 1 && (
          <>
            <p className="text-sm text-gray-300 mb-4">
              Haz clic en el botón de abajo para iniciar el proceso de vinculación.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded text-white">
                Cancelar
              </button>
              <button
                onClick={handleInit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
              >
                Iniciar Vinculación
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <ol className="text-sm text-gray-300 mb-4 list-decimal list-inside space-y-2">
              <li>Inicia sesión con tu cuenta de Fortnite en la ventana que se abrió.</li>
              <li>Una vez completado el inicio de sesión, presiona el botón abajo.</li>
              <li>{userCode}</li>
            </ol>
            <div className="flex justify-end gap-2">
              <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded text-white">
                Cancelar
              </button>
              <button
                onClick={handleDeviceSync}
                className={`px-4 py-2 rounded text-white ${
                  statusColor === "success"
                    ? "bg-green-600 hover:bg-green-700"
                    : statusColor === "error"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Ya he iniciado sesión
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AddAccountModal;
