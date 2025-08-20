import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Check, X, AlertTriangle, Download, Wrench, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import type { AnalyzeResponse } from "@shared/schema";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

interface AnalysisResultsProps {
  results: AnalyzeResponse;
  onNewAnalysis: () => void;
}

export default function AnalysisResults({ results, onNewAnalysis }: AnalysisResultsProps) {
  const [showFixSuggestions, setShowFixSuggestions] = useState(false);
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

  const getFixSuggestions = (checkName: string, passed: boolean) => {
    if (passed) return null;
    
    const suggestions: Record<string, string[]> = {
      "Title Tag": [
        "Add a unique, descriptive title tag to your HTML <head> section",
        "Keep title length between 50-60 characters for optimal display",
        "Include your main keyword naturally in the title",
        "Example: <title>Your Main Keyword - Your Brand</title>"
      ],
      "Meta Description": [
        "Add a meta description tag in your HTML <head> section",
        "Keep description length between 150-160 characters",
        "Write compelling, informative text that encourages clicks",
        "Example: <meta name=\"description\" content=\"Your page description here\">"
      ],
      "H1 Tag": [
        "Add exactly one H1 tag to your page as the main heading",
        "Place the H1 tag near the top of your page content",
        "Include your primary keyword in the H1 tag",
        "Example: <h1>Your Main Page Heading</h1>"
      ],
      "Image Alt Attributes": [
        "Add alt attributes to all images for accessibility",
        "Write descriptive alt text that explains the image content",
        "Keep alt text concise but informative",
        "Example: <img src=\"image.jpg\" alt=\"Description of your image\">"
      ],
      "Mobile Viewport Tag": [
        "Add viewport meta tag to make your site mobile-friendly",
        "Place it in the <head> section of your HTML",
        "This ensures proper scaling on mobile devices",
        "Example: <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"
      ],
      "Keyword Density": [
        "Ensure natural keyword distribution throughout your content",
        "Avoid keyword stuffing - aim for 1-3% keyword density",
        "Use related keywords and synonyms naturally",
        "Focus on creating valuable, readable content for users"
      ],
      "General Improvements": [
        "Add DOCTYPE declaration at the beginning: <!DOCTYPE html>",
        "Include language attribute in HTML tag: <html lang=\"en\">",
        "Add charset meta tag: <meta charset=\"UTF-8\">",
        "These improve browser compatibility and accessibility"
      ]
    };
    
    return suggestions[checkName] || ["Implement best practices for this SEO factor"];
  };

  const handleExportPDF = async () => {
    try {
      // Create PDF without screenshot - more reliable approach
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      let currentY = 20;
      
      // Add title
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SEO Analysis Report', margin, currentY);
      currentY += 15;
      
      // Add score section
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Overall Score: ${results.score}/100`, margin, currentY);
      pdf.text(`Grade: ${results.grade}`, margin + 80, currentY);
      currentY += 10;
      
      // Add summary statistics
      pdf.setFontSize(12);
      pdf.text(`✓ Checks Passed: ${results.passedCount}`, margin, currentY);
      currentY += 6;
      pdf.text(`✗ Issues Found: ${results.issuesCount}`, margin, currentY);
      currentY += 6;
      pdf.text(`⚠ Warnings: ${results.warningCount}`, margin, currentY);
      currentY += 10;
      
      // Add generation date
      pdf.setFontSize(10);
      pdf.text(`Generated: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, margin, currentY);
      currentY += 15;
      
      // Add detailed analysis
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Detailed Analysis', margin, currentY);
      currentY += 10;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      results.checks.forEach((check, index) => {
        // Check if we need a new page
        if (currentY > 250) {
          pdf.addPage();
          currentY = 20;
        }
        
        // Status icon (✓, ✗, ⚠)
        const statusIcon = check.status === 'success' ? '✓' : check.status === 'warning' ? '⚠' : '✗';
        const statusColor = check.status === 'success' ? [0, 128, 0] : check.status === 'warning' ? [255, 165, 0] : [255, 0, 0];
        
        pdf.setTextColor(...statusColor);
        pdf.text(statusIcon, margin, currentY);
        pdf.setTextColor(0, 0, 0);
        
        // Check name and score
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${check.name} (${check.score}/${check.maxScore} pts)`, margin + 8, currentY);
        currentY += 5;
        
        // Description
        pdf.setFont('helvetica', 'normal');
        const splitDescription = pdf.splitTextToSize(check.description, pageWidth - 2 * margin - 8);
        pdf.text(splitDescription, margin + 8, currentY);
        currentY += splitDescription.length * 4 + 3;
      });
      
      // Add footer
      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pdf.internal.pageSize.getHeight() - 10, { align: 'right' });
        pdf.text('Generated by SEO Optimizer', margin, pdf.internal.pageSize.getHeight() - 10);
      }
      
      // Save the PDF
      pdf.save(`seo-analysis-report-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Show more specific error to help with debugging
      if (error instanceof Error) {
        alert(`PDF generation failed: ${error.message}`);
      } else {
        alert('Error generating PDF. Please try again.');
      }
    }
  };

  return (
    <Card className="bg-surface rounded-xl shadow-sm border border-gray-200">
      <CardContent className="p-6" id="seo-results-content">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">SEO Analysis Results</h2>

        <div className="space-y-4">
          {results.checks.map((check, index) => (
            <div key={index}>
              <div className="flex items-start justify-between p-4 border border-gray-200 rounded-lg bg-gray-50">
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
              
              {showFixSuggestions && !check.passed && (
                <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">Fix Suggestions:</h5>
                  <ul className="text-sm text-blue-800 space-y-1">
                    {getFixSuggestions(check.name, check.passed)?.map((suggestion, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFixSuggestions(!showFixSuggestions)}
              className="text-primary bg-primary/10 border-primary/20 hover:bg-primary/20"
            >
              <Wrench className="w-4 h-4 mr-2" />
              {showFixSuggestions ? "Hide" : "Show"} Fix Suggestions
              {showFixSuggestions ? (
                <ChevronUp className="w-4 h-4 ml-2" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-2" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
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
