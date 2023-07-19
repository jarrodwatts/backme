import { useActiveWallet, useWalletLogin } from "@lens-protocol/react-web";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import React from "react";
import { Button } from "./ui/button";
import { useLensHookSafely } from "@/lib/useLensHookSafely";

type Props = {};

export default function SignInWithLensButton({}: Props) {
  const address = useAddress();
  const walletInfo = useLensHookSafely(useActiveWallet);
  const loginFunction = useLensHookSafely(useWalletLogin);

  // const { execute: login, isPending: isLoginPending } = useWalletLogin();

  if (!address) {
    return (
      <ConnectWallet
        style={{
          width: "90%",
        }}
        theme="dark"
      />
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

  return <ConnectWallet />;
}
