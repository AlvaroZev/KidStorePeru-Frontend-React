import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { User } from "./type";

interface Props {
  users: User[];
  onDelete: (id: string) => void;
  onUpdate: (user: User) => void;
}

const UsersTable: React.FC<Props> = ({ users, onDelete, onUpdate }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return users.filter(
      (user) =>
        user.username.toLowerCase().includes(term) ||
        (user.email?.toLowerCase().includes(term) ?? false)
    );
  }, [searchTerm, users]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      onDelete(id);
    }
  };

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Usuarios</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar usuarios..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Fecha de Creación
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filteredUsers.map((user) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-100">{user.username}</div>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-300">{user.email || "-"}</div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button
                    className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-xs rounded font-semibold mr-2"
                    onClick={() => onUpdate(user)}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-700 px-3 py-1 text-xs rounded font-semibold"
                    onClick={() => handleDelete(user.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default UsersTable;
