/**
 * Dummy Data — AI Invoice Risk Scanner (TETRA002)
 * Strictly follows JSON Data Contract:
 * { invoice_id, invoice_number, vendor, gstin,
 *   invoice_date, subtotal, gst, total, currency }
 */

export const dummyInvoices = [
  {
    invoice_id: 'INV_001', invoice_number: 'INV1001',
    vendor: 'ABC Traders', gstin: '24ABCDE1234F1Z5',
    invoice_date: '2026-08-01', subtotal: 50000, gst: 9000, total: 59000, currency: 'INR',
    risk_score: 88, risk_level: 'High Risk', status: 'Flagged',
    anomalies: ['Duplicate invoice number in Ledger', 'GSTIN mismatch with Master DB', 'Math deviation +₹500'],
    ai_explanation: "GSTIN '24ABCDE1234F1Z5' does not match the registered master record for ABC Traders. Invoice number INV1001 also matches a settled July 2026 transaction, indicating a probable duplicate.",
    line_items: [
      { id: 1, description: 'Enterprise IT Hardware', quantity: 10, unit_price: 4000, total: 40000 },
      { id: 2, description: 'Maintenance & Support',  quantity: 1,  unit_price: 10000, total: 10000 },
    ],
  },
  {
    invoice_id: 'INV_002', invoice_number: 'INV1002',
    vendor: 'Nexus Global Logistics', gstin: '27AAACN5678K1Z9',
    invoice_date: '2026-07-29', subtotal: 120000, gst: 21600, total: 141600, currency: 'INR',
    risk_score: 18, risk_level: 'Low Risk', status: 'Verified',
    anomalies: [],
    ai_explanation: 'All fields verified against ERP vendor master and GST Portal. Math checks out with zero variance. OCR confidence 99.4%.',
    line_items: [
      { id: 1, description: 'Freight Transport (Container)', quantity: 2, unit_price: 60000, total: 120000 },
    ],
  },
  {
    invoice_id: 'INV_003', invoice_number: 'INV1003',
    vendor: 'Apex Office Solutions', gstin: '07AAACA9988H1Z3',
    invoice_date: '2026-07-28', subtotal: 35000, gst: 6300, total: 41300, currency: 'INR',
    risk_score: 54, risk_level: 'Medium Risk', status: 'Pending Review',
    anomalies: ['Subtotal 35% above historical threshold', 'GSTIN active status pending'],
    ai_explanation: 'Invoice total is 35% higher than the average quarterly billing for Apex Office Solutions. Tax calculations are correct but threshold breach warrants manual review.',
    line_items: [
      { id: 1, description: 'Ergonomic Chairs & Desks', quantity: 5, unit_price: 7000, total: 35000 },
    ],
  },
  {
    invoice_id: 'INV_004', invoice_number: 'INV1004',
    vendor: 'Zenith Cloud Systems', gstin: '29AAACZ4321J1Z2',
    invoice_date: '2026-07-25', subtotal: 210000, gst: 37800, total: 247800, currency: 'INR',
    risk_score: 92, risk_level: 'High Risk', status: 'Flagged',
    anomalies: ['Bank Account mismatch vs Vendor Master', 'Invoice sequence anomaly', 'Round-number billing'],
    ai_explanation: 'CRITICAL: Remittance details on the uploaded PDF differ from the verified banking profile of Zenith Cloud Systems. High probability of invoice spoofing or targeted phishing.',
    line_items: [
      { id: 1, description: 'Annual Managed Cloud Hosting', quantity: 1, unit_price: 210000, total: 210000 },
    ],
  },
  {
    invoice_id: 'INV_005', invoice_number: 'INV1005',
    vendor: 'Starlight Media & Marketing', gstin: '19AAACS1122D1Z0',
    invoice_date: '2026-07-20', subtotal: 85000, gst: 15300, total: 100300, currency: 'INR',
    risk_score: 12, risk_level: 'Low Risk', status: 'Verified',
    anomalies: [],
    ai_explanation: 'Valid invoice with matching PO PO-88219. OCR confidence score 99.4%. All fields clean.',
    line_items: [
      { id: 1, description: 'Digital Campaign & PR Services', quantity: 1, unit_price: 85000, total: 85000 },
    ],
  },
  {
    invoice_id: 'INV_006', invoice_number: 'INV1006',
    vendor: 'CyberShield Security', gstin: '06AAACC4433E1Z8',
    invoice_date: '2026-07-18', subtotal: 150000, gst: 27000, total: 177000, currency: 'INR',
    risk_score: 22, risk_level: 'Low Risk', status: 'Verified',
    anomalies: [],
    ai_explanation: 'SOC2 Compliance Audit fee verified. GSTIN active and aligned with Master Database.',
    line_items: [
      { id: 1, description: 'Penetration Testing & Audit', quantity: 1, unit_price: 150000, total: 150000 },
    ],
  },
  {
    invoice_id: 'INV_007', invoice_number: 'INV1007',
    vendor: 'Vanguard Tech Hardware', gstin: '33AAACV8877P1Z1',
    invoice_date: '2026-07-15', subtotal: 95000, gst: 17100, total: 112100, currency: 'INR',
    risk_score: 65, risk_level: 'Medium Risk', status: 'Pending Review',
    anomalies: ['Tax rate discrepancy (18% vs 12% HSN)', 'Unregistered address variation'],
    ai_explanation: 'HSN code specified in the invoice suggests 12% GST, but the invoice applies 18%. Requires tax auditor clarification before settlement.',
    line_items: [
      { id: 1, description: 'Rack Server Upgrades & Storage', quantity: 5, unit_price: 19000, total: 95000 },
    ],
  },
];

