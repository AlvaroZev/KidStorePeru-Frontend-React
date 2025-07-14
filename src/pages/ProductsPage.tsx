// ProductsPage.tsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Cookies from "js-cookie";
import { API_URL } from "../App";
import ItemCard from "../components/products/ItemCard";
import AccountCard from "../components/products/AccountCard";
import GiftModal from "../components/products/GiftModal";
import { Account, rawAccount, rawAccountResponse } from "../components/accounts";
import { Friend } from "../components/products/GiftModal";

// --- Types ---
export type RawEntry = {
  status: number;
  data: {
    hash: string;
    date: string; // dateTime as ISO string
    vbuckIcon: string;

    entries: {
      regularPrice: number;
      finalPrice: number;
      devName: string;
      offerId: string;
      inDate: string; // dateTime
      outDate: string; // dateTime

      bundle?: {
        name: string;
        info: string;
        image: string;
      };

      banner?: {
        value: string;
        intensity: string;
        backendValue: string;
      };

      offerTag?: {
        id: string;
        text: string;
      };

      giftable: boolean;
      refundable: boolean;
      sortPriority: number;

      layoutId: string;

      layout: {
        id: string;
        name: string;
        category?: string;
        index: number;
        rank: number;
        showIneligibleOffers: string;
        background?: string;
        useWidePreview: boolean;
        displayType: string;

        textureMetadata?: { key: string; value: string }[];
        stringMetadata?: { key: string; value: string }[];
        textMetadata?: { key: string; value: string }[];
      };

      colors?: {
        color1: string;
        color2: string;
        color3: string;
        textBackgroundColor: string;
      };

      tileSize: string;
      displayAssetPath: string;
      newDisplayAssetPath: string;

      newDisplayAsset?: {
        id: string;
        cosmeticId?: string;

        materialInstances?: {
          id?: string;
          primaryMode?: string;
          productTag?: string;
          Images?: Record<string, string>;
          Colors?: Record<string, string>;
          Scalings?: Record<string, number>;
          Flags?: Record<string, boolean>;
        }[];

        renderImages: {
          productTag: string;
          fileName: string;
          image: string;
        }[];
      };

      brItems?: {
        id: string;
        name: string;
        description: string;
        exclusiveDescription?: string;
        unlockRequirements?: string;
        customExclusiveCallout?: string;

        type: {
          value: string;
          displayValue: string;
          backendValue: string;
        };

        rarity: {
          value: string;
          displayValue: string;
          backendValue: string;
        };

        series: {
          value: string;
          image: string;
          colors: string[];
          backendValue: string;
        } | null;

        set: {
          value: string;
          text: string;
          backendValue: string;
        };

        introduction: {
          chapter: string;
          season: string;
          text: string;
          backendValue: number;
        };

        images: {
          smallIcon: string;
          icon: string;
          featured?: string | null;
          lego?: {
            small: string;
            large: string;
            wide: string;
          };
          bean?: {
            small: string;
            large: string;
          };
          Other?: Record<string, string>;
        };

        variants?: {
          channel: string;
          type: string;
          options: {
            tag: string;
            name: string;
            unlockRequirements: string;
            image: string;
          }[];
        }[];

        builtInEmoteIds?: string[];
        searchTags?: string[];
        gameplayTags?: string[];
        metaTags?: string[];
        showcaseVideo?: string;
        dynamicPakId?: string;
        itemPreviewHeroPath?: string;
        displayAssetPath?: string;
        definitionPath?: string;
        path?: string;
        added: string; // dateTime
        shopHistory?: string[]; // array of dateTime
      }[];

      tracks?: {
        id: string;
        devName: string;
        title: string;
        artist: string;
        album: string;
        releaseYear: number;
        bpm: number;
        duration: number;

        difficulty: {
          vocals: number;
          guitar: number;
          bass: number;
          plasticBass: number;
          drums: number;
          plasticDrums: number;
        };

        gameplayTags?: string[];
        genres: string[];
        albumArt: string;
        added: string;
        shopHistory?: string[];
      }[];

      instruments?: {
        id: string;
        name: string;
        description: string;

        type: {
          value: string;
          displayValue: string;
          backendValue: string;
        };

        rarity: {
          value: string;
          displayValue: string;
          backendValue: string;
        };

        images: {
          small: string;
          large: string;
        };

        series: {
          value: string;
          image: string;
          colors: string[];
          backendValue: string;
        };

        gameplayTags: string[];
        path: string;
        showcaseVideo: string;
        added: string;
        shopHistory: string[];
      }[];

      cars?: {
        id: string;
        vehicleId: string;
        name: string;
        description: string;

        type: {
          value: string;
          displayValue: string;
          backendValue: string;
        };

        rarity: {
          value: string;
          displayValue: string;
          backendValue: string;
        };

        images: {
          small: string;
          large: string;
        };

        series: {
          value: string;
          image: string;
          colors: string[];
          backendValue: string;
        };

        gameplayTags: string[];
        path: string;
        showcaseVideo: string;
        added: string;
        shopHistory: string[];
      }[];

      legoKits?: {
        id: string;
        name: string;

        type: {
          value: string;
          displayValue: string;
          backendValue: string;
        };

        series: {
          value: string;
          image: string;
          colors: string[];
          backendValue: string;
        };

        gameplayTags: string[];
        images: {
          small: string;
          large: string;
          wide: string;
        };
        path: string;
        added: string;
        shopHistory: string[];
      }[];
    }[];
  };
};

