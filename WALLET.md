# Wallet Standard for Wallets

This guide is for wallets that want to implement the Wallet Standard. This can be done in essentially two ways.

- A. Write a wallet with a Wallet Standard compatible API.
- B. Wrap your existing API with a Wallet Standard compatible API.

These methods are similar, but since wallets that exist today already have their own APIs, we'll focus on the latter.

Take a look at the [reference implementation](https://github.com/solana-labs/wallet-standard/tree/master/packages/wallets/ghost) for our imaginary wallet, **Ghost**.

Ghost has an API very similar to Phantom's. Because many Solana wallets have a similar API, it should be simple to modify.

## 1. Make a copy
```shell
git clone https://github.com/solana-labs/wallet-standard --depth=1
cp -R wallet-standard/packages/wallets/ghost ghost
```

## 2. Setup git history
```shell
cd ghost
git init
git add .
git commit -m "Initial commit"
cd ..
```

## 3. Configure your wallet name
```shell
# Name of your wallet. This should be unique to your wallet. This will be the name dapps display for your wallet.
export MY_WALLET_NAME='Unique New York'
# Name of your wallet as a class in `PascalCase`.
export MY_WALLET_CLASS_NAME='UniqueNewYork'
# Name of your wallet as a variable in `camelCase`.
export MY_WALLET_VARIABLE_NAME='uniqueNewYork'
# Name of your wallet as a package in `dash-lower-case`.
export MY_WALLET_PACKAGE_NAME='unique-new-york'
```

## 4. Find and replace
```shell
mv ghost $MY_WALLET_PACKAGE_NAME
cd $MY_WALLET_PACKAGE_NAME

find . -name "package.json" -type f -exec sed -i '' "s/@solana\/wallet-standard-ghost/${MY_WALLET_PACKAGE_NAME}-standard-wallet/g" {} +
find src -type f -exec sed -i '' "s/'Ghost'/'${MY_WALLET_NAME}'/g" {} +
find src -type f -exec sed -i '' "s/Ghost/${MY_WALLET_CLASS_NAME}/g" {} +
find src -type f -exec sed -i '' "s/ghost/${MY_WALLET_VARIABLE_NAME}/g" {} +

git add .
git commit -m "Rename to ${MY_WALLET_NAME}"
```

The package is marked private since it doesn't need to be published on npm. It will only be used internally by your wallet.

If you want to customize the package name or metadata, open the `package.json` file and change these lines however you like.
```json
    "name": "unique-new-york-standard-wallet",
    "author": "Solana Maintainers <maintainers@solana.foundation>",
    "repository": "https://github.com/solana-labs/wallet-standard",
```

## 5. Install dependencies

```shell
npm install
git add .
git commit -m "Add package-lock.json"
```

## 6. Customize your icon

Open the `src/icon.ts` file. This contains a base64 encoded data URI of an SVG, PNG, WebP, or GIF image. This will be the icon dapps display for your wallet.

```ts
import { WalletIcon } from '@wallet-standard/base';

export const icon: WalletIcon =
    'data:image/svg+xml;base64,PHN2Zy......ZnPg==' as const;
```

You can use a tool like https://base64.guru/converter/encode/image to encode an image using the "Data URI" setting. It's a good idea to compress your image losslessly with a tool like https://imageoptim.com first.

Customize your icon mime type and data, and make sure to keep the typescript `as const` statement at the end.

```shell
git add .
git commit -m "Customize icon"
```

## 7. Build the package

```shell
npm run build
```

This outputs .js files to the `lib` directory.

## 8. Customize your wallet

This step depends on your wallet. Some or all of these changes may not apply to you, or may need to be done differently.

If your wallet has a different API or events, open the `src/window.ts` file and customize them. If you do this, you'll need to change corresponding things in `src/wallet.ts`.

If your wallet doesn't support versioned transactions, you should add support for them to your wallet rather than change the API in `src/wallet.ts`.

Ideally, you should support all Solana clusters. If your wallet doesn't, open the `src/solana.ts` file. You can remove any you don't support, and remove them from the `SOLANA_CHAINS` constant.

```shell
npm run build
git add .
git commit -m "Customize wallet"
```

## 9. Consume the package

Your wallet probably does something like this in your extension's `contentScript` or in a webview.
```ts
window.uniqueNewYork = new UniqueNewYork();
```
Or, perhaps if you're being crafty,
```ts
Object.defineProperty(window, 'uniqueNewYork', { value: new UniqueNewYork() });
```

Instead, do this.
```ts
// Import the `initialize` function from your package.
import { initialize } from 'unique-new-york-standard-wallet';

// Create a reference to your wallet's existing API.
const uniqueNewYork = new UniqueNewYork();

// Register your wallet using the Wallet Standard, passing the reference.
initialize(uniqueNewYork);

// Attach the reference to the window, guarding against errors.
try {
    Object.defineProperty(window, 'uniqueNewYork', { value: uniqueNewYork });
}
catch (error) {
    console.error(error);
}
```

Your wallet now implements the Wallet Standard and registers itself on the window. This is all dapps need to detect and use it.

Even if another wallet uses "your" namespace (e.g. `window.solana`), the Standard Wallet you registered will work correctly.

## 10. Test your wallet

Open the Wallet Adapter demo https://solana-labs.github.io/wallet-adapter/example/ to test your wallet.

If your wallet implements the Wallet Standard, it will be detected by this example dapp.

## Appendix: Reference implementations

- [Exodus](https://github.com/solana-labs/wallet-standard/tree/master/packages/wallets/exodus)
- [Ghost](https://github.com/solana-labs/wallet-standard/tree/master/packages/wallets/ghost)
- [Phantom](https://github.com/solana-labs/wallet-standard/tree/master/packages/wallets/phantom)
- [Solflare](https://github.com/solana-labs/wallet-standard/tree/master/packages/wallets/solflare)
- [Glow](https://github.com/glow-xyz/glow-js/tree/master/packages/wallet-standard) (owned by `glow-xyz` org)
- [Backpack](https://github.com/coral-xyz/backpack/tree/master/packages/wallet-standard) (owned by `coral-xyz` org)
