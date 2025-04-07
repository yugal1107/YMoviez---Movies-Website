# This is a guide file - implement these changes in your FastAPI server

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Add CORS middleware to allow cross-origin requests
app.add_middleware(
    CORSMiddleware,
    # Allow requests from your client's origin
    # In production, replace * with your frontend URL for security
    allow_origins=["*"],  # For development
    # Or more secure: ["http://localhost:5173", "https://yourdomain.com"]
    allow_credentials=True,
    allow_methods=["*"],  # Can be restricted to ["GET", "POST"] etc.
    allow_headers=["*"],
)

# Your existing FastAPI routes continue below...
@app.get("/recommend")
async def recommend(tmdb_id: int, top_n: int = 10):
    # Your existing recommendation logic
    # ...
