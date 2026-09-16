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
export const SESSION_PRINTER_ID = "p-north";

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

export const BUYER_PERSONA = {
  id: "b-ava",
  name: "Ava Lindqvist",
  role: "Head of Procurement",
  company: "Studio North",
};

const hist = (stage: StageKey, actor: string, actorRole: string, note: string): StageEvent => ({
  stage,
  actor,
  actorRole,
  at: NOW_AT,
  note,
});

export const INITIAL_JOBS: Job[] = [
  {
    id: "j1",
    code: "PTY-1041",
    title: "Aurora Heights - Launch Brochures",
    product: "Tri-fold brochure - A4 to DL",
    qty: 5000,
    value: 2340,
    buyerId: "b-ava",
    buyerName: "Ava Lindqvist",
    buyerCompany: "Studio North",
    managerId: "m-dale",
    printerId: "p-north",
    specs: { material: "170gsm silk - FSC", colors: "CMYK both sides", finish: "Tri-fold + matt lamination", size: "A4 to DL (99x210)" },
    proofImg: "/proofs/brochure.jpg",
    status: "on-track",
    custody: "held",
    stage: "printing",
    press: "ready",
    progress: 0,
    owner: { name: "Jon Weber - North Press", role: "Printer", action: "Plates mounted - start the litho run", waitingHrs: 3, slaHrs: 8 },
    eta: "Fri 15 Nov - 16:00",
    placedAt: "Fri 08 Nov - 09:12",
    history: [
      hist("quote", "Ava Lindqvist", "Buyer", "Quote Q-2210 accepted - $2,340"),
      hist("artwork", "Mara Ivers", "Studio", "6pp imposed - 3mm bleed - PDF/X-4"),
      hist("approval", "Ava Lindqvist", "Buyer", "Proof v3 approved"),
      hist("payment", "Ava Lindqvist", "Buyer", "$2,340 moved into Printy Custody"),
      hist("production", "Dale Carnegie", "Manager", "Assigned North Press Co. - accepted 09:02"),
    ],
    feed: [
      { at: "Tue - 09:02", who: "Jon Weber", text: "accepted the job - 170gsm allocated from rack 4", jobCode: "PTY-1041" },
      { at: "Today - 08:41", who: "Jon Weber", text: "plates mounted, ink keyed. Ready to run.", jobCode: "PTY-1041" },
    ],
  },
  {
    id: "j2",
    code: "PTY-1042",
    title: "Bloom & Co - Kraft Swing Tags",
    product: "Swing tag - 55x90 strung",
    qty: 1200,
    value: 410,
    buyerId: "b-ava",
    buyerName: "Ava Lindqvist",
    buyerCompany: "Studio North",
    managerId: "m-robert",
    printerId: null,
    specs: { material: "400gsm uncoated kraft", colors: "1c black + white ink", finish: "Drilled and strung - round corners", size: "55x90 mm" },
    proofImg: "/proofs/swing-tags.jpg",
    status: "at-risk",
    custody: "awaiting",
    stage: "approval",
    press: null,
    progress: null,
    owner: { name: "Ava Lindqvist", role: "Buyer", action: "Approve artwork proof v2", waitingHrs: 19, slaHrs: 24 },
    eta: "Tue 19 Nov",
    placedAt: "Tue 12 Nov - 16:20",
    history: [hist("quote", "Ava Lindqvist", "Buyer", "Quote Q-2216 accepted - $410"), hist("artwork", "Mara Ivers", "Studio", "Proof v2 - tagline kerning corrected")],
    feed: [{ at: "Wed - 16:47", who: "Mara Ivers", text: "uploaded proof v2 - waiting on buyer approval", jobCode: "PTY-1042" }],
  },
  {
    id: "j3",
    code: "PTY-1043",
    title: "Meridian Coffee - Cup Sleeves",
    product: "Cup sleeve - flexo 2c",
    qty: 20000,
    value: 1860,
    buyerId: "b-ava",
    buyerName: "Ava Lindqvist",
    buyerCompany: "Studio North",
    managerId: "m-mj",
    printerId: null,
    specs: { material: "300gsm recycled kraft", colors: "2c flexo (PANTONE 175C)", finish: "Die-cut and glued", size: "12-16oz taper" },
    status: "on-track",
    custody: "awaiting",
    stage: "payment",
    press: null,
    progress: null,
    owner: { name: "Ava Lindqvist", role: "Buyer", action: "Release payment of $1,860", waitingHrs: 2, slaHrs: 4 },
    eta: "Mon 18 Nov",
    placedAt: "Wed 13 Nov - 15:02",
    history: [hist("quote", "Ava Lindqvist", "Buyer", "Quote Q-2219 accepted - $1,860"), hist("artwork", "Mara Ivers", "Studio", "Flexo separations - 2 plates"), hist("approval", "Ava Lindqvist", "Buyer", "Approved v1 first pass")],
    feed: [{ at: "Today - 09:38", who: "Ava Lindqvist", text: "approved artwork - job moved to payment", jobCode: "PTY-1043" }],
  },
  {
    id: "j4",
    code: "PTY-1044",
    title: "Atlas Robotics - Welcome Boxes",
    product: "Rigid conference box - foiled",
    qty: 800,
    value: 4720,
    buyerId: "b-sara",
    buyerName: "Sara Okafor",
    buyerCompany: "Atlas Robotics",
    managerId: "m-eric",
    printerId: null,
    specs: { material: "2mm greyboard - 157gsm wrap", colors: "CMYK + soft-touch", finish: "Gold foil - magnetic close", size: "320x240x80 mm" },
    status: "overdue",
    custody: "held",
    stage: "production",
    press: null,
    progress: null,
    owner: { name: "Eric Ries", role: "Manager", action: "Assign a printer - capacity hold expires", waitingHrs: 51, slaHrs: 24 },
    eta: "Wed 20 Nov - at risk",
    placedAt: "Mon 11 Nov - 16:44",
    history: [hist("quote", "Sara Okafor", "Buyer", "Quote Q-2204 accepted - $4,720"), hist("artwork", "Mara Ivers", "Studio", "Dieline K-8 wrapped - foil layer split"), hist("approval", "Sara Okafor", "Buyer", "Approved v1"), hist("payment", "Sara Okafor", "Buyer", "$4,720 moved into Printy Custody")],
    feed: [{ at: "Tue - 09:00", who: "Printy SLA", text: "production assignment breached 24h SLA - escalated", jobCode: "PTY-1044" }],
  },
  {
    id: "j5",
    code: "PTY-1045",
    title: "Lumen Learning - Workbooks",
    product: "PUR workbook - 128pp",
    qty: 3000,
    value: 4110,
    buyerId: "b-tomas",
    buyerName: "Tomas Lind",
    buyerCompany: "Lumen Learning",
    managerId: "m-peter",
    printerId: "p-kobo",
    specs: { material: "90gsm uncoated - 300gsm cover", colors: "1c text - CMYK cover", finish: "PUR bound - trimmed", size: "A4 - 128pp" },
    status: "on-track",
    custody: "held",
    stage: "delivery",
    press: null,
    progress: null,
    owner: { name: "Marta K. - SwiftLine", role: "Courier", action: "Deliver to Lumen HQ - dock 4 - 18 pallets", waitingHrs: 5, slaHrs: 12 },
    eta: "Today - 16:00",
    placedAt: "Thu 07 Nov - 11:00",
    history: [hist("quote", "Tomas Lind", "Buyer", "Quote Q-2190 accepted - $4,110"), hist("artwork", "Studio Ost", "Studio", "128pp imposed 16pp signatures"), hist("approval", "Tomas Lind", "Buyer", "Approved v2"), hist("payment", "Tomas Lind", "Buyer", "$4,110 moved into Printy Custody"), hist("production", "Peter Thiel", "Manager", "Assigned Kobo Bindery - accepted 13:05"), hist("printing", "Ren Sato", "Printer", "3,000 blocks printed - 2 shifts"), hist("finishing", "Ren Sato", "Printer", "PUR bound - 3-knife trimmed"), hist("qc", "Ren Sato", "Printer", "Passed - pull-test 8.2N - zero miscollations")],
    feed: [{ at: "Today - 06:32", who: "Marta K.", text: "collected 18 pallets - ETA dock 4 by 16:00", jobCode: "PTY-1045" }],
  },
  {
    id: "j6",
    code: "PTY-1046",
    title: "Verve Fitness - Launch Flyers",
    product: "A5 flyer - gloss",
    qty: 10000,
    value: 890,
    buyerId: "b-nadia",
    buyerName: "Nadia Petrova",
    buyerCompany: "Verve Fitness",
    managerId: "m-dale",
    printerId: "p-halftone",
    specs: { material: "130gsm gloss", colors: "CMYK - brand magenta critical", finish: "Trim and band 250s", size: "A5" },
    status: "disputed",
    custody: "held",
    dispute: { reason: "Buyer flagged colour shift on brand magenta - reprint or refund requested", openedBy: "Nadia Petrova - Verve Fitness", at: "Wed 13 Nov - 18:22", amount: 890 },
    stage: "finishing",
    press: "hold",
    progress: null,
    owner: { name: "Dale Carnegie", role: "Manager", action: "Resolve colour dispute with Halftone Works", waitingHrs: 41, slaHrs: 12 },
    eta: "On hold",
    placedAt: "Sat 09 Nov - 10:11",
    history: [hist("quote", "Nadia Petrova", "Buyer", "Quote Q-2194 accepted - $890"), hist("artwork", "Mara Ivers", "Studio", "Brand magenta locked - GRACoL profile"), hist("approval", "Nadia Petrova", "Buyer", "Approved v1"), hist("payment", "Nadia Petrova", "Buyer", "$890 moved into Printy Custody"), hist("production", "Dale Carnegie", "Manager", "Assigned Halftone Works - accepted 15:12"), hist("printing", "Iris Kohler", "Printer", "10,000 flyers printed on Indigo")],
    feed: [{ at: "Wed - 18:22", who: "Nadia Petrova", text: "opened dispute - magenta shifted on trim batch 3", jobCode: "PTY-1046" }],
  },
  {
    id: "j7",
    code: "PTY-1047",
    title: "Field Notes - Zine No. 9",
    product: "Perfect-bound zine - 64pp",
    qty: 2500,
    value: 1980,
    buyerId: "b-ravi",
    buyerName: "Ravi Anand",
    buyerCompany: "Field Notes Mag",
    managerId: "m-robert",
    printerId: "p-kobo",
    specs: { material: "100gsm recycled", colors: "2c + CMYK cover", finish: "Perfect bound", size: "170x240 mm" },
    status: "completed",
    custody: "released",
    stage: "completed",
    press: null,
    progress: null,
    owner: { name: "Printy Custody", role: "Escrow", action: "Funds released - job archived", waitingHrs: 0, slaHrs: 0 },
    eta: "Delivered Tue 12 Nov",
    placedAt: "Fri 01 Nov - 09:00",
    history: [hist("quote", "Ravi Anand", "Buyer", "Quote Q-2155 accepted - $1,980"), hist("artwork", "Studio Ost", "Studio", "64pp - cover foil split"), hist("approval", "Ravi Anand", "Buyer", "Approved v1"), hist("payment", "Ravi Anand", "Buyer", "$1,980 moved into Printy Custody"), hist("production", "Robert Cialdini", "Manager", "Assigned Kobo Bindery - accepted 12:40"), hist("printing", "Ren Sato", "Printer", "2,500 blocks - night shift"), hist("finishing", "Ren Sato", "Printer", "Bound and trimmed 170x240"), hist("qc", "Ren Sato", "Printer", "Passed - sample pull clean"), hist("delivery", "Marta K.", "Courier", "Signed at Field Notes studio"), hist("completed", "Printy Custody", "Escrow", "Released $1,980 to Kobo Bindery")],
    feed: [],
  },
];

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
  "on-track": { label: "On track", color: "#2FBF71", soft: "rgba(47,191,113,.14)" },
  "at-risk": { label: "At risk", color: "#F5A623", soft: "rgba(245,166,35,.14)" },
  overdue: { label: "Overdue", color: "#FF6B4A", soft: "rgba(255,107,74,.14)" },
  disputed: { label: "Disputed", color: "#FB4D6D", soft: "rgba(251,77,109,.16)" },
  completed: { label: "Completed", color: "#9BA3B4", soft: "rgba(155,163,180,.14)" },
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
  dark: boolean;
  glow: string;
  grain: number;
}

