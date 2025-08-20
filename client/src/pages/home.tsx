import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { AnalyzeRequest, AnalyzeResponse } from "@shared/schema";
import HtmlInput from "@/components/html-input";
import ScoreDisplay from "@/components/score-display";
import AnalysisResults from "@/components/analysis-results";

export default function Home() {
  const [htmlCode, setHtmlCode] = useState("");
  const [analysisResults, setAnalysisResults] = useState<AnalyzeResponse | null>(null);
  const { toast } = useToast();

  const analysisMutation = useMutation({
    mutationFn: async (data: AnalyzeRequest) => {
      const response = await apiRequest("POST", "/api/analyze", data);
      return response.json();
    },
    onSuccess: (data: AnalyzeResponse) => {
      setAnalysisResults(data);
      toast({
        title: "Analysis Complete",
        description: `SEO Score: ${data.score}/100 (${data.grade})`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (!htmlCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter HTML code to analyze",
        variant: "destructive",
      });
      return;
    }
    
    analysisMutation.mutate({ htmlCode });
  };

  const handleNewAnalysis = () => {
    setAnalysisResults(null);
    setHtmlCode("");
  };

  const sampleHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sample Web Page - Best Practices Guide</title>
    <meta name="description" content="Learn web development best practices with our comprehensive guide covering HTML, CSS, and JavaScript fundamentals.">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <h1>Complete Guide to Web Development</h1>
    <img src="hero-image.jpg" alt="Web development workspace with laptop and code">
    <p>Learn the fundamentals of modern web development with practical examples and best practices.</p>
    <img src="code-example.jpg" alt="Code example showing HTML structure">
    <h2>Getting Started</h2>
    <p>Web development involves creating websites and applications for the internet...</p>
</body>
</html>`;

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-primary rounded-lg p-2">
                <i className="fas fa-search text-white text-xl"></i>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">SEO Optimizer</h1>
                <p className="text-sm text-gray-500">Professional SEO Analysis Tool</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">MVP v1.0</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <HtmlInput
              value={htmlCode}
              onChange={setHtmlCode}
              onAnalyze={handleAnalyze}
              onLoadSample={() => setHtmlCode(sampleHTML)}
              onClear={() => setHtmlCode("")}
              isAnalyzing={analysisMutation.isPending}
            />
            
            {analysisResults && (
              <AnalysisResults
                results={analysisResults}
                onNewAnalysis={handleNewAnalysis}
              />
            )}
          </div>

          <div className="space-y-6">
            <ScoreDisplay results={analysisResults} />
            
            {/* Tips Card */}
            <div className="bg-surface rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Tips</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 text-sm">
                  <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p className="text-gray-600">Keep title tags between 50-60 characters</p>
                </div>
                <div className="flex items-start space-x-3 text-sm">
                  <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p className="text-gray-600">Meta descriptions should be 150-160 characters</p>
                </div>
                <div className="flex items-start space-x-3 text-sm">
                  <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p className="text-gray-600">Use only one H1 tag per page</p>
                </div>
                <div className="flex items-start space-x-3 text-sm">
                  <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <p className="text-gray-600">Add alt text to all images for accessibility</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Loading Overlay */}
      {analysisMutation.isPending && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full mx-4">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4">
                <div className="w-full h-full border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing HTML</h3>
              <p className="text-gray-600 text-sm">Checking SEO factors and calculating score...</p>
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full transition-all duration-300 animate-pulse" style={{ width: "65%" }}></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
