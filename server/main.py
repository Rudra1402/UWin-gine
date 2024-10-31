from fastapi import FastAPI
from routes.user_route import router as user_router
import uvicorn

app = FastAPI(
    title="UWingine Server",
    summary="University of Windsor - LLM Chatbot!",
)

app.include_router(user_router, prefix="/user", tags=["users"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)