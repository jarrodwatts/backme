import { useSigner } from "@thirdweb-dev/react";

/**
 * Lens hooks need to be called within the LensProvider
 * But the LensProvider needs a signer, meaning the user needs a connected wallet.
 * This hook is designed to wrap other hooks that need a signer,
 * @param hook The hook to wrap
 * @returns The result of the hook
 */
export function useLensHookSafely<T>(hook: () => T): T | null {
  const signer = useSigner();

  if (!signer) {
    return null;
  }

  try {
    return hook();
  } catch (e) {
    console.error(e);
    return null;
  }
}
