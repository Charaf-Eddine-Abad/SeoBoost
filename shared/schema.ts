import { z } from "zod";

export const analyzeRequestSchema = z.object({
  htmlCode: z.string().min(1, "HTML code is required"),
});

export const analyzeUrlRequestSchema = z.object({
  url: z.string()
    .min(1, "Please enter a URL")
    .transform((url) => {
      // If URL doesn't start with http:// or https://, add https://
      if (!url.match(/^https?:\/\//)) {
        return `https://${url}`;
      }
      return url;
    })
    .pipe(z.string().url("Please enter a valid URL")),
});

export const seoCheckSchema = z.object({
  name: z.string(),
  description: z.string(),
  passed: z.boolean(),
  score: z.number(),
  maxScore: z.number(),
  status: z.enum(["success", "error", "warning"]),
});

export const analyzeResponseSchema = z.object({
  score: z.number(),
  maxScore: z.number(),
  grade: z.string(),
  checks: z.array(seoCheckSchema),
  issuesCount: z.number(),
  passedCount: z.number(),
  warningCount: z.number(),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
export type AnalyzeUrlRequest = z.infer<typeof analyzeUrlRequestSchema>;
export type SeoCheck = z.infer<typeof seoCheckSchema>;
export type AnalyzeResponse = z.infer<typeof analyzeResponseSchema>;
