import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/navigation/Sidebar";

import OverviewPage from "./pages/OverviewPage";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import SalesPage from "./pages/SalesPage";
import OrdersPage from "./pages/OrdersPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import React, { useEffect, useState } from "react";
import ProtectedRoute from "./components/navigation/ProtectedRoute";
import Cookies from "js-cookie";
import LogoutPage from "./pages/LogoutPage";
import FortniteAccountsPage from "./pages/GameAccountsPage";
import { jwtDecode } from "jwt-decode";
import FortniteAdminAccountsPage from "./pages/AdminGameAccountsPage";

//export const API_URL =  "http://127.0.0.1:8080";
export const API_URL =  "https://kidstoreperu-backend-dev.up.railway.app";
interface SessionPayload {
  admin?: boolean;
  exp: number;
  user_id: string;
  username: string;
}

function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get("session"));
	  const [isAdmin, setIsAdmin] = useState(false);

useEffect(() => {
    const session = Cookies.get("session");
    setIsAuthenticated(!!session);

    if (session) {
      try {
        const decoded = jwtDecode<SessionPayload>(session);
		console.log("Decoded session:", decoded);
        setIsAdmin(decoded.admin === true);
      } catch (err) {
        console.error("Failed to decode session cookie:", err);
        setIsAdmin(false);
      }
    } else {
      setIsAdmin(false);
    }

}, []);

	return (
		<div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
			{/* BG */}
			<div className='fixed inset-0 z-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
				<div className='absolute inset-0 backdrop-blur-sm' />
			</div>
			{isAuthenticated && <Sidebar admin={isAdmin} />}

			<Routes>
				<Route path='/' element={<LoginPage />} />
				<Route
					path='/gifts'
					element={
						<ProtectedRoute>
							<ProductsPage />
						</ProtectedRoute>
					}
				/>
				{isAdmin ? (<>
				<Route
					path='/usersadminaccounts'
					element={
						<ProtectedRoute>
							<UsersPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/fortniteadminaccounts'
					element={
						<ProtectedRoute>
							<FortniteAdminAccountsPage />
						</ProtectedRoute>
					}
				/>
				</>) : null}
				<Route
					path='/fortniteaccounts'
					element={
						<ProtectedRoute>
							<FortniteAccountsPage />
						</ProtectedRoute>
					}
				/>

				
				<Route
					path='/orders'
					element={
						<ProtectedRoute>
							<OrdersPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/analytics'
					element={
						<ProtectedRoute>
							<AnalyticsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/settings'
					element={
						<ProtectedRoute>
							<SettingsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/logout'
					element={
						<ProtectedRoute>
							<LogoutPage />
						</ProtectedRoute>
					}
				/>
			</Routes>
		</div>
	);
}

export default App;
