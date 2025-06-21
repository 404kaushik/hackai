'use client'

import { useState, useEffect } from 'react'
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
  Share,
  ArrowLeft
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
  const [visitedSteps, setVisitedSteps] = useState<Set<GenerationStep>>(new Set(['input']))
  const [showToast, setShowToast] = useState(false)
  const [contentLibrary, setContentLibrary] = useState<Array<{
    id: number;
    title: string;
    thumbnail: string;
    createdAt: string;
    type: string;
    script: string;
  }>>([])

  // Handle video events
  useEffect(() => {
    if (currentStep === 'video') {
      const video = document.getElementById('phone-video') as HTMLVideoElement;
      const overlay = document.getElementById('video-overlay');
      const endedOverlay = document.getElementById('video-ended');

      if (video && overlay && endedOverlay) {
        const handleVideoLoaded = () => {
          // Set video to first frame for preview
          video.currentTime = 0.5;
          console.log('Video loaded, showing preview frame');
        };

        const handleVideoCanPlay = () => {
          // Ensure video is ready and show first frame
          if (video.paused) {
            video.currentTime = 0.5;
          }
        };

        const handleVideoError = (e: Event) => {
          console.error('Video loading error:', e);
        };

        const handleVideoEnded = () => {
          overlay.style.opacity = '1';
          overlay.style.pointerEvents = 'auto';
          endedOverlay.style.opacity = '1';
          endedOverlay.style.pointerEvents = 'auto';
        };

        const handleVideoPlay = () => {
          overlay.style.opacity = '0';
          overlay.style.pointerEvents = 'none';
          endedOverlay.style.opacity = '0';
          endedOverlay.style.pointerEvents = 'none';
        };

        const handleVideoPause = () => {
          overlay.style.opacity = '1';
          overlay.style.pointerEvents = 'auto';
        };

        // Add event listeners
        video.addEventListener('loadedmetadata', handleVideoLoaded);
        video.addEventListener('canplay', handleVideoCanPlay);
        video.addEventListener('error', handleVideoError);
        video.addEventListener('ended', handleVideoEnded);
        video.addEventListener('play', handleVideoPlay);
        video.addEventListener('pause', handleVideoPause);

        // Force load the video
        video.load();

        return () => {
          video.removeEventListener('loadedmetadata', handleVideoLoaded);
          video.removeEventListener('canplay', handleVideoCanPlay);
          video.removeEventListener('error', handleVideoError);
          video.removeEventListener('ended', handleVideoEnded);
          video.removeEventListener('play', handleVideoPlay);
          video.removeEventListener('pause', handleVideoPause);
        };
      }
    }
  }, [currentStep]);

  // Define phases for generation process
  const phases = [
    { name: 'Analyzing Script...', duration: 2000 },
    { name: 'Generating Avatar...', duration: 3000 },
    { name: 'Generating Voice...', duration: 2500 },
    { name: 'Creating B-Roll Visuals...', duration: 3500 },
    { name: 'Rendering Video...', duration: 2000 },
    { name: 'Finalizing Output...', duration: 1000 }
  ]

  const handleGenerate = async () => {
    if (!contentInput.trim()) return
    
    setIsGenerating(true)
    setCurrentStep('analysis')
    setVisitedSteps(prev => new Set([...prev, 'analysis']))
    
    // Simulate API call for market analysis
    setTimeout(() => {
      setARollScript(`[0:00-0:05] A-ROLL: Here are the top 5 reasons why I think I deserve to win Hack AI.

[0:05-0:10] A-ROLL: But first, did you even realize this entire TikTok was made by AI?

[0:10-0:18] B-ROLL: The creator economy is evolving at lightning speed. With platforms like TikTok and Instagram fueling the rise of short-form user-generated content, influencer marketing has become a powerful way for brands to connect with their audiences.

[0:18-0:26] A-ROLL: That vision led us to build Supernova: a fully end-to-end, AI-powered content generator with true access to the world's content knowledge base.`)
      
      setBRollScript(`[0:00-0:05] A-ROLL SPEAKING: Creator on camera with confident energy
- Medium shot of creator
- Tech/hackathon environment background
- Pointing gesture for emphasis on "top 5 reasons"

[0:05-0:10] A-ROLL SPEAKING: Creator with surprised/questioning expression
- Close-up shot for dramatic effect
- Raised eyebrows, questioning gesture
- Slight pause after "made by AI?" for impact

[0:10-0:18] B-ROLL FOOTAGE: Creator economy montage
- Quick cuts of TikTok/Instagram interfaces
- Scrolling through viral videos
- Influencer content creation behind-the-scenes
- Brand collaboration examples
- Fast-paced editing with trending music

[0:18-0:26] A-ROLL SPEAKING: Creator explaining Supernova with passion
- Medium to close-up shot
- Gesturing toward screen/demo
- Confident, visionary tone
- Maybe holding laptop or pointing to Supernova interface`)
      
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
          setVisitedSteps(prev => new Set([...prev, 'video']))
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
    setVisitedSteps(prev => new Set([...prev, stepId as GenerationStep]))
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
    // Allow navigation to any visited step if content input exists
    return visitedSteps.has(stepId as GenerationStep) && contentInput.trim().length > 0
  }

  const generateVideoThumbnail = (videoSrc: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      video.crossOrigin = 'anonymous'
      video.src = videoSrc
      
      video.onloadedmetadata = () => {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        
        // Seek to 1 second into the video for thumbnail
        video.currentTime = 1
      }
      
      video.onseeked = () => {
        if (ctx) {
          // Draw video frame to canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          
          // Convert canvas to data URL
          const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.8)
          resolve(thumbnailDataUrl)
        } else {
          reject(new Error('Could not get canvas context'))
        }
      }
      
      video.onerror = () => {
        reject(new Error('Video failed to load'))
      }
    })
  }

  const handleAddToLibrary = async () => {
    // Create new content item
    const newContent = {
      id: Date.now(), // Simple ID generation
      title: contentInput.trim() || "Untitled Content",
      thumbnail: "/api/placeholder/300/180", // Placeholder thumbnail
      createdAt: new Date().toISOString().split('T')[0], // Today's date
      type: "AI Generated Video",
      script: aRollScript
    }
    
    // Add to library
    setContentLibrary(prev => [newContent, ...prev])
    
    setShowToast(true)
    // Hide toast and redirect after 2 seconds
    setTimeout(() => {
      setShowToast(false)
      handleStepChange('input')
      setContentInput('')
      setARollScript('')
      setBRollScript('')
      setVisitedSteps(new Set(['input']))
    }, 2000)
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
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Supernova</span>
          </div>
          </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => handleTabChange('create')}
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
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
                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
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
        <div className="p-3 border-t border-slate-700 space-y-1">
          <button
            onClick={() => handleTabChange('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'settings' 
                ? 'bg-indigo-600 text-white' 
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
          <div className="flex items-center space-x-3 px-4 py-2">
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
                  <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto p-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Video className="w-8 h-8 text-white" />
                  </div>
                      
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Creating Your Video</h3>
                      <p className="text-slate-600 mb-8">Please wait while we process your content...</p>
                      
                      {/* Simple Progress Bar */}
                      <div className="mb-8">
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-2">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${generationProgress}%` }}
                          ></div>
                  </div>
                        <p className="text-sm text-slate-500">{Math.round(generationProgress)}% complete</p>
                </div>
                      
                      {/* Current Phase Indicator */}
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center justify-center space-x-3">
                          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-slate-700 font-medium">{generationPhase}</span>
                  </div>
                  </div>
                </div>
        </div>
                </div>
              )}

              {/* Initial Input State */}
              {currentStep === 'input' && (
                <>
                  {/* Enhanced Hero Section with Visual Elements */}
                  <div className="relative text-center mb-16 max-w-4xl mx-auto">
                    {/* Subtle background decorations */}
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                      <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-30"></div>
                      <div className="absolute top-20 right-16 w-24 h-24 bg-purple-100 rounded-full blur-2xl opacity-40"></div>
                      <div className="absolute bottom-10 left-1/3 w-28 h-28 bg-pink-100 rounded-full blur-3xl opacity-25"></div>
                    </div>
                    
                    <div className="flex items-center justify-center mb-8 animate-fade-in">
                      <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">supernova</span>
                </div>

                    <h1 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-8 leading-relaxed">
                      Generate{" "}
                      <span className="relative inline-block">
                        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                          viral content
                              </span>
                        <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full opacity-60"></div>
                              </span>
                      {" "}in seconds
                    </h1>
                    
                    <p className="text-xl lg:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
                      Transform any idea into engaging video content using your AI digital twin. 
                      From articles to trending topics - we've got you covered.
                    </p>
                            </div>

                  {/* Enhanced Input Section with Glass Morphism */}
                  <div className="max-w-3xl mx-auto mb-20 relative">
                    {/* Glowing background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-xl"></div>
                    
                    <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-3xl p-8 shadow-2xl">
                      <div className="relative">
                        <Input
                          value={contentInput}
                          onChange={(e) => setContentInput(e.target.value)}
                          placeholder="describe your short video content idea.."
                          className="h-14 px-8 pr-32 text-lg border-2 border-slate-200/50 focus:border-indigo-400 focus:ring-0 focus:outline-none rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg placeholder:text-slate-400"
                          disabled={isGenerating}
                        />
                        <Button 
                          onClick={handleGenerate}
                          disabled={!contentInput.trim() || isGenerating}
                          className="absolute right-3 top-3 h-8 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          {isGenerating ? (
                            <div className="flex items-center space-x-2">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Analyzing...</span>
                            </div>
                          ) : (
                            <>
                              <Send className="w-5 h-5 mr-2" />
                              Generate
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Floating action indicators */}
                      <div className="flex items-center justify-center mt-6 space-x-6">
                        <div className="flex items-center space-x-2 text-slate-500">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium">AI Ready</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-500">
                          <Video className="w-4 h-4 text-indigo-500" />
                          <span className="text-sm font-medium">Video Generation</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-500">
                          <Sparkles className="w-4 h-4 text-purple-500" />
                          <span className="text-sm font-medium">Digital Twin</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Feature highlights with animations */}
                  <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">AI Digital Twin</h3>
                      <p className="text-slate-600 leading-relaxed">Create your personalized AI avatar that speaks and moves like you</p>
                    </div>
                    
                    <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Viral Content</h3>
                      <p className="text-slate-600 leading-relaxed">AI-powered content optimization for maximum engagement and reach</p>
                    </div>
                    
                    <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Video className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Instant Videos</h3>
                      <p className="text-slate-600 leading-relaxed">Generate professional videos in seconds with automatic B-roll and voiceover</p>
                    </div>
                  </div>
                </>
              )}

              {/* Market Analysis Step */}
              {currentStep === 'analysis' && (
                <div className="space-y-8">
                  <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-slate-900 mb-3">
                      Market Analysis for: <span className="text-indigo-600">"{contentInput}"</span>
                    </h1>
                    <p className="text-lg text-slate-600">Your AI-powered content strategy insights</p>
                  </div>

                  {/* Executive Summary */}
                  <Card className="border-l-4 border-l-indigo-600">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl text-slate-900">📊 Executive Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <div>
                            <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Target Audience</span>
                            <p className="text-slate-900 mt-1">Tech enthusiasts aged 18-28, primarily developers and students in Canada</p>
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Best Hook</span>
                            <p className="text-slate-900 mt-1">"I won $50K at Canada's biggest hackathon — here's exactly how"</p>
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Content Format</span>
                            <p className="text-slate-900 mt-1">Fast-paced storytelling + behind-the-scenes hackathon footage</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Top Competitors</span>
                            <p className="text-slate-900 mt-1">@techwithtim, @codingwithlewis, @hackathonhero</p>
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Opportunity Gap</span>
                            <p className="text-slate-900 mt-1">International students' perspective on Canadian tech scene</p>
                          </div>
                          <div>
                            <span className="text-sm font-semibold text-slate-600 uppercase tracking-wide">Confidence Level</span>
                            <p className="text-slate-900 mt-1">85% audience targeting • 92% content trends</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Audience Insights */}
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl text-slate-900 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-indigo-600" />
                        🎯 Audience Profile
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Demographics & Behavior</h4>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Age Range:</span>
                              <span className="text-slate-900 font-medium">18-28 (55%), 22-35 (35%)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Gender:</span>
                              <span className="text-slate-900 font-medium">Male 65%, Female 35%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Location:</span>
                              <span className="text-slate-900 font-medium">Toronto, Vancouver, Montreal</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Education:</span>
                              <span className="text-slate-900 font-medium">CS students, bootcamp grads</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-3">Viewing Preferences</h4>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600">Primary Platform:</span>
                              <span className="text-slate-900 font-medium">TikTok (40%), YouTube (35%)</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Best Times:</span>
                              <span className="text-slate-900 font-medium">7-9PM, 11PM-1AM</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Duration:</span>
                              <span className="text-slate-900 font-medium">15-60 seconds preferred</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600">Key Motivators:</span>
                              <span className="text-slate-900 font-medium">Career growth, community</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Content Strategy */}
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl text-slate-900 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" />
                        🔥 Content Strategy
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid lg:grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-4">Top Performing Content</h4>
                          <div className="space-y-3">
                            {[
                              { title: "I built an AI app in 48 hours", engagement: "12.3%" },
                              { title: "Canadian hackathon secrets exposed", engagement: "8.7%" },
                              { title: "Day in my life: Software engineer", engagement: "15.2%" },
                              { title: "Coding interview at Canadian tech giant", engagement: "9.8%" }
                            ].map((video, index) => (
                              <div key={index} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
                                <span className="text-sm text-slate-900">{video.title}</span>
                                <Badge variant="secondary" className="text-xs">{video.engagement}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-4">Winning Formats</h4>
                          <div className="space-y-4">
                            <div>
                              <span className="text-sm font-medium text-slate-700">Popular Hooks:</span>
                              <ul className="text-sm text-slate-600 mt-2 space-y-1 pl-4">
                                <li>• "I tried X hackathon so you don't have to"</li>
                                <li>• "POV: You're a developer in Canada"</li>
                                <li>• "This coding mistake cost me the win"</li>
                              </ul>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-slate-700">Content Types:</span>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">Tutorial</Badge>
                                <Badge variant="outline" className="text-xs">Behind-the-scenes</Badge>
                                <Badge variant="outline" className="text-xs">Day-in-life</Badge>
                                <Badge variant="outline" className="text-xs">Challenge</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Competitive Landscape */}
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl text-slate-900 flex items-center">
                        <BarChart3 className="w-5 h-5 mr-2 text-orange-600" />
                        🏆 Key Competitors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {[
                          {
                            name: "@techwithtim",
                            stats: "1.2M followers • 8.5% engagement",
                            strengths: "Clear explanations, consistent posting",
                            opportunity: "Limited Canadian content, formal tone"
                          },
                          {
                            name: "@codingwithlewis", 
                            stats: "890K followers • 12.1% engagement",
                            strengths: "Great editing, trending audio use",
                            opportunity: "Less technical depth, US-focused"
                          },
                          {
                            name: "@hackathonhero",
                            stats: "654K followers • 15.3% engagement",
                            strengths: "Authentic networking content",
                            opportunity: "Irregular posting, limited diversity"
                          }
                        ].map((creator, index) => (
                          <div key={index} className="border border-slate-200 rounded-lg p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-semibold text-slate-900">{creator.name}</h4>
                                <p className="text-sm text-slate-500">{creator.stats}</p>
                              </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-emerald-700">Strengths: </span>
                                <span className="text-slate-600">{creator.strengths}</span>
                              </div>
                              <div>
                                <span className="font-medium text-indigo-700">Your Opportunity: </span>
                                <span className="text-slate-600">{creator.opportunity}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Growth Opportunities */}
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-xl text-slate-900 flex items-center">
                        <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
                        🌱 Growth Opportunities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-4">Underserved Audiences</h4>
                          <div className="space-y-3">
                            <div className="p-3 bg-blue-50 rounded-lg">
                              <h5 className="font-medium text-blue-900 text-sm">International Students</h5>
                              <p className="text-xs text-blue-700 mt-1">Newcomers navigating Canadian tech, visa concerns</p>
                            </div>
                            <div className="p-3 bg-green-50 rounded-lg">
                              <h5 className="font-medium text-green-900 text-sm">Career Switchers</h5>
                              <p className="text-xs text-green-700 mt-1">Bootcamp students, people transitioning to tech</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-lg">
                              <h5 className="font-medium text-purple-900 text-sm">Startup Founders</h5>
                              <p className="text-xs text-purple-700 mt-1">Early-stage entrepreneurs seeking co-founders</p>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-4">Content Angles</h4>
                          <div className="space-y-4">
                            <div>
                              <span className="text-sm font-medium text-slate-700">Canadian-Specific:</span>
                              <ul className="text-sm text-slate-600 mt-2 space-y-1 pl-4">
                                <li>• "Tech salaries: Canada vs Silicon Valley"</li>
                                <li>• "Coding through Canadian winters"</li>
                                <li>• "Maple syrup as debugging fuel"</li>
                              </ul>
                            </div>
                            <div>
                              <span className="text-sm font-medium text-slate-700">Trending Microtrends:</span>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">AI tool reviews</Badge>
                                <Badge variant="outline" className="text-xs">Remote setups</Badge>
                                <Badge variant="outline" className="text-xs">Tech minimalism</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Navigation */}
                  <div className="flex justify-between items-center pt-8">
                    <Button
                      variant="outline"
                      onClick={() => handleStepChange('input')}
                      className="flex items-center"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Back to Input
                    </Button>
                    <Button
                      onClick={() => handleStepChange('storyboard')}
                      className="bg-indigo-600 hover:bg-indigo-700 flex items-center"
                    >
                      Continue to Storyboard
                    </Button>
                  </div>
                </div>
              )}

              {/* Storyboard Step */}
              {currentStep === 'storyboard' && (
                <div className="space-y-8">
                  <div className="text-center mb-8 relative">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Generated Script & Visual Plan</h1>
                    <p className="text-slate-600">Review and customize your content before generating the final video</p>
                    
                    {/* Back Button - Top Left */}
                    <Button
                      variant="outline"
                      onClick={() => handleStepChange('analysis')}
                      className="absolute top-0 left-0 flex items-center"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
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
                </div>
              )}

              {/* Final Video Step */}
              {currentStep === 'video' && (
                <div className="space-y-8">
                  <div className="text-center mb-8 relative">
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Your AI-Generated Video</h1>
                    <p className="text-slate-600">Your content is ready to share with the world!</p>
                    
                    {/* Back Button - Top Left */}
                    <Button
                      variant="outline"
                      onClick={() => handleStepChange('storyboard')}
                      className="absolute top-0 left-0 flex items-center"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                  </div>

                  <div className="flex flex-col lg:flex-row gap-8 items-start">
                    {/* TikTok-style Vertical Video Player */}
                    <div className="flex-shrink-0 mx-auto">
                      <div className="relative bg-black rounded-3xl p-2 shadow-2xl" style={{ width: '280px', height: '500px' }}>
                        {/* Phone Frame */}
                        <div className="relative w-full h-full bg-black rounded-2xl overflow-hidden">
                          {/* Video Content */}
                          <div className="relative w-full h-full bg-black">
                            {/* Actual Video Player */}
                            <video 
                              id="phone-video"
                              className="w-full h-full object-cover rounded-2xl"
                              poster="/placeholder.jpg"
                              controls={false}
                              loop
                              playsInline
                              preload="auto"
                            >
                              <source src="/HackAI Demo.mp4" type="video/mp4" />
                              {/* Fallback for browsers that don't support video */}
                              Your browser does not support the video tag.
                            </video>
                            
                            {/* Simple Play/Pause Overlay */}
                            <div 
                              id="video-overlay"
                              className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer transition-opacity duration-300"
                              onClick={async () => {
                                const video = document.getElementById('phone-video') as HTMLVideoElement;
                                const overlay = document.getElementById('video-overlay');
                                if (video && overlay) {
                                  try {
                                    if (video.paused) {
                                      // Unmute and play with audio
                                      video.muted = false;
                                      await video.play();
                                      overlay.style.opacity = '0';
                                      setTimeout(() => {
                                        overlay.style.pointerEvents = 'none';
                                      }, 300);
                                    } else {
                                      video.pause();
                                      overlay.style.opacity = '1';
                                      overlay.style.pointerEvents = 'auto';
                                    }
                                  } catch (error) {
                                    console.log('Video play failed:', error);
                                    // Fallback to muted playback if audio fails
                                    video.muted = true;
                                    await video.play();
                                    overlay.style.opacity = '0';
                                    setTimeout(() => {
                                      overlay.style.pointerEvents = 'none';
                                    }, 300);
                                  }
                                }
                              }}
                            >
                              <div className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center border-2 border-white/50 hover:bg-white/40 transition-all duration-300 hover:scale-110">
                                <Play className="w-8 h-8 text-white ml-1" />
                              </div>
                            </div>
                            
                            {/* Video ended overlay */}
                            <div 
                              id="video-ended"
                              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 pointer-events-none transition-opacity duration-300"
                            >
                              <div 
                                className="w-20 h-20 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center border-2 border-white/50 hover:bg-white/40 transition-all duration-300 hover:scale-110 cursor-pointer"
                                onClick={async () => {
                                  const video = document.getElementById('phone-video') as HTMLVideoElement;
                                  const endedOverlay = document.getElementById('video-ended');
                                  if (video && endedOverlay) {
                                    try {
                                      video.currentTime = 0;
                                      video.muted = false;
                                      await video.play();
                                      endedOverlay.style.opacity = '0';
                                      endedOverlay.style.pointerEvents = 'none';
                                    } catch (error) {
                                      console.log('Video replay failed:', error);
                                      // Fallback to muted playback if audio fails
                                      video.muted = true;
                                      video.currentTime = 0;
                                      await video.play();
                                      endedOverlay.style.opacity = '0';
                                      endedOverlay.style.pointerEvents = 'none';
                                    }
                                  }
                                }}
                              >
                                <RefreshCw className="w-8 h-8 text-white" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Video Details and Actions */}
                    <div className="flex-1 space-y-6">
                      {/* Video Metadata Cards */}
                      <div className="grid grid-cols-2 gap-4">
                        <Card>
                          <CardContent className="p-4 text-center">
                            <Clock className="w-8 h-8 mx-auto mb-2 text-indigo-600" />
                            <p className="text-sm text-slate-600">Duration</p>
                            <p className="text-lg font-semibold text-slate-900">0:26</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <Video className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                            <p className="text-sm text-slate-600">Format</p>
                            <p className="text-lg font-semibold text-slate-900">9:16 Vertical</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <User className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                            <p className="text-sm text-slate-600">Voice</p>
                            <p className="text-lg font-semibold text-slate-900">AI Avatar</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                            <p className="text-sm text-slate-600">Optimization</p>
                            <p className="text-lg font-semibold text-slate-900">TikTok Ready</p>
              </CardContent>
            </Card>
          </div>

                      {/* Performance Prediction */}
                      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                        <CardHeader>
                          <CardTitle className="flex items-center text-green-800">
                            <TrendingUp className="w-5 h-5 mr-2" />
                            Predicted Performance
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-2xl font-bold text-green-700">8.5K - 12K</p>
                              <p className="text-sm text-green-600">Expected Views</p>
        </div>
                            <div>
                              <p className="text-2xl font-bold text-green-700">650 - 900</p>
                              <p className="text-sm text-green-600">Likely Engagement</p>
                            </div>
                            <div>
                              <p className="text-2xl font-bold text-green-700">92%</p>
                              <p className="text-sm text-green-600">Viral Potential</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-lg py-3">
                          <Download className="w-5 h-5 mr-2" />
                          Download for TikTok
                        </Button>
                        <div className="grid grid-cols-2 gap-3">
                          <Button variant="outline" className="py-3">
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Script
                          </Button>
                          <Button variant="outline" className="py-3">
                            <Save className="w-4 h-4 mr-2" />
                            Save to Library
                          </Button>
                        </div>
                      </div>

                      {/* Success Message */}
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 text-emerald-700">
                          <Check className="w-5 h-5" />
                          <span className="font-medium">Video optimized for maximum TikTok engagement!</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-center items-center pt-4">
                    <Button
                      onClick={handleAddToLibrary}
                      className="bg-emerald-600 hover:bg-emerald-700 flex items-center"
                    >
                      Add to Library
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

              {contentLibrary.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {contentLibrary.map((content) => (
                    <Card key={content.id} className="shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="aspect-video bg-slate-200 rounded-t-lg overflow-hidden">
                        <img 
                          src={content.thumbnail} 
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

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-emerald-600 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3">
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold">Added to Library!</p>
              <p className="text-sm text-emerald-100">Your video has been saved successfully</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
