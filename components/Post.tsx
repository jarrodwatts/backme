import { MediaRenderer } from "@thirdweb-dev/react";
import React, { useEffect, useMemo, useState } from "react";
import { Icons } from "./icons";
import formatDate from "@/lib/formatDate";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import {
  useActiveProfile,
  useCreateMirror,
  useCollect,
  useReaction,
  Post,
  Comment,
  ReactionType,
  CollectState,
  useEncryptedPublication,
} from "@lens-protocol/react-web";
import { useLensHookSafely } from "@/lib/useLensHookSafely";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";

type Props = {
  post: Post | Comment;
  className?: string;
};

// Currently only handle upvote
const reactionType = ReactionType.UPVOTE;

export default function Post({ post, className }: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const activeProfile = useLensHookSafely(useActiveProfile);

  const mirror = useLensHookSafely(useCreateMirror, {
    // @ts-ignore TODO: Publisher may not exist, handle this case
    publisher: activeProfile?.data,
  });

  const collect = useLensHookSafely(useCollect, {
    // @ts-ignore TODO: Collector may not exist, handle this case
    collector: activeProfile?.data,
    publication: post,
  });

  const react = useLensHookSafely(useReaction, {
    // @ts-ignore TODO: Profile may not exist, handle this case
    profileId: activeProfile?.data?.id,
  });

  const [hasDecrypted, setHasDecrypted] = useState<boolean>(false);

  const encryptedPublication = useLensHookSafely(useEncryptedPublication, {
    publication: post,
  });

  // Either use the post, or if it has been decrypted, use the decrypted post
  const postToUse = useMemo(() => {
    if (hasDecrypted) {
      if (!encryptedPublication?.data) {
        return post;
      }

      if (encryptedPublication.isPending) {
        return post;
      }

      return encryptedPublication?.data;
    } else {
      return post;
    }
  }, [hasDecrypted, encryptedPublication, post]);

  const hasReaction = useMemo(() => {
    return react?.hasReaction({
      publication: postToUse,
      reactionType,
    });
  }, [react, postToUse]);

  const postMedia = useMemo(() => {
    return (
      postToUse?.metadata?.image ||
      postToUse?.metadata?.media?.[0]?.original?.url ||
      null
    );
  }, [postToUse]);

  // If can be decrypted by observer, do so by default
  useEffect(() => {
    if (hasDecrypted) return;

    if (post.isGated && post.canObserverDecrypt.result) {
      void encryptedPublication?.decrypt();
    }
  }, [post, hasDecrypted, encryptedPublication]);

  // When "pending" changes on the encrypted publication, set the hasDecrypted state
  useEffect(() => {
    if (hasDecrypted) return;

    if (
      encryptedPublication?.data &&
      encryptedPublication.isPending === false &&
      post.isGated &&
      post.canObserverDecrypt.result
    ) {
      setHasDecrypted(true);
    }
  }, [
    encryptedPublication,
    hasDecrypted,
    post.canObserverDecrypt.result,
    post.isGated,
  ]);

  async function handleReaction() {
    if (!react) return;

    if (!hasReaction) {
      await react.addReaction({
        publication: post,
        reactionType,
      });
    } else {
      await react.removeReaction({
        publication: post,
        reactionType,
      });
    }
  }

  return (
    <>
      <Dialog>
        <DialogContent className="h-auto border w-screen p-1 max-w-6xl max-h-screen">
          {
            // Render media in big mode
            postMedia && (
              <MediaRenderer
                src={postMedia}
                alt={`A post by ${
                  postToUse.profile.name || postToUse.profile.handle
                }`}
                width="100%"
                height="auto"
                className="rounded-sm w-screen"
              />
            )
          }
        </DialogContent>

        <div
          onClick={() => {
            router.push(`/post/${postToUse.id}`);
          }}
          className={cn(
            "flex flex-col w-full h-full border border-solid p-4 rounded-md mt-4 z-0 hover:cursor-pointer transition-all duration-250 hover:bg-muted hover:text-accent-foreground",
            className
          )}
        >
          <div className="flex flex-col ml-2 w-6/8">
            {/* Relative, top right (opposite name section below), show lock icon */}
            {postToUse.isGated && (
              <div className="relative flex justify-end h-0 z-20">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Icons.gated
                        className="text-muted-foreground"
                        color={
                          hasDecrypted
                            ? "rgb(74 222 128)"
                            : "hsl(var(--muted-foreground))"
                        }
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      {hasDecrypted
                        ? "Only followers can see this content."
                        : "This content is for followers only."}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
            <div className="flex flex-row items-center gap-2 z-10">
              <Link
                href={`/profile/${postToUse.profile.handle}`}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <MediaRenderer
                  // @ts-ignore
                  src={postToUse.profile.picture?.original?.url || "/user.png"}
                  alt={`${
                    postToUse.profile.name || postToUse.profile.handle
                  }'s profile picture`}
                  height="52px"
                  width="52px"
                  className="rounded-full"
                />
              </Link>
              <div className="flex flex-col items-start">
                {/* Profile Name */}
                <Link
                  href={`/profile/${postToUse.profile.handle}`}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="font-semibold hover:underline transition-all duration-150"
                >
                  {postToUse.profile.name || postToUse.profile.handle}
                </Link>
                {/* Handle */}
                <Link
                  href={`/profile/${postToUse.profile.handle}`}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="text-sm text-muted-foreground  hover:underline transition-all duration-150"
                >
                  @{postToUse.profile.handle}
                </Link>
                {/* Time ago posted */}
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(postToUse.createdAt)} ago
                </p>
              </div>
            </div>

            {/* Post content */}
            {encryptedPublication?.isPending && (
              <Skeleton className="w-full h-20 mt-2" />
            )}

            {post.isGated && post.canObserverDecrypt.result === false ? (
              <div className="flex flex-col w-full mt-2 gap-3">
                <p className="text-start mt-2 text-ellipsis break-words">
                  {`This is a followers only exclusive. Follow ${
                    post.profile.name || post.profile.handle
                  } to see this content.`}
                </p>
                <Image
                  src="/backme-exclusive.png"
                  height={256}
                  alt="Backme Exclusive Placeholder"
                  width={512}
                />
              </div>
            ) : (
              !encryptedPublication?.isPending && (
                <p className="text-start mt-2 text-ellipsis break-words">
                  {postToUse.metadata.content}
                </p>
              )
            )}

            {postMedia && (
              <DialogTrigger
                className="pr-2 z-010"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <MediaRenderer
                  src={postMedia}
                  alt={`A post by ${
                    postToUse.profile.name || postToUse.profile.handle
                  }`}
                  width="100%"
                  height="auto"
                  className="my-2 rounded-sm"
                />
              </DialogTrigger>
            )}

            {/* Post metadata */}
            <div className="flex flex-row items-center justify-between w-full text-muted-foreground mt-4 pr-5 z-10">
              {/* Comments - Take user to the post */}
              <Button
                variant={"ghost"}
                onClick={(e) => {
                  router.push(`/post/${postToUse?.id}`);
                  e.stopPropagation();
                }}
                className="flex flex-row items-center gap-2 hover:text-foreground transition-all duration-150 hover:cursor-pointer"
                tabIndex={0}
              >
                <Icons.comment />
                <p className="text-sm">{postToUse?.stats?.commentsCount}</p>
              </Button>

              {/* Mirrors */}
              <Button
                variant={"ghost"}
                className="flex flex-row items-center gap-2 hover:text-foreground transition-all duration-150"
                tabIndex={1}
                onClick={async (e) => {
                  try {
                    e.stopPropagation();
                    await mirror?.execute({
                      publication: postToUse,
                    });
                    toast({
                      title: "Post mirrored",
                      description: `Successfully mirrored ${
                        postToUse.profile.name || postToUse.profile.handle
                      }'s post.`,
                    });
                  } catch (error) {
                    console.error(error);
                    toast({
                      variant: "destructive",
                      title: "Failed to mirror post",
                      description: `This user has disabled mirroring for this post.`,
                    });
                  }
                }}
              >
                <Icons.mirror
                  className={
                    postToUse.isMirroredByMe
                      ? "text-green-400 text-sm"
                      : "text-muted-foreground text-sm"
                  }
                />
                <p
                  className={
                    postToUse.isMirroredByMe
                      ? "text-green-400 text-sm"
                      : "text-muted-foreground text-sm"
                  }
                >
                  {postToUse?.stats?.totalAmountOfMirrors}
                </p>
              </Button>
              {/* Hearts */}
              <Button
                variant={"ghost"}
                className="flex flex-row items-center gap-2 hover:text-foreground transition-all duration-150"
                tabIndex={2}
                onClick={(e) => {
                  e.stopPropagation();
                  try {
                    handleReaction();
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                <Icons.heart
                  fill={hasReaction ? "rgb(74 222 128)" : ""}
                  className={`${
                    hasReaction ? "text-green-400" : "text-muted-foreground"
                  }`}
                />
                <p
                  className={`${
                    hasReaction ? "text-green-400" : "text-muted-foreground"
                  } text-sm`}
                >
                  {postToUse?.stats?.totalUpvotes}
                </p>
              </Button>

              <Button
                variant={"ghost"}
                className="flex flex-row items-center gap-2 hover:text-foreground transition-all duration-150"
                tabIndex={2}
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    switch (postToUse.collectPolicy.state) {
                      case CollectState.COLLECT_TIME_EXPIRED:
                        toast({
                          variant: "destructive",
                          title: "Post cannot be collected!",
                          description: `The collection time has expired for this post.`,
                        });

                      case CollectState.COLLECT_LIMIT_REACHED:
                        toast({
                          variant: "destructive",
                          title: "Post cannot be collected!",
                          description: `The collection limit has been reached for this post.`,
                        });

                      case CollectState.NOT_A_FOLLOWER:
                        toast({
                          variant: "destructive",
                          title: "Post cannot be collected!",
                          description: `You need to follow ${post.profile.name} to collect this post.`,
                        });

                      case CollectState.CANNOT_BE_COLLECTED:
                        toast({
                          variant: "destructive",
                          title: "Post cannot be collected!",
                          description: `The creator of this post has disabled collections.`,
                        });

                      case CollectState.CAN_BE_COLLECTED:
                        try {
                          const result = await collect?.execute();

                          if (result?.isFailure()) {
                            throw new Error(result.error.message);
                          }

                          toast({
                            title: "Collected Post!",
                            description: `You have collected ${
                              postToUse.profile.name || postToUse.profile.handle
                            }'s post`,
                          });
                        } catch (error) {
                          console.error(error);
                          // TODO: Handle "InsufficientFundsError"
                          toast({
                            variant: "destructive",
                            title: "Post cannot be collected!",
                            description: `Something went wrong collecting this post. Please try again later.`,
                          });
                        }
                    }
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                <Icons.collect
                  className={`${
                    postToUse.hasCollectedByMe
                      ? "text-green-400"
                      : "text-muted-foreground"
                  }`}
                />
                <p
                  className={
                    postToUse.hasCollectedByMe
                      ? "text-green-400 text-sm"
                      : "text-muted-foreground text-sm"
                  }
                >
                  {postToUse?.stats?.totalAmountOfCollects}
                </p>
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
