import { MediaRenderer } from "@thirdweb-dev/react";
import React, { useMemo } from "react";
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
} from "@lens-protocol/react-web";
import { useLensHookSafely } from "@/lib/useLensHookSafely";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useRouter } from "next/router";
import { useToast } from "@/components/ui/use-toast";

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

  const hasReaction = useMemo(() => {
    return react?.hasReaction({
      publication: post,
      reactionType,
    });
  }, [react, post]);

  const postMedia = useMemo(() => {
    return (
      post?.metadata?.image || post?.metadata?.media?.[0]?.original?.url || null
    );
  }, [post]);

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

  console.log("Collect:", collect);

  return (
    <>
      <Dialog>
        <DialogContent className="h-auto border w-screen p-1 max-w-6xl max-h-screen">
          {
            // Render media in big mode
            postMedia && (
              <MediaRenderer
                src={postMedia}
                alt={`A post by ${post.profile.name || post.profile.handle}`}
                width="100%"
                height="auto"
                className="rounded-sm w-screen"
              />
            )
          }
        </DialogContent>

        <div
          onClick={() => {
            router.push(`/post/${post.id}`);
          }}
          className={cn(
            "flex flex-col w-full h-full border border-solid p-4 rounded-md mt-4 z-0 hover:cursor-pointer transition-all duration-250 hover:bg-muted hover:text-accent-foreground",
            className
          )}
        >
          <div className="flex flex-col ml-2 w-6/8">
            <div className="flex flex-row items-center gap-2 z-10">
              <Link
                href={`/profile/${post.profile.handle}`}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <MediaRenderer
                  // @ts-ignore
                  src={post.profile.picture?.original?.url || ""}
                  alt={`${
                    post.profile.name || post.profile.handle
                  }'s profile picture`}
                  height="52px"
                  width="52px"
                  className="rounded-full"
                />
              </Link>
              <div className="flex flex-col items-start">
                {/* Profile Name */}
                <Link
                  href={`/profile/${post.profile.handle}`}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="font-semibold hover:underline transition-all duration-150"
                >
                  {post.profile.name || post.profile.handle}
                </Link>
                {/* Handle */}
                <Link
                  href={`/profile/${post.profile.handle}`}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="text-sm text-muted-foreground  hover:underline transition-all duration-150"
                >
                  @{post.profile.handle}
                </Link>
                {/* Time ago posted */}
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(post.createdAt)} ago
                </p>
              </div>
            </div>

            {/* Post content */}
            <p className="text-start mt-2 text-ellipsis break-words">
              {post?.metadata?.content || ""}
            </p>

            {postMedia && (
              <DialogTrigger
                className="pr-2 z-010"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <MediaRenderer
                  src={postMedia}
                  alt={`A post by ${post.profile.name || post.profile.handle}`}
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
                  router.push(`/post/${post?.id}`);
                  e.stopPropagation();
                }}
                className="flex flex-row items-center gap-2 hover:text-foreground transition-all duration-150 hover:cursor-pointer"
                tabIndex={0}
              >
                <Icons.comment />
                <p className="text-sm">{post?.stats?.commentsCount}</p>
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
                      publication: post,
                    });
                    toast({
                      title: "Post mirrored",
                      description: `Successfully mirrored ${
                        post.profile.name || post.profile.handle
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
                    post.isMirroredByMe
                      ? "text-green-400 text-sm"
                      : "text-muted-foreground text-sm"
                  }
                />
                <p
                  className={
                    post.isMirroredByMe
                      ? "text-green-400 text-sm"
                      : "text-muted-foreground text-sm"
                  }
                >
                  {post?.stats?.totalAmountOfMirrors}
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
                  {post?.stats?.totalUpvotes}
                </p>
              </Button>

              <Button
                variant={"ghost"}
                className="flex flex-row items-center gap-2 hover:text-foreground transition-all duration-150"
                tabIndex={2}
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    switch (post.collectPolicy.state) {
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
                          await collect?.execute();
                          toast({
                            title: "Collected Post!",
                            description: `You have collected ${
                              post.profile.name || post.profile.handle
                            }'s post`,
                          });
                        } catch (error) {
                          console.error(error);
                        }
                    }
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                <Icons.collect
                  className={`${
                    post.hasCollectedByMe
                      ? "text-green-400"
                      : "text-muted-foreground"
                  }`}
                />
                <p
                  className={
                    post.hasCollectedByMe
                      ? "text-green-400 text-sm"
                      : "text-muted-foreground text-sm"
                  }
                >
                  {post?.stats?.totalAmountOfCollects}
                </p>
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
