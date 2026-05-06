from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
    
from core.config import settings
from routers import story, job
from db.database import create_tables

create_tables()

app = FastAPI(
    title = "Choose your Adventure Game API",
    description = "An API to generate cool stories",
    version = "0.1.0",
    docs_url="/docs",
    redoc_url="/redoc"
)    

app.add_middleware(
    CORSMiddleware,
    allow_origins=[https://4aa3326a-7f10-43c4-b86a-6cf786df9b30.e1-eu-north-azure.choreoapps.dev],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(story.router,prefix=settings.API_PREFIX)
app.include_router(job.router,prefix=settings.API_PREFIX)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)