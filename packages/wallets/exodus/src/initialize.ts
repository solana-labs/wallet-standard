import { registerWallet } from './register.js';
import { ExodusWallet } from './wallet.js';
import type { WindowExodus } from './window.js';

export function initialize(exodus: WindowExodus): void {
    registerWallet(new ExodusWallet(exodus));
}
