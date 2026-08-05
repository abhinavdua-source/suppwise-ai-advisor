export type Supplement = {
  id: string;
  name: string;
  icon: string;
  category: string;
  dose: string;
  timing: string;
  routine: "Morning Routine" | "Evening Routine";
  daysLeft: number;
  monthlyCost: number;
  reminder: boolean;
  tone: "primary" | "secondary" | "tertiary";
};

export const INITIAL_STACK: Supplement[] = [
  {
    id: "creatine",
    name: "Creatine Monohydrate",
    icon: "fitness_center",
    category: "Energy / ATP",
    dose: "5g daily",
    timing: "Morning",
    routine: "Morning Routine",
    daysLeft: 12,
    monthlyCost: 9,
    reminder: true,
    tone: "primary",
  },
  {
    id: "d3k2",
    name: "Vitamin D3 + K2",
    icon: "wb_sunny",
    category: "Bone Health",
    dose: "5000 IU",
    timing: "With breakfast",
    routine: "Morning Routine",
    daysLeft: 24,
    monthlyCost: 12,
    reminder: true,
    tone: "secondary",
  },
  {
    id: "iron",
    name: "Iron Bisglycinate",
    icon: "medication",
    category: "Oxygen Transport",
    dose: "25 mg",
    timing: "Morning, fasted",
    routine: "Morning Routine",
    daysLeft: 30,
    monthlyCost: 8,
    reminder: false,
    tone: "tertiary",
  },
];

export type ProtocolItem = {
  id: string;
  name: string;
  icon: string;
  stars: number;
  evidenceLabel: string;
  match: number;
  rationale: string;
  dose: string;
  timing: string;
  expected: string;
  sideEffects: string;
  interactions: string;
  avoid: string;
  category: string;
  tone: Supplement["tone"];
  routine: Supplement["routine"];
  studies: number;
  consensus: string;
  plain: string;
  references: { label: string; source: string }[];
};

export const PROTOCOL: ProtocolItem[] = [
  {
    id: "mag-threonate",
    name: "Magnesium L-Threonate",
    icon: "science",
    stars: 5,
    evidenceLabel: "High Evidence",
    match: 94,
    rationale:
      "Specifically crosses the blood-brain barrier to enhance synaptic plasticity. Addresses your REM deficiency while mitigating cortisol spikes.",
    dose: "1,000 mg",
    timing: "60m Pre-Sleep",
    expected: "2–4 weeks",
    sideEffects: "Mild drowsiness, loose stools at higher doses.",
    interactions: "May reduce absorption of certain antibiotics if taken together.",
    avoid: "Impaired kidney function; consult a clinician first.",
    category: "Sleep / Cognition",
    tone: "primary",
    routine: "Evening Routine",
    studies: 18,
    consensus:
      "Consistent evidence that magnesium repletion improves sleep architecture, with threonate showing the strongest CNS uptake in preclinical models.",
    plain:
      "Magnesium helps your nervous system shift down at night. The threonate form reaches the brain better than most, which is why it is used for sleep depth and memory rather than muscle cramps.",
    references: [
      { label: "Magnesium supplementation and sleep quality: a meta-analysis", source: "PubMed" },
      { label: "L-Threonate and synaptic density in adults over 30", source: "Clinical Trial" },
    ],
  },
  {
    id: "iron-bisglycinate",
    name: "Iron Bisglycinate",
    icon: "medication",
    stars: 4,
    evidenceLabel: "Mod Evidence",
    match: 82,
    rationale:
      "Highly bioavailable form of iron to address borderline ferritin levels without typical gastrointestinal distress.",
    dose: "25 mg",
    timing: "Morning, Fasted",
    expected: "6–12 weeks",
    sideEffects: "Occasional nausea; darker stools are expected and harmless.",
    interactions: "Take 2 hours apart from calcium, coffee and tea.",
    avoid: "Anyone with haemochromatosis or iron overload.",
    category: "Oxygen Transport",
    tone: "tertiary",
    routine: "Morning Routine",
    studies: 26,
    consensus:
      "Repleting low ferritin reliably reduces fatigue in people with borderline stores, even when haemoglobin is normal.",
    plain:
      "Ferritin is your iron savings account. When it runs low your cells make energy less efficiently, which shows up as afternoon fatigue long before anaemia does.",
    references: [
      { label: "Iron supplementation for unexplained fatigue in non-anaemic women", source: "PubMed" },
      { label: "Bisglycinate vs sulfate tolerability trial", source: "Clinical Trial" },
    ],
  },
];

