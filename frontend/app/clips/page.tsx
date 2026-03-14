"use client";
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import { Download, Share2, Edit2, Play, Check, Copy } from "lucide-react";
import Image from "next/image";

const MOCK_CLIPS = [
  { id: "c1", title: "The Secret Hook", thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg", score: 98 },
  { id: "c2", title: "Scaling Fast", thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg", score: 92 },
  { id: "c3", title: "Avoid this mistake", thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg", score: 85 },
];

export default function ClipsPage() {
  const [selectedClip, setSelectedClip] = useState(MOCK_CLIPS[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        {/* Preview Player Area */}
        <div className="flex-1">
          <div className="aspect-[9/16] max-w-sm mx-auto rounded-[2.5rem] overflow-hidden border-8 border-zinc-900 shadow-2xl relative bg-black group">
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 z-10 cursor-pointer">
              <Play className="w-16 h-16 text-white fill-white/20" />
            </div>
            {/* Real video tag would go here */}
            <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700 font-bold">
              Video Preview: {selectedClip.title}
            </div>
            
            {/* Progress bar overlay */}
            <div className="absolute bottom-6 left-6 right-6 h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 w-1/3" />
            </div>
          </div>
          
          <div className="mt-8 flex items-center justify-center gap-4">
            <button className="flex-1 max-w-[180px] flex items-center justify-center gap-2 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-500 transition-all active:scale-95">
              <Download className="w-5 h-5" />
              Download
            </button>
            <button className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition-all">
              <Edit2 className="w-5 h-5" />
            </button>
            <button className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-white hover:bg-zinc-800 transition-all">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Clips Sidebar */}
        <div className="w-full lg:w-96">
          <header className="mb-8">
            <h1 className="text-3xl font-black mb-2 tracking-tight">Generated Clips</h1>
            <p className="text-zinc-400">We found {MOCK_CLIPS.length} high-potential moments.</p>
          </header>

          <div className="space-y-4">
            {MOCK_CLIPS.map((clip) => (
              <button 
                key={clip.id}
                onClick={() => setSelectedClip(clip)}
                className={`w-full flex items-center gap-4 p-4 rounded-3xl border transition-all text-left ${selectedClip.id === clip.id ? "bg-indigo-500/10 border-indigo-500/50 shadow-lg shadow-indigo-500/5" : "bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-900"}`}
              >
                <div className="w-20 h-28 rounded-xl overflow-hidden relative shrink-0">
                  <Image src={clip.thumbnail} alt={clip.title} fill className="object-cover" />
                  <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-indigo-600 text-[8px] font-black text-white">
                    {clip.score}%
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg mb-1 truncate">{clip.title}</h3>
                  <p className="text-zinc-500 text-sm mb-3">00:02:15 - 00:02:45</p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-lg bg-zinc-800 text-[10px] font-bold text-zinc-400">#HOOK</span>
                    <span className="px-2 py-0.5 rounded-lg bg-zinc-800 text-[10px] font-bold text-zinc-400">#VIRAL</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-12 p-6 rounded-[2rem] bg-indigo-600/10 border border-indigo-500/20">
            <h4 className="font-bold mb-2">AI Optimization Tip</h4>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6">
              Clip #1 has the highest potential engagement score due to the strong emotional hook in the first 3 seconds.
            </p>
            <button 
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 transition-all"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied Title" : "Copy Optimized Title"}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
