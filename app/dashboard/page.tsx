'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
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
  X,
  TrendingUp,
  Target,
  Users,
  BarChart3,
  RefreshCw,
  Download,
  Copy,
  Save,
  Check,
  Clock,
  Globe,
  Heart,
  MessageCircle,
  Share
} from 'lucide-react'

type Tab = 'create' | 'library' | 'settings'
type GenerationStep = 'input' | 'analysis' | 'storyboard' | 'video'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('create')
  const [contentInput, setContentInput] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState<GenerationStep>('input')
  const [aRollScript, setARollScript] = useState('')
  const [bRollScript, setBRollScript] = useState('')
  const [generationPhase, setGenerationPhase] = useState('')
  const [generationProgress, setGenerationProgress] = useState(0)

  // Define phases for generation process
  const phases = [
    { name: 'Analyzing Script...', duration: 2000 },
    { name: 'Generating Avatar...', duration: 3000 },
    { name: 'Generating Voice...', duration: 2500 },
    { name: 'Creating B-Roll Visuals...', duration: 3500 },
    { name: 'Rendering Video...', duration: 2000 },
    { name: 'Finalizing Output...', duration: 1000 }
  ]

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
    setCurrentStep('analysis')
    
    // Simulate API call for market analysis
    setTimeout(() => {
      setARollScript(`Welcome everyone! Today we're diving into the top 5 travel destinations in Japan that you absolutely need to visit.

Japan has been my passion for over a decade, and I've personally explored every corner of this incredible country. From bustling metropolitan cities to serene traditional villages, Japan offers experiences that will change your perspective on travel forever.

First up is Tokyo - the electric heart of modern Japan. This mega-city seamlessly blends cutting-edge technology with ancient traditions. You'll find towering skyscrapers next to centuries-old temples, and the energy here is absolutely infectious.

Next, we have Kyoto - the cultural soul of Japan. With over 2,000 temples and shrines, Kyoto is where you'll experience the true essence of traditional Japanese culture. The bamboo groves of Arashiyama and the iconic Fushimi Inari shrine are absolutely breathtaking.

Third is Mount Fuji and the Hakone region. This iconic volcanic peak is Japan's most recognizable landmark, and the surrounding area offers hot springs, beautiful lakes, and some of the most stunning views you'll ever see.`)
      
      setBRollScript(`SCENE 1: Tokyo montage
- Aerial shots of Tokyo skyline at sunset
- Time-lapse of Shibuya crossing
- Close-ups of neon signs in Harajuku
- Traditional temple ceremony footage

SCENE 2: Kyoto cultural scenes  
- Slow-motion shots of geishas walking through Gion district
- Bamboo forest walkthrough (handheld camera)
- Golden hour at Kinkaku-ji temple
- Traditional tea ceremony close-ups

SCENE 3: Mount Fuji region
- Sunrise over Mount Fuji from Lake Kawaguchi
- Hot spring steam rising (macro lens)
- Traditional ryokan exterior and interior shots
- Cherry blossoms in foreground with Fuji in background`)
      
      setIsGenerating(false)
    }, 3000)
  }

  const handleGenerateVideo = () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    
    let currentPhaseIndex = 0
    let totalDuration = phases.reduce((sum, phase) => sum + phase.duration, 0)
    let elapsedTime = 0
    
    const runPhase = () => {
      if (currentPhaseIndex < phases.length) {
        const currentPhase = phases[currentPhaseIndex]
        setGenerationPhase(currentPhase.name)
        
        setTimeout(() => {
          elapsedTime += currentPhase.duration
          setGenerationProgress((elapsedTime / totalDuration) * 100)
          currentPhaseIndex++
          runPhase()
        }, currentPhase.duration)
      } else {
        // Generation complete
        setTimeout(() => {
          setCurrentStep('video')
          setIsGenerating(false)
          setGenerationPhase('')
          setGenerationProgress(0)
        }, 500)
      }
    }
    
    runPhase()
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

  const handleStepChange = (stepId: string) => {
    setCurrentStep(stepId as GenerationStep)
  }

  const steps = [
    { id: 'analysis', title: 'Market Analysis', number: 1 },
    { id: 'storyboard', title: 'Storyboard', number: 2 },
    { id: 'video', title: 'Final Video', number: 3 }
  ]

  const getStepStatus = (stepId: string) => {
    const stepOrder = ['analysis', 'storyboard', 'video']
    const currentIndex = stepOrder.indexOf(currentStep)
    const stepIndex = stepOrder.indexOf(stepId)
    
    if (stepIndex < currentIndex) return 'complete'
    if (stepIndex === currentIndex) return 'active'
    return 'pending'
  }

  const canNavigateToStep = (stepId: string) => {
    const stepOrder = ['analysis', 'storyboard', 'video']
    const currentIndex = stepOrder.indexOf(currentStep)
    const stepIndex = stepOrder.indexOf(stepId)
    
    // Only allow navigation to past steps or current step
    return stepIndex <= currentIndex && contentInput.trim().length > 0
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

        {/* Progress Bar - Sticky */}
        {currentStep !== 'input' && (
          <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const status = getStepStatus(step.id)
                  const canNavigate = canNavigateToStep(step.id)
                  return (
                    <div key={step.id} className="flex items-center">
                      <div className="flex items-center">
                        <button
                          onClick={() => canNavigate && handleStepChange(step.id)}
                          disabled={!canNavigate}
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                            status === 'complete' ? 'bg-emerald-500 text-white hover:bg-emerald-600' :
                            status === 'active' ? 'bg-indigo-600 text-white' :
                            'bg-gray-200 text-gray-400 cursor-not-allowed'
                          } ${canNavigate ? 'cursor-pointer' : ''}`}
                        >
                          {step.number}
                        </button>
                        <div className="ml-3">
                          <button
                            onClick={() => canNavigate && handleStepChange(step.id)}
                            disabled={!canNavigate}
                            className={`text-left ${canNavigate ? 'cursor-pointer hover:text-indigo-600' : 'cursor-not-allowed'}`}
                          >
                            <p className={`text-sm font-medium transition-colors ${
                              status === 'active' ? 'text-indigo-600' : 
                              status === 'complete' ? 'text-emerald-600' : 
                              'text-gray-400'
                            }`}>
                              {step.title}
                            </p>
                          </button>
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`mx-4 lg:mx-8 h-0.5 w-16 lg:w-24 transition-colors duration-300 ${
                          getStepStatus(steps[index + 1].id) !== 'pending' ? 'bg-emerald-500' : 'bg-gray-200'
                        }`} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        <div className="p-4 lg:p-8">
          {/* Create Tab */}
          {activeTab === 'create' && (
            <div className="max-w-6xl mx-auto relative">
              {/* Full-Screen Video Generation Loading Overlay */}
              {isGenerating && currentStep === 'storyboard' && generationPhase && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto p-6">
                    <div className="text-center">
                      <div className="relative mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                          <Video className="w-8 h-8 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Creating Your Video</h3>
                      <p className="text-slate-600 mb-6">Please wait while we process your content...</p>
                      
                      {/* Progress Bar */}
                      <div className="space-y-3 mb-8">
                        <div className="flex justify-between text-sm font-medium text-slate-700">
                          <span>Progress</span>
                          <span>{Math.round(generationProgress)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${generationProgress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Vertical Carousel of Generation Steps */}
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {[
                          { step: "Script Analysis", icon: Search, phase: "Analyzing Script..." },
                          { step: "Avatar Creation", icon: User, phase: "Generating Avatar..." },
                          { step: "Voice Synthesis", icon: User, phase: "Generating Voice..." },
                          { step: "Visual Creation", icon: Video, phase: "Creating B-Roll Visuals..." },
                          { step: "Video Rendering", icon: Play, phase: "Rendering Video..." },
                          { step: "Final Processing", icon: Check, phase: "Finalizing Output..." }
                        ].map((item, index) => {
                          const isActive = generationPhase === item.phase
                          const isCompleted = generationPhase && phases.findIndex(p => p.name === generationPhase) > phases.findIndex(p => p.name === item.phase)
                          
                          return (
                            <div 
                              key={index} 
                              className={`flex items-center p-3 rounded-xl transition-all duration-500 transform ${
                                isActive ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white scale-105 shadow-lg' :
                                isCompleted ? 'bg-emerald-500 text-white scale-100' :
                                'bg-slate-100 text-slate-400 scale-95 opacity-60'
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 transition-all duration-500 ${
                                isActive ? 'bg-white/20 animate-pulse' :
                                isCompleted ? 'bg-white/20' :
                                'bg-white/10'
                              }`}>
                                <item.icon className="w-5 h-5" />
                              </div>
                              <div className="flex-1 text-left">
                                <h4 className="font-medium text-sm">{item.step}</h4>
                                {isActive && (
                                  <p className="text-xs opacity-90">Processing...</p>
                                )}
                                {isCompleted && (
                                  <p className="text-xs opacity-90">✓ Complete</p>
                                )}
                              </div>
                              {isActive && (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Initial Input State */}
              {currentStep === 'input' && (
                <>
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
                                <span>Analyzing...</span>
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
                        "Top 5 travel destinations in Japan",
                        "10 AI tools that will change your workflow",
                        "How to build a SaaS product in 30 days",
                        "The future of remote work in 2024",
                        "Productivity hacks for entrepreneurs",
                        "Explaining blockchain in simple terms"
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
                </>
              )}

              {/* Market Analysis Step */}
              {currentStep === 'analysis' && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">
                      Market Intelligence for: <span className="text-indigo-600">"{contentInput}"</span>
                    </h1>
                    <p className="text-slate-600">Analyzing market trends and opportunities for your content</p>
                  </div>

                  {/* Trending Content */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
                        Trending Content
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex space-x-4 overflow-x-auto pb-4">
                        {[
                          { title: "Japan Travel Guide 2024", views: "2.3M", thumbnail: "/api/placeholder/200/120" },
                          { title: "Hidden Gems in Tokyo", views: "1.8M", thumbnail: "/api/placeholder/200/120" },
                          { title: "Budget Travel Japan", views: "956K", thumbnail: "/api/placeholder/200/120" },
                          { title: "Best Japanese Food", views: "743K", thumbnail: "/api/placeholder/200/120" }
                        ].map((video, index) => (
                          <div key={index} className="flex-shrink-0 w-48">
                            <img src={video.thumbnail} alt={video.title} className="w-full h-28 object-cover rounded-lg mb-2" />
                            <h4 className="font-medium text-sm text-slate-900 mb-1 line-clamp-2">{video.title}</h4>
                            <p className="text-xs text-slate-600 flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {video.views} views
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Trending Topics & Keywords */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-emerald-600" />
                        Trending Topics & Keywords
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Japan travel", "Tokyo guide", "Kyoto temples", "Mount Fuji", "Japanese culture",
                          "Travel vlog", "Asia travel", "Budget travel", "Solo travel", "Cherry blossoms",
                          "Japanese food", "Traditional Japan", "Modern Tokyo", "Travel tips"
                        ].map((tag, index) => (
                          <Badge key={index} variant="secondary" className="px-3 py-1">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Target Audience */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Target className="w-5 h-5 mr-2 text-purple-600" />
                          Target Audience
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-slate-700">Age Range</Label>
                          <p className="text-lg font-semibold text-slate-900">25-34 (45%), 18-24 (30%)</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-slate-700">Gender Split</Label>
                          <p className="text-lg font-semibold text-slate-900">Female 58%, Male 42%</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-slate-700">Top Locations</Label>
                          <p className="text-lg font-semibold text-slate-900">US, UK, Canada, Australia</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-slate-700">Interests</Label>
                          <p className="text-lg font-semibold text-slate-900">Travel, Culture, Photography</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Users className="w-5 h-5 mr-2 text-orange-600" />
                          Competitive Landscape
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            { channel: "Japan Travel Guide", subs: "2.3M", engagement: "4.2%" },
                            { channel: "Tokyo Insider", subs: "1.8M", engagement: "3.8%" },
                            { channel: "Wandering Japan", subs: "956K", engagement: "5.1%" }
                          ].map((competitor, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <div>
                                <p className="font-medium text-slate-900">{competitor.channel}</p>
                                <p className="text-sm text-slate-600">{competitor.subs} subscribers</p>
                              </div>
                              <Badge variant="outline">{competitor.engagement} engagement</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Source Attribution */}
                  <Card className="bg-slate-50">
                    <CardContent className="p-4">
                      <p className="text-xs text-slate-600 flex items-center">
                        <Globe className="w-3 h-3 mr-1" />
                        Data powered by Perplexity AI, YouTube Analytics, and social media insights
                      </p>
                    </CardContent>
                  </Card>

                  {/* Navigation */}
                  <div className="flex justify-between items-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('input')}
                      className="flex items-center"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Back to Input
                    </Button>
                    <Button
                      onClick={() => setCurrentStep('storyboard')}
                      className="bg-indigo-600 hover:bg-indigo-700 flex items-center"
                    >
                      Continue to Storyboard
                      <Edit className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Storyboard Step */}
              {currentStep === 'storyboard' && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Generated Script & Visual Plan</h1>
                    <p className="text-slate-600">Review and customize your content before generating the final video</p>
                  </div>

                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* A-Roll Script */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center">
                            <User className="w-5 h-5 mr-2 text-indigo-600" />
                            A-Roll Script
                          </div>
                          <Button size="sm" variant="outline">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Regenerate
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          value={aRollScript}
                          onChange={(e) => setARollScript(e.target.value)}
                          className="min-h-[400px] text-sm leading-relaxed"
                          placeholder="Your spoken content will appear here..."
                        />
                      </CardContent>
                    </Card>

                    {/* B-Roll Script */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Video className="w-5 h-5 mr-2 text-emerald-600" />
                            B-Roll Script
                          </div>
                          <Button size="sm" variant="outline">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Regenerate
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          value={bRollScript}
                          onChange={(e) => setBRollScript(e.target.value)}
                          className="min-h-[400px] text-sm leading-relaxed font-mono"
                          placeholder="Visual cues and B-roll instructions will appear here..."
                        />
                      </CardContent>
                    </Card>
                  </div>

                  {/* Generate Video Button */}
                  <div className="flex justify-center">
                    <Button
                      onClick={handleGenerateVideo}
                      disabled={isGenerating || !aRollScript || !bRollScript}
                      className="px-8 py-4 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      {isGenerating ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Starting Generation...</span>
                        </div>
                      ) : (
                        <>
                          <Video className="w-5 h-5 mr-2" />
                          Generate Video
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('analysis')}
                      disabled={isGenerating}
                      className="flex items-center"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Back to Analysis
                    </Button>
                  </div>
                </div>
              )}

              {/* Final Video Step */}
              {currentStep === 'video' && (
                <div className="space-y-8">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Your AI-Generated Video</h1>
                    <p className="text-slate-600">Your content is ready to share with the world!</p>
                  </div>

                  {/* Video Player */}
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                        <img 
                          src="/api/placeholder/800/450" 
                          alt="Video thumbnail"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Button className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 border-2 border-white/50">
                            <Play className="w-6 h-6 text-white ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Video Metadata */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Clock className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                        <p className="text-sm text-slate-600">Duration</p>
                        <p className="text-lg font-semibold text-slate-900">3:42</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Video className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                        <p className="text-sm text-slate-600">Resolution</p>
                        <p className="text-lg font-semibold text-slate-900">1080p</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <User className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                        <p className="text-sm text-slate-600">Voice</p>
                        <p className="text-lg font-semibold text-slate-900">Alex (AI)</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 text-center">
                        <Eye className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                        <p className="text-sm text-slate-600">Format</p>
                        <p className="text-lg font-semibold text-slate-900">MP4</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700">
                      <Download className="w-4 h-4 mr-2" />
                      Download Video
                    </Button>
                    <Button variant="outline" className="flex-1 sm:flex-none">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Script
                    </Button>
                    <Button variant="outline" className="flex-1 sm:flex-none">
                      <Save className="w-4 h-4 mr-2" />
                      Save to Library
                    </Button>
                  </div>

                  {/* Success Toast Simulation */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 text-emerald-700">
                      <Check className="w-5 h-5" />
                      <span className="font-medium">Video generated successfully!</span>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between items-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep('storyboard')}
                      className="flex items-center"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Back to Storyboard
                    </Button>
                    <Button
                      onClick={() => {
                        setCurrentStep('input')
                        setContentInput('')
                        setARollScript('')
                        setBRollScript('')
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 flex items-center"
                    >
                      Create New Content
                      <Plus className="w-4 h-4 ml-2" />
                    </Button>
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
