import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, FileCode, Search } from "lucide-react";

interface HtmlInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  onLoadSample: () => void;
  onClear: () => void;
  isAnalyzing: boolean;
}

export default function HtmlInput({
  value,
  onChange,
  onAnalyze,
  onLoadSample,
  onClear,
  isAnalyzing,
}: HtmlInputProps) {
  return (
    <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">HTML Code Input</h2>
          <span className="text-sm text-gray-500">Paste or type your HTML code</span>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={`<!DOCTYPE html>
<html>
<head>
    <title>Your Website Title</title>
    <meta name="description" content="Your page description">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <h1>Your Main Heading</h1>
    <img src="image.jpg" alt="Image description">
    <p>Your content here...</p>
</body>
</html>`}
              className="w-full h-64 p-4 border-2 border-gray-200 rounded-lg resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors duration-200 font-mono text-sm bg-gray-50"
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-white px-2 py-1 rounded border">
              {value.length} characters
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onClear}
                className="text-gray-700 hover:bg-gray-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onLoadSample}
                className="text-gray-700 hover:bg-gray-50"
              >
                <FileCode className="w-4 h-4 mr-2" />
                Load Sample
              </Button>
            </div>

            <Button
              onClick={onAnalyze}
              disabled={isAnalyzing || !value.trim()}
              className="px-6 py-3 bg-primary text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Check SEO
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