export interface ShopEntry {
  regularPrice: number;
  finalPrice: number;
  offerId?: string;
  itemDisplay: {
    name: string;
    type: string;
    image: string;
    vBucks: number;
    rarity: string;
    category: string;
    color?: string;
    color2?: string;
    color3?: string;
    backgroundColor?: string;
    backgroundColor2?: string;
  };
}

const ProductsPage: React.FC = () => {
  const [itemsByCategory, setItemsByCategory] = useState<
    Record<string, ShopEntry[]>
  >({});
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [selectedItem, setSelectedItem] = useState<ShopEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const token = Cookies.get("session");

  useEffect(() => {
    fetchShop();
    fetchAccounts();
  }, []);

  const fetchShop = async () => {
    try {
      const res = await fetch(
        "https://fortnite-api.com/v2/shop?language=es-419"
      );
      const json: RawEntry = await res.json();
      const entries = json.data?.entries || [];

      const categoryMap: Record<string, ShopEntry[]> = {};

      entries.forEach((entry) => {
        if (entry.giftable === false) return; // Skip non-giftable items
        const layout = entry.layout || {
          name: "Otros",
        };
        const category = layout.name || "Otros";

        // Prefer brItems[0], but fallback to cars, instruments, tracks, legoKits
        const item =
          entry.brItems?.[0] ||
          entry.cars?.[0] ||
          entry.instruments?.[0] ||
          entry.tracks?.[0] ||
          entry.legoKits?.[0];

        if (!item) return;

        const name =
          entry.bundle?.name ||
          // Use devName if no item.name exists
          (item as any).name ||
          (item as any).title ||
          entry.devName ||
          "Sin nombre";

        const image =
          entry.newDisplayAsset?.renderImages?.[0]?.image ||
          entry.bundle?.image ||
          (item as any).images?.icon ||
          (item as any).images?.small ||
          (item as any).images?.large ||
          (item as any).albumArt ||
          ""; // Fallback to empty string

        const rarity =
          (item as any).rarity?.displayValue ||
          (item as any).rarity?.value ||
          "Común";
        const type =
          entry.bundle?.info ||
          (item as any).type?.displayValue ||
          (item as any).type?.value ||
          entry.layout?.name ||
          "Desconocido";

// Add color properties if available and prefix with '#'
const color = entry.colors?.color1 ? `#${entry.colors.color1}` : "";
const color2 = entry.colors?.color2 ? `#${entry.colors.color2}` : "";
const color3 = entry.colors?.color3 ? `#${entry.colors.color3}` : "";
const backgroundColor = entry.colors?.textBackgroundColor ? `#${entry.colors.textBackgroundColor}` : "";
const backgroundColor2 = entry.colors?.color2 ? `#${entry.colors.color2}` : "";

const displayItem: ShopEntry = {
  regularPrice: entry.regularPrice ?? 0,
  finalPrice: entry.finalPrice ?? 0,
  offerId: entry.offerId ?? "unknown-offer",
  itemDisplay: {
    name,
    type,
    image,
    vBucks: entry.finalPrice ?? 0,
    rarity,
    category,
    color,
    color2,
    color3,
    backgroundColor,
    backgroundColor2,
  },
};

        if (!categoryMap[category]) categoryMap[category] = [];
        categoryMap[category].push(displayItem);
      });

      setItemsByCategory(categoryMap);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching shop data:", error);
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
          gift_id: selectedItem.offerId || "",
          gift_price: selectedItem.finalPrice,
          gift_name: selectedItem.itemDisplay.name,
          message: `¡Disfruta tu regalo de ${selectedAccount.displayName}!`,
          gift_image: selectedItem.itemDisplay.image,
          creator_code: creatorCode,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data : {
        success: boolean,
        message?: string,
        error?: string
      } = res.data;
      
      if (res.status === 200 && data.success) {
        setShowGiftModal(false);
        setShowSuccessModal(true);
      } else {
        setShowErrorModal(true);
      }
    } catch (err) {
      setShowGiftModal(false);
      setShowErrorModal(true);
    }
  };

  const fetchAccounts = async () => {
    try {
      const res = await axios.get(`${API_URL}/fortniteaccountsofuser`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data: rawAccountResponse = res.data;
      console.log("Fetched accounts response:", data);
      if (data.success && data.gameAccounts.length !== 0) {
        const parsedAccounts: Account[] = res.data.gameAccounts.map(
          (acc: rawAccount) => ({
            id: acc.id,
            displayName: acc.displayName,
            pavos: acc.pavos ?? 0,
            remainingGifts: acc.remainingGifts ?? 0,
          })
        );
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
    setSelectedItem(item);
    setShowGiftModal(true);
  };

  return (
    <div className="w-screen min-h-screen bg-gray-900 pt-20 px-6 overflow-y-auto">
      {showGiftModal && selectedItem && selectedAccount && (
        <GiftModal
          onClose={() => {
            setShowGiftModal(false);
            fetchAccounts();
          }}
          selectedItem={selectedItem}
          selectedAccount={selectedAccount}
          onSend={sendGift}
        />
      )}

      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl text-red-500 mb-4">Error</h2>
            <p className="mb-2 text-white">No se pudo enviar el regalo.</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="px-4 py-2 bg-gray-600 rounded text-white"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl text-white mb-4">Éxito</h2>
            <p className="mb-2 text-white">Regalo enviado correctamente.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-4 py-2 bg-gray-600 rounded text-white"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <motion.div className="bg-gray-800 bg-opacity-50 backdrop-blur-md p-6 rounded-xl shadow-lg w-full max-w-7xl border border-gray-700">
        <h1 className="text-2xl font-bold text-white mb-4 text-center">
          Selecciona una cuenta
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {accounts.length > 0 ? (
            accounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                onClick={() => setSelectedAccount(account)}
                selected={selectedAccount?.id === account.id}
              />
            ))
          ) : (
            <h2 className="text-center text-gray-400">
              No tienes cuentas de Fortnite
            </h2>
          )}
        </div>

        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Tienda de Fortnite
        </h2>
        <input
          type="text"
          placeholder="🔍 Buscar objeto..."
          className="w-full max-w-md mb-8 px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 mx-auto block"
          onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
        />

        {loading ? (
          <p className="text-center text-gray-400">Cargando tienda...</p>
        ) : (
          Object.entries(itemsByCategory).map(([category, items]) => {
            const filtered = items.filter((item) =>
              item.itemDisplay.name.toLowerCase().includes(searchTerm)
            );
            if (!filtered.length) return null;

            return (
              <div key={category} className="mb-12">
                <h3 className="text-xl font-bold mb-4 uppercase text-center">
                  {category}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
