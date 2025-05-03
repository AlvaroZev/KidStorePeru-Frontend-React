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


function App() {
	const [isAuthenticated, setIsAuthenticated] = useState(!!Cookies.get("session"));

	useEffect(() => {
		const interval = setInterval(() => {
			const session = Cookies.get("session");
			setIsAuthenticated(!!session);
		}, 1000); // Check every second

		return () => clearInterval(interval);
	}, []);
	return (
		<div className='flex h-screen bg-gray-900 text-gray-100 overflow-hidden'>
			{/* BG */}
			<div className='fixed inset-0 z-0'>
				<div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80' />
				<div className='absolute inset-0 backdrop-blur-sm' />
			</div>
			{isAuthenticated && <Sidebar />}

			<Routes>
				<Route path='/' element={<LoginPage />} />
				<Route
					path='/products'
					element={
						<ProtectedRoute>
							<ProductsPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/users'
					element={
						<ProtectedRoute>
							<UsersPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path='/sales'
					element={
						<ProtectedRoute>
							<SalesPage />
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
			</Routes>
		</div>
	);
}

export default App;
