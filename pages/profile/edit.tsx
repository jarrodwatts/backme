import { Nav } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useActiveProfile } from "@lens-protocol/react-web";
import { useRouter } from "next/router";
import ProfileForm from "@/components/ProfileForm";
import { Skeleton } from "@/components/ui/skeleton";

const ProfilePage = () => {
  const router = useRouter();

  const activeProfile = useActiveProfile();

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
          {activeProfile?.loading ? (
            <Skeleton className="h-96" />
          ) : (
            activeProfile &&
            activeProfile.data && <ProfileForm profile={activeProfile?.data} />
          )}
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
