"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

export default function Navbar({ session }: { session: any }) {
  return (
    <nav className="bg-emerald-700 text-white p-4 flex justify-between items-center flex-wrap gap-4">
      <Link href="/" className="text-2xl font-bold">
        🕋 HajjUmrah
      </Link>
      <div className="space-x-4 flex flex-wrap gap-2">
        <Link href="/packages">Packages</Link>
        <Link href="/guides">Guides</Link>
        <Link href="/duas">Duas</Link>
        {session ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            {session.user?.role === "ADMIN" && <Link href="/admin">Admin</Link>}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}