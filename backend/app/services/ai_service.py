import os
from dotenv import load_dotenv

load_dotenv()

MODEL_NAME = "gemini-2.5-flash"


def get_genai_client():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key.startswith("your_"):
        return None
    try:
        from google import genai
        return genai.Client(api_key=api_key)
    except Exception as e:
        print(f"Failed to initialize Gemini Client: {e}")
        return None


def ask_ai(question: str) -> str:
    """
    General AI Chat for Pharmacy Staff
    """
    client = get_genai_client()
    if not client:
        return (
            "MediFlow AI is currently offline. Please configure a valid GEMINI_API_KEY "
            "in your backend .env file to enable intelligent assistance."
        )

    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=question,
        )
        return response.text
    except Exception as e:
        # Fallback if specific model name isn't available
        try:
            response = client.models.generate_content(
                model="gemini-1.5-flash",
                contents=question,
            )
            return response.text
        except Exception:
            return f"AI service temporarily unavailable: {e}"


def generate_business_summary(context: dict) -> str:
    """
    AI Business Summary
    """
    prompt = f"""You are an expert pharmacy business intelligence analyst.

Analyze the following pharmacy metrics and provide a crisp, executive business health summary:

Dashboard Metrics:
{context.get("dashboard", {})}

Daily Sales Report:
{context.get("daily_report", {})}

Low Stock Medicines:
{context.get("low_stock", [])}

Top Selling Medicines:
{context.get("top_medicines", [])}

Instructions:
1. Summarize business performance and today's revenue.
2. Highlight critical low-stock items that need urgent replenishment.
3. Call out top-performing medicines driving sales.
4. Provide exactly one high-impact strategic recommendation for the pharmacy owner.
5. Format with neat markdown bullet points and keep under 250 words.
"""
    return ask_ai(prompt)