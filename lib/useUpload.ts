import { useSDK } from "@thirdweb-dev/react";

export default function useUpload() {
  const sdk = useSDK();

  // Return a function that follows this signature:
  // (data: unknown) => Promise<string>
  return async function upload(data: unknown) {
    let ipfsHash: string = "";

    // if data is File
    if (data instanceof File) {
      ipfsHash = await sdk!.storage.upload(data);
    } else {
      const serialized = JSON.stringify(data);
      ipfsHash = await sdk!.storage.upload(serialized);
    }

    const [cid, path] = ipfsHash.replace("ipfs://", "").split("/");

    const publicUrl = `https://gateway.ipfscdn.io/ipfs/${cid}/${path}`;

    // Need to fetch so that the data is ready when we finish this function
    await fetch(publicUrl);

    return publicUrl;
  };
}
