from fastapi import APIRouter
from pydantic import BaseModel
import os
import httpx

router = APIRouter(prefix="/gemini", tags=["gemini"])

class ChatRequest(BaseModel):
    message: str
    context: str = "general"

@router.post("/chat")
async def chat(req: ChatRequest):
    if req.context == "design":
        system = "Sən Məmmədov Group şirkətinin AI dizayn köməkçisisən. Azərbaycan dilində tövsiyə ver."
    elif req.context == "calculator":
        system = "Sən Məmmədov Group şirkətinin təmir kalkulyator köməkçisisən. Azərbaycan dilində məsləhət ver."
    else:
        system = "Sən Məmmədov Group AI köməkçisisən. Təmir, dizayn mövzularında Azərbaycan dilində kömək et."

    api_key = os.getenv("GEMINI_API_KEY")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    payload = {"contents": [{"parts": [{"text": f"{system}\n\nİstifadəçi: {req.message}"}]}]}

    async with httpx.AsyncClient() as client:
        res = await client.post(url, json=payload, timeout=30)
        data = res.json()

    reply = data["candidates"][0]["content"]["parts"][0]["text"]
    return {"reply": reply}
