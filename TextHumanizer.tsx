import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RefreshCw, Copy, FileText, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const TextHumanizer = () => {
  const [inputText, setInputText] = useState('');
  const [isHumanizing, setIsHumanizing] = useState(false);
  const [results, setResults] = useState<{
    humanizedText?: string;
    humanScore?: number;
    readabilityScore?: number;
  } | null>(null);

  const handleHumanize = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Error",
        description: "Please enter some text to humanize.",
        variant: "destructive",
      });
      return;
    }

    setIsHumanizing(true);
    try {
      const response = await fetch("https://pyo6vfoas4.execute-api.us-east-1.amazonaws.com/prod/humanize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(errorText);
        toast({
          title: "Error",
          description: "Request failed.",
          variant: "destructive",
        });
        return;
      }

      const data = await response.json();
      const parsed = JSON.parse(data.body);
      if (!parsed.humanizedText) {
        toast({
          title: "Error",
          description: "No humanized text returned from the server.",
          variant: "destructive",
        });
        return;
      }

      setResults({
        humanizedText: parsed.humanizedText,
        humanScore: parsed.humanScore,
        readabilityScore: parsed.readabilityScore,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to humanize text. Try again later.",
        variant: "destructive",
      });
    } finally {
      setIsHumanizing(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: "Copied!", description: "Text copied to clipboard" });
    } catch {
      toast({ title: "Error", description: "Failed to copy text", variant: "destructive" });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <FileText className="w-5 h-5" />
              Original Text
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your AI-generated or robotic text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[200px] bg-white border-green-200 focus:border-green-400"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {inputText.split(" ").filter((w) => w.length > 0).length} words
              </span>
              <Button
                onClick={handleHumanize}
                disabled={isHumanizing}
                className="bg-green-600 hover:bg-green-700"
              >
                {isHumanizing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Humanizing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Humanize Text
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-gray-700">
              <span>Results</span>
              {results?.humanizedText && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(results.humanizedText)}
                  className="text-xs"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isHumanizing && (
              <div className="space-y-4">
                <div className="text-center">
                  <RefreshCw className="w-8 h-8 mx-auto text-green-600 animate-spin mb-2" />
                  <p className="text-gray-600">Processing your text...</p>
                </div>
              </div>
            )}

            {!isHumanizing && results && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded">
                  <h4 className="font-bold">Humanized Text:</h4>
                  <p className="text-gray-700">{results.humanizedText}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">{results.humanScore}%</div>
                    <div className="text-sm text-gray-500">Human Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">{results.readabilityScore}%</div>
                    <div className="text-sm text-gray-500">Readability</div>
                  </div>
                </div>
              </div>
            )}

            {!isHumanizing && !results && (
              <div className="text-center text-gray-500 py-8">
                <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Enter text and click "Humanize Text" to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
