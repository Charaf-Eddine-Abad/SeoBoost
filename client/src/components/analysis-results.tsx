import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertTriangle, Download, Wrench, RotateCcw } from "lucide-react";
import type { AnalyzeResponse } from "@shared/schema";

interface AnalysisResultsProps {
  results: AnalyzeResponse;
  onNewAnalysis: () => void;
}

export default function AnalysisResults({ results, onNewAnalysis }: AnalysisResultsProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <Check className="w-4 h-4 text-white" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-white" />;
      default:
        return <X className="w-4 h-4 text-white" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-success";
      case "warning":
        return "bg-warning";
      default:
        return "bg-error";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-success/10 text-success";
      case "warning":
        return "bg-warning/10 text-warning";
      default:
        return "bg-error/10 text-error";
    }
  };

  return (
    <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">SEO Analysis Results</h2>

        <div className="space-y-4">
          {results.checks.map((check, index) => (
            <div
              key={index}
              className="flex items-start justify-between p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <div
                    className={`w-6 h-6 rounded-full ${getStatusColor(
                      check.status
                    )} flex items-center justify-center`}
                  >
                    {getStatusIcon(check.status)}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{check.name}</h4>
                  <p className="text-sm text-gray-600 mt-1">{check.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeColor(
                    check.status
                  )}`}
                >
                  {check.score > 0 ? "+" : ""}{check.score} pts
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="text-primary bg-primary/10 border-primary/20 hover:bg-primary/20"
            >
              <Wrench className="w-4 h-4 mr-2" />
              Show Fix Suggestions
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="text-primary bg-primary/10 border-primary/20 hover:bg-primary/20"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onNewAnalysis}
            className="text-gray-700 hover:bg-gray-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Run New Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
