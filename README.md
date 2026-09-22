# Cryptography & Cryptanalysis Toolkit

A full-stack cybersecurity project that demonstrates classical cryptography and basic cryptanalysis through a web-based application.

## Features

- Caesar Cipher — Encryption, Decryption & Brute Force
- Vigenère Cipher — Encryption & Decryption
- Frequency Analysis
- Caesar Cipher Cryptanalysis
- Operation History

## Technology Stack

### Frontend
- React
- Vite

### Backend
- Python
- FastAPI

### Database
- PostgreSQL
- SQLAlchemy

## Application Flow

User → React Frontend → FastAPI REST API → Python Cryptographic Logic → PostgreSQL → Result displayed in Frontend

## Cryptanalysis

The Caesar brute-force feature tests all 26 possible shifts, decrypts the ciphertext using each shift, scores the candidates using English-language scoring, and ranks the possible results.

## Project Structure

crptography-toolkit/
├── backend/
├── frontend/
├── .gitignore
└── README.md

## How to Run

### Backend

cd backend
python -m uvicorn app.main:app --reload

Backend:
http://127.0.0.1:8000

### Swagger API Documentation

http://127.0.0.1:8000/docs

### Frontend

cd frontend
npm install
npm run dev

Then open the Local URL provided by Vite.

## Future Scope

- Additional classical ciphers
- Modern cryptographic algorithms
- Advanced cryptanalysis techniques
- Improved visualization
- Additional brute-force techniques
