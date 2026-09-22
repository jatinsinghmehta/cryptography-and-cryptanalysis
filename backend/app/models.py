from datetime import datetime

from sqlalchemy import Column, Integer, String, Text, Float, DateTime

from .database import Base


# =========================================================
# Cipher History
# =========================================================

class CipherHistory(Base):
    __tablename__ = "cipher_history"

    id = Column(Integer, primary_key=True, index=True)

    algorithm = Column(String(50), nullable=False)
    operation = Column(String(50), nullable=False)

    input_text = Column(Text, nullable=False)
    key_or_shift = Column(String(100), nullable=True)

    output_text = Column(Text, nullable=False)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )


# =========================================================
# Analysis History
# =========================================================

class AnalysisHistory(Base):
    __tablename__ = "analysis_history"

    id = Column(Integer, primary_key=True, index=True)

    analysis_type = Column(String(50), nullable=False)

    input_text = Column(Text, nullable=False)

    result = Column(Text, nullable=False)

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )