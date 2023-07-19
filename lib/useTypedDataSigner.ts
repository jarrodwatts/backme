import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Signer } from "ethers";
import { TypedDataSignerWrapper } from "./TypedDataSigner";
import { useState, useEffect } from "react";

export function useTypedDataSignerWrapper(
  signer: Signer | undefined,
  sdk: ThirdwebSDK | undefined
) {
  const [signerWrapper, setSignerWrapper] = useState<
    TypedDataSignerWrapper | undefined
  >(undefined);

  useEffect(() => {
    if (signer && sdk) {
      setSignerWrapper(new TypedDataSignerWrapper(signer, sdk));
    }
  }, [signer, sdk]);

  return signerWrapper;
}
