import {
  FollowPolicyType,
  Profile,
  ProfileOwnedByMe,
  useFollow,
  useUnfollow,
} from "@lens-protocol/react-web";
import { useRouter } from "next/router";
import React from "react";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";

type Props = {
  followee: Profile;
  follower: ProfileOwnedByMe;
};

export default function FollowButton({ followee, follower }: Props) {
  const router = useRouter();
  const { toast } = useToast();

  const follow = useFollow({
    followee,
    follower,
  });

  console.log(follow);

  const unfollow = useUnfollow({
    followee,
    follower,
  });

  async function handleFollow() {
    if (followee?.ownedByMe) {
      router.push("/profile/edit");
      return;
    }

    console.log(followee?.followStatus);

    if (!followee.followStatus?.canFollow && !followee.isFollowedByMe) {
      toast({
        title: `You can't follow this profile.`,
        description:
          "You may have already followed this profile, or it may be private.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (followee?.isFollowedByMe && followee.followStatus?.canUnfollow) {
        await unfollow?.execute();
        toast({
          title: `Unfollowed ${followee?.name || followee?.handle}`,
        });
      } else {
        const result = await follow?.execute();

        console.log(result);

        if (result.isFailure()) {
          toast({
            title: `Failed to follow ${followee?.name || followee?.handle}`,
            description: result.error.message,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: `Followed ${followee?.name || followee?.handle}`,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: `Something went wrong. Please try again later.`,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex flex-col items-center justify-center absolute top-0 right-0 gap-2">
      <Button className="mt-4" onClick={handleFollow}>
        {followee?.ownedByMe
          ? "Edit Profile"
          : followee?.isFollowedByMe
          ? "Unfollow"
          : "Follow"}
      </Button>

      {!followee?.ownedByMe &&
        (followee?.followPolicy.type === FollowPolicyType.CHARGE ? (
          <p className="text-sm text-muted-foreground">
            {followee.followPolicy.amount.toNumber().toString()} $
            {followee.followPolicy.amount.asset.symbol} to follow
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">Free to follow!</p>
        ))}
    </div>
  );
}
