import ItemCard from '../components/products/ItemCard';




// pages/ProductsPage.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { API_URL } from '../App';
import axios from 'axios';
import Cookies from "js-cookie";
import AccountCard from '../components/products/AccountCard';
import GiftModal from '../components/products/GiftModal';
import { Account } from '../components/accounts';
import { Friend } from '../components/products/GiftModal';

// types/ShopTypes.ts
export interface ShopResponse {
	status: number;
	data: {
		hash: string;
		date: string;
		vbuckIcon: string;
		entries: ShopEntry[];
	};
}

export interface ShopEntry {
	regularPrice: number;
	finalPrice: number;
	layout?: { name?: string };
	bundle?: { name: string; image: string };
	newDisplayAsset?: {
		renderImages?: { image: string }[];
	};
	brItems?: {
		id: string;
		name: string;
		rarity?: {
			displayValue: string;
		};
		images?: {
			icon?: string;
			featured?: string;
		};
	}[];
	itemDisplay?: {
		name: string;
		image: string;
		vBucks: number;
		rarity: string;
		category: string;
	};

}




const ProductsPage: React.FC = () => {
	const [itemsByCategory, setItemsByCategory] = useState<Record<string, ShopEntry[]>>({});
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
	const [selectedItem, setSelectedItem] = useState<ShopEntry | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [loading, setLoading] = useState(true);
	const token = Cookies.get("session");
	const [showGiftModal, setShowGiftModal] = useState(false);


	useEffect(() => {
		fetchShop();
		fetchAccounts();
	}, []);

	const fetchShop = async () => {
		try {
			const res = await fetch('https://fortnite-api.com/v2/shop?language=es-419');
			const json: ShopResponse = await res.json();
			const categoryMap: Record<string, ShopEntry[]> = {};

			json.data.entries.forEach((entry: ShopEntry) => {
				const category = entry.layout?.name || 'Otros';
				const item = entry.brItems?.[0];
				if (!item) return;

				const name = item.name || 'Sin nombre';
				const image =
					entry.newDisplayAsset?.renderImages?.[0]?.image ||
					entry.bundle?.image ||
					item.images?.icon ||
					'';
				const rarity = item.rarity?.displayValue || 'Común';

				const displayItem: ShopEntry = {
					regularPrice: entry.regularPrice,
					finalPrice: entry.finalPrice,
					itemDisplay: {
						name,
						image,
						vBucks: entry.finalPrice,
						rarity,
						category,
					},
					bundle: entry.bundle,
					newDisplayAsset: entry.newDisplayAsset,
					brItems: [item],
				};

				if (!categoryMap[category]) categoryMap[category] = [];
				categoryMap[category].push(displayItem);
			});

			setItemsByCategory(categoryMap);
			setLoading(false);
		} catch (error) {
			console.error('Error fetching shop data:', error);
			setLoading(false);
		}
	};

	const fetchAccounts = async () => {
		try {
			const res = await axios.get(`${API_URL}/fortniteaccountsofuser`, {
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

	const handleItemClick = (item: ShopEntry) => {
		if (!selectedAccount) return;


		setShowGiftModal(true);
		setSelectedItem(item);
		// Aquí puedes manejar la lógica de compra del objeto
		console.log(`Comprando ${item.itemDisplay?.name} para la cuenta ${selectedAccount.displayName}`);
	};

	return (
		<div className='w-screen min-h-screen bg-gray-900 pt-20 px-6 overflow-y-auto'>
			{showGiftModal && (
				<GiftModal
					onClose={() => setShowGiftModal(false)}
					selectedItem={selectedItem}
					selectedAccount={selectedAccount}
					onSend={(recipient: Friend, creatorCode: string ) => {
				console.log(`Enviando ${creatorCode} ${selectedItem?.itemDisplay?.name} a ${recipient}`);
			setShowGiftModal(false);
					}}
				/>
			)}

			<motion.div
				className='bg-gray-800 bg-opacity-50 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-7xl border border-gray-700'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<h1 className='text-2xl font-bold text-white mb-4 text-center'>Selecciona una cuenta</h1>
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6'>
					{(accounts.length != 0) ? accounts.map((account) => (
						<AccountCard
							account={account}
							onClick={() => setSelectedAccount(account)}
							selected={selectedAccount?.id === account.id}
						/>
					)) : <h2 className='text-center text-gray-400'>No tienes cuentas de Fortnite</h2>}
				</div>

				<h2 className='text-2xl font-bold text-white mb-6 text-center'>Tienda de Fortnite</h2>
				<input
					type='text'
					placeholder='🔍 Buscar objeto...'
					className='w-full max-w-md mb-8 px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 mx-auto block'
					onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
				/>

				{loading ? (
					<p className='text-center text-gray-400'>Cargando tienda...</p>
				) : (
					Object.entries(itemsByCategory).map(([category, items]) => {
						const filtered = items.filter((item) =>
							item.itemDisplay?.name.toLowerCase().includes(searchTerm)
						);
						if (!filtered.length) return null;

						return (
							<div key={category} className='mb-12'>
								<h3 className='text-xl font-bold mb-4 uppercase text-center'>{category}</h3>
								<div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'>
									{filtered.map((item, idx) => (
										<ItemCard key={idx} item={item} onClick={handleItemClick} />
									))}
								</div>
							</div>
						);
					})
				)}
			</motion.div>
		</div>
	);
};

export default ProductsPage;
