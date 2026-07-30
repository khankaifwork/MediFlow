from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_medicines():
    return {
        "message": "Medicine Router Working"
        }

