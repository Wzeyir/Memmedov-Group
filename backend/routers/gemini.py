from fastapi import APIRouter
from pydantic import BaseModel
import os
import google.generativeai as genai

router = APIRouter(prefix="/gemini", tags=["gemini"])

class ChatRequest(BaseModel):
    message: str
    context: str = "general"

@router.post("/chat")
async def chat(req: ChatRequest):
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    model = genai.GenerativeModel("gemini-1.5-flash")

    if req.context == "design":
        system = "Sən Məmmədov Group şirkətinin AI dizayn köməkçisisən. Azərbaycan dilində tövsiyə ver."
    elif req.context == "calculator":
        system = "Sən Məmmədov Group şirkətinin təmir kalkulyator köməkçisisən. Azərbaycan dilində məsləhət ver."
    else:
        system = "Sən Məmmədov Group AI köməkçisisən. Təmir, dizayn mövzularında Azərbaycan dilində kömək et."

    response = model.generate_content(f"{system}\n\nİstifadəçi: {req.message}")
    return {"reply": response.text}
