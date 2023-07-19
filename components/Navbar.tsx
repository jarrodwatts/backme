import Image from "next/image";
import Link from "next/link";

export function Nav() {
  return (
    <>
      <div className="w-full flex items-center justify-center fixed top-0 left-0 z-50 rounded-xl shadow-md backdrop-blur-lg">
        <nav className="flex items-center justify-between w-full max-w-7xl py-5 px-4 ">
          <div className="flex items-center gap-3 transition duration-150">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" width={42} height={42} alt="Backme Logo" />
            </Link>
          </div>

          <div className="flex gap-4 items-center">
            <Link
              href="https://github.com/jarrodwatts/backme"
              target="_blank"
              className="text-white hover:text-white transition-colors duration-300"
            >
              <Image
                src="/github.png"
                width={24}
                height={24}
                alt="Github icon"
              />
            </Link>
            <Link
              href="https://twitter.com/jarrodwattsdev"
              target="_blank"
              className="text-white hover:text-white transition-colors duration-300"
            >
              <Image
                src="/twitter.png"
                width={18}
                height={18}
                alt="Twitter icon"
              />
            </Link>
            <Link
              href="https://discord.com/invite/4eQBm7DDNS"
              target="_blank"
              className="text-white hover:text-white transition-colors duration-300"
            >
              <Image
                src="/discord.png"
                width={24}
                height={24}
                alt="Discord icon"
              />
            </Link>
          </div>
        </nav>
      </div>
      <div className="h-24" />
    </>
  );
}
