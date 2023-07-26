import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Signer, TypedDataDomain, TypedDataField } from "ethers";
import { useMemo } from "react";
import { EIP712Domain } from "../types/EIP712Domain";

export interface TypedDataSigner {
  _signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>
  ): Promise<string>;
}

function addTypedDataToSigner(
  signer: Signer,
  sdk: ThirdwebSDK
): Signer & TypedDataSigner {
  const signerWithTypedData: Signer & TypedDataSigner = Object.create(signer);

  signerWithTypedData._signTypedData = async (
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>
  ): Promise<string> => {
    return (
      await sdk.wallet.signTypedData(domain as EIP712Domain, types, value)
    ).signature;
  };

  return signerWithTypedData;
}

export function useTypedDataSignerWrapper(
  signer: Signer | undefined,
  sdk: ThirdwebSDK | undefined
): (Signer & TypedDataSigner) | undefined {
  const signerWithTypedData = useMemo(() => {
    if (signer && sdk) {
      return addTypedDataToSigner(signer, sdk);
    }
    return undefined;
  }, [signer, sdk]);

  return signerWithTypedData;
}
