import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Bell, Search, User, Settings, ChevronDown, ChevronRight, ChevronLeft,
  Package, GitBranch, DollarSign, Send, ShieldCheck, Building2, Users, UsersRound,
  AlertTriangle, AlertCircle, CheckCircle, XCircle, Clock, Filter, Check,
  Plus, MoreHorizontal, MessageSquare, Sparkles, TrendingUp, TrendingDown,
  ArrowRight, Hash, Paperclip, AtSign, Smile, Layers, FileText, Zap,
  Eye, Edit3, Activity, Box, Target, BarChart3, ShoppingCart, FlaskConical,
  Network, ListChecks, ChevronsRight, ChevronsLeft, X, Info, Play, RefreshCw, Inbox, PlusCircle, AlignLeft, Circle,
  CornerDownRight, Columns3, Upload, Link2,
  LayoutDashboard, Boxes, GitMerge, BadgeCheck, PanelLeftClose, PanelLeftOpen,
  Smartphone, Watch, Headphones, Tv, Tablet, Speaker, Refrigerator, Wind, BatteryCharging,
  History, GitCompareArrows, Archive, Lock, MoreVertical, Trash2, Mail, Phone, MapPin, Star, Download, Calendar, Bookmark, RotateCcw
} from "lucide-react";

/* ============================================================
   CAIDENTIA 2.0 — Unified BOM Collaboration Prototype
   End-to-End scenario across PM → DE → CM → SM → QM
   Single App.jsx, Tailwind + lucide-react
   Build: 2026-05-08 r12 (Inbox + Notification Dropdown)
   ============================================================ */

// === DESIGN TOKENS (per 06_design-system.md) ===
// === Color tokens — aligned to Caidentia 2.0 theme (caidentia-theme.js) ===
// Palette main/dark values mirror the MUI theme exactly. The *Light/*Soft tints
// are background surfaces (kept light for legibility), re-hued to match each new main.
// Container scale (containerSecondary..Quinary) added per the new design system.
const C = {
  primary: "#532df6",        // theme.palette.primary.main
  primaryDark: "#4827d5",    // primary.dark
  primaryLight: "#ece9fd",   // tint of primary (background use)
  primarySoft: "#f4f5ff",    // background.containerQuinary (primary-toned surface)
  secondary: "#4b5565",      // secondary.main
  secondaryDark: "#364152",  // secondary.dark
  secondaryLight: "#eceef1", // tint of secondary
  error: "#d92d20",          // error.main
  errorLight: "#fef3f2",     // error tint (surface)
  warning: "#dc6803",        // warning.main
  warningLight: "#fffaeb",   // warning tint (surface)
  info: "#1570ef",           // info.main
  infoLight: "#eff8ff",      // info tint (surface)
  success: "#039855",        // success.main
  successLight: "#ecfdf3",   // success tint (surface)
  bg: "#e8ecf8",             // background.surfaceUnderlay
  surface: "#ffffff",        // background.paper
  surface2: "#fcfcfd",       // background.containerSecondary
  surfaceTinted: "#f6f8f9",  // background.containerTertiary
  border: "#e4e7ec",         // visible divider (between containerQuaternary and divider 0.12)
  borderLight: "#f2f4f7",    // background.containerQuaternary (subtle divider)
  textPrimary: "#101828",    // text.primary
  textSecondary: "#475467",  // text.secondary
  textDisabled: "#8b94a5",   // text.disabled
};

// === MOCK DATA: scenario-driven ===
const PERSONAS = {
  PM: { name: "Paige Kim", role: "Project Manager", initial: "PK", color: "#532df6" },
  DE: { name: "Dean Park", role: "Design Engineer", initial: "DP", color: "#1570ef" },
  CM: { name: "Cory Chen", role: "Cost Manager", initial: "CC", color: "#dc6803" },
  SM: { name: "Sam Lee", role: "Sourcing Manager", initial: "SL", color: "#039855" },
  QM: { name: "Quinn R.", role: "Quality Manager", initial: "QR", color: "#7c3aed" },
};

const PROJECT = {
  name: "NPI Project_Aurora Smartphone #2",
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
  { code: "BPM260500001", name: "NPI Project_Aurora Smartphone S27 Lite", product: "Smartphone S27L",
    type: "Major Enhancement", phase: "Incubation", phaseDays: 180, readiness: 4, blocking: 0,
    pm: "PM", ownerName: "Paige Kim", collaborators: 1,
    suppliers: 0, items: 0, tmcGap: 0, lastUpdate: "Today", priority: "med", isNew: true },
  { code: "BPM260400354", name: "NPI Project_Aurora Smartphone #2", product: "Smartphone A1",
    type: "New To The Company", phase: "Develop", phaseDays: 23, readiness: 65, blocking: 6,
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
  { code: "BPM260400349", name: "NPI Project_Aurora Smartphone #1", product: "Smartphone S1",
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
  { id: 2, name: "Spec_Sheet_DDIC_4lane_120Hz.xlsx", type: "xlsx", size: "284 KB",
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
  // === Triton Semiconductor === (Selected second-source DDIC vendor — full team engaged)
  { id: "ext-1", name: "Chen Wei", company: "Triton Semiconductor", role: "Account Manager",
    initial: "CW", color: "#1570ef",
    email: "chen.wei@tritonsemi.com", phone: "+886 3 568 1200",
    contribution: "Display Driver IC · Supplier (Selected)", active: "Today 14:22",
    bomScope: "C" },
  { id: "ext-1b", name: "Li Mei", company: "Triton Semiconductor", role: "Sales Engineer",
    initial: "LM", color: "#1570ef",
    email: "li.mei@tritonsemi.com", phone: "+886 3 568 1245",
    contribution: "Display Driver IC · Technical specs", active: "Today 11:08",
    bomScope: "C" },
  { id: "ext-1c", name: "Zhang Hao", company: "Triton Semiconductor", role: "Quality Lead",
    initial: "ZH", color: "#1570ef",
    email: "zhang.hao@tritonsemi.com", phone: "+886 3 568 1290",
    contribution: "Display Driver IC · PPAP submissions", active: "Yesterday",
    bomScope: "Q" },

  // === Apex Silicon === (Incumbent · EOL / last-time-buy — primary contact only)
  { id: "ext-2", name: "Hideki Tanaka", company: "Apex Silicon", role: "Senior Sales",
    initial: "HT", color: "#532df6",
    email: "h.tanaka@apexsilicon.com", phone: "+1 408 555 2000",
    contribution: "Display Driver IC · Incumbent (EOL)", active: "Yesterday",
    bomScope: "C" },
  { id: "ext-2b", name: "Soo-ji Lee", company: "Apex Silicon", role: "Account Director",
    initial: "SL", color: "#532df6",
    email: "sj.lee@apexsilicon.com", phone: "+1 408 555 2055",
    contribution: "Display Driver IC · Last-time-buy lead", active: "3 days ago",
    bomScope: "C" },

  // === Ironwood Semi === (Qualified alternate — primary contact only)
  { id: "ext-3", name: "Min-jun Park", company: "Ironwood Semi", role: "Key Account",
    initial: "MP", color: "#039855",
    email: "minjun.p@ironwoodsemi.com", phone: "+49 89 5500 1114",
    contribution: "Display Driver IC · RFQ (qualified alt)", active: "Yesterday",
    bomScope: "C" },
  { id: "ext-3b", name: "Ji-won Kim", company: "Ironwood Semi", role: "Field App Engineer",
    initial: "JK", color: "#039855",
    email: "jw.kim@ironwoodsemi.com", phone: "+49 89 5500 1155",
    contribution: "Display Driver IC · Sample evaluation", active: "Last week",
    bomScope: "C" },

  // === Polaris Films === (Selected Polarizer supplier — full team)
  { id: "ext-4", name: "Sarah Williams", company: "Polaris Films", role: "Sales Engineer",
    initial: "SW", color: "#dc6803",
    email: "s.williams@nitto.com", phone: "+1 415 778 2700",
    contribution: "Polarizer Film · Supplier (Primary)", active: "2 days ago",
    bomScope: "C" },
  { id: "ext-4b", name: "Yuki Sato", company: "Polaris Films", role: "Product Manager",
    initial: "YS", color: "#dc6803",
    email: "y.sato@nitto.com", phone: "+81 6 7632 2101",
    contribution: "Polarizer Film · Spec coordination", active: "2 days ago",
    bomScope: "C" },
  { id: "ext-4c", name: "Tom Becker", company: "Polaris Films", role: "Quality Engineer",
    initial: "TB", color: "#dc6803",
    email: "t.becker@nitto.com", phone: "+1 415 778 2715",
    contribution: "Polarizer Film · PPAP", active: "Last week",
    bomScope: "Q" },

  // === Meridian Korea === (OCA Adhesive — primary + technical)
  { id: "ext-5", name: "Robert Liu", company: "Meridian Korea", role: "Technical Sales",
    initial: "RL", color: "#1570ef",
    email: "r.liu@3m.com", phone: "+82 2 3771 4114",
    contribution: "OCA Adhesive · Supplier", active: "Last week",
    bomScope: "C" },
  { id: "ext-5b", name: "Hye-jin Choi", company: "Meridian Korea", role: "Application Specialist",
    initial: "HC", color: "#1570ef",
    email: "hj.choi@3m.com", phone: "+82 2 3771 4155",
    contribution: "OCA Adhesive · Lamination support", active: "2 days ago",
    bomScope: "C" },
];

// === Supplier company profiles ===
// Used by SupplierProfilePopover when hovering a company name in External Collaborators.
// Mock procurement history (last 7 quarters) + RFx history.
const SUPPLIER_DETAILS = {
  "Lumina Display": {
    name: "Lumina Display",
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
  "Aurora Display": {
    name: "Aurora Display",
    location: "Asan, KR",
    badge: "Preferred Supplier",
    tags: ["Display", "AMOLED", "Tier 1 Supplier"],
    summary: "Sister company under Aurora Group. Premium AMOLED supplier. Lost recent RFQ on price competitiveness but remains preferred for high-tier products.",
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
  "Vega Optronics": {
    name: "Vega Optronics",
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
  "Polaris Films": {
    name: "Polaris Films",
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
  "Meridian Korea": {
    name: "Meridian Korea",
    location: "Seoul, KR",
    badge: "Approved Supplier",
    tags: ["Adhesive", "OCA", "Specialty Materials"],
    summary: "Subsidiary of Meridian global. Reliable OCA adhesive supplier with strong application engineering support.",
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
  // E-BOM current version = v1.8. History: v1.8 → v1.7 → v1.5 → v1.0 → v0.5
  E: [
    { id: "e1", date: "Today, May 18", time: "5:20 PM", title: "Display Driver IC: 90Hz → 120Hz requirement",
      kind: "primary", iconType: "zap", author: "DE", phase: "Develop", version: "v1.8", detail: "Display Driver IC requirement updated by Dean Park. AI impact analysis triggered." },
    { id: "e2", date: "Today, May 18", time: "10:24 AM", title: "PM raised blocker: Display Driver IC",
      kind: "error", iconType: "alert", author: "PM", phase: "Develop", version: "v1.8", detail: "Cost & PPAP blocked on new spec." },
    { id: "e3", date: "May 16", time: "3:42 PM", title: "Review approved by PM",
      kind: "success", iconType: "check", author: "PM", phase: "Develop", version: "v1.8", detail: "v1.8 approved for downstream BOM sync." },
    { id: "e4", date: "May 16", time: "11:08 AM", title: "Submitted for review",
      kind: "neutral", iconType: "send", author: "DE", phase: "Develop", version: "v1.8", detail: null },
    { id: "e5", date: "May 14", time: "4:15 PM", title: "Internal Review Completed",
      kind: "success", iconType: "check", author: "DE", phase: "Develop", version: "v1.8", detail: null },
    { id: "e6", date: "May 14", time: "9:00 AM", title: "CAD update synced",
      kind: "neutral", iconType: "upload", author: "DE", phase: "Develop", version: "v1.8", detail: "80 parts imported from PLM." },
    { id: "e7", date: "May 10", time: "2:30 PM", title: "v1.8 created",
      kind: "neutral", iconType: "version", author: "DE", phase: "Develop", version: "v1.8", isVersionMark: true, detail: "Branched from v1.7. Display Driver IC second source added, Display module revised (8 changes)." },
    { id: "e8", date: "May 5", time: "10:15 AM", title: "v1.7 created",
      kind: "neutral", iconType: "version", author: "DE", phase: "Define", version: "v1.7", isVersionMark: true, detail: "Branched from v1.5. Camera & battery modules finalized (12 changes)." },
    { id: "e9", date: "Apr 20", time: "11:00 AM", title: "v1.5 created",
      kind: "neutral", iconType: "version", author: "DE", phase: "Plan", version: "v1.5", isVersionMark: true, detail: "Branched from v1.0. Initial component selection (20 changes)." },
    { id: "e10", date: "Apr 10", time: "9:30 AM", title: "v1.0 created",
      kind: "neutral", iconType: "version", author: "DE", phase: "Concept", version: "v1.0", isVersionMark: true, detail: "Branched from v0.5. Mainboard & SoC baseline set." },
    { id: "e11", date: "Apr 2", time: "3:00 PM", title: "v0.5 created",
      kind: "neutral", iconType: "version", author: "PM", phase: "Concept", version: "v0.5", isVersionMark: true, detail: "Cloned from Smartphone A1 Template." },
  ],
  // Q-BOM current version = v1.5. History: v1.5 → v1.4 → v1.3 → v1.0
  Q: [
    { id: "q1", date: "Today, May 18", time: "2:22 PM", title: "PPAP Lv3 assigned: Display Driver IC → Triton Semiconductor",
      kind: "primary", iconType: "shield", author: "QM", phase: "Develop", version: "v1.5", detail: "Risk Assessment auto-completed. Medium risk." },
    { id: "q2", date: "Today, May 18", time: "8:45 AM", title: "Q-BOM auto-sync confirmed",
      kind: "success", iconType: "check", author: "QM", phase: "Develop", version: "v1.5", detail: "Synced from C-BOM v2.0." },
    { id: "q3", date: "May 17", time: "1:15 PM", title: "PFMEA draft updated",
      kind: "neutral", iconType: "upload", author: "QM", phase: "Develop", version: "v1.5", detail: "Display Module bonding process — Critical entry added." },
    { id: "q4", date: "May 16", time: "9:40 AM", title: "v1.5 created",
      kind: "neutral", iconType: "version", author: "QM", phase: "Develop", version: "v1.5", isVersionMark: true, detail: "Synced from E-BOM v1.8. PPAP plan updated for Display Driver IC." },
    { id: "q5", date: "May 15", time: "11:30 AM", title: "PPAP Lv2 approved: OCA Adhesive",
      kind: "success", iconType: "check", author: "QM", phase: "Develop", version: "v1.4", detail: "Meridian OCA — UV 1000h test passed." },
    { id: "q6", date: "May 13", time: "10:00 AM", title: "v1.4 created",
      kind: "neutral", iconType: "version", author: "QM", phase: "Develop", version: "v1.4", isVersionMark: true, detail: "PFMEA expanded to 10 critical parts." },
    { id: "q7", date: "May 12", time: "10:00 AM", title: "v1.3 created",
      kind: "neutral", iconType: "version", author: "QM", phase: "Develop", version: "v1.3", isVersionMark: true, detail: "Synced from E-BOM v1.7. PPAP plan initialized for 10 parts." },
    { id: "q8", date: "May 6", time: "3:20 PM", title: "v1.0 created",
      kind: "neutral", iconType: "version", author: "QM", phase: "Define", version: "v1.0", isVersionMark: true, detail: "Quality plan initialized from E-BOM v1.5." },
  ],
  // C-BOM current version = v2.0. History: v2.0 → v1.5 → v1.0
  C: [
    // Source & Cost combined timeline — events from both supplier selection (SM) and cost analysis (CM)
    { id: "c1", date: "Today, May 18", time: "2:35 PM", title: "Triton Semiconductor quote applied: $11.80",
      kind: "success", iconType: "check", author: "CM", phase: "Develop", version: "v2.0", detail: "Best of 3 quotes. Δ vs Should-cost: -$2.90." },
    { id: "c2", date: "Today, May 18", time: "2:15 PM", title: "RFQ sent: Display Driver IC",
      kind: "primary", iconType: "send", author: "SM", phase: "Develop", version: "v2.0", detail: "3 suppliers: Aurora Display, Lumina, Vega Optronics." },
    { id: "c3", date: "Today, May 18", time: "11:08 AM", title: "Should-cost analysis: Display Driver IC",
      kind: "primary", iconType: "zap", author: "CM", phase: "Develop", version: "v2.0", detail: "$11.80 confirmed. Market: $12.30. Supplier selection requested." },
    { id: "c4", date: "May 17", time: "5:42 PM", title: "Cost target locked: $38.00",
      kind: "primary", iconType: "shield", author: "CM", phase: "Develop", version: "v2.0", detail: "Approved by PM." },
    { id: "c5", date: "May 17", time: "4:30 PM", title: "Pre-qualification updated",
      kind: "success", iconType: "check", author: "SM", phase: "Develop", version: "v2.0", detail: "Lumina Display added to qualified vendor list." },
    { id: "c6", date: "May 15", time: "10:22 AM", title: "Conflict resolved: Polarizer dual-source",
      kind: "success", iconType: "check", author: "SM", phase: "Develop", version: "v2.0", detail: "Polaris Films (primary) + Vega Chem (secondary) approved." },
    { id: "c7", date: "May 15", time: "9:30 AM", title: "Polarizer savings: $0.05/unit",
      kind: "success", iconType: "check", author: "CM", phase: "Develop", version: "v2.0", detail: "Polaris Films price reduced $1.80 → $1.75." },
    { id: "c8", date: "May 13", time: "3:00 PM", title: "Conflict detected: Polarizer single-source",
      kind: "error", iconType: "alert", author: "QM", phase: "Develop", version: "v2.0", detail: "QM flagged: single-source risk on critical part." },
    { id: "c9", date: "May 10", time: "11:15 AM", title: "v2.0 created",
      kind: "neutral", iconType: "version", author: "CM", phase: "Develop", version: "v2.0", isVersionMark: true, detail: "Synced from E-BOM v1.8. Cost rollup $42.30. 60 of 80 parts have suppliers assigned." },
    { id: "c10", date: "May 2", time: "9:00 AM", title: "v1.5 created",
      kind: "neutral", iconType: "version", author: "CM", phase: "Define", version: "v1.5", isVersionMark: true, detail: "Synced from E-BOM v1.7. Initial cost rollup $12.00." },
    { id: "c11", date: "Apr 22", time: "10:30 AM", title: "v1.0 created",
      kind: "neutral", iconType: "version", author: "CM", phase: "Plan", version: "v1.0", isVersionMark: true, detail: "Cost structure initialized from E-BOM v1.5." },
  ],
};

// === BOM Version Compare Data ===
// Mock diff between current and previous version
// Version diffs reference REAL BOM_TREE part numbers so changed rows line up inside the full BOM.
const BOM_VERSION_DIFFS = {
  // E-BOM — engineering spec changes (size / refresh / material / qty)
  E: { current: "v1.8 (Draft)", previous: "v1.7",
    modified: [
      { partId: "UEI-Y0ZL-7UU0W", name: "Polarizer Film", change: "Size: 6.5in → 6.7in" },
      { partId: "TP4-6GRT-89XQM", name: "Thermal Pad", change: "Qty: 1 → 2 · Coverage: SoC → SoC+PMIC" },
      { partId: "MM2-5JNE-DR4VA", name: "DRAM (LPDDR5X)", change: "Capacity: 8GB → 12GB" },
    ],
    replaced: [
      { partId: "EI2-I6DA-003WB", name: "Display Driver IC", fromPartId: "DDIC-AX-7421", fromName: "Display Driver IC AX-7421 (Apex · EOL)", change: "Supplier: Apex Silicon → Triton Semiconductor · Driver: AX-7421 (90Hz, EOL) → TX-6620 (120Hz) · Interface: 4-lane MIPI (retained) · Unit cost: $12.00 → $11.80 · Lead time: 14wks → 10wks", reason: "Triton Semiconductor proposal #1048 — qualified 120Hz second source" },
      { partId: "GL2-7HKR-WA1Z3", name: "Cover Glass", fromPartId: "GLV-6P5-CORN-V1", fromName: "Cover Glass (Gorilla Victus)", change: "Material: Gorilla Victus → Victus 2 · Size: 6.5in → 6.7in", reason: "Upgraded glass for drop performance (sourced via module)" },
      { partId: "1W6-4YP3-X6FU2", name: "Touch Controller IC", fromPartId: "TC90-TAC-S3920", fromName: "Touch IC (Triton Semiconductor S3920)", change: "Touch-sync: 90Hz → 120Hz · I/F: I2C → I2C+SPI", reason: "120Hz touch-report-rate update" },
      { partId: "5ML-DR7Q-2CV44", name: "OCA Film", fromPartId: "OCA-Meridian-8212", fromName: "OCA Film (Meridian 8212)", change: "Material: Standard OCA → Alt-B low-haze · Peel: 600gf/in → 720gf/in", reason: "Alt-B low-haze grade — cost + yield" },
    ],
    added: [{ partId: "VC1-4JTH-CHM7P", name: "Vapor Chamber", reason: "Added for 120Hz thermal headroom" }],
    removed: [{ partId: "HSX-OLD-GRAPH01", name: "Heat Spreader (Graphite)", reason: "Replaced by vapor chamber" }],
  },
  // C-BOM — cost / supplier / sourcing changes
  C: { current: "v2.0", previous: "v1.5",
    modified: [
      { partId: "AP1-3KW9-QC8GN", name: "AP (Snapdragon 8 Gen 3)", change: "Unit cost: $142.00 → $138.50 · Supplier: Disti → Direct" },
      { partId: "MM2-5JNE-DR4VA", name: "DRAM (LPDDR5X)", change: "Unit cost: $34.00 → $41.20 · 8GB → 12GB" },
      { partId: "BC1-2FYW-CELL01", name: "Battery Cell", change: "Unit cost: $8.40 → $7.95 · Source: Single → Dual" },
      { partId: "GL2-7HKR-WA1Z3", name: "Cover Glass", change: "Quoted: $4.20 → $4.05 · Supplier: Single → Dual" },
    ],
    added: [{ partId: "VC1-4JTH-CHM7P", name: "Vapor Chamber", reason: "New part — RFQ open for costing" }],
    removed: [],
  },
  // Q-BOM — quality / PPAP / risk changes
  Q: { current: "v1.5", previous: "v1.4",
    modified: [
      { partId: "5ML-DR7Q-2CV44", name: "OCA Film", change: "PPAP: Lv2 → Approved" },
      { partId: "1W6-4YP3-X6FU2", name: "Touch Controller IC", change: "PPAP: — → Lv3 · Risk: Low → Medium" },
      { partId: "GL2-7HKR-WA1Z3", name: "Cover Glass", change: "Defect rate: 0.32% → 0.18%" },
    ],
    added: [{ partId: "VC1-4JTH-CHM7P", name: "Vapor Chamber", reason: "New part — PPAP Lv3 auto-assigned (medium risk)" }],
    removed: [],
  },
};

// === [DEPRECATED] BOM Collaboration Log ===
// 2026.05 Collaboration Log section removed from BOM List screen.
// Change history is now surfaced through Chat (decision-pinned messages)
// and per-BOM version tracking in BOM Collaboration. Data retained for possible future restoration.
const BOM_COLLAB_LOG = [
  { id: 1, ts: "Today 14:22", bomId: "Q", action: "PPAP Requested",
    actor: "QM", detail: "PPAP Lv3 request sent to Lumina Display", version: "v1.5" },
  { id: 2, ts: "Today 11:30", bomId: "C", action: "Supplier Awarded",
    actor: "SM", detail: "Triton Semiconductor awarded ($11.80/EA)", version: "v2.0" },
  { id: 3, ts: "Today 09:15", bomId: "C", action: "Should-cost Updated",
    actor: "CM", detail: "Display Driver IC: $11.80 (AI recommended)", version: "v2.0" },
  { id: 4, ts: "Yesterday 16:42", bomId: "C", action: "Sync Notification",
    actor: "SM", detail: "Display Driver IC second source added in E-BOM → C-BOM needs supplier selection", version: "v2.0" },
  { id: 5, ts: "Yesterday 14:30", bomId: "E", action: "Part Added",
    actor: "DE", detail: "Added Display Driver IC AX-7421 (4-lane MIPI, 120Hz)", version: "v1.8" },
  { id: 6, ts: "Yesterday 11:15", bomId: "E", action: "Spec Updated",
    actor: "DE", detail: "Driver IC 90Hz → 120Hz (4-lane MIPI)", version: "v1.8" },
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
    status: { D: "warn", C: "warn", Q: "warn" }, comments: 8, children: [3, 4, 5, 6, 7, 8],
    supplier: "Aurora Display", ppap: "Lv3", category: "Display", risk: "Med" },
  { id: 3, lvl: 3, partId: "EI2-I6DA-003WB", code: "AX-7421", desc: "IC,DISPLAY DRIVER,DDIC,MIPI-4LANE,120HZ", type: "CMDTY",
    status: { D: "warn", C: "block", Q: "block" }, comments: 14, isHero: true,
    diff: "replaced", children: [],
    supplier: "Apex Silicon", ppap: "Lv3", category: "Display IC", risk: "Med" },
  { id: 4, lvl: 3, partId: "UEI-Y0ZL-7UU0W", desc: "FILM,POLARIZER,FRONT,6.7IN", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Polaris Films", ppap: "Lv2", category: "Display", risk: "Low" },
  { id: 5, lvl: 3, partId: "5ML-DR7Q-2CV44", desc: "FILM,OCA,OPTICAL CLEAR ADHESIVE,6.7IN", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Meridian", ppap: "Lv2", category: "Display", risk: "Low" },
  { id: 6, lvl: 3, partId: "1W6-4YP3-X6FU2", desc: "IC,TOUCH CONTROLLER,I2C", type: "CMDTY",
    status: { D: "ok", C: "warn", Q: "ok" }, comments: 3, children: [],
    supplier: "Triton Semiconductor", ppap: "Lv2", category: "Display", risk: "Low" },
  { id: 7, lvl: 3, partId: "GL2-7HKR-WA1Z3", desc: "GLASS,COVER,GORILLA VICTUS 2,6.7IN", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 2, children: [],
    supplier: "Stratos Glass", ppap: "Lv2", category: "Display", risk: "Low" },
  { id: 8, lvl: 3, partId: "BR3-9PLK-DR4N5", desc: "BRACKET,DISPLAY,ALUMINUM,6.7IN", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Forge Metals", ppap: "Lv1", category: "Display", risk: "Low" },

  // ============================================================
  // Level 2 — Fan / Cooling branch (id 9-12)
  // ============================================================
  { id: 9, lvl: 2, partId: "QE3-8DHV-XIRG8", desc: "ASSY,FAN MODULE,SMARTPHONE COOLING", type: "ASSM",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [11, 12],
    supplier: "Atlas Manufacturing", ppap: "Lv2", category: "Mechanical", risk: "Low" },
  { id: 11, lvl: 3, partId: "VC1-4JTH-CHM7P", desc: "VAPOR CHAMBER,COPPER,0.4MM", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Ferro Electric", ppap: "Lv2", category: "Mechanical", risk: "Low" },
  { id: 12, lvl: 3, partId: "TP4-6GRT-89XQM", desc: "THERMAL PAD,GRAPHITE,COOLING", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Cohere Adhesives", ppap: "Lv1", category: "Mechanical", risk: "Low" },

  // ============================================================
  // Level 2 — Mainboard PCB branch (id 20-31)
  // ============================================================
  { id: 20, lvl: 2, partId: "MB1-7TY5-BRDLA", desc: "ASSY,MAINBOARD,5G,SM-XXXX", type: "ASSM",
    status: { D: "ok", C: "ok", Q: "warn" }, comments: 5, children: [10, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31],
    supplier: "Aurora Electro-Mechanics", ppap: "Lv3", category: "PCB", risk: "High" },
  { id: 10, lvl: 3, partId: "6U8-HKJJ-JRPWM", desc: "PCB,MAINBOARD,10-LAYER,HDI", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "warn" }, comments: 3, children: [],
    supplier: "Aurora Electro-Mechanics", ppap: "Lv3", category: "PCB", risk: "High" },
  { id: 21, lvl: 3, partId: "AP1-3KW9-QC8GN", desc: "IC,AP,SNAPDRAGON 8 GEN 3", type: "CMDTY",
    status: { D: "ok", C: "warn", Q: "ok" }, comments: 4, children: [],
    supplier: "Apex Silicon", ppap: "Lv3", category: "PCB", risk: "High" },
  { id: 22, lvl: 3, partId: "MM2-5JNE-DR4VA", desc: "IC,DRAM,LPDDR5X,12GB", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 2, children: [],
    supplier: "Aurora Semi", ppap: "Lv3", category: "PCB", risk: "Med" },
  { id: 23, lvl: 3, partId: "ST3-9HFR-STR91", desc: "IC,STORAGE,UFS 4.0,256GB", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Aurora Semi", ppap: "Lv3", category: "PCB", risk: "Med" },
  { id: 24, lvl: 3, partId: "PM4-2RWN-PMU3K", desc: "IC,PMIC,POWER MANAGEMENT", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Apex Silicon", ppap: "Lv2", category: "PCB", risk: "Low" },
  { id: 25, lvl: 3, partId: "MD5-8KQT-MDM5G", desc: "IC,MODEM,5G SUB-6 / mmWAVE", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 2, children: [],
    supplier: "Apex Silicon", ppap: "Lv3", category: "PCB", risk: "Med" },
  { id: 26, lvl: 3, partId: "WF6-4LMS-WFI6E", desc: "IC,WIFI 7 + BT 5.4 COMBO", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Beacon Semi", ppap: "Lv2", category: "PCB", risk: "Low" },
  { id: 27, lvl: 3, partId: "AC7-6PHW-AUDIO", desc: "IC,AUDIO CODEC,32-BIT HIFI", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Sonus Audio", ppap: "Lv2", category: "PCB", risk: "Low" },
  { id: 28, lvl: 3, partId: "NF8-3VBA-NFCCH", desc: "IC,NFC CONTROLLER + eSE", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Lowland Semi", ppap: "Lv2", category: "PCB", risk: "Low" },
  { id: 29, lvl: 3, partId: "CR9-1QEB-CRYO0", desc: "CRYSTAL,OSCILLATOR,38.4MHZ", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Mira Components", ppap: "Lv1", category: "PCB", risk: "Low" },
  { id: 31, lvl: 3, partId: "PS1-7ZAU-PASSV", desc: "PASSIVES,SET,CAPACITOR+RESISTOR+INDUCTOR", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Mira Components", ppap: "Lv1", category: "PCB", risk: "Low" },

  // ============================================================
  // Level 2 — Battery branch (id 30-37)
  // ============================================================
  { id: 30, lvl: 2, partId: "BT1-9HGR-BATAS", desc: "ASSY,BATTERY PACK,5000mAh", type: "ASSM",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 4, children: [32, 33, 34, 35, 36, 37],
    supplier: "Aurora Energy", ppap: "Lv3", category: "Battery", risk: "High" },
  { id: 32, lvl: 3, partId: "BC1-2FYW-CELL01", desc: "BATTERY CELL,LI-POLYMER,5000mAh", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 3, children: [],
    supplier: "Aurora Energy", ppap: "Lv3", category: "Battery", risk: "High" },
  { id: 33, lvl: 3, partId: "BP2-8KEN-PROT08", desc: "PCB,BATTERY PROTECTION CIRCUIT", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Ion Semiconductor", ppap: "Lv2", category: "Battery", risk: "Med" },
  { id: 34, lvl: 3, partId: "BF3-5NLT-FUSE12", desc: "FUSE,THERMAL,BATTERY SAFETY", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Borealis Components", ppap: "Lv2", category: "Battery", risk: "Med" },
  { id: 35, lvl: 3, partId: "BC4-1OZQ-CONN34", desc: "CONNECTOR,BATTERY,SPRING CONTACT", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Hikari Connectors", ppap: "Lv1", category: "Battery", risk: "Low" },
  { id: 36, lvl: 3, partId: "BA5-7AVU-ADH567", desc: "ADHESIVE,BATTERY MOUNTING,DOUBLE-SIDED", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Meridian", ppap: "Lv1", category: "Battery", risk: "Low" },
  { id: 37, lvl: 3, partId: "BL6-4XYP-LBL890", desc: "LABEL,BATTERY,REGULATORY", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Vellum Labels", ppap: "Lv1", category: "Battery", risk: "Low" },

  // ============================================================
  // Level 2 — Camera branch (id 40-49)
  // ============================================================
  { id: 40, lvl: 2, partId: "CM1-3EHF-CAMAS", desc: "ASSY,CAMERA MODULE,REAR TRIPLE", type: "ASSM",
    status: { D: "ok", C: "warn", Q: "ok" }, comments: 6, children: [41, 42, 43, 44, 45, 46, 47, 48, 49],
    supplier: "Aurora Electro-Mechanics", ppap: "Lv3", category: "Camera", risk: "High" },
  { id: 41, lvl: 3, partId: "CM2-9PTY-SNS200", desc: "SENSOR,IMAGE,200MP MAIN", type: "CMDTY",
    status: { D: "ok", C: "warn", Q: "ok" }, comments: 4, children: [],
    supplier: "Aurora Semi", ppap: "Lv3", category: "Camera", risk: "High" },
  { id: 42, lvl: 3, partId: "CL3-6URD-LNS200", desc: "LENS,7P,F1.7,OIS,200MP MAIN", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 2, children: [],
    supplier: "Lyra Optics", ppap: "Lv3", category: "Camera", risk: "Med" },
  { id: 43, lvl: 3, partId: "CS4-5AVN-SNSULT", desc: "SENSOR,IMAGE,12MP ULTRAWIDE", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Kestrel Imaging", ppap: "Lv3", category: "Camera", risk: "Med" },
  { id: 44, lvl: 3, partId: "CL4-2BWK-LNSULT", desc: "LENS,6P,F2.2,ULTRAWIDE 12MP", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Solis Optical", ppap: "Lv2", category: "Camera", risk: "Low" },
  { id: 45, lvl: 3, partId: "CS5-7HLT-SNSTEL", desc: "SENSOR,IMAGE,10MP TELEPHOTO 3X", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Kestrel Imaging", ppap: "Lv3", category: "Camera", risk: "Med" },
  { id: 46, lvl: 3, partId: "CL5-4MGS-LNSTEL", desc: "LENS,5P,F2.4,TELEPHOTO 3X", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Lyra Optics", ppap: "Lv2", category: "Camera", risk: "Low" },
  { id: 47, lvl: 3, partId: "OI6-8JXN-OIS012", desc: "ACTUATOR,OIS,VOICE COIL,MAIN", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Mitra Components", ppap: "Lv2", category: "Camera", risk: "Med" },
  { id: 48, lvl: 3, partId: "FL7-3ZBQ-FLSH09", desc: "LED,FLASH,DUAL TONE", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Photon LED", ppap: "Lv1", category: "Camera", risk: "Low" },
  { id: 49, lvl: 3, partId: "FC8-1KWE-FCAM12", desc: "ASSY,CAMERA,FRONT 12MP", type: "ASSM",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Vega Innotek", ppap: "Lv2", category: "Camera", risk: "Low" },

  // ============================================================
  // Level 2 — Audio branch (id 50-54)
  // ============================================================
  { id: 50, lvl: 2, partId: "AU1-6FRP-AUDAS", desc: "ASSY,AUDIO SUBSYSTEM", type: "ASSM",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 2, children: [51, 52, 53, 54],
    supplier: "Acousta", ppap: "Lv2", category: "Audio", risk: "Low" },
  { id: 51, lvl: 3, partId: "SP1-9HXJ-SPK001", desc: "SPEAKER,EARPIECE,STEREO TOP", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Acousta", ppap: "Lv2", category: "Audio", risk: "Low" },
  { id: 52, lvl: 3, partId: "SP2-4VLG-SPK002", desc: "SPEAKER,LOUDSPEAKER,STEREO BOTTOM", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Acousta", ppap: "Lv2", category: "Audio", risk: "Low" },
  { id: 53, lvl: 3, partId: "MC3-7BPL-MIC003", desc: "MICROPHONE,MEMS,DUAL ARRAY", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Knell Acoustics", ppap: "Lv2", category: "Audio", risk: "Low" },
  { id: 54, lvl: 3, partId: "AM4-2QZR-AMP004", desc: "IC,AUDIO AMPLIFIER,CLASS-D", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Sonus Audio", ppap: "Lv2", category: "Audio", risk: "Low" },

  // ============================================================
  // Level 2 — Connectors / Cables branch (id 60-67)
  // ============================================================
  { id: 60, lvl: 2, partId: "CN1-8GFM-CONAS", desc: "ASSY,CONNECTORS + CABLES", type: "ASSM",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [61, 62, 63, 64, 65, 66, 67],
    supplier: "Atlas Interconnect", ppap: "Lv2", category: "Connectors", risk: "Low" },
  { id: 61, lvl: 3, partId: "UC1-5VHN-USBCN1", desc: "CONNECTOR,USB-C,RECEPTACLE,24-PIN", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Atlas Interconnect", ppap: "Lv2", category: "Connectors", risk: "Low" },
  { id: 62, lvl: 3, partId: "SC2-3PLW-SIMTRY", desc: "ASSY,SIM TRAY,NANO + eSIM", type: "ASSM",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Conexis Connectors", ppap: "Lv2", category: "Connectors", risk: "Low" },
  { id: 63, lvl: 3, partId: "FC3-8MJK-FLEX01", desc: "FLEX CABLE,MAINBOARD TO DISPLAY", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Summit Electric", ppap: "Lv2", category: "Connectors", risk: "Low" },
  { id: 64, lvl: 3, partId: "FC4-9WBU-FLEX02", desc: "FLEX CABLE,MAINBOARD TO CAMERA", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Summit Electric", ppap: "Lv2", category: "Connectors", risk: "Low" },
  { id: 65, lvl: 3, partId: "FC5-7DSQ-FLEX03", desc: "FLEX CABLE,MAINBOARD TO BATTERY", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Summit Electric", ppap: "Lv2", category: "Connectors", risk: "Low" },
  { id: 66, lvl: 3, partId: "BC6-1ETR-BTNCBL", desc: "FLEX,SIDE BUTTONS (POWER+VOLUME)", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Atlas Interconnect", ppap: "Lv1", category: "Connectors", risk: "Low" },
  { id: 67, lvl: 3, partId: "AC7-4OPY-ANTCBL", desc: "CABLE,COAXIAL,ANTENNA RF", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Mira Components", ppap: "Lv2", category: "Connectors", risk: "Low" },

  // ============================================================
  // Level 2 — Mechanical / Frame branch (id 70-79)
  // ============================================================
  { id: 70, lvl: 2, partId: "MF1-2RFL-MECHAS", desc: "ASSY,FRAME + HOUSING,ALUMINUM", type: "ASSM",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 3, children: [71, 72, 73, 74, 75, 76, 77, 78, 79],
    supplier: "Forge Metals", ppap: "Lv2", category: "Mechanical", risk: "Low" },
  { id: 71, lvl: 3, partId: "MF2-8HNT-MIDFRM", desc: "MID FRAME,AL-7000 SERIES", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Forge Metals", ppap: "Lv2", category: "Mechanical", risk: "Low" },
  { id: 72, lvl: 3, partId: "MB3-5QGV-BCKGLS", desc: "GLASS,BACK COVER,TEMPERED", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Lumen Lens", ppap: "Lv2", category: "Mechanical", risk: "Low" },
  { id: 73, lvl: 3, partId: "MB4-7ZWA-SIDEBZ", desc: "BEZEL,SIDE,STAINLESS STEEL", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Boreas Energy", ppap: "Lv2", category: "Mechanical", risk: "Low" },
  { id: 74, lvl: 3, partId: "SC5-3JOM-SCRWKT", desc: "SCREW KIT,TORX T2,SET OF 12", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Wexford Elektronik", ppap: "Lv1", category: "Mechanical", risk: "Low" },
  { id: 75, lvl: 3, partId: "GS6-9PUE-GASKET", desc: "GASKET,WATERPROOF,IP68,SILICONE", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Cohere Adhesives", ppap: "Lv2", category: "Mechanical", risk: "Med" },
  { id: 76, lvl: 3, partId: "BR7-4LSF-BUTTON", desc: "BUTTONS,SIDE,POWER+VOLUME ASSY", type: "ASSM",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Atlas Manufacturing", ppap: "Lv1", category: "Mechanical", risk: "Low" },
  { id: 77, lvl: 3, partId: "VB8-6KCD-VIBRAT", desc: "MOTOR,VIBRATION,HAPTIC FEEDBACK", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Nexus Motors", ppap: "Lv2", category: "Mechanical", risk: "Low" },
  { id: 78, lvl: 3, partId: "EM9-2GHB-EMSHLD", desc: "EMI SHIELD,MAINBOARD,STAMPED", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Larkspur Thermal", ppap: "Lv2", category: "Mechanical", risk: "Low" },
  { id: 79, lvl: 3, partId: "GP1-7AYV-GRAPH4", desc: "GRAPHITE SHEET,THERMAL,0.5MM", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Panorama Electric", ppap: "Lv2", category: "Mechanical", risk: "Low" },

  // ============================================================
  // Level 2 — Antenna / RF branch (id 80-85)
  // ============================================================
  { id: 80, lvl: 2, partId: "AN1-5HMW-ANTAS", desc: "ASSY,ANTENNA + RF FRONT-END", type: "ASSM",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 2, children: [81, 82, 83, 84, 85],
    supplier: "Mira Components", ppap: "Lv3", category: "Antenna", risk: "Med" },
  { id: 81, lvl: 3, partId: "AN2-8FRT-ANTSUB", desc: "ANTENNA,5G SUB-6 GHz,LDS", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Pulsar Electronics", ppap: "Lv3", category: "Antenna", risk: "Med" },
  { id: 82, lvl: 3, partId: "AN3-2VXR-ANTMMW", desc: "ANTENNA,mmWAVE,28GHz/39GHz", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Mira Components", ppap: "Lv3", category: "Antenna", risk: "High" },
  { id: 83, lvl: 3, partId: "AN4-6KPN-ANTWIF", desc: "ANTENNA,WIFI 7 + BT,DUAL BAND", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Mira Components", ppap: "Lv2", category: "Antenna", risk: "Low" },
  { id: 84, lvl: 3, partId: "RF5-9QHJ-PAMSUB", desc: "IC,POWER AMPLIFIER,SUB-6 GHz", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Quartz RF", ppap: "Lv3", category: "Antenna", risk: "Med" },
  { id: 85, lvl: 3, partId: "RF6-3LWA-FEMMOD", desc: "IC,RF FRONT-END MODULE", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Skylark RF", ppap: "Lv3", category: "Antenna", risk: "Med" },

  // ============================================================
  // Level 2 — Sensors branch (id 90-96)
  // ============================================================
  { id: 90, lvl: 2, partId: "SN1-7DXT-SNRAS", desc: "ASSY,SENSORS,ENVIRONMENTAL + MOTION", type: "ASSM",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [91, 92, 93, 94, 95, 96],
    supplier: "Falcon Sensortec", ppap: "Lv2", category: "Sensors", risk: "Low" },
  { id: 91, lvl: 3, partId: "SN2-4BMP-GYRO01", desc: "SENSOR,6-AXIS,GYRO + ACCEL", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Falcon Sensortec", ppap: "Lv2", category: "Sensors", risk: "Low" },
  { id: 92, lvl: 3, partId: "SN3-6HZE-MAGNET", desc: "SENSOR,MAGNETOMETER,3-AXIS", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Sakura Materials", ppap: "Lv2", category: "Sensors", risk: "Low" },
  { id: 93, lvl: 3, partId: "SN4-1WRL-PROXLT", desc: "SENSOR,PROXIMITY + AMBIENT LIGHT", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Lumen Sensors", ppap: "Lv2", category: "Sensors", risk: "Low" },
  { id: 94, lvl: 3, partId: "SN5-8YCK-FNGPRT", desc: "SENSOR,FINGERPRINT,ULTRASONIC,UD", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 2, children: [],
    supplier: "Apex Silicon", ppap: "Lv3", category: "Sensors", risk: "Med" },
  { id: 95, lvl: 3, partId: "SN6-3NQO-BAROPR", desc: "SENSOR,BAROMETRIC PRESSURE", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Falcon Sensortec", ppap: "Lv2", category: "Sensors", risk: "Low" },
  { id: 96, lvl: 3, partId: "SN7-5SAH-TOFLDR", desc: "SENSOR,ToF,LASER AUTOFOCUS", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Helvetia Micro", ppap: "Lv2", category: "Sensors", risk: "Low" },

  // ============================================================
  // Level 2 — Power / Charging branch (id 100-103)
  // ============================================================
  { id: 100, lvl: 2, partId: "PW1-9TJG-PWRAS", desc: "ASSY,POWER + WIRELESS CHARGING", type: "ASSM",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 1, children: [101, 102, 103],
    supplier: "Sonus Audio", ppap: "Lv2", category: "Power", risk: "Low" },
  { id: 101, lvl: 3, partId: "PW2-4XCL-WPCHRG", desc: "COIL,WIRELESS CHARGING,15W Qi2", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Tundra Components", ppap: "Lv2", category: "Power", risk: "Low" },
  { id: 102, lvl: 3, partId: "PW3-7MAY-WPCIC0", desc: "IC,WIRELESS POWER RECEIVER", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Renova Semi", ppap: "Lv2", category: "Power", risk: "Low" },
  { id: 103, lvl: 3, partId: "PW4-2PWS-RVPSC4", desc: "IC,REVERSE WIRELESS CHARGING", type: "CMDTY",
    status: { D: "ok", C: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Renova Semi", ppap: "Lv1", category: "Power", risk: "Low" },

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
    supplier: "Atlas Manufacturing", ppap: "Lv1", category: "Packaging", risk: "Low" },
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
    lifecycle: "review", parties: 2, multisource: 88.2, sss: 7.1, reviewSev: "block",
    collabType: "design", collabProgress: 65, collabLabel: "Design Collaboration",
    collabStatus: "DDIC spec in review" },
  { id: "C", label: "C-BOM", name: "Cost BOM", version: "v2.0", parts: 80, status: "active",
    syncDelta: 0, missing: 2, owner: "CM", contributor: "SM",
    description: "Sourcing + Cost (supplier selection & cost breakdown)",
    syncNote: "2 parts missing supplier selection (including Display Driver IC second source)",
    lastActivity: { actor: "CM", action: "Should-cost updated", ts: "Today 09:15" },
    defaults: { structure: "flat", groupBy: "none", overlay: "none" },
    lifecycle: "review", parties: 3, multisource: 96.1, sss: 6.5,
    collabType: "cost", collabProgress: 92, collabLabel: "Source & Cost Collaboration",
    collabStatus: "Final Review" },
  { id: "Q", label: "Q-BOM", name: "Quality BOM", version: "v1.5", parts: 76, status: "active",
    syncDelta: 1, missing: 4, owner: "QM", description: "PPAP validation subject",
    syncNote: "4 new parts not yet registered for PPAP",
    lastActivity: { actor: "QM", action: "PPAP requested", ts: "Today 14:22" },
    defaults: { structure: "flat", groupBy: "none", overlay: "none" },
    lifecycle: "review", parties: 1, multisource: 85.0, sss: 3.2,
    collabType: "quality", collabProgress: 45, collabLabel: "Quality Collaboration",
    collabStatus: "PPAP Lv3 Pending" },
];

// Archived BOMs — historical versions kept for record keeping. They retain the
// parts count and last activity captured at the time the version was superseded.
const ARCHIVED_BOMS = [
  { id: "E-old", label: "E-BOM", code: "BOM260400319", versions: ["Ver 2", "Ver 1"],
    parts: 68, lastActivity: { actor: "DE", action: "Superseded by v1.8", ts: "2026-04-18" },
    cost: { ver: "Ver 1", delta: "+$1,900", target: "$48,500", overTarget: true } },
  { id: "E-old2", label: "E-BOM", code: "BOM260300257", versions: ["Ver 1"],
    parts: 52, lastActivity: { actor: "DE", action: "Archived", ts: "2026-03-22" }, cost: null },
  { id: "C-old", label: "C-BOM", code: "BOM260300258", versions: ["Ver 2", "Ver 1"],
    parts: 50, lastActivity: { actor: "CM", action: "Superseded by v2.0", ts: "2026-03-30" },
    cost: { ver: "Ver 1", delta: "+$420", target: "$48,500", overTarget: true } },
  { id: "C-old2", label: "C-BOM", code: "BOM260400320", versions: ["Ver 3", "Ver 2", "Ver 1"],
    parts: 70, lastActivity: { actor: "CM", action: "Approved", ts: "2026-04-12" },
    cost: { ver: "Ver 2", delta: "-$300", target: "$48,500", overTarget: false } },
  { id: "Q-old", label: "Q-BOM", code: "BOM260300259", versions: ["Ver 1"],
    parts: 9, lastActivity: { actor: "QM", action: "Archived", ts: "2026-03-25" }, cost: null },
];

// Extra BOM version snapshots shown on the hero project's workflow board so it reflects
// reality: each BOM keeps a prior APPROVED baseline (still in effect) while the current rev
// sits In Review, and some owners have started a DRAFT of the next revision. These link back
// to their base BOM (linkTo) when opened.
const BOARD_EXTRA = [
  // Approved baselines — previous version still in effect, superseded by the in-review rev
  { id: "E-appr", linkTo: "E", label: "E-BOM", name: "Engineering BOM", version: "v1.7", parts: 78, status: "active",
    lifecycle: "approved", owner: "DE", parties: 2, collabType: "design", collabProgress: 100,
    collabLabel: "Design Collaboration", collabStatus: "Approved baseline", missing: 0, syncDelta: 0,
    lastActivity: { actor: "DE", action: "Approved v1.7", ts: "2026-05-12" } },
  { id: "C-appr", linkTo: "C", label: "C-BOM", name: "Cost BOM", version: "v1.9", parts: 78, status: "active",
    lifecycle: "approved", owner: "CM", parties: 3, collabType: "cost", collabProgress: 100,
    collabLabel: "Source & Cost Collaboration", collabStatus: "Approved baseline", missing: 0, syncDelta: 0,
    lastActivity: { actor: "CM", action: "Approved v1.9", ts: "2026-05-20" } },
  // Drafts — next revision being started
  { id: "E-draft", linkTo: "E", label: "E-BOM", name: "Engineering BOM", version: "v1.9", parts: 81, status: "active",
    lifecycle: "draft", owner: "DE", parties: 1, collabType: "design", collabProgress: 15,
    collabLabel: "Design Collaboration", collabStatus: "Next rev — drafting", missing: 0, syncDelta: 0,
    lastActivity: { actor: "DE", action: "Started v1.9 draft", ts: "Today 10:40" } },
  { id: "Q-draft", linkTo: "Q", label: "Q-BOM", name: "Quality BOM", version: "v1.6", parts: 76, status: "active",
    lifecycle: "draft", owner: "QM", parties: 1, collabType: "quality", collabProgress: 10,
    collabLabel: "Quality Collaboration", collabStatus: "Next rev — drafting", missing: 0, syncDelta: 0,
    lastActivity: { actor: "QM", action: "Started v1.6 draft", ts: "Today 13:05" } },
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

// Display Driver IC (id: 3) — scenario hero item (leaf part under Display Module)
const HERO_ITEM = {
  id: 3, partId: "EI2-I6DA-003WB", partName: "Display Driver IC AX-7421",
  itemCode: "1000001120", desc: "IC,DISPLAY DRIVER,DDIC,MIPI-4LANE,120HZ",
  category: "Display IC", type: "Buy & Sell", uom: "EA",
  status: { D: "warn", C: "block", Q: "block" },
  spec: {
    "Function": "Display Driver IC (DDIC)",
    "Interface": "MIPI DSI · 4-lane",
    "Max Refresh": "120Hz (req: 90Hz → 120Hz)",
    "Resolution Support": "FHD+ (2400×1080)",
    "Package": "COF (chip-on-film)",
    "Qualification": "AEC-Q100 Grade 2",
    "Incumbent": "Apex Silicon AX-7421 · EOL / last-time-buy",
  },
  cost: {
    target: 11.80,
    current: 12.00,
    historical: 12.00,
    market: 12.30,
    shouldCost: 11.80,
    quoted: null,
    delta: 0.20,
  },
  suppliers: [
    { name: "Apex Silicon", risk: "Med", capability: 92, performance: 90, recommended: false },
    { name: "Triton Semiconductor", risk: "Low", capability: 95, performance: 93, recommended: true },
    { name: "Ironwood Semi", risk: "Low", capability: 88, performance: 86, recommended: true },
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
      { name: "Internal Atlas Manufacturing India", risk: "Low", capability: 98, performance: 95, recommended: true },
      { name: "Pinnacle Assembly Vietnam", risk: "Low", capability: 92, performance: 90, recommended: false },
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
      { name: "Aurora Display Module", risk: "Low", capability: 94, performance: 91, recommended: true },
      { name: "Halo Display", risk: "Med", capability: 86, performance: 82, recommended: false },
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
      { name: "Polaris Films", risk: "Low", capability: 96, performance: 95, recommended: true },
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
      { name: "Meridian Optical Systems", risk: "Low", capability: 97, performance: 96, recommended: true },
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
      { name: "Triton Semiconductor", risk: "Low", capability: 95, performance: 93, recommended: true },
      { name: "Cypress Semiconductor (Ironwood Semi)", risk: "Low", capability: 90, performance: 88, recommended: true },
      { name: "Griffin Sensors", risk: "Med", capability: 85, performance: 82, recommended: false },
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
      { name: "Atlas Manufacturing Cooling", risk: "Low", capability: 92, performance: 91, recommended: true },
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
      { name: "Aurora Electro-Mechanics", risk: "Low", capability: 96, performance: 94, recommended: true },
      { name: "Atlas Manufacturing FATP", risk: "Low", capability: 93, performance: 92, recommended: true },
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
    message: "D-23 to the Develop Phase Gate. The Display Driver IC is blocked on Cost & PPAP — the 120Hz panel upgrade needs a driver the incumbent can't supply (Apex AX-7421 is EOL). Please review.",
    mentions: ["DE"], itemRef: HERO_ITEM, decision: false },
  { id: 2, ts: "10:31", persona: "DE", channel: "design",
    message: "Confirmed. Incumbent Apex AX-7421 tops out at 90Hz MIPI timing and is on last-time-buy. Evaluating a 120Hz-capable second source.",
    mentions: [], itemRef: HERO_ITEM, decision: false },
  { id: 3, ts: "10:35", persona: "AI", channel: "design",
    message: "🤖 Impact analysis: 120Hz needs 4-lane MIPI DSI. 3 drivers qualify (Triton Semiconductor TX-6620, Ironwood ID-5500, Griffin GD-4200). Triton Semiconductor is a drop-in COF match; Griffin is COG (needs retape).",
    mentions: [], aiInsight: true },
  { id: 4, ts: "10:42", persona: "DE", channel: "cost",
    message: "Interface confirmed: 4-lane MIPI · 120Hz · COF. CM, please verify the Should-cost for the Triton Semiconductor TX-6620 second source.",
    mentions: ["CM"], itemRef: HERO_ITEM, decision: false },
  { id: 5, ts: "11:08", persona: "CM", channel: "cost",
    message: "Should-cost $11.80, Market $12.30. Triton Semiconductor is −2% vs incumbent $12.00. Requesting SM to send RFQ.",
    mentions: ["SM"], itemRef: HERO_ITEM, decision: true,
    decisionText: "Proceed with RFQ at Should-cost $11.80" },
  { id: 6, ts: "11:23", persona: "SM", channel: "sourcing",
    message: "All 3 candidates (Apex Silicon successor, Triton Semiconductor, Ironwood Semi) are pre-qualified. Sent RFQ as Closed Bid. Response deadline D-3.",
    mentions: [], itemRef: HERO_ITEM, decision: false },
  { id: 7, ts: "14:15", persona: "AI", channel: "sourcing",
    message: "🤖 RFQ responses received: Apex AX-7600 $12.10 / Triton Semiconductor $11.80 / Ironwood $12.10. Triton Semiconductor quote −$0.20 vs Should-cost (best).",
    mentions: [], aiInsight: true },
  { id: 8, ts: "14:22", persona: "QM", channel: "quality",
    message: "Risk Assessment result: Medium Risk → PPAP Level 3 auto-set. Sending PPAP request to Triton Semiconductor. Q-BOM auto-sync confirmed.",
    mentions: [], itemRef: HERO_ITEM, decision: true,
    decisionText: "Supplier: Triton Semiconductor selected, PPAP Lv3 in progress" },

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
    message: "Polarizer price negotiation: Polaris Films $1.80 → $1.75. Expected annual savings of $50K.",
    mentions: [], itemRef: { id: 4, partId: "UEI-Y0ZL-7UU0W", partName: "Polarizer Film" },
    decision: true, decisionText: "Unit price $1.75 confirmed (savings $0.05)" },

  // OCA Adhesive (id 5)
  { id: 14, ts: "2 days ago", persona: "SM", channel: "sourcing",
    message: "New Meridian OCA grade samples arrived. 99.2% transmittance confirmed — outperforms Tesa SE.",
    mentions: ["QM"], itemRef: { id: 5, partId: "5ML-DR7Q-2CV44", partName: "OCA Adhesive" }, decision: false },
  { id: 15, ts: "Yesterday 09:30", persona: "QM", channel: "quality",
    message: "Meridian OCA passed UV 1000h test. Will proceed with PPAP Lv2.",
    mentions: [], itemRef: { id: 5, partId: "5ML-DR7Q-2CV44", partName: "OCA Adhesive" }, decision: false },

  // Touch IC (id 6) — active issue
  { id: 16, ts: "Today 09:15", persona: "CM", channel: "cost",
    message: "Touch Controller IC is $0.30 over the $2.50 target. Need to weigh Triton Semiconductor negotiation vs switching to Griffin Sensors. @DE",
    mentions: ["DE"], itemRef: { id: 6, partId: "1W6-4YP3-X6FU2", partName: "Touch Controller IC" }, decision: false },
  { id: 17, ts: "Today 09:42", persona: "DE", channel: "design",
    message: "Switching to Griffin Sensors requires firmware re-validation (2 weeks). Prefer to prioritize Triton Semiconductor negotiation.",
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
  // Hero: Display Driver IC (id 3) — full lifecycle of the scenario
  3: [
    { id: "h-a1", ts: "10:18", type: "spec_change", actor: "DE",
      title: "Driver requirement raised", detail: "Panel → 120Hz · driver must support 4-lane MIPI @ 120Hz",
      scenarioGate: 0 },
    { id: "h-a2", ts: "10:24", type: "status", actor: "system",
      title: "Status changed: Blocked", detail: "Incumbent Apex AX-7421 is EOL · Cost (C) & Quality (Q) auto-flagged",
      severity: "error", scenarioGate: 0 },
    { id: "h-a3", ts: "10:31", type: "ai_insight", actor: "AI",
      title: "AI impact analysis", detail: "3 second-source drivers qualify · Triton Semiconductor drop-in (COF) · Griffin COG (retape)",
      scenarioGate: 2 },
    { id: "h-a4", ts: "10:45", type: "file", actor: "DE",
      title: "Spec document attached", detail: "DDIC_4lane_120Hz_spec_v2.pdf (244 KB)",
      scenarioGate: 2 },
    { id: "h-a5", ts: "11:08", type: "version", actor: "DE",
      title: "E-BOM version updated", detail: "v1.7 → v1.8 · Part: Display Driver IC",
      scenarioGate: 3 },
    { id: "h-a6", ts: "11:23", type: "ai_insight", actor: "AI",
      title: "Should-cost computed", detail: "$11.80 (AI-derived) · Market avg $12.30",
      scenarioGate: 4 },
    { id: "h-a7", ts: "13:42", type: "supplier", actor: "SM",
      title: "RFQ sent", detail: "3 suppliers: Apex Silicon, Triton Semiconductor, Ironwood Semi",
      scenarioGate: 5 },
    { id: "h-a8", ts: "14:15", type: "ai_insight", actor: "AI",
      title: "RFQ responses analyzed", detail: "Apex $12.10 · Triton Semiconductor $11.80 · Ironwood $12.10 — Triton Semiconductor best (-$0.20 vs should-cost)",
      scenarioGate: 6 },
    { id: "h-a9", ts: "14:22", type: "supplier", actor: "SM",
      title: "Supplier awarded: Triton Semiconductor", detail: "Quoted $11.80/EA · Lead time 10 weeks · drop-in COF",
      scenarioGate: 7 },
    { id: "h-a10", ts: "14:30", type: "ppap", actor: "QM",
      title: "PPAP Lv3 assigned", detail: "Medium risk · 18 deliverables · Triton Semiconductor assigned",
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
      title: "Dual-source approved", detail: "Polaris Films (primary) + Vega Chem (secondary)" },
    { id: "p4-a2", ts: "May 15", type: "ai_insight", actor: "AI",
      title: "Savings opportunity", detail: "Polaris Films price reduced $1.80 → $1.75 (-2.8%)" },
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
    title: "Please review the Display Driver IC second source",
    snippet: "D-23 to Develop Phase Gate. Blocked on both Cost & PPAP...",
    itemRef: { partId: "EI2-I6DA-003WB", partName: "Display Driver IC AX-7421" },
    channel: "general", read: false, scenarioStep: 0 },
  { id: "i2", source: "scenario", projectCode: "P-2025-002", projectName: "NPI Smartphone #2 - Galaxy Pro Slim",
    type: "mention", from: "DE", to: "CM",
    ts: "10:42", time: "10 min ago",
    title: "Should-cost verification request",
    snippet: "Spec update complete. Please confirm it doesn't differ from the AI recommendation.",
    itemRef: { partId: "EI2-I6DA-003WB", partName: "Display Driver IC AX-7421" },
    channel: "cost", read: false, scenarioStep: 3 },
  { id: "i3", source: "scenario", projectCode: "P-2025-002", projectName: "NPI Smartphone #2 - Galaxy Pro Slim",
    type: "approval", from: "CM", to: "SM",
    ts: "11:08", time: "30 min ago",
    title: "RFQ send request — Display Driver IC",
    snippet: "Please run the RFQ at Should-cost $11.80. 3 pre-qualified suppliers recommended.",
    itemRef: { partId: "EI2-I6DA-003WB", partName: "Display Driver IC AX-7421" },
    channel: "cost", read: false, scenarioStep: 4 },

  // Other projects (cross-project)
  { id: "i4", source: "cross", projectCode: "P-2025-001", projectName: "NPI Smartphone #1 - Galaxy Flagship",
    type: "approval", from: "QM", to: "PM",
    ts: "Yesterday", time: "1 day ago",
    title: "PPAP Lv3 approval request — Camera Module",
    snippet: "Lumina Camera Module PPAP Level 3 review complete. Need PM final approval.",
    itemRef: { partId: "3K4-CAM-48MP", partName: "Camera Module 48MP" },
    channel: "quality", read: false, scenarioStep: 0 },
  { id: "i5", source: "cross", projectCode: "P-2025-005", projectName: "NPI Tablet #1 - 11-inch Pro",
    type: "mention", from: "SM", to: "PM",
    ts: "Yesterday", time: "1 day ago",
    title: "Display Panel supplier selection — input requested",
    snippet: "@PM Between the two 11\" Display candidates (Vega vs Aurora Display), please weigh in.",
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
  { ...HERO_ITEM, bom: "Q", blockReason: "PPAP not started · incumbent EOL · cost +$0.20 vs target" },
  { id: 10, partId: "6U8-HKJJ-JRPWM", partName: "Mainboard 5G", bom: "Q",
    blockReason: "Quality Risk Assessment pending",
    status: { D: "ok", C: "ok", Q: "warn" } },
  { id: 6, partId: "1W6-4YP3-X6FU2", partName: "Touch Controller I2C", bom: "C",
    blockReason: "Cost variance with market price (+12%)",
    status: { D: "ok", C: "warn", Q: "ok" } },
  { id: 14, partId: "3K2-PWQ9-CAM01", partName: "Camera Module 50MP", bom: "C",
    blockReason: "Sole-source risk — second source approval needed",
    status: { D: "ok", C: "warn", Q: "warn" } },
  { id: 18, partId: "9B4-TZX7-BATT2", partName: "Battery Pack 5000mAh", bom: "C",
    blockReason: "Should-cost gap unresolved (+$0.40), RFQ outstanding",
    status: { D: "ok", C: "warn", Q: "ok" } },
  { id: 11, partId: "2N8-GLV2-DISP3", partName: "Gorilla Glass Victus 2", bom: "E",
    blockReason: "Spec change Rev B — downstream re-validation required",
    status: { D: "warn", C: "ok", Q: "ok" } },
];

// === STATUS BADGE ===
const STATUS_MAP = {
  ok:       { color: "#039855", bg: "#ecfdf3", label: "OK" },
  progress: { color: "#1570ef", bg: "#eff8ff", label: "In Progress" },
  warn:     { color: "#dc6803", bg: "#fffaeb", label: "Attention" },
  block:    { color: "#d92d20", bg: "#fef3f2", label: "Blocked" },
  done:     { color: "#039855", bg: "#ecfdf3", label: "Done" },
};

// Display label for BOM status keys. The data stores "D" (Design) historically,
// but the UI shows it as "E" to match the E-BOM (Engineering) naming. C/Q unchanged.
const STATUS_KEY_LABEL = { D: "E", C: "C", Q: "Q" };
const statusKeyLabel = (k) => STATUS_KEY_LABEL[k] || k;

// Date display helper — converts ISO "YYYY-MM-DD" to "MM/DD/YYYY" for full-date contexts.
// Inputs that aren't ISO (e.g. "Apr 25", "TBD", "2 hours ago") pass through unchanged.
const fmtDate = (s) => {
  if (typeof s !== "string") return s;
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[2]}/${m[3]}/${m[1]}` : s;
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
  // Convention: read-only status/attribute chips are tinted (no border); only interactive chips are outlined.
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
      {persona.initial?.charAt(0)}
    </div>
  );
}

// === GLOBAL NAV ===
function GNB({ activePersona, setActivePersona, view, setView, scenarioStep, totalSteps, currentStep, onPrevStep, onNextStep, onResetScenario, onJumpStep, activeProjectCode, setActiveProjectCode, notifOpen, setNotifOpen, demoNotif = false, onDemoNotifClick = null }) {
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
          {/* Logo: Caidentia (vector) */}
          <div className="flex items-center select-none">
            <svg width="94" height="16" viewBox="0 0 82 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Caidentia">
              <g clipPath="url(#clip0_277_3095)">
                <path d="M7.49217 0.0869923C10.3316 0.0869923 12.9683 1.76412 13.7611 4.35119H11.4748C10.977 2.906 9.22535 1.88902 7.49217 1.88902C4.52364 1.88902 2.67982 4.15493 2.67982 7.00962C2.67982 9.86431 4.52364 12.1659 7.49217 12.1659C9.22535 12.1659 10.9401 11.2024 11.567 9.48963H13.8164C12.913 12.273 10.3316 13.9858 7.49217 13.9858C3.43579 13.9858 0.541016 10.9527 0.541016 7.00962C0.541016 3.06658 3.43579 0.0869923 7.49217 0.0869923Z" fill="#101828"/>
                <path d="M14.5724 8.75812C14.5724 5.74285 16.7112 3.56615 19.5322 3.56615C21.0073 3.56615 22.1689 4.13709 22.7589 4.85076V3.79809H24.7687V13.7538H23.1461L22.888 12.4514C22.3164 13.2899 21.0257 13.9144 19.5322 13.9144C16.7112 13.9144 14.5724 11.7199 14.5724 8.75812ZM22.7405 8.75812C22.7405 6.70631 21.4682 5.26112 19.7166 5.26112C17.965 5.26112 16.6006 6.72415 16.6006 8.75812C16.6006 10.7921 18.0019 12.2016 19.7166 12.2016C21.4314 12.2016 22.7405 10.7386 22.7405 8.75812Z" fill="#101828"/>
                <path d="M27.4422 0.015625C28.1244 0.015625 28.7144 0.568722 28.7144 1.24671C28.7144 1.9247 28.1244 2.4778 27.4422 2.4778C26.76 2.4778 26.1515 1.9247 26.1515 1.24671C26.1515 0.568722 26.7415 0.015625 27.4422 0.015625ZM26.4465 3.79809H28.4931V13.7538H26.4465V3.79809Z" fill="#101828"/>
                <path d="M29.6916 8.75812C29.6916 5.74285 31.9964 3.56615 34.6699 3.56615C35.9053 3.56615 37.1037 3.95867 37.8781 4.85076V0.140518H39.8879V13.7538H38.2653L38.0072 12.4157C37.2697 13.3078 36.145 13.8787 34.6884 13.9144C32.0517 13.9679 29.6916 11.7199 29.6916 8.75812ZM37.8597 8.75812C37.8597 6.68847 36.5875 5.26112 34.8543 5.26112C33.1211 5.26112 31.7198 6.72415 31.7198 8.75812C31.7198 10.7921 33.1211 12.2016 34.8727 12.2016C36.6243 12.2016 37.8597 10.7742 37.8597 8.75812Z" fill="#101828"/>
                <path d="M41.0679 8.77596C41.0679 5.70717 43.2252 3.54831 46.1568 3.54831C49.0885 3.54831 51.1535 5.60012 51.1535 8.61539V9.22201H43.133C43.2621 10.917 44.4974 12.2908 46.2306 12.2908C47.4106 12.2908 48.4432 11.6307 48.7566 10.6672H50.9692C50.2685 12.6298 48.4432 13.9322 46.1937 13.9322C43.133 13.9322 41.0679 11.6307 41.0679 8.77596ZM43.2621 7.63408H49.0147C48.775 6.17106 47.6135 5.22544 46.1753 5.22544C44.7371 5.22544 43.6124 6.17106 43.2621 7.63408Z" fill="#101828"/>
                <path d="M60.9995 7.95524V13.7538H58.9897V8.06229C58.9897 6.22458 58.2891 5.29681 56.98 5.29681C55.4865 5.29681 54.4171 6.72415 54.4171 8.75812V13.7538H52.3889V3.79809H54.4171V5.0827C54.9149 4.24414 56.0212 3.61967 57.2012 3.61967C59.6904 3.61967 60.9995 5.17191 60.9995 7.95524Z" fill="#101828"/>
                <path d="M61.5895 3.79809H63.0277V1.05045H65.0374V3.79809H67.3422V5.52875H65.0374V9.68589C65.0374 11.4166 65.8487 12.1838 67.416 12.0589V13.843C64.1893 14.0393 63.0277 12.3622 63.0277 9.82863V5.52875H61.5895V3.79809Z" fill="#101828"/>
                <path d="M69.5548 0.015625C70.237 0.015625 70.827 0.568722 70.827 1.24671C70.827 1.9247 70.237 2.4778 69.5548 2.4778C68.8726 2.4778 68.2641 1.9247 68.2641 1.24671C68.2641 0.568722 68.8541 0.015625 69.5548 0.015625ZM68.5591 3.79809H70.6057V13.7538H68.5591V3.79809Z" fill="#101828"/>
                <path d="M71.8042 8.75812C71.8042 5.74285 73.943 3.56615 76.7641 3.56615C78.2391 3.56615 79.4007 4.13709 79.9907 4.85076V3.79809H82.0005V13.7538H80.3779L80.1198 12.4514C79.5482 13.2899 78.2575 13.9144 76.7641 13.9144C73.943 13.9144 71.8042 11.7199 71.8042 8.75812ZM79.9723 8.75812C79.9723 6.70631 78.7001 5.26112 76.9484 5.26112C75.1968 5.26112 73.8324 6.72415 73.8324 8.75812C73.8324 10.7921 75.2337 12.2016 76.9484 12.2016C78.6632 12.2016 79.9723 10.7386 79.9723 8.75812Z" fill="#101828"/>
              </g>
              <defs>
                <clipPath id="clip0_277_3095"><rect width="82.0005" height="14" fill="white"/></clipPath>
              </defs>
            </svg>
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
            <span className="text-[12px] font-medium whitespace-nowrap" style={{ color: "#4B5565" }}>
              Eastern Time (USA)
            </span>
          </button>

          {/* Notifications — hover shows a preview dropdown, click opens the full inbox in the body */}
          {(() => {
            const myUnreadCount = INBOX_FEED.filter((m) => {
              if (m.to !== activePersona) return false;
              if (m.source === "scenario" && scenarioStep < m.scenarioStep) return false;
              return !m.read;
            }).length;
            return (
              <div className="relative"
                onMouseEnter={() => setNotifOpen(true)}
                onMouseLeave={() => { if (!demoNotif) setNotifOpen(false); }}>
                <button onClick={() => { if (demoNotif) { setNotifOpen((o) => !o); } else { setView("inbox"); setNotifOpen(false); } }}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors relative"
                  title="Notifications">
                  <Bell className="w-[22px] h-[22px]" style={{ color: demoNotif ? C.primary : "#4B5565" }} strokeWidth={1.5} />
                  {(myUnreadCount > 0 || demoNotif) && (
                    <span className="absolute top-0 right-0 text-[10px] font-medium text-white rounded-full flex items-center justify-center"
                      style={{ backgroundColor: C.error, minWidth: 14, height: 14, padding: "0 3px" }}>
                      {demoNotif ? myUnreadCount + 1 : myUnreadCount}
                    </span>
                  )}
                  {demoNotif && (
                    <span className="absolute top-0 right-0 rounded-full animate-ping" style={{ backgroundColor: C.error, width: 14, height: 14, opacity: 0.5 }} />
                  )}
                </button>
                {notifOpen && (
                  <NotificationDropdown
                    activePersona={activePersona}
                    setActiveProjectCode={setActiveProjectCode}
                    setView={setView}
                    scenarioStep={scenarioStep}
                    demoNotif={demoNotif}
                    onDemoNotifClick={onDemoNotifClick}
                    onClose={() => setNotifOpen(false)}
                  />
                )}
              </div>
            );
          })()}

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
                style={{ backgroundColor: C.textPrimary }} />
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
            <div className="text-[10px] font-medium tracking-wide" style={{ color: C.textSecondary }}>
              Collaborators
            </div>
            <div className="text-sm font-medium mt-0.5" style={{ color: C.textPrimary }}>
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
                      <span className="text-xs font-medium" style={{ color: C.textPrimary }}>
                        {PERSONAS[m.persona]?.name}
                      </span>
                      {m.owner && (
                        <span className="text-[10px] px-1 py-0.5 rounded font-medium"
                          style={{ backgroundColor: C.warningLight, color: C.warning }}>Lead</span>
                      )}
                      {isMe && (
                        <span className="text-[10px] px-1 py-0.5 rounded font-medium"
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
            <button className="text-[12px] font-medium hover:underline" style={{ color: C.primary }}>
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
    <div style={{ backgroundColor: C.bg, minHeight: "calc(100vh - 136px)" }}>
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
        <div className="bg-white rounded-2xl overflow-hidden">
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
                  <h1 className="text-[32px] font-medium leading-10 truncate"
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
                          <span className="text-[12px] font-medium px-2 py-0.5 rounded leading-5"
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
                          className="h-9 px-4 rounded-md flex items-center gap-1.5 text-[14px] font-medium text-white transition-opacity hover:opacity-90 shadow-sm"
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
                        className="h-9 px-3 rounded-md flex items-center gap-1.5 text-[14px] font-medium border transition-colors hover:bg-gray-50"
                        style={{ borderColor: C.border, color: C.textSecondary, backgroundColor: "white" }}>
                        {a.icon && <a.icon className="w-4 h-4" />}
                        {a.label}
                        {a.badge !== undefined && a.badge !== null && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
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
            <h1 className="text-2xl font-medium leading-8 truncate"
              style={{ color: C.textPrimary, letterSpacing: "-0.01em" }}>
              {title}
            </h1>
            {starable && (
              <button onClick={onStar}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                <svg width="20" height="20" viewBox="0 0 16 16" fill={isStarred ? "#fec84b" : "none"}
                  stroke={isStarred ? "#fec84b" : "#4B5565"} strokeWidth="1.5">
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
                         onOpenChat, primaryCta, isCollapsed, setIsCollapsed, setSelectedItemId }) {
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
      ],
    },
    {
      label: "BOM",
      items: [
        { id: "bomlist", icon: Boxes, label: "BOM List", badge: null },
        {
          id: "bom", icon: GitMerge, label: "BOM Collaboration",
          badge: null, // title-line dot removed — review status is shown on the version sub-items only
          expandable: true,
        },
        { id: "collaborators", icon: UsersRound, label: "Collaborators", badge: null },
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
            <ChevronsRight className="w-[18px] h-[18px]" strokeWidth={2.25} />
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
                      const needsReview = hasIssue || bom.lifecycle === "review";
                      return (
                        <button key={bom.id}
                          onClick={() => { if (!isDisabled && setActiveBom) { setActiveBom(bom.id); if (setSelectedItemId) setSelectedItemId(null); } }}
                          disabled={isDisabled}
                          className="w-8 h-7 rounded flex items-center justify-center text-[10px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed relative"
                          style={{
                            backgroundColor: isBomActive ? C.primary : "transparent",
                            color: isBomActive ? "white" : C.textSecondary,
                            opacity: isDisabled ? 0.4 : 1,
                          }}
                          onMouseEnter={(e) => { if (!isBomActive && !isDisabled) e.currentTarget.style.backgroundColor = C.bg; }}
                          onMouseLeave={(e) => { if (!isBomActive) e.currentTarget.style.backgroundColor = "transparent"; }}
                          title={`${bom.name}${hasIssue ? ` · ${bom.missing} missing` : ""}`}>
                          {bom.id}
                          {(needsReview || bom.reviewSev === "block") && !isBomActive && (
                            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: bom.reviewSev === "block" ? C.error : C.warning }} />
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
      style={{ width: 260 }}>
      <div className="flex flex-col gap-4 pb-4">
      {/* === HEADER === */}
      <div className="px-5 pt-4 flex flex-col gap-3 relative">
        {/* Collapse toggle — equal inset (top/right 12px), icon centered for equal padding all around */}
        <button
          onClick={() => setIsCollapsed && setIsCollapsed(true)}
          className="absolute top-3 right-3 w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
          title="Collapse sidebar (⌘B)"
          style={{ color: C.textSecondary }}>
          <ChevronsLeft className="w-[18px] h-[18px]" strokeWidth={2.25} />
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
          <span className="text-[12px] font-medium px-2 py-0.5 rounded-full leading-4 border"
            style={{
              backgroundColor: "white",
              color: priorityConfig.color,
              borderColor: priorityConfig.color,
            }}
            title={`${priorityConfig.label} Priority`}>
            {priorityConfig.label}
          </span>
          {/* D-day — filled only when urgent (≤ 7 days), otherwise outlined */}
          <span className="text-[12px] font-medium px-2 py-0.5 rounded-full leading-4 border"
            style={{
              backgroundColor: dDay <= 7 ? ddayColor : "white",
              color: dDay <= 7 ? "white" : ddayColor,
              borderColor: ddayColor,
            }}>
            D-{dDay}
          </span>
          {/* Phase — primary color chip (matches list & info phase chips) */}
          <span className="text-[12px] font-medium px-2.5 py-0.5 rounded-full leading-4"
            style={{
              backgroundColor: C.primaryLight,
              color: C.primary,
            }}>
            {project.phase}
          </span>
        </div>

        {/* Title + Code */}
        <div className="flex flex-col gap-0.5">
          <div className="text-[20px] font-medium leading-7 tracking-tight" style={{ color: C.textPrimary }}>
            {project.name}
          </div>
          <div className="text-[12px] tabular-nums" style={{ color: C.textSecondary }}>
            {project.code}
          </div>
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
                    ? () => { setView("bom"); setBomExpanded(true); if (setSelectedItemId) setSelectedItemId(null); }
                    : undefined}
                />
                {/* BOM Collaboration sub-items */}
                {item.id === "bom" && bomExpanded && (
                  <div className="flex flex-col mt-0.5 mb-0.5 ml-2 pl-3 border-l"
                    style={{ borderColor: C.border }}>
                    {getBomListByPhase(project.phase, project.isNew).map((bom) => {
                      const isBomActive = view === "bom" && activeBom === bom.id;
                      const hasIssue = bom.syncDelta > 0 || bom.missing > 0;
                      const needsReview = hasIssue || bom.lifecycle === "review"; // under review = needs attention
                      const isNotCreated = bom.status === "not_created";
                      const isNotStarted = bom.status === "not_started";
                      const isDisabled = isNotCreated;
                      return (
                        <button key={bom.id}
                          onClick={() => {
                            if (isDisabled) return;
                            setView("bom");
                            if (setActiveBom) setActiveBom(bom.id);
                            if (setSelectedItemId) setSelectedItemId(null);
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
                          title={isNotCreated ? `${bom.name} not yet created` : isNotStarted ? `${bom.name} promoted, awaiting owner` : (bom.syncNote || (bom.lifecycle === "review" ? `${bom.name} · under review` : `${bom.name} · sync OK`))}>
                          <span className={`text-[12px] flex-1 min-w-0 truncate ${isBomActive ? "font-medium" : "font-normal"}`}
                            style={{ color: isBomActive ? C.primary : (isDisabled ? C.textDisabled : C.textPrimary) }}>
                            {bom.label}
                          </span>
                          {isNotCreated ? (
                            <span className="text-[10px] shrink-0 italic" style={{ color: C.textDisabled }}>
                              not created
                            </span>
                          ) : isNotStarted ? (
                            <span className="text-[10px] shrink-0 italic" style={{ color: C.warning }}>
                              awaiting
                            </span>
                          ) : (
                            <>
                              <span className="text-[10px] tabular-nums shrink-0"
                                style={{ color: isBomActive ? C.primary : C.textDisabled, opacity: isBomActive ? 0.8 : 1 }}>
                                {bom.version}
                              </span>
                              <span className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ backgroundColor: bom.reviewSev === "block" ? C.error : (needsReview ? C.warning : C.success) }} />
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
            <div className="text-[10px] font-medium tracking-wide" style={{ color: C.textSecondary }}>
              Collaborators
            </div>
            <div className="text-sm font-medium mt-0.5" style={{ color: C.textPrimary }}>
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
                        <span className="text-xs font-medium" style={{ color: C.textPrimary }}>
                          {PERSONAS[m.persona]?.name}
                        </span>
                        {m.owner && (
                          <span className="text-[10px] px-1 py-0.5 rounded font-medium"
                            style={{ backgroundColor: C.warningLight, color: C.warning }}>Lead</span>
                        )}
                        {isMe && (
                          <span className="text-[10px] px-1 py-0.5 rounded font-medium"
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
                <div className="text-xs font-medium" style={{ color: C.primary }}>
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
          { label: "Top Cost Driver", value: "Display Driver IC" },
        ]},
        { label: "Actions Required", items: [
          { label: "Negotiate Display Driver IC price", done: false },
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
          { part: "Display Driver IC", supplier: "Triton Semiconductor", level: "Lv3", status: "In Review" },
          { part: "Camera Module", supplier: "Kestrel", level: "Lv3", status: "Submitted" },
          { part: "Mainboard 5G", supplier: "Atlas Manufacturing", level: "Lv2", status: "Submitted" },
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
            <div className="text-[10px] font-medium tracking-wide mb-1"
              style={{ color: C.textSecondary }}>
              {project.phase} Phase Action
            </div>
            <div className="text-lg font-medium mb-1" style={{ color: C.textPrimary }}>
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
              <div className="text-[10px] font-medium tracking-wide mb-2"
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
                      <span className="font-medium"
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
                      <span className="text-[12px] font-medium" style={{ color: C.textPrimary }}>
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
                        <div className="text-xs font-medium" style={{ color: C.textPrimary }}>
                          {p.part}
                        </div>
                        <div className="text-[10px]" style={{ color: C.textSecondary }}>
                          {p.supplier} · PPAP {p.level}
                        </div>
                      </div>
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full"
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
          <div className="text-[12px]" style={{ color: C.textDisabled }}>
            {project.code} · {project.phase} Phase
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose}
              className="px-4 py-2 rounded-md text-xs font-medium border hover:bg-gray-50 transition-colors"
              style={{ borderColor: C.border, color: C.textSecondary }}>
              Cancel
            </button>
            <button onClick={onConfirm}
              className="px-4 py-2 rounded-md text-xs font-medium text-white hover:opacity-90 transition-opacity inline-flex items-center gap-1.5"
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
        <span className={`text-[14px] leading-5 ${isActive ? "font-medium" : "font-normal"}`}
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
            className="text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0"
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
    <div className="p-6" style={{ backgroundColor: C.bg, minHeight: "calc(100vh - 136px)" }}>
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
            <h1 className="text-[32px] font-medium leading-10 truncate"
              style={{ color: C.textPrimary, letterSpacing: "-0.01em" }}>
              Mentions & Approval Requests
            </h1>
            <div className="text-sm mt-1 flex items-center gap-1.5 flex-wrap" style={{ color: C.textSecondary }}>
              <span>Across all projects, items addressed to</span>
              <PersonaAvatar p={activePersona} size={16} />
              <span className="font-medium" style={{ color: C.primary }}>
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
              <span className="text-[10px] tracking-wide font-medium"
                style={{ color: filter === f.id ? f.color : C.textSecondary }}>
                {f.label}
              </span>
            </div>
            <div className="text-2xl font-medium" style={{ color: f.color }}>{f.count}</div>
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
                backgroundColor: !m.read ? "#fcfcfd" : "white",
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
                  <span className="text-sm font-medium" style={{ color: C.textPrimary }}>
                    {PERSONAS[m.from]?.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                    style={{
                      backgroundColor: m.type === "approval" ? C.warningLight : C.infoLight,
                      color: m.type === "approval" ? C.warning : C.info,
                    }}>
                    {m.type === "approval" ? "Approvals" : "@Mentions"}
                  </span>
                  <span className="text-[12px]" style={{ color: C.textSecondary }}>
                    {m.projectName}
                  </span>
                  <span className="text-[12px] ml-auto shrink-0" style={{ color: C.textDisabled }}>
                    {m.time}
                  </span>
                </div>
                <div className={`text-sm mb-1.5 ${!m.read ? "font-medium" : "font-medium"}`}
                  style={{ color: C.textPrimary }}>
                  {m.title}
                </div>
                <div className="text-xs leading-relaxed mb-2" style={{ color: C.textSecondary }}>
                  {m.snippet}
                </div>
                {m.itemRef && (
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[12px] border"
                    style={{ borderColor: C.border, color: C.textSecondary, backgroundColor: C.bg }}>
                    <Box className="w-3 h-3" />
                    <span className="tabular-nums">{m.itemRef.partId}</span>
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
function NotificationDropdown({ activePersona, setActiveProjectCode, setView, scenarioStep, onClose, demoNotif = false, onDemoNotifClick = null }) {
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
          <span className="text-sm font-medium" style={{ color: C.textPrimary }}>Notifications</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
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
        {demoNotif && (
          <button onClick={() => { setActiveProjectCode(ACTIVE_PROJECT_CODE); onDemoNotifClick && onDemoNotifClick(); onClose(); }}
            className="w-full flex items-start gap-2.5 px-4 py-3 text-left border-b hover:bg-gray-50"
            style={{ borderColor: C.border, backgroundColor: C.primarySoft }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: C.primaryLight }}>
              <Package className="w-4 h-4" style={{ color: C.primary }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-xs font-medium truncate" style={{ color: C.textPrimary }}>Triton Semiconductor</span>
                <span className="text-[10px] px-1 py-0.5 rounded font-medium" style={{ backgroundColor: C.infoLight, color: C.info }}>Proposal</span>
                <span className="text-[10px] ml-auto shrink-0" style={{ color: C.textDisabled }}>now</span>
              </div>
              <div className="text-xs font-medium mb-0.5" style={{ color: C.textPrimary }}>Proposed an alternative second-source part (Display Driver IC)</div>
              <div className="text-[10px] truncate" style={{ color: C.textSecondary }}>Smartphone NPI · {ACTIVE_PROJECT_CODE}</div>
            </div>
            <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: C.primary }} />
          </button>
        )}
        {myInbox.length === 0 ? (
          demoNotif ? null : (
          <div className="p-8 text-center text-xs" style={{ color: C.textSecondary }}>
            No new notifications.
          </div>
          )
        ) : (
          myInbox.map((m, idx) => (
            <button key={m.id} onClick={() => onItemClick(m)}
              className="w-full flex items-start gap-2.5 px-4 py-3 text-left border-b hover:bg-gray-50"
              style={{
                borderColor: C.border,
                borderBottomWidth: idx === myInbox.length - 1 ? 0 : 1,
                backgroundColor: !m.read ? "#fcfcfd" : "white",
              }}>
              <PersonaAvatar p={m.from} size={28} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-xs font-medium truncate" style={{ color: C.textPrimary }}>
                    {PERSONAS[m.from]?.name}
                  </span>
                  <span className="text-[10px] px-1 py-0.5 rounded font-medium"
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
              <h2 className="text-[18px] font-medium" style={{ color: C.textPrimary }}>
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
              <div className="text-xs font-medium mb-2 tracking-wide"
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
                      <div className="tabular-nums text-[12px]" style={{ color: C.textPrimary }}>
                        {p.partId}
                      </div>
                      <div className="text-[10px] truncate" style={{ color: C.textSecondary }}>
                        {p.desc}
                      </div>
                    </div>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0"
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
  const [selectedRows, setSelectedRows] = useState([]); // selected project codes
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
    <div style={{ backgroundColor: C.bg, minHeight: "calc(100vh - 136px)" }}>
      <PageHeader
        breadcrumbs={[
          { label: "Home", onClick: () => setView("projects") },
          { label: "Design-to-Source" },
          { label: "Design to Source Project" },
        ]}
        title="Design to Source Project"
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

      <div className="px-6 pb-6" style={{ marginTop: -4 }}>
      {/* Unified content box — radius 24 (rounded-2xl) */}
      <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: C.border, borderRadius: 24 }}>

      {/* (1) Filter bar section — 24px horizontal padding */}
      <div className="px-6 py-3 flex items-center gap-x-5 gap-y-3 flex-wrap">
        {/* Search (project) — dropdown-style field with trailing icon */}
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <div className="relative w-full">
            <input type="text" placeholder="Search by project name, code, or product..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-3 pr-9 rounded-md border text-[12px] outline-none focus:outline-none focus-visible:ring-2"
              style={{ borderColor: C.border, color: C.textPrimary, backgroundColor: "white" }} />
            <Search className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.textDisabled }} />
          </div>
        </div>
        {/* Phase */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] shrink-0" style={{ color: C.textSecondary }}>Phase</span>
          <div className="relative" style={{ width: 160 }}>
            <select value={phaseFilter} onChange={(e) => setPhaseFilter(e.target.value)}
              className="w-full h-9 pl-3 pr-8 rounded-md border text-[12px] appearance-none bg-white outline-none focus:outline-none focus-visible:ring-2"
              style={{ borderColor: C.border, color: C.textPrimary }}>
              <option value="all">All Phases</option>
              {PHASES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.textSecondary }} />
          </div>
        </div>
        {/* Priority */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] shrink-0" style={{ color: C.textSecondary }}>Priority</span>
          <div className="relative" style={{ width: 140 }}>
            <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full h-9 pl-3 pr-8 rounded-md border text-[12px] appearance-none bg-white outline-none focus:outline-none focus-visible:ring-2"
              style={{ borderColor: C.border, color: C.textPrimary }}>
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="med">Medium</option>
              <option value="low">Low</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.textSecondary }} />
          </div>
        </div>
        {/* Right cluster: Sort + Search button + icons */}
        <div className="ml-auto flex items-center gap-3">
          <div className="relative" style={{ width: 170 }}>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="w-full h-9 pl-3 pr-8 rounded-md border text-[12px] appearance-none bg-white outline-none focus:outline-none focus-visible:ring-2"
              style={{ borderColor: C.border, color: C.textPrimary }}>
              <option value="priority">Sort: Urgency</option>
              <option value="phaseDays">Sort: Phase D-day</option>
              <option value="readiness">Sort: Readiness</option>
              <option value="name">Sort: Name</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.textSecondary }} />
          </div>
          <button className="h-9 px-6 rounded-full text-[12px] font-medium border transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2"
            style={{ borderColor: C.primary, color: C.primary, backgroundColor: "white" }}>
            Search
          </button>
        </div>
      </div>

      {/* (2) Status count chips section — chips wrapped in a pill container (radius 1000), 24px side margin */}
      <div className="flex items-center px-6 py-3" style={{ borderColor: C.borderLight }}>
        <div className="flex items-center gap-1 p-1" style={{ backgroundColor: C.surfaceTinted, borderRadius: 1000 }}>
          {[
            { id: "onTrack", label: "On Track", count: totals.onTrack },
            { id: "atRisk", label: "At Risk", count: totals.atRisk },
            { id: "blocked", label: "Blocked", count: totals.blocked },
          ].map((chip, i, arr) => {
            const isActive = statusFilter === chip.id;
            return (
              <React.Fragment key={chip.id}>
                <button onClick={() => setStatusFilter(isActive ? "all" : chip.id)}
                  className="flex items-center gap-1.5 px-3.5 py-1 text-[12px] transition-colors focus:outline-none focus-visible:ring-2"
                  style={{
                    backgroundColor: isActive ? C.primary : "transparent",
                    color: isActive ? "white" : C.textSecondary,
                    borderRadius: 1000,
                  }}
                  onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "white"; }}
                  onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}>
                  <span>{chip.label}</span>
                  <span className="font-medium" style={{ color: isActive ? "white" : C.textPrimary }}>{chip.count}</span>
                </button>
                {!isActive && statusFilter !== arr[i + 1]?.id && i < arr.length - 1 && (
                  <div className="w-px h-3" style={{ backgroundColor: C.border }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        {(() => {
          const isFiltered = statusFilter !== "all" || search !== "" || phaseFilter !== "all" || priorityFilter !== "all" || sortBy !== "priority";
          const onResetAll = () => { setStatusFilter("all"); setSearch(""); setPhaseFilter("all"); setPriorityFilter("all"); setSortBy("priority"); };
          return (
            <button onClick={onResetAll} disabled={!isFiltered}
              className="ml-3 w-7 h-7 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ color: C.textSecondary }} title="Reset filters">
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          );
        })()}
      </div>

        {/* (3) Total bar — Figma list pattern (count left, table actions right) */}
        <div className="px-6 py-3 flex items-center justify-between"
          style={{ color: C.textSecondary }}>
          <div className="text-[14px] flex items-center gap-3" style={{ color: C.textPrimary }}>
            {selectedRows.length > 0 ? (
              <>
                <span className="font-medium" style={{ color: C.primary }}>{selectedRows.length} selected</span>
                <button onClick={() => setSelectedRows([])}
                  className="text-[12px] hover:underline" style={{ color: C.textSecondary }}>
                  Clear
                </button>
              </>
            ) : (
              <span>Total <span className="font-medium">{filtered.length}</span></span>
            )}
          </div>
        </div>
        <div className="overflow-auto px-6 pb-1">
          <table className="w-full text-xs">
            <thead style={{ backgroundColor: "#f2f4f7" }}>
              <tr style={{ color: C.textSecondary }}>
                <th className="text-center font-medium py-2.5 px-4 w-10 first:rounded-l-lg">
                  <input type="checkbox" className="rounded" style={{ accentColor: C.primary }}
                    checked={filtered.length > 0 && selectedRows.length === filtered.length}
                    ref={(el) => { if (el) el.indeterminate = selectedRows.length > 0 && selectedRows.length < filtered.length; }}
                    onChange={(e) => setSelectedRows(e.target.checked ? filtered.map((p) => p.code) : [])} />
                </th>
                <th className="text-left font-medium py-2.5 px-4">Project</th>
                <th className="text-left font-medium py-2.5 px-2">Owner</th>
                <th className="text-left font-medium py-2.5 px-2">Phase</th>
                <th className="text-center font-medium py-2.5 px-2">D-day</th>
                <th className="text-center font-medium py-2.5 px-2">Blocking</th>
                <th className="text-left font-medium py-2.5 px-2 w-56">Gate Readiness</th>
                <th className="text-right font-medium py-2.5 px-4 last:rounded-r-lg">TMC Gap</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const phaseIdx = PHASES.indexOf(p.phase);
                const { Icon: ProjectIcon, bg: avatarBg, iconColor: avatarIconColor } = getProjectAvatar(p);
                return (
                  <tr key={p.code} onClick={() => onOpenProject(p.code)}
                    className="cursor-pointer border-b transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                    style={{ borderColor: C.borderLight, backgroundColor: selectedRows.includes(p.code) ? C.primarySoft : "white" }}
                    onMouseEnter={(e) => { if (!selectedRows.includes(p.code)) e.currentTarget.style.backgroundColor = C.surfaceTinted; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = selectedRows.includes(p.code) ? C.primarySoft : "white"; }}
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpenProject(p.code); } }}>
                    {/* Checkbox */}
                    <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <input type="checkbox" className="rounded" style={{ accentColor: C.primary }}
                        checked={selectedRows.includes(p.code)}
                        onChange={(e) => setSelectedRows(e.target.checked ? [...selectedRows, p.code] : selectedRows.filter((c) => c !== p.code))} />
                    </td>
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
                          <div className="text-[10px] tabular-nums mt-0.5" style={{ color: C.textDisabled }}>
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
                                  <div className="text-[12px] font-medium tracking-wider" style={{ color: C.textSecondary }}>
                                    {totalCollaborators} {totalCollaborators === 1 ? "Collaborator" : "Collaborators"}
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveProjectCode(p.code);
                                      setView("collaborators");
                                    }}
                                    className="text-[10px] font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                                    style={{ color: C.textSecondary }}>
                                    View all →
                                  </button>
                                </div>

                                {/* Internal section */}
                                <div className="py-1.5">
                                  <div className="px-3 py-1 text-[10px] font-medium tracking-wider"
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
                                              <span className="text-[10px] tracking-wide px-1 py-0.5 rounded font-medium"
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
                                    <div className="px-3 py-1 text-[10px] font-medium tracking-wider"
                                      style={{ color: C.textDisabled }}>
                                      External · {externalList.length}
                                    </div>
                                    {externalList.slice(0, 3).map((c) => (
                                      <div key={`ext-${c.id}`}
                                        className="px-3 py-1.5 flex items-center gap-2 transition-colors hover:bg-gray-50">
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium text-white shrink-0"
                                          style={{ backgroundColor: c.color }}>
                                          {c.initial?.charAt(0)}
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
                    {/* Phase — primary color chip */}
                    <td className="py-3 px-2">
                      <span className="inline-flex items-center text-[12px] font-medium px-2.5 py-0.5 rounded-full"
                        style={{ backgroundColor: C.primaryLight, color: C.primary }}>
                        {p.phase}
                      </span>
                    </td>
                    {/* D-day */}
                    <td className="py-3 px-2 text-center">
                      <span className="tabular-nums font-medium text-xs"
                        style={{ color: p.phaseDays < 30 ? C.error : p.phaseDays < 60 ? C.warning : C.textSecondary }}>
                        D-{p.phaseDays}
                      </span>
                    </td>
                    {/* Blocking count + hover popover */}
                    <td className="py-3 px-2 text-center" style={{ position: "relative", overflow: "visible" }}>
                      {p.blocking > 0 ? (
                        <>
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full cursor-default transition-colors"
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
                                    <div className="text-[12px] font-medium tracking-wider" style={{ color: C.error }}>
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
                                    style={{ color: C.textSecondary }}>
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
                                          <div className="text-xs font-medium truncate" style={{ color: C.textPrimary }}>
                                            {item.partName || item.partId}
                                          </div>
                                          <div className="text-[10px] tabular-nums mt-0.5" style={{ color: C.textDisabled }}>
                                            {item.partId}
                                          </div>
                                          <div className="text-[10px] mt-0.5 leading-snug" style={{ color: C.textSecondary }}>
                                            {item.blockReason}
                                          </div>
                                        </div>
                                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0 mt-0.5"
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
                            <span className="text-xs font-medium w-9 text-right"
                              style={{ color: readinessColor }}>
                              {p.readiness}%
                            </span>
                          </div>
                        );
                      })()}
                    </td>
                    {/* TMC Gap */}
                    <td className="py-3 px-4 text-right">
                      <span className="tabular-nums font-medium text-xs"
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
              className="text-xs font-medium px-3 py-1.5 rounded-full border transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 inline-flex items-center gap-1.5"
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
function ProjectCockpit({ onOpenItem, scenarioStep, activeProjectCode, setView, activePersona, setActiveBom, setSelectedItemId }) {
  const project = PROJECTS.find((p) => p.code === activeProjectCode) || PROJECTS[0];
  const isHeroProject = project.code === ACTIVE_PROJECT_CODE;

  // Scenario operates only on Hero Project (NPI Smartphone #2)
  const isResolved = isHeroProject && scenarioStep >= 8;
  const readiness = isResolved ? 96 : project.readiness;
  const tmcGap = isResolved ? -2.1 : project.tmcGap;

  // Hero project uses BLOCKING_ITEMS scenario data; others get generic placeholder
  const blockingItems = isHeroProject ? BLOCKING_ITEMS : generateGenericBlockingItems(project);

  // Pending-decisions count — kept in sync with the actual item list for the Hero project
  // so the KPI tile, widget, and "View All" modal all agree.
  const blocking = isResolved ? 0 : (isHeroProject ? blockingItems.length : project.blocking);

  // "View All" modals for Pending Decisions & Recent Activity (keeps Overview context)
  const [decisionsModalOpen, setDecisionsModalOpen] = useState(false);
  const [activityModalOpen, setActivityModalOpen] = useState(false);

  // Recent Activity feed — shared by the widget (top 3) and the View All modal (full list).
  const recentActivity = [
    { persona: "QM", name: "Quinn R.", role: "Quality Manager", time: "29 min ago",
      bom: "Q", bomLabel: "Q-BOM",
      msg: "D-23 to the Develop Phase Gate. The Display Driver IC second source is blocked on both Cost & PPAP. Please review." },
    { persona: "SM", name: "Sam Lee", role: "Sourcing Manager", time: "28 min ago",
      bom: "C", bomLabel: "C-BOM",
      msg: "Display Module: Gorilla Glass Victus 2 — supplier capacity & pricing confirmed. PO-ready." },
    { persona: "CM", name: "Cory Chen", role: "Cost Manager", time: "29 min ago",
      bom: "C", bomLabel: "C-BOM",
      msg: "Bonding process change costed — OCA lamination adds ~$0.30/unit to should-cost." },
    { persona: "DE", name: "Dean Park", role: "Design Engineer", time: "1 hour ago",
      bom: "E", bomLabel: "E-BOM",
      msg: "Display Driver IC TX-6620 datasheet uploaded. MIPI lane-map revised — please re-validate downstream." },
    { persona: "SM", name: "Sam Lee", role: "Sourcing Manager", time: "2 hours ago",
      bom: "C", bomLabel: "C-BOM",
      msg: "Main Board 5G: second-source RFQ issued to 2 suppliers. Quotes expected within 3 days." },
    { persona: "QM", name: "Quinn R.", role: "Quality Manager", time: "3 hours ago",
      bom: "Q", bomLabel: "Q-BOM",
      msg: "Camera Module PPAP Level 3 submission received. Dimensional report under review." },
    { persona: "CM", name: "Cory Chen", role: "Cost Manager", time: "5 hours ago",
      bom: "C", bomLabel: "C-BOM",
      msg: "Battery Pack should-cost updated with new cell pricing. Gap to quoted narrowed to +$0.40." },
  ];

  // Helper: BOM tag colors for activity / decision source chips.
  const bomTintOf = (b) => ({ E: C.infoLight, C: C.warningLight, Q: "#f4eafe" }[b] || C.borderLight);
  const bomColorOf = (b) => ({ E: C.info, C: C.warning, Q: "#7c3aed" }[b] || C.textSecondary);
  const goToBom = (b) => { if (setActiveBom) setActiveBom(b); if (setSelectedItemId) setSelectedItemId(null); if (setView) setView("bom"); };

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
            <div className="text-sm font-medium mb-0.5" style={{ color: C.textPrimary }}>
              Welcome to your new project
            </div>
            <div className="text-xs" style={{ color: C.textSecondary }}>
              {project.name} is ready to start. Set up the team and upload or link your first E-BOM to begin collaboration.
            </div>
          </div>
        </div>

        {/* Onboarding checklist */}
        <div className="rounded-xl border bg-white p-5 mb-5" style={{ borderColor: C.border }}>
          <div className="text-[10px] font-medium tracking-wide mb-4" style={{ color: C.primary }}>
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
                    <span className="text-xs font-medium" style={{ color: C.textSecondary }}>{step.num}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium mb-0.5"
                    style={{ color: step.done ? C.success : C.textPrimary }}>
                    {step.title}
                  </div>
                  <div className="text-xs" style={{ color: C.textSecondary }}>
                    {step.desc}
                  </div>
                </div>
                {step.cta && (
                  <button onClick={step.action}
                    className="px-3 py-1.5 rounded-md text-xs font-medium inline-flex items-center gap-1.5 text-white shrink-0 hover:opacity-90"
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
            <div className="text-[10px] font-medium tracking-wide mb-1.5" style={{ color: C.textSecondary }}>
              Phase
            </div>
            <span className="inline-flex items-center text-[14px] font-medium px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: C.primaryLight, color: C.primary }}>
              {project.phase}
            </span>
            <div className="text-[10px] mt-1.5" style={{ color: C.textSecondary }}>D-{project.phaseDays} to next gate</div>
          </div>
          <div className="rounded-lg border bg-white p-4" style={{ borderColor: C.border }}>
            <div className="text-[10px] font-medium tracking-wide mb-1" style={{ color: C.textSecondary }}>
              Project Type
            </div>
            <div className="text-base font-medium" style={{ color: C.textPrimary }}>{project.type}</div>
            <div className="text-[10px] mt-1" style={{ color: C.textSecondary }}>{project.product}</div>
          </div>
          <div className="rounded-lg border bg-white p-4" style={{ borderColor: C.border }}>
            <div className="text-[10px] font-medium tracking-wide mb-1" style={{ color: C.textSecondary }}>
              Created
            </div>
            <div className="text-base font-medium" style={{ color: C.textPrimary }}>{project.lastUpdate}</div>
            <div className="text-[10px] mt-1" style={{ color: C.textSecondary }}>by {PERSONAS[project.pm]?.name}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-0 pb-6 pr-6 pl-0" style={{ minHeight: "100%" }}>
      {/* AI Insight Banner */}
      <div className="mb-3 p-6 rounded-2xl border flex items-start gap-3"
        style={{ backgroundColor: isResolved ? C.successLight : (blocking > 0 ? C.primarySoft : C.successLight),
                 borderColor: isResolved || blocking === 0 ? C.success : C.primaryLight }}>
        <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
          style={{ backgroundColor: isResolved || blocking === 0 ? C.success : C.primary }}>
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium mb-0.5"
            style={{ color: isResolved || blocking === 0 ? C.successDark : C.primaryDark }}>
            {isResolved
              ? `On Track for ${project.phase} Phase Gate`
              : blocking === 0
                ? `On Track for ${project.phase} Phase Gate`
                : `${project.phase} until Phase Gate D-${project.phaseDays}`}
          </div>
          <div className="text-xs" style={{ color: C.textSecondary }}>
            {isResolved
              ? `Gate Readiness ${readiness}%. Display Driver IC second-source collaboration complete. Recommend preparing for the next Phase Gate review.`
              : blocking === 0
                ? `Gate Readiness ${readiness}%. All items on track. On pace to clear the Phase Gate.`
                : `Gate Readiness ${readiness}%. ${blocking} items need attention — immediate review required.`}
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
              onOpenItem && onOpenItem(blockingItems[0].id, blockingItems[0].bom);
            } else {
              // Has blocking + non-hero: jump to BOM Coll
              setView && setView("bom");
            }
          }}
          className="text-[12px] font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 shrink-0"
          style={{ color: isResolved || blocking === 0 ? C.success : C.primary }}>
          {isResolved ? "Prepare gate review →" : blocking === 0 ? "View progress →" : "Review blockers →"}
        </button>
      </div>

      {/* KPI Row — shared Figma-style tinted cards */}
      <KpiRowFigma cards={[
        { icon: Clock, iconColor: project.phaseDays <= 25 ? C.warning : C.primary, label: "Gate Runway", value: `${project.phaseDays} days` },
        { icon: AlertTriangle, iconColor: blocking > 0 ? C.error : C.success, label: "Pending Decisions", value: `${blocking}` },
        { icon: DollarSign, iconColor: tmcGap > 0 ? C.error : tmcGap < 0 ? C.success : C.textSecondary, label: "Cost vs Target",
          value: tmcGap === 0 ? "—" : tmcGap > 0 ? `+$${tmcGap}k` : `-$${Math.abs(tmcGap)}k` },
        { icon: Users, iconColor: C.primary, label: "Suppliers",
          value: `${project.suppliers}` },
      ]} />

      {/* Row: Gate Readiness (donut + bars) + Pending Decisions list */}
      <div className="grid grid-cols-5 gap-3 mb-3">
        {/* Gate Readiness — phase */}
        <div className="col-span-2 rounded-2xl bg-white p-6">
          <div className="text-[17px] font-medium mb-2" style={{ color: C.textPrimary }}>
            Gate Readiness - {project.phase}
          </div>
          <div className="flex items-center gap-4">
            <div className="shrink-0"><ReadinessRing value={readiness} /></div>
            <div className="flex-1 flex flex-col gap-4 min-w-0">
              {subIndicators.map((g) => (
                <div key={g.label} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[14px]" style={{ color: C.textSecondary }}>
                    <span className="truncate">{g.label}</span>
                    <span className="font-medium tabular-nums shrink-0" style={{ color: C.textPrimary }}>{g.value}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#eaecf0" }}>
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${g.value}%`, backgroundColor: C.primary }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending Decisions — divider-separated rows (matches other roles) */}
        <div className="col-span-3 rounded-2xl bg-white flex flex-col">
          <div className="px-6 pt-6 pb-2 flex items-center justify-between">
            <div className="text-[17px] font-medium" style={{ color: C.textPrimary }}>Pending Decisions</div>
            {blocking > 0 && (
              <button
                onClick={() => setDecisionsModalOpen(true)}
                className="flex items-center gap-1 text-[12px] font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded"
                style={{ color: C.textSecondary }}>
                View More
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
          {blocking === 0 ? (
            <div className="text-center py-10">
              <CheckCircle className="w-12 h-12 mx-auto mb-3" style={{ color: C.success }} />
              <div className="text-sm font-medium mb-1" style={{ color: C.textPrimary }}>No pending decisions</div>
              <div className="text-xs" style={{ color: C.textSecondary }}>{project.phase} phase progressing normally</div>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: C.borderLight }}>
              {blockingItems.slice(0, 4).map((item) => (
                <div key={item.id} className="px-6 py-3 flex items-center gap-3 transition-colors hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium" style={{ color: C.textPrimary }}>
                      {item.partName || item.partId}
                    </div>
                    <div className="text-[12px] mt-0.5" style={{ color: C.textSecondary }}>
                      <span className="tabular-nums" style={{ color: C.textDisabled }}>{item.partId}</span>
                      <span style={{ color: C.borderLight }}> · </span>
                      {item.blockReason}
                    </div>
                  </div>
                  {isHeroProject && (
                    <button
                      onClick={() => onOpenItem && onOpenItem(item.id, item.bom)}
                      className="h-7 px-2.5 rounded-md border text-[12px] font-medium shrink-0 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                      style={{ borderColor: C.primary, color: C.primary, backgroundColor: "white" }}>
                      Review
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Row: Risk Summary (narrow) + Recent Activity (wide) */}
      <div className="grid grid-cols-5 gap-3">
        {/* Risk Summary */}
        <div className="col-span-2 rounded-2xl bg-white p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[17px] font-medium" style={{ color: C.textPrimary }}>Risk Summary</div>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { label: "Sole source", value: 18, target: "Target 10%", color: C.error },
              { label: "Single source", value: 24, target: "Target 15%", color: C.warning },
              { label: "Dual+", value: 58, target: "Target 75%", color: C.warning },
            ].map((r) => (
              <div key={r.label} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-[14px]">
                  <span style={{ color: C.textSecondary }}>{r.label}</span>
                  <span className="font-medium tabular-nums" style={{ color: r.color }}>{r.value}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#eaecf0" }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${r.value}%`, backgroundColor: r.color }} />
                </div>
                <span className="text-[12px]" style={{ color: C.textDisabled }}>{r.target}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="col-span-3 rounded-2xl bg-white p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[17px] font-medium" style={{ color: C.textPrimary }}>Recent Activity</div>
            <button
              onClick={() => setActivityModalOpen(true)}
              className="flex items-center gap-1 text-[12px] font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded"
              style={{ color: C.textSecondary }}>
              View More
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-col">
            {recentActivity.slice(0, 3).map((a, i) => {
              const bomTint = bomTintOf(a.bom);
              const bomColor = bomColorOf(a.bom);
              return (
                <div key={i} className="flex items-start gap-2 py-2">
                  <PersonaAvatar p={a.persona} size={32} />
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[14px] font-medium" style={{ color: C.textPrimary }}>{a.name}</span>
                      <span className="text-[10px]" style={{ color: C.textSecondary }}>{a.role}</span>
                      <span className="text-[12px]" style={{ color: C.textSecondary }}>· {a.time}</span>
                      <button
                        onClick={() => goToBom(a.bom)}
                        title={`View activity in ${a.bomLabel}`}
                        className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 shrink-0"
                        style={{ backgroundColor: bomTint, color: bomColor }}>
                        {a.bomLabel}
                      </button>
                    </div>
                    <p className="text-[14px] leading-5 mt-0.5" style={{ color: C.textPrimary }}>{a.msg}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ===== View All Modal: Pending Decisions ===== */}
      {decisionsModalOpen && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(16, 24, 40, 0.4)" }}
            onClick={() => setDecisionsModalOpen(false)} />
          <div className="fixed top-1/2 left-1/2 z-50 bg-white rounded-2xl shadow-2xl flex flex-col"
            style={{ transform: "translate(-50%, -50%)", width: "min(640px, 92vw)", maxHeight: "80vh" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: C.border }}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" style={{ color: C.error }} />
                <span className="text-[14px] font-medium" style={{ color: C.textPrimary }}>
                  Pending Decisions <span style={{ color: C.textSecondary }}>· {blockingItems.length}</span>
                </span>
              </div>
              <button onClick={() => setDecisionsModalOpen(false)}
                className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2"
                style={{ color: C.textSecondary }} title="Close">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-4 flex flex-col gap-2">
              {blockingItems.map((item) => {
                const b = item.bom || "Q";
                return (
                  <div key={item.id} className="flex items-center gap-2 px-4 py-3 rounded-xl"
                    style={{ backgroundColor: C.surfaceTinted }}>
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-[14px] font-medium" style={{ color: C.textPrimary }}>
                          {item.partName || item.partId}
                        </span>
                        <span className="text-[14px] tabular-nums" style={{ color: C.textSecondary }}>{item.partId}</span>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded self-center"
                          style={{ backgroundColor: bomTintOf(b), color: bomColorOf(b) }}>
                          {b}-BOM
                        </span>
                      </div>
                      <span className="text-[14px]" style={{ color: C.textSecondary }}>{item.blockReason}</span>
                    </div>
                    <button
                      onClick={() => { setDecisionsModalOpen(false); onOpenItem && onOpenItem(item.id, item.bom); }}
                      className="h-7 px-3 rounded border text-[12px] font-medium shrink-0 transition-colors hover:bg-white focus:outline-none focus-visible:ring-2"
                      style={{ borderColor: C.primary, color: C.primary, backgroundColor: "white" }}>
                      Review
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ===== View All Modal: Recent Activity ===== */}
      {activityModalOpen && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(16, 24, 40, 0.4)" }}
            onClick={() => setActivityModalOpen(false)} />
          <div className="fixed top-1/2 left-1/2 z-50 bg-white rounded-2xl shadow-2xl flex flex-col"
            style={{ transform: "translate(-50%, -50%)", width: "min(640px, 92vw)", maxHeight: "80vh" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b shrink-0" style={{ borderColor: C.border }}>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" style={{ color: C.primary }} />
                <span className="text-[14px] font-medium" style={{ color: C.textPrimary }}>
                  Recent Activity <span style={{ color: C.textSecondary }}>· {recentActivity.length}</span>
                </span>
              </div>
              <button onClick={() => setActivityModalOpen(false)}
                className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2"
                style={{ color: C.textSecondary }} title="Close">
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-2 flex flex-col">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-2 py-3"
                  style={{ borderBottom: i < recentActivity.length - 1 ? `1px solid ${C.borderLight}` : "none" }}>
                  <PersonaAvatar p={a.persona} size={32} />
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[14px] font-medium" style={{ color: C.textPrimary }}>{a.name}</span>
                      <span className="text-[10px]" style={{ color: C.textSecondary }}>{a.role}</span>
                      <span className="text-[12px]" style={{ color: C.textSecondary }}>· {a.time}</span>
                      <button
                        onClick={() => { setActivityModalOpen(false); goToBom(a.bom); }}
                        title={`View activity in ${a.bomLabel}`}
                        className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 shrink-0"
                        style={{ backgroundColor: bomTintOf(a.bom), color: bomColorOf(a.bom) }}>
                        {a.bomLabel}
                      </button>
                    </div>
                    <p className="text-[14px] leading-5 mt-0.5" style={{ color: C.textPrimary }}>{a.msg}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// === DE COCKPIT ===
// Design Engineer-focused dashboard:
// 5 KPIs (Pending Decisions, Spec Changes, Conflicts, New Parts, PPAP Items)
// + BOM Review Queue + Changes Submitted + DVT Validation + Process Sheet Completeness
function DeCockpit({ project, scenarioStep, isResolved, onOpenItem, setView }) {
  // ===== Mock data for DE scenario (Hero project) =====
  // BOM Review Queue: changes others submitted that DE needs to review.
  // 'blocking' items are gate-blocking and surface at the top so DE sees them immediately.
  // Every actionable row uses "Review" — the actual resolve happens in the part detail (Item360).
  const bomReviewQueue = isResolved ? [] : [
    { id: 3, partId: "EI2-I6DA-003WB", partName: "Display Driver IC AX-7421",
      meta: "Triton Semiconductor recommended by SM ($11.80, 3 quotes compared)",
      status: "supplier-review", action: "Review" },
    { id: 10, partId: "6U8-HKJJ-JRPWM", partName: "Mainboard 5G",
      meta: "Blocked: MIPI timing re-validation pending for new driver",
      status: "blocking", action: "Review" },
    { id: 7, partId: "GL2-7HKR-WA1Z3", partName: "Cover Glass Gorilla Victus 2",
      meta: "Thickness: 0.65mm → 0.70mm — CM proposed",
      status: "pending", action: "Review" },
    { id: 9, partId: "QE3-8DHV-XIRG8", partName: "Fan Module",
      meta: "Blade material: PC → PC+ABS — supplier suggested",
      status: "pending", action: "Review" },
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
        { id: "c1", title: "Display Driver IC TX-6620", meta: "Second source · CM applied · QM cleared", state: "approved" },
        { id: "c2", title: "Polarizer Film update", meta: "Material spec · All teams approved", state: "approved" },
        { id: "c3", title: "Display Module brightness", meta: "1500 nits peak · confirmed", state: "approved" },
      ]
    : [
        { id: "c1", title: "Display Driver IC TX-6620", meta: "Second source · CM negotiating supplier", state: "review" },
        { id: "c2", title: "Polarizer Film (new)", meta: "New part · RFQ pending · sourcing TBD", state: "pending" },
        { id: "c3", title: "OCA Adhesive (new)", meta: "New part · Supplier TBC", state: "pending" },
        { id: "c4", title: "Cover Glass spec", meta: "No change from Rev A — confirmed", state: "unchanged" },
      ];

  // DVT validation required (Design Verification Test items)
  const dvtItems = isResolved ? [] : [
    { id: "d1", title: "Display Driver IC 120Hz timing",
      detail: "MIPI eye-diagram & 120Hz signal-integrity validation required.",
      due: "Apr 25", urgent: true },
    { id: "d2", title: "Fan Module flow test",
      detail: "Airflow at PC+ABS blade — thermal margin re-verification.",
      due: "May 2", urgent: false },
    { id: "d3", title: "Mainboard 5G thermal",
      detail: "New driver rail draws +12% — re-run thermal scenarios.",
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

  // Status meta for review queue — only genuinely urgent states use the alert (error) color;
  // everything else stays neutral or primary. Action buttons are always primary.
  const statusMeta = {
    blocking:          { label: "Blocking",        bg: C.errorLight,   fg: C.error },
    "supplier-review": { label: "Supplier Review", bg: C.primarySoft,  fg: C.primary },
    conflict:          { label: "Conflict",        bg: C.errorLight,   fg: C.error },
    pending:           { label: "Pending",         bg: C.bg,           fg: C.textSecondary },
    accepted:          { label: "Accepted",        bg: C.bg,           fg: C.textSecondary },
  };

  return (
    <div className="pt-0 pb-6 pr-6 pl-0" style={{ minHeight: "100%" }}>
      {/* AI Banner for DE */}
      <div className="mb-3 p-6 rounded-2xl border flex items-start gap-3"
        style={{
          backgroundColor: isResolved ? C.successLight : C.primarySoft,
          borderColor: isResolved ? C.success : C.primaryLight,
        }}>
        <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
          style={{ backgroundColor: isResolved ? C.success : C.primary }}>
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium mb-0.5"
            style={{ color: isResolved ? C.successDark : C.primaryDark }}>
            {isResolved
              ? `All design reviews cleared — ${project.phase} Phase Gate ready`
              : `${pendingDecisions} decisions pending — Spec change Rev B awaiting review`}
          </div>
          <div className="text-xs" style={{ color: C.textSecondary }}>
            {isResolved
              ? "All Display Driver IC sign-offs complete. Process sheets at 95%+."
              : `${specChanges} spec deltas vs Rev A baseline. ${newParts} new parts need supplier assignment.`}
          </div>
        </div>
        <button
          onClick={() => setView && setView("bom")}
          className="text-[12px] font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 shrink-0"
          style={{ color: isResolved ? C.success : C.primary }}>
          {isResolved ? "Open BOM →" : "Open BOM workspace →"}
        </button>
      </div>

      {/* KPI Row — shared Figma-style tinted cards */}
      <KpiRowFigma cards={[
        { icon: AtSign, iconColor: pendingDecisions > 0 ? C.primary : C.success,
          label: "My Pending Decisions", value: pendingDecisions },
        { icon: GitBranch, iconColor: specChanges > 0 ? C.warning : C.success,
          label: "Spec Changes (Rev B)", value: specChanges },
        { icon: AlertTriangle, iconColor: conflicts > 0 ? C.error : C.success,
          label: "Conflicts", value: conflicts },
        { icon: Package, iconColor: newParts > 0 ? C.warning : C.success,
          label: "New Parts (No Supplier)", value: newParts },
      ]} />

      {/* Supplier submissions from SM are folded into "My BOM Review Queue" below
          (the Display Driver IC · Triton recommendation surfaces there as a Supplier Review row). */}

      {/* Row 1: BOM Status chart (1/3) + BOM Review Queue (2/3) */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {/* BOM Status distribution chart */}
        <MiniProgressCard
          title="BOM Status"
          subtitle="E-BOM parts by review state"
          headline={`${Math.round(((80 - pendingDecisions - conflicts) / 80) * 100)}%`}
          headlineSub="cleared"
          headlineColor={C.info}
          segments={[
            { label: "Approved", value: 80 - pendingDecisions - conflicts, color: C.success },
            { label: "In Review", value: pendingDecisions, color: C.info },
            { label: "Conflict", value: conflicts, color: C.error },
          ]} />
        {/* My BOM Review Queue */}
        <div className="col-span-2 rounded-2xl bg-white">
          <div className="px-6 pt-6 pb-2 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="text-[17px] font-medium" style={{ color: C.textPrimary }}>My BOM Review Queue</div>
                {(() => {
                  const blockingCount = bomReviewQueue.filter(q => q.status === "blocking").length;
                  const supplierCount = bomReviewQueue.filter(q => q.status === "supplier-review").length;
                  return (
                    <>
                      {blockingCount > 0 && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                          style={{ backgroundColor: C.errorLight, color: C.error }}>
                          <AlertTriangle className="w-3 h-3" />
                          {blockingCount} Blocking
                        </span>
                      )}
                      {supplierCount > 0 && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                          style={{ backgroundColor: C.primarySoft, color: C.primary }}>
                          <Sparkles className="w-3 h-3" />
                          {supplierCount} Supplier Review
                        </span>
                      )}
                    </>
                  );
                })()}
              </div>
              <div className="text-[12px] mt-0.5" style={{ color: C.textSecondary }}>
                Accept or keep each change submitted by collaborators
              </div>
            </div>
            <button onClick={() => setView && setView("bom")}
              className="flex items-center gap-1 text-[12px] font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded"
              style={{ color: C.textSecondary }}>
              View More
              <ChevronRight className="w-4 h-4" />
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
              {[...bomReviewQueue].sort((a, b) => {
                // Blocking first, then conflict, pending, accepted last.
                const rank = { blocking: 0, "supplier-review": 1, conflict: 2, pending: 3, accepted: 4 };
                return (rank[a.status] ?? 9) - (rank[b.status] ?? 9);
              }).slice(0, 3).map((q) => {
                const meta = statusMeta[q.status];
                const isBlocking = q.status === "blocking";
                return (
                  <div key={q.id} className="px-6 py-3 flex items-center gap-3 transition-colors hover:bg-gray-50">
                    <button
                      onClick={() => onOpenItem && onOpenItem(q.id, "E")}
                      className="flex-1 min-w-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium" style={{ color: C.textPrimary }}>{q.partName}</span>
                        <span className="text-[10px] font-medium tracking-wide px-2 py-0.5 rounded shrink-0"
                          style={{ backgroundColor: meta.bg, color: meta.fg }}>
                          {meta.label}
                        </span>
                      </div>
                      <div className="text-[12px] mt-0.5" style={{ color: isBlocking ? C.error : C.textSecondary }}>
                        <span className="tabular-nums" style={{ color: C.textDisabled }}>{q.partId}</span>
                        <span style={{ color: C.borderLight }}> · </span>
                        {q.meta}
                      </div>
                    </button>
                    {q.action && (
                      <button
                        onClick={() => onOpenItem && onOpenItem(q.id, "E")}
                        className="h-7 px-2.5 rounded-md text-[12px] font-medium border transition-colors shrink-0 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                        style={{ borderColor: C.primary, color: C.primary, backgroundColor: "white" }}>
                        {q.action}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Changes I Submitted + DVT Validation + Process Sheet (3-up) */}
      <div className="grid grid-cols-3 gap-4">
        {/* Changes I Submitted */}
        <div className="rounded-2xl bg-white">
          <div className="px-6 pt-6 pb-2">
            <div className="text-[17px] font-medium" style={{ color: C.textPrimary }}>Changes I Submitted</div>
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium" style={{ color: C.textPrimary }}>{c.title}</span>
                      <span className="text-[10px] font-medium tracking-wide px-1.5 py-0.5 rounded shrink-0"
                        style={{ backgroundColor: stateMeta.bg, color: stateMeta.fg }}>
                        {stateMeta.label}
                      </span>
                    </div>
                    <div className="text-[12px] mt-0.5" style={{ color: C.textSecondary }}>{c.meta}</div>
                  </div>
                  {stateMeta.action && (
                    <button onClick={() => setView && setView("bom")}
                      className="h-6 px-2 rounded text-[10px] font-medium border shrink-0 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                      style={{ borderColor: C.border, color: C.textPrimary, backgroundColor: "white" }}>
                      {stateMeta.action}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {/* DVT Validation Required */}
        <div className="rounded-2xl bg-white">
          <div className="px-6 pt-6 pb-2">
            <div className="text-[17px] font-medium" style={{ color: C.textPrimary }}>DVT Validation Required</div>
                      </div>
          {dvtItems.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-10 h-10 mx-auto mb-2" style={{ color: C.success }} />
              <div className="text-sm font-medium mb-1" style={{ color: C.textPrimary }}>All DVT validations complete</div>
              <div className="text-xs" style={{ color: C.textSecondary }}>No outstanding test items.</div>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: C.borderLight }}>
              {dvtItems.map((d) => {
                const urgencyMeta = d.urgent
                  ? { label: "Urgent", bg: C.errorLight, fg: C.error }
                  : { label: "Normal", bg: C.warningLight, fg: C.warning };
                return (
                  <div key={d.id} className="px-5 py-3 flex items-start gap-2 transition-colors hover:bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium" style={{ color: C.textPrimary }}>{d.title}</span>
                        <span className="text-[10px] font-medium tracking-wide px-1.5 py-0.5 rounded shrink-0"
                          style={{ backgroundColor: urgencyMeta.bg, color: urgencyMeta.fg }}>
                          {urgencyMeta.label}
                        </span>
                      </div>
                      <div className="text-[12px] mt-0.5" style={{ color: C.textSecondary }}>{d.detail}</div>
                    </div>
                    <span className="text-[12px] font-medium shrink-0"
                      style={{ color: d.due === "TBD" ? C.textDisabled : C.textSecondary }}>
                      {d.due}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Process Sheet Completeness */}
        <div className="rounded-2xl bg-white p-6" style={{ borderColor: C.border }}>
          <div className="mb-2">
            <div className="text-[17px] font-medium" style={{ color: C.textPrimary }}>Process Sheet Completeness</div>
                      </div>
          <div className="space-y-3.5">
            {processSheets.map((p) => (
              <div key={p.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span style={{ color: C.textSecondary }}>{p.label}</span>
                  <span className="font-medium" style={{ color: p.color }}>{p.value}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: C.borderLight }}>
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
// + Cost Status table + RFQ Status + My Action Queue
function CmCockpit({ project, scenarioStep, isResolved, onOpenItem, setView }) {
  // ===== Mock data — Cost reconciliation rows (Hero project parts) =====
  // Hero scenario step 4+: should-cost computed; step 6+: RFQ responses in; step 7+: Lumina awarded
  const costRows = isResolved
    ? [
        { id: 2,  part: "Display Module 6.7\"",      target: 41.50, quoted: 40.20, should: 40.80, gap: -1.30, status: "aligned" },
        { id: 3,  part: "Display Driver IC AX-7421",  target: 11.80, quoted: 11.80, should: 11.80, gap: +0.00, status: "aligned", isHero: true },
        { id: 6,  part: "Touch Controller IC",       target: 4.20,  quoted: 4.10,  should: 4.05,  gap: -0.10, status: "aligned" },
        { id: 4,  part: "Polarizer Film",            target: 1.80,  quoted: 1.75,  should: 1.78,  gap: -0.05, status: "aligned" },
        { id: 5,  part: "OCA Adhesive",              target: 0.95,  quoted: 0.92,  should: 0.94,  gap: -0.03, status: "aligned" },
        { id: 10, part: "Mainboard 5G",              target: 28.00, quoted: 27.40, should: 27.90, gap: -0.60, status: "aligned" },
      ]
    : [
        { id: 2,  part: "Display Module 6.7\"",      target: 41.50, quoted: 40.20, should: 40.80, gap: -1.30, status: "aligned" },
        { id: 3,  part: "Display Driver IC AX-7421",  target: 11.80, quoted: scenarioStep >= 6 ? 11.80 : null, should: scenarioStep >= 4 ? 11.80 : null,
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
    { id: "r3", part: "Display Driver IC — alt", meta: "Apex $12.10 / Triton Semiconductor $11.80 / Ironwood $12.10", state: "progress", urgent: false },
  ];

  // ===== My action queue (CM-specific actions) =====
  const actionQueue = isResolved ? [] : [
    { id: "a0", title: "Display Driver IC — Final cost roll-up requested",
      meta: "From Dean Park · 5 min ago · Design Validation complete (Rev B locked). Triton Semiconductor at $11.80 — verify and confirm.",
      status: "mention", action: "Review",
      mentionFrom: "DE", partId: 3, partName: "Display Driver IC AX-7421" },
    { id: "a1", title: "Resolve Display Driver IC cost",  meta: "Quoted $11.80 vs Should $11.80 — verify supplier capability", status: "conflict", action: "Resolve" },
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
    mention:  { label: "From DE",  bg: C.primarySoft,  fg: C.primary, border: C.primary },
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
    <div className="pt-0 pb-6 pr-6 pl-0" style={{ minHeight: "100%" }}>
      {/* KPI Row — shared Figma-style tinted cards */}
      <KpiRowFigma cards={[
        { icon: DollarSign, iconColor: parseFloat(shouldVsQuotedGap) > 0 ? C.error : C.success,
          label: "Should vs Quoted Gap",
          value: `${parseFloat(shouldVsQuotedGap) >= 0 ? "+" : "−"}$${Math.abs(parseFloat(shouldVsQuotedGap)).toFixed(2)}` },
        { icon: Target, iconColor: validShould.length < costRows.length ? C.warning : C.success,
          label: "Should-cost Coverage", value: shouldCoverage },
        { icon: Send, iconColor: rfqOutstanding > 0 ? C.warning : C.success,
          label: "RFQ Outstanding", value: rfqOutstanding },
        { icon: AlertTriangle, iconColor: costConflicts > 0 ? C.error : C.success,
          label: "Cost Conflicts", value: costConflicts },
      ]} />

      {/* Row: Cost breakdown chart (1/3) + Cost Status table (2/3) */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {/* Cost comparison chart — Target vs Quoted vs Should-cost */}
        <MiniProgressCard
          title="Cost Position"
          subtitle="Total BOM, Rev B"
          headline={`$${totalCost.toFixed(0)}`}
          headlineSub={`${parseFloat(totalGap) >= 0 ? "+" : "−"}$${Math.abs(parseFloat(totalGap)).toFixed(0)} vs target`}
          headlineColor={parseFloat(totalGap) > 0 ? C.error : C.success}
          mode="compare"
          unit="$"
          segments={[
            { label: "Target", value: Math.round(targetTotal), color: C.textSecondary },
            { label: "Quoted", value: Math.round(totalCost), color: parseFloat(totalGap) > 0 ? C.error : C.success },
            { label: "Should-cost", value: Math.round(targetTotal * 0.98), color: C.info },
          ]} />
        {/* Cost Status Table (read-only summary; editing happens in C-BOM workspace) */}
        <div className="col-span-2 rounded-2xl bg-white overflow-hidden">
          <div className="px-6 pt-6 pb-2 flex items-center justify-between">
            <div>
              <div className="text-[17px] font-medium" style={{ color: C.textPrimary }}>Cost Status — Rev B</div>
            </div>
            <button onClick={() => setView && setView("bom")}
              className="flex items-center gap-1 text-[12px] font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded"
              style={{ color: C.textSecondary }}>
              View More
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        <table className="w-full">
          <thead>
            <tr style={{ color: C.textDisabled, borderBottom: `1px solid ${C.borderLight}` }}>
              <th className="text-left font-medium text-[10px] tracking-wider py-2.5 px-5">Part</th>
              <th className="text-right font-medium text-[10px] tracking-wider py-2.5 px-3">Target</th>
              <th className="text-right font-medium text-[10px] tracking-wider py-2.5 px-3">Quoted</th>
              <th className="text-right font-medium text-[10px] tracking-wider py-2.5 px-3">Should-cost</th>
              <th className="text-right font-medium text-[10px] tracking-wider py-2.5 px-3">Gap vs Target</th>
              <th className="text-left font-medium text-[10px] tracking-wider py-2.5 px-5 w-32">Status</th>
            </tr>
          </thead>
          <tbody>
            {costRows.map((r) => {
              const meta = reconStatusMeta[r.status] || reconStatusMeta.reconciling;
              return (
                <tr key={r.id}
                  onClick={() => onOpenItem && onOpenItem(r.id)}
                  className="cursor-pointer transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2"
                  style={{ borderBottom: `1px solid ${C.borderLight}` }}>
                  <td className="py-2.5 px-5 text-[13px] font-medium"
                    style={{ color: C.textPrimary }}>
                    {r.part}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[13px] tabular-nums" style={{ color: C.textPrimary }}>
                    {fmt(r.target)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[13px] tabular-nums" style={{ color: r.quoted !== null ? C.textPrimary : C.textDisabled }}>
                    {fmt(r.quoted)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[13px] tabular-nums" style={{ color: r.should !== null ? C.textPrimary : C.textDisabled }}>
                    {fmt(r.should)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[13px] tabular-nums font-medium" style={{ color: gapColor(r.gap) }}>
                    {fmtGap(r.gap)}
                  </td>
                  <td className="py-2.5 px-5">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded inline-block"
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
      </div>

      {/* Row: RFQ Status (1/2) + My Action Queue (1/2) */}
      <div className="grid grid-cols-2 gap-3">
        {/* RFQ Status */}
        <div className="rounded-2xl bg-white">
          <div className="px-6 pt-6 pb-2">
            <div className="text-[17px] font-medium" style={{ color: C.textPrimary }}>RFQ Status</div>
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
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium" style={{ color: C.textPrimary }}>{r.part}</div>
                    <div className="text-[12px] mt-0.5" style={{ color: C.textSecondary }}>{r.meta}</div>
                  </div>
                  <span className="text-[12px] font-medium shrink-0"
                    style={{ color: r.state === "open" ? C.error : C.warning }}>
                    {r.state === "open" ? "Open" : "In progress"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Action Queue */}
        <div className="rounded-2xl bg-white">
          <div className="px-6 pt-6 pb-2">
            <div className="text-[17px] font-medium" style={{ color: C.textPrimary }}>My Action Queue</div>
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
                const isMention = a.status === "mention";
                const handleClick = () => {
                  if (isMention && a.partId && onOpenItem) {
                    onOpenItem(a.partId, "C", { tab: "procurement" });
                  } else if (setView) {
                    setView("bom");
                  }
                };
                return (
                  <div key={a.id} className="px-6 py-3 flex items-center gap-3 transition-colors hover:bg-gray-50">
                    {isMention && (
                      <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                        style={{ backgroundColor: C.primarySoft, color: C.primary }}>
                        <AtSign className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <button onClick={handleClick}
                      className="flex-1 min-w-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium" style={{ color: C.textPrimary }}>{a.title}</span>
                        <span className="text-[10px] font-medium tracking-wide px-2 py-0.5 rounded shrink-0"
                          style={{ backgroundColor: meta.bg, color: meta.fg }}>
                          {meta.label}
                        </span>
                      </div>
                      <div className="text-[12px] mt-0.5" style={{ color: isMention ? C.textPrimary : C.textSecondary }}>{a.meta}</div>
                    </button>
                    <button onClick={handleClick}
                      className="h-7 px-2.5 rounded-md text-[12px] font-medium border transition-colors shrink-0 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                      style={{ borderColor: C.primary, color: C.primary, backgroundColor: "white" }}>
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
    { id: "amoled", name: "Display Driver IC",  source: "Market Intel",  pos: 70, price: "$12/unit",  ytd: "+2%",  trend: "up",   risk: "med"  },
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
    { id: "a1", title: "Display Driver IC — sole source risk (incumbent EOL)",
      meta: "Lumina selected. Recommend qualifying secondary supplier.",
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
    <div className="pt-0 pb-6 pr-6 pl-0" style={{ minHeight: "100%" }}>
      {/* KPI Row — shared Figma-style tinted cards */}
      <KpiRowFigma cards={[
        { icon: AtSign, iconColor: itemsNeedingInput > 0 ? C.error : C.success,
          label: "Items Needing GCM Input", value: itemsNeedingInput },
        { icon: AlertTriangle, iconColor: soleSourcePct > 10 ? C.error : C.success,
          label: "Sole Source Items", value: soleSourceCount },
        { icon: Layers, iconColor: geoExposure > 35 ? C.error : C.success,
          label: "China Geo Exposure", value: `${geoExposure}%` },
        { icon: GitMerge, iconColor: altSourcingActive > 0 ? C.info : C.success,
          label: "Alt Sourcing Active", value: altSourcingActive },
      ]} />

      {/* Row: Sourcing mix chart (1/3) + Market Commodities (2/3) */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {/* Sourcing mix — single vs dual vs multi source */}
        <MiniProgressCard
          title="Sourcing Mix"
          subtitle="80 parts by supplier coverage"
          headline={`${soleSourcePct}%`}
          headlineSub="sole-source"
          headlineColor={soleSourcePct > 10 ? C.error : C.success}
          segments={[
            { label: "Sole source", value: soleSourceCount, color: C.error },
            { label: "Dual source", value: altSourcingActive + 12, color: C.warning },
            { label: "Multi source", value: 80 - soleSourceCount - (altSourcingActive + 12), color: C.success },
          ]} />
        {/* Market Commodities */}
        <div className="col-span-2 rounded-2xl bg-white">
          <div className="px-6 pt-6 pb-2 flex items-center justify-between">
            <div>
              <div className="text-[17px] font-medium" style={{ color: C.textPrimary }}>
                Market Commodities
              </div>
                        </div>
          <button onClick={() => setView && setView("bom")}
            className="flex items-center gap-1 text-[12px] font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded"
            style={{ color: C.textSecondary }}>
            View More
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 pb-3">
          <div className="grid grid-cols-2 gap-x-8">
            {commodities.map((c, i) => {
              const riskMeta = { high: { label: "High", bg: C.errorLight, fg: C.error }, med: { label: "Med", bg: C.warningLight, fg: C.warning }, low: { label: "Low", bg: C.successLight, fg: C.success } }[c.risk] || { label: c.risk, bg: C.bg, fg: C.textSecondary };
              return (
                <div key={c.id} className="flex items-center gap-2.5 py-2"
                  style={{ borderTop: i >= 2 ? `1px solid ${C.borderLight}` : undefined }}>
                  {/* Name + source — stacked */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium truncate" style={{ color: C.textPrimary }}>{c.name}</div>
                    <div className="text-[10px]" style={{ color: C.textDisabled }}>{c.source}</div>
                  </div>
                  {/* Price + YTD */}
                  <div className="text-right shrink-0">
                    <div className="text-[12px] tabular-nums font-medium" style={{ color: C.textPrimary }}>{c.price}</div>
                    <div className="text-[11px] font-medium inline-flex items-center gap-0.5 justify-end" style={{ color: ytdColor(c.trend) }}>
                      {c.trend === "up" ? <TrendingUp className="w-3 h-3" /> : c.trend === "down" ? <TrendingDown className="w-3 h-3" /> : null}
                      {c.ytd}
                    </div>
                  </div>
                  {/* Risk — status badge */}
                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0"
                    style={{ backgroundColor: riskMeta.bg, color: riskMeta.fg }}>
                    {riskMeta.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        </div>
      </div>

      {/* Row: SSS Risk Dashboard (1/2) + My GCM Action Queue (1/2) */}
      <div className="grid grid-cols-2 gap-3">
        {/* SSS Risk Dashboard */}
        <div className="rounded-2xl bg-white">
          <div className="px-6 pt-6 pb-2 flex items-center justify-between">
            <div>
              <div className="text-[17px] font-medium" style={{ color: C.textPrimary }}>SSS Risk Dashboard</div>
                          </div>
            <button onClick={() => setView && setView("bom")}
              className="flex items-center gap-1 text-[12px] font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded"
              style={{ color: C.textSecondary }}>
              View More
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="px-5 py-5 space-y-4">
            {sssRisk.map((r) => (
              <div key={r.label}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span style={{ color: C.textSecondary }}>{r.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium" style={{ color: r.color }}>{r.value}%</span>
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
        <div className="rounded-2xl bg-white">
          <div className="px-6 pt-6 pb-2">
            <div className="text-[17px] font-medium" style={{ color: C.textPrimary }}>My GCM Action Queue</div>
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
                  <div key={a.id} className="px-6 py-3 flex items-center gap-3 transition-colors hover:bg-gray-50">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium" style={{ color: C.textPrimary }}>{a.title}</div>
                      <div className="text-[12px] mt-0.5" style={{ color: C.textSecondary }}>{a.meta}</div>
                    </div>
                    <span className="text-[10px] font-medium tracking-wide px-2 py-0.5 rounded shrink-0"
                      style={{ backgroundColor: meta.bg, color: meta.fg }}>
                      {meta.label}
                    </span>
                    <button
                      onClick={() => setView && setView("bom")}
                      className="h-7 px-2.5 rounded-md text-[12px] font-medium transition-colors shrink-0 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                      style={{
                        border: meta.filled ? "none" : `1px solid ${C.primary}`,
                        color: meta.filled ? "white" : C.primary,
                        backgroundColor: meta.filled ? C.primary : "white",
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
    <div className="rounded-2xl bg-white p-6 mb-5" style={{ borderColor: C.border }}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="text-[17px] font-medium" style={{ color: C.textPrimary }}>APQP Program Timeline</div>
                  </div>
        <div className="flex items-center gap-3 text-[10px]" style={{ color: C.textSecondary }}>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: C.success }} />Complete</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: C.info }} />Active</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: C.textDisabled }} />Pending</span>
        </div>
      </div>
      <div className="relative">
        <div className="flex justify-between text-[10px] tabular-nums mb-1 pl-44" style={{ color: C.textDisabled }}>
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
                  <div className="text-[10px] font-medium" style={{ color: color }}>
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
          <div className="absolute -top-3 -left-4 text-[10px] font-medium px-1.5 py-0.5 rounded whitespace-nowrap"
            style={{ backgroundColor: C.primary, color: "white" }}>
            Today
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
  // For Hero: Display Driver IC + EOL/cost issues
  const pcrRows = isResolved
    ? [
        { id: 3,  code: "BPM-DIS-DDIC", part: "Display Driver IC AX-7421 — second source", de: "done", sqe: "done", cm: "done", status: "approved" },
        { id: 2,  code: "BPM-DIS-MODULE", part: "Display Module 6.7\" — brightness 1500 nits", de: "done", sqe: "done", cm: "done", status: "approved" },
        { id: 10, code: "BPM-MNB-5G",     part: "Mainboard 5G — risk re-assessment", de: "done", sqe: "done", cm: "done", status: "approved" },
        { id: 4,  code: "BPM-DIS-POLZR",  part: "Polarizer Film — material spec", de: "done", sqe: "done", cm: "done", status: "approved" },
      ]
    : [
        { id: 3,  code: "BPM-DIS-DDIC", part: "Display Driver IC AX-7421 — second source",
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
        { id: 3,  part: "Display Driver IC (Triton Semiconductor)",   ppapLevel: 3, progress: 100, state: "complete" },
        { id: 2,  part: "Display Module (Aurora)",  ppapLevel: 3, progress: 100, state: "complete" },
        { id: 10, part: "Mainboard 5G (Aurora)",    ppapLevel: 3, progress: 95,  state: "complete" },
        { id: 6,  part: "Touch Controller IC (Triton Semiconductor)", ppapLevel: 2, progress: 92, state: "complete" },
        { id: 4,  part: "Polarizer Film (Polaris)",    ppapLevel: 2, progress: 100, state: "complete" },
      ]
    : [
        { id: 10, part: "Mainboard 5G (Aurora Foundry)", ppapLevel: 3, progress: 65, state: "in-progress" },
        { id: 3,  part: "Display Driver IC (Triton Semiconductor)",        ppapLevel: 3, progress: 12, state: "in-progress" },
        { id: 2,  part: "Display Module (Aurora)",       ppapLevel: 3, progress: 100, state: "complete" },
        { id: 11, part: "Battery Cell 5000mAh",           ppapLevel: 3, progress: 0,  state: "not-started" },
        { id: 12, part: "Camera Module 200MP",            ppapLevel: 2, progress: 0,  state: "not-started" },
      ];

  // ===== DVT Open Issues =====
  const dvtIssues = isResolved ? [] : [
    { id: "d1", title: "Display Driver IC — 120Hz timing validation",
      detail: "Touch latency & color accuracy. Apr 28.",
      due: "Apr 28", urgent: true },
    { id: "d2", title: "Mainboard 5G — thermal scenario",
      detail: "New driver rail draws +12% — re-run May 5.",
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
      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium border"
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
    <div className="pt-0 pb-6 pr-6 pl-0" style={{ minHeight: "100%" }}>
      {/* KPI Row — shared Figma-style tinted cards */}
      <KpiRowFigma cards={[
        { icon: ShieldCheck, iconColor: ppapItemsOpen > 0 ? C.error : C.success,
          label: "PPAP Items Open", value: ppapItemsOpen },
        { icon: AtSign, iconColor: pcrRequiringSqe > 0 ? C.warning : C.success,
          label: "PCR Requiring SQE", value: pcrRequiringSqe },
        { icon: AlertTriangle, iconColor: dvtIssuesOpen > 0 ? C.error : C.success,
          label: "DVT Issues Open", value: dvtIssuesOpen },
        { icon: Package, iconColor: newPartsNoPpap > 0 ? C.error : C.success,
          label: "New Parts (No PPAP)", value: newPartsNoPpap },
      ]} />

      {/* Row: PPAP progress chart (1/3) + PCR Tracker (2/3) */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {/* PPAP progress — complete vs in-progress vs not-started */}
        {(() => {
          const done = ppapStatus.filter(p => p.state === "complete").length;
          const prog = ppapStatus.filter(p => p.state === "in-progress").length;
          const not = ppapStatus.filter(p => p.state === "not-started").length;
          const tot = done + prog + not || 1;
          const pct = Math.round((done / tot) * 100);
          return (
            <MiniProgressCard
              title="PPAP Progress"
              subtitle={`${ppapStatus.length} tracked parts`}
              headline={`${pct}%`}
              headlineSub="complete"
              headlineColor={pct >= 80 ? C.success : pct >= 50 ? C.warning : C.error}
              segments={[
                { label: "Complete", value: done, color: C.success },
                { label: "In progress", value: prog, color: C.warning },
                { label: "Not started", value: not, color: C.error },
              ]} />
          );
        })()}
        {/* PCR Tracker */}
        <div className="col-span-2 rounded-2xl bg-white">
          <div className="px-6 pt-6 pb-2 flex items-center justify-between">
            <div>
              <div className="text-[17px] font-medium" style={{ color: C.textPrimary }}>
                PCR Tracker — Cross-functional SSOT
              </div>
                          </div>
          <button onClick={() => setView && setView("bom")}
            className="flex items-center gap-1 text-[12px] font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded"
            style={{ color: C.textSecondary }}>
            View More
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr style={{ color: C.textDisabled, borderBottom: `1px solid ${C.borderLight}` }}>
              <th className="text-left font-medium text-[10px] tracking-wider py-2.5 px-5 w-40">Code</th>
              <th className="text-left font-medium text-[10px] tracking-wider py-2.5 px-3">Part & Change</th>
              <th className="text-left font-medium text-[10px] tracking-wider py-2.5 px-5 w-32">Status</th>
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
                  <td className="py-3 px-5 text-xs tabular-nums" style={{ color: C.textDisabled }}>
                    {r.code}
                  </td>
                  <td className="py-3 px-3 text-[13px] font-medium" style={{ color: C.textPrimary }}>
                    {r.part}
                  </td>
                  <td className="py-3 px-5">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded inline-block"
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
      </div>

      {/* Row: PPAP Status (1/2) + DVT Open Issues (1/2) */}
      <div className="grid grid-cols-2 gap-3">
        {/* PPAP Status */}
        <div className="rounded-2xl bg-white">
          <div className="px-6 pt-6 pb-2">
            <div className="text-[17px] font-medium" style={{ color: C.textPrimary }}>PPAP Status</div>
                      </div>
          <div className="divide-y" style={{ borderColor: C.borderLight }}>
            {ppapStatus.map((p) => (
              <div key={p.id} className="px-5 py-3 transition-colors hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <div className="text-sm font-medium" style={{ color: C.textPrimary }}>{p.part}</div>
                    <div className="text-[12px] mt-0.5" style={{ color: C.textSecondary }}>
                      PPAP Level {p.ppapLevel} · {p.progress}%
                    </div>
                  </div>
                  <span className="text-[12px] font-medium ml-2 shrink-0"
                    style={{ color: p.state === "complete" ? C.success : p.state === "in-progress" ? C.warning : C.textDisabled }}>
                    {ppapStateLabel(p.state)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DVT Open Issues */}
        <div className="rounded-2xl bg-white">
          <div className="px-6 pt-6 pb-2">
            <div className="text-[17px] font-medium" style={{ color: C.textPrimary }}>DVT Open Issues</div>
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
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium" style={{ color: C.textPrimary }}>{d.title}</div>
                    <div className="text-[12px] mt-0.5" style={{ color: C.textSecondary }}>{d.detail}</div>
                  </div>
                  <span className="text-[12px] font-medium shrink-0"
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
      <div className="text-2xl font-medium tracking-tight" style={{ color: C.textPrimary }}>{value}</div>
      <div className="text-[12px] mt-0.5" style={{ color: C.textDisabled }}>{sub}</div>
    </div>
  );
}

// === KpiRowFigma — shared Overview KPI row (Figma style: 48px tinted icon box + label/value) ===
// cards: [{ icon, iconColor, label, value }] — exactly 4 recommended.
// Tints cycle through the Figma accent palette (purple / cyan / rose / yellow).
const KPI_TINTS = ["#f9f5ff", "#ecfdff", "#fff1f3", "#fefbe8"];
function KpiRowFigma({ cards }) {
  return (
    <div className="grid grid-cols-4 gap-3 mb-3">
      {cards.map((k, i) => {
        const Icon = k.icon;
        return (
          <div key={k.label} className="bg-white flex items-start gap-4 p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: k.iconColor ? `${k.iconColor}1A` : (k.tint || KPI_TINTS[i % KPI_TINTS.length]) }}>
              <Icon className="w-6 h-6" style={{ color: k.iconColor }} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] font-medium leading-4" style={{ color: C.textSecondary }}>{k.label}</span>
              <span className="text-[24px] font-medium leading-8" style={{ color: C.textPrimary }}>{k.value}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}


function ReadinessRing({ value }) {
  const r = 58;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  const color = value >= 90 ? C.success : value >= 70 ? C.warning : C.error;
  return (
    <div className="relative" style={{ width: 150, height: 150 }}>
      <svg width="150" height="150" className="-rotate-90">
        <circle cx="75" cy="75" r={r} fill="none" stroke={C.borderLight} strokeWidth="9" />
        <circle cx="75" cy="75" r={r} fill="none" stroke={color} strokeWidth="9"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="text-[34px] font-medium" style={{ color }}>{value}%</span>
        <span className="text-[11px]" style={{ color: C.textSecondary }}>Ready</span>
      </div>
    </div>
  );
}

// === MiniProgressCard — shared role-specific progress chart for Overview (KPI lower-left) ===
// title: card title; subtitle: small caption; headline/headlineSub: big metric on top;
// segments: [{ label, value, color }] rendered as a horizontal stacked bar + legend.
// If `mode` === "compare", segments are drawn as separate full-width bars (for value comparison).
function MiniProgressCard({ title, subtitle, headline, headlineSub, headlineColor, segments, mode = "stack", unit = "" }) {
  const total = segments.reduce((s, x) => s + (x.value || 0), 0) || 1;
  const maxVal = Math.max(...segments.map((s) => s.value || 0), 1);
  return (
    <div className="p-6 rounded-2xl bg-white flex flex-col">
      <div className="text-[17px] font-medium" style={{ color: C.textPrimary }}>{title}</div>
      {subtitle && <div className="text-[12px] mt-0.5 mb-3" style={{ color: C.textSecondary }}>{subtitle}</div>}

      {headline !== undefined && (
        <div className="flex items-baseline gap-1.5 mt-1 mb-3">
          <span className="text-[32px] font-medium leading-none tabular-nums" style={{ color: headlineColor || C.textPrimary }}>{headline}</span>
          {headlineSub && <span className="text-[12px]" style={{ color: C.textSecondary }}>{headlineSub}</span>}
        </div>
      )}

      {mode === "stack" ? (
        <>
          {/* Horizontal stacked bar */}
          <div className="h-2 rounded-full overflow-hidden flex" style={{ backgroundColor: C.borderLight }}>
            {segments.map((s, i) => (
              <div key={i} className="h-full transition-all duration-500"
                style={{ width: `${((s.value || 0) / total) * 100}%`, backgroundColor: s.color }}
                title={`${s.label}: ${s.value}`} />
            ))}
          </div>
          {/* Legend */}
          <div className="mt-3 space-y-1.5">
            {segments.map((s, i) => (
              <div key={i} className="flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                  <span className="truncate" style={{ color: C.textSecondary }}>{s.label}</span>
                </div>
                <span className="tabular-nums font-medium shrink-0" style={{ color: C.textPrimary }}>
                  {s.value}{unit}
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Compare mode — each segment is its own labeled bar */
        <div className="space-y-2.5 mt-1">
          {segments.map((s, i) => (
            <div key={i}>
              <div className="flex justify-between text-[12px] mb-1">
                <span style={{ color: C.textSecondary }}>{s.label}</span>
                <span className="tabular-nums font-medium" style={{ color: s.color }}>{unit}{s.value}</span>
              </div>
              <div className="h-2 rounded-full" style={{ backgroundColor: C.borderLight }}>
                <div className="h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((s.value || 0) / maxVal) * 100}%`, backgroundColor: s.color }} />
              </div>
            </div>
          ))}
        </div>
      )}
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
        <div className="space-y-6">
          {/* Phase Milestones — moved to top for at-a-glance progress overview */}
          <div>
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
                      <div className="text-[12px] font-medium" style={{ color: isActive ? C.primary : C.textPrimary }}>
                        {ms.phase}
                      </div>
                      <div className="text-[10px]" style={{ color: C.textSecondary }}>{fmtDate(ms.date)}</div>
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
          <div>
            {/* Core Objective */}
            <div className="mb-4 p-3 rounded-md" style={{ backgroundColor: C.bg }}>
              <div className="text-[10px] font-medium tracking-wide mb-1" style={{ color: C.textSecondary }}>
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
                  <div className="text-[10px] font-medium tracking-wide mb-0.5"
                    style={{ color: C.textSecondary }}>
                    {row.label}
                  </div>
                  <div className={row.mono ? "tabular-nums" : ""}
                    style={{ color: C.textPrimary }}>
                    {row.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shared Files */}
          <div>
            <div className="px-3 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-[16px] font-medium" style={{ color: C.textPrimary }}>
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
            <div className="px-3 py-2 flex items-center gap-1 flex-wrap">
              {fileFilters.map((f) => (
                <button key={f.id} onClick={() => setFileFilter(f.id)}
                  className="px-2.5 py-1 rounded text-[12px] font-medium transition-colors hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
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
                <div key={f.id} className="px-3 py-3 rounded-md hover:bg-gray-50 flex items-center gap-3 cursor-pointer">
                  <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
                    style={{ backgroundColor: C.bg }}>
                    <FileText className="w-5 h-5" style={{ color: fileIconColor(f.type) }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium truncate" style={{ color: C.textPrimary }}>
                      {f.name}
                    </div>
                    <div className="text-[10px] mt-1 flex items-center gap-1.5" style={{ color: C.textSecondary }}>
                      <span>{f.size}</span>
                      <span style={{ color: C.textDisabled }}>·</span>
                      <span className="tabular-nums">{f.version}</span>
                      <span style={{ color: C.textDisabled }}>·</span>
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
    "Lumina Display": "#1570ef",
    "Aurora Display": "#532df6",
    "Vega Optronics": "#039855",
    "Polaris Films": "#dc6803",
    "Meridian Korea": "#1570ef",
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
            <div className="text-sm font-medium" style={{ color: C.textPrimary }}>Supplier Details</div>
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
                <div className="text-lg font-medium" style={{ color: C.textPrimary }}>{supplier.name}</div>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full inline-flex items-center gap-1"
                  style={{ backgroundColor: C.primaryLight, color: C.primary }}>
                  <ShieldCheck className="w-3 h-3" />
                  {supplier.badge}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[12px] mt-1 flex-wrap" style={{ color: C.textSecondary }}>
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
            <div className="text-[12px] leading-relaxed" style={{ color: C.primary }}>{supplier.summary}</div>
          </div>
        </div>

        {/* Purchase History — combo chart (bar + line) */}
        <div className="px-6 pt-4 pb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium" style={{ color: C.textPrimary }}>Purchase History</div>
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
          <div className="text-[10px] font-medium tracking-wider mb-2" style={{ color: C.textSecondary }}>
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
                      <td className="py-1.5 px-3 text-[12px] font-medium" style={{ color: C.textPrimary }}>{item.category}</td>
                      <td className="py-1.5 px-3"></td>
                      <td className="py-1.5 px-3 text-[12px] text-right font-medium tabular-nums" style={{ color: C.textPrimary }}>
                        {item.amount.toLocaleString()}
                      </td>
                      <td className="py-1.5 px-3 text-[12px] text-right font-medium tabular-nums"
                        style={{ color: item.rate >= 0 ? C.success : C.error }}>
                        {item.rate >= 0 ? "+" : ""}{item.rate.toFixed(1)}%
                      </td>
                    </tr>
                    {item.parts.map((p) => (
                      <tr key={p.name} style={{ borderTop: `1px solid ${C.borderLight}` }}>
                        <td className="py-1.5 px-3 text-[12px] pl-6" style={{ color: C.textPrimary }}>{p.name}</td>
                        <td className="py-1.5 px-3 text-[12px]" style={{ color: C.textSecondary }}>{p.spec}</td>
                        <td className="py-1.5 px-3 text-[12px] text-right tabular-nums" style={{ color: C.textSecondary }}>
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
          <div className="text-[10px] font-medium tracking-wider mb-2" style={{ color: C.textSecondary }}>
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
                    <td className="py-1.5 px-3 text-[12px]" style={{ color: C.textPrimary }}>{row.year}</td>
                    <td className="py-1.5 px-3 text-[12px]" style={{ color: C.textPrimary }}>{row.org}</td>
                    <td className="py-1.5 px-3 text-[12px] text-right tabular-nums" style={{ color: C.textSecondary }}>{row.requests}</td>
                    <td className="py-1.5 px-3 text-[12px] text-right tabular-nums" style={{ color: C.textSecondary }}>{row.bids}</td>
                    <td className="py-1.5 px-3 text-[12px] text-right tabular-nums" style={{ color: C.textPrimary }}>{row.bidRate}%</td>
                    <td className="py-1.5 px-3 text-[12px] text-right tabular-nums" style={{ color: C.textPrimary }}>{row.awards}</td>
                    <td className="py-1.5 px-3 text-[12px] text-right tabular-nums font-medium"
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

  // Areas shown as their own permission columns in the table header (Files/Decisions stay implicit).
  const PERM_COLUMNS = [
    { id: "ebom", label: "E-BOM" },
    { id: "cbom", label: "C-BOM" },
    { id: "qbom", label: "Q-BOM" },
  ];

  // Renders a single per-area permission as plain status text (read-only look): Edit / View / —
  const PermissionCell = ({ level }) => {
    if (level === "edit") {
      return (
        <span className="text-[12px] font-medium" title="Edit access" style={{ color: C.primary }}>Edit</span>
      );
    }
    if (level === "view") {
      return (
        <span className="text-[12px]" title="View-only access" style={{ color: C.textSecondary }}>View</span>
      );
    }
    return (
      <span className="text-[12px]" title="No access" style={{ color: C.textDisabled }}>—</span>
    );
  };

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
    <div className="p-6 space-y-3" style={{ minHeight: "100%" }}>
      {/* === Title + actions row === */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-[20px] font-medium" style={{ color: C.textPrimary }}>Collaborators</h1>
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
      <div className="rounded-xl bg-white overflow-hidden">
        <div className="px-1 py-1 flex items-center justify-between">
          <div className="text-[12px] font-medium" style={{ color: C.textSecondary }}>
            Internal · {filteredInternal.length}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead style={{ backgroundColor: "#f2f4f7" }}>
              <tr style={{ color: C.textSecondary, borderBottom: `1px solid ${C.border}` }}>
                <th className="text-center font-medium py-2 pl-4 pr-1 w-10">
                  <input type="checkbox" className="rounded" style={{ accentColor: C.primary }}
                    checked={filteredInternal.length > 0 && filteredInternal.every(c => selectedIds.has(`int-${c.persona}`))}
                    onChange={(e) => {
                      const ids = filteredInternal.map(c => `int-${c.persona}`);
                      toggleGroup(ids, !e.target.checked);
                    }} />
                </th>
                <th className="text-left font-medium py-2 px-3 w-32">Name</th>
                <th className="text-left font-medium py-2 px-3 w-28">Role</th>
                <th className="text-left font-medium py-2 px-3 w-44">Organization</th>
                <th className="text-center font-medium py-2 px-2 w-16">E-BOM</th>
                <th className="text-center font-medium py-2 px-2 w-16">C-BOM</th>
                <th className="text-center font-medium py-2 px-2 w-16">Q-BOM</th>
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
                    <td className="py-2 pl-4 pr-1 text-center">
                      <input type="checkbox" checked={isSelected} onChange={() => toggleId(memberId)} className="rounded" style={{ accentColor: C.primary }} />
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center gap-1.5">
                        <PersonaAvatar p={c.persona} size={18} />
                        <span className="text-[12px] font-medium" style={{ color: C.textPrimary }}>{meta.name}</span>
                        {c.owner && (
                          <span className="text-[10px] font-medium px-1 py-0.5 rounded"
                            style={{ backgroundColor: C.primary, color: "white" }}>Owner</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-[12px]" style={{ color: C.textPrimary }}>{c.role}</td>
                    <td className="py-2 px-3 text-[12px]" style={{ color: C.textPrimary }}>{orgLabel}</td>
                    {PERM_COLUMNS.map(area => (
                      <td key={area.id} className="py-2 px-2 text-center">
                        <PermissionCell level={perms[area.id] || "none"} />
                      </td>
                    ))}
                    <td className="py-2 px-3 text-[12px] tabular-nums" style={{ color: C.textSecondary }}>
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
                <tr><td colSpan={10} className="py-8 text-center text-[12px]" style={{ color: C.textDisabled }}>No internal members.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* === EXTERNAL TABLE === */}
      <div className="rounded-xl bg-white overflow-hidden">
        <div className="px-1 py-1 flex items-center justify-between">
          <div className="text-[12px] font-medium" style={{ color: C.textSecondary }}>
            External · {filteredExternal.length}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead style={{ backgroundColor: "#f2f4f7" }}>
              <tr style={{ color: C.textSecondary, borderBottom: `1px solid ${C.border}` }}>
                <th className="text-center font-medium py-2 pl-4 pr-1 w-10">
                  <input type="checkbox" className="rounded" style={{ accentColor: C.primary }}
                    checked={filteredExternal.length > 0 && filteredExternal.every(c => selectedIds.has(`ext-${c.id}`))}
                    onChange={(e) => {
                      const ids = filteredExternal.map(c => `ext-${c.id}`);
                      toggleGroup(ids, !e.target.checked);
                    }} />
                </th>
                <th className="text-left font-medium py-2 px-3 w-32">Name</th>
                <th className="text-left font-medium py-2 px-3 w-28">Role</th>
                <th className="text-left font-medium py-2 px-3 w-44">Organization</th>
                <th className="text-center font-medium py-2 px-2 w-16">E-BOM</th>
                <th className="text-center font-medium py-2 px-2 w-16">C-BOM</th>
                <th className="text-center font-medium py-2 px-2 w-16">Q-BOM</th>
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
                    <tr style={{ borderBottom: `1px solid ${C.borderLight}`, backgroundColor: "#fcfcfd" }}>
                      <td colSpan={10} className="py-1.5 px-3">
                        <div className="flex items-center gap-2 pl-3">
                          <button
                            onClick={() => SUPPLIER_DETAILS[company] && setSupplierProfileOpen(company)}
                            className="text-[10px] font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded inline-flex items-center gap-1"
                            style={{ color: C.textPrimary, cursor: SUPPLIER_DETAILS[company] ? "pointer" : "default" }}
                            title={SUPPLIER_DETAILS[company] ? "View supplier details" : undefined}>
                            {company}
                            <span className="font-normal" style={{ color: C.textDisabled }}>{members.length}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    {members.map((c) => {
                      const memberId = `ext-${c.id}`;
                      const isSelected = selectedIds.has(memberId);
                      const perms = permissions[memberId] || {};
                      return (
                        <tr key={memberId}
                          className="transition-colors hover:bg-gray-50"
                          style={{
                            borderBottom: `1px solid ${C.borderLight}`,
                            backgroundColor: isSelected ? C.primarySoft : "white",
                          }}>
                          <td className="py-2 pl-4 pr-1 text-center">
                            <input type="checkbox" checked={isSelected} onChange={() => toggleId(memberId)} className="rounded" style={{ accentColor: C.primary }} />
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-1.5">
                              <div className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-medium text-white shrink-0"
                                style={{ backgroundColor: c.color }}>
                                {c.initial?.charAt(0)}
                              </div>
                              <span className="text-[12px] font-medium" style={{ color: C.textPrimary }}>{c.name}</span>
                            </div>
                          </td>
                          <td className="py-2 px-3 text-[12px]" style={{ color: C.textPrimary }}>{c.role}</td>
                          <td className="py-2 px-3 text-[12px]" style={{ color: C.textPrimary }}>
                            {SUPPLIER_DETAILS[c.company] ? (
                              <button
                                onClick={(e) => { e.stopPropagation(); setSupplierProfileOpen(c.company); }}
                                className="hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 rounded text-left"
                                style={{ color: C.textPrimary }}>
                                {c.company}
                              </button>
                            ) : c.company}
                          </td>
                          {PERM_COLUMNS.map(area => (
                            <td key={area.id} className="py-2 px-2 text-center">
                              <PermissionCell level={perms[area.id] || "none"} />
                            </td>
                          ))}
                          <td className="py-2 px-3 text-[12px] tabular-nums" style={{ color: C.textSecondary }}>{c.email}</td>
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
                <tr><td colSpan={10} className="py-8 text-center text-[12px]" style={{ color: C.textDisabled }}>No external partners.</td></tr>
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
            <div className="text-[18px] font-medium leading-6" style={{ color: C.textPrimary }}>{cfg.title}</div>
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
                  <div className="text-sm font-medium" style={{ color: C.textPrimary }}>{area.label}</div>
                  <div className="text-[12px]" style={{ color: C.textSecondary }}>{area.desc}</div>
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
                            <div className="text-xs font-medium" style={{ color: isSelected ? C.primary : C.textPrimary }}>
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
            <div className="flex items-center gap-2 px-2 text-[12px]" style={{ color: C.textSecondary }}>
              <Info className="w-3 h-3 shrink-0" style={{ color: C.textDisabled }} />
              Owner permissions are locked and won't change. Existing settings for other selected users will be overwritten.
            </div>
          </div>
        ) : (
          <div className="px-6 py-4 space-y-3">
            {action === "update" && (
              <div>
                <label className="text-[12px] font-medium tracking-wide block mb-1" style={{ color: C.textSecondary }}>Subject</label>
                <input className="h-9 px-3 rounded-md border text-sm w-full outline-none focus:outline-none focus-visible:ring-2"
                  style={{ borderColor: C.border, backgroundColor: C.surfaceTinted }}
                  placeholder="e.g. Display Driver IC second source" />
              </div>
            )}
            <div>
              <label className="text-[12px] font-medium tracking-wide block mb-1" style={{ color: C.textSecondary }}>Message</label>
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
// Two modes: "internal" (Aurora employees by email/role) or "external" (supplier contacts by company)
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
        subtitle: "Invite a Aurora team member to this project",
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
            <div className="text-[18px] font-medium leading-6" style={{ color: C.textPrimary }}>{cfg.title}</div>
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
                <label className="text-[12px] font-medium tracking-wide block mb-1" style={{ color: C.textSecondary }}>Email</label>
                <input type="email"
                  placeholder="member@samsung.com"
                  className="h-9 px-3 rounded-md border text-sm w-full outline-none focus:outline-none focus-visible:ring-2"
                  style={{ borderColor: C.border, backgroundColor: C.surfaceTinted }} />
              </div>
              <div>
                <label className="text-[12px] font-medium tracking-wide block mb-1" style={{ color: C.textSecondary }}>Role</label>
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
                <label className="text-[12px] font-medium tracking-wide block mb-1" style={{ color: C.textSecondary }}>Department <span className="font-normal normal-case" style={{ color: C.textDisabled }}>(optional)</span></label>
                <input type="text"
                  placeholder="e.g. Mobile R&D, Cost Engineering"
                  className="h-9 px-3 rounded-md border text-sm w-full outline-none focus:outline-none focus-visible:ring-2"
                  style={{ borderColor: C.border, backgroundColor: C.surfaceTinted }} />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-[12px] font-medium tracking-wide block mb-1" style={{ color: C.textSecondary }}>Contact Name</label>
                <input type="text"
                  placeholder="e.g. Chen Wei"
                  className="h-9 px-3 rounded-md border text-sm w-full outline-none focus:outline-none focus-visible:ring-2"
                  style={{ borderColor: C.border, backgroundColor: C.surfaceTinted }} />
              </div>
              <div>
                <label className="text-[12px] font-medium tracking-wide block mb-1" style={{ color: C.textSecondary }}>Company</label>
                <input type="text"
                  placeholder="e.g. Lumina Display"
                  className="h-9 px-3 rounded-md border text-sm w-full outline-none focus:outline-none focus-visible:ring-2"
                  style={{ borderColor: C.border, backgroundColor: C.surfaceTinted }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-medium tracking-wide block mb-1" style={{ color: C.textSecondary }}>Email</label>
                  <input type="email"
                    placeholder="contact@company.com"
                    className="h-9 px-3 rounded-md border text-sm w-full outline-none focus:outline-none focus-visible:ring-2"
                    style={{ borderColor: C.border, backgroundColor: C.surfaceTinted }} />
                </div>
                <div>
                  <label className="text-[12px] font-medium tracking-wide block mb-1" style={{ color: C.textSecondary }}>Phone <span className="font-normal normal-case" style={{ color: C.textDisabled }}>(optional)</span></label>
                  <input type="tel"
                    placeholder="+1 ..."
                    className="h-9 px-3 rounded-md border text-sm w-full outline-none focus:outline-none focus-visible:ring-2"
                    style={{ borderColor: C.border, backgroundColor: C.surfaceTinted }} />
                </div>
              </div>
              <div>
                <label className="text-[12px] font-medium tracking-wide block mb-1" style={{ color: C.textSecondary }}>BOM Scope</label>
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
            <label className="text-[12px] font-medium tracking-wide block mb-1" style={{ color: C.textSecondary }}>Personal Message <span className="font-normal normal-case" style={{ color: C.textDisabled }}>(optional)</span></label>
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
  const [selectedBomRows, setSelectedBomRows] = useState([]); // selected BOM row ids

  // Compare BOMs modal (new — compare any two BOM versions across types)
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  // Kanban filters (Party / Collab Type)
  const [partyFilters, setPartyFilters] = useState({ internal: false, external: false });
  const [collabFilters, setCollabFilters] = useState({ design: false, cost: false, quality: false });
  // Table view status chip filter (null = all). Selected chip shows in primary color (Figma filter bar).
  const [tableStatusFilter, setTableStatusFilter] = useState(null);

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

  const onBomClick = (bom) => {
    if (bom.status !== "active") return; // Only active BOMs are clickable
    setActiveBom(bom.linkTo || bom.id);
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
          <div className="text-base font-medium mb-2" style={{ color: C.textPrimary }}>
            No BOMs Yet
          </div>
          <div className="text-sm max-w-md mx-auto mb-6" style={{ color: C.textSecondary }}>
            Start by adding the E-BOM (Engineering). Once spec is defined, C-BOM and Q-BOM can be added in parallel as each domain begins collaborating.
          </div>
          <div className="inline-flex items-center gap-2">
            <button className="px-4 py-2 rounded-md text-sm font-medium text-white inline-flex items-center gap-2 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              style={{ backgroundColor: C.primary }}>
              <Upload className="w-4 h-4" />
              Upload E-BOM
            </button>
            <button className="px-4 py-2 rounded-md text-sm font-medium border inline-flex items-center gap-2 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              style={{ borderColor: C.border, color: C.textPrimary, backgroundColor: "white" }}>
              <Link2 className="w-4 h-4" />
              Link Existing BOM
            </button>
          </div>
          <div className="mt-6 text-[12px]" style={{ color: C.textDisabled }}>
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
      parts: a.parts != null ? a.parts : null,
      status: "archived",
      lifecycle: "archived",
      missing: 0,
      syncDelta: 0,
      lastActivity: a.lastActivity || null,
      owner: a.label === "E-BOM" ? "DE" : a.label === "C-BOM" ? "CM" : "QM",
      collabType: "internal",
    })) : [];
    const tableRows = [...bomsForProject, ...(isHeroProject ? BOARD_EXTRA : []), ...archivedRows];
    // Lifecycle counts for the status chip row (Figma pattern: Draft N · In Review N · Approved N ...)
    const lcCount = (lc) => tableRows.filter(b => b.lifecycle === lc).length;
    // Rows shown in the table — narrowed when a status chip is selected.
    const displayRows = tableStatusFilter
      ? tableRows.filter(b => b.lifecycle === tableStatusFilter)
      : tableRows;
    const statusChips = [
      { id: "draft",    label: "Draft",     count: lcCount("draft") },
      { id: "review",   label: "In Review", count: lcCount("review") },
      { id: "approved", label: "Approved",  count: lcCount("approved") },
      { id: "archived", label: "Archived",  count: lcCount("archived") },
    ];
    return (
    <div>
      {/* Unified content box — radius 24 (rounded-2xl) */}
      <div className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: C.border }}>
      {/* (2) Status count chips section — Figma filter bar: selected chip = primary fill */}
      <div className="flex items-center px-6 py-3" style={{ borderColor: C.borderLight }}>
        <div className="flex items-center gap-1 p-1" style={{ backgroundColor: C.surfaceTinted, borderRadius: 1000 }}>
          {statusChips.map((chip, i) => {
            const isSelected = tableStatusFilter === chip.id;
            return (
              <React.Fragment key={chip.id}>
                <button
                  onClick={() => setTableStatusFilter(isSelected ? null : chip.id)}
                  className="flex items-center gap-1.5 px-3.5 py-1 text-[12px] transition-colors focus:outline-none focus-visible:ring-2"
                  style={{
                    color: isSelected ? "white" : C.textSecondary,
                    backgroundColor: isSelected ? C.primary : "transparent",
                    borderRadius: 1000,
                  }}
                  onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "white"; }}
                  onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = "transparent"; }}>
                  <span>{chip.label}</span>
                  <span className="font-medium" style={{ color: isSelected ? "white" : C.textPrimary }}>{chip.count}</span>
                </button>
                {!isSelected && tableStatusFilter !== statusChips[i + 1]?.id && i < statusChips.length - 1 && (
                  <div className="w-px h-3" style={{ backgroundColor: C.border }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
        <button
          onClick={() => setTableStatusFilter(null)}
          className="ml-3 w-7 h-7 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2"
          style={{ color: C.textSecondary }} title="Reset filter">
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
      {/* Inset divider (between status chips and table area) */}
      <div className="mx-6 my-3 h-px" style={{ backgroundColor: C.borderLight }} />

      {/* (3) Total count bar section */}
      <div className="flex items-center justify-between px-6 py-3">
        <div className="text-[14px] flex items-center gap-3" style={{ color: C.textPrimary }}>
          {selectedBomRows.length > 0 ? (
            <>
              <span className="font-medium" style={{ color: C.primary }}>{selectedBomRows.length} selected</span>
              <button onClick={() => setSelectedBomRows([])}
                className="text-[12px] hover:underline" style={{ color: C.textSecondary }}>
                Clear
              </button>
            </>
          ) : (
            <span>Total <span className="font-medium">{displayRows.length}</span></span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors"
            style={{ color: C.textSecondary }} title="Download">
            <Download className="w-4 h-4" />
          </button>
          <button className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors"
            style={{ color: C.textSecondary }} title="Table settings">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto px-6 pb-1">
      <table className="w-full text-[12px]">
        <thead style={{ backgroundColor: "#f2f4f7" }}>
          <tr style={{ color: C.textSecondary }}>
            <th className="text-center font-medium py-3 px-4 w-10 first:rounded-l-lg">
              <input type="checkbox" className="rounded" style={{ accentColor: C.primary }}
                checked={displayRows.length > 0 && selectedBomRows.length === displayRows.length}
                ref={(el) => { if (el) el.indeterminate = selectedBomRows.length > 0 && selectedBomRows.length < displayRows.length; }}
                onChange={(e) => setSelectedBomRows(e.target.checked ? displayRows.map((b, idx) => b.id ?? idx) : [])} />
            </th>
            <th className="text-left font-medium py-3 px-4">BOM</th>
            <th className="text-center font-medium py-3 px-4">Version</th>
            <th className="text-right font-medium py-3 px-4">Parts</th>
            <th className="text-left font-medium py-3 px-4">Last Activity</th>
            <th className="text-left font-medium py-3 px-4 w-44 last:rounded-r-lg">Status</th>
          </tr>
        </thead>
        <tbody>
          {displayRows.map((b) => {
            const hasIssue = b.syncDelta > 0 || b.missing > 0;
            const isInactive = b.status !== "active";
            const isArchived = b.status === "archived";
            // Use subtle background instead of opacity for accessibility
            const rowBg = selectedBomRows.includes(b.id) ? C.primarySoft : isArchived ? "#f2f4f7" : isInactive ? "#fcfcfd" : "white";

            return (
              <tr key={b.id}
                onClick={() => onBomClick(b)}
                className={`border-b ${b.status === "active" ? "cursor-pointer hover:bg-gray-50" : ""}`}
                style={{
                  borderColor: C.borderLight,
                  backgroundColor: rowBg,
                }}>
                {/* Checkbox */}
                <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" className="rounded" style={{ accentColor: C.primary }}
                    checked={selectedBomRows.includes(b.id)}
                    onChange={(e) => setSelectedBomRows(e.target.checked ? [...selectedBomRows, b.id] : selectedBomRows.filter((id) => id !== b.id))} />
                </td>
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
                      <div className="font-medium" style={{ color: isInactive ? C.textSecondary : C.textPrimary }}>
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
                <td className="py-3 px-4 text-center tabular-nums"
                  style={{ color: isInactive ? C.textDisabled : C.textPrimary }}>
                  {b.version}
                </td>

                {/* Parts with sync delta inline */}
                <td className="py-3 px-4 text-right">
                  {b.parts ? (
                    <div className="flex items-center justify-end gap-1.5">
                      <span className="tabular-nums" style={{ color: isInactive ? C.textDisabled : C.textPrimary }}>
                        {b.parts}
                      </span>
                      {b.missing > 0 && (
                        <span className="text-[10px] tabular-nums font-medium" style={{ color: C.warning }}>
                          ({b.missing} missing)
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="tabular-nums" style={{ color: C.textDisabled }}>—</span>
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
                    <span className="text-[12px] italic" style={{ color: C.textDisabled }}>
                      No activity yet
                    </span>
                  )}
                </td>

                {/* Status — Figma list pattern: solid-fill pill (color bg + white text), no icon.
                    Draft=neutral dark, In Review=primary, Approved=success, Archived=disabled.
                    Sync issues shown as a small warning dot before the pill. */}
                <td className="py-3 px-4 text-left">
                  {b.status === "not_created" ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); /* TODO: create flow */ }}
                      className="px-3 py-1 rounded-full text-[12px] font-medium inline-flex items-center gap-1 text-white hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                      style={{ backgroundColor: C.primary }}>
                      <Plus className="w-3 h-3" />
                      Create from M
                    </button>
                  ) : b.status === "not_started" ? (
                    <button
                      onClick={(e) => { e.stopPropagation(); /* TODO: start flow */ }}
                      className="px-3 py-1 rounded-full text-[12px] font-medium inline-flex items-center gap-1 text-white hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                      style={{ backgroundColor: C.warning }}
                      title={`${PERSONAS[b.owner]?.role} hasn't started yet`}>
                      <Play className="w-3 h-3" />
                      Start
                    </button>
                  ) : b.status === "archived" ? (
                    <span className="inline-flex items-center text-[12px] font-medium px-3 py-1 rounded-full text-white"
                      style={{ backgroundColor: C.textDisabled }}>
                      Archived
                    </span>
                  ) : (() => {
                    // Active BOM lifecycle → solid-fill pill color (Figma reference)
                    const lifecycleMeta = {
                      draft:    { label: "Draft",     bg: "#475467" },  // neutral dark (text.secondary)
                      review:   { label: "In Review", bg: C.primary },  // primary
                      approved: { label: "Approved",  bg: C.success },  // success
                    }[b.lifecycle] || { label: "Active", bg: "#475467" };
                    return (
                      <div className="inline-flex items-center gap-1.5">
                        <span className="inline-flex items-center text-[12px] font-medium px-3 py-1 rounded-full text-white"
                          style={{ backgroundColor: lifecycleMeta.bg }}>
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
      </div>
    </div>
    );
  };

  const renderKanbanView = () => {
    // Filter only active BOMs (not_created/not_started don't appear in Kanban).
    // Hero board also shows prior approved baselines + next-rev drafts (BOARD_EXTRA).
    const boardBoms = isHeroProject ? [...bomsForProject, ...BOARD_EXTRA] : bomsForProject;
    const activeBoms = boardBoms.filter(b => b.status === "active");
    // Filters: nothing selected in a group = no filter (show all for that group).
    const anyCollab = collabFilters.design || collabFilters.cost || collabFilters.quality;
    const anyParty = partyFilters.internal || partyFilters.external;
    let filteredBoms = activeBoms.filter(b => !anyCollab || collabFilters[b.collabType]);
    filteredBoms = filteredBoms.filter(b => {
      if (!anyParty) return true;
      const isExternal = (b.linkTo || b.id) === "C"; // C-BOM (and its snapshots) own supplier-facing activities
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
          dotColor={C.textSecondary}
          count={draftColumn.length}>
          {draftColumn.map((b) => (
            <KanbanCard key={b.id} bom={b} variant="draft" onClick={() => onBomClick(b)} />
          ))}
          {draftColumn.length === 0 && (
            <div className="text-center py-8 text-[12px]" style={{ color: C.textDisabled }}>
              No drafts
            </div>
          )}
        </KanbanColumn>

        {/* === IN REVIEW Column (under cross-functional review) === */}
        <KanbanColumn
          label="In Review"
          dotColor={C.info}
          count={reviewColumn.length}>
          {reviewColumn.map((b) => (
            <KanbanCard key={b.id} bom={b} variant="review" onClick={() => onBomClick(b)} />
          ))}
          {reviewColumn.length === 0 && (
            <div className="text-center py-8 text-[12px]" style={{ color: C.textDisabled }}>
              No BOMs in review
            </div>
          )}
        </KanbanColumn>

        {/* === APPROVED Column (signed off, driving downstream work) === */}
        <KanbanColumn
          label="Approved"
          dotColor={C.success}
          count={approvedColumn.length}>
          {approvedColumn.map((b) => (
            <KanbanCard key={b.id} bom={b} variant="approved" onClick={() => onBomClick(b)} />
          ))}
          {approvedColumn.length === 0 && (
            <div className="text-center py-8 text-[12px]" style={{ color: C.textDisabled }}>
              No approved BOMs
            </div>
          )}
        </KanbanColumn>

        {/* === ARCHIVED Column (superseded by newer version) === */}
        {showArchived && (
          <KanbanColumn
            label="Archived"
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
      {/* Title row — "BOM List" + Compare BOMs (title-level, like BOM Collaboration) */}
      <div className="flex items-center gap-3 mb-3">
        <h1 className="text-[20px] font-medium" style={{ color: C.textPrimary }}>BOM List</h1>
        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={() => { if (!project.isNew) setCompareModalOpen(true); }}
            disabled={project.isNew}
            className="h-8 px-3 rounded-md text-[12px] font-medium flex items-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed"
            style={{
              color: project.isNew ? C.textDisabled : C.textSecondary,
              backgroundColor: "transparent",
              opacity: project.isNew ? 0.5 : 1,
            }}
            onMouseEnter={(e) => { if (!project.isNew) e.currentTarget.style.backgroundColor = C.bg; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
            title={project.isNew ? "No previous versions to compare" : "Compare two BOM versions"}>
            <GitCompareArrows className="w-3.5 h-3.5" />
            Compare BOMs
          </button>
        </div>
      </div>

      {/* Toolbar row — view toggle (leftmost) + filters, matched to BOM workspace controls. */}
      <div className="flex items-center flex-wrap gap-3 mb-3">
        {/* View Toggle (Kanban / Table) — leftmost, visual match to tree/flat segmented toggle */}
        <div className="h-7 flex items-center gap-0.5 p-0.5 rounded-md shrink-0" style={{ backgroundColor: C.bg }}>
          {[
            { id: "kanban", label: "Kanban", icon: Columns3 },
            { id: "table", label: "Table", icon: AlignLeft },
          ].map((mode) => (
            <button key={mode.id} onClick={() => setViewMode(mode.id)}
              className="h-6 px-2 rounded text-[12px] font-medium flex items-center gap-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              style={{
                backgroundColor: viewMode === mode.id ? "white" : "transparent",
                color: viewMode === mode.id ? C.primary : C.textSecondary,
                boxShadow: viewMode === mode.id ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
              }}
              onMouseEnter={(e) => { if (viewMode !== mode.id) e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.03)"; }}
              onMouseLeave={(e) => { if (viewMode !== mode.id) e.currentTarget.style.backgroundColor = "transparent"; }}>
              <mode.icon className="w-3 h-3" />
              {mode.label}
            </button>
          ))}
        </div>

        {/* Filter pills (Kanban only) — dashboard-strip style, no status dot */}
        {viewMode === "kanban" && (() => {
          const filterPill = (leading, items, state, setState) => (
            <div className="h-7 flex items-center p-0.5 rounded-lg shrink-0" style={{ backgroundColor: C.surfaceTinted, border: `1px solid ${C.border}` }}>
              <span className="px-2 text-[10px] font-semibold tracking-wide shrink-0" style={{ color: C.textDisabled }}>{leading}</span>
              <span className="w-px h-3.5 shrink-0 mr-0.5" style={{ backgroundColor: C.border }} />
              <div className="flex items-center gap-0.5">
                {items.map((it) => {
                  const active = state[it.id];
                  return (
                    <button key={it.id} onClick={() => setState({ ...state, [it.id]: !state[it.id] })}
                      className="h-6 px-2 rounded-md inline-flex items-center transition-colors focus:outline-none focus-visible:ring-1"
                      style={{ backgroundColor: active ? "white" : "transparent", boxShadow: active ? "0 1px 2px rgba(16,24,40,0.10)" : "none" }}
                      onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.55)"; }}
                      onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = "transparent"; }}>
                      <span className="text-[11px] font-medium leading-none whitespace-nowrap" style={{ color: active ? C.primary : C.textSecondary }}>{it.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
          return (
            <>
              {filterPill("Party", [{ id: "internal", label: "Internal" }, { id: "external", label: "External" }], partyFilters, setPartyFilters)}
              {filterPill("Collab Type", [{ id: "design", label: "Design" }, { id: "cost", label: "Cost" }, { id: "quality", label: "Quality" }], collabFilters, setCollabFilters)}
            </>
          );
        })()}
      </div>

      {/* Body: Table (renders its own bordered box) or Kanban (cards only, no outer box) */}
      <div>
        {viewMode === "table" ? renderTableView() : renderKanbanView()}
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

  // Version history per BOM type. Newest first; head must equal the BOM's current version.
  // E current=v1.8, C current=v2.0, Q current=v1.5 (see BOM_LIST).
  const versionHistory = {
    E: ["v1.8", "v1.7", "v1.5", "v1.0", "v0.5"],
    C: ["v2.0", "v1.5", "v1.0"],
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
            <div className="text-[18px] font-medium leading-6" style={{ color: C.textPrimary }}>
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
            <span className="text-[10px] tracking-wider font-medium shrink-0 w-16" style={{ color: C.textDisabled }}>
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
              <span className="text-[10px] tracking-wider font-medium shrink-0 w-12" style={{ color: C.textDisabled }}>From</span>
              <select value={fromVersion} onChange={(e) => setFromVersion(e.target.value)}
                className="h-8 px-2 rounded-md border text-xs bg-white outline-none focus:outline-none focus-visible:ring-2 flex-1"
                style={{ borderColor: C.border, color: C.textPrimary }}>
                {versions.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <ArrowRight className="w-4 h-4 shrink-0" style={{ color: C.textDisabled }} />
            <div className="flex-1 flex items-center gap-2">
              <span className="text-[10px] tracking-wider font-medium shrink-0 w-8" style={{ color: C.textDisabled }}>To</span>
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
            <span><span className="tabular-nums">{fromVersion}</span> → <span className="tabular-nums">{toVersion}</span></span>
            {!isLatestVsPrevious && totalChanges === 0 && (
              <span className="ml-auto text-[12px]" style={{ color: C.textDisabled }}>
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
                <span className="text-[12px] font-medium tracking-wide" style={{ color: C.success }}>
                  Added · {effectiveDiff.added.length}
                </span>
              </div>
              <div className="border rounded-lg divide-y" style={{ borderColor: C.borderLight }}>
                {effectiveDiff.added.map((p, i) => (
                  <div key={i} className="px-3 py-2.5">
                    <div className="text-sm font-medium" style={{ color: C.textPrimary }}>{p.name}</div>
                    <div className="text-[12px] tabular-nums mt-0.5" style={{ color: C.textDisabled }}>{p.partId}</div>
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
                <span className="text-[12px] font-medium tracking-wide" style={{ color: C.warning }}>
                  Modified · {effectiveDiff.modified.length}
                </span>
              </div>
              <div className="border rounded-lg divide-y" style={{ borderColor: C.borderLight }}>
                {effectiveDiff.modified.map((p, i) => (
                  <div key={i} className="px-3 py-2.5">
                    <div className="text-sm font-medium" style={{ color: C.textPrimary }}>{p.name}</div>
                    <div className="text-[12px] tabular-nums mt-0.5" style={{ color: C.textDisabled }}>{p.partId}</div>
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
                <span className="text-[12px] font-medium tracking-wide" style={{ color: C.error }}>
                  Removed · {effectiveDiff.removed.length}
                </span>
              </div>
              <div className="border rounded-lg divide-y" style={{ borderColor: C.borderLight }}>
                {effectiveDiff.removed.map((p, i) => (
                  <div key={i} className="px-3 py-2.5">
                    <div className="text-sm font-medium line-through" style={{ color: C.textSecondary }}>{p.name}</div>
                    <div className="text-[12px] tabular-nums mt-0.5" style={{ color: C.textDisabled }}>{p.partId}</div>
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
        <span className="text-sm font-medium" style={{ color: C.textPrimary }}>{label}</span>
        <span className="text-sm font-medium tabular-nums" style={{ color: C.textSecondary }}>{count}</span>
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
  const statusColor = variant === "draft" ? C.textDisabled
    : variant === "review" ? C.warning
    : variant === "approved" ? C.success
    : (bom.collabStatus.includes("Pending") || bom.collabStatus.includes("Submitted") ? C.warning : C.success);

  return (
    <div onClick={onClick}
      className="bg-white border rounded-xl p-3 cursor-pointer hover:shadow-sm transition-shadow flex flex-col gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
      style={{ borderColor: C.border }}>
      {/* Header: BOM family + version + parties */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-sm font-medium truncate" style={{ color: C.textPrimary }}>
            {bom.label}
          </span>
          <span className="text-xs shrink-0" style={{ color: C.textDisabled }}>·</span>
          <span className="text-xs tabular-nums shrink-0" style={{ color: C.textSecondary }}>
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
          <span className="text-[12px] font-medium truncate pr-2" style={{ color: C.textSecondary }}>
            {bom.collabLabel}
          </span>
          <span className="text-[10px] tabular-nums font-medium shrink-0" style={{ color: progressColor }}>
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

      {/* CTA — lifecycle-appropriate next action (In Review cards rely on the whole-card click, no button) */}
      {variant !== "review" && (() => {
        const cta = variant === "draft"
          ? { label: "Continue Editing", icon: Edit3, filled: false }
          : { label: "Open BOM", icon: ChevronRight, filled: false };
        const Icon = cta.icon;
        return (
          <button
            onClick={(e) => { e.stopPropagation(); onClick?.(); }}
            className="w-full h-8 rounded-md text-[12px] font-medium inline-flex items-center justify-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 border"
            style={cta.filled
              ? { backgroundColor: C.primary, color: "white", borderColor: C.primary }
              : { backgroundColor: "white", color: C.textSecondary, borderColor: C.border }}
            onMouseEnter={(e) => { if (cta.filled) e.currentTarget.style.opacity = "0.9"; else e.currentTarget.style.backgroundColor = C.surfaceTinted; }}
            onMouseLeave={(e) => { if (cta.filled) e.currentTarget.style.opacity = "1"; else e.currentTarget.style.backgroundColor = "white"; }}>
            <Icon className="w-3.5 h-3.5" />
            {cta.label}
          </button>
        );
      })()}
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
          <span className="text-[10px] tabular-nums" style={{ color: C.textDisabled }}>{bom.code}</span>
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
              <div className="text-[10px] font-medium mt-1.5 mb-1" style={{ color: C.textSecondary }}>Cost</div>
              <div className="bg-gray-50 rounded-md px-2.5 py-1.5 flex items-center justify-between">
                <span className="text-[12px] font-medium" style={{ color: C.textPrimary }}>{bom.cost.ver}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] tabular-nums font-medium"
                    style={{ color: bom.cost.overTarget ? C.error : C.success }}>
                    {bom.cost.delta}
                  </span>
                  <span className="text-[12px] tabular-nums" style={{ color: C.textPrimary }}>{bom.cost.target}</span>
                </div>
              </div>
            </div>
          )}
          {/* Versions */}
          <div>
            <div className="text-[10px] font-medium mt-1 mb-1" style={{ color: C.textSecondary }}>Versions</div>
            <div className="flex flex-wrap gap-1">
              {bom.versions.map((v) => (
                <span key={v} className="text-[10px] tabular-nums px-2 py-0.5 rounded bg-gray-50"
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
// Parts that have an active collaboration thread (single source for the count, the
// grid "Collaborations" filter, the per-row badge, and the chat-list rooms).
const COLLAB_ITEM_IDS = [3, 6, 10, 5];

// Derive a concise part label from a CSV-style description.
// Convention: "FORM,NAME,SPEC1,SPEC2,…" → keep the NAME (2nd token).
// e.g. "ASSY,SMARTPHONE,6.7IN,5G,256GB" → "SMARTPHONE"; "IC,TOUCH CONTROLLER,I2C" → "TOUCH CONTROLLER".
function cleanPartLabel(desc) {
  const parts = String(desc || "").split(",").map((s) => s.trim()).filter(Boolean);
  return parts.length > 1 ? parts[1] : (parts[0] || "");
}

// Split a CSV desc into a clean part name + a spec subtext.
// Drops a leading type/category token (ASSY, IC, PANEL, GLASS, …) so the name reads like a part
// ("Display Module"), and keeps the remaining attributes as the spec line.
const PART_TYPE_TOKENS = new Set(["ASSY", "ASSM", "ASSEMBLY", "SUBASSY", "IC", "PCB", "FPCB", "FILM", "GLASS", "PANEL", "BRACKET", "CONN", "CONNECTOR", "SHEET"]);
function splitNameSpec(desc) {
  const parts = String(desc || "").split(",").map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) return { name: "", spec: "" };
  const nameIdx = (parts.length > 1 && PART_TYPE_TOKENS.has(parts[0].toUpperCase())) ? 1 : 0;
  return { name: parts[nameIdx] || parts[0], spec: parts.slice(nameIdx + 1).join(" · ") };
}

const NAME_ACRONYMS = new Set(["IC","DRAM","OCA","AP","PMIC","PCB","FPCB","HDI","UFS","NFC","ESE","SE","RF","RFFE","FEM","PA","LED","BT","WIFI","AMOLED","OLED","LCD","FHD","HD","QHD","LDS","EMI","USB","SIM","ESIM","MEMS","HIFI","SOC","TOF","OIS","UD","CPU","GPU","NPU"]);
function prettyWord(w) {
  if (!w) return w;
  const h = w.indexOf("-");
  if (h > 0 && h < w.length - 1) return w.split("-").map(prettyWord).join("-");
  const up = w.toUpperCase();
  const core = up.replace(/[^A-Z0-9]/g, "");
  if (NAME_ACRONYMS.has(up) || NAME_ACRONYMS.has(core)) return up;
  if (/[a-z]/.test(w) || /[0-9]/.test(w)) return w;
  return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
}
function prettyName(raw) { return String(raw || "").split(/\s+/).map(prettyWord).join(" "); }

// Compact MPN-style part code (e.g. "AX-7421") for the grid Part Code column. Uses an explicit
// node.code when present (hero/incumbent), otherwise derives a stable 2-letter + 4-digit code
// from the internal part id so every row reads at a consistent short length.
function shortCode(node) {
  if (!node) return null;
  if (node.code) return node.code;
  if (!node.partId) return null;
  let h = 0; const s = String(node.partId);
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  const L = "ABCDEFGHJKLMNPRSTUVWXYZ"; // no I/O/Q to avoid digit confusion
  return `${L[h % L.length]}${L[(h >>> 5) % L.length]}-${1000 + (h % 9000)}`;
}

// Manufacturing process (공법) codes for E-BOM parts. Derived deterministically from the part
// description so every leaf part carries a stable process code; assemblies have no single process.
const PROC_CODES = ["IM", "STMP", "CAST", "EXTR", "DCUT", "CBL", "MISC", "CMDITY", "VEND", "ACOST", "PAINT", "ANOD", "TRIM", "CNC", "CUT", "2STMP", "DBUR"];
function procOf(node) {
  if (!node || node.type === "ASSM") return "";        // assemblies: no single process
  if (node.proc) return node.proc;
  const d = String(node.desc || "").toUpperCase();
  if (/\bIC\b|DRIVER|CONTROLLER|DDIC|PMIC|MEMORY|PROCESSOR|CHIP|SEMICON|SENSOR/.test(d)) return "VEND";
  if (/GLASS|COVER/.test(d)) return "CUT";
  if (/FILM|POLARIZER|\bOCA\b|ADHESIVE|TAPE|GASKET/.test(d)) return "DCUT";
  if (/VAPOR CHAMBER|SHIELD|SHEET|STAMP|SPRING/.test(d)) return "STMP";
  if (/BRACKET|PLATE|MID ?FRAME|CHASSIS/.test(d)) return "CNC";
  if (/CABLE|\bFPC\b|FLEX|CONNECTOR|HARNESS|WIRE|ANTENNA/.test(d)) return "CBL";
  if (/HOUSING|ENCLOSURE|CASE|BEZEL|RESIN|PLASTIC|INJECT|BUTTON|\bKEY\b/.test(d)) return "IM";
  if (/HEAT ?SINK|RAIL|EXTRU|PROFILE/.test(d)) return "EXTR";
  if (/CAST/.test(d)) return "CAST";
  if (/PAINT|COAT/.test(d)) return "PAINT";
  if (/ANOD|ALUMINUM|MAGNESIUM/.test(d)) return "ANOD";
  if (/BATTERY|CELL|PACK|SPEAKER|\bMIC\b|MOTOR|VIBRAT|LENS|CAMERA/.test(d)) return "CMDITY";
  return PROC_CODES[Math.abs(Number(node.id) || 0) % PROC_CODES.length];
}

// Only leaf-level commodity parts that accumulate purchasing/price/quality history get the
// global Item 360 affordance — active components (ICs, sensors, panel, cell), not every part,
// and not modules/assemblies or passive hardware (fuses, labels, adhesives, cables).
const I360_REUSABLE_RE = /\bIC\b|\bSENSOR\b|\bAMOLED\b|BATTERY CELL/;
// Explicitly included high-value modules/parts (carry deep cross-project history) even though
// some are assemblies: AMOLED display module, display, OCA, polarizer, camera module, battery pack.
const I360_FORCE_RE = /AMOLED|DISPLAY MODULE|POLARIZER|\bOCA\b|CAMERA MODULE|BATTERY PACK/;
function isReusablePart(node) {
  if (!node) return false;
  const n = `${node.partName || ""} ${node.desc || ""}`.toUpperCase();
  if (I360_FORCE_RE.test(n)) return true; // explicit modules/parts
  if (node.children && node.children.length) return false; // otherwise leaf parts only
  return I360_REUSABLE_RE.test(n);
}

// Display Driver IC master item used by the demo's Item 360 scene (global record view).
const DEMO_AMOLED_I360 = { id: 3, partId: "EI2-I6DA-003WB", partName: 'Display Driver IC AX-7421', itemCode: "EI2-I6DA-003WB", desc: "IC,DISPLAY DRIVER,DDIC,MIPI-4LANE,120HZ", type: "PART" };

// Sourcing model for the flat C-BOM supplier roll-up.
// "whole": the module is bought as one assembly from a single supplier, so its leaf
// parts inherit that supplier. "consigned": the OEM direct-buys the components (e.g. the
// Mainboard silicon), so parts keep their own suppliers. DIRECT_BUY_PARTS are Buy & Sell
// parts that the OEM sources directly even inside a whole-sourced module (the hero DDIC).
const MODULE_SOURCING = { 2: "whole", 9: "whole", 20: "consigned", 30: "whole", 40: "whole" };
const DIRECT_BUY_PARTS = new Set([3]);
function effectiveSupplierOf(node, moduleOf) {
  if (!node || node.type === "ASSM") return node && node.supplier;
  const modId = moduleOf ? moduleOf[node.id] : undefined;
  const mod = (typeof BOM_TREE !== "undefined") ? BOM_TREE.find((n) => n.id === modId) : null;
  if (mod && MODULE_SOURCING[modId] === "whole" && !DIRECT_BUY_PARTS.has(node.id)) return mod.supplier;
  return node.supplier;
}

// Per-BOM dashboard category for a leaf part. Drives the status strip + its filter.
//   E-BOM: pending decision (open thread) / need review (changed or D-warn) / on track
//   C-BOM: over target / on target / savings (vs target cost)
//   Q-BOM: high / medium / low risk
function bomDashCategory(n, activeBom) {
  if (!n || n.type === "ASSM") return null;
  if (activeBom === "C") {
    if (n.id === 3) return "ontarget"; // hero resolved to target ($11.80)
    const delta = ((n.id * 7) % 9 - 4) * 0.35; // quoted − target, centered for a realistic spread
    return delta > 0.5 ? "over" : delta < -0.3 ? "savings" : "ontarget";
  }
  if (activeBom === "Q") {
    if ((n.status && n.status.Q === "block") || n.id % 11 === 10) return "high";
    if ((n.status && n.status.Q === "warn") || n.id % 4 === 1) return "med";
    return "low";
  }
  // E-BOM
  // Spec change / design flag → needs engineering review (hero DDIC replacement lands here)
  if (n.diff || (n.status && n.status.D === "warn") || n.id % 13 === 6) return "review";
  // Open cross-functional decision thread (not already a review item)
  if (COLLAB_ITEM_IDS.includes(n.id)) return "decision";
  return "ontrack";
}
// Strip metadata per BOM: [{ id, label, color, bg, hollow? }] in display order.
function bomDashItems(activeBom) {
  if (activeBom === "C") return [
    { id: "over", label: "Over", color: "#d92d20", bg: "#fee4e2" },
    { id: "ontarget", label: "On", color: "#475467", bg: "#f2f4f7", hollow: true },
    { id: "savings", label: "Savings", color: "#039855", bg: "#d1fadf" },
  ];
  if (activeBom === "Q") return [
    { id: "high", label: "High", color: "#d92d20", bg: "#fee4e2" },
    { id: "med", label: "Medium", color: "#dc6803", bg: "#fef0c7" },
    { id: "low", label: "Low", color: "#475467", bg: "#f2f4f7", hollow: true },
  ];
  return [
    { id: "review", label: "Need review", color: "#d92d20", bg: "#fee4e2" },
    { id: "decision", label: "Pending", color: "#dc6803", bg: "#fef0c7" },
    { id: "ontrack", label: "On track", color: "#039855", bg: "#d1fadf" },
  ];
}

function BomWorkspace({ selectedItemId, setSelectedItemId, scenarioStep, activePersona, activeBom, setActiveBom, onOpenItemChat, activeProjectCode, setView, pendingDetailTab, onPendingDetailTabConsumed, demoReveal = null, demoPanelTab = null, demoStepKey = null, demo = null }) {
  const project = PROJECTS.find((p) => p.code === activeProjectCode) || PROJECTS[0];
  const isHeroProject = project.code === ACTIVE_PROJECT_CODE;

  const [expandedNodes, setExpandedNodes] = useState(() => new Set(BOM_TREE.filter((n) => n.children && n.children.length > 0).map((n) => n.id)));
  const [resolved, setResolved] = useState(false); // PM approved the DDIC change → red dot clears, on track
  const [toast, setToast] = useState(null);
  const onResolve = () => {
    setResolved(true);
    setToast("Approved \u2014 Display Driver IC switched to TX-6620 (Triton Semiconductor). The part is now on track.");
    setTimeout(() => setToast(null), 5000);
  };
  // E-BOM review category with the resolved override (DDIC → on track once approved)
  const eReviewCat = (n) => (resolved && n.id === 3) ? "ontrack" : bomDashCategory(n, "E");
  const [filter, setFilter] = useState("all");
  const [drawerTab, setDrawerTab] = useState("spec");
  // Which detail-panel tab to open when a row/icon is clicked (row → Details, message icon → Chat)
  const [panelTab, setPanelTab] = useState("chat");
  const [panelTabNonce, setPanelTabNonce] = useState(0);
  const openItemPanel = (id, tab) => { setSelectedItemId(id); setPanelTab(tab); setPanelTabNonce((n) => n + 1); };

  // Demo walkthrough: each scene can pin the right-panel tab (Chat / Details / Item 360).
  // Reads demo.panelTab (passed synchronously with the scene) so it never lags a scene.
  useEffect(() => {
    const t = demo && demo.panelTab;
    if (demoStepKey && t) {
      setPanelTab(t);
      setPanelTabNonce((n) => n + 1);
    }
    /* eslint-disable-next-line */
  }, [demoStepKey]);

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
  const [moduleMenuOpen, setModuleMenuOpen] = useState(false); // header Module/Part dropdown
  const moduleBtnRef = useRef(null);

  // Process (공법) filter (E-BOM only) — null = all processes; otherwise restrict to that code.
  const [procFilter, setProcFilter] = useState(null);
  const [procMenuOpen, setProcMenuOpen] = useState(false); // header Process dropdown
  const procBtnRef = useRef(null);

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

  // Map every node to the level-2 module (root's direct child) it belongs to.
  const moduleOf = useMemo(() => {
    const byId = {}; BOM_TREE.forEach((n) => { byId[n.id] = n; });
    const root = BOM_TREE.find((n) => n.lvl === 1);
    const map = {};
    const mark = (node, modId) => {
      if (!node) return;
      map[node.id] = modId;
      (node.children || []).forEach((cid) => mark(byId[cid], modId));
    };
    (root ? root.children : []).forEach((cid) => mark(byId[cid], cid));
    return map;
  }, []);

  // Module options = the actual level-2 modules in the tree (Display Module, Fan Module, …),
  // matching the grid hierarchy — not a category-derived bucket.
  const moduleOptions = useMemo(() => {
    const byId = {}; BOM_TREE.forEach((n) => { byId[n.id] = n; });
    const root = BOM_TREE.find((n) => n.lvl === 1);
    const counts = {};
    BOM_TREE.forEach((n) => { const m = moduleOf[n.id]; if (m != null) counts[m] = (counts[m] || 0) + 1; });
    return (root ? root.children : [])
      .map((cid) => byId[cid])
      .filter(Boolean)
      .map((m) => ({ id: m.id, name: prettyName(splitNameSpec(m.desc).name), count: counts[m.id] || 0 }));
  }, [moduleOf]);

  // Process options = distinct 공법 codes present among E-BOM parts, with counts (in PROC_CODES order).
  const procOptions = useMemo(() => {
    const counts = {};
    BOM_TREE.forEach((n) => { const p = procOf(n); if (p) counts[p] = (counts[p] || 0) + 1; });
    return PROC_CODES.filter((c) => counts[c]).map((c) => ({ id: c, name: c, count: counts[c] }));
  }, []);

  // C-BOM (Category) / Q-BOM (PPAP Level) multi-select filters — parallel to E-BOM's Module.
  // Empty array = show all (default). Each item toggles independently.
  const [categoryFilter, setCategoryFilter] = useState([]); // C-BOM: selected categories
  const [ppapFilter, setPpapFilter] = useState([]);         // Q-BOM: selected PPAP levels
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const categoryOptions = useMemo(() => {
    const counts = {};
    BOM_TREE.forEach((n) => { if (n.category) counts[n.category] = (counts[n.category] || 0) + 1; });
    return Object.entries(counts).map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, []);
  const ppapOptions = useMemo(() => {
    const counts = {};
    BOM_TREE.forEach((n) => { if (n.ppap) counts[n.ppap] = (counts[n.ppap] || 0) + 1; });
    return Object.entries(counts).map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
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
    C: ["none"],
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
  const [altCompareOpen, setAltCompareOpen] = useState(false); // side-by-side alt comparison popup (from chat alt card)
  const [simAlt, setSimAlt] = useState(null); // active "simulate in BOM" candidate (from alt compare)
  // Supplier 360 panel — opened by clicking a supplier name in the C-BOM grid.
  const [supplierPanel, setSupplierPanel] = useState(null);
  // Global Item 360 popup — opened by the document icon next to a reusable part/module.
  const [item360For, setItem360For] = useState(null);
  const [i360Tab, setI360Tab] = useState("spec"); // persists across item navigation + reopen
  // Demo: scene with `item360` opens the global Item 360 popup (AMOLED); other scenes close it.
  useEffect(() => {
    if (!demo || !demo.active) return;
    setItem360For(demo.item360 ? DEMO_AMOLED_I360 : null);
    /* eslint-disable-next-line */
  }, [demoStepKey]);
  // Compare scene was removed from the demo — never auto-open the Compare panel.
  useEffect(() => {
    if (!demo || !demo.active) return;
    setCompareOpen(false);
    /* eslint-disable-next-line */
  }, [demoStepKey]);
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
    setModuleFilter(null);   // Reset module filter when switching BOM
    // NOTE: selectedItemId is intentionally NOT reset here, so deep-links from the
    // Overview (Pending Decisions "Review") can switch BOM and keep the item open.
    // Direct BOM-tab clicks (LNB / tabs) clear the selection explicitly at their call site.
  }, [activeBom]);

  // When an item is selected, default to Spec tab — unless an explicit pendingDetailTab
  // was passed (e.g. "Review Fit" from DE Overview → jump straight to Design Validation).
  useEffect(() => {
    if (!selectedItemId) return;
    if (pendingDetailTab) {
      setDrawerTab(pendingDetailTab);
      if (onPendingDetailTabConsumed) onPendingDetailTabConsumed();
    } else {
      setDrawerTab("spec");
    }
  }, [selectedItemId]);

  // Demo walkthrough: when a step requests a specific tab while the SAME part stays
  // selected (e.g. AMOLED across DE-spec → CM-cost → QM-quality), honor it directly.
  useEffect(() => {
    if (pendingDetailTab && selectedItemId) {
      setDrawerTab(pendingDetailTab);
      if (onPendingDetailTabConsumed) onPendingDetailTabConsumed();
    }
  }, [pendingDetailTab]);

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
    // "Missing" = required data gap per BOM: E=no supplier, C=no should-cost, Q=no PPAP.
    const qBomMissingIds = [3, 10, 14, 18];
    const cBomMissingIds = [3];
    const eBomMissingIds = [3, 11]; // E: parts with no supplier assigned
    const STATUS_MISSING_IDS = [9, 70];  // Fan Module, Frame + Housing
    const STATUS_BLOCKED_IDS = [3];      // Display Driver IC
    const isMissingNode = (n) => STATUS_MISSING_IDS.includes(n.id);
    const matchesFilter = (n) => {
      if (filter === "all") return true;
      if (filter === "missing") return STATUS_MISSING_IDS.includes(n.id);
      if (filter === "blocked") return STATUS_BLOCKED_IDS.includes(n.id);
      if (filter === "comments") return COLLAB_ITEM_IDS.includes(n.id);
      return true;
    };

    let result = [];

    // Dashboard strip filter — applies for every BOM (E/C/Q): review/cost/risk category
    // plus the common collaboration filters (commented / unread). OR across active chips.
    const nodeUnread = (n) => (PART_COLLABS[n.id] ? (PART_COLLABS[n.id].unread || 0) : 0);
    const matchesDash = (n) => {
      if (heatLevels === null) return true; // show all
      const cat = bomDashCategory(n, activeBom);
      if (cat != null && heatLevels.has(cat)) return true;
      // Review status is shown as a second pill on C/Q — match its chips via the E (review) lens.
      if (activeBom !== "E") {
        const rev = bomDashCategory(n, "E");
        if (rev != null && heatLevels.has(rev)) return true;
      }
      if (heatLevels.has("commented") && (n.comments || 0) > 0) return true;
      if (heatLevels.has("unread") && nodeUnread(n) > 0) return true;
      return false;
    };
    const treeMatch = (n) => matchesDash(n) && (filter === "all" || matchesFilter(n));

    if (structure === "tree") {
      // When a filter (dashboard chip or legacy) is active, build ancestor-inclusive set so tree
      // structure is preserved and matched nodes are visible regardless of expand state.
      if (heatLevels !== null || filter !== "all") {
        const matchedIds = new Set();
        const ancestorMap = {}; // childId -> parentId
        // Build ancestor map by walking BOM_TREE
        BOM_TREE.forEach((n) => {
          (n.children || []).forEach((cid) => { ancestorMap[cid] = n.id; });
        });
        // Find direct matches
        BOM_TREE.forEach((n) => {
          if (treeMatch(n)) {
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

    // Flat mode: flatten LEAF parts only (no assemblies/modules) + apply groupBy + group headers
    // Special: groupBy="module" uses the categoryToModule mapping (defined at component scope above).
    const flatNodes = BOM_TREE.filter((n) => n.type !== "ASSM").map((n) => ({
      ...n,
      lvl: 1,
      _groupKey: groupBy === "module" ? categoryToModule(n.category)
        : groupBy === "supplier" ? effectiveSupplierOf(n, moduleOf)
        : (n[groupBy] || "Unknown"),
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

    // Apply dashboard filter (flat: filter directly; tree handled above with auto-expand)
    if (heatLevels !== null) {
      if (structure === "tree") {
        const matchedIds = new Set();
        const ancestorMap = {};
        BOM_TREE.forEach((n) => { (n.children || []).forEach((cid) => { ancestorMap[cid] = n.id; }); });
        BOM_TREE.forEach((n) => {
          if (matchesDash(n)) {
            matchedIds.add(n.id);
            let pid = ancestorMap[n.id];
            while (pid !== undefined) { matchedIds.add(pid); pid = ancestorMap[pid]; }
          }
        });
        result = result.filter((n) => matchedIds.has(n.id));
      } else {
        result = result.filter((n) => n._isGroupHeader || matchesDash(n));
      }
    }

    // C-BOM: when a cost band is selected from the dashboard, sort leaf parts by Δ-vs-target (desc)
    if (activeBom === "C" && structure === "flat" && groupBy === "none" && heatLevels !== null) {
      const costDelta = (n) => {
        if (n.id === 3) return 0;
        return ((n.id * 7) % 9 - 4) * 0.35;
      };
      result = [...result].sort((a, b) => costDelta(b) - costDelta(a));
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
          if (moduleOf[n.id] === moduleFilter) {
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
          ? true
          : moduleOf[n.id] === moduleFilter);
      }
    }

    // Process (공법) filter (E-BOM only) — keep matching parts (+ ancestors in tree).
    if (activeBom === "E" && procFilter !== null) {
      const matchP = (n) => n.type !== "ASSM" && procOf(n) === procFilter;
      if (structure === "tree") {
        const ancestorMap = {};
        BOM_TREE.forEach((n) => (n.children || []).forEach((cid) => { ancestorMap[cid] = n.id; }));
        const keepIds = new Set();
        BOM_TREE.forEach((n) => {
          if (matchP(n)) {
            keepIds.add(n.id);
            let pid = ancestorMap[n.id];
            while (pid !== undefined) { keepIds.add(pid); pid = ancestorMap[pid]; }
          }
        });
        keepIds.add(1);
        result = result.filter((n) => keepIds.has(n.id));
      } else {
        result = result.filter((n) => n._isGroupHeader || matchP(n));
      }
    }

    // C-BOM (category) / Q-BOM (PPAP) multi-select filter — keep matching parts (+ ancestors in tree).
    const multiFilter = activeBom === "C" ? { field: "category", sel: categoryFilter }
                      : activeBom === "Q" ? { field: "ppap", sel: ppapFilter }
                      : null;
    if (multiFilter && multiFilter.sel.length > 0) {
      const matches = (n) => multiFilter.sel.includes(n[multiFilter.field]);
      if (structure === "tree") {
        const ancestorMap = {};
        BOM_TREE.forEach((n) => (n.children || []).forEach((cid) => { ancestorMap[cid] = n.id; }));
        const keepIds = new Set();
        BOM_TREE.forEach((n) => {
          if (matches(n)) {
            keepIds.add(n.id);
            let pid = ancestorMap[n.id];
            while (pid !== undefined) { keepIds.add(pid); pid = ancestorMap[pid]; }
          }
        });
        keepIds.add(1);
        result = result.filter((n) => keepIds.has(n.id));
      } else {
        result = result.filter((n) => n._isGroupHeader || matches(n));
      }
    }

    return result;
  }, [expandedNodes, filter, structure, groupBy, activeBom, scenarioStep, heatLevels, overlay, moduleFilter, moduleOf, categoryFilter, ppapFilter, procFilter]);

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
          <div className="text-base font-medium mb-2" style={{ color: C.textPrimary }}>
            No BOM to Collaborate On
          </div>
          <div className="text-sm max-w-md mx-auto mb-6" style={{ color: C.textSecondary }}>
            BOM Collaboration becomes active once the first BOM exists. Start with E-BOM, then C-BOM and Q-BOM follow in parallel as each domain engages.
          </div>
          <div className="inline-flex items-center gap-2">
            <button
              onClick={() => setView && setView("bomlist")}
              className="px-4 py-2 rounded-md text-sm font-medium text-white inline-flex items-center gap-2 hover:opacity-90"
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
      {/* Screen title row — active BOM name (e.g. "Engineering BOM") + version·parts chip + Compare/Timeline */}
      <div className="px-6 pt-5 pb-1.5 flex items-center gap-3">
        <h1 className="text-[20px] font-medium" style={{ color: C.textPrimary }}>{activeBomMeta.name}</h1>
        {/* Compare + Timeline — page-title level */}
        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={() => { if (!project.isNew) setCompareOpen(true); }}
            disabled={project.isNew}
            className="h-8 px-3 rounded-md text-[12px] font-medium flex items-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed"
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
            className="h-8 px-3 rounded-md text-[12px] font-medium flex items-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
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
          {/* Promote BOM — state-aware primary action (lifecycle: draft → review → approved → released) */}
          {(() => {
            // Map current BOM lifecycle state to its next promotion action.
            const promo = {
              draft:    { label: "Submit for Review", icon: Send,        disabled: false },
              review:   { label: "Approve",            icon: CheckCircle, disabled: false },
              approved: { label: "Release",            icon: GitMerge,    disabled: false },
              released: { label: "Released",           icon: CheckCircle, disabled: true },
            }[activeBomMeta.lifecycle] || { label: "Submit for Review", icon: Send, disabled: false };
            const PromoIcon = promo.icon;
            return (
              <button
                disabled={promo.disabled}
                className="h-8 px-3 rounded-md text-[12px] font-medium text-white flex items-center gap-1.5 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 hover:opacity-90 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: promo.disabled ? C.textDisabled : C.primary,
                  opacity: promo.disabled ? 0.6 : 1,
                }}
                title={promo.disabled
                  ? `${activeBomMeta.name} is already released`
                  : `${promo.label} — ${activeBomMeta.name}`}>
                <PromoIcon className="w-3.5 h-3.5" />
                {promo.label}
              </button>
            );
          })()}
        </div>
      </div>
      {/* Simulation banner — active when a second-source alt is being trial-fitted into this BOM */}
      {simAlt && (
        <div className="mx-6 mb-2 flex items-center gap-2.5 px-3 py-2 rounded-lg border" style={{ borderColor: C.primary, backgroundColor: C.primarySoft }}>
          <FlaskConical className="w-4 h-4 shrink-0" style={{ color: C.primary }} />
          <div className="min-w-0">
            <span className="text-[12px] font-semibold" style={{ color: C.primary }}>Simulating: Display Driver IC → {simAlt.code}</span>
            <span className="text-[11px] ml-1.5" style={{ color: C.textSecondary }}>{simAlt.supplier} · {simAlt.region}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] ml-1">
            <span className="px-1.5 py-0.5 rounded tabular-nums" style={{ backgroundColor: C.surface, color: simAlt.cost <= 0 ? C.success : C.error }}>{simAlt.cost <= 0 ? "−" : "+"}${Math.abs(simAlt.cost).toFixed(2)} vs target</span>
            <span className="px-1.5 py-0.5 rounded" style={{ backgroundColor: C.surface, color: simAlt.lead_ok ? C.success : C.warning }}>{simAlt.lead} {simAlt.lead_ok ? "· meets" : "· misses"}</span>
            <span className="px-1.5 py-0.5 rounded" style={{ backgroundColor: C.surface, color: C.textSecondary }}>PPAP {simAlt.ppap}</span>
          </div>
          <div className="ml-auto shrink-0 flex items-center gap-1">
            <button onClick={() => setAltCompareOpen(true)} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-colors hover:bg-white/70 focus:outline-none focus-visible:ring-2" style={{ color: C.primary }}>
              <GitCompareArrows className="w-3 h-3" />Switch item
            </button>
            <button onClick={() => setSimAlt(null)} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border transition-colors hover:bg-white" style={{ borderColor: C.primary, color: C.primary }}>
              <X className="w-3 h-3" />Exit simulation
            </button>
          </div>
        </div>
      )}
      {/* Top Action Bar — single row, all controls aligned to h-7 (28px) */}
      <div className="px-6 py-2.5 bg-white border-b flex items-center gap-3 flex-wrap" style={{ borderColor: C.border }}>
        {/* View Controls — Tree/Flat (master) · Group · Module · Heatmap */}
        <div className="flex items-center gap-1.5">
          {/* Segmented: Structure (Tree / Flat) — master control, leads the row */}
          <div className="h-7 flex items-center gap-0.5 p-0.5 rounded-md" style={{ backgroundColor: C.bg }}>
            {[
              { id: "tree", icon: GitBranch, label: "Tree" },
              { id: "flat", icon: AlignLeft, label: "Flat" },
            ].map((s) => (
              <button key={s.id} onClick={() => setStructure(s.id)}
                className="h-6 px-2 rounded text-[12px] font-medium flex items-center gap-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
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
          {/* Divider — separates the master toggle from the shaping pickers (Flat only) */}
          <div className="w-px h-5 mx-0.5" style={{ backgroundColor: C.border, display: (structure === "tree" || activeBom === "C" || activeBom === "Q") ? "none" : undefined }} />
          {/* Group dropdown — hidden in Tree view (grouping only applies to Flat). */}
          <div className="relative" style={{ display: (structure === "tree" || activeBom === "C" || activeBom === "Q") ? "none" : undefined }}>
          <select value={structure === "tree" ? "none" : groupBy}
            onChange={(e) => {
              const val = e.target.value;
              setGroupBy(val);
              // Grouping only renders in flat mode; auto-switch so the selection takes effect.
              if (val !== "none" && structure === "tree") setStructure("flat");
            }}
            title="Group parts (switches to Flat view)"
            className="h-7 pl-2.5 pr-7 rounded-md border text-[12px] outline-none bg-white appearance-none focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{ borderColor: C.border, color: C.textPrimary, backgroundColor: "white" }}>
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
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.textSecondary }} />
          </div>

          {/* E-BOM module picker relocated to the Module/Part column header (chevron). */}

          {/* PPAP/Category multi-select dropdown removed from the toolbar. */}
          {false && (() => {
            const isC = activeBom === "C";
            const label = isC ? "Category" : "PPAP";
            const opts = isC ? categoryOptions : ppapOptions;
            const sel = isC ? categoryFilter : ppapFilter;
            const setSel = isC ? setCategoryFilter : setPpapFilter;
            const toggle = (name) => setSel(sel.includes(name) ? sel.filter((x) => x !== name) : [...sel, name]);
            const summary = sel.length === 0 ? "ALL" : sel.length === 1 ? sel[0] : `${sel.length} selected`;
            return (
              <div className="relative">
                <button onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                  className="h-7 px-2 rounded-md border text-[12px] flex items-center gap-1.5 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                  style={{ borderColor: C.border, color: C.textPrimary }}>
                  <span>{label}: {summary}</span>
                  <ChevronDown className="w-3.5 h-3.5" style={{ color: C.textSecondary }} />
                </button>
                {filterMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setFilterMenuOpen(false)} />
                    <div className="absolute left-0 top-full mt-1 z-30 min-w-[200px] rounded-lg border bg-white shadow-lg py-1"
                      style={{ borderColor: C.border }}>
                      <button onClick={() => setSel([])}
                        className="w-full flex items-center justify-between px-3 py-1.5 text-[12px] hover:bg-gray-50 transition-colors"
                        style={{ color: sel.length === 0 ? C.primary : C.textPrimary }}>
                        <span>All {label === "PPAP" ? "Levels" : "Categories"}</span>
                        {sel.length === 0 && <Check className="w-3.5 h-3.5" />}
                      </button>
                      <div className="h-px my-1" style={{ backgroundColor: C.borderLight }} />
                      {opts.map((o) => {
                        const checked = sel.includes(o.name);
                        return (
                          <button key={o.name} onClick={() => toggle(o.name)}
                            className="w-full flex items-center gap-2 px-3 py-1.5 text-[12px] hover:bg-gray-50 transition-colors"
                            style={{ color: C.textPrimary }}>
                            <span className="w-4 h-4 rounded border flex items-center justify-center shrink-0"
                              style={{
                                borderColor: checked ? C.primary : C.border,
                                backgroundColor: checked ? C.primary : "white",
                              }}>
                              {checked && <Check className="w-3 h-3 text-white" />}
                            </span>
                            <span className="flex-1 text-left">{o.name}</span>
                            <span className="tabular-nums" style={{ color: C.textDisabled }}>{o.count}</span>
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })()}

        </div>

        {/* Status + collaboration dashboards — same row as the view toggle. Click a segment to filter.
            Status (per-BOM): E review · C cost · Q risk. Collaboration (common): commented / unread. */}
        {(() => {
          const isLevelActive = (id) => heatLevels === null || heatLevels.has(id);
          const hasFilter = heatLevels !== null && heatLevels.size > 0;

          // Bundle 1 — per-BOM status (review / cost / risk)
          const statusItems = bomDashItems(activeBom).map((it) => ({ ...it, count: 0 }));
          const byId = {}; statusItems.forEach((it) => { byId[it.id] = it; });
          BOM_TREE.forEach((n) => { const cat = (activeBom === "E") ? eReviewCat(n) : bomDashCategory(n, activeBom); if (cat && byId[cat]) byId[cat].count++; });
          const statusTitle = activeBom === "C" ? "vs Target" : activeBom === "Q" ? "Risk" : "Review";

          // Review status — common engineering review state (E categories), shown on C/Q as a second pill
          // (E already shows it as its primary status). Counted via the E lens regardless of activeBom.
          const isE = activeBom === "E";
          let reviewItems = null;
          if (!isE) {
            reviewItems = bomDashItems("E").map((it) => ({ ...it, count: 0 }));
            const rById = {}; reviewItems.forEach((it) => { rById[it.id] = it; });
            BOM_TREE.forEach((n) => { const cat = eReviewCat(n); if (cat && rById[cat]) rById[cat].count++; });
          }

          // Bundle — collaboration (common across E/C/Q): commented parts + unread messages.
          // Dashboard labels/counts stay neutral like other status values; only the grid badge is violet.
          let commented = 0, unread = 0;
          BOM_TREE.forEach((n) => {
            if (n.type === "ASSM") return;
            if ((n.comments || 0) > 0) commented++;
            unread += (PART_COLLABS[n.id] ? (PART_COLLABS[n.id].unread || 0) : 0);
          });
          const collabItems = [
            { id: "commented", label: "Comment", color: C.textSecondary, count: commented, unit: "parts" },
            { id: "unread", label: "Unread", color: C.textSecondary, dot: C.primary, count: unread, unit: "messages" },
          ];

          // Segmented pill — rounded container with inner padding; each item = dot + label + count.
          // Selected segment hugs as a small white chip (like the Tree/Flat toggle), not full height.
          const renderPill = (leading, items) => (
            <div className="h-7 flex items-center p-0.5 rounded-lg shrink-0" style={{ backgroundColor: C.surfaceTinted, border: `1px solid ${C.border}` }}>
              <span className="px-2 text-[10px] font-semibold tracking-wide shrink-0" style={{ color: C.textDisabled }}>{leading}</span>
              <span className="w-px h-3.5 shrink-0 mr-0.5" style={{ backgroundColor: C.border }} />
              <div className="flex items-center gap-0.5">
                {items.map((item) => {
                  const active = hasFilter && isLevelActive(item.id);
                  return (
                    <button key={item.id} onClick={() => toggleHeatLevel(item.id)} disabled={item.count === 0}
                      className="h-6 px-2 rounded-md inline-flex items-center gap-1.5 transition-colors focus:outline-none focus-visible:ring-1 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ backgroundColor: active ? "white" : "transparent", boxShadow: active ? "0 1px 2px rgba(16,24,40,0.10)" : "none" }}
                      onMouseEnter={(e) => { if (!active && item.count) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.55)"; }}
                      onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = "transparent"; }}
                      title={`${item.label} — ${item.count} ${item.unit || "parts"} · click to filter`}>
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.hollow ? "transparent" : (item.dot || item.color), border: item.hollow ? `1px solid ${C.textDisabled}` : "none" }} />
                      <span className="text-[11px] font-medium leading-none whitespace-nowrap" style={{ color: (active || item.accent) ? item.color : C.textSecondary }}>{item.label}</span>
                      <span className="text-[12px] font-semibold tabular-nums leading-none" style={{ color: (active || item.accent) ? item.color : C.textPrimary }}>{item.count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );

          return (
            <>
              {renderPill(statusTitle, statusItems)}
              {reviewItems && renderPill("Review", reviewItems)}
              {renderPill("Collab", collabItems)}
              {hasFilter && (
                <button onClick={() => setHeatLevels(null)} title="Clear filter"
                  className="shrink-0 w-7 h-7 inline-flex items-center justify-center rounded-full transition-colors hover:bg-gray-100 focus:outline-none focus-visible:ring-1"
                  style={{ color: C.textSecondary }}>
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          );
        })()}

      </div>


      <div ref={splitContainerRef} className="flex-1 flex overflow-hidden">
        {/* LEFT: BOM Tree — user-adjustable width (default ~ remaining after 400px right) */}
        <div className="bg-white flex flex-col"
          style={{
            width: (selectedItemId && selectedItem && leftPanelWidth !== null) ? `${leftPanelWidth}px` : undefined,
            flex: (selectedItemId && selectedItem && leftPanelWidth !== null) ? "0 0 auto" : "1 1 0%",
            minWidth: 400,
          }}>
          <div className="flex-1 overflow-auto">
          {/* E-BOM module filter moved to the toolbar dropdown (Module: ALL ▾) above. */}
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-white border-b" style={{ borderColor: C.border, zIndex: 30 }}>
              <tr className="whitespace-nowrap" style={{ color: C.textSecondary }}>
                {structure === "tree" && (
                  <th className="text-left font-medium py-2.5 px-3 w-8">LVL</th>
                )}
                {structure === "flat" && (
                  <th className="text-left font-medium py-2.5 px-3 w-20">Module</th>
                )}
                <th className="text-left font-medium py-2.5 px-3">
                  {activeBom === "E" ? (
                    <div className="inline-block">
                      <button ref={moduleBtnRef} onClick={() => setModuleMenuOpen((o) => !o)} title="Filter by module"
                        className="inline-flex items-center gap-1 font-medium hover:opacity-80 focus:outline-none focus-visible:ring-2 rounded"
                        style={{ color: moduleFilter != null ? C.primary : C.textSecondary }}>
                        {structure === "flat" ? "Part" : "Module/Part"}
                        {moduleFilter != null && <span className="text-[11px]">· {(moduleOptions.find((m) => m.id === moduleFilter) || {}).name}</span>}
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      {moduleMenuOpen && (() => {
                        const r = moduleBtnRef.current ? moduleBtnRef.current.getBoundingClientRect() : { bottom: 0, left: 0 };
                        return (
                          <>
                            <div className="fixed inset-0" style={{ zIndex: 998 }} onClick={() => setModuleMenuOpen(false)} />
                            <div className="bg-white rounded-lg border shadow-xl py-1 max-h-72 overflow-auto"
                              style={{ position: "fixed", top: r.bottom + 4, left: r.left, borderColor: C.border, minWidth: 240, zIndex: 999 }}>
                              <button onClick={() => { setModuleFilter(null); setModuleMenuOpen(false); }}
                                className="w-full text-left px-3 py-1.5 text-[12px] hover:bg-gray-50 flex items-center justify-between gap-3"
                                style={{ color: moduleFilter == null ? C.primary : C.textPrimary }}>
                                <span>All modules</span><span className="text-[10px]" style={{ color: C.textDisabled }}>{BOM_TREE.length}</span>
                              </button>
                              {moduleOptions.map((m) => (
                                <button key={m.id} onClick={() => { setModuleFilter(m.id); setModuleMenuOpen(false); }}
                                  className="w-full text-left px-3 py-1.5 text-[12px] hover:bg-gray-50 flex items-center justify-between gap-3"
                                  style={{ color: moduleFilter === m.id ? C.primary : C.textPrimary }}>
                                  <span className="truncate">{m.name}</span><span className="text-[10px] shrink-0" style={{ color: C.textDisabled }}>{m.count}</span>
                                </button>
                              ))}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  ) : (structure === "flat" ? "Part" : "Module/Part")}
                </th>
                <th className="text-left font-medium py-2.5 px-3 w-36">Part Code</th>

                {/* BOM-specific columns */}
                {activeBom === "E" && (
                  <>
                    <th className="text-left font-medium py-2.5 px-3 w-32">Category</th>
                    <th className="text-left font-medium py-2.5 px-3 w-28">
                      <div className="inline-block">
                        <button ref={procBtnRef} onClick={() => setProcMenuOpen((o) => !o)} title="Filter by process (공법)"
                          className="inline-flex items-center gap-1 font-medium whitespace-nowrap hover:opacity-80 focus:outline-none focus-visible:ring-2 rounded"
                          style={{ color: procFilter != null ? C.primary : C.textSecondary }}>
                          Process
                          {procFilter != null && <span className="text-[11px] tabular-nums">· {procFilter}</span>}
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        {procMenuOpen && (() => {
                          const r = procBtnRef.current ? procBtnRef.current.getBoundingClientRect() : { bottom: 0, left: 0 };
                          return (
                            <>
                              <div className="fixed inset-0" style={{ zIndex: 998 }} onClick={() => setProcMenuOpen(false)} />
                              <div className="bg-white rounded-lg border shadow-xl py-1 max-h-72 overflow-auto"
                                style={{ position: "fixed", top: r.bottom + 4, left: r.left, borderColor: C.border, minWidth: 180, zIndex: 999 }}>
                                <button onClick={() => { setProcFilter(null); setProcMenuOpen(false); }}
                                  className="w-full text-left px-3 py-1.5 text-[12px] hover:bg-gray-50 flex items-center justify-between gap-3"
                                  style={{ color: procFilter == null ? C.primary : C.textPrimary }}>
                                  <span>All processes</span>
                                </button>
                                {procOptions.map((p) => (
                                  <button key={p.id} onClick={() => { setProcFilter(p.id); setProcMenuOpen(false); }}
                                    className="w-full text-left px-3 py-1.5 text-[12px] hover:bg-gray-50 flex items-center justify-between gap-3"
                                    style={{ color: procFilter === p.id ? C.primary : C.textPrimary }}>
                                    <span className="tabular-nums">{p.name}</span><span className="text-[10px] shrink-0" style={{ color: C.textDisabled }}>{p.count}</span>
                                  </button>
                                ))}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </th>
                  </>
                )}
                {activeBom === "Q" && (
                  <>
                    <th className="text-left font-medium py-2.5 px-3 w-36">Supplier</th>
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
                    <th className="text-right font-medium py-2.5 px-3 w-28 whitespace-nowrap">Δ vs Target</th>
                    <th className="text-right font-medium py-2.5 px-3 w-28">
                      <span title="Final price source: ● blue=quoted · ● green=negotiated · ● gray=carryover · ● purple=AI should-cost">
                        Final
                      </span>
                    </th>
                  </>
                )}

                <th className="text-left font-medium py-2.5 px-3 w-28">Status</th>
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
                    const groupParts = BOM_TREE.filter((n) => n.type !== "ASSM" && ((groupBy === "supplier" ? effectiveSupplierOf(n, moduleOf) : (n[groupBy] || "Unknown")) === node._groupKey));
                    const total = groupParts.reduce((sum, n) => {
                      const base = 5 + (n.id % 12) * 3.4;
                      const quoted = n.id === 3 && scenarioStep >= 7 ? 11.80
                        : n.id === 3 ? 11.80
                        : Math.round((base + ((n.id % 5) - 2) * 0.3) * 100) / 100;
                      return sum + quoted;
                    }, 0);
                    statsText = `Total ~$${total.toFixed(0)}`;
                  }

                  return (
                    <tr key={node.id}>
                      <td colSpan={12}
                        className="border-b"
                        style={{
                          backgroundColor: "#f2f4f7",
                          borderColor: C.border,
                          borderLeft: `3px solid ${C.primary}`,
                          position: "sticky",
                          top: 36, // below the thead
                          zIndex: 1,
                        }}>
                        <div className="flex items-center gap-2 py-2 px-3">
                          <GroupIcon className="w-3.5 h-3.5 shrink-0" style={{ color: C.primary }} />
                          <span className="text-[10px] font-medium tracking-wider shrink-0"
                            style={{ color: C.textSecondary }}>
                            {groupByLabel}
                          </span>
                          <span className="text-xs font-medium truncate"
                            style={{ color: C.textPrimary }}>
                            {node._groupKey}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded shrink-0"
                            style={{ backgroundColor: "white", color: C.textSecondary, border: `1px solid ${C.border}` }}>
                            {node._groupCount} {node._groupCount === 1 ? "part" : "parts"}
                          </span>
                          {statsText && (
                            <span className="ml-auto text-[12px] tabular-nums font-medium shrink-0"
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
                // Display Driver IC (id 3): uses scenario hero data
                let mockCost;
                if (node.id === 3) {
                  // Hero DDIC: incumbent EOL, so no carryover from previous part
                  const quoted = scenarioStep >= 7 ? 11.80 : null;
                  mockCost = {
                    quoted, shouldCost: 11.80, market: 12.30, target: 11.80,
                    carryover: null, // second source — previous variant not carried over
                    delta: quoted !== null ? (quoted - 11.80) : (11.80 - 11.80),
                  };
                } else {
                  // Derive deterministic mock from node.id.
                  const base = 5 + (node.id % 12) * 3.4;
                  const delta = Math.round(((node.id * 7) % 9 - 4) * 0.35 * 100) / 100; // Δ vs target, centered — also drives the dashboard
                  // Realistic data-availability mix so the Final source isn't always "Quoted":
                  //   ~60% have a fresh RFQ quote, ~75% carry a prior-version price, all have AI should-cost.
                  const hasQuote = (node.id % 5) >= 2;
                  const hasCarryover = (node.id % 4) !== 0;
                  const quotePrice = Math.round((base + ((node.id % 5) - 2) * 0.3) * 100) / 100;
                  const carryPrice = Math.round((base * (1 + ((node.id % 7) - 3) * 0.012)) * 100) / 100;
                  const shouldPrice = Math.round((base * 0.98) * 100) / 100;
                  // Final price priority: quoted > carryover > should-cost
                  const finalValue = hasQuote ? quotePrice : (hasCarryover ? carryPrice : shouldPrice);
                  mockCost = {
                    quoted: hasQuote ? quotePrice : null,
                    carryover: hasCarryover ? carryPrice : null,
                    shouldCost: shouldPrice,
                    market: Math.round((base * 1.04) * 100) / 100,
                    target: Math.round((finalValue - delta) * 100) / 100,
                    delta,
                  };
                }
                const mockRisk = node.isHero ? "Med" : (node.id === 10 ? "High" : (node.id === 6 ? "Med" : "Low"));

                // Final price source (C-BOM): which column feeds the Final price, so that
                // column's value can be highlighted (violet, like AI should-cost). Priority: quoted > carryover > should.
                const costSource = (() => {
                  const isHeroPart = node.id === 3;
                  const isAwarded = isHeroPart && scenarioStep >= 7;
                  if (isHeroPart && isAwarded) return { col: "quoted", value: mockCost.quoted, label: `Negotiated · Lumina Display ($${(mockCost.quoted ?? 0).toFixed(2)})` };
                  if (mockCost.quoted !== null) return { col: "quoted", value: mockCost.quoted, label: `Quoted · ${node.supplier || "Supplier"} ($${mockCost.quoted.toFixed(2)})` };
                  if (mockCost.carryover !== null) return { col: "carryover", value: mockCost.carryover, label: `Carryover from previous version ($${mockCost.carryover.toFixed(2)})` };
                  return { col: "should", value: mockCost.shouldCost, label: `AI Should-cost (no quote yet) · $${mockCost.shouldCost.toFixed(2)}` };
                })();

                // BOM-specific missing parts simulation:
                // - Q-BOM: id 3, 10, 14, 18 missing until scenarioStep >= 7 (QM resolves)
                // - C-BOM: id 3 missing supplier until scenarioStep >= 6 (CM/SM awards)
                // - E-BOM: ids 5, 8 lag by 1 week (sync needed)
                const qBomMissingIds = [3, 10, 14, 18];
                const cBomMissingIds = [3];
                const eBomMissingIds = [3, 11]; // E: no supplier assigned (DDIC second source + Battery Cell)
                const eBomLagIds = [5, 8];
                const isMissingInActiveBom =
                  (activeBom === "E" && eBomMissingIds.includes(node.id)) ||
                  (activeBom === "Q" && qBomMissingIds.includes(node.id)) ||
                  (activeBom === "C" && cBomMissingIds.includes(node.id));
                const isLaggedInActiveBom =
                  (activeBom === "E" && eBomLagIds.includes(node.id));

                return (
                  <tr key={node.id} onClick={() => openItemPanel(node.id, "details")}
                    className="group border-b transition-colors cursor-pointer"
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
                          ? (mockCost.delta > 1.5 ? "#fee4e2"
                            : mockCost.delta > 0.5 ? "#fef0c7"
                            : mockCost.delta < -0.3 ? "#d1fadf"
                            : "white")
                          : overlay === "riskHeat"
                            ? (mockRisk === "High" ? "#fee4e2"
                              : mockRisk === "Med" ? "#fef0c7"
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
                        e.currentTarget.style.backgroundColor = mockCost.delta > 1.5 ? "#fee4e2"
                          : mockCost.delta > 0.5 ? "#fef0c7"
                          : mockCost.delta < -0.3 ? "#d1fadf"
                          : "white";
                      } else if (overlay === "riskHeat") {
                        e.currentTarget.style.backgroundColor = mockRisk === "High" ? "#fee4e2"
                          : mockRisk === "Med" ? "#fef0c7"
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
                    {structure === "flat" && (() => {
                      const modNode = BOM_TREE.find((n) => n.id === moduleOf[node.id]);
                      const modName = modNode ? prettyName(splitNameSpec(modNode.desc).name) : "—";
                      return (
                        <td className="py-2 px-3">
                          <span className="text-[11px] truncate block max-w-[72px]" style={{ color: C.textSecondary }} title={modName}>{modName}</span>
                        </td>
                      );
                    })()}
                    <td className="py-0 px-3">
                      <div className="flex items-stretch self-stretch" style={{ minHeight: 40 }}>
                        {structure === "tree" ? (
                          <>
                            {/* Tree guides: one dashed vertical rail per ancestor level */}
                            {Array.from({ length: Math.max(0, node.lvl - 1) }).map((_, i) => (
                              <span key={i} className="relative shrink-0" style={{ width: 20 }}>
                                <span className="absolute top-0 bottom-0"
                                  style={{ left: 9, borderLeft: `1px dashed ${C.border}` }} />
                              </span>
                            ))}
                            {/* Node connector + toggle/leaf marker */}
                            <span className="relative shrink-0 flex items-center" style={{ width: 26 }}>
                              {/* horizontal connector from the parent rail to this node */}
                              {node.lvl > 1 && (
                                <span className="absolute"
                                  style={{ left: -11, top: "50%", width: 13, borderTop: `1px dashed ${C.border}` }} />
                              )}
                              {hasChildren ? (
                                <button onClick={(e) => { e.stopPropagation(); toggleNode(node.id); }}
                                  className="relative z-[1] w-5 h-5 rounded-full border flex items-center justify-center bg-white hover:bg-gray-50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                                  style={{ borderColor: C.border }}>
                                  {isExpanded
                                    ? <ChevronDown className="w-3 h-3" style={{ color: C.textSecondary }} />
                                    : <ChevronRight className="w-3 h-3" style={{ color: C.textSecondary }} />}
                                </button>
                              ) : (
                                /* leaf node — short dashed stub */
                                <span className="block" style={{ width: 12, borderTop: `1px dashed ${C.border}` }} />
                              )}
                            </span>
                          </>
                        ) : null}
                        <div className="min-w-0 flex items-center">
                          <div className="min-w-0">
                          {/* Description first (human-readable name) */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {activeBom === "E" && eReviewCat(node) === "review" && (
                              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "#d92d20" }} title="Need review" />
                            )}
                            <span className="text-xs truncate max-w-[260px]"
                              style={{
                                color: C.textPrimary,
                                fontWeight: isSelected ? 600 : 500,
                              }}>
                              {prettyName(node.partName || splitNameSpec(node.desc).name)}
                            </span>
                            {isReusablePart(node) && (
                              <button
                                onClick={(e) => { e.stopPropagation(); setItem360For(node); }}
                                title="Open Item 360 — global part record (where used, history)"
                                className="shrink-0 w-5 h-5 rounded flex items-center justify-center hover:bg-gray-100 focus:outline-none focus-visible:ring-2"
                                style={{ color: C.textDisabled }}>
                                <FileText className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                          {/* Spec as subtext */}
                          {splitNameSpec(node.desc).spec && (
                            <div className="text-[10px] mt-0.5 truncate max-w-[260px]" style={{ color: C.textDisabled }}>
                              {splitNameSpec(node.desc).spec}
                            </div>
                          )}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Part Code */}
                    <td className="py-2 px-2">
                      {(() => {
                        const simCode = (node.id === 3 && simAlt) ? simAlt.code : null;
                        const shown = simCode || shortCode(node);
                        return (
                          <span className="text-[11px] tabular-nums truncate block max-w-[140px]" style={{ color: simCode ? C.primary : (shown ? C.textSecondary : C.textDisabled), fontWeight: simCode ? 600 : undefined }} title={simCode ? `Simulating ${simCode} (was ${shortCode(node)})` : (shown || "")}>{shown || "—"}</span>
                        );
                      })()}
                    </td>
                    {/* BOM-specific cells */}
                    {activeBom === "E" && (
                      <>
                        <td className="py-2 px-3">
                          <span className="text-[12px]" style={{ color: C.textPrimary }}>
                            {node.category || "—"}
                          </span>
                        </td>
                        <td className="py-2 px-3">
                          {procOf(node) ? (
                            <span className="text-[10px] tabular-nums px-1.5 py-0.5 rounded"
                              style={{ backgroundColor: C.bg, color: C.textSecondary }}>
                              {procOf(node)}
                            </span>
                          ) : (
                            <span className="text-[10px]" style={{ color: C.textDisabled }}>—</span>
                          )}
                        </td>
                      </>
                    )}
                    {activeBom === "Q" && (
                      <>
                        <td className="py-2 px-3">
                          {(() => {
                          if (node.id === 3) {
                            return (
                              <button onClick={(e) => { e.stopPropagation(); setSupplierPanel("Triton Semiconductor"); }}
                                className="text-[12px] truncate block max-w-full text-left rounded hover:underline focus:outline-none focus-visible:ring-2"
                                style={{ color: C.primary }} title="Open Supplier 360 · Triton Semiconductor">
                                Triton Semiconductor
                              </button>
                            );
                          }
                          const _sup = effectiveSupplierOf(node, moduleOf); return (
                          _sup ? (
                            <button onClick={(e) => { e.stopPropagation(); setSupplierPanel(_sup); }}
                              className="text-[12px] truncate block max-w-full text-left rounded hover:underline focus:outline-none focus-visible:ring-2"
                              style={{ color: C.primary }} title={`Open Supplier 360 · ${_sup}`}>
                              {_sup}
                            </button>
                          ) : (
                            <span className="text-[12px]" style={{ color: C.textPrimary }}>—</span>
                          )); })()}
                        </td>
                        <td className="py-2 px-3 text-center">
                          {isMissingInActiveBom ? (
                            <span className="text-[10px]" style={{ color: C.error }}>—</span>
                          ) : (
                            <span className="text-[10px] tabular-nums font-medium px-1.5 py-0.5 rounded"
                              style={{
                                backgroundColor: node.ppap === "Lv3" ? C.errorLight : node.ppap === "Lv2" ? C.warningLight : C.bg,
                                color: node.ppap === "Lv3" ? C.error : node.ppap === "Lv2" ? C.warning : C.textSecondary,
                              }}>
                              {node.ppap || "—"}
                            </span>
                          )}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded"
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
                          {(() => {
                          if (node.id === 3) {
                            return (
                              <button onClick={(e) => { e.stopPropagation(); setSupplierPanel("Triton Semiconductor"); }}
                                className="text-[12px] truncate block max-w-full text-left rounded hover:underline focus:outline-none focus-visible:ring-2"
                                style={{ color: C.primary }} title="Open Supplier 360 · Triton Semiconductor">
                                Triton Semiconductor
                              </button>
                            );
                          }
                          const _sup = effectiveSupplierOf(node, moduleOf); return (
                          isMissingInActiveBom ? (
                            <span className="text-[12px] truncate block" style={{ color: C.error }}>— (not selected)</span>
                          ) : _sup ? (
                            <button onClick={(e) => { e.stopPropagation(); setSupplierPanel(_sup); }}
                              className="text-[12px] truncate block max-w-full text-left rounded hover:underline focus:outline-none focus-visible:ring-2"
                              style={{ color: C.primary }} title={`Open Supplier 360 · ${_sup}`}>
                              {_sup}
                            </button>
                          ) : (
                            <span className="text-[12px]" style={{ color: C.textPrimary }}>—</span>
                          )); })()}
                        </td>
                        <td className="py-2 px-3 text-right">
                          {(() => { const isSrc = costSource.col === "carryover"; return (
                          <span className={"tabular-nums text-[12px]" + (isSrc ? " font-semibold" : "")}
                            style={isSrc ? { color: C.textPrimary } : { color: mockCost.carryover === null ? C.textDisabled : C.textSecondary }}
                            title={isSrc ? `Final price source · ${costSource.label}` : (mockCost.carryover === null ? "No carryover — new spec" : "Previous version price")}>
                            {mockCost.carryover !== null ? `$${mockCost.carryover.toFixed(2)}` : "—"}
                          </span>); })()}
                        </td>
                        <td className="py-2 px-3 text-right">
                          {(() => { const isSrc = costSource.col === "quoted"; return (
                          <span className={"tabular-nums text-[12px]" + (isSrc ? " font-semibold" : "")}
                            style={isSrc ? { color: C.textPrimary } : { color: mockCost.quoted === null ? C.textDisabled : C.textPrimary }}
                            title={isSrc ? `Final price source · ${costSource.label}` : "Latest RFQ quote"}>
                            {mockCost.quoted !== null ? `$${mockCost.quoted.toFixed(2)}` : "—"}
                          </span>); })()}
                        </td>
                        <td className="py-2 px-3 text-right">
                          {(() => { const isSrc = costSource.col === "should"; return (
                          <span className={"tabular-nums text-[12px]" + (isSrc ? " font-semibold" : "")}
                            style={isSrc ? { color: C.textPrimary } : { color: C.textSecondary }}
                            title={isSrc ? `Final price source · ${costSource.label}` : "AI-derived should-cost"}>
                            ${mockCost.shouldCost.toFixed(2)}
                          </span>); })()}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className="tabular-nums text-[12px]" style={{ color: C.textDisabled }}
                            title="Market average">
                            ${mockCost.market.toFixed(2)}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <span className="tabular-nums text-[12px] font-medium"
                            style={{ color: mockCost.delta > 0.5 ? C.error : mockCost.delta < -0.3 ? C.success : C.textSecondary }}
                            title={`Target: $${mockCost.target.toFixed(2)}`}>
                            {mockCost.delta > 0 ? "+" : ""}${mockCost.delta.toFixed(2)}
                          </span>
                        </td>
                        {/* Final price — value only; the source column (Quoted/Carryover/Should) is highlighted instead */}
                        <td className="py-2 px-3 text-right">
                          <span className="tabular-nums text-[12px] font-semibold" style={{ color: C.textPrimary }}
                            title={`Final price from: ${costSource.label}`}>
                            ${(costSource.value ?? 0).toFixed(2)}
                          </span>
                        </td>
                      </>
                    )}

                    <td className="py-2 px-3">
                      {(() => {
                        const cat = eReviewCat(node);
                        const map = {
                          review: { label: "Review", color: C.error },
                          decision: { label: "Pending", color: C.warning },
                        };
                        const s = map[cat];
                        if (!s) return null;
                        return (
                          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium" style={{ color: s.color }}>
                            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                            {s.label}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="py-2 px-3 text-right">
                      {(() => {
                        // Comment count — matches Item360 drawer's gating so this badge and
                        // the chat button in the detail panel always show the same number.
                        // For Hero parts (scenario timeline), only messages up to the current
                        // scenarioStep are counted; non-hero parts use the full feed.
                        // Collaboration thread count for this part (single source: PART_COLLABS).
                        const collab = COLLAB_ITEM_IDS.includes(node.id) ? PART_COLLABS[node.id] : null;
                        const nodeMessages = collab ? collab.timeline : [];
                        const count = nodeMessages.length;
                        const openComments = (e) => {
                          e.stopPropagation(); // don't trigger the row → detail
                          openItemPanel(node.id, "chat");
                        };
                        if (count === 0) {
                          // No comments yet — still allow starting a thread (appears on hover).
                          return (
                            <button onClick={openComments}
                              title="Add comment"
                              className="inline-flex items-center justify-center w-6 h-6 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-100 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                              style={{ color: C.textDisabled }}>
                              <MessageSquare className="w-3 h-3" />
                            </button>
                          );
                        }
                        const lastMessage = nodeMessages[nodeMessages.length - 1];
                        const lastPersona = lastMessage.persona;
                        return (
                          <button onClick={openComments}
                            title={`Open comments · Latest: ${PERSONAS[lastPersona]?.name || lastPersona} · ${lastMessage.ts}`}
                            className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                            style={{ color: (collab && collab.unread > 0) ? C.primary : C.textSecondary }}>
                            <MessageSquare className="w-3 h-3" />
                            {count}
                          </button>
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

        {/* Divider + right drawer only when a row is selected.
            With no selection the BOM grid fills the full width (all columns visible). */}
        {selectedItemId && selectedItem && (
          <>
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
            <div className="bg-white overflow-hidden flex flex-col"
              style={{
                width: leftPanelWidth !== null ? undefined : 400,
                flex: leftPanelWidth !== null ? "1 1 0%" : "0 0 400px",
                minWidth: 320,
              }}>
              <ChatRoomPanel item={selectedItem} onClose={() => setSelectedItemId(null)} scenarioStep={scenarioStep} activePersona={activePersona} activeBom={activeBom} initialTab={panelTab} tabNonce={panelTabNonce} revealCount={demo ? demo.reveal : demoReveal} demo={demo} onCompare={() => setCompareOpen(true)} onResolve={onResolve} resolved={resolved} onCompareAlts={() => setAltCompareOpen(true)} />
            </div>
          </>
        )}

        {/* Resolve toast — shown when the PM approves the evaluation build */}
        {toast && (
          <div className="fixed left-1/2 -translate-x-1/2 bottom-6 z-[70] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg max-w-[440px]"
            style={{ backgroundColor: "rgba(16,24,40,0.80)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)", color: "white", animation: "caiPop .2s ease-out both" }}>
            <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: C.success }}><Check className="w-3.5 h-3.5 text-white" /></span>
            <span className="text-[12px] leading-snug">{toast}</span>
            <button onClick={() => setToast(null)} className="ml-1 shrink-0 opacity-70 hover:opacity-100 focus:outline-none" title="Dismiss"><X className="w-3.5 h-3.5" /></button>
          </div>
        )}

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

      {/* Global Item 360 popup — master record across projects (where used, history) */}
      {item360For && (
        <Item360Overlay
          item={{
            id: item360For.id,
            partId: item360For.partId,
            partName: item360For.partName || splitNameSpec(item360For.desc).name,
            itemCode: item360For.partId,
            desc: item360For.desc,
            type: item360For.type,
            status: item360For.status,
            spec: item360For.spec,
            cost: item360For.cost,
            supplier: item360For.supplier,
          }}
          activeBom={activeBom}
          scenarioStep={scenarioStep}
          tab={i360Tab}
          onTabChange={setI360Tab}
          onNavigate={(nav) => setItem360For(nav)}
          onClose={() => setItem360For(null)}
          onOpenChat={() => {}}
        />
      )}

      {/* Supplier 360 Panel */}
      {supplierPanel && (
        <SupplierDetailPanel name={supplierPanel} onClose={() => setSupplierPanel(null)} />
      )}

      {/* Compare Modal */}
      {compareOpen && (
        <CompareModal
          activeBom={activeBom}
          activeBomMeta={activeBomMeta}
          diff={BOM_VERSION_DIFFS[activeBom]}
          onClose={() => setCompareOpen(false)}
          demoActive={false}
          demoPart={"EI2-I6DA-003WB"}
          demoAdvance={demo && demo.advance}
          onOpenItem360={(it) => setItem360For(it)}
        />
      )}

      {/* Side-by-side alt comparison popup (top level so it layers above the grid/headers) */}
      {altCompareOpen && (
        <AltCompareModal onClose={() => setAltCompareOpen(false)} onSimulate={(alt) => { setAltCompareOpen(false); setSimAlt(alt); }} />
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

  // Group events by version first, then by date within each version
  // (version descends newest→oldest, matching event order). A version header
  // shows which BOM version + phase the following events belong to.
  const grouped = [];
  let lastVersion = null;
  let lastDate = null;
  events.forEach(ev => {
    if (ev.version !== lastVersion) {
      grouped.push({ kind: "version", version: ev.version, phase: ev.phase });
      lastVersion = ev.version;
      lastDate = null; // reset date grouping within a new version block
    }
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
          <div className="text-[16px] font-medium leading-6" style={{ color: C.textPrimary }}>
            Timeline
          </div>
          <div className="text-xs mt-0.5" style={{ color: C.textSecondary }}>
            {activeBomMeta.name} · {activeBomMeta.version}
            {events.length > 0 && (() => {
              const versions = [...new Set(events.map(e => e.version).filter(Boolean))];
              return versions.length > 1 ? ` · ${versions.length} versions` : null;
            })()}
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
            // Version block header — version chip + phase chip
            if (item.kind === "version") {
              const phaseColor = C.primary;
              return (
                <div key={`ver-${idx}`} className={`flex items-center gap-2 ${idx === 0 ? "pb-3" : "pt-4 pb-3"}`}>
                  <span className="inline-flex items-center gap-1 text-[12px] font-medium px-2.5 py-0.5 rounded-md"
                    style={{ backgroundColor: C.primary, color: "white" }}>
                    <GitBranch className="w-3 h-3" />
                    {item.version}
                  </span>
                  {item.phase && (
                    <span className="inline-flex items-center text-[12px] font-medium px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: C.primaryLight, color: phaseColor }}>
                      {item.phase}
                    </span>
                  )}
                  <div className="flex-1 h-px" style={{ backgroundColor: C.borderLight }} />
                </div>
              );
            }
            if (item.kind === "date") {
              return (
                <div key={`date-${idx}`} className="px-1 pt-1 pb-2 text-[12px] font-medium"
                  style={{ color: C.textDisabled }}>
                  {fmtDate(item.date)}
                </div>
              );
            }
            const ev = item;
            const { Icon, bg, fg } = getIconAndColor(ev.kind, ev.iconType);
            const isExpanded = expandedEvent === ev.id;
            const isLast = (() => {
              // last in this date group? (a following date or version header ends the tail)
              for (let i = idx + 1; i < grouped.length; i++) {
                if (grouped[i].kind === "date" || grouped[i].kind === "version") return true;
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
                    <span className="text-[14px] font-medium leading-5 flex-1" style={{ color: C.textPrimary }}>
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
                          <span className="text-[10px] font-medium text-white">{persona.initial?.charAt(0)}</span>
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
const COMPARE_VERSION_LINE = {
  E: ["v1.4", "v1.5", "v1.6", "v1.7", "v1.8 (Draft)"],
  C: ["v1.2", "v1.3", "v1.4", "v1.5", "v2.0"],
  Q: ["v1.1", "v1.2", "v1.3", "v1.4", "v1.5"],
};

const AI_PART_IMPACT = {
  "GL2-7HKR-WA1Z3": { summary: "Larger 6.7\" Victus 2 cover improves drop and scratch resistance but enlarges the part — bezel tooling and lamination jig need revision.", cost: "+$0.15/unit", risk: "medium", action: "Re-run drop + scratch validation" },
  "UEI-Y0ZL-7UU0W": { summary: "Polarizer resized to 6.7\" to match the panel; vendor holds current price, low technical risk.", cost: "flat", risk: "low", action: "Confirm cut tolerance" },
  "1W6-4YP3-X6FU2": { summary: "120 Hz + SPI doubles report rate; EMI and power draw at high refresh must be checked, and the PCB needs added SPI routing.", cost: "+$0.40/unit", risk: "medium", action: "Re-validate touch latency" },
  "TP4-6GRT-89XQM": { summary: "Doubling pad qty and extending to PMIC targets the 120 Hz thermal load; adds an assembly step and minor cost.", cost: "+$0.20/unit", risk: "low", action: "Confirm pad stack vs z-gap" },
  "MM2-5JNE-DR4VA": { summary: "8→12 GB raises memory headroom and unit cost; verify power budget and supplier allocation for the larger die.", cost: "+$7.20/unit", risk: "medium", action: "Re-cost + lock dual-source" },
  "5ML-DR7Q-2CV44": { summary: "Switched to an Alt-B low-haze OCA from Supplier X — improves lamination yield and lowers cost, but adhesion and reliability must be re-qualified before release.", cost: "−$0.08/unit", risk: "medium", action: "Re-qualify adhesion + reliability" },
};

// === ITEM 360 — global master part view (integrated from Item360.jsx) ===
const ITEM360_MODE = "modal";
const i360_qMissingIds = [], i360_cMissingIds = [], i360_eLagIds = [];
const i360DomainKey = (bom) => (bom === "E" ? "D" : bom === "Q" ? "Q" : "C");

function i360CleanPartLabel(desc) {
  const parts = String(desc || "").split(",").map((s) => s.trim()).filter(Boolean);
  return parts.length > 1 ? parts[1] : (parts[0] || "");
}

function _statusBadge(item, activeBom, isMissing) {
  const sev = item.status ? item.status[i360DomainKey(activeBom)] : "ok";
  if (sev === "block") return { label: "Blocked", color: C.error, bg: C.errorLight, Icon: XCircle };
  if (isMissing) return { label: "Missing", color: C.warning, bg: C.warningLight, Icon: AlertTriangle };
  if (sev === "warn") return { label: "Needs attention", color: C.warning, bg: C.warningLight, Icon: AlertTriangle };
  return { label: "On track", color: C.success, bg: C.successLight, Icon: CheckCircle };
}

function shortItemName(item) {
  if (!item) return "";
  if (item.desc && String(item.desc).includes(",")) return i360CleanPartLabel(item.desc);
  return item.partName || item.desc || item.partId || "";
}

function getItemContext(item) {
  const nm = (n) => (n ? (n.partName || (n.desc && String(n.desc).includes(",") ? i360CleanPartLabel(n.desc) : n.desc) || ("#" + n.id)) : "");
  const node = (typeof BOM_TREE !== "undefined") ? BOM_TREE.find((n) => n.id === item.id) : null;
  const parentNode = (typeof BOM_TREE !== "undefined") ? BOM_TREE.find((n) => Array.isArray(n.children) && n.children.includes(item.id)) : null;
  const children = node && Array.isArray(node.children)
    ? node.children.map((cid) => { const c = BOM_TREE.find((n) => n.id === cid); return c ? { id: cid, name: nm(c) } : null; }).filter(Boolean)
    : [];
  const isAssembly = node && node.type === "ASSM";
  const makeBuy = isAssembly ? "Make" : "Buy";
  const buyMode = ["Buy & Sell", "ODM", "AVAP", "Direct"].includes(item.type) ? item.type : "Direct";
  const isEndItem = makeBuy === "Buy";
  const cat = item.category || "—";
  const strategyGroup = /display|panel|amoled|semiconductor|chip|processor/i.test(cat) ? "Strategic"
    : /adhesive|film|bracket|screw|commodity|cmdty|standard/i.test(cat) ? "Transactional" : "Collaborative";
  const policyMap = {
    Strategic: ["Dual-source required", "APQP mandatory", "RFP over RFQ"],
    Collaborative: ["APQP standard", "Annual benchmark", "Single-source allowed"],
    Transactional: ["Catalog / spot buy", "Single RFQ allowed"],
  };
  const guidanceMap = {
    Strategic: "Maintain 2+ qualified suppliers · prefer RFP · executive cost review",
    Collaborative: "Benchmark annually · standard APQP gate",
    Transactional: "Catalog or spot RFQ · minimal qualification",
  };
  return {
    parent: parentNode ? { id: parentNode.id, name: nm(parentNode) } : null,
    children, whereUsed: ["Smartphone #2 (current)", "Smartphone #1 (carry-over)"],
    isEndItem, makeBuy, buyMode, category: cat,
    strategyGroup, policies: policyMap[strategyGroup], guidance: guidanceMap[strategyGroup],
  };
}

function getSupplierProfiles(item) {
  const hero = item && item.id === 3;
  if (hero) return [
    { name: "Apex Silicon", region: "USA", capability: 92, performance: 90, risk: "Med", unitPrice: 12.0, leadTime: 14, certs: ["ISO 9001", "IATF 16949", "AEC-Q100"], note: "Incumbent driver — on EOL / last-time-buy. Successor available but re-qual needed.", logo: { bg: "#532df6", text: "AS" } },
    { name: "Triton Semiconductor", region: "Taiwan", capability: 95, performance: 93, risk: "Low", unitPrice: 11.8, leadTime: 10, certs: ["ISO 9001", "IATF 16949", "AEC-Q100"], note: "Proposed second source — drop-in 4-lane MIPI, 120Hz, PPAP complete.", logo: { bg: "#039855", text: "TX" } },
    { name: "Ironwood Semi", region: "Germany", capability: 88, performance: 86, risk: "Low", unitPrice: 12.1, leadTime: 8, certs: ["ISO 9001", "AEC-Q100"], note: "Qualified alternate — 120Hz needs timing re-validation.", logo: { bg: "#dc6803", text: "IW" } },
  ];
  if (item && item.supplierProfiles) return item.supplierProfiles;
  // Non-hero items: synthesize 3 distinct (fictional) supplier profiles.
  const ref = (item && item.cost && (item.cost.current || item.cost.target)) || 12;
  const r2 = (x) => Math.round(x * 100) / 100;
  return [
    { name: "Orbit Components", region: "Korea", capability: 92, performance: 90, risk: "Low", unitPrice: r2(ref * 1.06), leadTime: 9, certs: ["ISO 9001", "IATF 16949"], note: "Qualified prime source — premium quality, longer lead.", logo: { bg: "#1570ef", text: "OC" } },
    { name: "Pulse Devices", region: "China", capability: 75, performance: 71, risk: "High", unitPrice: r2(ref * 0.87), leadTime: 4, certs: ["ISO 9001"], note: "Lowest cost and fastest lead — quality variance to watch.", logo: { bg: "#7c3aed", text: "PD" } },
    { name: "Helios Modules", region: "Japan", capability: 88, performance: 86, risk: "Low", unitPrice: r2(ref * 0.98), leadTime: 7, certs: ["ISO 9001", "IATF 16949"], note: "Reliable mid-tier with a consistent delivery record.", logo: { bg: "#039855", text: "HM" } },
  ];
}

function getItemUsage(item) {
  const hero = item && item.id === 3;
  if (hero) {
    return {
      whereUsed: [
        { product: "Galaxy S25 Ultra", assembly: "Display Module Assy", level: "Lv2", qty: "1 EA", status: "Active" },
        { product: "Galaxy S25+", assembly: "Display Module Assy", level: "Lv2", qty: "1 EA", status: "Active" },
        { product: "Galaxy Tab S10", assembly: "Display Module Assy", level: "carry-over", qty: "1 EA", status: "Active" },
        { product: "Project Atlas (concept)", assembly: "—", level: "evaluating", qty: "—", status: "Evaluating" },
      ],
      history: [
        { ts: "2024 Q2", text: "Registered as master item (IC,DISPLAY DRIVER,90HZ)" },
        { ts: "2024 Q3", text: "Sourced from Apex Silicon — PO #2024-1187" },
        { ts: "2024 Q4", text: "Apex AX-7421 EOL / last-time-buy notice received" },
        { ts: "2025 Q1", text: "120Hz panel upgrade → 120Hz-capable second source required" },
      ],
      priceTrend: [
        { label: "23Q4", value: 12.4 }, { label: "24Q1", value: 12.3 }, { label: "24Q2", value: 12.2 },
        { label: "24Q3", value: 12.1 }, { label: "24Q4", value: 12.0 }, { label: "25Q1", value: 12.0 },
      ],
      demand: [
        { label: "23Q4", value: 95 }, { label: "24Q1", value: 120 }, { label: "24Q2", value: 180 },
        { label: "24Q3", value: 220 }, { label: "24Q4", value: 260 }, { label: "25Q1", value: 310 },
      ],
      priceBasis: [
        { label: "Internal std", value: 12.0 }, { label: "Carry-over", value: 12.0 }, { label: "Market", value: 12.3 },
        { label: "Should-cost", value: 11.8 }, { label: "Target", value: 11.8, target: true },
      ],
    };
  }
  return {
    whereUsed: (item && item.whereUsed) || [
      { product: "Galaxy S25 Ultra", assembly: (item && item.category) || "Assembly", level: "Lv3", qty: "1 EA", status: "Active" },
    ],
    history: (item && item.usageHistory) || [
      { ts: "2024 Q3", text: "Registered as master item" },
      { ts: "2024 Q4", text: "First used in current program" },
    ],
    priceTrend: (item && item.priceTrend) || [
      { label: "24Q1", value: 12.0 }, { label: "24Q2", value: 11.8 }, { label: "24Q3", value: 11.5 },
      { label: "24Q4", value: 11.6 }, { label: "25Q1", value: 11.4 },
    ],
    demand: (item && item.demand) || [
      { label: "24Q1", value: 60 }, { label: "24Q2", value: 75 }, { label: "24Q3", value: 80 },
      { label: "24Q4", value: 90 }, { label: "25Q1", value: 95 },
    ],
    priceBasis: (item && item.priceBasis) || [
      { label: "Internal std", value: 12.0 }, { label: "Carry-over", value: 11.5 }, { label: "Market", value: 12.5 },
      { label: "Target", value: 11.8, target: true },
    ],
  };
}

function getItemAlternatives(item) {
  const hero = item && item.id === 3;
  const base = {
    name: shortItemName(item) || item.partName || item.desc || "Current item",
    price: hero ? 12.0 : 12.0,
    lead: hero ? 14 : 4,
    risk: hero ? "Medium" : "Low",
  };
  // Global / catalog reference rows. `avl` = on the Approved Vendor/Part List.
  // `nav` = minimal item payload so a row can open that part's own Item 360.
  const mk = (o) => ({ programs: 0, quality: "—", ...o, nav: { id: o.navId, partId: o.partId, partName: o.navName, desc: o.desc || o.name, category: o.category || (item && item.category) || "Part" } });
  const alts = hero ? [
    mk({ id: "a1", navId: 9301, partId: "DDIC-TX-6620", name: 'TDDI TX-6620 · 4-lane · 120Hz', navName: 'Display Driver IC TX-6620 (Triton Semiconductor)', supplier: "Triton Semiconductor", match: 95, price: 11.8, lead: 10, risk: "Low", avl: true, avlStatus: "Approved", specDelta: "Drop-in · 4-lane MIPI · 120Hz · COF", programs: 3, quality: "A", feasible: true }),
    mk({ id: "a2", navId: 9302, partId: "DDIC-ID-5500", name: 'DDIC ID-5500 · 4-lane · 120Hz', navName: 'Display Driver IC ID-5500 (Ironwood)', supplier: "Ironwood Semi", match: 86, price: 12.1, lead: 8, risk: "Low", avl: true, avlStatus: "Qualified", specDelta: "120Hz timing needs re-validation", programs: 2, quality: "A", feasible: true }),
    mk({ id: "a3", navId: 9303, partId: "DDIC-AX-7421", name: 'DDIC AX-7421 · 4-lane · 90Hz', navName: 'Display Driver IC AX-7421 (Apex · EOL)', supplier: "Apex Silicon", match: 79, price: 12.0, lead: 14, risk: "High", avl: false, avlStatus: "EOL", specDelta: "90Hz max · fails 120Hz · last-time-buy", programs: 1, quality: "B", feasible: false }),
    mk({ id: "a4", navId: 9304, partId: "DDIC-GD-4200", name: 'DDIC GD-4200 · 4-lane · 120Hz', navName: 'Display Driver IC GD-4200 (Griffin)', supplier: "Griffin Sensors", match: 80, price: 11.3, lead: 12, risk: "Medium", avl: false, avlStatus: "Unapproved", specDelta: "COG package · needs COF retape + qual", programs: 0, quality: "—", feasible: true }),
  ] : [
    mk({ id: "a1", navId: (item.id || 0) * 10 + 1, partId: (item.partId || "ALT") + "-A", name: (item.category || "Part") + " · alternate A", navName: (shortItemName(item) || "Alternate A"), supplier: "Alt supplier", match: 91, price: +(base.price * 0.95).toFixed(1), lead: base.lead, risk: "Low", avl: true, avlStatus: "Approved", specDelta: "Comparable spec", programs: 2, quality: "A", feasible: true }),
    mk({ id: "a2", navId: (item.id || 0) * 10 + 2, partId: (item.partId || "ALT") + "-B", name: (item.category || "Part") + " · alternate B", navName: "Alternate B", supplier: "Alt supplier", match: 84, price: +(base.price * 1.02).toFixed(1), lead: base.lead + 1, risk: "Low", avl: false, avlStatus: "Unapproved", specDelta: "Slightly higher cost", programs: 0, quality: "B", feasible: true }),
  ];
  return { base, alts };
}

function MiniLineChart({ data, color = C.primary, unit = "$" }) {
  const W = 560, H = 150, pl = 14, pr = 16, pt = 22, pb = 26;
  const vals = data.map((d) => d.value);
  const min = Math.min(...vals), max = Math.max(...vals), rng = (max - min) || 1;
  const iw = W - pl - pr, ih = H - pt - pb;
  const X = (i) => pl + (data.length === 1 ? iw / 2 : (i / (data.length - 1)) * iw);
  const Y = (v) => pt + ih - ((v - min) / rng) * ih;
  const line = data.map((d, i) => `${X(i).toFixed(1)},${Y(d.value).toFixed(1)}`).join(" ");
  const area = `${pl},${pt + ih} ${line} ${pl + iw},${pt + ih}`;
  const lastV = data[data.length - 1].value;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="xMidYMid meet" style={{ display: "block", width: "100%", maxWidth: 460, marginInline: "auto" }}>
      <polygon points={area} fill={color} opacity="0.08" />
      <polyline points={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => {
        const last = i === data.length - 1;
        return (
          <g key={i}>
            <circle cx={X(i)} cy={Y(d.value)} r={last ? 4 : 3} fill={last ? color : "#fff"} stroke={color} strokeWidth="2" />
            <text x={X(i)} y={H - 8} textAnchor="middle" fontSize="11" fill={C.textDisabled}>{d.label}</text>
          </g>
        );
      })}
      <text x={X(data.length - 1)} y={Y(lastV) - 9} textAnchor="end" fontSize="12" fontWeight="700" fill={color}>{unit}{lastV}</text>
    </svg>
  );
}

function MiniBarChart({ data, color = C.secondary }) {
  const W = 560, H = 150, pl = 14, pr = 14, pt = 18, pb = 26;
  const max = Math.max(...data.map((d) => d.value)) || 1;
  const iw = W - pl - pr, ih = H - pt - pb, slot = iw / data.length, bw = slot * 0.55;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" preserveAspectRatio="xMidYMid meet" style={{ display: "block", width: "100%", maxWidth: 460, marginInline: "auto" }}>
      {data.map((d, i) => {
        const h = (d.value / max) * ih, bx = pl + i * slot + (slot - bw) / 2, by = pt + ih - h, last = i === data.length - 1;
        return (
          <g key={i}>
            <rect x={bx} y={by} width={bw} height={h} rx="3" fill={last ? C.primary : color} opacity={last ? 1 : 0.45} />
            <text x={bx + bw / 2} y={by - 4} textAnchor="middle" fontSize="10" fontWeight="600" fill={last ? C.primary : C.textDisabled}>{d.value}</text>
            <text x={bx + bw / 2} y={H - 8} textAnchor="middle" fontSize="11" fill={C.textDisabled}>{d.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function I360SpecTab({ item }) {
  const ctx = getItemContext(item);
  const entries = Object.entries(item.spec || {});
  const _full = item.partName || item.desc || "";
  const _nm = (shortItemName(item) || "").trim();
  let _spec = _full;
  if (_nm && _full.toLowerCase().startsWith(_nm.toLowerCase())) {
    const rest = _full.slice(_nm.length).replace(/^[\s,·:\-–—]+/, "").trim();
    if (rest) _spec = rest;
  }
  const Card = ({ label, children }) => (
    <div className="rounded-lg border p-3 mb-3" style={{ borderColor: C.border }}>
      <div className="text-[10px] font-semibold tracking-wide mb-2" style={{ color: C.textDisabled }}>{label}</div>
      {children}
    </div>
  );

  return (
    <div>
      {/* IDENTITY — master record (merged from former Overview) */}
      <div className="rounded-lg border p-3 mb-3" style={{ borderColor: C.border, backgroundColor: C.surfaceTinted }}>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
          <div className="col-span-2 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[10px] tracking-wide" style={{ color: C.textDisabled }}>Spec</span>
              {ctx.isEndItem && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold" style={{ backgroundColor: C.primarySoft, color: C.primary }}>End Item</span>
              )}
            </div>
            <div className="text-[11px] font-medium truncate" style={{ color: C.textPrimary }} title={_spec}>{_spec}</div>
          </div>
          {[
            ["Item code", item.itemCode && item.itemCode !== "N/A" ? item.itemCode : "—"],
            ["Part ID", item.partId || "—"],
            ["Category", item.category || "—"],
            ["UOM", item.uom || "EA"],
          ].map(([k, v]) => (
            <div key={k} className="min-w-0">
              <div className="text-[10px] tracking-wide mb-0.5" style={{ color: C.textDisabled }}>{k}</div>
              <div className="text-[11px] font-medium truncate" style={{ color: C.textPrimary }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-[11px] leading-relaxed flex items-start gap-1.5" style={{ color: C.textDisabled }}>
        <Info className="w-3 h-3 mt-0.5 shrink-0" />
        Baseline master record. Project spec changes &amp; switch analysis live in the design workspace and chat.
      </div>
    </div>
  );
}

function ItemAlternativesTab({ item, onNavigate }) {
  const { alts } = getItemAlternatives(item);
  const isCurrent = (x) => (x.avlStatus === "EOL") || (item.supplier && x.supplier === item.supplier); // incumbent / current part
  const rows = [...alts].filter((x) => !isCurrent(x)).sort((a, b) => (b.match || 0) - (a.match || 0));
  const matchTone = (m) => (m >= 90 ? { bg: C.successLight, c: C.success } : m >= 80 ? { bg: C.warningLight, c: C.warning } : { bg: C.bg, c: C.textSecondary });
  const avlTone = (s) => {
    const k = (s || "").toLowerCase();
    if (k === "approved") return { bg: C.successLight, c: C.success };
    if (k === "qualified") return { bg: C.primaryLight, c: C.primary };
    if (k === "eol") return { bg: C.errorLight, c: C.error };
    return { bg: C.bg, c: C.textSecondary }; // unapproved / catalog
  };
  const mono = (name) => (name || "?").split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const hashColor = (str) => {
    const palette = [C.primary, "#1570ef", "#dc6803", "#039855", "#7c3aed", "#0e9384"];
    let h = 0; for (let i = 0; i < (str || "").length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return palette[h % palette.length];
  };

  return (
    <div className="space-y-3">
      <div className="text-[11px] leading-relaxed" style={{ color: C.textSecondary }}>
        Catalog &amp; AVL alternates for this part — approved and unapproved together, compared on spec, price, lead, and quality. Bands are global reference; to evaluate one for this NPI, use the Details panel.
      </div>

      <div className="rounded-lg border overflow-x-auto" style={{ borderColor: C.border }}>
        <table className="w-full text-left" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr className="text-[11px] border-b" style={{ borderColor: C.border, color: C.textSecondary }}>
              <th className="py-2.5 px-2.5 font-medium text-left">Part · Supplier</th>
              <th className="py-2.5 px-2 font-medium text-left whitespace-nowrap">AVL</th>
              <th className="py-2.5 px-2 font-medium text-center">Match</th>
              <th className="py-2.5 px-2 font-medium text-left">Spec Δ</th>
              <th className="py-2.5 px-2 font-medium text-right">Price</th>
              <th className="py-2.5 px-2 font-medium text-right">Lead</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => {
              const mt = matchTone(x.match);
              const at = avlTone(x.avlStatus);
              return (
                <tr key={x.id}
                  className="border-t"
                  style={{ borderColor: C.borderLight, opacity: x.feasible === false ? 0.78 : 1 }}>
                  {/* Part · Supplier (avatar = supplier monogram) */}
                  <td className="py-2 px-2.5">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 text-[10px] font-bold text-white" style={{ backgroundColor: hashColor(x.supplier) }}>{mono(x.supplier)}</span>
                      <div className="min-w-0">
                        <div className="text-[12px] font-medium truncate max-w-[220px]" style={{ color: C.textPrimary }}>{x.name}</div>
                        <div className="text-[10px] truncate max-w-[220px] inline-flex items-center gap-1" style={{ color: C.textSecondary }}><Building2 className="w-2.5 h-2.5 shrink-0" />{x.supplier}</div>
                      </div>
                    </div>
                  </td>
                  {/* AVL status */}
                  <td className="py-2 px-2">
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded whitespace-nowrap" style={{ backgroundColor: at.bg, color: at.c }}>{x.avlStatus}</span>
                  </td>
                  {/* Match */}
                  <td className="py-2 px-2 text-center">
                    <span className="text-[11px] font-semibold tabular-nums px-1.5 py-0.5 rounded" style={{ backgroundColor: mt.bg, color: mt.c }}>{x.match}%</span>
                  </td>
                  {/* Spec delta */}
                  <td className="py-2 px-2">
                    <span className="text-[11px] leading-snug" style={{ color: x.feasible === false ? C.error : C.textSecondary }}>{x.specDelta}</span>
                  </td>
                  {/* Price band */}
                  <td className="py-2 px-2 text-right">
                    <span className="text-[11px] tabular-nums whitespace-nowrap" style={{ color: C.textPrimary }}>${x.price.toFixed(2)}</span>
                  </td>
                  {/* Lead */}
                  <td className="py-2 px-2 text-right">
                    <span className="text-[11px] tabular-nums" style={{ color: C.textSecondary }}>{x.lead}w</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* legend */}
      <div className="flex items-center gap-3 flex-wrap text-[10px]" style={{ color: C.textDisabled }}>
        <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: C.success }} />Approved (AVL)</span>
        <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: C.primary }} />Qualified</span>
        <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: C.textSecondary }} />Unapproved · catalog</span>
      </div>
    </div>
  );
}

function ItemSupplierTab({ item, onOpenSupplier }) {
  const list = getSupplierProfiles(item);
  const riskColor = (r) => (r === "Low" ? C.success : r === "Med" ? C.warning : C.error);
  return (
    <div className="space-y-4">
      <div className="text-[11px] leading-relaxed" style={{ color: C.textSecondary }}>
        Supplier company profiles — capability and track record (master reference). Selection &amp; award for this project live in the right-panel status.
      </div>
      {list.map((s, i) => (
        <button key={i} onClick={() => onOpenSupplier && onOpenSupplier(s)}
          className="w-full text-left rounded-lg border p-3 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2" style={{ borderColor: C.border }}>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 text-[11px] font-bold text-white" style={{ backgroundColor: s.logo ? s.logo.bg : C.textSecondary }}>
              {s.logo ? s.logo.text : <Building2 className="w-4 h-4" style={{ color: "white" }} />}
            </span>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold truncate" style={{ color: C.textPrimary }}>{s.name}</div>
              <div className="text-[10px]" style={{ color: C.textDisabled }}>{s.region}</div>
            </div>
            <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-medium shrink-0" style={{ color: riskColor(s.risk) }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: riskColor(s.risk) }} />{s.risk} risk
            </span>
            <ChevronRight className="w-4 h-4 shrink-0" style={{ color: C.textDisabled }} />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-2.5">
            {[["Capability", s.capability], ["Performance", s.performance]].map(([k, v]) => (
              <div key={k}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px]" style={{ color: C.textDisabled }}>{k}</span>
                  <span className="text-[10px] font-semibold tabular-nums" style={{ color: C.textPrimary }}>{v}</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: C.bg }}>
                  <div className="h-full rounded-full" style={{ width: `${v}%`, backgroundColor: C.primary }} />
                </div>
              </div>
            ))}
          </div>
          {s.certs && s.certs.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1.5">
              {s.certs.map((c) => (
                <span key={c} className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: C.surfaceTinted, color: C.textSecondary }}>
                  <ShieldCheck className="w-2.5 h-2.5" />{c}
                </span>
              ))}
            </div>
          )}
          <div className="text-[11px] leading-snug" style={{ color: C.textSecondary }}>{s.note}</div>
        </button>
      ))}
    </div>
  );
}

function ItemPriceTab({ item }) {
  const u = getItemUsage(item);
  const suppliers = getSupplierProfiles(item);
  return (
    <div className="space-y-5">
      <div className="text-[11px] leading-relaxed" style={{ color: C.textSecondary }}>
        Reference pricing — historical trend, basis benchmark, and indicative supplier prices (master, project-independent). This project's target &amp; quote live in the right-panel status.
      </div>

      {/* price trend */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold tracking-wide" style={{ color: C.textDisabled }}>Price trend</span>
          {(() => {
            const a = u.priceTrend[0].value, b = u.priceTrend[u.priceTrend.length - 1].value;
            const pct = a ? ((b - a) / a) * 100 : 0;
            const up = pct >= 0;
            return (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold" style={{ color: up ? C.error : C.success }}>
                {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{up ? "+" : ""}{pct.toFixed(0)}% · ${a.toFixed(1)}→${b.toFixed(1)}
              </span>
            );
          })()}
        </div>
        <div className="rounded-lg border p-2" style={{ borderColor: C.border }}>
          <MiniLineChart data={u.priceTrend} unit="$" />
        </div>
        <div className="text-[10px] mt-1" style={{ color: C.textDisabled }}>Reference unit price by quarter — benchmark, not this project's quote.</div>
      </div>

      {/* price benchmark by basis */}
      {u.priceBasis && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold tracking-wide" style={{ color: C.textDisabled }}>Price benchmark</span>
            <span className="text-[10px]" style={{ color: C.textDisabled }}>by basis ($)</span>
          </div>
          <div className="rounded-lg border p-3" style={{ borderColor: C.border }}>
            {(() => {
              const maxV = Math.max(...u.priceBasis.map((x) => x.value)) || 1;
              return u.priceBasis.map((b, i) => (
                <div key={i} className="flex items-center gap-2 mb-2 last:mb-0">
                  <span className="w-20 text-[11px] truncate shrink-0" style={{ color: b.target ? C.primary : C.textSecondary, fontWeight: b.target ? 600 : 400 }}>{b.label}</span>
                  <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: C.bg }}>
                    <div className="h-full rounded-full" style={{ width: `${(b.value / maxV) * 100}%`, backgroundColor: b.target ? C.primary : C.secondary, opacity: b.target ? 1 : 0.55 }} />
                  </div>
                  <span className="w-12 text-right text-[11px] tabular-nums font-medium shrink-0" style={{ color: b.target ? C.primary : C.textPrimary }}>${b.value.toFixed(1)}</span>
                </div>
              ));
            })()}
            <div className="text-[10px] mt-1.5" style={{ color: C.textDisabled }}>Target shown vs internal / carry-over / market / should-cost bases.</div>
          </div>
        </div>
      )}

      {/* supplier unit price comparison */}
      {suppliers.length > 1 && (() => {
        const maxP = Math.max(...suppliers.map((x) => x.unitPrice || 0)) || 1;
        const minP = Math.min(...suppliers.map((x) => x.unitPrice || Infinity));
        return (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold tracking-wide" style={{ color: C.textDisabled }}>Supplier price</span>
              <span className="text-[10px]" style={{ color: C.textDisabled }}>indicative ($) · lead time</span>
            </div>
            <div className="rounded-lg border p-3" style={{ borderColor: C.border }}>
              {suppliers.map((s, i) => {
                const low = s.unitPrice === minP;
                return (
                  <div key={i} className="flex items-center gap-2 mb-2 last:mb-0">
                    <span className="w-24 text-[11px] truncate shrink-0" style={{ color: C.textSecondary }}>{s.name}</span>
                    <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: C.bg }}>
                      <div className="h-full rounded-full" style={{ width: `${((s.unitPrice || 0) / maxP) * 100}%`, backgroundColor: low ? C.success : C.secondary, opacity: low ? 1 : 0.6 }} />
                    </div>
                    <span className="w-20 text-right text-[11px] tabular-nums font-medium shrink-0" style={{ color: low ? C.success : C.textPrimary }}>${(s.unitPrice || 0).toFixed(1)} · {s.leadTime}wk</span>
                  </div>
                );
              })}
              <div className="text-[10px] mt-1.5" style={{ color: C.textDisabled }}>Lowest indicative price highlighted — reference only, not an awarded quote.</div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function ItemUsageTab({ item, onOpenProduct }) {
  const u = getItemUsage(item);
  const stColor = (s) => (s === "Active" ? C.success : s === "Evaluating" ? C.warning : C.textSecondary);
  return (
    <div className="space-y-5">
      <div className="text-[11px] leading-relaxed" style={{ color: C.textSecondary }}>
        Master record — where this item is used and how it has been utilized across programs (project-independent).
      </div>

      <div>
        <div className="text-[11px] font-semibold tracking-wide mb-2" style={{ color: C.textDisabled }}>Where-used</div>
        <div className="rounded-lg border overflow-hidden" style={{ borderColor: C.border }}>
          {u.whereUsed.map((w, i) => (
            <button key={i} onClick={() => onOpenProduct && onOpenProduct(w)}
              className="w-full text-left flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-gray-50 focus:outline-none" style={{ borderTop: i ? `1px solid ${C.border}` : "none" }}>
              <Package className="w-4 h-4 shrink-0" style={{ color: C.textSecondary }} />
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium truncate" style={{ color: C.textPrimary }}>{w.product}</div>
                <div className="text-[10px] truncate" style={{ color: C.textDisabled }}>{w.assembly} · {w.level} · {w.qty}</div>
              </div>
              <span className="text-[10px] font-medium shrink-0" style={{ color: stColor(w.status) }}>{w.status}</span>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" style={{ color: C.textDisabled }} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold tracking-wide" style={{ color: C.textDisabled }}>Demand</span>
          <span className="text-[10px]" style={{ color: C.textDisabled }}>units (K) · per quarter</span>
        </div>
        <div className="rounded-lg border p-2" style={{ borderColor: C.border }}>
          <MiniBarChart data={u.demand} />
        </div>
      </div>

      <div>
        <div className="text-[11px] font-semibold tracking-wide mb-2" style={{ color: C.textDisabled }}>Utilization history</div>
        <div className="space-y-2.5">
          {u.history.map((h, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="text-[10px] font-medium tabular-nums shrink-0 w-14 pt-0.5" style={{ color: C.textSecondary }}>{h.ts}</span>
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: i === u.history.length - 1 ? C.primary : C.border }} />
              <span className="text-[12px] leading-snug" style={{ color: C.textPrimary }}>{h.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SupplierDetailPopup({ supplier, onClose }) {
  const s = supplier;
  const riskTone = s.risk === "Low" ? { bg: C.successLight, c: C.success } : s.risk === "High" ? { bg: C.errorLight, c: C.error } : { bg: C.warningLight, c: C.warning };
  const onTime = s.performance ? Math.min(99, s.performance + 3) : 95;
  const quality = s.capability ? Math.min(99, s.capability) : 92;
  const activePos = s.name === "Lumina Display" ? 14 : s.name === "Vega Optronics" ? 5 : s.name === "Nimbus Panels" ? 9 : s.name === "Orbit Components" ? 11 : s.name === "Pulse Devices" ? 4 : 7;
  const partsSupplied = s.name === "Lumina Display" ? 47 : s.name === "Vega Optronics" ? 16 : s.name === "Nimbus Panels" ? 28 : s.name === "Orbit Components" ? 33 : s.name === "Pulse Devices" ? 14 : 21;
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 120 }} onClick={onClose}>
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(16,24,40,0.45)" }} />
      <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden w-full flex flex-col" style={{ maxWidth: 440, maxHeight: "82vh" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 p-4 border-b shrink-0" style={{ borderColor: C.border }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-[13px] font-bold text-white" style={{ backgroundColor: s.logo ? s.logo.bg : C.primary }}>
            {s.logo ? s.logo.text : <Building2 className="w-5 h-5" style={{ color: "white" }} />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold truncate" style={{ color: C.textPrimary }}>{s.name}</div>
            <div className="text-[11px]" style={{ color: C.textSecondary }}>{s.region} · Supplier 360</div>
          </div>
          <button onClick={onClose} className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 focus:outline-none"><X className="w-4 h-4" style={{ color: C.textSecondary }} /></button>
        </div>
        <div className="p-4 overflow-y-auto space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { k: "Risk", v: s.risk, tone: riskTone },
              { k: "Unit price", v: s.unitPrice != null ? `$${s.unitPrice.toFixed(1)}` : "—" },
              { k: "Lead time", v: s.leadTime ? `${s.leadTime}wk` : "—" },
              { k: "On-time", v: `${onTime}%` },
              { k: "Quality", v: `${quality}` },
              { k: "Active POs", v: activePos },
            ].map((m) => (
              <div key={m.k} className="rounded-lg border px-2 py-2 text-center" style={{ borderColor: C.borderLight }}>
                <div className="text-[9px] tracking-wide mb-0.5" style={{ color: C.textDisabled }}>{m.k}</div>
                {m.tone
                  ? <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[11px] font-semibold" style={{ backgroundColor: m.tone.bg, color: m.tone.c }}>{m.v}</span>
                  : <div className="text-[13px] font-bold tabular-nums leading-none" style={{ color: C.textPrimary }}>{m.v}</div>}
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {[["Capability", s.capability], ["Performance", s.performance]].map(([k, v]) => (
              <div key={k}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold tracking-wide" style={{ color: C.textDisabled }}>{k}</span>
                  <span className="text-[10px] font-medium tabular-nums" style={{ color: C.textSecondary }}>{v}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: C.bg }}>
                  <div className="h-full rounded-full" style={{ width: `${v}%`, backgroundColor: C.primary }} />
                </div>
              </div>
            ))}
          </div>
          {s.certs && s.certs.length > 0 && (
            <div>
              <div className="text-[10px] font-semibold tracking-wide mb-1.5" style={{ color: C.textDisabled }}>Certifications</div>
              <div className="flex flex-wrap gap-1">
                {s.certs.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium" style={{ backgroundColor: C.surfaceTinted, color: C.textSecondary }}><ShieldCheck className="w-2.5 h-2.5" />{c}</span>
                ))}
              </div>
            </div>
          )}
          <div className="rounded-lg p-2.5" style={{ backgroundColor: C.surfaceTinted }}>
            <div className="flex items-center gap-2 text-[11px]" style={{ color: C.textSecondary }}>
              <Package className="w-3.5 h-3.5 shrink-0" /><span className="font-medium" style={{ color: C.textPrimary }}>{partsSupplied}</span> parts supplied across active projects
            </div>
            {s.note && <div className="text-[11px] mt-1.5 leading-snug" style={{ color: C.textSecondary }}>{s.note}</div>}
          </div>
          <div className="text-[10px]" style={{ color: C.textDisabled }}>Reference supplier profile (master) — award &amp; quotes are per-project in the workspace.</div>
        </div>
      </div>
    </div>
  );
}

function ProductDetailPopup({ product, item, onClose }) {
  const p = product;
  const META = {
    "Galaxy S25 Ultra": { code: "BPM260400345", phase: "Define", parts: 80, pm: "Paige Kim" },
    "Galaxy S25+": { code: "BPM260400346", phase: "Define", parts: 74, pm: "Paige Kim" },
    "Galaxy Tab S10": { code: "BPM260300118", phase: "Develop", parts: 96, pm: "Joon Seo" },
    "Project Atlas (concept)": { code: "BPM260500021", phase: "Concept", parts: 12, pm: "Mara Cho" },
  };
  const meta = META[p.product] || { code: "BPM260400000", phase: "Define", parts: 80, pm: "—" };
  const stColor = p.status === "Active" ? C.success : p.status === "Evaluating" ? C.warning : C.textSecondary;
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 120 }} onClick={onClose}>
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(16,24,40,0.45)" }} />
      <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden w-full flex flex-col" style={{ maxWidth: 440, maxHeight: "82vh" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 p-4 border-b shrink-0" style={{ borderColor: C.border }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: C.primarySoft }}>
            <Boxes className="w-5 h-5" style={{ color: C.primary }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold truncate" style={{ color: C.textPrimary }}>{p.product}</div>
            <div className="text-[11px]" style={{ color: C.textSecondary }}>{meta.code} · Project using this item</div>
          </div>
          <button onClick={onClose} className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 focus:outline-none"><X className="w-4 h-4" style={{ color: C.textSecondary }} /></button>
        </div>
        <div className="p-4 overflow-y-auto space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {[
              { k: "Phase", v: meta.phase },
              { k: "Parts", v: meta.parts },
              { k: "PM", v: meta.pm },
            ].map((m) => (
              <div key={m.k} className="rounded-lg border px-2 py-2 text-center" style={{ borderColor: C.borderLight }}>
                <div className="text-[9px] tracking-wide mb-0.5" style={{ color: C.textDisabled }}>{m.k}</div>
                <div className="text-[12px] font-bold leading-none truncate" style={{ color: C.textPrimary }}>{m.v}</div>
              </div>
            ))}
          </div>
          <div>
            <div className="text-[10px] font-semibold tracking-wide mb-1.5" style={{ color: C.textDisabled }}>This item&apos;s role here</div>
            <div className="rounded-lg border p-3" style={{ borderColor: C.border }}>
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-3.5 h-3.5 shrink-0" style={{ color: C.textDisabled }} />
                <span className="text-[12px] font-medium truncate" style={{ color: C.textPrimary }}>{(item && (item.partName || item.desc)) || "This item"}</span>
              </div>
              <div className="grid grid-cols-3 gap-x-3 gap-y-1.5">
                {[["Assembly", p.assembly || "—"], ["Level", p.level || "—"], ["Qty", p.qty || "—"]].map(([k, v]) => (
                  <div key={k}>
                    <div className="text-[9px] tracking-wide" style={{ color: C.textDisabled }}>{k}</div>
                    <div className="text-[11px] font-medium truncate" style={{ color: C.textPrimary }}>{v}</div>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="text-[10px]" style={{ color: C.textDisabled }}>Status</span>
                <span className="text-[11px] font-semibold" style={{ color: stColor }}>{p.status}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose}
            className="w-full inline-flex items-center justify-center gap-1.5 h-9 rounded-lg text-[12px] font-semibold focus:outline-none"
            style={{ backgroundColor: C.primary, color: "#fff" }}>
            Open project<ArrowRight className="w-3.5 h-3.5" />
          </button>
          <div className="text-[10px]" style={{ color: C.textDisabled }}>Cross-project reference — opens this project&apos;s overview.</div>
        </div>
      </div>
    </div>
  );
}

function Item360Full({ item, scenarioStep = 0, activeBom = "E", onOpenChat, tab: controlledTab, onTabChange, onNavigate }) {
  const isHero = item.id === 3;
  const isMissing = (activeBom === "Q" && i360_qMissingIds.includes(item.id) && scenarioStep < 7) ||
                    (activeBom === "C" && i360_cMissingIds.includes(item.id) && scenarioStep < 6);
  const isLagged = (activeBom === "C" || activeBom === "Q") && i360_eLagIds.includes(item.id);
  const [localTab, setLocalTab] = useState("spec");
  const tab = controlledTab !== undefined ? controlledTab : localTab;
  const setTab = onTabChange || setLocalTab;
  const [supplierSel, setSupplierSel] = useState(null);
  const [productSel, setProductSel] = useState(null);
  // On item change (incl. navigating to a similar item) keep the active tab; just reset sub-selections.
  useEffect(() => { setSupplierSel(null); setProductSel(null); /* eslint-disable-next-line */ }, [item.id]);
  const _supplierCount = getSupplierProfiles(item).length;
  const _usageCount = getItemUsage(item).whereUsed.length;
  const _altCount = getItemAlternatives(item).alts.length;
  const TABS = [
    { id: "spec", label: "Spec" },
    { id: "alt", label: "Related", count: _altCount },
    { id: "supplier", label: "Supplier", count: _supplierCount },
    { id: "price", label: "Price" },
    { id: "usage", label: "Usage", count: _usageCount },
  ];
  return (
    <div>
      {/* Pinned tabs — sticky to the top of the scroll area, flush under the header */}
      <div className="sticky top-0 z-10 px-4" style={{ backgroundColor: C.surface }}>
        <div className="flex border-b" style={{ borderColor: C.border }}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex-1 min-w-0 px-2 h-10 text-[12px] font-medium border-b-2 truncate transition-colors hover:bg-gray-50 focus:outline-none inline-flex items-center justify-center gap-1.5"
              style={{ borderColor: tab === t.id ? C.primary : "transparent", color: tab === t.id ? C.primary : C.textSecondary }}>
              <span className="truncate">{t.label}</span>
              {t.count > 0 && (
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-semibold tabular-nums shrink-0"
                  style={{ backgroundColor: tab === t.id ? C.primaryLight : C.containerQuaternary, color: tab === t.id ? C.primary : C.textSecondary }}>{t.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>
      {/* content */}
      <div className="px-4 pt-3 pb-4">
        {tab === "spec" && <I360SpecTab item={item} />}
        {tab === "alt" && <ItemAlternativesTab item={item} onNavigate={onNavigate} />}
        {tab === "supplier" && <ItemSupplierTab item={item} onOpenSupplier={setSupplierSel} />}
        {tab === "price" && <ItemPriceTab item={item} />}
        {tab === "usage" && <ItemUsageTab item={item} onOpenProduct={setProductSel} />}
      </div>

      {supplierSel && <SupplierDetailPanel name={supplierSel.name || supplierSel} onClose={() => setSupplierSel(null)} />}
      {productSel && <ProductDetailPopup product={productSel} item={item} onClose={() => setProductSel(null)} />}
    </div>
  );
}

function Item360Overlay({ item, scenarioStep = 0, activeBom = "E", onClose, onOpenChat, tab, onTabChange, onNavigate }) {
  if (!item) return null;
  const title = shortItemName(item) || item.partId || "Item 360";
  const code = item.itemCode && item.itemCode !== "N/A" ? item.itemCode : (item.partId || "");
  const _hMissing = (activeBom === "Q" && i360_qMissingIds.includes(item.id) && scenarioStep < 7) ||
                    (activeBom === "C" && i360_cMissingIds.includes(item.id) && scenarioStep < 6);
  const _hb = _statusBadge(item, activeBom, _hMissing);
  const head = (
    <div className="shrink-0 flex items-start justify-between gap-2 px-4 py-2.5 border-b" style={{ borderColor: C.border }}>
      <div className="min-w-0 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: item.id === 3 ? C.warningLight : C.bg }}>
          <Box className="w-4.5 h-4.5" style={{ color: item.id === 3 ? C.warning : C.textSecondary }} />
        </div>
        <div className="min-w-0">
          <div className="text-[9px] font-semibold tracking-wide uppercase" style={{ color: C.textDisabled }}>Master item record</div>
          <div className="text-[14px] font-semibold truncate leading-tight" style={{ color: C.textPrimary }}>{title}</div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-[11px] tabular-nums" style={{ color: C.textSecondary }}>{item.partId}{code && code !== item.partId ? ` · ${code}` : ""}</span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium" style={{ backgroundColor: _hb.bg, color: _hb.color }}>
              <_hb.Icon className="w-2.5 h-2.5" />Project lens: {activeBom}-BOM · {_hb.label}
            </span>
          </div>
        </div>
      </div>
      <button onClick={onClose} title="Close" className="shrink-0 w-7 h-7 rounded-md flex items-center justify-center hover:bg-gray-100" style={{ color: C.textSecondary }}>
        <X className="w-4 h-4" />
      </button>
    </div>
  );
  const body = (
    <div className="flex-1 overflow-y-auto" style={{ backgroundColor: C.surface }}>
      <Item360Full item={item} scenarioStep={scenarioStep} activeBom={activeBom} onOpenChat={onOpenChat} tab={tab} onTabChange={onTabChange} onNavigate={onNavigate} />
    </div>
  );
  if (ITEM360_MODE === "modal") {
    return (
      <div className="fixed inset-0 flex items-center justify-center px-4 md:px-6 py-6" style={{ zIndex: 55, paddingTop: 60 }}>
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(16,24,40,0.45)" }} onClick={onClose} />
        <div className="relative bg-white rounded-2xl shadow-2xl flex flex-col w-full overflow-hidden" style={{ maxWidth: 920, height: 720, maxHeight: "calc(100vh - 84px)" }}>
          {head}{body}
        </div>
      </div>
    );
  }
  return (
    <div className="fixed inset-0" style={{ zIndex: 110 }}>
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(16,24,40,0.35)" }} onClick={onClose} />
      <div className="absolute top-0 right-0 h-full bg-white shadow-2xl flex flex-col" style={{ width: 460, maxWidth: "94vw" }}>
        {head}{body}
      </div>
    </div>
  );
}

// === SUPPLIER 360 PANEL ===
// Opened from a supplier name in the C-BOM grid. Layout follows the Supplier Details spec:
// identity header, tags, AI summary, Purchase History (chart + table), RFx History table.
function SupplierDetailPanel({ name, onClose }) {
  const [tab, setTab] = useState("Overview");
  const [opOrg, setOpOrg] = useState(0);
  const TABS = ["Overview", "About", "Org. & Sourcing", "Operations", "Financial", "Evaluation", "Documents", "News"];
  const tags = ["Display", "Optical Film", "Tier-1 vendor"];

  // Purchase History (Overview) chart geometry
  const quarters = [
    { label: "Q1 2024", po: 72, line: 0.05 }, { label: "Q2 2024", po: 96, line: 0.15 },
    { label: "Q3 2024", po: 88, line: 0.10 }, { label: "Q4 2024", po: 165, line: 0.46 },
    { label: "Q1 2025", po: 150, line: 0.40 }, { label: "Q2 2025", po: 175, line: 0.60 },
    { label: "Q3 2025", po: 105, line: 0.14 },
  ];
  const W = 760, H = 200, padL = 56, padR = 14, padB = 26, padT = 12;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const yFor = (k) => padT + plotH * (1 - k);
  const xFor = (i) => padL + (plotW / quarters.length) * (i + 0.5);
  const barW = (plotW / quarters.length) * 0.5;
  const linePts = quarters.map((q, i) => `${xFor(i)},${yFor(q.line)}`).join(" ");

  // ---------- shared UI ----------
  const Card = ({ title, children, pad = true }) => (
    <div className="rounded-xl border bg-white mb-4" style={{ borderColor: C.border }}>
      <div className="flex items-center justify-between px-4 pt-3.5 pb-2">
        <span className="text-[14px] font-semibold" style={{ color: C.textPrimary }}>{title}</span>
        <MoreVertical className="w-4 h-4" style={{ color: C.textDisabled }} />
      </div>
      <div className={pad ? "px-4 pb-4" : "pb-2"}>{children}</div>
    </div>
  );
  const Field = ({ label, value, sub }) => (
    <div>
      <div className="text-[11px] mb-0.5" style={{ color: C.textSecondary }}>{label}</div>
      <div className="text-[13px]" style={{ color: C.textPrimary }}>{value}</div>
      {sub && <div className="text-[10px] mt-0.5" style={{ color: C.textDisabled }}>{sub}</div>}
    </div>
  );
  const ST = ({ head, rows }) => (
    <div className="overflow-x-auto">
      <table className="w-full text-[12px]">
        <thead>
          <tr className="border-b" style={{ borderColor: C.border }}>
            {head.map((h, i) => (
              <th key={i} className={"py-2 px-2 font-medium whitespace-nowrap " + ((h && h.r) ? "text-right" : "text-left")} style={{ color: C.textSecondary }}>{(h && h.label !== undefined) ? h.label : h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri} className="border-b" style={{ borderColor: C.borderLight }}>
              {r.map((c, ci) => (
                <td key={ci} className={"py-2 px-2 align-top whitespace-nowrap " + ((head[ci] && head[ci].r) ? "text-right " : "") + ((head[ci] && head[ci].strong) ? "font-medium" : "")} style={{ color: C.textPrimary }}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  const Stars = ({ n = 4 }) => (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2, 3, 4].map((i) => <Star key={i} className="w-3.5 h-3.5" style={{ color: i < n ? "#f5a623" : C.border, fill: i < n ? "#f5a623" : "none" }} />)}
    </div>
  );
  const Iso = ({ label }) => (
    <div className="w-10 h-10 rounded-full border flex items-center justify-center text-[7px] font-bold text-center leading-tight px-1" style={{ borderColor: C.border, color: C.textSecondary }}>{label}</div>
  );
  const ActionIcon = ({ icon: Icon }) => (
    <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors" style={{ color: C.textSecondary }}><Icon className="w-[18px] h-[18px]" /></button>
  );
  const Pill = ({ text, tone }) => (
    <span className="text-[11px] font-medium" style={{ color: tone }}>{text}</span>
  );
  const tone = (s) => /Active|Valid|Stable|Strong|Approved|Ready|Excellent|Good/.test(s) ? C.success
    : /Expiring|Moderate/.test(s) ? C.warning
    : /Expired|Negative|Weak|Inactive|Below/.test(s) ? C.error : C.textSecondary;

  // ---------- right rail ----------
  const Rail = () => (
    <div className="shrink-0 space-y-3" style={{ width: 250 }}>
      <div className="rounded-xl border p-4" style={{ borderColor: C.border, backgroundColor: C.surface }}>
        <div className="text-center">
          <div className="text-[11px]" style={{ color: C.textSecondary }}>Performance</div>
          <div className="flex justify-center my-1"><Stars n={4} /></div>
          <div className="text-[14px] font-semibold" style={{ color: C.textPrimary }}>73.9 (B)</div>
        </div>
        <div className="border-t my-3" style={{ borderColor: C.borderLight }} />
        <div className="text-center text-[11px] mb-1" style={{ color: C.textSecondary }}>Risk Analysis</div>
        <svg viewBox="0 0 120 66" className="w-full" style={{ height: 54 }}>
          <path d="M12 60 A48 48 0 0 1 108 60" fill="none" stroke={C.borderLight} strokeWidth="10" strokeLinecap="round" />
          <path d="M12 60 A48 48 0 0 1 96 24" fill="none" stroke="#f5a623" strokeWidth="10" strokeLinecap="round" />
          <text x="60" y="56" textAnchor="middle" fontSize="13" fontWeight="600" fill="#dc8a00">Medium</text>
        </svg>
        <div className="border-t my-3" style={{ borderColor: C.borderLight }} />
        <div className="grid grid-cols-2 gap-2 text-center">
          <div><div className="text-[10px]" style={{ color: C.textSecondary }}>Net Profit</div><div className="text-[13px] font-semibold" style={{ color: C.textPrimary }}>$5.02M</div><div className="text-[10px]" style={{ color: C.success }}>&#8593;3.2% YoY</div></div>
          <div><div className="text-[10px]" style={{ color: C.textSecondary }}>Sales (2024)</div><div className="text-[13px] font-semibold" style={{ color: C.textPrimary }}>$6.78M</div><div className="text-[10px]" style={{ color: C.success }}>&#8593;5.4% YoY</div></div>
        </div>
        <div className="grid grid-cols-3 gap-1 text-center mt-3">
          <div><div className="text-[10px]" style={{ color: C.textSecondary }}>Credit</div><div className="text-[12px] font-semibold" style={{ color: C.textPrimary }}>AA</div></div>
          <div><div className="text-[10px]" style={{ color: C.textSecondary }}>Cash Flow</div><div className="text-[12px] font-semibold" style={{ color: C.textPrimary }}>Moderate</div></div>
          <div><div className="text-[10px]" style={{ color: C.textSecondary }}>Watch</div><div className="text-[12px] font-semibold" style={{ color: C.success }}>Stable</div></div>
        </div>
        <div className="flex items-center justify-center gap-2 mt-3"><Iso label="ISO 45001" /><Iso label="ISO 9001" /><Iso label="GMP" /></div>
      </div>
      <div className="rounded-xl border p-4" style={{ borderColor: C.border, backgroundColor: C.surface }}>
        <div className="text-[13px] font-semibold text-center mb-3" style={{ color: C.textPrimary }}>Top Clients</div>
        {[["Pioneer Technologies", "Electronics"], ["Tech Innovations", "Automotive"], ["Acme Corp", "Industrial Goods"]].map(([n, i]) => (
          <div key={n} className="flex items-center gap-2 mb-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: C.primarySoft }}><Building2 className="w-3.5 h-3.5" style={{ color: C.primary }} /></div>
            <div className="min-w-0"><div className="text-[12px] font-medium truncate" style={{ color: C.textPrimary }}>{n}</div><div className="text-[10px]" style={{ color: C.textSecondary }}>{i}</div></div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border p-4" style={{ borderColor: C.border, backgroundColor: C.surface }}>
        <div className="text-[13px] font-semibold text-center mb-3" style={{ color: C.textPrimary }}>Similar Companies</div>
        <div className="flex items-center justify-center gap-3">
          <ChevronLeft className="w-4 h-4 shrink-0" style={{ color: C.textDisabled }} />
          <div className="text-center">
            <div className="w-9 h-9 rounded-full mx-auto mb-1 flex items-center justify-center" style={{ backgroundColor: C.infoLight }}><Building2 className="w-4 h-4" style={{ color: C.info }} /></div>
            <div className="text-[12px] font-medium" style={{ color: C.textPrimary }}>Helix Industries</div>
            <div className="text-[10px]" style={{ color: C.textSecondary }}>Manufacturing</div>
            <div className="flex justify-center mt-1"><Stars n={3} /></div>
          </div>
          <ChevronRight className="w-4 h-4 shrink-0" style={{ color: C.textDisabled }} />
        </div>
      </div>
    </div>
  );

  // ---------- tab bodies ----------
  const Overview = () => (
    <>
      <Card title="Purchase History">
        <div className="rounded-xl border p-3" style={{ borderColor: C.border, backgroundColor: C.surface }}>
          <div className="flex items-center justify-between mb-1 px-1">
            <span className="text-[11px]" style={{ color: C.textSecondary }}>Unit $</span>
            <div className="flex items-center gap-3 text-[11px]" style={{ color: C.textSecondary }}>
              <span className="inline-flex items-center gap-1"><span className="w-3 h-2 rounded-sm" style={{ backgroundColor: C.primaryLight }} /> PO Amount</span>
              <span className="inline-flex items-center gap-1"><span className="w-3 h-0.5 rounded-full" style={{ backgroundColor: C.primary }} /> Increase Rate</span>
            </div>
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 200 }}>
            {[0, 50, 100, 150, 200].map((t) => {
              const y = yFor(t / 200);
              return (
                <g key={t}>
                  <line x1={padL} y1={y} x2={W - padR} y2={y} stroke={C.borderLight} strokeWidth="1" strokeDasharray="3 3" />
                  <text x={padL - 10} y={y + 4} textAnchor="end" fontSize="10" fill={C.textSecondary}>{t === 0 ? "0" : `${t}K`}</text>
                </g>
              );
            })}
            {quarters.map((q, i) => {
              const h = plotH * (q.po / 200);
              return <rect key={i} x={xFor(i) - barW / 2} y={padT + plotH - h} width={barW} height={h} rx="3" fill={C.primaryLight} />;
            })}
            <polyline points={linePts} fill="none" stroke={C.primary} strokeWidth="2" />
            {quarters.map((q, i) => <circle key={i} cx={xFor(i)} cy={yFor(q.line)} r="3" fill={C.primary} />)}
            {quarters.map((q, i) => <text key={i} x={xFor(i)} y={H - 8} textAnchor="middle" fontSize="9" fill={C.textSecondary}>{q.label}</text>)}
          </svg>
        </div>
      </Card>
      <Card title="Purchase Orders">
        <ST head={["Operation Org. / Item", "Spec", { label: "Amount", r: true }, { label: "Rate", r: true }]}
          rows={[
            [<span className="font-medium">Display Components</span>, "", <span className="font-medium">512,000</span>, <span style={{ color: C.error }}>-3.20 %</span>],
            ["AMOLED Panel 6.7\"", "FHD+ · 120Hz", "388,000", ""],
            ["OCA Film", "Optical clear adhesive", "74,000", ""],
            ["Polarizer Film", "Front, 6.7\"", "50,000", ""],
            [<span className="font-medium">Mechanical</span>, "", <span className="font-medium">96,000</span>, <span style={{ color: C.success }}>+1.10 %</span>],
            ["Display Bracket", "Aluminum, 6.7\"", "96,000", ""],
          ]} />
      </Card>
      <Card title="RFx History">
        <ST head={["Year", "Operation Org.", { label: "Requests", r: true }, { label: "Bids", r: true }, { label: "Bid Rate", r: true }, { label: "Awards", r: true }, { label: "Award Rate", r: true }]}
          rows={[2025, 2024, 2023, 2022].map((y) => [y, "Sourcing", "212", "133", "62.74 %", "36", "27.07 %"])} />
      </Card>
    </>
  );

  const About = () => (
    <>
      <Card title="General Information">
        <div className="rounded-lg p-3 mb-3" style={{ backgroundColor: C.primarySoft }}>
          <div className="flex items-center gap-1.5 mb-1"><Sparkles className="w-3.5 h-3.5" style={{ color: C.primary }} /><span className="text-[11px] font-medium" style={{ color: C.primary }}>Generated by GenAI</span></div>
          <div className="text-[12px] leading-relaxed" style={{ color: C.textSecondary }}>Tier-1 display &amp; optical-film supplier with a multi-program track record. Stable financial watch and AA quality rating reflect strong reliability and consistent delivery.</div>
        </div>
        <div className="grid grid-cols-2 gap-y-3 gap-x-4">
          <Field label="Industry" value="Manufacturing - Display" />
          <Field label="Main Products" value="AMOLED, OCA, Polarizer, Cover Glass" />
          <Field label="Company Size" value="Enterprise" />
          <Field label="Founded" value="01/20/2002" />
          <Field label="Stock Exchange" value="KOSPI, TWSE" />
          <Field label="Tax ID Number" value="234209482059" />
          <Field label="CEO" value="Jordan Avery" />
          <Field label="Headquarters" value="Hsinchu, APAC" />
        </div>
      </Card>
      <Card title="Employees">
        <ST head={["Year", { label: "Office", r: true }, { label: "Category", r: true }, { label: "Production", r: true }, { label: "QC", r: true }, { label: "Sales", r: true }, { label: "Total", r: true, strong: true }]}
          rows={[2025, 2024, 2023, 2022, 2021].map((y) => [y, "50", "70", "200", "30", "40", "390"])} />
      </Card>
      <Card title="Point of Contact">
        <ST head={["Status", "Name", "Role", "Timezone", "Alerts"]}
          rows={[
            [<Pill text="Active" tone={C.success} />, "Lila Thompson", "Delivery Manager", "JST · Tokyo (UTC+9)", "Email, SMS"],
            [<Pill text="Active" tone={C.success} />, "Maxwell Reed", "Financial Manager", "KST · Seoul (UTC+9)", "SMS"],
            [<Pill text="Active" tone={C.success} />, "Sophie Mitchell", "Delivery Manager", "JST · Tokyo (UTC+9)", "Email"],
            [<Pill text="Inactive" tone={C.error} />, "Ethan Rivers", "RFx Manager", "EST · New York (UTC-5)", "-"],
          ]} />
      </Card>
      <Card title="Bank Info">
        <div className="grid grid-cols-2 gap-3">
          {[["Primary Account", "Main", C.primary], ["Secondary Account", "", null], ["Payment Account", "Virtual", C.info], ["2024 Account", "Inactive", C.textDisabled]].map(([t, badge, col]) => (
            <div key={t} className="rounded-lg border p-3" style={{ borderColor: C.border }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[12px] font-semibold" style={{ color: C.textPrimary }}>{t}</span>
                {badge && <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full" style={{ backgroundColor: col === C.primary ? C.primaryLight : C.bg, color: col || C.textSecondary }}>{badge}</span>}
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <Field label="Account No." value="1002-222-44456" />
                <Field label="Bank" value="Harbor Bank" />
                <Field label="IBAN" value="GB29 NWBK 6016" />
                <Field label="SWIFT" value="HRBRUS33" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  );

  const OrgSourcing = () => {
    const orgs = ["Aurora Purchasing Org.", "APAC Planning", "Aurora Plant Co.", "Plant A"];
    return (
      <>
        <Card title="Operation Organizations">
          <div className="flex items-center gap-1 mb-3 flex-wrap">
            {orgs.map((o, i) => (
              <button key={o} onClick={() => setOpOrg(i)} className="text-[12px] px-2.5 py-1 rounded-full transition-colors" style={{ backgroundColor: opOrg === i ? C.primarySoft : "transparent", color: opOrg === i ? C.primary : C.textSecondary, fontWeight: opOrg === i ? 600 : 400 }}>{o}</button>
            ))}
          </div>
          <div className="rounded-lg p-3 grid grid-cols-2 gap-y-3 gap-x-4" style={{ backgroundColor: C.surfaceTinted || C.bg }}>
            <Field label="Organization Name" value={orgs[opOrg]} />
            <Field label="Onboarding Status" value="Official" />
            <Field label="Operation Region" value="Domestic" />
            <Field label="Tax Type" value="Electronic" />
            <Field label="Purchase Order" value="Eligible" />
            <Field label="Currency" value="USD" />
            <Field label="Payment Method" value="Cash" sub="payment method description" />
            <Field label="Delivery Method" value="[FOB] Free On Board" sub="delivery method description" />
            <Field label="Purchasing Contact" value="George Park" sub="Dept. of Purchasing" />
            <Field label="Quality Contact" value="Wendy Cole" sub="Dept. of Quality" />
          </div>
        </Card>
        <Card title="Registered Sourcing Group">
          <ST head={["Sourcing Group", "Category", "Code", "Effective Start"]}
            rows={[["AMOLED Panel", "Display", "VM942", "12/20/2024"], ["OCA Film", "Display", "SG2394", "12/20/2024"], ["Cover Glass", "Display", "VM942", "12/20/2024"]]} />
        </Card>
        <Card title="Eligible Sourcing Group">
          <ST head={["Sourcing Group", "Evaluation Group", "Category", "Effective", "Status"]}
            rows={[["AMOLED Panel", "Material Eval. Group", "Display", "12/20/2024", <Pill text="Ready to Request" tone={C.primary} />], ["OCA Film", "Material Eval. Group", "Display", "12/20/2024", <Pill text="Ready to Request" tone={C.primary} />]]} />
        </Card>
      </>
    );
  };

  const Operations = () => (
    <>
      <Card title="Top Clients">
        <ST head={["Name", "Industry", "Company Size", "Client Since", "Country"]}
          rows={[
            ["Pioneer Technologies", "Electronics", "Enterprise", "2020", "Korea"],
            ["Future Solutions", "Automotive", "Mid-size", "2020", "USA"],
            ["NexGen Enterprises", "Electronics", "Enterprise", "2021", "Taiwan"],
            ["Tech Innovations", "Automotive", "Enterprise", "2021", "USA"],
            ["Acme Corp", "Industrial Goods", "Enterprise", "2022", "Canada"],
          ]} />
      </Card>
      {[["NovaTech Industries", "Est. 08/28/2007"], ["PrimeTech Facility", "Est. 03/14/2011"]].map(([fac, est]) => (
        <Card key={fac} title={fac}>
          <div className="text-[11px] mb-2" style={{ color: C.textSecondary }}>{est} · +1-415-590-0034 · Hsinchu Industrial Park</div>
          <ST head={["Equipment", "Manufacturer", { label: "Qty", r: true }, "Purchased", "Updated By"]}
            rows={[
              ["Automated Assembly Line", "SpeedLine Corp", "5", "05/2024", "Hana Park"],
              ["Laminator", "PrimeTech", "2", "05/2024", "Hana Park"],
              ["Inspection Robot", "Vortex Robotics", "1", "05/2024", "Hana Park"],
            ]} />
        </Card>
      ))}
    </>
  );

  const Financial = () => (
    <>
      <Card title="Financial Reports">
        <ST head={["Year", "Type", { label: "Cur. Assets", r: true }, { label: "Cur. Liab.", r: true }, { label: "Liab. Ratio", r: true }, { label: "Sales", r: true }, { label: "Op. Profit", r: true }, { label: "Net Income", r: true }, { label: "Total Assets", r: true }]}
          rows={[
            ["2024", "Supplier", "$80M", "$90M", "5.0%", "$200M", "$10M", <span style={{ color: C.error }}>-$5M</span>, "$300M"],
            ["2023", "Supplier", "$150M", "$75M", "16.0%", "$500M", "$80M", <span style={{ color: C.success }}>$60M</span>, "$700M"],
            ["2022", "Supplier", "$100M", "$60M", "11.4%", "$350M", "$40M", <span style={{ color: C.success }}>$25M</span>, "$500M"],
          ]} />
      </Card>
      <Card title="Credit Ratings">
        <ST head={["Eval. Year", "Rating Agency", "Type", "Credit Rating", "Watch", "Cashflow"]}
          rows={[
            ["2024", "Northbridge", "Supplier", "AA", <Pill text="Stable" tone={C.success} />, <Pill text="Weak" tone={C.error} />],
            ["2023", "Crestview", "Supplier", "A", <Pill text="Stable" tone={C.success} />, <Pill text="Strong" tone={C.success} />],
            ["2022", "Sterling Park", "Supplier", "BB", <Pill text="Negative" tone={C.error} />, <Pill text="Moderate" tone={C.warning} />],
          ]} />
      </Card>
      <Card title="Purchase Amount">
        <ST head={["Year", "Operation Org.", "Sourcing Group", { label: "PO Amount (USD)", r: true }, { label: "GR Amount (USD)", r: true }]}
          rows={[
            ["2024", "Aurora / Plant C", "AMOLED Panel", "3,345.50", "3,345.50"],
            ["2023", "Aurora / Plant B", "OCA Film", "120,943.24", "90,943.24"],
            ["2022", "Aurora / Purchasing", "Cover Glass", "3,345.50", "3,345.50"],
          ]} />
      </Card>
    </>
  );

  const Evaluation = () => (
    <>
      <Card title="Performance Evaluation">
        <ST head={["Year", "Period", "Type", "Evaluation Name", { label: "Score", r: true }, { label: "Grade", r: true }]}
          rows={[
            ["2024", "Annual", "Performance", "2024 4Q Performance Evaluation", "100.00", "A (Excellent)"],
            ["2023", "Annual", "Performance", "4Q Evaluation", "92.00", "B (Good)"],
            ["2023", "Q3", "Non-Price", "2024 3Q Performance Evaluation", "88.00", "B (Good)"],
            ["2022", "H2", "GR / Progress", "Non-Price Evaluation", "74.00", "C (Average)"],
          ]} />
      </Card>
      <Card title="Onboarding Evaluations">
        <ST head={["Year", "Evaluation Name", { label: "Score", r: true }, { label: "Grade", r: true }]}
          rows={[
            ["2024", "Service Due Diligence", "68.50", "C (Average)"],
            ["2023", "Purchasing Due Diligence", "75.00", "B (Good)"],
            ["2022", "Self Evaluation", "91.00", "A (Excellent)"],
          ]} />
      </Card>
    </>
  );

  const Documents = () => (
    <>
      <Card title="Certifications">
        <ST head={["Certificate", "Issuing Authority", "Number", "Effective", "Expiry"]}
          rows={[
            [<span className="inline-flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" style={{ color: C.error }} />ISO 9001: QMS</span>, "Int'l Org. for Standardization", "ISO9001-2023-001", "08/22/2023", "08/22/2025"],
            [<span className="inline-flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" style={{ color: C.error }} />IATF 16949</span>, "Int'l Automotive Task Force", "IATF16949-2023-045", "08/22/2023", "08/22/2025"],
          ]} />
      </Card>
      <Card title="Legal Documents">
        <ST head={["Document", "Type", "Effective", "Expiry", "Owner", "Status"]}
          rows={[
            ["Master Service Agreement", "MSA", "08/22/2019", "08/22/2026", "Peter Quinn", <Pill text="Active" tone={C.success} />],
            ["Non-Disclosure Agreement", "NDA", "08/22/2019", "07/09/2026", "Hana Park", <Pill text="Expiring Soon (D-15)" tone={C.warning} />],
            ["Supply Contract", "Contract", "08/22/2019", "08/22/2024", "Marcus Lee", <Pill text="Expired" tone={C.error} />],
          ]} />
      </Card>
      <Card title="Other Documents">
        <ST head={["Document", "Type", "Effective", "Owner", "Status"]}
          rows={[
            ["Compliance Statement", "Compliance", "08/22/2023", "Peter Quinn", <Pill text="Valid" tone={C.success} />],
            ["Technical Datasheet", "Technical", "08/22/2023", "Peter Quinn", <Pill text="Valid" tone={C.success} />],
          ]} />
      </Card>
    </>
  );

  const News = () => {
    const items = [
      ["Production Excellence", "The Manufacturing Playbook: Designing for Scale", "#ece9fd"],
      ["Quality Assurance", "Revolutionizing Manufacturing: Strategies for Yield", "#dbeafe"],
      ["Safety Compliance", "Engineering for Rapid Expansion", "#dcfce7"],
      ["Innovation Leader", "Building a Self-Scaling Manufacturing System", "#fef3c7"],
    ];
    return (
      <Card title="Latest News">
        <div className="grid grid-cols-2 gap-3">
          {items.map(([cat, title, col], i) => (
            <div key={i} className="rounded-lg border overflow-hidden" style={{ borderColor: C.border }}>
              <div className="h-24" style={{ background: `linear-gradient(135deg, ${col}, #fff)` }} />
              <div className="p-3">
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: C.bg, color: C.textSecondary }}>{cat}</span>
                <div className="text-[13px] font-medium mt-1.5 leading-snug" style={{ color: C.textPrimary }}>{title}</div>
                <div className="text-[10px] mt-1.5" style={{ color: C.textDisabled }}>Yesterday · Newswire</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  const bodies = { "Overview": Overview, "About": About, "Org. & Sourcing": OrgSourcing, "Operations": Operations, "Financial": Financial, "Evaluation": Evaluation, "Documents": Documents, "News": News };
  const Body = bodies[tab];

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(16,24,40,0.4)" }} onClick={onClose} />
      <aside className="fixed right-0 z-50 bg-white flex flex-col shadow-2xl" style={{ top: 52, bottom: 0, width: "min(1080px, calc(100vw - 80px))" }}>
        {/* Header bar */}
        <div className="shrink-0 flex items-center justify-between px-6 h-14 border-b" style={{ borderColor: C.border }}>
          <span className="text-[16px] font-semibold" style={{ color: C.textPrimary }}>Supplier 360</span>
          <button onClick={onClose} title="Close" className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 focus:outline-none focus-visible:ring-2" style={{ color: C.textSecondary }}><X className="w-4 h-4" /></button>
        </div>

        {/* Identity */}
        <div className="shrink-0 px-6 pt-4 pb-0 border-b" style={{ borderColor: C.border }}>
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: C.primarySoft }}>
              <Building2 className="w-5 h-5" style={{ color: C.primary }} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[20px] font-bold" style={{ color: C.textPrimary }}>{name}</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: C.success }}><BadgeCheck className="w-3.5 h-3.5" /> Approved</span>
              </div>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-[12px]" style={{ color: C.textSecondary }}>Hsinchu · APAC</span>
                <span className="w-px h-3.5" style={{ backgroundColor: C.border }} />
                {tags.map((t) => <span key={t} className="text-[11px] font-medium px-2 py-0.5 rounded-md" style={{ backgroundColor: C.bg, color: C.textSecondary }}>{t}</span>)}
              </div>
              <div className="flex items-start gap-1.5 mt-2.5">
                <Sparkles className="w-4 h-4 shrink-0 mt-px" style={{ color: C.primary }} />
                <span className="text-[13px] leading-relaxed" style={{ color: C.primary }}>Tier-1 display &amp; components supplier with multi-program history; stable financial watch and AA quality rating.</span>
              </div>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              <ActionIcon icon={Star} /><ActionIcon icon={Mail} /><ActionIcon icon={Phone} /><ActionIcon icon={FileText} /><ActionIcon icon={MoreVertical} />
            </div>
          </div>
          {/* Tabs */}
          <div className="flex items-center gap-1 mt-4 -mb-px overflow-x-auto">
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)} className="text-[13px] px-3 py-2.5 whitespace-nowrap border-b-2 transition-colors" style={{ borderColor: tab === t ? C.primary : "transparent", color: tab === t ? C.primary : C.textSecondary, fontWeight: tab === t ? 600 : 400 }}>{t}</button>
            ))}
          </div>
        </div>

        {/* Body: tab content, full width (right rail removed) */}
        <div className="flex-1 overflow-y-auto px-6 py-5" style={{ backgroundColor: C.bg }}>
          <div className="min-w-0">{Body && <Body />}</div>
        </div>
      </aside>
    </>
  );
}

function CompareModal({ activeBom, activeBomMeta, diff, onClose, demoActive = false, demoPart = null, demoAdvance = null, onOpenItem360 = null }) {
  if (!diff) return null;

  const MODES = {
    E: { title: "Compare E-BOM", lens: "Design comparison",
      ai: "changes cluster in display + thermal. The new vapor chamber needs design verification; the 120 Hz panel and touch IC carry process/manufacturing impact. 2 downstream assemblies affected.",
      actions: [
        { key: "revert", label: "Request revert to base", tag: "Revert requested", icon: RotateCcw, color: C.warning, on: ["changed", "missA", "missB"], note: "Nothing changes until an approver accepts it." },
        { key: "review", label: "Request re-review", tag: "Re-review requested", icon: MessageSquare, color: C.primary, on: ["changed", "missA", "missB"], note: "Reviewers will be notified." },
      ] },
    C: { title: "Compare C-BOM", lens: "Cost comparison",
      ai: "net unit cost +$2.40 across the changed lines. AP cost is down but routes through a single channel (supply risk); the 12 GB DRAM drives the increase. 2 lines need re-quote.",
      actions: [
        { key: "rfq", label: "Request quote (RFQ)", tag: "RFQ sent", icon: Send, color: C.primary, on: ["changed", "missA"], note: "The sourcing team will open an RFQ." },
        { key: "negotiate", label: "Start price negotiation", tag: "Negotiating", icon: DollarSign, color: C.warning, on: ["changed"], note: "A negotiation task is created for the buyer." },
        { key: "review", label: "Request re-review", tag: "Re-review requested", icon: MessageSquare, color: C.primary, on: ["changed", "missA", "missB"], note: "Reviewers will be notified." },
      ] },
    Q: { title: "Compare Q-BOM", lens: "Quality comparison",
      ai: "quality changes raise touch IC to medium risk (PPAP Lv3) and auto-assign Lv3 to the vapor chamber; OCA is now approved. Re-validation needed on 2 parts.",
      actions: [
        { key: "revalidate", label: "Request re-validation", tag: "Re-validation requested", icon: FlaskConical, color: C.warning, on: ["changed", "missA"], note: "Quality will schedule re-validation." },
        { key: "approve", label: "Approve PPAP", tag: "PPAP approved", icon: ShieldCheck, color: C.success, on: ["changed", "missA"], note: "Marks PPAP approved for this part." },
        { key: "review", label: "Request re-review", tag: "Re-review requested", icon: MessageSquare, color: C.primary, on: ["changed", "missA", "missB"], note: "Reviewers will be notified." },
      ] },
  };
  const mode = MODES[activeBom] || MODES.E;
  const isE = activeBom === "E";
  const rfqA = (MODES.C.actions).find((a) => a.key === "rfq");
  const negA = (MODES.C.actions).find((a) => a.key === "negotiate");

  const [filter, setFilter] = useState("all");
  const [mapOpen, setMapOpen] = useState(false);
  const [histOpen, setHistOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(true);
  const [detailFor, setDetailFor] = useState(demoActive && demoPart ? demoPart : null);
  const [requested, setRequested] = useState(() => new Set());
  const [collapsed, setCollapsed] = useState(() => new Set());
  const [reviewAll, setReviewAll] = useState(false);
  const [baseVer, setBaseVer] = useState(diff.previous);
  const [cmpVer, setCmpVer] = useState(diff.current);
  const [confirmFor, setConfirmFor] = useState(null);

  const vers = COMPARE_VERSION_LINE[activeBom] || [diff.previous, diff.current];
  const nodeName = (n) => prettyName(n.partName || splitNameSpec(n.desc).name);
  const nodeById = new Map(BOM_TREE.map((n) => [n.partId, n]));
  const dispName = (p) => { const n = nodeById.get(p.partId); return n ? nodeName(n) : prettyName(p.name || p.partId); };
  const reqKey = (pid, k) => `${pid}::${k}`;

  const parseChange = (str) => String(str || "").split(" · ").map((seg) => {
    let label = "", rest = seg;
    const ci = seg.indexOf(": ");
    if (ci > -1) { label = seg.slice(0, ci); rest = seg.slice(ci + 2); }
    const p = rest.split(" → ");
    return { label, before: (p[0] || "").trim(), after: (p[1] || p[0] || "").trim() };
  });
  const fieldBy = (fields, ...keys) => (fields || []).find((f) => keys.some((k) => f.label.toLowerCase().includes(k)));
  const money = (s) => { const m = String(s || "").match(/-?\$?([\d,.]+)/); return m ? parseFloat(m[1].replace(/,/g, "")) : null; };

  // Delta rows (changed + added + removed) — shared by all lenses.
  const deltaRows = [
    ...diff.modified.map((p) => ({ state: "changed", partId: p.partId, name: dispName(p), fields: parseChange(p.change) })),
    ...diff.added.map((p) => ({ state: "missA", partId: p.partId, name: dispName(p), reason: p.reason, fields: [] })),
    ...diff.removed.map((p) => ({ state: "missB", partId: p.partId, name: p.name || p.partId, reason: p.reason, fields: [] })),
    ...(diff.replaced || []).map((p) => ({ state: "replaced", partId: p.partId, name: dispName(p), fromPartId: p.fromPartId, fromName: p.fromName, reason: p.reason, fields: parseChange(p.change) })),
  ];

  // Full BOM tree for the E (design) lens.
  const modMap = new Map(diff.modified.map((p) => [p.partId, p]));
  const addMap = new Map(diff.added.map((p) => [p.partId, p]));
  const replMap = new Map((diff.replaced || []).map((p) => [p.partId, p]));
  const seenMod = new Set(), seenAdd = new Set();
  const treeRows = BOM_TREE.map((n) => {
    const b = { id: n.id, partId: n.partId, name: nodeName(n), category: n.category, lvl: n.lvl, hasKids: !!(n.children && n.children.length) };
    if (replMap.has(n.partId)) { const p = replMap.get(n.partId); return { ...b, state: "replaced", fromPartId: p.fromPartId, fromName: p.fromName, reason: p.reason, fields: parseChange(p.change) }; }
    if (modMap.has(n.partId)) { seenMod.add(n.partId); return { ...b, state: "changed", fields: parseChange(modMap.get(n.partId).change) }; }
    if (addMap.has(n.partId)) { seenAdd.add(n.partId); return { ...b, state: "missA", reason: addMap.get(n.partId).reason }; }
    return { ...b, state: "match" };
  });
  const extraMod = diff.modified.filter((p) => !seenMod.has(p.partId)).map((p) => ({ state: "changed", lvl: 2, ...p, fields: parseChange(p.change) }));
  const extraAdd = diff.added.filter((p) => !seenAdd.has(p.partId)).map((p) => ({ state: "missA", lvl: 2, ...p }));
  const removedRows = diff.removed.map((p) => ({ state: "missB", lvl: 2, ...p }));
  const treeFull = [...treeRows, ...extraMod, ...extraAdd, ...removedRows];

  // Derived metadata for cost / quality lenses.
  const costRows = deltaRows.map((r) => { const cf = fieldBy(r.fields, "cost", "quoted"); const sf = fieldBy(r.fields, "supplier"); const a = money(cf && cf.before), b = money(cf && cf.after); return { ...r, costF: cf, supF: sf, costA: a, costB: b, delta: (a != null && b != null) ? b - a : null }; });
  const qualRows = deltaRows.map((r) => ({ ...r, ppap: fieldBy(r.fields, "ppap"), risk: fieldBy(r.fields, "risk"), defect: fieldBy(r.fields, "defect") }));
  const supplyRisk = (r) => { if (r.state === "missA") return { t: "new · RFQ", c: C.warning }; const a = (r.supF && r.supF.after || "").toLowerCase(); if (/dual/.test(a)) return { t: "dual-source", c: C.success }; if (/direct|single/.test(a)) return { t: "single-source", c: C.warning }; return { t: "—", c: C.textDisabled }; };
  const qualResult = (r) => { if (r.state === "missA") return { t: "qualify", c: C.warning }; const ra = (r.risk && r.risk.after || "").toLowerCase(); const pa = (r.ppap && r.ppap.after || "").toLowerCase(); if (/medium|high/.test(ra) || /lv3|required/.test(pa)) return { t: "re-validate", c: C.warning }; if (/approved/.test(pa)) return { t: "approved", c: C.success }; return { t: "ok", c: C.textDisabled }; };

  // Filters + visible set per lens.
  const cntAll = treeFull.length, cntChanges = diff.modified.length + diff.added.length + diff.removed.length + (diff.replaced || []).length;
  const cMeta = costRows.reduce((o, r) => { if (r.delta != null && r.delta > 0) o.up++; else if (r.delta != null && r.delta < 0) o.down++; return o; }, { up: 0, down: 0 });
  const qMeta = qualRows.reduce((o, r) => { const res = qualResult(r); if (res.t === "re-validate" || res.t === "qualify") o.reval++; if (r.risk && /medium|high/i.test(r.risk.after)) o.riskup++; return o; }, { reval: 0, riskup: 0 });
  const FILTERS = isE
    ? [["all", "Full BOM", cntAll, C.textSecondary], ["changes", "Changes", cntChanges, C.textSecondary], ["changed", "Changed", diff.modified.length + (diff.replaced || []).length, C.warning], ["missA", "Only in B", diff.added.length, C.success], ["missB", "Only in A", diff.removed.length, C.error], ["match", "Matched", treeFull.filter((r) => r.state === "match").length, C.textDisabled]]
    : activeBom === "C"
      ? [["all", "All changes", deltaRows.length, C.textSecondary], ["up", "Cost up", cMeta.up, C.error], ["down", "Cost down", cMeta.down, C.success], ["missA", "New", diff.added.length, C.success], ["missB", "Removed", diff.removed.length, C.error]]
      : [["all", "All changes", deltaRows.length, C.textSecondary], ["reval", "Re-validate", qMeta.reval, C.warning], ["riskup", "Risk up", qMeta.riskup, C.error], ["missA", "New", diff.added.length, C.success]];

  const toggleCollapse = (id) => setCollapsed((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const collapseFilter = (rows) => { const out = []; let hb = null; for (const r of rows) { const lvl = r.lvl || 1; if (hb !== null) { if (lvl > hb) continue; else hb = null; } out.push(r); if (r.hasKids && collapsed.has(r.id)) hb = lvl; } return out; };
  const treeVisible = filter === "all" ? [...collapseFilter(treeRows), ...extraMod, ...extraAdd, ...removedRows] : filter === "changes" ? treeFull.filter((r) => r.state !== "match") : filter === "changed" ? treeFull.filter((r) => r.state === "changed" || r.state === "replaced") : treeFull.filter((r) => r.state === filter);
  const costVisible = costRows.filter((r) => filter === "all" || (filter === "up" && r.delta > 0) || (filter === "down" && r.delta < 0) || r.state === filter);
  const qualVisible = qualRows.filter((r) => { const res = qualResult(r); return filter === "all" || (filter === "reval" && (res.t === "re-validate" || res.t === "qualify")) || (filter === "riskup" && r.risk && /medium|high/i.test(r.risk.after)) || r.state === filter; });

  const STATE = {
    changed: { glyph: "Δ", color: C.warning, bg: C.warningLight }, replaced: { glyph: "Δ", color: C.warning, bg: C.warningLight }, missA: { glyph: "+", color: C.success, bg: C.successLight },
    missB: { glyph: "−", color: C.error, bg: C.errorLight }, match: { glyph: "=", color: C.textDisabled, bg: C.bg },
  };
  const indent = (r) => ({ paddingLeft: Math.max(0, (r.lvl || 1) - 1) * 16 });
  const detailRow = detailFor ? (activeBom === "C" ? costRows : deltaRows).find((r) => r.partId === detailFor) : null;
  const detailAI = !detailRow ? null : (isE && AI_PART_IMPACT[detailRow.partId]) ? AI_PART_IMPACT[detailRow.partId]
    : (() => { const fl = (detailRow.fields || []).map((f) => f.label).filter(Boolean).join(", ") || "this part";
        if (activeBom === "C") return { summary: `Cost moved on ${fl}. Check supply concentration before locking; an RFQ or re-negotiation may recover margin.`, cost: "see diff", risk: "medium", action: "Request quote (RFQ)" };
        if (activeBom === "Q") return { summary: `Quality fields changed on ${fl}. Re-validate PPAP and assess defect-rate and risk-level impact before release.`, cost: "—", risk: "medium", action: "Request re-validation" };
        return { summary: `Changes to ${fl} — review downstream impact.`, cost: "review", risk: "medium", action: "Re-validate" }; })();

  const rev = [...vers].reverse();
  const vlist = [];
  rev.forEach((v, idx) => { vlist.push({ v, kind: "main" }); if (idx === 0 && rev[1]) vlist.push({ v: `${rev[1]}.1`, kind: "hotfix", note: "hotfix · merged", color: C.success }); if (idx === 2) vlist.push({ v: `${v}-exp`, kind: "exp", note: "branch · abandoned", color: C.warning }); });
  const ROWH = 46, GX = 22, BX = 38;
  const yc = (i) => i * ROWH + ROWH / 2;
  const hIdx = vlist.findIndex((r) => r.kind === "hotfix");
  const eIdx = vlist.findIndex((r) => r.kind === "exp");

  const dropConfirm = () => setConfirmFor(null);
  const applyConfirm = () => { if (!confirmFor) return; setRequested((s) => { const n = new Set(s); if (confirmFor.bulk) deltaRows.filter((r) => confirmFor.action.on.includes(r.state)).forEach((r) => n.add(reqKey(r.partId, confirmFor.action.key))); else n.add(reqKey(confirmFor.partId, confirmFor.action.key)); return n; }); setConfirmFor(null); };
  const onAction = (r, a) => { if (requested.has(reqKey(r.partId, a.key))) setRequested((s) => { const n = new Set(s); n.delete(reqKey(r.partId, a.key)); return n; }); else setConfirmFor({ action: a, partId: r.partId, name: r.name }); };

  const PartCell = ({ r }) => (
    <div className="min-w-0">
      <div className="text-[13px] truncate" style={{ color: r.state === "missB" ? C.error : (r.state === "missA" ? C.success : C.textPrimary), textDecoration: r.state === "missB" ? "line-through" : "none" }}>{r.name}</div>
      <div className="text-[10px] tabular-nums truncate" style={{ color: C.textDisabled }}>{r.partId}</div>
    </div>
  );
  const Tags = ({ r }) => (mode.actions.filter((a) => a.on.includes(r.state) && requested.has(reqKey(r.partId, a.key))).map((a) => (
    <span key={a.key} className="text-[10px] mr-1.5 inline-flex items-center gap-1" style={{ color: a.color }}><a.icon className="w-3 h-3" />{a.tag}</span>
  )));
  const ActionCell = ({ r }) => (
    <div className="flex items-center justify-end gap-0.5 self-center">
      {r.state === "changed" && <button onClick={() => setDetailFor(detailFor === r.partId ? null : r.partId)} title="Compare the two parts" className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-gray-100" style={{ color: detailFor === r.partId ? C.primary : C.textSecondary }}><GitCompareArrows className="w-3.5 h-3.5" /></button>}
      {mode.actions.filter((a) => a.on.includes(r.state)).map((a) => { const on = requested.has(reqKey(r.partId, a.key)); return <button key={a.key} onClick={() => onAction(r, a)} title={a.label} className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-gray-100" style={{ color: on ? a.color : C.textSecondary }}><a.icon className="w-3.5 h-3.5" /></button>; })}
    </div>
  );
  const EName = ({ r, side }) => {
    const isRepl = r.state === "replaced";
    const nm = (side === "a" && isRepl) ? r.fromName : r.name;
    const pid = (side === "a" && isRepl) ? r.fromPartId : r.partId;
    const showFields = (r.state === "changed" || r.state === "replaced");
    return (
    <div className="flex items-center gap-1 min-w-0">
      {side === "a" && r.hasKids ? <button onClick={(e) => { e.stopPropagation(); toggleCollapse(r.id); }} className="w-4 h-4 flex items-center justify-center shrink-0 rounded hover:bg-gray-100" style={{ color: C.textSecondary }}>{collapsed.has(r.id) ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}</button> : <span className="w-4 shrink-0" />}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-[13px] truncate" style={{ color: r.state === "missB" && side === "a" ? C.error : (r.state === "missA" && side === "b" ? C.success : (r.state === "match" ? C.textSecondary : C.textPrimary)), fontWeight: r.hasKids ? 500 : 400, textDecoration: r.state === "missB" && side === "a" ? "line-through" : "none" }}>{prettyName(nm)}</span>
          {r.category && side === "a" && !isRepl && <span className="text-[10px] px-1 rounded shrink-0" style={{ backgroundColor: C.bg, color: C.textDisabled }}>{r.category}</span>}
        </div>
        <div className="text-[10px] tabular-nums truncate" style={{ color: C.textDisabled }}>{pid}</div>
        {showFields && r.fields && side === "a" && <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>{r.fields.map((f) => `${f.label ? f.label + ": " : ""}${f.before}`).join(" · ")}</div>}
        {showFields && r.fields && side === "b" && <div className="mt-1 flex flex-wrap gap-1">{r.fields.map((f, j) => <span key={j} className="text-[11px] px-1.5 py-0.5 rounded" style={{ backgroundColor: C.warningLight, color: C.warning }}>{f.label ? f.label + ": " : ""}{f.after}</span>)}</div>}
        {((r.state === "missB" && side === "a") || (r.state === "missA" && side === "b")) && r.reason && <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>{r.reason}</div>}
      </div>
    </div>
    );
  };

  const E_GRID = "1fr 34px 1fr";
  const C_GRID = "minmax(0,1.6fr) 132px 72px minmax(0,1.3fr) 110px";
  const Q_GRID = "minmax(0,1.6fr) 130px 140px 130px 100px";
  const hdr = { color: C.textDisabled, backgroundColor: C.bg };
  const arrow = <ArrowRight className="w-3 h-3 inline mx-1" style={{ color: C.textDisabled }} />;

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(16,24,40,0.4)" }} onClick={onClose} />
      <aside className="fixed right-0 z-50 bg-white flex flex-col shadow-2xl" style={{ top: 52, bottom: 0, width: "min(1120px, calc(100vw - 140px))" }}>

        {/* Header */}
        <div className="px-6 pt-4 pb-3 shrink-0 flex items-center gap-3">
          <div className="text-[18px] font-medium" style={{ color: C.textPrimary }}>{mode.title}</div>
          <div className="flex-1" />
          <div className="relative shrink-0">
            <button onClick={() => { setHistOpen(!histOpen); setMapOpen(false); }} className="text-[12px] px-2.5 py-1.5 rounded-md border inline-flex items-center gap-1.5 transition-colors hover:bg-gray-50" style={{ borderColor: histOpen ? C.primary : C.border, color: histOpen ? C.primary : C.textSecondary, backgroundColor: "white" }}>
              <GitBranch className="w-3.5 h-3.5" />Version history<ChevronDown className="w-3 h-3" />
            </button>
            {histOpen && (
              <div className="absolute right-0 top-full mt-1.5 z-30 bg-white rounded-xl border shadow-xl" style={{ borderColor: C.border, width: 408, maxHeight: "72vh", overflowY: "auto" }}>
                <div className="text-[12px] px-4 pt-3 pb-2" style={{ color: C.textDisabled }}>Version history — {activeBomMeta.name}</div>
                <div className="relative px-3 pb-2">
                  <svg width="56" height={vlist.length * ROWH} style={{ position: "absolute", left: 12, top: 0 }}>
                    <line x1={GX} y1={yc(0)} x2={GX} y2={yc(vlist.length - 1)} stroke={C.border} strokeWidth="2" />
                    {hIdx > -1 && <path d={`M${GX},${yc(hIdx + 1)} C${GX},${yc(hIdx + 1) - 16} ${BX},${yc(hIdx) + 14} ${BX},${yc(hIdx)} C${BX},${yc(hIdx) - 14} ${GX},${yc(hIdx - 1) + 16} ${GX},${yc(hIdx - 1)}`} fill="none" stroke={C.success} strokeWidth="2" />}
                    {eIdx > -1 && <path d={`M${GX},${yc(eIdx - 1)} C${GX},${yc(eIdx - 1) + 16} ${BX},${yc(eIdx) - 14} ${BX},${yc(eIdx)}`} fill="none" stroke={C.warning} strokeWidth="2" strokeDasharray="3 3" />}
                    {vlist.map((r, i) => r.kind === "main"
                      ? <circle key={i} cx={GX} cy={yc(i)} r={r.v === baseVer || r.v === cmpVer ? 6 : 4.5} fill={r.v === cmpVer ? "#fff" : (r.v === baseVer ? C.primary : C.bg)} stroke={r.v === cmpVer ? C.primary : (r.v === baseVer ? C.primary : C.border)} strokeWidth={r.v === baseVer || r.v === cmpVer ? 2.5 : 1.5} />
                      : <circle key={i} cx={BX} cy={yc(i)} r="4.5" fill={r.color === C.success ? C.successLight : C.warningLight} stroke={r.color} strokeWidth="1.5" />)}
                  </svg>
                  <div style={{ marginLeft: 56 }}>
                    {vlist.map((r, i) => {
                      const isBase = r.v === baseVer, isCmp = r.v === cmpVer;
                      return (
                        <div key={i} className="flex items-center justify-between gap-2" style={{ height: ROWH, borderBottom: i < vlist.length - 1 ? `0.5px solid ${C.borderLight}` : "none" }}>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[13px] font-medium tabular-nums" style={{ color: isCmp ? C.primary : C.textPrimary }}>{r.v}</span>
                              {isBase && <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: C.bg, color: C.textSecondary }}>From</span>}
                              {isCmp && <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: C.primarySoft, color: C.primary }}>To</span>}
                              {r.note && <span className="text-[10px]" style={{ color: C.textDisabled }}>{r.note}</span>}
                            </div>
                            <div className="text-[10px] mt-0.5 inline-flex items-center gap-1" style={{ color: C.textDisabled }}><ChevronRight className="w-3 h-3" />Show changes · Diane · 11:44 AM</div>
                          </div>
                          {r.kind === "main" && (
                            <div className="flex gap-1 shrink-0">
                              <button onClick={() => r.v !== cmpVer && setBaseVer(r.v)} disabled={r.v === cmpVer} className="text-[10px] px-1.5 py-0.5 rounded border" style={{ borderColor: C.border, backgroundColor: isBase ? C.primarySoft : "white", color: isBase ? C.primary : C.textSecondary, opacity: r.v === cmpVer ? 0.4 : 1 }}>From</button>
                              <button onClick={() => r.v !== baseVer && setCmpVer(r.v)} disabled={r.v === baseVer} className="text-[10px] px-1.5 py-0.5 rounded border" style={{ borderColor: C.border, backgroundColor: isCmp ? C.primarySoft : "white", color: isCmp ? C.primary : C.textSecondary, opacity: r.v === baseVer ? 0.4 : 1 }}>To</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-50 shrink-0" style={{ color: C.textSecondary }}><X className="w-4 h-4" /></button>
        </div>

        {/* Comparing selector + mapping + export (dropdowns match the Key button) */}
        <div className="px-6 py-2.5 border-y flex items-center gap-2 flex-wrap shrink-0" style={{ borderColor: C.border, backgroundColor: C.surfaceTinted }}>
          <div className="relative">
            <select value={baseVer} onChange={(e) => setBaseVer(e.target.value)} className="text-[12px] pl-2.5 pr-7 py-1.5 rounded-md border bg-white appearance-none font-medium outline-none focus:outline-none focus-visible:ring-2" style={{ borderColor: C.border, color: C.textPrimary }}>
              {vers.map((v) => <option key={v} value={v} disabled={v === cmpVer}>{activeBomMeta.name} · {v}</option>)}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.textSecondary }} />
          </div>
          <ArrowRight className="w-4 h-4 shrink-0" style={{ color: C.textDisabled }} />
          <div className="relative">
            <select value={cmpVer} onChange={(e) => setCmpVer(e.target.value)} className="text-[12px] pl-2.5 pr-7 py-1.5 rounded-md border appearance-none font-medium outline-none focus:outline-none focus-visible:ring-2" style={{ borderColor: C.primary, color: C.primary, backgroundColor: C.primarySoft }}>
              {vers.map((v) => <option key={v} value={v} disabled={v === baseVer}>{activeBomMeta.name} · {v}</option>)}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.primary }} />
          </div>
          <div className="flex-1" />
          <div className="relative">
            <button onClick={() => { setMapOpen(!mapOpen); setHistOpen(false); }} className="text-[12px] px-2.5 py-1.5 rounded-md border inline-flex items-center gap-1.5 transition-colors hover:bg-gray-50" style={{ borderColor: mapOpen ? C.primary : C.border, color: mapOpen ? C.primary : C.textPrimary, backgroundColor: "white" }}>
              Key: Part no.<ChevronDown className="w-3 h-3" />
            </button>
            {mapOpen && (
              <div className="absolute right-0 top-full mt-1.5 z-30 bg-white rounded-xl border shadow-xl p-4" style={{ borderColor: C.border, width: 320 }}>
                <div className="text-[11px] mb-2" style={{ color: C.textDisabled }}>Row match key &amp; column mapping</div>
                <div className="flex items-center gap-2 text-[12px] mb-3">
                  <span className="px-2 py-1 rounded border" style={{ borderColor: C.border }}>Part no. (A)</span>
                  <ArrowRight className="w-3.5 h-3.5" style={{ color: C.textDisabled }} />
                  <span className="px-2 py-1 rounded border" style={{ borderColor: C.border }}>Part no. (B)</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: C.primarySoft, color: C.primary }}>match key</span>
                </div>
                <div className="text-[12px] leading-6" style={{ color: C.textSecondary }}>
                  <div><span className="font-medium" style={{ color: C.success }}>Compared:</span> description, quantity, spec</div>
                  <div><span className="font-medium" style={{ color: C.warning }}>Only in A:</span> plant, uom</div>
                  <div><span className="font-medium" style={{ color: C.warning }}>Only in B:</span> material number, plant code</div>
                </div>
                <button className="mt-3 w-full text-[12px] py-1.5 rounded-md border hover:bg-gray-50" style={{ borderColor: C.border, color: C.textPrimary }}>Edit mapping</button>
              </div>
            )}
          </div>
          <button className="text-[12px] px-2.5 py-1.5 rounded-md border inline-flex items-center gap-1.5 hover:bg-gray-50" style={{ borderColor: C.border, color: C.textPrimary, backgroundColor: "white" }}><Download className="w-3.5 h-3.5" />Export diff</button>
        </div>

        {/* AI impact (per-lens) */}
        {aiOpen && (
          <div className="mx-6 mt-3 rounded-lg shrink-0 px-3 py-2.5" style={{ backgroundColor: C.primarySoft }}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: C.primary }} /><span className="text-[13px] font-medium" style={{ color: C.primary }}>Predicted impact · {mode.lens}</span>
              <span className="text-[11px]" style={{ color: C.primary, opacity: 0.8 }}>medium confidence</span>
              <div className="flex-1" /><button onClick={() => setAiOpen(false)} className="w-6 h-6 rounded flex items-center justify-center" style={{ color: C.primary }}><X className="w-3.5 h-3.5" /></button>
            </div>
            <div className="text-[12px] mt-1 leading-relaxed" style={{ color: C.primary, opacity: 0.95 }}>{cntChanges} {mode.ai}</div>
          </div>
        )}

        {/* Filters */}
        <div className="px-6 py-2.5 flex items-center gap-1.5 flex-wrap shrink-0">
          {FILTERS.map(([f, label, n, cc]) => { const active = filter === f; return <button key={f} onClick={() => setFilter(f)} className="text-[12px] pl-2.5 pr-1.5 py-1 rounded-md border inline-flex items-center gap-1.5 transition-colors" style={{ borderColor: active ? C.primary : C.border, color: active ? C.primary : C.textSecondary, backgroundColor: active ? C.primarySoft : "white" }}>{label}<span className="text-[11px] tabular-nums px-1.5 rounded" style={{ backgroundColor: active ? "white" : C.bg, color: cc }}>{n}</span></button>; })}
        </div>

        {/* Body */}
        <div className="flex-1 flex min-h-0 border-t" style={{ borderColor: C.border }}>
          <div className="flex-1 flex flex-col min-w-0">

            {/* ===== E · Design — full tree side-by-side ===== */}
            {isE && (
              <>
                <div className="px-6 grid items-center text-[11px] py-1.5 shrink-0" style={{ gridTemplateColumns: E_GRID, ...hdr }}><div>{baseVer}</div><div></div><div className="pl-3">{cmpVer}</div></div>
                <div className="flex-1 overflow-y-auto">
                  {treeVisible.length === 0 && <div className="py-12 text-center" style={{ color: C.textSecondary }}>Nothing to show in this filter.</div>}
                  {treeVisible.map((r, i) => {
                    const st = STATE[r.state]; const isMatch = r.state === "match";
                    return (
                      <div key={r.partId + i} onClick={() => { if (demoActive && demoPart && r.partId === demoPart) { demoAdvance && demoAdvance(); return; } if (!isMatch) setDetailFor(detailFor === r.partId ? null : r.partId); }} className={`px-6 grid items-stretch group transition-colors hover:bg-gray-50 ${isMatch ? "" : "cursor-pointer"}`} style={{ gridTemplateColumns: E_GRID, borderTop: `1px solid ${C.borderLight}`, backgroundColor: detailFor === r.partId ? C.primarySoft : (isMatch ? "rgba(16,24,40,0.022)" : "white") }}>
                        <div className="py-1.5 pr-3 min-w-0 self-center" style={indent(r)}>{r.state === "missA" ? <div className="text-[12px] italic py-1.5 flex items-center gap-1"><span className="w-4 shrink-0" />— not in {baseVer}</div> : <EName r={r} side="a" />}</div>
                        <div className="flex items-center justify-center"><span className="w-5 h-5 rounded-full flex items-center justify-center text-[12px] font-medium" style={{ backgroundColor: st.bg, color: st.color }}>{st.glyph}</span></div>
                        <div className="py-1.5 pl-3 min-w-0 self-center" style={{ borderLeft: `0.5px solid ${C.borderLight}`, ...indent(r) }}>{r.state === "missB" ? <div className="text-[12px] italic py-1.5 flex items-center gap-1"><span className="w-4 shrink-0" />— not in {cmpVer}</div> : <EName r={r} side="b" />}<div className="mt-0.5"><Tags r={r} /></div></div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* ===== C · Cost — flat cost table ===== */}
            {activeBom === "C" && (
              <>
                <div className="px-6 grid items-center text-[11px] py-1.5 shrink-0" style={{ gridTemplateColumns: C_GRID, ...hdr }}><div>Part</div><div>Unit cost</div><div>Δ</div><div>Supplier</div><div>Supply risk</div></div>
                <div className="flex-1 overflow-y-auto">
                  {costVisible.length === 0 && <div className="py-12 text-center" style={{ color: C.textSecondary }}>Nothing to show in this filter.</div>}
                  {costVisible.map((r, i) => { const rk = supplyRisk(r); const up = r.delta != null && r.delta > 0; return (
                    <div key={r.partId + i} onClick={() => setDetailFor(detailFor === r.partId ? null : r.partId)} className="px-6 grid items-center transition-colors hover:bg-gray-50 cursor-pointer" style={{ gridTemplateColumns: C_GRID, borderTop: `1px solid ${C.borderLight}`, backgroundColor: detailFor === r.partId ? C.primarySoft : undefined }}>
                      <div className="py-2 pr-2 min-w-0"><PartCell r={r} /><div className="mt-0.5"><Tags r={r} /></div></div>
                      <div className="text-[12px] tabular-nums" style={{ color: C.textPrimary }}>{r.costA != null ? `$${r.costA.toFixed(2)}` : "—"}{arrow}<span style={{ fontWeight: 500 }}>{r.costB != null ? `$${r.costB.toFixed(2)}` : (r.state === "missA" ? "RFQ" : "—")}</span></div>
                      <div className="text-[12px] tabular-nums font-medium" style={{ color: r.delta == null ? C.textDisabled : up ? C.error : C.success }}>{r.delta == null ? "—" : `${up ? "+" : "−"}$${Math.abs(r.delta).toFixed(2)}`}</div>
                      <div className="text-[12px] truncate" style={{ color: C.textSecondary }}>{r.supF ? <>{r.supF.before}{arrow}{r.supF.after}</> : "—"}</div>
                      <div><span className="text-[11px] px-1.5 py-0.5 rounded" style={{ backgroundColor: C.bg, color: rk.c }}>{rk.t}</span></div>
                    </div>
                  ); })}
                </div>
              </>
            )}

            {/* ===== Q · Quality — flat quality table ===== */}
            {activeBom === "Q" && (
              <>
                <div className="px-6 grid items-center text-[11px] py-1.5 shrink-0" style={{ gridTemplateColumns: Q_GRID, ...hdr }}><div>Part</div><div>PPAP</div><div>Risk</div><div>Defect rate</div><div>Result</div></div>
                <div className="flex-1 overflow-y-auto">
                  {qualVisible.length === 0 && <div className="py-12 text-center" style={{ color: C.textSecondary }}>Nothing to show in this filter.</div>}
                  {qualVisible.map((r, i) => { const res = qualResult(r); const riskUp = r.risk && /medium|high/i.test(r.risk.after); return (
                    <div key={r.partId + i} onClick={() => setDetailFor(detailFor === r.partId ? null : r.partId)} className="px-6 grid items-center transition-colors hover:bg-gray-50 cursor-pointer" style={{ gridTemplateColumns: Q_GRID, borderTop: `1px solid ${C.borderLight}`, backgroundColor: detailFor === r.partId ? C.primarySoft : undefined }}>
                      <div className="py-2 pr-2 min-w-0"><PartCell r={r} /><div className="mt-0.5"><Tags r={r} /></div></div>
                      <div className="text-[12px]" style={{ color: C.textPrimary }}>{r.ppap ? <>{r.ppap.before}{arrow}<span style={{ fontWeight: 500 }}>{r.ppap.after}</span></> : (r.state === "missA" ? "new" : "—")}</div>
                      <div className="text-[12px]" style={{ color: riskUp ? C.error : C.textSecondary }}>{r.risk ? <>{r.risk.before}{arrow}<span style={{ fontWeight: 500 }}>{r.risk.after}</span></> : "—"}</div>
                      <div className="text-[12px] tabular-nums" style={{ color: C.textSecondary }}>{r.defect ? <>{r.defect.before}{arrow}{r.defect.after}</> : "—"}</div>
                      <div><span className="text-[11px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: C.bg, color: res.c }}>{res.t}</span></div>
                    </div>
                  ); })}
                </div>
              </>
            )}
          </div>

          {/* Compare-parts detail + AI analysis */}
          {detailRow && (
            <aside className="w-80 shrink-0 border-l overflow-y-auto" style={{ borderColor: C.border, backgroundColor: "white" }}>
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: C.borderLight }}>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <div className="text-[13px] font-medium truncate" style={{ color: C.textPrimary }}>{detailRow.name}</div>
                    {onOpenItem360 && (
                      <button onClick={(e) => { e.stopPropagation(); onOpenItem360({ id: 3, partId: detailRow.partId, partName: prettyName(detailRow.name), itemCode: detailRow.partId, desc: detailRow.name, type: "PART" }); }} title="Open Item 360 — global part record (where used, history)" className="shrink-0 w-5 h-5 rounded flex items-center justify-center hover:bg-gray-100 focus:outline-none focus-visible:ring-2" style={{ color: C.primary }}>
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="text-[10px] tabular-nums" style={{ color: C.textDisabled }}>{detailRow.partId}{detailRow.state === "replaced" ? ` · replaces ${detailRow.fromPartId}` : ""}</div>
                </div>
                <button onClick={() => setDetailFor(null)} className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-gray-50" style={{ color: C.textSecondary }}><X className="w-4 h-4" /></button>
              </div>
              {activeBom === "C" ? (
                <>
                  {detailAI && (
                    <div className="m-3 rounded-lg p-3" style={{ backgroundColor: C.primarySoft }}>
                      <div className="flex items-center gap-1.5 mb-1"><Sparkles className="w-3.5 h-3.5" style={{ color: C.primary }} /><span className="text-[12px] font-medium" style={{ color: C.primary }}>Cost change analysis</span></div>
                      <div className="text-[12px] leading-relaxed" style={{ color: C.primary, opacity: 0.95 }}>{detailAI.summary}</div>
                    </div>
                  )}
                  <div className="px-4 pb-1 text-[11px]" style={{ color: C.textDisabled }}>Cost · {baseVer} → {cmpVer}</div>
                  <div className="px-4 pb-2 space-y-1.5">
                    <div className="flex items-center justify-between text-[12px]"><span style={{ color: C.textSecondary }}>Unit cost</span><span className="tabular-nums" style={{ color: C.textPrimary }}>{detailRow.costA != null ? `$${detailRow.costA.toFixed(2)}` : "—"} → <span style={{ fontWeight: 500 }}>{detailRow.costB != null ? `$${detailRow.costB.toFixed(2)}` : "RFQ"}</span></span></div>
                    <div className="flex items-center justify-between text-[12px]"><span style={{ color: C.textSecondary }}>Delta</span><span className="tabular-nums font-medium" style={{ color: detailRow.delta == null ? C.textDisabled : detailRow.delta > 0 ? C.error : C.success }}>{detailRow.delta == null ? "—" : `${detailRow.delta > 0 ? "+" : "−"}$${Math.abs(detailRow.delta).toFixed(2)}`}</span></div>
                    <div className="flex items-center justify-between text-[12px]"><span style={{ color: C.textSecondary }}>Supplier</span><span style={{ color: C.textPrimary }}>{detailRow.supF ? `${detailRow.supF.before} → ${detailRow.supF.after}` : "—"}</span></div>
                  </div>
                  <div className="mx-4 mb-2 rounded-md p-2.5" style={{ backgroundColor: C.warningLight }}>
                    <div className="text-[11px] font-medium mb-0.5" style={{ color: C.warning }}>Supply risk · {supplyRisk(detailRow).t}</div>
                    <div className="text-[11px]" style={{ color: C.textSecondary }}>{detailRow.state === "missA" ? "New part — no qualified source yet; open an RFQ to establish price and capacity." : /single|direct/i.test((detailRow.supF && detailRow.supF.after) || "") ? "Single channel concentrates supply; consider a second source or buffer stock." : "Sourcing looks resilient; confirm the quote holds at volume."}</div>
                  </div>
                  <div className="px-4 py-3 border-t flex flex-col gap-2" style={{ borderColor: C.borderLight }}>
                    <div className="text-[11px]" style={{ color: C.textDisabled }}>Quote actions</div>
                    {mode.actions.filter((a) => a.on.includes(detailRow.state)).map((a) => { const on = requested.has(reqKey(detailRow.partId, a.key)); return (
                      <button key={a.key} onClick={() => onAction(detailRow, a)} className="h-9 px-3 rounded-md text-[13px] font-medium border inline-flex items-center justify-center gap-1.5 hover:bg-gray-50" style={{ borderColor: on ? a.color : C.border, color: on ? a.color : C.textPrimary, backgroundColor: on ? `${a.color}1A` : "white" }}>
                        <a.icon className="w-3.5 h-3.5" />{on ? a.tag : a.label}
                      </button>
                    ); })}
                  </div>
                </>
              ) : (
                <>
                  {detailAI && (
                    <div className="m-3 rounded-lg p-3" style={{ backgroundColor: C.primarySoft }}>
                      <div className="flex items-center gap-1.5 mb-1"><Sparkles className="w-3.5 h-3.5" style={{ color: C.primary }} /><span className="text-[12px] font-medium" style={{ color: C.primary }}>AI change analysis · {mode.lens}</span></div>
                      <div className="text-[12px] leading-relaxed" style={{ color: C.primary, opacity: 0.95 }}>{detailAI.summary}</div>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "white", color: C.textSecondary }}>Cost {detailAI.cost}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "white", color: detailAI.risk === "low" ? C.success : detailAI.risk === "high" ? C.error : C.warning }}>Risk {detailAI.risk}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "white", color: C.primary }}>{detailAI.action}</span>
                      </div>
                    </div>
                  )}
                  <div className="grid px-4 py-2 border-y text-[11px]" style={{ gridTemplateColumns: "1fr 1fr", borderColor: C.borderLight }}><div style={{ color: C.textDisabled }}>{baseVer} · From</div><div style={{ color: C.primary }}>{cmpVer} · To</div></div>
                  <div className="px-4 py-2">
                    {(detailRow.state === "replaced" ? [{ label: "Part no.", before: detailRow.fromPartId, after: detailRow.partId }, { label: "Item", before: prettyName(detailRow.fromName), after: prettyName(detailRow.name) }, ...(detailRow.fields || [])] : (((detailRow.fields || []).some((f) => /part no/i.test(f.label))) ? (detailRow.fields || []) : [{ label: "Part no.", before: detailRow.partId, after: detailRow.partId, changed: false }, ...(detailRow.fields || [])])).map((f, j) => (
                      <div key={j} className="grid gap-2 py-1.5 border-b" style={{ gridTemplateColumns: "1fr 1fr", borderColor: C.borderLight }}>
                        <div className="text-[11px]"><div style={{ color: C.textDisabled }}>{f.label}</div><div className="truncate" style={{ color: C.textSecondary }}>{f.before}</div></div>
                        <div className="text-[11px] rounded px-1.5" style={{ backgroundColor: (f.changed !== false) ? C.warningLight : "transparent" }}><div style={{ color: C.textDisabled }}>{f.label}</div><div className="truncate" style={{ color: (f.changed !== false) ? C.warning : C.textSecondary, fontWeight: (f.changed !== false) ? 500 : 400 }}>{f.after}</div></div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t flex flex-col gap-2" style={{ borderColor: C.borderLight }}>
                    <div className="text-[11px]" style={{ color: C.textDisabled }}>Request actions</div>
                    {mode.actions.filter((a) => a.on.includes(detailRow.state)).map((a) => { const on = requested.has(reqKey(detailRow.partId, a.key)); return (
                      <button key={a.key} onClick={() => onAction(detailRow, a)} className="h-9 px-3 rounded-md text-[13px] font-medium border inline-flex items-center justify-center gap-1.5 hover:bg-gray-50" style={{ borderColor: on ? a.color : C.border, color: on ? a.color : C.textPrimary, backgroundColor: on ? `${a.color}1A` : "white" }}>
                        <a.icon className="w-3.5 h-3.5" />{on ? a.tag : a.label}
                      </button>
                    ); })}
                  </div>
                </>
              )}
            </aside>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t flex items-center gap-2 shrink-0" style={{ borderColor: C.border }}>
          <div className="text-[11px]" style={{ color: C.textDisabled }}>{isE ? "= matched · Δ changed · + only in B · − only in A" : "Δ changed · + new · − removed"}{requested.size > 0 ? ` · ${requested.size} requests` : ""}</div>
          <div className="flex-1" />
          {activeBom === "C" && (
            <>
              <button onClick={() => setConfirmFor({ action: rfqA, bulk: true, count: deltaRows.filter((r) => rfqA.on.includes(r.state)).length })} className="h-9 px-3 rounded-md text-[13px] font-medium border hover:bg-gray-50 inline-flex items-center gap-1.5" style={{ borderColor: C.border, color: C.textPrimary, backgroundColor: "white" }}><Send className="w-3.5 h-3.5" />Request quotes</button>
              <button onClick={() => setConfirmFor({ action: negA, bulk: true, count: deltaRows.filter((r) => negA.on.includes(r.state)).length })} className="h-9 px-3 rounded-md text-[13px] font-medium border hover:bg-gray-50 inline-flex items-center gap-1.5" style={{ borderColor: C.border, color: C.textPrimary, backgroundColor: "white" }}><DollarSign className="w-3.5 h-3.5" />Negotiate</button>
            </>
          )}
          <button onClick={() => setReviewAll(true)} className="h-9 px-3 rounded-md text-[13px] font-medium border transition-colors hover:bg-gray-50 inline-flex items-center gap-1.5" style={{ borderColor: reviewAll ? C.success : C.border, color: reviewAll ? C.success : C.textPrimary, backgroundColor: "white" }}>{reviewAll ? <><CheckCircle className="w-3.5 h-3.5" />Re-review requested</> : <><MessageSquare className="w-3.5 h-3.5" />Request re-review</>}</button>
          <button onClick={onClose} className="h-9 px-4 rounded-md text-[13px] font-medium text-white transition-opacity hover:opacity-90" style={{ backgroundColor: C.primary }}>Done</button>
        </div>
      </aside>

      {/* Confirm dialog */}
      {confirmFor && (
        <>
          <div className="fixed inset-0" style={{ backgroundColor: "rgba(16,24,40,0.32)", zIndex: 80 }} onClick={dropConfirm} />
          <div className="fixed top-1/2 left-1/2 bg-white rounded-xl shadow-2xl p-5" style={{ transform: "translate(-50%,-50%)", width: 380, zIndex: 81 }}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${confirmFor.action.color}1A` }}><confirmFor.action.icon className="w-4 h-4" style={{ color: confirmFor.action.color }} /></div>
              <div className="text-[15px] font-medium" style={{ color: C.textPrimary }}>{confirmFor.action.label}</div>
            </div>
            <div className="text-[13px] leading-relaxed mb-4" style={{ color: C.textSecondary }}><span className="font-medium" style={{ color: C.textPrimary }}>{confirmFor.bulk ? `${confirmFor.count} ${activeBom}-BOM line${confirmFor.count === 1 ? "" : "s"}` : confirmFor.name}</span>{confirmFor.action.key === "revert" ? ` → ${baseVer}. ` : ". "}{confirmFor.action.note}</div>
            <div className="flex justify-end gap-2">
              <button onClick={dropConfirm} className="h-9 px-3 rounded-md border text-[13px] font-medium hover:bg-gray-50" style={{ borderColor: C.border, color: C.textPrimary }}>Cancel</button>
              <button onClick={applyConfirm} className="h-9 px-4 rounded-md text-[13px] font-medium text-white hover:opacity-90" style={{ backgroundColor: confirmFor.action.color }}>{confirmFor.action.label}</button>
            </div>
          </div>
        </>
      )}
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
              <div className="text-[10px] tracking-wide font-medium"
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
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0"
                        style={{ backgroundColor: C.warningLight, color: C.warning }}>
                        {b.missing > 0 ? `${b.missing} missing` : "delayed"}
                      </span>
                    )}
                    {!hasIssue && (
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0"
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
function BomSummaryCard() {
  // Empty state — shown when no row is selected. Simple centered placeholder (per Figma).
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-2 px-6 py-2 text-center"
      style={{ backgroundColor: C.surfaceTinted }}>
      <div className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center mb-1"
        style={{ backgroundColor: C.borderLight }}>
        <Package className="w-9 h-9" style={{ color: C.textDisabled }} />
      </div>
      <p className="text-[16px] font-medium" style={{ color: C.textSecondary }}>
        Select a row to view details
      </p>
      <p className="text-[12px]" style={{ color: C.textSecondary }}>
        Spec · Cost / Sourcing · Quality · Activity
      </p>
    </div>
  );
}

// ============================================================
// COLLABORATION — messaging-app style (chat list → chat room → details)
// Plugs into the BOM workspace right layer.
// ChatListPanel  : conversation list (BOM-wide + part rooms)
// ChatRoomPanel  : a chat room (bubbles + composer); pinned decision; Details entry
// Details overlay: spec/BOM summary, participants, Item 360, AI assist
// Props (room): { item, onClose, scenarioStep, activePersona, activeBom, bomLevel }
// ============================================================

// --- Mock data (co-located) ---
const PART_COLLABS = {
  3: {
    title: "Display Driver IC AX-7421",
    subline: "Supplier Proposal #1048 \u00b7 second-source driver",
    status: "voting", unread: 3,
    participantKeys: ["DE", "CM", "SM", "QM", "PM"],
    // Current vs proposed, shown in the Details (Compare) panel.
    compare: {
      current: "AX-7421 \u00b7 Apex (EOL)",
      proposed: "TX-6620 \u00b7 Triton Semiconductor",
      similarity: "95%",
      rows: [
        ["Driver", "AX-7421", "TX-6620"],
        ["Max refresh", "90 Hz", "120 Hz"],
        ["Interface", "4-lane MIPI", "4-lane MIPI"],
        ["Package", "COF", "COF"],
        ["Unit cost", "$12.00", "$11.80"],
        ["Lead time", "14 wks", "10 wks"],
        ["Availability", "EOL / LTB", "Active"],
      ],
    },
    costDetail: [
      ["Current unit", "$12.00"],
      ["Proposed unit", "$11.80  (\u2212$0.20)"],
      ["Should-cost", "$11.80"],
      ["Target", "$11.80 \u00b7 within range"],
      ["Best quote", "Triton Semiconductor"],
    ],
    qualityDetail: [
      ["PPAP level", "Level 3 (required)"],
      ["Validation", "120Hz MIPI timing re-validation"],
      ["Quality history", "Clean \u00b7 Triton Semiconductor"],
    ],
    vote: null,
    timeline: [
      // idx0 \u00b7 Triton Semiconductor's proposal lands in the thread (with a Compare action)
      { id: 1, kind: "proposal", ts: "09:28", supplier: "Triton Semiconductor", ref: "Proposal #1048",
        title: "Second-source display driver IC",
        summary: ["TDDI TX-6620", "120 Hz \u00b7 4-lane MIPI", "Drop-in COF, lead 14\u219210 wks"],
        change: [
          { label: "Driver", from: "AX-7421", to: "TX-6620" },
          { label: "Refresh", from: "90 Hz", to: "120 Hz" },
          { label: "Interface", from: "4-lane MIPI", to: "4-lane MIPI" },
          { label: "Package", from: "COF", to: "COF (drop-in)" },
          { label: "Unit price", from: "$12.00", to: "$11.80" },
          { label: "Lead time", from: "14 wks", to: "10 wks" },
          { label: "Supplier", from: "Apex Silicon \u00b7 EOL", to: "Triton Semiconductor \u00b7 2nd source" },
        ],
        text: "We'd like to propose our TX-6620 as a qualified second source for the EOL AX-7421. Datasheet and pricing attached." },
      // idx1..idx5 \u00b7 cross-functional review requested (revealed when DE sends the mention)
      { id: 2, kind: "system", ts: "10:08", text: "Cross-functional review requested" },
      { id: 3, persona: "DE", ts: "10:10", facet: "spec", text: "@all \u2014 TX-6620 looks like a clean drop-in for the EOL AX-7421 and is fine on the engineering side. Can you review whether we're OK to proceed?" },
      // idx6..idx8 \u00b7 each role reviews
      { id: 7, persona: "CM", ts: "11:20", facet: "cost", text: "Should-cost lands at $11.80; the proposed unit is $11.80 vs an $11.80 target (current $12.00). Cost target met." },
      { id: 8, persona: "SM", ts: "13:15", facet: "cost", text: "Triton Semiconductor is qualified \u2014 capacity confirmed, lead time 14\u219210 wks, low supply risk. Supplier approved." },
      { id: 9, persona: "QM", ts: "15:40", facet: "quality", text: "Quality history is clean, but the new driver + supplier need PPAP Lv3. 120Hz MIPI timing re-validation required before mass production." },
      // idx9..idx11 \u00b7 summary + approval auto-sent to PM
      { id: 10, kind: "system", ts: "15:58", text: "Before / After summary generated" },
      { id: 11, kind: "approval", persona: "DE", ts: "16:00", facet: "spec", approval: { title: "Approve evaluation build", detail: "TX-6620 / Triton Semiconductor \u00b7 validation running in parallel", state: "pending" } },
      { id: 12, kind: "system", ts: "16:00", text: "Approval request sent to Project Manager \u00b7 awaiting gate" },
    ],
    activity: [
      { id: 1, ts: "Today 09:28", actor: "SM", action: "received Supplier Proposal #1048", detail: "Alt DDIC \u00b7 TX-6620 \u00b7 120Hz \u00b7 Triton Semiconductor" },
      { id: 2, ts: "Today 10:10", actor: "DE", action: "requested cross-functional review", detail: "Mentioned CM, SM, QM" },
      { id: 3, ts: "Today 11:20", actor: "CM", action: "validated should-cost", detail: "$11.80 vs $11.80 target \u00b7 within range" },
      { id: 4, ts: "Today 13:15", actor: "SM", action: "qualified the supplier", detail: "Triton Semiconductor \u00b7 lead time 14\u219210 wks" },
      { id: 5, ts: "Today 15:40", actor: "QM", action: "flagged validation", detail: "PPAP Level 3 required" },
      { id: 6, ts: "Today 16:00", actor: "DE", action: "sent approval request to PM", detail: "Approve evaluation build" },
    ],
  },
  6: {
    title: "Touch Controller IC I2C",
    status: "voting", unread: 1,
    participantKeys: ["SM", "CM", "DE"],
    costDetail: [
      ["Current unit", "$1.20"],
      ["Proposed unit", "$1.80  (+$0.60)"],
      ["Should-cost", "$1.55"],
      ["Gap vs should-cost", "+$0.25"],
      ["Best quote", "Triton Semiconductor"],
    ],
    qualityDetail: [
      ["PPAP level", "Level 2"],
      ["APQP phase", "Phase 2 · Design"],
      ["Status", "On track"],
    ],
    vote: {
      facet: "cost", deadline: "D-1 · Due 17:00", totalVoters: 6,
      options: [
        { id: "A", label: "Approve increase", note: "$1.80 · Single source", votes: 3 },
        { id: "B", label: "Re-source", note: "Qualify a second vendor", votes: 1 },
      ],
    },
    timeline: [
      { id: 1, persona: "SM", ts: "09:40", facet: "cost", text: "Supplier raised the IC price ~50% citing a wafer shortage." },
      { id: 2, persona: "CM", ts: "11:25", facet: "cost", text: "Even against should-cost $1.55 we're +$0.25 over. Volume is low, so limited leverage." },
      { id: 21, kind: "vote", ts: "D-1 · Due 17:00" },
      { id: 3, persona: "DE", ts: "14:10", facet: "spec", text: "Spec is locked; a second source would need full re-validation." },
      { id: 23, kind: "action", persona: "PM", ts: "15:00", facet: "cost", task: { title: "Book the supplier call to finalize the decision", assignee: "SM", due: "Due today", done: false } },
      { id: 4, persona: "SM", ts: "16:40", facet: "cost", text: "Need a call on the increase today." },
    ],
    activity: [
      { id: 1, ts: "Today 09:40", actor: "SM", action: "updated the unit cost", detail: "$1.20 → $1.80 (+$0.60)" },
      { id: 2, ts: "Today 11:25", actor: "CM", action: "flagged a should-cost gap", detail: "+$0.25 vs $1.55" },
      { id: 3, ts: "Today 15:00", actor: "PM", action: "proposed a decision", detail: "Approve increase · Cost" },
    ],
  },
  10: {
    title: "Mainboard 5G SM-XXXX",
    status: "discussion", unread: 0,
    participantKeys: ["CM", "PM"],
    costDetail: [
      ["Current unit", "$52.00"],
      ["Should-cost", "$49.50"],
      ["Sourcing", "Sole-source (Supplier A)"],
    ],
    qualityDetail: [
      ["PPAP level", "To be defined"],
      ["Status", "In review"],
    ],
    vote: null,
    timeline: [
      { id: 1, persona: "PM", ts: "Mon 14:00", text: "Opening this for review — we need a sourcing direction for the mainboard." },
      { id: 31, kind: "system", ts: "Mon 14:00", text: "Status: In discussion" },
      { id: 2, persona: "CM", ts: "Tue 10:20", facet: "cost", text: "Only Supplier A is qualified at this volume; I recommend sole-sourcing." },
      { id: 33, kind: "approval", persona: "CM", ts: "Tue 10:30", facet: "cost", approval: { title: "Approve sole-sourcing the mainboard PCB", detail: "Supplier A · $52.00/unit", state: "pending" } },
    ],
    activity: [
      { id: 1, ts: "Mon 14:00", actor: "PM", action: "opened the discussion", detail: "Sourcing direction needed" },
      { id: 2, ts: "Tue 10:20", actor: "CM", action: "recommended sole-sourcing", detail: "Supplier A only qualified vendor" },
    ],
  },
  5: {
    title: "OCA Optical Clear Adhesive 6.7\"",
    status: "decided", unread: 0,
    participantKeys: ["SM", "CM", "PM"],
    costDetail: [
      ["Adopted unit", "$0.78"],
      ["Previous unit", "$0.85"],
      ["Saving", "-$0.07 (-8%)"],
      ["Supplier", "Meridian"],
    ],
    qualityDetail: [
      ["PPAP level", "Level 1"],
      ["Status", "Approved"],
    ],
    vote: {
      facet: "cost", deadline: "Closed", totalVoters: 4,
      options: [
        { id: "A", label: "Adopt re-quote", note: "$0.78 · Meridian", votes: 3 },
        { id: "B", label: "Keep current", note: "$0.85", votes: 1 },
      ],
    },
    timeline: [
      { id: 1, persona: "SM", ts: "Mon 09:10", facet: "cost", text: "Re-quote came in 8% lower than the current price." },
      { id: 52, kind: "approval", persona: "SM", ts: "Mon 11:00", facet: "cost", approval: { title: "Approve the 8% lower re-quote", detail: "Meridian · $0.78", state: "approved" } },
      { id: 2, persona: "PM", ts: "Mon 11:30", text: "Approved — adopting the re-quote." },
      { id: 51, kind: "vote", ts: "Closed" },
      { id: 53, kind: "action", persona: "PM", ts: "Mon 11:35", facet: "cost", task: { title: "Update the sourcing BOM unit cost", assignee: "SM", due: "Done", done: true } },
    ],
    activity: [
      { id: 1, ts: "Mon 09:10", actor: "SM", action: "added a re-quote", detail: "$0.85 → $0.78 (-8%)" },
      { id: 2, ts: "Mon 11:30", actor: "PM", action: "approved the decision", detail: "Adopt re-quote · Cost" },
    ],
  },
};

const EMPTY_COLLAB = { title: "", status: "discussion", unread: 0, participantKeys: [], costDetail: [], qualityDetail: [], vote: null, timeline: [], activity: [] };

// Whole-BOM collaboration — keyed per BOM (E/C/Q). Each BOM has its own thread,
// participants, status and decision. Part rooms stay item-keyed (shared across BOMs).
const BOM_COLLABS = {
  E: {
    title: "Engineering BOM v1.8", status: "voting", subline: "12 parts · 3 open agendas", unread: 2,
    participantKeys: ["DE", "PM", "CM"], lead: "DE",
    externals: [{ id: "boe", initial: "B", name: "Lumina Display", role: "Supplier · Panel" }],
    activity: [
      { id: 1, ts: "Mon 09:30", actor: "PM", action: "opened BOM v1.8 for review", detail: "Phase Gate G3 readiness" },
      { id: 2, ts: "Today 11:40", actor: "DE", action: "froze the spec", detail: "except Display Driver IC second source" },
    ],
    summary: [
      ["Total parts", "12"],
      ["Est. total cost", "$1.24M (+1.8% vs v1.7)"],
      ["Open agendas", "3"],
      ["Phase gate", "G3 readiness review"],
    ],
    vote: {
      deadline: "D-4 · Due 17:00", totalVoters: 5,
      options: [
        { id: "A", label: "Approve BOM v1.8", note: "Proceed to Phase Gate G3", votes: 3 },
        { id: "B", label: "Hold for rework", note: "Resolve open agendas first", votes: 1 },
      ],
    },
    timeline: [
      { id: 1, persona: "PM", ts: "09:30", text: "BOM v1.8 is ready for review. 3 part-level agendas are still open." },
      { id: 11, kind: "vote", ts: "D-4 · Due 17:00" },
      { id: 2, persona: "DE", ts: "11:40", text: "Spec freeze is done except the Display Driver IC second source, which is awaiting a part-level decision." },
    ],
  },
  C: {
    title: "Cost BOM v2.0", status: "discussion", subline: "12 parts · cost rollup in review", unread: 3,
    participantKeys: ["CM", "SM", "PM"], lead: "CM", externals: [],
    activity: [
      { id: 1, ts: "Mon 10:05", actor: "CM", action: "posted the v2.0 cost rollup", detail: "+1.8% vs target" },
      { id: 2, ts: "Today 13:22", actor: "SM", action: "requested re-quotes", detail: "3 suppliers · due D-1" },
    ],
    summary: [
      ["Total parts", "12"],
      ["Rolled-up cost", "$1.24M"],
      ["vs Target", "+1.8%"],
      ["Should-cost gap", "+3.2%"],
    ],
    vote: null,
    timeline: [
      { id: 1, persona: "CM", ts: "10:05", text: "Cost rollup for v2.0 is up. Two movers (Display Driver IC, Touch IC) drive most of the variance." },
      { id: 2, persona: "SM", ts: "13:22", text: "Re-quotes requested from 3 suppliers; responses expected by D-1." },
    ],
  },
  Q: {
    title: "Quality BOM v1.5", status: "decided", subline: "9 parts · PPAP tracking", unread: 0,
    participantKeys: ["QM", "SM", "DE"], lead: "QM", externals: [],
    activity: [
      { id: 1, ts: "Mon 09:10", actor: "QM", action: "adopted PPAP Level 3", detail: "critical parts" },
      { id: 2, ts: "Today 14:48", actor: "SM", action: "uploaded dimensional reports", detail: "supplier submission" },
    ],
    summary: [
      ["Tracked parts", "9"],
      ["PPAP submitted", "7 / 9"],
      ["Open NCRs", "1"],
      ["Phase gate", "PSW approved"],
    ],
    vote: {
      deadline: "Closed", totalVoters: 6,
      options: [
        { id: "A", label: "Adopt PPAP Level 3", note: "Full submission for critical parts", votes: 5 },
        { id: "B", label: "PPAP Level 2", note: "Reduced submission", votes: 1 },
      ],
    },
    timeline: [
      { id: 1, persona: "QM", ts: "09:10", text: "PPAP Level 3 adopted for critical parts. PSW approved for 7 of 9." },
      { id: 51, kind: "vote", ts: "Closed" },
      { id: 2, persona: "SM", ts: "14:48", text: "Supplier submitted the remaining dimensional reports today." },
    ],
  },
};

const STATUS_BADGE = {
  voting:     { label: "Decision pending", icon: Clock,         color: C.primary, bg: C.primaryLight },
  decided:    { label: "Decided",       icon: CheckCircle,   color: C.success, bg: C.successLight },
  discussion: { label: "In discussion", icon: MessageSquare, color: C.info,    bg: C.infoLight },
};

const FACET_META = {
  spec:    { label: "Spec",    color: "#1565E0", bg: "#E3F2FD" },
  cost:    { label: "Cost",    color: "#B54708", bg: "#FEF0C7" },
  quality: { label: "Quality", color: "#7C3AED", bg: "#EDE9FE" },
};
const ROLE_FACET = { DE: "spec", CM: "cost", SM: "cost", QM: "quality" };

// Conversation list rows — derived from the same data the rooms render
const ROOM_ORDER = [6, 3, 10, 5];
const lastOf = (tl) => { const msgs = (tl || []).filter((m) => !m.kind && m.text); const m = msgs[msgs.length - 1]; return m ? { sender: m.persona, text: m.text, ts: m.ts } : { sender: "", text: "", ts: "" }; };
const PART_ROOMS = ROOM_ORDER.map((id) => {
  const c = PART_COLLABS[id];
  return { id, kind: "part", title: c.title, status: c.status, last: lastOf(c.timeline), unread: c.unread || 0 };
});

function RoomAvatar({ kind, status, size = 36 }) {
  const meta = STATUS_BADGE[status] || STATUS_BADGE.discussion;
  const Icon = kind === "bom" ? Layers : Package;
  return (
    <div className="rounded-full flex items-center justify-center shrink-0"
      style={{ width: size, height: size, backgroundColor: kind === "bom" ? C.primaryLight : C.surfaceTinted }}>
      <Icon className="w-[18px] h-[18px]" style={{ color: kind === "bom" ? C.primary : meta.color }} />
    </div>
  );
}

function FacetChip({ f, small }) {
  const m = FACET_META[f];
  if (!m) return null;
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${small ? "h-4 px-1.5 text-[9px]" : "h-[18px] px-2 text-[11px]"}`}
      style={{ backgroundColor: m.bg, color: m.color }}>{m.label}</span>
  );
}

function DetailRows({ rows, empty = "No detail on record", accent }) {
  return (
    <div className="rounded-xl border p-3" style={{ borderColor: C.border, backgroundColor: "white" }}>
      {rows && rows.length > 0 ? (
        <div className="space-y-1">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-start gap-2 text-[12px]">
              <span className="w-1/3 shrink-0" style={{ color: C.textDisabled }}>{k}</span>
              <span className="flex-1 min-w-0 font-medium" style={{ color: C.textPrimary }}>{v}</span>
            </div>
          ))}
        </div>
      ) : <div className="text-[11px]" style={{ color: C.textDisabled }}>{empty}</div>}
    </div>
  );
}

// Inline collaboration cards (rendered in the chat stream)
function ActionCard({ m }) {
  const t = m.task || {};
  const [done, setDone] = useState(!!t.done);
  const a = PERSONAS[t.assignee] || {};
  return (
    <div className="rounded-xl border p-3" style={{ borderColor: C.border, backgroundColor: "white", boxShadow: "0 1px 1.5px rgba(16,24,40,0.05)" }}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <ListChecks className="w-4 h-4 shrink-0" style={{ color: C.primary }} />
        <span className="text-[11px] font-semibold" style={{ color: C.textPrimary }}>Action item</span>
        {m.facet && <FacetChip f={m.facet} />}
        <span className="ml-auto text-[10px]" style={{ color: C.textDisabled }}>{m.ts}</span>
      </div>
      <div className="text-[12px] font-medium mb-2" style={{ color: done ? C.textDisabled : C.textPrimary, textDecoration: done ? "line-through" : "none" }}>{t.title}</div>
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full pl-0.5 pr-2 py-0.5" style={{ backgroundColor: C.surfaceTinted }}>
          <PersonaAvatar p={t.assignee} size={18} />
          <span className="text-[10px] font-medium" style={{ color: C.textSecondary }}>{a.role || t.assignee}</span>
        </span>
        {t.due && <span className="inline-flex items-center gap-1 text-[10px]" style={{ color: C.textDisabled }}><Calendar className="w-3 h-3" />{t.due}</span>}
        <button onClick={() => setDone((d) => !d)}
          className="ml-auto inline-flex items-center gap-1 h-7 px-2.5 rounded-lg text-[11px] font-medium border transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
          style={done ? { borderColor: C.success, color: C.success, backgroundColor: C.successLight } : { borderColor: C.border, color: C.textSecondary, backgroundColor: "white" }}>
          {done ? <CheckCircle className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}{done ? "Done" : "Mark done"}
        </button>
      </div>
    </div>
  );
}

function ApprovalCard({ m, onApprove = null, approved = false }) {
  const ap = m.approval || {};
  const req = PERSONAS[m.persona] || {};
  const [state, setState] = useState(approved ? "approved" : (ap.state || "pending"));
  useEffect(() => { if (approved) setState("approved"); }, [approved]);
  const doApprove = () => { setState("approved"); if (onApprove) onApprove(); };
  return (
    <div className="rounded-xl border p-3" style={{ borderColor: C.border, backgroundColor: "white", boxShadow: "0 1px 1.5px rgba(16,24,40,0.05)" }}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <Check className="w-4 h-4 shrink-0" style={{ color: C.primary }} />
        <span className="text-[11px] font-semibold" style={{ color: C.textPrimary }}>Approval request</span>
        {m.facet && <FacetChip f={m.facet} />}
        <span className="ml-auto text-[10px]" style={{ color: C.textDisabled }}>{m.ts}</span>
      </div>
      <div className="text-[12px] font-medium" style={{ color: C.textPrimary }}>{ap.title}</div>
      {ap.detail && <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>{ap.detail}</div>}
      <div className="text-[10px] mt-1" style={{ color: C.textDisabled }}>Requested by {req.role || m.persona}</div>
      {state === "pending" ? (
        <div className="flex gap-2 mt-2.5">
          <button onClick={doApprove} className="flex-1 h-8 rounded-lg text-[12px] font-medium text-white inline-flex items-center justify-center gap-1 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1" style={{ backgroundColor: C.primary }}><Check className="w-3.5 h-3.5" /> Approve</button>
          <button onClick={() => setState("changes")} className="flex-1 h-8 rounded-lg text-[12px] font-medium border inline-flex items-center justify-center gap-1 bg-white hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1" style={{ borderColor: C.border, color: C.textSecondary }}><X className="w-3.5 h-3.5" /> Request changes</button>
        </div>
      ) : (
        <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-lg"
          style={state === "approved" ? { backgroundColor: C.successLight, color: C.success } : { backgroundColor: "#FEF0C7", color: C.warning }}>
          {state === "approved" ? <><Check className="w-3.5 h-3.5" /> Approved</> : <><X className="w-3.5 h-3.5" /> Changes requested</>}
        </div>
      )}
    </div>
  );
}

// CAI cross-functional review card — DE initiates (pre-agreed); each role agrees or leaves an opinion.
function DecisionCard({ agreements, activePersona, demoActive, demoScene, onAgree, onApprove, resolved }) {
  const roleScene = { CM: 2, SM: 3, QM: 4 };
  const REVIEWERS = [
    { role: "DE", label: "Design", note: "Clean drop-in \u2014 engineering OK.", initiator: true },
    { role: "CM", label: "Cost", note: "Cost target met \u2014 $11.80 vs $11.80 target." },
    { role: "SM", label: "Sourcing", note: "Qualified \u00b7 lead 14\u219210 wks \u00b7 low risk." },
    { role: "QM", label: "Quality", note: "Needs PPAP Lv3 + 120 Hz re-validation." },
  ];
  const [drafts, setDrafts] = useState({});
  const rowDone = (r) => r.initiator || (agreements[r.role] && agreements[r.role].agreed) || (demoActive && demoScene > roleScene[r.role]) || resolved;
  const rowNote = (r) => (agreements[r.role] && agreements[r.role].note) || r.note;
  const doneCount = REVIEWERS.filter(rowDone).length;
  const allAgreed = doneCount === REVIEWERS.length;
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: C.primaryLight, backgroundColor: "white" }}>
      <div className="px-3 py-2 flex items-center gap-1.5" style={{ backgroundColor: C.primarySoft }}>
        <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: C.primary }} />
        <span className="text-[11px] font-semibold" style={{ color: C.primary }}>Adopt TX-6620 second source?</span>
        <span className="ml-auto text-[10px] font-medium" style={{ color: C.textSecondary }}>{doneCount}/{REVIEWERS.length} agreed</span>
      </div>
      <div>
        {REVIEWERS.map((r) => {
          const done = rowDone(r);
          const active = activePersona === r.role && !done;
          const persona = PERSONAS[r.role] || {};
          return (
            <div key={r.role} className="px-3 py-2" style={{ borderTop: `1px solid ${C.borderLight}` }}>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-semibold" style={{ color: C.primary }}>@{persona.role || r.role}</span>
                {done ? (
                  <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-semibold" style={{ color: C.success }}><Check className="w-3 h-3" /> Agreed</span>
                ) : (
                  <span className="ml-auto text-[10px] font-medium" style={{ color: C.textDisabled }}>Pending</span>
                )}
              </div>
              {done ? (
                <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>{rowNote(r)}</div>
              ) : active ? (
                <div className="mt-1.5 flex items-center gap-1.5">
                  <input value={drafts[r.role] || ""} onChange={(e) => setDrafts((d) => ({ ...d, [r.role]: e.target.value }))}
                    placeholder="Add an opinion (optional)"
                    className="flex-1 min-w-0 h-7 px-2 rounded-lg border text-[11px] focus:outline-none focus-visible:ring-2" style={{ borderColor: C.border, color: C.textPrimary }} />
                  <button onClick={() => onAgree(r.role, (drafts[r.role] || "").trim() || r.note)}
                    className="shrink-0 h-7 px-3 rounded-lg text-[11px] font-medium text-white inline-flex items-center gap-1 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1" style={{ backgroundColor: C.primary }}>
                    <Check className="w-3 h-3" /> Agree
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="px-3 py-2 border-t" style={{ borderColor: C.borderLight }}>
        {resolved ? (
          <div className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: C.success }}><Check className="w-3.5 h-3.5" /> Approved \u2014 Display Driver switched to TX-6620, now on track</div>
        ) : allAgreed ? (
          activePersona === "PM" ? (
            <button onClick={() => onApprove && onApprove()} className="w-full h-8 rounded-lg text-[12px] font-medium text-white inline-flex items-center justify-center gap-1 hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1" style={{ backgroundColor: C.primary }}>
              <Check className="w-3.5 h-3.5" /> Approve evaluation build
            </button>
          ) : (
            <div className="text-[11px] font-medium" style={{ color: C.textSecondary }}>All cleared \u2014 awaiting PM approval.</div>
          )
        ) : null}
      </div>
    </div>
  );
}

// =============== CHAT ROOM ===============
// Qualified alternative second-sources for the Display Driver IC (hero), surfaced in the
// communication panel via the "Get alternative item recommendations" suggestion.
const HERO_ALTS = [
  { code: "TX-6620", name: "TDDI TX-6620 · 4-lane · 120Hz", supplier: "Triton Semiconductor", supplierNote: "proposed second source", region: "Taiwan", cost: -0.20, lead: "10 wk", lead_ok: true, ppap: "Lv3 complete", match: 95, risk: "Low", spec: "Drop-in · 4-lane MIPI · 120Hz · COF", primary: true },
  { code: "ID-5500", name: "DDIC ID-5500 · 4-lane · 120Hz", supplier: "Ironwood Semi", supplierNote: "on AVL", region: "Germany", cost: +0.10, lead: "8 wk", lead_ok: true, ppap: "Recheck timing", match: 86, risk: "Low", spec: "4-lane MIPI · 120Hz · timing re-validation needed", primary: false },
  { code: "GD-4200", name: "DDIC GD-4200 · COG package", supplier: "Griffin Sensors", supplierNote: "catalog", region: "China", cost: -0.70, lead: "12 wk", lead_ok: false, ppap: "Not on file", match: 80, risk: "Medium", spec: "COG package · needs COF retape + qualification", primary: false },
];

// "See more" popup — detail for ONE alternative item, with decision actions.
// Side-by-side comparison of the 3 qualified second sources (Apple "choose your model" style).
function AltCompareModal({ onClose, onSimulate }) {
  const riskColor = (r) => (r === "Low" ? C.success : r === "Medium" ? C.warning : C.error);
  const Row = ({ label, children }) => (
    <div className="flex items-center justify-between gap-2 text-[10px] py-1.5" style={{ borderTop: `1px solid ${C.borderLight}` }}>
      <span className="shrink-0" style={{ color: C.textDisabled }}>{label}</span>
      <span className="font-medium text-right truncate" style={{ color: C.textPrimary }}>{children}</span>
    </div>
  );
  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 200, backgroundColor: "rgba(16,24,40,0.45)" }} onClick={onClose}>
      <div className="bg-white rounded-2xl w-full overflow-hidden flex flex-col" style={{ width: "min(760px, 72vw)", maxHeight: "85vh", boxShadow: "0 24px 64px rgba(16,24,40,0.32)" }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="px-5 pt-4 pb-3 flex items-start gap-2 border-b" style={{ borderColor: C.borderLight }}>
          <div className="min-w-0">
            <div className="text-[14px] font-semibold" style={{ color: C.textPrimary }}>Compare second sources</div>
            <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>3 qualified candidates · fit vs this NPI&apos;s gates ($11.80 target · 10-wk need-date · PPAP Lv3)</div>
          </div>
          <button onClick={onClose} className="ml-auto p-1 rounded hover:bg-gray-100 shrink-0" style={{ color: C.textSecondary }}><X className="w-4 h-4" /></button>
        </div>
        {/* Columns */}
        <div className="px-5 py-4 overflow-auto">
          <div className="grid grid-cols-3 gap-3">
            {HERO_ALTS.map((c) => (
              <div key={c.code} className="flex flex-col rounded-xl border p-3" style={{ borderColor: c.primary ? C.primary : C.border, backgroundColor: c.primary ? C.primarySoft : C.surface }}>
                {/* Identity */}
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[13px] font-semibold truncate" style={{ color: C.textPrimary }}>{c.code}</span>
                  {c.primary && <span className="text-[9px] font-semibold px-1 py-0.5 rounded shrink-0" style={{ backgroundColor: C.primaryLight, color: C.primary }}>Proposed</span>}
                </div>
                <div className="text-[10px] truncate" style={{ color: C.textSecondary }}>{c.supplier}</div>
                <div className="text-[10px]" style={{ color: C.textDisabled }}>{c.supplierNote} · {c.region}</div>
                {/* Spec block (bold, aligned) */}
                <div className="text-[11px] font-medium leading-snug mt-2.5 pb-2.5 border-b" style={{ color: C.textPrimary, borderColor: C.borderLight, minHeight: 56 }}>{c.spec}</div>
                {/* Fit rows */}
                <Row label="Cost vs target"><span className="tabular-nums" style={{ color: c.cost <= 0 ? C.success : C.error }}>{c.cost <= 0 ? "−" : "+"}${Math.abs(c.cost).toFixed(2)}</span></Row>
                <Row label="Lead time"><span style={{ color: c.lead_ok ? C.success : C.warning }}>{c.lead} {c.lead_ok ? "· meets" : "· misses"}</span></Row>
                <Row label="PPAP">{c.ppap}</Row>
                <Row label="Spec match">{c.match} / 100</Row>
                <Row label="Supply risk"><span style={{ color: riskColor(c.risk) }}>{c.risk}</span></Row>
                {/* Actions — both on every card */}
                <div className="mt-auto pt-3 flex items-center gap-1.5">
                  <button onClick={() => { onClose(); onSimulate && onSimulate(c); }} className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[10px] font-medium text-white transition-opacity hover:opacity-90" style={{ backgroundColor: C.primary }}>
                    <FlaskConical className="w-3 h-3" />Simulate
                  </button>
                  <button className="flex-1 px-2 py-1.5 rounded-md text-[10px] font-medium border transition-colors hover:bg-gray-50" style={{ borderColor: C.border, color: C.textSecondary }}>Review</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold" style={{ color: C.primary }}><Sparkles className="w-3 h-3" /> Fit assessed by CAI vs this NPI&apos;s gates</div>
        </div>
      </div>
    </div>
  );
}

function ChatRoomPanel({ item, onClose, scenarioStep = 0, activePersona = "PM", activeBom = "E", bomLevel = false, initialTab = "chat", tabNonce = 0, revealCount = null, demo = null, onCompare = null, onResolve = null, resolved = false, onCompareAlts = null }) {
  // Composer auto-grows to hug its content (used by the scene-4 prefilled @mention, etc.)
  const composerRef = useRef(null);
  const src = bomLevel ? (BOM_COLLABS[activeBom] || BOM_COLLABS.E) : ((item && PART_COLLABS[item.id]) || EMPTY_COLLAB);
  const decided = src.status === "decided";
  const hasVote = !!(src.vote && src.vote.options && src.vote.options.length > 0);
  const winnerId = hasVote ? src.vote.options.reduce((a, b) => (b.votes > a.votes ? b : a)).id : null;
  // Single decision-authority model (no group vote): the accountable role for the
  // thread's facet makes the call. Other roles give input but only the owner decides.
  const FACET_DECIDER = { spec: "DE", cost: "CM", supply: "SM", sourcing: "SM", quality: "QM", schedule: "PM" };
  const deciderKey = (src.vote && (src.vote.decider || FACET_DECIDER[src.vote.facet])) || "DE";
  const deciderRole = (PERSONAS[deciderKey] || {}).role || "Owner";
  const canDecide = activePersona === deciderKey;
  const sb = STATUS_BADGE[src.status] || STATUS_BADGE.discussion;
  const title = bomLevel ? src.title : (item ? (item.partName || item.desc || item.partId) : "Conversation");
  const specEntries = Object.entries((item && item.spec) || {}).slice(0, 3);
  const summaryRows = bomLevel ? src.summary : specEntries;
  const summaryLabel = bomLevel ? "BOM summary" : "Spec summary";
  const memberCount = src.participantKeys ? src.participantKeys.length : 0;

  const [messages, setMessages] = useState(src.timeline || []);
  const [recHidden, setRecHidden] = useState(false); // suggestions disappear once you send / dismiss
  const [sending, setSending] = useState(false); // brief sending indicator
  const [sent, setSent] = useState(false); // composer message revealed in this scene (before advancing)
  const [cardCreated, setCardCreated] = useState(false); // CAI decision card generated in the thread
  const [cardLoading, setCardLoading] = useState(false); // brief "preparing review" loading before the card
  const [suggestLoading, setSuggestLoading] = useState(false); // brief loading before suggestions reappear
  const [agreements, setAgreements] = useState({}); // { CM:{agreed,note}, SM:{...}, QM:{...} }
  const [altShown, setAltShown] = useState(false); // CAI alternative second-sources card shown in the thread
  const [recReady, setRecReady] = useState(false); // brief delay before the suggestion list appears (feels context-aware)
  const [threadOrder, setThreadOrder] = useState([]); // order in which thread cards (alt / decision) were requested
  const [draft, setDraft] = useState(demo && demo.active ? (demo.prefill || "") : "");
  const [aiMenuOpen, setAiMenuOpen] = useState(false); // "add to conversation" popover
  // Hug the composer height to its content whenever the draft changes (incl. demo prefill).
  useEffect(() => {
    const el = composerRef.current;
    if (el) { el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 220) + "px"; }
  }, [draft]);
  const [vote, setVote] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [tab, setTab] = useState(initialTab || "chat");
  const scrollRef = useRef(null);
  const voteRef = useRef(null);
  const scrollToVote = () => { if (voteRef.current) voteRef.current.scrollIntoView({ behavior: "smooth", block: "center" }); };

  const post = () => {
    const t = draft.trim();
    if (!t || sending) return;
    setRecHidden(true);
    // Demo compose scene: show a brief sending state, then reveal your own message in this same scene.
    // (The user clicks Next to hand off to the next role.)
    if (composeLive) { setSending(true); setDraft(""); setTimeout(() => { setSending(false); setSent(true); }, 750); return; }
    setMessages((m) => [...m, { id: Date.now(), persona: activePersona, ts: "now", text: t }]);
    setDraft("");
    setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, 30);
  };

  // Re-sync messages when the room changes (switching BOM E/C/Q or part)
  const roomKey = bomLevel ? `bom:${activeBom}` : `part:${item && item.id}`;
  useEffect(() => { setMessages(src.timeline || []); setRecHidden(false); setSending(false); setSent(false); setCardCreated(false); setCardLoading(false); setSuggestLoading(false); setAgreements({}); setAltShown(false); setThreadOrder([]); /* eslint-disable-next-line */ }, [roomKey]);

  // Open on the requested tab (row click → Details, message icon → Chat). Nonce fires on each open.
  useEffect(() => { if (initialTab) setTab(initialTab); /* eslint-disable-next-line */ }, [tabNonce]);

  // Progressive reveal for the demo: when revealCount is set, the thread shows only the
  // first N entries so each Next advances the conversation one scene at a time.
  const baseTimeline = src.timeline || [];
  const demoActive = !!(demo && demo.active);
  const demoScene = demoActive ? demo.sceneIdx : -1;
  const advanceDemo = () => { if (demo && demo.advance) demo.advance(); };
  const compareLive = false;               // compare scene removed
  const seeItemLive = false;               // compare scene removed
  const composeLive = demoActive && !!demo.compose;     // role-review scenes → Send posts in-thread
  const onAgree = (role, note) => {
    setAgreements((a) => ({ ...a, [role]: { agreed: true, note } }));
    if (demoActive) advanceDemo(); // agreeing hands off to the next reviewer
  };
  const showCard = cardCreated || (demoActive && demoScene >= 2); // card persists once the DE generates it
  // Track activation order so the most recently requested card renders at the bottom.
  useEffect(() => { if (showCard) setThreadOrder((o) => o.includes("decision") ? o : [...o, "decision"]); }, [showCard]);
  useEffect(() => { if (altShown) setThreadOrder((o) => o.includes("alt") ? o : [...o, "alt"]); }, [altShown]);
  const effReveal = (composeLive && sent && demo.revealSent != null) ? demo.revealSent : revealCount;
  const visible = effReveal != null ? baseTimeline.slice(0, Math.max(0, effReveal)) : messages;
  const baseVisible = visible;
  const voteVisible = visible.some((m) => m.kind === "vote");
  // Scroll to the newest revealed message as the conversation unfolds.
  useEffect(() => {
    if (revealCount == null) return;
    const t = setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, 40);
    return () => clearTimeout(t);
  }, [revealCount, sent]);

  // Prefill / clear the composer as the demo moves between scenes.
  useEffect(() => {
    if (!demoActive) return;
    setDraft(demo.prefill || "");
    setRecHidden(false);
    setSending(false);
    setSent(false);
    /* eslint-disable-next-line */
  }, [demoScene]);

  // Composer context: where the message will post, and an AI work-support draft helper
  const postingLabel = bomLevel ? src.title : (item ? (item.partName || item.name || "this item") : "this item");

  // "Visible to" — permission-based message recipients (internal roles + external supplier party)
  const [visMenuOpen, setVisMenuOpen] = useState(false);
  const [visSel, setVisSel] = useState(null); // null = everyone
  const [openCai, setOpenCai] = useState(false); // CAI substitution analysis "view more"
  const [caiModalOpen, setCaiModalOpen] = useState(false);
  const proposalMsg = (src.timeline || []).find((x) => x.kind === "proposal") || null;
  // Render @mentions in primary bold and key info (prices, specs, lead time, PPAP, verdicts) in bold.
  const renderMentions = (text, onPrimary) => {
    if (!text) return text;
    const re = /(@all|@Cost Manager|@Sourcing Manager|@Quality Manager|@Product Manager|@Design Engineer|@\w+|[A-Z]{2}-\d{4}|\$\d+(?:\.\d+)?|\d+\s?→\s?\d+\s?wks?|\d+\s?wks?|\d+\s?Hz|PPAP\s?Lv\.?\s?\d|low supply risk|low risk|cost target met|target met|qualified|approved|drop-in)/gi;
    return String(text).split(re).map((part, k) => {
      if (!part) return <React.Fragment key={k} />;
      if (k % 2 === 1) {
        if (part.charAt(0) === "@") return <strong key={k} style={{ color: onPrimary ? "white" : C.primary, fontWeight: 700 }}>{part}</strong>;
        return <strong key={k} style={{ color: onPrimary ? "white" : C.textPrimary, fontWeight: 600 }}>{part}</strong>;
      }
      return <React.Fragment key={k}>{part}</React.Fragment>;
    });
  };
  // Contextual composer suggestions — engineer kicks off the review; once the card is out, no more suggestions.
  const recOptions = (() => {
    if (!proposalMsg || activePersona !== "DE" || cardCreated) return [];
    const opts = [
      { label: "Create a review decision card for the other roles", run: () => { setRecHidden(true); setCardLoading(true); setTimeout(() => { setCardLoading(false); setCardCreated(true); }, 800); } },
    ];
    if (!altShown) opts.push({ label: "Get alternative item recommendations", run: () => { setAltShown(true); } });
    opts.push({ label: "Write your own message", run: () => { setRecHidden(true); if (composerRef.current) composerRef.current.focus(); } });
    return opts;
  })();
  // On entering a room, reveal messages sequentially, then drop the suggestion list in last.
  const MSG_STAGGER = 90; // per-message entrance delay (ms)
  useEffect(() => {
    setRecReady(false);
    const needsDelay = !!proposalMsg && activePersona === "DE" && !demoActive;
    if (!needsDelay) { setRecReady(true); return; }
    setSuggestLoading(true);
    const wait = Math.min(visible.length, 8) * MSG_STAGGER + 500; // after the message stagger finishes
    const t = setTimeout(() => { setSuggestLoading(false); setRecReady(true); }, wait);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [roomKey]);
  const listVisible = !draft.trim() && !!proposalMsg && !recHidden && recReady && recOptions.length > 0 && (!demoActive || composeLive);
  // Keep the communication thread pinned to the latest message — on open, room/tab switch, and new content.
  useEffect(() => {
    const scroll = () => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; };
    const r = requestAnimationFrame(() => requestAnimationFrame(scroll));
    return () => cancelAnimationFrame(r);
  }, [tab, tabNonce, roomKey, visible.length, threadOrder, recReady, sending, sent]);
  const visParties = (() => {
    const roles = ["PM", "DE", "CM", "SM", "QM"];
    const internal = roles.filter((r) => PERSONAS[r]).map((r) => ({ id: r, name: PERSONAS[r].name || r, role: PERSONAS[r].role || r, kind: "internal" }));
    const supName = ((src.timeline || []).find((m) => m.kind === "proposal") || {}).supplier || (item && item.supplier) || null;
    const external = supName ? [{ id: "SUP", name: supName, role: "Supplier party", kind: "external" }] : [];
    return [...internal, ...external];
  })();
  const isVis = (id) => visSel === null || visSel.has(id);
  const toggleVis = (id) => setVisSel((cur) => {
    const base = cur === null ? new Set(visParties.map((p) => p.id)) : new Set(cur);
    if (base.has(id)) base.delete(id); else base.add(id);
    return base;
  });
  const visSummary = (() => {
    const sel = visParties.filter((p) => isVis(p.id));
    if (sel.length === 0) return "no one";
    if (sel.length === 1) return sel[0].name;
    return `${sel.length} parties`;
  })();

  const aiAssist = () => {
    if (bomLevel) {
      setDraft(`Quick summary of ${src.title} — ${src.subline}. Suggested next step: ${src.status === "voting" ? "record the decision to clear the gate" : src.status === "decided" ? "log the decision and notify the owners" : "align on the open points before proposing a decision"}.`);
    } else {
      setDraft(`Drafted with AI — recommend we confirm the change on ${postingLabel}, record the cost impact, and assign a PPAP owner. Please review and adjust.`);
    }
  };

  const DecisionBlock = () => (
    <div className="space-y-2">
      {src.vote.options.map((o) => {
        const selected = vote === o.id;
        const isAdopted = decided && o.id === winnerId;
        const active = isAdopted || selected;
        const accent = isAdopted ? C.textSecondary : C.primary;
        const interactive = !decided && canDecide;
        return (
          <button key={o.id} onClick={() => interactive && setVote(o.id)} disabled={!interactive}
            className="w-full text-left rounded-lg border p-2.5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-default"
            style={{ borderColor: active ? accent : C.border, backgroundColor: active ? C.primarySoft : "white" }}>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border flex items-center justify-center shrink-0" style={{ borderColor: active ? accent : C.border }}>
                {active && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: accent }} />}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-medium" style={{ color: C.textPrimary }}>Option {o.id} — {o.label}{isAdopted && <span className="ml-1.5 text-[10px] font-medium" style={{ color: C.textSecondary }}>· Adopted</span>}</div>
                <div className="text-[10px] truncate" style={{ color: C.textDisabled }}>{o.note}</div>
              </div>
              {isAdopted && <Check className="w-4 h-4 shrink-0" style={{ color: C.textSecondary }} />}
            </div>
          </button>
        );
      })}

      {decided ? (
        <div className="text-[10px]" style={{ color: C.textDisabled }}>Decided by {deciderRole}</div>
      ) : canDecide ? (
        <>
          <button onClick={() => vote && setSubmitted(true)} disabled={!vote || submitted}
            className="w-full h-9 rounded-lg text-[13px] font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed"
            style={{ backgroundColor: vote && !submitted ? C.primary : C.textDisabled, opacity: vote && !submitted ? 1 : 0.6 }}>
            {submitted ? "Decision recorded" : "Record decision"}
          </button>
          {submitted && vote && (
            <div className="text-[10px]" style={{ color: C.textDisabled }}>Recorded by {deciderRole} (you)</div>
          )}
        </>
      ) : (
        <div className="flex items-center gap-1.5 text-[10px]" style={{ color: C.textSecondary }}>
          <PersonaAvatar p={deciderKey} size={16} />
          <span>Awaiting decision by <strong style={{ color: C.textPrimary }}>{deciderRole}</strong></span>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-full relative" style={{ backgroundColor: C.surface }}>
      <style>{`@keyframes caiMsgIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}@keyframes caiPop{from{opacity:0;transform:translateY(4px) scale(.99)}to{opacity:1;transform:none}}@keyframes caiDot{0%,80%,100%{opacity:.25}40%{opacity:1}}.cai-thread>*{animation:caiMsgIn .26s ease-out both}`}</style>
      {/* Top bar */}
      <div className="shrink-0 flex items-center gap-2 px-3 pt-2 pb-1.5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="text-[13px] font-semibold truncate" style={{ color: C.textPrimary }}>{title}</div>
            {item && item.id === 3 && (
              resolved ? (
                <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: C.successLight, color: C.success }}><Check className="w-2.5 h-2.5" /> On track</span>
              ) : (
                <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: C.errorLight, color: C.error }}><span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.error }} /> Need review</span>
              )
            )}
          </div>
        </div>
        <button onClick={onClose} title="Close" className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 focus:outline-none focus-visible:ring-2" style={{ color: C.textSecondary }}>
          <X className="w-4 h-4" />
        </button>
      </div>
      {/* Tabs */}
      <div className="shrink-0 flex border-b px-2" style={{ borderColor: C.border }}>
        {[["details", "Details"], ["chat", "Communication"], ["activity", "Activity"]].map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)}
            className="relative h-9 px-4 text-[12px] font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-inset"
            style={{ color: tab === t ? C.primary : C.textSecondary }}>
            {label}
            {tab === t && <span className="absolute left-2 right-2 bottom-0 h-0.5 rounded-full" style={{ backgroundColor: C.primary }} />}
          </button>
        ))}
      </div>

      {tab === "chat" && (
        <>
      {/* Decision banner — only while a decision is pending and revealed; jumps to the card */}
      {hasVote && !decided && voteVisible && (
        <button onClick={scrollToVote}
          className="shrink-0 w-full flex items-center gap-2 px-3 py-2 border-b text-left transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset"
          style={{ borderColor: C.border, backgroundColor: C.primarySoft }}>
          <ListChecks className="w-3.5 h-3.5 shrink-0" style={{ color: C.primary }} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: C.textPrimary }}>
              Decision pending
              {src.vote.facet && <FacetChip f={src.vote.facet} />}
            </div>
            <div className="text-[10px] truncate" style={{ color: C.textSecondary }}>{canDecide ? "You are the decision owner" : `Owner: ${deciderRole}`} · {src.vote.deadline}</div>
          </div>
          <span className="text-[10px] font-medium shrink-0" style={{ color: C.primary }}>View</span>
          <ChevronDown className="w-4 h-4 shrink-0" style={{ color: C.textDisabled }} />
        </button>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="cai-thread flex-1 overflow-y-auto pl-3 pr-1.5 py-3" style={{ backgroundColor: "#F7F8FA" }}>
        {visible.length === 0 && !hasVote ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-8">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: C.surfaceTinted }}>
              <MessageSquare className="w-6 h-6" style={{ color: C.textDisabled }} />
            </div>
            <div className="text-[13px] font-medium" style={{ color: C.textPrimary }}>No collaboration yet</div>
            <div className="text-[11px] mt-1 leading-relaxed" style={{ color: C.textDisabled }}>
              {bomLevel ? "Start the discussion for this BOM" : "Be the first to raise this part"} — send a message below.
              {!hasVote && " A decision can be proposed once it's discussed."}
            </div>
          </div>
        ) : (() => { const __nodes = visible.map((m, i) => {
          const mine = m.persona === activePersona;
          const p = PERSONAS[m.persona] || {};
          const prev = visible[i - 1];
          const grouped = !!prev && prev.persona === m.persona && !m.quoted && !m.kind && !prev.kind;
          const topGap = i === 0 ? "" : grouped ? "mt-1" : "mt-3";
          const fm = m.facet && FACET_META[m.facet];
          if (m.kind === "system") {
            return (
              <div key={m.id} className="flex justify-center my-3">
                <span className="text-[10px] px-2.5 py-1 rounded-full" style={{ backgroundColor: C.surfaceTinted, color: C.textDisabled }}>{m.text}</span>
              </div>
            );
          }
          if (m.kind === "proposal") {
            const drv = (m.change || []).find((c) => c.label === "Driver") || {};
            const boldTerms = [drv.from, drv.to].filter(Boolean);
            const boldify = (text) => {
              if (!boldTerms.length || !text) return text;
              const esc = boldTerms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
              const re = new RegExp(`(${esc.join("|")})`, "g");
              return text.split(re).map((part, k) => boldTerms.includes(part)
                ? <strong key={k} style={{ color: C.textPrimary, fontWeight: 600 }}>{part}</strong>
                : <React.Fragment key={k}>{part}</React.Fragment>);
            };
            const CAI_LENS = {
              DE: { tag: "Engineering lens", head: "Drop-in 120 Hz second source \u2014 spec is a clean match.", labels: ["Driver", "Refresh", "Interface", "Package"] },
              CM: { tag: "Cost lens", head: "Proposed $11.80 vs $11.80 target (was $12.00) \u2014 cost target met.", labels: ["Unit price"] },
              SM: { tag: "Supply lens", head: "Qualified second source \u2014 lead time improves, low supply risk.", labels: ["Supplier", "Lead time"] },
              QM: { tag: "Quality lens", head: "Drop-in, but new driver + supplier need PPAP Lv3 & 120 Hz re-validation.", labels: ["Driver", "Supplier"] },
            };
            const lens = CAI_LENS[activePersona] || CAI_LENS.DE;
            return (
              <div key={m.id} className={topGap}>
                {/* Bubble 1 — supplier's message (key items bolded) */}
                <div className="flex gap-2">
                  <div className="w-7 shrink-0">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: C.surfaceTinted }}>
                      <Building2 className="w-3.5 h-3.5" style={{ color: C.textSecondary }} />
                    </div>
                  </div>
                  <div className="max-w-[88%] min-w-0">
                    <div className="text-[11px] font-medium mb-0.5" style={{ color: C.textPrimary }}>{m.supplier} <span style={{ color: C.textDisabled }}>· external supplier</span></div>
                    <div className="rounded-xl rounded-tl-sm border px-3 py-2" style={{ borderColor: C.border, backgroundColor: "white" }}>
                      {m.text && <div className="text-[12px] leading-relaxed" style={{ color: C.textSecondary }}>{boldify(m.text)}</div>}
                    </div>
                    <div className="text-[9px] mt-0.5" style={{ color: C.textDisabled }}>{m.ts}</div>
                  </div>
                </div>
                {/* Bubble 2 — CAI analysis as a continuation of the supplier message (no separate sender) */}
                <div className="flex gap-2 mt-1">
                  <div className="w-7 shrink-0" />
                  <div className="max-w-[88%] min-w-0">
                    <div className="rounded-xl rounded-tl-sm border overflow-hidden" style={{ borderColor: C.primaryLight, backgroundColor: "white" }}>
                      <div className="px-3 py-2">
                        <div className="text-[9px] font-semibold uppercase tracking-wide mb-1" style={{ color: C.primary }}>Substitution analysis · {lens.tag}</div>
                        <div className="text-[12px] leading-relaxed mb-2" style={{ color: C.textPrimary }}>{lens.head}</div>
                        <div className="space-y-1">
                          {(m.change || []).filter((c) => lens.labels.includes(c.label)).map((c, idx) => {
                            const same = c.from === c.to;
                            return (
                              <div key={idx} className="flex items-center gap-2 text-[11px]">
                                <span className="w-16 shrink-0" style={{ color: C.textDisabled }}>{c.label}</span>
                                <span className="tabular-nums" style={{ color: C.textDisabled, textDecoration: same ? "none" : "line-through" }}>{c.from}</span>
                                <ArrowRight className="w-3 h-3 shrink-0" style={{ color: C.textDisabled }} />
                                <span className="tabular-nums font-medium truncate" style={{ color: C.textPrimary }}>{c.to}</span>
                              </div>
                            );
                          })}
                        </div>
                        <button onClick={() => setCaiModalOpen(true)}
                          className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium rounded-lg border px-2 py-1 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                          style={{ borderColor: C.primaryLight, color: C.primary }}>
                          <GitCompareArrows className="w-3 h-3" /> View full comparison
                        </button>
                      </div>
                    </div>
                    <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold" style={{ color: C.primary }}>
                      <Sparkles className="w-3 h-3" /> Generated by CAI
                    </div>
                  </div>
                </div>
              </div>
            );
          }
          if (m.kind === "action") return <div key={m.id} className={topGap}><ActionCard m={m} /></div>;
          if (m.kind === "approval") return <div key={m.id} className={topGap}><ApprovalCard m={m} onApprove={onResolve} approved={resolved} /></div>;
          if (m.kind === "vote") {
            if (!hasVote) return null;
            return (
              <div key={m.id} ref={voteRef} className={topGap}>
                <div className="rounded-xl border p-3" style={{ borderColor: decided ? C.border : C.primaryLight, backgroundColor: decided ? C.surfaceTinted : C.primarySoft }}>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <ListChecks className="w-4 h-4 shrink-0" style={{ color: decided ? C.textSecondary : C.primary }} />
                    <span className="text-[12px] font-semibold" style={{ color: decided ? C.textSecondary : C.textPrimary }}>Decision</span>
                    {src.vote.facet && <FacetChip f={src.vote.facet} />}
                    <span className="ml-auto text-[10px] font-medium" style={{ color: C.textSecondary }}>{decided ? "Resolved" : `${deciderRole} · ${src.vote.deadline}`}</span>
                  </div>
                  <DecisionBlock />
                </div>
              </div>
            );
          }
          if (mine) {
            return (
              <div key={m.id} className={`flex justify-end ${topGap}`}>
                <div className="max-w-[82%]">
                  <div className="rounded-xl rounded-br-sm px-3 py-2 text-[12px] leading-relaxed" style={{ backgroundColor: C.primary, color: "white" }}>{renderMentions(m.text, true)}</div>
                  <div className="text-[9px] text-right mt-0.5" style={{ color: C.textDisabled }}>{m.ts}</div>
                </div>
              </div>
            );
          }
          return (
            <div key={m.id} className={`flex gap-2 ${topGap}`}>
              <div className="w-7 shrink-0">{!grouped && <PersonaAvatar p={m.persona} size={28} />}</div>
              <div className="max-w-[82%] min-w-0">
                {!grouped && <div className="text-[11px] font-medium mb-0.5" style={{ color: C.textPrimary }}>{p.role}</div>}
                {m.quoted && (
                  <div className="rounded-lg px-2 py-1 mb-1 text-[10px]" style={{ backgroundColor: C.primarySoft, borderLeft: `2px solid ${C.primary}`, color: C.primary }}>
                    <CornerDownRight className="w-3 h-3 inline mr-1" />Quoted from {m.quoted.from} · {m.quoted.author}
                  </div>
                )}
                <div className="rounded-xl rounded-tl-sm px-3 py-2 text-[12px] leading-relaxed inline-block"
                  style={{ backgroundColor: "white", color: C.textSecondary, border: `1px solid ${C.border}` }}>{renderMentions(m.text, false)}</div>
                <div className="text-[9px] mt-0.5" style={{ color: C.textDisabled }}>{m.ts}</div>
              </div>
            </div>
          );
        });
          // New-message separator — only where a recipient opens a thread with messages from others.
          // In the guided demo that's the PM receiving the review batch; elsewhere it doesn't fit.
          const __u = src.unread || 0;
          if (__u > 0 && baseVisible.length > 0 && (!demoActive || activePersona === "PM")) {
            const __s = Math.max(0, baseVisible.length - __u);
            const __n = baseVisible.length - __s; // new messages actually shown
            if (__n > 0 && __s > 0 && __s < __nodes.length) {
              __nodes.splice(__s, 0, (
                <div key="new-div" className="flex items-center gap-2 my-3">
                  <div className="flex-1 h-px" style={{ backgroundColor: C.primaryLight }} />
                  <span className="text-[10px] font-semibold" style={{ color: C.primary }}>{__n} new message{__n > 1 ? "s" : ""}</span>
                  <div className="flex-1 h-px" style={{ backgroundColor: C.primaryLight }} />
                </div>
              ));
            }
          }
          return __nodes.map((node, idx) =>
            React.isValidElement(node)
              ? React.cloneElement(node, { style: { ...(node.props.style || {}), animationDelay: `${Math.min(idx, 8) * MSG_STAGGER}ms` } })
              : node
          );
        })()}
        {cardLoading && (
          <div className="flex items-center gap-2 mt-3">
            <div className="flex-1 h-px" style={{ backgroundColor: C.primaryLight }} />
            <span className="inline-flex items-center gap-1.5 text-[10px] font-medium" style={{ color: C.primary }}>
              <span className="inline-flex items-center gap-0.5">
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: C.primary, animation: "caiDot 1s infinite 0s" }} />
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: C.primary, animation: "caiDot 1s infinite .15s" }} />
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: C.primary, animation: "caiDot 1s infinite .3s" }} />
              </span>
              CAI is preparing the review…
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: C.primaryLight }} />
          </div>
        )}
        {(() => {
          const cardActive = {
            decision: showCard && !!proposalMsg,
            alt: altShown && !!proposalMsg && activePersona === "DE", // alt recs are a DE-only request
          };
          const orderedKeys = [
            ...threadOrder.filter((k) => cardActive[k]),
            ...["decision", "alt"].filter((k) => cardActive[k] && !threadOrder.includes(k)),
          ];
          const renderCard = (key) => {
            if (key === "decision") return (
              <div key="decision" className="mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex-1 h-px" style={{ backgroundColor: C.primaryLight }} />
                  <span className="text-[10px] font-semibold" style={{ color: C.primary }}>Cross-functional review started</span>
                  <div className="flex-1 h-px" style={{ backgroundColor: C.primaryLight }} />
                </div>
                <DecisionCard agreements={agreements} activePersona={activePersona} demoActive={demoActive} demoScene={demoScene} onAgree={onAgree} onApprove={onResolve} resolved={resolved} />
              </div>
            );
            if (key === "alt") return (
              <div key="alt" className="mt-3 rounded-xl border overflow-hidden" style={{ borderColor: C.primaryLight, backgroundColor: "white" }}>
                <div className="px-3 py-2 flex items-center gap-1.5" style={{ backgroundColor: C.primarySoft }}>
                  <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: C.primary }} />
                  <span className="text-[11px] font-semibold" style={{ color: C.primary }}>Second-source candidates</span>
                  <span className="ml-auto text-[10px] font-medium" style={{ color: C.textSecondary }}>{HERO_ALTS.length} qualified</span>
                </div>
                <div>
                  {HERO_ALTS.map((c, i) => (
                    <div key={c.code} className="flex items-center gap-2 px-3 py-2" style={{ borderTop: i === 0 ? "none" : `1px solid ${C.borderLight}` }}>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] font-semibold truncate" style={{ color: C.textPrimary }}>{c.code}</span>
                          {c.primary && <span className="text-[9px] font-semibold px-1 py-0.5 rounded shrink-0" style={{ backgroundColor: C.primaryLight, color: C.primary }}>Proposed</span>}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5 text-[10px]" style={{ color: C.textSecondary }}>
                          <span className="truncate">{c.supplier}</span>
                          <span className="shrink-0 tabular-nums" style={{ color: c.cost <= 0 ? C.success : C.error }}>{c.cost <= 0 ? "" : "+"}{c.cost.toFixed(2)}</span>
                          <span className="shrink-0" style={{ color: c.lead_ok ? C.success : C.warning }}>· {c.lead}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-3 py-2 flex items-center gap-2 border-t" style={{ borderColor: C.borderLight }}>
                  <button onClick={() => onCompareAlts && onCompareAlts()}
                    className="inline-flex items-center gap-1 text-[11px] font-medium hover:opacity-80 focus:outline-none focus-visible:ring-2 rounded" style={{ color: C.primary }}>
                    <GitCompareArrows className="w-3.5 h-3.5" />Compare all {HERO_ALTS.length} side by side
                  </button>
                  <span className="ml-auto inline-flex items-center gap-1 text-[10px] font-semibold" style={{ color: C.primary }}>
                    <Sparkles className="w-3 h-3" />CAI
                  </span>
                </div>
              </div>
            );
            return null;
          };
          return orderedKeys.map(renderCard);
        })()}
        {sending && (
          <div className="flex justify-end mt-3">
            <div className="rounded-xl rounded-br-sm px-3 py-2 inline-flex items-center gap-1" style={{ backgroundColor: C.primarySoft }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.primary, animation: "caiDot 1s infinite 0s" }} />
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.primary, animation: "caiDot 1s infinite .15s" }} />
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.primary, animation: "caiDot 1s infinite .3s" }} />
            </div>
          </div>
        )}
        {/* Spacer so the floating suggestion list (over the composer) never overlaps the last card */}
        {listVisible && <div aria-hidden style={{ height: 96 }} />}
      </div>

      {/* Composer */}
      <div className="relative shrink-0 border-t bg-white px-2.5 pt-1.5 pb-2" style={{ borderColor: C.border }}>
        {/* Visible-to (recipients) + AI assist */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="relative shrink-0 min-w-0">
            <button type="button" onClick={() => setVisMenuOpen((o) => !o)} title="Choose who can see this message"
              className="inline-flex items-center gap-1 text-[10px] max-w-full transition-colors hover:opacity-80 focus:outline-none"
              style={{ color: C.textSecondary }}>
              <Eye className="w-3 h-3 shrink-0" />
              <span className="truncate">Visible to <strong style={{ color: C.textPrimary }}>{visSummary}</strong></span>
              <ChevronDown className="w-3 h-3 shrink-0" style={{ color: C.textDisabled }} />
            </button>
            {visMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setVisMenuOpen(false)} />
                <div className="absolute bottom-full left-0 mb-2 bg-white rounded-xl border shadow-xl z-50 overflow-hidden" style={{ borderColor: C.border, width: 288 }}>
                  <div className="px-3 pt-2.5 pb-1.5 flex items-center justify-between">
                    <span className="text-[12px] font-semibold" style={{ color: C.textPrimary }}>Visible to</span>
                    <button type="button" onClick={() => setVisSel(null)} className="text-[10px] font-medium" style={{ color: C.primary }}>Everyone</button>
                  </div>
                  <div className="text-[9px] font-medium uppercase tracking-wide px-3 pb-1" style={{ color: C.textDisabled }}>Internal</div>
                  {visParties.filter((p) => p.kind === "internal").map((p) => (
                    <button key={p.id} type="button" onClick={() => toggleVis(p.id)}
                      className="w-full flex items-center gap-2.5 px-3 py-1.5 text-left transition-colors hover:bg-gray-50">
                      <span className="w-4 h-4 rounded border flex items-center justify-center shrink-0" style={{ borderColor: isVis(p.id) ? C.primary : C.border, backgroundColor: isVis(p.id) ? C.primary : "white" }}>
                        {isVis(p.id) && <Check className="w-3 h-3 text-white" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[12px] truncate" style={{ color: C.textPrimary }}>{p.name}</span>
                        <span className="block text-[10px] truncate" style={{ color: C.textDisabled }}>{p.role}</span>
                      </span>
                    </button>
                  ))}
                  {visParties.some((p) => p.kind === "external") && (
                    <>
                      <div className="text-[9px] font-medium uppercase tracking-wide px-3 pt-1.5 pb-1 border-t mt-1" style={{ color: C.textDisabled, borderColor: C.borderLight }}>External · suppliers</div>
                      {visParties.filter((p) => p.kind === "external").map((p) => (
                        <button key={p.id} type="button" onClick={() => toggleVis(p.id)}
                          className="w-full flex items-center gap-2.5 px-3 py-1.5 text-left transition-colors hover:bg-gray-50">
                          <span className="w-4 h-4 rounded border flex items-center justify-center shrink-0" style={{ borderColor: isVis(p.id) ? C.primary : C.border, backgroundColor: isVis(p.id) ? C.primary : "white" }}>
                            {isVis(p.id) && <Check className="w-3 h-3 text-white" />}
                          </span>
                          <span className="min-w-0 flex-1 flex items-center gap-1.5">
                            <Building2 className="w-3 h-3 shrink-0" style={{ color: C.textSecondary }} />
                            <span className="block text-[12px] truncate" style={{ color: C.textPrimary }}>{p.name}</span>
                          </span>
                        </button>
                      ))}
                    </>
                  )}
                  <div className="px-3 py-2 mt-1 border-t text-[10px] leading-snug" style={{ borderColor: C.borderLight, color: C.textDisabled }}>
                    Recipients are limited by each party's access role. External suppliers only see messages explicitly shared with them.
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="relative shrink-0">
            <button type="button" onClick={() => setAiMenuOpen((o) => !o)} title="Add to conversation"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium transition-colors hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              style={{ borderColor: C.primaryLight, color: C.primary, backgroundColor: aiMenuOpen ? C.primaryLight : C.primarySoft }}>
              <Sparkles className="w-2.5 h-2.5" />
              AI assist
            </button>
            {aiMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setAiMenuOpen(false)} />
                <div className="absolute bottom-full right-0 mb-2 bg-white rounded-2xl border shadow-xl z-50 overflow-hidden" style={{ borderColor: C.border, width: 320 }}>
                  <div className="px-4 pt-3 pb-1.5 text-[12px]" style={{ color: C.textSecondary }}>CAI · add to conversation</div>
                  <div className="pb-1.5">
                    {[
                      ...(activePersona === "DE" ? [{ Icon: Boxes, title: "Get alternative items", sub: "Qualified second sources for this part", run: () => { setAltShown(true); } }] : []),
                      { Icon: Sparkles, title: "CAI decision card", sub: "Decision-ready summary + validation", run: () => setDraft(`CAI decision card — ${postingLabel}: TX-6620 / Triton Semiconductor meets the $11.80 cost target ($11.80) with a shorter 10-week lead time. Cost ✓, Supply ✓, Quality needs PPAP Lv3. Recommendation: approve an evaluation build.`) },
                      { Icon: ArrowRight, title: "Request handoff", sub: "@mention a role to act next", run: () => setDraft("@") },
                      { Icon: GitCompareArrows, title: "Spec comparison", sub: "Before / After (original vs Alt)", run: () => setDraft(`Spec comparison — ${postingLabel}: AX-7421 → TX-6620 · 90Hz → 120Hz · $12.00 → $11.80 · lead time 14 → 10 wks (Apex → Triton Semiconductor).`) },
                      { Icon: BarChart3, title: "Create vote", sub: "Decide together — approve / reject", run: () => {} },
                      { Icon: Network, title: "New discussion", sub: "Open a topic for the team", run: () => {} },
                      { Icon: ListChecks, title: "Add action item", sub: "Assign a follow-up task", run: () => {} },
                      { Icon: Sparkles, title: "Summarize thread", sub: "AI recap of the discussion", run: () => setDraft(`Thread recap — Triton Semiconductor proposed an alternative display driver IC (second source for the EOL incumbent); Cost validated should-cost within target, Sourcing qualified the supplier, Quality flagged PPAP Lv3. Pending PM gate approval.`) },
                    ].map((o) => (
                      <button key={o.title} type="button" onClick={() => { o.run(); setAiMenuOpen(false); }}
                        className="w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors hover:bg-gray-50 focus:outline-none focus-visible:bg-gray-50">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: C.primaryLight }}>
                          <o.Icon className="w-4 h-4" style={{ color: C.primary }} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[13px] font-semibold" style={{ color: C.textPrimary }}>{o.title}</div>
                          <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>{o.sub}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div>
          {suggestLoading && (
            <div className="absolute bottom-full left-2.5 right-2.5 mb-2 rounded-xl border bg-white shadow-lg overflow-hidden z-30 px-3 py-2 flex items-center gap-2" style={{ borderColor: C.border, animation: "caiPop .18s ease-out both" }}>
              <span className="inline-flex items-center gap-0.5">
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: C.primary, animation: "caiDot 1s infinite 0s" }} />
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: C.primary, animation: "caiDot 1s infinite .15s" }} />
                <span className="w-1 h-1 rounded-full" style={{ backgroundColor: C.primary, animation: "caiDot 1s infinite .3s" }} />
              </span>
              <span className="text-[11px] font-medium" style={{ color: C.textSecondary }}>CAI is thinking of next steps…</span>
            </div>
          )}
          {listVisible && (
            <div className="absolute bottom-full left-2.5 right-2.5 mb-2 rounded-xl border bg-white shadow-lg overflow-hidden z-30" style={{ borderColor: C.border, animation: "caiPop .18s ease-out both" }}>
              {recOptions.map((o, idx) => (
                <button key={idx} type="button" onClick={o.run}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-gray-50 focus:outline-none focus-visible:bg-gray-50"
                  style={{ borderTop: idx > 0 ? `1px solid ${C.borderLight}` : "none" }}>
                  <span className="w-4 h-4 rounded flex items-center justify-center shrink-0 text-[10px] font-semibold" style={{ backgroundColor: C.primarySoft, color: C.primary }}>{idx + 1}</span>
                  <span className="flex-1 text-[12px] font-medium truncate" style={{ color: C.textPrimary }}>{o.label}</span>
                  <ArrowRight className="w-3 h-3 shrink-0" style={{ color: C.textDisabled }} />
                </button>
              ))}
            </div>
          )}
          <div className="flex items-end gap-2">
          <div className="flex-1 rounded-2xl border px-3 py-2 transition-colors focus-within:border-violet-500" style={{ borderColor: C.border, backgroundColor: "white" }}>
            <textarea ref={composerRef} rows={1} value={draft} onChange={(e) => setDraft(e.target.value)}
              onInput={(e) => { const el = e.target; el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 220) + "px"; }}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); post(); } }}
              placeholder={bomLevel ? `Message ${src.title}…` : `Message about ${postingLabel}…`}
              className="w-full resize-none outline-none text-[12px] bg-transparent leading-relaxed" style={{ color: C.textPrimary, maxHeight: 220, overflowY: "auto" }} />
          </div>
          <button onClick={post} disabled={!draft.trim() || sending} title="Send"
            className="w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed"
            style={{ backgroundColor: (draft.trim() && !sending) ? C.primary : C.textDisabled, opacity: (draft.trim() && !sending) ? 1 : 0.6 }}>
            <Send className="w-4 h-4" />
          </button>
        </div>
        </div>
      </div>

      {/* CAI full comparison popup (View full comparison) */}
      {caiModalOpen && proposalMsg && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(16,24,40,0.45)" }} onClick={() => setCaiModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col" style={{ maxHeight: "80vh" }} onClick={(e) => e.stopPropagation()}>
            <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: C.border }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: C.primarySoft }}><Sparkles className="w-4 h-4" style={{ color: C.primary }} /></div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold" style={{ color: C.textPrimary }}>Substitution analysis</div>
                <div className="text-[11px] truncate" style={{ color: C.textSecondary }}>{proposalMsg.supplier} · {proposalMsg.ref}</div>
              </div>
              <button onClick={() => setCaiModalOpen(false)} title="Close" className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-gray-100 shrink-0" style={{ color: C.textSecondary }}><X className="w-4 h-4" /></button>
            </div>
            <div className="px-4 py-3 overflow-y-auto">
              {(proposalMsg.summary || []).length > 0 && (
                <div className="mb-3 space-y-1">
                  {proposalMsg.summary.map((row, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-[12px]" style={{ color: C.textPrimary }}>
                      <Check className="w-3.5 h-3.5 shrink-0" style={{ color: C.success }} />{row}
                    </div>
                  ))}
                </div>
              )}
              <div className="text-[9px] font-semibold uppercase tracking-wide mb-1.5" style={{ color: C.textDisabled }}>Change vs current part</div>
              <div className="rounded-lg border overflow-hidden" style={{ borderColor: C.borderLight }}>
                {(proposalMsg.change || []).map((c, idx) => {
                  const same = c.from === c.to;
                  return (
                    <div key={idx} className="flex items-center gap-2 px-2.5 py-1.5 text-[12px]" style={{ borderTop: idx > 0 ? `1px solid ${C.borderLight}` : "none" }}>
                      <span className="w-20 shrink-0" style={{ color: C.textDisabled }}>{c.label}</span>
                      <span className="tabular-nums" style={{ color: C.textDisabled, textDecoration: same ? "none" : "line-through" }}>{c.from}</span>
                      <ArrowRight className="w-3.5 h-3.5 shrink-0" style={{ color: C.textDisabled }} />
                      <span className="tabular-nums font-medium flex-1 truncate" style={{ color: same ? C.textSecondary : C.textPrimary }}>{c.to}</span>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold" style={{ color: C.primary }}><Sparkles className="w-3 h-3" /> Generated by CAI</div>
            </div>
          </div>
        </div>
      )}
        </>
      )}

      {tab === "details" && (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {bomLevel ? (
            <>
              <div className="text-[11px]" style={{ color: C.textSecondary }}>{src.subline}</div>
              <div>
                <div className="text-[11px] font-medium mb-1.5" style={{ color: C.textSecondary }}>BOM summary</div>
                <DetailRows rows={src.summary} />
              </div>
            </>
          ) : (
            <>
              {/* Spec */}
              <div>
                <div className="text-[11px] font-medium mb-1.5" style={{ color: C.textSecondary }}>Spec</div>
                <DetailRows rows={[
                  ...(item && item.partId ? [["Part ID", item.partId]] : []),
                  ...(item && item.itemCode ? [["Item code", item.itemCode]] : []),
                  ...specEntries,
                ]} empty="No spec on record" />
              </div>
              {/* Cost */}
              <div>
                <div className="text-[11px] font-medium mb-1.5" style={{ color: C.textSecondary }}>Cost</div>
                <DetailRows rows={src.costDetail} />
              </div>
              {/* Quality */}
              <div>
                <div className="text-[11px] font-medium mb-1.5" style={{ color: C.textSecondary }}>Quality</div>
                <DetailRows rows={src.qualityDetail} />
              </div>
            </>
          )}
        </div>
      )}

      {tab === "activity" && (
        <div className="flex-1 overflow-y-auto px-4 py-4" style={{ backgroundColor: C.surface }}>
          {src.activity && src.activity.length > 0 ? (
            <div>
              {src.activity.map((a, i) => {
                const p = PERSONAS[a.actor] || {};
                const last = i === src.activity.length - 1;
                return (
                  <div key={a.id || i} className="flex gap-2.5">
                    <div className="flex flex-col items-center shrink-0">
                      <PersonaAvatar p={a.actor} size={26} />
                      {!last && <div className="w-px flex-1 mt-1" style={{ backgroundColor: C.border }} />}
                    </div>
                    <div className="pb-4 min-w-0">
                      <div className="text-[12px] leading-snug" style={{ color: C.textPrimary }}>
                        <span className="font-medium">{p.role || a.actor}</span> {a.action}
                      </div>
                      {a.detail && <div className="text-[11px] mt-0.5 leading-relaxed" style={{ color: C.textSecondary }}>{a.detail}</div>}
                      <div className="text-[10px] mt-0.5" style={{ color: C.textDisabled }}>{a.ts}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center px-8">
              <div className="text-[12px] font-medium" style={{ color: C.textSecondary }}>No activity yet</div>
              <div className="text-[11px] mt-0.5" style={{ color: C.textDisabled }}>Changes to this item will appear here</div>
            </div>
          )}
        </div>
      )}

      {tab === "item360" && (
        <div className="flex-1 flex flex-col px-4 py-4" style={{ backgroundColor: C.surface }}>
          <div className="flex items-center gap-2 mb-3 shrink-0">
            <button onClick={() => setTab("details")} title="Back" className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-gray-100 focus:outline-none focus-visible:ring-2" style={{ color: C.textSecondary }}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="text-[13px] font-semibold" style={{ color: C.textPrimary }}>Item 360</div>
          </div>
          <div className="flex-1 rounded-xl" style={{ backgroundColor: "#eeeeee" }} />
        </div>
      )}
    </div>
  );
}


// =============== CHAT LIST ===============
function ChatListPanel({ onOpenAgenda, activePersona = "PM", activeBom = "E" }) {
  const [bomOpen, setBomOpen] = useState(false);
  if (bomOpen) return <ChatRoomPanel bomLevel onClose={() => setBomOpen(false)} activePersona={activePersona} activeBom={activeBom} />;

  const bomc = BOM_COLLABS[activeBom] || BOM_COLLABS.E;
  const bomRooms = [{ id: "bom", kind: "bom", title: bomc.title, status: bomc.status, last: lastOf(bomc.timeline), unread: bomc.unread || 0 }];
  const partRooms = PART_ROOMS;

  const Row = (room) => {
    const sender = PERSONAS[room.last.sender];
    const senderName = sender ? sender.name.split(" ")[0] : "";
    return (
      <button key={room.id} onClick={() => room.kind === "bom" ? setBomOpen(true) : (onOpenAgenda && onOpenAgenda(room.id))}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white text-left transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset">
        <RoomAvatar kind={room.kind} status={room.status} size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-medium truncate flex-1 min-w-0" style={{ color: C.textPrimary }}>{room.title}</span>
            <span className="text-[10px] tabular-nums shrink-0" style={{ color: C.textDisabled }}>{room.last.ts}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[11px] truncate flex-1 min-w-0" style={{ color: C.textSecondary }}>
              {senderName ? `${senderName}: ` : ""}{room.last.text}
            </span>
            {room.unread > 0
              ? <span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-medium text-white" style={{ backgroundColor: C.primary }}>{room.unread}</span>
              : room.status === "decided"
                ? <CheckCircle className="w-3.5 h-3.5 shrink-0" style={{ color: C.success }} />
                : null}
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: "#f1f3f5" }}>
      <div className="shrink-0 px-4 py-3.5">
        <span className="text-[15px] font-medium" style={{ color: C.textPrimary }}>Collaborations</span>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-3">
        {bomRooms.length === 0 && partRooms.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-8">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ backgroundColor: C.surfaceTinted }}>
              <MessageSquare className="w-6 h-6" style={{ color: C.textDisabled }} />
            </div>
            <div className="text-[13px] font-medium" style={{ color: C.textPrimary }}>No collaborations yet</div>
            <div className="text-[11px] mt-1 leading-relaxed" style={{ color: C.textDisabled }}>
              Open a part from the BOM and send a message to start one, or raise a BOM-wide topic.
            </div>
          </div>
        ) : (
          <>
            {bomRooms.length > 0 && (
              <>
                <div className="px-1 pt-2 pb-1.5 text-[10px] font-medium" style={{ color: C.textDisabled }}>BOM-wide</div>
                <div className="space-y-2">{bomRooms.map(Row)}</div>
              </>
            )}
            {partRooms.length > 0 && (
              <>
                <div className="px-1 pt-3 pb-1.5 text-[10px] font-medium" style={{ color: C.textDisabled }}>Parts · {partRooms.length}</div>
                <div className="space-y-2">{partRooms.map(Row)}</div>
              </>
            )}
          </>
        )}
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
    Q: { label: "Register for PPAP", icon: ShieldCheck, tab: "quality", desc: "This part needs to be registered for PPAP qualification in the Quality BOM" },
    C: { label: "Select Supplier & Quote", icon: Building2, tab: "procurement", desc: "This part needs supplier selection and cost entry in the C-BOM (Source & Cost)" },
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
      <div className="p-4 border-b" style={{ borderColor: C.border, backgroundColor: isHero ? "#fffaeb" : "white" }}>
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
            style={{ backgroundColor: isHero ? C.warningLight : C.bg }}>
            <Package className="w-6 h-6" style={{ color: isHero ? C.warning : C.textSecondary }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate" title={item.partName || item.desc} style={{ color: C.textPrimary }}>
              {item.partName || item.desc}
            </div>
            <div className="text-xs tabular-nums" style={{ color: C.textSecondary }}>
              {item.partId} · {item.itemCode || "N/A"}
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
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-medium flex items-center justify-center"
                  style={{ backgroundColor: C.primary, color: "white" }}>
                  {itemMessageCount}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Resolve panel — surfaced when the part has open issues (warn/block) so DE can act here */}
        {(() => {
          if (!item.status) return null;
          // Map each status area with an open issue to a concrete resolve action.
          const issueAreas = Object.entries(item.status).filter(([, v]) => v === "warn" || v === "block");
          if (issueAreas.length === 0) return null;
          const areaResolve = {
            D: { label: "Design Spec", tab: "spec" },
            C: { label: "Cost & Sourcing", tab: "procurement" },
            Q: { label: "Quality / PPAP", tab: "quality" },
          };
          const worst = issueAreas.some(([, v]) => v === "block") ? "block" : "warn";
          const accent = worst === "block" ? C.error : C.warning;
          return (
            // Compact single-row banner: severity label + ghost chips per area (routes to the tab).
            <div className="mt-3 p-2.5 rounded-lg flex items-center gap-x-2.5 gap-y-1.5 flex-wrap"
              style={{ backgroundColor: worst === "block" ? C.errorLight : C.warningLight }}>
              <div className="flex items-center gap-1.5 shrink-0">
                <AlertCircle className="w-4 h-4" style={{ color: accent }} />
                <span className="text-[11px] font-medium tracking-wide" style={{ color: accent }}>
                  {worst === "block" ? "BLOCKING" : "NEEDS ATTENTION"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {issueAreas.map(([k, v]) => {
                  const r = areaResolve[k];
                  if (!r) return null;
                  const chipColor = v === "block" ? C.error : C.primary;
                  return (
                    <button key={k}
                      onClick={() => setTab(r.tab)}
                      title={`Resolve ${r.label}`}
                      className="inline-flex items-center gap-1 h-6 px-2 rounded-md text-[11px] font-medium border bg-white transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                      style={{ borderColor: chipColor, color: chipColor }}>
                      <Edit3 className="w-3 h-3" />
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Missing/Lagged Action Banner — actionable CTA when item lacks required info in this BOM */}
      {(isMissingInActiveBom || isLaggedInActiveBom) && (
        <div className="p-3 border-b flex items-start gap-2.5"
          style={{ backgroundColor: isMissingInActiveBom ? C.errorLight : C.warningLight, borderColor: C.border }}>
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5"
            style={{ color: isMissingInActiveBom ? C.error : C.warning }} />
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-medium tracking-wider mb-0.5"
              style={{ color: isMissingInActiveBom ? C.error : C.warning }}>
              {isMissingInActiveBom ? `Not in ${activeBom}-BOM` : "Delayed from E-BOM"}
            </div>
            <div className="text-[12px] leading-snug mb-2" style={{ color: C.textPrimary }}>
              {isMissingInActiveBom && missingAction ? missingAction.desc : "This part has E-BOM updates that haven't synced. Review the latest spec."}
            </div>
            {isMissingInActiveBom && missingAction && (
              <button
                onClick={() => setTab(missingAction.tab)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                style={{ backgroundColor: C.primary }}>
                <missingAction.icon className="w-3 h-3" />
                {missingAction.label}
              </button>
            )}
            {isLaggedInActiveBom && (
              <button
                onClick={() => setTab("spec")}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12px] font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
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
          { id: "spec", label: "Spec", full: "Spec" },
          // Design Validation is shown only when an SM-submitted supplier pack exists for this part.
          // (Mock: Display Driver IC id=3 in the Hero scenario.)
          ...(item.id === 3 ? [{ id: "validation", label: "Validation", full: "Design Validation" }] : []),
          { id: "procurement", label: "Cost", full: "Cost & Sourcing" },
          { id: "quality", label: "Quality", full: "Quality" },
          { id: "activity", label: "Activity", full: "Activity" },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            title={t.full}
            className="flex-1 min-w-0 px-2 h-10 text-xs font-medium flex items-center justify-center border-b-2 truncate transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{
              borderColor: tab === t.id ? C.primary : "transparent",
              color: tab === t.id ? C.primary : C.textSecondary,
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-4">
        {tab === "spec" && <SpecTab item={item} scenarioStep={scenarioStep} onOpenChat={onOpenChat} />}
        {tab === "validation" && <DesignValidationTab item={item} scenarioStep={scenarioStep} onOpenChat={onOpenChat} />}
        {tab === "procurement" && <ProcurementTab item={item} scenarioStep={scenarioStep} />}
        {tab === "quality" && <QualityTab item={item} scenarioStep={scenarioStep} />}
        {tab === "activity" && <ItemActivityTab item={item} scenarioStep={scenarioStep} />}
      </div>
    </div>
  );
}

function SpecTab({ item, scenarioStep, onOpenChat }) {
  const isHero = item.id === 3;
  const specEdited = scenarioStep >= 2;
  // Similar parts (AI recommended) — each carries simulation data for the "what if I switch?" modal.
  const similarParts = [
    { id: "DDIC-TX-6620", desc: "IC,DISPLAY DRIVER,DDIC,4LANE,120HZ (Triton Semiconductor)", sim: 95,
      specDiff: [
        { key: "Driver",        from: "AX-7421",      to: "TX-6620",       risk: "ok" },
        { key: "Max Refresh",   from: "90Hz",         to: "120Hz",         risk: "ok" },
        { key: "Interface",     from: "4-lane MIPI",  to: "4-lane MIPI",   risk: "ok" },
        { key: "Package",       from: "COF",          to: "COF",           risk: "ok" },
      ],
      costDelta: -0.20, costNote: "Unit cost drops by $0.20 (current $12.00 → $11.80)",
      qualityImpact: "New supplier — PPAP Lv3 + 120Hz MIPI timing re-validation (~1 week).",
      bomImpact: { E: "Datasheet update", C: "Should-cost recalc", Q: "PPAP re-validate" } },
    { id: "DDIC-GD-4200", desc: "IC,DISPLAY DRIVER,DDIC,4LANE,120HZ (Griffin)", sim: 80,
      specDiff: [
        { key: "Driver",        from: "AX-7421",      to: "GD-4200",       risk: "ok" },
        { key: "Max Refresh",   from: "90Hz",         to: "120Hz",         risk: "ok" },
        { key: "Package",       from: "COF",          to: "COG",           risk: "block" },
        { key: "Bonding",       from: "COF bond",     to: "COG retape",    risk: "warn" },
      ],
      costDelta: -0.70, costNote: "Unit cost drops by $0.70 (current $12.00 → $11.30)",
      qualityImpact: "COG package forces COF retape + new PPAP Lv3 — not yet on AVL.",
      bomImpact: { E: "Package/retape change", C: "RFQ to add vendor", Q: "PPAP Lv3 + DVT" } },
  ];

  const [simPart, setSimPart] = useState(null); // selected similar part for simulation
  const closeSim = () => setSimPart(null);
  const discussPart = (sp) => {
    closeSim();
    // Seed chat with this part as context; pass simulation summary so the chat can show what's being discussed.
    if (onOpenChat) {
      onOpenChat({
        itemId: item.id, partId: item.partId, partName: item.partName || item.desc,
        simulation: { candidateId: sp.id, candidateDesc: sp.desc, costDelta: sp.costDelta, sim: sp.sim },
      });
    }
  };

  return (
    <div>
      {isHero && specEdited && (
        <div className="mb-3 p-3 rounded-md border flex items-start gap-2"
          style={{ backgroundColor: C.primarySoft, borderColor: C.primaryLight }}>
          <Sparkles className="w-4 h-4 shrink-0 mt-0.5" style={{ color: C.primary }} />
          <div className="text-xs" style={{ color: C.textPrimary }}>
            <div className="font-medium mb-0.5">AI Impact Preview</div>
            <div style={{ color: C.textSecondary }}>
              Cost <span className="font-medium" style={{ color: C.error }}>+$8.50</span> ·
              Lead Time <span className="font-medium" style={{ color: C.error }}> +14d</span> ·
              Supplier <span className="font-medium"> 3 suppliers affected</span>
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
        <div className="text-xs font-medium mb-2" style={{ color: C.textPrimary }}>Similar Parts (AI recommended)</div>
        <div className="space-y-2">
          {similarParts.map((s) => (
            <div key={s.id} className="p-2 rounded-md border flex items-center gap-2 text-xs"
              style={{ borderColor: C.borderLight }}>
              <div className="flex-1 min-w-0">
                <div className="tabular-nums" style={{ color: C.textPrimary }}>{s.id}</div>
                <div className="truncate" style={{ color: C.textSecondary }}>{s.desc}</div>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium shrink-0"
                style={{ backgroundColor: C.successLight, color: C.success }}>{s.sim}% match</span>
              <button onClick={() => setSimPart(s)}
                className="h-6 px-2 rounded-md text-[10px] font-medium border shrink-0 transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 inline-flex items-center gap-1"
                style={{ borderColor: C.primary, color: C.primary, backgroundColor: "white" }}
                title={`Simulate switching to ${s.id}`}>
                <Sparkles className="w-3 h-3" />
                Simulate
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Simulation Modal — "what if I switch to this part?" */}
      {simPart && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(16, 24, 40, 0.4)" }}
            onClick={closeSim} />
          <div className="fixed top-1/2 left-1/2 z-50 bg-white rounded-2xl shadow-2xl flex flex-col"
            style={{ transform: "translate(-50%, -50%)", width: "min(640px, 92vw)", maxHeight: "85vh" }}>
            {/* Header */}
            <div className="flex items-start gap-3 px-6 py-4 border-b shrink-0" style={{ borderColor: C.border }}>
              <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                style={{ backgroundColor: C.primaryLight }}>
                <Sparkles className="w-4 h-4" style={{ color: C.primary }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[16px] font-medium" style={{ color: C.textPrimary }}>
                  Switch Simulation
                </div>
                <div className="text-[12px] mt-0.5" style={{ color: C.textSecondary }}>
                  Impact of replacing <span className="tabular-nums">{item.partId}</span> with <span className="tabular-nums">{simPart.id}</span>
                </div>
              </div>
              <button onClick={closeSim}
                className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-gray-100 focus:outline-none focus-visible:ring-2 shrink-0"
                style={{ color: C.textSecondary }} title="Close">
                <XCircle className="w-4 h-4" />
              </button>
            </div>

            {/* Body — scrollable */}
            <div className="overflow-y-auto px-6 py-4 flex flex-col gap-4">
              {/* Spec diff table */}
              <div>
                <div className="text-[12px] font-medium mb-2" style={{ color: C.textSecondary }}>Specification changes</div>
                <div className="rounded-lg overflow-hidden border" style={{ borderColor: C.borderLight }}>
                  <table className="w-full text-[12px]">
                    <thead style={{ backgroundColor: C.surfaceTinted }}>
                      <tr style={{ color: C.textSecondary }}>
                        <th className="text-left font-medium py-2 px-3">Property</th>
                        <th className="text-left font-medium py-2 px-3">Current</th>
                        <th className="text-left font-medium py-2 px-3">After switch</th>
                      </tr>
                    </thead>
                    <tbody>
                      {simPart.specDiff.map((d) => {
                        const changed = d.from !== d.to;
                        const riskColor = d.risk === "block" ? C.error : d.risk === "warn" ? C.warning : C.success;
                        return (
                          <tr key={d.key} className="border-t" style={{ borderColor: C.borderLight }}>
                            <td className="py-2 px-3" style={{ color: C.textPrimary }}>{d.key}</td>
                            <td className="py-2 px-3 tabular-nums" style={{ color: C.textSecondary }}>{d.from}</td>
                            <td className="py-2 px-3 tabular-nums" style={{ color: changed ? riskColor : C.textSecondary, fontWeight: changed ? 500 : 400 }}>
                              {d.to}{changed && d.risk !== "ok" && (
                                <AlertCircle className="w-3 h-3 inline ml-1 -mt-0.5" style={{ color: riskColor }} />
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Cost impact */}
              <div className="p-3 rounded-lg flex items-start gap-2"
                style={{ backgroundColor: simPart.costDelta < 0 ? C.successLight : C.errorLight }}>
                <DollarSign className="w-4 h-4 shrink-0 mt-0.5"
                  style={{ color: simPart.costDelta < 0 ? C.success : C.error }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-medium tracking-wider"
                    style={{ color: simPart.costDelta < 0 ? C.success : C.error }}>
                    COST IMPACT {simPart.costDelta < 0 ? "↓" : "↑"} ${Math.abs(simPart.costDelta).toFixed(2)}
                  </div>
                  <div className="text-[12px] mt-0.5" style={{ color: C.textPrimary }}>{simPart.costNote}</div>
                </div>
              </div>

              {/* Quality impact */}
              <div className="p-3 rounded-lg flex items-start gap-2"
                style={{ backgroundColor: C.warningLight }}>
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" style={{ color: C.warning }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-medium tracking-wider" style={{ color: C.warning }}>QUALITY IMPACT</div>
                  <div className="text-[12px] mt-0.5" style={{ color: C.textPrimary }}>{simPart.qualityImpact}</div>
                </div>
              </div>

              {/* BOM downstream impact */}
              <div>
                <div className="text-[12px] font-medium mb-2" style={{ color: C.textSecondary }}>Downstream BOM impact</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { k: "E", label: "E-BOM", note: simPart.bomImpact.E, color: C.info, tint: C.infoLight },
                    { k: "C", label: "C-BOM", note: simPart.bomImpact.C, color: C.warning, tint: C.warningLight },
                    { k: "Q", label: "Q-BOM", note: simPart.bomImpact.Q, color: "#7c3aed", tint: "#f4eafe" },
                  ].map((b) => (
                    <div key={b.k} className="p-2 rounded-lg" style={{ backgroundColor: b.tint }}>
                      <div className="text-[10px] font-medium" style={{ color: b.color }}>{b.label}</div>
                      <div className="text-[11px] mt-0.5" style={{ color: C.textPrimary }}>{b.note}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer actions */}
            <div className="px-6 py-3 border-t flex items-center justify-end gap-2 shrink-0"
              style={{ borderColor: C.border }}>
              <button onClick={() => discussPart(simPart)}
                className="h-9 px-4 rounded-md text-[13px] font-medium border transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 inline-flex items-center gap-1.5"
                style={{ borderColor: C.border, color: C.textPrimary, backgroundColor: "white" }}>
                <MessageSquare className="w-4 h-4" />
                Discuss
              </button>
              <button onClick={closeSim}
                className="h-9 px-4 rounded-md text-[13px] font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 inline-flex items-center gap-1.5"
                style={{ backgroundColor: C.primary }}
                title={`Change part to ${simPart.id}`}>
                <GitMerge className="w-4 h-4" />
                Change
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// === DESIGN VALIDATION TAB ===
// DE's checklist for confirming a supplier-submitted part meets design requirements.
// Triggered when SM forwards a recommended supplier (e.g. Triton Semiconductor for Display Driver IC).
// Flow: review supplier pack → tick 4 fit checks → notify CM with @mention for cost roll-up.
function DesignValidationTab({ item, scenarioStep, onOpenChat }) {
  // Supplier pack from SM (mock — in production this comes from the SM submission record)
  const supplierPack = {
    supplier: "Triton Semiconductor",
    submittedBy: "Sam Lee",
    submittedAt: "28 min ago",
    quote: 11.80,
    risk: "Med", cap: 95, perf: 93,
    specSheet: "Triton Semiconductor_DDIC_TX-6620_120Hz_Rev2.pdf",
    quotesCompared: 3,
  };

  // 4-step fit checklist — DE toggles each. All must pass to enable Confirm Fit.
  const checklist = [
    {
      id: "spec",
      label: "Spec sheet meets design requirements",
      detail: "6.7\" · FHD+ · 120Hz · 40-pin FPC — matches Rev A baseline.",
    },
    {
      id: "mech",
      label: "Mechanical fit (clearance margin)",
      detail: "0.3mm clearance margin verified against housing CAD.",
    },
    {
      id: "mfg",
      label: "Manufacturability (mass production)",
      detail: "Lumina has shipped 2.3M+ similar panels. Tooling ready, lead time 6 weeks.",
    },
    {
      id: "rev",
      label: "Lock spec as Rev B",
      detail: "E-BOM revision will increment once all checks pass.",
    },
  ];

  const [checked, setChecked] = useState({});
  const allChecked = checklist.every((c) => checked[c.id]);
  const toggle = (id) => setChecked((p) => ({ ...p, [id]: !p[id] }));

  const handleConfirm = () => {
    if (!allChecked || !onOpenChat) return;
    // Seed chat with the canonical confirmation message + @CM mention.
    // The chat panel will pre-fill its composer with seedMessage.
    onOpenChat({
      itemId: item.id,
      partId: item.partId,
      partName: item.partName || item.desc,
      bom: "E",
      seedMessage: `@Cory — Design Validation complete for Display Driver IC AX-7421 (Triton Semiconductor).
✓ Spec verified: 6.7" / FHD+ / 120Hz / 40-pin FPC
✓ Mechanical fit: 0.3mm clearance margin
✓ Manufacturability: Lumina tooling ready
✓ Spec locked as Rev B

Ready for final cost roll-up at $11.80. Please verify and confirm.`,
    });
  };

  return (
    <div>
      {/* Supplier Pack from SM */}
      <div className="mb-4">
        <div className="text-[10px] font-medium tracking-wider mb-2" style={{ color: C.textSecondary }}>
          SUPPLIER PACK FROM SM
        </div>
        <div className="p-3 rounded-lg border" style={{ borderColor: C.border }}>
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
              style={{ backgroundColor: C.primarySoft, color: C.primary }}>
              <Package className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium" style={{ color: C.textPrimary }}>{supplierPack.supplier}</span>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: C.primarySoft, color: C.primary }}>Recommended by SM</span>
              </div>
              <div className="text-[12px] mt-0.5" style={{ color: C.textSecondary }}>
                Quote <span className="tabular-nums font-medium" style={{ color: C.textPrimary }}>${supplierPack.quote.toFixed(2)}</span>
                <span style={{ color: C.borderLight }}> · </span>
                Risk {supplierPack.risk} · Cap {supplierPack.cap} · Perf {supplierPack.perf}
                <span style={{ color: C.borderLight }}> · </span>
                {supplierPack.quotesCompared} quotes compared
              </div>
              <div className="text-[12px] mt-1 flex items-center gap-1.5" style={{ color: C.primary }}>
                <FileText className="w-3 h-3" />
                {supplierPack.specSheet}
              </div>
              <div className="text-[10px] mt-2" style={{ color: C.textDisabled }}>
                Submitted by {supplierPack.submittedBy} · {supplierPack.submittedAt}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fit Checklist */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] font-medium tracking-wider" style={{ color: C.textSecondary }}>
            FIT CHECKLIST <span className="ml-1" style={{ color: C.textDisabled }}>{Object.values(checked).filter(Boolean).length}/{checklist.length}</span>
          </div>
          <div className="text-[10px]" style={{ color: C.textDisabled }}>Rev B Draft</div>
        </div>
        <div className="rounded-lg border overflow-hidden" style={{ borderColor: C.border }}>
          {checklist.map((c, idx) => {
            const isChecked = !!checked[c.id];
            return (
              <button key={c.id}
                onClick={() => toggle(c.id)}
                className="w-full flex items-start gap-3 p-3 text-left transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset"
                style={{
                  borderBottom: idx < checklist.length - 1 ? `1px solid ${C.borderLight}` : "none",
                  backgroundColor: isChecked ? C.successLight : "white",
                }}>
                <div className="w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    border: isChecked ? "none" : `1.5px solid ${C.border}`,
                    backgroundColor: isChecked ? C.success : "white",
                  }}>
                  {isChecked && <Check className="w-3 h-3 text-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium" style={{ color: C.textPrimary }}>{c.label}</div>
                  <div className="text-[12px] mt-0.5" style={{ color: C.textSecondary }}>↳ {c.detail}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirm Fit & Notify CM */}
      <button
        onClick={handleConfirm}
        disabled={!allChecked}
        className="w-full h-10 rounded-md text-sm font-medium text-white transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 inline-flex items-center justify-center gap-1.5 disabled:cursor-not-allowed"
        style={{
          backgroundColor: allChecked ? C.primary : C.textDisabled,
          opacity: allChecked ? 1 : 0.6,
        }}>
        <AtSign className="w-4 h-4" />
        Confirm Fit & Notify CM
      </button>
      {!allChecked && (
        <div className="text-[10px] mt-1.5 text-center" style={{ color: C.textDisabled }}>
          Complete all {checklist.length} checks to enable
        </div>
      )}
    </div>
  );
}

// === PROCUREMENT TAB (Cost + Sourcing combined) ===
// Decision flow: "How much?" → "From whom?" → "Send RFQ"
function ProcurementTab({ item, scenarioStep }) {
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Open the supplier profile popover. Use full SUPPLIER_DETAILS entry when available;
  // otherwise build a minimal profile from the part-level supplier card data so the
  // popover still renders meaningful info even for non-master suppliers.
  const openSupplierProfile = (s) => {
    const full = SUPPLIER_DETAILS[s.name];
    if (full) {
      setSelectedSupplier(full);
    } else {
      setSelectedSupplier({
        name: s.name,
        location: s.location || "—",
        badge: s.recommended ? "Recommended" : "Qualified",
        tags: ["Qualified Supplier"],
        summary: `Risk: ${s.risk} · Capability ${s.capability}/100 · Performance ${s.performance}/100${s.quote ? ` · Latest quote $${s.quote.toFixed(2)}` : ""}.`,
        purchaseHistory: [],
        items: [],
        rfx: [],
      });
    }
  };

  const isHero = item.id === 3;
  const cost = item.cost;
  const rfqSent = isHero && scenarioStep >= 5;
  const responsesReceived = isHero && scenarioStep >= 6;
  const awarded = isHero && scenarioStep >= 7;
  const quoted = isHero && scenarioStep >= 6 ? 11.80 : (cost && cost.quoted);

  // Suppliers: Hero uses scenario; others read from item.suppliers
  const suppliers = isHero
    ? [
        { name: "Apex Silicon", risk: "Med", capability: 92, performance: 90, recommended: false, quote: 12.10 },
        { name: "Triton Semiconductor", risk: "Low", capability: 95, performance: 93, recommended: true, quote: 11.80, awarded: awarded },
        { name: "Ironwood Semi", risk: "Low", capability: 88, performance: 86, recommended: true, quote: 12.10 },
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
              <div className="text-[10px] font-medium" style={{ color: C.textSecondary }}>Target Cost</div>
              <div className="text-xl font-medium mt-0.5" style={{ color: C.textPrimary }}>${cost.target.toFixed(2)}</div>
            </div>
            <div className="p-3 rounded-md border"
              style={{
                borderColor: C.border,
                backgroundColor: overTarget ? C.errorLight : C.successLight,
              }}>
              <div className="text-[10px] font-medium" style={{ color: overTarget ? C.error : C.success }}>
                Current Cost
              </div>
              <div className="text-xl font-medium mt-0.5" style={{ color: overTarget ? C.error : C.success }}>
                ${currentValue.toFixed(2)}
              </div>
              <div className="text-[10px] mt-0.5" style={{ color: overTarget ? C.error : C.success }}>
                {overTarget ? "+" : ""}${deltaAmt.toFixed(2)} {overTarget ? "over" : "under"} target
              </div>
            </div>
          </div>

          {/* AI Cost Driver insight — auto-computed from price comparison so the user sees WHY the gap exists */}
          {(() => {
            const insights = [];
            if (cost.historical != null && cost.shouldCost != null) {
              const d = cost.shouldCost - cost.historical;
              const pct = (d / cost.historical) * 100;
              if (Math.abs(d) >= 0.01) {
                insights.push({
                  text: `Should-cost is ${d > 0 ? "+" : "−"}$${Math.abs(d).toFixed(2)} (${d > 0 ? "+" : "−"}${Math.abs(pct).toFixed(1)}%) vs Historical — likely material/labor cost shift.`,
                  warn: d > 0,
                });
              }
            }
            if (cost.market != null && cost.shouldCost != null) {
              const d = cost.market - cost.shouldCost;
              if (Math.abs(d) >= 0.5) {
                insights.push({
                  text: `Market Price is ${d > 0 ? "+" : "−"}$${Math.abs(d).toFixed(2)} vs Should-cost — ${d > 0 ? "suppliers may quote above ideal." : "favorable market window."}`,
                  warn: d > 0,
                });
              }
            }
            if (quoted != null && cost.shouldCost != null) {
              const d = quoted - cost.shouldCost;
              if (Math.abs(d) >= 0.5) {
                insights.push({
                  text: `Awarded quote is ${d > 0 ? "+" : "−"}$${Math.abs(d).toFixed(2)} vs Should-cost — ${d > 0 ? "negotiation room remains." : "secured below ideal."}`,
                  warn: d > 0,
                });
              }
            }
            if (insights.length === 0) return null;
            const anyWarn = insights.some((i) => i.warn);
            return (
              <div className="mb-3 p-3 rounded-md flex items-start gap-2"
                style={{ backgroundColor: C.primarySoft }}>
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5" style={{ color: C.primary }} />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-medium tracking-wider mb-1" style={{ color: C.primary }}>
                    AI COST DRIVER ANALYSIS
                  </div>
                  <ul className="space-y-0.5">
                    {insights.map((ins, i) => (
                      <li key={i} className="text-xs leading-snug" style={{ color: C.textPrimary }}>
                        · {ins.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })()}

          {/* Multi-source Price */}
          <div className="text-xs font-medium mb-2" style={{ color: C.textPrimary }}>Multi-source Price</div>
          <div className="space-y-1.5 mb-4">
            {[
              { label: "Historical", value: cost.historical, source: "Internal DB" },
              { label: "Market Price", value: cost.market, source: "Market Intel" },
              { label: "Should-cost", value: cost.shouldCost, source: "AI Estimation", ai: true },
              { label: "Quoted", value: quoted, source: rfqSent ? "RFQ Response" : (cost.quoted ? "Awarded" : "Pending RFQ") },
            ].map((p) => {
              // Single most decision-relevant delta: vs Should-cost (the AI benchmark).
              // (Historical-vs-Should is already explained in the AI Cost Driver box above.)
              let delta = null;
              if (p.value != null && p.label !== "Should-cost" && cost.shouldCost != null) {
                const d = p.value - cost.shouldCost;
                if (Math.abs(d) >= 0.01) delta = d;
              }
              return (
                <div key={p.label} className="flex items-center justify-between py-1.5 px-2 rounded text-xs gap-2"
                  style={{ backgroundColor: p.ai ? C.primarySoft : "transparent" }}>
                  <div className="flex items-center gap-1.5 min-w-0">
                    {p.ai && <Sparkles className="w-3 h-3 shrink-0" style={{ color: C.primary }} />}
                    <span className="font-medium whitespace-nowrap" style={{ color: C.textPrimary }}>{p.label}</span>
                    <span className="text-[10px] truncate" style={{ color: C.textDisabled }}>· {p.source}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {delta != null && (
                      <span className="text-[10px] tabular-nums font-medium px-1 py-0.5 rounded"
                        title={`${delta > 0 ? "+" : "−"}$${Math.abs(delta).toFixed(2)} vs Should-cost`}
                        style={{
                          backgroundColor: delta > 0 ? C.errorLight : C.successLight,
                          color: delta > 0 ? C.error : C.success,
                        }}>
                        {delta > 0 ? "+" : "−"}${Math.abs(delta).toFixed(2)} vs Should
                      </span>
                    )}
                    <span className="tabular-nums font-medium" style={{ color: p.value ? C.textPrimary : C.textDisabled }}>
                      {p.value ? `$${p.value.toFixed(2)}` : "—"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cost Bridge mini chart */}
          <div className="p-3 rounded-md border mb-4" style={{ borderColor: C.border }}>
            <div className="text-xs font-medium mb-2" style={{ color: C.textPrimary }}>Cost Bridge</div>
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
                    <div className="text-[10px] tabular-nums mb-1" style={{ color: b.c }}>
                      {b.v ? `$${b.v.toFixed(1)}` : "—"}
                    </div>
                    <div className="w-full rounded-t"
                      style={{
                        height: b.v ? `${(b.v / maxV) * 70}px` : "2px",
                        backgroundColor: b.c,
                        opacity: b.dashed ? 0.5 : 1,
                      }} />
                    <div className="text-[10px] mt-1 text-center" style={{ color: C.textSecondary }}>{b.label}</div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </>
      )}

      {/* === SUB-TIER BOM (children components) ===
          Shows the part's nested BOM structure so cost drivers from sub-components are visible.
          Click a child row to drill into its own detail. */}
      {(() => {
        const selfNode = BOM_TREE.find((n) => n.id === item.id);
        const childIds = (selfNode && selfNode.children) || [];
        if (childIds.length === 0) return null;
        const children = childIds.map((cid) => BOM_TREE.find((n) => n.id === cid)).filter(Boolean);
        if (children.length === 0) return null;
        // Sum of children quoted/should-cost (rough cost roll-up)
        const sum = (key) => children.reduce((acc, c) => acc + (c.cost && c.cost[key] != null ? c.cost[key] : 0), 0);
        const childrenQuotedTotal = sum("quoted");
        const childrenShouldTotal = sum("shouldCost");
        return (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium" style={{ color: C.textPrimary }}>
                Sub-tier Components <span className="text-[10px]" style={{ color: C.textSecondary }}>· {children.length}</span>
              </div>
              {(childrenQuotedTotal > 0 || childrenShouldTotal > 0) && (
                <div className="text-[10px] tabular-nums" style={{ color: C.textSecondary }}>
                  Roll-up: {childrenQuotedTotal > 0 ? `Quoted $${childrenQuotedTotal.toFixed(2)}` : ""}
                  {childrenQuotedTotal > 0 && childrenShouldTotal > 0 ? " · " : ""}
                  {childrenShouldTotal > 0 ? `Should $${childrenShouldTotal.toFixed(2)}` : ""}
                </div>
              )}
            </div>
            <div className="rounded-md border overflow-hidden" style={{ borderColor: C.borderLight }}>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ color: C.textDisabled, backgroundColor: C.surfaceTinted, borderBottom: `1px solid ${C.borderLight}` }}>
                    <th className="text-left font-medium py-2 px-3">Part</th>
                    <th className="text-right font-medium py-2 px-2">Should</th>
                    <th className="text-right font-medium py-2 px-2">Quoted</th>
                    <th className="text-right font-medium py-2 px-2">Δ vs Should</th>
                    <th className="text-center font-medium py-2 px-2 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {children.map((c) => {
                    const should = c.cost && c.cost.shouldCost;
                    const q = c.cost && c.cost.quoted;
                    const delta = (should != null && q != null) ? q - should : null;
                    return (
                      <tr key={c.id}
                        className="border-b transition-colors hover:bg-gray-50"
                        style={{ borderColor: C.borderLight }}>
                        <td className="py-2 px-3">
                          <div className="font-medium truncate" style={{ color: C.textPrimary }}>{c.desc || c.partId}</div>
                          <div className="text-[10px] tabular-nums" style={{ color: C.textDisabled }}>{c.partId}</div>
                        </td>
                        <td className="py-2 px-2 text-right tabular-nums" style={{ color: should != null ? C.textPrimary : C.textDisabled }}>
                          {should != null ? `$${should.toFixed(2)}` : "—"}
                        </td>
                        <td className="py-2 px-2 text-right tabular-nums" style={{ color: q != null ? C.textPrimary : C.textDisabled }}>
                          {q != null ? `$${q.toFixed(2)}` : "—"}
                        </td>
                        <td className="py-2 px-2 text-right tabular-nums font-medium"
                          style={{ color: delta == null ? C.textDisabled : delta > 0 ? C.error : C.success }}>
                          {delta == null ? "—" : `${delta > 0 ? "+" : "−"}$${Math.abs(delta).toFixed(2)}`}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <ChevronRight className="w-3.5 h-3.5 inline" style={{ color: C.textDisabled }} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}

      {/* === SOURCING SECTION === */}
      {suppliers.length > 0 && (
        <>
          <div className="text-xs font-medium mb-2" style={{ color: C.textPrimary }}>
            {isHero ? "Recommended Suppliers" : "Qualified Suppliers"}{" "}
            <span className="text-[10px]" style={{ color: C.textSecondary }}>
              · {isHero ? "Pre-qualified by AI" : "Master Supplier List"}
            </span>
          </div>
          <div className="space-y-2 mb-4">
            {suppliers.map((s, idx) => {
              const isAwarded = s.awarded || (!isHero && idx === 0 && s.recommended);
              return (
                <button key={s.name} onClick={() => openSupplierProfile(s)}
                  className="w-full text-left p-2.5 rounded-md border transition-colors hover:shadow-sm hover:border-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                  style={{
                    borderColor: isAwarded ? C.success : C.borderLight,
                    backgroundColor: isAwarded ? C.successLight : "white",
                  }}
                  title={`View ${s.name} profile`}>
                  <div className="flex items-start justify-between mb-1.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Building2 className="w-3.5 h-3.5" style={{ color: C.textSecondary }} />
                      <span className="text-xs font-medium" style={{ color: C.textPrimary }}>{s.name}</span>
                      {isAwarded && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                          style={{ backgroundColor: C.success, color: "white" }}>Awarded</span>
                      )}
                      {s.recommended && !isAwarded && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                          style={{ backgroundColor: C.primaryLight, color: C.primary }}>Recommended</span>
                      )}
                    </div>
                    {(responsesReceived || (!isHero && s.quote)) && (
                      <span className="tabular-nums font-medium text-xs"
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
                </button>
              );
            })}
          </div>

          {/* AI Recommendation (Hero scenario) */}
          {isHero && responsesReceived && !awarded && (
            <div className="p-3 mb-4 rounded-md border flex items-start gap-2"
              style={{ backgroundColor: C.primarySoft, borderColor: C.primaryLight }}>
              <Sparkles className="w-4 h-4 shrink-0 mt-0.5" style={{ color: C.primary }} />
              <div className="text-xs">
                <div className="font-medium mb-0.5" style={{ color: C.textPrimary }}>AI Recommendation</div>
                <div style={{ color: C.textSecondary }}>
                  <span className="font-medium">Lumina Display</span> — -$2.90 vs Should-cost (best); Risk Med but Performance is solid
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
          {awarded ? <><CheckCircle className="w-3.5 h-3.5" />Lumina Awarded · Notify CM</>
            : rfqSent ? <><Clock className="w-3.5 h-3.5" />Awaiting Quotes (D-3)</>
            : <><Send className="w-3.5 h-3.5" />Send Multi-Supplier RFQ</>}
        </button>
      )}

      {/* Supplier profile popover — opens when any qualified-supplier card is clicked */}
      {selectedSupplier && (
        <SupplierProfilePopover supplier={selectedSupplier} onClose={() => setSelectedSupplier(null)} />
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
          <div className="text-[10px] font-medium" style={{ color: C.textSecondary }}>Risk</div>
          <div className="text-lg font-medium mt-0.5" style={{ color: riskColor }}>{q.riskLevel}</div>
        </div>
        <div className="p-3 rounded-md border" style={{ borderColor: C.border, backgroundColor: C.primarySoft }}>
          <div className="text-[10px] font-medium" style={{ color: C.primary }}>PPAP</div>
          <div className="text-lg font-medium mt-0.5" style={{ color: C.primary }}>Lv {q.ppapLevel}</div>
        </div>
        <div className="p-3 rounded-md border" style={{ borderColor: C.border }}>
          <div className="text-[10px] font-medium" style={{ color: C.textSecondary }}>Progress</div>
          <div className="text-lg font-medium mt-0.5"
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
          <div className="font-medium" style={{ color: overallSync ? C.success : C.warning }}>
            {overallSync ? "Q-BOM ↔ C-BOM Synced" : "Q-BOM Sync Needed"}
          </div>
          <div className="text-[10px]" style={{ color: C.textSecondary }}>
            {overallSync ? "Last sync: Just now · Auto-sync enabled" : "Register newly added parts to Q-BOM"}
          </div>
        </div>
      </div>

      {/* PPAP Deliverables */}
      <div className="text-xs font-medium mb-2" style={{ color: C.textPrimary }}>
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
      <div className="text-center py-12">
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
          <span className="font-medium" style={{ color: C.textPrimary }}>{activity.length}</span> events
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
                  <span className="text-[10px] font-medium tracking-wide px-1.5 py-0.5 rounded"
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
                <div className="text-[12px] leading-relaxed" style={{ color: C.textSecondary }}>
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
                <span className="text-[10px] font-medium tracking-wide px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: "rgba(0,0,0,0.05)", color: C.textSecondary }}>
                  Chat
                </span>
                <span className="text-xs font-medium" style={{ color: C.textPrimary }}>
                  {m.persona === "AI" ? "AI Assistant" : PERSONAS[m.persona]?.name}
                </span>
                {m.decision && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                    style={{ backgroundColor: C.primary, color: "white" }}>Decision</span>
                )}
                <span className="text-[10px] ml-auto shrink-0" style={{ color: C.textDisabled }}>
                  {m.ts}
                </span>
              </div>
              <div className="text-[12px] leading-relaxed" style={{ color: C.textSecondary }}>
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
  const [itemBomFilter, setItemBomFilter] = useState(null); // within item scope: null=all, "E"|"C"|"Q"
  // Composer draft text — controlled so external callers can seed it (e.g. "Confirm Fit & Notify CM" pre-fills the @CM mention).
  const [composerText, setComposerText] = useState("");
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
      // If opened from a specific BOM (e.g. comment in C-BOM workspace), preselect that
      // perspective — but only if that BOM actually has messages for this part; else show All.
      const bom = context.bom || null;
      const hasMsgInBom = bom
        ? ACTIVITY_FEED.some((m) => m.itemRef && m.itemRef.id === context.itemId && (CHANNEL_TO_BOM[m.channel] || "E") === bom)
        : false;
      setItemBomFilter(hasMsgInBom ? bom : null);
      // Seed composer if the caller provided a draft message (e.g. DE → CM mention from Design Validation).
      if (context.seedMessage) setComposerText(context.seedMessage);
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
      // A part's conversation is unified across BOMs; the BOM-perspective filter
      // (itemBomFilter) narrows to messages from one BOM context (via channel).
      return allMessages.filter((m) => {
        if (!(m.itemRef && m.itemRef.id === itemContext.itemId)) return false;
        if (itemBomFilter && (CHANNEL_TO_BOM[m.channel] || "E") !== itemBomFilter) return false;
        return true;
      });
    }
    if (scope === "bom") {
      const channels = BOM_TO_CHANNELS[bomFilter] || [];
      return allMessages.filter((m) => channels.includes(m.channel));
    }
    return allMessages;
  }, [allMessages, scope, bomFilter, itemContext, itemBomFilter]);

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

  // BOM mode: group messages by the BOM version they happened under (history-style).
  // Each BOM has a version timeline; recent scenario messages sit on the current version,
  // older collaboration history sits on the previous version.
  const BOM_VERSIONS = {
    E: { current: "v1.8", prev: "v1.5" },
    C: { current: "v2.0", prev: "v1.5" },
    Q: { current: "v1.5", prev: "v1.0" },
  };
  // Heuristic: scenario messages (Hero, id <= 8) and items without an explicit "ago" timestamp
  // are on the CURRENT version; messages whose ts mentions a past day are on the PREVIOUS version.
  const versionOfMessage = (m, bom) => {
    const v = BOM_VERSIONS[bom] || BOM_VERSIONS.E;
    const ts = (m.ts || "").toLowerCase();
    const isPast = ts.includes("ago") || ts.includes("yesterday") || ts.includes("day");
    return isPast ? v.prev : v.current;
  };

  // Resolve a message's source: which BOM (via channel) + which version of that BOM.
  // Used to render the source chip on ALL-scope bubbles so origin is always visible.
  const sourceOf = (m) => {
    const bom = CHANNEL_TO_BOM[m.channel] || "E";
    return { bom, version: versionOfMessage(m, bom) };
  };

  const groupedByVersion = useMemo(() => {
    if (scope !== "bom") return null;
    const v = BOM_VERSIONS[bomFilter] || BOM_VERSIONS.E;
    // Order: current version first (newest), then previous.
    const order = [v.current, v.prev];
    const groups = {};
    order.forEach((ver) => { groups[ver] = []; });
    displayMessages.forEach((m) => {
      const ver = versionOfMessage(m, bomFilter);
      if (!groups[ver]) groups[ver] = [];
      groups[ver].push(m);
    });
    // Return as ordered array of [version, msgs, isCurrent]
    return order.map((ver) => [ver, groups[ver] || [], ver === v.current]);
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
    setItemBomFilter(null); // start with unified view for a newly opened part
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
              <div className="text-sm font-medium" style={{ color: C.textPrimary }}>Communication</div>
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
            className="flex-1 px-2 py-1 rounded text-[12px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
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
            className="flex-1 px-2 py-1 rounded text-[12px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
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
            className="flex-1 px-2 py-1 rounded text-[12px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed"
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
            <span className="text-[10px] font-medium tracking-wide shrink-0" style={{ color: C.textDisabled }}>
              BOM:
            </span>
            {["E", "C", "Q"].map((id) => (
              <button key={id} onClick={() => setBomFilter(id)}
                className="px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 hover:opacity-80"
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
              <div className="text-[12px] font-medium truncate" style={{ color: C.textPrimary }}>
                {itemContext.partName}
              </div>
              <div className="text-[10px] tabular-nums" style={{ color: C.textSecondary }}>
                {itemContext.partId}
              </div>
            </div>
            <button onClick={() => { setItemContext(null); setScope("all"); setItemBomFilter(null); }}
              className="p-0.5 rounded hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              title="Clear item filter">
              <X className="w-3 h-3" style={{ color: C.textSecondary }} />
            </button>
          </div>
        )}

        {/* BOM perspective filter (within item scope) — a part's history is unified across BOMs,
            but can be narrowed to one BOM's perspective (Engineering / Cost / Quality). */}
        {scope === "item" && itemContext && (() => {
          // Count this part's messages per BOM context.
          const partMsgs = allMessages.filter((m) => m.itemRef && m.itemRef.id === itemContext.itemId);
          const countFor = (bom) => partMsgs.filter((m) => (CHANNEL_TO_BOM[m.channel] || "E") === bom).length;
          const perspectives = [
            { id: null, label: "All", count: partMsgs.length },
            { id: "E", label: "E-BOM", count: countFor("E") },
            { id: "C", label: "C-BOM", count: countFor("C") },
            { id: "Q", label: "Q-BOM", count: countFor("Q") },
          ];
          return (
            <div className="flex items-center gap-1 mb-2 flex-wrap">
              {perspectives.map((p) => {
                const isActive = itemBomFilter === p.id;
                const disabled = p.id !== null && p.count === 0;
                const tint = { E: C.info, C: C.warning, Q: "#7c3aed" }[p.id];
                return (
                  <button key={p.label}
                    disabled={disabled}
                    onClick={() => setItemBomFilter(p.id)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: isActive ? (tint || C.primary) : "transparent",
                      color: isActive ? "white" : C.textSecondary,
                      border: isActive ? "none" : `1px solid ${C.border}`,
                    }}>
                    {p.id && <GitBranch className="w-2.5 h-2.5" />}
                    {p.label}
                    <span style={{ opacity: 0.7 }}>{p.count}</span>
                  </button>
                );
              })}
            </div>
          );
        })()}

        {/* Search */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-md border focus-within:ring-2 focus-within:ring-offset-1"
          style={{ borderColor: C.border }}>
          <Search className="w-3 h-3 shrink-0" style={{ color: C.textDisabled }} />
          <input type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search messages, parts, people..."
            className="flex-1 text-[12px] outline-none bg-transparent"
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
        ) : scope === "bom" && groupedByVersion ? (
          // BOM scope: group by BOM version (history-style version dividers)
          groupedByVersion.map(([version, msgs, isCurrent]) => (
            msgs.length > 0 && (
              <div key={version} className="mb-1">
                {/* Version divider — minimal: centered text with lines on both sides (Figma) */}
                <div className="flex items-center gap-2 mb-2 px-1 sticky top-0 z-[1] py-1"
                  style={{ backgroundColor: "#ffffff" }}>
                  <div className="flex-1 h-px" style={{ backgroundColor: C.borderLight }} />
                  <span className="text-[12px] font-medium whitespace-nowrap" style={{ color: C.textDisabled }}>
                    {bomFilter}-BOM {version}{isCurrent ? " current" : ""}
                  </span>
                  <div className="flex-1 h-px" style={{ backgroundColor: C.borderLight }} />
                </div>
                {/* Messages under this version */}
                <div className="space-y-2">
                  {msgs.map((m) => (
                    <ChatMessage key={m.id} message={m}
                      onOpenItem={openItemScope}
                      showItemChip={scope !== "item"}
                      showBomChip={false} />
                  ))}
                </div>
              </div>
            )
          ))
        ) : (
          // All scope or Item scope: flat list. Source chip shows BOM + version so origin is visible.
          displayMessages.map((m) => {
            const src = sourceOf(m);
            return (
              <ChatMessage key={m.id} message={m}
                onOpenItem={openItemScope}
                showItemChip={scope !== "item"}
                showBomChip={true}
                sourceBom={src.bom}
                sourceVersion={src.version} />
            );
          })
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
        <div className="rounded-md border flex items-start gap-2 p-2"
          style={{ borderColor: scope === "item" ? C.primary : C.border }}>
          <textarea
            value={composerText}
            onChange={(e) => setComposerText(e.target.value)}
            placeholder={composerCtx.placeholder}
            rows={Math.min(8, Math.max(1, composerText.split("\n").length, composerText.length > 80 ? 3 : 1))}
            className="flex-1 text-xs outline-none bg-transparent resize-none"
            style={{ color: C.textPrimary, fontFamily: "inherit" }} />
          <Paperclip className="w-3.5 h-3.5 mt-1 shrink-0" style={{ color: C.textDisabled }} />
          <AtSign className="w-3.5 h-3.5 mt-1 shrink-0" style={{ color: C.textDisabled }} />
          <Smile className="w-3.5 h-3.5 mt-1 shrink-0" style={{ color: C.textDisabled }} />
          <button
            onClick={() => setComposerText("")}
            disabled={!composerText.trim()}
            className="ml-1 px-2 py-1 rounded text-[10px] font-medium text-white flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
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
            <div className="text-base font-medium" style={{ color: C.textPrimary }}>Visible to</div>
            <div className="text-[12px] mt-0.5" style={{ color: C.textSecondary }}>
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
          <div className="text-[12px] font-medium tracking-wide mb-2" style={{ color: C.textDisabled }}>
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
                        <span className="text-sm font-medium" style={{ color: C.textPrimary }}>{g.label}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium inline-flex items-center gap-0.5"
                          style={{ backgroundColor: C.bg, color: C.textSecondary }}>
                          <Users className="w-2.5 h-2.5" />
                          {g.count}
                        </span>
                      </div>
                      <div className="text-[12px] mt-0.5 truncate" style={{ color: C.textSecondary }}>
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
          <div className="text-[12px] font-medium tracking-wide mb-2 flex items-center justify-between" style={{ color: C.textDisabled }}>
            <span>Specific Users</span>
            <button className="text-[10px] font-medium hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 inline-flex items-center gap-0.5"
              style={{ color: C.primary }}>
              <Plus className="w-2.5 h-2.5" />
              Add
            </button>
          </div>
          {localUsers.length === 0 ? (
            <div className="text-[12px] italic" style={{ color: C.textDisabled }}>
              No additional users selected
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {localUsers.map((u) => (
                <span key={u}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[12px] font-medium"
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
function ChatMessage({ message: m, onOpenItem, showItemChip, sourceBom, sourceVersion, showBomChip }) {
  const isAI = m.persona === "AI";
  // Visibility — for mock data we infer from channel:
  // - sourcing/cost channels often include external suppliers; show "2 groups"
  // - others default to internal only ("Internal")
  const visibility = m.visibility || (
    m.channel === "sourcing" ? { label: "2 Groups", external: true } : { label: "Internal", external: false }
  );
  // BOM tint for the source chip
  const bomTint = { E: C.infoLight, C: C.warningLight, Q: "#f4eafe" }[sourceBom] || C.bg;
  const bomColor = { E: C.info, C: C.warning, Q: "#7c3aed" }[sourceBom] || C.textSecondary;

  return (
    <div className="flex items-start gap-2 p-2 rounded-md"
      style={{
        // AI messages get subtle tint background (Q3-b)
        backgroundColor: isAI ? C.primarySoft : "transparent",
      }}>
      <PersonaAvatar p={isAI ? "PM" : m.persona} size={28} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-1.5 mb-0.5 flex-wrap">
          <span className="text-xs font-medium" style={{ color: C.textPrimary }}>
            {isAI ? "AI Assistant" : PERSONAS[m.persona]?.name}
          </span>
          {isAI && <Sparkles className="w-3 h-3 shrink-0" style={{ color: C.primary }} />}
          <span className="text-[10px]" style={{ color: C.textDisabled }}>{m.ts}</span>
          {/* Source chip — which BOM + version this message belongs to.
              Hidden in BOM scope (already grouped by version) to avoid redundancy. */}
          {showBomChip && sourceBom && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded"
              style={{ backgroundColor: bomTint, color: bomColor }}
              title={`${sourceBom}-BOM ${sourceVersion || ""}`}>
              <GitBranch className="w-2.5 h-2.5" />
              {sourceBom}-BOM{sourceVersion ? ` ${sourceVersion}` : ""}
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
            <span className="tabular-nums">{m.itemRef.partId}</span>
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
          <span className="tabular-nums">{project.code}</span>
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
    { partId: "EI2-I6DA-003WB", desc: "IC,DISPLAY DRIVER,DDIC,MIPI-4LANE,120HZ", source: 12.00, target: 11.80, change: "Similar Description", similarity: 95, isHero: true },
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
          <div className="text-[10px] font-medium" style={{ color: C.textSecondary }}>Newly Added</div>
          <div className="text-lg font-medium mt-0.5" style={{ color: C.success }}>4 items</div>
          <div className="text-[10px]" style={{ color: C.textSecondary }}>+$84.20 total</div>
        </div>
        <div className="p-3 rounded-md border" style={{ borderColor: C.border }}>
          <div className="text-[10px] font-medium" style={{ color: C.textSecondary }}>Removed</div>
          <div className="text-lg font-medium mt-0.5" style={{ color: C.textSecondary }}>4 items</div>
          <div className="text-[10px]" style={{ color: C.textSecondary }}>-$198.09 total</div>
        </div>
        <div className="p-3 rounded-md border" style={{ borderColor: C.border }}>
          <div className="text-[10px] font-medium" style={{ color: C.textSecondary }}>SIMILAR (Changed)</div>
          <div className="text-lg font-medium mt-0.5" style={{ color: C.warning }}>3 items</div>
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
                      : r.change === "Similar Description" ? "#fffaeb"
                      : r.isHero ? "#fffaeb" : "white",
                  }}>
                  <td className="py-2.5 px-2">
                    <div className="tabular-nums text-[10px]" style={{ color: C.textPrimary }}>{r.partId}</div>
                    <div className="text-[10px]" style={{ color: C.textSecondary }}>{r.desc}</div>
                  </td>
                  <td className="text-right tabular-nums py-2.5 px-2" style={{ color: r.source ? C.textPrimary : C.textDisabled }}>
                    {r.source ? `$${r.source.toFixed(2)}` : "—"}
                  </td>
                  <td className="text-right tabular-nums py-2.5 px-2" style={{ color: r.target ? C.textPrimary : C.textDisabled }}>
                    {r.target ? `$${r.target.toFixed(2)}` : "—"}
                  </td>
                  <td className="text-right tabular-nums font-medium py-2.5 px-2"
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
                  <td className="text-center py-2.5 px-2 tabular-nums" style={{ color: C.textSecondary }}>
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
            <div className="text-lg font-medium mt-0.5" style={{ color: C.primary }}>${total.toFixed(2)}</div>
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
                <div className="tabular-nums text-[10px]" style={{ color: C.textPrimary }}>{d.partId}</div>
                <div className="text-[10px]" style={{ color: C.textSecondary }}>{d.desc}</div>
              </td>
              <td className="text-right tabular-nums font-medium py-2.5 px-2"
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
        <div className="text-xs font-medium mb-3" style={{ color: C.textPrimary }}>
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
                  <span className="absolute -top-5 text-[10px] tabular-nums font-medium" style={{ color: C.info }}>
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
                <div className="text-[10px] font-medium" style={{ color: C.textPrimary }}>{d.phase}</div>
                <div className="text-[10px]" style={{ color: C.textSecondary }}>{fmtDate(d.date)}</div>
                <div className="text-[10px] tabular-nums font-medium mt-0.5"
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
              <td className="py-2.5 px-2 tabular-nums" style={{ color: C.textSecondary }}>{fmtDate(d.date)}</td>
              <td className="text-right tabular-nums py-2.5 px-2" style={{ color: C.textPrimary }}>${d.current.toFixed(2)}</td>
              <td className="text-right tabular-nums py-2.5 px-2" style={{ color: C.textSecondary }}>${d.target.toFixed(2)}</td>
              <td className="text-right tabular-nums font-medium py-2.5 px-2"
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
        <div className="text-xs font-medium mb-3" style={{ color: C.textPrimary }}>
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
                    <span className="text-[10px] tabular-nums font-medium" style={{ color }}>
                      {w.value > 0 && w.type !== "start" && w.type !== "end" ? "+" : ""}${Math.abs(w.value).toFixed(0)}
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-center font-medium leading-tight px-0.5"
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
          <div className="text-[10px] font-medium" style={{ color: C.textSecondary }}>Source BOM</div>
          <div className="text-lg font-medium mt-0.5" style={{ color: C.textPrimary }}>$800.85</div>
        </div>
        <div className="p-3 rounded-md border" style={{ borderColor: C.border, backgroundColor: C.primarySoft }}>
          <div className="text-[10px] font-medium" style={{ color: C.primary }}>Target BOM</div>
          <div className="text-lg font-medium mt-0.5" style={{ color: C.primary }}>$686.96</div>
        </div>
        <div className="p-3 rounded-md border" style={{ borderColor: C.border, backgroundColor: C.successLight }}>
          <div className="text-[10px] font-medium" style={{ color: C.success }}>Total Savings</div>
          <div className="text-lg font-medium mt-0.5" style={{ color: C.success }}>-$113.89</div>
          <div className="text-[10px]" style={{ color: C.success }}>-14.2%</div>
        </div>
      </div>
    </div>
  );
}


// === SCREEN 5. APQP KANBAN ===
// PPAP Stage Kanban: Not Started → Requested → In Review → Submitted → Approved
// At scenario step >=7: Display Driver IC moves Requested → In Review
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
  { id: 10, partId: "6U8-HKJJ-JRPWM", name: "Mainboard 5G", supplier: "Aurora Foundry", supplierShort: "Aurora", risk: "High", ppapLevel: 3, stage: "review", dDay: 5, deliverableDone: 4, deliverableTotal: 6, comments: 8 },
  { id: 3, partId: "EI2-I6DA-003WB", name: "Display Driver IC AX-7421", supplier: "Triton Semiconductor", supplierShort: "Triton Semiconductor", risk: "Med", ppapLevel: 3, stage: "requested", dDay: 3, deliverableDone: 0, deliverableTotal: 6, comments: 14, isHero: true },
  // Med Risk
  { id: 6, partId: "1W6-4YP3-X6FU2", name: "Touch Controller IC", supplier: "Triton Semiconductor", supplierShort: "Triton Semiconductor", risk: "Med", ppapLevel: 2, stage: "review", dDay: 7, deliverableDone: 2, deliverableTotal: 4, comments: 3 },
  { id: 2, partId: "XYR-YZK5-WA1A7", name: "Display Module 6.7\"", supplier: "Aurora Display", supplierShort: "Aurora Disp", risk: "Med", ppapLevel: 3, stage: "submitted", dDay: 2, deliverableDone: 6, deliverableTotal: 6, comments: 5 },
  { id: 9, partId: "QE3-8DHV-XIRG8", name: "Fan Module", supplier: "Atlas Manufacturing", supplierShort: "Atlas Manufacturing", risk: "Med", ppapLevel: 2, stage: "submitted", dDay: 4, deliverableDone: 4, deliverableTotal: 4, comments: 2 },
  // Low Risk
  { id: 4, partId: "UEI-Y0ZL-7UU0W", name: "Polarizer Film", supplier: "Polaris Films", supplierShort: "Polaris", risk: "Low", ppapLevel: 2, stage: "approved", dDay: -3, deliverableDone: 4, deliverableTotal: 4, comments: 1 },
  { id: 5, partId: "5ML-DR7Q-2CV44", name: "OCA Adhesive", supplier: "Meridian", supplierShort: "Meridian", risk: "Low", ppapLevel: 2, stage: "approved", dDay: -1, deliverableDone: 4, deliverableTotal: 4, comments: 4 },
  // Not Started
  { id: 11, partId: "K8W-3FH-90PJ", name: "Battery Cell 5000mAh", supplier: "TBD", supplierShort: "TBD", risk: "High", ppapLevel: 3, stage: "notStarted", dDay: null, deliverableDone: 0, deliverableTotal: 6, comments: 0 },
  { id: 12, partId: "P5Q-2RT-78AB", name: "Camera Module 200MP", supplier: "Aurora Electro", supplierShort: "SEM", risk: "High", ppapLevel: 3, stage: "notStarted", dDay: null, deliverableDone: 0, deliverableTotal: 6, comments: 1 },
  // Additional approved
  { id: 13, partId: "M3K-9XL-44CD", name: "Speaker Module", supplier: "Acousta", supplierShort: "Acousta", risk: "Low", ppapLevel: 1, stage: "approved", dDay: -7, deliverableDone: 3, deliverableTotal: 3, comments: 0 },
];

function ApqpKanban({ scenarioStep, onOpenItem, setView, activeProjectCode }) {
  const project = PROJECTS.find((p) => p.code === activeProjectCode) || PROJECTS[0];

  // After scenario Step 8: Display Driver IC transitions requested → review
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
          <div className="text-base font-medium mb-2" style={{ color: C.textPrimary }}>
            APQP Not Started Yet
          </div>
          <div className="text-sm max-w-md mx-auto mb-6" style={{ color: C.textSecondary }}>
            Advanced Product Quality Planning begins once the BOM is established. PPAP tracking will appear here once parts are added to Q-BOM.
          </div>
          <div className="inline-flex items-center gap-2">
            <button
              onClick={() => setView && setView("bomlist")}
              className="px-4 py-2 rounded-md text-sm font-medium text-white inline-flex items-center gap-2 hover:opacity-90"
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
              <div className="text-[10px] font-medium tracking-wide" style={{ color: C.primary }}>
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
          <div className="flex justify-between text-[10px] tabular-nums mb-1 pl-44" style={{ color: C.textDisabled }}>
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
                          <div className="text-[10px] font-medium" style={{ color: color }}>
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
                  <div className="absolute -top-3 -left-4 text-[10px] font-medium px-1.5 py-0.5 rounded whitespace-nowrap"
                    style={{ backgroundColor: C.primary, color: "white" }}>
                    Today
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
            <div className="text-[10px] font-medium tracking-wide" style={{ color: C.textSecondary }}>
              Overall Progress
            </div>
            <div className="text-[32px] font-medium mt-1 tabular-nums" style={{ color: C.primary }}>
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
            <div className="text-[10px] font-medium tracking-wide" style={{ color: C.textSecondary }}>
              Subjects
            </div>
            <div className="text-base font-medium mt-0.5 tabular-nums" style={{ color: C.textPrimary }}>
              {totalSubjects} <span className="text-[12px] font-normal" style={{ color: C.textSecondary }}>total</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] font-medium tracking-wide" style={{ color: C.textSecondary }}>
              Approved
            </div>
            <div className="text-base font-medium mt-0.5 tabular-nums" style={{ color: C.success }}>
              {totalApproved} <span className="text-[12px] font-normal" style={{ color: C.textSecondary }}>/ {totalSubjects}</span>
            </div>
          </div>
          {overdue > 0 && (
            <div>
              <div className="text-[10px] font-medium tracking-wide" style={{ color: C.error }}>
                Overdue
              </div>
              <div className="text-base font-medium mt-0.5 tabular-nums" style={{ color: C.error }}>
                {overdue} <span className="text-[12px] font-normal">need action</span>
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
            <button className="px-3 py-1.5 rounded-md text-xs font-medium text-white inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
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
                  <div className="text-xs font-medium flex items-center gap-1.5" style={{ color: C.textPrimary }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                    {stage.label}
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: C.textSecondary }}>
                    {stage.desc}
                  </div>
                </div>
                <span className="text-[12px] font-medium px-2 py-0.5 rounded-full"
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
                          <div className="text-xs font-medium leading-snug" style={{ color: C.textPrimary }}>
                            {card.name}
                          </div>
                          <div className="text-[10px] tabular-nums mt-0.5" style={{ color: C.textDisabled }}>
                            {card.partId}
                          </div>
                        </div>

                        {/* Badges row — minimal: PPAP Lv (outlined neutral) + Risk text only when High */}
                        <div className="flex items-center gap-1 flex-wrap mb-2">
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded border"
                            style={{ backgroundColor: "white", color: C.textSecondary, borderColor: C.border }}>
                            PPAP Lv{card.ppapLevel}
                          </span>
                          {card.risk === "High" && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                              style={{ backgroundColor: C.errorLight, color: C.error }}>
                              High Risk
                            </span>
                          )}
                          {card.dDay !== null && card.stage !== "approved" && (isOverdue || isUrgent) && (
                            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded ml-auto"
                              style={{
                                backgroundColor: isOverdue ? C.error : C.warning,
                                color: "white",
                              }}>
                              {isOverdue ? `${Math.abs(card.dDay)}d overdue` : `D-${card.dDay}`}
                            </span>
                          )}
                          {card.dDay !== null && card.stage !== "approved" && !isOverdue && !isUrgent && (
                            <span className="text-[10px] font-medium ml-auto"
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
                            <span className="text-[10px]" style={{ color: C.textSecondary }}>
                              Deliverables
                            </span>
                            <span className="text-[10px] tabular-nums font-medium" style={{ color: C.textPrimary }}>
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
                            <span className="text-[10px]" style={{ color: C.textSecondary }}>
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
            <div className="font-medium mb-0.5" style={{ color: C.textPrimary }}>
              Scenario in progress — Display Driver IC PPAP moved to "In Review"
            </div>
            <div style={{ color: C.textSecondary }}>
              Lumina Display submitted Design Records and Process Flow (2/6 deliverables). Q-BOM auto-sync complete.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// === SCENARIO STEPS ===
// === DEMO SCENARIOS ===
// Single guided scenario presented as INTERACTIVE COLLABORATION SCENES. Each scene
// either advances on a real in-panel action (Compare button, View Item 360, Send) or
// on Next, revealing the thread one step at a time so the cross-functional review and
// hand-offs are concrete. Roles only - no person names.
// === FLOATING CAI DOCK ===
// Bottom-right segmented toggle: "Assist" (AI analysis popover) and "Create new" (+).
// The active segment shows its label; the inactive one collapses to an icon. Reference
// for the Create flow is adapted to CAIDENTIA's NPI/BOM/sourcing domain — not a copy of
// any third-party screen.
function AssistDock({ mode, setMode, onAction }) {
  const assistOpen = mode === "assist";
  // Single latest CAI message (current scenario: Display Driver IC second-source review).
  const NOTE = { icon: Sparkles, title: "Check the AI review for the Display Driver IC proposal", meta: "Smartphone NPI \u00b7 CAI analysis ready", tag: "New" };

  return (
    <>
      <style>{`@keyframes caiDockIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div className="fixed z-[55]" style={{ right: 24, bottom: 24 }}>
        {/* AI Assist message — black card, larger type */}
        {assistOpen && (
          <div className="mb-3 w-[360px] rounded-2xl overflow-hidden cursor-pointer"
            onClick={onAction}
            style={{ backgroundColor: "#171717", boxShadow: "0 12px 32px rgba(0,0,0,0.32)", animation: "caiDockIn .18s ease-out" }}>
            <div className="px-4 py-3.5">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>AI Assist</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: C.primary, color: "#fff" }}>{NOTE.tag}</span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setMode(null); }} className="p-0.5 -mr-1 rounded shrink-0 transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2" style={{ color: "rgba(255,255,255,0.6)" }} title="Dismiss"><X className="w-3.5 h-3.5" /></button>
              </div>
              <div className="text-[14px] font-medium leading-snug" style={{ color: "#fff" }}>{NOTE.title}</div>
              <div className="text-[12px] mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>{NOTE.meta}</div>
            </div>
          </div>
        )}

        {/* Single circular AI button (black) */}
        <div className="flex justify-end">
          <button onClick={() => setMode(assistOpen ? null : "assist")}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2"
            style={{ backgroundColor: "#171717", color: "#fff", boxShadow: "0 10px 24px rgba(16,24,40,0.28)" }}
            title="CAI Assist">
            <Sparkles className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );
}


// Pre-filled template chooser — opens after picking a Create option. Adapted to CAIDENTIA.
function TemplateDialog({ type, onClose, onBack }) {
  const TABS = ["Suggested", "Favorites", "Recent"];
  const [tab, setTab] = useState(0);
  const [sel, setSel] = useState(-1);
  const TEMPLATES = [
    { icon: FileText, title: "Quick Bid for Automotive Consumables", sub: "Closed bidding with top-rated suppliers" },
    { icon: Package, title: "Spot Purchase for Maintenance Materials", sub: "Fast one round bidding for urgent or ad hoc material needs" },
    { icon: Send, title: "Local Supplier Sourcing", sub: "Invite nearby suppliers for faster delivery" },
    { icon: Network, title: "Strategic Quote for New Project", sub: "Qualified suppliers invited based on technical capability and recent project history" },
  ];
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4" style={{ backgroundColor: "rgba(16,24,40,0.45)" }} onClick={onClose}>
      <style>{`@keyframes caiDlgIn{from{opacity:0;transform:translateY(10px) scale(.99)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
      <div className="w-full max-w-[560px] rounded-2xl bg-white overflow-hidden" style={{ boxShadow: "0 24px 64px rgba(16,24,40,0.30)", animation: "caiDlgIn .18s ease-out" }} onClick={(e) => e.stopPropagation()}>
        <div className="px-6 pt-6 pb-4 flex items-start">
          <div className="text-[18px] font-semibold" style={{ color: C.textPrimary }}>Start faster with a pre-filled template?</div>
          <button onClick={onClose} className="ml-auto p-1 rounded hover:bg-gray-100" style={{ color: C.textSecondary }}><X className="w-5 h-5" /></button>
        </div>
        <div className="px-6">
          <div className="rounded-xl px-4 py-3 flex items-center" style={{ backgroundColor: C.surfaceTinted }}>
            <div className="min-w-0">
              <div className="text-[13px] font-semibold" style={{ color: C.textPrimary }}>{type.title}</div>
              <div className="text-[11px]" style={{ color: C.textSecondary }}>{type.sub}</div>
            </div>
            <button onClick={onBack} className="ml-auto inline-flex items-center gap-1.5 text-[12px] font-medium hover:opacity-80" style={{ color: C.textSecondary }}>
              <RotateCcw className="w-3.5 h-3.5" /> Change
            </button>
          </div>
        </div>
        <div className="px-6 pt-4 flex items-center gap-2">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium"
              style={i === tab ? { backgroundColor: C.primaryLight, color: C.primary } : { color: C.textSecondary }}>
              {i === 0 && <Sparkles className="w-3.5 h-3.5" />}{t}
            </button>
          ))}
        </div>
        <div className="px-6 pt-3 pb-2 space-y-2 max-h-[320px] overflow-auto">
          {TEMPLATES.map((tp, i) => (
            <button key={i} onClick={() => setSel(i)} className="w-full text-left rounded-xl px-4 py-3 flex items-start gap-3 transition-colors"
              style={i === sel ? { backgroundColor: C.primarySoft, border: `1.5px solid ${C.primary}` } : { backgroundColor: C.surfaceTinted, border: "1.5px solid transparent" }}>
              <tp.icon className="w-5 h-5 mt-0.5 shrink-0" style={{ color: i === sel ? C.primary : C.textSecondary }} />
              <div className="min-w-0">
                <div className="text-[13px] font-semibold" style={{ color: C.textPrimary }}>{tp.title}</div>
                <div className="text-[12px]" style={{ color: C.textSecondary }}>{tp.sub}</div>
              </div>
            </button>
          ))}
        </div>
        <div className="px-6 py-4 flex items-center justify-end gap-3" style={{ borderTop: `1px solid ${C.borderLight}` }}>
          <button onClick={onClose} className="text-[13px] font-medium px-2 hover:opacity-80" style={{ color: C.textSecondary }}>Cancel</button>
          <button onClick={onClose} className="text-[13px] font-medium px-4 py-2 rounded-full border hover:bg-gray-50" style={{ borderColor: C.primary, color: C.primary }}>Create from Scratch</button>
          <button onClick={onClose} className="text-[13px] font-semibold px-4 py-2 rounded-full text-white inline-flex items-center gap-1.5 hover:opacity-90" style={{ backgroundColor: C.primary }}>
            <Check className="w-4 h-4" /> Create
          </button>
        </div>
      </div>
    </div>
  );
}

const DEMO_SCENARIOS = [
  {
    id: "evaluate-supplier-alt",
    title: "Evaluate Supplier-Proposed Alternative Part",
    headline: "BOM collaboration & cross-functional review — triggered by a supplier's alternative-part proposal",
    flow: "Supplier proposal \u2192 CAI decision card \u2192 Cost / Sourcing / Quality agree \u2192 PM approves \u2192 resolved",
    steps: [
      { persona: "DE", view: "projects", assist: true, scenarioStep: 6,
        head: "CAI flags an AI review",
        desc: "Even before you start, the floating CAI button (bottom-right) is already showing its AI analysis. Pick \u201CCheck the AI review for the Display Driver IC proposal\u201D \u2014 Triton Semiconductor has proposed an alternative second-source part and CAI's analysis is ready. Click it (or Next) to dive in." },
      { persona: "DE", view: "bom", itemId: 3, bom: "E", panelTab: "chat", reveal: 1, scenarioStep: 6, compose: true,
        head: "Supplier proposal arrives",
        desc: "Triton Semiconductor sends an alternative display driver IC (TX-6620 · 120Hz · drop-in COF, shorter lead time). DE reviews CAI's substitution analysis, then picks suggestion 1 above the composer \u2014 \u201CCreate a review decision card\u201D \u2014 to send it to Cost, Sourcing, and Quality. Click Next." },
      { persona: "CM", view: "bom", itemId: 3, bom: "C", panelTab: "chat", reveal: 1, scenarioStep: 6,
        head: "Cost Manager reviews",
        desc: "As Cost Manager, CAI shows the cost lens ($11.80 vs the $11.80 target). On the decision card, click Agree (or add an opinion). The card hands off to Sourcing." },
      { persona: "SM", view: "bom", itemId: 3, bom: "C", panelTab: "chat", reveal: 1, scenarioStep: 6,
        head: "Sourcing Manager reviews",
        desc: "As Sourcing Manager, CAI shows the supply lens (Triton qualified, lead 14\u219210 wks, low risk). Click Agree on the decision card to hand off to Quality." },
      { persona: "QM", view: "bom", itemId: 3, bom: "Q", panelTab: "chat", reveal: 1, scenarioStep: 6,
        head: "Quality Manager reviews",
        desc: "As Quality Manager, CAI shows the quality lens (PPAP Lv3 + 120 Hz MIPI re-validation). Add the opinion or click Agree \u2014 once all three clear, it routes to the PM." },
      { persona: "PM", view: "bom", itemId: 3, bom: "E", panelTab: "chat", reveal: 1, scenarioStep: 8,
        head: "PM receives & approves",
        desc: "All reviewers have cleared on the decision card. PM presses Approve evaluation build \u2014 the change resolves: the Display Driver's red review badge clears to On track (TX-6620) and a confirmation toast appears." },
    ],
  },
];

// === DEMO CONTROL BAR ===
// Floating control strip pinned ABOVE the GNB (its own dark layer, visually separate
// from the product chrome). Drives the seven guided scenarios with Back / Next, which
// walk step-by-step and roll across scenario boundaries. Reset exits to the project list.
function DemoBar({ scenarios, active, idx, step, onStart, onPrev, onNext, onReset, atStart, atEnd }) {
  const sc = scenarios[idx] || scenarios[0];
  const steps = sc.steps;
  const cur = active ? steps[step] : null;
  const isSystem = !!(cur && cur.system);
  const persona = cur && !cur.system ? PERSONAS[cur.persona] : null;

  // Dark-layer palette — deliberately distinct from the white app below.
  const BAR = "#0b1220";
  const LINE = "rgba(255,255,255,0.14)";
  const FG = "#ffffff";
  const MUTED = "rgba(255,255,255,0.55)";

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] px-6 flex items-center gap-4"
      style={{ height: 52, backgroundColor: BAR, boxShadow: "0 4px 16px rgba(11,18,32,0.35)" }}>
      {/* DEMO badge */}
      <span className="text-[10px] font-bold tracking-wider px-2 rounded shrink-0 inline-flex items-center"
        style={{ backgroundColor: C.primary, color: "#fff", height: 26 }}>
        DEMO
      </span>

      {/* Live step narrative (role only — no person names) */}
      <div className="flex-1 min-w-0 flex items-center gap-2.5">
        {active && persona ? (
          <>
            <span className="shrink-0 inline-flex items-center gap-1.5 pr-2.5 rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.16)", height: 26, paddingLeft: 3, boxShadow: "0 0 0 1px rgba(255,255,255,0.15) inset" }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                style={{ backgroundColor: persona.color, color: "#fff" }}>
                {cur.persona}
              </span>
              <span className="text-[12px] font-bold whitespace-nowrap" style={{ color: "#fff" }}>{persona.role}</span>
            </span>
            <span className="shrink-0" style={{ color: MUTED }}>·</span>
            <span className="text-[13px] truncate" style={{ color: "rgba(255,255,255,0.88)" }} title={cur.desc}>
              {cur.head ? <span className="font-medium" style={{ color: "#fff" }}>{cur.head}: </span> : null}
              {cur.desc}
            </span>
          </>
        ) : active && isSystem ? (
          <>
            <span className="shrink-0 inline-flex items-center gap-1.5 pr-2.5 rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.16)", height: 26, paddingLeft: 3, boxShadow: "0 0 0 1px rgba(255,255,255,0.15) inset" }}>
              <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: "rgba(255,255,255,0.18)", color: "#fff" }}>
                <Zap className="w-3 h-3" />
              </span>
              <span className="text-[12px] font-bold whitespace-nowrap" style={{ color: "#fff" }}>System</span>
            </span>
            <span className="shrink-0" style={{ color: MUTED }}>·</span>
            <span className="text-[13px] truncate" style={{ color: "rgba(255,255,255,0.88)" }} title={cur.desc}>
              {cur.head ? <span className="font-medium" style={{ color: "#fff" }}>{cur.head}: </span> : null}
              {cur.desc}
            </span>
          </>
        ) : (
          <span className="text-[13px] truncate" style={{ color: "#fff" }} title={sc.headline}>
            {sc.headline}
          </span>
        )}
      </div>

      {/* Right cluster: step indicator + controls */}
      <div className="flex items-center gap-3 shrink-0">
        {active && (
          <span className="text-[12px] tabular-nums shrink-0" style={{ color: MUTED }}>
            {step + 1}/{steps.length}
          </span>
        )}

        {active && (
          <button onClick={onReset} title="Reset demo"
            className="w-8 h-8 rounded-md flex items-center justify-center transition-colors hover:bg-white/10"
            style={{ color: MUTED }}>
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        <button onClick={onPrev} disabled={!active || atStart}
          className="h-8 px-2.5 rounded-md flex items-center gap-1 text-[13px] font-medium border transition-colors disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:bg-white/10"
          style={{ borderColor: LINE, color: FG }}>
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {active ? (
          <button onClick={onNext} disabled={atEnd}
            className="h-8 px-3 rounded-md flex items-center gap-1 text-[13px] font-semibold text-white transition-opacity disabled:opacity-30 disabled:cursor-not-allowed enabled:hover:opacity-90"
            style={{ backgroundColor: C.primary }}>
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={onStart}
            className="h-8 px-3 rounded-md flex items-center gap-1.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: C.primary }}>
            <Play className="w-3.5 h-3.5" />
            Start
          </button>
        )}
      </div>
    </div>
  );
}

// === ROOT APP ===
function CaidentiaApp() {
  const [activePersona, setActivePersona] = useState("PM");
  const [view, setView] = useState("projects");
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [scenarioStep, setScenarioStep] = useState(0);
  // Demo walkthrough state: which of the 7 scenarios, and which step within it.
  const [demoActive, setDemoActive] = useState(false);
  const [demoIdx, setDemoIdx] = useState(0);
  const [demoStep, setDemoStep] = useState(0);
  // Drives the collaboration panel during the demo: which right-panel tab to show and
  // how many thread entries to reveal so the conversation unfolds one scene per Next.
  const [demoReveal, setDemoReveal] = useState(null);
  const [demoPanelTab, setDemoPanelTab] = useState(null);
  const [activeProjectCode, setActiveProjectCode] = useState(ACTIVE_PROJECT_CODE);
  const [notifOpen, setNotifOpen] = useState(false);
  const [dockMode, setDockMode] = useState("assist"); // floating dock: "assist" | "create" | null — assist open on first landing, before Start
  const [createType, setCreateType] = useState(null);  // selected create option -> opens the template dialog
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
      bom: activeBom, // which BOM the user was viewing — preselect this perspective in chat
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

  // Apply the current demo step to the live app (persona / view / part / BOM / tab).
  // Runs only while the demo is active. Skips initial mount so the app opens on the
  // Project List; pressing Start (or Next) activates and applies scenario 1, step 1.
  const isFirstMount = useRef(true);
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    if (!demoActive) return;
    const sc = DEMO_SCENARIOS[demoIdx];
    const step = sc && sc.steps[demoStep];
    if (!step) return;
    setActiveProjectCode(ACTIVE_PROJECT_CODE);
    if (step.persona) setActivePersona(step.persona);
    setView(step.view);
    setActiveBom(step.bom || defaultBomForPersona(step.persona || activePersona));
    if (step.itemId !== undefined) setSelectedItemId(step.itemId);
    else if (step.view === "cockpit") setSelectedItemId(null);
    if (step.tab) setPendingDetailTab(step.tab);
    setDemoPanelTab(step.panelTab || null);
    setDemoReveal(step.reveal !== undefined ? step.reveal : null);
    setScenarioStep(step.scenarioStep !== undefined ? step.scenarioStep : 8);
    setNotifOpen(!!step.notif); // (legacy) bell popover
    setDockMode(step.assist ? "assist" : null); // floating AI-analysis popover opens on the entry scene
  }, [demoActive, demoIdx, demoStep]);

  // Start the demo at the currently selected scenario, step 1.
  const onStartDemo = () => {
    setDemoStep(0);
    setDemoActive(true);
  };
  // Clicking the actionable CAI Assist suggestion enters the supplier-proposal scenario
  // straight at the chat scene (works whether or not the demo is already running).
  const onAssistAction = () => {
    setDockMode(null);
    setDemoActive(true);
    setDemoIdx(0);
    setDemoStep(1);
  };
  // Step back — rolls into the previous scenario's last step; backing out of (0,0) exits.
  const onPrevStep = () => {
    if (!demoActive) return;
    if (demoStep > 0) {
      setDemoStep(demoStep - 1);
    } else if (demoIdx > 0) {
      const prev = demoIdx - 1;
      setDemoIdx(prev);
      setDemoStep(DEMO_SCENARIOS[prev].steps.length - 1);
    } else {
      onResetDemo();
    }
  };
  // Step forward — rolls into the next scenario's first step; clamps at the very end.
  const onNextStep = () => {
    if (!demoActive) { onStartDemo(); return; }
    const lastStep = DEMO_SCENARIOS[demoIdx].steps.length - 1;
    if (demoStep < lastStep) {
      setDemoStep(demoStep + 1);
    } else if (demoIdx < DEMO_SCENARIOS.length - 1) {
      setDemoIdx(demoIdx + 1);
      setDemoStep(0);
    }
  };
  // Jump directly to a scenario (step 1). Activates the demo if it wasn't already.
  const onJumpScenario = (i) => {
    setDemoIdx(i);
    setDemoStep(0);
    setDemoActive(true);
  };
  // Exit the demo and return to the Project List.
  const onResetDemo = () => {
    setDemoActive(false);
    setDemoIdx(0);
    setDemoStep(0);
    setDemoReveal(null);
    setDemoPanelTab(null);
    setView("projects");
    setSelectedItemId(null);
  };

  const demoAtStart = demoIdx === 0 && demoStep === 0;
  const demoAtEnd =
    demoIdx === DEMO_SCENARIOS.length - 1 &&
    demoStep === DEMO_SCENARIOS[DEMO_SCENARIOS.length - 1].steps.length - 1;

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
        onResetDemo();
      } else if (e.key === "Escape") {
        if (chatOpen) {
          e.preventDefault();
          setChatOpen(false);
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [demoActive, demoIdx, demoStep, chatOpen]);

  // Pending tab — when a caller (e.g. DE Overview "Review Fit") wants the detail panel
  // to land on a specific tab instead of the default Spec. Consumed once on detail open.
  const [pendingDetailTab, setPendingDetailTab] = useState(null);

  const onOpenItem = (id, bom, opts) => {
    if (bom) setActiveBom(bom);
    if (opts && opts.tab) setPendingDetailTab(opts.tab);
    setSelectedItemId(id);
    setView("bom");
  };

  const activeProject = PROJECTS.find((p) => p.code === activeProjectCode) || PROJECTS[0];

  return (
    <div className="min-h-screen" style={{ backgroundColor: C.bg, fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', paddingTop: 52 }}>
      <DemoBar
        scenarios={DEMO_SCENARIOS}
        active={demoActive}
        idx={demoIdx}
        step={demoStep}
        onStart={onStartDemo}
        onPrev={onPrevStep}
        onNext={onNextStep}
        onReset={onResetDemo}
        atStart={demoAtStart}
        atEnd={demoAtEnd}
      />

      <GNB
        activePersona={activePersona}
        setActivePersona={setActivePersona}
        view={view}
        setView={setView}
        scenarioStep={scenarioStep}
        activeProjectCode={activeProjectCode}
        setActiveProjectCode={setActiveProjectCode}
        notifOpen={notifOpen}
        setNotifOpen={setNotifOpen}
        demoNotif={demoActive && !!((DEMO_SCENARIOS[demoIdx].steps[demoStep] || {}).notif)}
        onDemoNotifClick={onNextStep}
      />

      {view === "projects" && (
        <ProjectList
          activeProjectCode={activeProjectCode}
          setActiveProjectCode={setActiveProjectCode}
          setView={setView}
        />
      )}

      {/* Floating CAI assist button — product affordance + demo entry (project landing) */}
      {view === "projects" && (
        <AssistDock
          mode={dockMode}
          setMode={setDockMode}
          onAction={onAssistAction}
        />
      )}
      {createType && (
        <TemplateDialog
          type={createType}
          onClose={() => setCreateType(null)}
          onBack={() => { setCreateType(null); setDockMode("create"); }}
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
            style={{ backgroundColor: C.bg, height: "calc(100vh - 136px)" }}>
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
              <div className="bg-white rounded-r-2xl overflow-hidden shrink-0 flex flex-col">
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
                  setSelectedItemId={setSelectedItemId}
                />
              </div>

              {/* RIGHT: Content area — Overview is transparent (widgets are their own cards); other views use a white card */}
              <div className={`flex-1 min-w-0 flex flex-col overflow-hidden ${view === "cockpit" ? "" : "bg-white rounded-l-2xl"}`}>
                <div className="flex-1 min-h-0 overflow-y-auto">
                  {/* Screen title (from LNB menu) — Heading 4 (20px), 24px padding all sides */}
                  {(() => {
                    const SCREEN_TITLES = {
                      info: "Project Info",
                      // "collaborators" renders its own title row (with actions) inside the screen.
                      // "cockpit" (Overview) renders its own content with no title row.
                      // "bomlist" & "bom" render their own title rows inside their screens.
                    };
                    const screenTitle = SCREEN_TITLES[view];
                    if (!screenTitle) return null;
                    return (
                      <div className="p-6 pb-0">
                        <h1 className="text-[20px] font-medium" style={{ color: C.textPrimary }}>{screenTitle}</h1>
                      </div>
                    );
                  })()}
                  {view === "cockpit" && (
                    <ProjectCockpit
                      onOpenItem={onOpenItem}
                      scenarioStep={scenarioStep}
                      activeProjectCode={activeProjectCode}
                      setView={setView}
                      activePersona={activePersona}
                      setActiveBom={setActiveBom}
                      setSelectedItemId={setSelectedItemId}
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
                      pendingDetailTab={pendingDetailTab}
                      onPendingDetailTabConsumed={() => setPendingDetailTab(null)}
                      demoReveal={demoReveal}
                      demoPanelTab={demoPanelTab}
                      demoStepKey={demoActive ? `${demoIdx}:${demoStep}` : null}
                      demo={demoActive ? (() => { const st = DEMO_SCENARIOS[demoIdx].steps[demoStep] || {}; return { active: true, sceneIdx: demoStep, advance: onNextStep, prefill: st.composerPrefill || null, panelTab: st.panelTab || null, reveal: st.reveal !== undefined ? st.reveal : null, revealSent: st.revealSent !== undefined ? st.revealSent : null, item360: st.item360 || null, compose: !!st.compose }; })() : null}
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

// === PASSWORD GATE ===
// Soft access lock for the prototype. NOTE: this is a client-side gate — it keeps
// casual viewers out, but the password lives in the bundle and is not real security.
function PasswordGate({ onUnlock }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const PASSWORD = "2026";

  const submit = () => {
    if (value === PASSWORD) {
      setError(false);
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6"
      style={{ backgroundColor: C.bg }}>
      <div className="w-full max-w-[380px]">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-[18px] font-medium" style={{ color: C.textPrimary }}>SAMSUNG SDS</span>
          <span className="text-[18px] font-medium" style={{ color: C.primary }}>Caidentia</span>
        </div>

        {/* Card */}
        <div className="rounded-2xl border bg-white p-8" style={{ borderColor: C.border }}>
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: C.primaryLight }}>
              <Lock className="w-5 h-5" style={{ color: C.primary }} />
            </div>
            <h1 className="text-[20px] font-medium" style={{ color: C.textPrimary }}>
              Protected prototype
            </h1>
            <p className="text-[14px] mt-1.5" style={{ color: C.textSecondary }}>
              Enter the password to continue.
            </p>
          </div>

          {/* Password field */}
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={value}
              autoFocus
              onChange={(e) => { setValue(e.target.value); if (error) setError(false); }}
              onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
              placeholder="Password"
              className="w-full h-11 pl-3 pr-10 rounded-lg border text-[14px] outline-none transition-colors focus:outline-none"
              style={{
                borderColor: error ? C.error : C.border,
                color: C.textPrimary,
                backgroundColor: "white",
              }}
              onFocus={(e) => { if (!error) e.currentTarget.style.borderColor = C.primary; }}
              onBlur={(e) => { if (!error) e.currentTarget.style.borderColor = C.border; }} />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded hover:bg-gray-50 focus:outline-none focus-visible:ring-2"
              style={{ color: C.textSecondary }}
              title={show ? "Hide password" : "Show password"}>
              <Eye className="w-4 h-4" />
            </button>
          </div>

          {error && (
            <p className="text-[12px] mt-2" style={{ color: C.error }}>
              Incorrect password. Please try again.
            </p>
          )}

          {/* Unlock button */}
          <button
            onClick={submit}
            className="w-full h-11 mt-4 rounded-lg text-[14px] font-medium text-white flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{ backgroundColor: C.primary }}>
            Unlock
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[12px] text-center mt-5" style={{ color: C.textDisabled }}>
          For authorized reviewers only.
        </p>
      </div>
    </div>
  );
}

// === ROOT — password gate wraps the prototype ===
// To re-enable the password lock before deploy, set the value below to true.
const PASSWORD_GATE_ENABLED = true;

export default function App() {
  const [unlocked, setUnlocked] = useState(false);
  if (PASSWORD_GATE_ENABLED && !unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }
  return <CaidentiaApp />;
}
