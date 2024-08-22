import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Blog App",
  description:
    "A simple blog application using Next.js, Supabase and Tailwind CSS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="p-4 bg-white shadow">
          <h1 className="text-2xl font-bold">Instaface</h1>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
