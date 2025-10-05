import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "../../App";
import { Account } from "../accounts";

interface PavosModalProps {
  account: Account;
  onClose: () => void;
  onRefresh?: () => void;
  onPavosUpdated?: (updated: {
    account_id: string;
    display_name: string;
    previous_pavos: number;
    new_pavos: number;
    operation: "add" | "override";
    amount: number;
  }) => void;
}

const PavosModal: React.FC<PavosModalProps> = ({
  account,
  onClose,
  onRefresh,
  onPavosUpdated
}) => {
  const [showPavosMenu, setShowPavosMenu] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [pavosAmount, setPavosAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [isUpdatingPavos, setIsUpdatingPavos] = useState(false);
  const [operationType, setOperationType] = useState<"add" | "override">("add");
  const token = Cookies.get("session");

  // Function to update pavos
  const updatePavos = async (accountId: string, type: "override" | "add", amount: number) => {
    try {
      const response = await axios.post(
        `${API_URL}/updatepavos`,
        {
          account_id: accountId,
          type: type,
          amount: amount
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
        console.log('Pavos updated successfully:', data.data);
        return data.data;
      } else {
        console.error('Failed to update pavos:', data.error);
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error updating pavos:', error);
      throw error;
    }
  };

  const handlePavosOption = (amount: number, type: "add" | "override" = "add") => {
    setPavosAmount(amount);
    setOperationType(type);
    setShowConfirmation(true);
    setShowPavosMenu(false);
  };

  const handleCustomAmount = (type: "add" | "override" = "add") => {
    const amount = parseInt(customAmount);
    if (amount > 0) {
      setPavosAmount(amount);
      setOperationType(type);
      setShowConfirmation(true);
      setShowPavosMenu(false);
    }
  };

  const handleEditAccount = () => {
    setCustomAmount(account.pavos.toString());
    setOperationType("override");
    setShowPavosMenu(false);
    setShowEditModal(true);
  };

  const handleEditConfirm = () => {
    const amount = parseInt(customAmount);
    if (amount >= 0) {
      setPavosAmount(amount);
      setShowEditModal(false);
      setShowConfirmation(true);
    }
  };

  const handleConfirmUpdate = async () => {
    if (pavosAmount === null) return;
    
    setIsUpdatingPavos(true);
    try {
      const updated = await updatePavos(account.id, operationType, pavosAmount);
      // Optimistic UI update
      if (updated && onPavosUpdated) {
        onPavosUpdated(updated);
      }
      onRefresh?.();
      setShowConfirmation(false);
      setPavosAmount(null);
      setCustomAmount("");
      onClose();
    } catch (error) {
      console.error('Failed to update pavos:', error);
      // You could add a toast notification here
    } finally {
      setIsUpdatingPavos(false);
    }
  };

  const handleCancel = () => {
    setShowPavosMenu(false);
    setShowConfirmation(false);
    setShowEditModal(false);
    setPavosAmount(null);
    setCustomAmount("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl text-white mb-4">Gestionar Pavos</h2>
        <p className="text-gray-300 mb-4 text-center">
          Cuenta: <span className="text-pink-400 font-semibold">{account.displayName}</span>
        </p>
        
        {/* Pavos Management Menu */}
        {showPavosMenu && (
          <div className="space-y-3">
            <button
              onClick={() => handlePavosOption(13500, "add")}
              className="w-full mb-2 p-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
            >
              + 13,500 Pavos
            </button>
            
            <div className="flex gap-1 mb-2">
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Cantidad"
                className="flex-1 p-1 rounded bg-gray-700 text-white text-sm"
                min="1"
              />
              <button
                onClick={() => handleCustomAmount("add")}
                disabled={!customAmount || parseInt(customAmount) <= 0}
                className="px-2 py-1 rounded bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white text-sm font-semibold"
              >
                +
              </button>
            </div>
            
            <button
              onClick={handleEditAccount}
              className="w-full mb-2 p-2 rounded bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold"
            >
              ✏️ Editar Cantidad
            </button>
            
            <button
              onClick={onClose}
              className="w-full p-1 rounded bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-burbankBold text-white mb-4 text-center">
              {operationType === "add" ? "Confirmar Adición" : "Confirmar Edición"}
            </h3>
            <p className="text-slate-300 mb-4 text-center">
              {operationType === "add" ? (
                <>¿Estás seguro de que quieres agregar <span className="text-green-400 font-burbankBold">{pavosAmount?.toLocaleString()}</span> pavos a <span className="text-pink-400 font-burbankBold">{account.displayName}</span>?</>
              ) : (
                <>¿Estás seguro de que quieres establecer <span className="text-orange-400 font-burbankBold">{pavosAmount?.toLocaleString()}</span> pavos para <span className="text-pink-400 font-burbankBold">{account.displayName}</span>?</>
              )}
            </p>
            <p className="text-sm text-slate-400 mb-6 text-center">
              {operationType === "add" ? (
                <>Pavos actuales: <span className="text-yellow-400 font-burbankBold">{account.pavos.toLocaleString()}</span><br/>
                Nuevo total: <span className="text-green-400 font-burbankBold">{(account.pavos + (pavosAmount || 0)).toLocaleString()}</span></>
              ) : (
                <>Pavos actuales: <span className="text-yellow-400 font-burbankBold">{account.pavos.toLocaleString()}</span></>
              )}
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleConfirmUpdate}
                disabled={isUpdatingPavos}
                className={`flex-1 ${operationType === "add" ? "bg-green-600 hover:bg-green-500" : "bg-orange-600 hover:bg-orange-500"} disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-burbankBold transition-colors`}
              >
                {isUpdatingPavos ? (operationType === "add" ? "Agregando..." : "Editando...") : "Confirmar"}
              </button>
              <button
                onClick={handleCancel}
                disabled={isUpdatingPavos}
                className="flex-1 bg-slate-600 hover:bg-slate-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-burbankBold transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Account Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] p-4">
          <div className="bg-slate-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-burbankBold text-white mb-4 text-center">
              Editar Cantidad de Pavos
            </h3>
            <p className="text-slate-300 mb-4 text-center">
              Establecer nueva cantidad para <span className="text-pink-400 font-burbankBold">{account.displayName}</span>
            </p>
            <div className="space-y-3">
              <input
                type="number"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="Nueva cantidad de pavos"
                className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-orange-500 focus:outline-none"
                min="0"
              />
              <p className="text-sm text-slate-400 text-center">
                Cantidad actual: <span className="text-yellow-400 font-burbankBold">{account.pavos.toLocaleString()}</span>
              </p>
            </div>
            <div className="flex space-x-3 mt-4">
              <button
                onClick={handleEditConfirm}
                disabled={!customAmount || isNaN(parseInt(customAmount)) || parseInt(customAmount) < 0}
                className="flex-1 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-burbankBold transition-colors"
              >
                Confirmar
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-slate-600 hover:bg-slate-500 text-white py-2 px-4 rounded-lg font-burbankBold transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PavosModal;