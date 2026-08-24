import { streamText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";
import { ADVISOR_MODEL, createLovableAiGatewayProvider } from "./ai-gateway.server";

const SYSTEM = `You are SuppWise AI, an evidence-based fitness, nutrition and supplement advisor.
You are cautious, scientific and never sensational. You never diagnose disease.
You always reason about root causes (sleep, circadian rhythm, training load, nutrient status,
stress, hydration, blood markers) before suggesting supplements.
Only suggest supplements with reasonable human evidence, with realistic doses and timings.`;

const FollowUpSchema = z.object({
  intro: z.string(),
  topics: z.array(z.string()),
  questions: z.array(z.string()),
});

const AnalysisSchema = z.object({
  title: z.string(),
  summary: z.string(),
  drivers: z.array(
    z.object({
      name: z.string(),
      confidence: z.number(),
      detail: z.string(),
    }),
  ),
  lifestyle: z.array(z.object({ title: z.string(), detail: z.string() })),
  nutrition: z.array(z.object({ title: z.string(), detail: z.string() })),
  supplements: z.array(
    z.object({
      name: z.string(),
      dose: z.string(),
      timing: z.string(),
      why: z.string(),
      evidence: z.string(),
    }),
  ),
});

export type FollowUps = z.infer<typeof FollowUpSchema>;
export type Analysis = z.infer<typeof AnalysisSchema>;

function model() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Missing LOVABLE_API_KEY");
  return createLovableAiGatewayProvider(key)(ADVISOR_MODEL);
}

async function generate<T>(schema: z.ZodType<T>, prompt: string, fallback: T): Promise<T> {
  try {
    const result = streamText({
      model: model(),
      system: SYSTEM,
      prompt,
      output: Output.object({ schema }),
    });
    return await result.output;
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error)) {
      try {
        return schema.parse(JSON.parse(error.text ?? ""));
      } catch {
        return fallback;
      }
    }
    throw error;
  }
}

export async function runFollowUps(concern: string): Promise<FollowUps> {
  return generate(
    FollowUpSchema,
    `The user says: "${concern}".

Write a short intro (2-3 sentences) that reflects THEIR specific complaint, names the most likely
physiological mechanisms, and says you need more context.
Then give exactly 4 yes/no diagnostic questions that are specific to this complaint (not generic).
Also give 2 short scientific topic tags (2-3 words each) relevant to this complaint.`,
    {
      intro: "I need a little more context before I can narrow down the root cause.",
      topics: ["Root Cause", "Physiology"],
      questions: [
        "Do you sleep less than 7 hours on average?",
        "Has this been going on for more than 4 weeks?",
        "Are you training more than 4 times a week?",
        "Have you had blood work in the last 12 months?",
      ],
    },
  );
}

export async function runAnalysis(input: {
  concern: string;
  intro: string;
  answers: { question: string; answer: string }[];
}): Promise<Analysis> {
  const qa = input.answers.map((a) => `- ${a.question} -> ${a.answer}`).join("\n");
  return generate(
    AnalysisSchema,
    `Complaint: "${input.concern}"

Diagnostic answers:
${qa}

Produce a structured analysis specific to this complaint and these answers.
- title: short report name, e.g. "Cognitive Fatigue Analysis"
- summary: 2 sentences
- drivers: 2-4 likely root causes, each with a confidence number between 40 and 95 and one sentence of detail
- lifestyle: 2-3 concrete actions
- nutrition: 2-3 concrete food-first actions
- supplements: 2-4 items with dose, timing, why, and a one-line evidence strength note
Keep every string under 220 characters.`,
    {
      title: "Analysis",
      summary: "I could not complete the analysis. Please try again.",
      drivers: [],
      lifestyle: [],
      nutrition: [],
      supplements: [],
    },
  );
}
