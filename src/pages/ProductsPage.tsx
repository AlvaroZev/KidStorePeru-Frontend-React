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
import { s } from 'framer-motion/client';

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
	offerId?: string;
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
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const [showErrorModal, setShowErrorModal] = useState(false);

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
					offerId: entry.offerId,
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

	const sendGift = async (recipient: Friend, creatorCode: string) => {
		if (!selectedItem || !selectedAccount) return;

		try {
			const res = await axios.post(
				`${API_URL}/sendGift`,
				{
					account_id: selectedAccount.id,
					sender_username: selectedAccount.displayName,
					receiver_id: recipient.id,
					receiver_username: recipient.username,
					gift_id:  selectedItem.offerId || '',
					gift_price: selectedItem.finalPrice,
					gift_name: selectedItem.itemDisplay?.name || 'Sin nombre',
					message: `¡Disfruta tu regalo de ${selectedAccount.displayName}!`,
					gift_image: selectedItem.itemDisplay?.image || '',
					creator_code: creatorCode, // Añadir el código de creador

				},
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			if (res.status === 200) {
				setShowGiftModal(false);
				setShowSuccessModal(true);

				console.log(`Gift sent successfully to ${recipient.username}`);
			} else {
				
				console.error('Error sending gift:', res.data);
			}
		} catch (err) {
			setShowErrorModal(true);
				setShowGiftModal(false);
			console.error('Error sending gift', err);
		}
	}

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
					onClose={() => {setShowGiftModal(false);fetchAccounts();}}
					selectedItem={selectedItem}
					selectedAccount={selectedAccount}
					onSend={(recipient: Friend, creatorCode: string) => {
						if (!selectedItem || !selectedAccount) return;
						sendGift(recipient, creatorCode);
						console.log(`Enviando ${creatorCode} ${selectedItem?.itemDisplay?.name} a ${recipient}`);
						
					}}
				/>
			)}

			{showErrorModal && (
				<motion.div
					className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<motion.div
						className='bg-gray-800 rounded-2xl p-6 w-full max-w-md'
						initial={{ scale: 0.8 }}
						animate={{ scale: 1 }}
						exit={{ scale: 0.8 }}
					>
						<h2 className='text-xl text-red-500 mb-4'>Error</h2>
						<p className='mb-2 text-white'>No se pudo enviar el regalo. Por favor, inténtalo de nuevo más tarde.</p>
						<button onClick={() => setShowErrorModal(false)} className='px-4 py-2 bg-gray-600 rounded text-white'>
							Cerrar
						</button>
					</motion.div>
				</motion.div>
			)}

			{showSuccessModal && (
				<motion.div
					className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
				>
					<motion.div
						className='bg-gray-800 rounded-2xl p-6 w-full max-w-md'
						initial={{ scale: 0.8 }}
						animate={{ scale: 1 }}
						exit={{ scale: 0.8 }}
					>
						<h2 className='text-xl text-white mb-4'>Éxito</h2>
						<p className='mb-2 text-white'>El regalo se ha enviado correctamente.</p>
						<button onClick={() => setShowSuccessModal(false)} className='px-4 py-2 bg-gray-600 rounded text-white'>
							Cerrar
						</button>
					</motion.div>
				</motion.div>
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
