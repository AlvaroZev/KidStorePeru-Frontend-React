export type Account = {
    id: string;
    displayName: string;
    pavos: number;
    remainingGifts: number;
    };

export type rawAccount = {
    id: string;
    displayName: string;
    pavos: number;
    remainingGifts: number;
    };

export type rawAccountResponse = {
    success: boolean;
    gameAccounts: rawAccount[];
};