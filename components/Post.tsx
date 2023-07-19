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
  comments: number;
  mirrors: number;
  hearts: number;
};

export default function Post({
  comments,
  content,
  displayName,
  handle,
  hearts,
  mirrors,
  profilePicture,
  timePosted,
}: Props) {
  return (
    <div className="flex flex-row w-full h-full border border-solid p-4 rounded-md mt-4">
      {/* Profile picture */}
      <MediaRenderer
        src={profilePicture}
        alt={content}
        height="40px"
        width="40px"
        className="rounded-3xl"
      />

      <div className="flex flex-col ml-4 w-5/6">
        <div className="flex flex-col items-start">
          {/* Profile Name */}
          <p className="leading-7 font-semibold">{displayName}</p>
          {/* Handle */}
          <p className="text-sm text-muted-foreground">@{handle}</p>
          {/* Time ago posted */}
          <p className="text-xs text-muted-foreground mt-1">
            {formatDate(timePosted)} ago
          </p>
        </div>

        {/* Post content */}
        <p className="text-start mt-2 text-ellipsis break-words">{content}</p>

        {/* Post metadata */}
        <div className="flex flex-row items-center justify-between w-full text-muted-foreground mt-6 ">
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
