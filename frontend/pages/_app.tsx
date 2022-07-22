import { createTheme, NextUIProvider } from '@nextui-org/react';
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from 'next/app';
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import "../styles/globals.css";

const { chains, provider } = configureChains(
  [
    {
      id: 44787,
      name: "Celo Alfajores Testnet",
      network: "alfajores",
      nativeCurrency: {
        decimals: 18,
        name: "Celo",
        symbol: "CELO",
      },
      rpcUrls: {
        default: "https://alfajores-forno.celo-testnet.org",
      },
      blockExplorers: {
        default: {
          name: "CeloScan",
          url: "https://alfajores.celoscan.io",
        },
      },
      testnet: true,
    }
  ],
  [
    alchemyProvider({ alchemyId: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const nextUiDarkTheme = createTheme({
  type: 'dark'
});

function IndexPage({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider theme={nextUiDarkTheme}>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider chains={chains} theme={darkTheme({
          ...darkTheme.accentColors.orange,
          borderRadius: 'large',
        })} coolMode>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </WagmiConfig>
    </NextUIProvider>
  );
}

export default IndexPage
