def detect_intent(question: str) -> str:

    question = question.lower()

    inventory_keywords = [
        "stock",
        "inventory",
        "medicine",
        "expire",
        "expiry",
        "reorder",
    ]

    sales_keywords = [
        "sale",
        "sales",
        "revenue",
        "income",
        "profit",
        "today",
        "business",
    ]

    customer_keywords = [
        "customer",
        "buyer",
    ]

    supplier_keywords = [
        "supplier",
        "vendor",
    ]

    if any(word in question for word in inventory_keywords):
        return "inventory"

    if any(word in question for word in sales_keywords):
        return "sales"

    if any(word in question for word in customer_keywords):
        return "customer"

    if any(word in question for word in supplier_keywords):
        return "supplier"

    return "general"