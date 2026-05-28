from fastapi import APIRouter, Depends, HTTPException, status

from app.auth import (
    DEMO_USER,
    create_access_token,
    get_current_user,
    verify_password,
)
from app.schemas import LoginRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(credentials: LoginRequest):
    if credentials.username != DEMO_USER["username"] or not verify_password(
        credentials.password, DEMO_USER["hashed_password"]
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    token = create_access_token({"sub": credentials.username})
    return TokenResponse(access_token=token)


@router.post("/logout", status_code=204)
def logout(_current_user: str = Depends(get_current_user)):
    # JWT is stateless; invalidation is handled client-side by discarding the token.
    return None
