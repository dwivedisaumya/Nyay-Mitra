import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# 1. Load variables from .env
load_dotenv()

# 2. Configure Google Credentials using absolute paths
key_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if key_path:
    # Resolves path relative to the current working directory
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = os.path.abspath(key_path)

# 3. Import Routers
# Note: In a larger app, you'd import a centralized 'api_router' from app.api.v1.router
from app.api.v1.endpoints import document

app = FastAPI(
    title="NyayMitra API",
    description="AI-powered legal document analysis and roadmap generation.",
    version="1.0.0",
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc" # ReDoc
)

# 4. Enhanced CORS Configuration
# Tip: In production, load these from an environment variable 'ALLOWED_ORIGINS'
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://nyay-mitra-frontend.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Specific methods like ["GET", "POST"] are safer
    allow_headers=["*"],
)

# 5. Include Routers
# prefixing here keeps your endpoint files cleaner
app.include_router(
    document.router, 
    prefix="/api/v1/documents", 
    tags=["Legal Analysis"]
)

# Root endpoint for health check - useful for Docker/Kubernetes/Render
@app.get("/", tags=["Health"])
async def health_check():
    return {
        "status": "online", 
        "service": "NyayMitra Core API",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    # Important: Run as 'app.main:app' so that relative imports within the app work correctly
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)