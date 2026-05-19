import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Bell, Search, User, Settings, ChevronDown, ChevronRight, ChevronLeft,
  Package, GitBranch, DollarSign, Send, ShieldCheck, Building2, Users,
  AlertTriangle, AlertCircle, CheckCircle, XCircle, Clock, Filter,
  Plus, MoreHorizontal, MessageSquare, Sparkles, TrendingUp, TrendingDown,
  ArrowRight, Hash, Paperclip, AtSign, Smile, Layers, FileText, Zap,
  Eye, Edit3, Activity, Box, Target, BarChart3, ShoppingCart, FlaskConical,
  Network, ListChecks, ChevronsRight, X, Info, Play, RefreshCw, Inbox, PlusCircle, AlignLeft, Circle,
  CornerDownRight, Columns3, Upload, Link2,
  LayoutDashboard, Boxes, GitMerge, BadgeCheck, PanelLeftClose, PanelLeftOpen,
  Smartphone, Watch, Headphones, Tv, Tablet, Speaker, Refrigerator, Wind, BatteryCharging,
  History, GitCompareArrows
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
    type: "New To The Company", phase: "Develop", phaseDays: 23, readiness: 65, blocking: 4,
    pm: "PM", ownerName: "Paige Kim", collaborators: 5,
    suppliers: 8, items: 80, tmcGap: 8.5, lastUpdate: "2026/04/30", priority: "high" },
  { code: "BPM260400353", name: "NPI Project_Galaxy Watch 7", product: "SmartWatch G7",
    type: "Major Enhancement", phase: "Plan", phaseDays: 45, readiness: 68, blocking: 1,
    pm: "PM", ownerName: "Paige Wong", collaborators: 4,
    suppliers: 6, items: 42, tmcGap: -2.4, lastUpdate: "2026/04/29", priority: "high" },
  { code: "BPM260400352", name: "Galaxy Buds Pro 4 Refresh", product: "Earbuds B4",
    type: "Minor Enhancement", phase: "SOP", phaseDays: 8, readiness: 95, blocking: 0,
    pm: "PM", ownerName: "Paige Kim", collaborators: 3,
    suppliers: 4, items: 28, tmcGap: -1.2, lastUpdate: "2026/04/30", priority: "med" },
  { code: "BPM260400351", name: "Smart TV QN90D 75\"", product: "TV Q90",
    type: "Major Enhancement", phase: "Develop", phaseDays: 67, readiness: 72, blocking: 2,
    pm: "QM", ownerName: "Quinn Rodriguez", collaborators: 6,
    suppliers: 12, items: 156, tmcGap: 5.8, lastUpdate: "2026/04/28", priority: "med" },
  { code: "BPM260400350", name: "Foldable Z Fold 7", product: "Foldable F7",
    type: "New To The World", phase: "Define", phaseDays: 92, readiness: 54, blocking: 3,
    pm: "DE", ownerName: "Dean Park", collaborators: 7,
    suppliers: 9, items: 105, tmcGap: 28.4, lastUpdate: "2026/04/30", priority: "high" },
  { code: "BPM260400349", name: "NPI Project_Samsung Smartphone #1", product: "Smartphone S1",
    type: "Major Enhancement", phase: "Develop", phaseDays: 31, readiness: 81, blocking: 1,
    pm: "PM", ownerName: "Pete Hayes", collaborators: 4,
    suppliers: 7, items: 76, tmcGap: 2.1, lastUpdate: "2026/04/27", priority: "med" },
  { code: "BPM260400348", name: "Wireless Charger 25W", product: "Charger C25",
    type: "Minor Enhancement", phase: "Concept", phaseDays: 134, readiness: 32, blocking: 0,
    pm: "CM", ownerName: "Cory Chen", collaborators: 2,
    suppliers: 3, items: 18, tmcGap: 0, lastUpdate: "2026/04/22", priority: "low" },
  { code: "BPM260400347", name: "Tablet Tab S10 Ultra", product: "Tablet T10",
    type: "Major Enhancement", phase: "Plan", phaseDays: 58, readiness: 64, blocking: 2,
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
  { persona: "PM", role: "Project Manager", active: "now", contribution: 28, owner: true },
  { persona: "DE", role: "Design Engineer", active: "5 min ago", contribution: 47, owner: false },
  { persona: "CM", role: "Cost Manager", active: "2 hours ago", contribution: 32, owner: false },
  { persona: "SM", role: "Sourcing Manager", active: "Yesterday", contribution: 24, owner: false },
  { persona: "QM", role: "Quality Manager", active: "3 hours ago", contribution: 18, owner: false },
];

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
  S: [
    { id: "s1", date: "Today, May 18", time: "2:15 PM", title: "RFQ sent: AMOLED Panel",
      kind: "primary", iconType: "send", author: "SM", detail: "3 suppliers: Samsung Display, BOE, LG Display." },
    { id: "s2", date: "Today, May 18", time: "11:08 AM", title: "Supplier selection requested by CM",
      kind: "primary", iconType: "message", author: "CM", detail: "Should-cost confirmed at $41.80." },
    { id: "s3", date: "May 17", time: "4:30 PM", title: "Pre-qualification updated",
      kind: "success", iconType: "check", author: "SM", detail: "BOE Technology added to qualified vendor list." },
    { id: "s4", date: "May 15", time: "10:22 AM", title: "Conflict resolved: Polarizer dual-source",
      kind: "success", iconType: "check", author: "SM", detail: "Nitto Denko (primary) + LG Chem (secondary) approved." },
    { id: "s5", date: "May 13", time: "3:00 PM", title: "Conflict detected: Polarizer single-source",
      kind: "error", iconType: "alert", author: "QM", detail: "QM flagged: single-source risk on critical part." },
    { id: "s6", date: "May 12", time: "9:45 AM", title: "v1.5 created from E-BOM sync",
      kind: "neutral", iconType: "version", author: "SM", detail: "60 of 84 parts have suppliers assigned." },
  ],
  Q: [
    { id: "q1", date: "Today, May 18", time: "2:22 PM", title: "PPAP Lv3 assigned: AMOLED Panel → BOE",
      kind: "primary", iconType: "shield", author: "QM", detail: "Risk Assessment auto-completed. Medium risk." },
    { id: "q2", date: "Today, May 18", time: "8:45 AM", title: "Q-BOM auto-sync confirmed",
      kind: "success", iconType: "check", author: "QM", detail: "Synced from S-BOM v1.7." },
    { id: "q3", date: "May 17", time: "1:15 PM", title: "PFMEA draft updated",
      kind: "neutral", iconType: "upload", author: "QM", detail: "Display Module bonding process — Critical entry added." },
    { id: "q4", date: "May 15", time: "11:30 AM", title: "PPAP Lv2 approved: OCA Adhesive",
      kind: "success", iconType: "check", author: "QM", detail: "3M OCA — UV 1000h test passed." },
    { id: "q5", date: "May 12", time: "10:00 AM", title: "v1.3 created",
      kind: "neutral", iconType: "version", author: "QM", detail: "Synced from E-BOM v1.8." },
  ],
  C: [
    { id: "c1", date: "Today, May 18", time: "2:35 PM", title: "BOE quote applied: $38.90",
      kind: "success", iconType: "check", author: "CM", detail: "Best of 3 quotes. Δ vs Should-cost: -$2.90." },
    { id: "c2", date: "Today, May 18", time: "11:08 AM", title: "Should-cost analysis: AMOLED Panel",
      kind: "primary", iconType: "zap", author: "CM", detail: "$41.80 confirmed. Market: $42.50." },
    { id: "c3", date: "May 17", time: "5:42 PM", title: "Cost target locked: $38.00",
      kind: "primary", iconType: "shield", author: "CM", detail: "Approved by PM." },
    { id: "c4", date: "May 15", time: "9:30 AM", title: "Polarizer savings: $0.05/unit",
      kind: "success", iconType: "check", author: "CM", detail: "Nitto Denko price reduced $1.80 → $1.75." },
    { id: "c5", date: "May 13", time: "2:00 PM", title: "Cost rollup completed",
      kind: "neutral", iconType: "upload", author: "CM", detail: "v2.1 cost rollup: $42.30 total BOM cost." },
    { id: "c6", date: "May 10", time: "11:15 AM", title: "v2.1 created",
      kind: "neutral", iconType: "version", author: "CM", detail: "Synced from E-BOM v2.0." },
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
  S: { current: "v1.7", previous: "v1.5",
    added: [{ partId: "SUPPLIER-BOE", name: "BOE Technology (AMOLED Panel)", reason: "Added via RFQ" }],
    modified: [{ partId: "UEI-Y0ZL-7UU0W", name: "Polarizer Film", change: "Single-source → Dual-source (added LG Chem)" }],
    removed: [],
  },
  Q: { current: "v1.4", previous: "v1.3",
    added: [{ partId: "PPAP-AMOLED", name: "AMOLED Panel PPAP Lv3", reason: "Medium risk auto-assigned" }],
    modified: [{ partId: "5ML-DR7Q-2CV44", name: "OCA Adhesive", change: "PPAP Lv2 → Approved" }],
    removed: [],
  },
  C: { current: "v2.2", previous: "v2.1",
    added: [],
    modified: [
      { partId: "EQQ-MWS6-XAG2D", name: "AMOLED Panel", change: "Quoted: — → $38.90 (BOE)" },
      { partId: "UEI-Y0ZL-7UU0W", name: "Polarizer Film", change: "Quoted: $1.80 → $1.75" },
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
  { id: 2, ts: "Today 11:30", bomId: "S", action: "Supplier Awarded",
    actor: "SM", detail: "BOE Technology awarded ($38.90/EA)", version: "v2.1" },
  { id: 3, ts: "Today 09:15", bomId: "C", action: "Should-cost Updated",
    actor: "CM", detail: "AMOLED Panel: $41.80 (AI recommended)", version: "v2.0" },
  { id: 4, ts: "Yesterday 16:42", bomId: "S", action: "Sync Notification",
    actor: "SM", detail: "AMOLED Panel added in E-BOM → S-BOM needs supplier selection", version: "v2.1" },
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
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 2,
    children: [2, 9, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110],
    supplier: "Internal", ppap: "Lv1", category: "Final Assembly", risk: "Low" },

  // ============================================================
  // Level 2 — Display Module branch (id 2-8)
  // ============================================================
  { id: 2, lvl: 2, partId: "XYR-YZK5-WA1A7", desc: "ASSY,DISPLAY MODULE,6.7IN,AMOLED", type: "ASSM",
    status: { D: "warn", C: "warn", S: "warn", Q: "warn" }, comments: 8, children: [3, 7, 8],
    supplier: "Samsung Display", ppap: "Lv3", category: "Display", risk: "Med" },
  { id: 3, lvl: 3, partId: "EI2-I6DA-003WB", desc: "PANEL,AMOLED,6.7IN,FHD+,120HZ", type: "MISC",
    status: { D: "warn", C: "block", S: "progress", Q: "block" }, comments: 14, isHero: true,
    diff: "added", children: [4, 5, 6],
    supplier: "BOE Technology", ppap: "Lv3", category: "Display", risk: "Med" },
  { id: 4, lvl: 4, partId: "UEI-Y0ZL-7UU0W", desc: "FILM,POLARIZER,FRONT,6.7IN", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Nitto Denko", ppap: "Lv2", category: "Display", risk: "Low" },
  { id: 5, lvl: 4, partId: "5ML-DR7Q-2CV44", desc: "FILM,OCA,OPTICAL CLEAR ADHESIVE,6.7IN", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "3M", ppap: "Lv2", category: "Display", risk: "Low" },
  { id: 6, lvl: 4, partId: "1W6-4YP3-X6FU2", desc: "IC,TOUCH CONTROLLER,I2C", type: "CMDTY",
    status: { D: "ok", C: "warn", S: "ok", Q: "ok" }, comments: 3, children: [],
    supplier: "Synaptics", ppap: "Lv2", category: "Display", risk: "Low" },
  { id: 7, lvl: 3, partId: "GL2-7HKR-WA1Z3", desc: "GLASS,COVER,GORILLA VICTUS 2,6.7IN", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 2, children: [],
    supplier: "Corning", ppap: "Lv2", category: "Display", risk: "Low" },
  { id: 8, lvl: 3, partId: "BR3-9PLK-DR4N5", desc: "BRACKET,DISPLAY,ALUMINUM,6.7IN", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Catcher Technology", ppap: "Lv1", category: "Display", risk: "Low" },

  // ============================================================
  // Level 2 — Fan / Cooling branch (id 9-12)
  // ============================================================
  { id: 9, lvl: 2, partId: "QE3-8DHV-XIRG8", desc: "ASSY,FAN MODULE,SMARTPHONE COOLING", type: "ASSM",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 1, children: [11, 12],
    supplier: "Foxconn", ppap: "Lv2", category: "Mechanical", risk: "Low" },
  { id: 11, lvl: 3, partId: "VC1-4JTH-CHM7P", desc: "VAPOR CHAMBER,COPPER,0.4MM", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Furukawa Electric", ppap: "Lv2", category: "Mechanical", risk: "Low" },
  { id: 12, lvl: 3, partId: "TP4-6GRT-89XQM", desc: "THERMAL PAD,GRAPHITE,COOLING", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Henkel", ppap: "Lv1", category: "Mechanical", risk: "Low" },

  // ============================================================
  // Level 2 — Mainboard PCB branch (id 20-31)
  // ============================================================
  { id: 20, lvl: 2, partId: "MB1-7TY5-BRDLA", desc: "ASSY,MAINBOARD,5G,SM-XXXX", type: "ASSM",
    status: { D: "ok", C: "ok", S: "ok", Q: "warn" }, comments: 5, children: [10, 21, 22, 23, 24, 25, 26, 27, 28, 29, 31],
    supplier: "Samsung Electro-Mechanics", ppap: "Lv3", category: "PCB", risk: "High" },
  { id: 10, lvl: 3, partId: "6U8-HKJJ-JRPWM", desc: "PCB,MAINBOARD,10-LAYER,HDI", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "warn" }, comments: 3, children: [],
    supplier: "Samsung Electro-Mechanics", ppap: "Lv3", category: "PCB", risk: "High" },
  { id: 21, lvl: 3, partId: "AP1-3KW9-QC8GN", desc: "IC,AP,SNAPDRAGON 8 GEN 3", type: "CMDTY",
    status: { D: "ok", C: "warn", S: "ok", Q: "ok" }, comments: 4, children: [],
    supplier: "Qualcomm", ppap: "Lv3", category: "PCB", risk: "High" },
  { id: 22, lvl: 3, partId: "MM2-5JNE-DR4VA", desc: "IC,DRAM,LPDDR5X,12GB", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 2, children: [],
    supplier: "Samsung Semi", ppap: "Lv3", category: "PCB", risk: "Med" },
  { id: 23, lvl: 3, partId: "ST3-9HFR-STR91", desc: "IC,STORAGE,UFS 4.0,256GB", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Samsung Semi", ppap: "Lv3", category: "PCB", risk: "Med" },
  { id: 24, lvl: 3, partId: "PM4-2RWN-PMU3K", desc: "IC,PMIC,POWER MANAGEMENT", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Qualcomm", ppap: "Lv2", category: "PCB", risk: "Low" },
  { id: 25, lvl: 3, partId: "MD5-8KQT-MDM5G", desc: "IC,MODEM,5G SUB-6 / mmWAVE", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 2, children: [],
    supplier: "Qualcomm", ppap: "Lv3", category: "PCB", risk: "Med" },
  { id: 26, lvl: 3, partId: "WF6-4LMS-WFI6E", desc: "IC,WIFI 7 + BT 5.4 COMBO", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Broadcom", ppap: "Lv2", category: "PCB", risk: "Low" },
  { id: 27, lvl: 3, partId: "AC7-6PHW-AUDIO", desc: "IC,AUDIO CODEC,32-BIT HIFI", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Cirrus Logic", ppap: "Lv2", category: "PCB", risk: "Low" },
  { id: 28, lvl: 3, partId: "NF8-3VBA-NFCCH", desc: "IC,NFC CONTROLLER + eSE", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "NXP Semiconductors", ppap: "Lv2", category: "PCB", risk: "Low" },
  { id: 29, lvl: 3, partId: "CR9-1QEB-CRYO0", desc: "CRYSTAL,OSCILLATOR,38.4MHZ", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Murata", ppap: "Lv1", category: "PCB", risk: "Low" },
  { id: 31, lvl: 3, partId: "PS1-7ZAU-PASSV", desc: "PASSIVES,SET,CAPACITOR+RESISTOR+INDUCTOR", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Murata", ppap: "Lv1", category: "PCB", risk: "Low" },

  // ============================================================
  // Level 2 — Battery branch (id 30-37)
  // ============================================================
  { id: 30, lvl: 2, partId: "BT1-9HGR-BATAS", desc: "ASSY,BATTERY PACK,5000mAh", type: "ASSM",
    status: { D: "ok", C: "ok", S: "warn", Q: "ok" }, comments: 4, children: [32, 33, 34, 35, 36, 37],
    supplier: "Samsung SDI", ppap: "Lv3", category: "Battery", risk: "High" },
  { id: 32, lvl: 3, partId: "BC1-2FYW-CELL01", desc: "BATTERY CELL,LI-POLYMER,5000mAh", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "warn", Q: "ok" }, comments: 3, children: [],
    supplier: "Samsung SDI", ppap: "Lv3", category: "Battery", risk: "High" },
  { id: 33, lvl: 3, partId: "BP2-8KEN-PROT08", desc: "PCB,BATTERY PROTECTION CIRCUIT", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "ITM Semiconductor", ppap: "Lv2", category: "Battery", risk: "Med" },
  { id: 34, lvl: 3, partId: "BF3-5NLT-FUSE12", desc: "FUSE,THERMAL,BATTERY SAFETY", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Bourns", ppap: "Lv2", category: "Battery", risk: "Med" },
  { id: 35, lvl: 3, partId: "BC4-1OZQ-CONN34", desc: "CONNECTOR,BATTERY,SPRING CONTACT", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Hirose", ppap: "Lv1", category: "Battery", risk: "Low" },
  { id: 36, lvl: 3, partId: "BA5-7AVU-ADH567", desc: "ADHESIVE,BATTERY MOUNTING,DOUBLE-SIDED", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "3M", ppap: "Lv1", category: "Battery", risk: "Low" },
  { id: 37, lvl: 3, partId: "BL6-4XYP-LBL890", desc: "LABEL,BATTERY,REGULATORY", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Avery Dennison", ppap: "Lv1", category: "Battery", risk: "Low" },

  // ============================================================
  // Level 2 — Camera branch (id 40-49)
  // ============================================================
  { id: 40, lvl: 2, partId: "CM1-3EHF-CAMAS", desc: "ASSY,CAMERA MODULE,REAR TRIPLE", type: "ASSM",
    status: { D: "ok", C: "warn", S: "ok", Q: "ok" }, comments: 6, children: [41, 42, 43, 44, 45, 46, 47, 48, 49],
    supplier: "Samsung Electro-Mechanics", ppap: "Lv3", category: "Camera", risk: "High" },
  { id: 41, lvl: 3, partId: "CM2-9PTY-SNS200", desc: "SENSOR,IMAGE,200MP MAIN", type: "CMDTY",
    status: { D: "ok", C: "warn", S: "ok", Q: "ok" }, comments: 4, children: [],
    supplier: "Samsung Semi", ppap: "Lv3", category: "Camera", risk: "High" },
  { id: 42, lvl: 3, partId: "CL3-6URD-LNS200", desc: "LENS,7P,F1.7,OIS,200MP MAIN", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 2, children: [],
    supplier: "Largan Precision", ppap: "Lv3", category: "Camera", risk: "Med" },
  { id: 43, lvl: 3, partId: "CS4-5AVN-SNSULT", desc: "SENSOR,IMAGE,12MP ULTRAWIDE", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Sony Semiconductor", ppap: "Lv3", category: "Camera", risk: "Med" },
  { id: 44, lvl: 3, partId: "CL4-2BWK-LNSULT", desc: "LENS,6P,F2.2,ULTRAWIDE 12MP", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Sunny Optical", ppap: "Lv2", category: "Camera", risk: "Low" },
  { id: 45, lvl: 3, partId: "CS5-7HLT-SNSTEL", desc: "SENSOR,IMAGE,10MP TELEPHOTO 3X", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Sony Semiconductor", ppap: "Lv3", category: "Camera", risk: "Med" },
  { id: 46, lvl: 3, partId: "CL5-4MGS-LNSTEL", desc: "LENS,5P,F2.4,TELEPHOTO 3X", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Largan Precision", ppap: "Lv2", category: "Camera", risk: "Low" },
  { id: 47, lvl: 3, partId: "OI6-8JXN-OIS012", desc: "ACTUATOR,OIS,VOICE COIL,MAIN", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Mitsumi", ppap: "Lv2", category: "Camera", risk: "Med" },
  { id: 48, lvl: 3, partId: "FL7-3ZBQ-FLSH09", desc: "LED,FLASH,DUAL TONE", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Lumileds", ppap: "Lv1", category: "Camera", risk: "Low" },
  { id: 49, lvl: 3, partId: "FC8-1KWE-FCAM12", desc: "ASSY,CAMERA,FRONT 12MP", type: "ASSM",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "LG Innotek", ppap: "Lv2", category: "Camera", risk: "Low" },

  // ============================================================
  // Level 2 — Audio branch (id 50-54)
  // ============================================================
  { id: 50, lvl: 2, partId: "AU1-6FRP-AUDAS", desc: "ASSY,AUDIO SUBSYSTEM", type: "ASSM",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 2, children: [51, 52, 53, 54],
    supplier: "AAC Technologies", ppap: "Lv2", category: "Audio", risk: "Low" },
  { id: 51, lvl: 3, partId: "SP1-9HXJ-SPK001", desc: "SPEAKER,EARPIECE,STEREO TOP", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "AAC Technologies", ppap: "Lv2", category: "Audio", risk: "Low" },
  { id: 52, lvl: 3, partId: "SP2-4VLG-SPK002", desc: "SPEAKER,LOUDSPEAKER,STEREO BOTTOM", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "AAC Technologies", ppap: "Lv2", category: "Audio", risk: "Low" },
  { id: 53, lvl: 3, partId: "MC3-7BPL-MIC003", desc: "MICROPHONE,MEMS,DUAL ARRAY", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Knowles", ppap: "Lv2", category: "Audio", risk: "Low" },
  { id: 54, lvl: 3, partId: "AM4-2QZR-AMP004", desc: "IC,AUDIO AMPLIFIER,CLASS-D", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Cirrus Logic", ppap: "Lv2", category: "Audio", risk: "Low" },

  // ============================================================
  // Level 2 — Connectors / Cables branch (id 60-67)
  // ============================================================
  { id: 60, lvl: 2, partId: "CN1-8GFM-CONAS", desc: "ASSY,CONNECTORS + CABLES", type: "ASSM",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 1, children: [61, 62, 63, 64, 65, 66, 67],
    supplier: "Foxconn Interconnect", ppap: "Lv2", category: "Connectors", risk: "Low" },
  { id: 61, lvl: 3, partId: "UC1-5VHN-USBCN1", desc: "CONNECTOR,USB-C,RECEPTACLE,24-PIN", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Foxconn Interconnect", ppap: "Lv2", category: "Connectors", risk: "Low" },
  { id: 62, lvl: 3, partId: "SC2-3PLW-SIMTRY", desc: "ASSY,SIM TRAY,NANO + eSIM", type: "ASSM",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Molex", ppap: "Lv2", category: "Connectors", risk: "Low" },
  { id: 63, lvl: 3, partId: "FC3-8MJK-FLEX01", desc: "FLEX CABLE,MAINBOARD TO DISPLAY", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Sumitomo Electric", ppap: "Lv2", category: "Connectors", risk: "Low" },
  { id: 64, lvl: 3, partId: "FC4-9WBU-FLEX02", desc: "FLEX CABLE,MAINBOARD TO CAMERA", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Sumitomo Electric", ppap: "Lv2", category: "Connectors", risk: "Low" },
  { id: 65, lvl: 3, partId: "FC5-7DSQ-FLEX03", desc: "FLEX CABLE,MAINBOARD TO BATTERY", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Sumitomo Electric", ppap: "Lv2", category: "Connectors", risk: "Low" },
  { id: 66, lvl: 3, partId: "BC6-1ETR-BTNCBL", desc: "FLEX,SIDE BUTTONS (POWER+VOLUME)", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Foxconn Interconnect", ppap: "Lv1", category: "Connectors", risk: "Low" },
  { id: 67, lvl: 3, partId: "AC7-4OPY-ANTCBL", desc: "CABLE,COAXIAL,ANTENNA RF", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Murata", ppap: "Lv2", category: "Connectors", risk: "Low" },

  // ============================================================
  // Level 2 — Mechanical / Frame branch (id 70-79)
  // ============================================================
  { id: 70, lvl: 2, partId: "MF1-2RFL-MECHAS", desc: "ASSY,FRAME + HOUSING,ALUMINUM", type: "ASSM",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 3, children: [71, 72, 73, 74, 75, 76, 77, 78, 79],
    supplier: "Catcher Technology", ppap: "Lv2", category: "Mechanical", risk: "Low" },
  { id: 71, lvl: 3, partId: "MF2-8HNT-MIDFRM", desc: "MID FRAME,AL-7000 SERIES", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Catcher Technology", ppap: "Lv2", category: "Mechanical", risk: "Low" },
  { id: 72, lvl: 3, partId: "MB3-5QGV-BCKGLS", desc: "GLASS,BACK COVER,TEMPERED", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Lens Technology", ppap: "Lv2", category: "Mechanical", risk: "Low" },
  { id: 73, lvl: 3, partId: "MB4-7ZWA-SIDEBZ", desc: "BEZEL,SIDE,STAINLESS STEEL", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "BYD Electronics", ppap: "Lv2", category: "Mechanical", risk: "Low" },
  { id: 74, lvl: 3, partId: "SC5-3JOM-SCRWKT", desc: "SCREW KIT,TORX T2,SET OF 12", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Würth Elektronik", ppap: "Lv1", category: "Mechanical", risk: "Low" },
  { id: 75, lvl: 3, partId: "GS6-9PUE-GASKET", desc: "GASKET,WATERPROOF,IP68,SILICONE", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Henkel", ppap: "Lv2", category: "Mechanical", risk: "Med" },
  { id: 76, lvl: 3, partId: "BR7-4LSF-BUTTON", desc: "BUTTONS,SIDE,POWER+VOLUME ASSY", type: "ASSM",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Foxconn", ppap: "Lv1", category: "Mechanical", risk: "Low" },
  { id: 77, lvl: 3, partId: "VB8-6KCD-VIBRAT", desc: "MOTOR,VIBRATION,HAPTIC FEEDBACK", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Nidec", ppap: "Lv2", category: "Mechanical", risk: "Low" },
  { id: 78, lvl: 3, partId: "EM9-2GHB-EMSHLD", desc: "EMI SHIELD,MAINBOARD,STAMPED", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Laird", ppap: "Lv2", category: "Mechanical", risk: "Low" },
  { id: 79, lvl: 3, partId: "GP1-7AYV-GRAPH4", desc: "GRAPHITE SHEET,THERMAL,0.5MM", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Panasonic", ppap: "Lv2", category: "Mechanical", risk: "Low" },

  // ============================================================
  // Level 2 — Antenna / RF branch (id 80-85)
  // ============================================================
  { id: 80, lvl: 2, partId: "AN1-5HMW-ANTAS", desc: "ASSY,ANTENNA + RF FRONT-END", type: "ASSM",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 2, children: [81, 82, 83, 84, 85],
    supplier: "Murata", ppap: "Lv3", category: "Antenna", risk: "Med" },
  { id: 81, lvl: 3, partId: "AN2-8FRT-ANTSUB", desc: "ANTENNA,5G SUB-6 GHz,LDS", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Pulse Electronics", ppap: "Lv3", category: "Antenna", risk: "Med" },
  { id: 82, lvl: 3, partId: "AN3-2VXR-ANTMMW", desc: "ANTENNA,mmWAVE,28GHz/39GHz", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 1, children: [],
    supplier: "Murata", ppap: "Lv3", category: "Antenna", risk: "High" },
  { id: 83, lvl: 3, partId: "AN4-6KPN-ANTWIF", desc: "ANTENNA,WIFI 7 + BT,DUAL BAND", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Murata", ppap: "Lv2", category: "Antenna", risk: "Low" },
  { id: 84, lvl: 3, partId: "RF5-9QHJ-PAMSUB", desc: "IC,POWER AMPLIFIER,SUB-6 GHz", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Qorvo", ppap: "Lv3", category: "Antenna", risk: "Med" },
  { id: 85, lvl: 3, partId: "RF6-3LWA-FEMMOD", desc: "IC,RF FRONT-END MODULE", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Skyworks", ppap: "Lv3", category: "Antenna", risk: "Med" },

  // ============================================================
  // Level 2 — Sensors branch (id 90-96)
  // ============================================================
  { id: 90, lvl: 2, partId: "SN1-7DXT-SNRAS", desc: "ASSY,SENSORS,ENVIRONMENTAL + MOTION", type: "ASSM",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 1, children: [91, 92, 93, 94, 95, 96],
    supplier: "Bosch Sensortec", ppap: "Lv2", category: "Sensors", risk: "Low" },
  { id: 91, lvl: 3, partId: "SN2-4BMP-GYRO01", desc: "SENSOR,6-AXIS,GYRO + ACCEL", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Bosch Sensortec", ppap: "Lv2", category: "Sensors", risk: "Low" },
  { id: 92, lvl: 3, partId: "SN3-6HZE-MAGNET", desc: "SENSOR,MAGNETOMETER,3-AXIS", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Asahi Kasei", ppap: "Lv2", category: "Sensors", risk: "Low" },
  { id: 93, lvl: 3, partId: "SN4-1WRL-PROXLT", desc: "SENSOR,PROXIMITY + AMBIENT LIGHT", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "AMS-OSRAM", ppap: "Lv2", category: "Sensors", risk: "Low" },
  { id: 94, lvl: 3, partId: "SN5-8YCK-FNGPRT", desc: "SENSOR,FINGERPRINT,ULTRASONIC,UD", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 2, children: [],
    supplier: "Qualcomm", ppap: "Lv3", category: "Sensors", risk: "Med" },
  { id: 95, lvl: 3, partId: "SN6-3NQO-BAROPR", desc: "SENSOR,BAROMETRIC PRESSURE", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Bosch Sensortec", ppap: "Lv2", category: "Sensors", risk: "Low" },
  { id: 96, lvl: 3, partId: "SN7-5SAH-TOFLDR", desc: "SENSOR,ToF,LASER AUTOFOCUS", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "STMicroelectronics", ppap: "Lv2", category: "Sensors", risk: "Low" },

  // ============================================================
  // Level 2 — Power / Charging branch (id 100-103)
  // ============================================================
  { id: 100, lvl: 2, partId: "PW1-9TJG-PWRAS", desc: "ASSY,POWER + WIRELESS CHARGING", type: "ASSM",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 1, children: [101, 102, 103],
    supplier: "Cirrus Logic", ppap: "Lv2", category: "Power", risk: "Low" },
  { id: 101, lvl: 3, partId: "PW2-4XCL-WPCHRG", desc: "COIL,WIRELESS CHARGING,15W Qi2", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "TDK", ppap: "Lv2", category: "Power", risk: "Low" },
  { id: 102, lvl: 3, partId: "PW3-7MAY-WPCIC0", desc: "IC,WIRELESS POWER RECEIVER", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Renesas", ppap: "Lv2", category: "Power", risk: "Low" },
  { id: 103, lvl: 3, partId: "PW4-2PWS-RVPSC4", desc: "IC,REVERSE WIRELESS CHARGING", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Renesas", ppap: "Lv1", category: "Power", risk: "Low" },

  // ============================================================
  // Level 2 — Packaging / Accessories branch (id 110-113)
  // ============================================================
  { id: 110, lvl: 2, partId: "PK1-5OAJ-PKGAS", desc: "ASSY,PACKAGING + ACCESSORIES", type: "ASSM",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [111, 112, 113],
    supplier: "Internal", ppap: "Lv1", category: "Packaging", risk: "Low" },
  { id: 111, lvl: 3, partId: "PK2-8KMU-BOXMAS", desc: "BOX,RETAIL,RECYCLED PAPER", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Internal", ppap: "Lv1", category: "Packaging", risk: "Low" },
  { id: 112, lvl: 3, partId: "PK3-2VBO-CBLUSB", desc: "CABLE,USB-C TO USB-C,1M", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
    supplier: "Foxconn", ppap: "Lv1", category: "Packaging", risk: "Low" },
  { id: 113, lvl: 3, partId: "PK4-7DTQ-TOOLEJ", desc: "TOOL,SIM EJECTION,STAINLESS", type: "CMDTY",
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" }, comments: 0, children: [],
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
    defaults: { structure: "tree", groupBy: "category", overlay: "none" },
    lifecycle: "review", parties: 2, multisource: 88.2, sss: 7.1,
    collabType: "design", collabProgress: 65, collabLabel: "Design Collaboration",
    collabStatus: "Spec Reviewed" },
  { id: "S", label: "S-BOM", name: "Sourcing BOM", version: "v2.1", parts: 78, status: "active",
    syncDelta: 0, missing: 2, owner: "SM", description: "Supplier definition",
    syncNote: "2 parts missing supplier selection (including new AMOLED Panel)",
    lastActivity: { actor: "SM", action: "Supplier awarded", ts: "Today 11:30" },
    defaults: { structure: "flat", groupBy: "supplier", overlay: "none" },
    lifecycle: "review", parties: 3, multisource: 92.3, sss: 4.8,
    collabType: "cost", collabProgress: 80, collabLabel: "Cost Collaboration",
    collabStatus: "Quote Received" },
  { id: "Q", label: "Q-BOM", name: "Quality BOM", version: "v1.5", parts: 76, status: "active",
    syncDelta: 1, missing: 4, owner: "QM", description: "PPAP validation subject",
    syncNote: "4 new parts not yet registered for PPAP",
    lastActivity: { actor: "QM", action: "PPAP requested", ts: "Today 14:22" },
    defaults: { structure: "flat", groupBy: "ppap", overlay: "none" },
    lifecycle: "draft", parties: 1, multisource: 85.0, sss: 3.2,
    collabType: "quality", collabProgress: 45, collabLabel: "Quality Collaboration",
    collabStatus: "PPAP Lv3 Pending" },
  { id: "C", label: "C-BOM", name: "Cost BOM", version: "v2.0", parts: 80, status: "active",
    syncDelta: 0, missing: 0, owner: "CM", description: "Cost breakdown (BOM Cost Roll-up)",
    lastActivity: { actor: "CM", action: "Should-cost updated", ts: "Today 09:15" },
    defaults: { structure: "tree", groupBy: "category", overlay: "none" },
    lifecycle: "approved", parties: 3, multisource: 96.1, sss: 6.5,
    collabType: "cost", collabProgress: 92, collabLabel: "Cost Collaboration",
    collabStatus: "Final Review" },
];

// Archived BOMs — historical versions kept for reference (Kanban only)
const ARCHIVED_BOMS = [
  { id: "E-old", label: "E-BOM", code: "BOM260400319", versions: ["Ver 2", "Ver 1"],
    cost: { ver: "Ver 1", delta: "+$1,900", target: "$48,500", overTarget: true } },
  { id: "E-old2", label: "E-BOM", code: "BOM260300257", versions: ["Ver 1"], cost: null },
  { id: "S-old1", label: "S-BOM", code: "BOM260400320", versions: ["Ver 3", "Ver 2", "Ver 1"],
    cost: { ver: "Ver 2", delta: "-$300", target: "$48,500", overTarget: false } },
  { id: "S-old2", label: "S-BOM", code: "BOM260300256", versions: ["Ver 1"], cost: null },
  { id: "C-old", label: "C-BOM", code: "BOM260300258", versions: ["Ver 2", "Ver 1"],
    cost: { ver: "Ver 1", delta: "+$420", target: "$48,500", overTarget: true } },
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
  // Index map: base[0]=E, base[1]=S, base[2]=Q, base[3]=C

  // Newly-created project: NO BOMs exist yet (user must upload or link)
  if (isNew) {
    return base.map(b => ({
      ...b, version: "—", parts: 0, status: "not_created", lifecycle: null,
      missing: 0, syncDelta: 0, lastActivity: null,
    }));
  }

  if (phase === "Concept" || phase === "Incubation") {
    // New project: only E-BOM initial version exists
    base[0] = { ...base[0], version: "v0.3", parts: 24, status: "active", lifecycle: "draft",
                lastActivity: { actor: "DE", action: "Initial draft", ts: "Yesterday" } };
    base[1] = { ...base[1], version: "—", parts: 0, status: "not_created", lifecycle: null, missing: 0, syncDelta: 0, lastActivity: null };
    base[2] = { ...base[2], version: "—", parts: 0, status: "not_created", lifecycle: null, missing: 0, syncDelta: 0, lastActivity: null };
    base[3] = { ...base[3], version: "—", parts: 0, status: "not_created", lifecycle: null, missing: 0, syncDelta: 0, lastActivity: null };
  } else if (phase === "Plan") {
    // E-BOM in review, C-BOM in draft. S, Q not started yet
    base[0] = { ...base[0], version: "v1.0", parts: 52, lifecycle: "review" };
    base[1] = { ...base[1], version: "—", parts: 0, status: "not_created", lifecycle: null, missing: 0, syncDelta: 0, lastActivity: null };
    base[2] = { ...base[2], version: "—", parts: 0, status: "not_created", lifecycle: null, missing: 0, syncDelta: 0, lastActivity: null };
    base[3] = { ...base[3], version: "v0.8", parts: 50, lifecycle: "draft",
                lastActivity: { actor: "CM", action: "Initial cost rollup", ts: "Yesterday" } };
  } else if (phase === "Design") {
    // E-BOM approved. S-BOM draft. Q not yet engaged. C-BOM in review
    base[0] = { ...base[0], version: "v2.0", parts: 72, lifecycle: "approved" };
    base[1] = { ...base[1], version: "v0.5", parts: 60, missing: 12, lifecycle: "draft",
                lastActivity: { actor: "SM", action: "Supplier selection started", ts: "Yesterday" } };
    base[2] = { ...base[2], version: "—", parts: 0, status: "not_started", lifecycle: null,
                lastActivity: { actor: "QM", action: "Awaiting owner", ts: "—" } };
    base[3] = { ...base[3], version: "v1.5", parts: 72, lifecycle: "review" };
  }
  // Develop / Verify / SOP: use base data as-is (all 4 BOMs active with their default lifecycle)
  return base;
}

// AMOLED Panel (id: 3) — scenario hero item
const HERO_ITEM = {
  id: 3, partId: "EI2-I6DA-003WB", partName: "AMOLED Panel 6.7\" FHD+ 120Hz",
  itemCode: "1000001120", desc: "PANEL,AMOLED,6.7IN,FHD+,120HZ",
  category: "Display Module", type: "Buy & Sell", uom: "EA",
  status: { D: "warn", C: "block", S: "progress", Q: "block" },
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
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" },
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
    status: { D: "warn", C: "warn", S: "warn", Q: "warn" },
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
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" },
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
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" },
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
    status: { D: "ok", C: "warn", S: "ok", Q: "ok" },
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
    status: { D: "ok", C: "ok", S: "ok", Q: "ok" },
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
    status: { D: "ok", C: "ok", S: "ok", Q: "warn" },
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
    status: { D: "ok", C: "ok", S: "ok", Q: "warn" } },
  { id: 6, partId: "1W6-4YP3-X6FU2", partName: "Touch Controller I2C",
    blockReason: "Cost variance with market price (+12%)",
    status: { D: "ok", C: "warn", S: "ok", Q: "ok" } },
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
    {
      label: "Quality",
      items: [
        {
          id: "apqp", icon: BadgeCheck, label: "APQP",
          badge: isHeroProject ? { value: "●", color: C.warning, tooltip: "PPAP in progress" } : null,
        },
      ],
    },
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
      <div className="flex flex-col gap-6 pb-4">
      {/* === TOGGLE ROW (same position as collapsed mode) === */}
      <div className="px-3 pt-5 flex justify-end">
        <button
          onClick={() => setIsCollapsed && setIsCollapsed(true)}
          className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
          title="Collapse sidebar (⌘B)"
          style={{ color: C.textSecondary }}>
          <PanelLeftClose className="w-4 h-4" />
        </button>
      </div>
      {/* === HEADER === */}
      <div className="px-5 flex flex-col gap-3">
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
            className="w-9 h-9 rounded-full flex items-center justify-center border transition-colors hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
            style={{ borderColor: C.border, color: C.textSecondary, backgroundColor: "white" }}>
            <MessageSquare className="w-4 h-4" />
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
                            {bom.label}s
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
                <button key={m.persona}
                  onClick={() => { setActivePersona && setActivePersona(m.persona); setOpen(false); }}
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
      description: "Add team members so you can begin collaborating. Each role (DE, CM, SM, QM) brings expertise to a different BOM.",
      sections: [
        { label: "Recommended Roles", items: [
          { label: "Design Engineer (DE) — owns E-BOM", done: false },
          { label: "Sourcing Manager (SM) — owns S-BOM", done: false },
          { label: "Quality Manager (QM) — owns Q-BOM", done: false },
          { label: "Cost Manager (CM) — owns C-BOM", done: false },
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
    const sBomMissingIds = [3];
    const eBomLagIds = [5, 8];
    const result = [];
    BOM_TREE.forEach((node) => {
      let status = "synced";
      if (targetBomId === "Q" && qBomMissingIds.includes(node.id) && scenarioStep < 7) status = "missing";
      else if (targetBomId === "S" && sBomMissingIds.includes(node.id) && scenarioStep < 6) status = "missing";
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
    if (statusFilter === "onTrack") result = result.filter((p) => p.readiness >= 90);
    if (statusFilter === "atRisk") result = result.filter((p) => p.readiness < 70);
    if (statusFilter === "blocked") result = result.filter((p) => p.blocking > 0);

    // Composite priority sort: NEW first → blocking desc → readiness asc → phaseDays asc
    if (sortBy === "priority") {
      result = [...result].sort((a, b) => {
        // 1. NEW projects always on top
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        // 2. Blocking count (descending — more blocks = higher priority)
        if (a.blocking !== b.blocking) return b.blocking - a.blocking;
        // 3. Readiness (ascending — lower readiness = higher priority)
        if (a.readiness !== b.readiness) return a.readiness - b.readiness;
        // 4. phaseDays (ascending — closer deadline = higher priority)
        return a.phaseDays - b.phaseDays;
      });
    }
    if (sortBy === "phaseDays") result = [...result].sort((a, b) => a.phaseDays - b.phaseDays);
    if (sortBy === "readiness") result = [...result].sort((a, b) => a.readiness - b.readiness);
    if (sortBy === "name") result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [search, phaseFilter, priorityFilter, sortBy, statusFilter]);

  const totals = useMemo(() => ({
    total: PROJECTS.length,
    blocked: PROJECTS.filter((p) => p.blocking > 0).length,
    atRisk: PROJECTS.filter((p) => p.readiness < 70).length,
    onTrack: PROJECTS.filter((p) => p.readiness >= 90).length,
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
              <option value="priority">Sort: Priority</option>
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
                    className="cursor-pointer hover:bg-gray-50 border-b transition-colors"
                    style={{ borderColor: C.borderLight, backgroundColor: "white" }}>
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
                            {p.isNew && (
                              <span className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                                style={{ backgroundColor: C.success, color: "white" }}>NEW</span>
                            )}
                          </div>
                          <div className="text-[10px] font-mono mt-0.5" style={{ color: C.textDisabled }}>
                            {p.code} · {p.product}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Owner cell: avatar + name + (+N collaborators) */}
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-1.5">
                        <PersonaAvatar p={p.pm} size={20} />
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-medium truncate" style={{ color: C.textPrimary }}>
                            {p.ownerName}
                          </span>
                          {p.collaborators > 1 && (
                            <span className="text-[10px]" style={{ color: C.textSecondary }}>
                              +{p.collaborators - 1} collaborator{p.collaborators - 1 > 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </div>
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
                    {/* Blocking count */}
                    <td className="py-3 px-2 text-center">
                      {p.blocking > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: C.errorLight, color: C.error }}>
                          <AlertCircle className="w-2.5 h-2.5" />
                          {p.blocking}
                        </span>
                      ) : (
                        <span className="text-[10px]" style={{ color: C.textDisabled }}>—</span>
                      )}
                    </td>
                    {/* Gate Readiness — default primary; red only for true crisis (low readiness + urgent deadline + blocking, ALL required) */}
                    <td className="py-3 px-2">
                      {(() => {
                        // True crisis: readiness < 70 AND phaseDays < 60 AND blocking > 0
                        const isCrisis = p.readiness < 70 && p.phaseDays < 60 && p.blocking > 0;
                        const readinessColor = isCrisis ? C.error
                          : p.readiness >= 90 ? C.success
                          : C.primary;
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
function ProjectCockpit({ onOpenItem, scenarioStep, activeProjectCode, setView }) {
  const project = PROJECTS.find((p) => p.code === activeProjectCode) || PROJECTS[0];
  const isHeroProject = project.code === ACTIVE_PROJECT_CODE;

  // Scenario operates only on Hero Project (NPI Smartphone #2)
  const isResolved = isHeroProject && scenarioStep >= 8;
  const readiness = isResolved ? 96 : project.readiness;
  const blocking = isResolved ? 0 : project.blocking;
  const tmcGap = isResolved ? -2.1 : project.tmcGap;

  // Hero project uses BLOCKING_ITEMS scenario data; others get generic placeholder
  const blockingItems = isHeroProject ? BLOCKING_ITEMS : generateGenericBlockingItems(project);

  // Per-phase Gate Readiness 4 sub-indicators (weighted by actual project readiness)
  const subIndicators = isHeroProject
    ? (isResolved
        ? [{ label: "Design", value: 98, color: C.info }, { label: "Cost", value: 95, color: C.warning },
           { label: "Sourcing", value: 100, color: C.success }, { label: "Quality", value: 92, color: C.primary }]
        : [{ label: "Design", value: 92, color: C.info }, { label: "Cost", value: 78, color: C.warning },
           { label: "Sourcing", value: 89, color: C.success }, { label: "Quality", value: 71, color: C.primary }])
    : [
        { label: "Design", value: Math.min(100, project.readiness + 5), color: C.info },
        { label: "Cost", value: Math.max(20, project.readiness - 8), color: C.warning },
        { label: "Sourcing", value: project.readiness, color: C.success },
        { label: "Quality", value: Math.max(20, project.readiness - 12), color: C.primary },
      ];

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
          className="text-xs font-medium px-3 py-1.5 rounded-md text-white hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
          style={{ backgroundColor: isResolved || blocking === 0 ? C.success : C.primary }}>
          {isResolved ? "Prepare Gate Review" : blocking === 0 ? "View Status" : "Show me"}
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        <KpiCard icon={Clock} iconColor={C.warning} label="Phase Due" value={`D-${project.phaseDays}`} sub={project.lastUpdate} />
        <KpiCard icon={DollarSign} iconColor={tmcGap > 0 ? C.error : tmcGap < 0 ? C.success : C.textSecondary} label="TMC Gap"
          value={tmcGap === 0 ? "—" : tmcGap > 0 ? `+$${tmcGap}k` : `-$${Math.abs(tmcGap)}k`}
          sub={tmcGap > 0 ? "Over Target" : tmcGap < 0 ? "Under Target" : "On Target"} />
        <KpiCard icon={AlertTriangle} iconColor={blocking > 0 ? C.error : C.success} label="Blocking Items"
          value={blocking} sub={blocking > 0 ? "Action Required" : "All Clear"} />
        <KpiCard icon={AtSign} iconColor={C.primary} label="My Pending Actions"
          value={isHeroProject ? "3" : "0"} sub={isHeroProject ? "2 mentions, 1 approval" : "Nothing pending"} />
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
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>
              {isResolved ? "Recently Resolved Items" : blocking > 0 ? "Blocking Items" : "Recent Activity"}
            </div>
            <span className="text-xs px-2 py-0.5 rounded"
              style={{ backgroundColor: isResolved ? C.successLight : (blocking > 0 ? C.errorLight : C.bg),
                       color: isResolved ? C.success : (blocking > 0 ? C.error : C.textSecondary) }}>
              {isResolved ? "Last 24h" : blocking > 0 ? "Action needed" : "All clear"}
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
              {blockingItems.map((item) => (
                <button key={item.id} onClick={() => isHeroProject && onOpenItem(item.id)}
                  disabled={!isHeroProject}
                  className="w-full text-left p-3 rounded-lg border hover:shadow-sm transition-all"
                  style={{ borderColor: C.borderLight, cursor: isHeroProject ? "pointer" : "default" }}>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded flex items-center justify-center shrink-0"
                      style={{ backgroundColor: C.errorLight }}>
                      <Package className="w-4 h-4" style={{ color: C.error }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
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
                      <div className="flex items-center gap-1.5">
                        {item.status && Object.entries(item.status).map(([k, v]) => (
                          <StatusPill key={k} kind={v} label={`${k}: ${STATUS_MAP[v].label}`} />
                        ))}
                      </div>
                    </div>
                    {isHeroProject && <ChevronRight className="w-4 h-4 shrink-0" style={{ color: C.textDisabled }} />}
                  </div>
                </button>
              ))}
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

      {/* Activity Mini */}
      <div className="p-5 rounded-xl border bg-white" style={{ borderColor: C.border }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-semibold" style={{ color: C.textPrimary }}>Recent Activity & Decisions</div>
            <div className="text-[11px] mt-0.5" style={{ color: C.textSecondary }}>
              Project mentions & decisions — synced with the Activity Stream in BOM Collaboration.
            </div>
          </div>
          <button onClick={() => setView("bom")}
            className="text-xs font-medium px-3 py-1.5 rounded-md border flex items-center gap-1.5 transition-colors hover:bg-gray-50"
            style={{ color: C.primary, borderColor: C.primaryLight, backgroundColor: "white" }}>
            View full Activity Stream
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        {isHeroProject ? (
          <div className="space-y-3">
            {ACTIVITY_FEED.slice(0, Math.min(scenarioStep + 1, 4)).map((m) => (
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
            ))}
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
    </div>
  );
}

// For non-hero projects, generate generic blocking items
function generateGenericBlockingItems(project) {
  if (project.blocking === 0) return [];
  const templates = [
    { id: 100, partId: "PART-XYZ-001", partName: "Critical Component A",
      blockReason: "Design review pending — 3 days overdue",
      status: { D: "warn", C: "ok", S: "ok", Q: "ok" } },
    { id: 101, partId: "PART-XYZ-002", partName: "Critical Component B",
      blockReason: "Cost variance with target (+8%)",
      status: { D: "ok", C: "warn", S: "ok", Q: "ok" } },
    { id: 102, partId: "PART-XYZ-003", partName: "Critical Component C",
      blockReason: "Supplier feasibility check required",
      status: { D: "ok", C: "ok", S: "warn", Q: "ok" } },
    { id: 103, partId: "PART-XYZ-004", partName: "Critical Component D",
      blockReason: "PPAP Level not yet determined",
      status: { D: "ok", C: "ok", S: "ok", Q: "warn" } },
    { id: 104, partId: "PART-XYZ-005", partName: "Critical Component E",
      blockReason: "Multiple specs changed — impact analysis needed",
      status: { D: "block", C: "warn", S: "warn", Q: "warn" } },
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

  const fileIconColor = (type) => {
    if (type === "pdf") return C.error;
    if (type === "xlsx") return C.success;
    if (type === "docx") return C.primary;
    if (type === "pptx") return C.warning;
    return C.textSecondary;
  };

  return (
    <div className="p-6" style={{ minHeight: "100%" }}>
      <div className="grid grid-cols-3 gap-4">

        {/* === COLUMN 1: General Info === */}
        <div className="col-span-2 space-y-4">
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

          {/* Phase Milestones */}
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
              <button className="px-3 py-1.5 rounded-md text-xs font-medium text-white flex items-center gap-1.5"
                style={{ backgroundColor: C.primary }}>
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
                  <div className="flex items-center gap-2 shrink-0">
                    <PersonaAvatar p={f.uploadedBy} size={20} />
                    <div className="text-right">
                      <div className="text-[10px]" style={{ color: C.textPrimary }}>
                        {PERSONAS[f.uploadedBy]?.role}
                      </div>
                      <div className="text-[10px]" style={{ color: C.textDisabled }}>{f.uploadedAt}</div>
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

        {/* === COLUMN 2: Collaborators === */}
        <div className="space-y-4">
          {/* Collaborators Card */}
          <div className="rounded-xl border bg-white" style={{ borderColor: C.border }}>
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: C.border }}>
              <div className="flex items-center gap-2">
                <div className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: C.primary }}>
                  Collaborators
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: C.bg, color: C.textSecondary }}>
                  {projectCollaborators.length}
                </span>
              </div>
              <button className="text-[11px] font-medium hover:underline" style={{ color: C.primary }}>
                + Invite
              </button>
            </div>
            <div className="divide-y" style={{ borderColor: C.borderLight }}>
              {projectCollaborators.map((c) => {
                const isMe = activePersona === c.persona;
                return (
                  <button key={c.persona}
                    onClick={() => setActivePersona && setActivePersona(c.persona)}
                    className="w-full px-5 py-3 flex items-center gap-3 text-left transition-colors"
                    style={{ backgroundColor: isMe ? C.primarySoft : "transparent" }}
                    onMouseEnter={(e) => { if (!isMe) e.currentTarget.style.backgroundColor = C.bg; }}
                    onMouseLeave={(e) => { if (!isMe) e.currentTarget.style.backgroundColor = "transparent"; }}>
                    <div className="relative shrink-0">
                      <PersonaAvatar p={c.persona} size={36} />
                      {c.active === "now" && (
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white"
                          style={{ backgroundColor: C.success }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold" style={{ color: C.textPrimary }}>
                          {PERSONAS[c.persona]?.name}
                        </span>
                        {c.owner && (
                          <span className="text-[9px] px-1 py-0.5 rounded font-bold"
                            style={{ backgroundColor: C.warningLight, color: C.warning }}>OWNER</span>
                        )}
                        {isMe && (
                          <span className="text-[9px] px-1 py-0.5 rounded font-bold"
                            style={{ backgroundColor: C.primary, color: "white" }}>ME</span>
                        )}
                      </div>
                      <div className="text-[10px]" style={{ color: C.textSecondary }}>{c.role}</div>
                      <div className="text-[10px] mt-0.5 flex items-center gap-1.5" style={{ color: C.textDisabled }}>
                        <span>Active: {c.active}</span>
                        <span>·</span>
                        <span>{c.contribution} contributions</span>
                      </div>
                    </div>
                  </button>
                );
              })}
              {project.isNew && (
                <div className="px-5 py-6 text-center border-t" style={{ borderColor: C.borderLight }}>
                  <Users className="w-7 h-7 mx-auto mb-2" style={{ color: C.textDisabled }} />
                  <div className="text-xs mb-1" style={{ color: C.textPrimary }}>
                    You're the only one here
                  </div>
                  <div className="text-[11px]" style={{ color: C.textSecondary }}>
                    Invite DE, CM, SM, and QM to start collaborating.
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

// === SCREEN: BOM LIST (5 BOMs) ===
function BomListScreen({ activeProjectCode, activeBom, setActiveBom, setView }) {
  const project = PROJECTS.find((p) => p.code === activeProjectCode) || PROJECTS[0];
  const isHeroProject = project.code === ACTIVE_PROJECT_CODE;

  // View mode: "kanban" (default) | "table"
  const [viewMode, setViewMode] = useState("kanban");

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
            Start by adding the E-BOM (Engineering). Once spec is defined, S/Q/C-BOMs can be added in parallel as each domain begins collaborating.
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
  const renderTableView = () => (
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
          {bomsForProject.map((b) => {
            const hasIssue = b.syncDelta > 0 || b.missing > 0;
            const isInactive = b.status !== "active";
            // Use subtle background instead of opacity for accessibility
            const rowBg = isInactive ? "#FAFAFA" : "white";

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

                {/* Status + Action — Status pill OR Action button (mutually exclusive) */}
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
                  ) : hasIssue ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: C.warningLight, color: C.warning, border: `1px solid ${C.warning}` }}
                      title={b.syncNote}>
                      <AlertTriangle className="w-3 h-3" />
                      {b.missing > 0 ? `${b.missing} need sync` : "Delayed"}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: C.successLight, color: C.success, border: `1px solid ${C.success}` }}>
                      <CheckCircle className="w-3 h-3" />
                      Synced
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderKanbanView = () => {
    // Filter only active BOMs (not_created/not_started don't appear in Kanban)
    const activeBoms = bomsForProject.filter(b => b.status === "active");
    // Apply collab type filter
    let filteredBoms = activeBoms.filter(b => collabFilters[b.collabType]);
    // Apply party filter: S-BOM is external (supplier collab), others internal
    filteredBoms = filteredBoms.filter(b => {
      const isExternal = b.id === "S"; // S-BOM has supplier collab
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

          {/* Right side: Phase + Count (both modes) */}
          <div className="text-[11px] flex items-center gap-2" style={{ color: C.textSecondary }}>
            <span style={{ color: C.textDisabled }}>Phase:</span>
            <span style={{ color: C.textPrimary, fontWeight: 500 }}>{project.phase}</span>
            <span style={{ color: C.borderLight }}>·</span>
            <span>{activeCount} of {bomsForProject.length} active</span>
          </div>
        </div>

        {/* Body: Table or Kanban */}
        <div className="p-4" style={{ backgroundColor: viewMode === "kanban" ? C.bg : "white" }}>
          {viewMode === "table" ? renderTableView() : renderKanbanView()}
        </div>
      </div>
    </div>
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

  // Heatmap level filter — which severity levels to show
  // Cost heat: { high, med, under, neutral } | Risk heat: { high, med, low }
  // null = show all (default)
  const [heatLevels, setHeatLevels] = useState(null);

  // Overlay options per BOM family (semantic separation of concerns)
  // E-BOM: spec only | S-BOM: supplier risk | Q-BOM: PPAP risk | C-BOM: cost
  const OVERLAYS_BY_BOM = {
    E: ["none"],
    S: ["none", "riskHeat"],
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
    const sBomMissingIds = [3];
    const eBomLagIds = [5, 8];
    const isMissingNode = (n) => {
      if (activeBom === "Q" && qBomMissingIds.includes(n.id) && scenarioStep < 7) return true;
      if (activeBom === "S" && sBomMissingIds.includes(n.id) && scenarioStep < 6) return true;
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
    const flatNodes = BOM_TREE.map((n) => ({ ...n, lvl: 1, _groupKey: n[groupBy] || "Unknown" }));
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
      return result.filter((n) => n._isGroupHeader || matchesFilter(n));
    }
    return result;
  }, [expandedNodes, filter, structure, groupBy, activeBom, scenarioStep, heatLevels, overlay]);

  // Per-part detail: Hero (id 3) is scenario subject; others come from ITEM_DETAILS map
  const selectedItem = selectedItemId === 3
    ? HERO_ITEM
    : ITEM_DETAILS[selectedItemId] || BOM_TREE.find((n) => n.id === selectedItemId);

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
            BOM Collaboration becomes active once the first BOM exists. Start with E-BOM, then S/Q/C-BOMs follow in parallel as each domain engages.
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
          {structure === "flat" && (
            <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)}
              className="h-7 px-2 rounded-md border text-[11px] outline-none bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
              style={{ borderColor: C.border, color: C.textPrimary }}>
              <option value="supplier">Group: Supplier</option>
              <option value="ppap">Group: PPAP Level</option>
              <option value="category">Group: Category</option>
              <option value="risk">Group: Risk Level</option>
            </select>
          )}

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
              const sBomMissingIds = [3];
              const eBomLagIds = [5, 8];
              const missingCount =
                activeBom === "Q" && scenarioStep < 7 ? qBomMissingIds.length :
                activeBom === "S" && scenarioStep < 6 ? sBomMissingIds.length :
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
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-white border-b" style={{ borderColor: C.border }}>
              <tr style={{ color: C.textSecondary }}>
                {structure === "tree" && (
                  <th className="text-left font-medium py-2.5 px-3 w-8">LVL</th>
                )}
                <th className="text-left font-medium py-2.5 px-3">Part / Description</th>

                {/* BOM-specific columns */}
                {activeBom === "E" && (
                  <th className="text-left font-medium py-2.5 px-3 w-20">Type</th>
                )}
                {activeBom === "S" && (
                  <>
                    <th className="text-left font-medium py-2.5 px-3 w-40">Supplier</th>
                    <th className="text-center font-medium py-2.5 px-3 w-16">PPAP</th>
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
                    <th className="text-right font-medium py-2.5 px-3 w-20">Quoted</th>
                    <th className="text-right font-medium py-2.5 px-3 w-20">Should</th>
                    <th className="text-right font-medium py-2.5 px-3 w-20">Market</th>
                    <th className="text-right font-medium py-2.5 px-3 w-24">Δ vs Target</th>
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
                // Mock cost values: quoted (RFQ), shouldCost (AI), market, target, delta vs target
                // AMOLED Panel (id 3): uses scenario hero data
                let mockCost;
                if (node.id === 3) {
                  // Hero AMOLED: quoted available after scenarioStep >= 7
                  const quoted = scenarioStep >= 7 ? 38.90 : null;
                  mockCost = {
                    quoted, shouldCost: 41.80, market: 42.50, target: 38.00,
                    delta: quoted !== null ? (quoted - 38.00) : (41.80 - 38.00), // vs target
                  };
                } else {
                  // Derive deterministic mock from node.id
                  const base = 5 + (node.id % 12) * 3.4;
                  const target = base * 0.95;
                  const quoted = base + ((node.id % 5) - 2) * 0.3;
                  mockCost = {
                    quoted: Math.round(quoted * 100) / 100,
                    shouldCost: Math.round((base * 0.98) * 100) / 100,
                    market: Math.round((base * 1.04) * 100) / 100,
                    target: Math.round(target * 100) / 100,
                    delta: Math.round((quoted - target) * 100) / 100,
                  };
                }
                const mockRisk = node.isHero ? "Med" : (node.id === 10 ? "High" : (node.id === 6 ? "Med" : "Low"));

                // BOM-specific missing parts simulation:
                // - Q-BOM: id 3, 10, 14, 18 missing until scenarioStep >= 7 (QM resolves)
                // - S-BOM: id 3 missing supplier until scenarioStep >= 6 (SM awards)
                // - E-BOM: ids 5, 8 lag by 1 week (sync needed)
                const qBomMissingIds = [3, 10, 14, 18];
                const sBomMissingIds = [3];
                const eBomLagIds = [5, 8];
                const isMissingInActiveBom =
                  (activeBom === "Q" && qBomMissingIds.includes(node.id) && scenarioStep < 7) ||
                  (activeBom === "S" && sBomMissingIds.includes(node.id) && scenarioStep < 6);
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
                      <td className="py-2 px-3">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: C.bg, color: C.textSecondary }}>
                          {node.type || "—"}
                        </span>
                      </td>
                    )}
                    {activeBom === "S" && (
                      <>
                        <td className="py-2 px-3">
                          <span className="text-[11px] truncate block" style={{ color: C.textPrimary }}
                            title={node.supplier}>
                            {isMissingInActiveBom ? <span style={{ color: C.error }}>— (not selected)</span> : (node.supplier || "—")}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-center">
                          <span className="text-[10px] font-mono font-semibold"
                            style={{ color: C.textSecondary }}>
                            {node.ppap || "—"}
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
                            {node.supplier || "—"}
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

        {/* Timeline Panel — slides in from right (overlay on Item 360 area) */}
        {timelineOpen && (
          <TimelinePanel
            activeBom={activeBom}
            activeBomMeta={activeBomMeta}
            events={project.isNew ? [] : (BOM_TIMELINE_EVENTS[activeBom] || [])}
            expandedEvent={expandedTimelineEvent}
            setExpandedEvent={setExpandedTimelineEvent}
            onClose={() => setTimelineOpen(false)}
          />
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
    <div className="bg-white border-l flex flex-col overflow-hidden"
      style={{ borderColor: C.border, width: 360, flex: "0 0 360px" }}>
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
  const sBomMissingIds = [3];
  const eBomLagIds = [5, 8];
  const missingIds =
    activeBom === "Q" && scenarioStep < 7 ? qBomMissingIds :
    activeBom === "S" && scenarioStep < 6 ? sBomMissingIds :
    activeBom === "E" ? eBomLagIds :
    [];
  const issueCount = missingIds.length;

  // Recent activity for this BOM (filter ACTIVITY_FEED scenarios up to current step)
  const recentActivity = useMemo(() => {
    const all = isHeroProject ? ACTIVITY_FEED.slice(0, scenarioStep + 1) : ACTIVITY_FEED;
    return all.slice(-3).reverse(); // last 3 messages, newest first
  }, [scenarioStep, isHeroProject]);

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

      {/* Recent Activity — items with itemRef are clickable */}
      {recentActivity.length > 0 && (
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wide mb-2" style={{ color: C.textSecondary }}>
            Recent Activity
          </div>
          <div className="space-y-2">
            {recentActivity.map((m) => {
              const canJump = m.itemRef && m.itemRef.id && setSelectedItemId;
              const Wrapper = canJump ? "button" : "div";
              return (
                <Wrapper
                  key={m.id}
                  {...(canJump ? {
                    onClick: () => setSelectedItemId(m.itemRef.id),
                    title: `Click to view ${m.itemRef.partName || "part"}`,
                  } : {})}
                  className={`w-full flex items-start gap-2 p-2 rounded-md text-left transition-all ${canJump ? "hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1" : ""}`}
                  style={{
                    backgroundColor: m.decision ? C.primarySoft : C.bg,
                    cursor: canJump ? "pointer" : "default",
                  }}>
                  <PersonaAvatar p={m.persona === "AI" ? "PM" : m.persona} size={20} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[11px] font-semibold" style={{ color: C.textPrimary }}>
                        {m.persona === "AI" ? "AI Assistant" : PERSONAS[m.persona]?.name}
                      </span>
                      <span className="text-[9px]" style={{ color: C.textDisabled }}>{m.ts}</span>
                      {canJump && (
                        <ArrowRight className="w-3 h-3 ml-auto shrink-0" style={{ color: C.textDisabled }} />
                      )}
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
                      <div className="text-[10px] mt-1 font-medium" style={{ color: C.primary }}>
                        → {m.itemRef.partName || "View part"}
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
  const sBomMissingIds = [3];
  const eBomLagIds = [5, 8];
  const isMissingInActiveBom =
    (activeBom === "Q" && qBomMissingIds.includes(item.id) && scenarioStep < 7) ||
    (activeBom === "S" && sBomMissingIds.includes(item.id) && scenarioStep < 6);
  const isLaggedInActiveBom = activeBom === "E" && eBomLagIds.includes(item.id);

  // BOM-specific action label for missing item
  const missingActionMap = {
    S: { label: "Select Supplier", icon: Building2, desc: "This part needs a supplier selection for the Sourcing BOM" },
    Q: { label: "Register for PPAP", icon: ShieldCheck, desc: "This part needs to be registered for PPAP qualification in the Quality BOM" },
    C: { label: "Add Cost Entry", icon: DollarSign, desc: "This part needs cost information in the Cost BOM" },
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

function SourcingTab({ item, scenarioStep }) {
  const isHero = item.id === 3;
  const rfqSent = isHero && scenarioStep >= 5;
  const responsesReceived = isHero && scenarioStep >= 6;
  const awarded = isHero && scenarioStep >= 7;

  // Hero uses scenario suppliers; other parts read from item.suppliers
  const suppliers = isHero
    ? [
        { name: "Samsung Display", risk: "Low", capability: 95, performance: 92, recommended: true, quote: 40.20 },
        { name: "BOE Technology", risk: "Med", capability: 88, performance: 85, recommended: true, quote: 38.90, awarded: awarded },
        { name: "LG Display", risk: "Low", capability: 90, performance: 89, recommended: true, quote: 41.00 },
      ]
    : (item.suppliers || []);

  if (suppliers.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-10 h-10 mx-auto mb-2" style={{ color: C.textDisabled }} />
        <div className="text-sm font-medium mb-1" style={{ color: C.textPrimary }}>No Supplier Selected</div>
        <div className="text-xs" style={{ color: C.textSecondary }}>No supplier has been selected for this part yet.</div>
      </div>
    );
  }

  // Generic part: highlight the awarded supplier (recommended + 1st)
  const generalAwardedName = !isHero && suppliers[0] ? suppliers[0].name : null;

  return (
    <div>
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
              <span className="font-medium">BOE Technology</span>  — -$2.90 vs Should-cost (best); Risk Med but Performance is solid
            </div>
          </div>
        </div>
      )}

      {/* Scenario action button (Hero only) */}
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
            {overallSync ? "Q-BOM ↔ Sourcing BOM Synced" : "Q-BOM Sync Needed"}
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
  // Hero (scenario part) gated by scenarioStep; other parts use full ACTIVITY_FEED
  const isHero = item.id === 3;
  const itemActivity = (isHero ? ACTIVITY_FEED.slice(0, scenarioStep + 1) : ACTIVITY_FEED)
    .filter((m) => m.itemRef && m.itemRef.id === item.id);
  return (
    <div className="space-y-3">
      {itemActivity.length === 0 ? (
        <div className="text-center py-8">
          <MessageSquare className="w-10 h-10 mx-auto mb-2" style={{ color: C.textDisabled }} />
          <div className="text-sm font-medium mb-1" style={{ color: C.textPrimary }}>No Activity</div>
          <div className="text-xs" style={{ color: C.textSecondary }}>
            Use the <MessageSquare className="w-3 h-3 inline" /> chat button above to start a thread
          </div>
        </div>
      ) : itemActivity.map((m) => (
        <div key={m.id} className="flex items-start gap-2 p-2 rounded-md"
          style={{ backgroundColor: m.decision ? C.primarySoft : "transparent" }}>
          <PersonaAvatar p={m.persona === "AI" ? "PM" : m.persona} size={24} />
          <div className="flex-1 text-xs">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="font-medium" style={{ color: C.textPrimary }}>
                {m.persona === "AI" ? "AI Assistant" : PERSONAS[m.persona]?.name}
              </span>
              <span style={{ color: C.textDisabled }}>{m.ts}</span>
              {m.decision && (
                <span className="text-[9px] px-1 py-0.5 rounded font-medium"
                  style={{ backgroundColor: C.primary, color: "white" }}>DECISION</span>
              )}
            </div>
            <div style={{ color: C.textSecondary }} className="leading-relaxed">{m.message}</div>
            {m.decisionText && (
              <div className="mt-1.5 p-1.5 rounded text-[10px] font-medium"
                style={{ backgroundColor: "white", color: C.primary, borderLeft: `2px solid ${C.primary}` }}>
                ✓ {m.decisionText}
              </div>
            )}
          </div>
        </div>
      ))}
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
  sourcing: "S",
  quality: "Q",
};

const BOM_TO_CHANNELS = {
  E: ["general", "design"],
  S: ["sourcing"],
  Q: ["quality"],
  C: ["cost"],
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
      <div className="p-3 border-t bg-white" style={{ borderColor: C.border }}>
        {/* Scope indicator */}
        <div className="text-[10px] mb-1.5 flex items-center gap-1.5" style={{ color: C.textSecondary }}>
          <CornerDownRight className="w-3 h-3" />
          Posting to <strong style={{ color: C.textPrimary }}>{composerCtx.label}</strong>
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
      </div>
    </div>
  );
}

// === CHAT MESSAGE — individual message render ===
function ChatMessage({ message: m, onOpenItem, showItemChip }) {
  const isAI = m.persona === "AI";

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
  { id: "notStarted", label: "Not Started", color: C.textDisabled, bg: C.bg, desc: "PPAP not requested" },
  { id: "requested", label: "Requested", color: C.warning, bg: C.warningLight, desc: "Sent request to supplier" },
  { id: "review", label: "In Review", color: C.info, bg: C.infoLight, desc: "Awaiting supplier response" },
  { id: "submitted", label: "Submitted", color: C.primary, bg: C.primaryLight, desc: "Pending review" },
  { id: "approved", label: "Approved", color: C.success, bg: C.successLight, desc: "Approved" },
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
              style={{ borderColor: C.borderLight, backgroundColor: stage.bg, minHeight: 500 }}>
              {/* Column Header */}
              <div className="px-3 py-2.5 flex items-center justify-between"
                style={{ borderBottom: `2px solid ${stage.color}` }}>
                <div>
                  <div className="text-xs font-bold flex items-center gap-1.5" style={{ color: stage.color }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage.color }} />
                    {stage.label}
                  </div>
                  <div className="text-[9px] mt-0.5" style={{ color: C.textSecondary }}>
                    {stage.desc}
                  </div>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: "white", color: stage.color }}>
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
                      style={{ borderColor: card.isHero ? C.warning : C.borderLight }}>
                      {/* Risk left bar */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l"
                        style={{ backgroundColor: riskColor(card.risk) }} />

                      <div className="p-2.5 pl-3">
                        {/* Top row: Title only (no HERO badge — border indicates priority) */}
                        <div className="min-w-0 mb-1">
                          <div className="text-xs font-semibold leading-snug" style={{ color: C.textPrimary }}>
                            {card.name}
                          </div>
                          <div className="text-[10px] font-mono mt-0.5" style={{ color: C.textDisabled }}>
                            {card.partId}
                          </div>
                        </div>

                        {/* Badges row */}
                        <div className="flex items-center gap-1 flex-wrap mb-2">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                            style={{ backgroundColor: C.primaryLight, color: C.primary }}>
                            Lv{card.ppapLevel}
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                            style={{
                              backgroundColor: card.risk === "High" ? C.errorLight : card.risk === "Med" ? C.warningLight : C.successLight,
                              color: riskColor(card.risk),
                            }}>
                            {card.risk}
                          </span>
                          {card.dDay !== null && card.stage !== "approved" && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded ml-auto"
                              style={{
                                backgroundColor: isOverdue ? C.error : isUrgent ? C.warning : C.bg,
                                color: isOverdue || isUrgent ? "white" : C.textSecondary,
                              }}>
                              {isOverdue ? `${Math.abs(card.dDay)}d overdue` : `D-${card.dDay}`}
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

                        {/* Progress bar */}
                        <div className="mb-1.5">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[9px]" style={{ color: C.textSecondary }}>
                              Deliverables
                            </span>
                            <span className="text-[9px] font-mono font-semibold" style={{ color: C.textPrimary }}>
                              {card.deliverableDone}/{card.deliverableTotal}
                            </span>
                          </div>
                          <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: C.bg }}>
                            <div className="h-full rounded-full"
                              style={{
                                width: `${(card.deliverableDone / card.deliverableTotal) * 100}%`,
                                backgroundColor: card.deliverableDone === card.deliverableTotal ? C.success : stage.color,
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

  // Auto-switch default BOM per persona
  useEffect(() => {
    const bomByPersona = { PM: "M", DE: "M", CM: "C", SM: "S", QM: "Q" };
    if (bomByPersona[activePersona]) setActiveBom(bomByPersona[activePersona]);
  }, [activePersona]);

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
                    />
                  )}
                  {view === "info" && (
                    <GeneralInfo
                      activeProjectCode={activeProjectCode}
                      activePersona={activePersona}
                      setActivePersona={setActivePersona}
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
