"use client";
import Link from "next/link";
import { LayoutDashboard, UserPlus, ListChecks } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-cyan-800 text-white flex flex-col p-5 gap-6 fixed left-0 top-0">
      <h2 className="text-2xl font-bold border-b border-cyan-600 pb-3">SRJ Care</h2>

      <nav className="flex flex-col gap-3 text-sm">
        <Link href="/" className="flex items-center gap-3 p-2 rounded hover:bg-cyan-700">
          <LayoutDashboard size={20} /> Dashboard
        </Link>

        <Link href="/add" className="flex items-center gap-3 p-2 rounded hover:bg-cyan-700">
          <UserPlus size={20} /> Add Patient
        </Link>

        <Link href="/followup" className="flex items-center gap-3 p-2 rounded hover:bg-cyan-700">
          <ListChecks size={20} /> Follow-ups
        </Link>
      </nav>
    </div>
  );    
}
