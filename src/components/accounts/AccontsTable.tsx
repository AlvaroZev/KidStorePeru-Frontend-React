import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { Account } from "./types";

interface Props {
	accounts: Account[];
	onDelete: (id: string) => void;
}

const AccountsTable: React.FC<Props> = ({ accounts, onDelete }) => {
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
			className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700"
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.2 }}
		>
			<div className="flex justify-between items-center mb-6">
				<h2 className="text-xl font-semibold text-gray-100">Cuentas Fortnite</h2>
				<div className="relative">
					<input
						type="text"
						placeholder="Buscar cuenta..."
						className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Nombre
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Pavos
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
								Regalos Restantes
							</th>
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
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
								<td className="px-6 py-4 whitespace-nowrap text-gray-100 font-medium">
									{acc.displayName}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-gray-300">
									{acc.pavos}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-gray-300">
									{acc.remainingGifts}
								</td>
								<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
									<button
										className="text-red-400 hover:text-red-300"
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
