import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Upload,
  Video,
  Mic,
  Camera,
  Play,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Settings,
  Download,
} from "lucide-react"
import Link from "next/link"

export default function DigitalTwinPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Digital Twin Studio
              </span>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Advanced Settings
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Overview */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Your Digital Twin</h1>
          <p className="text-gray-600 mb-6">
            Build a high-fidelity AI avatar and voice clone of yourself for unlimited content creation.
          </p>

          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Overall Progress</h3>
                <span className="text-2xl font-bold text-purple-600">73%</span>
              </div>
              <Progress value={73} className="h-3 mb-4" />
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Basic Info Complete</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <span>Video Training In Progress</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <span>Voice Clone Pending</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Setup Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="video" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="video">Video Training</TabsTrigger>
                <TabsTrigger value="voice">Voice Clone</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                    <CardDescription>Tell us about yourself to personalize your digital twin.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue="Alex" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue="Johnson" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="niche">Content Niche</Label>
                      <Input
                        id="niche"
                        placeholder="e.g., Tech Reviews, Productivity, Lifestyle"
                        defaultValue="Tech & Productivity"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Brief description of your content style and personality..."
                        defaultValue="Tech enthusiast and productivity expert helping creators scale their content with AI tools."
                      />
                    </div>
                    <div>
                      <Label htmlFor="tone">Speaking Tone</Label>
                      <Input
                        id="tone"
                        placeholder="e.g., Casual, Professional, Energetic"
                        defaultValue="Casual and Enthusiastic"
                      />
                    </div>
                    <Button className="w-full">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Save Profile Information
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="video" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Video Training Data</CardTitle>
                    <CardDescription>
                      Upload 3-5 high-quality videos of yourself speaking to train your avatar.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                      <Video className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="font-medium mb-2">Upload Training Videos</h3>
                      <p className="text-sm text-gray-600 mb-4">MP4, MOV, or AVI files up to 100MB each</p>
                      <Button>
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Files
                      </Button>
                    </div>

                    {/* Uploaded Videos */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Uploaded Videos (2/5)</h4>

                      {[
                        { name: "intro-video.mp4", status: "Processing", progress: 65 },
                        { name: "talking-head.mp4", status: "Complete", progress: 100 },
                      ].map((video, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center">
                            <Video className="w-4 h-4 text-gray-500" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{video.name}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Progress value={video.progress} className="h-1 flex-1" />
                              <span className="text-xs text-gray-600">{video.progress}%</span>
                            </div>
                          </div>
                          <Badge variant={video.status === "Complete" ? "default" : "secondary"}>{video.status}</Badge>
                        </div>
                      ))}
                    </div>

                    {/* Recording Guidelines */}
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2 flex items-center">
                          <Camera className="w-4 h-4 mr-2 text-blue-600" />
                          Recording Tips
                        </h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Record in good lighting with your face clearly visible</li>
                          <li>• Speak naturally for 30-60 seconds per video</li>
                          <li>• Include different expressions and head movements</li>
                          <li>• Use a stable camera position at eye level</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="voice" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Voice Clone Training</CardTitle>
                    <CardDescription>Record audio samples to create your personalized voice clone.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Recording Interface */}
                    <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg">
                      <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mic className="w-10 h-10 text-purple-600" />
                      </div>
                      <h3 className="font-medium mb-2">Record Your Voice</h3>
                      <p className="text-sm text-gray-600 mb-6">Read the provided script clearly and naturally</p>
                      <div className="flex justify-center space-x-4">
                        <Button size="lg" className="bg-red-500 hover:bg-red-600">
                          <Mic className="w-4 h-4 mr-2" />
                          Start Recording
                        </Button>
                        <Button size="lg" variant="outline">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Audio
                        </Button>
                      </div>
                    </div>

                    {/* Script to Read */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Sample Script (1/5)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <p className="text-sm leading-relaxed">
                            "Hello everyone! Welcome back to my channel. Today we're going to dive deep into the world
                            of artificial intelligence and how it's transforming content creation. I'm really excited to
                            share these insights with you, and I think you'll find this information incredibly valuable
                            for your own creative journey."
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <Button variant="outline" size="sm">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Previous Script
                          </Button>
                          <Button size="sm">
                            Next Script
                            <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Recorded Samples */}
                    <div className="space-y-3">
                      <h4 className="font-medium">Recorded Samples (2/5)</h4>

                      {[
                        { name: "Sample 1", duration: "0:45", status: "Complete" },
                        { name: "Sample 2", duration: "0:52", status: "Processing" },
                      ].map((sample, index) => (
                        <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Mic className="w-4 h-4 text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">{sample.name}</p>
                            <p className="text-xs text-gray-600">{sample.duration}</p>
                          </div>
                          <Button size="sm" variant="ghost">
                            <Play className="w-4 h-4" />
                          </Button>
                          <Badge variant={sample.status === "Complete" ? "default" : "secondary"}>
                            {sample.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="preview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Digital Twin Preview</CardTitle>
                    <CardDescription>
                      Test your AI avatar and voice clone before using it in content creation.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Preview Video */}
                    <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                      <img
                        src="/placeholder.svg?height=400&width=600"
                        alt="Digital Twin Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <Button size="lg" className="bg-white/90 text-black hover:bg-white">
                          <Play className="w-6 h-6 mr-2" />
                          Preview Digital Twin
                        </Button>
                      </div>
                    </div>

                    {/* Test Script Input */}
                    <div className="space-y-4">
                      <Label htmlFor="testScript">Test Script</Label>
                      <Textarea
                        id="testScript"
                        placeholder="Enter text for your digital twin to speak..."
                        defaultValue="Hey everyone! This is my AI digital twin speaking. Pretty cool, right? I can now create unlimited content without ever picking up a camera!"
                      />
                      <div className="flex space-x-4">
                        <Button className="flex-1">
                          <Video className="w-4 h-4 mr-2" />
                          Generate Preview
                        </Button>
                        <Button variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download Sample
                        </Button>
                      </div>
                    </div>

                    {/* Quality Metrics */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <Card className="text-center">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-green-600 mb-1">92%</div>
                          <div className="text-sm text-gray-600">Voice Similarity</div>
                        </CardContent>
                      </Card>
                      <Card className="text-center">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-blue-600 mb-1">88%</div>
                          <div className="text-sm text-gray-600">Visual Accuracy</div>
                        </CardContent>
                      </Card>
                      <Card className="text-center">
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-purple-600 mb-1">95%</div>
                          <div className="text-sm text-gray-600">Lip Sync Quality</div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Training Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Profile Setup</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Video Training</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={65} className="w-16 h-2" />
                      <span className="text-xs">65%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Voice Clone</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={40} className="w-16 h-2" />
                      <span className="text-xs">40%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Final Processing</span>
                    <AlertCircle className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-3">Estimated completion: 2-3 hours</p>
                  <Button size="sm" className="w-full" disabled>
                    Training in Progress...
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tips & Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Pro Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <p>Upload videos with different expressions and angles for better results</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <p>Record voice samples in a quiet environment for clearer audio</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <p>The more training data you provide, the better your digital twin will be</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <h4 className="font-medium mb-2 flex items-center text-orange-800">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Privacy & Security
                </h4>
                <p className="text-sm text-orange-700">
                  Your training data is encrypted and only used to create your personal digital twin. We never share or
                  use your data for other purposes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
