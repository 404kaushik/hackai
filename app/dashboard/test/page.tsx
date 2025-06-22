"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function TestPage() {
  const [topic, setTopic] = useState("")
  const [isTestingAnalysis, setIsTestingAnalysis] = useState(false)
  const [isTestingScripts, setIsTestingScripts] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [scriptsResult, setScriptsResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testAnalysisAPI = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic first")
      return
    }

    setIsTestingAnalysis(true)
    setError(null)
    setAnalysisResult(null)

    try {
      const response = await fetch("/api/generate-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      setAnalysisResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to test analysis API")
    } finally {
      setIsTestingAnalysis(false)
    }
  }

  const testScriptsAPI = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic first")
      return
    }

    setIsTestingScripts(true)
    setError(null)
    setScriptsResult(null)

    try {
      const response = await fetch("/api/generate-scripts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      setScriptsResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to test scripts API")
    } finally {
      setIsTestingScripts(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">API Testing Dashboard</h1>
          <p className="text-slate-600">Test your OpenAI API integration before using the main dashboard</p>
        </div>

        {/* Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test Topic</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a topic to test (e.g., 'How to learn JavaScript')"
              className="text-lg"
            />
            <div className="flex gap-4">
              <Button onClick={testAnalysisAPI} disabled={isTestingAnalysis || !topic.trim()} className="flex-1">
                {isTestingAnalysis ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing Analysis API...
                  </>
                ) : (
                  "Test Market Analysis API"
                )}
              </Button>
              <Button
                onClick={testScriptsAPI}
                disabled={isTestingScripts || !topic.trim()}
                className="flex-1"
                variant="outline"
              >
                {isTestingScripts ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing Scripts API...
                  </>
                ) : (
                  "Test Scripts API"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 text-red-700">
                <XCircle className="w-5 h-5" />
                <span className="font-medium">Error: {error}</span>
              </div>
              <div className="mt-2 text-sm text-red-600">
                <p>Common issues:</p>
                <ul className="list-disc list-inside mt-1">
                  <li>Missing or invalid OPENAI_API_KEY in .env.local</li>
                  <li>API key doesn't have sufficient credits</li>
                  <li>Network connectivity issues</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Analysis Results */}
        {analysisResult && (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <CheckCircle className="w-5 h-5 mr-2" />
                Market Analysis API - Success!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Trending Topics:</h4>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.trendingTopics?.map((topic: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Target Audience:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Age Range:</span> {analysisResult.targetAudience?.ageRange}
                  </div>
                  <div>
                    <span className="font-medium">Gender Split:</span> {analysisResult.targetAudience?.genderSplit}
                  </div>
                  <div>
                    <span className="font-medium">Top Locations:</span> {analysisResult.targetAudience?.topLocations}
                  </div>
                  <div>
                    <span className="font-medium">Interests:</span> {analysisResult.targetAudience?.interests}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Competitor Insights:</h4>
                <div className="space-y-2">
                  {analysisResult.competitorInsights?.map((competitor: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-white rounded">
                      <span className="font-medium">{competitor.channel}</span>
                      <div className="text-sm text-gray-600">
                        {competitor.subs} • {competitor.engagement}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Scripts Results */}
        {scriptsResult && (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center text-green-800">
                <CheckCircle className="w-5 h-5 mr-2" />
                Scripts API - Success!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">A-Roll Script (Spoken Content):</h4>
                <Textarea value={scriptsResult.aRoll} readOnly className="min-h-[200px] text-sm" />
              </div>

              <div>
                <h4 className="font-semibold mb-2">B-Roll Script (Visual Directions):</h4>
                <Textarea value={scriptsResult.bRoll} readOnly className="min-h-[200px] text-sm font-mono" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {(analysisResult || scriptsResult) && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center space-x-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">🎉 Your OpenAI API is working! You can now use the main dashboard.</span>
              </div>
              <Button className="mt-4" onClick={() => (window.location.href = "/")}>
                Go to Main Dashboard
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
