import {
  FollowPolicyType,
  Profile,
  ProfileOwnedByMe,
  useApproveModule,
  useFollow,
  useUnfollow,
} from "@lens-protocol/react-web";
import { useRouter } from "next/router";
import React from "react";
import { useToast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { useSDK } from "@thirdweb-dev/react";

type Props = {
  followee: Profile;
  follower: ProfileOwnedByMe;
};

export default function FollowButton({ followee, follower }: Props) {
  const router = useRouter();
  const sdk = useSDK();
  const { toast } = useToast();
  const approveModule = useApproveModule();

  const follow = useFollow({
    followee,
    follower,
  });

  const unfollow = useUnfollow({
    followee,
    follower,
  });

  async function handleFollow() {
    if (followee?.ownedByMe) {
      router.push("/profile/edit");
      return;
    }

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
        // If charge, approve funds first
        if (followee.followPolicy.type === FollowPolicyType.CHARGE) {
          // const approveFundsResult = await approveModule.execute({
          //   amount: followee.followPolicy.amount,
          //   limit: TokenAllowanceLimit.INFINITE,
          //   spender: followee.followPolicy.contractAddress,
          // });

          // console.log("Approval:", approveModule);

          // Get WMATIC
          const contract = await sdk?.getContract(
            "0x9c3c9283d3e44854697cd22d3faa240cfb032889"
          );

          const approveFundsResult = await contract?.erc20.setAllowance(
            followee.followPolicy.contractAddress,
            followee.followPolicy.amount.toNumber()
          );

          console.log("Approval:", approveFundsResult);
        }

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
