import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ConcernInput = z.object({ concern: z.string().min(1) });

const AnalyzeInput = z.object({
  concern: z.string().min(1),
  intro: z.string(),
  answers: z.array(z.object({ question: z.string(), answer: z.string() })),
});

export const getFollowUps = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ConcernInput.parse(input))
  .handler(async ({ data }) => {
    const { runFollowUps } = await import("./advisor.server");
    return runFollowUps(data.concern);
  });

export const getAnalysis = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AnalyzeInput.parse(input))
  .handler(async ({ data }) => {
    const { runAnalysis } = await import("./advisor.server");
    return runAnalysis(data);
  });
