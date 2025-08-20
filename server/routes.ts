import type { Express } from "express";
import { createServer, type Server } from "http";
import * as cheerio from "cheerio";
import { analyzeRequestSchema } from "@shared/schema";
import type { AnalyzeResponse, SeoCheck } from "@shared/schema";

function analyzeSEO(htmlCode: string): AnalyzeResponse {
  const $ = cheerio.load(htmlCode);
  const checks: SeoCheck[] = [];
  let totalScore = 0;
  const maxScore = 100;

  // Title Tag Check (15 points)
  const title = $('title').first().text().trim();
  const titleCheck: SeoCheck = {
    name: "Title Tag",
    description: title 
      ? `Found title tag with ${title.length} characters: "${title.substring(0, 50)}${title.length > 50 ? '...' : ''}"`
      : "No title tag found. Add a descriptive title tag to improve search rankings.",
    passed: !!title && title.length > 0,
    score: title && title.length > 0 ? 15 : 0,
    maxScore: 15,
    status: title && title.length > 0 ? "success" : "error"
  };
  checks.push(titleCheck);
  totalScore += titleCheck.score;

  // Meta Description Check (15 points)
  const metaDescription = $('meta[name="description"]').attr('content')?.trim();
  const metaCheck: SeoCheck = {
    name: "Meta Description",
    description: metaDescription 
      ? `Found meta description with ${metaDescription.length} characters`
      : "No meta description found. Add one to improve search snippets.",
    passed: !!metaDescription && metaDescription.length > 0,
    score: metaDescription && metaDescription.length > 0 ? 15 : 0,
    maxScore: 15,
    status: metaDescription && metaDescription.length > 0 ? "success" : "error"
  };
  checks.push(metaCheck);
  totalScore += metaCheck.score;

  // H1 Tag Check (10 points)
  const h1Tags = $('h1');
  const h1Check: SeoCheck = {
    name: "H1 Tag",
    description: h1Tags.length === 1 
      ? "Found exactly one H1 tag with proper content structure"
      : h1Tags.length === 0 
        ? "No H1 tag found. Add a main heading for better structure."
        : `Found ${h1Tags.length} H1 tags. Use only one H1 tag per page.`,
    passed: h1Tags.length === 1,
    score: h1Tags.length === 1 ? 10 : 0,
    maxScore: 10,
    status: h1Tags.length === 1 ? "success" : "error"
  };
  checks.push(h1Check);
  totalScore += h1Check.score;

  // Alt Attributes Check (15 points)
  const images = $('img');
  const imagesWithAlt = $('img[alt]').filter((_, el) => $(el).attr('alt')?.trim());
  const altRatio = images.length > 0 ? imagesWithAlt.length / images.length : 1;
  const altScore = Math.round(15 * altRatio);
  const altCheck: SeoCheck = {
    name: "Image Alt Attributes",
    description: images.length === 0 
      ? "No images found"
      : imagesWithAlt.length === images.length 
        ? `All ${images.length} images have alt attributes`
        : `${imagesWithAlt.length} out of ${images.length} images have alt attributes. Add alt text to remaining images.`,
    passed: images.length === 0 || imagesWithAlt.length === images.length,
    score: altScore,
    maxScore: 15,
    status: images.length === 0 || imagesWithAlt.length === images.length 
      ? "success" 
      : altRatio > 0.5 ? "warning" : "error"
  };
  checks.push(altCheck);
  totalScore += altCheck.score;

  // Mobile Viewport Tag Check (10 points)
  const viewport = $('meta[name="viewport"]').attr('content');
  const viewportCheck: SeoCheck = {
    name: "Mobile Viewport Tag",
    description: viewport 
      ? "Mobile viewport meta tag is properly configured"
      : "No viewport meta tag found. Add one for mobile optimization.",
    passed: !!viewport,
    score: viewport ? 10 : 0,
    maxScore: 10,
    status: viewport ? "success" : "error"
  };
  checks.push(viewportCheck);
  totalScore += viewportCheck.score;

  // Keyword Density Check (20 points)
  const bodyText = $('body').text().toLowerCase();
  const words = bodyText.split(/\s+/).filter(word => word.length > 3);
  const wordCount = words.length;
  const wordFreq: Record<string, number> = {};
  
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });

  const topWords = Object.entries(wordFreq)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const hasGoodDensity = topWords.length > 0 && topWords[0][1] / wordCount < 0.05;
  const keywordCheck: SeoCheck = {
    name: "Keyword Density",
    description: wordCount === 0 
      ? "No text content found for analysis"
      : hasGoodDensity 
        ? `Good keyword distribution. Most frequent: "${topWords[0][0]}" (${((topWords[0][1] / wordCount) * 100).toFixed(1)}%)`
        : topWords.length > 0 
          ? `Keyword density may be too high. Most frequent: "${topWords[0][0]}" (${((topWords[0][1] / wordCount) * 100).toFixed(1)}%)`
          : "Unable to analyze keyword density",
    passed: hasGoodDensity,
    score: hasGoodDensity ? 20 : wordCount > 0 ? 10 : 0,
    maxScore: 20,
    status: hasGoodDensity ? "success" : wordCount > 0 ? "warning" : "error"
  };
  checks.push(keywordCheck);
  totalScore += keywordCheck.score;

  // General Improvements Check (15 points)
  const hasLang = $('html[lang]').length > 0;
  const hasCharset = $('meta[charset]').length > 0;
  const hasDoctype = htmlCode.trim().toLowerCase().startsWith('<!doctype');
  
  let improvementScore = 0;
  if (hasLang) improvementScore += 5;
  if (hasCharset) improvementScore += 5;
  if (hasDoctype) improvementScore += 5;

  const improvementCheck: SeoCheck = {
    name: "General Improvements",
    description: `Document structure: ${hasDoctype ? '✓' : '✗'} DOCTYPE, ${hasLang ? '✓' : '✗'} Lang attribute, ${hasCharset ? '✓' : '✗'} Charset`,
    passed: improvementScore === 15,
    score: improvementScore,
    maxScore: 15,
    status: improvementScore === 15 ? "success" : improvementScore > 5 ? "warning" : "error"
  };
  checks.push(improvementCheck);
  totalScore += improvementCheck.score;

  // Calculate stats
  const passedCount = checks.filter(check => check.passed).length;
  const warningCount = checks.filter(check => check.status === "warning").length;
  const issuesCount = checks.filter(check => !check.passed).length;

  // Determine grade
  let grade = "F";
  if (totalScore >= 90) grade = "A+";
  else if (totalScore >= 80) grade = "A";
  else if (totalScore >= 70) grade = "B";
  else if (totalScore >= 60) grade = "C";
  else if (totalScore >= 50) grade = "D";

  return {
    score: totalScore,
    maxScore,
    grade: `${grade} (${totalScore}/100)`,
    checks,
    issuesCount,
    passedCount,
    warningCount
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/analyze", async (req, res) => {
    try {
      const validatedData = analyzeRequestSchema.parse(req.body);
      const result = analyzeSEO(validatedData.htmlCode);
      res.json(result);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ 
          message: "Invalid request data",
          error: error.message 
        });
      } else {
        res.status(500).json({ 
          message: "Internal server error" 
        });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
