import re
from datetime import date, datetime

from app.models.invoice import Invoice


def validate_gstin(gstin: str):
    """
    Validate GSTIN format.
    """

    if gstin is None or not str(gstin).strip():
        return {
            "valid": False,
            "issue": {
                "type": "GST Validation",
                "severity": "High",
                "message": "GSTIN is missing"
            }
        }

    gstin = str(gstin).strip().upper()

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

    if vendor is None or not str(vendor).strip():
        return {
            "valid": False,
            "issue": {
                "type": "Vendor Validation",
                "severity": "Medium",
                "message": "Vendor name is missing"
            }
        }

    vendor = str(vendor).strip()

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
    Validate invoice amount.
    """

    if subtotal is None or gst is None or total is None:
        return {
            "valid": False,
            "issue": {
                "type": "Amount Validation",
                "severity": "Medium",
                "message": "Invoice amount details are missing"
            }
        }

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


def validate_invoice_date(invoice_date):
    """
    Validate invoice date.
    """

    if invoice_date is None or not str(invoice_date).strip():
        return {
            "valid": False,
            "issue": {
                "type": "Date Validation",
                "severity": "Low",
                "message": "Invoice date is missing"
            }
        }

    try:
        if isinstance(invoice_date, date):
            parsed_date = invoice_date
        else:
            parsed_date = datetime.strptime(
                str(invoice_date).strip(),
                "%Y-%m-%d"
            ).date()

    except ValueError:
        return {
            "valid": False,
            "issue": {
                "type": "Date Validation",
                "severity": "Low",
                "message": "Invalid date format. Expected YYYY-MM-DD"
            }
        }

    if parsed_date > date.today():
        return {
            "valid": False,
            "issue": {
                "type": "Date Validation",
                "severity": "Low",
                "message": "Invoice date cannot be in the future"
            }
        }

    return {
        "valid": True,
        "issue": None
    }


def validate_duplicate(db, invoice):
    """
    Check if an invoice already exists.
    """

    if (
        invoice.invoice_number is None
        or invoice.vendor is None
        or invoice.total is None
    ):
        return {
            "valid": False,
            "issue": {
                "type": "Duplicate Validation",
                "severity": "Low",
                "message": "Invoice details are incomplete for duplicate validation"
            }
        }

    duplicate = (
        db.query(Invoice)
        .filter(
            Invoice.invoice_number == invoice.invoice_number,
            Invoice.vendor == invoice.vendor,
            Invoice.total == invoice.total,
            Invoice.id != invoice.id
        )
        .first()
    )

    if duplicate:
        return {
            "valid": False,
            "issue": {
                "type": "Duplicate Validation",
                "severity": "High",
                "message": "Duplicate invoice detected"
            }
        }

    return {
        "valid": True,
        "issue": None
    }


def validate_invoice(db, invoice):
    """
    Run all validations for an invoice and return a validation report.
    """

    issues = []

    validations = [
        validate_gstin(invoice.gstin),
        validate_vendor(invoice.vendor),
        validate_amount(
            invoice.subtotal,
            invoice.gst,
            invoice.total
        ),
        validate_invoice_date(invoice.invoice_date),
        validate_duplicate(db, invoice)
    ]

    for result in validations:
        if not result["valid"]:
            issues.append(result["issue"])

    return {
        "invoice_id": invoice.invoice_id,
        "status": "Completed",
        "issues": issues,
        "total_issues": len(issues)
    }