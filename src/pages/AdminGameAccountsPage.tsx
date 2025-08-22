import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import axios from "axios";
import Header from "../components/common/Header";
import { API_URL } from "../App";
import AccountsTable from "../components/accounts/AccontsTable";
import AddAccountModal from "../components/accounts/AddAccountModal";
import { Account, rawAccount, rawAccountResponse } from "../components/accounts";

const FortniteAdminAccountsPage = () => {
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [showAddModal, setShowAddModal] = useState(false);

	const token = Cookies.get("session");

	const fetchAccounts = async () => {
		try {
			const res = await axios.get(`${API_URL}/allfortniteaccounts`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			const data : rawAccountResponse = res.data

			if (data.success && data.gameAccounts.length !== 0) {
				const parsedAccounts: Account[] = res.data.gameAccounts.map((acc: rawAccount) => ({
					id: acc.id,
					displayName: acc.displayName,
					pavos: acc.pavos ?? 0,
					remainingGifts: acc.remainingGifts ?? 0,
				}));
				console.log("Fetched accounts:", parsedAccounts);
				setAccounts(parsedAccounts);
			} else {
				console.log("No Fortnite accounts found");
				setAccounts([]);
				return;
			}
		} catch (err) {
			console.error("Error fetching Fortnite accounts", err);
		}
	};

	const deleteAccount = async (accountId: string) => {
		try {
			const res = await axios.post(`${API_URL}/disconnectfortniteaccount`, { id: accountId }, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (res.status === 200) fetchAccounts();
			else throw new Error("Failed to delete Fortnite account");
		} catch (err) {
			console.error("Error deleting Fortnite account", err);
		}
	};

	useEffect(() => {
		fetchAccounts();
	}, []);

	return (
		<div className="flex">
			{/* Main content area */}
			<div className="flex-1 min-h-screen bg-gray-900 pt-20 px-6 overflow-y-auto ml-64">
				{showAddModal && (
					<AddAccountModal
						onClose={() => setShowAddModal(false)}
						onSuccess={() => {fetchAccounts(); setShowAddModal(false);}}
					/>
				)}

				<motion.div className="bg-gray-800 bg-opacity-50 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-7xl border border-gray-700">
					<h1 className="text-2xl font-bold text-white mb-6 text-center">
						🎮 Cuentas de Fortnite - Administrador
					</h1>
					<div className="text-center text-gray-400 mb-6">
						{accounts.length === 0 ? (
							<p>No hay cuentas de Fortnite registradas</p>
						) : (
							<p>Total de cuentas: {accounts.length}</p>
						)}
					</div>
					<div className='flex justify-end mb-4'>
						<button
							onClick={() => setShowAddModal(true)}
							className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold shadow'
						>
							➕ Añadir Cuenta
						</button>
					</div>
					<AccountsTable accounts={accounts} onDelete={deleteAccount} />
				</motion.div>
			</div>
		</div>
	);
};

export default FortniteAdminAccountsPage;
