from sqlalchemy.orm import Session

from app.services.ai_service import ask_ai
from app.services.context_service import get_context
from app.services.intent_service import detect_intent


def ask_pharmacy_agent(
    question: str,
    db: Session,
) -> str:

    intent = detect_intent(question)

    context = get_context(
        intent=intent,
        db=db,
    )

    prompt = f"""
You are an expert AI pharmacy assistant.

Intent:
{intent}

Available Data:
{context}

User Question:
{question}

Rules:
1. Answer ONLY using the provided data.
2. Never make up numbers.
3. If the information is unavailable, clearly say so.
4. Keep the answer professional.
5. Give useful recommendations whenever appropriate.
"""

    return ask_ai(prompt)