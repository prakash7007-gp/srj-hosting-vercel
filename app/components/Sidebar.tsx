"use client";
import Link from "next/link";
import { useState } from "react";
import { LayoutDashboard, UserPlus, ListChecks, ChevronLeft, ChevronRight } from "lucide-react";

export default function Sidebar({ initialOpen = true }: { initialOpen?: boolean }) {
  const [open, setOpen] = useState(initialOpen);

  return (
    <div
      className={`h-screen bg-cyan-800 text-white flex flex-col p-5 gap-6 fixed left-0 top-0 transition-all duration-200 ease-in-out ${
        open ? "w-64" : "w-16"
      }`}
    >
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold border-b border-cyan-600 pb-3 truncate ${open ? "" : "hidden"}`}>
          SRJ Care
        </h2>
        <button
          aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="ml-2 p-1 rounded hover:bg-cyan-700"
        >
          {open ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      <nav className="flex flex-col gap-3 text-sm mt-4">
        <Link
          href="/"
          title="Dashboard"
          className={`flex items-center gap-3 p-2 rounded hover:bg-cyan-700 ${open ? "" : "justify-center"}`}
        >
          <LayoutDashboard size={20} />
          <span className={`${open ? "" : "hidden"}`}>Dashboard</span>
        </Link>

        <Link
          href="/add"
          title="Add Patient"
          className={`flex items-center gap-3 p-2 rounded hover:bg-cyan-700 ${open ? "" : "justify-center"}`}
        >
          <UserPlus size={20} />
          <span className={`${open ? "" : "hidden"}`}>Add Patient</span>
        </Link>

        <Link
          href="/followup"
          title="Follow-ups"
          className={`flex items-center gap-3 p-2 rounded hover:bg-cyan-700 ${open ? "" : "justify-center"}`}
        >
          <ListChecks size={20} />
          <span className={`${open ? "" : "hidden"}`}>Follow-ups</span>
        </Link>
      </nav>
    </div>
  );
}
