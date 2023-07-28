import type { AppProps } from "next/app";
import Head from "next/head";
import { ThirdwebProvider, useSDK, useSigner } from "@thirdweb-dev/react";
import { CHAIN, IS_DEV_ENV } from "../const/chains";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import localFont from "next/font/local";
import {
  LensProvider,
  RequiredSigner,
  development,
  production,
} from "@lens-protocol/react-web";
import { JsonRpcProvider } from "@ethersproject/providers";
import "../styles/globals.css";
import NetworkSwitchModal from "@/components/NetworkSwitchModal";
import { Toaster } from "@/components/ui/toaster";
import { useTypedDataSignerWrapper } from "@/lib/typedDataSigner";
import { useRouter } from "next/router";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Font files can be colocated inside of `pages`
const fontHeading = localFont({
  src: "../assets/fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
});

function LensThirdwebProvider({ children }: { children: React.ReactNode }) {
  const sdk = useSDK();
  const signer = useSigner();
  const router = useRouter();
  const signerWrapped = useTypedDataSignerWrapper(signer, sdk);

  if (!signer && router.pathname !== "/") {
    return (
      <>
        <NetworkSwitchModal />
      </>
    );
  }

  return (
    <LensProvider
      config={{
        environment: IS_DEV_ENV ? development : production,
        bindings: {
          getSigner: async () => signerWrapped as RequiredSigner,
          getProvider: async () =>
            IS_DEV_ENV
              ? new JsonRpcProvider("https://mumbai.rpc.thirdweb.com")
              : new JsonRpcProvider("https://mumbai.rpc.thirdweb.com"),
        },
        // @ts-ignore: TODO
        appId: "backme",
      }}
    >
      {children}
    </LensProvider>
  );
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Backme</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <ThirdwebProvider
          activeChain={CHAIN}
          authConfig={{
            domain: process.env.NEXT_PUBLIC_AUTH_DOMAIN || "evmkit.com",
            authUrl: "/api/auth",
          }}
          clientId={process.env.NEXT_PUBLIC_THIRDWEB_API_KEY || ""}
        >
          <LensThirdwebProvider>
            <NetworkSwitchModal />
            <Component {...pageProps} />
            <Toaster />
          </LensThirdwebProvider>
        </ThirdwebProvider>
      </main>
    </>
  );
}

export default MyApp;
