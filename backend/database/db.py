import os
import json
from datetime import datetime
from sqlalchemy import create_engine, Column, String, Float, Integer, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DB_DIR = os.path.dirname(__file__)
DB_PATH = os.path.join(DB_DIR, "bizguard.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class AnalysisRecord(Base):
    __tablename__ = "analysis_history"

    id = Column(String(64), primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    company_name = Column(String(128), index=True)
    industry = Column(String(128))
    failure_probability = Column(Float)
    failure_probability_percent = Column(Float)
    risk_level = Column(String(32))
    risk_color = Column(String(16))
    health_score = Column(Integer)
    health_status = Column(String(64))
    payload_json = Column(Text) # Full AnalysisResult JSON

Base.metadata.create_all(bind=engine)

def save_analysis_record(analysis_dict: dict):
    db = SessionLocal()
    try:
        record = AnalysisRecord(
            id=analysis_dict["id"],
            company_name=analysis_dict["company_name"],
            industry=analysis_dict["industry"],
            failure_probability=analysis_dict["failure_probability"],
            failure_probability_percent=analysis_dict["failure_probability_percent"],
            risk_level=analysis_dict["risk_level"],
            risk_color=analysis_dict["risk_color"],
            health_score=analysis_dict["health_score"],
            health_status=analysis_dict["health_status"],
            payload_json=json.dumps(analysis_dict)
        )
        db.add(record)
        db.commit()
    except Exception as e:
        print(f"Error saving analysis record: {e}")
        db.rollback()
    finally:
        db.close()

def get_recent_analyses(limit: int = 15):
    db = SessionLocal()
    try:
        records = db.query(AnalysisRecord).order_by(AnalysisRecord.timestamp.desc()).limit(limit).all()
        results = []
        for r in records:
            try:
                results.append(json.loads(r.payload_json))
            except Exception:
                pass
        return results
    finally:
        db.close()
