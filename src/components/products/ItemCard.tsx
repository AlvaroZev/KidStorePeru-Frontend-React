// components/ItemCard.tsx
import React from "react";
import { ShopEntry } from "../../pages/ProductsPage";

interface Item {
	name: string;
	image: string;
	vBucks: number;
	rarity: string;
    category: string;
}



interface Props {
	item: ShopEntry;
	onClick?: (item: ShopEntry) => void;
	selected?: boolean;
}

const ItemCard: React.FC<Props> = ({ item, onClick, selected }) => {

    const handleClick = () => {
        if (onClick) {
            onClick(item);
        }
    };
	return (
		<div
			onClick={handleClick}
			className={`p-3 border rounded-lg cursor-pointer transition-all ${
				selected ? "border-blue-400" : "border-gray-700"
			} bg-gray-900 hover:border-blue-500`}
		>
			<img src={item?.itemDisplay?.image} alt={item.itemDisplay?.name} className='w-full h-36 object-contain rounded mb-2' />
			<p className='font-semibold text-white'>{item.itemDisplay?.name}</p>
			<p className='text-sm text-gray-400'>{item.itemDisplay?.rarity}</p>
			<p className='text-blue-400 mt-1'>{item.itemDisplay?.vBucks} V-Bucks</p>
		</div>
	);
};

export default ItemCard;
