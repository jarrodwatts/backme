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

    const publicUrl = sdk!.storage
      .getGatewayUrls()
      ["ipfs://"][4].replace("{cid}", cid)
      .replace("{path}", path);

    // Need to fetch so that the data is ready when we finish this function
    console.log("Fetching...");
    await fetch(publicUrl);
    console.log("Fetched, returning publicUrl", publicUrl);

    return publicUrl;
  };
}
