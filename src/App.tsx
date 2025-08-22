import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/navigation/Sidebar";
import ProductsPage from "./pages/ProductsPage";
import UsersPage from "./pages/UsersPage";
import OrdersPage from "./pages/OrdersPage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import FortniteAccountsPage from "./pages/GameAccountsPage";
import FortniteAdminAccountsPage from "./pages/AdminGameAccountsPage";
import { useEffect, useState } from "react";
import ProtectedRoute from "./components/navigation/ProtectedRoute";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import React from "react";
import { SidebarProvider } from "./components/navigation/SidebarContext";

export const API_URL = "https://backendregalos.kidstoreperu.com";
//export const API_URL =  "http://localhost:8080";

interface SessionPayload {
  admin?: boolean;
  exp: number;
  user_id: string;
  username: string;
}

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const checkSession = async () => {
    const session = Cookies.get("session");

    if (!session) {
      setIsAuthenticated(false);
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/protected`, {
        headers: {
          Authorization: `Bearer ${session}`,
        },
      });

      if (response.status === 200) {
        const decoded = jwtDecode<SessionPayload>(session);
        setIsAuthenticated(true);
        setIsAdmin(decoded.admin === true);
      } else {
        Cookies.remove("session");
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    } catch (err) {
      console.error("Session validation failed:", err);
      Cookies.remove("session");
      setIsAuthenticated(false);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {

    checkSession();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80" />
          <div className="absolute inset-0 backdrop-blur-sm" />
        </div>

        {isAuthenticated && <Sidebar admin={isAdmin} />}

        <Routes>
        <Route
          path="/"
          element={
            <LoginPage />
          }
        />
        <Route
          path="/gifts"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        {isAdmin && (
          <>
            <Route
              path="/usersadminaccounts"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/fortniteadminaccounts"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <FortniteAdminAccountsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/transactionsadminhistory"
              element={
                <ProtectedRoute isAuthenticated={isAuthenticated}>
                  <AdminOrdersPage />
                </ProtectedRoute>
              }
            />
          </>
        )}
        <Route
          path="/fortniteaccounts"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <FortniteAccountsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/transactionshistory"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/logout"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <LogoutPage />
            </ProtectedRoute>
          }
        />
        </Routes>
      </div>
    </SidebarProvider>
  );
};

export default App;
