/**
 * Hooks can fail when gasless transactions don't go through.
 * We can add a fallback behaviour to use self funds in that case.
 * This is possible for the following hooks:
 * useCollect
 * useCreateComment
 * useCreateEncryptedPost
 * useCreateEncryptedComment
 * useCreateMirror
 * useCreatePost
 * useFollow
 * useUnfollow
 * useUpdateDispatcherConfig
 * useUpdateFollowPolicy
 * useUpdateProfileDetails
 * useUpdateProfileImage
 * This hooks accepts the error field of any of the above hooks and calls the hook again with the self funds option.
 */

import { useState } from "react";
import {
  supportsSelfFundedFallback,
  SelfFundedOperation,
  useSelfFundedFallback,
  BroadcastingError,
} from "@lens-protocol/react-web";

export function useFollowWithSelfFundedFallback<T extends SelfFundedOperation>(
  error: BroadcastingError
): T | null {
  if (!error) return null;

  const selfFunded = useSelfFundedFallback();

  const execute = async () => {
    // Execute self funded operation
    if (supportsSelfFundedFallback(error)) {
      const selfFundedResult = await selfFunded.execute(error.fallback);
    }
  };

  return null;
}