export const ROLE_META: Record<Role, { label: string; call: string; blurb: string; theme: RoleTheme }> = {
  buyer: {
    label: "Client",
    call: "REASSURANCE",
    blurb: "Calm, clear, paper-light. The client only sees their orders and what they must do next.",
    theme: { bg: "#F4EFE4", panel: "#FDFBF6", panel2: "#EEE7DA", ink: "#1B1510", sub: "rgba(27,21,16,.58)", line: "rgba(27,21,16,.13)", accent: "#C2410C", accentInk: "#FFFFFF", dark: false, glow: "rgba(194,65,12,.18)", grain: 0.05 },
  },
  manager: {
    label: "Print Manager",
    call: "CONTROL",
    blurb: "Mission control for every job. Ball ownership, SLA clocks and risk at a glance.",
    theme: { bg: "#0C0A08", panel: "#141110", panel2: "#1C1816", ink: "#F2ECE4", sub: "rgba(242,236,228,.55)", line: "rgba(242,236,228,.09)", accent: "#FF8A3D", accentInk: "#2A1102", dark: true, glow: "rgba(255,138,61,.16)", grain: 0.045 },
  },
  printer: {
    label: "Printer",
    call: "PRODUCTION",
    blurb: "A shop-floor handheld. Big type, big buttons, one clear next action.",
    theme: { bg: "#0E0A05", panel: "#17120B", panel2: "#1F1811", ink: "#F7EFDF", sub: "rgba(247,239,223,.55)", line: "rgba(247,239,223,.1)", accent: "#FFB020", accentInk: "#241600", dark: true, glow: "rgba(255,176,32,.18)", grain: 0.05 },
  },
  admin: {
    label: "Admin",
    call: "OVERSIGHT",
    blurb: "The whole marketplace: pulse, people, printers, money and disputes.",
    theme: { bg: "#0B0706", panel: "#140D0B", panel2: "#1C1310", ink: "#F6EAE4", sub: "rgba(246,234,228,.55)", line: "rgba(246,234,228,.09)", accent: "#F2622E", accentInk: "#FFFFFF", dark: true, glow: "rgba(242,98,46,.18)", grain: 0.045 },
  },
};

/* public (signed-out) canvas — paper light, same family as the buyer view */
export const PUBLIC_THEME: RoleTheme = {
  bg: "#F4EFE4",
  panel: "#FDFBF6",
  panel2: "#EEE7DA",
  ink: "#1B1510",
  sub: "rgba(27,21,16,.58)",
  line: "rgba(27,21,16,.13)",
  accent: "#C2410C",
  accentInk: "#FFFFFF",
  dark: false,
  glow: "rgba(194,65,12,.18)",
  grain: 0.05,
};