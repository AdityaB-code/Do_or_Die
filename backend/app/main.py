from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI(title="3D Viewer Backend")

# Enable CORS for frontend cross-origin requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIST = os.path.abspath(os.path.join(BASE_DIR, "../../frontend/dist"))
PUBLIC_DIR = os.path.abspath(os.path.join(BASE_DIR, "../../frontend/public"))

# Serve Frontend production assets if dist directory exists
if os.path.exists(FRONTEND_DIST):
    assets_dir = os.path.join(FRONTEND_DIST, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

if os.path.exists(PUBLIC_DIR):
    models_dir = os.path.join(PUBLIC_DIR, "models")
    audio_dir = os.path.join(PUBLIC_DIR, "audio")
    if os.path.exists(models_dir):
        app.mount("/models", StaticFiles(directory=models_dir), name="models")
    if os.path.exists(audio_dir):
        app.mount("/audio", StaticFiles(directory=audio_dir), name="audio")

@app.get("/api/hello")
def hello():
    return {
        "status": "online",
        "message": "Connected to FastAPI Backend successfully!",
        "version": "1.0.0"
    }

@app.get("/")
def serve_react():
    index_path = os.path.join(FRONTEND_DIST, "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"message": "Backend API is running. Build frontend with 'npm run build' to serve UI here."}