import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useSwitchChain, useNetworkMismatch } from "@thirdweb-dev/react";
import { CHAIN } from "../const/chains";
import { Button } from "./ui/button";

export default function NetworkSwitchModal() {
  const wrongNetwork = useNetworkMismatch();
  const switchChain = useSwitchChain();
  const [openNetworkModal, setOpenNetworkModal] = useState<boolean>(false);

  useEffect(() => {
    if (wrongNetwork) {
      setOpenNetworkModal(true);
    }
  }, [wrongNetwork]);

  return (
    <Dialog open={openNetworkModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Switch Network</DialogTitle>
          <DialogDescription className="mb-4">
            Please switch to the {CHAIN.name} network to use this app.
          </DialogDescription>

          <Button
            className="mt-4"
            onClick={() => {
              switchChain(CHAIN.chainId);
              setOpenNetworkModal(false);
            }}
          >
            Switch to {CHAIN.name}
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
