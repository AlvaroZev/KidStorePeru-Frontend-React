import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import axios from "axios";
import Header from "../components/common/Header";
import { API_URL } from "../App";
import AccountsTable from "../components/accounts/AccontsTable";
import AddAccountModal from "../components/accounts/AddAccountModal";
import { Account, rawAccount } from "../components/accounts";
import MainContent from "../components/navigation/MainContent";

const FortniteAccountsPage = () => {
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [showAddModal, setShowAddModal] = useState(false);

	const token = Cookies.get("session");

	const fetchAccounts = async () => {
		try {
			const res = await axios.get(`${API_URL}/fortniteaccountsofuser`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (res.data && res.data.success && res.data.gameAccounts && res.data.gameAccounts.length !== 0) {
				const parsedAccounts: Account[] = res.data.gameAccounts.map((acc: rawAccount) => ({
					id: acc.id,
					displayName: acc.displayName,
					pavos: acc.pavos ?? 0,
					remainingGifts: acc.remainingGifts ?? 0,
					giftSlotStatus: acc.giftSlotStatus,
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

	const addAccount = async (data: Partial<Account>) => {
		try {
			const res = await axios.post(`${API_URL}/connectfaccount`, data, {
				headers: { Authorization: `Bearer ${token}` },
			});
			if (res.status === 200) fetchAccounts();
			else throw new Error("Failed to add Fortnite account");
		} catch (err) {
			console.error("Error adding Fortnite account", err);
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
		<MainContent>
				{showAddModal && (
					<AddAccountModal
						onClose={() => setShowAddModal(false)}
						onSuccess={() => {fetchAccounts(); setShowAddModal(false);}}
					/>
				)}

				<motion.div className="bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg w-full max-w-7xl border border-gray-700">
					<h1 className="text-xl sm:text-2xl font-burbankBlack text-white mb-4 sm:mb-6 text-center">
						🎮 Cuentas de Fortnite
					</h1>
					<div className="text-center text-gray-400 mb-4 sm:mb-6">
						{accounts.length === 0 ? (
							<p>No tienes cuentas de Fortnite conectadas</p>
						) : (
							<p>Total de cuentas: {accounts.length}</p>
						)}
					</div>
					<div className='flex justify-end mb-4'>
						<button
							onClick={() => setShowAddModal(true)}
							className='flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-3 sm:px-4 py-2 rounded font-semibold shadow text-sm sm:text-base'
						>
							➕ Añadir Cuenta
						</button>
					</div>
					<AccountsTable accounts={accounts} onDelete={deleteAccount} showGiftStatus={true} />
				</motion.div>
		</MainContent>
	);
};

export default FortniteAccountsPage;
