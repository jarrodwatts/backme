import { Nav } from "@/components/Navbar";
import Post from "@/components/Post";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Post as PostType,
  useProfile,
  ProfileId,
  useFollow,
  useActiveProfile,
  useUnfollow,
  usePublications,
  PublicationTypes,
  FollowPolicyType,
} from "@lens-protocol/react-web";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";
import { MediaRenderer } from "@thirdweb-dev/react";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import FollowButton from "@/components/FollowButton";

const ProfilePage = () => {
  // Get the post ID from the URL
  const router = useRouter();
  const { handle } = router.query;

  const { toast } = useToast();

  const activeProfile = useActiveProfile();

  const profile = useProfile({
    handle: handle as string,
  });

  const publications = usePublications({
    profileId: profile?.data?.id as ProfileId,
    limit: 25,
    publicationTypes: [PublicationTypes.Post],
    observerId: activeProfile?.data?.id as ProfileId,
  });

  if (profile?.error) {
    return (
      <>
        <Nav />

        <section className="w-full container flex max-w-[720px] flex-col items-center gap-4 text-center h-screen">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Profile not found
          </h1>
          <p className="leading-7">
            Sorry, that profile doesn&rsquo;t exist, or it has been deleted.
          </p>

          <Button className="mt-2" onClick={() => router.push("/feed")}>
            Back to Feed
          </Button>
        </section>
      </>
    );
  }

  return (
    <>
      <Nav />
      <div className="w-full container flex max-w-[64rem] flex-col items-center gap-4 h-screen">
        <div className="w-full md:w-[620px]">
          {/* Cover photo */}
          <MediaRenderer
            alt={`${profile?.data?.handle}'s cover photo`}
            // @ts-ignore, image is there
            src={profile?.data?.coverPicture?.original?.url || "/cover.jpg"}
            width="100%"
            height="200px"
            style={{
              objectFit: "cover",
            }}
          />

          {/* Follow button has position beneath cover image and parallel to the profile picture */}
          <div className="relative flex justify-end h-0">
            {profile.data && activeProfile.data && (
              <FollowButton
                followee={profile.data}
                follower={activeProfile.data}
              />
            )}
          </div>

          {/* Profile picture */}
          <MediaRenderer
            alt={`${profile?.data?.handle}'s profile picture`}
            // @ts-ignore, image is there
            src={profile?.data?.picture?.original?.url || "/user.png"}
            width="128px"
            height="128px"
            style={{
              objectFit: "cover",
            }}
            className="rounded-full border-4 shadow-sm -mt-16 ml-4"
          />

          {/* Profile name */}
          <h1 className="text-xl font-semibold w-auto mt-4">
            {profile?.data?.name}
          </h1>

          {/* Handle */}
          <p className="text-sm text-muted-foreground">
            @{profile?.data?.handle}
          </p>

          {/* Bio */}
          <p className="leading-7 mt-1">{profile?.data?.bio}</p>

          <div className="flex items-center mt-4">
            {/* Followers */}
            <Link
              href={`/profile/${profile?.data?.handle}/followers`}
              className="leading-7"
            >
              <span className="font-semibold">
                {profile?.data?.stats.totalFollowers}
              </span>
              <span className="text-muted-foreground"> Followers</span>
            </Link>

            {/* Following */}
            <Link
              href={`/profile/${profile?.data?.handle}/following`}
              className="leading-7  ml-4"
            >
              <span className="font-semibold">
                {profile?.data?.stats.totalFollowing}
              </span>

              <span className="text-muted-foreground"> Following</span>
            </Link>
          </div>

          {/* Loading */}
          {publications?.loading &&
            Array.from({ length: 10 }).map((_, i) => (
              <Skeleton
                className="h-[88px] animate-pulse bg-muted mt-3 w-full"
                key={i}
              />
            ))}
          {/* Loaded */}
          {!publications?.loading && publications?.data && (
            <InfiniteScroll
              dataLength={publications?.data?.length || 0}
              next={() => publications?.next()}
              hasMore={publications?.hasMore}
              className="mt-4"
              loader={
                <>
                  {Array.from({ length: 10 }).map((_, i) => (
                    <Skeleton
                      className="h-[88px] animate-pulse bg-muted mt-3 w-full"
                      key={i}
                    />
                  ))}
                </>
              }
            >
              {activeProfile &&
                activeProfile.data &&
                // @ts-ignore post type
                publications?.data?.map((post: PostType) => (
                  <Post
                    key={post.id}
                    post={post}
                    activeProfile={activeProfile.data!}
                  />
                ))}
            </InfiniteScroll>
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
