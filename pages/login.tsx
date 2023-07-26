import { Nav } from "@/components/Navbar";
import { NextPage } from "next";
import Link from "next/link";
import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import SignInWithLensButton from "@/components/SignInWithLensButton";
import { useLensHookSafely } from "@/lib/useLensHookSafely";
import { useActiveProfile, useActiveWallet } from "@lens-protocol/react-web";
import { MediaRenderer } from "@thirdweb-dev/react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/router";

const Login: NextPage = () => {
  const router = useRouter();
  const walletInfo = useLensHookSafely(useActiveWallet);
  const activeProfile = useLensHookSafely(useActiveProfile);

  return (
    <>
      <Nav />
      <div className="container flex h-screen flex-col items-center pt-12 md:flex-row md:items-start md:pt-24 gap-8 md:gap-32">
        <div className="flex w-full flex-col justify-center space-y-6 md:w-[860px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-4xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-md text-muted-foreground pb-4">
              Backme requires you to have a Lens profile NFT.{" "}
              <Link
                href="https://lens.xyz/"
                target="_blank"
                className="underline"
              >
                Learn more
              </Link>
              .
            </p>
            <Card className="pt-6 align-baseline rounded-md pb-8">
              <CardHeader>
                <CardTitle className="text-2xl">Sign in with Lens</CardTitle>
                <CardDescription className="pt-2">
                  Connect your wallet and sign in with Lens below.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {walletInfo?.data && activeProfile?.data ? (
                  <Button onClick={() => router.push("/feed")}>
                    Continue to Backme
                  </Button>
                ) : (
                  <SignInWithLensButton />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="md:flex md:border-l-2 border-[rbga(0,0,0,0.1)] md:pl-4 h-[85%] w-full">
          {/* Wallet connected, has profile on Lens. */}
          {walletInfo?.data && activeProfile?.data && (
            <div className="flex flex-col w-full justify-start items-center space-y-4">
              <p className="text-2xl font-semibold">Your Lens Profile</p>

              <div className="flex flex-row outline outline-2 outline-[rgba(255,255,255,.1)] rounded-md p-4 w-full gap-4 items-center">
                <MediaRenderer
                  src={
                    // @ts-ignore
                    activeProfile?.data?.picture?.original?.url || "/user.png"
                  }
                  width="128px"
                  height="128px"
                  className="rounded-full h-24 w-24"
                />
                <div className="flex flex-col space-y-2">
                  <p className="text-xl font-semibold">
                    {activeProfile?.data?.handle}
                  </p>
                  <p className="text-md text-muted-foreground">
                    {activeProfile?.data?.stats.totalFollowers} followers
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Wallet connected, but no Lens profile */}
          {walletInfo?.data && !activeProfile?.data && (
            <div className="flex flex-col w-full justify-start items-center space-y-4">
              <p className="text-red-500 text-lg font-semibold">
                You don&rsquo;t have a Lens profile yet. 😞
              </p>
              <p className="text-md text-muted-foreground pb-4">
                Backme requires you to have a Lens profile NFT.{" "}
                <Link
                  href="https://lens.xyz/"
                  target="_blank"
                  className="underline"
                >
                  Learn more
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;
