import Image from "next/image";
import Link from "next/link";

export function Nav() {
  return (
    <>
      <div className="w-full flex items-center justify-center fixed top-0 left-0 z-50 rounded-xl shadow-md backdrop-blur-lg">
        <nav className="flex items-center justify-between w-full max-w-7xl py-5 px-4 ">
          <div className="flex items-center gap-3 transition duration-150">
            <Link href="/" className="flex items-center">
              <Image src="/logo.png" width={96} height={42} alt="Backme Logo" />
            </Link>
          </div>
        </nav>
      </div>
      <div className="h-24" />
    </>
  );
}
