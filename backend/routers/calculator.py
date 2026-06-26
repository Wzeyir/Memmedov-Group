from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
import json

from database import get_db
from model import Calculation
from routers.auth import get_current_admin

router = APIRouter(prefix="/calculator", tags=["Calculator"])

class RoomItem(BaseModel):
    name: str
    size: float

class CalculationCreate(BaseModel):
    rooms: list[RoomItem]
    work_type: str
    quality: str
PRICE_DB = {
    "parket": {"sade": 30, "premium": 50, "luks": 70},
    "boya":   {"sade": 10, "premium": 20, "luks": 35},
    "kafel":  {"sade": 20, "premium": 40, "luks": 60},
    "suvaq":  {"sade": 8,  "premium": 15, "luks": 25}
}
@router.post("/")
def create_calculation(data: CalculationCreate, db: Session = Depends(get_db)):
    price_per_m2 = PRICE_DB[data.work_type][data.quality]
    total_area = sum(r.size for r in data.rooms)
    total_price = total_area * price_per_m2

    db_calc = Calculation(
        rooms=json.dumps([r.dict() for r in data.rooms]),
        work_type=data.work_type,
        quality=data.quality,
        total_area=int(total_area),
        total_price=int(total_price)
    )
    db.add(db_calc)
    db.commit()
    db.refresh(db_calc)
    return {"total_area": total_area, "total_price": total_price, "id": db_calc.id}

@router.get("/")
def get_calculations(db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    return db.query(Calculation).order_by(Calculation.created_at.desc()).all()

@router.delete("/{calc_id}")
def delete_calculation(calc_id: int, db: Session = Depends(get_db), admin = Depends(get_current_admin)):
    calc = db.query(Calculation).filter(Calculation.id == calc_id).first()
    if calc:
        db.delete(calc)
        db.commit()
    return {"status": "Silindi"}