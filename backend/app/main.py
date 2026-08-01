from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

FRONTEND_DIST = os.path.abspath(
    os.path.join(BASE_DIR, "../../frontend/dist")
)

# Serve React assets
app.mount(
    "/assets",
    StaticFiles(directory=os.path.join(FRONTEND_DIST, "assets")),
    name="assets",
)

@app.get("/")
def serve_react():
    return FileResponse(os.path.join(FRONTEND_DIST, "index.html"))


@app.get("/api/hello")
def hello():
    return {"message": "Hello World"}