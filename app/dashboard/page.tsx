'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { 
  Sparkles, 
  Plus, 
  Folder, 
  Settings, 
  User, 
  Search,
  Send,
  Play,
  Edit,
  Calendar,
  Upload,
  Video,
  Eye,
  Trash2,
  Menu,
  X
} from 'lucide-react'

type Tab = 'create' | 'library' | 'settings'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('create')
  const [contentInput, setContentInput] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Mock data for library
  const mockContent = [
    {
      id: 1,
      title: "10 AI Tools That Will Change Your Life",
      thumbnail: "/api/placeholder/200/120",
      createdAt: "2024-06-20",
      type: "Article-to-Video"
    },
    {
      id: 2,
      title: "How to Build a SaaS in 30 Days",
      thumbnail: "/api/placeholder/200/120", 
      createdAt: "2024-06-19",
      type: "YouTube Analysis"
    },
    {
      id: 3,
      title: "Brand Partnership Strategy Guide",
      thumbnail: "/api/placeholder/200/120",
      createdAt: "2024-06-18", 
      type: "Custom Content"
    }
  ]

  const handleGenerate = async () => {
    if (!contentInput.trim()) return
    
    setIsGenerating(true)
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false)
      setContentInput('')
      // Show success message (you can implement toast here)
    }, 3000)
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAvatarFile(file)
    }
  }

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <div className={`${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-800 text-white flex flex-col transition-transform duration-300 ease-in-out`}>
        
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Logo Section */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Supernova</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => handleTabChange('create')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'create' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Create</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabChange('library')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === 'library' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Folder className="w-5 h-5" />
                <span className="font-medium">Library</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-700 space-y-2">
          <button
            onClick={() => handleTabChange('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'settings' 
                ? 'bg-indigo-600 text-white' 
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
          <div className="flex items-center space-x-3 px-4 py-3">
            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <span className="text-sm text-slate-300">Alex Johnson</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">Supernova</span>
          </div>
          <div className="w-10" /> {/* Spacer */}
        </div>

        <div className="p-4 lg:p-8">
          {/* Create Tab */}
          {activeTab === 'create' && (
            <div className="max-w-6xl mx-auto">
              {/* Hero Section with Gradient Background */}
              <div className="relative mb-12 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 rounded-3xl"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/40 rounded-3xl"></div>
                <div className="relative p-8 lg:p-12 text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium mb-6">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI-Powered Content Creation
                  </div>
                  <h1 className="text-3xl lg:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
                    Generate viral content in{" "}
                    <span className="relative">
                      <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        seconds
                      </span>
                      <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full opacity-30"></div>
                    </span>
                  </h1>
                  <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
                    Transform any idea into engaging video content using your AI digital twin. 
                    From articles to trending topics - we've got you covered.
                  </p>
                </div>
              </div>

              {/* Main Input Section */}
              <div className="mb-10">
                <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5"></div>
                  <CardContent className="relative p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                      <div className="flex-1 relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <Input
                          value={contentInput}
                          onChange={(e) => setContentInput(e.target.value)}
                          placeholder="Enter your content idea, paste a YouTube link, or describe what you want to create..."
                          className="h-14 pl-12 text-lg border-2 border-slate-200 focus:border-indigo-400 focus:ring-indigo-400/20 bg-white/80 backdrop-blur-sm"
                          disabled={isGenerating}
                        />
                      </div>
                      <Button 
                        onClick={handleGenerate}
                        disabled={!contentInput.trim() || isGenerating}
                        className="h-14 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                      >
                        {isGenerating ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Creating Magic...</span>
                          </div>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Generate Content
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Example Prompts Section */}
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                  Popular Prompts to Get You Started
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    "10 AI tools that will change your workflow",
                    "How to build a SaaS product in 30 days",
                    "The future of remote work in 2024",
                    "Productivity hacks for entrepreneurs",
                    "Explaining blockchain in simple terms",
                    "Social media trends to watch this year"
                  ].map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setContentInput(prompt)}
                      className="p-4 text-left bg-gradient-to-r from-slate-50 to-slate-100 hover:from-indigo-50 hover:to-purple-50 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-md group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                          <Sparkles className="w-4 h-4 text-indigo-600" />
                        </div>
                        <p className="text-sm font-medium text-slate-700 group-hover:text-indigo-700 transition-colors leading-relaxed">
                          {prompt}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generation Progress */}
              {isGenerating && (
                <div className="mb-10">
                  <Card className="shadow-xl border-0 bg-gradient-to-r from-indigo-50 to-purple-50 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 animate-pulse"></div>
                    <CardContent className="relative p-6 lg:p-8">
                      <div className="flex items-center space-x-6">
                        <div className="relative">
                          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <Video className="w-8 h-8 text-white" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-900 mb-2">Creating your masterpiece...</h3>
                          <p className="text-slate-600 mb-4">Our AI is crafting your content with precision and creativity</p>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm text-slate-600">
                              <span>Progress</span>
                              <span>60%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out animate-pulse" style={{ width: '60%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Generation Steps */}
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { step: "Analyzing Input", status: "complete", icon: Search },
                          { step: "Generating Script", status: "active", icon: Edit },
                          { step: "Creating Video", status: "pending", icon: Video }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-white/60 backdrop-blur-sm">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              item.status === 'complete' ? 'bg-green-100 text-green-600' :
                              item.status === 'active' ? 'bg-indigo-100 text-indigo-600 animate-pulse' :
                              'bg-slate-100 text-slate-400'
                            }`}>
                              <item.icon className="w-4 h-4" />
                            </div>
                            <span className={`text-sm font-medium ${
                              item.status === 'complete' ? 'text-green-700' :
                              item.status === 'active' ? 'text-indigo-700' :
                              'text-slate-500'
                            }`}>
                              {item.step}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Recent Activity */}
              {!isGenerating && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                    Recent Activity
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        type: "Video Created",
                        title: "10 AI Tools That Will Change Your Life",
                        time: "2 hours ago",
                        status: "published",
                        views: "1.2K views"
                      },
                      {
                        type: "Script Generated",
                        title: "How to Build a SaaS in 30 Days",
                        time: "5 hours ago",
                        status: "draft",
                        views: "Ready for review"
                      }
                    ].map((activity, index) => (
                      <Card key={index} className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                        <CardContent className="p-5">
                          <div className="flex items-start space-x-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              activity.status === 'published' ? 'bg-green-100' : 'bg-amber-100'
                            }`}>
                              <Video className={`w-5 h-5 ${
                                activity.status === 'published' ? 'text-green-600' : 'text-amber-600'
                              }`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${
                                    activity.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                  }`}
                                >
                                  {activity.type}
                                </Badge>
                                <span className="text-xs text-slate-500">{activity.time}</span>
                              </div>
                              <h4 className="font-medium text-slate-900 mb-1 truncate">{activity.title}</h4>
                              <p className="text-sm text-slate-600">{activity.views}</p>
                            </div>
                            <Button size="sm" variant="ghost" className="shrink-0">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Library Tab */}
          {activeTab === 'library' && (
            <div className="max-w-6xl mx-auto">
              <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Your Content Library</h1>
                <p className="text-slate-600">Manage and view your created content.</p>
              </div>

              {mockContent.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mockContent.map((content) => (
                    <Card key={content.id} className="shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="aspect-video bg-slate-200 rounded-t-lg overflow-hidden">
                        <img 
                          src="/api/placeholder/300/180" 
                          alt={content.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
                          {content.title}
                        </h3>
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="secondary" className="text-xs">
                            {content.type}
                          </Badge>
                          <span className="text-xs text-slate-500 flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {content.createdAt}
                          </span>
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
                <Card className="shadow-md">
                  <CardContent className="p-8 lg:p-12 text-center">
                    <Folder className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900 mb-2">No content yet</h3>
                    <p className="text-slate-600 mb-4">Try creating something!</p>
                    <Button onClick={() => setActiveTab('create')} className="bg-indigo-600 hover:bg-indigo-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Content
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">Settings</h1>
                <p className="text-slate-600">Manage your account and preferences.</p>
              </div>

              <div className="space-y-6">
                {/* Profile Settings */}
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" defaultValue="Alex Johnson" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="alex@example.com" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Preferences */}
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="dark-mode">Dark Mode</Label>
                        <p className="text-sm text-slate-600">Toggle dark mode interface</p>
                      </div>
                      <Switch id="dark-mode" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="notifications">Email Notifications</Label>
                        <p className="text-sm text-slate-600">Receive email updates</p>
                      </div>
                      <Switch id="notifications" defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                {/* AI Avatar Upload */}
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>Upload AI Avatar</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600 mb-4">
                      Upload a short video (15-30 seconds) to generate your digital twin. 
                      This video will be used to create your AI avatar.
                    </p>
                    
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 lg:p-8 text-center hover:border-indigo-400 transition-colors">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        id="avatar-upload"
                      />
                      <label htmlFor="avatar-upload" className="cursor-pointer">
                        <Upload className="w-8 lg:w-12 h-8 lg:h-12 text-slate-400 mx-auto mb-4" />
                        <p className="text-base lg:text-lg font-medium text-slate-900 mb-2">
                          {avatarFile ? avatarFile.name : 'Click to upload video'}
                        </p>
                        <p className="text-sm text-slate-600">
                          MP4, MOV up to 100MB
                        </p>
                      </label>
                    </div>

                    {avatarFile && (
                      <div className="flex items-center space-x-4 p-4 bg-indigo-50 rounded-lg">
                        <Video className="w-8 h-8 text-indigo-600" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 truncate">{avatarFile.name}</p>
                          <p className="text-sm text-slate-600">
                            {(avatarFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setAvatarFile(null)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}

                    <Button 
                      className="w-full bg-indigo-600 hover:bg-indigo-700"
                      disabled={!avatarFile}
                    >
                      Process Avatar Video
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
