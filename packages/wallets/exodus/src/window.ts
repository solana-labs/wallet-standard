import type { PublicKey, SendOptions, Transaction } from '@solana/web3.js';

export interface ConnectInfo {
    publicKey: PublicKey;
}

export interface ExodusEvent {
    connect(connectInfo: ConnectInfo): void;
    disconnect(): void;
    accountChanged(newPublicKey: PublicKey): void;
}

export interface ExodusEventEmitter {
    on<E extends keyof ExodusEvent>(event: E, listener: ExodusEvent[E], context?: any): void;
    off<E extends keyof ExodusEvent>(event: E, listener: ExodusEvent[E], context?: any): void;
}

export interface ExodusSolana extends ExodusEventEmitter {
    publicKey: PublicKey | null;
    connect(options?: { onlyIfTrusted?: boolean }): Promise<{ publicKey: PublicKey }>;
    disconnect(): Promise<void>;
    signAndSendTransaction(transaction: Transaction, options?: SendOptions): Promise<{ signature: string }>;
    signTransaction(transaction: Transaction): Promise<Transaction>;
    signAllTransactions(transactions: Transaction[]): Promise<Transaction[]>;
    signMessage(encodedMessage: Uint8Array): Promise<{ signature: Uint8Array }>;
}

export interface WindowExodus {
    solana: ExodusSolana;
}

export interface ExodusWindow extends Window {
    exodus: WindowExodus;
}
