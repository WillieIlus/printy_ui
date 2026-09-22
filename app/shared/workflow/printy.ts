export type StageKey =
  | "quote" | "artwork" | "approval" | "payment" | "production"
  | "printing" | "finishing" | "qc" | "delivery" | "completed";

export type Status = "on-track" | "at-risk" | "overdue" | "disputed" | "completed";
export type Custody = "awaiting" | "held" | "released";
export type Role = "buyer" | "manager" | "printer" | "admin";
export type PressState = "accept" | "ready" | "active" | "hold" | null;

export interface StageEvent {
  stage: StageKey;
  actor: string;
  actorRole: string;
  at: string;
  note?: string;
  took?: string;
}

export interface FeedEntry {
  at: string;
  who: string;
  text: string;
  jobCode: string;
}

export interface Owner {
  name: string;
  role: string;
  action: string;
  waitingHrs: number;
  slaHrs: number;
}

export interface Manager {
  id: string;
  name: string;
  initials: string;
  tag: string;
  onTime: number;
  hue: number;
}

export interface Printer {
  id: string;
  name: string;
  contact: string;
  city: string;
  caps: string[];
  verified: boolean;
  rating: number;
  jobsDone: number;
  onTime: number;
  initials: string;
  hue: number;
}

export interface Job {
  id: string;
  code: string;
  title: string;
  product: string;
  qty: number;
  value: number;
  buyerId: string;
  buyerName: string;
  buyerCompany: string;
  managerId: string;
  printerId: string | null;
  specs: { material: string; colors: string; finish: string; size: string };
  proofImg?: string;
  status: Status;
  custody: Custody;
  dispute?: { reason: string; openedBy: string; at: string; amount: number; resolved?: boolean };
  stage: StageKey;
  press: PressState;
  progress: number | null;
  owner: Owner;
  eta: string;
  placedAt: string;
  history: StageEvent[];
  feed: FeedEntry[];
}

export const STAGES: { key: StageKey; label: string; ownerRole: string; sla: number }[] = [
  { key: "quote", label: "Quote", ownerRole: "Buyer", sla: 24 },
  { key: "artwork", label: "Artwork", ownerRole: "Studio", sla: 24 },
  { key: "approval", label: "Approval", ownerRole: "Buyer", sla: 24 },
  { key: "payment", label: "Payment", ownerRole: "Buyer", sla: 4 },
  { key: "production", label: "Production", ownerRole: "Manager", sla: 24 },
  { key: "printing", label: "Printing", ownerRole: "Printer", sla: 16 },
  { key: "finishing", label: "Finishing", ownerRole: "Printer", sla: 12 },
  { key: "qc", label: "Quality Control", ownerRole: "Printer", sla: 8 },
  { key: "delivery", label: "Delivery", ownerRole: "Courier", sla: 12 },
  { key: "completed", label: "Completed", ownerRole: "Custody", sla: 0 },
];

export const NOW_AT = "Today - 11:47";

export const stIdx = (s: StageKey) => STAGES.findIndex((x) => x.key === s);
export const nextStage = (j: Job) => STAGES[stIdx(j.stage) + 1] ?? null;
export const money = (n: number) => "$" + n.toLocaleString("en-US");

export const MANAGERS: Manager[] = [
  { id: "m-dale", name: "Dale Carnegie", initials: "DC", tag: "Client whisperer - escalations", onTime: 96, hue: 36 },
  { id: "m-mj", name: "MJ DeMarco", initials: "MD", tag: "Fastlane runs - speed", onTime: 92, hue: 200 },
  { id: "m-robert", name: "Robert Cialdini", initials: "RC", tag: "Approvals and persuasion", onTime: 89, hue: 280 },
  { id: "m-eric", name: "Eric Ries", initials: "ER", tag: "Lean batches - MVPs", onTime: 84, hue: 150 },
  { id: "m-peter", name: "Peter Thiel", initials: "PT", tag: "Zero-to-one launches", onTime: 97, hue: 340 },
];

export const PRINTERS: Printer[] = [
  { id: "p-north", name: "North Press Co.", contact: "Jon Weber", city: "Porto", caps: ["Offset", "Digital", "Large format"], verified: true, rating: 4.9, jobsDone: 212, onTime: 98, initials: "NP", hue: 32 },
  { id: "p-halftone", name: "Halftone Works", contact: "Iris Kohler", city: "Gdansk", caps: ["Digital", "Short run"], verified: true, rating: 4.7, jobsDone: 168, onTime: 94, initials: "HW", hue: 190 },
  { id: "p-kobo", name: "Kobo Bindery", contact: "Ren Sato", city: "Lyon", caps: ["Binding", "Finishing", "Foiling"], verified: true, rating: 4.8, jobsDone: 143, onTime: 97, initials: "KB", hue: 265 },
  { id: "p-magenta", name: "Magenta Mills", contact: "Lena Marchetti", city: "Milan", caps: ["Flexo", "Packaging"], verified: false, rating: 4.2, jobsDone: 3, onTime: 0, initials: "MM", hue: 318 },
];

