import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Key } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { genSaltSync, hashSync } from "bcrypt-ts";
import React from "react";
import { API_URL } from "../App";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [session, setSession] = useState(Cookies.get("session") || null);
    const salt = genSaltSync(14);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const formData = new URLSearchParams();
            const hashedPassword = hashSync(password, salt);
            formData.append("user", username);
            formData.append("password", password);

            const res = await axios.post(
                `${API_URL}/loginform`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        //"Access-Control-Allow-Origin": "*",
                    },
                    withCredentials: true, // important if you expect cookies from the backend
                }
            );
            if (res.data.token) {

                Cookies.set("session", res.data.token, {
                    expires: 30, // 30 days
                    secure: true,
                    sameSite: "Strict",
                });
                setSession(res.data.token);
                console.log("Login success", res.data);
            }
            // Redirect to dashboard or set auth state
        } catch (err) {
            console.error(err);
            setError("Credenciales inválidas");
        }
    };

    // Check if the user is already logged in
    useEffect(() => {
        if (session) {
            // Redirect to dashboard or set auth state
            window.location.href = "/gifts";
            console.log("User is already logged in");
        }
    }, [session]);


    return (
        <div className='w-screen h-screen flex items-start justify-center bg-gray-900 pt-24'>
            <motion.div
                className='bg-gray-800 bg-opacity-50 backdrop-blur-md p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-700'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h2 className='text-2xl font-burbankBig text-white mb-6 text-center'>Iniciar Sesión</h2>
                <form className='space-y-5' onSubmit={handleSubmit}>
                    <div>
                        <label className='block text-sm text-gray-300 mb-1' htmlFor='username'>
                            Nombre de usuario
                        </label>
                        <div className='relative'>
                            <User className='absolute left-3 top-2.5 text-gray-400' size={20} />
                            <input
                                type='text'
                                id='username'
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className='w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Ingresa tu usuario'
                            />
                        </div>
                    </div>

                    <div>
                        <label className='block text-sm text-gray-300 mb-1' htmlFor='password'>
                            Contraseña
                        </label>
                        <div className='relative'>
                            <Key className='absolute left-3 top-2.5 text-gray-400' size={20} />
                            <input
                                type={showPassword ? "text" : "password"}
                                id='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className='w-full pl-10 pr-10 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Ingresa tu contraseña'
                            />
                            <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute right-2 top-2.5 text-sm text-blue-400 hover:text-blue-300 focus:outline-none'
                            >
                                {showPassword ? "Ocultar" : "Mostrar"}
                            </button>
                        </div>
                    </div>

                    {error && <p className='text-red-400 text-sm text-center font-burbankBold'>{error}</p>}

                    <div className='flex items-center justify-between'>
                        <button
                            type='submit'
                            className='bg-blue-600 hover:bg-blue-700 text-white font-burbankBold py-2 px-4 rounded-lg w-full transition-all'
                        >
                            Ingresar
                        </button>
                    </div>
                </form>

                <div className='mt-4 text-center'>
                    <button className='text-sm text-blue-400 hover:underline'>¿Olvidaste tu contraseña?</button>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
