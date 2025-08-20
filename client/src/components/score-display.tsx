import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import type { AnalyzeResponse } from "@shared/schema";

interface ScoreDisplayProps {
  results: AnalyzeResponse | null;
}

export default function ScoreDisplay({ results }: ScoreDisplayProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    if (results) {
      let current = 0;
      const target = results.score;
      const increment = target / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setAnimatedScore(Math.round(current));
      }, 30);

      return () => clearInterval(timer);
    }
  }, [results]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#388E3C";
    if (score >= 60) return "#F57C00";
    return "#D32F2F";
  };

  const getStrokeDashoffset = (score: number) => {
    const circumference = 314;
    return circumference - (score / 100) * circumference;
  };

  return (
    <>
      {/* Score Card */}
      <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Score</h3>

          {!results ? (
            <div className="text-center py-8">
              <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="text-gray-400 text-2xl" />
              </div>
              <p className="text-gray-500 text-sm">Run an analysis to see your SEO score</p>
            </div>
          ) : (
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke={getScoreColor(results.score)}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="314"
                    strokeDashoffset={getStrokeDashoffset(animatedScore)}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900">{animatedScore}</div>
                    <div className="text-sm text-gray-500">out of 100</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Grade</span>
                  <span
                    className={`font-medium ${
                      results.score >= 80
                        ? "text-success"
                        : results.score >= 60
                        ? "text-warning"
                        : "text-error"
                    }`}
                  >
                    {results.grade}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Issues Found</span>
                  <span className="font-medium text-gray-900">
                    {results.issuesCount} issues
                  </span>
                </div>
              </div>

              {/* Score Breakdown */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900 text-sm">Score Breakdown</h4>
                <div className="space-y-2 text-xs">
                  {results.checks.map((check) => (
                    <div key={check.name} className="flex items-center justify-between">
                      <span className="text-gray-600">{check.name}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-12 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              check.status === "success"
                                ? "bg-success"
                                : check.status === "warning"
                                ? "bg-warning"
                                : "bg-error"
                            }`}
                            style={{
                              width: `${(check.score / check.maxScore) * 100}%`,
                            }}
                          />
                        </div>
                        <span
                          className={`font-medium ${
                            check.status === "success"
                              ? "text-success"
                              : check.status === "warning"
                              ? "text-warning"
                              : "text-error"
                          }`}
                        >
                          {check.score}/{check.maxScore}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats Card */}
      {results && (
        <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Checks Passed</span>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-success rounded-full" />
                  <span className="font-medium text-gray-900">{results.passedCount}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Checks Failed</span>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-error rounded-full" />
                  <span className="font-medium text-gray-900">{results.issuesCount}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Warnings</span>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-warning rounded-full" />
                  <span className="font-medium text-gray-900">{results.warningCount}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
