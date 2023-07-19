import { MediaRenderer } from "@thirdweb-dev/react";
import React from "react";
import { Icons } from "./icons";
import formatDate from "@/lib/formatDate";

type Props = {
  profilePicture: string;
  displayName: string;
  handle: string;
  timePosted: string;
  content: string;
  media: string;
  comments: number;
  mirrors: number;
  hearts: number;
};

export default function Post({
  comments,
  content,
  media,
  displayName,
  handle,
  hearts,
  mirrors,
  profilePicture,
  timePosted,
}: Props) {
  return (
    <div className="flex flex-col w-full h-full border border-solid p-4 rounded-md mt-4">
      {/* Profile picture */}

      <div className="flex flex-col ml-4 w-6/8">
        <div className="flex flex-row items-center gap-2">
          <MediaRenderer
            src={profilePicture}
            alt={content}
            height="52px"
            width="52px"
            className="rounded-full"
          />
          <div className="flex flex-col items-start">
            {/* Profile Name */}
            <p className="font-semibold">{displayName}</p>
            {/* Handle */}
            <p className="text-sm text-muted-foreground">@{handle}</p>
            {/* Time ago posted */}
            <p className="text-xs text-muted-foreground mt-1">
              {formatDate(timePosted)} ago
            </p>
          </div>
        </div>

        {/* Post content */}
        <p className="text-start mt-2 text-ellipsis break-words">{content}</p>

        {media && (
          <MediaRenderer
            src={media}
            alt={content}
            width="90%"
            height="auto"
            className="m-4"
          />
        )}

        {/* Post metadata */}
        <div className="flex flex-row items-center justify-between w-5/6 text-muted-foreground mt-3 ml-6">
          {/* Comments */}
          <div className="flex flex-row items-center gap-2">
            <Icons.comment />
            <p className="text-sm text-muted-foreground">{comments}</p>
          </div>

          {/* Mirrors */}
          <div className="flex flex-row items-center gap-2">
            <Icons.mirror />
            <p className="text-sm text-muted-foreground">{mirrors}</p>
          </div>
          {/* Hearts */}
          <div className="flex flex-row items-center gap-2">
            <Icons.heart />
            <p className="text-sm text-muted-foreground">{hearts}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
