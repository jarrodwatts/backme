import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useNetworkMismatch, useAddress } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import SignInWithLensButton from "./SignInWithLensButton";
import { Badge } from "./ui/badge";
import { useActiveWallet } from "@lens-protocol/react-web";

const MODAL_DISPLAY_DELAY = 1000; // Set the delay time in milliseconds

export default function NetworkSwitchModal() {
  const router = useRouter();
  const address = useAddress();
  const wrongNetwork = useNetworkMismatch();
  const [openNetworkModal, setOpenNetworkModal] = useState<boolean>(false);
  const walletInfo = useActiveWallet();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (!address || wrongNetwork || !walletInfo?.data) {
      if (router.pathname !== "/") {
        timeoutId = setTimeout(() => {
          setOpenNetworkModal(true);
        }, MODAL_DISPLAY_DELAY);
      }
    } else {
      setOpenNetworkModal(false);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [address, wrongNetwork, router.pathname, walletInfo?.data]);

  return (
    <Dialog open={openNetworkModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign in with Lens</DialogTitle>
          <DialogDescription className="mt-3 mb-6">
            Sign in with Lens to continue using Backme.
          </DialogDescription>

          {/* Four badges connected by horizontal line */}
          <div
            className="flex flex-row items-center space-x-4"
            style={{
              marginTop: 16,
              marginBottom: 16,
            }}
          >
            <Badge
              variant="outline"
              className={`text-muted-foreground${
                !address ? " text-foreground" : ""
              }`}
            >
              1
            </Badge>
            <div className="border-t-2 border-gray-300 w-16 opacity-10"></div>
            <Badge
              variant="outline"
              className={`text-muted-foreground ${
                wrongNetwork ? " text-foreground" : ""
              }`}
            >
              2
            </Badge>
            <div className="border-t-2 border-gray-300 w-16 opacity-10"></div>
            <Badge
              variant="outline"
              className={`text-muted-foreground ${
                !walletInfo?.data ? " text-foreground" : ""
              }`}
            >
              3
            </Badge>
          </div>
          <SignInWithLensButton />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
