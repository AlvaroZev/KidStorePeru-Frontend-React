import {
  DollarSign,
  Menu,
  ShoppingBag,
  LogOut,
  Users,
  Gamepad2,
  History,
  UserCheck,
  Gift,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
// @ts-ignore
import logo from "../../../assets/Banner.png";
import { useSidebar } from "./SidebarContext";
import React from "react";

const Sidebar = ({ admin }: { admin: boolean }) => {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const location = useLocation();

  const SIDEBAR_ITEMS_Admin = [
    { name: "Regalos", icon: Gift, color: "#8B5CF6", href: "/gifts" },
    { name: "Usuarios (Admin)", icon: UserCheck, color: "#EC8417", href: "/usersadminaccounts" },
    { name: "Cuentas Fortnite (Admin)", icon: Gamepad2, color: "#EC4899", href: "/fortniteadminaccounts" },
    { name: "Cuentas Fortnite", icon: Gamepad2, color: "#3B82F6", href: "/fortniteaccounts" },
    { name: "Historial (Admin)", icon: History, color: "#10B981", href: "/transactionsadminhistory" },
    { name: "Historial", icon: History, color: "#F59E0B", href: "/transactionshistory" },
  ];

  const SIDEBAR_ITEMS_User = [
    { name: "Regalos", icon: Gift, color: "#8B5CF6", href: "/gifts" },
    { name: "Cuentas Fortnite", icon: Gamepad2, color: "#3B82F6", href: "/fortniteaccounts" },
    { name: "Historial", icon: History, color: "#F59E0B", href: "/transactionshistory" },
  ];

  const SIDEBAR_ITEMS = admin ? SIDEBAR_ITEMS_Admin : SIDEBAR_ITEMS_User;

  if (window.location.pathname === "/") return null;

  return (
    <motion.aside
      className={`h-screen bg-[#0e1014] text-white border-r border-slate-800 font-burbankMedium flex flex-col justify-between fixed left-0 top-0 z-50`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
      transition={{ type: "spring", stiffness: 260, damping: 30 }}
    >
      {/* Top Section */}
      <div>
        {/* Logo & Toggle Container */}
        <div
          className={`flex ${
            isSidebarOpen ? "justify-between" : "flex-col items-center gap-3"
          } px-4 py-6 border-b border-slate-700 shadow-md`}
        >
          {/* Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-full hover:bg-slate-700 transition-colors"
          >
            <Menu size={24} />
          </motion.button>

          {/* Logo */}
          <motion.div
            layout
            className="bg-white rounded-xl flex justify-center items-center shadow overflow-hidden"
            animate={{
              width: isSidebarOpen ? 96 : 48,
              height: isSidebarOpen ? 96 : 48,
            }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
          >
            <motion.img
              key={isSidebarOpen ? "open" : "closed"}
              src={logo}
              alt="KidStore Logo"
              className="w-full h-full object-cover rounded-xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-2">
          {SIDEBAR_ITEMS.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link key={item.href} to={item.href}>
                <motion.div
                  layout
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg font-burbankBold tracking-wide text-sm transition duration-150 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-700 to-purple-500 text-white shadow-md"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                  whileHover={{ x: 3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <item.icon size={20} style={{ color: item.color }} />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        layout
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2, delay: 0.05 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-800">
        <Link
          to="/logout"
          className="flex items-center justify-center gap-3 px-4 py-2 rounded-lg w-full bg-red-600 hover:bg-red-700 text-white font-burbankBold text-sm shadow transition"
        >
          <LogOut size={20} />
          {isSidebarOpen && <span>Cerrar Sesión</span>}
        </Link>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