export const mgr = (id: string) => MANAGERS.find((m) => m.id === id)!;
export const prn = (id: string | null) => PRINTERS.find((p) => p.id === id) ?? null;

const hist = (stage: StageKey, actor: string, actorRole: string, note: string): StageEvent => ({
  stage,
  actor,
  actorRole,
  at: NOW_AT,
  note,
});

const log = (job: Job, who: string, text: string): FeedEntry[] => [
  { at: NOW_AT, who, text, jobCode: job.code },
  ...job.feed,
];

export function approveArtwork(job: Job): Job {
  if (job.stage !== "approval") return job;
  return {
    ...job,
    status: job.status === "at-risk" ? "on-track" : job.status,
    stage: "payment",
    owner: { name: job.buyerName, role: "Buyer", action: `Release payment of ${money(job.value)}`, waitingHrs: 0, slaHrs: 4 },
    history: [...job.history, hist("approval", job.buyerName, "Buyer", "Artwork approved - proof final")],
    feed: log(job, job.buyerName, "approved the artwork - job moved to payment"),
  };
}

export function requestChanges(job: Job): Job {
  if (job.stage !== "approval") return job;
  return {
    ...job,
    status: "at-risk",
    stage: "artwork",
    owner: { name: "Mara Ivers - Studio", role: "Studio", action: "Revise artwork - proof v3", waitingHrs: 0, slaHrs: 24 },
    feed: log(job, job.buyerName, "requested changes - job returned to Studio for proof v3"),
  };
}

export function payJob(job: Job): Job {
  if (job.stage !== "payment") return job;
  const manager = mgr(job.managerId);
  return {
    ...job,
    custody: "held",
    stage: "production",
    owner: { name: manager.name, role: "Manager", action: "Assign a printer to the job", waitingHrs: 0, slaHrs: 24 },
    history: [...job.history, hist("payment", job.buyerName, "Buyer", `${money(job.value)} moved into Printy Custody`)],
    feed: log(job, job.buyerName, `paid ${money(job.value)} - funds now held in Printy Custody`),
  };
}

export function assignPrinter(job: Job, printerId: string): Job {
  if (job.stage !== "production" || job.printerId) return job;
  const p = prn(printerId)!;
  const m = mgr(job.managerId);
  return {
    ...job,
    printerId,
    status: job.status === "overdue" ? "on-track" : job.status,
    stage: "printing",
    press: "accept",
    owner: { name: `${p.contact} - ${p.name}`, role: "Printer", action: "Accept job request", waitingHrs: 0, slaHrs: 6 },
    history: [...job.history, hist("production", m.name, "Manager", `Brief, dielines and assets sent to ${p.name}`)],
    feed: log(job, m.name, `assigned ${p.name} - waiting on printer acceptance`),
  };
}

