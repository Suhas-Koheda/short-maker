import os
import uvicorn
from fastapi import FastAPI, Request, HTTPException, BackgroundTasks, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional

# Local imports
from .auth import router as auth_router
from .youtube_service import YouTubeService
from .processor import VideoProcessor
from .config import TEMP_DIR

app = FastAPI(title="ShortBuilder API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router)

# In-memory storage for processing status (Use Redis/DB for production)
processing_jobs = {}

class VideoSelection(BaseModel):
    video_id: str
    access_token: str

@app.post("/process/start")
async def start_processing(selection: VideoSelection, background_tasks: BackgroundTasks):
    job_id = selection.video_id # Simplification
    processing_jobs[job_id] = {"status": "started", "progress": 0}
    
    background_tasks.add_task(run_pipeline, selection.video_id, selection.access_token)
    
    return {"job_id": job_id, "message": "Processing started"}

async def run_pipeline(video_id: str, access_token: str):
    try:
        yt = YouTubeService(access_token)
        processor = VideoProcessor()
        
        # 1. Download
        video_input = os.path.join(TEMP_DIR, f"{video_id}_input.mp4")
        processing_jobs[video_id]["status"] = "downloading"
        yt.download_video(video_id, video_input)
        
        # 2. Transcribe
        processing_jobs[video_id]["status"] = "transcribing"
        transcript = processor.transcribe(video_input)
        
        # 3. Detect Viral Moments
        processing_jobs[video_id]["status"] = "analyzing"
        moments = processor.detect_viral_moments(transcript)
        
        # 4. Generate Shorts
        processing_jobs[video_id]["status"] = "clipping"
        clips = []
        for i, moment in enumerate(moments):
            output_name = f"{video_id}_short_{i+1}"
            processor.create_short(video_input, moment["start"], moment["end"], output_name)
            clips.append(output_name)
        
        processing_jobs[video_id]["status"] = "completed"
        processing_jobs[video_id]["clips"] = clips
    except Exception as e:
        print(f"Error in pipeline: {e}")
        processing_jobs[video_id] = {"status": "failed", "error": str(e)}

@app.get("/process/status/{job_id}")
async def get_status(job_id: str):
    if job_id not in processing_jobs:
        raise HTTPException(status_code=404, detail="Job not found")
    return processing_jobs[job_id]

@app.get("/videos/my")
async def list_videos(access_token: str):
    yt = YouTubeService(access_token)
    return yt.list_my_videos()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
