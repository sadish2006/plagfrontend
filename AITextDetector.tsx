import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Brain, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

type DetectionResult = {
  aiGeneratedProbability: number;
  humanProbability: number;
  confidence: string;
  patterns: { type: string; confidence: string }[];
  wordsAnalyzed: number;
};

export const AITextDetector = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<DetectionResult | null>(null);

  const handleAnalyze = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      toast({ title: 'Error', description: 'Please enter some text.', variant: 'destructive' });
      return;
    }

    setIsAnalyzing(true);
    setResults(null);

    try {
      const res = await fetch('https://82hboyn2n0.execute-api.us-east-1.amazonaws.com/aistage/aiapi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed }),
      });

      const data = await res.json();
      console.log("✅ Lambda Response:", data);

      // Fix: parse body if it's stringified JSON
      const parsed = typeof data.body === 'string' ? JSON.parse(data.body) : data;

      if (!res.ok || typeof parsed.aiGeneratedProbability !== 'number') {
        throw new Error(parsed.error || "Invalid response");
      }

      setResults(parsed);
    } catch (error: any) {
      console.error('❌ Detection failed:', error);
      toast({ title: 'Error', description: error.message || 'Failed to analyze text.', variant: 'destructive' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getColor = (val: number) =>
    val < 30 ? 'text-green-600' : val < 60 ? 'text-yellow-600' : 'text-red-600';

  const getBg = (val: number) =>
    val < 30 ? 'bg-green-50 border-green-200' : val < 60 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200';

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border border-purple-200 bg-purple-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <FileText className="w-5 h-5" />
              Text Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[200px] bg-white border-purple-200"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {text.trim().split(/\s+/).filter(Boolean).length} words
              </span>
              <Button onClick={handleAnalyze} disabled={isAnalyzing} className="bg-purple-600 hover:bg-purple-700">
                {isAnalyzing ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-pulse" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4 mr-2" />
                    Detect AI Text
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-700">Detection Results</CardTitle>
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="text-center space-y-4">
                <Brain className="w-8 h-8 mx-auto text-purple-600 animate-pulse" />
                <Progress value={70} className="h-2" />
                <p className="text-gray-500">Analyzing...</p>
              </div>
            ) : results ? (
              <div className="space-y-4">
                <div className={`text-center p-4 border rounded-lg ${getBg(results.aiGeneratedProbability)}`}>
                  <div className="text-2xl font-bold flex justify-center items-center gap-2">
                    <Bot className="w-5 h-5 text-purple-600" />
                    <span className={getColor(results.aiGeneratedProbability)}>
                      {results.aiGeneratedProbability}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {results.humanProbability}% Human-like
                  </p>
                  <Badge variant="default" className="mt-2">
                    {results.confidence} Confidence
                  </Badge>
                </div>

                {results.patterns.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Detected Patterns</h4>
                    {results.patterns.map((pat, i) => (
                      <div key={i} className="flex justify-between items-center p-2 bg-purple-50 border border-purple-200 rounded">
                        <span>{pat.type}</span>
                        <Badge variant="secondary">{pat.confidence}</Badge>
                      </div>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-lg font-semibold">{results.wordsAnalyzed}</div>
                    <div className="text-sm text-gray-500">Words Analyzed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold">{results.patterns.length}</div>
                    <div className="text-sm text-gray-500">Patterns Found</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Bot className="w-8 h-8 mx-auto opacity-50" />
                <p>Enter text and click Detect to view results.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};



