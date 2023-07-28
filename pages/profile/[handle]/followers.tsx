import { Nav } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useProfile,
  ProfileId,
  useProfileFollowers,
} from "@lens-protocol/react-web";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";
import { MediaRenderer } from "@thirdweb-dev/react";

const FollowersPage = () => {
  // Get the post ID from the URL
  const router = useRouter();
  const { handle } = router.query;

  const profile = useProfile({
    handle: handle as string,
  });

  const following = useProfileFollowers({
    profileId: profile?.data?.id as ProfileId,
    limit: 25,
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
          {/* Profile name */}
          <h1 className="text-xl font-semibold w-auto mt-4">
            {profile?.data?.name || profile?.data?.handle}&rsquo;s following
          </h1>

          {/* Handle */}
          <p className="text-sm text-muted-foreground">
            @{profile?.data?.handle}
          </p>

          {!following?.loading && following?.data && (
            <InfiniteScroll
              dataLength={following?.data?.length || 0}
              next={() => following?.next()}
              hasMore={following?.hasMore}
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
              {following?.data?.map((user, key) => (
                <div
                  className="flex flex-row items-center justify-between w-full my-2"
                  key={key}
                >
                  <div
                    className="flex flex-row items-center w-full p-1 hover:cursor-pointer"
                    onClick={() => {
                      router.push(
                        `/profile/${user?.wallet.defaultProfile?.handle}`
                      );
                    }}
                  >
                    <MediaRenderer
                      src={
                        // @ts-ignore - this is fine, we're checking for null
                        user?.wallet.defaultProfile?.picture?.original?.url ||
                        "/user.png" ||
                        ""
                      }
                      height="48px"
                      width="48px"
                      className="w-12 h-12 rounded-full mr-4"
                    />
                    <div className="flex flex-col">
                      <span className="text-base font-semibold">
                        {user?.wallet.defaultProfile?.name}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        @{user?.wallet.defaultProfile?.handle}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </InfiniteScroll>
          )}
        </div>
      </div>
    </>
  );
};

export default FollowersPage;
