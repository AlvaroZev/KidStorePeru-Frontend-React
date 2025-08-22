import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User } from "./type";

interface Props {
    user: User;
    onClose: () => void;
    onUpdate: (user: Partial<User>) => void;
}

const UpdateUserModal: React.FC<Props> = ({ user, onClose, onUpdate }) => {
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState(user.password || "");

    useEffect(() => {
        setUsername(user.username);
        setEmail(user.email);
    }, [user]);

    const handleSubmit = () => {
        onUpdate({ id: user.id, username, email, password });
        onClose();
    };

    return (
        <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <motion.div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
                <h2 className="text-xl text-white mb-4">Update User</h2>
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
                    placeholder="Password (optional)"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded font-semibold">
                        Cancelar
                    </button>
                    <button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold">
                        Editar
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default UpdateUserModal;