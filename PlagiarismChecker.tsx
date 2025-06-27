
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle, Search, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const PlagiarismChecker = () => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{ plagiarismScore: number } | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter some text to analyze',
        variant: 'destructive',
      });
      return;
    }

    setIsAnalyzing(true);
    setResults(null);
    console.log('Starting plagiarism analysis...');

    try {
      const response = await fetch(
        'https://19cahovklf.execute-api.us-east-1.amazonaws.com/plag/plag',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        }
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const result = await response.json();
      console.log('Result from Lambda:', result);

      // ✅ Correctly extract plagiarismPercentage from Lambda response
      setResults({
        plagiarismScore: result.plagiarismPercentage,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Something went wrong while checking plagiarism',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 10) return 'text-green-600';
    if (score < 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score < 10) return <CheckCircle className="w-5 h-5 text-green-600" />;
    return <AlertTriangle className="w-5 h-5 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="border border-blue-200 bg-blue-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700">
              <FileText className="w-5 h-5" />
              Text Input
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your text here to check for plagiarism..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[200px] bg-white border-blue-200 focus:border-blue-400"
            />
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {text.split(' ').filter((word) => word.length > 0).length} words
              </span>
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isAnalyzing ? (
                  <>
                    <Search className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Check Plagiarism
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-700">Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            {isAnalyzing ? (
              <div className="space-y-4">
                <div className="text-center">
                  <Search className="w-8 h-8 mx-auto text-blue-600 animate-spin mb-2" />
                  <p className="text-gray-600">Scanning for plagiarism...</p>
                </div>
                <Progress value={33} className="h-2" />
                <p className="text-sm text-gray-500 text-center">
                  Checking against millions of sources
                </p>
              </div>
            ) : results ? (
              <div className="space-y-4">
                {/* Plagiarism Score */}
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {getScoreIcon(results.plagiarismScore)}
                    <span
                      className={`text-2xl font-bold ${getScoreColor(results.plagiarismScore)}`}
                    >
                      {results.plagiarismScore}%
                    </span>
                  </div>
                  <p className="text-gray-600">Plagiarism Detected</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Enter text and click "Check Plagiarism" to see results</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
