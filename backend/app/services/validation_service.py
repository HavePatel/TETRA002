import re
from datetime import date, datetime


def validate_gstin(gstin: str):
    """
    Validate GSTIN format.
    """

    if not gstin or not gstin.strip():
        return {
            "valid": False,
            "issue": {
                "type": "GST Validation",
                "severity": "High",
                "message": "GSTIN is missing"
            }
        }

    gstin = gstin.strip().upper()

    gstin_pattern = r"^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$"

    if not re.match(gstin_pattern, gstin):
        return {
            "valid": False,
            "issue": {
                "type": "GST Validation",
                "severity": "High",
                "message": "Invalid GSTIN"
            }
        }

    return {
        "valid": True,
        "issue": None
    }


def validate_vendor(vendor: str):
    """
    Validate vendor name.
    """

    if not vendor or not vendor.strip():
        return {
            "valid": False,
            "issue": {
                "type": "Vendor Validation",
                "severity": "Medium",
                "message": "Vendor name is missing"
            }
        }

    vendor = vendor.strip()

    if len(vendor) < 3:
        return {
            "valid": False,
            "issue": {
                "type": "Vendor Validation",
                "severity": "Medium",
                "message": "Vendor name is too short"
            }
        }

    return {
        "valid": True,
        "issue": None
    }

def validate_amount(subtotal: float, gst: float, total: float):
    """
    Validate invoice amount consistency.
    """

    expected_total = round(subtotal + gst, 2)

    if round(total, 2) != expected_total:
        return {
            "valid": False,
            "issue": {
                "type": "Amount Validation",
                "severity": "Medium",
                "message": f"Amount mismatch. Expected total: {expected_total}, Found: {total}"
            }
        }

    return {
        "valid": True,
        "issue": None
    }