/* ── Dashboard KPI ── */
export const dummyDashboardStats = {
  totalInvoices:      1245,
  highRiskCount:        23,
  lowRiskCount:        980,
  accuracy:          99.2,
  totalScannedAmount: 4892400,
  mediumRiskCount:     242,
  pendingReviewCount:    9,
  avgRiskScore:       34.2,
};

/* ── Charts ── */
export const dummyRiskDistribution = [
  { name: 'Low Risk',    value: 980, color: '#10b981' },
  { name: 'Medium Risk', value: 242, color: '#f59e0b' },
  { name: 'High Risk',   value:  23, color: '#f43f5e' },
];

export const dummyRiskTrend = [
  { date: 'Jul 01', low: 12, medium: 4,  high: 1 },
  { date: 'Jul 05', low: 18, medium: 5,  high: 2 },
  { date: 'Jul 10', low: 22, medium: 6,  high: 1 },
  { date: 'Jul 15', low: 28, medium: 8,  high: 3 },
  { date: 'Jul 20', low: 35, medium: 10, high: 2 },
  { date: 'Jul 25', low: 42, medium: 12, high: 4 },
  { date: 'Jul 30', low: 50, medium: 15, high: 3 },
];

export const dummyMonthlyVolume = [
  { month: 'Jan', invoices:  32, volume: 1200000 },
  { month: 'Feb', invoices:  45, volume: 1800000 },
  { month: 'Mar', invoices:  56, volume: 2400000 },
  { month: 'Apr', invoices:  48, volume: 2100000 },
  { month: 'May', invoices:  72, volume: 3100000 },
  { month: 'Jun', invoices:  98, volume: 4200000 },
  { month: 'Jul', invoices: 142, volume: 4892400 },
];

export const dummyVendorSummary = [
  { vendor: 'Zenith Cloud Systems',       total_invoices:  8, total_amount: 1450000, avg_risk: 86, risk_status: 'High Risk'    },
  { vendor: 'ABC Traders',                total_invoices: 15, total_amount:  890000, avg_risk: 72, risk_status: 'High Risk'    },
  { vendor: 'Vanguard Tech Hardware',     total_invoices: 12, total_amount:  540000, avg_risk: 65, risk_status: 'Medium Risk'  },
  { vendor: 'Apex Office Solutions',      total_invoices: 24, total_amount:  420000, avg_risk: 48, risk_status: 'Medium Risk'  },
  { vendor: 'CyberShield Security',       total_invoices: 11, total_amount:  980000, avg_risk: 22, risk_status: 'Low Risk'     },
  { vendor: 'Nexus Global Logistics',     total_invoices: 42, total_amount: 1840000, avg_risk: 15, risk_status: 'Low Risk'     },
  { vendor: 'Starlight Media',            total_invoices: 19, total_amount:  670000, avg_risk: 12, risk_status: 'Low Risk'     },
];

export const dummyRecentActivity = [
  { id: 1, type: 'flag',    title: 'High Risk Flagged',          body: 'INV1004 from Zenith Cloud — bank mismatch.',       time: '10m ago',  severity: 'high'    },
  { id: 2, type: 'scan',    title: 'Invoice Scanned',            body: 'INV1007 uploaded, PaddleOCR 99.1% confidence.',    time: '25m ago',  severity: 'info'    },
  { id: 3, type: 'approve', title: 'GST Verified',               body: 'INV1002 from Nexus Global approved by auditor.',   time: '1h ago',   severity: 'success' },
  { id: 4, type: 'warning', title: 'Threshold Breach Warning',   body: 'INV1003 is 35% above historical average.',         time: '2h ago',   severity: 'warning' },
  { id: 5, type: 'scan',    title: 'Invoice Scanned',            body: 'INV1005 from Starlight Media — all clear.',        time: '3h ago',   severity: 'success' },
];

export const dummyRiskHeatmap = [
  { category: 'GSTIN Mismatch',         count: 18, risk: 'High',   weight: 90 },
  { category: 'Bank Remittance Diff',   count: 12, risk: 'High',   weight: 85 },
  { category: 'Duplicate Invoice',      count: 24, risk: 'High',   weight: 80 },
  { category: 'Math & Tax Variance',    count: 32, risk: 'Medium', weight: 55 },
  { category: 'Threshold Spike >30%',  count: 41, risk: 'Medium', weight: 45 },
  { category: 'Unregistered HSN Code', count: 15, risk: 'Low',    weight: 20 },
];
