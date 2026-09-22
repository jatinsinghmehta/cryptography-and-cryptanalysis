from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
import json

from .database import get_db

from .models import CipherHistory, AnalysisHistory

from .services.caesar import (
    encrypt as caesar_encrypt,
    decrypt as caesar_decrypt,
    brute_force as caesar_brute_force
)

from .services.vigenere import (
    encrypt as vigenere_encrypt,
    decrypt as vigenere_decrypt
)

from .services.analysis import frequency_analysis


app = FastAPI(title="Cryptography & Cryptanalysis Toolkit")


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# Request Models
# =========================================================

class CaesarRequest(BaseModel):
    text: str
    shift: int


class CaesarBruteForceRequest(BaseModel):
    text: str


class VigenereRequest(BaseModel):
    text: str
    key: str


class AnalysisRequest(BaseModel):
    text: str


# =========================================================
# Root / Health Check
# =========================================================

@app.get("/")
def root():
    return {
        "message": "Cryptography Toolkit API is running"
    }


# =========================================================
# Caesar Cipher
# =========================================================

@app.post("/caesar/encrypt")
def caesar_encrypt_api(
    request: CaesarRequest,
    db: Session = Depends(get_db)
):
    result = caesar_encrypt(request.text, request.shift)

    history = CipherHistory(
        algorithm="Caesar Cipher",
        operation="encryption",
        input_text=request.text,
        key_or_shift=str(request.shift),
        output_text=result
    )

    db.add(history)
    db.commit()

    return {
        "algorithm": "Caesar Cipher",
        "operation": "encryption",
        "result": result
    }


@app.post("/caesar/decrypt")
def caesar_decrypt_api(
    request: CaesarRequest,
    db: Session = Depends(get_db)
):
    result = caesar_decrypt(request.text, request.shift)

    history = CipherHistory(
        algorithm="Caesar Cipher",
        operation="decryption",
        input_text=request.text,
        key_or_shift=str(request.shift),
        output_text=result
    )

    db.add(history)
    db.commit()

    return {
        "algorithm": "Caesar Cipher",
        "operation": "decryption",
        "result": result
    }


@app.post("/caesar/brute-force")
def caesar_brute_force_api(
    request: CaesarBruteForceRequest,
    db: Session = Depends(get_db)
):
    results = caesar_brute_force(request.text)

    best_candidate = results[0] if results else None

    history = CipherHistory(
        algorithm="Caesar Cipher",
        operation="brute force",
        input_text=request.text,
        key_or_shift=None,
        output_text=(
            json.dumps(best_candidate)
            if best_candidate
            else ""
        )
    )

    db.add(history)
    db.commit()

    return {
        "algorithm": "Caesar Cipher",
        "operation": "brute force",
        "best_candidate": best_candidate,
        "candidates": results
    }


# =========================================================
# Vigenère Cipher
# =========================================================

@app.post("/vigenere/encrypt")
def vigenere_encrypt_api(
    request: VigenereRequest,
    db: Session = Depends(get_db)
):
    result = vigenere_encrypt(request.text, request.key)

    history = CipherHistory(
        algorithm="Vigenère Cipher",
        operation="encryption",
        input_text=request.text,
        key_or_shift=request.key,
        output_text=result
    )

    db.add(history)
    db.commit()

    return {
        "algorithm": "Vigenère Cipher",
        "operation": "encryption",
        "result": result
    }


@app.post("/vigenere/decrypt")
def vigenere_decrypt_api(
    request: VigenereRequest,
    db: Session = Depends(get_db)
):
    result = vigenere_decrypt(request.text, request.key)

    history = CipherHistory(
        algorithm="Vigenère Cipher",
        operation="decryption",
        input_text=request.text,
        key_or_shift=request.key,
        output_text=result
    )

    db.add(history)
    db.commit()

    return {
        "algorithm": "Vigenère Cipher",
        "operation": "decryption",
        "result": result
    }


# =========================================================
# Frequency Analysis
# =========================================================

@app.post("/analysis/frequency")
def analyze_frequency(
    request: AnalysisRequest,
    db: Session = Depends(get_db)
):
    result = frequency_analysis(request.text)

    history = AnalysisHistory(
        analysis_type="Frequency Analysis",
        input_text=request.text,
        result=json.dumps(result)
    )

    db.add(history)
    db.commit()

    return {
        "analysis": "Frequency Analysis",
        "result": result
    }


# =========================================================
# Cipher History
# =========================================================

@app.get("/history/cipher")
def get_cipher_history(
    db: Session = Depends(get_db)
):
    history = (
        db.query(CipherHistory)
        .order_by(CipherHistory.id.desc())
        .all()
    )

    return [
        {
            "id": item.id,
            "algorithm": item.algorithm,
            "operation": item.operation,
            "input_text": item.input_text,
            "key_or_shift": item.key_or_shift,
            "output_text": item.output_text,
            "created_at": item.created_at
        }
        for item in history
    ]


# =========================================================
# Analysis History
# =========================================================

@app.get("/history/analysis")
def get_analysis_history(
    db: Session = Depends(get_db)
):
    history = (
        db.query(AnalysisHistory)
        .order_by(AnalysisHistory.id.desc())
        .all()
    )

    return [
        {
            "id": item.id,
            "analysis_type": item.analysis_type,
            "input_text": item.input_text,
            "result": item.result,
            "created_at": item.created_at
        }
        for item in history
    ]
