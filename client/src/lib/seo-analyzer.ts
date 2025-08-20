/**
 * Client-side SEO analysis utilities
 * Provides helper functions for SEO scoring and validation
 */

export interface SEOMetrics {
  titleLength: number;
  metaDescriptionLength: number;
  h1Count: number;
  imageCount: number;
  imagesWithAlt: number;
  hasViewport: boolean;
  hasDoctype: boolean;
  hasLang: boolean;
  hasCharset: boolean;
  wordCount: number;
  topKeywords: Array<{ word: string; count: number; density: number }>;
}

export interface SEORecommendation {
  type: 'title' | 'meta' | 'h1' | 'images' | 'viewport' | 'keywords' | 'structure';
  severity: 'error' | 'warning' | 'success';
  message: string;
  suggestion?: string;
}

/**
 * Calculates SEO score based on various factors
 */
export function calculateSEOScore(metrics: SEOMetrics): number {
  let score = 0;

  // Title tag (15 points)
  if (metrics.titleLength > 0) {
    if (metrics.titleLength >= 30 && metrics.titleLength <= 60) {
      score += 15;
    } else if (metrics.titleLength > 0) {
      score += 10;
    }
  }

  // Meta description (15 points)
  if (metrics.metaDescriptionLength > 0) {
    if (metrics.metaDescriptionLength >= 120 && metrics.metaDescriptionLength <= 160) {
      score += 15;
    } else if (metrics.metaDescriptionLength > 0) {
      score += 10;
    }
  }

  // H1 tag (10 points)
  if (metrics.h1Count === 1) {
    score += 10;
  } else if (metrics.h1Count > 1) {
    score += 5;
  }

  // Image alt attributes (15 points)
  if (metrics.imageCount === 0) {
    score += 15; // No images to worry about
  } else {
    const altRatio = metrics.imagesWithAlt / metrics.imageCount;
    score += Math.round(15 * altRatio);
  }

  // Mobile viewport (10 points)
  if (metrics.hasViewport) {
    score += 10;
  }

  // Keyword density (20 points)
  if (metrics.topKeywords.length > 0) {
    const topKeywordDensity = metrics.topKeywords[0].density;
    if (topKeywordDensity > 0.01 && topKeywordDensity < 0.05) {
      score += 20;
    } else if (topKeywordDensity > 0 && topKeywordDensity < 0.08) {
      score += 15;
    } else if (topKeywordDensity > 0) {
      score += 10;
    }
  }

  // Document structure (15 points)
  let structureScore = 0;
  if (metrics.hasDoctype) structureScore += 5;
  if (metrics.hasLang) structureScore += 5;
  if (metrics.hasCharset) structureScore += 5;
  score += structureScore;

  return Math.min(score, 100);
}

/**
 * Generates SEO recommendations based on metrics
 */
