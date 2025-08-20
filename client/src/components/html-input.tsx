import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, FileCode, Search, Globe } from "lucide-react";

interface HtmlInputProps {
  mode: "html" | "url";
  onModeChange: (mode: "html" | "url") => void;
  htmlValue: string;
  urlValue: string;
  onHtmlChange: (value: string) => void;
  onUrlChange: (value: string) => void;
  onAnalyze: () => void;
  onLoadSample: () => void;
  onClear: () => void;
  isAnalyzing: boolean;
}

export default function HtmlInput({
  mode,
  onModeChange,
  htmlValue,
  urlValue,
  onHtmlChange,
  onUrlChange,
  onAnalyze,
  onLoadSample,
  onClear,
  isAnalyzing,
}: HtmlInputProps) {
  const currentValue = mode === "html" ? htmlValue : urlValue;
  const isEmpty = !currentValue.trim();

  return (
    <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">SEO Analysis Input</h2>
          <span className="text-sm text-gray-500">Choose your input method</span>
        </div>

        <Tabs value={mode} onValueChange={onModeChange as (value: string) => void} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="html" className="flex items-center space-x-2">
              <FileCode className="w-4 h-4" />
              <span>HTML Code</span>
            </TabsTrigger>
            <TabsTrigger value="url" className="flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Website URL</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-4 space-y-4">
            <TabsContent value="html" className="space-y-4 mt-0">
              <div className="relative">
                <Textarea
                  value={htmlValue}
                  onChange={(e) => onHtmlChange(e.target.value)}
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
                  {htmlValue.length} characters
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="url" className="space-y-4 mt-0">
              <div>
                <Input
                  type="url"
                  value={urlValue}
                  onChange={(e) => onUrlChange(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full h-12 p-4 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors duration-200 text-sm bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Enter a complete URL including http:// or https://
                </p>
              </div>
              <div className="h-48 flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg">
                <div className="text-center">
                  <Globe className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">Website content will be fetched automatically</p>
                  <p className="text-gray-400 text-xs mt-1">No need to copy HTML manually</p>
                </div>
              </div>
            </TabsContent>

            <div className="flex items-center justify-between pt-4">
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
                {mode === "html" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onLoadSample}
                    className="text-gray-700 hover:bg-gray-50"
                  >
                    <FileCode className="w-4 h-4 mr-2" />
                    Load Sample
                  </Button>
                )}
              </div>

              <Button
                onClick={onAnalyze}
                disabled={isAnalyzing || isEmpty}
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
        </Tabs>
      </CardContent>
    </Card>
  );
}
