from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from dotenv import load_dotenv
import os
from database import engine, Base
from model import Admin
from routers import auth, contact, calculator,gemini
from routers.auth import hash_password
from sqlalchemy.orm import Session
from database import SessionLocal

load_dotenv()

app = FastAPI(title="Məmmədov Group API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(contact.router)
app.include_router(gemini.router)

@app.get("/admin")
def admin_panel():
    return FileResponse("admin.html")

@app.get("/")
def site():
    return FileResponse("index.html")

app.mount("/static", StaticFiles(directory="."), name="frontend")

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    admin = db.query(Admin).filter(Admin.username == os.getenv("ADMIN_USERNAME")).first()
    if not admin:
        db.add(Admin(
            username=os.getenv("ADMIN_USERNAME"),
            password=hash_password(os.getenv("ADMIN_PASSWORD"))
        ))
        db.commit()
    db.close()