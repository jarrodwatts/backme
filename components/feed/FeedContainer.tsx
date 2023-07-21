import { ProfileId, useFeed } from "@lens-protocol/react-web";
import React from "react";

type Props = {
  profileId: ProfileId;
};

export default function FeedContainer({ profileId }: Props) {
  const {
    data: feedItems,
    loading,
    hasMore,
    error,
    next,
  } = useFeed({
    profileId: profileId,
  });

  return <div></div>;
}
