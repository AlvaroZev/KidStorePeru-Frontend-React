import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Account } from "./types";
import GiftSlotStatusInline from "../products/GiftSlotStatusInline";

interface Props {
	accounts: Account[];
	onDelete: (id: string) => void;
	showGiftStatus?: boolean;
}

const AccountsTable: React.FC<Props> = ({ accounts, onDelete, showGiftStatus = false }) => {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredAccounts = useMemo(() => {
		const term = searchTerm.toLowerCase();
		return accounts.filter((acc) =>
			acc.displayName.toLowerCase().includes(term)
		);
	}, [searchTerm, accounts]);

	const handleDelete = (id: string) => {
		if (confirm("¿Estás seguro de que deseas eliminar esta cuenta?")) {
			onDelete(id);
		}
	};

	return (
		<motion.div
			className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-4 sm:p-6 border border-gray-700"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
				<h2 className="text-lg sm:text-xl font-semibold text-gray-100">Cuentas Fortnite</h2>
				<div className="relative w-full sm:w-auto">
					<input
						type="text"
						placeholder="Buscar cuenta..."
						className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64 text-sm sm:text-base"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						autoComplete="off"
					/>
					<Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="min-w-full divide-y divide-gray-700">
					<thead>
						<tr>
							<th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Nombre
							</th>
							<th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Pavos
							</th>
							{showGiftStatus ? (
								<th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Estado de Regalos
								</th>
							) : (
								<th className="hidden sm:table-cell px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
									Regalos Restantes
								</th>
							)}
							<th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Acciones
							</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-gray-700">
						{filteredAccounts.map((acc) => (
							<motion.tr
								key={acc.id}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.2 }}
							>
															<td className="px-3 sm:px-6 py-4 whitespace-nowrap text-gray-100 font-medium">
								{acc.displayName}
							</td>
							<td className="px-3 sm:px-6 py-4 whitespace-nowrap text-gray-300">
								{acc.pavos}
							</td>
							{showGiftStatus ? (
								<td className="hidden sm:table-cell px-3 sm:px-6 py-4">
									<GiftSlotStatusInline 
										giftSlotStatus={acc.giftSlotStatus}
									/>
								</td>
							) : (
								<td className="hidden sm:table-cell px-3 sm:px-6 py-4 whitespace-nowrap text-gray-300">
									{acc.remainingGifts}
								</td>
							)}
							<td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-300">
									<button
										className="bg-red-600 hover:bg-red-700 px-3 py-1 text-xs rounded font-semibold"
										onClick={() => handleDelete(acc.id)}
									>
										Eliminar
									</button>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
		</motion.div>
	);
};

export default AccountsTable;
