import { Provider } from "@ethersproject/providers";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { Signer, TypedDataDomain, TypedDataField } from "ethers";

export interface TypedDataSigner {
  _signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>
  ): Promise<string>;
}

export class TypedDataSignerWrapper extends Signer implements TypedDataSigner {
  sdk: ThirdwebSDK;

  constructor(private signer: Signer, sdk: ThirdwebSDK) {
    super();
    this.sdk = sdk;
  }

  async getAddress(): Promise<string> {
    console.log("Signer:", this.signer);
    console.log("getAddress", this?.signer?.getAddress());
    return this.signer.getAddress();
  }

  async signMessage(message: string): Promise<string> {
    return this.signer.signMessage(message);
  }

  async signTransaction(transaction: any): Promise<string> {
    return this.signer.signTransaction(transaction);
  }

  async sendTransaction(transaction: any): Promise<any> {
    return this.signer.sendTransaction(transaction);
  }

  connect(provider: Provider): Signer {
    return this.signer.connect(provider);
  }

  async _signTypedData(
    domain: TypedDataDomain,
    types: Record<string, Array<TypedDataField>>,
    value: Record<string, any>
  ): Promise<string> {
    return (await this.sdk.wallet.signTypedData(domain as any, types, value))
      .signature;
  }
}
