import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "../config/site";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Nav } from "@/components/Navbar";
import { SiteFooter } from "@/components/Footer";

const Home: NextPage = () => {
  return (
    <>
      <Nav />
      <section className="space-y-6 pb-12 pt-16 md:pb-2 md:pt-16 lg:py-24 mb-2">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl z-10">
            A new way to support your favorite creators.
          </h1>

          <p className="w-full max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 z-10">
            Access exclusive content made by people you love and support them
            directly; no middleman, no fees, no ads. On{" "}
            <Link
              className="font-semibold underline"
              href="https://polygon.technology/"
              target="_blank"
            >
              Polygon
            </Link>
            .
          </p>
          <div className="space-x-4 mt-4 z-10">
            <Link href="/login" className={cn(buttonVariants({ size: "lg" }))}>
              Get Started
            </Link>
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              GitHub
            </Link>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="container space-y-6 py-6 dark:bg-transparent md:py-12 lg:py-16"
      >
        <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            How it works
          </h2>
          <p className="max-w-[820px] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Subscribe to your favorite creators using cryptocurrency, and
            receive an NFT that grants you access to their exclusive content.
            Come back at any time to view the content you've unlocked.
          </p>
          <div className="relative w-full py-8">
            <div className="radial-gradient absolute blur-3xl rounded-full opacity-10 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 z-0 h-64 w-full md:top-32" />
            <Image
              src="/Fans.png"
              width={1607}
              height={557}
              alt="how it works - backme"
            />
          </div>
        </div>
      </section>
      <section id="open-source" className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
          <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
            Why use it?
          </h2>
          <p className="max-w-[820px] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Backme is built on the{" "}
            <Link
              className="font-semibold underline"
              href="https://polygon.technology/"
              target="_blank"
            >
              Polygon
            </Link>{" "}
            blockchain using{" "}
            <Link
              className="font-semibold underline"
              href="https://www.lens.xyz/"
              target="_blank"
            >
              Lens Protocol
            </Link>
            , meaning you verifiably own the content you upload on the
            blockchain. This design enables you to earn money directly from your
            fans without us taking a cut by using cryptocurrency.
          </p>
        </div>
      </section>
      <SiteFooter className="border-t" />
    </>
  );
};

export default Home;
