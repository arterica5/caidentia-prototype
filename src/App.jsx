import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Bell, Search, User, Settings, ChevronDown, ChevronRight, ChevronLeft,
  Package, GitBranch, DollarSign, Send, ShieldCheck, Building2, Users, UsersRound,
  AlertTriangle, AlertCircle, CheckCircle, XCircle, Clock, Filter,
  Plus, MoreHorizontal, MessageSquare, Sparkles, TrendingUp, TrendingDown,
  ArrowRight, Hash, Paperclip, AtSign, Smile, Layers, FileText, Zap,
  Eye, Edit3, Activity, Box, Target, BarChart3, ShoppingCart, FlaskConical,
  Network, ListChecks, ChevronsRight, X, Info, Play, RefreshCw, Inbox, PlusCircle, AlignLeft, Circle,
  CornerDownRight, Columns3, Upload, Link2,
  LayoutDashboard, Boxes, GitMerge, BadgeCheck, PanelLeftClose, PanelLeftOpen,
  Smartphone, Watch, Headphones, Tv, Tablet, Speaker, Refrigerator, Wind, BatteryCharging,
  History, GitCompareArrows, Archive, Lock, MoreVertical, Trash2, Mail, Phone, MapPin, Star
} from "lucide-react";

/* ============================================================
   CAIDENTIA 2.0 — Unified BOM Collaboration Prototype
   End-to-End scenario across PM → DE → CM → SM → QM
   Single App.jsx, Tailwind + lucide-react
   Build: 2026-05-08 r12 (Inbox + Notification Dropdown)
   ============================================================ */

// === DESIGN TOKENS (per 06_design-system.md) ===
const C = {
  primary: "#532DF6",
  primaryDark: "#3D1FD4",
  primaryLight: "#EDE9FE",
  primarySoft: "#F5F2FF",
  secondary: "#4B5565",
  secondaryDark: "#333C48",
  secondaryLight: "#E9EAEC",
  error: "#D32F2F",
  errorLight: "#FFEBEE",
  warning: "#E06900",
  warningLight: "#FFF3E0",
  info: "#1565E0",
  infoLight: "#E3F2FD",
  success: "#009955",
  successLight: "#E8F5E9",
  bg: "#E8ECF8",
  surface: "#FFFFFF",
  surface2: "#FAFAFA",
  surfaceTinted: "#F5F8FB",
  border: "#E0E0E0",
  borderLight: "#EEEEEE",
  textPrimary: "#1A1A1A",
  textSecondary: "#6B7280",
  textDisabled: "#9CA3AF",
};

// === MOCK DATA: scenario-driven ===
const PERSONAS = {
  PM: { name: "Paige Kim", role: "Project Manager", initial: "PK", color: "#532DF6" },
  DE: { name: "Dean Park", role: "Design Engineer", initial: "DP", color: "#1565E0" },
  CM: { name: "Cory Chen", role: "Cost Manager", initial: "CC", color: "#E06900" },
  SM: { name: "Sam Lee", role: "Sourcing Manager", initial: "SL", color: "#009955" },
  QM: { name: "Quinn R.", role: "Quality Manager", initial: "QR", color: "#7C3AED" },
};

const PROJECT = {
  name: "NPI Project_Samsung Smartphone #2",
  code: "BPM260400354",
  phase: "Develop",
  phaseDays: 23,
  phaseProgress: 87,
  product: "Smartphone A1",
};

const PHASES = ["Incubation", "Concept", "Define", "Plan", "Develop", "SOP"];

// Project List Mock — varied statuses across phases
// Owner persona name mapping for variety (different people per project)
// Each project's owner uses one of the named personas; pm field still drives badge/avatar
const PROJECTS = [
  // Newly created project (Today) — fresh slate, no BOM data yet
  { code: "BPM260500001", name: "NPI Project_Samsung Smartphone S27 Lite", product: "Smartphone S27L",
    type: "Major Enhancement", phase: "Incubation", phaseDays: 180, readiness: 4, blocking: 0,
    pm: "PM", ownerName: "Paige Kim", collaborators: 1,
    suppliers: 0, items: 0, tmcGap: 0, lastUpdate: "Today", priority: "med", isNew: true },
  { code: "BPM260400354", name: "NPI Project_Samsung Smartphone #2", product: "Smartphone A1",
    type: "New To The Company", phase: "Develop", phaseDays: 23, readiness: 65, blocking: 3,
    pm: "PM", ownerName: "Paige Kim", collaborators: 5,
    suppliers: 8, items: 80, tmcGap: 8.5, lastUpdate: "2026/04/30", priority: "high" },
  { code: "BPM260400353", name: "NPI Project_Galaxy Watch 7", product: "SmartWatch G7",
    type: "Major Enhancement", phase: "Plan", phaseDays: 45, readiness: 68, blocking: 0,
    pm: "PM", ownerName: "Paige Wong", collaborators: 4,
    suppliers: 6, items: 42, tmcGap: -2.4, lastUpdate: "2026/04/29", priority: "high" },
  { code: "BPM260400352", name: "Galaxy Buds Pro 4 Refresh", product: "Earbuds B4",
    type: "Minor Enhancement", phase: "SOP", phaseDays: 8, readiness: 95, blocking: 0,
    pm: "PM", ownerName: "Paige Kim", collaborators: 3,
    suppliers: 4, items: 28, tmcGap: -1.2, lastUpdate: "2026/04/30", priority: "med" },
  { code: "BPM260400351", name: "Smart TV QN90D 75\"", product: "TV Q90",
    type: "Major Enhancement", phase: "Develop", phaseDays: 67, readiness: 72, blocking: 0,
    pm: "QM", ownerName: "Quinn Rodriguez", collaborators: 6,
    suppliers: 12, items: 156, tmcGap: 5.8, lastUpdate: "2026/04/28", priority: "med" },
  { code: "BPM260400350", name: "Foldable Z Fold 7", product: "Foldable F7",
    type: "New To The World", phase: "Define", phaseDays: 92, readiness: 54, blocking: 3,
    pm: "DE", ownerName: "Dean Park", collaborators: 7,
    suppliers: 9, items: 105, tmcGap: 28.4, lastUpdate: "2026/04/30", priority: "high" },
  { code: "BPM260400349", name: "NPI Project_Samsung Smartphone #1", product: "Smartphone S1",
    type: "Major Enhancement", phase: "Develop", phaseDays: 31, readiness: 81, blocking: 0,
    pm: "PM", ownerName: "Pete Hayes", collaborators: 4,
    suppliers: 7, items: 76, tmcGap: 2.1, lastUpdate: "2026/04/27", priority: "med" },
  { code: "BPM260400348", name: "Wireless Charger 25W", product: "Charger C25",
    type: "Minor Enhancement", phase: "Concept", phaseDays: 134, readiness: 32, blocking: 0,
    pm: "CM", ownerName: "Cory Chen", collaborators: 2,
    suppliers: 3, items: 18, tmcGap: 0, lastUpdate: "2026/04/22", priority: "low" },
  { code: "BPM260400347", name: "Tablet Tab S10 Ultra", product: "Tablet T10",
    type: "Major Enhancement", phase: "Plan", phaseDays: 58, readiness: 64, blocking: 0,
    pm: "SM", ownerName: "Sam Lee", collaborators: 5,
    suppliers: 8, items: 92, tmcGap: 7.6, lastUpdate: "2026/04/29", priority: "med" },
  { code: "BPM260400346", name: "Soundbar HW-Q990D", product: "Audio Q990",
    type: "Minor Enhancement", phase: "Develop", phaseDays: 18, readiness: 89, blocking: 0,
    pm: "QM", ownerName: "Quinn Rodriguez", collaborators: 3,
    suppliers: 5, items: 38, tmcGap: -0.8, lastUpdate: "2026/04/30", priority: "low" },
  { code: "BPM260400345", name: "Refrigerator Family Hub 4D", product: "Refrigerator R4",
    type: "Major Enhancement", phase: "Define", phaseDays: 110, readiness: 47, blocking: 3,
    pm: "DE", ownerName: "Dean Park", collaborators: 8,
    suppliers: 14, items: 187, tmcGap: 42.1, lastUpdate: "2026/04/26", priority: "high" },
  { code: "BPM260400344", name: "Galaxy Ring 2", product: "Ring R2",
    type: "New To The World", phase: "Incubation", phaseDays: 178, readiness: 18, blocking: 0,
    pm: "PM", ownerName: "Paige Kim", collaborators: 2,
    suppliers: 2, items: 12, tmcGap: 0, lastUpdate: "2026/04/15", priority: "low" },
  { code: "BPM260400343", name: "Vacuum Cleaner BESPOKE Jet AI", product: "Vacuum V3",
    type: "Major Enhancement", phase: "SOP", phaseDays: 4, readiness: 98, blocking: 0,
    pm: "PM", ownerName: "Paige Wong", collaborators: 3,
    suppliers: 6, items: 54, tmcGap: -3.5, lastUpdate: "2026/04/30", priority: "low" },
];

const ACTIVE_PROJECT_CODE = "BPM260400354";

// Project Avatar helper: product-category icon + neutral color (status shown elsewhere)
function getProjectAvatar(project) {
  const text = `${project.name} ${project.product || ""}`.toLowerCase();
  // Keyword priority matching (specific first)
  let Icon = Package; // default fallback
  if (text.includes("foldable") || text.includes("fold")) Icon = Smartphone;
  else if (text.includes("smartphone") || text.includes("phone")) Icon = Smartphone;
  else if (text.includes("watch")) Icon = Watch;
  else if (text.includes("buds") || text.includes("earbud")) Icon = Headphones;
  else if (text.includes("ring")) Icon = Circle;
  else if (text.includes("tablet")) Icon = Tablet;
  else if (text.includes("tv") || text.includes("display")) Icon = Tv;
  else if (text.includes("soundbar") || text.includes("audio") || text.includes("speaker")) Icon = Speaker;
  else if (text.includes("refrigerator") || text.includes("fridge")) Icon = Refrigerator;
  else if (text.includes("vacuum")) Icon = Wind;
  else if (text.includes("charger")) Icon = BatteryCharging;
  // Uses design tokens: bg = secondaryLight, icon = secondaryDark
  return { Icon, bg: C.secondaryLight, iconColor: C.secondaryDark };
}

// === Project Meta (for General Info) ===
const PROJECT_META = {
  "BPM260400354": {
    fullName: "Galaxy Smartphone S26 Ultra",
    productLine: "Premium Mobile",
    region: "Global (Tier-1 launch: US/KR/EU)",
    targetMarket: "Premium ($999-$1,199 retail)",
    annualVolume: "12.5M units (Y1)",
    productionSite: "Vietnam (Thai Nguyen) · India (Noida)",
    plmCode: "PLM-2026-SM-S26U-001",
    erpProjectId: "ERP-1000-S26U",
    coreObjective: "5G + AI-on-device differentiation + Cost -8% vs Galaxy S25 Ultra",
    keyMilestones: [
      { phase: "Concept", date: "2025-09-15", status: "completed" },
      { phase: "Design", date: "2025-12-20", status: "completed" },
      { phase: "Develop", date: "2026-06-07", status: "active" },
      { phase: "Verify", date: "2026-08-30", status: "upcoming" },
      { phase: "SOP", date: "2026-10-15", status: "upcoming" },
    ],
  },
};

// === Shared Files ===
const SHARED_FILES = [
  { id: 1, name: "S26U_Industrial_Design_v2.3.pdf", type: "pdf", size: "12.4 MB",
    uploadedBy: "DE", uploadedAt: "2 days ago", category: "Design", version: "v2.3" },
  { id: 2, name: "Spec_Sheet_AMOLED_6.7inch_120Hz.xlsx", type: "xlsx", size: "284 KB",
    uploadedBy: "DE", uploadedAt: "Yesterday 14:22", category: "Design", version: "v1.5" },
  { id: 3, name: "BOM_Cost_Analysis_2026Q1.xlsx", type: "xlsx", size: "1.2 MB",
    uploadedBy: "CM", uploadedAt: "Today 09:15", category: "Cost", version: "v3.1" },
  { id: 4, name: "Supplier_RFQ_Response_Compilation.pdf", type: "pdf", size: "8.7 MB",
    uploadedBy: "SM", uploadedAt: "Today 11:30", category: "Sourcing", version: "v1.0" },
  { id: 5, name: "PPAP_Risk_Assessment_HighRisk_Items.docx", type: "docx", size: "542 KB",
    uploadedBy: "QM", uploadedAt: "Today 08:45", category: "Quality", version: "v2.0" },
  { id: 6, name: "Phase_Exit_Review_Develop_Gate.pptx", type: "pptx", size: "5.6 MB",
    uploadedBy: "PM", uploadedAt: "3 days ago", category: "Gate Review", version: "v1.2" },
  { id: 7, name: "APQP_Timeline_Master_Schedule.mpp", type: "other", size: "98 KB",
    uploadedBy: "QM", uploadedAt: "1 week ago", category: "Quality", version: "v4.0" },
  { id: 8, name: "Thermal_Simulation_Report_Mainboard.pdf", type: "pdf", size: "22.1 MB",
    uploadedBy: "DE", uploadedAt: "5 days ago", category: "Design", version: "v1.0" },
];

// === Collaborators ===
const COLLABORATORS = [
  { persona: "PM", role: "Project Manager", active: "now", contribution: 28, owner: true,
    email: "paige.kim@samsung.com", phone: "+82 10-2345-1001", department: "NPI Office" },
  { persona: "DE", role: "Design Engineer", active: "5 min ago", contribution: 47, owner: false,
    email: "dean.park@samsung.com", phone: "+82 10-2345-1002", department: "Mobile R&D" },
  { persona: "CM", role: "Cost Manager", active: "2 hours ago", contribution: 32, owner: false,
    email: "cory.chen@samsung.com", phone: "+82 10-2345-1003", department: "Cost Engineering" },
  { persona: "SM", role: "Sourcing Manager", active: "Yesterday", contribution: 24, owner: false,
    email: "sam.lee@samsung.com", phone: "+82 10-2345-1004", department: "Strategic Sourcing" },
  { persona: "QM", role: "Quality Manager", active: "3 hours ago", contribution: 18, owner: false,
    email: "quinn.r@samsung.com", phone: "+82 10-2345-1005", department: "Quality Assurance" },
];

// === External collaborators (suppliers / vendors) ===
// Per-project external contacts — appears only when supplier engagements exist
const EXTERNAL_COLLABORATORS = [
  // === BOE Technology === (Selected AMOLED supplier — full team engaged)
  { id: "ext-1", name: "Chen Wei", company: "BOE Technology", role: "Account Manager",
    initial: "CW", color: "#1565E0",
    email: "chen.wei@boe.com", phone: "+86 10 6436 8888",
    contribution: "AMOLED Panel · Supplier (Selected)", active: "Today 14:22",
    bomScope: "C" },
  { id: "ext-1b", name: "Li Mei", company: "BOE Technology", role: "Sales Engineer",
    initial: "LM", color: "#1565E0",
    email: "li.mei@boe.com", phone: "+86 10 6436 8901",
    contribution: "AMOLED Panel · Technical specs", active: "Today 11:08",
    bomScope: "C" },
  { id: "ext-1c", name: "Zhang Hao", company: "BOE Technology", role: "Quality Lead",
    initial: "ZH", color: "#1565E0",
    email: "zhang.hao@boe.com", phone: "+86 10 6436 8945",
    contribution: "AMOLED Panel · PPAP submissions", active: "Yesterday",
    bomScope: "Q" },

  // === Samsung Display === (Lost RFQ — primary contact only)
  { id: "ext-2", name: "Hideki Tanaka", company: "Samsung Display", role: "Senior Sales",
    initial: "HT", color: "#532DF6",
    email: "h.tanaka@samsungdisplay.com", phone: "+82 31 5181 2000",
    contribution: "AMOLED Panel · RFQ (Not selected)", active: "Yesterday",
    bomScope: "C" },
  { id: "ext-2b", name: "Soo-ji Lee", company: "Samsung Display", role: "Account Director",
    initial: "SL", color: "#532DF6",
    email: "sj.lee@samsungdisplay.com", phone: "+82 31 5181 2055",
    contribution: "AMOLED Panel · Commercial lead", active: "3 days ago",
    bomScope: "C" },

  // === LG Display === (Lost RFQ — primary contact only)
  { id: "ext-3", name: "Min-jun Park", company: "LG Display", role: "Key Account",
    initial: "MP", color: "#009955",
    email: "minjun.p@lgdisplay.com", phone: "+82 2 3777 1114",
    contribution: "AMOLED Panel · RFQ (Not selected)", active: "Yesterday",
    bomScope: "C" },
  { id: "ext-3b", name: "Ji-won Kim", company: "LG Display", role: "Field App Engineer",
    initial: "JK", color: "#009955",
    email: "jw.kim@lgdisplay.com", phone: "+82 2 3777 1155",
    contribution: "AMOLED Panel · Sample evaluation", active: "Last week",
    bomScope: "C" },

  // === Nitto Denko === (Selected Polarizer supplier — full team)
  { id: "ext-4", name: "Sarah Williams", company: "Nitto Denko", role: "Sales Engineer",
    initial: "SW", color: "#E06900",
    email: "s.williams@nitto.com", phone: "+1 415 778 2700",
    contribution: "Polarizer Film · Supplier (Primary)", active: "2 days ago",
    bomScope: "C" },
  { id: "ext-4b", name: "Yuki Sato", company: "Nitto Denko", role: "Product Manager",
    initial: "YS", color: "#E06900",
    email: "y.sato@nitto.com", phone: "+81 6 7632 2101",
    contribution: "Polarizer Film · Spec coordination", active: "2 days ago",
    bomScope: "C" },
  { id: "ext-4c", name: "Tom Becker", company: "Nitto Denko", role: "Quality Engineer",
    initial: "TB", color: "#E06900",
    email: "t.becker@nitto.com", phone: "+1 415 778 2715",
    contribution: "Polarizer Film · PPAP", active: "Last week",
    bomScope: "Q" },

  // === 3M Korea === (OCA Adhesive — primary + technical)
  { id: "ext-5", name: "Robert Liu", company: "3M Korea", role: "Technical Sales",
    initial: "RL", color: "#1565E0",
    email: "r.liu@3m.com", phone: "+82 2 3771 4114",
    contribution: "OCA Adhesive · Supplier", active: "Last week",
    bomScope: "C" },
  { id: "ext-5b", name: "Hye-jin Choi", company: "3M Korea", role: "Application Specialist",
    initial: "HC", color: "#1565E0",
    email: "hj.choi@3m.com", phone: "+82 2 3771 4155",
    contribution: "OCA Adhesive · Lamination support", active: "2 days ago",
    bomScope: "C" },
];

// === Supplier company profiles ===
// Used by SupplierProfilePopover when hovering a company name in External Collaborators.
// Mock procurement history (last 7 quarters) + RFx history.
const SUPPLIER_DETAILS = {
  "BOE Technology": {
    name: "BOE Technology",
    location: "Beijing, CN",
    badge: "Strategic Partner",
    tags: ["Display", "AMOLED", "Tier 1 Supplier"],
    summary: "Largest display panel manufacturer in China. Selected AMOLED supplier for Hero project. Stable credit rating, on-time delivery 96%.",
    purchaseHistory: [
      { quarter: "Q1 24", po: 89, rate: 0 },
      { quarter: "Q2 24", po: 115, rate: 29 },
      { quarter: "Q3 24", po: 102, rate: -11 },
      { quarter: "Q4 24", po: 158, rate: 55 },
      { quarter: "Q1 25", po: 142, rate: -10 },
      { quarter: "Q2 25", po: 175, rate: 23 },
      { quarter: "Q3 25", po: 108, rate: -38 },
    ],
    items: [
      { category: "Display", amount: 142000, rate: 18.5, parts: [
        { name: "AMOLED Panel 6.7\"", spec: "1080×2400, 120Hz", amount: 95000 },
        { name: "Cover Glass", spec: "Gorilla Victus 2", amount: 28000 },
        { name: "OLED Driver IC", spec: "DDI-2300", amount: 19000 },
      ]},
    ],
    rfx: [
      { year: 2025, org: "Mobile Procurement", requests: 14, bids: 11, bidRate: 78.6, awards: 6, awardRate: 54.5 },
      { year: 2024, org: "Mobile Procurement", requests: 22, bids: 18, bidRate: 81.8, awards: 9, awardRate: 50.0 },
    ],
  },
  "Samsung Display": {
    name: "Samsung Display",
    location: "Asan, KR",
    badge: "Preferred Supplier",
    tags: ["Display", "AMOLED", "Tier 1 Supplier"],
    summary: "Sister company under Samsung Group. Premium AMOLED supplier. Lost recent RFQ on price competitiveness but remains preferred for high-tier products.",
    purchaseHistory: [
      { quarter: "Q1 24", po: 75, rate: 0 },
      { quarter: "Q2 24", po: 92, rate: 23 },
      { quarter: "Q3 24", po: 80, rate: -13 },
      { quarter: "Q4 24", po: 108, rate: 35 },
      { quarter: "Q1 25", po: 95, rate: -12 },
      { quarter: "Q2 25", po: 88, rate: -7 },
      { quarter: "Q3 25", po: 64, rate: -27 },
    ],
    items: [
      { category: "Display", amount: 95000, rate: -8.2, parts: [
        { name: "AMOLED Panel 6.5\"", spec: "1440×3088, 120Hz", amount: 72000 },
        { name: "Touch Panel", spec: "Integrated Y-OCTA", amount: 23000 },
      ]},
    ],
    rfx: [
      { year: 2025, org: "Mobile Procurement", requests: 12, bids: 10, bidRate: 83.3, awards: 3, awardRate: 30.0 },
      { year: 2024, org: "Mobile Procurement", requests: 18, bids: 16, bidRate: 88.9, awards: 7, awardRate: 43.8 },
    ],
  },
  "LG Display": {
    name: "LG Display",
    location: "Paju, KR",
    badge: "Approved Supplier",
    tags: ["Display", "OLED", "Tier 1 Supplier"],
    summary: "Major OLED supplier with strong P-OLED tech. Competitive on mid-range volume contracts. Lost recent AMOLED RFQ but active on smaller form factor.",
    purchaseHistory: [
      { quarter: "Q1 24", po: 58, rate: 0 },
      { quarter: "Q2 24", po: 72, rate: 24 },
      { quarter: "Q3 24", po: 65, rate: -10 },
      { quarter: "Q4 24", po: 88, rate: 35 },
      { quarter: "Q1 25", po: 78, rate: -11 },
      { quarter: "Q2 25", po: 82, rate: 5 },
      { quarter: "Q3 25", po: 51, rate: -38 },
    ],
    items: [
      { category: "Display", amount: 78000, rate: -12.0, parts: [
        { name: "AMOLED Panel 6.1\"", spec: "1080×2340, 90Hz", amount: 55000 },
        { name: "Display Module", spec: "LTPO Backplane", amount: 23000 },
      ]},
    ],
    rfx: [
      { year: 2025, org: "Mobile Procurement", requests: 10, bids: 8, bidRate: 80.0, awards: 2, awardRate: 25.0 },
    ],
  },
  "Nitto Denko": {
    name: "Nitto Denko",
    location: "Osaka, JP",
    badge: "Strategic Partner",
    tags: ["Optical Films", "Polarizer", "Adhesive"],
    summary: "Global leader in polarizer films for displays. Sole-source partner for Hero project Polarizer Film. PPAP Lv3 approved.",
    purchaseHistory: [
      { quarter: "Q1 24", po: 32, rate: 0 },
      { quarter: "Q2 24", po: 38, rate: 19 },
      { quarter: "Q3 24", po: 35, rate: -8 },
      { quarter: "Q4 24", po: 45, rate: 29 },
      { quarter: "Q1 25", po: 42, rate: -7 },
      { quarter: "Q2 25", po: 48, rate: 14 },
      { quarter: "Q3 25", po: 39, rate: -19 },
    ],
    items: [
      { category: "Optical Films", amount: 42000, rate: 8.5, parts: [
        { name: "Polarizer Film", spec: "100mm × 80mm × 0.13mm", amount: 28000 },
        { name: "Anti-reflective Coating", spec: "AR-3 grade", amount: 14000 },
      ]},
    ],
    rfx: [
      { year: 2025, org: "Mobile Procurement", requests: 6, bids: 5, bidRate: 83.3, awards: 4, awardRate: 80.0 },
    ],
  },
  "3M Korea": {
    name: "3M Korea",
    location: "Seoul, KR",
    badge: "Approved Supplier",
    tags: ["Adhesive", "OCA", "Specialty Materials"],
    summary: "Subsidiary of 3M global. Reliable OCA adhesive supplier with strong application engineering support.",
    purchaseHistory: [
      { quarter: "Q1 24", po: 22, rate: 0 },
      { quarter: "Q2 24", po: 28, rate: 27 },
      { quarter: "Q3 24", po: 25, rate: -11 },
      { quarter: "Q4 24", po: 32, rate: 28 },
      { quarter: "Q1 25", po: 29, rate: -9 },
      { quarter: "Q2 25", po: 34, rate: 17 },
      { quarter: "Q3 25", po: 26, rate: -24 },
    ],
    items: [
      { category: "Adhesive", amount: 29000, rate: 5.2, parts: [
        { name: "OCA Adhesive", spec: "200μm thickness, low-haze", amount: 19000 },
        { name: "Foam Tape", spec: "VHB grade", amount: 10000 },
      ]},
    ],
    rfx: [
      { year: 2025, org: "Mobile Procurement", requests: 4, bids: 4, bidRate: 100.0, awards: 3, awardRate: 75.0 },
    ],
  },
};

// === Per-project shared files (isNew → empty; otherwise → SHARED_FILES) ===
function getSharedFilesForProject(project) {
  if (project && project.isNew) return [];
  return SHARED_FILES;
}

// === Per-project collaborators (isNew → just the owner; otherwise → full team) ===
function getCollaboratorsForProject(project) {
  if (project && project.isNew) {
    // New project: only the owner (PM) on the team
    return COLLABORATORS.filter(c => c.owner);
  }
  return COLLABORATORS;
}

// === Per-project external collaborators (suppliers) ===
// isNew project or projects not in Develop+ phase → empty
function getExternalCollaboratorsForProject(project) {
  if (!project || project.isNew) return [];
  // Hero project has full supplier engagement — all contacts from all companies
  if (project.code === "BPM260400354") return EXTERNAL_COLLABORATORS;
  // Other projects: pick primary contact (1 per company) based on phase progress.
  // Primary contacts have base IDs (ext-1, ext-2, ext-3, ...). Sub-contacts have suffix (ext-1b, etc).
  const primaries = EXTERNAL_COLLABORATORS.filter(c => !/[a-z]$/.test(c.id));
  const phaseOrder = ["Incubation", "Concept", "Plan", "Define", "Develop", "Verify", "SOP"];
  const phaseIdx = phaseOrder.indexOf(project.phase);
  if (phaseIdx < 3) return [];                  // Pre-Define: no suppliers yet
  if (phaseIdx < 4) return primaries.slice(0, 2); // Define: 2 primary contacts
  return primaries.slice(0, 3);                  // Develop+: 3 primary contacts
}

// === BOM Timeline Events ===
// Each BOM has its own lifecycle history. Events are grouped by date.
// Event types: created, uploaded, review, approved, conflict, discussion, rfq, ppap, cost, sync, version
// kind controls icon + color: success | error | primary | neutral
const BOM_TIMELINE_EVENTS = {
  E: [
    { id: "e1", date: "Today, May 18", time: "5:20 PM", title: "Spec change: 6.5\" → 6.7\", 90Hz → 120Hz",
      kind: "primary", iconType: "zap", author: "DE", detail: "AMOLED Panel spec updated by Dean Park. AI impact analysis triggered." },
    { id: "e2", date: "Today, May 18", time: "10:24 AM", title: "PM raised blocker: AMOLED Panel",
      kind: "error", iconType: "alert", author: "PM", detail: "Cost & PPAP blocked on new spec." },
    { id: "e3", date: "May 16", time: "3:42 PM", title: "Review approved by PM",
      kind: "success", iconType: "check", author: "PM", detail: "v2.0 approved for downstream BOM sync." },
    { id: "e4", date: "May 16", time: "11:08 AM", title: "Submitted for review",
      kind: "neutral", iconType: "send", author: "DE", detail: null },
    { id: "e5", date: "May 14", time: "4:15 PM", title: "Internal Review Completed",
      kind: "success", iconType: "check", author: "DE", detail: null },
    { id: "e6", date: "May 14", time: "9:00 AM", title: "CAD update synced",
      kind: "neutral", iconType: "upload", author: "DE", detail: "84 parts imported from PLM." },
    { id: "e7", date: "May 10", time: "2:30 PM", title: "v2.0 created",
      kind: "neutral", iconType: "version", author: "DE", detail: "Branched from v1.5." },
  ],
  Q: [
    { id: "q1", date: "Today, May 18", time: "2:22 PM", title: "PPAP Lv3 assigned: AMOLED Panel → BOE",
      kind: "primary", iconType: "shield", author: "QM", detail: "Risk Assessment auto-completed. Medium risk." },
    { id: "q2", date: "Today, May 18", time: "8:45 AM", title: "Q-BOM auto-sync confirmed",
      kind: "success", iconType: "check", author: "QM", detail: "Synced from C-BOM v2.2." },
    { id: "q3", date: "May 17", time: "1:15 PM", title: "PFMEA draft updated",
      kind: "neutral", iconType: "upload", author: "QM", detail: "Display Module bonding process — Critical entry added." },
    { id: "q4", date: "May 15", time: "11:30 AM", title: "PPAP Lv2 approved: OCA Adhesive",
      kind: "success", iconType: "check", author: "QM", detail: "3M OCA — UV 1000h test passed." },
    { id: "q5", date: "May 12", time: "10:00 AM", title: "v1.3 created",
      kind: "neutral", iconType: "version", author: "QM", detail: "Synced from E-BOM v1.8." },
  ],
  C: [
    // Source & Cost combined timeline — events from both supplier selection (SM) and cost analysis (CM)
    { id: "c1", date: "Today, May 18", time: "2:35 PM", title: "BOE quote applied: $38.90",
      kind: "success", iconType: "check", author: "CM", detail: "Best of 3 quotes. Δ vs Should-cost: -$2.90." },
    { id: "c2", date: "Today, May 18", time: "2:15 PM", title: "RFQ sent: AMOLED Panel",
      kind: "primary", iconType: "send", author: "SM", detail: "3 suppliers: Samsung Display, BOE, LG Display." },
    { id: "c3", date: "Today, May 18", time: "11:08 AM", title: "Should-cost analysis: AMOLED Panel",
      kind: "primary", iconType: "zap", author: "CM", detail: "$41.80 confirmed. Market: $42.50. Supplier selection requested." },
    { id: "c4", date: "May 17", time: "5:42 PM", title: "Cost target locked: $38.00",
      kind: "primary", iconType: "shield", author: "CM", detail: "Approved by PM." },
    { id: "c5", date: "May 17", time: "4:30 PM", title: "Pre-qualification updated",
      kind: "success", iconType: "check", author: "SM", detail: "BOE Technology added to qualified vendor list." },
    { id: "c6", date: "May 15", time: "10:22 AM", title: "Conflict resolved: Polarizer dual-source",
      kind: "success", iconType: "check", author: "SM", detail: "Nitto Denko (primary) + LG Chem (secondary) approved." },
    { id: "c7", date: "May 15", time: "9:30 AM", title: "Polarizer savings: $0.05/unit",
      kind: "success", iconType: "check", author: "CM", detail: "Nitto Denko price reduced $1.80 → $1.75." },
    { id: "c8", date: "May 13", time: "3:00 PM", title: "Conflict detected: Polarizer single-source",
      kind: "error", iconType: "alert", author: "QM", detail: "QM flagged: single-source risk on critical part." },
    { id: "c9", date: "May 13", time: "2:00 PM", title: "Cost rollup completed",
      kind: "neutral", iconType: "upload", author: "CM", detail: "v2.1 cost rollup: $42.30 total BOM cost." },
    { id: "c10", date: "May 10", time: "11:15 AM", title: "v2.1 created",
      kind: "neutral", iconType: "version", author: "CM", detail: "Synced from E-BOM v2.0. 60 of 84 parts have suppliers assigned." },
  ],
};

// === BOM Version Compare Data ===
// Mock diff between current and previous version
const BOM_VERSION_DIFFS = {
  E: { current: "v2.0", previous: "v1.5",
    added: [{ partId: "EQQ-MWS6-XAG2D", name: "AMOLED Panel 6.7\" FHD+ 120Hz", reason: "New spec requested" }],
    modified: [
      { partId: "XYR-YZK5-WA1A7", name: "Display Module 6.7\"", change: "Size: 6.5\" → 6.7\"" },
      { partId: "FQI-QVPW-G83RR", name: "Touch Controller IC", change: "Refresh: 90Hz → 120Hz" },
    ],
    removed: [{ partId: "OLD-PANEL-6.5", name: "AMOLED Panel 6.5\" FHD+ 90Hz", reason: "Replaced by 6.7\" 120Hz variant" }],
  },
  Q: { current: "v1.4", previous: "v1.3",
    added: [{ partId: "PPAP-AMOLED", name: "AMOLED Panel PPAP Lv3", reason: "Medium risk auto-assigned" }],
    modified: [{ partId: "5ML-DR7Q-2CV44", name: "OCA Adhesive", change: "PPAP Lv2 → Approved" }],
    removed: [],
  },
  C: { current: "v2.2", previous: "v2.1",
    added: [{ partId: "SUPPLIER-BOE", name: "BOE Technology (AMOLED Panel)", reason: "Added via RFQ" }],
    modified: [
      { partId: "EQQ-MWS6-XAG2D", name: "AMOLED Panel", change: "Supplier: — → BOE · Quoted: — → $38.90" },
      { partId: "UEI-Y0ZL-7UU0W", name: "Polarizer Film", change: "Single-source → Dual-source · Quoted: $1.80 → $1.75" },
    ],
    removed: [],
  },
};

// === [DEPRECATED] BOM Collaboration Log ===
// 2026.05 Collaboration Log section removed from BOM List screen.
// Change history is now surfaced through Chat (decision-pinned messages)
// and per-BOM version tracking in BOM Collaboration. Data retained for possible future restoration.
const BOM_COLLAB_LOG = [
  { id: 1, ts: "Today 14:22", bomId: "Q", action: "PPAP Requested",
    actor: "QM", detail: "PPAP Lv3 request sent to BOE Technology", version: "v1.5" },
  { id: 2, ts: "Today 11:30", bomId: "C", action: "Supplier Awarded",
    actor: "SM", detail: "BOE Technology awarded ($38.90/EA)", version: "v2.2" },
  { id: 3, ts: "Today 09:15", bomId: "C", action: "Should-cost Updated",
    actor: "CM", detail: "AMOLED Panel: $41.80 (AI recommended)", version: "v2.0" },
  { id: 4, ts: "Yesterday 16:42", bomId: "C", action: "Sync Notification",
    actor: "SM", detail: "AMOLED Panel added in E-BOM → C-BOM needs supplier selection", version: "v2.1" },
  { id: 5, ts: "Yesterday 14:30", bomId: "E", action: "Part Added",
    actor: "DE", detail: "Added AMOLED Panel 6.7\" FHD+ 120Hz", version: "v1.8" },
  { id: 6, ts: "Yesterday 11:15", bomId: "E", action: "Spec Updated",
    actor: "DE", detail: "Display 6.5\" → 6.7\", 90Hz → 120Hz", version: "v1.8" },
  { id: 7, ts: "2 days ago", bomId: "E", action: "Version Created",
    actor: "DE", detail: "E-BOM v1.7 → v1.8 (8 changes)", version: "v1.8" },
  { id: 8, ts: "3 days ago", bomId: "C", action: "Cost Roll-up",
    actor: "CM", detail: "Full BOM cost roll-up complete (TMC $486.96)", version: "v2.0" },
  { id: 9, ts: "5 days ago", bomId: "Q", action: "Risk Assessment",
    actor: "QM", detail: "PPAP Level auto-determined for 10 parts", version: "v1.5" },
  { id: 10, ts: "1 week ago", bomId: "E", action: "BOM Cloned",
    actor: "PM", detail: "Created from Smartphone A1 Template", version: "v1.0" },
];

// 80 BOM parts: 12 scenario-critical + general parts — tree structure
const BOM_TREE = [
  // ============================================================
  // Level 1 — Root Assembly
  // ============================================================
  { id: 1, lvl: 1, partId: "SYH-OGNU-A1Y9A", desc: "ASSY,SMARTPHONE,6.7IN,5G,256GB", type: "ASSM",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 2,
    children: [2, 9, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110],
    supplier: "Internal", ppap: "Lv1", category: "Final Assembly", risk: "Low" },

  // ============================================================
  // Level 2 — Display Module branch (id 2-8)
  // ============================================================
  { id: 2, lvl: 2, partId: "XYR-YZK5-WA1A7", desc: "ASSY,DISPLAY MODULE,6.7IN,AMOLED", type: "ASSM",
    status: { D: "warn", C: "warn", Q: "warn" }, comments: 8, children: [3, 7, 8],
    supplier: "Samsung Display", ppap: "Lv3", category: "Display", risk: "Med" },
  { id: 3, lvl: 3, partId: "EI2-I6DA-003WB", desc: "PANEL,AMOLED,6.7IN,FHD+,120HZ", type: "MISC",
    status: { D: "warn", C: "block", Q: "block" }, comments: 14, isHero: true,
    diff: "added", children: [4, 5, 6],
    supplier: "BOE Technology", ppap: "Lv3", category: "Display", risk: "Med" },
  { id: 4, lvl: 4, partId: "UEI-Y0ZL-7UU0W", desc: "FILM,POLARIZER,FRONT,6.7IN", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Nitto Denko", ppap: "Lv2", category: "Display", risk: "Low" },
  { id: 5, lvl: 4, partId: "5ML-DR7Q-2CV44", desc: "FILM,OCA,OPTICAL CLEAR ADHESIVE,6.7IN", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "3M", ppap: "Lv2", category: "Display", risk: "Low" },
  { id: 6, lvl: 4, partId: "1W6-4YP3-X6FU2", desc: "IC,TOUCH CONTROLLER,I2C", type: "CMDTY",
    status: { D: "ok", C: "warn", Q: "ok" }, comments: 3, children: [],
    supplier: "Synaptics", ppap: "Lv2", category: "Display", risk: "Low" },
  { id: 7, lvl: 3, partId: "GL2-7HKR-WA1Z3", desc: "GLASS,COVER,GORILLA VICTUS 2,6.7IN", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 2, children: [],
    supplier: "Corning", ppap: "Lv2", category: "Display", risk: "Low" },
  { id: 8, lvl: 3, partId: "BR3-9PLK-DR4N5", desc: "BRACKET,DISPLAY,ALUMINUM,6.7IN", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Catcher Technology", ppap: "Lv1", category: "Display", risk: "Low" },

  // ============================================================
  // Level 2 — Fan / Cooling branch (id 9-12)
  // ============================================================
  { id: 9, lvl: 2, partId: "QE3-8DHV-XIRG8", desc: "ASSY,FAN MODULE,SMARTPHONE COOLING", type: "ASSM",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [11, 12],
    supplier: "Foxconn", ppap: "Lv2", category: "Mechanical", risk: "Low" },
  { id: 11, lvl: 3, partId: "VC1-4JTH-CHM7P", desc: "VAPOR CHAMBER,COPPER,0.4MM", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Furukawa Electric", ppap: "Lv2", category: "Mechanical", risk: "Low" },
  { id: 12, lvl: 3, partId: "TP4-6GRT-89XQM", desc: "THERMAL PAD,GRAPHITE,COOLING", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Henkel", ppap: "Lv1", category: "Mechanical", risk: "Low" },

  // ============================================================
  // Level 2 — Mainboard PCB branch (id 20-31)
  // ============================================================
  { id: 20, lvl: 2, partId: "MB1-7TY5-BRDLA", desc: "ASSY,MAINBOARD,5G,SM-XXXX", type: "ASSM",
    status: { D: "ok", C: "ok", Q: "warn" }, comments: 5, children: [10, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31],
    supplier: "Samsung Electro-Mechanics", ppap: "Lv3", category: "PCB", risk: "High" },
  { id: 10, lvl: 3, partId: "6U8-HKJJ-JRPWM", desc: "PCB,MAINBOARD,10-LAYER,HDI", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "warn" }, comments: 3, children: [],
    supplier: "Samsung Electro-Mechanics", ppap: "Lv3", category: "PCB", risk: "High" },
  { id: 21, lvl: 3, partId: "AP1-3KW9-QC8GN", desc: "IC,AP,SNAPDRAGON 8 GEN 3", type: "CMDTY",
    status: { D: "ok", C: "warn", Q: "ok" }, comments: 4, children: [],
    supplier: "Qualcomm", ppap: "Lv3", category: "PCB", risk: "High" },
  { id: 22, lvl: 3, partId: "MM2-5JNE-DR4VA", desc: "IC,DRAM,LPDDR5X,12GB", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 2, children: [],
    supplier: "Samsung Semi", ppap: "Lv3", category: "PCB", risk: "Med" },
  { id: 23, lvl: 3, partId: "ST3-9HFR-STR91", desc: "IC,STORAGE,UFS 4.0,256GB", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Samsung Semi", ppap: "Lv3", category: "PCB", risk: "Med" },
  { id: 24, lvl: 3, partId: "PM4-2RWN-PMU3K", desc: "IC,PMIC,POWER MANAGEMENT", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Qualcomm", ppap: "Lv2", category: "PCB", risk: "Low" },
  { id: 25, lvl: 3, partId: "MD5-8KQT-MDM5G", desc: "IC,MODEM,5G SUB-6 / mmWAVE", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 2, children: [],
    supplier: "Qualcomm", ppap: "Lv3", category: "PCB", risk: "Med" },
  { id: 26, lvl: 3, partId: "WF6-4LMS-WFI6E", desc: "IC,WIFI 7 + BT 5.4 COMBO", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Broadcom", ppap: "Lv2", category: "PCB", risk: "Low" },
  { id: 27, lvl: 3, partId: "AC7-6PHW-AUDIO", desc: "IC,AUDIO CODEC,32-BIT HIFI", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Cirrus Logic", ppap: "Lv2", category: "PCB", risk: "Low" },
  { id: 28, lvl: 3, partId: "NF8-3VBA-NFCCH", desc: "IC,NFC CONTROLLER + eSE", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "NXP Semiconductors", ppap: "Lv2", category: "PCB", risk: "Low" },
  { id: 29, lvl: 3, partId: "CR9-1QEB-CRYO0", desc: "CRYSTAL,OSCILLATOR,38.4MHZ", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Murata", ppap: "Lv1", category: "PCB", risk: "Low" },
  { id: 31, lvl: 3, partId: "PS1-7ZAU-PASSV", desc: "PASSIVES,SET,CAPACITOR+RESISTOR+INDUCTOR", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Murata", ppap: "Lv1", category: "PCB", risk: "Low" },

  // ============================================================
  // Level 2 — Battery branch (id 30-37)
  // ============================================================
  { id: 30, lvl: 2, partId: "BT1-9HGR-BATAS", desc: "ASSY,BATTERY PACK,5000mAh", type: "ASSM",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 4, children: [32, 33, 34, 35, 36, 37],
    supplier: "Samsung SDI", ppap: "Lv3", category: "Battery", risk: "High" },
  { id: 32, lvl: 3, partId: "BC1-2FYW-CELL01", desc: "BATTERY CELL,LI-POLYMER,5000mAh", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 3, children: [],
    supplier: "Samsung SDI", ppap: "Lv3", category: "Battery", risk: "High" },
  { id: 33, lvl: 3, partId: "BP2-8KEN-PROT08", desc: "PCB,BATTERY PROTECTION CIRCUIT", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "ITM Semiconductor", ppap: "Lv2", category: "Battery", risk: "Med" },
  { id: 34, lvl: 3, partId: "BF3-5NLT-FUSE12", desc: "FUSE,THERMAL,BATTERY SAFETY", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Bourns", ppap: "Lv2", category: "Battery", risk: "Med" },
  { id: 35, lvl: 3, partId: "BC4-1OZQ-CONN34", desc: "CONNECTOR,BATTERY,SPRING CONTACT", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Hirose", ppap: "Lv1", category: "Battery", risk: "Low" },
  { id: 36, lvl: 3, partId: "BA5-7AVU-ADH567", desc: "ADHESIVE,BATTERY MOUNTING,DOUBLE-SIDED", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "3M", ppap: "Lv1", category: "Battery", risk: "Low" },
  { id: 37, lvl: 3, partId: "BL6-4XYP-LBL890", desc: "LABEL,BATTERY,REGULATORY", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Avery Dennison", ppap: "Lv1", category: "Battery", risk: "Low" },

  // ============================================================
  // Level 2 — Camera branch (id 40-49)
  // ============================================================
  { id: 40, lvl: 2, partId: "CM1-3EHF-CAMAS", desc: "ASSY,CAMERA MODULE,REAR TRIPLE", type: "ASSM",
    status: { D: "ok", C: "warn", Q: "ok" }, comments: 6, children: [41, 42, 43, 44, 45, 46, 47, 48, 49],
    supplier: "Samsung Electro-Mechanics", ppap: "Lv3", category: "Camera", risk: "High" },
  { id: 41, lvl: 3, partId: "CM2-9PTY-SNS200", desc: "SENSOR,IMAGE,200MP MAIN", type: "CMDTY",
    status: { D: "ok", C: "warn", Q: "ok" }, comments: 4, children: [],
    supplier: "Samsung Semi", ppap: "Lv3", category: "Camera", risk: "High" },
  { id: 42, lvl: 3, partId: "CL3-6URD-LNS200", desc: "LENS,7P,F1.7,OIS,200MP MAIN", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 2, children: [],
    supplier: "Largan Precision", ppap: "Lv3", category: "Camera", risk: "Med" },
  { id: 43, lvl: 3, partId: "CS4-5AVN-SNSULT", desc: "SENSOR,IMAGE,12MP ULTRAWIDE", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Sony Semiconductor", ppap: "Lv3", category: "Camera", risk: "Med" },
  { id: 44, lvl: 3, partId: "CL4-2BWK-LNSULT", desc: "LENS,6P,F2.2,ULTRAWIDE 12MP", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Sunny Optical", ppap: "Lv2", category: "Camera", risk: "Low" },
  { id: 45, lvl: 3, partId: "CS5-7HLT-SNSTEL", desc: "SENSOR,IMAGE,10MP TELEPHOTO 3X", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Sony Semiconductor", ppap: "Lv3", category: "Camera", risk: "Med" },
  { id: 46, lvl: 3, partId: "CL5-4MGS-LNSTEL", desc: "LENS,5P,F2.4,TELEPHOTO 3X", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Largan Precision", ppap: "Lv2", category: "Camera", risk: "Low" },
  { id: 47, lvl: 3, partId: "OI6-8JXN-OIS012", desc: "ACTUATOR,OIS,VOICE COIL,MAIN", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Mitsumi", ppap: "Lv2", category: "Camera", risk: "Med" },
  { id: 48, lvl: 3, partId: "FL7-3ZBQ-FLSH09", desc: "LED,FLASH,DUAL TONE", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Lumileds", ppap: "Lv1", category: "Camera", risk: "Low" },
  { id: 49, lvl: 3, partId: "FC8-1KWE-FCAM12", desc: "ASSY,CAMERA,FRONT 12MP", type: "ASSM",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "LG Innotek", ppap: "Lv2", category: "Camera", risk: "Low" },

  // ============================================================
  // Level 2 — Audio branch (id 50-54)
  // ============================================================
  { id: 50, lvl: 2, partId: "AU1-6FRP-AUDAS", desc: "ASSY,AUDIO SUBSYSTEM", type: "ASSM",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 2, children: [51, 52, 53, 54],
    supplier: "AAC Technologies", ppap: "Lv2", category: "Audio", risk: "Low" },
  { id: 51, lvl: 3, partId: "SP1-9HXJ-SPK001", desc: "SPEAKER,EARPIECE,STEREO TOP", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "AAC Technologies", ppap: "Lv2", category: "Audio", risk: "Low" },
  { id: 52, lvl: 3, partId: "SP2-4VLG-SPK002", desc: "SPEAKER,LOUDSPEAKER,STEREO BOTTOM", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "AAC Technologies", ppap: "Lv2", category: "Audio", risk: "Low" },
  { id: 53, lvl: 3, partId: "MC3-7BPL-MIC003", desc: "MICROPHONE,MEMS,DUAL ARRAY", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Knowles", ppap: "Lv2", category: "Audio", risk: "Low" },
  { id: 54, lvl: 3, partId: "AM4-2QZR-AMP004", desc: "IC,AUDIO AMPLIFIER,CLASS-D", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Cirrus Logic", ppap: "Lv2", category: "Audio", risk: "Low" },

  // ============================================================
  // Level 2 — Connectors / Cables branch (id 60-67)
  // ============================================================
  { id: 60, lvl: 2, partId: "CN1-8GFM-CONAS", desc: "ASSY,CONNECTORS + CABLES", type: "ASSM",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [61, 62, 63, 64, 65, 66, 67],
    supplier: "Foxconn Interconnect", ppap: "Lv2", category: "Connectors", risk: "Low" },
  { id: 61, lvl: 3, partId: "UC1-5VHN-USBCN1", desc: "CONNECTOR,USB-C,RECEPTACLE,24-PIN", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Foxconn Interconnect", ppap: "Lv2", category: "Connectors", risk: "Low" },
  { id: 62, lvl: 3, partId: "SC2-3PLW-SIMTRY", desc: "ASSY,SIM TRAY,NANO + eSIM", type: "ASSM",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Molex", ppap: "Lv2", category: "Connectors", risk: "Low" },
  { id: 63, lvl: 3, partId: "FC3-8MJK-FLEX01", desc: "FLEX CABLE,MAINBOARD TO DISPLAY", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Sumitomo Electric", ppap: "Lv2", category: "Connectors", risk: "Low" },
  { id: 64, lvl: 3, partId: "FC4-9WBU-FLEX02", desc: "FLEX CABLE,MAINBOARD TO CAMERA", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Sumitomo Electric", ppap: "Lv2", category: "Connectors", risk: "Low" },
  { id: 65, lvl: 3, partId: "FC5-7DSQ-FLEX03", desc: "FLEX CABLE,MAINBOARD TO BATTERY", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Sumitomo Electric", ppap: "Lv2", category: "Connectors", risk: "Low" },
  { id: 66, lvl: 3, partId: "BC6-1ETR-BTNCBL", desc: "FLEX,SIDE BUTTONS (POWER+VOLUME)", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Foxconn Interconnect", ppap: "Lv1", category: "Connectors", risk: "Low" },
  { id: 67, lvl: 3, partId: "AC7-4OPY-ANTCBL", desc: "CABLE,COAXIAL,ANTENNA RF", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Murata", ppap: "Lv2", category: "Connectors", risk: "Low" },

  // ============================================================
  // Level 2 — Mechanical / Frame branch (id 70-79)
  // ============================================================
  { id: 70, lvl: 2, partId: "MF1-2RFL-MECHAS", desc: "ASSY,FRAME + HOUSING,ALUMINUM", type: "ASSM",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 3, children: [71, 72, 73, 74, 75, 76, 77, 78, 79],
    supplier: "Catcher Technology", ppap: "Lv2", category: "Mechanical", risk: "Low" },
  { id: 71, lvl: 3, partId: "MF2-8HNT-MIDFRM", desc: "MID FRAME,AL-7000 SERIES", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Catcher Technology", ppap: "Lv2", category: "Mechanical", risk: "Low" },
  { id: 72, lvl: 3, partId: "MB3-5QGV-BCKGLS", desc: "GLASS,BACK COVER,TEMPERED", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Lens Technology", ppap: "Lv2", category: "Mechanical", risk: "Low" },
  { id: 73, lvl: 3, partId: "MB4-7ZWA-SIDEBZ", desc: "BEZEL,SIDE,STAINLESS STEEL", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "BYD Electronics", ppap: "Lv2", category: "Mechanical", risk: "Low" },
  { id: 74, lvl: 3, partId: "SC5-3JOM-SCRWKT", desc: "SCREW KIT,TORX T2,SET OF 12", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Würth Elektronik", ppap: "Lv1", category: "Mechanical", risk: "Low" },
  { id: 75, lvl: 3, partId: "GS6-9PUE-GASKET", desc: "GASKET,WATERPROOF,IP68,SILICONE", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Henkel", ppap: "Lv2", category: "Mechanical", risk: "Med" },
  { id: 76, lvl: 3, partId: "BR7-4LSF-BUTTON", desc: "BUTTONS,SIDE,POWER+VOLUME ASSY", type: "ASSM",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Foxconn", ppap: "Lv1", category: "Mechanical", risk: "Low" },
  { id: 77, lvl: 3, partId: "VB8-6KCD-VIBRAT", desc: "MOTOR,VIBRATION,HAPTIC FEEDBACK", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Nidec", ppap: "Lv2", category: "Mechanical", risk: "Low" },
  { id: 78, lvl: 3, partId: "EM9-2GHB-EMSHLD", desc: "EMI SHIELD,MAINBOARD,STAMPED", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Laird", ppap: "Lv2", category: "Mechanical", risk: "Low" },
  { id: 79, lvl: 3, partId: "GP1-7AYV-GRAPH4", desc: "GRAPHITE SHEET,THERMAL,0.5MM", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Panasonic", ppap: "Lv2", category: "Mechanical", risk: "Low" },

  // ============================================================
  // Level 2 — Antenna / RF branch (id 80-85)
  // ============================================================
  { id: 80, lvl: 2, partId: "AN1-5HMW-ANTAS", desc: "ASSY,ANTENNA + RF FRONT-END", type: "ASSM",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 2, children: [81, 82, 83, 84, 85],
    supplier: "Murata", ppap: "Lv3", category: "Antenna", risk: "Med" },
  { id: 81, lvl: 3, partId: "AN2-8FRT-ANTSUB", desc: "ANTENNA,5G SUB-6 GHz,LDS", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Pulse Electronics", ppap: "Lv3", category: "Antenna", risk: "Med" },
  { id: 82, lvl: 3, partId: "AN3-2VXR-ANTMMW", desc: "ANTENNA,mmWAVE,28GHz/39GHz", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Murata", ppap: "Lv3", category: "Antenna", risk: "High" },
  { id: 83, lvl: 3, partId: "AN4-6KPN-ANTWIF", desc: "ANTENNA,WIFI 7 + BT,DUAL BAND", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Murata", ppap: "Lv2", category: "Antenna", risk: "Low" },
  { id: 84, lvl: 3, partId: "RF5-9QHJ-PAMSUB", desc: "IC,POWER AMPLIFIER,SUB-6 GHz", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Qorvo", ppap: "Lv3", category: "Antenna", risk: "Med" },
  { id: 85, lvl: 3, partId: "RF6-3LWA-FEMMOD", desc: "IC,RF FRONT-END MODULE", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Skyworks", ppap: "Lv3", category: "Antenna", risk: "Med" },

  // ============================================================
  // Level 2 — Sensors branch (id 90-96)
  // ============================================================
  { id: 90, lvl: 2, partId: "SN1-7DXT-SNRAS", desc: "ASSY,SENSORS,ENVIRONMENTAL + MOTION", type: "ASSM",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [91, 92, 93, 94, 95, 96],
    supplier: "Bosch Sensortec", ppap: "Lv2", category: "Sensors", risk: "Low" },
  { id: 91, lvl: 3, partId: "SN2-4BMP-GYRO01", desc: "SENSOR,6-AXIS,GYRO + ACCEL", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Bosch Sensortec", ppap: "Lv2", category: "Sensors", risk: "Low" },
  { id: 92, lvl: 3, partId: "SN3-6HZE-MAGNET", desc: "SENSOR,MAGNETOMETER,3-AXIS", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Asahi Kasei", ppap: "Lv2", category: "Sensors", risk: "Low" },
  { id: 93, lvl: 3, partId: "SN4-1WRL-PROXLT", desc: "SENSOR,PROXIMITY + AMBIENT LIGHT", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "AMS-OSRAM", ppap: "Lv2", category: "Sensors", risk: "Low" },
  { id: 94, lvl: 3, partId: "SN5-8YCK-FNGPRT", desc: "SENSOR,FINGERPRINT,ULTRASONIC,UD", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 2, children: [],
    supplier: "Qualcomm", ppap: "Lv3", category: "Sensors", risk: "Med" },
  { id: 95, lvl: 3, partId: "SN6-3NQO-BAROPR", desc: "SENSOR,BAROMETRIC PRESSURE", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Bosch Sensortec", ppap: "Lv2", category: "Sensors", risk: "Low" },
  { id: 96, lvl: 3, partId: "SN7-5SAH-TOFLDR", desc: "SENSOR,ToF,LASER AUTOFOCUS", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "STMicroelectronics", ppap: "Lv2", category: "Sensors", risk: "Low" },

  // ============================================================
  // Level 2 — Power / Charging branch (id 100-103)
  // ============================================================
  { id: 100, lvl: 2, partId: "PW1-9TJG-PWRAS", desc: "ASSY,POWER + WIRELESS CHARGING", type: "ASSM",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [101, 102, 103],
    supplier: "Cirrus Logic", ppap: "Lv2", category: "Power", risk: "Low" },
  { id: 101, lvl: 3, partId: "PW2-4XCL-WPCHRG", desc: "COIL,WIRELESS CHARGING,15W Qi2", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "TDK", ppap: "Lv2", category: "Power", risk: "Low" },
  { id: 102, lvl: 3, partId: "PW3-7MAY-WPCIC0", desc: "IC,WIRELESS POWER RECEIVER", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Renesas", ppap: "Lv2", category: "Power", risk: "Low" },
  { id: 103, lvl: 3, partId: "PW4-2PWS-RVPSC4", desc: "IC,REVERSE WIRELESS CHARGING", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Renesas", ppap: "Lv1", category: "Power", risk: "Low" },

  // ============================================================
  // Level 2 — Packaging / Accessories branch (id 110-113)
  // ============================================================
  { id: 110, lvl: 2, partId: "PK1-5OAJ-PKGAS", desc: "ASSY,PACKAGING + ACCESSORIES", type: "ASSM",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [111, 112, 113],
    supplier: "Internal", ppap: "Lv1", category: "Packaging", risk: "Low" },
  { id: 111, lvl: 3, partId: "PK2-8KMU-BOXMAS", desc: "BOX,RETAIL,RECYCLED PAPER", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Internal", ppap: "Lv1", category: "Packaging", risk: "Low" },
  { id: 112, lvl: 3, partId: "PK3-2VBO-CBLUSB", desc: "CABLE,USB-C TO USB-C,1M", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Foxconn", ppap: "Lv1", category: "Packaging", risk: "Low" },
  { id: 113, lvl: 3, partId: "PK4-7DTQ-TOOLEJ", desc: "TOOL,SIM EJECTION,STAINLESS", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Internal", ppap: "Lv1", category: "Packaging", risk: "Low" },
];

// 5 BOM metadata (M = Master, sync reference for others)
// BOM lifecycle stages — workflow Kanban
// draft: created but not reviewed | review: under cross-functional review
// approved: signed off, ready to drive downstream work | archived: superseded by newer version
const BOM_LIST = [
  { id: "E", label: "E-BOM", name: "Engineering BOM", version: "v1.8", parts: 80, status: "active",
    syncDelta: 0, missing: 0, owner: "DE", description: "Engineering spec definition",
    lastActivity: { actor: "DE", action: "Spec updated", ts: "Yesterday 11:15" },
    defaults: { structure: "tree", groupBy: "module", overlay: "none" },
    lifecycle: "review", parties: 2, multisource: 88.2, sss: 7.1,
    collabType: "design", collabProgress: 65, collabLabel: "Design Collaboration",
    collabStatus: "Spec Reviewed" },
  { id: "C", label: "C-BOM", name: "Cost BOM", version: "v2.0", parts: 80, status: "active",
    syncDelta: 0, missing: 2, owner: "CM", contributor: "SM",
    description: "Sourcing + Cost (supplier selection & cost breakdown)",
    syncNote: "2 parts missing supplier selection (including new AMOLED Panel)",
    lastActivity: { actor: "CM", action: "Should-cost updated", ts: "Today 09:15" },
    defaults: { structure: "flat", groupBy: "supplier", overlay: "none" },
    lifecycle: "approved", parties: 3, multisource: 96.1, sss: 6.5,
    collabType: "cost", collabProgress: 92, collabLabel: "Source & Cost Collaboration",
    collabStatus: "Final Review" },
  { id: "Q", label: "Q-BOM", name: "Quality BOM", version: "v1.5", parts: 76, status: "active",
    syncDelta: 1, missing: 4, owner: "QM", description: "PPAP validation subject",
    syncNote: "4 new parts not yet registered for PPAP",
    lastActivity: { actor: "QM", action: "PPAP requested", ts: "Today 14:22" },
    defaults: { structure: "flat", groupBy: "ppap", overlay: "none" },
    lifecycle: "draft", parties: 1, multisource: 85.0, sss: 3.2,
    collabType: "quality", collabProgress: 45, collabLabel: "Quality Collaboration",
    collabStatus: "PPAP Lv3 Pending" },
];

// Archived BOMs — historical versions kept for reference (Kanban only)
const ARCHIVED_BOMS = [
  { id: "E-old", label: "E-BOM", code: "BOM260400319", versions: ["Ver 2", "Ver 1"],
    cost: { ver: "Ver 1", delta: "+$1,900", target: "$48,500", overTarget: true } },
  { id: "E-old2", label: "E-BOM", code: "BOM260300257", versions: ["Ver 1"], cost: null },
  { id: "C-old", label: "C-BOM", code: "BOM260300258", versions: ["Ver 2", "Ver 1"],
    cost: { ver: "Ver 1", delta: "+$420", target: "$48,500", overTarget: true } },
  { id: "C-old2", label: "C-BOM", code: "BOM260400320", versions: ["Ver 3", "Ver 2", "Ver 1"],
    cost: { ver: "Ver 2", delta: "-$300", target: "$48,500", overTarget: false } },
  { id: "Q-old", label: "Q-BOM", code: "BOM260300259", versions: ["Ver 1"], cost: null },
];

// BOM Status helpers:
// "active"        - has version, parts, active collaboration
// "not_started"   - BOM exists but owner hasn't engaged yet
// "not_created"   - BOM doesn't exist yet for this phase

// Status simulation per project phase (for non-hero projects)
// Generates BOM list state based on project phase
function getBomListByPhase(phase, isNew) {
  const base = BOM_LIST.map(b => ({ ...b })); // clone
  // Helpers: lookup by id so display order changes don't break phase assignments
  const findIdx = (id) => base.findIndex(b => b.id === id);
  const idxE = findIdx("E"), idxC = findIdx("C"), idxQ = findIdx("Q");
  const NOT_CREATED = { version: "—", parts: 0, status: "not_created", lifecycle: null, missing: 0, syncDelta: 0, lastActivity: null };

  // Newly-created project: NO BOMs exist yet (user must upload or link)
  if (isNew) {
    return base.map(b => ({ ...b, ...NOT_CREATED }));
  }

  if (phase === "Concept" || phase === "Incubation") {
    // New project: only E-BOM initial version exists
    base[idxE] = { ...base[idxE], version: "v0.3", parts: 24, status: "active", lifecycle: "draft",
                lastActivity: { actor: "DE", action: "Initial draft", ts: "Yesterday" } };
    base[idxC] = { ...base[idxC], ...NOT_CREATED };
    base[idxQ] = { ...base[idxQ], ...NOT_CREATED };
  } else if (phase === "Plan") {
    // E-BOM in review, C-BOM in draft (early cost estimation). Q not started
    base[idxE] = { ...base[idxE], version: "v1.0", parts: 52, lifecycle: "review" };
    base[idxC] = { ...base[idxC], version: "v0.8", parts: 50, lifecycle: "draft",
                lastActivity: { actor: "CM", action: "Initial cost rollup", ts: "Yesterday" } };
    base[idxQ] = { ...base[idxQ], ...NOT_CREATED };
  } else if (phase === "Design") {
    // E-BOM approved. C-BOM in review (supplier selection + cost analysis). Q not yet engaged
    base[idxE] = { ...base[idxE], version: "v2.0", parts: 72, lifecycle: "approved" };
    base[idxC] = { ...base[idxC], version: "v1.5", parts: 72, lifecycle: "review" };
    base[idxQ] = { ...base[idxQ], version: "—", parts: 0, status: "not_started", lifecycle: null,
                lastActivity: { actor: "QM", action: "Awaiting owner", ts: "—" } };
  }
  // Develop / Verify / SOP: use base data as-is (all 3 BOMs active with their default lifecycle)
  return base;
}

// AMOLED Panel (id: 3) — scenario hero item
const HERO_ITEM = {
  id: 3, partId: "EI2-I6DA-003WB", partName: "AMOLED Panel 6.7\" FHD+ 120Hz",
  itemCode: "1000001120", desc: "PANEL,AMOLED,6.7IN,FHD+,120HZ",
  category: "Display Module", type: "Buy & Sell", uom: "EA",
  status: { D: "warn", C: "block", Q: "block" },
  spec: {
    "Display Size": "6.7 inch (changed: 6.5\" → 6.7\")",
    "Resolution": "FHD+ (2400×1080)",
    "Refresh Rate": "120Hz (Changed: 90Hz → 120Hz)",
    "Panel Type": "AMOLED",
    "Touch Controller": "I2C",
    "Color Depth": "10-bit",
    "Brightness": "1500 nits peak",
  },
  cost: {
    target: 38.00,
    current: 45.20,
    historical: 38.70,
    market: 42.50,
    shouldCost: 41.80,
    quoted: null,
    delta: 7.20,
  },
  suppliers: [
    { name: "Samsung Display", risk: "Low", capability: 95, performance: 92, recommended: true },
    { name: "BOE Technology", risk: "Med", capability: 88, performance: 85, recommended: true },
    { name: "LG Display", risk: "Low", capability: 90, performance: 89, recommended: true },
  ],
  quality: {
    riskLevel: "Medium",
    ppapLevel: 3,
    progress: 25,
    deliverables: [
      { name: "Design Records", status: "submitted" },
      { name: "Process Flow Diagram", status: "pending" },
      { name: "PFMEA", status: "pending" },
      { name: "Control Plan", status: "not-started" },
      { name: "MSA Studies", status: "not-started" },
      { name: "Capability Studies", status: "not-started" },
    ],
  },
};

// Per-part detail data (all parts except HERO_ITEM)
const ITEM_DETAILS = {
  // === Top-level assemblies ===
  1: {
    id: 1, partId: "SYH-OGNU-A1Y9A", partName: "Smartphone Assembly 6.7\" 5G 256GB",
    itemCode: "1000001100", desc: "ASSY,SMARTPHONE,6.7IN,5G,256GB",
    category: "Final Assembly", type: "Make", uom: "EA",
    status: { D: "ok", C: "ok", Q: "ok" },
    spec: {
      "Form Factor": "Bar / Glass back",
      "Display": "6.7\" AMOLED FHD+ 120Hz",
      "Network": "5G Sub-6 + mmWave",
      "Storage": "256GB UFS 3.1",
      "RAM": "12GB LPDDR5",
      "Battery": "5,000 mAh",
      "Weight": "198g",
      "IP Rating": "IP68",
    },
    cost: {
      target: 480.00, current: 486.96, historical: 472.00, market: 510.00,
      shouldCost: 478.50, quoted: null, delta: 6.96,
    },
    suppliers: [
      { name: "Internal Foxconn India", risk: "Low", capability: 98, performance: 95, recommended: true },
      { name: "Pegatron Vietnam", risk: "Low", capability: 92, performance: 90, recommended: false },
    ],
    quality: {
      riskLevel: "Low", ppapLevel: 3, progress: 80,
      deliverables: [
        { name: "Design Records", status: "submitted" },
        { name: "Process Flow Diagram", status: "submitted" },
        { name: "PFMEA", status: "submitted" },
        { name: "Control Plan", status: "submitted" },
        { name: "MSA Studies", status: "pending" },
        { name: "Capability Studies", status: "pending" },
      ],
    },
  },
  2: {
    id: 2, partId: "XYR-YZK5-WA1A7", partName: "Display Module Assembly 6.7\" AMOLED",
    itemCode: "1000001115", desc: "ASSY,DISPLAY MODULE,6.7IN,AMOLED",
    category: "Display", type: "Buy & Sell", uom: "EA",
    status: { D: "warn", C: "warn", Q: "warn" },
    spec: {
      "Module Type": "Integrated AMOLED with Touch",
      "Size": "6.7 inch",
      "Resolution": "FHD+ (2400×1080)",
      "Refresh Rate": "120Hz",
      "Touch Layer": "On-Cell Capacitive",
      "Cover Glass": "Gorilla Glass Victus 2",
      "Bonding": "OCA Optical Clear Adhesive",
      "Thickness": "1.85mm",
    },
    cost: {
      target: 58.00, current: 64.30, historical: 56.80, market: 62.00,
      shouldCost: 60.50, quoted: null, delta: 6.30,
    },
    suppliers: [
      { name: "Samsung Display Module", risk: "Low", capability: 94, performance: 91, recommended: true },
      { name: "Tianma", risk: "Med", capability: 86, performance: 82, recommended: false },
    ],
    quality: {
      riskLevel: "Medium", ppapLevel: 3, progress: 45,
      deliverables: [
        { name: "Design Records", status: "submitted" },
        { name: "Process Flow Diagram", status: "submitted" },
        { name: "PFMEA", status: "pending" },
        { name: "Control Plan", status: "pending" },
        { name: "MSA Studies", status: "not-started" },
        { name: "Capability Studies", status: "not-started" },
      ],
    },
  },
  4: {
    id: 4, partId: "UEI-Y0ZL-7UU0W", partName: "Polarizer Film Front 6.7\"",
    itemCode: "1000001130", desc: "FILM,POLARIZER,FRONT,6.7IN",
    category: "Display", type: "Buy", uom: "EA",
    status: { D: "ok", C: "ok", Q: "ok" },
    spec: {
      "Film Type": "Circular Polarizer",
      "Size": "6.7 inch",
      "Transmittance": "≥ 42%",
      "Polarization Efficiency": "≥ 99.8%",
      "Thickness": "0.18mm",
      "Anti-Reflection": "AR coating",
      "Operating Temp": "-20°C to +70°C",
    },
    cost: {
      target: 1.80, current: 1.75, historical: 1.85, market: 1.90,
      shouldCost: 1.78, quoted: 1.75, delta: -0.05,
    },
    suppliers: [
      { name: "Nitto Denko", risk: "Low", capability: 96, performance: 95, recommended: true },
      { name: "Sumitomo Chemical", risk: "Low", capability: 93, performance: 92, recommended: false },
    ],
    quality: {
      riskLevel: "Low", ppapLevel: 2, progress: 100,
      deliverables: [
        { name: "Design Records", status: "submitted" },
        { name: "Process Flow Diagram", status: "submitted" },
        { name: "PFMEA", status: "submitted" },
        { name: "Control Plan", status: "submitted" },
      ],
    },
  },
  5: {
    id: 5, partId: "5ML-DR7Q-2CV44", partName: "OCA Optical Clear Adhesive 6.7\"",
    itemCode: "1000001135", desc: "FILM,OCA,OPTICAL CLEAR ADHESIVE,6.7IN",
    category: "Display", type: "Buy", uom: "EA",
    status: { D: "ok", C: "ok", Q: "ok" },
    spec: {
      "Adhesive Type": "Pressure-Sensitive (PSA)",
      "Size": "6.7 inch",
      "Thickness": "0.15mm",
      "Transmittance": "≥ 99%",
      "Haze": "< 0.5%",
      "Refractive Index": "1.47",
      "Yellowing Resistance": "Δb < 0.5 after 1000h UV",
    },
    cost: {
      target: 0.95, current: 0.92, historical: 0.98, market: 1.05,
      shouldCost: 0.94, quoted: 0.92, delta: -0.03,
    },
    suppliers: [
      { name: "3M Optical Systems", risk: "Low", capability: 97, performance: 96, recommended: true },
      { name: "Tesa SE", risk: "Low", capability: 91, performance: 90, recommended: false },
    ],
    quality: {
      riskLevel: "Low", ppapLevel: 2, progress: 100,
      deliverables: [
        { name: "Design Records", status: "submitted" },
        { name: "Process Flow Diagram", status: "submitted" },
        { name: "PFMEA", status: "submitted" },
        { name: "Control Plan", status: "submitted" },
      ],
    },
  },
  6: {
    id: 6, partId: "1W6-4YP3-X6FU2", partName: "Touch Controller IC I2C",
    itemCode: "1000001140", desc: "IC,TOUCH CONTROLLER,I2C",
    category: "Display", type: "Buy", uom: "EA",
    status: { D: "ok", C: "warn", Q: "ok" },
    spec: {
      "IC Type": "Mutual Capacitance Touch Controller",
      "Interface": "I2C 1MHz",
      "Channels": "32 × 18 (TX × RX)",
      "Report Rate": "240 Hz",
      "Package": "WLCSP",
      "Supply Voltage": "1.8V / 3.3V",
      "Power Consumption": "< 8mW active",
    },
    cost: {
      target: 2.50, current: 2.80, historical: 2.45, market: 2.65,
      shouldCost: 2.55, quoted: null, delta: 0.30,
    },
    suppliers: [
      { name: "Synaptics", risk: "Low", capability: 95, performance: 93, recommended: true },
      { name: "Cypress Semiconductor (Infineon)", risk: "Low", capability: 90, performance: 88, recommended: true },
      { name: "Goodix", risk: "Med", capability: 85, performance: 82, recommended: false },
    ],
    quality: {
      riskLevel: "Low", ppapLevel: 2, progress: 85,
      deliverables: [
        { name: "Design Records", status: "submitted" },
        { name: "Process Flow Diagram", status: "submitted" },
        { name: "PFMEA", status: "submitted" },
        { name: "Control Plan", status: "submitted" },
        { name: "MSA Studies", status: "pending" },
      ],
    },
  },
  9: {
    id: 9, partId: "QE3-8DHV-XIRG8", partName: "Fan Module Smartphone Cooling",
    itemCode: "1000001210", desc: "ASSY,FAN MODULE,SMARTPHONE COOLING",
    category: "Mechanical", type: "Make", uom: "EA",
    status: { D: "ok", C: "ok", Q: "ok" },
    spec: {
      "Module Type": "Vapor Chamber + Micro Fan",
      "Dimensions": "28 × 28 × 1.8 mm",
      "Heat Dissipation": "≥ 2.5W",
      "Operating Temp": "-10°C to +60°C",
      "Acoustic Noise": "< 22 dBA @ 1m",
      "Power Consumption": "0.15W typical",
      "MTBF": "30,000 hours",
    },
    cost: {
      target: 4.20, current: 4.10, historical: 4.30, market: 4.50,
      shouldCost: 4.15, quoted: 4.10, delta: -0.10,
    },
    suppliers: [
      { name: "Foxconn Cooling", risk: "Low", capability: 92, performance: 91, recommended: true },
      { name: "Sunon Electric", risk: "Low", capability: 89, performance: 88, recommended: false },
    ],
    quality: {
      riskLevel: "Low", ppapLevel: 2, progress: 95,
      deliverables: [
        { name: "Design Records", status: "submitted" },
        { name: "Process Flow Diagram", status: "submitted" },
        { name: "PFMEA", status: "submitted" },
        { name: "Control Plan", status: "submitted" },
        { name: "MSA Studies", status: "submitted" },
        { name: "Capability Studies", status: "pending" },
      ],
    },
  },
  10: {
    id: 10, partId: "6U8-HKJJ-JRPWM", partName: "Mainboard 5G SM-XXXX",
    itemCode: "1000001220", desc: "ASSY,MAINBOARD,5G,SM-XXXX",
    category: "PCB", type: "Make", uom: "EA",
    status: { D: "ok", C: "ok", Q: "warn" },
    spec: {
      "Board Type": "12-layer HDI PCB",
      "Dimensions": "65 × 32 mm",
      "SoC": "Snapdragon 8 Gen 3 (1+5+2 cores)",
      "5G Modem": "X75 Sub-6 + mmWave",
      "RAM Interface": "LPDDR5 6400 MT/s",
      "Storage Interface": "UFS 3.1",
      "Power Delivery": "PMIC × 3 (PM8550, PMR735BA, PMK8550)",
      "Components": "~1,200 SMT",
    },
    cost: {
      target: 145.00, current: 142.80, historical: 148.00, market: 152.00,
      shouldCost: 143.50, quoted: null, delta: -2.20,
    },
    suppliers: [
      { name: "Samsung Electro-Mechanics", risk: "Low", capability: 96, performance: 94, recommended: true },
      { name: "Foxconn FATP", risk: "Low", capability: 93, performance: 92, recommended: true },
    ],
    quality: {
      riskLevel: "High", ppapLevel: 3, progress: 55,
      deliverables: [
        { name: "Design Records", status: "submitted" },
        { name: "Process Flow Diagram", status: "submitted" },
        { name: "PFMEA", status: "pending" },
        { name: "Control Plan", status: "pending" },
        { name: "MSA Studies", status: "not-started" },
        { name: "Capability Studies", status: "not-started" },
      ],
    },
  },
};

// Activity Stream — scenario flow expressed as messages
const ACTIVITY_FEED = [
  { id: 1, ts: "10:24", persona: "PM", channel: "general",
    message: "D-23 to the Develop Phase Gate. The new AMOLED Panel addition is blocked on both Cost & PPAP. Please review.",
    mentions: ["DE"], itemRef: HERO_ITEM, decision: false },
  { id: 2, ts: "10:31", persona: "DE", channel: "design",
    message: "Confirmed. Reviewing spec change — 6.5\" → 6.7\", 90Hz → 120Hz update planned.",
    mentions: [], itemRef: HERO_ITEM, decision: false },
  { id: 3, ts: "10:35", persona: "AI", channel: "design",
    message: "🤖 Spec change impact analysis: Cost +$8.50 (Market), Lead Time +14d, 3 suppliers affected (Samsung Display, BOE, LG Display can all meet it).",
    mentions: [], aiInsight: true },
  { id: 4, ts: "10:42", persona: "DE", channel: "cost",
    message: "Spec update complete. CM, please verify the Should-cost. Need to confirm it doesn't differ much from the AI recommendation.",
    mentions: ["CM"], itemRef: HERO_ITEM, decision: false },
  { id: 5, ts: "11:08", persona: "CM", channel: "cost",
    message: "Should-cost $41.80, Market $42.50. No major gap. There's a +$7.20 delta vs Historical $38.70 though. Requesting SM to send RFQ.",
    mentions: ["SM"], itemRef: HERO_ITEM, decision: true,
    decisionText: "Proceed with RFQ at Should-cost $41.80" },
  { id: 6, ts: "11:23", persona: "SM", channel: "sourcing",
    message: "All 3 AI-recommended suppliers (Samsung Display, BOE, LG Display) are pre-qualified. Sent RFQ as Closed Bid. Response deadline D-3.",
    mentions: [], itemRef: HERO_ITEM, decision: false },
  { id: 7, ts: "14:15", persona: "AI", channel: "sourcing",
    message: "🤖 RFQ responses received: Samsung Display $40.20 / BOE $38.90 / LG Display $41.00. BOE quote -$2.90 vs Should-cost (best).",
    mentions: [], aiInsight: true },
  { id: 8, ts: "14:22", persona: "QM", channel: "quality",
    message: "Risk Assessment result: Medium Risk → PPAP Level 3 auto-set. Sending PPAP request to BOE. Q-BOM auto-sync confirmed.",
    mentions: [], itemRef: HERO_ITEM, decision: true,
    decisionText: "Supplier: BOE Technology selected, PPAP Lv3 in progress" },

  // ===== Other parts' past collaboration history (always visible, independent of scenarioStep) =====
  // Display Module Assy (id 2)
  { id: 11, ts: "Yesterday 15:42", persona: "DE", channel: "design",
    message: "Display Module: Gorilla Glass Victus 2 confirmed. +20% strength gain. Spec docs updated.",
    mentions: [], itemRef: { id: 2, partId: "XYR-YZK5-WA1A7", partName: "Display Module 6.7\"" },
    decision: true, decisionText: "Cover Glass: Gorilla Glass Victus 2 confirmed" },
  { id: 12, ts: "Yesterday 16:10", persona: "QM", channel: "quality",
    message: "Drafting PFMEA for the Bonding process. We likely need to add a Critical entry for OCA lamination.",
    mentions: ["DE"], itemRef: { id: 2, partId: "XYR-YZK5-WA1A7", partName: "Display Module 6.7\"" }, decision: false },

  // Polarizer Film (id 4)
  { id: 13, ts: "3 days ago", persona: "CM", channel: "cost",
    message: "Polarizer price negotiation: Nitto Denko $1.80 → $1.75. Expected annual savings of $50K.",
    mentions: [], itemRef: { id: 4, partId: "UEI-Y0ZL-7UU0W", partName: "Polarizer Film" },
    decision: true, decisionText: "Unit price $1.75 confirmed (savings $0.05)" },

  // OCA Adhesive (id 5)
  { id: 14, ts: "2 days ago", persona: "SM", channel: "sourcing",
    message: "New 3M OCA grade samples arrived. 99.2% transmittance confirmed — outperforms Tesa SE.",
    mentions: ["QM"], itemRef: { id: 5, partId: "5ML-DR7Q-2CV44", partName: "OCA Adhesive" }, decision: false },
  { id: 15, ts: "Yesterday 09:30", persona: "QM", channel: "quality",
    message: "3M OCA passed UV 1000h test. Will proceed with PPAP Lv2.",
    mentions: [], itemRef: { id: 5, partId: "5ML-DR7Q-2CV44", partName: "OCA Adhesive" }, decision: false },

  // Touch IC (id 6) — active issue
  { id: 16, ts: "Today 09:15", persona: "CM", channel: "cost",
    message: "Touch Controller IC is $0.30 over the $2.50 target. Need to weigh Synaptics negotiation vs switching to Goodix. @DE",
    mentions: ["DE"], itemRef: { id: 6, partId: "1W6-4YP3-X6FU2", partName: "Touch Controller IC" }, decision: false },
  { id: 17, ts: "Today 09:42", persona: "DE", channel: "design",
    message: "Switching to Goodix requires firmware re-validation (2 weeks). Prefer to prioritize Synaptics negotiation.",
    mentions: ["CM"], itemRef: { id: 6, partId: "1W6-4YP3-X6FU2", partName: "Touch Controller IC" }, decision: false },

  // Fan Module (id 9)
  { id: 18, ts: "Yesterday 14:00", persona: "DE", channel: "design",
    message: "Vapor Chamber thickness set to 0.4mm. Thermal sim confirms heat dissipation up to 2.8W.",
    mentions: [], itemRef: { id: 9, partId: "QE3-8DHV-XIRG8", partName: "Fan Module" },
    decision: true, decisionText: "Vapor Chamber 0.4mm confirmed" },

  // Mainboard (id 10) — High Risk
  { id: 19, ts: "Today 08:30", persona: "QM", channel: "quality",
    message: "Mainboard is High Risk. Needs PPAP Lv3 + additional stress tests. PFMEA still incomplete — schedule risk.",
    mentions: ["PM", "DE"], itemRef: { id: 10, partId: "6U8-HKJJ-JRPWM", partName: "Mainboard 5G" }, decision: false },
  { id: 20, ts: "Today 10:55", persona: "AI", channel: "quality",
    message: "🤖 Similar-part analysis: same SoC on Galaxy A series Mainboard saw thermal throttling. Recommend reinforced heat sink.",
    mentions: [], aiInsight: true },

  // Smartphone Assembly (id 1) — final assembly
  { id: 21, ts: "2 days ago", persona: "PM", channel: "general",
    message: "Smartphone Assembly hit the 198g weight target. -12g lighter than competitors.",
    mentions: [], itemRef: { id: 1, partId: "SYH-OGNU-A1Y9A", partName: "Smartphone Assembly" },
    decision: true, decisionText: "Weight 198g confirmed, registered to mass-production spec" },
];

// === ITEM ACTIVITY EVENTS ===
// Per-item system events: spec changes, status transitions, AI analysis, file uploads, version events.
// These complement chat messages (from ACTIVITY_FEED) to form a complete audit log per part.
// type: spec_change | status | ai_insight | file | version | sync | ppap | supplier
const ITEM_ACTIVITY_EVENTS = {
  // Hero: AMOLED Panel (id 3) — full lifecycle of the scenario
  3: [
    { id: "h-a1", ts: "10:18", type: "spec_change", actor: "DE",
      title: "Spec change requested", detail: "Display Size: 6.5\" → 6.7\" · Refresh Rate: 90Hz → 120Hz",
      scenarioGate: 0 },
    { id: "h-a2", ts: "10:24", type: "status", actor: "system",
      title: "Status changed: Blocked", detail: "Cost (C) and Quality (Q) auto-flagged due to spec change",
      severity: "error", scenarioGate: 0 },
    { id: "h-a3", ts: "10:31", type: "ai_insight", actor: "AI",
      title: "AI impact analysis", detail: "Cost +$8.50 · Lead Time +14d · 3 suppliers affected",
      scenarioGate: 2 },
    { id: "h-a4", ts: "10:45", type: "file", actor: "DE",
      title: "Spec document attached", detail: "AMOLED_6.7in_120Hz_spec_v2.pdf (244 KB)",
      scenarioGate: 2 },
    { id: "h-a5", ts: "11:08", type: "version", actor: "DE",
      title: "E-BOM version updated", detail: "v1.7 → v1.8 · Part: AMOLED Panel",
      scenarioGate: 3 },
    { id: "h-a6", ts: "11:23", type: "ai_insight", actor: "AI",
      title: "Should-cost computed", detail: "$41.80 (AI-derived) · Market avg $42.50",
      scenarioGate: 4 },
    { id: "h-a7", ts: "13:42", type: "supplier", actor: "SM",
      title: "RFQ sent", detail: "3 suppliers: Samsung Display, BOE Technology, LG Display",
      scenarioGate: 5 },
    { id: "h-a8", ts: "14:15", type: "ai_insight", actor: "AI",
      title: "RFQ responses analyzed", detail: "Samsung $40.20 · BOE $38.90 · LG $41.00 — BOE best (-$2.90 vs should-cost)",
      scenarioGate: 6 },
    { id: "h-a9", ts: "14:22", type: "supplier", actor: "SM",
      title: "Supplier awarded: BOE Technology", detail: "Quoted $38.90/EA · Lead time 6 weeks",
      scenarioGate: 7 },
    { id: "h-a10", ts: "14:30", type: "ppap", actor: "QM",
      title: "PPAP Lv3 assigned", detail: "Medium risk · 18 deliverables · BOE Technology assigned",
      scenarioGate: 7 },
    { id: "h-a11", ts: "14:35", type: "sync", actor: "system",
      title: "Q-BOM auto-synced", detail: "Part added to APQP Phase 4 (Validation) tracking",
      scenarioGate: 7 },
    { id: "h-a12", ts: "14:38", type: "status", actor: "system",
      title: "Status resolved", detail: "All blockers cleared · Cost ✓ Supplier ✓ PPAP ✓",
      severity: "success", scenarioGate: 7 },
  ],
  // Display Module (id 2) — minor events
  2: [
    { id: "p2-a1", ts: "Yesterday 09:00", type: "version", actor: "DE",
      title: "Spec updated", detail: "Brightness 1300 nits → 1500 nits peak" },
    { id: "p2-a2", ts: "May 14", type: "file", actor: "DE",
      title: "Reference design attached", detail: "Display_Module_BoM_v3.xlsx (102 KB)" },
  ],
  // Polarizer Film (id 4)
  4: [
    { id: "p4-a1", ts: "May 17", type: "supplier", actor: "SM",
      title: "Dual-source approved", detail: "Nitto Denko (primary) + LG Chem (secondary)" },
    { id: "p4-a2", ts: "May 15", type: "ai_insight", actor: "AI",
      title: "Savings opportunity", detail: "Nitto Denko price reduced $1.80 → $1.75 (-2.8%)" },
    { id: "p4-a3", ts: "May 13", type: "status", actor: "QM",
      title: "Conflict flagged", detail: "Single-source risk on critical part", severity: "warning" },
  ],
};

// Get unified activity for an item — combines chat messages + system events
function getItemActivity(itemId, scenarioStep, isHero) {
  // Chat messages from ACTIVITY_FEED (existing)
  const chatMessages = (isHero ? ACTIVITY_FEED.slice(0, scenarioStep + 1) : ACTIVITY_FEED)
    .filter((m) => m.itemRef && m.itemRef.id === itemId)
    .map(m => ({ ...m, source: "chat", _ts: m.ts }));

  // System events from ITEM_ACTIVITY_EVENTS
  const sysEvents = (ITEM_ACTIVITY_EVENTS[itemId] || [])
    .filter(e => !isHero || e.scenarioGate === undefined || e.scenarioGate <= scenarioStep)
    .map(e => ({ ...e, source: "system", _ts: e.ts }));

  // Merge & return (system events first, chat after for visual mixing within same timestamp)
  return [...sysEvents, ...chatMessages];
}

// === INBOX (Cross-project mentions & approval requests) ===
// Inbox data: mentions/requests across projects, filtered by active persona
const INBOX_FEED = [
  // Active project (Hero) — synced with ACTIVITY_FEED, gated by scenarioStep
  { id: "i1", source: "scenario", projectCode: "P-2025-002", projectName: "NPI Smartphone #2 - Galaxy Pro Slim",
    type: "mention", from: "PM", to: "DE",
    ts: "10:24", time: "Just now",
    title: "Please review the new AMOLED Panel addition",
    snippet: "D-23 to Develop Phase Gate. Blocked on both Cost & PPAP...",
    itemRef: { partId: "9F2-AMOL-67120", partName: "AMOLED Panel 6.7\"" },
    channel: "general", read: false, scenarioStep: 0 },
  { id: "i2", source: "scenario", projectCode: "P-2025-002", projectName: "NPI Smartphone #2 - Galaxy Pro Slim",
    type: "mention", from: "DE", to: "CM",
    ts: "10:42", time: "10 min ago",
    title: "Should-cost verification request",
    snippet: "Spec update complete. Please confirm it doesn't differ from the AI recommendation.",
    itemRef: { partId: "9F2-AMOL-67120", partName: "AMOLED Panel 6.7\"" },
    channel: "cost", read: false, scenarioStep: 3 },
  { id: "i3", source: "scenario", projectCode: "P-2025-002", projectName: "NPI Smartphone #2 - Galaxy Pro Slim",
    type: "approval", from: "CM", to: "SM",
    ts: "11:08", time: "30 min ago",
    title: "RFQ send request — AMOLED Panel",
    snippet: "Please run the RFQ at Should-cost $41.80. 3 pre-qualified suppliers recommended.",
    itemRef: { partId: "9F2-AMOL-67120", partName: "AMOLED Panel 6.7\"" },
    channel: "cost", read: false, scenarioStep: 4 },

  // Other projects (cross-project)
  { id: "i4", source: "cross", projectCode: "P-2025-001", projectName: "NPI Smartphone #1 - Galaxy Flagship",
    type: "approval", from: "QM", to: "PM",
    ts: "Yesterday", time: "1 day ago",
    title: "PPAP Lv3 approval request — Camera Module",
    snippet: "BOE Camera Module PPAP Level 3 review complete. Need PM final approval.",
    itemRef: { partId: "3K4-CAM-48MP", partName: "Camera Module 48MP" },
    channel: "quality", read: false, scenarioStep: 0 },
  { id: "i5", source: "cross", projectCode: "P-2025-005", projectName: "NPI Tablet #1 - 11-inch Pro",
    type: "mention", from: "SM", to: "PM",
    ts: "Yesterday", time: "1 day ago",
    title: "Display Panel supplier selection — input requested",
    snippet: "@PM Between the two 11\" Display candidates (LG vs Samsung Display), please weigh in.",
    itemRef: { partId: "8L1-DISP-110", partName: "Display Panel 11\"" },
    channel: "sourcing", read: true, scenarioStep: 0 },
  { id: "i6", source: "cross", projectCode: "P-2025-003", projectName: "Smartwatch Gen 5",
    type: "mention", from: "DE", to: "PM",
    ts: "2 days ago", time: "2 days ago",
    title: "Battery spec change review",
    snippet: "Reviewing Battery capacity change 280mAh → 320mAh. Expected cost impact +$2.10.",
    itemRef: { partId: "5B7-BAT-320", partName: "Battery 320mAh" },
    channel: "design", read: true, scenarioStep: 0 },
  { id: "i7", source: "cross", projectCode: "P-2025-007", projectName: "Earbuds Premium",
    type: "approval", from: "CM", to: "PM",
    ts: "3 days ago", time: "3 days ago",
    title: "Target cost rebalancing approval",
    snippet: "Reviewing Driver Unit Target Cost rebalance $4.20 → $4.80. Approval requested.",
    itemRef: { partId: "2D3-DRV-10MM", partName: "Driver Unit 10mm" },
    channel: "cost", read: true, scenarioStep: 0 },
];


const BLOCKING_ITEMS = [
  { ...HERO_ITEM, blockReason: "PPAP not started, Cost above target (+$7.20)" },
  { id: 10, partId: "6U8-HKJJ-JRPWM", partName: "Mainboard 5G",
    blockReason: "Quality Risk Assessment pending",
    status: { D: "ok", C: "ok", Q: "warn" } },
  { id: 6, partId: "1W6-4YP3-X6FU2", partName: "Touch Controller I2C",
    blockReason: "Cost variance with market price (+12%)",
    status: { D: "ok", C: "warn", Q: "ok" } },
];

// === STATUS BADGE ===
const STATUS_MAP = {
  ok:       { color: "#009955", bg: "#E8F5E9", label: "OK" },
  progress: { color: "#1565E0", bg: "#E3F2FD", label: "In Progress" },
  warn:     { color: "#E06900", bg: "#FFF3E0", label: "Attention" },
  block:    { color: "#D32F2F", bg: "#FFEBEE", label: "Blocked" },
  done:     { color: "#009955", bg: "#E8F5E9", label: "Done" },
};

function StatusDot({ kind = "ok", size = 8 }) {
  const s = STATUS_MAP[kind] || STATUS_MAP.ok;
  return (
    <span className="inline-block rounded-full"
      style={{ width: size, height: size, backgroundColor: s.color }} />
  );
}

function StatusPill({ kind, label }) {
  const s = STATUS_MAP[kind] || STATUS_MAP.ok;
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium"
      style={{ color: s.color, backgroundColor: s.bg }}>
      <StatusDot kind={kind} size={6} />
      {label || s.label}
    </span>
  );
}

function PersonaAvatar({ p, size = 28 }) {
  const persona = PERSONAS[p];
  if (!persona) return null;
  return (
    <div className="rounded-full flex items-center justify-center text-white font-medium text-xs shrink-0"
      style={{ width: size, height: size, backgroundColor: persona.color }}
      title={`${persona.name} · ${persona.role}`}>
      {persona.initial}
    </div>
  );
}

// === GLOBAL NAV ===
function GNB({ activePersona, setActivePersona, view, setView, scenarioStep, totalSteps, currentStep, onPrevStep, onNextStep, onResetScenario, onJumpStep, activeProjectCode, setActiveProjectCode, notifOpen, setNotifOpen }) {
  // GNB menus (per Figma: Design-to-Source is active)
  const gnbMenus = [
    { id: "bom-collab", label: "Design-to-Source", active: true },
    { id: "supplier-mgmt", label: "Supplier Management" },
    { id: "procurement", label: "Procurement" },
    { id: "sourcing", label: "Sourcing" },
    { id: "contract", label: "Contract" },
    { id: "onboarding", label: "Onboarding Evaluation" },
  ];

  return (
    <div className="bg-white border-b relative" style={{ borderColor: C.surfaceTinted }}>
      {/* === Top row (32px content + 8px top padding = 40px) === */}
      <div className="px-6 pt-2 flex items-center gap-6 h-10">
        {/* Hamburger + Logo */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="#101828" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          {/* Logo: SAMSUNG SDS Caidentia */}
          <div className="flex items-center gap-2 select-none">
            <span className="text-[14px] font-bold tracking-tight" style={{ color: "#101828" }}>
              SAMSUNG SDS
            </span>
            <span className="text-[14px] font-medium tracking-tight" style={{ color: C.primary }}>
              Caidentia
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="w-[280px] shrink-0">
          <div className="h-8 px-2 flex items-center gap-1 rounded-md"
            style={{ backgroundColor: C.surfaceTinted }}>
            <input type="text" placeholder="Search"
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-[#8B94A5]"
              style={{ color: C.textPrimary }} />
            <Search className="w-4 h-4 shrink-0" style={{ color: "#8B94A5" }} />
          </div>
        </div>

        {/* Extra Menus */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Time zone button */}
          <button className="h-6 px-2 rounded flex items-center gap-1 hover:bg-gray-50 transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="#4B5565" strokeWidth="1.2"/>
              <path d="M2 8h12M8 2c1.5 1.6 2.5 3.7 2.5 6S9.5 12.4 8 14M8 2C6.5 3.6 5.5 5.7 5.5 8S6.5 12.4 8 14"
                stroke="#4B5565" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span className="text-[12px] font-semibold whitespace-nowrap" style={{ color: "#4B5565" }}>
              Eastern Time (USA)
            </span>
          </button>

          {/* Notification Bell */}
          {(() => {
            const myUnreadCount = INBOX_FEED.filter((m) => {
              if (m.to !== activePersona) return false;
              if (m.source === "scenario" && scenarioStep < m.scenarioStep) return false;
              return !m.read;
            }).length;
            return (
              <div className="relative">
                <button onClick={() => setNotifOpen(!notifOpen)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                  title="Notifications">
                  <Bell className="w-[22px] h-[22px]" style={{ color: "#4B5565" }} strokeWidth={1.5} />
                  {myUnreadCount > 0 && (
                    <span className="absolute top-0 right-0 text-[9px] font-bold text-white rounded-full flex items-center justify-center"
                      style={{ backgroundColor: C.error, minWidth: 14, height: 14, padding: "0 3px" }}>
                      {myUnreadCount}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <NotificationDropdown
                    activePersona={activePersona}
                    setActiveProjectCode={setActiveProjectCode}
                    setView={setView}
                    scenarioStep={scenarioStep}
                    onClose={() => setNotifOpen(false)}
                  />
                )}
              </div>
            );
          })()}

          {/* Inbox button */}
          <button onClick={() => setView("inbox")}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors relative"
            title="Inbox">
            <Inbox className="w-[22px] h-[22px]" style={{ color: "#4B5565" }} strokeWidth={1.5} />
            {(() => {
              const total = INBOX_FEED.filter((m) => {
                if (m.to !== activePersona) return false;
                if (m.source === "scenario" && scenarioStep < m.scenarioStep) return false;
                return !m.read;
              }).length;
              return total > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 text-[9px] font-bold text-white rounded-full flex items-center justify-center"
                  style={{ backgroundColor: C.error, minWidth: 14, height: 14, padding: "0 3px" }}>
                  {total}
                </span>
              ) : null;
            })()}
          </button>

          {/* Persona Avatar (selector) */}
          <div className="relative">
            <select value={activePersona} onChange={(e) => setActivePersona(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full">
              {Object.entries(PERSONAS).map(([k, v]) => (
                <option key={k} value={k}>{v.role}</option>
              ))}
            </select>
            <div className="w-8 h-8 rounded-full flex items-center justify-center pointer-events-none"
              style={{ backgroundColor: "#F2F4F7" }}>
              <PersonaAvatar p={activePersona} size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* === Menus row (40px) === */}
      <div className="px-6 pb-0 flex items-center gap-3 h-10">
        {gnbMenus.map((m) => (
          <button key={m.id}
            onClick={() => {
              // Clicking Design-to-Source navigates to Project List
              if (m.id === "bom-collab") {
                setView("projects");
              }
            }}
            className="h-10 flex items-center px-1 relative transition-opacity hover:opacity-80">
            <div className="flex items-center gap-1 h-8 px-1">
              <span className={`text-[14px] whitespace-nowrap ${m.active ? "font-medium" : "font-normal"}`}
                style={{ color: m.active ? C.textPrimary : "#4B5565" }}>
                {m.label}
              </span>
              {m.badge && (
                <span className="min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center text-[12px] font-medium text-white border"
                  style={{ backgroundColor: "#101828", borderColor: "#F6F8F9" }}>
                  {m.badge}
                </span>
              )}
            </div>
            {/* Active underline */}
            {m.active && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5"
                style={{ backgroundColor: C.primary }} />
            )}
          </button>
        ))}

      </div>
    </div>
  );
}

// === PAGE HEADER (Figma D2S Design - Breadcrumb + Title + Actions) ===

// === COLLABORATORS STACK (for header subtext) ===
// Avatar stack + lead name + click to open dropdown of all members
function CollaboratorsStack({ members, leadName, setActivePersona, activePersona }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = React.useRef(null);
  const total = members.length;
  const visible = members.slice(0, 3); // Show only first 3 avatars

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer">
        {/* Avatar stack */}
        <div className="flex items-center">
          {visible.map((m, idx) => (
            <div key={m.persona} className="rounded-full border-2 border-white"
              style={{
                marginLeft: idx === 0 ? 0 : -8,
                zIndex: visible.length - idx,
              }}>
              <PersonaAvatar p={m.persona} size={24} />
            </div>
          ))}
        </div>
        {/* Lead name + count */}
        <span className="text-[14px] leading-5" style={{ color: C.textPrimary }}>
          {leadName}
        </span>
        {total > 1 && (
          <span className="text-[12px] font-medium px-1.5 py-0.5 rounded"
            style={{ backgroundColor: C.bg, color: C.textSecondary }}>
            +{total - 1}
          </span>
        )}
        <ChevronDown className="w-3 h-3" style={{ color: C.textSecondary }} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full mt-2 left-0 rounded-lg border bg-white shadow-2xl z-50"
          style={{ borderColor: C.border, width: 320 }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: C.border }}>
            <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: C.textSecondary }}>
              Collaborators
            </div>
            <div className="text-sm font-semibold mt-0.5" style={{ color: C.textPrimary }}>
              {total} members
            </div>
          </div>
          <div className="divide-y" style={{ borderColor: C.borderLight }}>
            {members.map((m) => {
              const isMe = activePersona === m.persona;
              return (
                <button key={m.persona}
                  onClick={() => {
                    if (setActivePersona) setActivePersona(m.persona);
                    setOpen(false);
                  }}
                  className="w-full px-4 py-2.5 flex items-center gap-3 text-left transition-colors hover:bg-gray-50"
                  style={{ backgroundColor: isMe ? C.primarySoft : "transparent" }}>
                  <div className="relative shrink-0">
                    <PersonaAvatar p={m.persona} size={32} />
                    {m.active === "now" && (
                      <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-white"
                        style={{ backgroundColor: C.success }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold" style={{ color: C.textPrimary }}>
                        {PERSONAS[m.persona]?.name}
                      </span>
                      {m.owner && (
                        <span className="text-[9px] px-1 py-0.5 rounded font-bold"
                          style={{ backgroundColor: C.warningLight, color: C.warning }}>LEAD</span>
                      )}
                      {isMe && (
                        <span className="text-[9px] px-1 py-0.5 rounded font-bold"
                          style={{ backgroundColor: C.primary, color: "white" }}>ME</span>
                      )}
                    </div>
                    <div className="text-[10px]" style={{ color: C.textSecondary }}>
                      {m.role} · {m.active}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="px-4 py-2 border-t" style={{ borderColor: C.borderLight }}>
            <button className="text-[11px] font-medium hover:underline" style={{ color: C.primary }}>
              + Invite member
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// === BODY SHELL (Figma D2S Body Layout) ===
// Standard wrapper for body area below GNB: Breadcrumb → Title Header → Content Card
// For pages with LNB (Project Detail), pass [LNB + Content] 2-column as children
function BodyShell({ breadcrumbs = [], title, subtext = [], actions = [], avatar, children, contentClassName = "" }) {
  return (
    <div style={{ backgroundColor: C.bg, minHeight: "calc(100vh - 84px)" }}>
      <div className="px-8 py-6">
        {/* Breadcrumbs (outside the card) */}
        {breadcrumbs.length > 0 && (
          <div className="flex items-center gap-2 mb-3">
            {breadcrumbs.slice(0, -1).map((b, i, arr) => (
              <div key={i} className="flex items-center gap-2">
                {b.onClick ? (
                  <button onClick={b.onClick}
                    className="text-[14px] hover:underline transition-colors"
                    style={{ color: C.textSecondary }}>
                    {b.label}
                  </button>
                ) : (
                  <span className="text-[14px]" style={{ color: C.textSecondary }}>{b.label}</span>
                )}
                {i < arr.length - 1 && (
                  <ChevronRight className="w-3 h-3" style={{ color: "#8B94A5" }} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Single Container: Title Header + Content */}
        <div className="bg-white rounded-3xl overflow-hidden">
          {/* Title Row with Avatar + Subtext + Actions */}
          {title && (
            <div className="flex items-start gap-4 px-8 pt-6 pb-5">
              {/* Avatar (left) */}
              {avatar && (
                <div className="shrink-0 mt-0.5">
                  {avatar}
                </div>
              )}
              {/* Title + Subtext */}
              <div className="flex-1 min-w-0 flex flex-col gap-1">
                <div className="flex items-center gap-2 w-full">
                  <h1 className="text-[32px] font-semibold leading-10 truncate"
                    style={{ color: C.textPrimary, letterSpacing: "-0.01em" }}>
                    {title}
                  </h1>
                </div>
                {/* Subtext: meta info with various visual styles */}
                {subtext.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    {subtext.map((item, i) => {
                      // kind: "badge" | "dot" | "collaborators" | "plain" (default)
                      let element;
                      if (item.kind === "badge") {
                        element = (
                          <span className="text-[12px] font-semibold px-2 py-0.5 rounded leading-5"
                            style={{
                              backgroundColor: item.bg || C.bg,
                              color: item.color || C.textPrimary,
                            }}>
                            {item.label}
                          </span>
                        );
                      } else if (item.kind === "dot") {
                        element = (
                          <span className="text-[14px] leading-5 flex items-center gap-1.5"
                            style={{ color: item.color || C.textPrimary }}>
                            <span className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: item.color || C.textSecondary }} />
                            {item.label}
                          </span>
                        );
                      } else if (item.kind === "collaborators") {
                        element = <CollaboratorsStack members={item.members} leadName={item.leadName} setActivePersona={item.setActivePersona} activePersona={item.activePersona} />;
                      } else {
                        element = (
                          <span className="text-[14px] leading-5"
                            style={{ color: item.color || (item.muted ? C.textSecondary : C.textPrimary) }}>
                            {item.label}
                          </span>
                        );
                      }
                      return (
                        <div key={i} className="flex items-center gap-2">
                          {item.onClick ? (
                            <button onClick={item.onClick}
                              className="hover:opacity-70 transition-opacity cursor-pointer"
                              title={item.tooltip || "Click to view details"}>
                              {element}
                            </button>
                          ) : (
                            element
                          )}
                          {i < subtext.length - 1 && (
                            <span className="text-[14px]" style={{ color: C.textDisabled }}>·</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              {/* Actions */}
              {actions.length > 0 && (
                <div className="flex items-center gap-2 shrink-0 pt-2">
                  {actions.map((a, i) => {
                    if (a.variant === "primary") {
                      return (
                        <button key={i} onClick={a.onClick}
                          className="h-9 px-4 rounded-md flex items-center gap-1.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 shadow-sm"
                          style={{ backgroundColor: C.primary }}>
                          {a.icon && <a.icon className="w-4 h-4" />}
                          {a.label}
                        </button>
                      );
                    }
                    if (a.variant === "icon") {
                      return (
                        <button key={i} onClick={a.onClick}
                          title={a.label}
                          className="h-9 w-9 rounded-md flex items-center justify-center border transition-colors hover:bg-gray-50"
                          style={{ borderColor: C.border, color: C.textSecondary }}>
                          {a.icon && <a.icon className="w-4 h-4" />}
                        </button>
                      );
                    }
                    return (
                      <button key={i} onClick={a.onClick}
                        className="h-9 px-3 rounded-md flex items-center gap-1.5 text-[13px] font-medium border transition-colors hover:bg-gray-50"
                        style={{ borderColor: C.border, color: C.textSecondary, backgroundColor: "white" }}>
                        {a.icon && <a.icon className="w-4 h-4" />}
                        {a.label}
                        {a.badge !== undefined && a.badge !== null && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ backgroundColor: C.primary, color: "white", minWidth: 18, textAlign: "center", lineHeight: 1 }}>
                            {a.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Horizontal divider between Header and Content */}
          {title && (
            <div className="h-px w-full" style={{ backgroundColor: C.border }} />
          )}

          {/* Content (children) */}
          <div className={contentClassName}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// === Legacy PageHeader retained for backward compat (unused after BodyShell migration) ===
function PageHeader({ breadcrumbs = [], title, starable = false, onStar, isStarred = false, actions = [], avatar, setView }) {
  return (
    <div className="px-8 pt-4 pb-2">
      {/* Breadcrumbs (separate row, above title) */}
      {breadcrumbs.length > 0 && (
        <div className="flex items-center gap-2 mb-3">
          {breadcrumbs.slice(0, -1).map((b, i, arr) => (
            <div key={i} className="flex items-center gap-2">
              {b.onClick ? (
                <button onClick={b.onClick}
                  className="text-[14px] hover:underline transition-colors"
                  style={{ color: C.textSecondary }}>
                  {b.label}
                </button>
              ) : (
                <span className="text-[14px]" style={{ color: C.textSecondary }}>{b.label}</span>
              )}
              {i < arr.length - 1 && (
                <ChevronRight className="w-3 h-3" style={{ color: "#8B94A5" }} />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Avatar (left) */}
        {avatar && (
          <div className="shrink-0 mt-0.5">
            {avatar}
          </div>
        )}
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          {/* Title row */}
          <div className="flex items-center gap-2 w-full">
            <h1 className="text-2xl font-semibold leading-8 truncate"
              style={{ color: C.textPrimary, letterSpacing: "-0.01em" }}>
              {title}
            </h1>
            {starable && (
              <button onClick={onStar}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg width="20" height="20" viewBox="0 0 16 16" fill={isStarred ? "#FFC84A" : "none"}
                  stroke={isStarred ? "#FFC84A" : "#4B5565"} strokeWidth="1.5">
                  <path d="M8 1.5l1.85 4.16 4.55.4-3.4 3.04 1 4.4L8 11.27 3.99 13.5l1-4.4-3.4-3.04 4.55-.4L8 1.5z"
                    strokeLinejoin="round" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        </div>
        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex items-center gap-2 shrink-0 pt-2">
            {actions.map((a, i) => (
              <button key={i} onClick={a.onClick}
                className={`h-8 px-3 rounded-md flex items-center gap-2 text-[14px] font-medium transition-colors ${
                  a.variant === "primary"
                    ? "hover:opacity-90"
                    : "hover:bg-gray-50"
                }`}
                style={{
                  backgroundColor: a.variant === "primary" ? "transparent" : "transparent",
                  color: a.variant === "primary" ? C.primary : C.textSecondary,
                }}>
                {a.icon && <a.icon className="w-5 h-5" />}
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// === PROJECT LEFT NAVIGATION ===
function ProjectLeftNav({ view, setView, project, scenarioStep, activeBom, setActiveBom,
                         dDay, readiness, blocking: blockingProp,
                         activePersona, setActivePersona,
                         onOpenChat, primaryCta, isCollapsed, setIsCollapsed }) {
  const isHeroProject = project.code === ACTIVE_PROJECT_CODE;
  const isResolved = isHeroProject && scenarioStep >= 8;
  const blocking = blockingProp !== undefined ? blockingProp : (isResolved ? 0 : project.blocking);

  // Auto-expand on entering BOM Collaboration
  const [bomExpanded, setBomExpanded] = useState(view === "bom");
  useEffect(() => {
    if (view === "bom") setBomExpanded(true);
  }, [view]);

  // Avatar
  const { Icon: ProjectIcon, bg: avatarBg, iconColor: avatarIconColor } = getProjectAvatar(project);

  // Phase color
  const phaseColors = {
    "Concept": { bg: C.bg, color: C.textSecondary },
    "Incubation": { bg: C.bg, color: C.textSecondary },
    "Plan": { bg: C.infoLight, color: C.info },
    "Design": { bg: C.infoLight, color: C.info },
    "Develop": { bg: C.primaryLight, color: C.primary },
    "Verify": { bg: C.warningLight, color: C.warning },
    "SOP": { bg: C.successLight, color: C.success },
  };
  const ph = phaseColors[project.phase] || phaseColors["Develop"];

  // D-day color
  const ddayColor = dDay <= 7 ? C.error : dDay <= 30 ? C.warning : C.textSecondary;

  // Priority
  const priorityConfig = {
    high: { bg: C.errorLight, color: C.error, label: "HIGH" },
    med: { bg: C.warningLight, color: C.warning, label: "MED" },
    low: { bg: C.bg, color: C.textSecondary, label: "LOW" },
  }[project.priority];

  // Badge design system:
  // - { value: "●", color: warning } → in progress / needs attention (e.g. active scenario)
  // - null → normal (status shown by header meta)
  // LNB groups: Project / BOM / Quality
  const groups = [
    {
      label: "Project",
      items: [
        { id: "cockpit", icon: LayoutDashboard, label: "Overview", badge: null },
        { id: "info", icon: Info, label: "Project Info", badge: null },
        { id: "collaborators", icon: UsersRound, label: "Collaborators", badge: null },
      ],
    },
    {
      label: "BOM",
      items: [
        { id: "bomlist", icon: Boxes, label: "BOMs", badge: null },
        {
          id: "bom", icon: GitMerge, label: "BOM Collaboration",
          badge: isHeroProject && scenarioStep >= 1 && scenarioStep <= 6 ? { value: "●", color: C.warning, tooltip: "Active collaboration" } : null,
          expandable: true,
        },
      ],
    },
    // Quality group temporarily hidden — APQP gantt has been merged into QM Cockpit Overview.
    // Restore by uncommenting below when APQP standalone view is re-introduced.
    // {
    //   label: "Quality",
    //   items: [
    //     {
    //       id: "apqp", icon: BadgeCheck, label: "APQP", badge: null,
    //     },
    //   ],
    // },
  ];

  // === COLLAPSED MODE: icon-only strip (56px wide) ===
  if (isCollapsed) {
    return (
      <div className="shrink-0 flex flex-col h-full transition-[width] duration-200 ease-out"
        style={{ width: 56 }}>
        {/* Toggle button (top, same position as expanded mode) */}
        <div className="px-2 pt-5 pb-3 flex justify-center">
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            title="Expand sidebar (⌘B)"
            style={{ color: C.textSecondary }}>
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        </div>

        {/* Compact avatar */}
        <div className="px-2 pb-3 flex justify-center">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center border"
            style={{ backgroundColor: avatarBg, borderColor: C.border }}
            title={project.name}>
            <ProjectIcon className="w-4 h-4" strokeWidth={2} style={{ color: avatarIconColor }} />
          </div>
        </div>

        {/* Divider */}
        <div className="mx-2 h-px mb-3" style={{ backgroundColor: C.border }} />

        {/* Icon-only nav */}
        <nav className="px-2 flex flex-col gap-0.5">
          {groups.flatMap((group) => group.items).map((item) => {
            const isActive = view === item.id;
            const Icon = item.icon;
            return (
              <React.Fragment key={item.id}>
                <button
                  onClick={() => setView(item.id)}
                  className="w-10 h-10 rounded-md flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 relative"
                  style={{
                    backgroundColor: isActive ? C.primarySoft : "transparent",
                    color: isActive ? C.primary : C.textSecondary,
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = C.bg; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}
                  title={item.label}>
                  <Icon className="w-4 h-4" />
                  {/* Badge dot (compact) */}
                  {item.badge && (
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: item.badge.color }} />
                  )}
                </button>
                {/* BOM Collaboration sub-icons (E/S/Q/C) — shown only when BOM Coll is active */}
                {item.id === "bom" && view === "bom" && (
                  <div className="flex flex-col gap-0.5 py-0.5 ml-1 pl-1 border-l"
                    style={{ borderColor: C.border }}>
                    {getBomListByPhase(project.phase, project.isNew).map((bom) => {
                      const isBomActive = activeBom === bom.id;
                      const isDisabled = bom.status === "not_created";
                      const hasIssue = bom.syncDelta > 0 || bom.missing > 0;
                      return (
                        <button key={bom.id}
                          onClick={() => { if (!isDisabled && setActiveBom) setActiveBom(bom.id); }}
                          disabled={isDisabled}
                          className="w-8 h-7 rounded flex items-center justify-center text-[10px] font-bold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed relative"
                          style={{
                            backgroundColor: isBomActive ? C.primary : "transparent",
                            color: isBomActive ? "white" : C.textSecondary,
                            opacity: isDisabled ? 0.4 : 1,
                          }}
                          onMouseEnter={(e) => { if (!isBomActive && !isDisabled) e.currentTarget.style.backgroundColor = C.bg; }}
                          onMouseLeave={(e) => { if (!isBomActive) e.currentTarget.style.backgroundColor = "transparent"; }}
                          title={`${bom.name}${hasIssue ? ` · ${bom.missing} missing` : ""}`}>
                          {bom.id}
                          {hasIssue && !isBomActive && (
                            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: C.warning }} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
    );
  }

  // === EXPANDED MODE: full LNB ===
  return (
    <div className="shrink-0 flex flex-col h-full overflow-y-auto transition-[width] duration-200 ease-out"
      style={{ width: 280 }}>
      <div className="flex flex-col gap-4 pb-4">
      {/* === HEADER === */}
      <div className="px-5 pt-4 flex flex-col gap-3 relative">
        {/* Collapse toggle — absolute top-right within header */}
        <button
          onClick={() => setIsCollapsed && setIsCollapsed(true)}
          className="absolute top-2 right-3 w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
          title="Collapse sidebar (⌘B)"
          style={{ color: C.textSecondary }}>
          <PanelLeftClose className="w-4 h-4" />
        </button>

        {/* Avatar */}
        <div className="w-12 h-12 rounded-xl flex items-center justify-center border"
          style={{ backgroundColor: avatarBg, borderColor: C.border }}>
          <ProjectIcon className="w-6 h-6" strokeWidth={2} style={{ color: avatarIconColor }} />
        </div>

        {/* Badges row (Priority, D-day, Phase) — Dieter Rams: only urgent gets fill */}
        {/* D-day ≤ 7 days: filled red (urgent action needed); otherwise all outlined */}
        <div className="flex flex-wrap gap-1">
          {/* Priority — outlined (info, not urgent action). Label only (HIGH/MED/LOW) — "Priority" word redundant */}
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full leading-4 border"
            style={{
              backgroundColor: "white",
              color: priorityConfig.color,
              borderColor: priorityConfig.color,
            }}
            title={`${priorityConfig.label} Priority`}>
            {priorityConfig.label}
          </span>
          {/* D-day — filled only when urgent (≤ 7 days), otherwise outlined */}
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full leading-4 border"
            style={{
              backgroundColor: dDay <= 7 ? ddayColor : "white",
              color: dDay <= 7 ? "white" : ddayColor,
              borderColor: ddayColor,
            }}>
            D-{dDay}
          </span>
          {/* Phase — outlined (status indicator, not urgent) */}
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full leading-4 border"
            style={{
              backgroundColor: "white",
              color: ph.color,
              borderColor: ph.color,
            }}>
            {project.phase}
          </span>
        </div>

        {/* Title + Code */}
        <div className="flex flex-col gap-0.5">
          <div className="text-[20px] font-bold leading-7 tracking-tight" style={{ color: C.textPrimary }}>
            {project.name}
          </div>
          <div className="text-[12px] font-mono" style={{ color: C.textSecondary }}>
            {project.code}
          </div>
        </div>

        {/* Quick actions — separated from identity group with extra spacing */}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => onOpenChat && onOpenChat(null)}
            title="Chat"
            className="relative w-9 h-9 rounded-full flex items-center justify-center border transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{ borderColor: C.border, color: C.textSecondary, backgroundColor: "white" }}>
            <MessageSquare className="w-4 h-4" />
            {/* Unread message badge — Hero project demo: 3 unread mentions awaiting PM response.
                Auto-hides when scenario is resolved (PM has processed all activity). */}
            {(() => {
              const isHero = project.code === "BPM260400354";
              const isResolved = scenarioStep >= 8;
              if (!isHero || isResolved) return null;
              const unreadCount = 3;
              return (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center text-[9px] font-bold text-white border-2 border-white"
                  style={{ backgroundColor: C.error }}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              );
            })()}
          </button>
          <CollaboratorsCircleButton
            members={getCollaboratorsForProject(project)}
            activePersona={activePersona}
            setActivePersona={setActivePersona} />
          {/* Primary CTA — Phase-aware; expanded with label for discoverability */}
          {primaryCta && (() => {
            // Short label for compact display
            const shortLabel = {
              "Invite Team": "Invite Team",
              "Upload E-BOM": "Upload BOM",
              "Define Exit Criteria": "Exit Criteria",
              "Run Phase 1 Gate": "Phase Gate",
              "Run Cost Review": "Cost Review",
              "Request Gate Review": "Gate Review",
              "Approve PPAP": "Approve PPAP",
              "Mark Released": "Release",
            }[primaryCta.label] || primaryCta.label;
            return (
              <button
                onClick={primaryCta.onClick}
                title={primaryCta.label}
                className="h-9 px-3 rounded-full flex items-center gap-1.5 transition-opacity hover:opacity-90 shadow-sm ml-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                style={{ backgroundColor: C.primary, color: "white" }}>
                {primaryCta.icon && <primaryCta.icon className="w-4 h-4 shrink-0" />}
                <span className="text-[11px] font-semibold whitespace-nowrap">{shortLabel}</span>
              </button>
            );
          })()}
        </div>
      </div>

      {/* Divider between Header and Menu */}
      <div className="mx-5 h-px" style={{ backgroundColor: C.border }} />

      {/* === LNB MENU (Flat - no group headers) === */}
      <nav className="px-3 pb-4 flex flex-col">
        {groups.map((group) => (
          <div key={group.label} className="flex flex-col">
            {/* Group Items */}
            {group.items.map((item) => (
              <div key={item.id}>
                <NavItem
                  item={item}
                  view={view}
                  setView={setView}
                  isExpanded={item.expandable ? bomExpanded : undefined}
                  onClick={item.expandable
                    ? () => { setView("bom"); setBomExpanded(true); }
                    : undefined}
                />
                {/* BOM Collaboration sub-items */}
                {item.id === "bom" && bomExpanded && (
                  <div className="flex flex-col mt-0.5 mb-0.5 ml-2 pl-3 border-l"
                    style={{ borderColor: C.border }}>
                    {getBomListByPhase(project.phase, project.isNew).map((bom) => {
                      const isBomActive = view === "bom" && activeBom === bom.id;
                      const hasIssue = bom.syncDelta > 0 || bom.missing > 0;
                      const isNotCreated = bom.status === "not_created";
                      const isNotStarted = bom.status === "not_started";
                      const isDisabled = isNotCreated;
                      return (
                        <button key={bom.id}
                          onClick={() => {
                            if (isDisabled) return;
                            setView("bom");
                            if (setActiveBom) setActiveBom(bom.id);
                          }}
                          disabled={isDisabled}
                          className="flex items-center gap-2 py-1.5 px-2 rounded-md text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed"
                          style={{
                            backgroundColor: isBomActive ? C.primarySoft : "transparent",
                            color: isBomActive ? C.primary : C.textPrimary,
                            opacity: isDisabled ? 0.5 : 1,
                          }}
                          onMouseEnter={(e) => { if (!isBomActive && !isDisabled) e.currentTarget.style.backgroundColor = C.bg; }}
                          onMouseLeave={(e) => { if (!isBomActive) e.currentTarget.style.backgroundColor = "transparent"; }}
                          title={isNotCreated ? `${bom.name} not yet created` : isNotStarted ? `${bom.name} promoted, awaiting owner` : (bom.syncNote || `${bom.name} · sync OK`)}>
                          <span className={`text-[12px] flex-1 min-w-0 truncate ${isBomActive ? "font-semibold" : "font-normal"}`}
                            style={{ color: isBomActive ? C.primary : (isDisabled ? C.textDisabled : C.textPrimary) }}>
                            {bom.label}
                          </span>
                          {isNotCreated ? (
                            <span className="text-[9px] shrink-0 italic" style={{ color: C.textDisabled }}>
                              not created
                            </span>
                          ) : isNotStarted ? (
                            <span className="text-[9px] shrink-0 italic" style={{ color: C.warning }}>
                              awaiting
                            </span>
                          ) : (
                            <>
                              <span className="text-[9px] font-mono shrink-0"
                                style={{ color: isBomActive ? C.primary : C.textDisabled, opacity: isBomActive ? 0.8 : 1 }}>
                                {bom.version}
                              </span>
                              <span className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ backgroundColor: hasIssue ? C.warning : C.success }} />
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </nav>
      </div>
    </div>
  );
}

// Collaborators circle button (used in LNB header — avatar stack with dropdown)
function CollaboratorsCircleButton({ members, activePersona, setActivePersona }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = React.useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setOpen(!open)}
        title="Collaborators"
        className="w-9 h-9 rounded-full flex items-center justify-center border transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
        style={{ borderColor: C.border, color: C.textSecondary, backgroundColor: "white" }}>
        <Users className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 rounded-lg border bg-white shadow-2xl z-50"
          style={{ borderColor: C.border, width: 280 }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: C.border }}>
            <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: C.textSecondary }}>
              Collaborators
            </div>
            <div className="text-sm font-semibold mt-0.5" style={{ color: C.textPrimary }}>
              {members.length} members
            </div>
          </div>
          <div className="divide-y" style={{ borderColor: C.borderLight }}>
            {members.map((m) => {
              const isMe = activePersona === m.persona;
              return (
                <div key={m.persona}
                  className="px-4 py-2.5 flex items-center gap-3 transition-colors hover:bg-gray-50"
                  style={{ backgroundColor: isMe ? C.primarySoft : "transparent" }}>
                  <button
                    onClick={() => { setActivePersona && setActivePersona(m.persona); setOpen(false); }}
                    className="flex-1 flex items-center gap-3 text-left min-w-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded">
                    <div className="relative shrink-0">
                      <PersonaAvatar p={m.persona} size={32} />
                      {m.active === "now" && (
                        <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full border-2 border-white"
                          style={{ backgroundColor: C.success }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold" style={{ color: C.textPrimary }}>
                          {PERSONAS[m.persona]?.name}
                        </span>
                        {m.owner && (
                          <span className="text-[9px] px-1 py-0.5 rounded font-bold"
                            style={{ backgroundColor: C.warningLight, color: C.warning }}>LEAD</span>
                        )}
                        {isMe && (
                          <span className="text-[9px] px-1 py-0.5 rounded font-bold"
                            style={{ backgroundColor: C.primary, color: "white" }}>ME</span>
                        )}
                      </div>
                      <div className="text-[10px]" style={{ color: C.textSecondary }}>
                        {m.role} · {m.active}
                      </div>
                    </div>
                  </button>
                  {/* Message icon — hidden for self (no point messaging yourself) */}
                  {!isMe && (
                    <button
                      onClick={(e) => { e.stopPropagation(); /* TODO: open chat with this persona */ }}
                      className="w-7 h-7 rounded-full flex items-center justify-center transition-all shrink-0 focus:outline-none focus-visible:ring-2 hover:scale-110"
                      style={{ backgroundColor: C.bg, color: C.primary }}
                      title={`Message ${PERSONAS[m.persona]?.name || m.persona}`}>
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          {/* Invite member CTA */}
          <div className="px-3 py-2 border-t" style={{ borderColor: C.borderLight }}>
            <button
              onClick={() => { /* TODO: invite modal */ setOpen(false); }}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-md transition-colors hover:bg-gray-50 text-left">
              <div className="w-8 h-8 rounded-full border-2 border-dashed flex items-center justify-center shrink-0"
                style={{ borderColor: C.primary }}>
                <Plus className="w-4 h-4" style={{ color: C.primary }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold" style={{ color: C.primary }}>
                  Invite new member
                </div>
                <div className="text-[10px]" style={{ color: C.textSecondary }}>
                  Add a teammate to this project
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// === PRIMARY ACTION MODAL (Phase-aware CTA flow) ===
// Triggered from LNB header's filled purple button.
// Content adapts to the project's current phase.
function PrimaryActionModal({ project, scenarioStep, onClose, onConfirm }) {
  const isHeroProject = project.code === ACTIVE_PROJECT_CODE;
  const isResolved = isHeroProject && scenarioStep >= 8;

  // Phase-specific configuration
  const phaseConfig = {
    "Concept": {
      title: "Define Exit Criteria",
      icon: Target,
      iconBg: C.bg,
      iconColor: C.textSecondary,
      headline: "Set criteria to exit Concept phase",
      description: "Define measurable goals required to move to the Plan phase. These criteria will gate phase progression.",
      sections: [
        { label: "Required Criteria", items: [
          { label: "Product concept document signed off", done: false },
          { label: "Market opportunity sized", done: false },
          { label: "Initial cost target established", done: false },
          { label: "Technical feasibility study complete", done: false },
        ]},
      ],
      cta: "Save Criteria",
    },
    "Incubation": {
      title: "Define Exit Criteria",
      icon: Target,
      iconBg: C.bg,
      iconColor: C.textSecondary,
      headline: "Set criteria to exit Incubation phase",
      description: "Establish what proof points are needed before promoting this project to the Plan phase.",
      sections: [
        { label: "Required Criteria", items: [
          { label: "Stakeholders identified", done: true },
          { label: "Initial team assembled", done: false },
          { label: "Phase Gate criteria defined", done: false },
          { label: "Risk assessment performed", done: false },
        ]},
      ],
      cta: "Save Criteria",
    },
    "Plan": {
      title: "Run Phase 1 Gate Review",
      icon: CheckCircle,
      iconBg: C.infoLight,
      iconColor: C.info,
      headline: "Plan → Design Gate Review",
      description: "Validate planning artifacts before moving to detailed design. Approval moves the project to Design phase.",
      sections: [
        { label: "Plan Phase Readiness", items: [
          { label: "Project plan approved", done: true },
          { label: "Resource allocation confirmed", done: true },
          { label: "Initial BOM structure defined", done: false },
          { label: "Cost estimate within target ±15%", done: false },
        ]},
      ],
      cta: "Submit for Review",
    },
    "Design": {
      title: "Run Cost Review",
      icon: DollarSign,
      iconBg: C.warningLight,
      iconColor: C.warning,
      headline: "Mid-phase Cost Review",
      description: "Review the current cost roll-up against target. Identify cost drivers and assign action items.",
      sections: [
        { label: "Cost Summary", kvPairs: [
          { label: "Target Cost (TMC)", value: "$486.96" },
          { label: "Current Roll-up", value: "$502.30", warning: true },
          { label: "Gap", value: "+$15.34 (3.2%)", warning: true },
          { label: "Top Cost Driver", value: "AMOLED Panel" },
        ]},
        { label: "Actions Required", items: [
          { label: "Negotiate AMOLED Panel price", done: false },
          { label: "Review Mainboard alternatives", done: false },
          { label: "Approve cost variance plan", done: false },
        ]},
      ],
      cta: "Notify Cost Team",
    },
    "Develop": {
      title: "Request Gate Review",
      icon: ShieldCheck,
      iconBg: isResolved ? C.successLight : C.primaryLight,
      iconColor: isResolved ? C.success : C.primary,
      headline: isResolved ? "Develop → Verify Gate" : "Request Develop Phase Gate Review",
      description: isResolved
        ? "All gate criteria met. Submit this project for phase gate approval."
        : "Verify all gate criteria are met before requesting review. Outstanding items will be flagged for the gate committee.",
      sections: [
        { label: "Gate Readiness Checklist", items: [
          { label: "Design Verification complete", done: isResolved || true },
          { label: "All Critical parts cost-validated", done: isResolved },
          { label: "All Critical parts PPAP requested", done: isResolved },
          { label: "Supplier selection finalized", done: isResolved || true },
          { label: "DFMEA / PFMEA complete", done: false },
          { label: "Phase Gate documents prepared", done: isResolved },
        ]},
        { label: "Reviewers", reviewers: ["PM", "DE", "CM", "SM", "QM"] },
      ],
      cta: isResolved ? "Submit for Approval" : "Send Review Request",
    },
    "Verify": {
      title: "Approve PPAP",
      icon: FlaskConical,
      iconBg: C.primarySoft,
      iconColor: C.primary,
      headline: "Outstanding PPAP Approvals",
      description: "Review and approve PPAP submissions from suppliers. Each approval clears the supplier for mass production.",
      sections: [
        { label: "Pending PPAP Submissions", ppap: [
          { part: "AMOLED Panel", supplier: "BOE Technology", level: "Lv3", status: "In Review" },
          { part: "Camera Module", supplier: "Sony", level: "Lv3", status: "Submitted" },
          { part: "Mainboard 5G", supplier: "Foxconn", level: "Lv2", status: "Submitted" },
        ]},
      ],
      cta: "Approve All",
    },
    "SOP": {
      title: "Mark Released",
      icon: CheckCircle,
      iconBg: C.successLight,
      iconColor: C.success,
      headline: "Ready for Mass Production",
      description: "All phases complete. Mark this project as released for SOP (Start of Production).",
      sections: [
        { label: "Release Checklist", items: [
          { label: "All PPAPs approved", done: true },
          { label: "Final BOM locked", done: true },
          { label: "Production line setup verified", done: true },
          { label: "Quality plan in place", done: true },
        ]},
      ],
      cta: "Confirm Release",
    },
  };

  // For new projects: surface onboarding-focused modal instead of phase-default
  const newProjectConfigs = {
    "Invite Team": {
      title: "Invite Team",
      icon: Users,
      iconBg: C.primarySoft,
      iconColor: C.primary,
      headline: "Bring your team on board",
      description: "Add team members so you can begin collaborating. Each role brings expertise to a specific BOM.",
      sections: [
        { label: "Recommended Roles", items: [
          { label: "Design Engineer (DE) — owns E-BOM", done: false },
          { label: "Cost Manager (CM) — owns C-BOM (Source & Cost)", done: false },
          { label: "Sourcing Manager (SM) — contributes to C-BOM", done: false },
          { label: "Quality Manager (QM) — owns Q-BOM", done: false },
        ]},
      ],
      cta: "Send Invitations",
    },
    "Upload E-BOM": {
      title: "Upload E-BOM",
      icon: Upload,
      iconBg: C.primarySoft,
      iconColor: C.primary,
      headline: "Add the first Engineering BOM",
      description: "The E-BOM defines the product structure and is the starting point for all collaboration. Upload from CAD/PLM or link to an existing BOM.",
      sections: [
        { label: "Supported Sources", items: [
          { label: "CAD exports (Solidworks, Creo)", done: false },
          { label: "PLM systems (Teamcenter, Windchill)", done: false },
          { label: "Excel/CSV files", done: false },
          { label: "Link from another Caidentia project", done: false },
        ]},
      ],
      cta: "Upload or Link",
    },
  };

  // Determine which config to use
  let config;
  if (project.isNew && newProjectConfigs[/* primary CTA label */ ""]) {
    // (kept for future, but we resolve below)
  }
  // Detect new-project CTA by checking project state — same logic as Project Detail
  if (project.isNew) {
    const collaboratorsCount = getCollaboratorsForProject(project).length;
    const bomsForNew = getBomListByPhase(project.phase, project.isNew);
    const hasAnyBom = bomsForNew.some(b => b.status === "active");
    if (collaboratorsCount <= 1) {
      config = newProjectConfigs["Invite Team"];
    } else if (!hasAnyBom) {
      config = newProjectConfigs["Upload E-BOM"];
    } else {
      config = phaseConfig[project.phase] || phaseConfig["Develop"];
    }
  } else {
    config = phaseConfig[project.phase] || phaseConfig["Develop"];
  }
  const IconComp = config.icon;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 transition-opacity"
        style={{ backgroundColor: "rgba(16, 24, 40, 0.4)" }}
        onClick={onClose} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 z-50 bg-white rounded-2xl shadow-2xl flex flex-col"
        style={{
          transform: "translate(-50%, -50%)",
          width: 560,
          maxHeight: "85vh",
        }}>
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-start gap-4 border-b" style={{ borderColor: C.border }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: config.iconBg }}>
            <IconComp className="w-6 h-6" style={{ color: config.iconColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-wide mb-1"
              style={{ color: C.textSecondary }}>
              {project.phase} Phase Action
            </div>
            <div className="text-lg font-semibold mb-1" style={{ color: C.textPrimary }}>
              {config.headline}
            </div>
            <div className="text-xs" style={{ color: C.textSecondary }}>
              {config.description}
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0">
            <X className="w-4 h-4" style={{ color: C.textSecondary }} />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {config.sections.map((section, idx) => (
            <div key={idx}>
              <div className="text-[10px] font-bold uppercase tracking-wide mb-2"
                style={{ color: C.textSecondary }}>
                {section.label}
              </div>

              {/* Checklist items */}
              {section.items && (
                <div className="space-y-2">
                  {section.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
                      style={{ backgroundColor: item.done ? C.successLight : C.bg }}>
                      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: item.done ? C.success : "white",
                          border: item.done ? "none" : `1.5px solid ${C.border}`,
                        }}>
                        {item.done && <CheckCircle className="w-3 h-3" style={{ color: "white" }} />}
                      </div>
                      <span className="text-xs flex-1"
                        style={{ color: item.done ? C.success : C.textPrimary }}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Key-value pairs */}
              {section.kvPairs && (
                <div className="rounded-lg border divide-y" style={{ borderColor: C.border }}>
                  {section.kvPairs.map((kv, i) => (
                    <div key={i} className="px-3 py-2.5 flex items-center justify-between text-xs">
                      <span style={{ color: C.textSecondary }}>{kv.label}</span>
                      <span className="font-semibold"
                        style={{ color: kv.warning ? C.warning : C.textPrimary }}>
                        {kv.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Reviewers list */}
              {section.reviewers && (
                <div className="flex items-center gap-2 flex-wrap">
                  {section.reviewers.map((p) => (
                    <div key={p} className="flex items-center gap-1.5 px-2 py-1 rounded-full border"
                      style={{ borderColor: C.border, backgroundColor: C.bg }}>
                      <PersonaAvatar p={p} size={20} />
                      <span className="text-[11px] font-medium" style={{ color: C.textPrimary }}>
                        {PERSONAS[p]?.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* PPAP submissions */}
              {section.ppap && (
                <div className="space-y-2">
                  {section.ppap.map((p, i) => (
                    <div key={i} className="px-3 py-2.5 rounded-lg border flex items-center gap-3"
                      style={{ borderColor: C.border }}>
                      <FlaskConical className="w-4 h-4 shrink-0" style={{ color: C.primary }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold" style={{ color: C.textPrimary }}>
                          {p.part}
                        </div>
                        <div className="text-[10px]" style={{ color: C.textSecondary }}>
                          {p.supplier} · PPAP {p.level}
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: p.status === "In Review" ? C.warningLight : C.infoLight,
                          color: p.status === "In Review" ? C.warning : C.info,
                        }}>
                        {p.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex items-center justify-between gap-3"
          style={{ borderColor: C.border }}>
          <div className="text-[11px]" style={{ color: C.textDisabled }}>
            {project.code} · {project.phase} Phase
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose}
              className="px-4 py-2 rounded-md text-xs font-medium border hover:bg-gray-50 transition-colors"
              style={{ borderColor: C.border, color: C.textSecondary }}>
              Cancel
            </button>
            <button onClick={onConfirm}
              className="px-4 py-2 rounded-md text-xs font-semibold text-white hover:opacity-90 transition-opacity inline-flex items-center gap-1.5"
              style={{ backgroundColor: C.primary }}>
              <IconComp className="w-3.5 h-3.5" />
              {config.cta}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// NavItem subcomponent for LNB (Figma [ListItem] pattern)
function NavItem({ item, view, setView, isExpanded, onClick }) {
  const isActive = view === item.id;
  const handleClick = onClick || (() => setView(item.id));
  return (
    <button onClick={handleClick}
      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
      style={{
        backgroundColor: isActive ? C.primarySoft : "transparent",
        color: isActive ? C.primary : C.textPrimary,
      }}
      onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = C.bg; }}
      onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}>
      <div className="flex-1 min-w-0 flex items-center gap-1">
        <span className={`text-[14px] leading-5 ${isActive ? "font-semibold" : "font-normal"}`}
          style={{ color: isActive ? C.primary : C.textPrimary }}>
          {item.label}
        </span>
        {isExpanded !== undefined && (
          <ChevronDown className="w-3 h-3 transition-transform shrink-0"
            style={{
              color: isActive ? C.primary : C.textDisabled,
              transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
            }} />
        )}
      </div>
      {item.badge && (
        item.badge.value === "●" ? (
          <span title={item.badge.tooltip || ""}
            className="w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: item.badge.color }} />
        ) : (
          <span title={item.badge.tooltip || ""}
            className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0"
            style={{ backgroundColor: item.badge.color, color: "white", minWidth: 18, textAlign: "center" }}>
            {item.badge.value}
          </span>
        )
      )}
    </button>
  );
}

// === SCREEN 0. PROJECT LIST ===
// === SCREEN: INBOX (Cross-project mention & approval inbox) ===
function InboxScreen({ activePersona, setActiveProjectCode, setView, scenarioStep }) {
  const [filter, setFilter] = useState("all"); // all / mention / approval / unread
  const [readMap, setReadMap] = useState({});

  // Filter mentions/requests received by active persona
  // Hero project mentions reveal gradually with scenario step
  const myInbox = INBOX_FEED.filter((m) => {
    if (m.to !== activePersona) return false;
    if (m.source === "scenario" && scenarioStep < m.scenarioStep) return false;
    return true;
  }).map((m) => ({ ...m, read: readMap[m.id] !== undefined ? readMap[m.id] : m.read }));

  const filtered = myInbox.filter((m) => {
    if (filter === "all") return true;
    if (filter === "unread") return !m.read;
    return m.type === filter;
  });

  const unreadCount = myInbox.filter((m) => !m.read).length;
  const mentionCount = myInbox.filter((m) => m.type === "mention").length;
  const approvalCount = myInbox.filter((m) => m.type === "approval").length;

  const onItemClick = (m) => {
    setReadMap((prev) => ({ ...prev, [m.id]: true }));
    if (m.projectCode) {
      setActiveProjectCode(m.projectCode);
      setView("bom"); // Navigate to BOM Collaboration (Activity Stream is shown alongside)
    }
  };

  const markAllRead = () => {
    const next = {};
    myInbox.forEach((m) => { next[m.id] = true; });
    setReadMap(next);
  };

  return (
    <div className="p-6" style={{ backgroundColor: C.bg, minHeight: "calc(100vh - 84px)" }}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="shrink-0 mt-0.5 w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: C.warning }}>
            <Inbox className="w-7 h-7 text-white" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[14px] mb-1" style={{ color: C.textSecondary }}>
              <span>Inbox</span>
            </div>
            <h1 className="text-[32px] font-semibold leading-10 truncate"
              style={{ color: C.textPrimary, letterSpacing: "-0.01em" }}>
              Mentions & Approval Requests
            </h1>
            <div className="text-sm mt-1 flex items-center gap-1.5 flex-wrap" style={{ color: C.textSecondary }}>
              <span>Across all projects, items addressed to</span>
              <PersonaAvatar p={activePersona} size={16} />
              <span className="font-semibold" style={{ color: C.primary }}>
                {PERSONAS[activePersona].role}
              </span>
              <span>are collected here.</span>
            </div>
          </div>
        </div>
        <button onClick={markAllRead}
          className="px-3 py-2 rounded-md text-sm font-medium border shrink-0 mt-2 transition-colors hover:bg-gray-50"
          style={{ borderColor: C.border, color: C.textSecondary, backgroundColor: "white" }}>
          Mark all read
        </button>
      </div>

      {/* KPI / Filter strip */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { id: "all", label: "All", count: myInbox.length, color: C.textPrimary, icon: Inbox },
          { id: "unread", label: "Unread", count: unreadCount, color: C.error, icon: Bell },
          { id: "mention", label: "@Mentions", count: mentionCount, color: C.info, icon: MessageSquare },
          { id: "approval", label: "Approvals", count: approvalCount, color: C.warning, icon: ShieldCheck },
        ].map((f) => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className="p-4 rounded-lg border bg-white text-left transition-all hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{
              borderColor: filter === f.id ? f.color : C.border,
              borderWidth: filter === f.id ? 2 : 1,
              boxShadow: filter === f.id ? `0 0 0 4px ${f.color}15` : "none",
            }}>
            <div className="flex items-center justify-between mb-2">
              <f.icon className="w-4 h-4" style={{ color: f.color }} />
              <span className="text-[10px] uppercase tracking-wide font-medium"
                style={{ color: filter === f.id ? f.color : C.textSecondary }}>
                {f.label}
              </span>
            </div>
            <div className="text-2xl font-bold" style={{ color: f.color }}>{f.count}</div>
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white border rounded-xl overflow-hidden" style={{ borderColor: C.border }}>
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Bell className="w-10 h-10 mx-auto mb-2" style={{ color: C.textDisabled }} />
            <div className="text-sm font-medium mb-1" style={{ color: C.textPrimary }}>
              No new messages
            </div>
            <div className="text-xs" style={{ color: C.textSecondary }}>
              {filter === "unread" ? "All messages have been read." : "Try changing the filter to see other messages."}
            </div>
          </div>
        ) : (
          filtered.map((m, idx) => (
            <button key={m.id} onClick={() => onItemClick(m)}
              className="w-full flex items-start gap-3 px-5 py-4 text-left border-b transition-colors hover:bg-gray-50"
              style={{
                borderColor: C.border,
                borderBottomWidth: idx === filtered.length - 1 ? 0 : 1,
                backgroundColor: !m.read ? "#FAFAFE" : "white",
              }}>
              {/* Unread dot */}
              <div className="pt-1 shrink-0">
                {!m.read ? (
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: C.primary }} />
                ) : (
                  <div className="w-2 h-2" />
                )}
              </div>

              {/* Avatar */}
              <PersonaAvatar p={m.from} size={36} />

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-semibold" style={{ color: C.textPrimary }}>
                    {PERSONAS[m.from]?.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                    style={{
                      backgroundColor: m.type === "approval" ? C.warningLight : C.infoLight,
                      color: m.type === "approval" ? C.warning : C.info,
                    }}>
                    {m.type === "approval" ? "Approvals" : "@Mentions"}
                  </span>
                  <span className="text-[11px]" style={{ color: C.textSecondary }}>
                    {m.projectName}
                  </span>
                  <span className="text-[11px] ml-auto shrink-0" style={{ color: C.textDisabled }}>
                    {m.time}
                  </span>
                </div>
                <div className={`text-sm mb-1.5 ${!m.read ? "font-semibold" : "font-medium"}`}
                  style={{ color: C.textPrimary }}>
                  {m.title}
                </div>
                <div className="text-xs leading-relaxed mb-2" style={{ color: C.textSecondary }}>
                  {m.snippet}
                </div>
                {m.itemRef && (
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] border"
                    style={{ borderColor: C.border, color: C.textSecondary, backgroundColor: C.bg }}>
                    <Box className="w-3 h-3" />
                    <span className="font-mono">{m.itemRef.partId}</span>
                    <span style={{ color: C.textPrimary }}>{m.itemRef.partName}</span>
                  </div>
                )}
              </div>

              {/* Arrow */}
              <ChevronRight className="w-4 h-4 mt-3 shrink-0" style={{ color: C.textDisabled }} />
            </button>
          ))
        )}
      </div>
    </div>
  );
}

// === NOTIFICATION DROPDOWN (GNB Bell) ===
function NotificationDropdown({ activePersona, setActiveProjectCode, setView, scenarioStep, onClose }) {
  // Up to 5 unread items for active persona
  const myInbox = INBOX_FEED.filter((m) => {
    if (m.to !== activePersona) return false;
    if (m.source === "scenario" && scenarioStep < m.scenarioStep) return false;
    return true;
  }).slice(0, 5);

  const onItemClick = (m) => {
    if (m.projectCode) {
      setActiveProjectCode(m.projectCode);
      setView("bom");
    }
    onClose();
  };

  const onSeeAll = () => {
    setView("inbox");
    onClose();
  };

  return (
    <div className="absolute top-12 right-0 w-[400px] bg-white rounded-xl border shadow-xl z-50"
      style={{ borderColor: C.border }}>
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4" style={{ color: C.primary }} />
          <span className="text-sm font-semibold" style={{ color: C.textPrimary }}>Notifications</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold"
            style={{ backgroundColor: C.errorLight, color: C.error }}>
            {myInbox.filter((m) => !m.read).length}
          </span>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
          <X className="w-4 h-4" style={{ color: C.textSecondary }} />
        </button>
      </div>

      {/* List */}
      <div className="max-h-[420px] overflow-auto">
        {myInbox.length === 0 ? (
          <div className="p-8 text-center text-xs" style={{ color: C.textSecondary }}>
            No new notifications.
          </div>
        ) : (
          myInbox.map((m, idx) => (
            <button key={m.id} onClick={() => onItemClick(m)}
              className="w-full flex items-start gap-2.5 px-4 py-3 text-left border-b hover:bg-gray-50"
              style={{
                borderColor: C.border,
                borderBottomWidth: idx === myInbox.length - 1 ? 0 : 1,
                backgroundColor: !m.read ? "#FAFAFE" : "white",
              }}>
              <PersonaAvatar p={m.from} size={28} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs font-semibold truncate" style={{ color: C.textPrimary }}>
                    {PERSONAS[m.from]?.name}
                  </span>
                  <span className="text-[9px] px-1 py-0.5 rounded font-medium"
                    style={{
                      backgroundColor: m.type === "approval" ? C.warningLight : C.infoLight,
                      color: m.type === "approval" ? C.warning : C.info,
                    }}>
                    {m.type === "approval" ? "Approve" : "@"}
                  </span>
                  <span className="text-[10px] ml-auto shrink-0" style={{ color: C.textDisabled }}>
                    {m.time}
                  </span>
                </div>
                <div className="text-xs font-medium mb-0.5 truncate" style={{ color: C.textPrimary }}>
                  {m.title}
                </div>
                <div className="text-[10px] truncate" style={{ color: C.textSecondary }}>
                  {m.projectName}
                </div>
              </div>
              {!m.read && (
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: C.primary }} />
              )}
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t" style={{ borderColor: C.border, backgroundColor: C.bg }}>
        <button onClick={onSeeAll}
          className="w-full text-xs font-medium py-1 rounded hover:bg-white transition-colors"
          style={{ color: C.primary }}>
          View entire Inbox →
        </button>
      </div>
    </div>
  );
}

// === PROMOTE BOM MODAL ===
// Promote parts from M-BOM to other BOMs (backbone of D2S Flow)
function PromoteBomModal({ targetBomId, onClose, onConfirm, scenarioStep }) {
  const targetMeta = BOM_LIST.find((b) => b.id === targetBomId);

  // Simulate which parts are missing in the target BOM
  const partsToPromote = useMemo(() => {
    if (!targetMeta) return [];
    const qBomMissingIds = [3, 10, 14, 18];
    const cBomMissingIds = [3];
    const eBomLagIds = [5, 8];
    const result = [];
    BOM_TREE.forEach((node) => {
      let status = "synced";
      if (targetBomId === "Q" && qBomMissingIds.includes(node.id) && scenarioStep < 7) status = "missing";
      else if (targetBomId === "C" && cBomMissingIds.includes(node.id) && scenarioStep < 6) status = "missing";
      else if (targetBomId === "E" && eBomLagIds.includes(node.id)) status = "lagged";
      result.push({ ...node, syncStatus: status });
    });
    return result;
  }, [targetBomId, scenarioStep]);

  if (!targetMeta) return null;

  const needsAction = partsToPromote.filter((p) => p.syncStatus !== "synced");
  const ownerName = PERSONAS[targetMeta.owner]?.name;
  const ownerRole = PERSONAS[targetMeta.owner]?.role;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(16, 24, 40, 0.5)" }}
      onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-[600px] max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-start justify-between"
          style={{ borderColor: C.border }}>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-md flex items-center justify-center"
                style={{ backgroundColor: C.primaryLight }}>
                <ChevronsRight className="w-4 h-4" style={{ color: C.primary }} />
              </div>
              <h2 className="text-[18px] font-semibold" style={{ color: C.textPrimary }}>
                Promote to {targetMeta.label}
              </h2>
            </div>
            <div className="text-xs ml-10" style={{ color: C.textSecondary }}>
              M-BOM v2.3 → <strong style={{ color: C.textPrimary }}>{targetMeta.name}</strong> {targetMeta.version}
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="w-4 h-4" style={{ color: C.textSecondary }} />
          </button>
        </div>

        {/* Summary */}
        <div className="px-6 py-3 border-b"
          style={{ borderColor: C.border, backgroundColor: C.bg }}>
          <div className="flex items-center gap-4 text-xs">
            <div>
              <span style={{ color: C.textSecondary }}>Target Owner: </span>
              <strong style={{ color: C.textPrimary }}>{ownerName} ({ownerRole})</strong>
            </div>
            <div>
              <span style={{ color: C.textSecondary }}>Needs Sync: </span>
              <strong style={{ color: needsAction.length > 0 ? C.warning : C.success }}>
                {needsAction.length} of {partsToPromote.length} parts
              </strong>
            </div>
          </div>
        </div>

        {/* Parts list */}
        <div className="flex-1 overflow-auto px-6 py-4">
          {needsAction.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-10 h-10 mx-auto mb-2" style={{ color: C.success }} />
              <div className="text-sm font-medium mb-1" style={{ color: C.textPrimary }}>
                All parts are already synced
              </div>
              <div className="text-xs" style={{ color: C.textSecondary }}>
                {targetMeta.label} is fully synced with M-BOM.
              </div>
            </div>
          ) : (
            <>
              <div className="text-xs font-medium mb-2 uppercase tracking-wide"
                style={{ color: C.textSecondary }}>
                Parts to Promote ({needsAction.length})
              </div>
              <div className="space-y-1.5">
                {needsAction.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 px-3 py-2 rounded-md border"
                    style={{ borderColor: C.border, backgroundColor: "white" }}>
                    <Package className="w-4 h-4 shrink-0"
                      style={{ color: p.isHero ? C.warning : C.textSecondary }} />
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-[11px]" style={{ color: C.textPrimary }}>
                        {p.partId}
                      </div>
                      <div className="text-[10px] truncate" style={{ color: C.textSecondary }}>
                        {p.desc}
                      </div>
                    </div>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0"
                      style={{
                        backgroundColor: p.syncStatus === "missing" ? C.errorLight : C.warningLight,
                        color: p.syncStatus === "missing" ? C.error : C.warning,
                      }}>
                      {p.syncStatus === "missing" ? "MISSING" : "DELAYED"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-md flex items-start gap-2"
                style={{ backgroundColor: C.primarySoft }}>
                <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: C.primary }} />
                <div className="text-xs leading-relaxed" style={{ color: C.primaryDark }}>
                  After promoting, <strong>{ownerName} ({ownerRole})</strong> is notified automatically, and
                  a promote record is appended to the Activity Stream.
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t flex items-center justify-end gap-2"
          style={{ borderColor: C.border }}>
          <button onClick={onClose}
            className="px-4 py-2 rounded-md text-sm font-medium border transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{ borderColor: C.border, color: C.textSecondary, backgroundColor: "white" }}>
            Cancel
          </button>
          <button onClick={() => onConfirm(targetBomId, needsAction)}
            disabled={needsAction.length === 0}
            className="px-4 py-2 rounded-md text-sm font-medium text-white flex items-center gap-1.5 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50"
            style={{
              backgroundColor: needsAction.length === 0 ? C.textDisabled : C.primary,
              cursor: needsAction.length === 0 ? "not-allowed" : "pointer",
            }}>
            <ChevronsRight className="w-4 h-4" />
            Promote {needsAction.length} {needsAction.length === 1 ? "part" : "parts"}
          </button>
        </div>
      </div>
    </div>
  );
}

// === SCREEN 0. PROJECT LIST ===
function ProjectList({ activeProjectCode, setActiveProjectCode, setView }) {
  const [search, setSearch] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("priority"); // priority (composite) | phaseDays | readiness | name
  const [statusFilter, setStatusFilter] = useState("all"); // all | onTrack | atRisk | blocked
  // Hover popover state — which project's collaborators popover is open
  const [hoveredCollabProject, setHoveredCollabProject] = useState(null);
  const hoverTimeoutRef = useRef(null);
  // Hover popover state — which project's blocking items popover is open
  const [hoveredBlockingProject, setHoveredBlockingProject] = useState(null);
  const blockingHoverTimeoutRef = useRef(null);

  const filtered = useMemo(() => {
    let result = PROJECTS;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter((p) =>
        p.name.toLowerCase().includes(s) ||
        p.code.toLowerCase().includes(s) ||
        p.product.toLowerCase().includes(s));
    }
    if (phaseFilter !== "all") result = result.filter((p) => p.phase === phaseFilter);
    if (priorityFilter !== "all") result = result.filter((p) => p.priority === priorityFilter);
    if (statusFilter === "onTrack") result = result.filter((p) => p.blocking === 0 && p.readiness >= 70);
    if (statusFilter === "atRisk") result = result.filter((p) => p.blocking === 0 && p.readiness < 70);
    if (statusFilter === "blocked") result = result.filter((p) => p.blocking > 0);

    // Composite urgency sort: blocking desc → D-day asc → readiness asc
    // (Most urgent first — projects that need immediate attention bubble up)
    if (sortBy === "priority") {
      result = [...result].sort((a, b) => {
        // 1. Blocking count (descending — more blocks = more urgent)
        if (a.blocking !== b.blocking) return b.blocking - a.blocking;
        // 2. Phase days remaining (ascending — closer deadline = more urgent)
        if (a.phaseDays !== b.phaseDays) return a.phaseDays - b.phaseDays;
        // 3. Readiness (ascending — lower readiness = more urgent)
        return a.readiness - b.readiness;
      });
    }
    if (sortBy === "phaseDays") result = [...result].sort((a, b) => a.phaseDays - b.phaseDays);
    if (sortBy === "readiness") result = [...result].sort((a, b) => a.readiness - b.readiness);
    if (sortBy === "name") result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [search, phaseFilter, priorityFilter, sortBy, statusFilter]);

  // Mutually exclusive status categorization (Blocked > At Risk > On Track).
  // A project that has blockers is "Blocked" regardless of readiness.
  // Among unblocked projects, readiness < 70 is "At Risk"; readiness >= 70 is "On Track".
  // Categories are exhaustive: every project falls into exactly one — sum equals total.
  const totals = useMemo(() => ({
    total: PROJECTS.length,
    blocked: PROJECTS.filter((p) => p.blocking > 0).length,
    atRisk: PROJECTS.filter((p) => p.blocking === 0 && p.readiness < 70).length,
    onTrack: PROJECTS.filter((p) => p.blocking === 0 && p.readiness >= 70).length,
  }), []);

  const onOpenProject = (code) => {
    setActiveProjectCode(code);
    setView("cockpit");
  };

  return (
    <div style={{ backgroundColor: C.bg, minHeight: "calc(100vh - 84px)" }}>
      <PageHeader
        breadcrumbs={[
          { label: "Home", onClick: () => setView("projects") },
          { label: "Design-to-Source" },
          { label: "Design-to-Source Projects" },
        ]}
        title="Design-to-Source Projects"
        starable
        actions={[
          {
            label: "Create New Project",
            icon: PlusCircle,
            variant: "primary",
            onClick: () => {},
          },
        ]}
        setView={setView}
      />

      <div className="px-8 pt-2 pb-6">
      {/* Unified Content Card: Filter Box + Pill Filter + Table */}
      <div className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: C.border }}>

        {/* (1) Filter Box: Search/Phase/Priority/Sort + Reset on the right */}
        <div className="p-4 border-b" style={{ borderColor: C.border }}>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex-1 min-w-[260px] relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.textDisabled }} />
              <input type="text" placeholder="Search by project name, code, or product..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-md text-sm outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                style={{ backgroundColor: C.surfaceTinted, color: C.textPrimary, border: "1px solid transparent" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.backgroundColor = "white"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.backgroundColor = C.surfaceTinted; }} />
            </div>
            <select value={phaseFilter} onChange={(e) => setPhaseFilter(e.target.value)}
              className="h-9 px-3 pr-8 rounded-md text-sm outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 cursor-pointer appearance-none bg-no-repeat"
              style={{
                backgroundColor: C.surfaceTinted, color: C.textPrimary, border: "1px solid transparent",
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3e%3cpath d='M6 9l6 6 6-6'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 10px center",
                backgroundSize: "12px 12px",
              }}>
              <option value="all">All Phases</option>
              {PHASES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}
              className="h-9 px-3 pr-8 rounded-md text-sm outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 cursor-pointer appearance-none bg-no-repeat"
              style={{
                backgroundColor: C.surfaceTinted, color: C.textPrimary, border: "1px solid transparent",
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3e%3cpath d='M6 9l6 6 6-6'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 10px center",
                backgroundSize: "12px 12px",
              }}>
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="med">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="h-9 px-3 pr-8 rounded-md text-sm outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 cursor-pointer appearance-none bg-no-repeat"
              style={{
                backgroundColor: C.surfaceTinted, color: C.textPrimary, border: "1px solid transparent",
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2'%3e%3cpath d='M6 9l6 6 6-6'/%3e%3c/svg%3e")`,
                backgroundPosition: "right 10px center",
                backgroundSize: "12px 12px",
              }}>
              <option value="priority">Sort: Urgency</option>
              <option value="phaseDays">Sort: Phase D-day</option>
              <option value="readiness">Sort: Readiness</option>
              <option value="name">Sort: Name</option>
            </select>

            {/* Reset Button — beside the filter box */}
            {(() => {
              const isFiltered = statusFilter !== "all" || search !== "" || phaseFilter !== "all" || priorityFilter !== "all" || sortBy !== "priority";
              const onResetAll = () => {
                setStatusFilter("all");
                setSearch("");
                setPhaseFilter("all");
                setPriorityFilter("all");
                setSortBy("priority");
              };
              return (
                <button onClick={onResetAll} disabled={!isFiltered}
                  className="ml-auto w-9 h-9 rounded-md flex items-center justify-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                  style={{
                    color: isFiltered ? C.primary : C.textDisabled,
                    cursor: isFiltered ? "pointer" : "not-allowed",
                  }}
                  onMouseEnter={(e) => { if (isFiltered) e.currentTarget.style.backgroundColor = C.primarySoft; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
                  title={isFiltered ? "Reset all filters" : "No active filters"}>
                  <RefreshCw className="w-4 h-4" />
                </button>
              );
            })()}
          </div>
        </div>

        {/* (2) Pill Filter Bar — semantic icons + colors */}
        <div className="px-4 py-2.5 border-b" style={{ borderColor: C.border }}>
          <div className="flex items-center rounded-full overflow-hidden w-fit p-0.5"
            style={{ backgroundColor: C.surfaceTinted }}>
            {[
              { id: "all", label: "All", count: totals.total, icon: Layers, accent: C.textSecondary },
              { id: "onTrack", label: "On Track", count: totals.onTrack, icon: CheckCircle, accent: C.success },
              { id: "atRisk", label: "At Risk", count: totals.atRisk, icon: AlertTriangle, accent: C.warning },
              { id: "blocked", label: "Blocked", count: totals.blocked, icon: XCircle, accent: C.error },
            ].map((f) => {
              const isActive = statusFilter === f.id;
              const Icon = f.icon;
              return (
                <button key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className="h-7 px-3.5 flex items-center gap-1.5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                  style={{
                    backgroundColor: isActive ? C.primary : "transparent",
                    color: isActive ? "white" : C.textSecondary,
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.04)"; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}>
                  <Icon className="w-3 h-3 shrink-0"
                    style={{ color: isActive ? "white" : f.accent, opacity: isActive ? 0.9 : 1 }} />
                  <span className="text-xs font-medium whitespace-nowrap">{f.label}</span>
                  <span className="text-xs font-semibold whitespace-nowrap"
                    style={{ opacity: isActive ? 0.85 : 1 }}>
                    {f.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* (3) Project Table */}
        <div className="px-4 py-2.5 border-b text-xs"
          style={{ borderColor: C.border, color: C.textSecondary }}>
          <span><span className="font-semibold" style={{ color: C.textPrimary }}>{filtered.length}</span> of {PROJECTS.length} projects</span>
        </div>
        <div className="overflow-auto">
          <table className="w-full text-xs">
            <thead style={{ backgroundColor: C.surface2 }}>
              <tr className="border-b" style={{ borderColor: C.border, color: C.textSecondary }}>
                <th className="text-left font-medium py-2.5 px-4">Project</th>
                <th className="text-left font-medium py-2.5 px-2">Owner</th>
                <th className="text-left font-medium py-2.5 px-2">Phase</th>
                <th className="text-center font-medium py-2.5 px-2">D-day</th>
                <th className="text-center font-medium py-2.5 px-2">Blocking</th>
                <th className="text-left font-medium py-2.5 px-2 w-56">Gate Readiness</th>
                <th className="text-right font-medium py-2.5 px-4">TMC Gap</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const phaseIdx = PHASES.indexOf(p.phase);
                const { Icon: ProjectIcon, bg: avatarBg, iconColor: avatarIconColor } = getProjectAvatar(p);
                return (
                  <tr key={p.code} onClick={() => onOpenProject(p.code)}
                    className="cursor-pointer border-b transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                    style={{ borderColor: C.borderLight, backgroundColor: "white" }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.surfaceTinted; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "white"; }}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpenProject(p.code); } }}>
                    {/* Project cell: Avatar + name + code/product (no PM here — moved to Owner column) */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0 border"
                          style={{ backgroundColor: avatarBg, borderColor: C.border }}>
                          <ProjectIcon strokeWidth={2} style={{ width: 18, height: 18, color: avatarIconColor }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-medium" style={{ color: C.textPrimary }}>{p.name}</span>
                          </div>
                          <div className="text-[10px] font-mono mt-0.5" style={{ color: C.textDisabled }}>
                            {p.code} · {p.product}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Owner cell: avatar + name + (+N collaborators with hover popover) */}
                    <td className="py-3 px-2" style={{ position: "relative", overflow: "visible" }}>
                      {(() => {
                        // Single source of truth: use the same getters that the popover uses
                        const internalList = getCollaboratorsForProject(p);
                        const externalList = getExternalCollaboratorsForProject(p);
                        const totalCollaborators = internalList.length + externalList.length;
                        const othersCount = totalCollaborators - 1; // exclude owner
                        return (
                          <>
                            <div className="flex items-center gap-1.5">
                              <PersonaAvatar p={p.pm} size={20} />
                              <div className="flex flex-col min-w-0">
                                <span className="text-xs font-medium truncate" style={{ color: C.textPrimary }}>
                                  {p.ownerName}
                                </span>
                                {othersCount > 0 && (
                                  <span
                                    className="text-[10px] cursor-default inline-flex items-center gap-1 px-1 -ml-1 rounded transition-colors"
                                    style={{ color: C.primary, width: "fit-content" }}
                                    onMouseEnter={(e) => {
                                      e.stopPropagation();
                                      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                                      hoverTimeoutRef.current = setTimeout(() => setHoveredCollabProject(p.code), 200);
                                    }}
                                    onMouseLeave={(e) => {
                                      e.stopPropagation();
                                      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                                      hoverTimeoutRef.current = setTimeout(() => setHoveredCollabProject(null), 200);
                                    }}>
                                    <Users className="w-2.5 h-2.5" />
                                    +{othersCount} collaborator{othersCount > 1 ? "s" : ""}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Hover popover — collaborators list */}
                            {hoveredCollabProject === p.code && (
                              <div
                                onMouseEnter={() => {
                                  if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                                }}
                                onMouseLeave={() => {
                                  if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                                  hoverTimeoutRef.current = setTimeout(() => setHoveredCollabProject(null), 200);
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="absolute z-30 rounded-lg shadow-xl border bg-white"
                                style={{
                                  borderColor: C.border,
                                  top: "100%",
                                  left: 0,
                                  marginTop: 6,
                                  width: 320,
                                  cursor: "default",
                                }}>
                                {/* Header */}
                                <div className="px-3 py-2 border-b flex items-center justify-between"
                                  style={{ borderColor: C.borderLight }}>
                                  <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: C.textSecondary }}>
                                    {totalCollaborators} {totalCollaborators === 1 ? "Collaborator" : "Collaborators"}
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveProjectCode(p.code);
                                      setView("collaborators");
                                    }}
                                    className="text-[10px] font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                                    style={{ color: C.primary }}>
                                    View all →
                                  </button>
                                </div>

                                {/* Internal section */}
                                <div className="py-1.5">
                                  <div className="px-3 py-1 text-[9px] font-bold uppercase tracking-wider"
                                    style={{ color: C.textDisabled }}>
                                    Internal · {internalList.length}
                                  </div>
                                  {internalList.map((c) => {
                                    const personaMeta = PERSONAS[c.persona] || {};
                                    return (
                                      <div key={`int-${c.persona}`}
                                        className="px-3 py-1.5 flex items-center gap-2 transition-colors hover:bg-gray-50">
                                        <PersonaAvatar p={c.persona} size={24} />
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-1">
                                            <span className="text-xs font-medium truncate" style={{ color: C.textPrimary }}>
                                              {personaMeta.name || c.persona}
                                            </span>
                                            {c.owner && (
                                              <span className="text-[8px] uppercase tracking-wide px-1 py-0.5 rounded font-bold"
                                                style={{ backgroundColor: C.primary, color: "white" }}>
                                                Owner
                                              </span>
                                            )}
                                          </div>
                                          <div className="text-[10px] truncate" style={{ color: C.textSecondary }}>
                                            {c.role}
                                          </div>
                                        </div>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); }}
                                          className="w-6 h-6 rounded flex items-center justify-center transition-colors hover:bg-white border shrink-0 focus:outline-none focus-visible:ring-2"
                                          style={{ borderColor: C.border, color: C.textSecondary }}
                                          title={`Message ${personaMeta.name || c.persona}`}>
                                          <MessageSquare className="w-3 h-3" />
                                        </button>
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* External section */}
                                {externalList.length > 0 && (
                                  <div className="py-1.5 border-t" style={{ borderColor: C.borderLight }}>
                                    <div className="px-3 py-1 text-[9px] font-bold uppercase tracking-wider"
                                      style={{ color: C.textDisabled }}>
                                      External · {externalList.length}
                                    </div>
                                    {externalList.slice(0, 3).map((c) => (
                                      <div key={`ext-${c.id}`}
                                        className="px-3 py-1.5 flex items-center gap-2 transition-colors hover:bg-gray-50">
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                                          style={{ backgroundColor: c.color }}>
                                          {c.initial}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="text-xs font-medium truncate" style={{ color: C.textPrimary }}>
                                            {c.name}
                                          </div>
                                          <div className="text-[10px] truncate" style={{ color: C.textSecondary }}>
                                            {c.company}
                                          </div>
                                        </div>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); }}
                                          className="w-6 h-6 rounded flex items-center justify-center transition-colors hover:bg-white border shrink-0 focus:outline-none focus-visible:ring-2"
                                          style={{ borderColor: C.border, color: C.textSecondary }}
                                          title={`Message ${c.name}`}>
                                          <MessageSquare className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ))}
                                    {externalList.length > 3 && (
                                      <div className="px-3 py-1 text-[10px]" style={{ color: C.textDisabled }}>
                                        +{externalList.length - 3} more external
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </td>
                    {/* Phase — label only, no dots */}
                    <td className="py-3 px-2">
                      <span className="text-xs font-medium" style={{ color: C.textPrimary }}>{p.phase}</span>
                    </td>
                    {/* D-day */}
                    <td className="py-3 px-2 text-center">
                      <span className="font-mono font-semibold text-xs"
                        style={{ color: p.phaseDays < 30 ? C.error : p.phaseDays < 60 ? C.warning : C.textSecondary }}>
                        D-{p.phaseDays}
                      </span>
                    </td>
                    {/* Blocking count + hover popover */}
                    <td className="py-3 px-2 text-center" style={{ position: "relative", overflow: "visible" }}>
                      {p.blocking > 0 ? (
                        <>
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full cursor-default transition-colors"
                            style={{ backgroundColor: C.errorLight, color: C.error }}
                            onMouseEnter={(e) => {
                              e.stopPropagation();
                              if (blockingHoverTimeoutRef.current) clearTimeout(blockingHoverTimeoutRef.current);
                              blockingHoverTimeoutRef.current = setTimeout(() => setHoveredBlockingProject(p.code), 200);
                            }}
                            onMouseLeave={(e) => {
                              e.stopPropagation();
                              if (blockingHoverTimeoutRef.current) clearTimeout(blockingHoverTimeoutRef.current);
                              blockingHoverTimeoutRef.current = setTimeout(() => setHoveredBlockingProject(null), 200);
                            }}>
                            <XCircle className="w-2.5 h-2.5" />
                            {p.blocking}
                          </span>

                          {/* Popover */}
                          {hoveredBlockingProject === p.code && (() => {
                            const isHeroP = p.code === ACTIVE_PROJECT_CODE;
                            const blockingList = isHeroP ? BLOCKING_ITEMS : generateGenericBlockingItems(p);
                            return (
                              <div
                                onMouseEnter={() => {
                                  if (blockingHoverTimeoutRef.current) clearTimeout(blockingHoverTimeoutRef.current);
                                }}
                                onMouseLeave={() => {
                                  if (blockingHoverTimeoutRef.current) clearTimeout(blockingHoverTimeoutRef.current);
                                  blockingHoverTimeoutRef.current = setTimeout(() => setHoveredBlockingProject(null), 200);
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="absolute z-30 rounded-lg shadow-xl border bg-white text-left"
                                style={{
                                  borderColor: C.border,
                                  top: "100%",
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  marginTop: 6,
                                  width: 340,
                                  cursor: "default",
                                }}>
                                {/* Header */}
                                <div className="px-3 py-2 border-b flex items-center justify-between"
                                  style={{ borderColor: C.borderLight, backgroundColor: C.errorLight }}>
                                  <div className="flex items-center gap-1.5">
                                    <XCircle className="w-3.5 h-3.5" style={{ color: C.error }} />
                                    <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: C.error }}>
                                      {blockingList.length} Blocking Item{blockingList.length > 1 ? "s" : ""}
                                    </div>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveProjectCode(p.code);
                                      setView("cockpit");
                                    }}
                                    className="text-[10px] font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                                    style={{ color: C.error }}>
                                    View all →
                                  </button>
                                </div>

                                {/* Items list */}
                                <div className="py-1.5 max-h-80 overflow-y-auto">
                                  {blockingList.map((item, idx) => {
                                    // Infer action type from blockReason
                                    const reason = (item.blockReason || "").toLowerCase();
                                    let actionLabel = "Resolve";
                                    let actionColor = C.error;
                                    if (reason.includes("not assigned") || reason.includes("no supplier") || reason.includes("rfq not")) {
                                      actionLabel = "Assign";
                                      actionColor = C.primary;
                                    } else if (reason.includes("pending") || reason.includes("review") || reason.includes("spec")) {
                                      actionLabel = "Review";
                                      actionColor = C.warning;
                                    }
                                    return (
                                      <div key={item.id || idx}
                                        className="px-3 py-2 flex items-start gap-2.5 transition-colors hover:bg-gray-50"
                                        style={{ borderTop: idx > 0 ? `1px solid ${C.borderLight}` : "none" }}>
                                        <div className="w-7 h-7 rounded flex items-center justify-center shrink-0 mt-0.5"
                                          style={{ backgroundColor: C.errorLight }}>
                                          <Package className="w-3.5 h-3.5" style={{ color: C.error }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="text-xs font-semibold truncate" style={{ color: C.textPrimary }}>
                                            {item.partName || item.partId}
                                          </div>
                                          <div className="text-[10px] font-mono mt-0.5" style={{ color: C.textDisabled }}>
                                            {item.partId}
                                          </div>
                                          <div className="text-[10px] mt-0.5 leading-snug" style={{ color: C.textSecondary }}>
                                            {item.blockReason}
                                          </div>
                                        </div>
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5"
                                          style={{
                                            backgroundColor: "white",
                                            color: actionColor,
                                            border: `1px solid ${actionColor}`,
                                          }}>
                                          {actionLabel}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })()}
                        </>
                      ) : (
                        <span className="text-[10px]" style={{ color: C.textDisabled }}>—</span>
                      )}
                    </td>
                    {/* Gate Readiness — primary by default; error red when blocked */}
                    <td className="py-3 px-2">
                      {(() => {
                        const isBlocked = p.blocking > 0;
                        const readinessColor = isBlocked ? C.error : C.primary;
                        return (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full" style={{ backgroundColor: C.borderLight }}>
                              <div className="h-1.5 rounded-full transition-all"
                                style={{
                                  width: `${p.readiness}%`,
                                  backgroundColor: readinessColor,
                                }} />
                            </div>
                            <span className="text-xs font-bold w-9 text-right"
                              style={{ color: readinessColor }}>
                              {p.readiness}%
                            </span>
                          </div>
                        );
                      })()}
                    </td>
                    {/* TMC Gap */}
                    <td className="py-3 px-4 text-right">
                      <span className="font-mono font-semibold text-xs"
                        style={{ color: p.tmcGap === 0 ? C.textDisabled : p.tmcGap > 0 ? C.error : C.success }}>
                        {p.tmcGap === 0 ? "—" : p.tmcGap > 0 ? `+$${p.tmcGap}k` : `-$${Math.abs(p.tmcGap)}k`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Search className="w-10 h-10 mx-auto mb-2" style={{ color: C.textDisabled }} />
            <div className="text-sm font-medium mb-1" style={{ color: C.textPrimary }}>No projects found</div>
            <div className="text-xs mb-4" style={{ color: C.textSecondary }}>Try a different search term or filter</div>
            <button
              onClick={() => {
                setStatusFilter("all");
                setSearch("");
                setPhaseFilter("all");
                setPriorityFilter("all");
                setSortBy("priority");
              }}
              className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 inline-flex items-center gap-1.5"
              style={{ borderColor: C.primary, color: C.primary }}>
              <RefreshCw className="w-3 h-3" />
              Clear all filters
            </button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}


// === SCREEN 1. PROJECT COCKPIT ===
function ProjectCockpit({ onOpenItem, scenarioStep, activeProjectCode, setView, activePersona }) {
  const project = PROJECTS.find((p) => p.code === activeProjectCode) || PROJECTS[0];
  const isHeroProject = project.code === ACTIVE_PROJECT_CODE;

  // Scenario operates only on Hero Project (NPI Smartphone #2)
  const isResolved = isHeroProject && scenarioStep >= 8;
  const readiness = isResolved ? 96 : project.readiness;
  const blocking = isResolved ? 0 : project.blocking;
  const tmcGap = isResolved ? -2.1 : project.tmcGap;

  // Hero project uses BLOCKING_ITEMS scenario data; others get generic placeholder
  const blockingItems = isHeroProject ? BLOCKING_ITEMS : generateGenericBlockingItems(project);

  // Per-phase Gate Readiness 3 sub-indicators (Design / Source & Cost / Quality)
  // Values average to the main readiness % for math consistency.
  // Initial: 78 + 58 + 60 → avg ≈ 65%
  // Resolved: 98 + 96 + 92 → avg ≈ 95.3% (rounded to 96%)
  const subIndicators = isHeroProject
    ? (isResolved
        ? [{ label: "Design", value: 98, color: C.info },
           { label: "Source & Cost", value: 96, color: C.warning },
           { label: "Quality", value: 92, color: C.primary }]
        : [{ label: "Design", value: 78, color: C.info },
           { label: "Source & Cost", value: 58, color: C.warning },
           { label: "Quality", value: 60, color: C.primary }])
    : [
        { label: "Design", value: Math.min(100, project.readiness + 5), color: C.info },
        { label: "Source & Cost", value: Math.max(20, project.readiness - 4), color: C.warning },
        { label: "Quality", value: Math.max(20, project.readiness - 12), color: C.primary },
      ];

  // === DE Cockpit (Design Engineer view) ===
  // Different KPIs + widgets focused on spec review & design queue.
  // Only renders for Hero project (other projects keep PM-style view to avoid empty widgets).
  if (activePersona === "DE" && !project.isNew && isHeroProject) {
    return (
      <DeCockpit
        project={project}
        scenarioStep={scenarioStep}
        isResolved={isResolved}
        onOpenItem={onOpenItem}
        setView={setView}
      />
    );
  }

  // === CM Cockpit (Cost Manager view) ===
  // KPIs + widgets focused on cost reconciliation, RFQ tracking, and supplier quote alignment.
  if (activePersona === "CM" && !project.isNew && isHeroProject) {
    return (
      <CmCockpit
        project={project}
        scenarioStep={scenarioStep}
        isResolved={isResolved}
        onOpenItem={onOpenItem}
        setView={setView}
      />
    );
  }

  // === SM Cockpit (Sourcing Manager / GCM view) ===
  // KPIs + widgets focused on supplier risk, commodity prices, and sourcing actions.
  if (activePersona === "SM" && !project.isNew && isHeroProject) {
    return (
      <SmCockpit
        project={project}
        scenarioStep={scenarioStep}
        isResolved={isResolved}
        onOpenItem={onOpenItem}
        setView={setView}
      />
    );
  }

  // === QM Cockpit (Quality Manager view) ===
  // KPIs + widgets focused on PPAP tracking, PCR review, and DVT validation.
  if (activePersona === "QM" && !project.isNew && isHeroProject) {
    return (
      <QmCockpit
        project={project}
        scenarioStep={scenarioStep}
        isResolved={isResolved}
        onOpenItem={onOpenItem}
        setView={setView}
      />
    );
  }

  // === Newly-created project: dedicated onboarding state ===
  if (project.isNew) {
    return (
      <div className="p-6" style={{ minHeight: "100%" }}>
        {/* Welcome banner */}
        <div className="mb-5 p-5 rounded-xl border flex items-start gap-3"
          style={{ backgroundColor: C.primarySoft, borderColor: C.primaryLight }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: C.primary }}>
            <Sparkles className="w-5 h-5" style={{ color: "white" }} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold mb-0.5" style={{ color: C.textPrimary }}>
              Welcome to your new project
            </div>
            <div className="text-xs" style={{ color: C.textSecondary }}>
              {project.name} is ready to start. Set up the team and upload or link your first E-BOM to begin collaboration.
            </div>
          </div>
        </div>

        {/* Onboarding checklist */}
        <div className="rounded-xl border bg-white p-5 mb-5" style={{ borderColor: C.border }}>
          <div className="text-[10px] font-semibold uppercase tracking-wide mb-4" style={{ color: C.primary }}>
            Get Started · 4 Steps
          </div>
          <div className="space-y-3">
            {[
              { num: 1, done: true, title: "Project created",
                desc: `${project.type} project initialized in ${project.phase} phase`,
                cta: null },
              { num: 2, done: false, title: "Add collaborators",
                desc: "Invite DE, CM, SM, QM to begin working as a team",
                cta: "Invite Team", icon: Users, action: () => setView("info") },
              { num: 3, done: false, title: "Add E-BOM",
                desc: "Upload from CAD/PLM or link to an existing BOM to begin collaboration",
                cta: "Upload or Link", icon: Upload, action: () => setView("bomlist") },
              { num: 4, done: false, title: "Set Phase Gate criteria",
                desc: "Define the exit criteria for your Incubation phase",
                cta: "Define Criteria", icon: Target, action: () => {} },
            ].map((step) => (
              <div key={step.num}
                className="flex items-start gap-3 p-3 rounded-lg"
                style={{ backgroundColor: step.done ? C.successLight : C.bg }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    backgroundColor: step.done ? C.success : "white",
                    border: step.done ? "none" : `1.5px solid ${C.border}`,
                  }}>
                  {step.done ? (
                    <CheckCircle className="w-4 h-4" style={{ color: "white" }} />
                  ) : (
                    <span className="text-xs font-bold" style={{ color: C.textSecondary }}>{step.num}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold mb-0.5"
                    style={{ color: step.done ? C.success : C.textPrimary }}>
                    {step.title}
                  </div>
                  <div className="text-xs" style={{ color: C.textSecondary }}>
                    {step.desc}
                  </div>
                </div>
                {step.cta && (
                  <button onClick={step.action}
                    className="px-3 py-1.5 rounded-md text-xs font-semibold inline-flex items-center gap-1.5 text-white shrink-0 hover:opacity-90"
                    style={{ backgroundColor: C.primary }}>
                    {step.icon && <step.icon className="w-3.5 h-3.5" />}
                    {step.cta}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Project meta summary */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border bg-white p-4" style={{ borderColor: C.border }}>
            <div className="text-[10px] font-medium uppercase tracking-wide mb-1" style={{ color: C.textSecondary }}>
              Phase
            </div>
            <div className="text-base font-semibold" style={{ color: C.textPrimary }}>{project.phase}</div>
            <div className="text-[10px] mt-1" style={{ color: C.textSecondary }}>D-{project.phaseDays} to next gate</div>
          </div>
          <div className="rounded-lg border bg-white p-4" style={{ borderColor: C.border }}>
            <div className="text-[10px] font-medium uppercase tracking-wide mb-1" style={{ color: C.textSecondary }}>
              Project Type
            </div>
            <div className="text-base font-semibold" style={{ color: C.textPrimary }}>{project.type}</div>
            <div className="text-[10px] mt-1" style={{ color: C.textSecondary }}>{project.product}</div>
          </div>
          <div className="rounded-lg border bg-white p-4" style={{ borderColor: C.border }}>
            <div className="text-[10px] font-medium uppercase tracking-wide mb-1" style={{ color: C.textSecondary }}>
              Created
            </div>
            <div className="text-base font-semibold" style={{ color: C.textPrimary }}>{project.lastUpdate}</div>
            <div className="text-[10px] mt-1" style={{ color: C.textSecondary }}>by {PERSONAS[project.pm]?.name}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" style={{ minHeight: "100%" }}>
      {/* AI Insight Banner */}
      <div className="mb-5 p-4 rounded-lg border flex items-start gap-3"
        style={{ backgroundColor: isResolved ? C.successLight : (blocking > 0 ? C.primarySoft : C.successLight),
                 borderColor: isResolved || blocking === 0 ? C.success : C.primaryLight }}>
        <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
          style={{ backgroundColor: isResolved || blocking === 0 ? C.success : C.primary }}>
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold mb-0.5"
            style={{ color: isResolved || blocking === 0 ? C.successDark : C.primaryDark }}>
            {isResolved
              ? `On Track for ${project.phase} Phase Gate`
              : blocking === 0
                ? `On Track for ${project.phase} Phase Gate`
                : `${project.phase} until Phase Gate D-${project.phaseDays}`}
          </div>
          <div className="text-xs" style={{ color: C.textSecondary }}>
            {isResolved
              ? `Gate Readiness ${readiness}%. New AMOLED Panel collaboration complete. Recommend preparing for the next Phase Gate review.`
              : blocking === 0
                ? `Gate Readiness ${readiness}%. All items on track. On pace to clear the Phase Gate.`
                : `Gate Readiness ${readiness}%. ${blocking} blocking items — immediate review required.`}
          </div>
        </div>
        <button
          onClick={() => {
            if (isResolved) {
              // Resolved state: prep next gate review (placeholder)
              setView && setView("apqp");
            } else if (blocking === 0) {
              // No blocking: jump to BOM Collaboration to view current status
              setView && setView("bom");
            } else if (isHeroProject && blockingItems.length > 0) {
              // Has blocking + hero: open first blocking item in BOM Coll
              onOpenItem && onOpenItem(blockingItems[0].id);
            } else {
              // Has blocking + non-hero: jump to BOM Coll
              setView && setView("bom");
            }
          }}
          className="text-[11px] font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 shrink-0"
          style={{ color: isResolved || blocking === 0 ? C.success : C.primary }}>
          {isResolved ? "Prepare gate review →" : blocking === 0 ? "View progress →" : "Review blockers →"}
        </button>
      </div>

      {/* KPI Row — PM Cockpit (4 cards: Runway / Pending Decisions / Cost / Risk) */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {/* Gate Runway — phase deadline */}
        <KpiCard
          icon={Clock}
          iconColor={project.phaseDays <= 7 ? C.error : project.phaseDays <= 30 ? C.warning : C.textSecondary}
          label="Gate Runway"
          value={`${project.phaseDays} days`}
          sub={`${project.phase} gate deadline`} />

        {/* Pending Decisions — single source of truth for "PM action needed".
            Same data as the Pending Decisions widget below (blocking items requiring PM resolution). */}
        <KpiCard
          icon={AlertTriangle}
          iconColor={blocking > 0 ? C.error : C.success}
          label="Pending Decisions"
          value={blocking}
          sub={blocking > 0
            ? (isHeroProject ? "PM action needed" : "Action required")
            : "All clear"} />

        {/* Cost vs Target — TMC Gap */}
        <KpiCard
          icon={DollarSign}
          iconColor={tmcGap > 0 ? C.error : tmcGap < 0 ? C.success : C.textSecondary}
          label="Cost vs Target"
          value={tmcGap === 0 ? "—" : tmcGap > 0 ? `+$${tmcGap}k` : `-$${Math.abs(tmcGap)}k`}
          sub={tmcGap > 0 ? "Over target" : tmcGap < 0 ? "Under target" : "On target"} />

        {/* Risk Items — High risk parts (Q-BOM) */}
        <KpiCard
          icon={ShieldCheck}
          iconColor={isResolved ? C.success : (isHeroProject ? C.warning : C.textSecondary)}
          label="Risk Items"
          value={isResolved ? "0" : (isHeroProject ? "6" : "0")}
          sub={isResolved ? "All cleared" : (isHeroProject ? "3 sole-source · 2 geo" : "—")} />
      </div>

      {/* Gate Readiness + Blocking Items */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        <div className="p-5 rounded-xl border bg-white" style={{ borderColor: C.border }}>
          <div className="text-sm font-semibold mb-4" style={{ color: C.textPrimary }}>
            Gate Readiness — {project.phase}
          </div>
          <div className="flex items-center justify-center mb-4">
            <ReadinessRing value={readiness} />
          </div>
          <div className="space-y-2.5">
            {subIndicators.map((g) => (
              <div key={g.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span style={{ color: C.textSecondary }}>{g.label}</span>
                  <span className="font-semibold" style={{ color: g.color }}>{g.value}%</span>
                </div>
                <div className="h-1.5 rounded-full" style={{ backgroundColor: C.borderLight }}>
                  <div className="h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${g.value}%`, backgroundColor: g.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-2 p-5 rounded-xl border bg-white" style={{ borderColor: C.border }}>
          <div className="flex items-center justify-between mb-4 gap-3">
            <div className="flex items-baseline gap-2 min-w-0">
              <div className="text-sm font-semibold shrink-0" style={{ color: C.textPrimary }}>
                {isResolved ? "Recently Resolved Items" : blocking > 0 ? "Pending Decisions" : "Recent Activity"}
              </div>
              {!isResolved && blocking > 0 && (
                <span className="text-[11px]" style={{ color: C.textDisabled }}>
                  · PM action needed
                </span>
              )}
            </div>
            <span className="text-[11px] shrink-0" style={{ color: C.textSecondary }}>
              {isResolved
                ? `${blockingItems.length} resolved in last 24h`
                : blocking > 0
                  ? `${blocking} item${blocking > 1 ? "s" : ""}`
                  : "All caught up"}
            </span>
          </div>
          {isResolved ? (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 mx-auto mb-3" style={{ color: C.success }} />
              <div className="text-sm font-medium mb-1" style={{ color: C.textPrimary }}>All blocking items resolved</div>
              <div className="text-xs" style={{ color: C.textSecondary }}>End-to-End collaboration cycle complete</div>
            </div>
          ) : blocking === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-12 h-12 mx-auto mb-3" style={{ color: C.success }} />
              <div className="text-sm font-medium mb-1" style={{ color: C.textPrimary }}>No blocking items</div>
              <div className="text-xs" style={{ color: C.textSecondary }}>{project.phase} phase progressing normally</div>
            </div>
          ) : (
            <div className="space-y-2">
              {blockingItems.map((item) => {
                // Infer PM action type from blockReason/status:
                // - "no supplier" / "not assigned" → Assign
                // - "Risk Assessment pending" / spec review → Review
                // - cost/price conflicts → Resolve
                const reason = (item.blockReason || "").toLowerCase();
                let actionLabel = "Resolve";
                let actionColor = C.error;
                if (reason.includes("not assigned") || reason.includes("no supplier") || reason.includes("rfq not")) {
                  actionLabel = "Assign";
                  actionColor = C.primary;
                } else if (reason.includes("pending") || reason.includes("review") || reason.includes("spec")) {
                  actionLabel = "Review";
                  actionColor = C.warning;
                }
                return (
                  <div key={item.id}
                    className="w-full p-3 rounded-lg border transition-all hover:shadow-sm"
                    style={{ borderColor: C.borderLight }}>
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => isHeroProject && onOpenItem && onOpenItem(item.id)}
                        disabled={!isHeroProject}
                        className="flex-1 min-w-0 text-left flex items-start gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded"
                        style={{ cursor: isHeroProject ? "pointer" : "default" }}>
                        <div className="w-9 h-9 rounded flex items-center justify-center shrink-0"
                          style={{ backgroundColor: C.errorLight }}>
                          <Package className="w-4 h-4" style={{ color: C.error }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-sm font-medium" style={{ color: C.textPrimary }}>
                              {item.partName || item.partId}
                            </span>
                            <span className="text-xs font-mono" style={{ color: C.textSecondary }}>
                              {item.partId}
                            </span>
                          </div>
                          <div className="text-xs mb-2" style={{ color: C.textSecondary }}>
                            {item.blockReason}
                          </div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {item.status && Object.entries(item.status).map(([k, v]) => (
                              <StatusPill key={k} kind={v} label={`${k}: ${STATUS_MAP[v].label}`} />
                            ))}
                          </div>
                        </div>
                      </button>
                      {isHeroProject && (
                        <button
                          onClick={() => onOpenItem && onOpenItem(item.id)}
                          className="h-7 px-2.5 rounded-md text-[11px] font-semibold border transition-colors shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 hover:opacity-80"
                          style={{ borderColor: actionColor, color: actionColor, backgroundColor: "white" }}>
                          {actionLabel}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {!isHeroProject && (
                <div className="mt-2 px-3 py-2 rounded-md text-xs flex items-center gap-2"
                  style={{ backgroundColor: C.infoLight, color: C.info }}>
                  <Info className="w-3.5 h-3.5" />
                  Item-level collaboration happens in BOM Collaboration
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Activity Mini + Risk Summary (2-column) */}
      <div className="grid grid-cols-3 gap-4">
        {/* Activity Mini — 2/3 width */}
        <div className="col-span-2 p-5 rounded-xl border bg-white" style={{ borderColor: C.border }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>Recent Activity & Decisions</div>
              <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>
                Project mentions & decisions — synced with the Activity Stream in BOM Collaboration.
              </div>
            </div>
            <button onClick={() => setView("bom")}
              className="text-[11px] font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 shrink-0"
              style={{ color: C.primary }}>
              Full activity stream →
            </button>
          </div>
          {isHeroProject ? (
            <div className="space-y-3">
              {(() => {
                // Activity feed mix:
                // - Scenario messages (ids 1-8) progress with scenarioStep
                // - History messages (ids 11+) are always-on context
                // Always show 4 recent items: prefer latest scenario messages, fill with history
                const scenarioMsgs = ACTIVITY_FEED.slice(0, Math.min(scenarioStep + 1, 8)); // up to 8 scenario items
                const historyMsgs = ACTIVITY_FEED.filter(m => m.id >= 11);                  // history
                // Latest scenario messages (descending by id) + history filler
                const latestScenario = [...scenarioMsgs].reverse(); // most recent scenario message first
                const mixed = [...latestScenario, ...historyMsgs].slice(0, 3);
                return mixed.map((m) => (
                  <div key={m.id} className="flex items-start gap-3 text-sm">
                    <PersonaAvatar p={m.persona === "AI" ? "PM" : m.persona} size={26} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-medium" style={{ color: C.textPrimary }}>
                          {m.persona === "AI" ? "AI Assistant" : PERSONAS[m.persona]?.name}
                        </span>
                        <span className="text-xs" style={{ color: C.textDisabled }}>·</span>
                        <span className="text-xs" style={{ color: C.textDisabled }}>{m.ts}</span>
                        {m.decision && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                            style={{ backgroundColor: C.primaryLight, color: C.primary }}>DECISION</span>
                        )}
                      </div>
                      <div className="text-xs leading-relaxed" style={{ color: C.textSecondary }}>{m.message}</div>
                    </div>
                  </div>
                ));
              })()}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-10 h-10 mx-auto mb-2" style={{ color: C.textDisabled }} />
              <div className="text-xs" style={{ color: C.textSecondary }}>
                {project.name}'s activity log will appear here
              </div>
            </div>
          )}
        </div>

        {/* Risk Summary — 1/3 width (NEW) */}
        <div className="p-5 rounded-xl border bg-white" style={{ borderColor: C.border }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>Risk Summary</div>
              <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>Supplier source distribution</div>
            </div>
            <button onClick={() => setView("bom")}
              className="text-[11px] font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              style={{ color: C.primary }}>
              Full dashboard →
            </button>
          </div>
          {(() => {
            // Hero project: scenario-driven values; resolved state shows improved metrics
            // Other projects: derived placeholders
            const riskData = isHeroProject
              ? (isResolved
                  ? [
                      { label: "Sole source", value: 8, target: 10, color: C.success, status: "good" },
                      { label: "Single source", value: 12, target: 15, color: C.success, status: "good" },
                      { label: "Dual+", value: 80, target: 75, color: C.success, status: "good" },
                    ]
                  : [
                      { label: "Sole source", value: 18, target: 10, color: C.error, status: "over" },
                      { label: "Single source", value: 24, target: 15, color: C.warning, status: "over" },
                      { label: "Dual+", value: 58, target: 75, color: C.warning, status: "under" },
                    ])
              : [
                  { label: "Sole source", value: 12, target: 10, color: C.warning, status: "over" },
                  { label: "Single source", value: 18, target: 15, color: C.warning, status: "over" },
                  { label: "Dual+", value: 70, target: 75, color: C.warning, status: "under" },
                ];
            return (
              <div className="space-y-3.5">
                {riskData.map((r) => (
                  <div key={r.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span style={{ color: C.textSecondary }}>{r.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold" style={{ color: r.color }}>{r.value}%</span>
                        <span className="text-[10px]" style={{ color: C.textDisabled }}>Target {r.target}%</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden relative" style={{ backgroundColor: C.borderLight }}>
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(100, r.value)}%`,
                          backgroundColor: r.color,
                        }} />
                      {/* Target marker */}
                      <div className="absolute top-0 bottom-0 w-px"
                        style={{
                          left: `${Math.min(100, r.target)}%`,
                          backgroundColor: C.textPrimary,
                          opacity: 0.4,
                        }} />
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

// === DE COCKPIT ===
// Design Engineer-focused dashboard:
// 5 KPIs (Pending Decisions, Spec Changes, Conflicts, New Parts, PPAP Items)
// + BOM Review Queue + Changes Submitted + DVT Validation + Process Sheet Completeness
function DeCockpit({ project, scenarioStep, isResolved, onOpenItem, setView }) {
  // ===== Mock data for DE scenario (Hero project) =====
  // BOM Review Queue: changes others submitted that DE needs to accept/decide/review
  const bomReviewQueue = isResolved ? [] : [
    { id: 3, partId: "EI2-I6DA-003WB", partName: "AMOLED Panel 6.7\"",
      meta: "Display spec: 6.5\" 90Hz → 6.7\" 120Hz",
      status: "conflict", action: "Resolve" },
    { id: 7, partId: "GL2-7HKR-WA1Z3", partName: "Cover Glass Gorilla Victus 2",
      meta: "Thickness: 0.65mm → 0.70mm — CM proposed",
      status: "pending", action: "Decide" },
    { id: 9, partId: "QE3-8DHV-XIRG8", partName: "Fan Module",
      meta: "Blade material: PC → PC+ABS — supplier suggested",
      status: "pending", action: "Decide" },
    { id: 6, partId: "1W6-4YP3-X6FU2", partName: "Touch Controller IC",
      meta: "New part added by CM",
      status: "pending", action: "Review" },
    { id: 2, partId: "XYR-YZK5-WA1A7", partName: "Display Module 6.7\"",
      meta: "Brightness: 1300 nits → 1500 nits — DE approved",
      status: "accepted", action: null },
  ];

  // Changes I submitted (DE-initiated spec changes)
  const changesSubmitted = isResolved
    ? [
        { id: "c1", title: "AMOLED Panel 6.7\" 120Hz", meta: "Spec change · CM applied · QM cleared", state: "approved" },
        { id: "c2", title: "Polarizer Film update", meta: "Material spec · All teams approved", state: "approved" },
        { id: "c3", title: "Display Module brightness", meta: "1500 nits peak · confirmed", state: "approved" },
      ]
    : [
        { id: "c1", title: "AMOLED Panel 6.7\" 120Hz", meta: "Spec change · CM negotiating supplier", state: "review" },
        { id: "c2", title: "Polarizer Film (new)", meta: "New part · RFQ pending · sourcing TBD", state: "pending" },
        { id: "c3", title: "OCA Adhesive (new)", meta: "New part · Supplier TBC", state: "pending" },
        { id: "c4", title: "Cover Glass spec", meta: "No change from Rev A — confirmed", state: "unchanged" },
      ];

  // DVT validation required (Design Verification Test items)
  const dvtItems = isResolved ? [] : [
    { id: "d1", title: "AMOLED Panel 6.7\" 120Hz refresh",
      detail: "Touch latency & color accuracy validation required.",
      due: "Apr 25", urgent: true },
    { id: "d2", title: "Fan Module flow test",
      detail: "Airflow at PC+ABS blade — thermal margin re-verification.",
      due: "May 2", urgent: false },
    { id: "d3", title: "Mainboard 5G thermal",
      detail: "New AMOLED draws +12% — re-run thermal scenarios.",
      due: "TBD", urgent: false },
  ];

  // Process sheet completeness by sub-system
  const processSheets = isResolved
    ? [
        { label: "Display Module", value: 100, color: C.success },
        { label: "Camera Module", value: 95, color: C.success },
        { label: "Mainboard", value: 98, color: C.success },
        { label: "Battery", value: 92, color: C.success },
        { label: "Mechanical", value: 88, color: C.success },
      ]
    : [
        { label: "Display Module", value: 72, color: C.warning },
        { label: "Camera Module", value: 85, color: C.success },
        { label: "Mainboard", value: 60, color: C.warning },
        { label: "Battery", value: 90, color: C.success },
        { label: "Mechanical", value: 55, color: C.error },
      ];

  // ===== KPI calculations =====
  const pendingDecisions = bomReviewQueue.filter(q => q.status !== "accepted").length;
  const specChanges = isResolved ? 7 : 7; // total spec deltas vs E-BOM Rev A
  const conflicts = isResolved ? 0 : 1;   // cross-team blockers DE owns
  const newParts = isResolved ? 0 : 2;     // parts without supplier
  const ppapPending = isResolved ? 0 : 4;  // Q-BOM items awaiting DE input

  // Status meta for review queue
  const statusMeta = {
    conflict: { label: "Conflict", bg: C.errorLight, fg: C.error, actionBorder: C.error },
    pending:  { label: "Pending",  bg: C.warningLight, fg: C.warning, actionBorder: C.warning },
    accepted: { label: "Accepted", bg: C.successLight, fg: C.success, actionBorder: null },
  };

  return (
    <div className="p-6" style={{ minHeight: "100%" }}>
      {/* AI Banner for DE */}
      <div className="mb-5 p-4 rounded-lg border flex items-start gap-3"
        style={{
          backgroundColor: isResolved ? C.successLight : C.primarySoft,
          borderColor: isResolved ? C.success : C.primaryLight,
        }}>
        <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
          style={{ backgroundColor: isResolved ? C.success : C.primary }}>
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold mb-0.5"
            style={{ color: isResolved ? C.successDark : C.primaryDark }}>
            {isResolved
              ? `All design reviews cleared — ${project.phase} Phase Gate ready`
              : `${pendingDecisions} decisions pending — Spec change Rev B awaiting review`}
          </div>
          <div className="text-xs" style={{ color: C.textSecondary }}>
            {isResolved
              ? "All AMOLED Panel collaboration sign-offs complete. Process sheets at 95%+."
              : `${specChanges} spec deltas vs Rev A baseline. ${newParts} new parts need supplier assignment.`}
          </div>
        </div>
        <button
          onClick={() => setView && setView("bom")}
          className="text-[11px] font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 shrink-0"
          style={{ color: isResolved ? C.success : C.primary }}>
          {isResolved ? "Open BOM →" : "Open BOM workspace →"}
        </button>
      </div>

      {/* KPI Row — DE-specific (5 cards) */}
      <div className="grid grid-cols-5 gap-4 mb-5">
        <KpiCard
          icon={AtSign}
          iconColor={pendingDecisions > 0 ? C.primary : C.success}
          label="My Pending Decisions"
          value={pendingDecisions}
          sub={pendingDecisions > 0 ? "Accept / Keep needed" : "All cleared"} />

        <KpiCard
          icon={GitBranch}
          iconColor={specChanges > 0 ? C.warning : C.success}
          label="Spec Changes (Rev B)"
          value={specChanges}
          sub="vs Rev A baseline" />

        <KpiCard
          icon={AlertTriangle}
          iconColor={conflicts > 0 ? C.error : C.success}
          label="Conflicts"
          value={conflicts}
          sub={conflicts > 0 ? "AMOLED Panel" : "All clear"} />

        <KpiCard
          icon={Package}
          iconColor={newParts > 0 ? C.warning : C.success}
          label="New Parts (No Supplier)"
          value={newParts}
          sub={newParts > 0 ? "RFQ needed" : "All assigned"} />

        <KpiCard
          icon={ShieldCheck}
          iconColor={ppapPending > 0 ? C.warning : C.success}
          label="PPAP Items Pending"
          value={ppapPending}
          sub={ppapPending > 0 ? "QM review required" : "All cleared"} />
      </div>

      {/* Row 1: BOM Review Queue (2/3) + Changes Submitted (1/3) */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {/* My BOM Review Queue */}
        <div className="col-span-2 rounded-xl border bg-white" style={{ borderColor: C.border }}>
          <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: C.border }}>
            <div>
              <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>My BOM Review Queue</div>
              <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>
                Accept or keep each change submitted by collaborators
              </div>
            </div>
            <button onClick={() => setView && setView("bom")}
              className="text-xs font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              style={{ color: C.primary }}>
              Open BOM workspace →
            </button>
          </div>
          {bomReviewQueue.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-10 h-10 mx-auto mb-2" style={{ color: C.success }} />
              <div className="text-sm font-medium mb-1" style={{ color: C.textPrimary }}>All reviews cleared</div>
              <div className="text-xs" style={{ color: C.textSecondary }}>No pending decisions on your queue.</div>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: C.borderLight }}>
              {bomReviewQueue.map((q) => {
                const meta = statusMeta[q.status];
                return (
                  <div key={q.id} className="px-5 py-3 flex items-center gap-3 transition-colors hover:bg-gray-50">
                    <button
                      onClick={() => onOpenItem && onOpenItem(q.id)}
                      className="flex-1 min-w-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded">
                      <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>{q.partName}</div>
                      <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>
                        <span className="font-mono" style={{ color: C.textDisabled }}>{q.partId}</span>
                        <span style={{ color: C.borderLight }}> · </span>
                        {q.meta}
                      </div>
                    </button>
                    <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded shrink-0"
                      style={{ backgroundColor: meta.bg, color: meta.fg }}>
                      {meta.label}
                    </span>
                    {q.action && (
                      <button
                        onClick={() => onOpenItem && onOpenItem(q.id)}
                        className="h-7 px-2.5 rounded-md text-[11px] font-semibold border transition-colors shrink-0 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                        style={{ borderColor: meta.actionBorder, color: meta.actionBorder, backgroundColor: "white" }}>
                        {q.action}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Changes I Submitted */}
        <div className="rounded-xl border bg-white" style={{ borderColor: C.border }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: C.border }}>
            <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>Changes I Submitted</div>
            <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>Tracking your spec changes</div>
          </div>
          <div className="divide-y" style={{ borderColor: C.borderLight }}>
            {changesSubmitted.map((c) => {
              const stateMeta = {
                approved:  { label: "Approved",  bg: C.successLight, fg: C.success, action: "View" },
                review:    { label: "In Review", bg: C.warningLight, fg: C.warning, action: "Track" },
                pending:   { label: "Pending",   bg: C.warningLight, fg: C.warning, action: "Track RFQ" },
                unchanged: { label: "Unchanged", bg: C.bg, fg: C.textSecondary, action: null },
              }[c.state] || { label: c.state, bg: C.bg, fg: C.textSecondary, action: null };
              return (
                <div key={c.id} className="px-5 py-3 flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold" style={{ color: C.textPrimary }}>{c.title}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>{c.meta}</div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: stateMeta.bg, color: stateMeta.fg }}>
                      {stateMeta.label}
                    </span>
                    {stateMeta.action && (
                      <button onClick={() => setView && setView("bom")}
                        className="h-6 px-2 rounded text-[10px] font-medium border hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                        style={{ borderColor: C.border, color: C.textPrimary, backgroundColor: "white" }}>
                        {stateMeta.action}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 2: DVT Validation Required (1/2) + Process Sheet Completeness (1/2) */}
      <div className="grid grid-cols-2 gap-4">
        {/* DVT Validation Required */}
        <div className="rounded-xl border bg-white" style={{ borderColor: C.border }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: C.border }}>
            <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>DVT Validation Required</div>
            <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>
              Design verification tests pending execution
            </div>
          </div>
          {dvtItems.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-10 h-10 mx-auto mb-2" style={{ color: C.success }} />
              <div className="text-sm font-medium mb-1" style={{ color: C.textPrimary }}>All DVT validations complete</div>
              <div className="text-xs" style={{ color: C.textSecondary }}>No outstanding test items.</div>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: C.borderLight }}>
              {dvtItems.map((d) => (
                <div key={d.id} className="px-5 py-3 flex items-start gap-3 transition-colors hover:bg-gray-50">
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: d.urgent ? C.error : C.warning }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>{d.title}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>{d.detail}</div>
                  </div>
                  <span className="text-[11px] font-medium shrink-0"
                    style={{ color: d.due === "TBD" ? C.textDisabled : C.textSecondary }}>
                    {d.due}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Process Sheet Completeness */}
        <div className="rounded-xl border bg-white p-5" style={{ borderColor: C.border }}>
          <div className="mb-4">
            <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>Process Sheet Completeness</div>
            <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>Rev B by sub-system</div>
          </div>
          <div className="space-y-3.5">
            {processSheets.map((p) => (
              <div key={p.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span style={{ color: C.textSecondary }}>{p.label}</span>
                  <span className="font-semibold" style={{ color: p.color }}>{p.value}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: C.borderLight }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${p.value}%`, backgroundColor: p.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// === CM COCKPIT ===
// Cost Manager-focused dashboard:
// 5 KPIs (Should vs Quoted Gap, Should-cost Coverage, RFQ Outstanding, Cost Conflicts, Total Cost)
// + Cost Reconcile table + RFQ Status + My Action Queue
function CmCockpit({ project, scenarioStep, isResolved, onOpenItem, setView }) {
  // ===== Mock data — Cost reconciliation rows (Hero project parts) =====
  // Hero scenario step 4+: should-cost computed; step 6+: RFQ responses in; step 7+: BOE awarded
  const costRows = isResolved
    ? [
        { id: 2,  part: "Display Module 6.7\"",      target: 41.50, quoted: 40.20, should: 40.80, gap: -1.30, status: "aligned" },
        { id: 3,  part: "AMOLED Panel 6.7\"",        target: 38.00, quoted: 38.90, should: 41.80, gap: +0.90, status: "aligned", isHero: true },
        { id: 6,  part: "Touch Controller IC",       target: 4.20,  quoted: 4.10,  should: 4.05,  gap: -0.10, status: "aligned" },
        { id: 4,  part: "Polarizer Film",            target: 1.80,  quoted: 1.75,  should: 1.78,  gap: -0.05, status: "aligned" },
        { id: 5,  part: "OCA Adhesive",              target: 0.95,  quoted: 0.92,  should: 0.94,  gap: -0.03, status: "aligned" },
        { id: 10, part: "Mainboard 5G",              target: 28.00, quoted: 27.40, should: 27.90, gap: -0.60, status: "aligned" },
      ]
    : [
        { id: 2,  part: "Display Module 6.7\"",      target: 41.50, quoted: 40.20, should: 40.80, gap: -1.30, status: "aligned" },
        { id: 3,  part: "AMOLED Panel 6.7\"",        target: 38.00, quoted: scenarioStep >= 6 ? 38.90 : null, should: scenarioStep >= 4 ? 41.80 : null,
                  gap: scenarioStep >= 6 ? +0.90 : (scenarioStep >= 4 ? +3.80 : 0), status: "conflict", isHero: true },
        { id: 6,  part: "Touch Controller IC",       target: 4.20,  quoted: 4.70,  should: 4.05,  gap: +0.50, status: "conflict" },
        { id: 10, part: "Mainboard 5G",              target: 28.00, quoted: 27.40, should: null,  gap: -0.60, status: "should-needed" },
        { id: 11, part: "Battery Cell 5000mAh",      target: 12.50, quoted: null,  should: null,  gap: 0,     status: "rfq-open" },
        { id: 12, part: "Camera Module 200MP",       target: 18.00, quoted: null,  should: null,  gap: 0,     status: "rfq-open" },
      ];

  // ===== RFQ status — supplier engagements pending (SM-CM collaboration) =====
  const rfqRows = isResolved ? [] : [
    { id: "r1", part: "Battery Cell 5000mAh",   meta: "Strategic spec. FEPT target $12.50. 0 quotes.", state: "open", urgent: true },
    { id: "r2", part: "Camera Module 200MP",    meta: "New ODM part. FEPT target $18.00. Supplier search needed.", state: "open", urgent: true },
    { id: "r3", part: "AMOLED Panel — alt",     meta: "Samsung Disp $40.20 / BOE $38.90 / LG $41.00", state: "progress", urgent: false },
  ];

  // ===== My action queue (CM-specific actions) =====
  const actionQueue = isResolved ? [] : [
    { id: "a1", title: "Resolve AMOLED cost conflict",   meta: "Quoted $38.90 vs Should $41.80 — verify supplier capability", status: "conflict", action: "Resolve" },
    { id: "a2", title: "Enter Should-cost for Battery Cell", meta: "3 items missing Should-cost",                                      status: "pending",  action: "Enter cost" },
    { id: "a3", title: "Confirm Camera Module RFQ target",   meta: "FEPT target $18.00 needs CM approval",                            status: "pending",  action: "Confirm" },
  ];

  // ===== KPI calculations =====
  const validQuotes = costRows.filter(r => r.quoted !== null);
  const validShould = costRows.filter(r => r.should !== null);
  const shouldVsQuotedGap = validQuotes.reduce((sum, r) => {
    if (r.should !== null && r.quoted !== null) return sum + (r.quoted - r.should);
    return sum;
  }, 0).toFixed(2);
  const shouldCoverage = `${validShould.length}/${costRows.length}`;
  const rfqOutstanding = rfqRows.filter(r => r.state === "open").length;
  const costConflicts = costRows.filter(r => r.status === "conflict").length;
  // Hero total project cost (mock aggregate)
  const totalCost = isResolved ? 384.50 : 392.10;
  const targetTotal = 386.00;
  const totalGap = (totalCost - targetTotal).toFixed(2);

  // Status meta for cost reconcile table
  const reconStatusMeta = {
    aligned:        { label: "Aligned",      bg: C.successLight, fg: C.success },
    reconciling:    { label: "Reconciling",  bg: C.warningLight, fg: C.warning },
    conflict:       { label: "Conflict",     bg: C.errorLight,   fg: C.error },
    "should-needed":{ label: "Should needed",bg: C.warningLight, fg: C.warning },
    "rfq-open":     { label: "RFQ open",     bg: C.bg,           fg: C.textSecondary },
  };

  // Action queue meta
  const actionMeta = {
    conflict: { label: "Conflict", bg: C.errorLight,   fg: C.error,   border: C.error },
    pending:  { label: "Pending",  bg: C.warningLight, fg: C.warning, border: C.warning },
  };

  // Format cents → dollar string (with sign for gaps)
  const fmt = (v) => v === null ? "—" : `$${v.toFixed(2)}`;
  const fmtGap = (v) => {
    if (v === null || v === 0) return "—";
    const sign = v > 0 ? "+" : "−";
    return `${sign}${Math.abs(v).toFixed(2)}`;
  };
  const gapColor = (v) => v > 0 ? C.error : v < 0 ? C.success : C.textDisabled;

  return (
    <div className="p-6" style={{ minHeight: "100%" }}>
      {/* AI Banner for CM */}
      <div className="mb-5 p-4 rounded-lg border flex items-start gap-3"
        style={{
          backgroundColor: isResolved ? C.successLight : C.primarySoft,
          borderColor: isResolved ? C.success : C.primaryLight,
        }}>
        <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
          style={{ backgroundColor: isResolved ? C.success : C.primary }}>
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold mb-0.5"
            style={{ color: isResolved ? C.successDark : C.primaryDark }}>
            {isResolved
              ? `Cost reconcile complete — All items aligned for ${project.phase} Phase Gate`
              : `${costConflicts} cost conflict${costConflicts !== 1 ? "s" : ""} · ${rfqOutstanding} RFQ outstanding · Action required`}
          </div>
          <div className="text-xs" style={{ color: C.textSecondary }}>
            {isResolved
              ? `Total cost ${fmt(totalCost)} (${fmtGap(parseFloat(totalGap))} vs target). All Should-costs confirmed.`
              : `AI Should-cost computed for ${validShould.length}/${costRows.length} parts. Awaiting Should-cost for ${costRows.length - validShould.length} more.`}
          </div>
        </div>
        <button
          onClick={() => setView && setView("bom")}
          className="text-[11px] font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 shrink-0"
          style={{ color: isResolved ? C.success : C.primary }}>
          {isResolved ? "View C-BOM →" : "Open cost reconcile →"}
        </button>
      </div>

      {/* KPI Row — CM-specific (5 cards) */}
      <div className="grid grid-cols-5 gap-4 mb-5">
        <KpiCard
          icon={DollarSign}
          iconColor={parseFloat(shouldVsQuotedGap) > 0 ? C.error : C.success}
          label="Should vs Quoted Gap"
          value={`${parseFloat(shouldVsQuotedGap) >= 0 ? "+" : "−"}$${Math.abs(parseFloat(shouldVsQuotedGap)).toFixed(2)}`}
          sub={parseFloat(shouldVsQuotedGap) >= 0 ? "Quoted higher" : "Quoted lower"} />

        <KpiCard
          icon={Target}
          iconColor={validShould.length < costRows.length ? C.warning : C.success}
          label="Should-cost Coverage"
          value={shouldCoverage}
          sub={validShould.length < costRows.length
            ? `${costRows.length - validShould.length} parts need Should-cost`
            : "All parts covered"} />

        <KpiCard
          icon={Send}
          iconColor={rfqOutstanding > 0 ? C.warning : C.success}
          label="RFQ Outstanding"
          value={rfqOutstanding}
          sub={rfqOutstanding > 0 ? "Battery + Camera" : "All received"} />

        <KpiCard
          icon={AlertTriangle}
          iconColor={costConflicts > 0 ? C.error : C.success}
          label="Cost Conflicts"
          value={costConflicts}
          sub={costConflicts > 0 ? "AMOLED + Touch IC" : "All clear"} />

        <KpiCard
          icon={Layers}
          iconColor={parseFloat(totalGap) > 0 ? C.error : C.success}
          label="Total Cost"
          value={`$${totalCost.toFixed(2)}`}
          sub={`${fmtGap(parseFloat(totalGap))} vs target`} />
      </div>

      {/* Cost Reconcile Table — full width */}
      <div className="rounded-xl border bg-white mb-5" style={{ borderColor: C.border }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: C.border }}>
          <div>
            <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>Cost Reconcile — Rev B</div>
            <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>
              FEPT Target · Quoted · Should-cost · Gap
            </div>
          </div>
          <button onClick={() => setView && setView("bom")}
            className="text-xs font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{ color: C.primary }}>
            Open cost reconcile →
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ color: C.textDisabled, borderBottom: `1px solid ${C.borderLight}` }}>
              <th className="text-left font-semibold text-[10px] uppercase tracking-wider py-2.5 px-5">Part</th>
              <th className="text-right font-semibold text-[10px] uppercase tracking-wider py-2.5 px-3">Target</th>
              <th className="text-right font-semibold text-[10px] uppercase tracking-wider py-2.5 px-3">Quoted</th>
              <th className="text-right font-semibold text-[10px] uppercase tracking-wider py-2.5 px-3">Should-cost</th>
              <th className="text-right font-semibold text-[10px] uppercase tracking-wider py-2.5 px-3">Gap (Q−T)</th>
              <th className="text-left font-semibold text-[10px] uppercase tracking-wider py-2.5 px-5 w-32">Status</th>
            </tr>
          </thead>
          <tbody>
            {costRows.map((r) => {
              const meta = reconStatusMeta[r.status] || reconStatusMeta.reconciling;
              const isConflict = r.status === "conflict";
              return (
                <tr key={r.id}
                  onClick={() => onOpenItem && onOpenItem(r.id)}
                  className="cursor-pointer transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2"
                  style={{
                    borderBottom: `1px solid ${C.borderLight}`,
                    backgroundColor: isConflict ? "rgba(211,47,47,0.04)" : "white",
                  }}>
                  <td className="py-3 px-5 text-sm font-medium"
                    style={{ color: isConflict ? C.error : C.textPrimary }}>
                    {r.part}
                  </td>
                  <td className="py-3 px-3 text-right text-sm font-mono" style={{ color: C.textPrimary }}>
                    {fmt(r.target)}
                  </td>
                  <td className="py-3 px-3 text-right text-sm font-mono" style={{ color: r.quoted !== null ? C.textPrimary : C.textDisabled }}>
                    {fmt(r.quoted)}
                  </td>
                  <td className="py-3 px-3 text-right text-sm font-mono" style={{ color: r.should !== null ? C.textPrimary : C.textDisabled }}>
                    {fmt(r.should)}
                  </td>
                  <td className="py-3 px-3 text-right text-sm font-mono font-semibold" style={{ color: gapColor(r.gap) }}>
                    {fmtGap(r.gap)}
                  </td>
                  <td className="py-3 px-5">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded inline-block"
                      style={{ backgroundColor: meta.bg, color: meta.fg }}>
                      {meta.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Row: RFQ Status (1/2) + My Action Queue (1/2) */}
      <div className="grid grid-cols-2 gap-4">
        {/* RFQ Status */}
        <div className="rounded-xl border bg-white" style={{ borderColor: C.border }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: C.border }}>
            <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>RFQ Status</div>
            <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>
              Supplier quote engagement progress
            </div>
          </div>
          {rfqRows.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-10 h-10 mx-auto mb-2" style={{ color: C.success }} />
              <div className="text-sm font-medium mb-1" style={{ color: C.textPrimary }}>All RFQs received</div>
              <div className="text-xs" style={{ color: C.textSecondary }}>No outstanding supplier engagements.</div>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: C.borderLight }}>
              {rfqRows.map((r) => (
                <div key={r.id} className="px-5 py-3 flex items-start gap-3 transition-colors hover:bg-gray-50">
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: r.urgent ? C.error : C.warning }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>{r.part}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>{r.meta}</div>
                  </div>
                  <span className="text-[11px] font-medium shrink-0"
                    style={{ color: r.state === "open" ? C.error : C.warning }}>
                    {r.state === "open" ? "Open" : "In progress"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Action Queue */}
        <div className="rounded-xl border bg-white" style={{ borderColor: C.border }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: C.border }}>
            <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>My Action Queue</div>
            <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>
              CM tasks requiring your input
            </div>
          </div>
          {actionQueue.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-10 h-10 mx-auto mb-2" style={{ color: C.success }} />
              <div className="text-sm font-medium mb-1" style={{ color: C.textPrimary }}>All actions cleared</div>
              <div className="text-xs" style={{ color: C.textSecondary }}>Nothing pending on your queue.</div>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: C.borderLight }}>
              {actionQueue.map((a) => {
                const meta = actionMeta[a.status];
                return (
                  <div key={a.id} className="px-5 py-3 flex items-center gap-3 transition-colors hover:bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>{a.title}</div>
                      <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>{a.meta}</div>
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded shrink-0"
                      style={{ backgroundColor: meta.bg, color: meta.fg }}>
                      {meta.label}
                    </span>
                    <button
                      onClick={() => setView && setView("bom")}
                      className="h-7 px-2.5 rounded-md text-[11px] font-semibold border transition-colors shrink-0 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                      style={{ borderColor: meta.border, color: meta.border, backgroundColor: "white" }}>
                      {a.action}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// === SM COCKPIT ===
// Sourcing Manager-focused dashboard:
// 5 KPIs (GCM Input Needed, Commodity Exposure, Sole Source, Geo Exposure, Alt Sourcing)
// + Market Commodities tracker + SSS Risk Dashboard + My GCM Action Queue
function SmCockpit({ project, scenarioStep, isResolved, onOpenItem, setView }) {
  // ===== Mock data — Market commodities (live tracking) =====
  // Each item: 52w-low → 52w-high range with current position as % (0-100)
  // Hero project uses smartphone-relevant commodities (Copper for wiring, Lithium for battery, etc.)
  const commodities = [
    { id: "cu",     name: "Copper (Cu)",   source: "LME",    pos: 78, price: "$9,340/t",  ytd: "+16%", trend: "up",   risk: "high" },
    { id: "li",     name: "Lithium (Li)",  source: "CNEV",   pos: 52, price: "$15,200/t", ytd: "−8%",  trend: "down", risk: "low"  },
    { id: "co",     name: "Cobalt (Co)",   source: "LME",    pos: 64, price: "$33,100/t", ytd: "+4%",  trend: "up",   risk: "med"  },
    { id: "nand",   name: "NAND Flash",    source: "DRAMeX", pos: 42, price: "$4.20/GB",  ytd: "−12%", trend: "down", risk: "low"  },
    { id: "amoled", name: "AMOLED Panel",  source: "OMDIA",  pos: 70, price: "$78/unit",  ytd: "+9%",  trend: "up",   risk: "med"  },
    { id: "al",     name: "Al 6061",       source: "LME",    pos: 88, price: "$2,650/t",  ytd: "+22%", trend: "up",   risk: "high" },
  ];

  // ===== SSS Risk dashboard (Sole / Single / Dual+) =====
  // Initial: project is over targets on sole/single source
  const sssRisk = isResolved
    ? [
        { label: "Sole source",   value: 8,  target: 10, color: C.success },
        { label: "Single source", value: 12, target: 15, color: C.success },
        { label: "Dual+",         value: 80, target: 75, color: C.success },
      ]
    : [
        { label: "Sole source",   value: 18, target: 10, color: C.error },
        { label: "Single source", value: 24, target: 15, color: C.warning },
        { label: "Dual+",         value: 58, target: 75, color: C.warning },
      ];

  // ===== My GCM Action Queue =====
  const actionQueue = isResolved ? [] : [
    { id: "a1", title: "AMOLED Panel — sole source risk",
      meta: "BOE selected. Recommend qualifying secondary supplier.",
      state: "urgent", action: "Add alt" },
    { id: "a2", title: "Copper wiring — dual source plan",
      meta: "Furukawa primary · Tatsuta in qualification",
      state: "progress", action: "Update" },
    { id: "a3", title: "Battery Cell sourcing",
      meta: "No supplier · Spec finalized · RFQ ready to send",
      state: "open", action: "Send RFQ" },
    { id: "a4", title: "Al 6061 index alert",
      meta: "Price +22% YTD · 3 BOM parts exposed (frame, brackets)",
      state: "alert", action: "Review" },
  ];

  // ===== KPI calculations =====
  const itemsNeedingInput = isResolved ? 0 : 4;
  const commodityExposure = isResolved ? "$8.2k" : "$11.2k"; // $ at risk from volatile materials
  const soleSourceCount = isResolved ? 4 : 9;
  const soleSourcePct = isResolved ? 8 : 18;
  const geoExposure = isResolved ? 28 : 38; // % of suppliers in single geo (China)
  const altSourcingActive = isResolved ? 0 : 3;

  // ===== Helpers =====
  const commodityBarColor = (risk) => risk === "high" ? C.error : risk === "med" ? C.warning : C.success;
  const ytdColor = (trend) => trend === "up" ? C.error : trend === "down" ? C.success : C.textSecondary;

  const actionMeta = {
    urgent:   { label: "Urgent",      bg: C.errorLight,   fg: C.error,   border: C.error,   filled: true  },
    progress: { label: "In progress", bg: C.warningLight, fg: C.warning, border: C.warning, filled: false },
    open:     { label: "Open",        bg: C.warningLight, fg: C.warning, border: C.warning, filled: false },
    alert:    { label: "Alert",       bg: C.errorLight,   fg: C.error,   border: C.error,   filled: false },
  };

  return (
    <div className="p-6" style={{ minHeight: "100%" }}>
      {/* AI Banner for SM */}
      <div className="mb-5 p-4 rounded-lg border flex items-start gap-3"
        style={{
          backgroundColor: isResolved ? C.successLight : C.primarySoft,
          borderColor: isResolved ? C.success : C.primaryLight,
        }}>
        <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
          style={{ backgroundColor: isResolved ? C.success : C.primary }}>
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold mb-0.5"
            style={{ color: isResolved ? C.successDark : C.primaryDark }}>
            {isResolved
              ? `Sourcing strategy aligned — All risk targets within range`
              : `Sole source ${soleSourcePct}% above ${10}% target · Al 6061 index +22% YTD`}
          </div>
          <div className="text-xs" style={{ color: C.textSecondary }}>
            {isResolved
              ? `${altSourcingActive === 0 ? "All alt sourcing qualified" : `${altSourcingActive} alt sourcing in progress`}. Commodity exposure reduced to ${commodityExposure}.`
              : `${itemsNeedingInput} items need GCM input. ${altSourcingActive} alt sourcing evaluations active.`}
          </div>
        </div>
        <button
          onClick={() => setView && setView("bom")}
          className="text-[11px] font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 shrink-0"
          style={{ color: isResolved ? C.success : C.primary }}>
          {isResolved ? "View C-BOM →" : "Open sourcing view →"}
        </button>
      </div>

      {/* KPI Row — SM-specific (5 cards) */}
      <div className="grid grid-cols-5 gap-4 mb-5">
        <KpiCard
          icon={AtSign}
          iconColor={itemsNeedingInput > 0 ? C.error : C.success}
          label="Items Needing GCM Input"
          value={itemsNeedingInput}
          sub={itemsNeedingInput > 0 ? "Aligned cost not set" : "All set"} />

        <KpiCard
          icon={DollarSign}
          iconColor={C.warning}
          label="Commodity Exposure"
          value={commodityExposure}
          sub="CRM / volatile materials" />

        <KpiCard
          icon={AlertTriangle}
          iconColor={soleSourcePct > 10 ? C.error : C.success}
          label="Sole Source Items"
          value={soleSourceCount}
          sub={`${soleSourcePct}% of BOM · Target 10%`} />

        <KpiCard
          icon={Layers}
          iconColor={geoExposure > 35 ? C.error : C.success}
          label="China Geo Exposure"
          value={`${geoExposure}%`}
          sub={geoExposure > 35 ? "Above 35% threshold" : "Within threshold"} />

        <KpiCard
          icon={GitMerge}
          iconColor={altSourcingActive > 0 ? C.info : C.success}
          label="Alt Sourcing Active"
          value={altSourcingActive}
          sub={altSourcingActive > 0 ? "Evaluation in progress" : "None active"} />
      </div>

      {/* Market Commodities — full width */}
      <div className="rounded-xl border bg-white mb-5" style={{ borderColor: C.border }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: C.border }}>
          <div>
            <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>
              Market Commodities — Live Tracking
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>
              High-volatility items requiring GCM response
            </div>
          </div>
          <button onClick={() => setView && setView("bom")}
            className="text-xs font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{ color: C.primary }}>
            Full commodity view →
          </button>
        </div>
        <div className="px-5 py-3 divide-y" style={{ borderColor: C.borderLight }}>
          {commodities.map((c) => (
            <div key={c.id} className="py-2.5 grid grid-cols-12 items-center gap-3">
              {/* Name + Source */}
              <div className="col-span-3 min-w-0">
                <div className="text-sm font-medium" style={{ color: C.textPrimary }}>
                  {c.name}
                  <span className="ml-1.5 text-[10px] font-mono" style={{ color: C.textDisabled }}>
                    {c.source}
                  </span>
                </div>
              </div>
              {/* Range bar with current position */}
              <div className="col-span-6 relative">
                <div className="h-1.5 rounded-full" style={{ backgroundColor: C.borderLight }}>
                  <div className="h-1.5 rounded-full transition-all"
                    style={{ width: `${c.pos}%`, backgroundColor: commodityBarColor(c.risk) }} />
                </div>
                <div className="flex justify-between text-[10px] mt-0.5" style={{ color: C.textDisabled }}>
                  <span>52w low</span>
                  <span>52w high</span>
                </div>
              </div>
              {/* Price */}
              <div className="col-span-2 text-right">
                <span className="text-sm font-mono font-semibold" style={{ color: commodityBarColor(c.risk) }}>
                  {c.price}
                </span>
              </div>
              {/* YTD */}
              <div className="col-span-1 text-right">
                <span className="text-[11px] font-semibold inline-flex items-center gap-0.5 justify-end"
                  style={{ color: ytdColor(c.trend) }}>
                  {c.trend === "up" ? <TrendingUp className="w-3 h-3" /> : c.trend === "down" ? <TrendingDown className="w-3 h-3" /> : null}
                  {c.ytd} YTD
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row: SSS Risk Dashboard (1/2) + My GCM Action Queue (1/2) */}
      <div className="grid grid-cols-2 gap-4">
        {/* SSS Risk Dashboard */}
        <div className="rounded-xl border bg-white" style={{ borderColor: C.border }}>
          <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: C.border }}>
            <div>
              <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>SSS Risk Dashboard</div>
              <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>
                Sole / Single / Dual+ source distribution
              </div>
            </div>
            <button onClick={() => setView && setView("bom")}
              className="text-xs font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              style={{ color: C.primary }}>
              Full risk view →
            </button>
          </div>
          <div className="px-5 py-5 space-y-4">
            {sssRisk.map((r) => (
              <div key={r.label}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span style={{ color: C.textSecondary }}>{r.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold" style={{ color: r.color }}>{r.value}%</span>
                    <span className="text-[10px]" style={{ color: C.textDisabled }}>Target {r.target}%</span>
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden relative" style={{ backgroundColor: C.borderLight }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, r.value)}%`, backgroundColor: r.color }} />
                  {/* Target marker */}
                  <div className="absolute top-0 bottom-0 w-px"
                    style={{
                      left: `${Math.min(100, r.target)}%`,
                      backgroundColor: C.textPrimary,
                      opacity: 0.4,
                    }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My GCM Action Queue */}
        <div className="rounded-xl border bg-white" style={{ borderColor: C.border }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: C.border }}>
            <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>My GCM Action Queue</div>
            <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>
              Sourcing decisions requiring your input
            </div>
          </div>
          {actionQueue.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-10 h-10 mx-auto mb-2" style={{ color: C.success }} />
              <div className="text-sm font-medium mb-1" style={{ color: C.textPrimary }}>All actions cleared</div>
              <div className="text-xs" style={{ color: C.textSecondary }}>Nothing pending on your queue.</div>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: C.borderLight }}>
              {actionQueue.map((a) => {
                const meta = actionMeta[a.state];
                return (
                  <div key={a.id} className="px-5 py-3 flex items-center gap-3 transition-colors hover:bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>{a.title}</div>
                      <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>{a.meta}</div>
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded shrink-0"
                      style={{ backgroundColor: meta.bg, color: meta.fg }}>
                      {meta.label}
                    </span>
                    <button
                      onClick={() => setView && setView("bom")}
                      className="h-7 px-2.5 rounded-md text-[11px] font-semibold transition-colors shrink-0 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                      style={{
                        border: meta.filled ? "none" : `1px solid ${meta.border}`,
                        color: meta.filled ? "white" : meta.border,
                        backgroundColor: meta.filled ? meta.border : "white",
                      }}>
                      {a.action}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// === APQP GANTT CHART (reusable, always-expanded) ===
// Standalone gantt visualization of APQP 5-phase program.
// Embedded in QM Cockpit while the standalone APQP page is hidden.
function ApqpGanttChart() {
  const phases = [
    { name: "Phase 1: Plan & Define",      start: 0,  end: 16,  status: "complete" },
    { name: "Phase 2: Product Design",     start: 10, end: 48,  status: "complete" },
    { name: "Phase 3: Process Design",     start: 41, end: 58,  status: "active" },
    { name: "Phase 4: Validation",         start: 51, end: 70,  status: "active" },
    { name: "Phase 5: Feedback & Improve", start: 70, end: 100, status: "pending" },
  ];
  const todayPos = 60;
  return (
    <div className="rounded-xl border bg-white p-5 mb-5" style={{ borderColor: C.border }}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>APQP Program Timeline</div>
          <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>
            Advanced Product Quality Planning — 5-phase progress
          </div>
        </div>
        <div className="flex items-center gap-3 text-[10px]" style={{ color: C.textSecondary }}>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: C.success }} />Complete</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: C.info }} />Active</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: C.textDisabled }} />Pending</span>
        </div>
      </div>
      <div className="relative">
        <div className="flex justify-between text-[9px] font-mono mb-1 pl-44" style={{ color: C.textDisabled }}>
          <span>03/16</span>
          <span>03/30</span>
          <span>04/13</span>
          <span>04/27</span>
          <span>05/08</span>
        </div>
        {phases.map((ph, i) => {
          const color = ph.status === "complete" ? C.success : ph.status === "active" ? C.info : C.textDisabled;
          const lightColor = ph.status === "complete" ? C.successLight : ph.status === "active" ? C.infoLight : C.bg;
          return (
            <div key={i} className="flex items-center mb-1.5" style={{ height: 22 }}>
              <div className="w-44 pr-3 text-[10px] font-medium" style={{ color: C.textPrimary }}>
                {ph.name}
              </div>
              <div className="flex-1 relative rounded h-5" style={{ backgroundColor: C.bg }}>
                <div className="absolute top-0 bottom-0 rounded flex items-center px-2"
                  style={{
                    left: `${ph.start}%`,
                    width: `${ph.end - ph.start}%`,
                    backgroundColor: lightColor,
                    border: `1px solid ${color}`,
                  }}>
                  <div className="text-[9px] font-bold" style={{ color: color }}>
                    {ph.status === "complete" ? "✓" : ph.status === "active" ? "●" : "○"}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        <div className="absolute pointer-events-none"
          style={{
            left: `calc(11rem + (100% - 11rem) * ${todayPos / 100})`,
            top: 14,
            bottom: 0,
            width: 0,
          }}>
          <div className="absolute h-full" style={{ width: 2, backgroundColor: C.primary, left: 0 }} />
          <div className="absolute -top-3 -left-4 text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap"
            style={{ backgroundColor: C.primary, color: "white" }}>
            TODAY
          </div>
        </div>
      </div>
    </div>
  );
}

// === QM COCKPIT ===
// Quality Manager-focused dashboard:
// 5 KPIs (PPAP Items Open, PCR Requiring SQE, DVT Issues, Spec Changes to Review, New Parts No PPAP)
// + PCR Tracker (cross-functional SSOT) + PPAP Status + DVT Open Issues
function QmCockpit({ project, scenarioStep, isResolved, onOpenItem, setView }) {
  // ===== PCR Tracker — Part Change Requests requiring cross-functional review =====
  // Columns: DE owner, SQE reviewer, CM cost confirmer, Status
  // For Hero: AMOLED + spec/cost issues
  const pcrRows = isResolved
    ? [
        { id: 3,  code: "BPM-DIS-AMOLED", part: "AMOLED Panel 6.7\" — spec upgrade", de: "done", sqe: "done", cm: "done", status: "approved" },
        { id: 2,  code: "BPM-DIS-MODULE", part: "Display Module 6.7\" — brightness 1500 nits", de: "done", sqe: "done", cm: "done", status: "approved" },
        { id: 10, code: "BPM-MNB-5G",     part: "Mainboard 5G — risk re-assessment", de: "done", sqe: "done", cm: "done", status: "approved" },
        { id: 4,  code: "BPM-DIS-POLZR",  part: "Polarizer Film — material spec", de: "done", sqe: "done", cm: "done", status: "approved" },
      ]
    : [
        { id: 3,  code: "BPM-DIS-AMOLED", part: "AMOLED Panel 6.7\" — spec upgrade",
          de: "done", sqe: "pending", cm: "pending", status: "conflict" },
        { id: 6,  code: "BPM-DIS-TIC",    part: "Touch Controller IC — price +6.7%",
          de: "done", sqe: "review", cm: "review", status: "in-review" },
        { id: 2,  code: "BPM-DIS-MODULE", part: "Display Module 6.7\" — brightness upgrade",
          de: "done", sqe: "done", cm: "done", status: "approved" },
        { id: 11, code: "BPM-BAT-CELL",   part: "Battery Cell 5000mAh — new part (regulatory)",
          de: "done", sqe: "pending", cm: "pending", status: "sqe-needed" },
        { id: 7,  code: "BPM-DIS-GLASS",  part: "Cover Glass — thickness change",
          de: "pending", sqe: "pending", cm: "pending", status: "pending" },
      ];

  // ===== PPAP Status — per-part PPAP progress =====
  const ppapStatus = isResolved
    ? [
        { id: 3,  part: "AMOLED Panel (BOE)",        ppapLevel: 3, progress: 100, state: "complete" },
        { id: 2,  part: "Display Module (Samsung)",  ppapLevel: 3, progress: 100, state: "complete" },
        { id: 10, part: "Mainboard 5G (Samsung)",    ppapLevel: 3, progress: 95,  state: "complete" },
        { id: 6,  part: "Touch Controller IC (Synaptics)", ppapLevel: 2, progress: 92, state: "complete" },
        { id: 4,  part: "Polarizer Film (Nitto)",    ppapLevel: 2, progress: 100, state: "complete" },
      ]
    : [
        { id: 10, part: "Mainboard 5G (Samsung Foundry)", ppapLevel: 3, progress: 65, state: "in-progress" },
        { id: 3,  part: "AMOLED Panel (BOE)",             ppapLevel: 3, progress: 12, state: "in-progress" },
        { id: 2,  part: "Display Module (Samsung)",       ppapLevel: 3, progress: 100, state: "complete" },
        { id: 11, part: "Battery Cell 5000mAh",           ppapLevel: 3, progress: 0,  state: "not-started" },
        { id: 12, part: "Camera Module 200MP",            ppapLevel: 2, progress: 0,  state: "not-started" },
      ];

  // ===== DVT Open Issues =====
  const dvtIssues = isResolved ? [] : [
    { id: "d1", title: "AMOLED Panel 6.7\" — 120Hz validation",
      detail: "Touch latency & color accuracy. Apr 28.",
      due: "Apr 28", urgent: true },
    { id: "d2", title: "Mainboard 5G — thermal scenario",
      detail: "AMOLED draws +12% — re-run May 5.",
      due: "May 5", urgent: false },
  ];

  // ===== KPI calculations =====
  const ppapInProgress = ppapStatus.filter(p => p.state === "in-progress").length;
  const ppapNotStarted = ppapStatus.filter(p => p.state === "not-started").length;
  const ppapItemsOpen = ppapInProgress + ppapNotStarted;
  const pcrRequiringSqe = pcrRows.filter(p => p.sqe === "pending" || p.sqe === "review").length;
  const dvtIssuesOpen = dvtIssues.length;
  const specChangesToReview = isResolved ? 0 : 7;
  const newPartsNoPpap = isResolved ? 0 : 2; // Battery Cell + Camera Module

  // ===== Helpers =====
  // Role indicator dot — colored based on completion
  const roleStatusDot = (state, persona) => {
    const meta = {
      done:    { bg: PERSONAS[persona]?.color || C.success, text: "white",     opacity: 1 },
      review:  { bg: C.warning, text: "white",     opacity: 1 },
      pending: { bg: C.bg,      text: C.textDisabled, opacity: 1 },
    }[state] || { bg: C.bg, text: C.textDisabled, opacity: 1 };
    return (
      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border"
        style={{ backgroundColor: meta.bg, color: meta.text, borderColor: state === "pending" ? C.border : "transparent" }}>
        {persona === "CM" ? "GC" : persona === "DE" ? "DE" : persona === "QM" ? "SQ" : persona}
      </div>
    );
  };

  const pcrStatusMeta = {
    approved:     { label: "Approved",    bg: C.successLight, fg: C.success },
    "in-review":  { label: "In review",   bg: C.warningLight, fg: C.warning },
    conflict:     { label: "Conflict",    bg: C.errorLight,   fg: C.error },
    "sqe-needed": { label: "SQE needed",  bg: C.warningLight, fg: C.warning },
    pending:      { label: "Pending",     bg: C.warningLight, fg: C.warning },
  };

  const ppapBarColor = (state, progress) => {
    if (state === "complete") return C.success;
    if (state === "not-started") return C.borderLight;
    if (progress < 30) return C.error;
    return C.warning;
  };
  const ppapStateLabel = (state) => ({
    complete: "Complete",
    "in-progress": "In progress",
    "not-started": "Not started",
  })[state] || state;

  return (
    <div className="p-6" style={{ minHeight: "100%" }}>
      {/* AI Banner for QM */}
      <div className="mb-5 p-4 rounded-lg border flex items-start gap-3"
        style={{
          backgroundColor: isResolved ? C.successLight : C.primarySoft,
          borderColor: isResolved ? C.success : C.primaryLight,
        }}>
        <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
          style={{ backgroundColor: isResolved ? C.success : C.primary }}>
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold mb-0.5"
            style={{ color: isResolved ? C.successDark : C.primaryDark }}>
            {isResolved
              ? `Quality validation complete — All PPAP cleared for ${project.phase} Phase Gate`
              : `${ppapItemsOpen} PPAP items open · ${pcrRequiringSqe} PCR requiring SQE review`}
          </div>
          <div className="text-xs" style={{ color: C.textSecondary }}>
            {isResolved
              ? "All process sign-offs from DE, SQE, and GCM aligned. PPAP submissions verified."
              : `${dvtIssuesOpen} DVT issue${dvtIssuesOpen !== 1 ? "s" : ""} open. ${specChangesToReview} spec changes need quality review.`}
          </div>
        </div>
        <button
          onClick={() => setView && setView("bom")}
          className="text-[11px] font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 shrink-0"
          style={{ color: isResolved ? C.success : C.primary }}>
          {isResolved ? "View Q-BOM →" : "Open Q-BOM →"}
        </button>
      </div>

      {/* APQP Program Timeline — top of QM Overview (replaces standalone APQP menu) */}
      <ApqpGanttChart />

      {/* KPI Row — QM-specific (5 cards) */}
      <div className="grid grid-cols-5 gap-4 mb-5">
        <KpiCard
          icon={ShieldCheck}
          iconColor={ppapItemsOpen > 0 ? C.error : C.success}
          label="PPAP Items Open"
          value={ppapItemsOpen}
          sub={ppapItemsOpen > 0 ? "DVT phase target 0" : "All cleared"} />

        <KpiCard
          icon={AtSign}
          iconColor={pcrRequiringSqe > 0 ? C.warning : C.success}
          label="PCR Requiring SQE"
          value={pcrRequiringSqe}
          sub={pcrRequiringSqe > 0 ? "Part change requests" : "All reviewed"} />

        <KpiCard
          icon={AlertTriangle}
          iconColor={dvtIssuesOpen > 0 ? C.error : C.success}
          label="DVT Issues Open"
          value={dvtIssuesOpen}
          sub={dvtIssuesOpen > 0 ? "Validation pending" : "All resolved"} />

        <KpiCard
          icon={GitBranch}
          iconColor={specChangesToReview > 0 ? C.info : C.success}
          label="Spec Changes to Review"
          value={specChangesToReview}
          sub="Rev B vs Rev A" />

        <KpiCard
          icon={Package}
          iconColor={newPartsNoPpap > 0 ? C.error : C.success}
          label="New Parts (No PPAP)"
          value={newPartsNoPpap}
          sub={newPartsNoPpap > 0 ? "Battery + Camera" : "All registered"} />
      </div>

      {/* PCR Tracker — full width */}
      <div className="rounded-xl border bg-white mb-5" style={{ borderColor: C.border }}>
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: C.border }}>
          <div>
            <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>
              PCR Tracker — Cross-functional SSOT
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>
              Engineering · SQE · GCM — same real-time view
            </div>
          </div>
          <button onClick={() => setView && setView("bom")}
            className="text-xs font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{ color: C.primary }}>
            Open BOM workspace →
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ color: C.textDisabled, borderBottom: `1px solid ${C.borderLight}` }}>
              <th className="text-left font-semibold text-[10px] uppercase tracking-wider py-2.5 px-5 w-40">Code</th>
              <th className="text-left font-semibold text-[10px] uppercase tracking-wider py-2.5 px-3">Part & Change</th>
              <th className="text-center font-semibold text-[10px] uppercase tracking-wider py-2.5 px-2 w-12">DE</th>
              <th className="text-center font-semibold text-[10px] uppercase tracking-wider py-2.5 px-2 w-12">SQE</th>
              <th className="text-center font-semibold text-[10px] uppercase tracking-wider py-2.5 px-2 w-12">GCM</th>
              <th className="text-left font-semibold text-[10px] uppercase tracking-wider py-2.5 px-5 w-32">Status</th>
            </tr>
          </thead>
          <tbody>
            {pcrRows.map((r) => {
              const meta = pcrStatusMeta[r.status] || pcrStatusMeta.pending;
              return (
                <tr key={r.id}
                  onClick={() => onOpenItem && onOpenItem(r.id)}
                  className="cursor-pointer transition-colors hover:bg-gray-50"
                  style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                  <td className="py-3 px-5 text-xs font-mono" style={{ color: C.textDisabled }}>
                    {r.code}
                  </td>
                  <td className="py-3 px-3 text-sm font-medium" style={{ color: C.textPrimary }}>
                    {r.part}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <div className="inline-flex justify-center">{roleStatusDot(r.de, "DE")}</div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <div className="inline-flex justify-center">{roleStatusDot(r.sqe, "QM")}</div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <div className="inline-flex justify-center">{roleStatusDot(r.cm, "CM")}</div>
                  </td>
                  <td className="py-3 px-5">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded inline-block"
                      style={{ backgroundColor: meta.bg, color: meta.fg }}>
                      {meta.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Row: PPAP Status (1/2) + DVT Open Issues (1/2) */}
      <div className="grid grid-cols-2 gap-4">
        {/* PPAP Status */}
        <div className="rounded-xl border bg-white" style={{ borderColor: C.border }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: C.border }}>
            <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>PPAP Status</div>
            <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>
              Per-part PPAP submission progress
            </div>
          </div>
          <div className="divide-y" style={{ borderColor: C.borderLight }}>
            {ppapStatus.map((p) => (
              <div key={p.id} className="px-5 py-3 transition-colors hover:bg-gray-50">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>{p.part}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>
                      PPAP Level {p.ppapLevel} · {ppapStateLabel(p.state)}
                    </div>
                  </div>
                  <span className="text-[11px] font-medium ml-2 shrink-0"
                    style={{ color: p.state === "complete" ? C.success : p.state === "in-progress" ? C.warning : C.textDisabled }}>
                    {ppapStateLabel(p.state)}
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: C.borderLight }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${p.progress}%`, backgroundColor: ppapBarColor(p.state, p.progress) }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DVT Open Issues */}
        <div className="rounded-xl border bg-white" style={{ borderColor: C.border }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: C.border }}>
            <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>DVT Open Issues</div>
            <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>
              Design verification test results pending
            </div>
          </div>
          {dvtIssues.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-10 h-10 mx-auto mb-2" style={{ color: C.success }} />
              <div className="text-sm font-medium mb-1" style={{ color: C.textPrimary }}>All DVT issues resolved</div>
              <div className="text-xs" style={{ color: C.textSecondary }}>No outstanding validations.</div>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: C.borderLight }}>
              {dvtIssues.map((d) => (
                <div key={d.id} className="px-5 py-3 flex items-start gap-3 transition-colors hover:bg-gray-50">
                  <div className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                    style={{ backgroundColor: d.urgent ? C.error : C.warning }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>{d.title}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>{d.detail}</div>
                  </div>
                  <span className="text-[11px] font-medium shrink-0"
                    style={{ color: d.due === "TBD" ? C.textDisabled : C.textSecondary }}>
                    {d.due}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// For non-hero projects, generate generic blocking items
function generateGenericBlockingItems(project) {
  if (project.blocking === 0) return [];
  const templates = [
    { id: 100, partId: "PART-XYZ-001", partName: "Critical Component A",
      blockReason: "Design review pending — 3 days overdue",
      status: { D: "warn", C: "ok", Q: "ok" } },
    { id: 101, partId: "PART-XYZ-002", partName: "Critical Component B",
      blockReason: "Cost variance with target (+8%)",
      status: { D: "ok", C: "warn", Q: "ok" } },
    { id: 102, partId: "PART-XYZ-003", partName: "Critical Component C",
      blockReason: "Supplier feasibility check required",
      status: { D: "ok", C: "ok", Q: "ok" } },
    { id: 103, partId: "PART-XYZ-004", partName: "Critical Component D",
      blockReason: "PPAP Level not yet determined",
      status: { D: "ok", C: "ok", Q: "warn" } },
    { id: 104, partId: "PART-XYZ-005", partName: "Critical Component E",
      blockReason: "Multiple specs changed — impact analysis needed",
      status: { D: "block", C: "warn", Q: "warn" } },
  ];
  return templates.slice(0, project.blocking);
}

function KpiCard({ icon: Icon, iconColor, label, value, sub }) {
  return (
    <div className="p-4 rounded-xl border bg-white" style={{ borderColor: C.border }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-md flex items-center justify-center"
          style={{ backgroundColor: `${iconColor}20` }}>
          <Icon className="w-3.5 h-3.5" style={{ color: iconColor }} />
        </div>
        <span className="text-xs font-medium" style={{ color: C.textSecondary }}>{label}</span>
      </div>
      <div className="text-2xl font-bold tracking-tight" style={{ color: C.textPrimary }}>{value}</div>
      <div className="text-[11px] mt-0.5" style={{ color: C.textDisabled }}>{sub}</div>
    </div>
  );
}

function ReadinessRing({ value }) {
  const r = 50;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const color = value >= 90 ? C.success : value >= 70 ? C.warning : C.error;
  return (
    <div className="relative" style={{ width: 130, height: 130 }}>
      <svg width="130" height="130" className="-rotate-90">
        <circle cx="65" cy="65" r={r} fill="none" stroke={C.borderLight} strokeWidth="10" />
        <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-3xl font-bold" style={{ color }}>{value}%</span>
        <span className="text-[10px]" style={{ color: C.textSecondary }}>Ready</span>
      </div>
    </div>
  );
}

// === SCREEN: GENERAL INFO (Project meta + Shared Files + Collaborators) ===
function GeneralInfo({ activeProjectCode, activePersona, setActivePersona }) {
  const project = PROJECTS.find((p) => p.code === activeProjectCode) || PROJECTS[0];
  const meta = PROJECT_META[activeProjectCode] || PROJECT_META[ACTIVE_PROJECT_CODE];
  const [fileFilter, setFileFilter] = useState("all");

  // Project-scoped data — new projects start empty
  const projectFiles = getSharedFilesForProject(project);
  const projectCollaborators = getCollaboratorsForProject(project);

  const fileFilters = [
    { id: "all", label: "All", count: projectFiles.length },
    { id: "Design", label: "Design", count: projectFiles.filter(f => f.category === "Design").length },
    { id: "Cost", label: "Cost", count: projectFiles.filter(f => f.category === "Cost").length },
    { id: "Sourcing", label: "Sourcing", count: projectFiles.filter(f => f.category === "Sourcing").length },
    { id: "Quality", label: "Quality", count: projectFiles.filter(f => f.category === "Quality").length },
    { id: "Gate Review", label: "Gate Review", count: projectFiles.filter(f => f.category === "Gate Review").length },
  ];

  const filteredFiles = fileFilter === "all"
    ? projectFiles
    : projectFiles.filter(f => f.category === fileFilter);

  // File icon color: unified neutral gray.
  // Rationale: in our design system semantic colors (error/success/primary/warning) carry
  // status meaning — using them for file types causes confusion (a red PDF looks "risky").
  // File type is sufficiently indicated by the extension label in the metadata row.
  const fileIconColor = () => C.textSecondary;

  return (
    <div className="p-6" style={{ minHeight: "100%" }}>
      <div className="space-y-4">

        {/* === General Info === */}
        <div className="space-y-4">
          {/* Phase Milestones — moved to top for at-a-glance progress overview */}
          <div className="rounded-xl border bg-white p-5" style={{ borderColor: C.border }}>
            <div className="text-[10px] font-semibold uppercase tracking-wide mb-3" style={{ color: C.primary }}>
              Key Milestones
            </div>
            <div className="flex items-center gap-2">
              {meta.keyMilestones.map((ms, i) => {
                const isCompleted = ms.status === "completed";
                const isActive = ms.status === "active";
                const color = isCompleted ? C.success : isActive ? C.primary : C.textDisabled;
                return (
                  <div key={ms.phase} className="flex items-center gap-2 flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center mb-1"
                        style={{
                          backgroundColor: isCompleted ? C.successLight : isActive ? C.primaryLight : C.bg,
                          border: `2px solid ${color}`,
                        }}>
                        {isCompleted ? <CheckCircle className="w-3.5 h-3.5" style={{ color }} />
                          : isActive ? <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                          : <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color, opacity: 0.5 }} />}
                      </div>
                      <div className="text-[11px] font-medium" style={{ color: isActive ? C.primary : C.textPrimary }}>
                        {ms.phase}
                      </div>
                      <div className="text-[9px]" style={{ color: C.textSecondary }}>{ms.date}</div>
                    </div>
                    {i < meta.keyMilestones.length - 1 && (
                      <div className="h-px flex-1 mb-6"
                        style={{ backgroundColor: meta.keyMilestones[i + 1].status === "upcoming" ? C.borderLight : C.success }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Project Meta Card */}
          <div className="rounded-xl border bg-white p-5" style={{ borderColor: C.border }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: C.primary }}>
                  Project Information
                </div>
                <div className="text-lg font-semibold" style={{ color: C.textPrimary }}>{meta.fullName}</div>
                <div className="text-xs font-mono mt-0.5" style={{ color: C.textSecondary }}>{project.code}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-1 rounded font-medium"
                  style={{
                    backgroundColor: project.priority === "high" ? C.errorLight : project.priority === "med" ? C.warningLight : C.successLight,
                    color: project.priority === "high" ? C.error : project.priority === "med" ? C.warning : C.success,
                  }}>
                  {project.priority.toUpperCase()} PRIORITY
                </span>
                <span className="text-[10px] px-2 py-1 rounded font-medium"
                  style={{ backgroundColor: C.primaryLight, color: C.primary }}>
                  {project.phase}
                </span>
              </div>
            </div>

            {/* Core Objective */}
            <div className="mb-4 p-3 rounded-md" style={{ backgroundColor: C.bg }}>
              <div className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: C.textSecondary }}>
                Core Objective
              </div>
              <div className="text-sm" style={{ color: C.textPrimary }}>{meta.coreObjective}</div>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-xs">
              {[
                { label: "Product Line", value: meta.productLine },
                { label: "Region", value: meta.region },
                { label: "Target Market", value: meta.targetMarket },
                { label: "Annual Volume", value: meta.annualVolume },
                { label: "Production Site", value: meta.productionSite },
                { label: "Project Manager", value: PERSONAS[project.pm]?.name },
                { label: "PLM Code", value: meta.plmCode, mono: true },
                { label: "ERP Project ID", value: meta.erpProjectId, mono: true },
              ].map((row) => (
                <div key={row.label}>
                  <div className="text-[10px] font-medium uppercase tracking-wide mb-0.5"
                    style={{ color: C.textSecondary }}>
                    {row.label}
                  </div>
                  <div className={row.mono ? "font-mono" : ""}
                    style={{ color: C.textPrimary }}>
                    {row.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shared Files */}
          <div className="rounded-xl border bg-white" style={{ borderColor: C.border }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: C.border }}>
              <div className="flex items-center gap-2">
                <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: C.primary }}>
                  Shared Files
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: C.bg, color: C.textSecondary }}>
                  {projectFiles.length}
                </span>
              </div>
              <button className="px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 border transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                style={{ borderColor: C.border, color: C.textPrimary, backgroundColor: "white" }}>
                <PlusCircle className="w-3.5 h-3.5" />
                Upload File
              </button>
            </div>
            {/* Filter pills */}
            <div className="px-5 py-2 border-b flex items-center gap-1 flex-wrap"
              style={{ borderColor: C.border, backgroundColor: C.bg }}>
              {fileFilters.map((f) => (
                <button key={f.id} onClick={() => setFileFilter(f.id)}
                  className="px-2.5 py-1 rounded text-[11px] font-medium transition-colors hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                  style={{
                    backgroundColor: fileFilter === f.id ? C.primary : "white",
                    color: fileFilter === f.id ? "white" : C.textSecondary,
                    border: fileFilter === f.id ? "none" : `1px solid ${C.border}`,
                  }}>
                  {f.label} <span className="opacity-70 ml-0.5">{f.count}</span>
                </button>
              ))}
            </div>
            {/* File list */}
            <div className="divide-y" style={{ borderColor: C.borderLight }}>
              {filteredFiles.map((f) => (
                <div key={f.id} className="px-5 py-3 hover:bg-gray-50 flex items-center gap-3 cursor-pointer">
                  <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: C.bg }}>
                    <FileText className="w-5 h-5" style={{ color: fileIconColor(f.type) }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate" style={{ color: C.textPrimary }}>
                      {f.name}
                    </div>
                    <div className="text-[10px] mt-0.5 flex items-center gap-2" style={{ color: C.textSecondary }}>
                      <span>{f.size}</span>
                      <span>·</span>
                      <span className="font-mono">{f.version}</span>
                      <span>·</span>
                      <span className="px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: C.primaryLight, color: C.primary }}>
                        {f.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0" style={{ width: 130 }}>
                    <PersonaAvatar p={f.uploadedBy} size={20} />
                    <div className="flex flex-col text-left min-w-0">
                      <div className="text-[10px] font-medium leading-tight truncate" style={{ color: C.textPrimary }}>
                        {PERSONAS[f.uploadedBy]?.name}
                      </div>
                      <div className="text-[10px] leading-tight mt-0.5 truncate" style={{ color: C.textDisabled }}>
                        {f.uploadedAt}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredFiles.length === 0 && (
                <div className="px-5 py-8 text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2" style={{ color: C.textDisabled }} />
                  <div className="text-xs" style={{ color: C.textSecondary }}>
                    {project.isNew ? "No files shared yet. Upload your first document to start collaborating." : "No files in this category."}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// === SUPPLIER PROFILE POPOVER ===
// Compact supplier overview shown on company-name click in the External Collaborators table.
// Displays: identity (logo, name, location, tags), purchase history bar+line chart, top items, RFx history.
function SupplierProfilePopover({ supplier, onClose }) {
  // ESC to close
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose && onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!supplier) return null;

  // Use first supplier item to derive a brand color for the avatar
  const brandColor = ({
    "BOE Technology": "#1565E0",
    "Samsung Display": "#532DF6",
    "LG Display": "#009955",
    "Nitto Denko": "#E06900",
    "3M Korea": "#1565E0",
  })[supplier.name] || C.primary;

  const maxPo = Math.max(...supplier.purchaseHistory.map(h => h.po));
  const maxRate = Math.max(...supplier.purchaseHistory.map(h => Math.abs(h.rate)));
  const chartH = 140;
  const chartW = 520;
  const padding = 32;
  const innerW = chartW - padding * 2;
  const barCount = supplier.purchaseHistory.length;
  const barSlot = innerW / barCount;
  const barW = 28;

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 transition-opacity"
        style={{ backgroundColor: "rgba(0,0,0,0.32)", zIndex: 100 }} />
      <div className="fixed top-0 bottom-0 right-0 bg-white shadow-2xl overflow-y-auto"
        style={{ width: 600, zIndex: 110 }}>
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b" style={{ borderColor: C.borderLight }}>
          <div className="flex items-start justify-between mb-3">
            <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>Supplier Details</div>
            <button onClick={onClose} className="w-6 h-6 rounded hover:bg-gray-100 flex items-center justify-center"
              style={{ color: C.textSecondary }}>
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: brandColor + "20" }}>
              <Building2 className="w-5 h-5" style={{ color: brandColor }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <div className="text-lg font-semibold" style={{ color: C.textPrimary }}>{supplier.name}</div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                  style={{ backgroundColor: C.primaryLight, color: C.primary }}>
                  <ShieldCheck className="w-3 h-3" />
                  {supplier.badge}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] mt-1 flex-wrap" style={{ color: C.textSecondary }}>
                <MapPin className="w-3 h-3" />
                <span>{supplier.location}</span>
                <span className="mx-1" style={{ color: C.textDisabled }}>·</span>
                <div className="flex items-center gap-1 flex-wrap">
                  {supplier.tags.map(t => (
                    <span key={t} className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: C.bg, color: C.textSecondary }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded hover:bg-gray-100 flex items-center justify-center" style={{ color: C.textSecondary }} title="Favorite">
                <Star className="w-3.5 h-3.5" />
              </button>
              <button className="w-7 h-7 rounded hover:bg-gray-100 flex items-center justify-center" style={{ color: C.textSecondary }} title="Email">
                <Mail className="w-3.5 h-3.5" />
              </button>
              <button className="w-7 h-7 rounded hover:bg-gray-100 flex items-center justify-center" style={{ color: C.textSecondary }} title="Call">
                <Phone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          {/* AI summary */}
          <div className="mt-3 px-3 py-2 rounded-md flex items-start gap-2"
            style={{ backgroundColor: C.primarySoft }}>
            <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: C.primary }} />
            <div className="text-[11px] leading-relaxed" style={{ color: C.primary }}>{supplier.summary}</div>
          </div>
        </div>

        {/* Purchase History — combo chart (bar + line) */}
        <div className="px-6 pt-4 pb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>Purchase History</div>
            <div className="flex items-center gap-3 text-[10px]" style={{ color: C.textSecondary }}>
              <span className="flex items-center gap-1">
                <span className="w-3 h-2 rounded-sm" style={{ backgroundColor: C.primaryLight }} />
                PO Amount
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-0.5 rounded" style={{ backgroundColor: C.primary }} />
                Increase Rate
              </span>
            </div>
          </div>
          <div className="rounded-lg border p-3" style={{ borderColor: C.border }}>
            <svg width="100%" viewBox={`0 0 ${chartW} ${chartH + 30}`} style={{ overflow: "visible" }}>
              {/* Y-axis grid lines */}
              {[0, 50, 100, 150, 200].map(v => {
                const y = chartH - (v / 200) * chartH;
                return (
                  <g key={v}>
                    <line x1={padding} x2={chartW - padding} y1={y} y2={y}
                      stroke={C.borderLight} strokeDasharray="2 2" />
                    <text x={padding - 6} y={y + 3} textAnchor="end"
                      style={{ fontSize: 9, fill: C.textDisabled }}>{v}K</text>
                  </g>
                );
              })}
              {/* Bars (PO Amount) */}
              {supplier.purchaseHistory.map((h, i) => {
                const x = padding + barSlot * i + (barSlot - barW) / 2;
                const barH = (h.po / 200) * chartH;
                return (
                  <g key={i}>
                    <rect x={x} y={chartH - barH} width={barW} height={barH}
                      fill={C.primaryLight} rx={3} />
                    <text x={x + barW / 2} y={chartH + 14} textAnchor="middle"
                      style={{ fontSize: 9, fill: C.textSecondary }}>{h.quarter}</text>
                  </g>
                );
              })}
              {/* Line (Increase Rate) — normalized to chart height */}
              {(() => {
                const points = supplier.purchaseHistory.map((h, i) => {
                  const x = padding + barSlot * i + barSlot / 2;
                  // Map rate -50%..+60% to chartH..0
                  const normalized = Math.max(-50, Math.min(60, h.rate));
                  const y = chartH - ((normalized + 50) / 110) * chartH;
                  return `${x},${y}`;
                }).join(" ");
                return <polyline points={points} fill="none" stroke={C.primary} strokeWidth={2} />;
              })()}
              {/* Line points */}
              {supplier.purchaseHistory.map((h, i) => {
                const x = padding + barSlot * i + barSlot / 2;
                const normalized = Math.max(-50, Math.min(60, h.rate));
                const y = chartH - ((normalized + 50) / 110) * chartH;
                return <circle key={`pt-${i}`} cx={x} cy={y} r={3.5} fill={C.primary} />;
              })}
            </svg>
          </div>
        </div>

        {/* Items breakdown */}
        <div className="px-6 pb-4">
          <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: C.textSecondary }}>
            Top Items
          </div>
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: C.border }}>
            <table className="w-full text-xs">
              <thead style={{ backgroundColor: C.bg }}>
                <tr style={{ color: C.textSecondary }}>
                  <th className="text-left font-medium py-1.5 px-3">Category / Item</th>
                  <th className="text-left font-medium py-1.5 px-3">Spec</th>
                  <th className="text-right font-medium py-1.5 px-3">PO Amount (USD)</th>
                  <th className="text-right font-medium py-1.5 px-3">Rate</th>
                </tr>
              </thead>
              <tbody>
                {supplier.items.map((item) => (
                  <React.Fragment key={item.category}>
                    <tr style={{ borderTop: `1px solid ${C.borderLight}`, backgroundColor: C.surfaceTinted }}>
                      <td className="py-1.5 px-3 text-[11px] font-semibold" style={{ color: C.textPrimary }}>{item.category}</td>
                      <td className="py-1.5 px-3"></td>
                      <td className="py-1.5 px-3 text-[11px] text-right font-semibold tabular-nums" style={{ color: C.textPrimary }}>
                        {item.amount.toLocaleString()}
                      </td>
                      <td className="py-1.5 px-3 text-[11px] text-right font-semibold tabular-nums"
                        style={{ color: item.rate >= 0 ? C.success : C.error }}>
                        {item.rate >= 0 ? "+" : ""}{item.rate.toFixed(1)}%
                      </td>
                    </tr>
                    {item.parts.map((p) => (
                      <tr key={p.name} style={{ borderTop: `1px solid ${C.borderLight}` }}>
                        <td className="py-1.5 px-3 text-[11px] pl-6" style={{ color: C.textPrimary }}>{p.name}</td>
                        <td className="py-1.5 px-3 text-[11px]" style={{ color: C.textSecondary }}>{p.spec}</td>
                        <td className="py-1.5 px-3 text-[11px] text-right tabular-nums" style={{ color: C.textSecondary }}>
                          {p.amount.toLocaleString()}
                        </td>
                        <td></td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RFx History */}
        <div className="px-6 pb-6">
          <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: C.textSecondary }}>
            RFx History
          </div>
          <div className="rounded-lg border overflow-hidden" style={{ borderColor: C.border }}>
            <table className="w-full text-xs">
              <thead style={{ backgroundColor: C.bg }}>
                <tr style={{ color: C.textSecondary }}>
                  <th className="text-left font-medium py-1.5 px-3">Year</th>
                  <th className="text-left font-medium py-1.5 px-3">Operation Org.</th>
                  <th className="text-right font-medium py-1.5 px-3">RFx</th>
                  <th className="text-right font-medium py-1.5 px-3">Bids</th>
                  <th className="text-right font-medium py-1.5 px-3">Bid Rate</th>
                  <th className="text-right font-medium py-1.5 px-3">Awards</th>
                  <th className="text-right font-medium py-1.5 px-3">Award Rate</th>
                </tr>
              </thead>
              <tbody>
                {supplier.rfx.map((row, i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${C.borderLight}` }}>
                    <td className="py-1.5 px-3 text-[11px]" style={{ color: C.textPrimary }}>{row.year}</td>
                    <td className="py-1.5 px-3 text-[11px]" style={{ color: C.textPrimary }}>{row.org}</td>
                    <td className="py-1.5 px-3 text-[11px] text-right tabular-nums" style={{ color: C.textSecondary }}>{row.requests}</td>
                    <td className="py-1.5 px-3 text-[11px] text-right tabular-nums" style={{ color: C.textSecondary }}>{row.bids}</td>
                    <td className="py-1.5 px-3 text-[11px] text-right tabular-nums" style={{ color: C.textPrimary }}>{row.bidRate}%</td>
                    <td className="py-1.5 px-3 text-[11px] text-right tabular-nums" style={{ color: C.textPrimary }}>{row.awards}</td>
                    <td className="py-1.5 px-3 text-[11px] text-right tabular-nums font-semibold"
                      style={{ color: row.awardRate >= 50 ? C.success : C.textPrimary }}>
                      {row.awardRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

// === SCREEN: COLLABORATORS ===
// Groups: Internal (5 personas) + External (suppliers).
// Supports multi-select with bulk action toolbar for Share / Send Update / Invite to Meeting.
function CollaboratorsScreen({ activeProjectCode }) {
  const project = PROJECTS.find((p) => p.code === activeProjectCode) || PROJECTS[0];
  const internalList = getCollaboratorsForProject(project);
  const externalList = getExternalCollaboratorsForProject(project);

  // ===== Access Permissions =====
  // 6 access areas, 3 permission levels (edit / view / none).
  // Default permissions follow role-based access control:
  // - PM (Owner): edit on everything
  // - DE: edit on E-BOM & Files; view on others; no Decisions edit
  // - CM: edit on C-BOM & Files; view on others
  // - SM: edit on C-BOM & Files; view on others (sourcing collaborates via C-BOM)
  // - QM: edit on Q-BOM & APQP & Files; view on others
  // - External: view on C-BOM & Files only (supplier-facing surfaces)
  const ACCESS_AREAS = [
    { id: "ebom",      label: "E-BOM" },
    { id: "cbom",      label: "C-BOM" },
    { id: "qbom",      label: "Q-BOM" },
    { id: "apqp",      label: "APQP" },
    { id: "files",     label: "Files" },
    { id: "decisions", label: "Decisions" },
  ];

  const defaultPermissionsFor = (key, isExternal) => {
    if (isExternal) {
      // External suppliers — restricted: only see what they need to quote/respond
      return { ebom: "none", cbom: "view", qbom: "none", apqp: "none", files: "view", decisions: "none" };
    }
    // Internal: by persona role
    const defaults = {
      PM: { ebom: "edit", cbom: "edit", qbom: "edit", apqp: "edit", files: "edit", decisions: "edit" },
      DE: { ebom: "edit", cbom: "view", qbom: "view", apqp: "view", files: "edit", decisions: "view" },
      CM: { ebom: "view", cbom: "edit", qbom: "view", apqp: "view", files: "edit", decisions: "view" },
      SM: { ebom: "view", cbom: "edit", qbom: "view", apqp: "view", files: "edit", decisions: "view" },
      QM: { ebom: "view", cbom: "view", qbom: "edit", apqp: "edit", files: "edit", decisions: "view" },
    };
    return defaults[key] || { ebom: "view", cbom: "view", qbom: "view", apqp: "view", files: "view", decisions: "view" };
  };

  // Permissions state — keyed by member id (int-PM, ext-1, etc).
  // Initialized lazily on first render based on the default matrix.
  const [permissions, setPermissions] = useState(() => {
    const initial = {};
    internalList.forEach(c => { initial[`int-${c.persona}`] = defaultPermissionsFor(c.persona, false); });
    externalList.forEach(c => { initial[`ext-${c.id}`] = defaultPermissionsFor(null, true); });
    return initial;
  });

  // Active permission editor — id of the row whose permissions are being edited (popover)
  const [editingPermissions, setEditingPermissions] = useState(null);

  const cyclePermission = (memberId, areaId) => {
    setPermissions(prev => {
      const current = prev[memberId]?.[areaId] || "none";
      const next = current === "edit" ? "view" : current === "view" ? "none" : "edit";
      return {
        ...prev,
        [memberId]: { ...(prev[memberId] || {}), [areaId]: next },
      };
    });
  };

  // Permission chip metadata (cycles edit → view → none → edit)
  const permMeta = {
    edit: { label: "Edit", short: "E", bg: C.primary,        fg: "white",          border: C.primary },
    view: { label: "View", short: "V", bg: C.bg,             fg: C.textSecondary,  border: C.border },
    none: { label: "None", short: "—", bg: "transparent",    fg: C.textDisabled,   border: C.borderLight },
  };

  // Multi-select state — keyed by unique IDs (persona for internal, id for external)
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAction, setActiveAction] = useState(null); // null | "update" | "access" | "meeting" | "share"
  const [openMenuId, setOpenMenuId] = useState(null); // row id whose context menu is open
  const [supplierProfileOpen, setSupplierProfileOpen] = useState(null); // supplier name whose profile drawer is open
  const [addMode, setAddMode] = useState(null); // null | "internal" | "external"

  const toggleId = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  const toggleGroup = (ids, allSelected) => {
    const next = new Set(selectedIds);
    if (allSelected) ids.forEach(id => next.delete(id));
    else ids.forEach(id => next.add(id));
    setSelectedIds(next);
  };

  const clearSelection = () => setSelectedIds(new Set());

  // Filtered lists based on search query
  const filterFn = (item, nameKey, secondaryKey) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return item[nameKey]?.toLowerCase().includes(q) || item[secondaryKey]?.toLowerCase().includes(q);
  };

  const filteredInternal = internalList.filter(c => {
    const name = PERSONAS[c.persona]?.name || c.persona;
    return !searchQuery || name.toLowerCase().includes(searchQuery.toLowerCase()) || c.role.toLowerCase().includes(searchQuery.toLowerCase());
  });
  const filteredExternal = externalList.filter(c => filterFn(c, "name", "company"));

  const internalIds = filteredInternal.map(c => `int-${c.persona}`);
  const externalIds = filteredExternal.map(c => `ext-${c.id}`);
  const allInternalSelected = internalIds.length > 0 && internalIds.every(id => selectedIds.has(id));
  const allExternalSelected = externalIds.length > 0 && externalIds.every(id => selectedIds.has(id));

  const selectedCount = selectedIds.size;
  const hasExternal = externalList.length > 0;

  return (
    <div className="p-6 space-y-4" style={{ minHeight: "100%" }}>
      {/* === Header / toolbar (shared above both tables) === */}
      <div className="rounded-xl border bg-white px-5 py-3 flex items-center justify-between flex-wrap gap-3" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>
            Collaborators
            <span className="text-xs font-normal ml-2" style={{ color: C.textSecondary }}>
              Internal {filteredInternal.length} · External {filteredExternal.length}
            </span>
          </div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: C.textDisabled }} />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="h-7 pl-7 pr-3 rounded-md border text-xs outline-none focus:outline-none focus-visible:ring-2"
              style={{ borderColor: C.border, backgroundColor: C.surfaceTinted, width: 220, color: C.textPrimary }} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveAction("update")}
            disabled={selectedCount === 0}
            className="h-7 px-3 rounded-md text-xs font-medium border transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:outline-none focus-visible:ring-2"
            style={{ borderColor: C.border, color: C.textPrimary, backgroundColor: "white" }}>
            Send Message
          </button>
          <button
            disabled={selectedCount === 0}
            onClick={() => setActiveAction("access")}
            className="h-7 px-3 rounded-md text-xs font-medium border transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 focus:outline-none focus-visible:ring-2 inline-flex items-center gap-1"
            style={{ borderColor: C.border, color: C.textPrimary, backgroundColor: "white" }}>
            <Lock className="w-3 h-3" />
            Access Setting
          </button>
          <button
            onClick={() => setAddMode("internal")}
            className="h-7 px-3 rounded-md text-xs font-medium text-white transition-colors hover:opacity-90 focus:outline-none focus-visible:ring-2"
            style={{ backgroundColor: C.primary }}>
            Invite
          </button>
        </div>
      </div>

      {/* === INTERNAL TABLE === */}
      <div className="rounded-xl border bg-white" style={{ borderColor: C.border }}>
        <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: C.border }}>
          <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textSecondary }}>
            Internal · {filteredInternal.length}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead style={{ backgroundColor: C.bg }}>
              <tr style={{ color: C.textSecondary, borderBottom: `1px solid ${C.border}` }}>
                <th className="text-center font-medium py-2 px-3 w-8">
                  <input type="checkbox" className="rounded"
                    checked={filteredInternal.length > 0 && filteredInternal.every(c => selectedIds.has(`int-${c.persona}`))}
                    onChange={(e) => {
                      const ids = filteredInternal.map(c => `int-${c.persona}`);
                      toggleGroup(ids, !e.target.checked);
                    }} />
                </th>
                <th className="text-left font-medium py-2 px-3 w-44">Organization</th>
                <th className="text-left font-medium py-2 px-3 w-32">Name</th>
                <th className="text-left font-medium py-2 px-3 w-28">Role</th>
                <th className="text-left font-medium py-2 px-3 w-40">Access</th>
                <th className="text-left font-medium py-2 px-3">Associated BOMs</th>
                <th className="text-left font-medium py-2 px-3 w-48">Email</th>
                <th className="text-left font-medium py-2 px-3 w-24">Contact</th>
              </tr>
            </thead>
            <tbody>
              {filteredInternal.map((c) => {
                const memberId = `int-${c.persona}`;
                const isSelected = selectedIds.has(memberId);
                const meta = PERSONAS[c.persona] || {};
                const perms = permissions[memberId] || {};
                const accessAreas = ACCESS_AREAS.filter(a =>
                  perms[a.id] === "edit" && !["files", "decisions"].includes(a.id)
                ).map(a => a.label);
                const associatedBoms = ACCESS_AREAS.filter(a =>
                  (perms[a.id] === "edit" || perms[a.id] === "view") && ["ebom", "cbom", "qbom"].includes(a.id)
                ).map(a => a.label);
                const orgLabel = ({
                  PM: "[PMO] Project Office",
                  DE: "[E-BOM] Engineering",
                  CM: "[C-BOM] Cost Engineering",
                  SM: "[C-BOM] Sourcing",
                  QM: "[Q-BOM] Quality Assurance",
                })[c.persona] || meta.department || "Internal";
                return (
                  <tr key={memberId}
                    className="transition-colors hover:bg-gray-50"
                    style={{
                      borderBottom: `1px solid ${C.borderLight}`,
                      backgroundColor: isSelected ? C.primarySoft : "white",
                    }}>
                    <td className="py-2 px-3 text-center">
                      <input type="checkbox" checked={isSelected} onChange={() => toggleId(memberId)} className="rounded" />
                    </td>
                    <td className="py-2 px-3 text-[11px]" style={{ color: C.textPrimary }}>{orgLabel}</td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1.5">
                        <PersonaAvatar p={c.persona} size={18} />
                        <span className="text-[11px] font-medium" style={{ color: C.textPrimary }}>{meta.name}</span>
                        {c.owner && (
                          <span className="text-[8px] uppercase font-bold px-1 py-0.5 rounded"
                            style={{ backgroundColor: C.primary, color: "white" }}>Owner</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-[11px]" style={{ color: C.textPrimary }}>{c.role}</td>
                    <td className="py-2 px-3 text-[11px]" style={{ color: C.textPrimary }}>
                      {accessAreas.length > 0 ? accessAreas.join(", ") : <span style={{ color: C.textDisabled }}>—</span>}
                    </td>
                    <td className="py-2 px-3 text-[11px]" style={{ color: C.textSecondary }}>
                      {associatedBoms.length > 0 ? associatedBoms.join(", ") : <span style={{ color: C.textDisabled }}>—</span>}
                    </td>
                    <td className="py-2 px-3 text-[11px] font-mono" style={{ color: C.textSecondary }}>
                      {meta.email || `${meta.name?.toLowerCase().replace(/[ .]/g, '.')}@samsung.com`}
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1">
                        <button className="w-6 h-6 rounded flex items-center justify-center hover:bg-white border focus:outline-none focus-visible:ring-2"
                          style={{ borderColor: C.border, color: C.textSecondary }} title="Chat">
                          <MessageSquare className="w-3 h-3" />
                        </button>
                        <button className="w-6 h-6 rounded flex items-center justify-center hover:bg-white border focus:outline-none focus-visible:ring-2"
                          style={{ borderColor: C.border, color: C.textSecondary }} title="Email">
                          <Mail className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredInternal.length === 0 && (
                <tr><td colSpan={8} className="py-8 text-center text-[11px]" style={{ color: C.textDisabled }}>No internal members.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* === EXTERNAL TABLE === */}
      <div className="rounded-xl border bg-white" style={{ borderColor: C.border }}>
        <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: C.border }}>
          <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.textSecondary }}>
            External · {filteredExternal.length}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead style={{ backgroundColor: C.bg }}>
              <tr style={{ color: C.textSecondary, borderBottom: `1px solid ${C.border}` }}>
                <th className="text-center font-medium py-2 px-3 w-8">
                  <input type="checkbox" className="rounded"
                    checked={filteredExternal.length > 0 && filteredExternal.every(c => selectedIds.has(`ext-${c.id}`))}
                    onChange={(e) => {
                      const ids = filteredExternal.map(c => `ext-${c.id}`);
                      toggleGroup(ids, !e.target.checked);
                    }} />
                </th>
                <th className="text-left font-medium py-2 px-3 w-44">Organization</th>
                <th className="text-left font-medium py-2 px-3 w-32">Name</th>
                <th className="text-left font-medium py-2 px-3 w-28">Role</th>
                <th className="text-left font-medium py-2 px-3 w-40">Access</th>
                <th className="text-left font-medium py-2 px-3">Associated BOMs</th>
                <th className="text-left font-medium py-2 px-3 w-48">Email</th>
                <th className="text-left font-medium py-2 px-3 w-24">Contact</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                // Group external by company
                const bySupplier = {};
                filteredExternal.forEach(c => {
                  if (!bySupplier[c.company]) bySupplier[c.company] = [];
                  bySupplier[c.company].push(c);
                });
                const supplierGroups = Object.entries(bySupplier).sort(([a], [b]) => a.localeCompare(b));
                return supplierGroups.map(([company, members]) => (
                  <React.Fragment key={`sup-${company}`}>
                    <tr style={{ borderBottom: `1px solid ${C.borderLight}`, backgroundColor: "#FAFBFC" }}>
                      <td colSpan={8} className="py-1.5 px-3">
                        <div className="flex items-center gap-2 pl-3">
                          <div className="w-1 h-3 rounded-sm" style={{ backgroundColor: members[0]?.color || C.textDisabled }} />
                          <button
                            onClick={() => SUPPLIER_DETAILS[company] && setSupplierProfileOpen(company)}
                            className="text-[10px] font-semibold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded inline-flex items-center gap-1"
                            style={{ color: C.textPrimary, cursor: SUPPLIER_DETAILS[company] ? "pointer" : "default" }}
                            title={SUPPLIER_DETAILS[company] ? "View supplier details" : undefined}>
                            {company}
                            <span className="font-normal" style={{ color: C.textDisabled }}>({members.length})</span>
                            {SUPPLIER_DETAILS[company] && (
                              <Info className="w-2.5 h-2.5 opacity-50" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {members.map((c) => {
                      const memberId = `ext-${c.id}`;
                      const isSelected = selectedIds.has(memberId);
                      const perms = permissions[memberId] || {};
                      const accessAreas = ACCESS_AREAS.filter(a =>
                        perms[a.id] === "edit" && !["files", "decisions"].includes(a.id)
                      ).map(a => a.label);
                      const associatedBoms = ACCESS_AREAS.filter(a =>
                        (perms[a.id] === "edit" || perms[a.id] === "view") && ["ebom", "cbom", "qbom"].includes(a.id)
                      ).map(a => a.label);
                      return (
                        <tr key={memberId}
                          className="transition-colors hover:bg-gray-50"
                          style={{
                            borderBottom: `1px solid ${C.borderLight}`,
                            backgroundColor: isSelected ? C.primarySoft : "white",
                          }}>
                          <td className="py-2 px-3 text-center">
                            <input type="checkbox" checked={isSelected} onChange={() => toggleId(memberId)} className="rounded" />
                          </td>
                          <td className="py-2 px-3 text-[11px]" style={{ color: C.textPrimary }}>
                            {SUPPLIER_DETAILS[c.company] ? (
                              <button
                                onClick={(e) => { e.stopPropagation(); setSupplierProfileOpen(c.company); }}
                                className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded text-left"
                                style={{ color: C.textPrimary }}>
                                {c.company}
                              </button>
                            ) : c.company}
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-1.5">
                              <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                                style={{ backgroundColor: c.color }}>
                                {c.initial}
                              </div>
                              <span className="text-[11px] font-medium" style={{ color: C.textPrimary }}>{c.name}</span>
                            </div>
                          </td>
                          <td className="py-2 px-3 text-[11px]" style={{ color: C.textPrimary }}>{c.role}</td>
                          <td className="py-2 px-3 text-[11px]" style={{ color: C.textPrimary }}>
                            {accessAreas.length > 0 ? accessAreas.join(", ") : <span style={{ color: C.textDisabled }}>—</span>}
                          </td>
                          <td className="py-2 px-3 text-[11px]" style={{ color: C.textSecondary }}>
                            {associatedBoms.length > 0 ? associatedBoms.join(", ") : <span style={{ color: C.textDisabled }}>—</span>}
                          </td>
                          <td className="py-2 px-3 text-[11px] font-mono" style={{ color: C.textSecondary }}>{c.email}</td>
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-1">
                              <button className="w-6 h-6 rounded flex items-center justify-center hover:bg-white border focus:outline-none focus-visible:ring-2"
                                style={{ borderColor: C.border, color: C.textSecondary }} title="Chat">
                                <MessageSquare className="w-3 h-3" />
                              </button>
                              <button className="w-6 h-6 rounded flex items-center justify-center hover:bg-white border focus:outline-none focus-visible:ring-2"
                                style={{ borderColor: C.border, color: C.textSecondary }} title="Email">
                                <Mail className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                ));
              })()}
              {filteredExternal.length === 0 && (
                <tr><td colSpan={8} className="py-8 text-center text-[11px]" style={{ color: C.textDisabled }}>No external partners.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk action modal */}
      {activeAction && (
        <BulkActionModal
          action={activeAction}
          selectedCount={selectedCount}
          onClose={() => { setActiveAction(null); clearSelection(); }}
        />
      )}

      {/* Supplier profile drawer */}
      {supplierProfileOpen && SUPPLIER_DETAILS[supplierProfileOpen] && (
        <SupplierProfilePopover
          supplier={SUPPLIER_DETAILS[supplierProfileOpen]}
          onClose={() => setSupplierProfileOpen(null)}
        />
      )}

      {/* Add collaborator modal */}
      {addMode && (
        <AddCollaboratorModal
          mode={addMode}
          onClose={() => setAddMode(null)}
        />
      )}
    </div>
  );
}

// === BULK ACTION MODAL ===
// Shared modal for Send message / Share document / Manage access
function BulkActionModal({ action, selectedCount, onClose }) {
  const config = {
    update: { title: "Send message", icon: MessageSquare, cta: "Send", placeholder: "Type your message..." },
    share:  { title: "Share document", icon: Paperclip, cta: "Share", placeholder: "Add a note (optional)..." },
    access: { title: "Manage access", icon: ShieldCheck, cta: "Apply changes", placeholder: null },
  };
  const cfg = config[action] || config.update;
  const Icon = cfg.icon;

  // Access modal state — one permission per access area (default: View)
  const [accessLevels, setAccessLevels] = useState({ spec: "view", cost: "view", quality: "view" });
  const accessAreas = [
    { id: "spec",    label: "Specification", desc: "BOM specs, design data, drawings" },
    { id: "cost",    label: "Cost",          desc: "Should-cost, quoted prices, target" },
    { id: "quality", label: "Quality",       desc: "PPAP, risk assessment, DVT" },
  ];
  const accessOptions = [
    { id: "edit", label: "Edit",  desc: "Can view & modify" },
    { id: "view", label: "View",  desc: "Read-only" },
    { id: "none", label: "None",  desc: "No access" },
  ];

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(16, 24, 40, 0.4)" }} onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 z-50 bg-white rounded-2xl shadow-2xl flex flex-col"
        style={{ transform: "translate(-50%, -50%)", width: action === "access" ? 600 : 560 }}>
        <div className="px-6 pt-5 pb-4 border-b flex items-start gap-4" style={{ borderColor: C.border }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: C.primarySoft }}>
            <Icon className="w-5 h-5" style={{ color: C.primary }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[18px] font-semibold leading-6" style={{ color: C.textPrimary }}>{cfg.title}</div>
            <div className="text-sm mt-0.5" style={{ color: C.textSecondary }}>
              {action === "access"
                ? <>Edit access for <strong style={{ color: C.textPrimary }}>{selectedCount}</strong> selected collaborator{selectedCount !== 1 ? "s" : ""}</>
                : <>Sending to <strong style={{ color: C.textPrimary }}>{selectedCount}</strong> recipient{selectedCount !== 1 ? "s" : ""}</>}
            </div>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-md flex items-center justify-center transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2"
            style={{ color: C.textSecondary }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body — branches on action type */}
        {action === "access" ? (
          <div className="px-6 py-5 space-y-4">
            {accessAreas.map((area) => (
              <div key={area.id} className="rounded-lg border p-3"
                style={{ borderColor: C.borderLight, backgroundColor: C.surfaceTinted }}>
                <div className="mb-2">
                  <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>{area.label}</div>
                  <div className="text-[11px]" style={{ color: C.textSecondary }}>{area.desc}</div>
                </div>
                <div className="flex gap-2">
                  {accessOptions.map((opt) => {
                    const isSelected = accessLevels[area.id] === opt.id;
                    return (
                      <label key={opt.id}
                        className="flex-1 cursor-pointer rounded-md border p-2 transition-all hover:bg-white"
                        style={{
                          borderColor: isSelected ? C.primary : C.border,
                          backgroundColor: isSelected ? "white" : "transparent",
                          boxShadow: isSelected ? `0 0 0 1px ${C.primary}` : "none",
                        }}>
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`access-${area.id}`}
                            checked={isSelected}
                            onChange={() => setAccessLevels(prev => ({ ...prev, [area.id]: opt.id }))}
                            className="w-3.5 h-3.5"
                            style={{ accentColor: C.primary }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold" style={{ color: isSelected ? C.primary : C.textPrimary }}>
                              {opt.label}
                            </div>
                            <div className="text-[10px]" style={{ color: C.textDisabled }}>
                              {opt.desc}
                            </div>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 px-2 text-[11px]" style={{ color: C.textSecondary }}>
              <Info className="w-3 h-3 shrink-0" style={{ color: C.textDisabled }} />
              Owner permissions are locked and won't change. Existing settings for other selected users will be overwritten.
            </div>
          </div>
        ) : (
          <div className="px-6 py-4 space-y-3">
            {action === "update" && (
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wide block mb-1" style={{ color: C.textSecondary }}>Subject</label>
                <input className="h-9 px-3 rounded-md border text-sm w-full outline-none focus:outline-none focus-visible:ring-2"
                  style={{ borderColor: C.border, backgroundColor: C.surfaceTinted }}
                  placeholder="e.g. AMOLED Panel spec update" />
              </div>
            )}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wide block mb-1" style={{ color: C.textSecondary }}>Message</label>
              <textarea rows={4} placeholder={cfg.placeholder}
                className="px-3 py-2 rounded-md border text-sm w-full outline-none focus:outline-none focus-visible:ring-2 resize-none"
                style={{ borderColor: C.border, backgroundColor: C.surfaceTinted }} />
            </div>
          </div>
        )}

        <div className="px-6 py-3 border-t flex items-center justify-end gap-2" style={{ borderColor: C.border }}>
          <button onClick={onClose}
            className="h-9 px-4 rounded-md text-sm font-medium border transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2"
            style={{ borderColor: C.border, color: C.textPrimary, backgroundColor: "white" }}>
            Cancel
          </button>
          <button onClick={onClose}
            className="h-9 px-4 rounded-md text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2"
            style={{ backgroundColor: C.primary }}>
            {cfg.cta}
          </button>
        </div>
      </div>
    </>
  );
}

// === ADD COLLABORATOR MODAL ===
// Two modes: "internal" (Samsung employees by email/role) or "external" (supplier contacts by company)
function AddCollaboratorModal({ mode, onClose }) {
  const isInternal = mode === "internal";

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const cfg = isInternal
    ? {
        title: "Add Internal Member",
        subtitle: "Invite a Samsung team member to this project",
        icon: UsersRound,
        iconBg: C.primarySoft,
        iconFg: C.primary,
        cta: "Send Invitation",
      }
    : {
        title: "Add External Partner",
        subtitle: "Invite a supplier or vendor contact to this project",
        icon: Building2,
        iconBg: "rgba(21,101,224,0.10)",
        iconFg: C.info,
        cta: "Send Invitation",
      };
  const Icon = cfg.icon;

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(16, 24, 40, 0.4)" }} onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 z-50 bg-white rounded-2xl shadow-2xl flex flex-col"
        style={{ transform: "translate(-50%, -50%)", width: 560 }}>
        <div className="px-6 pt-5 pb-4 border-b flex items-start gap-4" style={{ borderColor: C.border }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: cfg.iconBg }}>
            <Icon className="w-5 h-5" style={{ color: cfg.iconFg }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[18px] font-semibold leading-6" style={{ color: C.textPrimary }}>{cfg.title}</div>
            <div className="text-sm mt-0.5" style={{ color: C.textSecondary }}>{cfg.subtitle}</div>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-md flex items-center justify-center transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2"
            style={{ color: C.textSecondary }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-4 space-y-3">
          {isInternal ? (
            <>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wide block mb-1" style={{ color: C.textSecondary }}>Email</label>
                <input type="email"
                  placeholder="member@samsung.com"
                  className="h-9 px-3 rounded-md border text-sm w-full outline-none focus:outline-none focus-visible:ring-2"
                  style={{ borderColor: C.border, backgroundColor: C.surfaceTinted }} />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wide block mb-1" style={{ color: C.textSecondary }}>Role</label>
                <select
                  className="h-9 px-3 rounded-md border text-sm w-full outline-none focus:outline-none focus-visible:ring-2 bg-white"
                  style={{ borderColor: C.border }}>
                  <option>Project Manager (PM)</option>
                  <option>Design Engineer (DE)</option>
                  <option>Cost Manager (CM)</option>
                  <option>Sourcing Manager (SM)</option>
                  <option>Quality Manager (QM)</option>
                  <option>Observer / Stakeholder</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wide block mb-1" style={{ color: C.textSecondary }}>Department <span className="font-normal normal-case" style={{ color: C.textDisabled }}>(optional)</span></label>
                <input type="text"
                  placeholder="e.g. Mobile R&D, Cost Engineering"
                  className="h-9 px-3 rounded-md border text-sm w-full outline-none focus:outline-none focus-visible:ring-2"
                  style={{ borderColor: C.border, backgroundColor: C.surfaceTinted }} />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wide block mb-1" style={{ color: C.textSecondary }}>Contact Name</label>
                <input type="text"
                  placeholder="e.g. Chen Wei"
                  className="h-9 px-3 rounded-md border text-sm w-full outline-none focus:outline-none focus-visible:ring-2"
                  style={{ borderColor: C.border, backgroundColor: C.surfaceTinted }} />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wide block mb-1" style={{ color: C.textSecondary }}>Company</label>
                <input type="text"
                  placeholder="e.g. BOE Technology"
                  className="h-9 px-3 rounded-md border text-sm w-full outline-none focus:outline-none focus-visible:ring-2"
                  style={{ borderColor: C.border, backgroundColor: C.surfaceTinted }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wide block mb-1" style={{ color: C.textSecondary }}>Email</label>
                  <input type="email"
                    placeholder="contact@company.com"
                    className="h-9 px-3 rounded-md border text-sm w-full outline-none focus:outline-none focus-visible:ring-2"
                    style={{ borderColor: C.border, backgroundColor: C.surfaceTinted }} />
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wide block mb-1" style={{ color: C.textSecondary }}>Phone <span className="font-normal normal-case" style={{ color: C.textDisabled }}>(optional)</span></label>
                  <input type="tel"
                    placeholder="+1 ..."
                    className="h-9 px-3 rounded-md border text-sm w-full outline-none focus:outline-none focus-visible:ring-2"
                    style={{ borderColor: C.border, backgroundColor: C.surfaceTinted }} />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wide block mb-1" style={{ color: C.textSecondary }}>BOM Scope</label>
                <select
                  className="h-9 px-3 rounded-md border text-sm w-full outline-none focus:outline-none focus-visible:ring-2 bg-white"
                  style={{ borderColor: C.border }}>
                  <option>C-BOM (Source & Cost)</option>
                  <option>Q-BOM (Quality / PPAP)</option>
                  <option>All BOMs</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wide block mb-1" style={{ color: C.textSecondary }}>Personal Message <span className="font-normal normal-case" style={{ color: C.textDisabled }}>(optional)</span></label>
            <textarea rows={3}
              placeholder="Add a note to the invitation..."
              className="px-3 py-2 rounded-md border text-sm w-full outline-none focus:outline-none focus-visible:ring-2 resize-none"
              style={{ borderColor: C.border, backgroundColor: C.surfaceTinted }} />
          </div>
        </div>

        <div className="px-6 py-3 border-t flex items-center justify-end gap-2" style={{ borderColor: C.border }}>
          <button onClick={onClose}
            className="h-9 px-4 rounded-md text-sm font-medium border transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2"
            style={{ borderColor: C.border, color: C.textPrimary, backgroundColor: "white" }}>
            Cancel
          </button>
          <button onClick={onClose}
            className="h-9 px-4 rounded-md text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2"
            style={{ backgroundColor: C.primary }}>
            {cfg.cta}
          </button>
        </div>
      </div>
    </>
  );
}

// === SCREEN: BOM LIST (3 BOMs: E / C / Q) ===
function BomListScreen({ activeProjectCode, activeBom, setActiveBom, setView }) {
  const project = PROJECTS.find((p) => p.code === activeProjectCode) || PROJECTS[0];
  const isHeroProject = project.code === ACTIVE_PROJECT_CODE;

  // View mode: "kanban" (default) | "table"
  const [viewMode, setViewMode] = useState("kanban");

  // Compare BOMs modal (new — compare any two BOM versions across types)
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  // Kanban filters (Party / Collab Type)
  const [partyFilters, setPartyFilters] = useState({ internal: true, external: true });
  const [collabFilters, setCollabFilters] = useState({ design: true, cost: true, quality: true });

  // Resolve BOM data: Hero project uses full base; new projects show all not_created; others derive from phase
  const bomsForProject = useMemo(() => {
    if (isHeroProject) return BOM_LIST;
    if (project.isNew) {
      return BOM_LIST.map(b => ({
        ...b, version: "—", parts: 0, status: "not_created",
        missing: 0, syncDelta: 0, lastActivity: null,
      }));
    }
    return getBomListByPhase(project.phase);
  }, [project.phase, isHeroProject, project.isNew]);

  // Empty state: no BOMs exist at all (all not_created)
  const allEmpty = bomsForProject.every(b => b.status === "not_created");
  const activeCount = bomsForProject.filter(b => b.status === "active").length;

  const onBomClick = (bom) => {
    if (bom.status !== "active") return; // Only active BOMs are clickable
    setActiveBom(bom.id);
    setView("bom");
  };

  // === EMPTY STATE: no BOMs created yet ===
  if (allEmpty) {
    return (
      <div className="p-6" style={{ minHeight: "100%" }}>
        <div className="rounded-xl border bg-white py-16 px-8 text-center" style={{ borderColor: C.border }}>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ backgroundColor: C.primarySoft }}>
            <Network className="w-8 h-8" style={{ color: C.primary }} />
          </div>
          <div className="text-base font-semibold mb-2" style={{ color: C.textPrimary }}>
            No BOMs Yet
          </div>
          <div className="text-sm max-w-md mx-auto mb-6" style={{ color: C.textSecondary }}>
            Start by adding the E-BOM (Engineering). Once spec is defined, C-BOM and Q-BOM can be added in parallel as each domain begins collaborating.
          </div>
          <div className="inline-flex items-center gap-2">
            <button className="px-4 py-2 rounded-md text-sm font-semibold text-white inline-flex items-center gap-2 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              style={{ backgroundColor: C.primary }}>
              <Upload className="w-4 h-4" />
              Upload E-BOM
            </button>
            <button className="px-4 py-2 rounded-md text-sm font-semibold border inline-flex items-center gap-2 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              style={{ borderColor: C.border, color: C.textPrimary, backgroundColor: "white" }}>
              <Link2 className="w-4 h-4" />
              Link Existing BOM
            </button>
          </div>
          <div className="mt-6 text-[11px]" style={{ color: C.textDisabled }}>
            Supported: CAD exports, PLM systems, Excel/CSV, or BOMs from other projects
          </div>
        </div>
      </div>
    );
  }

  // === Helper renderers ===
  const renderTableView = () => {
    // Build rows: active/draft/review/approved BOMs + archived (Hero only).
    // Archived rows are normalized to match the main BOM row shape so the same renderer can handle both.
    const archivedRows = isHeroProject ? ARCHIVED_BOMS.map(a => ({
      id: a.id,
      label: a.label,
      name: `${a.label} (archived)`,
      version: a.versions[0] || "—",
      parts: null,
      status: "archived",
      lifecycle: "archived",
      missing: 0,
      syncDelta: 0,
      lastActivity: null,
      owner: a.label === "E-BOM" ? "DE" : a.label === "C-BOM" ? "CM" : "QM",
      collabType: "internal",
    })) : [];
    const tableRows = [...bomsForProject, ...archivedRows];
    return (
    <div className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: C.border }}>
      <table className="w-full text-xs">
        <thead className="border-b" style={{ borderColor: C.border, backgroundColor: C.bg }}>
          <tr style={{ color: C.textSecondary }}>
            <th className="text-left font-medium py-2.5 px-4">BOM</th>
            <th className="text-center font-medium py-2.5 px-4">Version</th>
            <th className="text-right font-medium py-2.5 px-4">Parts</th>
            <th className="text-left font-medium py-2.5 px-4">Last Activity</th>
            <th className="text-right font-medium py-2.5 px-4 w-44">Status</th>
          </tr>
        </thead>
        <tbody>
          {tableRows.map((b) => {
            const hasIssue = b.syncDelta > 0 || b.missing > 0;
            const isInactive = b.status !== "active";
            const isArchived = b.status === "archived";
            // Use subtle background instead of opacity for accessibility
            const rowBg = isArchived ? "#F5F5F5" : isInactive ? "#FAFAFA" : "white";

            return (
              <tr key={b.id}
                onClick={() => onBomClick(b)}
                className={`border-b ${b.status === "active" ? "cursor-pointer hover:bg-gray-50" : ""}`}
                style={{
                  borderColor: C.borderLight,
                  backgroundColor: rowBg,
                }}>
                {/* BOM cell: Avatar + label + name + owner avatar inline */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: isInactive ? "transparent" : C.bg,
                        border: isInactive ? `1px dashed ${C.border}` : "none",
                      }}>
                      <Network className="w-4 h-4"
                        style={{ color: isInactive ? C.textDisabled : C.textSecondary }} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold" style={{ color: isInactive ? C.textSecondary : C.textPrimary }}>
                        {b.label}
                      </div>
                      <div className="text-[10px] mt-0.5 flex items-center gap-1.5" style={{ color: C.textDisabled }}>
                        <span>{b.name}</span>
                        <span style={{ color: C.borderLight }}>·</span>
                        <span className="inline-flex items-center gap-1">
                          <PersonaAvatar p={b.owner} size={14} />
                          <span>{PERSONAS[b.owner]?.role}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Version */}
                <td className="py-3 px-4 text-center font-mono"
                  style={{ color: isInactive ? C.textDisabled : C.textPrimary }}>
                  {b.version}
                </td>

                {/* Parts with sync delta inline */}
                <td className="py-3 px-4 text-right">
                  {b.parts ? (
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="font-mono" style={{ color: isInactive ? C.textDisabled : C.textPrimary }}>
                        {b.parts}
                      </span>
                      {b.missing > 0 && (
                        <span className="text-[10px] font-mono font-semibold" style={{ color: C.warning }}>
                          ({b.missing} missing)
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="font-mono" style={{ color: C.textDisabled }}>—</span>
                  )}
                </td>

                {/* Last Activity */}
                <td className="py-3 px-4">
                  {b.lastActivity ? (
                    <div className="flex flex-col">
                      <span style={{ color: isInactive ? C.textSecondary : C.textPrimary }}>
                        {b.lastActivity.action}
                      </span>
                      <span className="text-[10px]" style={{ color: C.textDisabled }}>
                        by {PERSONAS[b.lastActivity.actor]?.name || b.lastActivity.actor} · {b.lastActivity.ts}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] italic" style={{ color: C.textDisabled }}>
                      No activity yet
                    </span>
                  )}
                </td>

                {/* Status — lifecycle-aligned with Kanban (Draft / In Review / Approved / Archived).
                    Special cases (not_created → Create from M, not_started → Start) preserved as actionable buttons.
                    Sync issues shown as a small warning dot next to the status pill. */}
                <td className="py-3 px-4 text-right">
                  {b.status === "not_created" ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); /* TODO: create flow */ }}
                      className="px-2.5 py-1 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                      style={{ backgroundColor: C.primarySoft, color: C.primary, border: `1px solid ${C.primaryLight}` }}>
                      <Plus className="w-3 h-3" />
                      Create from M
                    </button>
                  ) : b.status === "not_started" ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); /* TODO: start flow */ }}
                      className="px-2.5 py-1 rounded-full text-[10px] font-semibold inline-flex items-center gap-1 hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                      style={{ backgroundColor: C.warning, color: "white" }}
                      title={`${PERSONAS[b.owner]?.role} hasn't started yet`}>
                      <Play className="w-3 h-3" />
                      Start
                    </button>
                  ) : b.status === "archived" ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: C.bg, color: C.textDisabled, border: `1px solid ${C.borderLight}` }}>
                      <Archive className="w-3 h-3" />
                      Archived
                    </span>
                  ) : (() => {
                    // Active BOM: map lifecycle → label/color (mirrors Kanban columns)
                    const lifecycleMeta = {
                      draft:    { label: "Draft",     color: C.textSecondary, bg: C.bg,           icon: Edit3 },
                      review:   { label: "In Review", color: C.info,          bg: "rgba(21,101,224,0.08)", icon: Eye },
                      approved: { label: "Approved",  color: C.success,       bg: C.successLight, icon: CheckCircle },
                    }[b.lifecycle] || { label: "Active", color: C.textSecondary, bg: C.bg, icon: Circle };
                    const StatusIcon = lifecycleMeta.icon;
                    return (
                      <div className="inline-flex items-center gap-1.5">
                        {/* Sync warning dot — small visual flag if sync issue exists, without overtaking the lifecycle status */}
                        {hasIssue && (
                          <span title={b.syncNote || `${b.missing} parts need sync`}>
                            <AlertTriangle className="w-3 h-3" style={{ color: C.warning }} />
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: lifecycleMeta.bg, color: lifecycleMeta.color, border: `1px solid ${lifecycleMeta.color}` }}>
                          <StatusIcon className="w-3 h-3" />
                          {lifecycleMeta.label}
                        </span>
                      </div>
                    );
                  })()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
    );
  };

  const renderKanbanView = () => {
    // Filter only active BOMs (not_created/not_started don't appear in Kanban)
    const activeBoms = bomsForProject.filter(b => b.status === "active");
    // Apply collab type filter
    let filteredBoms = activeBoms.filter(b => collabFilters[b.collabType]);
    // Apply party filter: C-BOM now includes supplier collab (formerly S-BOM)
    filteredBoms = filteredBoms.filter(b => {
      const isExternal = b.id === "C"; // C-BOM owns supplier-facing activities
      return isExternal ? partyFilters.external : partyFilters.internal;
    });
    // Group by lifecycle stage (workflow Kanban)
    const draftColumn = filteredBoms.filter(b => b.lifecycle === "draft");
    const reviewColumn = filteredBoms.filter(b => b.lifecycle === "review");
    const approvedColumn = filteredBoms.filter(b => b.lifecycle === "approved");
    // Archived: only show column when there is data (hero project)
    const archivedColumn = isHeroProject ? ARCHIVED_BOMS : [];
    const showArchived = archivedColumn.length > 0;

    return (
      <div className="flex gap-4 items-start" style={{ minHeight: 600 }}>
        {/* === DRAFT Column (work in progress, not yet ready for review) === */}
        <KanbanColumn
          label="Draft"
          subtitle="Work in progress"
          dotColor={C.textSecondary}
          count={draftColumn.length}>
          {draftColumn.map((b) => (
            <KanbanCard key={b.id} bom={b} variant="draft" onClick={() => onBomClick(b)} />
          ))}
          {draftColumn.length === 0 && (
            <div className="text-center py-8 text-[11px]" style={{ color: C.textDisabled }}>
              No drafts
            </div>
          )}
        </KanbanColumn>

        {/* === IN REVIEW Column (under cross-functional review) === */}
        <KanbanColumn
          label="In Review"
          subtitle="Cross-functional review"
          dotColor={C.info}
          count={reviewColumn.length}>
          {reviewColumn.map((b) => (
            <KanbanCard key={b.id} bom={b} variant="review" onClick={() => onBomClick(b)} />
          ))}
          {reviewColumn.length === 0 && (
            <div className="text-center py-8 text-[11px]" style={{ color: C.textDisabled }}>
              No BOMs in review
            </div>
          )}
        </KanbanColumn>

        {/* === APPROVED Column (signed off, driving downstream work) === */}
        <KanbanColumn
          label="Approved"
          subtitle="Signed off"
          dotColor={C.success}
          count={approvedColumn.length}>
          {approvedColumn.map((b) => (
            <KanbanCard key={b.id} bom={b} variant="approved" onClick={() => onBomClick(b)} />
          ))}
          {approvedColumn.length === 0 && (
            <div className="text-center py-8 text-[11px]" style={{ color: C.textDisabled }}>
              No approved BOMs
            </div>
          )}
        </KanbanColumn>

        {/* === ARCHIVED Column (superseded by newer version) === */}
        {showArchived && (
          <KanbanColumn
            label="Archived"
            subtitle="Superseded"
            dotColor={C.textDisabled}
            count={archivedColumn.length}>
            {archivedColumn.map((b) => (
              <ArchivedKanbanCard key={b.id} bom={b} />
            ))}
          </KanbanColumn>
        )}
      </div>
    );
  };

  return (
    <div className="p-6" style={{ minHeight: "100%" }}>
      <div className="rounded-xl border bg-white" style={{ borderColor: C.border }}>
        {/* Toolbar: View toggle + Filters */}
        <div className="px-5 py-3 border-b flex items-center justify-between flex-wrap gap-3" style={{ borderColor: C.border }}>
          <div className="flex items-center gap-4 flex-wrap">
            {/* View Toggle (Kanban / Table) */}
            <div className="flex items-center p-0.5 rounded-full" style={{ backgroundColor: C.bg }}>
              {[
                { id: "kanban", label: "Kanban", icon: Columns3 },
                { id: "table", label: "Table", icon: AlignLeft },
              ].map((mode) => (
                <button key={mode.id} onClick={() => setViewMode(mode.id)}
                  className="px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                  style={{
                    backgroundColor: viewMode === mode.id ? "white" : "transparent",
                    color: viewMode === mode.id ? C.textPrimary : C.textSecondary,
                    boxShadow: viewMode === mode.id ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                    border: viewMode === mode.id ? `1px solid ${C.border}` : "1px solid transparent",
                  }}
                  onMouseEnter={(e) => { if (viewMode !== mode.id) e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.03)"; }}
                  onMouseLeave={(e) => { if (viewMode !== mode.id) e.currentTarget.style.backgroundColor = "transparent"; }}>
                  <mode.icon className="w-3.5 h-3.5" />
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Filter chips (Kanban only) */}
            {viewMode === "kanban" && (
              <>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium" style={{ color: C.textSecondary }}>Party</span>
                  <div className="flex items-center gap-1">
                    {[
                      { id: "internal", label: "Internal" },
                      { id: "external", label: "External" },
                    ].map((p) => (
                      <button key={p.id}
                        onClick={() => setPartyFilters({ ...partyFilters, [p.id]: !partyFilters[p.id] })}
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 hover:opacity-80"
                        style={{
                          backgroundColor: partyFilters[p.id] ? "rgba(83,45,246,0.08)" : "transparent",
                          color: partyFilters[p.id] ? C.primary : C.textSecondary,
                          border: `1px solid ${partyFilters[p.id] ? C.primary : C.border}`,
                        }}>
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="w-px h-4" style={{ backgroundColor: C.border }} />
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium" style={{ color: C.textSecondary }}>Collab Type</span>
                  <div className="flex items-center gap-1">
                    {[
                      { id: "design", label: "Design" },
                      { id: "cost", label: "Cost" },
                      { id: "quality", label: "Quality" },
                    ].map((c) => (
                      <button key={c.id}
                        onClick={() => setCollabFilters({ ...collabFilters, [c.id]: !collabFilters[c.id] })}
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 hover:opacity-80"
                        style={{
                          backgroundColor: collabFilters[c.id] ? "rgba(83,45,246,0.08)" : "transparent",
                          color: collabFilters[c.id] ? C.primary : C.textSecondary,
                          border: `1px solid ${collabFilters[c.id] ? C.primary : C.border}`,
                        }}>
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right side: Compare CTA + Phase + Count */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => { if (!project.isNew) setCompareModalOpen(true); }}
              disabled={project.isNew}
              className="h-7 px-2.5 rounded-md text-[11px] font-medium flex items-center gap-1.5 border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed"
              style={{
                borderColor: C.border,
                color: project.isNew ? C.textDisabled : C.textSecondary,
                backgroundColor: "white",
                opacity: project.isNew ? 0.5 : 1,
              }}
              onMouseEnter={(e) => { if (!project.isNew) e.currentTarget.style.backgroundColor = C.bg; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "white"; }}
              title={project.isNew ? "No previous versions to compare" : "Compare two BOM versions"}>
              <GitCompareArrows className="w-3.5 h-3.5" />
              Compare BOMs
            </button>

            <div className="text-[11px] flex items-center gap-2" style={{ color: C.textSecondary }}>
              <span style={{ color: C.textDisabled }}>Phase:</span>
              <span style={{ color: C.textPrimary, fontWeight: 500 }}>{project.phase}</span>
              <span style={{ color: C.borderLight }}>·</span>
              <span>{activeCount} of {bomsForProject.length} active</span>
            </div>
          </div>
        </div>

        {/* Body: Table or Kanban */}
        <div className="p-4" style={{ backgroundColor: viewMode === "kanban" ? C.bg : "white" }}>
          {viewMode === "table" ? renderTableView() : renderKanbanView()}
        </div>
      </div>

      {/* Compare BOMs Modal */}
      {compareModalOpen && (
        <CompareBomsModal
          activeProjectCode={activeProjectCode}
          onClose={() => setCompareModalOpen(false)}
          onJumpToBom={(bomId) => {
            setCompareModalOpen(false);
            setActiveBom(bomId);
            setView("bom");
          }}
        />
      )}
    </div>
  );
}

// === COMPARE BOMs MODAL (BOMs page header) ===
// Allows user to pick a BOM type and compare any 2 versions from this project.
// Different from CompareModal (inside BomWorkspace) — that one is locked to active BOM + immediate previous version.
function CompareBomsModal({ activeProjectCode, onClose, onJumpToBom }) {
  // Available BOM types to compare (filter to active ones in BOM_LIST)
  const bomTypes = BOM_LIST.map(b => ({ id: b.id, label: b.label, name: b.name }));

  // Mock version history per BOM type (in real app: fetched from version log)
  const versionHistory = {
    E: ["v1.8", "v1.7", "v1.5", "v1.0", "v0.5"],
    C: ["v2.2", "v2.1", "v2.0", "v1.5", "v1.0"],
    Q: ["v1.5", "v1.4", "v1.3", "v1.0"],
  };

  // State
  const [selectedBom, setSelectedBom] = useState("E");
  const versions = versionHistory[selectedBom] || [];
  const [toVersion, setToVersion] = useState(versions[0]); // latest
  const [fromVersion, setFromVersion] = useState(versions[1]); // previous

  // Reset versions when BOM type changes
  useEffect(() => {
    const vs = versionHistory[selectedBom] || [];
    setToVersion(vs[0]);
    setFromVersion(vs[1]);
  }, [selectedBom]);

  // Resolve diff (uses BOM_VERSION_DIFFS for "latest vs previous"; otherwise show generic mock)
  const diff = BOM_VERSION_DIFFS[selectedBom];
  const isLatestVsPrevious =
    diff && toVersion === diff.current && fromVersion === diff.previous;

  // For non-default version combinations, generate a lighter mock (fewer changes)
  const effectiveDiff = isLatestVsPrevious ? diff : {
    current: toVersion, previous: fromVersion,
    added: [], modified: [], removed: [],
  };

  const totalChanges = (effectiveDiff.added?.length || 0) + (effectiveDiff.modified?.length || 0) + (effectiveDiff.removed?.length || 0);
  const activeBomMeta = BOM_LIST.find(b => b.id === selectedBom);

  // Close on Esc
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 transition-opacity"
        style={{ backgroundColor: "rgba(16, 24, 40, 0.4)" }}
        onClick={onClose} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 z-50 bg-white rounded-2xl shadow-2xl flex flex-col"
        style={{
          transform: "translate(-50%, -50%)",
          width: 720,
          maxHeight: "85vh",
        }}>
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b flex items-start gap-4" style={{ borderColor: C.border }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: C.primarySoft }}>
            <GitCompareArrows className="w-5 h-5" style={{ color: C.primary }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[18px] font-semibold leading-6" style={{ color: C.textPrimary }}>
              Compare BOM Versions
            </div>
            <div className="text-sm mt-0.5" style={{ color: C.textSecondary }}>
              Select a BOM type and two versions to compare
            </div>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-md flex items-center justify-center transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{ color: C.textSecondary }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selectors strip */}
        <div className="px-6 py-4 border-b" style={{ borderColor: C.border, backgroundColor: C.surfaceTinted }}>
          {/* BOM type selector */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] uppercase tracking-wider font-semibold shrink-0 w-16" style={{ color: C.textDisabled }}>
              BOM
            </span>
            <div className="flex items-center gap-1 p-0.5 rounded-md" style={{ backgroundColor: "white", border: `1px solid ${C.border}` }}>
              {bomTypes.map(bt => (
                <button key={bt.id}
                  onClick={() => setSelectedBom(bt.id)}
                  className="h-7 px-3 rounded text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                  style={{
                    backgroundColor: selectedBom === bt.id ? C.primary : "transparent",
                    color: selectedBom === bt.id ? "white" : C.textSecondary,
                  }}
                  onMouseEnter={(e) => { if (selectedBom !== bt.id) e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.03)"; }}
                  onMouseLeave={(e) => { if (selectedBom !== bt.id) e.currentTarget.style.backgroundColor = "transparent"; }}>
                  {bt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Version selectors */}
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold shrink-0 w-12" style={{ color: C.textDisabled }}>From</span>
              <select value={fromVersion} onChange={(e) => setFromVersion(e.target.value)}
                className="h-8 px-2 rounded-md border text-xs bg-white outline-none focus:outline-none focus-visible:ring-2 flex-1"
                style={{ borderColor: C.border, color: C.textPrimary }}>
                {versions.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <ArrowRight className="w-4 h-4 shrink-0" style={{ color: C.textDisabled }} />
            <div className="flex-1 flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold shrink-0 w-8" style={{ color: C.textDisabled }}>To</span>
              <select value={toVersion} onChange={(e) => setToVersion(e.target.value)}
                className="h-8 px-2 rounded-md border text-xs bg-white outline-none focus:outline-none focus-visible:ring-2 flex-1"
                style={{ borderColor: C.border, color: C.textPrimary }}>
                {versions.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4" style={{ maxHeight: "calc(85vh - 280px)" }}>
          {/* Diff summary line */}
          <div className="mb-4 flex items-center gap-2 text-xs" style={{ color: C.textSecondary }}>
            <span><strong style={{ color: C.textPrimary }}>{totalChanges}</strong> change{totalChanges !== 1 ? "s" : ""} in {activeBomMeta?.label}</span>
            <span style={{ color: C.borderLight }}>·</span>
            <span><span className="font-mono">{fromVersion}</span> → <span className="font-mono">{toVersion}</span></span>
            {!isLatestVsPrevious && totalChanges === 0 && (
              <span className="ml-auto text-[11px]" style={{ color: C.textDisabled }}>
                Detailed diff only available for latest vs previous
              </span>
            )}
          </div>

          {/* No changes state */}
          {totalChanges === 0 && (
            <div className="py-12 text-center">
              <CheckCircle className="w-10 h-10 mx-auto mb-2" style={{ color: C.textDisabled }} />
              <div className="text-sm" style={{ color: C.textSecondary }}>
                {fromVersion === toVersion
                  ? "Same version selected on both sides."
                  : "No changes between these versions."}
              </div>
            </div>
          )}

          {/* Added */}
          {effectiveDiff.added?.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full"
                  style={{ backgroundColor: "rgba(0,153,85,0.12)" }}>
                  <Plus className="w-3 h-3" style={{ color: C.success }} />
                </span>
                <span className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: C.success }}>
                  Added · {effectiveDiff.added.length}
                </span>
              </div>
              <div className="border rounded-lg divide-y" style={{ borderColor: C.borderLight }}>
                {effectiveDiff.added.map((p, i) => (
                  <div key={i} className="px-3 py-2.5">
                    <div className="text-sm font-medium" style={{ color: C.textPrimary }}>{p.name}</div>
                    <div className="text-[11px] font-mono mt-0.5" style={{ color: C.textDisabled }}>{p.partId}</div>
                    <div className="text-xs mt-1" style={{ color: C.textSecondary }}>{p.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modified */}
          {effectiveDiff.modified?.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full"
                  style={{ backgroundColor: "rgba(224,105,0,0.12)" }}>
                  <Edit3 className="w-3 h-3" style={{ color: C.warning }} />
                </span>
                <span className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: C.warning }}>
                  Modified · {effectiveDiff.modified.length}
                </span>
              </div>
              <div className="border rounded-lg divide-y" style={{ borderColor: C.borderLight }}>
                {effectiveDiff.modified.map((p, i) => (
                  <div key={i} className="px-3 py-2.5">
                    <div className="text-sm font-medium" style={{ color: C.textPrimary }}>{p.name}</div>
                    <div className="text-[11px] font-mono mt-0.5" style={{ color: C.textDisabled }}>{p.partId}</div>
                    <div className="text-xs mt-1" style={{ color: C.textSecondary }}>{p.change}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Removed */}
          {effectiveDiff.removed?.length > 0 && (
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full"
                  style={{ backgroundColor: "rgba(211,47,47,0.12)" }}>
                  <X className="w-3 h-3" style={{ color: C.error }} />
                </span>
                <span className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: C.error }}>
                  Removed · {effectiveDiff.removed.length}
                </span>
              </div>
              <div className="border rounded-lg divide-y" style={{ borderColor: C.borderLight }}>
                {effectiveDiff.removed.map((p, i) => (
                  <div key={i} className="px-3 py-2.5">
                    <div className="text-sm font-medium line-through" style={{ color: C.textSecondary }}>{p.name}</div>
                    <div className="text-[11px] font-mono mt-0.5" style={{ color: C.textDisabled }}>{p.partId}</div>
                    <div className="text-xs mt-1" style={{ color: C.textSecondary }}>{p.reason}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t flex items-center justify-between gap-2" style={{ borderColor: C.border }}>
          <button
            onClick={() => onJumpToBom(selectedBom)}
            className="h-9 px-3 rounded-md text-xs font-medium inline-flex items-center gap-1.5 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2"
            style={{ color: C.primary, backgroundColor: "transparent" }}>
            <ArrowRight className="w-3.5 h-3.5" />
            Open in BOM Collaboration
          </button>
          <div className="flex items-center gap-2">
            <button onClick={onClose}
              className="h-9 px-4 rounded-md text-sm font-medium border transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2"
              style={{ borderColor: C.border, color: C.textPrimary, backgroundColor: "white" }}>
              Close
            </button>
            <button
              disabled={totalChanges === 0}
              className="h-9 px-4 rounded-md text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: C.primary }}>
              Export Diff
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// === KANBAN COLUMN ===
function KanbanColumn({ label, subtitle, dotColor, count, children }) {
  return (
    <div className="flex-1 min-w-0 rounded-2xl p-4 flex flex-col gap-3"
      style={{ backgroundColor: "#F6F8F9" }}>
      {/* Column header */}
      <div className="flex items-center gap-2 px-2">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />
        <span className="text-sm font-semibold" style={{ color: C.textPrimary }}>{label}</span>
        <span className="text-sm font-semibold tabular-nums" style={{ color: C.textSecondary }}>{count}</span>
        {subtitle && (
          <span className="text-[10px] ml-auto" style={{ color: C.textDisabled }}>{subtitle}</span>
        )}
      </div>
      {/* Cards */}
      <div className="flex flex-col gap-2">
        {children}
      </div>
    </div>
  );
}

// === KANBAN CARD (Master / Promoted variants) ===
function KanbanCard({ bom, variant, onClick }) {
  // Progress color by lifecycle stage
  const progressColor = variant === "draft" ? C.textSecondary
    : variant === "review" ? C.info
    : variant === "approved" ? C.success
    : C.primary;
  const statusColor = bom.collabStatus.includes("Pending") || bom.collabStatus.includes("Submitted")
    ? C.warning : C.success;

  return (
    <div onClick={onClick}
      className="bg-white border rounded-xl p-3 cursor-pointer hover:shadow-sm transition-shadow flex flex-col gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
      style={{ borderColor: C.border }}>
      {/* Header: BOM family + version + parties */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-sm font-semibold truncate" style={{ color: C.textPrimary }}>
            {bom.label}
          </span>
          <span className="text-xs shrink-0" style={{ color: C.textDisabled }}>·</span>
          <span className="text-xs font-mono shrink-0" style={{ color: C.textSecondary }}>
            {bom.version}
          </span>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-medium shrink-0"
          style={{ color: C.textSecondary }}>
          <Users className="w-3 h-3" />
          {bom.parties}
        </span>
      </div>

      {/* Progress: Collab label + progress bar + status */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-medium truncate pr-2" style={{ color: C.textSecondary }}>
            {bom.collabLabel}
          </span>
          <span className="text-[10px] font-mono font-semibold shrink-0" style={{ color: progressColor }}>
            {bom.collabProgress}%
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: C.borderLight }}>
          <div className="h-full rounded-full transition-all"
            style={{ width: `${bom.collabProgress}%`, backgroundColor: progressColor }} />
        </div>
        {/* Status line */}
        <div className="flex items-center gap-1.5 text-[10px]" style={{ color: C.textSecondary }}>
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: statusColor }} />
          <span className="truncate">{bom.collabStatus}</span>
        </div>
      </div>
    </div>
  );
}

// === ARCHIVED KANBAN CARD — minimal summary, click to expand details ===
function ArchivedKanbanCard({ bom }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="rounded-xl border bg-white"
      style={{ borderColor: C.border }}>
      {/* Header — always visible */}
      <button onClick={() => setExpanded(!expanded)}
        className="w-full px-3 py-2.5 flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded-xl hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-medium" style={{ color: C.textPrimary }}>{bom.label}</span>
          <span className="text-[10px] font-mono" style={{ color: C.textDisabled }}>{bom.code}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px]" style={{ color: C.textSecondary }}>
            {bom.versions.length} ver{bom.versions.length > 1 ? "s" : ""}
          </span>
          <ChevronDown className="w-3 h-3 transition-transform"
            style={{
              color: C.textDisabled,
              transform: expanded ? "rotate(0deg)" : "rotate(-90deg)",
            }} />
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="px-3 pb-3 pt-1 border-t flex flex-col gap-2" style={{ borderColor: C.borderLight }}>
          {/* Cost section (if any) */}
          {bom.cost && (
            <div>
              <div className="text-[10px] font-semibold mt-1.5 mb-1" style={{ color: C.textSecondary }}>Cost</div>
              <div className="bg-gray-50 rounded-md px-2.5 py-1.5 flex items-center justify-between">
                <span className="text-[11px] font-medium" style={{ color: C.textPrimary }}>{bom.cost.ver}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-semibold"
                    style={{ color: bom.cost.overTarget ? C.error : C.success }}>
                    {bom.cost.delta}
                  </span>
                  <span className="text-[11px] font-mono" style={{ color: C.textPrimary }}>{bom.cost.target}</span>
                </div>
              </div>
            </div>
          )}
          {/* Versions */}
          <div>
            <div className="text-[10px] font-semibold mt-1 mb-1" style={{ color: C.textSecondary }}>Versions</div>
            <div className="flex flex-wrap gap-1">
              {bom.versions.map((v) => (
                <span key={v} className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-50"
                  style={{ color: C.textPrimary }}>
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// === SCREEN 2. BOM WORKSPACE ===
function BomWorkspace({ selectedItemId, setSelectedItemId, scenarioStep, activePersona, activeBom, setActiveBom, onOpenItemChat, activeProjectCode, setView }) {
  const project = PROJECTS.find((p) => p.code === activeProjectCode) || PROJECTS[0];
  const isHeroProject = project.code === ACTIVE_PROJECT_CODE;

  const [expandedNodes, setExpandedNodes] = useState(new Set([1, 2, 3]));
  const [filter, setFilter] = useState("all");
  const [drawerTab, setDrawerTab] = useState("spec");

  // Resizable split: left panel (BOM Tree) is user-adjustable, right panel is 400px min
  // Default: left takes most space, right detail panel is 400px
  const [leftPanelWidth, setLeftPanelWidth] = useState(null); // null = use flex-1 default
  const splitContainerRef = useRef(null);
  const isDraggingRef = useRef(false);

  const startDrag = (e) => {
    e.preventDefault();
    isDraggingRef.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };
  useEffect(() => {
    const onMove = (e) => {
      if (!isDraggingRef.current || !splitContainerRef.current) return;
      const containerRect = splitContainerRef.current.getBoundingClientRect();
      const newLeft = e.clientX - containerRect.left;
      const minLeft = 400; // BOM Tree min
      const minRight = 320; // Item 360 min
      const maxLeft = containerRect.width - minRight;
      setLeftPanelWidth(Math.max(minLeft, Math.min(maxLeft, newLeft)));
    };
    const onUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  // 3-axis view controls
  const [structure, setStructure] = useState("tree"); // tree | flat
  const [groupBy, setGroupBy] = useState("supplier"); // supplier | ppap | category | risk
  const [overlay, setOverlay] = useState("none"); // none | costHeat | riskHeat

  // Module filter (E-BOM only) — null = show all modules; otherwise restrict to that module name
  const [moduleFilter, setModuleFilter] = useState(null);

  // Category → Module mapping (shared between filter toolbar and grouping logic).
  // Module = high-level smartphone subsystem (Display / Mainboard / Camera / Battery / Audio / Mechanical / Other).
  const categoryToModule = (cat) => {
    if (!cat) return "Other";
    const c = cat.toLowerCase();
    if (c.includes("display")) return "Display Module";
    if (c.includes("pcb") || c.includes("antenna")) return "Mainboard";
    if (c.includes("camera") || c.includes("sensor")) return "Camera Module";
    if (c.includes("battery") || c.includes("power")) return "Battery Module";
    if (c.includes("audio")) return "Audio Module";
    if (c.includes("mechanical") || c.includes("packaging") || c.includes("connector") || c.includes("assembly")) return "Mechanical";
    return "Other";
  };

  // Distinct modules present in the BOM (for the filter pill row).
  // Ordered: most-common first (Mechanical typically largest), then alphabetical.
  const moduleOptions = useMemo(() => {
    const counts = {};
    BOM_TREE.forEach((n) => {
      const m = categoryToModule(n.category);
      counts[m] = (counts[m] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, []);

  // Heatmap level filter — which severity levels to show
  // Cost heat: { high, med, under, neutral } | Risk heat: { high, med, low }
  // null = show all (default)
  const [heatLevels, setHeatLevels] = useState(null);

  // Overlay options per BOM family (semantic separation of concerns)
  // E-BOM: spec only | Q-BOM: PPAP risk | C-BOM: cost (incl. sourcing)
  const OVERLAYS_BY_BOM = {
    E: ["none"],
    Q: ["none", "riskHeat"],
    C: ["none", "costHeat"],
  };
  const availableOverlays = OVERLAYS_BY_BOM[activeBom] || ["none"];

  // Auto-reset overlay if current selection isn't valid for active BOM
  useEffect(() => {
    if (!availableOverlays.includes(overlay)) {
      setOverlay("none");
    }
    // Reset heat level filter when overlay changes
    setHeatLevels(null);
  }, [activeBom, overlay]);

  // Toggle a heatmap level (multi-select). null → all-but-this. clicking same level → reset
  const toggleHeatLevel = (level) => {
    setHeatLevels((current) => {
      if (current === null) {
        // First selection: hide all levels except this one
        return new Set([level]);
      }
      const next = new Set(current);
      if (next.has(level)) {
        next.delete(level);
        if (next.size === 0) return null; // empty → back to show-all
      } else {
        next.add(level);
      }
      return next;
    });
  };

  // === Timeline & Compare ===
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [expandedTimelineEvent, setExpandedTimelineEvent] = useState(null);

  // Reset timeline expanded state when BOM changes
  useEffect(() => {
    setExpandedTimelineEvent(null);
  }, [activeBom]);

  // Promote BOM state
  const [promoteOpen, setPromoteOpen] = useState(false);
  const [promoteTarget, setPromoteTarget] = useState(null);
  const [promoteToast, setPromoteToast] = useState(null);

  const onPromoteClick = (targetBomId) => {
    setPromoteTarget(targetBomId);
    setPromoteOpen(true);
  };
  const onPromoteConfirm = (targetBomId, parts) => {
    setPromoteOpen(false);
    setPromoteTarget(null);
    setPromoteToast({
      target: targetBomId,
      count: parts.length,
      ts: Date.now(),
    });
    // Auto-dismiss toast
    setTimeout(() => setPromoteToast(null), 4000);
    // Auto-switch to target BOM
    if (setActiveBom) setActiveBom(targetBomId);
  };

  const activeBomMeta = BOM_LIST.find((b) => b.id === activeBom) || BOM_LIST[0];

  // Apply default view when switching BOM + reset selected item
  useEffect(() => {
    const d = activeBomMeta.defaults;
    setStructure(d.structure);
    setGroupBy(d.groupBy);
    setOverlay(d.overlay);
    setSelectedItemId(null); // Reset selection when switching BOM
    setModuleFilter(null);   // Reset module filter when switching BOM
  }, [activeBom]);

  // Always start with Spec tab when an item is selected
  useEffect(() => {
    if (selectedItemId) setDrawerTab("spec");
  }, [selectedItemId]);

  const toggleNode = (id) => {
    const next = new Set(expandedNodes);
    next.has(id) ? next.delete(id) : next.add(id);
    setExpandedNodes(next);
  };

  // visibleNodes: renders differently per Structure
  // - tree: hierarchy + expand/collapse
  // - flat: flatten all leaf parts + apply groupBy
  const visibleNodes = useMemo(() => {
    // === Filter predicates (shared between count badges and filter application) ===
    const qBomMissingIds = [3, 10, 14, 18];
    const cBomMissingIds = [3]; // formerly sBomMissingIds — now part of C-BOM (Source & Cost)
    const eBomLagIds = [5, 8];
    const isMissingNode = (n) => {
      if (activeBom === "Q" && qBomMissingIds.includes(n.id) && scenarioStep < 7) return true;
      if (activeBom === "C" && cBomMissingIds.includes(n.id) && scenarioStep < 6) return true;
      if (activeBom === "E" && eBomLagIds.includes(n.id)) return true;
      return false;
    };
    const matchesFilter = (n) => {
      if (filter === "all") return true;
      if (filter === "missing") return isMissingNode(n);
      if (filter === "blocked") return Object.values(n.status || {}).some((s) => s === "block");
      if (filter === "comments") return (n.comments || 0) > 0;
      return true;
    };

    let result = [];

    if (structure === "tree") {
      // When filter is active, build ancestor-inclusive set so tree structure is preserved
      // and matched nodes are visible regardless of expand state.
      if (filter !== "all") {
        const matchedIds = new Set();
        const ancestorMap = {}; // childId -> parentId
        // Build ancestor map by walking BOM_TREE
        BOM_TREE.forEach((n) => {
          (n.children || []).forEach((cid) => { ancestorMap[cid] = n.id; });
        });
        // Find direct matches
        BOM_TREE.forEach((n) => {
          if (matchesFilter(n)) {
            matchedIds.add(n.id);
            // Include all ancestors
            let pid = ancestorMap[n.id];
            while (pid !== undefined) {
              matchedIds.add(pid);
              pid = ancestorMap[pid];
            }
          }
        });
        // Now traverse from root, including only matched nodes; auto-expand to show matches
        const traverse = (id) => {
          if (!matchedIds.has(id)) return;
          const node = BOM_TREE.find((n) => n.id === id);
          if (!node) return;
          result.push({ ...node, _groupKey: null, _filterAutoExpanded: true });
          if (node.children) node.children.forEach(traverse);
        };
        [1].forEach(traverse);
        return result;
      }
      // No filter: respect user's expand state
      const traverse = (id) => {
        const node = BOM_TREE.find((n) => n.id === id);
        if (!node) return;
        result.push({ ...node, _groupKey: null });
        if (expandedNodes.has(id) && node.children) {
          node.children.forEach(traverse);
        }
      };
      [1].forEach(traverse);
      return result;
    }

    // Flat mode: flatten all nodes + apply groupBy + insert group headers
    // Special: groupBy="module" uses the categoryToModule mapping (defined at component scope above).
    const flatNodes = BOM_TREE.map((n) => ({
      ...n,
      lvl: 1,
      _groupKey: groupBy === "module" ? categoryToModule(n.category) : (n[groupBy] || "Unknown"),
    }));

    if (groupBy === "none") {
      // No grouping — return flat list directly, no group headers
      flatNodes.forEach((n) => result.push(n));
    } else {
      const grouped = {};
      flatNodes.forEach((n) => {
        const k = n._groupKey;
        if (!grouped[k]) grouped[k] = [];
        grouped[k].push(n);
      });
      Object.keys(grouped).sort().forEach((k) => {
        result.push({ id: `__group_${k}`, _isGroupHeader: true, _groupKey: k, _groupCount: grouped[k].length });
        grouped[k].forEach((n) => result.push(n));
      });
    }

    // Heat level filter (overlay heatmaps): show only matching levels + ancestors
    const matchesHeatLevel = (n) => {
      if (heatLevels === null) return true; // show all
      if (overlay === "costHeat") {
        const base = 5 + (n.id % 12) * 3.4;
        const target = base * 0.95;
        const quoted = n.id === 3 ? (scenarioStep >= 7 ? 38.90 : 41.80)
          : Math.round((base + ((n.id % 5) - 2) * 0.3) * 100) / 100;
        const delta = n.id === 3 ? (scenarioStep >= 7 ? 0.90 : 3.80) : Math.round((quoted - target) * 100) / 100;
        const level = delta > 1.5 ? "high" : delta > 0.5 ? "med" : delta < -0.3 ? "savings" : "neutral";
        return heatLevels.has(level);
      }
      if (overlay === "riskHeat") {
        const risk = n.isHero ? "Med" : (n.id === 10 ? "High" : (n.id === 6 ? "Med" : "Low"));
        const level = risk === "High" ? "high" : risk === "Med" ? "med" : "low";
        return heatLevels.has(level);
      }
      return true;
    };

    // Apply heat filter (tree: include ancestors; flat: filter directly)
    if (heatLevels !== null && overlay !== "none") {
      if (structure === "tree") {
        // Tree: build ancestor-inclusive set similar to filter logic
        const matchedIds = new Set();
        const ancestorMap = {};
        BOM_TREE.forEach((n) => { (n.children || []).forEach((cid) => { ancestorMap[cid] = n.id; }); });
        BOM_TREE.forEach((n) => {
          if (matchesHeatLevel(n)) {
            matchedIds.add(n.id);
            let pid = ancestorMap[n.id];
            while (pid !== undefined) { matchedIds.add(pid); pid = ancestorMap[pid]; }
          }
        });
        result = result.filter((n) => matchedIds.has(n.id));
      } else {
        // Flat: filter by predicate, preserve group headers
        result = result.filter((n) => n._isGroupHeader || matchesHeatLevel(n));
      }
    }

    // Filter (flat mode): preserve group headers, filter items by predicate
    if (filter !== "all") {
      result = result.filter((n) => n._isGroupHeader || matchesFilter(n));
    }

    // Module filter (E-BOM only) — restrict to one subsystem.
    // In tree mode, keep only matching nodes + their ancestors (so the hierarchy stays navigable).
    // In flat mode, keep group headers + matching nodes.
    if (activeBom === "E" && moduleFilter !== null) {
      if (structure === "tree") {
        const ancestorMap = {};
        BOM_TREE.forEach((n) => (n.children || []).forEach((cid) => { ancestorMap[cid] = n.id; }));
        const keepIds = new Set();
        BOM_TREE.forEach((n) => {
          if (categoryToModule(n.category) === moduleFilter) {
            keepIds.add(n.id);
            let pid = ancestorMap[n.id];
            while (pid !== undefined) { keepIds.add(pid); pid = ancestorMap[pid]; }
          }
        });
        // Root always kept so children can render
        keepIds.add(1);
        result = result.filter((n) => keepIds.has(n.id));
      } else {
        result = result.filter((n) => n._isGroupHeader
          ? n._groupKey === moduleFilter || (groupBy !== "module")
          : categoryToModule(n.category) === moduleFilter);
      }
    }

    return result;
  }, [expandedNodes, filter, structure, groupBy, activeBom, scenarioStep, heatLevels, overlay, moduleFilter]);

  // Per-part detail: Hero (id 3) is scenario subject; others come from ITEM_DETAILS map.
  // For any BOM_TREE node not in ITEM_DETAILS, synthesize a minimal mock so the Item 360 drawer
  // renders consistently across E/C/Q BOM views (spec/cost/suppliers/quality sections all present).
  const selectedItem = useMemo(() => {
    if (selectedItemId === null) return null;
    if (selectedItemId === 3) return HERO_ITEM;
    if (ITEM_DETAILS[selectedItemId]) return ITEM_DETAILS[selectedItemId];
    // Fallback: derive from BOM_TREE node with synthesized detail fields
    const node = BOM_TREE.find((n) => n.id === selectedItemId);
    if (!node) return null;
    // Deterministic derived values (same pattern as mockCost in the table)
    const base = 5 + (node.id % 12) * 3.4;
    const target = base * 0.95;
    const quoted = base + ((node.id % 5) - 2) * 0.3;
    const shouldCost = base * 0.98;
    const market = base * 1.04;
    const historical = base * 1.02;
    const hasCarryover = (node.id % 5) !== 0;
    const carryover = hasCarryover ? Math.round((quoted * (1 + ((node.id % 7) - 3) * 0.015)) * 100) / 100 : null;
    // Risk derivation aligned with BOM Workspace logic
    const risk = node.id === 10 ? "High" : node.id === 6 ? "Med" : "Low";
    const ppapLevel = risk === "High" ? 3 : risk === "Med" ? 2 : 1;
    return {
      id: node.id,
      partId: node.partId,
      partName: node.partName || node.desc,
      itemCode: node.itemCode || "N/A",
      desc: node.desc,
      category: node.category || "—",
      type: node.type || "—",
      uom: node.uom || "EA",
      supplier: node.supplier,
      status: node.status || { D: "ok", C: "ok", Q: "ok" },
      // Synthesized spec (sparse — actual specs only for documented parts)
      spec: {
        "Part Type": node.type || "—",
        "Category": node.category || "—",
        "Unit of Measure": node.uom || "EA",
        ...(node.supplier ? { "Current Supplier": node.supplier } : {}),
      },
      cost: {
        target: Math.round(target * 100) / 100,
        current: Math.round(quoted * 100) / 100,
        historical: Math.round(historical * 100) / 100,
        market: Math.round(market * 100) / 100,
        shouldCost: Math.round(shouldCost * 100) / 100,
        quoted: Math.round(quoted * 100) / 100,
        carryover,
        delta: Math.round((quoted - target) * 100) / 100,
      },
      suppliers: node.supplier
        ? [{ name: node.supplier, risk, capability: 90, performance: 88, recommended: true }]
        : [],
      quality: {
        riskLevel: risk,
        ppapLevel,
        progress: risk === "High" ? 30 : risk === "Med" ? 65 : 95,
        deliverables: [
          { name: "Design Records", status: "submitted" },
          { name: "Process Flow Diagram", status: risk === "High" ? "pending" : "submitted" },
          { name: "PFMEA", status: risk === "High" ? "pending" : "submitted" },
          { name: "Control Plan", status: risk !== "Low" ? "pending" : "submitted" },
        ],
      },
    };
  }, [selectedItemId]);

  // === Empty state: newly-created project with no BOMs yet ===
  if (project.isNew) {
    return (
      <div className="p-6" style={{ minHeight: "100%" }}>
        <div className="rounded-xl border bg-white py-16 px-8 text-center" style={{ borderColor: C.border }}>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ backgroundColor: C.primarySoft }}>
            <Network className="w-8 h-8" style={{ color: C.primary }} />
          </div>
          <div className="text-base font-semibold mb-2" style={{ color: C.textPrimary }}>
            No BOM to Collaborate On
          </div>
          <div className="text-sm max-w-md mx-auto mb-6" style={{ color: C.textSecondary }}>
            BOM Collaboration becomes active once the first BOM exists. Start with E-BOM, then C-BOM and Q-BOM follow in parallel as each domain engages.
          </div>
          <div className="inline-flex items-center gap-2">
            <button
              onClick={() => setView && setView("bomlist")}
              className="px-4 py-2 rounded-md text-sm font-semibold text-white inline-flex items-center gap-2 hover:opacity-90"
              style={{ backgroundColor: C.primary }}>
              <Upload className="w-4 h-4" />
              Upload E-BOM
            </button>
            <button
              onClick={() => setView && setView("cockpit")}
              className="px-4 py-2 rounded-md text-sm font-medium border inline-flex items-center gap-2 hover:bg-gray-50"
              style={{ borderColor: C.border, color: C.textSecondary, backgroundColor: "white" }}>
              Back to Overview
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Top Action Bar — single row, all controls aligned to h-7 (28px) */}
      <div className="px-6 py-2.5 bg-white border-b flex items-center gap-3 flex-wrap" style={{ borderColor: C.border }}>
        {/* Left: BOM identity + sync status */}
        <div className="flex items-center gap-2 min-w-0 h-7">
          <span className="text-sm font-semibold whitespace-nowrap leading-7" style={{ color: C.textPrimary }}>
            {activeBomMeta.name}
          </span>
          <span className="text-[11px] h-5 px-1.5 inline-flex items-center rounded font-mono"
            style={{ backgroundColor: C.bg, color: C.textSecondary }}>
            {activeBomMeta.version} · {activeBomMeta.parts}p
          </span>
        </div>

        {/* Divider — aligned to control row (h-5 within h-7 container) */}
        <div className="w-px h-5" style={{ backgroundColor: C.border }} />

        {/* Center: View Controls — Structure + GroupBy + Heatmap toggle (all h-7) */}
        <div className="flex items-center gap-1.5">
          {/* Segmented: Structure */}
          <div className="h-7 flex items-center gap-0.5 p-0.5 rounded-md" style={{ backgroundColor: C.bg }}>
            {[
              { id: "tree", icon: GitBranch, label: "Tree" },
              { id: "flat", icon: AlignLeft, label: "Flat" },
            ].map((s) => (
              <button key={s.id} onClick={() => setStructure(s.id)}
                className="h-6 px-2 rounded text-[11px] font-medium flex items-center gap-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                style={{
                  backgroundColor: structure === s.id ? "white" : "transparent",
                  color: structure === s.id ? C.primary : C.textSecondary,
                  boxShadow: structure === s.id ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                }}
                onMouseEnter={(e) => { if (structure !== s.id) e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.03)"; }}
                onMouseLeave={(e) => { if (structure !== s.id) e.currentTarget.style.backgroundColor = "transparent"; }}>
                <s.icon className="w-3 h-3" />
                {s.label}
              </button>
            ))}
          </div>
          {/* Group dropdown — visible in both tree and flat. Disabled in tree (hierarchy already groups). */}
          <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}
            disabled={structure === "tree"}
            title={structure === "tree" ? "Switch to Flat view to apply grouping" : undefined}
            className="h-7 px-2 rounded-md border text-[11px] outline-none bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed"
            style={{
              borderColor: C.border,
              color: structure === "tree" ? C.textDisabled : C.textPrimary,
              backgroundColor: structure === "tree" ? C.bg : "white",
            }}>
              {/* E-BOM: engineering perspective (no supplier/risk/ppap — those are downstream) */}
              {activeBom === "E" && (
                <>
                  <option value="none">Group: None</option>
                  <option value="module">Group: Module</option>
                  <option value="category">Group: Category</option>
                  <option value="type">Group: Part Type</option>
                </>
              )}
              {/* C-BOM: sourcing + cost perspective */}
              {activeBom === "C" && (
                <>
                  <option value="none">Group: None</option>
                  <option value="supplier">Group: Supplier</option>
                  <option value="category">Group: Category</option>
                </>
              )}
              {/* Q-BOM: quality / risk perspective */}
              {activeBom === "Q" && (
                <>
                  <option value="none">Group: None</option>
                  <option value="ppap">Group: PPAP Level</option>
                  <option value="risk">Group: Risk Level</option>
                  <option value="supplier">Group: Supplier</option>
                </>
              )}
            </select>

          {/* Heatmap toggle — segmented-style (matches Structure visually) */}
          {availableOverlays.length > 1 && (() => {
            const overlayMeta = availableOverlays.find(o => o !== "none");
            const isOn = overlay === overlayMeta;
            const overlayConfig = {
              costHeat: { icon: DollarSign, label: "Cost Heatmap" },
              riskHeat: { icon: AlertTriangle, label: "Risk Heatmap" },
            }[overlayMeta];
            const Icon = overlayConfig.icon;
            return (
              <div className="h-7 flex items-center p-0.5 rounded-md" style={{ backgroundColor: C.bg }}>
                <button
                  onClick={() => setOverlay(isOn ? "none" : overlayMeta)}
                  className="h-6 px-2 rounded text-[11px] font-medium flex items-center gap-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                  style={{
                    backgroundColor: isOn ? "white" : "transparent",
                    color: isOn ? C.primary : C.textSecondary,
                    boxShadow: isOn ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                  }}
                  onMouseEnter={(e) => { if (!isOn) e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.03)"; }}
                  onMouseLeave={(e) => { if (!isOn) e.currentTarget.style.backgroundColor = "transparent"; }}
                  title={isOn ? `Hide ${overlayConfig.label}` : `Show ${overlayConfig.label}`}>
                  <Icon className="w-3 h-3" />
                  {overlayConfig.label}
                </button>
              </div>
            );
          })()}
        </div>

        {/* Right: Compare + Timeline buttons */}
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={() => { if (!project.isNew) setCompareOpen(true); }}
            disabled={project.isNew}
            className="h-7 px-2.5 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed"
            style={{
              color: project.isNew ? C.textDisabled : C.textSecondary,
              backgroundColor: "transparent",
              opacity: project.isNew ? 0.5 : 1,
            }}
            onMouseEnter={(e) => { if (!project.isNew) e.currentTarget.style.backgroundColor = C.bg; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            title={project.isNew ? "No previous version to compare" : "Compare with previous version"}>
            <GitCompareArrows className="w-3.5 h-3.5" />
            Compare
          </button>
          <button
            onClick={() => setTimelineOpen(!timelineOpen)}
            className="h-7 px-2.5 rounded-md text-[11px] font-medium flex items-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{
              color: timelineOpen ? C.primary : C.textSecondary,
              backgroundColor: timelineOpen ? C.primarySoft : "transparent",
            }}
            onMouseEnter={(e) => { if (!timelineOpen) e.currentTarget.style.backgroundColor = C.bg; }}
            onMouseLeave={(e) => { if (!timelineOpen) e.currentTarget.style.backgroundColor = "transparent"; }}
            title={timelineOpen ? "Hide timeline" : "Show timeline"}>
            <History className="w-3.5 h-3.5" />
            Timeline
          </button>
        </div>

      </div>

      {/* Heatmap Legend — interactive filter chips (multi-select) */}
      {overlay !== "none" && (() => {
        // Compute counts per level for current BOM data
        const costLevels = { high: 0, med: 0, neutral: 0, savings: 0 };
        const riskLevels = { high: 0, med: 0, low: 0 };
        BOM_TREE.forEach((node) => {
          if (overlay === "costHeat") {
            // Mirror per-row mockCost logic
            const base = 5 + (node.id % 12) * 3.4;
            const target = base * 0.95;
            const quoted = node.id === 3 ? (scenarioStep >= 7 ? 38.90 : 41.80)
              : Math.round((base + ((node.id % 5) - 2) * 0.3) * 100) / 100;
            const delta = node.id === 3 ? (scenarioStep >= 7 ? 0.90 : 3.80) : Math.round((quoted - target) * 100) / 100;
            if (delta > 1.5) costLevels.high++;
            else if (delta > 0.5) costLevels.med++;
            else if (delta < -0.3) costLevels.savings++;
            else costLevels.neutral++;
          } else if (overlay === "riskHeat") {
            const risk = node.isHero ? "Med" : (node.id === 10 ? "High" : (node.id === 6 ? "Med" : "Low"));
            if (risk === "High") riskLevels.high++;
            else if (risk === "Med") riskLevels.med++;
            else riskLevels.low++;
          }
        });

        const items = overlay === "costHeat"
          ? [
              { id: "high", label: "+$1.5 or more over", color: "#FEE2E2", textColor: C.error, count: costLevels.high },
              { id: "med", label: "+$0.5 ~ +$1.5", color: "#FEF3C7", textColor: C.warning, count: costLevels.med },
              { id: "neutral", label: "On Target", color: "white", textColor: C.textSecondary, count: costLevels.neutral, border: true },
              { id: "savings", label: "Savings", color: "#D1FAE5", textColor: C.success, count: costLevels.savings },
            ]
          : [
              { id: "high", label: "High Risk", color: "#FEE2E2", textColor: C.error, count: riskLevels.high },
              { id: "med", label: "Medium Risk", color: "#FEF3C7", textColor: C.warning, count: riskLevels.med },
              { id: "low", label: "Low Risk", color: "white", textColor: C.textSecondary, count: riskLevels.low, border: true },
            ];

        const isLevelActive = (id) => heatLevels === null || heatLevels.has(id);
        const hasFilter = heatLevels !== null && heatLevels.size > 0;

        return (
          <div className="px-6 py-2 bg-white border-b flex items-center gap-2 text-[11px] flex-wrap"
            style={{ borderColor: C.border }}>
            <span className="font-medium shrink-0" style={{ color: C.textSecondary }}>
              {overlay === "costHeat" ? "Cost Heatmap:" : "Risk Heatmap:"}
            </span>
            {items.map((item) => {
              const active = isLevelActive(item.id);
              const isDimmed = hasFilter && !active;
              return (
                <button key={item.id}
                  onClick={() => toggleHeatLevel(item.id)}
                  disabled={item.count === 0}
                  className="inline-flex items-center gap-1.5 px-2.5 h-7 rounded-md border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed"
                  style={{
                    borderColor: active && hasFilter ? item.textColor : C.border,
                    backgroundColor: "white",
                    opacity: item.count === 0 ? 0.4 : isDimmed ? 0.4 : 1,
                  }}
                  title={`${item.label} (${item.count} parts) — click to filter`}>
                  <span className="w-2.5 h-2.5 rounded shrink-0"
                    style={{
                      backgroundColor: item.color,
                      border: item.border ? `1px solid ${C.border}` : "none",
                    }} />
                  <span style={{ color: item.textColor, fontWeight: active && hasFilter ? 600 : 500 }}>
                    {item.label}
                  </span>
                  <span className="text-[10px] font-mono"
                    style={{ color: C.textDisabled }}>
                    {item.count}
                  </span>
                </button>
              );
            })}
            {hasFilter && (
              <button onClick={() => setHeatLevels(null)}
                className="text-[11px] font-medium px-2.5 h-7 rounded-md transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                style={{ color: C.primary }}
                title="Show all levels">
                Show All
              </button>
            )}
            <div className="ml-auto text-[10px]" style={{ color: C.textDisabled }}>
              {hasFilter ? "Click a level chip to toggle" : "Click an item to view its Item 360 detail"}
            </div>
          </div>
        );
      })()}

      <div ref={splitContainerRef} className="flex-1 flex overflow-hidden">
        {/* LEFT: BOM Tree — user-adjustable width (default ~ remaining after 400px right) */}
        <div className="bg-white flex flex-col"
          style={{
            width: leftPanelWidth !== null ? `${leftPanelWidth}px` : undefined,
            flex: leftPanelWidth === null ? "1 1 0%" : "0 0 auto",
            minWidth: 400,
          }}>
          {/* BOM Filter Bar — refined: icon-led chips, semantic count badges, clearer hierarchy */}
          <div className="px-3 py-2 border-b flex items-center gap-2 overflow-x-auto"
            style={{ borderColor: C.border, backgroundColor: "white" }}>
            <div className="flex items-center gap-1.5 shrink-0 pr-2 mr-0.5 border-r"
              style={{ borderColor: C.borderLight }}>
              <Filter className="w-3 h-3" style={{ color: C.textSecondary }} />
              <span className="text-[10px] font-semibold uppercase tracking-wider"
                style={{ color: C.textSecondary }}>Filter</span>
            </div>
            {(() => {
              // Compute filter counts from actual data
              const qBomMissingIds = [3, 10, 14, 18];
              const cBomMissingIds = [3];
              const eBomLagIds = [5, 8];
              const missingCount =
                activeBom === "Q" && scenarioStep < 7 ? qBomMissingIds.length :
                activeBom === "C" && scenarioStep < 6 ? cBomMissingIds.length :
                activeBom === "E" ? eBomLagIds.length :
                0;
              const blockedCount = BOM_TREE.filter((n) => Object.values(n.status || {}).some((s) => s === "block")).length;
              const commentsCount = BOM_TREE.filter((n) => (n.comments || 0) > 0).length;
              // Each filter has: icon, label, count, semantic color (for count badge), and hideIfZero
              return [
                { id: "all", label: "All", icon: Layers, count: null, accent: C.textSecondary },
                { id: "missing", label: "Missing", icon: AlertCircle, count: missingCount, accent: C.warning, hideIfZero: true },
                { id: "blocked", label: "Blocked", icon: XCircle, count: blockedCount, accent: C.error, hideIfZero: true },
                { id: "comments", label: "Has Comments", icon: MessageSquare, count: commentsCount, accent: C.textSecondary, hideIfZero: true },
              ].filter(f => !(f.hideIfZero && f.count === 0)).map((f) => {
                const isActive = filter === f.id;
                return (
                  <button key={f.id} onClick={() => setFilter(f.id)}
                    className="h-7 px-2.5 rounded-full text-[11px] font-medium flex items-center gap-1.5 shrink-0 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                    style={{
                      backgroundColor: isActive ? C.primary : "white",
                      color: isActive ? "white" : C.textPrimary,
                      border: `1px solid ${isActive ? C.primary : C.border}`,
                      boxShadow: isActive ? `0 1px 2px rgba(83,45,246,0.15)` : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = C.textSecondary;
                        e.currentTarget.style.backgroundColor = C.bg;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor = C.border;
                        e.currentTarget.style.backgroundColor = "white";
                      }
                    }}>
                    <f.icon className="w-3 h-3 shrink-0"
                      style={{ color: isActive ? "white" : f.accent, opacity: isActive ? 0.9 : 1 }} />
                    <span className="whitespace-nowrap">{f.label}</span>
                    {f.count !== null && f.count !== undefined && (
                      <span className="text-[10px] font-mono font-semibold px-1 py-px rounded leading-none min-w-[16px] text-center"
                        style={{
                          backgroundColor: isActive ? "rgba(255,255,255,0.22)" : f.accent + "1A",
                          color: isActive ? "white" : f.accent,
                        }}>
                        {f.count}
                      </span>
                    )}
                  </button>
                );
              });
            })()}
          </div>

          <div className="flex-1 overflow-auto">
          {/* E-BOM module filter pills — quick subsystem-level filtering */}
          {activeBom === "E" && (
            <div className="px-4 py-2 border-b flex items-center gap-1.5 flex-wrap"
              style={{ borderColor: C.borderLight, backgroundColor: C.surfaceTinted }}>
              <span className="text-[10px] font-semibold uppercase tracking-wider mr-1" style={{ color: C.textDisabled }}>
                Module:
              </span>
              <button
                onClick={() => setModuleFilter(null)}
                className="h-6 px-2.5 rounded-full text-[10px] font-medium transition-colors border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                style={{
                  backgroundColor: moduleFilter === null ? C.primary : "white",
                  color: moduleFilter === null ? "white" : C.textSecondary,
                  borderColor: moduleFilter === null ? C.primary : C.border,
                }}>
                All <span className="opacity-70 ml-0.5">{BOM_TREE.length}</span>
              </button>
              {moduleOptions.map((m) => {
                const active = moduleFilter === m.name;
                return (
                  <button key={m.name}
                    onClick={() => setModuleFilter(active ? null : m.name)}
                    className="h-6 px-2.5 rounded-full text-[10px] font-medium transition-colors border focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                    style={{
                      backgroundColor: active ? C.primary : "white",
                      color: active ? "white" : C.textSecondary,
                      borderColor: active ? C.primary : C.border,
                    }}>
                    {m.name} <span className="opacity-70 ml-0.5">{m.count}</span>
                  </button>
                );
              })}
            </div>
          )}
          {/* C-BOM Final price source legend */}
          {activeBom === "C" && (
            <div className="px-4 py-2 border-b flex items-center gap-3 flex-wrap text-[10px]"
              style={{ borderColor: C.borderLight, backgroundColor: C.surfaceTinted, color: C.textSecondary }}>
              <span className="font-semibold uppercase tracking-wider" style={{ color: C.textDisabled }}>
                Final price source:
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.info }} />
                Quoted
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.success }} />
                Negotiated
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.textSecondary }} />
                Carryover
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.primary }} />
                AI Should-cost
              </span>
              <span style={{ color: C.textDisabled }}>· Hover Final value for details</span>
            </div>
          )}
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-white border-b" style={{ borderColor: C.border }}>
              <tr style={{ color: C.textSecondary }}>
                {structure === "tree" && (
                  <th className="text-left font-medium py-2.5 px-3 w-8">LVL</th>
                )}
                <th className="text-left font-medium py-2.5 px-3">Part / Description</th>

                {/* BOM-specific columns */}
                {activeBom === "E" && (
                  <>
                    <th className="text-left font-medium py-2.5 px-3 w-32">Category</th>
                    <th className="text-left font-medium py-2.5 px-3 w-20">Type</th>
                  </>
                )}
                {activeBom === "Q" && (
                  <>
                    <th className="text-center font-medium py-2.5 px-3 w-16">PPAP</th>
                    <th className="text-center font-medium py-2.5 px-3 w-20">Risk</th>
                  </>
                )}
                {activeBom === "C" && (
                  <>
                    <th className="text-left font-medium py-2.5 px-3 w-36">Supplier</th>
                    <th className="text-right font-medium py-2.5 px-3 w-20">Carryover</th>
                    <th className="text-right font-medium py-2.5 px-3 w-20">Quoted</th>
                    <th className="text-right font-medium py-2.5 px-3 w-20">Should</th>
                    <th className="text-right font-medium py-2.5 px-3 w-20">Market</th>
                    <th className="text-right font-medium py-2.5 px-3 w-24">Δ vs Target</th>
                    <th className="text-right font-medium py-2.5 px-3 w-28">
                      <span title="Final price source: ● blue=quoted · ● green=negotiated · ● gray=carryover · ● purple=AI should-cost">
                        Final
                      </span>
                    </th>
                  </>
                )}

                {/* Issues (always) */}
                <th className="text-center font-medium py-2.5 px-3 w-24">Issues</th>

                {/* Overlay-driven extra column (cost/risk heat) */}
                {overlay === "costHeat" && activeBom !== "C" && (
                  <th className="text-right font-medium py-2.5 px-3 w-28">Cost · Δ</th>
                )}
                {overlay === "riskHeat" && activeBom !== "Q" && (
                  <th className="text-center font-medium py-2.5 px-3 w-24">Risk</th>
                )}

                <th className="text-right font-medium py-2.5 px-3 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {visibleNodes.map((node) => {
                // Group header row (Flat mode only) — strengthened with prefix label, stats, visual anchor
                if (node._isGroupHeader) {
                  // GroupBy label prefix (helps user understand what this is grouped by)
                  const groupByLabel = {
                    supplier: "Supplier",
                    ppap: "PPAP Level",
                    category: "Category",
                    risk: "Risk",
                  }[groupBy] || "Group";

                  // Group icon by groupBy type
                  const GroupIcon = {
                    supplier: Building2,
                    ppap: ShieldCheck,
                    category: Layers,
                    risk: AlertTriangle,
                  }[groupBy] || Layers;

                  // Compute group stats (C-BOM: cost total; others: count only)
                  let statsText = null;
                  if (activeBom === "C") {
                    // Sum quoted (or shouldCost if quoted null) for parts in this group
                    const groupParts = BOM_TREE.filter((n) => (n[groupBy] || "Unknown") === node._groupKey);
                    const total = groupParts.reduce((sum, n) => {
                      const base = 5 + (n.id % 12) * 3.4;
                      const quoted = n.id === 3 && scenarioStep >= 7 ? 38.90
                        : n.id === 3 ? 41.80
                        : Math.round((base + ((n.id % 5) - 2) * 0.3) * 100) / 100;
                      return sum + quoted;
                    }, 0);
                    statsText = `Total ~$${total.toFixed(0)}`;
                  }

                  return (
                    <tr key={node.id}>
                      <td colSpan={10}
                        className="border-b"
                        style={{
                          backgroundColor: "#F3F4F6",
                          borderColor: C.border,
                          borderLeft: `3px solid ${C.primary}`,
                          position: "sticky",
                          top: 36, // below the thead
                          zIndex: 1,
                        }}>
                        <div className="flex items-center gap-2 py-2 px-3">
                          <GroupIcon className="w-3.5 h-3.5 shrink-0" style={{ color: C.primary }} />
                          <span className="text-[10px] font-semibold uppercase tracking-wider shrink-0"
                            style={{ color: C.textSecondary }}>
                            {groupByLabel}
                          </span>
                          <span className="text-xs font-bold truncate"
                            style={{ color: C.textPrimary }}>
                            {node._groupKey}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded shrink-0"
                            style={{ backgroundColor: "white", color: C.textSecondary, border: `1px solid ${C.border}` }}>
                            {node._groupCount} {node._groupCount === 1 ? "part" : "parts"}
                          </span>
                          {statsText && (
                            <span className="ml-auto text-[11px] font-mono font-semibold shrink-0"
                              style={{ color: C.textPrimary }}>
                              {statsText}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                }
                const isSelected = selectedItemId === node.id;
                const hasChildren = node.children && node.children.length > 0;
                const isExpanded = expandedNodes.has(node.id) || node._filterAutoExpanded;
                // Mock cost values: quoted (RFQ), shouldCost (AI), market, target, carryover (last version price), delta vs target
                // AMOLED Panel (id 3): uses scenario hero data
                let mockCost;
                if (node.id === 3) {
                  // Hero AMOLED: spec changed (6.5"→6.7"), so no carryover from previous spec
                  const quoted = scenarioStep >= 7 ? 38.90 : null;
                  mockCost = {
                    quoted, shouldCost: 41.80, market: 42.50, target: 38.00,
                    carryover: null, // spec change — previous variant not carried over
                    delta: quoted !== null ? (quoted - 38.00) : (41.80 - 38.00),
                  };
                } else {
                  // Derive deterministic mock from node.id
                  const base = 5 + (node.id % 12) * 3.4;
                  const target = base * 0.95;
                  const quoted = base + ((node.id % 5) - 2) * 0.3;
                  // Carryover: previous BOM version's quoted price. ~80% of parts inherit from prior version
                  const hasCarryover = (node.id % 5) !== 0;
                  const carryover = hasCarryover
                    ? Math.round((quoted * (1 + ((node.id % 7) - 3) * 0.015)) * 100) / 100
                    : null;
                  mockCost = {
                    quoted: Math.round(quoted * 100) / 100,
                    shouldCost: Math.round((base * 0.98) * 100) / 100,
                    market: Math.round((base * 1.04) * 100) / 100,
                    target: Math.round(target * 100) / 100,
                    carryover,
                    delta: Math.round((quoted - target) * 100) / 100,
                  };
                }
                const mockRisk = node.isHero ? "Med" : (node.id === 10 ? "High" : (node.id === 6 ? "Med" : "Low"));

                // BOM-specific missing parts simulation:
                // - Q-BOM: id 3, 10, 14, 18 missing until scenarioStep >= 7 (QM resolves)
                // - C-BOM: id 3 missing supplier until scenarioStep >= 6 (CM/SM awards)
                // - E-BOM: ids 5, 8 lag by 1 week (sync needed)
                const qBomMissingIds = [3, 10, 14, 18];
                const cBomMissingIds = [3];
                const eBomLagIds = [5, 8];
                const isMissingInActiveBom =
                  (activeBom === "Q" && qBomMissingIds.includes(node.id) && scenarioStep < 7) ||
                  (activeBom === "C" && cBomMissingIds.includes(node.id) && scenarioStep < 6);
                const isLaggedInActiveBom =
                  (activeBom === "E" && eBomLagIds.includes(node.id));

                return (
                  <tr key={node.id} onClick={() => setSelectedItemId(node.id)}
                    className="border-b transition-colors cursor-pointer"
                    style={{
                      borderColor: C.borderLight,
                      // Left border: selection only (3px primary). Hero shown via dot instead.
                      borderLeft: isSelected
                        ? `3px solid ${C.primary}`
                        : "3px solid transparent",
                      // Background:
                      // - Selected (no overlay): very subtle primary tint
                      // - Overlay heatmaps: semantic color visualization
                      // - Otherwise: white
                      backgroundColor: isSelected && overlay === "none"
                        ? "rgba(83,45,246,0.05)"
                        : overlay === "costHeat"
                          ? (mockCost.delta > 1.5 ? "#FEE2E2"
                            : mockCost.delta > 0.5 ? "#FEF3C7"
                            : mockCost.delta < -0.3 ? "#D1FAE5"
                            : "white")
                          : overlay === "riskHeat"
                            ? (mockRisk === "High" ? "#FEE2E2"
                              : mockRisk === "Med" ? "#FEF3C7"
                              : "white")
                            : "white",
                    }}
                    onMouseEnter={(e) => {
                      // Show hover bg for non-selected rows when no overlay
                      if (!isSelected && overlay === "none") {
                        e.currentTarget.style.backgroundColor = C.bg;
                      }
                    }}
                    onMouseLeave={(e) => {
                      // Always restore to the correct base background based on current state
                      if (isSelected && overlay === "none") {
                        e.currentTarget.style.backgroundColor = "rgba(83,45,246,0.05)";
                      } else if (overlay === "costHeat") {
                        e.currentTarget.style.backgroundColor = mockCost.delta > 1.5 ? "#FEE2E2"
                          : mockCost.delta > 0.5 ? "#FEF3C7"
                          : mockCost.delta < -0.3 ? "#D1FAE5"
                          : "white";
                      } else if (overlay === "riskHeat") {
                        e.currentTarget.style.backgroundColor = mockRisk === "High" ? "#FEE2E2"
                          : mockRisk === "Med" ? "#FEF3C7"
                          : "white";
                      } else {
                        e.currentTarget.style.backgroundColor = "white";
                      }
                    }}>
                    {structure === "tree" && (
                      <td className="py-2 px-3 text-center font-medium" style={{ color: C.textSecondary }}>
                        {node.lvl}
                      </td>
                    )}
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1" style={{ paddingLeft: structure === "tree" ? (node.lvl - 1) * 16 : 0 }}>
                        {structure === "tree" && hasChildren ? (
                          <button onClick={(e) => { e.stopPropagation(); toggleNode(node.id); }}
                            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded hover:bg-gray-100 transition-colors p-0.5">
                            {isExpanded
                              ? <ChevronDown className="w-3 h-3" style={{ color: C.textSecondary }} />
                              : <ChevronRight className="w-3 h-3" style={{ color: C.textSecondary }} />}
                          </button>
                        ) : structure === "tree" ? <span className="w-3" /> : null}
                        <div className="min-w-0">
                          {/* Description first (human-readable name) */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {node.isHero && !isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ backgroundColor: C.warning }}
                                title="Needs attention" />
                            )}
                            <span className="text-xs truncate max-w-[260px]"
                              style={{
                                color: C.textPrimary,
                                fontWeight: isSelected ? 600 : 500,
                              }}>
                              {node.desc}
                            </span>
                            {isMissingInActiveBom && (
                              <span className="text-[9px] px-1 py-0.5 rounded font-semibold shrink-0"
                                style={{ backgroundColor: C.errorLight, color: C.error }}>
                                Not in {activeBom}-BOM
                              </span>
                            )}
                            {isLaggedInActiveBom && (
                              <span className="text-[9px] px-1 py-0.5 rounded font-semibold shrink-0"
                                style={{ backgroundColor: C.warningLight, color: C.warning }}>
                                Delayed
                              </span>
                            )}
                          </div>
                          {/* PartId as metadata (smaller, mono) */}
                          <div className="font-mono text-[10px] mt-0.5" style={{ color: C.textDisabled }}>
                            {node.partId}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* BOM-specific cells */}
                    {activeBom === "E" && (
                      <>
                        <td className="py-2 px-3">
                          <span className="text-[11px]" style={{ color: C.textPrimary }}>
                            {node.category || "—"}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: C.bg, color: C.textSecondary }}>
                            {node.type || "—"}
                          </span>
                        </td>
                      </>
                    )}
                    {activeBom === "Q" && (
                      <>
                        <td className="py-2 px-3 text-center">
                          {isMissingInActiveBom ? (
                            <span className="text-[10px]" style={{ color: C.error }}>—</span>
                          ) : (
                            <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded"
                              style={{
                                backgroundColor: node.ppap === "Lv3" ? C.errorLight : node.ppap === "Lv2" ? C.warningLight : C.bg,
                                color: node.ppap === "Lv3" ? C.error : node.ppap === "Lv2" ? C.warning : C.textSecondary,
                              }}>
                              {node.ppap || "—"}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded"
                            style={{
                              backgroundColor: node.risk === "High" ? C.errorLight : node.risk === "Med" ? C.warningLight : C.bg,
                              color: node.risk === "High" ? C.error : node.risk === "Med" ? C.warning : C.textSecondary,
                            }}>
                            {node.risk || "Low"}
                          </span>
                        </td>
                      </>
                    )}
                    {activeBom === "C" && (
                      <>
                        <td className="py-2 px-3">
                          <span className="text-[11px] truncate block" style={{ color: C.textPrimary }}
                            title={node.supplier}>
                            {isMissingInActiveBom ? <span style={{ color: C.error }}>— (not selected)</span> : (node.supplier || "—")}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className="font-mono text-[11px]"
                            style={{ color: mockCost.carryover === null ? C.textDisabled : C.textSecondary }}
                            title={mockCost.carryover === null ? "No carryover — new spec" : "Previous version price"}>
                            {mockCost.carryover !== null ? `$${mockCost.carryover.toFixed(2)}` : "—"}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className="font-mono text-[11px]" style={{ color: mockCost.quoted === null ? C.textDisabled : C.textPrimary }}
                            title="Latest RFQ quote">
                            {mockCost.quoted !== null ? `$${mockCost.quoted.toFixed(2)}` : "—"}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className="font-mono text-[11px]" style={{ color: C.textSecondary }}
                            title="AI-derived should-cost">
                            ${mockCost.shouldCost.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className="font-mono text-[11px]" style={{ color: C.textDisabled }}
                            title="Market average">
                            ${mockCost.market.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className="font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded"
                            style={{
                              backgroundColor: mockCost.delta > 0.5 ? C.errorLight : mockCost.delta < -0.3 ? C.successLight : C.bg,
                              color: mockCost.delta > 0.5 ? C.error : mockCost.delta < -0.3 ? C.success : C.textSecondary,
                            }}
                            title={`Target: $${mockCost.target.toFixed(2)}`}>
                            {mockCost.delta > 0 ? "+" : ""}${mockCost.delta.toFixed(2)}
                          </span>
                        </td>
                        {/* Final price + source indicator
                            Priority: quoted (if available) > carryover (if previous version unchanged) > should (AI fallback) */}
                        <td className="py-2 px-3 text-right">
                          {(() => {
                            // Decide source based on data + scenario context
                            let finalValue, source, sourceLabel, sourceColor;
                            const isHeroPart = node.id === 3;
                            const isAwarded = isHeroPart && scenarioStep >= 7;
                            const wasNegotiated = isHeroPart && isAwarded; // BOE negotiated quote
                            if (wasNegotiated) {
                              finalValue = mockCost.quoted;
                              source = "negotiated";
                              sourceLabel = `Negotiated · BOE Technology ($${mockCost.quoted.toFixed(2)})`;
                              sourceColor = C.success;
                            } else if (mockCost.quoted !== null) {
                              finalValue = mockCost.quoted;
                              source = "quoted";
                              sourceLabel = `Quoted · ${node.supplier || "Supplier"} ($${mockCost.quoted.toFixed(2)})`;
                              sourceColor = C.info;
                            } else if (mockCost.carryover !== null) {
                              finalValue = mockCost.carryover;
                              source = "carryover";
                              sourceLabel = `Carryover from previous version ($${mockCost.carryover.toFixed(2)})`;
                              sourceColor = C.textSecondary;
                            } else {
                              finalValue = mockCost.shouldCost;
                              source = "should";
                              sourceLabel = `AI Should-cost (no quote yet) · $${mockCost.shouldCost.toFixed(2)}`;
                              sourceColor = C.primary;
                            }
                            return (
                              <span className="inline-flex items-center gap-1.5 justify-end"
                                title={`Final price from: ${sourceLabel}`}>
                                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: sourceColor }} />
                                <span className="font-mono text-[11px] font-semibold" style={{ color: C.textPrimary }}>
                                  ${finalValue.toFixed(2)}
                                </span>
                              </span>
                            );
                          })()}
                        </td>
                      </>
                    )}

                    {/* Issues column — always shown */}
                    <td className="py-2 px-3">
                      {/* Show only status indicators that are NOT clean (warn/blocked/missing) */}
                      {(() => {
                        const issues = Object.entries(node.status || {}).filter(([k, v]) => v !== "ok");
                        if (issues.length === 0) {
                          return (
                            <div className="flex items-center justify-center text-[10px]"
                              style={{ color: C.success }}>
                              <CheckCircle className="w-3 h-3" />
                            </div>
                          );
                        }
                        return (
                          <div className="flex items-center justify-center gap-1">
                            {issues.map(([k, v]) => (
                              <div key={k} className="flex flex-col items-center gap-0.5"
                                title={`${k}: ${STATUS_MAP[v].label}`}>
                                <StatusDot kind={v} size={6} />
                                <span className="text-[8px] font-semibold"
                                  style={{ color: STATUS_MAP[v].color || C.textDisabled }}>
                                  {k}
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </td>

                    {/* Overlay extra column (cost/risk heat — only when BOM doesn't already have it) */}
                    {overlay === "costHeat" && activeBom !== "C" && (
                      <td className="py-2 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className="font-mono text-[11px] font-semibold" style={{ color: C.textPrimary }}>
                            ${mockCost.quoted !== null ? mockCost.quoted.toFixed(2) : mockCost.shouldCost.toFixed(2)}
                          </span>
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded font-medium"
                            style={{
                              backgroundColor: mockCost.delta > 1 ? C.errorLight : mockCost.delta < -0.3 ? C.successLight : C.bg,
                              color: mockCost.delta > 1 ? C.error : mockCost.delta < -0.3 ? C.success : C.textSecondary,
                            }}>
                            {mockCost.delta > 0 ? "+" : ""}{mockCost.delta.toFixed(2)}
                          </span>
                        </div>
                      </td>
                    )}
                    {overlay === "riskHeat" && activeBom !== "Q" && (
                      <td className="py-2 px-3 text-center">
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded"
                          style={{
                            backgroundColor: mockRisk === "Low" ? C.bg : mockRisk === "Med" ? C.warningLight : C.errorLight,
                            color: mockRisk === "Low" ? C.success : mockRisk === "Med" ? C.warning : C.error,
                          }}>
                          {mockRisk}
                        </span>
                      </td>
                    )}
                    <td className="py-2 px-3 text-right">
                      {(() => {
                        // Extract comments for this part from ACTIVITY_FEED
                        const nodeMessages = ACTIVITY_FEED.filter((m) => m.itemRef && m.itemRef.id === node.id);
                        const count = nodeMessages.length;
                        if (count === 0) return null;
                        const lastMessage = nodeMessages[nodeMessages.length - 1];
                        const lastPersona = lastMessage.persona;
                        return (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium"
                            title={`Latest: ${PERSONAS[lastPersona]?.name || lastPersona} · ${lastMessage.ts}`}
                            style={{ color: node.isHero ? C.warning : C.textSecondary }}>
                            <MessageSquare className="w-3 h-3" />
                            {count}
                          </span>
                        );
                      })()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>

        {/* RESIZABLE DIVIDER — drag to adjust panel widths */}
        <div
          onMouseDown={startDrag}
          className="shrink-0 group relative cursor-col-resize transition-colors flex items-center justify-center"
          style={{
            width: 6,
            backgroundColor: "transparent",
            borderLeft: `1px solid ${C.border}`,
          }}
          title="Drag to resize">
          {/* Hover/active visual feedback (vertical bar grip) */}
          <div className="w-px h-8 rounded-full transition-colors group-hover:bg-purple-500"
            style={{ backgroundColor: C.borderLight }} />
        </div>

        {/* RIGHT: Item 360 Drawer — 400px default, flex-1 when user drags */}
        <div className="bg-white overflow-auto"
          style={{
            width: leftPanelWidth !== null ? undefined : 400,
            flex: leftPanelWidth !== null ? "1 1 0%" : "0 0 400px",
            minWidth: 320,
          }}>
          {selectedItemId && selectedItem ? (
            <Item360Drawer item={selectedItem} tab={drawerTab} setTab={setDrawerTab} scenarioStep={scenarioStep} onOpenChat={onOpenItemChat} activeBom={activeBom} />
          ) : (
            <BomSummaryCard
              activeBomMeta={activeBomMeta}
              activeBom={activeBom}
              project={project}
              isHeroProject={isHeroProject}
              scenarioStep={scenarioStep}
              setSelectedItemId={setSelectedItemId}
              setFilter={setFilter}
            />
          )}
        </div>

        {/* Timeline Panel — viewport-level overlay drawer.
            Positioned fixed so it floats above the entire app (LNB, GNB, content) — not just the BOM workspace pane. */}
        {timelineOpen && (
          <>
            {/* Scrim — full-viewport dim; clicking dismisses */}
            <div
              onClick={() => setTimelineOpen(false)}
              className="fixed inset-0 transition-opacity"
              style={{ backgroundColor: "rgba(0,0,0,0.32)", zIndex: 100 }}
            />
            {/* Drawer — fixed to viewport's right edge, full height */}
            <div
              className="fixed top-0 bottom-0 right-0 shadow-2xl"
              style={{ width: 420, zIndex: 110 }}>
              <TimelinePanel
                activeBom={activeBom}
                activeBomMeta={activeBomMeta}
                events={project.isNew ? [] : (BOM_TIMELINE_EVENTS[activeBom] || [])}
                expandedEvent={expandedTimelineEvent}
                setExpandedEvent={setExpandedTimelineEvent}
                onClose={() => setTimelineOpen(false)}
              />
            </div>
          </>
        )}
      </div>

      {/* Compare Modal */}
      {compareOpen && (
        <CompareModal
          activeBom={activeBom}
          activeBomMeta={activeBomMeta}
          diff={BOM_VERSION_DIFFS[activeBom]}
          onClose={() => setCompareOpen(false)}
        />
      )}
    </div>
  );
}

// === TIMELINE PANEL ===
function TimelinePanel({ activeBom, activeBomMeta, events, expandedEvent, setExpandedEvent, onClose }) {
  // ESC to close — drawer convention
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose && onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Group events by date (preserves order)
  const grouped = [];
  let lastDate = null;
  events.forEach(ev => {
    if (ev.date !== lastDate) {
      grouped.push({ kind: "date", date: ev.date });
      lastDate = ev.date;
    }
    grouped.push({ kind: "event", ...ev });
  });

  // Icon mapping per kind + iconType
  const getIconAndColor = (kind, iconType) => {
    const iconMap = {
      zap: Zap, check: CheckCircle, alert: AlertTriangle, send: Send,
      message: MessageSquare, shield: ShieldCheck, upload: Upload, version: GitBranch,
    };
    const Icon = iconMap[iconType] || Circle;
    const colorMap = {
      success: { bg: "rgba(0,153,85,0.08)", fg: C.success },
      error: { bg: "rgba(211,47,47,0.08)", fg: C.error },
      primary: { bg: "rgba(83,45,246,0.08)", fg: C.primary },
      neutral: { bg: "rgba(0,0,0,0.06)", fg: C.textSecondary },
    };
    const { bg, fg } = colorMap[kind] || colorMap.neutral;
    return { Icon, bg, fg };
  };

  return (
    <div className="bg-white border-l flex flex-col overflow-hidden h-full"
      style={{ borderColor: C.border }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b flex items-start gap-2"
        style={{ borderColor: C.border }}>
        <div className="flex-1 min-w-0">
          <div className="text-[16px] font-semibold leading-6" style={{ color: C.textPrimary }}>
            Timeline
          </div>
          <div className="text-xs mt-0.5" style={{ color: C.textSecondary }}>
            {activeBomMeta.name} · {activeBomMeta.version}
          </div>
        </div>
        <button onClick={onClose}
          className="w-8 h-8 rounded-md flex items-center justify-center transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
          style={{ color: C.textSecondary }}
          title="Close timeline">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Empty state */}
      {events.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <Clock className="w-10 h-10 mb-3" style={{ color: C.textDisabled }} />
          <div className="text-sm font-medium mb-1" style={{ color: C.textPrimary }}>
            No history yet
          </div>
          <div className="text-xs" style={{ color: C.textSecondary }}>
            Events will appear here once this BOM is created and modified.
          </div>
        </div>
      )}

      {/* Timeline list */}
      {events.length > 0 && (
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {grouped.map((item, idx) => {
            if (item.kind === "date") {
              return (
                <div key={`date-${idx}`} className="px-1 pt-1 pb-2 text-[12px] font-semibold"
                  style={{ color: C.textDisabled }}>
                  {item.date}
                </div>
              );
            }
            const ev = item;
            const { Icon, bg, fg } = getIconAndColor(ev.kind, ev.iconType);
            const isExpanded = expandedEvent === ev.id;
            const isLast = (() => {
              // last in this date group?
              for (let i = idx + 1; i < grouped.length; i++) {
                if (grouped[i].kind === "date") return true;
                if (grouped[i].kind === "event") return false;
              }
              return true;
            })();
            const hasDetail = !!ev.detail;
            const persona = PERSONAS[ev.author];

            return (
              <div key={ev.id} className="flex gap-3 items-start" style={{ minHeight: isExpanded && hasDetail ? "auto" : 56 }}>
                {/* Wrapper: icon + tail */}
                <div className="flex flex-col items-center shrink-0" style={{ minHeight: 56 }}>
                  <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: bg }}>
                    <Icon className="w-4 h-4" style={{ color: fg }} />
                  </div>
                  {!isLast && (
                    <div className="flex-1 w-px" style={{ backgroundColor: C.borderLight, minHeight: 16 }} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-3">
                  <div className="text-[10px] font-medium leading-4" style={{ color: C.textDisabled }}>
                    {ev.time}
                  </div>
                  <button
                    onClick={() => setExpandedEvent(isExpanded ? null : ev.id)}
                    disabled={!hasDetail}
                    className="w-full flex items-center text-left transition-colors disabled:cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded-sm"
                    style={{ cursor: hasDetail ? "pointer" : "default" }}>
                    <span className="text-[13px] font-medium leading-5 flex-1" style={{ color: C.textPrimary }}>
                      {ev.title}
                    </span>
                    {hasDetail && (
                      <ChevronDown className="w-3 h-3 ml-1 shrink-0 transition-transform"
                        style={{
                          color: C.textDisabled,
                          transform: isExpanded ? "rotate(180deg)" : "rotate(0)",
                        }} />
                    )}
                  </button>

                  {isExpanded && hasDetail && (
                    <div className="mt-2 px-3 py-2 rounded-lg border flex items-start gap-2"
                      style={{ borderColor: C.borderLight, backgroundColor: C.surfaceTinted }}>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] leading-4" style={{ color: C.textSecondary }}>
                          {ev.detail}
                        </div>
                      </div>
                      {persona && (
                        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: persona.color }}>
                          <span className="text-[9px] font-bold text-white">{persona.initial}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// === COMPARE MODAL ===
function CompareModal({ activeBom, activeBomMeta, diff, onClose }) {
  if (!diff) return null;
  const totalChanges = diff.added.length + diff.modified.length + diff.removed.length;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 transition-opacity"
        style={{ backgroundColor: "rgba(16, 24, 40, 0.4)" }}
        onClick={onClose} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 z-50 bg-white rounded-2xl shadow-2xl flex flex-col"
        style={{
          transform: "translate(-50%, -50%)",
          width: 720,
          maxHeight: "85vh",
        }}>
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b flex items-start gap-4" style={{ borderColor: C.border }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: C.primarySoft }}>
            <GitCompareArrows className="w-5 h-5" style={{ color: C.primary }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[18px] font-semibold leading-6" style={{ color: C.textPrimary }}>
              Compare {activeBomMeta.name} versions
            </div>
            <div className="text-sm mt-0.5" style={{ color: C.textSecondary }}>
              {totalChanges} change{totalChanges !== 1 ? "s" : ""} between <span className="font-mono font-medium">{diff.previous}</span> and <span className="font-mono font-medium">{diff.current}</span>
            </div>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-md flex items-center justify-center transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{ color: C.textSecondary }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Version selector strip */}
        <div className="px-6 py-3 border-b flex items-center gap-3" style={{ borderColor: C.border, backgroundColor: C.surfaceTinted }}>
          <div className="flex-1 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: C.textDisabled }}>From</span>
            <select className="h-7 px-2 rounded-md border text-xs bg-white outline-none focus:outline-none focus-visible:ring-2"
              style={{ borderColor: C.border, color: C.textPrimary }} defaultValue={diff.previous}>
              <option>{diff.previous}</option>
            </select>
          </div>
          <ArrowRight className="w-4 h-4 shrink-0" style={{ color: C.textDisabled }} />
          <div className="flex-1 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: C.textDisabled }}>To</span>
            <select className="h-7 px-2 rounded-md border text-xs bg-white outline-none focus:outline-none focus-visible:ring-2"
              style={{ borderColor: C.border, color: C.textPrimary }} defaultValue={diff.current}>
              <option>{diff.current}</option>
            </select>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4" style={{ maxHeight: "calc(85vh - 200px)" }}>
          {totalChanges === 0 && (
            <div className="py-12 text-center">
              <CheckCircle className="w-10 h-10 mx-auto mb-2" style={{ color: C.textDisabled }} />
              <div className="text-sm" style={{ color: C.textSecondary }}>No changes between these versions.</div>
            </div>
          )}

          {/* Added */}
          {diff.added.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full"
                  style={{ backgroundColor: "rgba(0,153,85,0.12)" }}>
                  <Plus className="w-3 h-3" style={{ color: C.success }} />
                </span>
                <span className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: C.success }}>
                  Added · {diff.added.length}
                </span>
              </div>
              <div className="border rounded-lg divide-y" style={{ borderColor: C.borderLight }}>
                {diff.added.map((p, i) => (
                  <div key={i} className="px-3 py-2.5 flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium" style={{ color: C.textPrimary }}>{p.name}</div>
                      <div className="text-[11px] font-mono mt-0.5" style={{ color: C.textDisabled }}>{p.partId}</div>
                      <div className="text-xs mt-1" style={{ color: C.textSecondary }}>{p.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modified */}
          {diff.modified.length > 0 && (
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full"
                  style={{ backgroundColor: "rgba(224,105,0,0.12)" }}>
                  <Edit3 className="w-3 h-3" style={{ color: C.warning }} />
                </span>
                <span className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: C.warning }}>
                  Modified · {diff.modified.length}
                </span>
              </div>
              <div className="border rounded-lg divide-y" style={{ borderColor: C.borderLight }}>
                {diff.modified.map((p, i) => (
                  <div key={i} className="px-3 py-2.5 flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium" style={{ color: C.textPrimary }}>{p.name}</div>
                      <div className="text-[11px] font-mono mt-0.5" style={{ color: C.textDisabled }}>{p.partId}</div>
                      <div className="text-xs mt-1" style={{ color: C.textSecondary }}>{p.change}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Removed */}
          {diff.removed.length > 0 && (
            <div className="mb-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full"
                  style={{ backgroundColor: "rgba(211,47,47,0.12)" }}>
                  <X className="w-3 h-3" style={{ color: C.error }} />
                </span>
                <span className="text-[12px] font-semibold uppercase tracking-wide" style={{ color: C.error }}>
                  Removed · {diff.removed.length}
                </span>
              </div>
              <div className="border rounded-lg divide-y" style={{ borderColor: C.borderLight }}>
                {diff.removed.map((p, i) => (
                  <div key={i} className="px-3 py-2.5 flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium line-through" style={{ color: C.textSecondary }}>{p.name}</div>
                      <div className="text-[11px] font-mono mt-0.5" style={{ color: C.textDisabled }}>{p.partId}</div>
                      <div className="text-xs mt-1" style={{ color: C.textSecondary }}>{p.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t flex items-center justify-end gap-2" style={{ borderColor: C.border }}>
          <button onClick={onClose}
            className="h-9 px-4 rounded-md text-sm font-medium border transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2"
            style={{ borderColor: C.border, color: C.textPrimary, backgroundColor: "white" }}>
            Close
          </button>
          <button
            className="h-9 px-4 rounded-md text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2"
            style={{ backgroundColor: C.primary }}>
            Export Diff
          </button>
        </div>
      </div>
    </>
  );
}

// === PROMOTE BOM DROPDOWN BUTTON ===
function PromoteDropdown({ activeBom, onPromoteClick }) {
  const [open, setOpen] = useState(false);
  const isMaster = activeBom === "M";
  const targets = BOM_LIST.filter((b) => b.id !== "M");

  if (!isMaster) {
    return (
      <div className="text-[10px] px-2 py-1 rounded flex items-center gap-1"
        style={{ backgroundColor: C.bg, color: C.textDisabled }}
        title="Promote is only available from M-BOM (master)">
        <ChevronsRight className="w-3 h-3" />
        Promote (M-BOM only)
      </div>
    );
  }

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="px-2.5 py-1 rounded-md text-xs font-medium text-white flex items-center gap-1 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
        style={{ backgroundColor: C.primary }}>
        <ChevronsRight className="w-3.5 h-3.5" />
        Promote
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <>
          {/* backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-lg shadow-xl border z-50 overflow-hidden"
            style={{ borderColor: C.border }}>
            <div className="px-3 py-2 border-b" style={{ borderColor: C.border, backgroundColor: C.bg }}>
              <div className="text-[10px] uppercase tracking-wide font-semibold"
                style={{ color: C.textSecondary }}>
                Promote to
              </div>
            </div>
            <div>
              {targets.map((b) => {
                const hasIssue = b.syncDelta > 0 || b.missing > 0;
                return (
                  <button key={b.id}
                    onClick={() => { onPromoteClick(b.id); setOpen(false); }}
                    className="w-full text-left px-3 py-2.5 hover:bg-gray-50 border-b flex items-center gap-2.5"
                    style={{ borderColor: C.borderLight }}>
                    <ChevronsRight className="w-3.5 h-3.5" style={{ color: C.primary }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium" style={{ color: C.textPrimary }}>
                        {b.label}
                      </div>
                      <div className="text-[10px] truncate" style={{ color: C.textSecondary }}>
                        {b.name} · {PERSONAS[b.owner]?.role}
                      </div>
                    </div>
                    {hasIssue && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0"
                        style={{ backgroundColor: C.warningLight, color: C.warning }}>
                        {b.missing > 0 ? `${b.missing} missing` : "delayed"}
                      </span>
                    )}
                    {!hasIssue && (
                      <span className="text-[9px] font-medium px-1.5 py-0.5 rounded shrink-0"
                        style={{ backgroundColor: C.successLight, color: C.success }}>
                        ✓ synced
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// === BOM SUMMARY CARD (empty state for Item 360 — shown when no item selected) ===
// Provides quick orientation: BOM stats, recent activity, blocking items
function BomSummaryCard({ activeBomMeta, activeBom, project, isHeroProject, scenarioStep, setSelectedItemId, setFilter }) {
  // BOM-specific issue counts (mirrors row-level logic in tree)
  const qBomMissingIds = [3, 10, 14, 18];
  const cBomMissingIds = [3];
  const eBomLagIds = [5, 8];
  const missingIds =
    activeBom === "Q" && scenarioStep < 7 ? qBomMissingIds :
    activeBom === "C" && scenarioStep < 6 ? cBomMissingIds :
    activeBom === "E" ? eBomLagIds :
    [];
  const issueCount = missingIds.length;

  // Recent activity for this BOM — combines BOM timeline events + relevant chat messages
  // Returns up to 4 most recent events (timeline takes precedence, chat fills if room)
  const recentActivity = useMemo(() => {
    // BOM-specific timeline events
    const timelineEvents = (BOM_TIMELINE_EVENTS[activeBom] || []).map(e => ({
      source: "system",
      id: e.id,
      ts: e.time || e.ts || "",
      date: e.date,
      type: e.iconType,
      kind: e.kind,
      actor: e.author,
      title: e.title,
      detail: e.detail,
    }));

    // Chat messages relevant to this BOM (filter by channel → BOM mapping)
    const bomChannels = BOM_TO_CHANNELS[activeBom] || [];
    const chatMessages = (isHeroProject ? ACTIVITY_FEED.slice(0, scenarioStep + 1) : ACTIVITY_FEED)
      .filter(m => bomChannels.includes(m.channel))
      .map(m => ({
        source: "chat",
        id: m.id,
        ts: m.ts,
        actor: m.persona,
        message: m.message,
        decision: m.decision,
        decisionText: m.decisionText,
        itemRef: m.itemRef,
      }));

    // Hero project (active scenario): newest first, system events priority, then chat
    // For non-hero projects, show only timeline (chat is generic)
    const combined = isHeroProject
      ? [...timelineEvents.slice(0, 2), ...chatMessages.slice(-2).reverse()]
      : timelineEvents.slice(0, 4);

    return combined.slice(0, 4);
  }, [activeBom, scenarioStep, isHeroProject]);

  // Icon mapping for system event types (mirrors TimelinePanel + ItemActivityTab)
  const getSystemEventMeta = (type, kind) => {
    const iconMap = {
      zap: Zap, check: CheckCircle, alert: AlertTriangle, send: Send,
      message: MessageSquare, shield: ShieldCheck, upload: Upload, version: GitBranch,
    };
    const Icon = iconMap[type] || Activity;
    const colorMap = {
      success: { bg: "rgba(0,153,85,0.10)", fg: C.success },
      error:   { bg: "rgba(211,47,47,0.10)", fg: C.error },
      primary: { bg: "rgba(83,45,246,0.10)", fg: C.primary },
      neutral: { bg: "rgba(0,0,0,0.06)", fg: C.textSecondary },
    };
    const { bg, fg } = colorMap[kind] || colorMap.neutral;
    return { Icon, bg, fg };
  };

  // Click handler: jump to first missing part + activate Missing filter
  const goToFirstIssue = () => {
    if (missingIds.length > 0 && setSelectedItemId) {
      setSelectedItemId(missingIds[0]);
      if (setFilter) setFilter("missing");
    }
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wide mb-1.5" style={{ color: C.textSecondary }}>
          BOM Summary
        </div>
        <div className="text-lg font-semibold mb-1" style={{ color: C.textPrimary }}>
          {activeBomMeta.name}
        </div>
        <div className="text-xs" style={{ color: C.textSecondary }}>
          {activeBomMeta.description}
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg border p-3" style={{ borderColor: C.border }}>
          <div className="text-[10px] font-medium mb-1" style={{ color: C.textSecondary }}>Version</div>
          <div className="text-lg font-mono font-semibold" style={{ color: C.textPrimary }}>
            {activeBomMeta.version}
          </div>
        </div>
        <div className="rounded-lg border p-3" style={{ borderColor: C.border }}>
          <div className="text-[10px] font-medium mb-1" style={{ color: C.textSecondary }}>Parts</div>
          <div className="text-lg font-mono font-semibold" style={{ color: C.textPrimary }}>
            {activeBomMeta.parts}
          </div>
        </div>
        {/* Issues — clickable when issueCount > 0; jumps to first missing part */}
        <button
          onClick={issueCount > 0 ? goToFirstIssue : undefined}
          disabled={issueCount === 0}
          className="rounded-lg border p-3 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-default group"
          style={{
            borderColor: issueCount > 0 ? C.warning : C.border,
            backgroundColor: issueCount > 0 ? C.warningLight : "white",
            cursor: issueCount > 0 ? "pointer" : "default",
          }}
          onMouseEnter={(e) => { if (issueCount > 0) e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
          title={issueCount > 0 ? `Click to view ${issueCount} issue${issueCount === 1 ? "" : "s"}` : undefined}>
          <div className="flex items-center justify-between mb-1">
            <div className="text-[10px] font-medium"
              style={{ color: issueCount > 0 ? C.warning : C.textSecondary }}>
              Issues
            </div>
            {issueCount > 0 && (
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5"
                style={{ color: C.warning }} />
            )}
          </div>
          <div className="text-lg font-mono font-semibold"
            style={{ color: issueCount > 0 ? C.warning : C.success }}>
            {issueCount > 0 ? issueCount : "—"}
          </div>
        </button>
      </div>

      {/* Sync Status — clickable; jumps to first missing/lagged part */}
      {activeBomMeta.syncNote && (
        <button
          onClick={goToFirstIssue}
          className="w-full rounded-lg border p-3 flex items-start gap-2 text-left transition-all hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
          style={{ borderColor: C.warning, backgroundColor: C.warningLight, cursor: "pointer" }}
          title="Click to view affected parts">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: C.warning }} />
          <div className="text-xs flex-1 min-w-0" style={{ color: C.textPrimary }}>
            <div className="font-semibold mb-0.5 flex items-center gap-1">
              Sync Status
              <ArrowRight className="w-3 h-3" style={{ color: C.warning }} />
            </div>
            <div style={{ color: C.textSecondary }}>{activeBomMeta.syncNote}</div>
          </div>
        </button>
      )}

      {/* Recent Activity — system events + chat (BOM-specific) */}
      {recentActivity.length > 0 && (
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color: C.textSecondary }}>
            Recent Activity
          </div>
          <div className="space-y-2">
            {recentActivity.map((evt) => {
              // === System event rendering ===
              if (evt.source === "system") {
                const meta = getSystemEventMeta(evt.type, evt.kind);
                const Icon = meta.Icon;
                return (
                  <div key={`sys-${evt.id}`}
                    className="w-full flex items-start gap-2 p-2 rounded-md"
                    style={{ backgroundColor: C.bg }}>
                    <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: meta.bg }}>
                      <Icon className="w-3 h-3" style={{ color: meta.fg }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[11px] font-semibold" style={{ color: C.textPrimary }}>
                          {evt.title}
                        </span>
                        <span className="text-[9px] ml-auto shrink-0" style={{ color: C.textDisabled }}>{evt.ts}</span>
                      </div>
                      {evt.detail && (
                        <div className="text-[11px] line-clamp-2" style={{
                          color: C.textSecondary,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}>
                          {evt.detail}
                        </div>
                      )}
                      {evt.actor && (
                        <div className="text-[10px] mt-0.5" style={{ color: C.textDisabled }}>
                          by {evt.actor === "AI" ? "AI Assistant" : (PERSONAS[evt.actor]?.name || evt.actor)}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              // === Chat message rendering (clickable if itemRef exists) ===
              const m = evt;
              const canJump = m.itemRef && m.itemRef.id && setSelectedItemId;
              const Wrapper = canJump ? "button" : "div";
              return (
                <Wrapper
                  key={`chat-${m.id}`}
                  {...(canJump ? {
                    onClick: () => setSelectedItemId(m.itemRef.id),
                    title: `Click to view ${m.itemRef.partName || "part"}`,
                  } : {})}
                  className={`w-full flex items-start gap-2 p-2 rounded-md text-left transition-all ${canJump ? "hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1" : ""}`}
                  style={{
                    backgroundColor: m.decision ? C.primarySoft : C.bg,
                    cursor: canJump ? "pointer" : "default",
                  }}>
                  <PersonaAvatar p={m.actor === "AI" ? "PM" : m.actor} size={20} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[11px] font-semibold" style={{ color: C.textPrimary }}>
                        {m.actor === "AI" ? "AI Assistant" : PERSONAS[m.actor]?.name}
                      </span>
                      {m.decision && (
                        <span className="text-[8px] px-1 py-0.5 rounded font-bold"
                          style={{ backgroundColor: C.primary, color: "white" }}>DECISION</span>
                      )}
                      <span className="text-[9px] ml-auto shrink-0" style={{ color: C.textDisabled }}>{m.ts}</span>
                    </div>
                    <div className="text-[11px] line-clamp-2" style={{
                      color: C.textSecondary,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}>
                      {m.message}
                    </div>
                    {canJump && (
                      <div className="text-[10px] mt-1 font-medium flex items-center gap-1" style={{ color: C.primary }}>
                        <ArrowRight className="w-3 h-3" />
                        {m.itemRef.partName || "View part"}
                      </div>
                    )}
                  </div>
                </Wrapper>
              );
            })}
          </div>
        </div>
      )}

      {/* Call to action — guide user */}
      <div className="rounded-lg border-2 border-dashed py-6 px-4 text-center"
        style={{ borderColor: C.borderLight }}>
        <Package className="w-8 h-8 mx-auto mb-2" style={{ color: C.textDisabled }} />
        <div className="text-xs font-medium mb-1" style={{ color: C.textPrimary }}>
          Click a part to view details
        </div>
        <div className="text-[10px]" style={{ color: C.textSecondary }}>
          Spec · Cost & Sourcing · Quality · Activity
        </div>
      </div>
    </div>
  );
}

// === ITEM 360 DRAWER ===
function Item360Drawer({ item, tab, setTab, scenarioStep, onOpenChat, activeBom }) {
  const isHero = item.id === 3;

  // Missing/Lagged detection (matches BOM Workspace logic)
  const qBomMissingIds = [3, 10, 14, 18];
  const cBomMissingIds = [3];
  const eBomLagIds = [5, 8];
  const isMissingInActiveBom =
    (activeBom === "Q" && qBomMissingIds.includes(item.id) && scenarioStep < 7) ||
    (activeBom === "C" && cBomMissingIds.includes(item.id) && scenarioStep < 6);
  const isLaggedInActiveBom = activeBom === "E" && eBomLagIds.includes(item.id);

  // BOM-specific action label for missing item
  const missingActionMap = {
    Q: { label: "Register for PPAP", icon: ShieldCheck, desc: "This part needs to be registered for PPAP qualification in the Quality BOM" },
    C: { label: "Select Supplier & Quote", icon: Building2, desc: "This part needs supplier selection and cost entry in the C-BOM (Source & Cost)" },
  };
  const missingAction = missingActionMap[activeBom];

  // Item-related messages: Hero is gated by scenarioStep; others always visible
  const itemMessages = useMemo(() => {
    const all = isHero ? ACTIVITY_FEED.slice(0, scenarioStep + 1) : ACTIVITY_FEED;
    return all.filter((m) => m.itemRef && m.itemRef.id === item.id);
  }, [item.id, scenarioStep, isHero]);
  const itemMessageCount = itemMessages.length;

  return (
    <div>
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: C.border, backgroundColor: isHero ? "#FFFBEB" : "white" }}>
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: isHero ? C.warningLight : C.bg }}>
            <Package className="w-6 h-6" style={{ color: isHero ? C.warning : C.textSecondary }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>
              {item.partName || item.desc}
            </div>
            <div className="text-xs font-mono" style={{ color: C.textSecondary }}>
              {item.partId} · {item.itemCode || "N/A"}
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              {item.status && Object.entries(item.status).map(([k, v]) => (
                <StatusPill key={k} kind={v} label={`${k}`} />
              ))}
            </div>
          </div>
          {/* Chat button - icon only, badge for count */}
          {onOpenChat && (
            <button onClick={() => onOpenChat(item)}
              className="relative w-9 h-9 rounded-full flex items-center justify-center border shrink-0 transition-colors hover:shadow-sm"
              style={{
                borderColor: itemMessageCount > 0 ? C.primary : C.border,
                color: itemMessageCount > 0 ? C.primary : C.textSecondary,
                backgroundColor: "white",
              }}
              title={itemMessageCount > 0
                ? `Open thread (${itemMessageCount} message${itemMessageCount > 1 ? "s" : ""})`
                : "Start thread for this part"}>
              <MessageSquare className="w-4 h-4" />
              {itemMessageCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-bold flex items-center justify-center"
                  style={{ backgroundColor: C.primary, color: "white" }}>
                  {itemMessageCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Missing/Lagged Action Banner — actionable CTA when item lacks required info in this BOM */}
      {(isMissingInActiveBom || isLaggedInActiveBom) && (
        <div className="p-3 border-b flex items-start gap-2.5"
          style={{ backgroundColor: isMissingInActiveBom ? C.errorLight : C.warningLight, borderColor: C.border }}>
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5"
            style={{ color: isMissingInActiveBom ? C.error : C.warning }} />
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-wider mb-0.5"
              style={{ color: isMissingInActiveBom ? C.error : C.warning }}>
              {isMissingInActiveBom ? `Not in ${activeBom}-BOM` : "Delayed from E-BOM"}
            </div>
            <div className="text-[11px] leading-snug mb-2" style={{ color: C.textPrimary }}>
              {isMissingInActiveBom && missingAction ? missingAction.desc : "This part has E-BOM updates that haven't synced. Review the latest spec."}
            </div>
            {isMissingInActiveBom && missingAction && (
              <button
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: C.primary }}>
                <missingAction.icon className="w-3 h-3" />
                {missingAction.label}
              </button>
            )}
            {isLaggedInActiveBom && (
              <button
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: C.primary }}>
                <RefreshCw className="w-3 h-3" />
                Sync from E-BOM
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b sticky top-0 bg-white z-10" style={{ borderColor: C.border }}>
        {[
          { id: "spec", label: "Spec", icon: FileText },
          { id: "procurement", label: "Cost & Sourcing", icon: DollarSign },
          { id: "quality", label: "Quality", icon: ShieldCheck },
          { id: "activity", label: "Activity", icon: Activity },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex-1 px-2 py-2.5 text-xs font-medium flex items-center justify-center gap-1 border-b-2 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{
              borderColor: tab === t.id ? C.primary : "transparent",
              color: tab === t.id ? C.primary : C.textSecondary,
            }}>
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-4">
        {tab === "spec" && <SpecTab item={item} scenarioStep={scenarioStep} />}
        {tab === "procurement" && <ProcurementTab item={item} scenarioStep={scenarioStep} />}
        {tab === "quality" && <QualityTab item={item} scenarioStep={scenarioStep} />}
        {tab === "activity" && <ItemActivityTab item={item} scenarioStep={scenarioStep} />}
      </div>
    </div>
  );
}

function SpecTab({ item, scenarioStep }) {
  const isHero = item.id === 3;
  const specEdited = scenarioStep >= 2;
  return (
    <div>
      {isHero && specEdited && (
        <div className="mb-3 p-3 rounded-md border flex items-start gap-2"
          style={{ backgroundColor: C.primarySoft, borderColor: C.primaryLight }}>
          <Sparkles className="w-4 h-4 shrink-0 mt-0.5" style={{ color: C.primary }} />
          <div className="text-xs" style={{ color: C.textPrimary }}>
            <div className="font-semibold mb-0.5">AI Impact Preview</div>
            <div style={{ color: C.textSecondary }}>
              Cost <span className="font-semibold" style={{ color: C.error }}>+$8.50</span> ·
              Lead Time <span className="font-semibold" style={{ color: C.error }}> +14d</span> ·
              Supplier <span className="font-semibold"> 3 suppliers affected</span>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-1.5 mb-4">
        {Object.entries(item.spec || {}).map(([k, v]) => {
          const changed = v.toString().includes("changed");
          return (
            <div key={k} className="flex items-start py-1.5 border-b text-xs"
              style={{ borderColor: C.borderLight, backgroundColor: changed ? C.primarySoft : "transparent" }}>
              <span className="w-1/3 px-1" style={{ color: C.textSecondary }}>{k}</span>
              <span className="flex-1 px-1 font-medium" style={{ color: changed ? C.primary : C.textPrimary }}>
                {v}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-5">
        <div className="text-xs font-semibold mb-2" style={{ color: C.textPrimary }}>Similar Parts (AI recommended)</div>
        <div className="space-y-2">
          {[
            { id: "EI2-I6DA-002WB", desc: "PANEL,AMOLED,6.5IN,FHD+,90HZ", sim: 92 },
            { id: "EI2-I6DA-004WB", desc: "PANEL,AMOLED,6.7IN,QHD+,120HZ", sim: 87 },
          ].map((s) => (
            <div key={s.id} className="p-2 rounded-md border flex items-center justify-between text-xs"
              style={{ borderColor: C.borderLight }}>
              <div>
                <div className="font-mono" style={{ color: C.textPrimary }}>{s.id}</div>
                <div style={{ color: C.textSecondary }}>{s.desc}</div>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                style={{ backgroundColor: C.successLight, color: C.success }}>{s.sim}% match</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CostTab({ item, scenarioStep }) {
  const isHero = item.id === 3;
  const cost = item.cost;
  const rfqSent = isHero && scenarioStep >= 5;
  const quoted = isHero && scenarioStep >= 6 ? 38.90 : (cost && cost.quoted);

  if (!cost) {
    return (
      <div className="text-center py-12">
        <DollarSign className="w-10 h-10 mx-auto mb-2" style={{ color: C.textDisabled }} />
        <div className="text-sm font-medium mb-1" style={{ color: C.textPrimary }}>No Cost Info</div>
        <div className="text-xs" style={{ color: C.textSecondary }}>Cost analysis hasn't started for this part yet.</div>
      </div>
    );
  }

  const currentValue = quoted || cost.current;
  const overTarget = currentValue > cost.target;
  const deltaAmt = currentValue - cost.target;

  return (
    <div>
      {/* Target vs Current */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-md border" style={{ borderColor: C.border }}>
          <div className="text-[10px] font-medium" style={{ color: C.textSecondary }}>TARGET COST</div>
          <div className="text-xl font-bold mt-0.5" style={{ color: C.textPrimary }}>${cost.target.toFixed(2)}</div>
        </div>
        <div className="p-3 rounded-md border"
          style={{
            borderColor: C.border,
            backgroundColor: overTarget ? C.errorLight : C.successLight,
          }}>
          <div className="text-[10px] font-medium" style={{ color: overTarget ? C.error : C.success }}>
            CURRENT
          </div>
          <div className="text-xl font-bold mt-0.5" style={{ color: overTarget ? C.error : C.success }}>
            ${currentValue.toFixed(2)}
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: overTarget ? C.error : C.success }}>
            {overTarget ? "+" : ""}${deltaAmt.toFixed(2)} {overTarget ? "over" : "under"} target
          </div>
        </div>
      </div>

      {/* Multi-source Price */}
      <div className="text-xs font-semibold mb-2" style={{ color: C.textPrimary }}>Multi-source Price</div>
      <div className="space-y-1.5 mb-4">
        {[
          { label: "Historical", value: cost.historical, source: "Internal DB" },
          { label: "Market Price", value: cost.market, source: "Market Intel" },
          { label: "Should-cost", value: cost.shouldCost, source: "AI Estimation", ai: true },
          { label: "Quoted", value: quoted, source: rfqSent ? "RFQ Response" : (cost.quoted ? "Awarded" : "Pending RFQ") },
        ].map((p) => (
          <div key={p.label} className="flex items-center justify-between py-1.5 px-2 rounded text-xs"
            style={{ backgroundColor: p.ai ? C.primarySoft : "transparent" }}>
            <div className="flex items-center gap-1.5">
              {p.ai && <Sparkles className="w-3 h-3" style={{ color: C.primary }} />}
              <span className="font-medium" style={{ color: C.textPrimary }}>{p.label}</span>
              <span className="text-[10px]" style={{ color: C.textDisabled }}>· {p.source}</span>
            </div>
            <span className="font-mono font-semibold" style={{ color: p.value ? C.textPrimary : C.textDisabled }}>
              {p.value ? `$${p.value.toFixed(2)}` : "—"}
            </span>
          </div>
        ))}
      </div>

      {/* Cost Bridge mini chart */}
      <div className="p-3 rounded-md border mb-4" style={{ borderColor: C.border }}>
        <div className="text-xs font-semibold mb-2" style={{ color: C.textPrimary }}>Cost Bridge</div>
        <div className="flex items-end gap-1 h-24">
          {(() => {
            const maxV = Math.max(cost.historical, cost.shouldCost, cost.market, quoted || 0, cost.target);
            return [
              { label: "Historical", v: cost.historical, c: C.textDisabled },
              { label: "Should", v: cost.shouldCost, c: C.primary },
              { label: "Market", v: cost.market, c: C.warning },
              { label: "Quoted", v: quoted || 0, c: C.success },
              { label: "Target", v: cost.target, c: C.info, dashed: true },
            ].map((b) => (
              <div key={b.label} className="flex-1 flex flex-col items-center">
                <div className="text-[9px] font-mono mb-1" style={{ color: b.c }}>
                  {b.v ? `$${b.v.toFixed(1)}` : "—"}
                </div>
                <div className="w-full rounded-t"
                  style={{
                    height: b.v ? `${(b.v / maxV) * 70}px` : "2px",
                    backgroundColor: b.c,
                    opacity: b.dashed ? 0.5 : 1,
                  }} />
                <div className="text-[9px] mt-1 text-center" style={{ color: C.textSecondary }}>{b.label}</div>
              </div>
            ));
          })()}
        </div>
      </div>

      {/* Action button (RFQ only for the Hero scenario part) */}
      {isHero && (
        <div className="flex gap-2">
          <button className="flex-1 px-3 py-2 rounded-md text-xs font-medium text-white flex items-center justify-center gap-1.5"
            style={{ backgroundColor: rfqSent ? C.success : C.primary }}>
            {rfqSent ? <CheckCircle className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
            {rfqSent ? "RFQ Sent" : "Send RFQ"}
          </button>
        </div>
      )}
    </div>
  );
}

// === PROCUREMENT TAB (Cost + Sourcing combined) ===
// Decision flow: "How much?" → "From whom?" → "Send RFQ"
function ProcurementTab({ item, scenarioStep }) {
  const isHero = item.id === 3;
  const cost = item.cost;
  const rfqSent = isHero && scenarioStep >= 5;
  const responsesReceived = isHero && scenarioStep >= 6;
  const awarded = isHero && scenarioStep >= 7;
  const quoted = isHero && scenarioStep >= 6 ? 38.90 : (cost && cost.quoted);

  // Suppliers: Hero uses scenario; others read from item.suppliers
  const suppliers = isHero
    ? [
        { name: "Samsung Display", risk: "Low", capability: 95, performance: 92, recommended: true, quote: 40.20 },
        { name: "BOE Technology", risk: "Med", capability: 88, performance: 85, recommended: true, quote: 38.90, awarded: awarded },
        { name: "LG Display", risk: "Low", capability: 90, performance: 89, recommended: true, quote: 41.00 },
      ]
    : (item.suppliers || []);

  // Empty state: no cost data AND no suppliers
  if (!cost && suppliers.length === 0) {
    return (
      <div className="text-center py-12">
        <DollarSign className="w-10 h-10 mx-auto mb-2" style={{ color: C.textDisabled }} />
        <div className="text-sm font-medium mb-1" style={{ color: C.textPrimary }}>No Procurement Info</div>
        <div className="text-xs" style={{ color: C.textSecondary }}>
          Cost analysis and supplier sourcing haven't started yet.
        </div>
      </div>
    );
  }

  const currentValue = quoted || (cost && cost.current);
  const overTarget = cost && currentValue > cost.target;
  const deltaAmt = cost ? currentValue - cost.target : 0;

  return (
    <div>
      {/* === COST SECTION === */}
      {cost && (
        <>
          {/* Target vs Current KPI cards */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-md border" style={{ borderColor: C.border }}>
              <div className="text-[10px] font-medium" style={{ color: C.textSecondary }}>TARGET COST</div>
              <div className="text-xl font-bold mt-0.5" style={{ color: C.textPrimary }}>${cost.target.toFixed(2)}</div>
            </div>
            <div className="p-3 rounded-md border"
              style={{
                borderColor: C.border,
                backgroundColor: overTarget ? C.errorLight : C.successLight,
              }}>
              <div className="text-[10px] font-medium" style={{ color: overTarget ? C.error : C.success }}>
                CURRENT
              </div>
              <div className="text-xl font-bold mt-0.5" style={{ color: overTarget ? C.error : C.success }}>
                ${currentValue.toFixed(2)}
              </div>
              <div className="text-[10px] mt-0.5" style={{ color: overTarget ? C.error : C.success }}>
                {overTarget ? "+" : ""}${deltaAmt.toFixed(2)} {overTarget ? "over" : "under"} target
              </div>
            </div>
          </div>

          {/* Multi-source Price */}
          <div className="text-xs font-semibold mb-2" style={{ color: C.textPrimary }}>Multi-source Price</div>
          <div className="space-y-1.5 mb-4">
            {[
              { label: "Historical", value: cost.historical, source: "Internal DB" },
              { label: "Market Price", value: cost.market, source: "Market Intel" },
              { label: "Should-cost", value: cost.shouldCost, source: "AI Estimation", ai: true },
              { label: "Quoted", value: quoted, source: rfqSent ? "RFQ Response" : (cost.quoted ? "Awarded" : "Pending RFQ") },
            ].map((p) => (
              <div key={p.label} className="flex items-center justify-between py-1.5 px-2 rounded text-xs"
                style={{ backgroundColor: p.ai ? C.primarySoft : "transparent" }}>
                <div className="flex items-center gap-1.5">
                  {p.ai && <Sparkles className="w-3 h-3" style={{ color: C.primary }} />}
                  <span className="font-medium" style={{ color: C.textPrimary }}>{p.label}</span>
                  <span className="text-[10px]" style={{ color: C.textDisabled }}>· {p.source}</span>
                </div>
                <span className="font-mono font-semibold" style={{ color: p.value ? C.textPrimary : C.textDisabled }}>
                  {p.value ? `$${p.value.toFixed(2)}` : "—"}
                </span>
              </div>
            ))}
          </div>

          {/* Cost Bridge mini chart */}
          <div className="p-3 rounded-md border mb-4" style={{ borderColor: C.border }}>
            <div className="text-xs font-semibold mb-2" style={{ color: C.textPrimary }}>Cost Bridge</div>
            <div className="flex items-end gap-1 h-24">
              {(() => {
                const maxV = Math.max(cost.historical, cost.shouldCost, cost.market, quoted || 0, cost.target);
                return [
                  { label: "Historical", v: cost.historical, c: C.textDisabled },
                  { label: "Should", v: cost.shouldCost, c: C.primary },
                  { label: "Market", v: cost.market, c: C.warning },
                  { label: "Quoted", v: quoted || 0, c: C.success },
                  { label: "Target", v: cost.target, c: C.info, dashed: true },
                ].map((b) => (
                  <div key={b.label} className="flex-1 flex flex-col items-center">
                    <div className="text-[9px] font-mono mb-1" style={{ color: b.c }}>
                      {b.v ? `$${b.v.toFixed(1)}` : "—"}
                    </div>
                    <div className="w-full rounded-t"
                      style={{
                        height: b.v ? `${(b.v / maxV) * 70}px` : "2px",
                        backgroundColor: b.c,
                        opacity: b.dashed ? 0.5 : 1,
                      }} />
                    <div className="text-[9px] mt-1 text-center" style={{ color: C.textSecondary }}>{b.label}</div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </>
      )}

      {/* === SOURCING SECTION === */}
      {suppliers.length > 0 && (
        <>
          <div className="text-xs font-semibold mb-2" style={{ color: C.textPrimary }}>
            {isHero ? "Recommended Suppliers" : "Qualified Suppliers"}{" "}
            <span className="text-[10px]" style={{ color: C.textSecondary }}>
              · {isHero ? "Pre-qualified by AI" : "Master Supplier List"}
            </span>
          </div>
          <div className="space-y-2 mb-4">
            {suppliers.map((s, idx) => {
              const isAwarded = s.awarded || (!isHero && idx === 0 && s.recommended);
              return (
                <div key={s.name} className="p-2.5 rounded-md border"
                  style={{
                    borderColor: isAwarded ? C.success : C.borderLight,
                    backgroundColor: isAwarded ? C.successLight : "white",
                  }}>
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Building2 className="w-3.5 h-3.5" style={{ color: C.textSecondary }} />
                      <span className="text-xs font-semibold" style={{ color: C.textPrimary }}>{s.name}</span>
                      {isAwarded && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                          style={{ backgroundColor: C.success, color: "white" }}>AWARDED</span>
                      )}
                      {s.recommended && !isAwarded && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                          style={{ backgroundColor: C.primaryLight, color: C.primary }}>RECOMMENDED</span>
                      )}
                    </div>
                    {(responsesReceived || (!isHero && s.quote)) && (
                      <span className="font-mono font-semibold text-xs"
                        style={{ color: isAwarded ? C.success : C.textPrimary }}>
                        {s.quote ? `$${s.quote.toFixed(2)}` : "—"}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div>
                      <div style={{ color: C.textDisabled }}>Risk</div>
                      <div className="font-medium" style={{ color: s.risk === "Low" ? C.success : s.risk === "Med" ? C.warning : C.error }}>{s.risk}</div>
                    </div>
                    <div>
                      <div style={{ color: C.textDisabled }}>Capability</div>
                      <div className="font-medium" style={{ color: C.textPrimary }}>{s.capability}/100</div>
                    </div>
                    <div>
                      <div style={{ color: C.textDisabled }}>Performance</div>
                      <div className="font-medium" style={{ color: C.textPrimary }}>{s.performance}/100</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* AI Recommendation (Hero scenario) */}
          {isHero && responsesReceived && !awarded && (
            <div className="p-3 mb-4 rounded-md border flex items-start gap-2"
              style={{ backgroundColor: C.primarySoft, borderColor: C.primaryLight }}>
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5" style={{ color: C.primary }} />
              <div className="text-xs">
                <div className="font-semibold mb-0.5" style={{ color: C.textPrimary }}>AI Recommendation</div>
                <div style={{ color: C.textSecondary }}>
                  <span className="font-medium">BOE Technology</span> — -$2.90 vs Should-cost (best); Risk Med but Performance is solid
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* === UNIFIED ACTION BUTTON === */}
      {/* Phase-aware: Send RFQ → Awaiting → Awarded (Hero scenario flow) */}
      {isHero && (
        <button className="w-full px-3 py-2 rounded-md text-xs font-medium text-white flex items-center justify-center gap-1.5"
          style={{ backgroundColor: awarded ? C.success : C.primary }}>
          {awarded ? <><CheckCircle className="w-3.5 h-3.5" />BOE Awarded · Notify CM</>
            : rfqSent ? <><Clock className="w-3.5 h-3.5" />Awaiting Quotes (D-3)</>
            : <><Send className="w-3.5 h-3.5" />Send Multi-Supplier RFQ</>}
        </button>
      )}
    </div>
  );
}

function QualityTab({ item, scenarioStep }) {
  const isHero = item.id === 3;
  const ppapStarted = isHero && scenarioStep >= 7;
  const q = item.quality;

  if (!q) {
    return (
      <div className="text-center py-12">
        <ShieldCheck className="w-10 h-10 mx-auto mb-2" style={{ color: C.textDisabled }} />
        <div className="text-sm font-medium mb-1" style={{ color: C.textPrimary }}>No Quality Info</div>
        <div className="text-xs" style={{ color: C.textSecondary }}>PPAP hasn't been registered for this part yet.</div>
      </div>
    );
  }

  const riskColor = q.riskLevel === "Low" ? C.success : q.riskLevel === "Medium" ? C.warning : C.error;
  const overallSync = !isHero || ppapStarted;

  return (
    <div>
      {/* Risk + PPAP Level + Progress */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="p-3 rounded-md border" style={{ borderColor: C.border }}>
          <div className="text-[10px] font-medium" style={{ color: C.textSecondary }}>RISK</div>
          <div className="text-lg font-bold mt-0.5" style={{ color: riskColor }}>{q.riskLevel}</div>
        </div>
        <div className="p-3 rounded-md border" style={{ borderColor: C.border, backgroundColor: C.primarySoft }}>
          <div className="text-[10px] font-medium" style={{ color: C.primary }}>PPAP</div>
          <div className="text-lg font-bold mt-0.5" style={{ color: C.primary }}>Lv {q.ppapLevel}</div>
        </div>
        <div className="p-3 rounded-md border" style={{ borderColor: C.border }}>
          <div className="text-[10px] font-medium" style={{ color: C.textSecondary }}>PROGRESS</div>
          <div className="text-lg font-bold mt-0.5"
            style={{ color: q.progress >= 80 ? C.success : q.progress >= 50 ? C.warning : C.error }}>
            {q.progress}%
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: C.bg }}>
          <div className="h-full rounded-full transition-all"
            style={{
              width: `${q.progress}%`,
              backgroundColor: q.progress >= 80 ? C.success : q.progress >= 50 ? C.warning : C.error,
            }} />
        </div>
      </div>

      {/* Q-BOM Sync indicator */}
      <div className="mb-4 p-2.5 rounded-md flex items-center gap-2"
        style={{ backgroundColor: overallSync ? C.successLight : C.warningLight }}>
        {overallSync ? (
          <CheckCircle className="w-4 h-4 shrink-0" style={{ color: C.success }} />
        ) : (
          <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: C.warning }} />
        )}
        <div className="flex-1 text-xs">
          <div className="font-semibold" style={{ color: overallSync ? C.success : C.warning }}>
            {overallSync ? "Q-BOM ↔ C-BOM Synced" : "Q-BOM Sync Needed"}
          </div>
          <div className="text-[10px]" style={{ color: C.textSecondary }}>
            {overallSync ? "Last sync: Just now · Auto-sync enabled" : "Register newly added parts to Q-BOM"}
          </div>
        </div>
      </div>

      {/* PPAP Deliverables */}
      <div className="text-xs font-semibold mb-2" style={{ color: C.textPrimary }}>
        PPAP Deliverables · Level {q.ppapLevel}
      </div>
      <div className="space-y-1.5 mb-4">
        {q.deliverables.map((d, i) => {
          // Hero scenario: simulate progress when ppapStarted
          const ppapStatus = (isHero && ppapStarted)
            ? (i < 2 ? "submitted" : i < 4 ? "pending" : "not-started")
            : d.status;
          const config = {
            submitted: { icon: CheckCircle, color: C.success, label: "Submitted" },
            pending: { icon: Clock, color: C.warning, label: "Pending" },
            "not-started": { icon: Clock, color: C.textDisabled, label: "Not Started" },
          }[ppapStatus];
          return (
            <div key={d.name} className="flex items-center gap-2 text-xs py-1">
              <config.icon className="w-3.5 h-3.5 shrink-0" style={{ color: config.color }} />
              <span className="flex-1" style={{ color: C.textPrimary }}>{d.name}</span>
              <span className="text-[10px]" style={{ color: config.color }}>{config.label}</span>
            </div>
          );
        })}
      </div>

      {/* Action button (Hero only) */}
      {isHero && (
        <button className="w-full px-3 py-2 rounded-md text-xs font-medium text-white flex items-center justify-center gap-1.5"
          style={{ backgroundColor: ppapStarted ? C.success : C.primary }}>
          {ppapStarted ? <><CheckCircle className="w-3.5 h-3.5" />PPAP In Progress · Notify PM</>
            : <><FlaskConical className="w-3.5 h-3.5" />Request PPAP from Supplier</>}
        </button>
      )}
    </div>
  );
}

function ItemActivityTab({ item, scenarioStep }) {
  // Unified activity feed: system events + chat messages combined
  const isHero = item.id === 3;
  const activity = getItemActivity(item.id, scenarioStep, isHero);

  // Event type icon + color mapping for system events
  const getEventMeta = (type, severity) => {
    const map = {
      spec_change: { icon: Edit3, bg: "rgba(83,45,246,0.10)", fg: C.primary, label: "Spec" },
      status:      { icon: AlertCircle, bg: severity === "success" ? "rgba(0,153,85,0.10)" : severity === "warning" ? "rgba(224,105,0,0.10)" : "rgba(211,47,47,0.10)",
                     fg: severity === "success" ? C.success : severity === "warning" ? C.warning : C.error, label: "Status" },
      ai_insight:  { icon: Sparkles, bg: "rgba(83,45,246,0.10)", fg: C.primary, label: "AI" },
      file:        { icon: Paperclip, bg: "rgba(0,0,0,0.06)", fg: C.textSecondary, label: "File" },
      version:     { icon: GitBranch, bg: "rgba(0,0,0,0.06)", fg: C.textSecondary, label: "Version" },
      sync:        { icon: RefreshCw, bg: "rgba(0,153,85,0.10)", fg: C.success, label: "Sync" },
      ppap:        { icon: ShieldCheck, bg: "rgba(21,101,224,0.10)", fg: C.info, label: "PPAP" },
      supplier:    { icon: Building2, bg: "rgba(83,45,246,0.10)", fg: C.primary, label: "Supplier" },
    };
    return map[type] || map.status;
  };

  if (activity.length === 0) {
    return (
      <div className="text-center py-8">
        <Activity className="w-10 h-10 mx-auto mb-2" style={{ color: C.textDisabled }} />
        <div className="text-sm font-medium mb-1" style={{ color: C.textPrimary }}>No Activity Yet</div>
        <div className="text-xs" style={{ color: C.textSecondary }}>
          Activity, system events, and chat will appear here.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Header summary */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b" style={{ borderColor: C.borderLight }}>
        <div className="text-xs" style={{ color: C.textSecondary }}>
          <span className="font-semibold" style={{ color: C.textPrimary }}>{activity.length}</span> events
        </div>
        <div className="text-[10px]" style={{ color: C.textDisabled }}>
          System events + chat messages
        </div>
      </div>

      {activity.map((item, idx) => {
        // === System event rendering ===
        if (item.source === "system") {
          const meta = getEventMeta(item.type, item.severity);
          const Icon = meta.icon;
          return (
            <div key={item.id} className="flex items-start gap-2.5 p-2 rounded-md transition-colors hover:bg-gray-50">
              <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                style={{ backgroundColor: meta.bg }}>
                <Icon className="w-3.5 h-3.5" style={{ color: meta.fg }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: meta.bg, color: meta.fg }}>
                    {meta.label}
                  </span>
                  <span className="text-xs font-medium" style={{ color: C.textPrimary }}>
                    {item.title}
                  </span>
                  <span className="text-[10px] ml-auto shrink-0" style={{ color: C.textDisabled }}>
                    {item.ts}
                  </span>
                </div>
                <div className="text-[11px] leading-relaxed" style={{ color: C.textSecondary }}>
                  {item.detail}
                </div>
                {item.actor && item.actor !== "system" && (
                  <div className="text-[10px] mt-1" style={{ color: C.textDisabled }}>
                    by {item.actor === "AI" ? "AI Assistant" : (PERSONAS[item.actor]?.name || item.actor)}
                  </div>
                )}
              </div>
            </div>
          );
        }

        // === Chat message rendering (existing style, lightly adapted) ===
        const m = item;
        return (
          <div key={m.id} className="flex items-start gap-2.5 p-2 rounded-md transition-colors hover:bg-gray-50"
            style={{ backgroundColor: m.decision ? C.primarySoft : "transparent" }}>
            <PersonaAvatar p={m.persona === "AI" ? "PM" : m.persona} size={28} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: "rgba(0,0,0,0.05)", color: C.textSecondary }}>
                  Chat
                </span>
                <span className="text-xs font-medium" style={{ color: C.textPrimary }}>
                  {m.persona === "AI" ? "AI Assistant" : PERSONAS[m.persona]?.name}
                </span>
                {m.decision && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-bold"
                    style={{ backgroundColor: C.primary, color: "white" }}>DECISION</span>
                )}
                <span className="text-[10px] ml-auto shrink-0" style={{ color: C.textDisabled }}>
                  {m.ts}
                </span>
              </div>
              <div className="text-[11px] leading-relaxed" style={{ color: C.textSecondary }}>
                {m.message}
              </div>
              {m.decisionText && (
                <div className="mt-1.5 p-1.5 rounded text-[10px] font-medium"
                  style={{ backgroundColor: "white", color: C.primary, borderLeft: `2px solid ${C.primary}` }}>
                  ✓ {m.decisionText}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// === ACTIVITY STREAM (Slack-style) ===
// === CHAT PANEL (shared Chat UI) ===
// context: null (global channel mode) or { itemId, partId, partName } (Item chat mode)
// Map message channel → BOM family (general/project-wide messages go to E-BOM as first BOM)
const CHANNEL_TO_BOM = {
  general: "E",
  design: "E",
  cost: "C",
  sourcing: "C",
  quality: "Q",
};

const BOM_TO_CHANNELS = {
  E: ["general", "design"],
  C: ["cost", "sourcing"],
  Q: ["quality"],
};

function ChatPanel({ scenarioStep, selectedItemId, setSelectedItemId, context, activeProjectCode, onClose }) {
  // Resolve active project for context display
  const project = PROJECTS.find((p) => p.code === activeProjectCode) || PROJECTS[0];

  // Scope mode: "all" | "bom" | "item"
  // If context (specific part) is passed in, start in item scope
  const [scope, setScope] = useState(context ? "item" : "all");
  const [bomFilter, setBomFilter] = useState("E"); // when scope === "bom"
  const [itemContext, setItemContext] = useState(context); // when scope === "item"
  const [searchQuery, setSearchQuery] = useState("");

  // Visibility (who can see the next message) — default to Internal team for safety
  // Audiences keyed by id, summarized in composer chip; edited via modal
  const [messageVisibility, setMessageVisibility] = useState({
    groups: ["internal"], // "internal" | "external"
    users: [],             // additional individual users
  });
  const [visibilityModalOpen, setVisibilityModalOpen] = useState(false);

  // Sync from external context prop
  useEffect(() => {
    if (context) {
      setScope("item");
      setItemContext(context);
    }
  }, [context]);

  // All messages (gated by scenarioStep for hero/AI; empty for new projects)
  const allMessages = useMemo(() => {
    // New projects have no collaboration history yet
    if (project.isNew) return [];
    return ACTIVITY_FEED.filter((m) => {
      if (m.itemRef && m.itemRef.id === 3) {
        const idx = ACTIVITY_FEED.indexOf(m);
        return idx <= scenarioStep;
      }
      if (m.aiInsight) {
        const idx = ACTIVITY_FEED.indexOf(m);
        return idx <= scenarioStep;
      }
      const idx = ACTIVITY_FEED.indexOf(m);
      if (idx <= 7) return idx <= scenarioStep;
      return true;
    });
  }, [scenarioStep, project.isNew]);

  // Apply scope filter
  const scopedMessages = useMemo(() => {
    if (scope === "item" && itemContext) {
      return allMessages.filter((m) => m.itemRef && m.itemRef.id === itemContext.itemId);
    }
    if (scope === "bom") {
      const channels = BOM_TO_CHANNELS[bomFilter] || [];
      return allMessages.filter((m) => channels.includes(m.channel));
    }
    return allMessages;
  }, [allMessages, scope, bomFilter, itemContext]);

  // Apply search filter
  const displayMessages = useMemo(() => {
    if (!searchQuery.trim()) return scopedMessages;
    const q = searchQuery.toLowerCase();
    return scopedMessages.filter((m) =>
      m.message.toLowerCase().includes(q)
      || (m.itemRef && (m.itemRef.partId?.toLowerCase().includes(q) || m.itemRef.partName?.toLowerCase().includes(q)))
      || (PERSONAS[m.persona]?.name || "").toLowerCase().includes(q)
    );
  }, [scopedMessages, searchQuery]);

  // BOM mode: group by channel (Q6-c)
  const groupedByChannel = useMemo(() => {
    if (scope !== "bom") return null;
    const channels = BOM_TO_CHANNELS[bomFilter] || [];
    const groups = {};
    channels.forEach((ch) => { groups[ch] = []; });
    displayMessages.forEach((m) => {
      if (groups[m.channel]) groups[m.channel].push(m);
    });
    return groups;
  }, [displayMessages, scope, bomFilter]);

  // Open thread (click on a part chip)
  const openItemScope = (itemRef) => {
    if (!itemRef) return;
    setItemContext({
      itemId: itemRef.id,
      partId: itemRef.partId,
      partName: itemRef.partName || itemRef.desc,
    });
    setScope("item");
    if (setSelectedItemId) setSelectedItemId(itemRef.id);
  };

  // Header subtitle by scope — always shows project name first
  const getScopeSubtitle = () => {
    const projectPrefix = project.name;
    if (scope === "all") return `${projectPrefix} · ${displayMessages.length} messages`;
    if (scope === "bom") return `${projectPrefix} · ${bomFilter}-BOMs scope · ${displayMessages.length}`;
    if (scope === "item" && itemContext) return `${projectPrefix} · ${itemContext.partName} · ${displayMessages.length}`;
    return `${projectPrefix} · ${displayMessages.length} messages`;
  };

  // Composer placeholder/indicator by scope
  const getComposerContext = () => {
    if (scope === "all") return { label: "All conversations", placeholder: "Type a message..." };
    if (scope === "bom") return { label: `${bomFilter}-BOMs scope`, placeholder: `Post to ${bomFilter}-BOMs...` };
    if (scope === "item" && itemContext) return { label: itemContext.partName, placeholder: `Reply to ${itemContext.partName}...` };
    return { label: "", placeholder: "Type a message..." };
  };
  const composerCtx = getComposerContext();

  return (
    <div className="flex flex-col bg-white h-full" style={{ width: "100%" }}>
      {/* Panel Header */}
      <div className="px-4 py-3 border-b" style={{ borderColor: C.border }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
              style={{ backgroundColor: C.primaryLight }}>
              <MessageSquare className="w-4 h-4" style={{ color: C.primary }} />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>Chat</div>
              <div className="text-[10px] truncate" style={{ color: C.textSecondary }}>
                {getScopeSubtitle()}
              </div>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose}
              className="p-1 rounded hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1">
              <X className="w-4 h-4" style={{ color: C.textSecondary }} />
            </button>
          )}
        </div>

        {/* Scope Tabs */}
        <div className="flex items-center gap-1 p-0.5 rounded-md mb-2" style={{ backgroundColor: C.bg }}>
          <button onClick={() => setScope("all")}
            className="flex-1 px-2 py-1 rounded text-[11px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{
              backgroundColor: scope === "all" ? "white" : "transparent",
              color: scope === "all" ? C.primary : C.textSecondary,
              boxShadow: scope === "all" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
            }}
            onMouseEnter={(e) => { if (scope !== "all") e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.03)"; }}
            onMouseLeave={(e) => { if (scope !== "all") e.currentTarget.style.backgroundColor = "transparent"; }}>
            All
          </button>
          <button onClick={() => setScope("bom")}
            className="flex-1 px-2 py-1 rounded text-[11px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{
              backgroundColor: scope === "bom" ? "white" : "transparent",
              color: scope === "bom" ? C.primary : C.textSecondary,
              boxShadow: scope === "bom" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
            }}
            onMouseEnter={(e) => { if (scope !== "bom") e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.03)"; }}
            onMouseLeave={(e) => { if (scope !== "bom") e.currentTarget.style.backgroundColor = "transparent"; }}>
            BOM
          </button>
          <button onClick={() => setScope("item")}
            disabled={!itemContext}
            className="flex-1 px-2 py-1 rounded text-[11px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed"
            style={{
              backgroundColor: scope === "item" ? "white" : "transparent",
              color: scope === "item" ? C.primary : (itemContext ? C.textSecondary : C.textDisabled),
              boxShadow: scope === "item" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
            }}
            onMouseEnter={(e) => { if (scope !== "item" && itemContext) e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.03)"; }}
            onMouseLeave={(e) => { if (scope !== "item") e.currentTarget.style.backgroundColor = "transparent"; }}
            title={itemContext ? "" : "Select a part to enable Item scope"}>
            Item
          </button>
        </div>

        {/* BOM picker (when scope === "bom") */}
        {scope === "bom" && (
          <div className="flex items-center gap-1 mb-2">
            <span className="text-[10px] font-medium uppercase tracking-wide shrink-0" style={{ color: C.textDisabled }}>
              BOM:
            </span>
            {["M", "E", "S", "Q", "C"].map((id) => (
              <button key={id} onClick={() => setBomFilter(id)}
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 hover:opacity-80"
                style={{
                  backgroundColor: bomFilter === id ? C.primary : "transparent",
                  color: bomFilter === id ? "white" : C.textSecondary,
                  border: bomFilter === id ? "none" : `1px solid ${C.border}`,
                }}>
                {id}-BOMs
              </button>
            ))}
          </div>
        )}

        {/* Item indicator (when scope === "item") */}
        {scope === "item" && itemContext && (
          <div className="flex items-center gap-2 px-2 py-1.5 rounded-md mb-2"
            style={{ backgroundColor: itemContext.itemId === 3 ? C.warningLight : C.bg }}>
            <Package className="w-3 h-3 shrink-0"
              style={{ color: itemContext.itemId === 3 ? C.warning : C.textSecondary }} />
            <div className="min-w-0 flex-1">
              <div className="text-[11px] font-semibold truncate" style={{ color: C.textPrimary }}>
                {itemContext.partName}
              </div>
              <div className="text-[9px] font-mono" style={{ color: C.textSecondary }}>
                {itemContext.partId}
              </div>
            </div>
            <button onClick={() => { setItemContext(null); setScope("all"); }}
              className="p-0.5 rounded hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              title="Clear item filter">
              <X className="w-3 h-3" style={{ color: C.textSecondary }} />
            </button>
          </div>
        )}

        {/* Search */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-md border focus-within:ring-2 focus-within:ring-offset-1"
          style={{ borderColor: C.border }}>
          <Search className="w-3 h-3 shrink-0" style={{ color: C.textDisabled }} />
          <input type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages, parts, people..."
            className="flex-1 text-[11px] outline-none bg-transparent"
            style={{ color: C.textPrimary }} />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}
              className="p-0.5 rounded hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1">
              <X className="w-3 h-3" style={{ color: C.textDisabled }} />
            </button>
          )}
        </div>
      </div>

      {/* Messages body */}
      <div className="flex-1 overflow-auto p-3 space-y-3">
        {displayMessages.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="w-10 h-10 mx-auto mb-2" style={{ color: C.textDisabled }} />
            <div className="text-sm font-medium mb-1" style={{ color: C.textPrimary }}>
              {searchQuery ? "No matching messages" :
                project.isNew ? "Start the conversation" :
                "No messages yet"}
            </div>
            <div className="text-xs" style={{ color: C.textSecondary }}>
              {searchQuery ? "Try a different search term" :
                project.isNew ? "This is a new project — invite collaborators and upload or link an E-BOM to begin." :
                scope === "item" ? "Send the first message about this part." :
                scope === "bom" ? `No messages in ${bomFilter}-BOMs scope yet.` :
                "Mention a teammate to start collaborating."}
            </div>
          </div>
        ) : scope === "bom" && groupedByChannel ? (
          // BOM scope: group by channel
          Object.entries(groupedByChannel).map(([channel, msgs]) => (
            msgs.length > 0 && (
              <div key={channel}>
                {/* Channel header */}
                <div className="flex items-center gap-2 mb-2 px-1">
                  <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: C.textSecondary }}>
                    #{channel}
                  </span>
                  <div className="flex-1 h-px" style={{ backgroundColor: C.borderLight }} />
                  <span className="text-[9px]" style={{ color: C.textDisabled }}>
                    {msgs.length}
                  </span>
                </div>
                {/* Messages in this channel */}
                <div className="space-y-2">
                  {msgs.map((m) => (
                    <ChatMessage key={m.id} message={m}
                      onOpenItem={openItemScope}
                      showItemChip={scope !== "item"} />
                  ))}
                </div>
              </div>
            )
          ))
        ) : (
          // All scope or Item scope: flat list with date grouping intent
          displayMessages.map((m) => (
            <ChatMessage key={m.id} message={m}
              onOpenItem={openItemScope}
              showItemChip={scope !== "item"} />
          ))
        )}
      </div>

      {/* Composer */}
      <div className="p-3 border-t bg-white relative" style={{ borderColor: C.border }}>
        {/* Top row: scope indicator + visibility chip */}
        <div className="text-[10px] mb-1.5 flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5" style={{ color: C.textSecondary }}>
            <CornerDownRight className="w-3 h-3" />
            Posting to <strong style={{ color: C.textPrimary }}>{composerCtx.label}</strong>
          </div>
          {/* Visibility chip — click to open audience picker */}
          <button
            onClick={() => setVisibilityModalOpen(true)}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{ borderColor: C.border, color: C.textSecondary, backgroundColor: "white" }}>
            <Eye className="w-2.5 h-2.5" />
            Visible to {(() => {
              const g = messageVisibility.groups.length;
              const u = messageVisibility.users.length;
              if (g === 0 && u === 0) return "no one";
              const parts = [];
              if (g > 0) parts.push(`${g} group${g > 1 ? "s" : ""}`);
              if (u > 0) parts.push(`${u} user${u > 1 ? "s" : ""}`);
              return parts.join(" + ");
            })()}
            <ChevronDown className="w-2.5 h-2.5" />
          </button>
        </div>
        <div className="rounded-md border flex items-center gap-2 p-2"
          style={{ borderColor: scope === "item" ? C.primary : C.border }}>
          <input type="text"
            placeholder={composerCtx.placeholder}
            className="flex-1 text-xs outline-none bg-transparent"
            style={{ color: C.textPrimary }} />
          <Paperclip className="w-3.5 h-3.5" style={{ color: C.textDisabled }} />
          <AtSign className="w-3.5 h-3.5" style={{ color: C.textDisabled }} />
          <Smile className="w-3.5 h-3.5" style={{ color: C.textDisabled }} />
          <button className="ml-1 px-2 py-1 rounded text-[10px] font-semibold text-white flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{ backgroundColor: C.primary }}>
            <Send className="w-3 h-3" />
            Send
          </button>
        </div>

        {/* Visibility picker modal — opens above composer, popover-style */}
        {visibilityModalOpen && (
          <VisibilityPicker
            value={messageVisibility}
            onChange={setMessageVisibility}
            onClose={() => setVisibilityModalOpen(false)}
            project={project}
          />
        )}
      </div>
    </div>
  );
}

// === VISIBILITY PICKER ===
// Modal that lets the sender choose who can see the next message.
// Two layers: Team Groups (Internal / External) + Specific Users (optional overlay).
function VisibilityPicker({ value, onChange, onClose, project }) {
  const internalList = getCollaboratorsForProject(project);
  const externalList = getExternalCollaboratorsForProject(project);
  const groups = [
    {
      id: "internal", label: "Internal Team", count: internalList.length,
      preview: internalList.slice(0, 3).map(c => PERSONAS[c.persona]?.name).join(", ") + (internalList.length > 3 ? "..." : ""),
    },
    {
      id: "external", label: "External Partners", count: externalList.length,
      preview: externalList.length > 0
        ? externalList.slice(0, 3).map(c => c.name).join(", ") + (externalList.length > 3 ? "..." : "")
        : "No external partners",
      disabled: externalList.length === 0,
    },
  ];

  const [localGroups, setLocalGroups] = useState(value.groups);
  const [localUsers, setLocalUsers] = useState(value.users);

  const toggleGroup = (gId) => {
    setLocalGroups(prev => prev.includes(gId) ? prev.filter(x => x !== gId) : [...prev, gId]);
  };
  const removeUser = (uId) => {
    setLocalUsers(prev => prev.filter(x => x !== uId));
  };

  const apply = () => {
    onChange({ groups: localGroups, users: localUsers });
    onClose();
  };

  // ESC to close
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(0,0,0,0.32)" }} onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 z-50 bg-white rounded-2xl shadow-2xl flex flex-col"
        style={{ transform: "translate(-50%, -50%)", width: 460 }}>
        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b flex items-start justify-between gap-3" style={{ borderColor: C.border }}>
          <div>
            <div className="text-base font-semibold" style={{ color: C.textPrimary }}>Visible to</div>
            <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>
              Choose who can see this message
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-md flex items-center justify-center transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2"
            style={{ color: C.textSecondary }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Team Groups section */}
        <div className="px-5 py-4">
          <div className="text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: C.textDisabled }}>
            Team Groups
          </div>
          <div className="space-y-2">
            {groups.map((g) => {
              const isSelected = localGroups.includes(g.id);
              return (
                <button
                  key={g.id}
                  onClick={() => !g.disabled && toggleGroup(g.id)}
                  disabled={g.disabled}
                  className="w-full text-left rounded-lg border px-3 py-2.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed"
                  style={{
                    borderColor: isSelected ? C.primary : C.border,
                    backgroundColor: isSelected ? C.primarySoft : "white",
                    opacity: g.disabled ? 0.5 : 1,
                  }}>
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
                      style={{ borderColor: isSelected ? C.primary : C.border, backgroundColor: isSelected ? C.primary : "white" }}>
                      {isSelected && <CheckCircle className="w-4 h-4" style={{ color: "white" }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold" style={{ color: C.textPrimary }}>{g.label}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium inline-flex items-center gap-0.5"
                          style={{ backgroundColor: C.bg, color: C.textSecondary }}>
                          <Users className="w-2.5 h-2.5" />
                          {g.count}
                        </span>
                      </div>
                      <div className="text-[11px] mt-0.5 truncate" style={{ color: C.textSecondary }}>
                        {g.preview}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Specific Users section */}
        <div className="px-5 pb-4">
          <div className="text-[11px] font-semibold uppercase tracking-wide mb-2 flex items-center justify-between" style={{ color: C.textDisabled }}>
            <span>Specific Users</span>
            <button className="text-[10px] font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 inline-flex items-center gap-0.5"
              style={{ color: C.primary }}>
              <Plus className="w-2.5 h-2.5" />
              Add
            </button>
          </div>
          {localUsers.length === 0 ? (
            <div className="text-[11px] italic" style={{ color: C.textDisabled }}>
              No additional users selected
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {localUsers.map((u) => (
                <span key={u}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium"
                  style={{ backgroundColor: C.bg, color: C.textPrimary }}>
                  {u}
                  <button onClick={() => removeUser(u)} className="hover:opacity-70 focus:outline-none">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-5 py-3 border-t flex items-center justify-end gap-2" style={{ borderColor: C.border, backgroundColor: C.surfaceTinted }}>
          <button onClick={onClose}
            className="h-8 px-3 rounded-md text-xs font-medium border transition-colors hover:bg-white focus:outline-none focus-visible:ring-2"
            style={{ borderColor: C.border, color: C.textPrimary, backgroundColor: "white" }}>
            Close
          </button>
          <button onClick={apply}
            disabled={localGroups.length === 0 && localUsers.length === 0}
            className="h-8 px-3 rounded-md text-xs font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: C.primary }}>
            Confirm
          </button>
        </div>
      </div>
    </>
  );
}

// === CHAT MESSAGE — individual message render ===
function ChatMessage({ message: m, onOpenItem, showItemChip }) {
  const isAI = m.persona === "AI";
  // Visibility — for mock data we infer from channel:
  // - sourcing/cost channels often include external suppliers; show "2 groups"
  // - others default to internal only ("Internal")
  const visibility = m.visibility || (
    m.channel === "sourcing" ? { label: "2 Groups", external: true } : { label: "Internal", external: false }
  );

  return (
    <div className="flex items-start gap-2 p-2 rounded-md"
      style={{
        // AI messages get subtle tint background (Q3-b)
        backgroundColor: isAI ? C.primarySoft : "transparent",
      }}>
      <PersonaAvatar p={isAI ? "PM" : m.persona} size={28} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5 mb-0.5 flex-wrap">
          <span className="text-xs font-semibold" style={{ color: C.textPrimary }}>
            {isAI ? "AI Assistant" : PERSONAS[m.persona]?.name}
          </span>
          {isAI && <Sparkles className="w-3 h-3 shrink-0" style={{ color: C.primary }} />}
          <span className="text-[10px]" style={{ color: C.textDisabled }}>{m.ts}</span>
          {m.channel && (
            <span className="text-[9px] px-1 py-0.5 rounded font-mono"
              style={{ backgroundColor: C.bg, color: C.textSecondary }}>
              #{m.channel}
            </span>
          )}
          {/* Visibility indicator — pushed to right edge of header */}
          <span className="ml-auto inline-flex items-center gap-1 text-[10px]"
            style={{ color: visibility.external ? C.warning : C.textDisabled }}
            title={`Visible to: ${visibility.label}`}>
            <Eye className="w-2.5 h-2.5" />
            <span>{visibility.label}</span>
          </span>
        </div>
        <div className="text-xs leading-relaxed mb-1" style={{ color: C.textPrimary }}>
          {m.message}
        </div>
        {/* Item chip — small, clickable (Q2-b) */}
        {m.itemRef && showItemChip && (
          <button onClick={() => onOpenItem && onOpenItem(m.itemRef)}
            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium mt-1 hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{
              backgroundColor: m.itemRef.id === 3 ? C.warningLight : C.bg,
              color: m.itemRef.id === 3 ? C.warning : C.textSecondary,
            }}>
            <Package className="w-2.5 h-2.5" />
            <span className="font-mono">{m.itemRef.partId}</span>
          </button>
        )}
        {m.mentions && m.mentions.length > 0 && (
          <div className="mt-1 flex items-center gap-1 flex-wrap">
            {m.mentions.map((p) => (
              <span key={p} className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                style={{ backgroundColor: C.primaryLight, color: C.primary }}>
                @{PERSONAS[p]?.role}
              </span>
            ))}
          </div>
        )}
        {m.decision && (
          <div className="mt-1.5 p-1.5 rounded flex items-start gap-1.5"
            style={{ backgroundColor: C.successLight }}>
            <CheckCircle className="w-3 h-3 mt-0.5 shrink-0" style={{ color: C.success }} />
            <div className="text-[10px] font-medium" style={{ color: C.success }}>
              Decision Pinned: {m.decisionText}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// === ACTIVITY STREAM (Legacy wrapper - delegates to ChatPanel) ===
function ActivityStream({ scenarioStep, selectedItemId, setSelectedItemId }) {
  return (
    <ChatPanel
      scenarioStep={scenarioStep}
      selectedItemId={selectedItemId}
      setSelectedItemId={setSelectedItemId}
      context={null}
    />
  );
}

// === [DEPRECATED] SCREEN 4. COST ANALYSIS ===
// 2026.05 Cost Analysis menu removed — Cost info distributed via BOM Collaboration Cost overlay/tab + Overview KPIs.
// Component definition retained for possible future restoration; not invoked in routing.
function CostAnalysis({ activeProjectCode, scenarioStep }) {
  const project = PROJECTS.find((p) => p.code === activeProjectCode) || PROJECTS[0];
  const isHeroProject = project.code === ACTIVE_PROJECT_CODE;
  const [tab, setTab] = useState("compare");

  // Mock cost data
  const summary = isHeroProject
    ? { current: 686.96, target: 700.00, delta: -13.04, trend: "down" }
    : { current: project.items * 8.5, target: project.items * 8.5 - project.tmcGap * 10, delta: project.tmcGap * 10, trend: project.tmcGap > 0 ? "up" : "down" };

  return (
    <div className="p-6" style={{ minHeight: "100%" }}>
      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 text-xs mb-1" style={{ color: C.textSecondary }}>
          <Box className="w-3.5 h-3.5" />
          <span className="font-mono">{project.code}</span>
          <span>·</span>
          <span>{project.name}</span>
        </div>
        <h1 className="text-[24px] font-medium leading-8" style={{ color: C.textPrimary }}>Cost Analysis</h1>
        <div className="text-xs mt-0.5" style={{ color: C.textSecondary }}>
          BOM-wide cost comparison, cost driver analysis, phase trend tracking
        </div>
      </div>

      {/* Summary KPI */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <KpiCard icon={DollarSign} iconColor={C.primary} label="Current Cost (USD)"
          value={`$${summary.current.toFixed(2)}`} sub={`${project.items} parts`} />
        <KpiCard icon={Target} iconColor={C.info} label="Target Material Cost"
          value={`$${summary.target.toFixed(2)}`} sub="Phase: Develop" />
        <KpiCard icon={summary.trend === "up" ? TrendingUp : TrendingDown}
          iconColor={summary.delta > 0 ? C.error : C.success} label="Difference"
          value={summary.delta === 0 ? "—" : `${summary.delta > 0 ? "+" : ""}$${summary.delta.toFixed(2)}`}
          sub={summary.delta > 0 ? "Over Target" : summary.delta < 0 ? "Under Target" : "On Target"} />
        <KpiCard icon={Activity} iconColor={C.warning} label="Items at Risk" value={isHeroProject ? "8" : Math.max(2, Math.floor(project.items / 12))} sub="Cost variance > 10%" />
      </div>

      {/* Tabs */}
      <div className="rounded-xl border bg-white overflow-hidden" style={{ borderColor: C.border }}>
        <div className="flex border-b" style={{ borderColor: C.border }}>
          {[
            { id: "compare", icon: GitBranch, label: "Cost Compare" },
            { id: "driver", icon: Target, label: "Cost Driver" },
            { id: "phase", icon: TrendingUp, label: "Phase Trend" },
            { id: "waterfall", icon: BarChart3, label: "Waterfall" },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="px-5 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              style={{
                borderColor: tab === t.id ? C.primary : "transparent",
                color: tab === t.id ? C.primary : C.textSecondary,
              }}>
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>
        <div className="p-5">
          {tab === "compare" && <CostCompareTab isHeroProject={isHeroProject} />}
          {tab === "driver" && <CostDriverTab isHeroProject={isHeroProject} />}
          {tab === "phase" && <CostPhaseTab isHeroProject={isHeroProject} project={project} />}
          {tab === "waterfall" && <CostWaterfallTab isHeroProject={isHeroProject} />}
        </div>
      </div>
    </div>
  );
}

// --- Cost Compare Tab (Source vs Target BOM) ---
function CostCompareTab({ isHeroProject }) {
  const compareData = [
    { partId: "EI2-I6DA-003WB", desc: "PANEL,AMOLED,6.7IN,FHD+,120HZ", source: 38.70, target: 45.20, change: "Similar Description", similarity: 95, isHero: true },
    { partId: "1W6-4YP3-X6FU2", desc: "IC,TOUCH CONTROLLER,I2C", source: 8.54, target: 8.54, change: null, similarity: null },
    { partId: "JXC-5DOE-D1XHX", desc: "FPC,TOUCH SENSOR,6.7IN", source: 2.64, target: 2.64, change: "Similar Description", similarity: 95 },
    { partId: "0L2-ZNSS-SAFZX", desc: "PVC,DSP,PRIVACYPROTECT", source: null, target: 1.20, change: "Newly Added", similarity: null },
    { partId: "0I1-ZNSE-VSAWD", desc: "GASKET,DISPLAY,WATERPROOF,IP68", source: 0.55, target: null, change: "Removed", similarity: null },
    { partId: "N59-FWRN-JXKHE", desc: "FPC,DISPLAY,FLEX CABLE,30P", source: 1.89, target: 2.94, change: "Similar Description", similarity: 80 },
  ];
  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="p-3 rounded-md border" style={{ borderColor: C.border }}>
          <div className="text-[10px] font-medium" style={{ color: C.textSecondary }}>NEWLY ADDED</div>
          <div className="text-lg font-bold mt-0.5" style={{ color: C.success }}>4 items</div>
          <div className="text-[10px]" style={{ color: C.textSecondary }}>+$84.20 total</div>
        </div>
        <div className="p-3 rounded-md border" style={{ borderColor: C.border }}>
          <div className="text-[10px] font-medium" style={{ color: C.textSecondary }}>REMOVED</div>
          <div className="text-lg font-bold mt-0.5" style={{ color: C.textSecondary }}>4 items</div>
          <div className="text-[10px]" style={{ color: C.textSecondary }}>-$198.09 total</div>
        </div>
        <div className="p-3 rounded-md border" style={{ borderColor: C.border }}>
          <div className="text-[10px] font-medium" style={{ color: C.textSecondary }}>SIMILAR (Changed)</div>
          <div className="text-lg font-bold mt-0.5" style={{ color: C.warning }}>3 items</div>
          <div className="text-[10px]" style={{ color: C.textSecondary }}>+$8.55 net</div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="border-b" style={{ borderColor: C.border, color: C.textSecondary }}>
            <tr>
              <th className="text-left py-2 px-2 font-medium">Part</th>
              <th className="text-right py-2 px-2 font-medium">Source BOM</th>
              <th className="text-right py-2 px-2 font-medium">Target BOM</th>
              <th className="text-right py-2 px-2 font-medium">Δ</th>
              <th className="text-center py-2 px-2 font-medium">Change Type</th>
              <th className="text-center py-2 px-2 font-medium">Similarity</th>
            </tr>
          </thead>
          <tbody>
            {compareData.map((r) => {
              const delta = (r.target || 0) - (r.source || 0);
              return (
                <tr key={r.partId} className="border-b"
                  style={{
                    borderColor: C.borderLight,
                    backgroundColor: r.change === "Newly Added" ? C.successLight
                      : r.change === "Removed" ? C.bg
                      : r.change === "Similar Description" ? "#FFFBEB"
                      : r.isHero ? "#FFFBEB" : "white",
                  }}>
                  <td className="py-2.5 px-2">
                    <div className="font-mono text-[10px]" style={{ color: C.textPrimary }}>{r.partId}</div>
                    <div className="text-[10px]" style={{ color: C.textSecondary }}>{r.desc}</div>
                  </td>
                  <td className="text-right font-mono py-2.5 px-2" style={{ color: r.source ? C.textPrimary : C.textDisabled }}>
                    {r.source ? `$${r.source.toFixed(2)}` : "—"}
                  </td>
                  <td className="text-right font-mono py-2.5 px-2" style={{ color: r.target ? C.textPrimary : C.textDisabled }}>
                    {r.target ? `$${r.target.toFixed(2)}` : "—"}
                  </td>
                  <td className="text-right font-mono font-semibold py-2.5 px-2"
                    style={{ color: delta > 0 ? C.error : delta < 0 ? C.success : C.textDisabled }}>
                    {delta === 0 ? "—" : `${delta > 0 ? "+" : ""}$${delta.toFixed(2)}`}
                  </td>
                  <td className="text-center py-2.5 px-2">
                    {r.change && (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded"
                        style={{
                          backgroundColor: r.change === "Newly Added" ? C.success : r.change === "Removed" ? C.textSecondary : C.warning,
                          color: "white",
                        }}>
                        {r.change}
                      </span>
                    )}
                  </td>
                  <td className="text-center py-2.5 px-2 font-mono" style={{ color: C.textSecondary }}>
                    {r.similarity ? `${r.similarity}%` : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Cost Driver Tab ---
function CostDriverTab({ isHeroProject }) {
  const drivers = [
    { partId: "2N5-OD6D-Q3K8L", desc: "ADHESIVE,DISPLAY BONDING,B7000", delta: -0.50, type: "Design Change",
      comment: "" },
    { partId: "E2L-JKOP-26AD2", desc: "ASSY,FILM,6.7IN,BULLET PROOF FILM", delta: 10.00, type: "Unitprice Change",
      comment: "Supplier revised unit price due to increased raw material cost" },
    { partId: "QTQ-8EQO-ESTJ7", desc: "FRAME,LOW,PL4885,MPM MANUFACTURING", delta: 17.24, type: "Design Change",
      comment: "" },
    { partId: "QTQ-8EQO-YNNFM", desc: "FRAME,MID,AL6013,CNC MACHINED", delta: -24.00, type: "Design Change",
      comment: "Price reduced following renegotiation with secondary supplier" },
    { partId: "2KW-6BTT-VN5FN", desc: "PCB,LTHM,POWER BANK,SUB", delta: 4.00, type: "Etc",
      comment: "Temporary price surge due to supply shortage caused by..." },
    { partId: "5X7-WVXL-15J5S", desc: "ANT,5G,SUB6,MAIN,LDS", delta: -2.50, type: "Design Change",
      comment: "Cost increase reflects addition of OIS feature per latest..." },
    { partId: "0I1-ZNSE-VSAWD", desc: "GASKET,DISPLAY,WATERPROOF,IP68", delta: -0.55, type: "Process Change",
      comment: "" },
    { partId: "0L2-ZNSS-SAFZX", desc: "PVC,DSP,PRIVACYPROTECT,WP,ISO", delta: 0.70, type: "Commodity Change",
      comment: "Tooling amortization completed; unit cost decreased fr..." },
  ];

  const driverGroups = drivers.reduce((acc, d) => {
    acc[d.type] = (acc[d.type] || 0) + Math.abs(d.delta);
    return acc;
  }, {});

  return (
    <div>
      <div className="grid grid-cols-4 gap-3 mb-4">
        {Object.entries(driverGroups).map(([type, total]) => (
          <div key={type} className="p-3 rounded-md border" style={{ borderColor: C.border }}>
            <div className="text-[10px] font-medium" style={{ color: C.textSecondary }}>{type.toUpperCase()}</div>
            <div className="text-lg font-bold mt-0.5" style={{ color: C.primary }}>${total.toFixed(2)}</div>
            <div className="text-[10px]" style={{ color: C.textSecondary }}>
              {drivers.filter((d) => d.type === type).length} item(s)
            </div>
          </div>
        ))}
      </div>
      <table className="w-full text-xs">
        <thead className="border-b" style={{ borderColor: C.border, color: C.textSecondary }}>
          <tr>
            <th className="text-left py-2 px-2 font-medium">Part</th>
            <th className="text-right py-2 px-2 font-medium">Δ Amount</th>
            <th className="text-center py-2 px-2 font-medium">Cost Driver</th>
            <th className="text-left py-2 px-2 font-medium">Detail / Comment</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((d) => (
            <tr key={d.partId} className="border-b" style={{ borderColor: C.borderLight }}>
              <td className="py-2.5 px-2">
                <div className="font-mono text-[10px]" style={{ color: C.textPrimary }}>{d.partId}</div>
                <div className="text-[10px]" style={{ color: C.textSecondary }}>{d.desc}</div>
              </td>
              <td className="text-right font-mono font-semibold py-2.5 px-2"
                style={{ color: d.delta > 0 ? C.error : C.success }}>
                {d.delta > 0 ? "+" : ""}{d.delta.toFixed(2)}
              </td>
              <td className="text-center py-2.5 px-2">
                <span className="text-[10px] font-medium px-2 py-0.5 rounded border"
                  style={{
                    borderColor: C.primary, color: C.primary, backgroundColor: C.primarySoft,
                  }}>
                  {d.type}
                </span>
              </td>
              <td className="py-2.5 px-2 text-[10px]" style={{ color: C.textSecondary }}>{d.comment || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- Phase Trend Tab ---
function CostPhaseTab({ isHeroProject, project }) {
  const phaseData = isHeroProject ? [
    { phase: "Concept", date: "2026/04/21", current: 778.80, target: 800.85, delta: -22.05 },
    { phase: "Define", date: "2026/05/15", current: 749.49, target: 778.80, delta: -29.31 },
    { phase: "Plan", date: "2026/06/10", current: 724.90, target: 749.49, delta: -24.59 },
    { phase: "Develop", date: "2026/07/02", current: 686.96, target: 724.90, delta: -37.94 },
  ] : PHASES.slice(0, PHASES.indexOf(project.phase) + 1).map((ph, i) => ({
    phase: ph,
    date: `2026/0${(i + 4).toString().padStart(2, "0")}/15`,
    current: 800 - i * 25,
    target: 820 - i * 25,
    delta: -20,
  }));

  const maxValue = Math.max(...phaseData.map((d) => Math.max(d.current, d.target)));

  return (
    <div>
      {/* Line chart simulation */}
      <div className="mb-5 p-4 rounded-md border" style={{ borderColor: C.border }}>
        <div className="text-xs font-semibold mb-3" style={{ color: C.textPrimary }}>
          Cost Trend by Phase
        </div>
        <div className="flex items-end gap-4 h-48 px-4">
          {phaseData.map((d, i) => (
            <div key={d.phase} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center gap-1" style={{ height: "75%" }}>
                <div className="w-1/3 rounded-t flex flex-col items-center justify-end relative"
                  style={{
                    height: `${(d.current / maxValue) * 100}%`,
                    backgroundColor: C.info,
                  }}>
                  <span className="absolute -top-5 text-[9px] font-mono font-semibold" style={{ color: C.info }}>
                    ${d.current.toFixed(0)}
                  </span>
                </div>
                <div className="w-1/3 rounded-t flex flex-col items-center justify-end"
                  style={{
                    height: `${(d.target / maxValue) * 100}%`,
                    backgroundColor: C.borderLight,
                  }} />
              </div>
              <div className="text-center">
                <div className="text-[10px] font-semibold" style={{ color: C.textPrimary }}>{d.phase}</div>
                <div className="text-[9px]" style={{ color: C.textSecondary }}>{d.date}</div>
                <div className="text-[10px] font-mono font-semibold mt-0.5"
                  style={{ color: d.delta < 0 ? C.success : C.error }}>
                  {d.delta < 0 ? "" : "+"}{d.delta.toFixed(1)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-4 mt-2 text-[10px]" style={{ color: C.textSecondary }}>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2" style={{ backgroundColor: C.info }} />
            Current Cost
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2" style={{ backgroundColor: C.borderLight }} />
            Target Material Cost
          </span>
        </div>
      </div>

      {/* Phase comparison table */}
      <table className="w-full text-xs">
        <thead className="border-b" style={{ borderColor: C.border, color: C.textSecondary }}>
          <tr>
            <th className="text-left py-2 px-2 font-medium">Phase</th>
            <th className="text-left py-2 px-2 font-medium">Date</th>
            <th className="text-right py-2 px-2 font-medium">Current Cost</th>
            <th className="text-right py-2 px-2 font-medium">Target</th>
            <th className="text-right py-2 px-2 font-medium">Variance</th>
          </tr>
        </thead>
        <tbody>
          {phaseData.map((d) => (
            <tr key={d.phase} className="border-b" style={{ borderColor: C.borderLight }}>
              <td className="py-2.5 px-2 font-medium" style={{ color: C.textPrimary }}>{d.phase}</td>
              <td className="py-2.5 px-2 font-mono" style={{ color: C.textSecondary }}>{d.date}</td>
              <td className="text-right font-mono py-2.5 px-2" style={{ color: C.textPrimary }}>${d.current.toFixed(2)}</td>
              <td className="text-right font-mono py-2.5 px-2" style={{ color: C.textSecondary }}>${d.target.toFixed(2)}</td>
              <td className="text-right font-mono font-semibold py-2.5 px-2"
                style={{ color: d.delta < 0 ? C.success : C.error }}>
                {d.delta > 0 ? "+" : ""}${d.delta.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- Waterfall Tab ---
function CostWaterfallTab({ isHeroProject }) {
  const waterfall = [
    { label: "Source BOM", value: 800.85, type: "start" },
    { label: "Newly Added", value: 84.20, type: "increase" },
    { label: "Removed", value: -198.09, type: "decrease" },
    { label: "Design Change", value: 17.24, type: "increase" },
    { label: "Unitprice Change", value: 10.00, type: "increase" },
    { label: "Process Change", value: -0.55, type: "decrease" },
    { label: "Commodity Change", value: 0.70, type: "increase" },
    { label: "Other", value: -27.39, type: "decrease" },
    { label: "Target BOM", value: 686.96, type: "end" },
  ];

  let runningTotal = 0;
  const max = 850;

  return (
    <div>
      <div className="mb-4 p-4 rounded-md border" style={{ borderColor: C.border }}>
        <div className="text-xs font-semibold mb-3" style={{ color: C.textPrimary }}>
          Cost Bridge — Source BOM → Target BOM
        </div>
        <div className="flex items-end gap-2 h-72 px-2 relative">
          {waterfall.map((w, i) => {
            let displayValue, displayHeight, top;
            if (w.type === "start" || w.type === "end") {
              displayValue = w.value;
              displayHeight = (w.value / max) * 100;
              top = 100 - displayHeight;
              runningTotal = w.value;
            } else {
              const before = runningTotal;
              runningTotal += w.value;
              displayValue = w.value;
              displayHeight = (Math.abs(w.value) / max) * 100;
              top = w.value > 0 ? (100 - (runningTotal / max) * 100) : (100 - (before / max) * 100);
            }
            const color = w.type === "start" ? C.textSecondary
              : w.type === "end" ? C.primary
              : w.type === "increase" ? C.error
              : C.success;
            return (
              <div key={w.label} className="flex-1 flex flex-col items-center gap-1 h-full relative">
                <div className="w-full relative" style={{ height: "75%" }}>
                  <div className="absolute w-full rounded"
                    style={{
                      top: `${top}%`,
                      height: `${displayHeight}%`,
                      backgroundColor: color,
                      minHeight: 2,
                    }} />
                  <div className="absolute w-full text-center"
                    style={{ top: `${Math.max(0, top - 6)}%` }}>
                    <span className="text-[9px] font-mono font-semibold" style={{ color }}>
                      {w.value > 0 && w.type !== "start" && w.type !== "end" ? "+" : ""}${Math.abs(w.value).toFixed(0)}
                    </span>
                  </div>
                </div>
                <div className="text-[9px] text-center font-medium leading-tight px-0.5"
                  style={{ color: C.textSecondary }}>
                  {w.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-md border" style={{ borderColor: C.border }}>
          <div className="text-[10px] font-medium" style={{ color: C.textSecondary }}>SOURCE BOM</div>
          <div className="text-lg font-bold mt-0.5" style={{ color: C.textPrimary }}>$800.85</div>
        </div>
        <div className="p-3 rounded-md border" style={{ borderColor: C.border, backgroundColor: C.primarySoft }}>
          <div className="text-[10px] font-medium" style={{ color: C.primary }}>TARGET BOM</div>
          <div className="text-lg font-bold mt-0.5" style={{ color: C.primary }}>$686.96</div>
        </div>
        <div className="p-3 rounded-md border" style={{ borderColor: C.border, backgroundColor: C.successLight }}>
          <div className="text-[10px] font-medium" style={{ color: C.success }}>TOTAL SAVINGS</div>
          <div className="text-lg font-bold mt-0.5" style={{ color: C.success }}>-$113.89</div>
          <div className="text-[10px]" style={{ color: C.success }}>-14.2%</div>
        </div>
      </div>
    </div>
  );
}


// === SCREEN 5. APQP KANBAN ===
// PPAP Stage Kanban: Not Started → Requested → In Review → Submitted → Approved
// At scenario step >=7: AMOLED Panel moves Requested → In Review
const PPAP_STAGES = [
  { id: "notStarted", label: "Not Started", color: C.textDisabled, desc: "PPAP not requested" },
  { id: "requested", label: "Requested", color: C.warning, desc: "Sent request to supplier" },
  { id: "review", label: "In Review", color: C.info, desc: "Awaiting supplier response" },
  { id: "submitted", label: "Submitted", color: C.primary, desc: "Pending review" },
  { id: "approved", label: "Approved", color: C.success, desc: "Approved" },
];

// Parts under PPAP tracking (based on Q-BOM)
const PPAP_SUBJECTS = [
  // High Risk — advanced stages
  { id: 10, partId: "6U8-HKJJ-JRPWM", name: "Mainboard 5G", supplier: "Samsung Foundry", supplierShort: "Samsung", risk: "High", ppapLevel: 3, stage: "review", dDay: 5, deliverableDone: 4, deliverableTotal: 6, comments: 8 },
  { id: 3, partId: "EI2-I6DA-003WB", name: "AMOLED Panel 6.7\"", supplier: "BOE Technology", supplierShort: "BOE", risk: "Med", ppapLevel: 3, stage: "requested", dDay: 3, deliverableDone: 0, deliverableTotal: 6, comments: 14, isHero: true },
  // Med Risk
  { id: 6, partId: "1W6-4YP3-X6FU2", name: "Touch Controller IC", supplier: "Synaptics", supplierShort: "Synaptics", risk: "Med", ppapLevel: 2, stage: "review", dDay: 7, deliverableDone: 2, deliverableTotal: 4, comments: 3 },
  { id: 2, partId: "XYR-YZK5-WA1A7", name: "Display Module 6.7\"", supplier: "Samsung Display", supplierShort: "Samsung Disp", risk: "Med", ppapLevel: 3, stage: "submitted", dDay: 2, deliverableDone: 6, deliverableTotal: 6, comments: 5 },
  { id: 9, partId: "QE3-8DHV-XIRG8", name: "Fan Module", supplier: "Foxconn", supplierShort: "Foxconn", risk: "Med", ppapLevel: 2, stage: "submitted", dDay: 4, deliverableDone: 4, deliverableTotal: 4, comments: 2 },
  // Low Risk
  { id: 4, partId: "UEI-Y0ZL-7UU0W", name: "Polarizer Film", supplier: "Nitto Denko", supplierShort: "Nitto", risk: "Low", ppapLevel: 2, stage: "approved", dDay: -3, deliverableDone: 4, deliverableTotal: 4, comments: 1 },
  { id: 5, partId: "5ML-DR7Q-2CV44", name: "OCA Adhesive", supplier: "3M", supplierShort: "3M", risk: "Low", ppapLevel: 2, stage: "approved", dDay: -1, deliverableDone: 4, deliverableTotal: 4, comments: 4 },
  // Not Started
  { id: 11, partId: "K8W-3FH-90PJ", name: "Battery Cell 5000mAh", supplier: "TBD", supplierShort: "TBD", risk: "High", ppapLevel: 3, stage: "notStarted", dDay: null, deliverableDone: 0, deliverableTotal: 6, comments: 0 },
  { id: 12, partId: "P5Q-2RT-78AB", name: "Camera Module 200MP", supplier: "Samsung Electro", supplierShort: "SEM", risk: "High", ppapLevel: 3, stage: "notStarted", dDay: null, deliverableDone: 0, deliverableTotal: 6, comments: 1 },
  // Additional approved
  { id: 13, partId: "M3K-9XL-44CD", name: "Speaker Module", supplier: "AAC Tech", supplierShort: "AAC", risk: "Low", ppapLevel: 1, stage: "approved", dDay: -7, deliverableDone: 3, deliverableTotal: 3, comments: 0 },
];

function ApqpKanban({ scenarioStep, onOpenItem, setView, activeProjectCode }) {
  const project = PROJECTS.find((p) => p.code === activeProjectCode) || PROJECTS[0];

  // After scenario Step 8: AMOLED Panel transitions requested → review
  const subjects = useMemo(() => {
    return PPAP_SUBJECTS.map((s) => {
      if (s.isHero && scenarioStep >= 7) {
        return { ...s, stage: "review", deliverableDone: 2 };
      }
      if (s.isHero && scenarioStep < 5) {
        return { ...s, stage: "notStarted", deliverableDone: 0 };
      }
      return s;
    });
  }, [scenarioStep]);

  // Search & Sort
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("risk"); // risk | dday | name
  // Gantt timeline collapsed by default — saves vertical space
  const [ganttOpen, setGanttOpen] = useState(false);

  // Risk priority for sorting
  const riskOrder = { "High": 0, "Med": 1, "Low": 2 };

  // Search filter
  const filtered = subjects.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q)
      || s.partId.toLowerCase().includes(q)
      || s.supplier.toLowerCase().includes(q);
  });

  // Sort within each stage
  const sortFn = (a, b) => {
    if (sortBy === "risk") return riskOrder[a.risk] - riskOrder[b.risk];
    if (sortBy === "dday") {
      // null dday (NotStarted) goes last
      if (a.dDay === null && b.dDay === null) return 0;
      if (a.dDay === null) return 1;
      if (b.dDay === null) return -1;
      return a.dDay - b.dDay;
    }
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return 0;
  };

  // Group by stage + sort
  const grouped = PPAP_STAGES.reduce((acc, stage) => {
    acc[stage.id] = filtered.filter((s) => s.stage === stage.id).sort(sortFn);
    return acc;
  }, {});

  // KPIs
  const totalApproved = subjects.filter((s) => s.stage === "approved").length;
  const totalSubjects = subjects.length;
  const pending = subjects.filter((s) => s.stage !== "approved" && s.stage !== "notStarted").length;
  const overdue = subjects.filter((s) => s.dDay !== null && s.dDay < 0 && s.stage !== "approved").length;
  const progress = Math.round((totalApproved / totalSubjects) * 100);

  // Risk color
  const riskColor = (risk) => {
    return risk === "High" ? C.error : risk === "Med" ? C.warning : C.success;
  };

  // === Empty state: newly-created project — APQP not started yet ===
  if (project.isNew) {
    return (
      <div className="p-6" style={{ minHeight: "100%" }}>
        <div className="rounded-xl border bg-white py-16 px-8 text-center" style={{ borderColor: C.border }}>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ backgroundColor: C.primarySoft }}>
            <ShieldCheck className="w-8 h-8" style={{ color: C.primary }} />
          </div>
          <div className="text-base font-semibold mb-2" style={{ color: C.textPrimary }}>
            APQP Not Started Yet
          </div>
          <div className="text-sm max-w-md mx-auto mb-6" style={{ color: C.textSecondary }}>
            Advanced Product Quality Planning begins once the BOM is established. PPAP tracking will appear here once parts are added to Q-BOM.
          </div>
          <div className="inline-flex items-center gap-2">
            <button
              onClick={() => setView && setView("bomlist")}
              className="px-4 py-2 rounded-md text-sm font-semibold text-white inline-flex items-center gap-2 hover:opacity-90"
              style={{ backgroundColor: C.primary }}>
              <Upload className="w-4 h-4" />
              Upload E-BOM First
            </button>
            <button
              onClick={() => setView && setView("cockpit")}
              className="px-4 py-2 rounded-md text-sm font-medium border inline-flex items-center gap-2 hover:bg-gray-50"
              style={{ borderColor: C.border, color: C.textSecondary, backgroundColor: "white" }}>
              Back to Overview
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6" style={{ minHeight: "100%" }}>
      {/* APQP Phase Timeline (Gantt) — Collapsible */}
      <div className="rounded-xl border bg-white mb-4" style={{ borderColor: C.border }}>
        {/* Collapsible header — always visible */}
        <button onClick={() => setGanttOpen(!ganttOpen)}
          className="w-full px-4 py-3 flex items-center justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3 text-left">
            <ChevronDown className="w-4 h-4 transition-transform"
              style={{
                color: C.textSecondary,
                transform: ganttOpen ? "rotate(0deg)" : "rotate(-90deg)",
              }} />
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: C.primary }}>
                APQP Phase Timeline
              </div>
              <div className="text-xs mt-0.5" style={{ color: C.textSecondary }}>
                5-Phase schedule · Phase 3-4 in progress (parallel)
              </div>
            </div>
          </div>
          {!ganttOpen && (
            <div className="flex items-center gap-3 text-[10px]" style={{ color: C.textSecondary }}>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: C.success }} />2 Complete</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: C.info }} />2 Active</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: C.textDisabled }} />1 Pending</span>
            </div>
          )}
        </button>

        {/* Gantt body — only when open */}
        {ganttOpen && (
        <div className="px-4 pb-4">
        <div className="flex items-center justify-end mb-3 text-[10px]" style={{ color: C.textSecondary }}>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: C.success }} />Complete</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: C.info }} />Active</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: C.textDisabled }} />Pending</span>
          </div>
        </div>

        {/* Gantt rows */}
        <div className="relative">
          {/* Time axis labels */}
          <div className="flex justify-between text-[9px] font-mono mb-1 pl-44" style={{ color: C.textDisabled }}>
            <span>03/16</span>
            <span>03/30</span>
            <span>04/13</span>
            <span>04/27</span>
            <span>05/08</span>
          </div>

          {/* Today marker line (relative position) */}
          {(() => {
            const phases = [
              { name: "Phase 1: Plan & Define", start: 0, end: 16, status: "complete" },
              { name: "Phase 2: Product Design", start: 10, end: 48, status: "complete" },
              { name: "Phase 3: Process Design", start: 41, end: 58, status: "active" },
              { name: "Phase 4: Validation", start: 51, end: 70, status: "active" },
              { name: "Phase 5: Feedback & Improvement", start: 70, end: 100, status: "pending" },
            ];
            const todayPos = 60; // Current position (% of timeline)

            return (
              <>
                {phases.map((ph, i) => {
                  const color = ph.status === "complete" ? C.success
                    : ph.status === "active" ? C.info
                    : C.textDisabled;
                  const lightColor = ph.status === "complete" ? C.successLight
                    : ph.status === "active" ? C.infoLight
                    : C.bg;
                  return (
                    <div key={i} className="flex items-center mb-1.5" style={{ height: 22 }}>
                      {/* Phase name */}
                      <div className="w-44 pr-3 text-[10px] font-medium" style={{ color: C.textPrimary }}>
                        {ph.name}
                      </div>
                      {/* Bar track */}
                      <div className="flex-1 relative rounded h-5"
                        style={{ backgroundColor: C.bg }}>
                        {/* Phase bar */}
                        <div className="absolute top-0 bottom-0 rounded flex items-center px-2"
                          style={{
                            left: `${ph.start}%`,
                            width: `${ph.end - ph.start}%`,
                            backgroundColor: lightColor,
                            border: `1px solid ${color}`,
                          }}>
                          <div className="text-[9px] font-bold" style={{ color: color }}>
                            {ph.status === "complete" ? "✓" : ph.status === "active" ? "●" : "○"}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {/* Today marker (vertical line on bars only, after the w-44 label area) */}
                <div className="absolute pointer-events-none"
                  style={{
                    left: `calc(11rem + (100% - 11rem) * ${todayPos / 100})`,
                    top: 14,
                    bottom: 0,
                    width: 0,
                  }}>
                  <div className="absolute h-full"
                    style={{
                      width: 2,
                      backgroundColor: C.primary,
                      left: 0,
                    }} />
                  <div className="absolute -top-3 -left-4 text-[9px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap"
                    style={{ backgroundColor: C.primary, color: "white" }}>
                    TODAY
                  </div>
                </div>
              </>
            );
          })()}
        </div>
        </div>
        )}
      </div>

      {/* KPI: Overall progress (large) + inline secondary metrics */}
      <div className="rounded-xl border bg-white p-4 mb-4 flex items-center gap-6" style={{ borderColor: C.border }}>
        {/* Overall Progress — primary KPI */}
        <div className="flex items-center gap-4 shrink-0">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: C.textSecondary }}>
              Overall Progress
            </div>
            <div className="text-3xl font-bold mt-1 tabular-nums" style={{ color: C.primary }}>
              {progress}%
            </div>
          </div>
          <div className="w-40 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: C.bg }}>
            <div className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, backgroundColor: C.primary }} />
          </div>
        </div>

        {/* Divider */}
        <div className="h-12 w-px shrink-0" style={{ backgroundColor: C.border }} />

        {/* Inline metrics — secondary KPIs */}
        <div className="flex items-center gap-6 flex-wrap">
          <div>
            <div className="text-[10px] font-medium uppercase tracking-wide" style={{ color: C.textSecondary }}>
              Subjects
            </div>
            <div className="text-base font-semibold mt-0.5 tabular-nums" style={{ color: C.textPrimary }}>
              {totalSubjects} <span className="text-[11px] font-normal" style={{ color: C.textSecondary }}>total</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] font-medium uppercase tracking-wide" style={{ color: C.textSecondary }}>
              Approved
            </div>
            <div className="text-base font-semibold mt-0.5 tabular-nums" style={{ color: C.success }}>
              {totalApproved} <span className="text-[11px] font-normal" style={{ color: C.textSecondary }}>/ {totalSubjects}</span>
            </div>
          </div>
          {overdue > 0 && (
            <div>
              <div className="text-[10px] font-medium uppercase tracking-wide" style={{ color: C.error }}>
                Overdue
              </div>
              <div className="text-base font-semibold mt-0.5 tabular-nums" style={{ color: C.error }}>
                {overdue} <span className="text-[11px] font-normal">need action</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Kanban Card — Action bar + Board in one container (BOM List pattern) */}
      <div className="rounded-xl border bg-white" style={{ borderColor: C.border }}>
        {/* Action bar: Search + Sort + Primary action */}
        <div className="px-4 py-3 border-b flex items-center gap-3 flex-wrap" style={{ borderColor: C.border }}>
          {/* Search */}
          <div className="flex items-center gap-2 flex-1 max-w-md px-3 py-1.5 rounded-md border focus-within:ring-2 focus-within:ring-offset-1"
            style={{ borderColor: C.border }}>
            <Search className="w-3.5 h-3.5" style={{ color: C.textDisabled }} />
            <input type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search part name or ID..."
              className="flex-1 text-xs outline-none bg-transparent"
              style={{ color: C.textPrimary }} />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")}
                className="p-0.5 rounded hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1">
                <X className="w-3 h-3" style={{ color: C.textDisabled }} />
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-md border text-xs outline-none bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{ borderColor: C.border, color: C.textPrimary }}>
            <option value="risk">Sort: Risk</option>
            <option value="dday">Sort: D-day</option>
            <option value="name">Sort: A-Z</option>
          </select>

          {/* Right side: primary action */}
          <div className="ml-auto">
            <button className="px-3 py-1.5 rounded-md text-xs font-semibold text-white inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              style={{ backgroundColor: C.primary }}>
              <Plus className="w-3.5 h-3.5" />
              Request PPAP
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="p-4 grid gap-3" style={{ gridTemplateColumns: "repeat(5, minmax(0, 1fr))", backgroundColor: C.bg }}>
        {PPAP_STAGES.map((stage) => {
          const cards = grouped[stage.id] || [];
          return (
            <div key={stage.id} className="flex flex-col rounded-xl overflow-hidden border"
              style={{ borderColor: C.borderLight, backgroundColor: C.surfaceTinted, minHeight: 500 }}>
              {/* Column Header */}
              <div className="px-3 py-2.5 flex items-center justify-between border-b"
                style={{ borderColor: C.borderLight }}>
                <div>
                  <div className="text-xs font-semibold flex items-center gap-1.5" style={{ color: C.textPrimary }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                    {stage.label}
                  </div>
                  <div className="text-[9px] mt-0.5" style={{ color: C.textSecondary }}>
                    {stage.desc}
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "white", color: C.textSecondary, border: `1px solid ${C.borderLight}` }}>
                  {cards.length}
                </span>
              </div>

              {/* Cards */}
              <div className="p-2 space-y-2 flex-1">
                {cards.length === 0 ? (
                  <div className="text-center py-8 px-2 rounded-md border-2"
                    style={{ borderColor: C.borderLight, borderStyle: "dashed" }}>
                    <div className="text-[10px]" style={{ color: C.textDisabled }}>
                      Empty
                    </div>
                  </div>
                ) : cards.map((card) => {
                  const isOverdue = card.dDay !== null && card.dDay < 0 && card.stage !== "approved";
                  const isUrgent = card.dDay !== null && card.dDay >= 0 && card.dDay <= 3 && card.stage !== "approved";
                  return (
                    <button key={card.id}
                      onClick={() => onOpenItem && onOpenItem(card.id)}
                      className="w-full text-left rounded-md bg-white border transition-all hover:shadow-md relative focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                      style={{ borderColor: card.isHero ? C.primary : C.borderLight }}>
                      {/* Risk left bar — only colored for High; Med/Low neutral */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l"
                        style={{ backgroundColor: card.risk === "High" ? C.error : C.borderLight }} />

                      <div className="p-2.5 pl-3">
                        {/* Title */}
                        <div className="min-w-0 mb-1.5">
                          <div className="text-xs font-semibold leading-snug" style={{ color: C.textPrimary }}>
                            {card.name}
                          </div>
                          <div className="text-[10px] font-mono mt-0.5" style={{ color: C.textDisabled }}>
                            {card.partId}
                          </div>
                        </div>

                        {/* Badges row — minimal: PPAP Lv (outlined neutral) + Risk text only when High */}
                        <div className="flex items-center gap-1 flex-wrap mb-2">
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded border"
                            style={{ backgroundColor: "white", color: C.textSecondary, borderColor: C.border }}>
                            PPAP Lv{card.ppapLevel}
                          </span>
                          {card.risk === "High" && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                              style={{ backgroundColor: C.errorLight, color: C.error }}>
                              High Risk
                            </span>
                          )}
                          {card.dDay !== null && card.stage !== "approved" && (isOverdue || isUrgent) && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded ml-auto"
                              style={{
                                backgroundColor: isOverdue ? C.error : C.warning,
                                color: "white",
                              }}>
                              {isOverdue ? `${Math.abs(card.dDay)}d overdue` : `D-${card.dDay}`}
                            </span>
                          )}
                          {card.dDay !== null && card.stage !== "approved" && !isOverdue && !isUrgent && (
                            <span className="text-[9px] font-medium ml-auto"
                              style={{ color: C.textDisabled }}>
                              D-{card.dDay}
                            </span>
                          )}
                        </div>

                        {/* Supplier */}
                        <div className="flex items-center gap-1.5 mb-2">
                          <Building2 className="w-3 h-3" style={{ color: C.textSecondary }} />
                          <span className="text-[10px] font-medium" style={{ color: C.textPrimary }}>
                            {card.supplierShort}
                          </span>
                        </div>

                        {/* Progress bar — single neutral primary color */}
                        <div className="mb-1.5">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[9px]" style={{ color: C.textSecondary }}>
                              Deliverables
                            </span>
                            <span className="text-[9px] font-mono font-semibold" style={{ color: C.textPrimary }}>
                              {card.deliverableDone}/{card.deliverableTotal}
                            </span>
                          </div>
                          <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: C.borderLight }}>
                            <div className="h-full rounded-full"
                              style={{
                                width: `${(card.deliverableDone / card.deliverableTotal) * 100}%`,
                                backgroundColor: card.deliverableDone === card.deliverableTotal ? C.success : C.primary,
                              }} />
                          </div>
                        </div>

                        {/* Footer: Comments */}
                        {card.comments > 0 && (
                          <div className="flex items-center gap-1 pt-1.5 mt-1 border-t" style={{ borderColor: C.borderLight }}>
                            <MessageSquare className="w-3 h-3" style={{ color: C.textDisabled }} />
                            <span className="text-[9px]" style={{ color: C.textSecondary }}>
                              {card.comments} comments
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Scenario hint */}
      {scenarioStep >= 7 && scenarioStep < 9 && (
        <div className="mt-4 p-3 rounded-lg flex items-start gap-2"
          style={{ backgroundColor: C.primarySoft, border: `1px solid ${C.primaryLight}` }}>
          <Sparkles className="w-4 h-4 shrink-0 mt-0.5" style={{ color: C.primary }} />
          <div className="text-xs">
            <div className="font-semibold mb-0.5" style={{ color: C.textPrimary }}>
              Scenario in progress — AMOLED Panel PPAP moved to "In Review"
            </div>
            <div style={{ color: C.textSecondary }}>
              BOE Technology submitted Design Records and Process Flow (2/6 deliverables). Q-BOM auto-sync complete.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// === SCENARIO STEPS ===
const SCENARIO_STEPS = [
  { persona: "PM", view: "cockpit", desc: "PM finds a blocked item in the cockpit" },
  { persona: "PM", view: "bom", itemId: 3, desc: "PM opens AMOLED Panel Item 360 → mentions DE" },
  { persona: "DE", view: "bom", itemId: 3, desc: "DE changes spec (6.5→6.7\", 90→120Hz) + AI impact analysis" },
  { persona: "DE", view: "bom", itemId: 3, desc: "DE mentions CM for Should-cost verification" },
  { persona: "CM", view: "bom", itemId: 3, desc: "CM compares Multi-source on Cost tab → delegates RFQ to SM" },
  { persona: "SM", view: "bom", itemId: 3, desc: "SM sends RFQ to 3 pre-qualified suppliers" },
  { persona: "SM", view: "bom", itemId: 3, desc: "RFQ responses received → BOE awarded → CM notified" },
  { persona: "QM", view: "apqp", desc: "QM confirms Q-BOM auto-sync on APQP timeline + starts PPAP" },
  { persona: "PM", view: "cockpit", desc: "Cycle complete → PM Cockpit Gate Readiness 96%" },
];

// === ROOT APP ===
export default function App() {
  const [activePersona, setActivePersona] = useState("PM");
  const [view, setView] = useState("projects");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [scenarioStep, setScenarioStep] = useState(0);
  const [activeProjectCode, setActiveProjectCode] = useState(ACTIVE_PROJECT_CODE);
  const [notifOpen, setNotifOpen] = useState(false);
  const [activeBom, setActiveBom] = useState("E"); // E | S | Q | C
  const [lnbCollapsed, setLnbCollapsed] = useState(false);

  // Chat Panel state (shared at Project Detail level)
  const [chatOpen, setChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState(null); // null = global channel, { itemId, partId, partName } = item

  // Primary action modal state (Phase-aware CTA)
  const [primaryActionOpen, setPrimaryActionOpen] = useState(false);

  const onOpenChat = (context = null) => {
    setChatContext(context);
    setChatOpen(true);
  };
  const onOpenItemChat = (item) => {
    onOpenChat({
      itemId: item.id,
      partId: item.partId,
      partName: item.partName || item.desc,
    });
  };

  // === Persona → default BOM mapping ===
  // Single source of truth. Used:
  //  1. When activePersona changes (auto-switch to their owned BOM)
  //  2. When user enters BOM Collaboration view (apply persona default rather than stale activeBom)
  // Note: PM/DE default to E-BOM (the engineering starting point); SM and CM share C-BOM (cost & supplier).
  const defaultBomForPersona = (p) => ({
    PM: "E", DE: "E",  // Engineering-leaning
    CM: "C", SM: "C",  // Cost & Sourcing share C-BOM
    QM: "Q",           // Quality
  })[p] || "E";

  // Auto-switch default BOM when persona changes
  useEffect(() => {
    setActiveBom(defaultBomForPersona(activePersona));
  }, [activePersona]);

  // Apply persona default whenever user navigates INTO BOM Collaboration view
  // (handles the case where stale activeBom from a previous session would otherwise show)
  useEffect(() => {
    if (view === "bom") {
      setActiveBom(defaultBomForPersona(activePersona));
    }
  }, [view]);

  // Keyboard shortcut: Cmd/Ctrl + B → toggle LNB
  useEffect(() => {
    const onKeyDown = (e) => {
      // Cmd+B (Mac) or Ctrl+B (Win/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        // Ignore when typing in inputs/textareas
        const t = e.target;
        if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
        e.preventDefault();
        setLnbCollapsed((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // When scenario step changes (user-driven), sync persona/view/item + reset to hero project
  // Skip on initial mount so user starts at Project List
  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    const step = SCENARIO_STEPS[scenarioStep];
    if (step) {
      setActivePersona(step.persona);
      setView(step.view);
      setActiveProjectCode(ACTIVE_PROJECT_CODE);
      if (step.itemId !== undefined) setSelectedItemId(step.itemId);
    }
  }, [scenarioStep]);

  const onPrevStep = () => setScenarioStep(Math.max(0, scenarioStep - 1));
  const onNextStep = () => setScenarioStep(Math.min(SCENARIO_STEPS.length - 1, scenarioStep + 1));
  const onResetScenario = () => setScenarioStep(0);

  // Keyboard shortcuts for demo
  // ← / → : prev/next step | Shift+R : reset | Esc : close chat panel
  useEffect(() => {
    const handleKey = (e) => {
      // Don't intercept when typing in inputs
      const tag = e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable) return;

      if (e.key === "ArrowRight" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        onNextStep();
      } else if (e.key === "ArrowLeft" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        onPrevStep();
      } else if (e.key === "R" && e.shiftKey) {
        e.preventDefault();
        onResetScenario();
      } else if (e.key === "Escape") {
        if (chatOpen) {
          e.preventDefault();
          setChatOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [scenarioStep, chatOpen]);

  const onOpenItem = (id) => {
    setSelectedItemId(id);
    setView("bom");
  };

  const activeProject = PROJECTS.find((p) => p.code === activeProjectCode) || PROJECTS[0];

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.bg, fontFamily: "Roboto, system-ui, -apple-system, sans-serif" }}>
      <GNB
        activePersona={activePersona}
        setActivePersona={setActivePersona}
        view={view}
        setView={setView}
        scenarioStep={scenarioStep}
        totalSteps={SCENARIO_STEPS.length}
        currentStep={SCENARIO_STEPS[scenarioStep]}
        onPrevStep={onPrevStep}
        onNextStep={onNextStep}
        onResetScenario={onResetScenario}
        activeProjectCode={activeProjectCode}
        setActiveProjectCode={setActiveProjectCode}
        notifOpen={notifOpen}
        setNotifOpen={setNotifOpen}
      />

      {view === "projects" && (
        <ProjectList
          activeProjectCode={activeProjectCode}
          setActiveProjectCode={setActiveProjectCode}
          setView={setView}
        />
      )}

      {view === "inbox" && (
        <InboxScreen
          activePersona={activePersona}
          setActiveProjectCode={setActiveProjectCode}
          setView={setView}
          scenarioStep={scenarioStep}
        />
      )}

      {/* Project Depth: LNB + Content (with BodyShell wrapper) */}
      {view !== "projects" && view !== "inbox" && activeProject && (() => {
        const isHero = activeProject.code === ACTIVE_PROJECT_CODE;
        const isResolved = isHero && scenarioStep >= 8;
        const readiness = isResolved ? 96 : activeProject.readiness;
        const blocking = isResolved ? 0 : activeProject.blocking;
        const dDay = isResolved ? Math.max(0, activeProject.phaseDays - 5) : activeProject.phaseDays;

        // Dynamic Primary CTA per phase
        const primaryCtaByPhase = {
          "Concept": { label: "Define Exit Criteria", icon: Target },
          "Incubation": { label: "Define Exit Criteria", icon: Target },
          "Plan": { label: "Run Phase 1 Gate", icon: CheckCircle },
          "Design": { label: "Run Cost Review", icon: DollarSign },
          "Develop": { label: "Request Gate Review", icon: ShieldCheck },
          "Verify": { label: "Approve PPAP", icon: FlaskConical },
          "SOP": { label: "Mark Released", icon: CheckCircle },
        };
        // For new projects: surface the most urgent onboarding action instead of phase-default CTA
        let primaryCta;
        if (activeProject.isNew) {
          // Check onboarding state: collaborators count + BOM existence
          const collaboratorsCount = getCollaboratorsForProject(activeProject).length;
          const bomsForNew = getBomListByPhase(activeProject.phase, activeProject.isNew);
          const hasAnyBom = bomsForNew.some(b => b.status === "active");

          if (collaboratorsCount <= 1) {
            primaryCta = { label: "Invite Team", icon: Users };
          } else if (!hasAnyBom) {
            primaryCta = { label: "Upload E-BOM", icon: Upload };
          } else {
            primaryCta = { label: "Define Exit Criteria", icon: Target };
          }
        } else {
          primaryCta = primaryCtaByPhase[activeProject.phase] || primaryCtaByPhase["Develop"];
        }
        primaryCta.onClick = () => setPrimaryActionOpen(true);

        return (
          <div className="flex flex-col"
            style={{ backgroundColor: C.bg, height: "calc(100vh - 84px)" }}>
            {/* Breadcrumb (top, outside cards) - fixed height */}
            <div className="px-6 pt-4 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <button onClick={() => setView("projects")}
                  className="text-[14px] hover:underline transition-colors"
                  style={{ color: C.textSecondary }}>
                  Home
                </button>
                <ChevronRight className="w-3 h-3" style={{ color: "#8B94A5" }} />
                <button onClick={() => setView("projects")}
                  className="text-[14px] hover:underline transition-colors"
                  style={{ color: C.textSecondary }}>
                  Design-to-Source
                </button>
                <ChevronRight className="w-3 h-3" style={{ color: "#8B94A5" }} />
                <span className="text-[14px]" style={{ color: C.textSecondary }}>
                  {activeProject.name}
                </span>
              </div>
            </div>

            {/* Two-column layout: Left (Header + LNB) | Right (Content) */}
            {/* Full-bleed: no horizontal padding; inner corners rounded only */}
            {/* flex-1 fills remaining vertical space; items-stretch matches card heights */}
            <div className="flex-1 min-h-0 pb-6 flex gap-4 items-stretch">
              {/* LEFT: Header + LNB (only right corners rounded) */}
              <div className="bg-white rounded-r-3xl overflow-hidden shrink-0 flex flex-col">
                <ProjectLeftNav
                  view={view}
                  setView={setView}
                  project={activeProject}
                  scenarioStep={scenarioStep}
                  activeBom={activeBom}
                  setActiveBom={setActiveBom}
                  dDay={dDay}
                  readiness={readiness}
                  blocking={blocking}
                  activePersona={activePersona}
                  setActivePersona={setActivePersona}
                  onOpenChat={onOpenChat}
                  primaryCta={primaryCta}
                  isCollapsed={lnbCollapsed}
                  setIsCollapsed={setLnbCollapsed}
                />
              </div>

              {/* RIGHT: Content card (only left corners rounded) */}
              <div className="bg-white rounded-l-3xl flex-1 min-w-0 flex flex-col overflow-hidden">
                <div className="flex-1 min-h-0 overflow-y-auto">
                  {view === "cockpit" && (
                    <ProjectCockpit
                      onOpenItem={onOpenItem}
                      scenarioStep={scenarioStep}
                      activeProjectCode={activeProjectCode}
                      setView={setView}
                      activePersona={activePersona}
                    />
                  )}
                  {view === "info" && (
                    <GeneralInfo
                      activeProjectCode={activeProjectCode}
                      activePersona={activePersona}
                      setActivePersona={setActivePersona}
                    />
                  )}
                  {view === "collaborators" && (
                    <CollaboratorsScreen
                      activeProjectCode={activeProjectCode}
                    />
                  )}
                  {view === "bomlist" && (
                    <BomListScreen
                      activeProjectCode={activeProjectCode}
                      activeBom={activeBom}
                      setActiveBom={setActiveBom}
                      setView={setView}
                    />
                  )}
                  {view === "bom" && (
                    <BomWorkspace
                      selectedItemId={selectedItemId}
                      setSelectedItemId={setSelectedItemId}
                      scenarioStep={scenarioStep}
                      activePersona={activePersona}
                      activeBom={activeBom}
                      setActiveBom={setActiveBom}
                      onOpenItemChat={onOpenItemChat}
                      activeProjectCode={activeProjectCode}
                      setView={setView}
                    />
                  )}
                  {view === "apqp" && (
                    <ApqpKanban
                      scenarioStep={scenarioStep}
                      onOpenItem={onOpenItem}
                      setView={setView}
                      activeProjectCode={activeProjectCode}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Global Slide-in Chat Panel (accessible from anywhere within Project Detail) */}
      {chatOpen && view !== "projects" && view !== "inbox" && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40"
            style={{ backgroundColor: "rgba(16, 24, 40, 0.2)" }}
            onClick={() => setChatOpen(false)} />
          {/* Panel */}
          <div className="fixed top-0 right-0 h-full z-50 shadow-2xl"
            style={{ width: 480, backgroundColor: "white" }}>
            <ChatPanel
              scenarioStep={scenarioStep}
              selectedItemId={selectedItemId}
              setSelectedItemId={setSelectedItemId}
              context={chatContext}
              activeProjectCode={activeProjectCode}
              onClose={() => setChatOpen(false)}
            />
          </div>
        </>
      )}

      {/* Primary Action Modal (Phase-aware CTA) */}
      {primaryActionOpen && view !== "projects" && view !== "inbox" && (
        <PrimaryActionModal
          project={activeProject}
          scenarioStep={scenarioStep}
          onClose={() => setPrimaryActionOpen(false)}
          onConfirm={() => {
            setPrimaryActionOpen(false);
            // Navigate to most relevant view per phase
            const navTarget = {
              "Develop": "apqp",
              "Verify": "apqp",
              "Design": "bom",
              "Plan": "cockpit",
              "Concept": "cockpit",
              "Incubation": "cockpit",
              "SOP": "cockpit",
            }[activeProject.phase] || "cockpit";
            setView(navTarget);
          }}
        />
      )}
    </div>
  );
}
