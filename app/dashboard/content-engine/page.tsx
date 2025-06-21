import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import {
  FileText,
  Video,
  Sparkles,
  ArrowLeft,
  Settings,
  Wand2,
  Clock,
  Target,
  Camera,
  Upload,
  RefreshCw,
  Eye,
  Download,
} from "lucide-react"
import NextLink from "next/link"

export default function ContentEnginePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <NextLink href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </NextLink>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Wand2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Content Engine
              </span>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Engine Settings
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Content Type Selection */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">AI Content Engine</h1>
          <p className="text-gray-600 mb-6">Transform any input into engaging video content using your digital twin.</p>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              {
                icon: FileText,
                title: "Article to Video",
                description: "Transform blog posts into engaging videos",
                color: "blue",
              },
              {
                icon: Target,
                title: "Topical Explainer",
                description: "Create educational content on any topic",
                color: "green",
              },
              {
                icon: Camera,
                title: "B-Roll Assistant",
                description: "Add AI-generated B-roll to your footage",
                color: "purple",
              },
              {
                icon: Sparkles,
                title: "Custom Content",
                description: "Generate content from custom prompts",
                color: "orange",
              },
            ].map((type, index) => (
              <Card
                key={index}
                className={`hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-${type.color}-50 to-white border-${type.color}-200`}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-12 h-12 bg-${type.color}-100 rounded-lg flex items-center justify-center mx-auto mb-4`}
                  >
                    <type.icon className={`w-6 h-6 text-${type.color}-600`} />
                  </div>
                  <h3 className="font-semibold mb-2">{type.title}</h3>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Creation Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="article" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="article">Article</TabsTrigger>
                <TabsTrigger value="topic">Topic</TabsTrigger>
                <TabsTrigger value="broll">B-Roll</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>

              <TabsContent value="article" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Article to Video Generator</CardTitle>
                    <CardDescription>
                      Paste a link to your blog post or article, and we'll create an engaging video summary.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="articleUrl">Article URL</Label>
                        <Input
                          id="articleUrl"
                          placeholder="https://yourblog.com/article-title"
                          defaultValue="https://techblog.com/ai-productivity-tools-2024"
                        />
                      </div>

                      <div className="flex space-x-4">
                        <Button variant="outline" className="flex-1">
                          <NextLink className="w-4 h-4 mr-2" />
                          Analyze Article
                        </Button>
                        <Button variant="outline">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Text
                        </Button>
                      </div>
                    </div>

                    {/* Article Analysis Results */}
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-3">Article Analysis</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Title:</span>
                            <span className="font-medium">10 AI Productivity Tools That Will Change Your Life</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Word Count:</span>
                            <span>1,247 words</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Estimated Video Length:</span>
                            <span>3-4 minutes</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Key Topics:</span>
                            <span>AI Tools, Productivity, Automation</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Generated Script Preview */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Generated Script</Label>
                        <Button size="sm" variant="outline">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Regenerate
                        </Button>
                      </div>
                      <Textarea
                        className="min-h-[200px]"
                        defaultValue="Hey everyone! Today I'm excited to share 10 incredible AI productivity tools that are going to completely transform how you work. These aren't just fancy gadgets - they're game-changers that can save you hours every single day.

First up, we have ChatGPT for content creation. This tool has revolutionized how I write emails, create outlines, and brainstorm ideas. But here's the thing - most people are only using 10% of its potential.

Next, let's talk about Notion AI. If you're already using Notion for project management, their AI features can help you summarize meetings, generate action items, and even write entire project proposals..."
                      />
                    </div>

                    <Button size="lg" className="w-full">
                      <Video className="w-4 h-4 mr-2" />
                      Generate Video with Digital Twin
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="topic" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Topical Explainer Generator</CardTitle>
                    <CardDescription>
                      Enter any topic and we'll research it and create an educational video for you.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="topic">Topic or Question</Label>
                        <Input
                          id="topic"
                          placeholder="e.g., How does blockchain technology work?"
                          defaultValue="The future of remote work in 2024"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="audience">Target Audience</Label>
                          <Select defaultValue="general">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General Audience</SelectItem>
                              <SelectItem value="beginners">Beginners</SelectItem>
                              <SelectItem value="intermediate">Intermediate</SelectItem>
                              <SelectItem value="experts">Experts</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="length">Video Length</Label>
                          <Select defaultValue="medium">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="short">Short (1-2 min)</SelectItem>
                              <SelectItem value="medium">Medium (3-5 min)</SelectItem>
                              <SelectItem value="long">Long (5-10 min)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button className="w-full">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Research Topic & Generate Script
                      </Button>
                    </div>

                    {/* Research Results */}
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-3">AI Research Results</h4>
                        <div className="space-y-3 text-sm">
                          <div>
                            <span className="font-medium">Key Points Found:</span>
                            <ul className="mt-1 ml-4 space-y-1">
                              <li>• Hybrid work models becoming the standard</li>
                              <li>• AI tools transforming remote collaboration</li>
                              <li>• Mental health and work-life balance priorities</li>
                              <li>• Global talent pool accessibility</li>
                              <li>• Productivity measurement evolution</li>
                            </ul>
                          </div>
                          <div>
                            <span className="font-medium">Sources:</span>
                            <span className="ml-2">Harvard Business Review, McKinsey Global Institute, Gallup</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Generated Outline */}
                    <div className="space-y-4">
                      <Label>Generated Video Outline</Label>
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                        <div className="font-medium">1. Introduction (0:00-0:30)</div>
                        <div className="ml-4 text-gray-600">
                          Hook: "Remote work isn't just surviving - it's thriving"
                        </div>

                        <div className="font-medium">2. Current State (0:30-1:30)</div>
                        <div className="ml-4 text-gray-600">Statistics on hybrid work adoption</div>

                        <div className="font-medium">3. Key Trends (1:30-3:00)</div>
                        <div className="ml-4 text-gray-600">AI collaboration tools, global talent access</div>

                        <div className="font-medium">4. Challenges & Solutions (3:00-4:00)</div>
                        <div className="ml-4 text-gray-600">Mental health, productivity measurement</div>

                        <div className="font-medium">5. Conclusion (4:00-4:30)</div>
                        <div className="ml-4 text-gray-600">Call to action for viewers</div>
                      </div>
                    </div>

                    <Button size="lg" className="w-full">
                      <Video className="w-4 h-4 mr-2" />
                      Create Video from Outline
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="broll" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>AI B-Roll Assistant</CardTitle>
                    <CardDescription>
                      Upload your main footage and let AI automatically generate and insert perfect B-roll clips.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                      <Video className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="font-medium mb-2">Upload Your Main Video (A-Roll)</h3>
                      <p className="text-sm text-gray-600 mb-4">MP4, MOV, or AVI files up to 500MB</p>
                      <Button>
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Video File
                      </Button>
                    </div>

                    {/* Uploaded Video Analysis */}
                    <Card className="bg-purple-50 border-purple-200">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-3">Video Analysis</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Duration:</span> 4:32
                          </div>
                          <div>
                            <span className="font-medium">Resolution:</span> 1920x1080
                          </div>
                          <div>
                            <span className="font-medium">Topics Detected:</span> Productivity, AI Tools, Workflow
                          </div>
                          <div>
                            <span className="font-medium">B-Roll Opportunities:</span> 12 segments identified
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* B-Roll Suggestions */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>AI-Generated B-Roll Suggestions</Label>
                        <Button size="sm" variant="outline">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Regenerate
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {[
                          {
                            timestamp: "0:15-0:25",
                            description: "Close-up of hands typing on laptop keyboard",
                            prompt: "Professional workspace, hands typing, productivity focus",
                          },
                          {
                            timestamp: "1:30-1:45",
                            description: "AI interface visualization with data flowing",
                            prompt: "Futuristic AI interface, data visualization, technology",
                          },
                          {
                            timestamp: "2:45-3:00",
                            description: "Time-lapse of organized desk setup",
                            prompt: "Clean workspace organization, productivity setup",
                          },
                        ].map((suggestion, index) => (
                          <Card key={index} className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <Badge variant="outline">{suggestion.timestamp}</Badge>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="ghost">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Settings className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="font-medium text-sm mb-1">{suggestion.description}</p>
                            <p className="text-xs text-gray-600">{suggestion.prompt}</p>
                          </Card>
                        ))}
                      </div>
                    </div>

                    <Button size="lg" className="w-full">
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate & Insert B-Roll
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="custom" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Custom Content Generator</CardTitle>
                    <CardDescription>
                      Create any type of content with custom prompts and full creative control.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="customPrompt">Content Prompt</Label>
                        <Textarea
                          id="customPrompt"
                          placeholder="Describe the content you want to create..."
                          className="min-h-[120px]"
                          defaultValue="Create a motivational video about overcoming creative blocks. Include personal anecdotes about my journey as a content creator and practical tips for staying inspired."
                        />
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="contentType">Content Type</Label>
                          <Select defaultValue="motivational">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="educational">Educational</SelectItem>
                              <SelectItem value="motivational">Motivational</SelectItem>
                              <SelectItem value="tutorial">Tutorial</SelectItem>
                              <SelectItem value="review">Review</SelectItem>
                              <SelectItem value="storytelling">Storytelling</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="tone">Tone</Label>
                          <Select defaultValue="inspiring">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="casual">Casual</SelectItem>
                              <SelectItem value="professional">Professional</SelectItem>
                              <SelectItem value="inspiring">Inspiring</SelectItem>
                              <SelectItem value="humorous">Humorous</SelectItem>
                              <SelectItem value="serious">Serious</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="duration">Duration</Label>
                          <Select defaultValue="5min">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1min">1 minute</SelectItem>
                              <SelectItem value="3min">3 minutes</SelectItem>
                              <SelectItem value="5min">5 minutes</SelectItem>
                              <SelectItem value="10min">10 minutes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button className="w-full">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Custom Content
                      </Button>
                    </div>

                    {/* Generated Content Preview */}
                    <Card className="bg-orange-50 border-orange-200">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-3">Generated Script Preview</h4>
                        <div className="text-sm space-y-2">
                          <p className="font-medium">Opening Hook:</p>
                          <p className="text-gray-700 italic">
                            "We've all been there - staring at a blank screen, cursor blinking mockingly, waiting for
                            inspiration to strike. But what if I told you that creative blocks aren't roadblocks -
                            they're actually stepping stones?"
                          </p>
                          <p className="font-medium mt-4">Key Points:</p>
                          <ul className="text-gray-700 space-y-1 ml-4">
                            <li>• Personal story about my worst creative block</li>
                            <li>• The science behind creative blocks</li>
                            <li>• 5 practical techniques that actually work</li>
                            <li>• How to turn blocks into breakthroughs</li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>

                    <Button size="lg" className="w-full">
                      <Video className="w-4 h-4 mr-2" />
                      Create Video with Digital Twin
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Creative Control Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Creative Control Panel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Voice Settings */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Voice Tone</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Enthusiastic", "Calm", "Authoritative", "Conversational"].map((tone) => (
                      <Button
                        key={tone}
                        variant={tone === "Enthusiastic" ? "default" : "outline"}
                        size="sm"
                        className="text-xs"
                      >
                        {tone}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Pacing */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Speaking Pace</Label>
                  <div className="space-y-2">
                    <Slider defaultValue={[60]} max={100} step={10} />
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Slow</span>
                      <span>Fast</span>
                    </div>
                  </div>
                </div>

                {/* Visual Style */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Visual Style</Label>
                  <div className="space-y-2">
                    {["Cinematic", "Minimalist", "Corporate", "Creative"].map((style) => (
                      <div key={style} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="visual-style"
                          id={style.toLowerCase()}
                          defaultChecked={style === "Cinematic"}
                        />
                        <Label htmlFor={style.toLowerCase()} className="text-sm">
                          {style}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* B-Roll Intensity */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">B-Roll Frequency</Label>
                  <div className="space-y-2">
                    <Slider defaultValue={[70]} max={100} step={10} />
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Minimal</span>
                      <span>Heavy</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generation Queue */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Generation Queue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { title: "AI Productivity Tools", status: "Generating", progress: 45 },
                    { title: "Remote Work Future", status: "In Queue", progress: 0 },
                  ].map((item, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{item.title}</span>
                        <Badge variant={item.status === "Generating" ? "default" : "secondary"} className="text-xs">
                          {item.status}
                        </Badge>
                      </div>
                      {item.progress > 0 && (
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-1">
                            <div
                              className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                              style={{ width: `${item.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">{item.progress}%</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button size="sm" className="w-full" variant="outline">
                  <Clock className="w-4 h-4 mr-2" />
                  Schedule Generation
                </Button>
                <Button size="sm" className="w-full" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Settings
                </Button>
                <Button size="sm" className="w-full" variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset to Defaults
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
