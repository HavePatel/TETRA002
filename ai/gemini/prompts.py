import os
from functools import lru_cache

PROMPTS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "prompts")

@lru_cache(maxsize=16)
def load_prompt(filename: str) -> str:
    """
    Load and cache a prompt template from the prompts directory.

    Args:
        filename (str): Name of the prompt file.

    Returns:
        str: Prompt template text.
    """
    path = os.path.join(PROMPTS_DIR, filename)
    if not os.path.exists(path):
        raise FileNotFoundError(f"Prompt template file not found: {path}")
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def get_extraction_prompt(ocr_text: str) -> str:
    """
    Load the extraction prompt template and inject the OCR text.

    Args:
        ocr_text (str): Raw text extracted from the invoice.

    Returns:
        str: Formatted prompt string.
    """
    template = load_prompt("extraction_prompt.txt")
    return template.format(ocr_text=ocr_text)
