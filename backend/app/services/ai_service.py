import requests

AI_SERVICE_URL = "http://localhost:8001/api/v1/extract"


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