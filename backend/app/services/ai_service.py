import requests
from app.core.config import settings

AI_SERVICE_URL = settings.AI_SERVICE_URL


def extract_invoice(file_path: str):
    """
    Send an invoice file to the AI service and return the extracted JSON.
    """

    with open(file_path, "rb") as file:
        response = requests.post(
            AI_SERVICE_URL,
            files={
                "file": file
            }
        )

    response.raise_for_status()

    return response.json()