export function advancePress(job: Job): Job {
  const p = prn(job.printerId);
  const who = p ? p.contact : "Printer";
  const pname = p ? ` - ${p.name}` : "";

  if (job.stage === "printing" && job.press === "accept") {
    return { ...job, press: "ready", owner: { name: who + pname, role: "Printer", action: "Plates and paper staged - start the run", waitingHrs: 0, slaHrs: 8 }, feed: log(job, who, "accepted the job - plates, paper and ink allocated") };
  }

  if (job.stage === "printing" && job.press === "ready") {
    return { ...job, press: "active", progress: 14, owner: { name: who + pname, role: "Printer", action: "Press running - make-ready sheets clean", waitingHrs: 0, slaHrs: 16 }, feed: log(job, who, "started the press - make-ready approved") };
  }

  if (job.stage === "printing" && job.press === "active") {
    return { ...job, stage: "finishing", press: "ready", progress: null, owner: { name: who + pname, role: "Printer", action: `Start finishing - ${job.specs.finish.split("-")[0]!.trim().toLowerCase()}`, waitingHrs: 0, slaHrs: 12 }, history: [...job.history, hist("printing", who, "Printer", `${job.qty.toLocaleString()} units off press - register held`) ], feed: log(job, who, "printing complete - skid moved to finishing bay") };
  }

  if (job.stage === "finishing" && job.press === "ready") {
    return { ...job, press: "active", progress: 32, owner: { name: who + pname, role: "Printer", action: "Finishing line running - first-offs checked", waitingHrs: 0, slaHrs: 12 }, feed: log(job, who, "started finishing - first-offs signed off") };
  }

  if (job.stage === "finishing" && job.press === "active") {
    return { ...job, stage: "qc", press: "ready", progress: null, owner: { name: who + pname, role: "Printer", action: "Run quality control - pull samples", waitingHrs: 0, slaHrs: 8 }, history: [...job.history, hist("finishing", who, "Printer", job.specs.finish)], feed: log(job, who, "finishing complete - units banded and queued for QC") };
  }

  if (job.stage === "qc" && job.press === "ready") {
    return { ...job, press: "active", progress: 60, owner: { name: who + pname, role: "Printer", action: "Sampling 1-in-200 - densitometer on bench", waitingHrs: 0, slaHrs: 8 }, feed: log(job, who, "QC sampling started") };
  }

  if (job.stage === "qc" && job.press === "active") {
    return { ...job, stage: "delivery", press: null, progress: null, owner: { name: "Marta K. - SwiftLine", role: "Courier", action: "Collect from dispatch bay 2 and deliver", waitingHrs: 0, slaHrs: 12 }, eta: "Tomorrow - 14:00", history: [...job.history, hist("qc", who, "Printer", "Passed - zero defects in pull")], feed: log(job, who, "QC passed - pallets wrapped, courier booked") };
  }

  return job;
}

export function confirmDelivery(job: Job): Job {
  if (job.stage !== "delivery") return job;
  const p = prn(job.printerId);
  return {
    ...job,
    stage: "completed",
    status: "completed",
    custody: "released",
    owner: { name: "Printy Custody", role: "Escrow", action: "Funds released - job archived", waitingHrs: 0, slaHrs: 0 },
    eta: "Delivered today",
    history: [...job.history, hist("delivery", "Marta K.", "Courier", "Delivered and signed at buyer dock"), hist("completed", "Printy Custody", "Escrow", `Released ${money(job.value)} to ${p?.name ?? "printer"}`)],
    feed: log(job, job.buyerName, `confirmed delivery - ${money(job.value)} released from custody`),
  };
}

export function resolveDispute(job: Job): Job {
  if (job.status !== "disputed") return job;
  const m = mgr(job.managerId);
  return {
    ...job,
    status: "on-track",
    dispute: job.dispute ? { ...job.dispute, resolved: true } : undefined,
    press: "ready",
    eta: "Reprint - Fri 22 Nov",
    owner: { name: m.name, role: "Manager", action: "Supervise reprint at night rate - verified profile", waitingHrs: 0, slaHrs: 24 },
    feed: log(job, m.name, "dispute resolved - reprint approved"),
  };
}

export function nudge(job: Job, by: string): Job {
  return { ...job, feed: log(job, by, `nudged ${job.owner.name} - ${job.owner.action}`) };
}

export const ACTIVE_STATUSES: Status[] = ["on-track", "at-risk", "overdue", "disputed"];

export function pulse(jobs: Job[]) {
  return {
    total: jobs.length,
    onTrack: jobs.filter((j) => j.status === "on-track").length,
    atRisk: jobs.filter((j) => j.status === "at-risk").length,
    overdue: jobs.filter((j) => j.status === "overdue").length,
    disputed: jobs.filter((j) => j.status === "disputed").length,
    completed: jobs.filter((j) => j.status === "completed").length,
  };
}

export function custody(jobs: Job[]) {
  const sum = (f: (j: Job) => boolean) => jobs.filter(f).reduce((a, j) => a + j.value, 0);
  return {
    held: sum((j) => j.custody === "held"),
    released: sum((j) => j.custody === "released"),
    awaiting: sum((j) => j.custody === "awaiting"),
  };
}

export function managerStats(jobs: Job[], id: string) {
  const mine = jobs.filter((j) => j.managerId === id);
  return {
    jobs: mine,
    active: mine.filter((j) => ACTIVE_STATUSES.includes(j.status)).length,
    risk: mine.filter((j) => j.status === "at-risk" || j.status === "overdue").length,
    disputed: mine.filter((j) => j.status === "disputed").length,
    value: mine.filter((j) => ACTIVE_STATUSES.includes(j.status)).reduce((a, j) => a + j.value, 0),
  };
}

