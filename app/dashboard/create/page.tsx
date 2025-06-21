"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Sparkles,
  Plus,
  Library,
  Settings,
  User,
  Search,
  Play,
  Calendar,
  Edit,
  Eye,
  Upload,
  Video,
  Loader2,
  Bell,
  Moon,
  Sun,
} from "lucide-react"

export default function CreateDashboard() {
  const [activeTab, setActiveTab] = useState("create")
  const [contentInput, setContentInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [uploadedAvatar, setUploadedAvatar] = useState<string | null>(null)

  const handleGenerate = async () => {
    if (!contentInput.trim()) return

    setIsGenerating(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsGenerating(false)

    // Show success toast (mock)
    alert("Content generated successfully!")
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setUploadedAvatar(url)
    }
  }

  const mockLibraryContent = [
    {
      id: 1,
      title: "10 AI Tools That Will Change Your Life",
      thumbnail: "/placeholder.svg?height=120&width=200",
      date: "2024-01-15",
      type: "YouTube Video",
    },
    {
      id: 2,
      title: "The Future of Remote Work",
      thumbnail: "/placeholder.svg?height=120&width=200",
      date: "2024-01-12",
      type: "Instagram Reel",
    },
    {
      id: 3,
      title: "Productivity Hacks for Creators",
      thumbnail: "/placeholder.svg?height=120&width=200",
      date: "2024-01-10",
      type: "TikTok Video",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-slate-800 text-white flex flex-col">
        {/* Top Section */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Supernova</span>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("create")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === "create"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-slate-700"
              }`}
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Create</span>
            </button>

            <button
              onClick={() => setActiveTab("library")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === "library"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-slate-700"
              }`}
            >
              <Library className="w-5 h-5" />
              <span className="font-medium">Library</span>
            </button>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="mt-auto p-6 border-t border-slate-700">
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === "settings"
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-slate-700"
              }`}
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>

            <div className="flex items-center space-x-3 px-4 py-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">Alex Johnson</p>
                <p className="text-xs text-slate-400">Creator</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Create Tab */}
        {activeTab === "create" && (
          <div className="p-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-extrabold text-slate-900 mb-8 leading-snug">
                Generate viral content in seconds.
              </h1>

              <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="content-input" className="text-lg font-semibold text-slate-700 mb-4 block">
                      What would you like to create?
                    </Label>
                    <div className="flex space-x-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <Input
                          id="content-input"
                          value={contentInput}
                          onChange={(e) => setContentInput(e.target.value)}
                          placeholder="Enter a content idea or paste a YouTube video link..."
                          className="pl-12 h-14 text-lg rounded-xl border-2 border-slate-200 focus:border-indigo-500 transition-colors"
                        />
                      </div>
                      <Button
                        onClick={handleGenerate}
                        disabled={!contentInput.trim() || isGenerating}
                        className="h-14 px-8 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5 mr-2" />
                            Generate
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-slate-700">💡 Content Ideas</h3>
                      <div className="space-y-2">
                        {[
                          "10 productivity hacks for creators",
                          "AI tools that changed my workflow",
                          "Behind the scenes of my setup",
                        ].map((idea, index) => (
                          <button
                            key={index}
                            onClick={() => setContentInput(idea)}
                            className="w-full text-left p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-sm"
                          >
                            {idea}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-semibold text-slate-700">🎬 Video Types</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { name: "Tutorial", icon: "📚" },
                          { name: "Review", icon: "⭐" },
                          { name: "Vlog", icon: "🎥" },
                          { name: "Tips", icon: "💡" },
                        ].map((type, index) => (
                          <button
                            key={index}
                            className="p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors text-sm font-medium"
                          >
                            {type.icon} {type.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generation Progress */}
              {isGenerating && (
                <Card className="mb-8 border-indigo-200 bg-indigo-50">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                      <div>
                        <h3 className="font-semibold text-indigo-900">Generating your content...</h3>
                        <p className="text-indigo-700">This usually takes 30-60 seconds</p>
                      </div>
                    </div>
                    <div className="mt-4 bg-indigo-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Activity */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Video className="w-5 h-5 text-indigo-600" />
                      <span>Quick Start</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-600 mb-4">New to Supernova? Start with these templates:</p>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        Product Review Template
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Educational Content
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        Personal Story
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Bell className="w-5 h-5 text-indigo-600" />
                      <span>Tips & Updates</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-800">
                          <strong>New:</strong> AI voice cloning is now 40% more accurate!
                        </p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                          <strong>Tip:</strong> Upload a 30-second video for best avatar results
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Library Tab */}
        {activeTab === "library" && (
          <div className="p-8">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Content Library</h1>
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create New
                </Button>
              </div>

              {mockLibraryContent.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockLibraryContent.map((content) => (
                    <Card key={content.id} className="shadow-md hover:shadow-lg transition-all duration-200 group">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={content.thumbnail || "/placeholder.svg"}
                          alt={content.title}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Play className="w-8 h-8 text-white" />
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">{content.title}</h3>
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="secondary" className="text-xs">
                            {content.type}
                          </Badge>
                          <div className="flex items-center text-xs text-slate-500">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(content.date).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="flex-1">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Edit className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Library className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-600 mb-2">No content yet</h3>
                  <p className="text-slate-500 mb-6">Try creating something amazing!</p>
                  <Button onClick={() => setActiveTab("create")} className="bg-indigo-600 hover:bg-indigo-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Video
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="p-8">
            <div className="max-w-2xl mx-auto">
              <h1 className="text-3xl font-bold text-slate-900 mb-8">Settings</h1>

              <div className="space-y-8">
                {/* Profile Settings */}
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue="Alex" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue="Johnson" className="mt-1" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="alex@example.com" className="mt-1" />
                    </div>
                    <Button className="bg-indigo-600 hover:bg-indigo-700">Save Changes</Button>
                  </CardContent>
                </Card>

                {/* AI Avatar Upload */}
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Upload AI Avatar</CardTitle>
                    <CardDescription>Upload a short video (15-30s) to generate your digital twin</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors">
                      {uploadedAvatar ? (
                        <div className="space-y-4">
                          <video src={uploadedAvatar} className="w-32 h-32 rounded-lg mx-auto object-cover" controls />
                          <p className="text-sm text-slate-600">Video uploaded successfully!</p>
                          <Button variant="outline" onClick={() => setUploadedAvatar(null)} className="text-sm">
                            Upload Different Video
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Video className="w-12 h-12 text-slate-400 mx-auto" />
                          <div>
                            <h3 className="font-medium text-slate-700 mb-2">Upload Training Video</h3>
                            <p className="text-sm text-slate-500 mb-4">
                              This video will be used to generate your digital twin
                            </p>
                            <input
                              type="file"
                              accept="video/*"
                              onChange={handleAvatarUpload}
                              className="hidden"
                              id="avatar-upload"
                            />
                            <Label htmlFor="avatar-upload">
                              <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                                <span>
                                  <Upload className="w-4 h-4 mr-2" />
                                  Choose Video File
                                </span>
                              </Button>
                            </Label>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">Recording Tips:</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Record in good lighting with clear face visibility</li>
                        <li>• Speak naturally and include different expressions</li>
                        <li>• Keep the camera stable at eye level</li>
                        <li>• Duration: 15-30 seconds for best results</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Preferences */}
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                    <CardDescription>Customize your experience</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base font-medium">Dark Mode</Label>
                        <p className="text-sm text-slate-500">Toggle dark theme</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Sun className="w-4 h-4 text-slate-400" />
                        <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                        <Moon className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base font-medium">Email Notifications</Label>
                        <p className="text-sm text-slate-500">Receive updates about your content</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label className="text-base font-medium">Auto-save Drafts</Label>
                        <p className="text-sm text-slate-500">Automatically save your work</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                {/* Account Actions */}
                <Card className="shadow-md border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-700">Danger Zone</CardTitle>
                    <CardDescription>Irreversible account actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="destructive" className="w-full">
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
