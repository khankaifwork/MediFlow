from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.auth import get_current_user
from app.database.database import get_db
from app.models.user import User
from app.services.ai_tools import execute_tool

from app.schemas.ai import AIQuestion, AIResponse

from app.services.ai_service import (
    ask_ai,
    generate_business_summary,
)

from app.services.ai_business_service import (
    get_business_context,
)
from app.services.ai_agent_service import ask_pharmacy_agent

router = APIRouter(
    prefix="/ai",
    tags=["AI Assistant"]
)


@router.post(
    "/chat",
    response_model=AIResponse
)
def chat(
    data: AIQuestion,
    current_user: User = Depends(get_current_user)
):
    answer = ask_ai(data.question)

    return AIResponse(
        answer=answer
    )


@router.post(
    "/business-summary",
    response_model=AIResponse
)
def business_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    context = get_business_context(db)

    summary = generate_business_summary(context)

    return AIResponse(
        answer=summary
    )

@router.post(
    "/agent",
    response_model=AIResponse
)
def pharmacy_agent(
    data: AIQuestion,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    answer = ask_pharmacy_agent(
        question=data.question,
        db=db
    )

    return AIResponse(
        answer=answer
    )


@router.get("/tool-test")
def tool_test(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return execute_tool("low_stock", db)