export const slaRatio = (j: Job) => (j.owner.slaHrs ? j.owner.waitingHrs / j.owner.slaHrs : 0);
export const slaTone = (j: Job): "ok" | "tight" | "breach" => {
  const r = slaRatio(j);
  return r >= 1 ? "breach" : r >= 0.65 ? "tight" : "ok";
};

export const STATUS_META: Record<Status, { label: string; color: string; soft: string }> = {
  "on-track": { label: "On track", color: "#0E7A45", soft: "rgba(47,191,113,.16)" },
  "at-risk": { label: "At risk", color: "#B45309", soft: "rgba(245,166,35,.16)" },
  overdue: { label: "Overdue", color: "#C2410C", soft: "rgba(255,107,74,.16)" },
  disputed: { label: "Disputed", color: "#C81E44", soft: "rgba(251,77,109,.18)" },
  completed: { label: "Completed", color: "#6B7280", soft: "rgba(155,163,180,.16)" },
};

export function pressLabel(j: Job): string | null {
  if (j.stage === "printing" && j.press === "accept") return "Accept job";
  if (j.stage === "printing" && j.press === "ready") return "Start printing";
  if (j.stage === "printing" && j.press === "active") return "Printing complete";
  if (j.stage === "finishing" && j.press === "ready") return "Start finishing";
  if (j.stage === "finishing" && j.press === "active") return "Finishing complete";
  if (j.stage === "qc" && j.press === "ready") return "Start QC";
  if (j.stage === "qc" && j.press === "active") return "QC passed";
  return null;
}

export type ActionId =
  | "approve" | "request-changes" | "pay" | "confirm-delivery"
  | "nudge" | "resolve-dispute" | "press-advance" | "assign"
  | "review-proof" | "toast" | "open-job";
export type Act = (a: ActionId, job: Job, payload?: string) => void;

export interface RoleTheme {
  bg: string;
  panel: string;
  panel2: string;
  ink: string;
  sub: string;
  line: string;
  accent: string;
  accentInk: string;
  glow: string;
  grain: number;
}

export const ROLE_META: Record<Role, { label: string; call: string; blurb: string; theme: RoleTheme }> = {
  buyer: {
    label: "Client",
    call: "REASSURANCE",
    blurb: "Calm, clear, paper-light. The client only sees their orders and what they must do next.",
    theme: { bg: "#F4EFE4", panel: "#FDFBF6", panel2: "#EAE0CB", ink: "#1B1510", sub: "rgba(27,21,16,.74)", line: "rgba(27,21,16,.24)", accent: "#C2410C", accentInk: "#FFFFFF", glow: "rgba(194,65,12,.18)", grain: 0.05 },
  },
  manager: {
    label: "Print Manager",
    call: "CONTROL",
    blurb: "Mission control for every job. Ball ownership, SLA clocks and risk at a glance.",
    theme: { bg: "#F4EFE4", panel: "#FDFBF6", panel2: "#EAE0CB", ink: "#1B1510", sub: "rgba(27,21,16,.74)", line: "rgba(27,21,16,.24)", accent: "#2563EB", accentInk: "#FFFFFF", glow: "rgba(37,99,235,.18)", grain: 0.05 },
  },
  printer: {
    label: "Printer",
    call: "PRODUCTION",
    blurb: "A shop-floor handheld. Big type, big buttons, one clear next action.",
    theme: { bg: "#F4EFE4", panel: "#FDFBF6", panel2: "#EAE0CB", ink: "#1B1510", sub: "rgba(27,21,16,.74)", line: "rgba(27,21,16,.24)", accent: "#047857", accentInk: "#FFFFFF", glow: "rgba(4,120,87,.18)", grain: 0.05 },
  },
  admin: {
    label: "Admin",
    call: "OVERSIGHT",
    blurb: "The whole marketplace: pulse, people, printers, money and disputes.",
    theme: { bg: "#F4EFE4", panel: "#FDFBF6", panel2: "#EAE0CB", ink: "#1B1510", sub: "rgba(27,21,16,.74)", line: "rgba(27,21,16,.24)", accent: "#E11D48", accentInk: "#FFFFFF", glow: "rgba(225,29,72,.18)", grain: 0.05 },
  },
};

/* public (signed-out) canvas — paper light, same family as the buyer view */
export const PUBLIC_THEME: RoleTheme = {
  bg: "#F4EFE4",
  panel: "#FDFBF6",
  panel2: "#EAE0CB",
  ink: "#1B1510",
  sub: "rgba(27,21,16,.74)",
  line: "rgba(27,21,16,.24)",
  accent: "#C2410C",
  accentInk: "#FFFFFF",
  glow: "rgba(194,65,12,.18)",
  grain: 0.05,
};