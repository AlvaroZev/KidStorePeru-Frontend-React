import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Header from "../components/common/Header";
import { API_URL } from "../App";
import AccountsTable from "../components/accounts/AccontsTable";
import AddAccountModal from "../components/accounts/AddAccountModal";
import { Account } from "../components/accounts";

const FortniteAdminAccountsPage = () => {
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [showAddModal, setShowAddModal] = useState(false);

	const token = Cookies.get("session");

	const fetchAccounts = async () => {
		try {
			const res = await axios.get(`${API_URL}/allfortniteaccounts`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (res.data && res.data.length !== 0) {
				const parsedAccounts: Account[] = res.data.map((acc: any) => ({
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
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Cuentas de Fortnite' />

			{showAddModal && (
				<AddAccountModal
					onClose={() => setShowAddModal(false)}
					onSuccess={() => {fetchAccounts(); setShowAddModal(false);}}
				/>
			)}

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				<div className='flex justify-end mb-4'>
					<button
						onClick={() => setShowAddModal(true)}
						className='bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-500'
					>
						Añadir Cuenta
					</button>
				</div>
				<AccountsTable accounts={accounts} onDelete={deleteAccount} />
			</main>
		</div>
	);
};

export default FortniteAdminAccountsPage;
