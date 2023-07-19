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

const Login: NextPage = () => {
  return (
    <>
      <Nav />
      <div className="container flex h-screen flex-col items-center pt-12 md:flex-row md:items-start md:pt-24 gap-8 md:gap-32">
        <div className="flex w-full flex-col justify-center space-y-6 sm:w-[600px]">
          <div className="flex flex-col space-y-2 text-center">
            {/* <Icons.logo className="mx-auto h-6 w-6" /> */}
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
                  Connect your wallet to get started.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <SignInWithLensButton />
              </CardContent>
            </Card>
          </div>
        </div>
        <div
          // visible on desktop but not mobile
          className="hidden md:flex"
        >
          hey
        </div>
      </div>
    </>
  );
};

export default Login;
