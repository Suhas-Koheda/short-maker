import os
import cv2
import numpy as np
import mediapipe as mp
from moviepy import VideoFileClip, TextClip, CompositeVideoClip, ColorClip
from moviepy.video.fx import Resize
from faster_whisper import WhisperModel
from .config import TEMP_DIR, WHISPER_MODEL

class VideoProcessor:
    def __init__(self):
        self.model = WhisperModel(WHISPER_MODEL, device="cpu", compute_type="int8")
        self.mp_face_detection = mp.solutions.face_detection
        self.face_detection = self.mp_face_detection.FaceDetection(model_selection=1, min_detection_confidence=0.5)

    def transcribe(self, video_path: str):
        segments, info = self.model.transcribe(video_path, beam_size=5)
        transcript = []
        for segment in segments:
            transcript.append({
                "start": segment.start,
                "end": segment.end,
                "text": segment.text.strip()
            })
        return transcript
    def detect_viral_moments(self, transcript):
        """
        Identify high-engagement moments.
        Rules: emotional words, question hooks, short punchy statements.
        """
        viral_keywords = ["secret", "mistake", "hack", "trick", "amazing", "stop", "never", "always", "how to"]
        moments = []
        
        # Look for 30-60 second windows with high-impact words
        for i in range(len(transcript)):
            text = transcript[i]["text"].lower()
            if any(kw in text for kw in viral_keywords):
                start = transcript[i]["start"]
                # Create a 30s clip from the start of the hook
                moments.append({
                    "start": start,
                    "end": min(start + 30, transcript[-1]["end"]),
                    "text": transcript[i]["text"]
                })
        
        return moments[:3] # Limit to top 3 hooks

    def generate_subtitle_file(self, segments, offset, duration, output_srt):
        import pysubs2
        subs = pysubs2.SSAFile()
        for s in segments:
            # Adjust time relative to clip start
            start = (s["start"] - offset) * 1000
            end = (s["end"] - offset) * 1000
            
            if start < 0: continue
            if start >= duration * 1000: break
            
            event = pysubs2.SSAEvent(start=int(start), end=int(end), text=s["text"].upper())
            subs.append(event)
        
        subs.save(output_srt)


    def get_subject_center(self, video_path: str, start_time: float, end_time: float):
        """
        Detect faces in the clip and return the average X coordinate.
        """
        cap = cv2.VideoCapture(video_path)
        cap.set(cv2.CAP_PROP_POS_MSEC, start_time * 1000)
        
        centers = []
        frame_count = 0
        max_frames = 30 # Sample 30 frames
        
        while frame_count < max_frames:
            ret, frame = cap.read()
            if not ret:
                break
            
            # Convert to RGB
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.face_detection.process(frame_rgb)
            
            if results.detections:
                for detection in results.detections:
                    bbox = detection.location_data.relative_bounding_box
                    center_x = bbox.xmin + (bbox.width / 2)
                    centers.append(center_x)
            
            frame_count += 1
            # Skip some frames
            cap.set(cv2.CAP_PROP_POS_FRAMES, cap.get(cv2.CAP_PROP_POS_FRAMES) + 10)
            
        cap.release()
        
        if centers:
            return sum(centers) / len(centers)
        return 0.5 # Default to center

    def create_short(self, video_path: str, start_time: float, end_time: float, output_id: str):
        clip = VideoFileClip(video_path).subclipped(start_time, end_time)
        
        # 1. Reframing
        w, h = clip.size
        target_ratio = 9/16
        target_w = int(h * target_ratio)
        subject_x_percent = self.get_subject_center(video_path, start_time, end_time)
        center_x = int(subject_x_percent * w)
        x1 = max(0, min(w - target_w, center_x - target_w // 2))
        x2 = x1 + target_w
        
        vertical_clip = clip.cropped(x1=x1, y1=0, x2=x2, y2=h)
        vertical_clip = vertical_clip.resized(width=1080)
        
        temp_video = os.path.join(TEMP_DIR, f"{output_id}_raw.mp4")
        vertical_clip.write_videofile(temp_video, codec="libx264", audio_codec="aac", fps=30)
        
        # 2. Add Captions using FFmpeg (avoiding ImageMagick)
        segments = self.transcribe(video_path)
        srt_path = os.path.join(TEMP_DIR, f"{output_id}.srt")
        self.generate_subtitle_file(segments, start_time, end_time - start_time, srt_path)
        
        final_output = os.path.join(TEMP_DIR, f"{output_id}.mp4")
        import subprocess
        # Burn subtitles with premium styles
        cmd = [
            "ffmpeg", "-y", "-i", temp_video,
            "-vf", f"subtitles={srt_path}:force_style='Alignment=2,FontSize=24,PrimaryColour=&H00FFFF&,OutlineColour=&H000000&,BorderStyle=3,MarginV=60'",
            "-c:a", "copy", final_output
        ]
        subprocess.run(cmd, check=True)
        
        return final_output
