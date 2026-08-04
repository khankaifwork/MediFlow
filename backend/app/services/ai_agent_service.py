from sqlalchemy.orm import Session

from app.services.ai_business_service import get_business_context
from app.services.ai_service import ask_ai


def ask_pharmacy_agent(
    question: str,
    db: Session,
) -> str:

    context = get_business_context(db)

    prompt = f"""
You are an expert AI pharmacy assistant.

You ONLY answer using the pharmacy data below.

=========================
PHARMACY DATABASE
=========================

{context}

=========================
USER QUESTION
=========================

{question}

Instructions:

1. Answer ONLY from the provided data.
2. Never make up numbers.
3. If information is unavailable, say so.
4. Keep the answer professional.
5. Give recommendations whenever useful.
"""

    return ask_ai(prompt)