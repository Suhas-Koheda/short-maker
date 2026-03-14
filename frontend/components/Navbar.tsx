"use client";
import React from "react";
import { Youtube, Github } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 glass border-b-0 m-4 rounded-2xl">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 gradient-accent rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Youtube className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold tracking-tight">
          Short<span className="text-indigo-500">Builder</span>
        </span>
      </div>
      
      <div className="flex items-center gap-6">
        <a href="#features" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Features</a>
        <a href="#pricing" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">Process</a>
        <div className="h-4 w-[1px] bg-zinc-800" />
        <a href="https://github.com" className="text-zinc-400 hover:text-white transition-colors">
          <Github className="w-5 h-5" />
        </a>
        <button className="px-5 py-2.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-all active:scale-95 shadow-lg shadow-white/5">
          Get Started
        </button>
      </div>
    </nav>
  );
}
