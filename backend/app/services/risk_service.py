SEVERITY_POINTS = {
    "High": 40,
    "Medium": 20,
    "Low": 10
}


def calculate_risk(validation_report):
    """
    Calculate invoice risk score from validation report.
    """

    score = 0

    for issue in validation_report["issues"]:
        severity = issue["severity"]
        score += SEVERITY_POINTS.get(severity, 0)

    score = min(score, 100)

    if score <= 20:
        level = "Low"

    elif score <= 50:
        level = "Medium"

    else:
        level = "High"

    return {
        "invoice_id": validation_report["invoice_id"],
        "risk_score": score,
        "risk_level": level,
        "issues": validation_report["issues"]
    }