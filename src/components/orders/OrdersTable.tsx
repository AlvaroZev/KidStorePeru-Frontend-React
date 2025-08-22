import React from "react";
import { Transaction } from "./types";

interface Props {
  transactions: Transaction[];
}

const OrdersTable: React.FC<Props> = ({ transactions }) => {
  return (
    <div className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-4 sm:p-6 border border-gray-700">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-100 mb-4">Historial de Órdenes</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-2 sm:px-4 py-2 text-left text-xs text-gray-400 uppercase">Objeto</th>
              <th className="hidden sm:table-cell px-2 sm:px-4 py-2 text-left text-xs text-gray-400 uppercase">Cuenta de Origen</th>
              <th className="hidden md:table-cell px-2 sm:px-4 py-2 text-left text-xs text-gray-400 uppercase">Usuario Receptor</th>
              <th className="px-2 sm:px-4 py-2 text-left text-xs text-gray-400 uppercase">Precio</th>
              <th className="hidden lg:table-cell px-2 sm:px-4 py-2 text-left text-xs text-gray-400 uppercase">Imagen</th>
              <th className="hidden md:table-cell px-2 sm:px-4 py-2 text-left text-xs text-gray-400 uppercase">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {transactions.reverse().map((tx) => (
              <tr key={tx.id}>
                <td className="px-2 sm:px-4 py-2 text-gray-200 text-sm">{tx.objectStoreName}</td>
                <td className="hidden sm:table-cell px-2 sm:px-4 py-2 text-gray-200 text-sm">{tx.senderName}</td>
                <td className="hidden md:table-cell px-2 sm:px-4 py-2 text-gray-200 text-sm">{tx.receiverName || "N/A"}</td>
                <td className="px-2 sm:px-4 py-2 text-gray-200">
                  <span className="text-green-400 text-sm">{tx.finalPrice}</span>
                </td>
                <td className="hidden lg:table-cell px-2 sm:px-4 py-2">
                  <img src={tx.giftImage} alt={tx.objectStoreName} className="h-8 sm:h-10 rounded" />
                </td>
                <td className="hidden md:table-cell px-2 sm:px-4 py-2 text-gray-400 text-sm">
                  {new Date(tx.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
