/**
 * Dummy Data strictly adhering to JSON DATA CONTRACT:
 * {
 *   "invoice_id": "...",
 *   "invoice_number": "...",
 *   "vendor": "...",
 *   "gstin": "...",
 *   "invoice_date": "...",
 *   "subtotal": 0,
 *   "gst": 0,
 *   "total": 0,
 *   "currency": "INR"
 * }
 */

export const dummyInvoices = [
  {
    invoice_id: "INV_001",
    invoice_number: "INV1001",
    vendor: "ABC Traders",
    gstin: "24ABCDE1234F1Z5",
    invoice_date: "2026-08-01",
    subtotal: 50000,
    gst: 9000,
    total: 59000,
    currency: "INR",
    risk_score: 88,
    risk_level: "High Risk",
    status: "Flagged",
    anomalies: [
      "Duplicate invoice number detected in Ledger",
      "GSTIN mismatch with Master Vendor Database",
      "Subtotal + GST math mismatch (+ ₹500 deviation)"
    ],
    ai_explanation: "This invoice exhibits multiple high-severity anomalies. The GSTIN '24ABCDE1234F1Z5' does not match registered master record for ABC Traders. Additionally, invoice_number INV1001 matches a settled transaction from July 2026.",
    line_items: [
      { id: 1, description: "Enterprise IT Hardware Components", quantity: 10, unit_price: 4000, total: 40000 },
      { id: 2, description: "Maintenance & Onsite Support Fee", quantity: 1, unit_price: 10000, total: 10000 }
    ]
  },
  {
    invoice_id: "INV_002",
    invoice_number: "INV1002",
    vendor: "Nexus Global Logistics",
    gstin: "27AAACN5678K1Z9",
    invoice_date: "2026-07-29",
    subtotal: 120000,
    gst: 21600,
    total: 141600,
    currency: "INR",
    risk_score: 18,
    risk_level: "Low Risk",
    status: "Verified",
    anomalies: [],
    ai_explanation: "All fields verified against ERP vendor master and GST Portal. Math checks out perfectly with zero variance.",
    line_items: [
      { id: 1, description: "Freight Transport Services (Container Line)", quantity: 2, unit_price: 60000, total: 120000 }
    ]
  },
  {
    invoice_id: "INV_003",
    invoice_number: "INV1003",
    vendor: "Apex Office Solutions",
    gstin: "07AAACA9988H1Z3",
    invoice_date: "2026-07-28",
    subtotal: 35000,
    gst: 6300,
    total: 41300,
    currency: "INR",
    risk_score: 54,
    risk_level: "Medium Risk",
    status: "Pending Review",
    anomalies: [
      "Subtotal exceeds historical purchasing threshold by 35%",
      "Vendor GSTIN pending active status verification"
    ],
    ai_explanation: "Invoice total is 35% higher than the average quarterly billing for Apex Office Solutions. Tax calculations are correct.",
    line_items: [
      { id: 1, description: "Ergonomic Mesh Chairs & Executive Desks", quantity: 5, unit_price: 7000, total: 35000 }
    ]
  },
  {
    invoice_id: "INV_004",
    invoice_number: "INV1004",
    vendor: "Zenith Cloud Systems",
    gstin: "29AAACZ4321J1Z2",
    invoice_date: "2026-07-25",
    subtotal: 210000,
    gst: 37800,
    total: 247800,
    currency: "INR",
    risk_score: 92,
    risk_level: "High Risk",
    status: "Flagged",
    anomalies: [
      "Bank Account Number mismatch on invoice header vs Vendor Master",
      "Sequential invoice number anomaly (INV1004 vs expected sequence)",
      "Unusual round-number billing"
    ],
    ai_explanation: "CRITICAL: Direct remittance details on the uploaded PDF differ from the verified banking profile of Zenith Cloud Systems. High probability of spoofing or phishing.",
    line_items: [
      { id: 1, description: "Annual Managed Cloud Hosting Infrastructure", quantity: 1, unit_price: 210000, total: 210000 }
    ]
  },
  {
    invoice_id: "INV_005",
    invoice_number: "INV1005",
    vendor: "Starlight Media & Marketing",
    gstin: "19AAACS1122D1Z0",
    invoice_date: "2026-07-20",
    subtotal: 85000,
    gst: 15300,
    total: 100300,
    currency: "INR",
    risk_score: 12,
    risk_level: "Low Risk",
    status: "Verified",
    anomalies: [],
    ai_explanation: "Valid invoice with matching Purchase Order PO-88219. OCR confidence score 99.4%.",
    line_items: [
      { id: 1, description: "Digital Campaign Management & PR Services", quantity: 1, unit_price: 85000, total: 85000 }
    ]
  }
];

export const dummyDashboardStats = {
  totalInvoices: 142,
  totalScannedAmount: "₹48,92,400",
  highRiskCount: 14,
  mediumRiskCount: 28,
  lowRiskCount: 100,
  pendingReviewCount: 9,
  avgRiskScore: 34.2
};

export const dummyRiskDistribution = [
  { name: "Low Risk", value: 100, color: "#10b981" },
  { name: "Medium Risk", value: 28, color: "#f59e0b" },
  { name: "High Risk", value: 14, color: "#f43f5e" }
];

export const dummyRiskTrend = [
  { date: "Jul 01", low: 12, medium: 4, high: 1 },
  { date: "Jul 05", low: 18, medium: 5, high: 2 },
  { date: "Jul 10", low: 22, medium: 6, high: 1 },
  { date: "Jul 15", low: 28, medium: 8, high: 3 },
  { date: "Jul 20", low: 35, medium: 10, high: 2 },
  { date: "Jul 25", low: 42, medium: 12, high: 4 },
  { date: "Jul 30", low: 50, medium: 15, high: 3 }
];

export const dummyVendorSummary = [
  { vendor: "Zenith Cloud Systems", total_invoices: 8, total_amount: 1450000, avg_risk: 86, risk_status: "High Risk" },
  { vendor: "ABC Traders", total_invoices: 15, total_amount: 890000, avg_risk: 72, risk_status: "High Risk" },
  { vendor: "Apex Office Solutions", total_invoices: 24, total_amount: 420000, avg_risk: 48, risk_status: "Medium Risk" },
  { vendor: "Nexus Global Logistics", total_invoices: 42, total_amount: 1840000, avg_risk: 15, risk_status: "Low Risk" },
  { vendor: "Starlight Media & Marketing", total_invoices: 19, total_amount: 670000, avg_risk: 12, risk_status: "Low Risk" }
];