export const DRIVERS = [
  {
    icon: "bedtime_off",
    title: "REM Sleep Deficiency",
    subtitle: "Disrupted architecture",
    level: "High",
    confidence: 88,
    tone: "error" as const,
  },
  {
    icon: "bloodtype",
    title: "Suboptimal Ferritin",
    subtitle: "Borderline depletion",
    level: "Moderate",
    confidence: 65,
    tone: "secondary" as const,
  },
  {
    icon: "water_drop",
    title: "Mild Dehydration",
    subtitle: "Morning latency",
    level: "Low",
    confidence: 35,
    tone: "outline" as const,
  },
];

export const BEHAVIOURS = [
  {
    title: "Temperature Regulated Sleep",
    body: "Lower bedroom ambient temperature to 65°F (18°C) to facilitate the core body temperature drop required for deep sleep phases.",
  },
  {
    title: "Morning Sunlight Exposure",
    body: "10–15 minutes of direct sunlight viewing within 30 minutes of waking to anchor your circadian cortisol rhythm.",
  },
  {
    title: "Electrolyte Hydration",
    body: "Front-load 500ml water with sodium and potassium immediately on waking, before any caffeine.",
  },
];

export const NUTRITION = {
  increase: ["Red meat or lentils", "Leafy greens", "Pumpkin seeds", "Vitamin C with iron meals"],
  reduce: ["Coffee within 90m of waking", "Alcohol after 8pm", "Refined carbs at lunch"],
  macros: "Protein 1.8 g/kg · Carbs 3.5 g/kg · Fat 0.9 g/kg",
};

export const BIOMARKERS = [
  {
    name: "Vitamin D",
    icon: "wb_sunny",
    value: "22",
    unit: "ng/mL",
    status: "SUB-OPTIMAL" as const,
    percent: 30,
    note: "Levels indicate deficiency. Impacting bone density and immune function.",
    advice: "SUPPLEMENTATION ADVISED",
  },
  {
    name: "Iron / Ferritin",
    icon: "bloodtype",
    value: "45",
    unit: "ng/mL",
    status: "OPTIMAL" as const,
    percent: 45,
    note: "Within range but at the lower third. Recheck in 12 weeks.",
    advice: null,
  },
  {
    name: "Testosterone",
    icon: "fitness_center",
    value: "612",
    unit: "ng/dL",
    status: "OPTIMAL" as const,
    percent: 68,
    note: "Healthy range for your age band. No action required.",
    advice: null,
  },
  {
    name: "Vitamin B12",
    icon: "bolt",
    value: "389",
    unit: "pg/mL",
    status: "OPTIMAL" as const,
    percent: 55,
    note: "Adequate. Keep intake steady if you reduce animal products.",
    advice: null,
  },
  {
    name: "HbA1c",
    icon: "monitoring",
    value: "5.2",
    unit: "%",
    status: "OPTIMAL" as const,
    percent: 40,
    note: "Excellent glycaemic control across the last three months.",
    advice: null,
  },
  {
    name: "Magnesium (RBC)",
    icon: "science",
    value: "4.1",
    unit: "mg/dL",
    status: "SUB-OPTIMAL" as const,
    percent: 28,
    note: "Low-normal cellular magnesium, consistent with disrupted sleep architecture.",
    advice: "SUPPLEMENTATION ADVISED",
  },
];

export const ARTICLES = [
  {
    tag: "PubMed",
    tagIcon: "menu_book",
    confidence: 94,
    title: "New study links Ashwagandha to 15% reduction in baseline cortisol.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDaMWNhNfGwWsZRUkjeGIe7vdYr1xNnCxJGxCbHxS7mx3lQMP1jxAK0Kb7meGPYAdUNTrU9czha4dR6FTCTJb3qGdQIFijmk3lvIohIOcQ-5oQBuWFpp2E_WgW9ar_MW99GDD-CubYM4pInre2uUjGioeTGsW_Qn2fqP45eimQnX75qrir1UP5DGLi2A8HWJJgPTEMqVTxYTc5KXaDfqwlo_wlHCzWD682tCSK8hu5RDSJUISGxdAzV",
  },
  {
    tag: "Clinical Trial",
    tagIcon: "science",
    confidence: 88,
    title: "Magnesium Threonate shown to enhance REM sleep latency in adults over 30.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAUgMh2x129lORFTRZkX9E_QfVYFN9K5Iow6pKogQXpzIKqFXjimk4HSrj6L6nSV6MCKrZ5wYChZ_Ot9p6QjOuzL4ylp3FtuJrf7IECZPT2hszdLoX7y4KDwajFcRufq6_gMvcVs_rgh7ha99rGI0_Rk-FPzIFyMnR6UhJIIpYPGGDMBgPOqrOUSLzs7dGwmkfUCuK-IDPtLaJDoewkLI_59YvoCvx5OskAzuOvOEZFh8gI8-Pavphs",
  },
];
