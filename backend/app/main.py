from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

# Get the absolute path to frontend folder
frontend_path = os.path.join(os.path.dirname(__file__), "../../frontend")

# Serve static files (CSS, JS)
app.mount("/css", StaticFiles(directory=os.path.join(frontend_path, "css")), name="css")
app.mount("/js", StaticFiles(directory=os.path.join(frontend_path, "js")), name="js")


# Serve HTML page
@app.get("/")
def serve_index():
    return FileResponse(os.path.join(frontend_path, "index.html"))


# Your API endpoint
@app.get("/api/hello")
def read_root():
    return {"message": "Hello World"}
