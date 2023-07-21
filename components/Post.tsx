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
} from "@lens-protocol/react-web";
import { useLensHookSafely } from "@/lib/useLensHookSafely";

type Props = {
  id: string;
  post: Post | Comment;
  profilePicture: string;
  displayName: string;
  handle: string;
  timePosted: string;
  content: string;
  media: string;
  comments: number;
  mirrors: number;
  collects: number;
  hearts: number;
};

// Currently only handle upvote
const reactionType = ReactionType.UPVOTE;

export default function Post({
  id,
  post,
  comments,
  content,
  media,
  displayName,
  handle,
  hearts,
  mirrors,
  collects,
  profilePicture,
  timePosted,
}: Props) {
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

  async function handleReaction() {
    if (!react) return;

    const hasReactionType = react.hasReaction({
      publication: post,
      reactionType,
    });

    if (hasReactionType) {
      await react.removeReaction({
        publication: post,
        reactionType,
      });
    } else {
      await react?.removeReaction({
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
            media && (
              <MediaRenderer
                src={media}
                alt={`A post by ${displayName}`}
                width="100%"
                height="auto"
                className="rounded-sm w-screen"
              />
            )
          }
        </DialogContent>

        <div className="flex flex-col w-full h-full border border-solid p-4 rounded-md mt-4">
          {/* Profile picture */}

          <div className="flex flex-col ml-2 w-6/8">
            <div className="flex flex-row items-center gap-2">
              <Link href={`/profile/${handle}`}>
                <MediaRenderer
                  src={profilePicture}
                  alt={`${displayName}'s profile picture`}
                  height="52px"
                  width="52px"
                  className="rounded-full"
                />
              </Link>
              <div className="flex flex-col items-start">
                {/* Profile Name */}
                <Link
                  href={`/profile/${handle}`}
                  className="font-semibold hover:underline transition-all duration-150"
                >
                  {displayName}
                </Link>
                {/* Handle */}
                <Link
                  href={`/profile/${handle}`}
                  className="text-sm text-muted-foreground  hover:underline transition-all duration-150"
                >
                  @{handle}
                </Link>
                {/* Time ago posted */}
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(timePosted)} ago
                </p>
              </div>
            </div>

            {/* Post content */}
            <p className="text-start mt-2 text-ellipsis break-words">
              {content}
            </p>

            {media && (
              <DialogTrigger className="pr-2">
                <MediaRenderer
                  src={media}
                  alt={`A post by ${displayName}`}
                  width="100%"
                  height="auto"
                  className="my-2 rounded-sm "
                />
              </DialogTrigger>
            )}

            {/* Post metadata */}
            <div className="flex flex-row items-center justify-between w-full text-muted-foreground mt-4 pr-5">
              {/* Comments - Take user to the post */}
              <Link
                href={`/post/${id}`}
                className="flex flex-row items-center gap-2 hover:text-foreground transition-all duration-150 hover:cursor-pointer"
                tabIndex={0}
              >
                <Icons.comment />
                <p className="text-sm">{comments}</p>
              </Link>

              {/* Mirrors */}
              <div
                className="flex flex-row items-center gap-2 hover:text-foreground transition-all duration-150"
                role="button"
                tabIndex={1}
                onClick={() => {
                  mirror?.execute({
                    publication: post,
                  });
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
                  {mirrors}
                </p>
              </div>
              {/* Hearts */}
              <div
                className="flex flex-row items-center gap-2 hover:text-foreground transition-all duration-150"
                role="button"
                tabIndex={2}
                onClick={() => handleReaction()}
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
                  {hearts}
                </p>
              </div>

              <div
                className="flex flex-row items-center gap-2 hover:text-foreground transition-all duration-150"
                role="button"
                tabIndex={2}
                onClick={() => {
                  collect?.execute();
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
                  {collects}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
