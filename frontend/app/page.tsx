"use client";
import React from "react";
import Navbar from "@/components/Navbar";
import { Sparkles, Zap, Video, Type, Expand, Share2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const loginWithGoogle = async () => {
    // In a real app, this would call the backend /auth/login
    console.log("Redirecting to Google OAuth...");
    window.location.href = "http://localhost:8000/auth/login";
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden selection:bg-indigo-500/30">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      
      <Navbar />

      <main className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 text-zinc-400 text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>AI-Powered Video Transformation</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-8 gradient-text"
          >
            Long Form to <br /> 
            <span className="text-indigo-500">Viral Shorts</span>.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Automatically extract high-engagement clips from your YouTube videos. 
            Smart reframing, AI captions, and viral detection—all in one place.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button 
              onClick={loginWithGoogle}
              className="px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-500 transition-all hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)] active:scale-95"
            >
              Sign in with YouTube
            </button>
            <button className="px-8 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 text-white font-bold text-lg hover:bg-zinc-800 transition-all active:scale-95">
              Watch Demo
            </button>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-yellow-400" />}
            title="Viral Detection"
            description="Our AI identifies high-energy moments and punchy statements perfect for social media hooks."
          />
          <FeatureCard 
            icon={<Expand className="w-6 h-6 text-blue-400" />}
            title="Smart Reframing"
            description="Automatic subject tracking keeps you in the center of every 9:16 vertical clip."
          />
          <FeatureCard 
            icon={<Type className="w-6 h-6 text-green-400" />}
            title="Auto Captions"
            description="Generate animated, high-impact word-by-word subtitles that keep viewers engaged."
          />
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-3xl glass-card">
      <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}
