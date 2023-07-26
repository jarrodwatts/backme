import type { NextPage } from "next";
import { Nav } from "@/components/Navbar";
import { TabsList, Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import {
  PublicationTypes,
  useActiveProfile,
  useExplorePublications,
  Post as PostType,
  PublicationSortCriteria,
  useFeed,
  FeedEventItemType,
} from "@lens-protocol/react-web";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLensHookSafely } from "@/lib/useLensHookSafely";
import { Skeleton } from "../components/ui/skeleton";
import FeedContainer from "@/components/feed/FeedContainer";
import Post from "@/components/Post";

const Feed: NextPage = () => {
  const activeProfile = useLensHookSafely(useActiveProfile);

  const publicFeed = useLensHookSafely(useExplorePublications, {
    limit: 25,
    publicationTypes: [PublicationTypes.Post],
    sortCriteria: PublicationSortCriteria.TopCollected,
  });

  const personalizedFeed = useLensHookSafely(useFeed, {
    // @ts-ignore: TODO, non-signed in state
    profileId: activeProfile?.data?.id,
    limit: 25,
    restrictEventTypesTo: [FeedEventItemType.Post],
  });

  console.log(personalizedFeed);

  const backmeExclusiveFeed = useLensHookSafely(useFeed, {
    // @ts-ignore: TODO, non-signed in state
    profileId: activeProfile?.data?.id,
    restrictEventTypesTo: [FeedEventItemType.Post],
    limit: 25,
  });

  return (
    <>
      <Nav />
      <section className="w-full container flex max-w-[64rem] flex-col items-center gap-4 text-center h-screen">
        <Tabs defaultValue="backme" className="w-full md:w-[620px]">
          <TabsList className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
            <TabsTrigger
              value="backme"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm "
            >
              <span className="bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600">
                Backme Exclusives
              </span>
            </TabsTrigger>
            <TabsTrigger
              value="feed"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Your Feed
            </TabsTrigger>
            <TabsTrigger
              value="public"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
            >
              Popular Posts
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="public"
            className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-8"
          >
            {/* Public feed loading */}
            {publicFeed?.loading &&
              Array.from({ length: 10 }).map((_, i) => (
                <Skeleton
                  className="h-[88px] animate-pulse bg-muted mt-3 w-full"
                  key={i}
                />
              ))}

            {/* Public feed has loaded */}
            {!publicFeed?.loading && publicFeed?.data && (
              <InfiniteScroll
                dataLength={publicFeed?.data?.length || 0}
                next={() => publicFeed?.next()}
                hasMore={publicFeed?.hasMore}
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
                endMessage={
                  <p className="text-muted-foreground text-sm my-4">
                    You&rsquo;ve seen it all!
                  </p>
                }
              >
                {/* @ts-ignore: PostType idk bro */}
                {publicFeed?.data?.map((post: PostType) => (
                  <Post key={post.id} post={post} />
                ))}
              </InfiniteScroll>
            )}
          </TabsContent>

          <TabsContent
            className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full mt-8"
            value="feed"
          >
            {/* Public feed loading */}
            {personalizedFeed?.loading &&
              Array.from({ length: 10 }).map((_, i) => (
                <Skeleton
                  className="h-[88px] animate-pulse bg-muted mt-3 w-full"
                  key={i}
                />
              ))}

            {/* Public feed has loaded */}
            {!personalizedFeed?.loading && personalizedFeed?.data && (
              <InfiniteScroll
                dataLength={personalizedFeed?.data?.length || 0}
                next={() => personalizedFeed?.next()}
                hasMore={personalizedFeed?.hasMore}
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
                endMessage={
                  <p className="text-muted-foreground text-sm my-4">
                    You&rsquo;ve seen it all!
                  </p>
                }
              >
                {personalizedFeed?.data?.map((post) => (
                  <Post key={post.root.id} post={post.root} />
                ))}
              </InfiniteScroll>
            )}
          </TabsContent>

          <TabsContent
            className="ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-8"
            value="backme"
          ></TabsContent>
        </Tabs>
      </section>
    </>
  );
};

export default Feed;
