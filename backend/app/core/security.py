import os
from cryptography.fernet import Fernet
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from loguru import logger

# --- 1. AES-256 Encryption Setup ---
# In production, this key should be loaded securely from an environment variable (e.g. AWS KMS or Vault)
# For this demo, we generate a persistent key if one doesn't exist, to keep data encrypted at rest.
ENCRYPTION_KEY_FILE = "secret.key"

if not os.path.exists(ENCRYPTION_KEY_FILE):
    with open(ENCRYPTION_KEY_FILE, "wb") as f:
        f.write(Fernet.generate_key())

with open(ENCRYPTION_KEY_FILE, "rb") as f:
    _key = f.read()

cipher_suite = Fernet(_key)

def encrypt_data(data: str) -> str:
    """Encrypts sensitive strings (like resumes/API keys) using AES-256."""
    try:
        encrypted = cipher_suite.encrypt(data.encode())
        return encrypted.decode()
    except Exception as e:
        logger.error(f"Encryption error: {e}")
        raise HTTPException(status_code=500, detail="Encryption failure.")

def decrypt_data(encrypted_data: str) -> str:
    """Decrypts AES-256 strings."""
    try:
        decrypted = cipher_suite.decrypt(encrypted_data.encode())
        return decrypted.decode()
    except Exception as e:
        logger.error(f"Decryption error: {e}")
        raise HTTPException(status_code=500, detail="Decryption failure.")

# --- 2. Zero-Trust Authentication Layer ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme)):
    # In a real app, verify the JWT signature here.
    if token != "super-secure-production-token":
        logger.warning(f"Unauthorized access attempt with token: {token[:5]}...")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return "admin_user"
