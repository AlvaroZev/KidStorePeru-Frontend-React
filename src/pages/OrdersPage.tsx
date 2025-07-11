import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Header from "../components/common/Header";
import OrdersTable from "../components/orders/OrdersTable";
import { API_URL } from "../App";
import { rawTransactionsResponse, Transaction } from "../components/orders/types";

const OrdersPage: React.FC = () => {
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const token = Cookies.get("session");

		const fetchTransactions = async () => {
		try {
			const res = await axios.get(`${API_URL}/transactions`, {
				headers: { Authorization: `Bearer ${token}` },
			});

			if (res.status !== 200) {
				throw new Error("Failed to fetch transactions");
			}
			const data : rawTransactionsResponse = res.data

			const transactionsList = data.success && data.transactions.map((tx: any) => ({
				id: tx.ID,
				gameAccountID: tx.GameAccountID,
				senderName: tx.SenderName || null,
				receiverID: tx.ReceiverID,
				receiverName: tx.ReceiverName,
				objectStoreID: tx.ObjectStoreID,
				objectStoreName: tx.ObjectStoreName,
				regularPrice: tx.RegularPrice,
				finalPrice: tx.FinalPrice,
				giftImage: tx.GiftImage,
				createdAt: tx.CreatedAt,
			}));

			setTransactions(transactionsList || []);
		} catch (err) {
			console.error("Error fetching transactions", err);
		}
	};

	useEffect(() => {
		fetchTransactions();
	}, []);

	return (
		<div className="flex-1 overflow-auto relative z-10">
			<Header title="Historial de Órdenes" />
			<main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
				<OrdersTable transactions={transactions} />
			</main>
		</div>
	);
};

export default OrdersPage;
