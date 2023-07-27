import { useActiveWallet, useWalletLogin } from "@lens-protocol/react-web";
import {
  ConnectWallet,
  useAddress,
  useNetworkMismatch,
  useSwitchChain,
} from "@thirdweb-dev/react";
import React from "react";
import { Button } from "./ui/button";
import { useLensHookSafely } from "@/lib/useLensHookSafely";
import { CHAIN } from "../const/chains";

export default function SignInWithLensButton() {
  const address = useAddress();
  const wrongNetwork = useNetworkMismatch();
  const switchChain = useSwitchChain();
  const walletInfo = useLensHookSafely(useActiveWallet);
  const loginFunction = useLensHookSafely(useWalletLogin);

  console.log(walletInfo);

  if (!address) {
    return (
      <ConnectWallet
        style={{
          width: "100%",
        }}
        auth={{
          loginOptional: true,
        }}
        theme="dark"
      />
    );
  }

  if (wrongNetwork) {
    return (
      <Button
        onClick={() => {
          switchChain(CHAIN.chainId);
        }}
      >
        Switch to {CHAIN.name}
      </Button>
    );
  }

  if (!walletInfo?.data) {
    return (
      <Button
        onClick={() => {
          loginFunction?.execute?.({
            address,
          });
        }}
      >
        Sign in with Lens
      </Button>
    );
  }

  return (
    <ConnectWallet
      theme="dark"
      auth={{
        loginOptional: true,
      }}
    />
  );
}
