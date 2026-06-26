from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional

from database import get_db
from model import Contact
from routers.auth import get_current_admin

router = APIRouter(prefix="/contact", tags=["Contact"])

class ContactCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    message: str

@router.post("/")
def create_contact(contact: ContactCreate, db: Session = Depends(get_db)):
    db_contact = Contact(
        name=contact.name,
        phone=contact.phone,
        email=contact.email,
        message=contact.message
    )
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return {"status": "Mesaj göndərildi", "id": db_contact.id}

@router.get("/")
def get_contacts(db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    contacts = db.query(Contact).order_by(Contact.created_at.desc()).all()
    return contacts

@router.put("/{contact_id}/read")
def mark_read(contact_id: int, db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if contact:
        contact.is_read = True
        db.commit()
    return {"status": "Oxundu"}

@router.delete("/{contact_id}")
def delete_contact(contact_id: int, db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    contact = db.query(Contact).filter(Contact.id == contact_id).first()
    if contact:
        db.delete(contact)
        db.commit()
    return {"status": "Silindi"}