"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Search, Play, ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";

// Mock data for initial UI dev
const MOCK_VIDEOS = [
  { id: "1", title: "How to build a SaaS in 2024", thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg", duration: "12:45", date: "2 days ago" },
  { id: "2", title: "10 Tips for Viral Growth", thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg", duration: "08:12", date: "1 week ago" },
  { id: "3", title: "Mastering Next.js 15", thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg", duration: "25:30", date: "3 weeks ago" },
  { id: "4", title: "FastAPI Backend Tutorial", thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg", duration: "15:20", date: "1 month ago" },
];

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchVideos = async () => {
      const token = localStorage.getItem("yt_access_token");
      if (!token) return;
      
      try {
        const response = await fetch(`http://localhost:8000/videos/my?access_token=${token}`);
        const data = await response.json();
        setVideos(data);
      } catch (e) {
        console.error("Failed to fetch videos", e);
      }
    };
    fetchVideos();
  }, []);

  const handleGenerate = async (id: string) => {
    setLoading(true);
    const token = localStorage.getItem("yt_access_token");
    
    try {
      await fetch("http://localhost:8000/process/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ video_id: id, access_token: token })
      });
      window.location.href = `/processing?video=${id}`;
    } catch (e) {
      console.error("Generation failed", e);
      setLoading(false);
    }
  };

  const displayVideos = videos.length > 0 ? videos : MOCK_VIDEOS;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black mb-2 tracking-tight">Your Video Library</h1>
            <p className="text-zinc-400">Select a video to start extracting viral clips.</p>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
            <input 
              type="text"
              placeholder="Search your videos..."
              className="bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-12 pr-6 w-full md:w-96 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayVideos.map((video) => (
            <div key={video.id} className="group relative rounded-3xl overflow-hidden glass-card border border-zinc-800/50 hover:border-indigo-500/30 transition-all">
              <div className="relative aspect-video overflow-hidden">
                <Image 
                  src={video.thumbnail} 
                  alt={video.title} 
                  fill 
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <Play className="text-white w-12 h-12 fill-white/20" />
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-1 rounded-lg bg-black/80 text-[10px] font-bold text-white backdrop-blur-md">
                  {video.duration}
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 line-clamp-2 leading-snug group-hover:text-indigo-400 transition-colors">
                  {video.title}
                </h3>
                <p className="text-zinc-500 text-sm mb-6">{video.date}</p>
                
                <button 
                  onClick={() => handleGenerate(video.id)}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-500 transition-all active:scale-95 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Generate Shorts
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
