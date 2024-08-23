import Link from "next/link";
export default function Home() {
  return (
    <main className="w-screen h-screen bg-[#f8f2bf] flex justify-center items-center">
      <div className="border-double border-[#cd950c] h-3/5 w-2/3 border-8 outline-8 flex justify-evenly items-center">
        <Link href="/login">
          <button className="border-double border-[#cd950c] border-8 outline-8 h-16 w-24 bg-[#002349] text-[#cd950c] text-2xl">
            Login
          </button>
        </Link>

        <Link href="/signup">
          <button
            href="/signup"
            className="border-double border-[#cd950c] border-8 outline-8 h-16 w-24 bg-[#002349] text-[#cd950c] text-2xl"
          >
            Sign Up
          </button>
        </Link>
      </div>
    </main>
  );
}
