import { useLensHookSafely } from "@/lib/useLensHookSafely";
import { useActiveProfile } from "@lens-protocol/react-web";
import { MediaRenderer } from "@thirdweb-dev/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

export function Nav() {
  const router = useRouter();
  const activeProfile = useLensHookSafely(useActiveProfile);

  return (
    <>
      <div className="w-full flex items-center justify-center fixed top-0 left-0 z-50 rounded-xl shadow-md backdrop-blur-lg">
        <nav className="flex items-center justify-between w-full max-w-7xl py-5 px-4 ">
          <div className="flex items-center gap-3 transition duration-150">
            <Link
              href={activeProfile?.data ? `/feed` : `/`}
              className="flex items-center"
            >
              <Image src="/logo.png" width={96} height={42} alt="Backme Logo" />
            </Link>
          </div>

          {activeProfile?.loading ? null : activeProfile?.data ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/create")}
                className="inline-flex items-center justify-center px-4 py-2 font-bold font-md"
              >
                Create
              </button>
              <Link href={`/profile/${activeProfile?.data?.handle}`}>
                <MediaRenderer
                  // @ts-ignore, image is there
                  src={activeProfile?.data?.picture?.original?.url || ""}
                  width={"32px"}
                  height={"32px"}
                  className="rounded-full"
                />
                <span className="text-sm font-medium text-white">
                  {activeProfile?.data?.name}
                </span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-bol"
              >
                Login
              </Link>
            </div>
          )}
        </nav>
      </div>
      <div className="h-24" />
    </>
  );
}
