import { useSDK, useStorage } from "@thirdweb-dev/react";

export default function useUpload() {
  const sdk = useSDK();
  const storage = useStorage();

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

    // See what gateways you have available, as gateway URL is unique to your thirdweb API key.
    const availableGateways = storage?.getGatewayUrls();

    // Use first available URL for IPFS
    const gatewayUrlRoot = availableGateways?.["ipfs://"][0]
      ?.split("/")
      ?.slice(0, -2)
      ?.join("/");

    // Form the URL to the file with that gateway
    const gatewayUrl = `${gatewayUrlRoot}/${cid}/${path}`;

    // We need to fetch so that the data is ready when we finish this function...
    // This is kind of stupid, but Lens does a check to see if the URL is valid.
    // If we return the URL before it's ready to be served by the gateway, Lens
    // will throw an error saying the file is not found cuz it's not ready yet.
    // So, by fetching, we kind of wait for the file to be ready to be served before returning the URL
    // to avoid the error.
    await fetch(gatewayUrl);

    return gatewayUrl;
  };
}
