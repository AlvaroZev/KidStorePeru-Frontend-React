import { FiRefreshCw } from "react-icons/fi";
import { Account } from "../accounts";

interface AccountCardProps {
  account: Account;
  selected?: boolean;
  onClick?: () => void;
  onRefresh?: () => void;
}

const AccountCard: React.FC<AccountCardProps> = ({
  account,
  selected,
  onClick,
  onRefresh,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer border rounded-xl p-5 shadow-xl transition transform hover:scale-105 ${
        selected
          ? "bg-blue-800 border-blue-500"
          : "bg-slate-800 border-slate-600"
      }`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRefresh?.();
        }}
        className="absolute top-2 right-2 bg-slate-700 p-2 rounded-full hover:bg-slate-600"
        title="Actualizar cuenta"
      >
        <FiRefreshCw className="text-white text-lg" />
      </button>

      <h3 className="text-xl font-burbankBold mb-2 text-center text-pink-400">
        {account.displayName}
      </h3>
      <p className="text-sm">💰 Pavos: {account.pavos}</p>
      <p className="text-sm">📤 Enviados: {5-(account.remainingGifts  ?? 0)}</p>
      <p className="text-sm">
        🎁 Disponibles: {account.remainingGifts ?? 5}
      </p>
    </div>
  );
};

export default AccountCard;
