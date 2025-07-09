import { Account } from "../accounts";
interface AccountCardProps {
    account: Account
    selected?: boolean;
    onClick?: () => void;
}

const AccountCard: React.FC<AccountCardProps> = ({ account, selected, onClick }) => {
    return (
        <div
            onClick={onClick}
            className={`p-4 rounded-lg cursor-pointer border transition-all bg-gray-800 hover:border-blue-500 ${selected ? 'border-blue-500' : 'border-gray-700'
                }`}
        >
            <div className='flex flex-col items-center'>

                <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {[account.displayName.charAt(0).toUpperCase(), account.displayName.charAt(account.displayName.length-2).toUpperCase(), account.displayName.charAt(account.displayName.length-1).toUpperCase()]}
                    </div>
                </div>
                <p className='text-white font-semibold'>{account.displayName}</p>
                <p className='text-sm text-gray-400'>Regalos restantes: {account.remainingGifts}</p>
                <p className='text-sm text-gray-400'>PaVos: {account.pavos}</p>
            </div>
        </div>
    );
};

export default AccountCard;