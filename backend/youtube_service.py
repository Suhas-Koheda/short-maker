from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from .config import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

class YouTubeService:
    def __init__(self, access_token: str, refresh_token: str = None):
        self.creds = Credentials(
            token=access_token,
            refresh_token=refresh_token,
            client_id=GOOGLE_CLIENT_ID,
            client_secret=GOOGLE_CLIENT_SECRET,
            token_uri="https://oauth2.googleapis.com/token"
        )
        self.youtube = build("youtube", "v3", credentials=self.creds)

    def list_my_videos(self, max_results=20):
        # 1. Get the 'uploads' playlist ID for the channel
        channels_response = self.youtube.channels().list(
            mine=True,
            part="contentDetails"
        ).execute()

        uploads_playlist_id = channels_response["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]

        # 2. List videos from that playlist
        playlist_items_response = self.youtube.playlistItems().list(
            playlistId=uploads_playlist_id,
            part="snippet,contentDetails",
            maxResults=max_results
        ).execute()

        videos = []
        for item in playlist_items_response.get("items", []):
            videos.append({
                "id": item["contentDetails"]["videoId"],
                "title": item["snippet"]["title"],
                "description": item["snippet"]["description"],
                "thumbnail": item["snippet"]["thumbnails"]["medium"]["url"],
                "published_at": item["snippet"]["publishedAt"]
            })
            
        return videos

    def download_video(self, video_id: str, output_path: str):
        """
        Downloads a video from YouTube using pytube.
        """
        from pytube import YouTube
        url = f"https://www.youtube.com/watch?v={video_id}"
        yt = YouTube(url)
        # Get highest resolution progressive stream (usually 720p) or a high quality dash stream
        stream = yt.streams.filter(progressive=True, file_extension='mp4').order_by('resolution').desc().first()
        if not stream:
            stream = yt.streams.filter(adaptive=True, file_extension='mp4').first()
        
        path = stream.download(output_path=os.path.dirname(output_path), filename=os.path.basename(output_path))
        return path
