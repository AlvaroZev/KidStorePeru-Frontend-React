import {
  BarChart2,
  DollarSign,
  Menu,
  Settings,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  LogOut,
  Users,
} from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import bannerImage from "../../../assets/Banner.png";

const Sidebar = ({ admin }: { admin: boolean }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const SIDEBAR_ITEMS_Admin = [
    { name: "Regalos", icon: ShoppingBag, color: "#8B5CF6", href: "/gifts" },
    { name: "Usuarios (Admin)", icon: Users, color: "#EC8417", href: "/usersadminaccounts" },
    { name: "Cuentas Fortnite (Admin)", icon: Users, color: "#EC4899", href: "/fortniteadminaccounts" },
    { name: "Cuentas Fortnite", icon: Users, color: "#EC4899", href: "/fortniteaccounts" },
    { name: "Historial (Admin)", icon: DollarSign, color: "#10B981", href: "/transactionsadminhistory" },
    { name: "Historial", icon: DollarSign, color: "#10B981", href: "/transactionshistory" },
    { name: "Cerrar Sesión", icon: LogOut, color: "#F87171", href: "/logout" },
  ];

  const SIDEBAR_ITEMS_User = [
    { name: "Regalos", icon: ShoppingBag, color: "#8B5CF6", href: "/gifts" },
    { name: "Cuentas Fortnite", icon: Users, color: "#EC4899", href: "/fortniteaccounts" },
    { name: "Historial", icon: DollarSign, color: "#10B981", href: "/transactionshistory" },
    { name: "Cerrar Sesión", icon: LogOut, color: "#F87171", href: "/logout" },
  ];

  const SIDEBAR_ITEMS = admin ? SIDEBAR_ITEMS_Admin : SIDEBAR_ITEMS_User;

  if (window.location.pathname === "/") return null;

  return (
    <motion.div
      className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${isSidebarOpen ? "w-64" : "w-20"
        }`}
      animate={{ width: isSidebarOpen ? 256 : 80 }}
    >
      <div className='h-full bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700'>
        {/* Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className='p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit'
        >
          <Menu size={24} />
        </motion.button>

        {/* Banner */}
        {isSidebarOpen && (
          <div className="mt-4 mb-6 bg-gray-700 bg-opacity-60 rounded-lg p-2 flex justify-center items-center">
            <img
              src={bannerImage}
              alt="Sidebar Banner"
              className="max-w-full h-auto filter invert contrast-125"
            />
          </div>
        )}

        {/* Navigation */}
        <nav className='flex-grow'>
          {SIDEBAR_ITEMS.map((item) => (
            <Link key={item.href} to={item.href}>
              <motion.div className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2'>
                <item.icon size={20} style={{ color: item.color, minWidth: "20px" }} />
                <AnimatePresence>
                  {isSidebarOpen && (
                    <motion.span
                      className='ml-4 whitespace-nowrap'
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2, delay: 0.3 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          ))}
        </nav>
      </div>
    </motion.div>
  );
};

export default Sidebar;
