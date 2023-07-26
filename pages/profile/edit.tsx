import { Nav } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useLensHookSafely } from "@/lib/useLensHookSafely";
import { useActiveProfile } from "@lens-protocol/react-web";
import { useRouter } from "next/router";
import { MediaRenderer } from "@thirdweb-dev/react";
import { useToast } from "@/components/ui/use-toast";

const ProfilePage = () => {
  const router = useRouter();
  const { handle } = router.query;
  const { toast } = useToast();

  const activeProfile = useLensHookSafely(useActiveProfile);

  async function handleFollow() {}

  if (activeProfile?.error) {
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
            alt={`${activeProfile?.data?.handle}'s cover photo`}
            // @ts-ignore, image is there
            src={activeProfile?.data?.coverPicture?.original?.url || ""}
            width="100%"
            height="200px"
            style={{
              objectFit: "cover",
            }}
          />

          {/* Profile picture */}
          <MediaRenderer
            alt={`${activeProfile?.data?.handle}'s profile picture`}
            // @ts-ignore, image is there
            src={activeProfile?.data?.picture?.original?.url || ""}
            width="128px"
            height="128px"
            style={{
              objectFit: "cover",
            }}
            className="rounded-full border-4 shadow-sm -mt-16 ml-4"
          />

          {/* Profile name */}
          <h1 className="text-xl font-semibold w-auto mt-4">
            {activeProfile?.data?.name}
          </h1>

          {/* Handle */}
          <p className="text-sm text-muted-foreground">
            @{activeProfile?.data?.handle}
          </p>

          {/* Bio */}
          <p className="leading-7 mt-1">{activeProfile?.data?.bio}</p>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
