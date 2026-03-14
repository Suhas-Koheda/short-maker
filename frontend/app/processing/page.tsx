"use client";
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Loader2, CheckCircle2, Circle, Clock } from "lucide-react";
import { motion } from "framer-motion";

const STEPS = [
  { id: "download", label: "Accessing YouTube Studio", icon: <Clock /> },
  { id: "transcribe", label: "Transcribing Audio", icon: <Clock /> },
  { id: "viral", label: "Analyzing Viral Hooks", icon: <Clock /> },
  { id: "reframe", label: "Smart Reframing (9:16)", icon: <Clock /> },
  { id: "captions", label: "Generating Animated Captions", icon: <Clock /> },
  { id: "export", label: "Finalizing Clips", icon: <Clock /> },
];

export default function Processing() {
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, you'd get the job_id from URL search params
    const videoId = new URLSearchParams(window.location.search).get("video");
    if (!videoId) return;

    const pollStatus = async () => {
      try {
        const response = await fetch(`http://localhost:8000/process/status/${videoId}`);
        const data = await response.json();
        
        switch (data.status) {
          case "downloading": setCurrentStep(0); break;
          case "transcribing": setCurrentStep(1); break;
          case "analyzing": setCurrentStep(2); break;
          case "clipping": setCurrentStep(4); break; // Skip to captions/finalizing for simplicity
          case "completed": 
            setCurrentStep(5);
            setTimeout(() => window.location.href = "/clips", 1500);
            break;
          case "failed":
            setError(data.error);
            break;
        }
      } catch (e) {
        console.error("Polling error", e);
      }
    };

    const interval = setInterval(pollStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[80vh]">
        <div className="relative mb-12">
          <div className="w-32 h-32 rounded-full border-4 border-indigo-500/20 flex items-center justify-center">
            <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
          </div>
          <div className="absolute inset-0 bg-indigo-500/20 blur-[40px] rounded-full animate-pulse" />
        </div>

        <h1 className="text-4xl font-black mb-4 tracking-tight text-center">AI Magic in Progress</h1>
        <p className="text-zinc-400 text-center mb-12">We're transforming your video into viral-ready shorts. This usually takes a few minutes.</p>

        <div className="w-full space-y-4">
          {STEPS.map((step, idx) => (
            <div key={step.id} className={`flex items-center gap-4 p-5 rounded-2xl glass border transition-all ${idx <= currentStep ? "border-indigo-500/30 bg-indigo-500/5 opacity-100" : "border-zinc-800/50 opacity-40"}`}>
              {idx < currentStep ? (
                <CheckCircle2 className="text-green-500 w-6 h-6 shrink-0" />
              ) : idx === currentStep ? (
                <Loader2 className="text-indigo-500 w-6 h-6 animate-spin shrink-0" />
              ) : (
                <Circle className="text-zinc-700 w-6 h-6 shrink-0" />
              )}
              
              <div className="flex-1">
                <p className={`font-bold ${idx === currentStep ? "text-white" : "text-zinc-400"}`}>
                  {step.label}
                </p>
                {idx === currentStep && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "linear" }}
                    className="h-1 bg-indigo-500 mt-2 rounded-full opacity-50"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
