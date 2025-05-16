import React, { useState } from "react";
import { motion } from "framer-motion";
import { User } from "./type";

interface Props {
  onClose: () => void;
  onSave: (user: Partial<User>) => void;
}

const AddUserModal: React.FC<Props> = ({ onClose, onSave }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    onSave({ username, email, password });
    onClose();
  };

  return (
    <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <motion.div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl text-white mb-4">Add New User</h2>
        <input
          className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="off"
        />
        <input
          className="w-full mb-3 p-2 rounded bg-gray-700 text-white"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}

        />
        <input
          className="w-full mb-4 p-2 rounded bg-gray-700 text-white"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}

        />
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 rounded text-white">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 rounded text-white">
            Guardar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddUserModal;