export function generateRecommendations(metrics: SEOMetrics): SEORecommendation[] {
  const recommendations: SEORecommendation[] = [];

  // Title recommendations
  if (metrics.titleLength === 0) {
    recommendations.push({
      type: 'title',
      severity: 'error',
      message: 'Missing title tag',
      suggestion: 'Add a descriptive title tag between 30-60 characters'
    });
  } else if (metrics.titleLength < 30) {
    recommendations.push({
      type: 'title',
      severity: 'warning',
      message: 'Title tag is too short',
      suggestion: 'Expand your title to at least 30 characters for better SEO'
    });
  } else if (metrics.titleLength > 60) {
    recommendations.push({
      type: 'title',
      severity: 'warning',
      message: 'Title tag is too long',
      suggestion: 'Shorten your title to under 60 characters to avoid truncation'
    });
  }

  // Meta description recommendations
  if (metrics.metaDescriptionLength === 0) {
    recommendations.push({
      type: 'meta',
      severity: 'error',
      message: 'Missing meta description',
      suggestion: 'Add a meta description between 120-160 characters'
    });
  } else if (metrics.metaDescriptionLength < 120) {
    recommendations.push({
      type: 'meta',
      severity: 'warning',
      message: 'Meta description is too short',
      suggestion: 'Expand your meta description to at least 120 characters'
    });
  } else if (metrics.metaDescriptionLength > 160) {
    recommendations.push({
      type: 'meta',
      severity: 'warning',
      message: 'Meta description is too long',
      suggestion: 'Shorten your meta description to under 160 characters'
    });
  }

  // H1 recommendations
  if (metrics.h1Count === 0) {
    recommendations.push({
      type: 'h1',
      severity: 'error',
      message: 'Missing H1 tag',
      suggestion: 'Add exactly one H1 tag as your main heading'
    });
  } else if (metrics.h1Count > 1) {
    recommendations.push({
      type: 'h1',
      severity: 'warning',
      message: 'Multiple H1 tags found',
      suggestion: 'Use only one H1 tag per page for better SEO structure'
    });
  }

  // Image recommendations
  if (metrics.imageCount > 0 && metrics.imagesWithAlt < metrics.imageCount) {
    recommendations.push({
      type: 'images',
      severity: 'warning',
      message: 'Some images missing alt attributes',
      suggestion: `Add alt text to ${metrics.imageCount - metrics.imagesWithAlt} remaining images`
    });
  }

  // Viewport recommendations
  if (!metrics.hasViewport) {
    recommendations.push({
      type: 'viewport',
      severity: 'error',
      message: 'Missing viewport meta tag',
      suggestion: 'Add <meta name="viewport" content="width=device-width, initial-scale=1.0"> for mobile optimization'
    });
  }

  // Structure recommendations
  if (!metrics.hasDoctype) {
    recommendations.push({
      type: 'structure',
      severity: 'warning',
      message: 'Missing DOCTYPE declaration',
      suggestion: 'Add <!DOCTYPE html> at the beginning of your document'
    });
  }

  if (!metrics.hasLang) {
    recommendations.push({
      type: 'structure',
      severity: 'warning',
      message: 'Missing language attribute',
      suggestion: 'Add lang attribute to your HTML tag (e.g., <html lang="en">)'
    });
  }

  if (!metrics.hasCharset) {
    recommendations.push({
      type: 'structure',
      severity: 'warning',
      message: 'Missing charset declaration',
      suggestion: 'Add <meta charset="UTF-8"> in your head section'
    });
  }

  return recommendations;
}

/**
 * Gets SEO grade based on score
 */
export function getSEOGrade(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

/**
 * Formats score with grade
 */
export function formatScoreWithGrade(score: number): string {
  const grade = getSEOGrade(score);
  return `${grade} (${score}/100)`;
}

/**
 * Gets color for score visualization
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return '#388E3C'; // Success green
  if (score >= 60) return '#F57C00'; // Warning orange
  return '#D32F2F'; // Error red
}

/**
 * Calculates stroke dash offset for circular progress
 */
export function getStrokeDashOffset(score: number, circumference: number = 314): number {
  return circumference - (score / 100) * circumference;
}

/**
 * Simple keyword extraction from text
 */
export function extractKeywords(text: string, minLength: number = 4): Array<{ word: string; count: number; density: number }> {
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length >= minLength);

  const wordCount = words.length;
  const wordFreq: Record<string, number> = {};

  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });

  return Object.entries(wordFreq)
    .map(([word, count]) => ({
      word,
      count,
      density: count / wordCount
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

/**
 * Validates HTML structure for common SEO issues
 */
export function validateHTMLStructure(html: string): {
  hasDoctype: boolean;
  hasHtmlTag: boolean;
  hasHeadTag: boolean;
  hasBodyTag: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  const hasDoctype = html.trim().toLowerCase().startsWith('<!doctype');
  const hasHtmlTag = /<html[^>]*>/i.test(html);
  const hasHeadTag = /<head[^>]*>/i.test(html);
  const hasBodyTag = /<body[^>]*>/i.test(html);

  if (!hasDoctype) {
    errors.push('Missing DOCTYPE declaration');
  }

  if (!hasHtmlTag) {
    errors.push('Missing HTML tag');
  }

  if (!hasHeadTag) {
    errors.push('Missing HEAD tag');
  }

  if (!hasBodyTag) {
    errors.push('Missing BODY tag');
  }

  return {
    hasDoctype,
    hasHtmlTag,
    hasHeadTag,
    hasBodyTag,
    errors
  };
}
