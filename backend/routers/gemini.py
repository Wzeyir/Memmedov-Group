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
        system = "Sen Memmedov Group AI dizayn komekciseniz. Azerbaycan dilinde tovsiye ver."
    elif req.context == "calculator":
        system = "Sen Memmedov Group temir kalkulyator komekciseniz. Azerbaycan dilinde meslehet ver."
    else:
        system = "Sen Memmedov Group AI komekciseniz. Temir, dizayn movzularinda Azerbaycan dilinde komek et."

    api_key = os.getenv("GEMINI_API_KEY")
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={api_key}"
    payload = {"contents": [{"parts": [{"text": f"{system}\n\nIstifadeci: {req.message}"}]}]}

    async with httpx.AsyncClient() as client:
        res = await client.post(url, json=payload, timeout=30)
        data = res.json()

    if "candidates" not in data:
        return {"reply": str(data)}

    reply = data["candidates"][0]["content"]["parts"][0]["text"]
    return {"reply": reply}
