import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

MODEL_NAME = "gemini-flash-latest"


def ask_ai(question: str) -> str:
    """
    General AI Chat
    """

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=question,
        )

        return response.text

    except Exception as e:
        return f"AI service unavailable: {e}"


def generate_business_summary(context: dict) -> str:
    """
    AI Business Summary
    """

    prompt = f"""
You are an expert pharmacy business analyst.

Analyze the following pharmacy data and provide a concise business summary.

Dashboard:
{context["dashboard"]}

Daily Report:
{context["daily_report"]}

Low Stock Medicines:
{context["low_stock"]}

Top Selling Medicines:
{context["top_medicines"]}

Instructions:
- Summarize today's business performance.
- Mention today's revenue.
- Mention today's sales.
- Mention any low-stock medicines.
- Mention the top-selling medicines.
- Give one recommendation to the pharmacy owner.
- Keep the response under 200 words.
"""

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
        )

        return response.text

    except Exception as e:
        return f"AI service unavailable: {e}"