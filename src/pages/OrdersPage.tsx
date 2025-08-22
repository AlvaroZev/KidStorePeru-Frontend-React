import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import axios from "axios";
import Header from "../components/common/Header";
import OrdersTable from "../components/orders/OrdersTable";
import { API_URL } from "../App";
import { rawTransactionsResponse, Transaction } from "../components/orders/types";
import MainContent from "../components/navigation/MainContent";

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
		<MainContent>
				<motion.div className="bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg w-full max-w-7xl border border-gray-700">
					<h1 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">
						📋 Historial de Órdenes
					</h1>
					<div className="text-center text-gray-400 mb-4 sm:mb-6">
						{transactions.length === 0 ? (
							<p>No hay transacciones disponibles</p>
						) : (
							<p>Total de transacciones: {transactions.length}</p>
						)}
					</div>
					<OrdersTable transactions={transactions} />
				</motion.div>
		</MainContent>
	);
};

export default OrdersPage;
