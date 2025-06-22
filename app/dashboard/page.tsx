"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
  Send,
  Play,
  Calendar,
  Upload,
  Video,
  Eye,
  Trash2,
  Menu,
  X,
  TrendingUp,
  Users,
  BarChart3,
  RefreshCw,
  Download,
  Copy,
  Save,
  Check,
  Clock,
  ArrowLeft,
  AlertCircle,
  Loader2,
  Edit,
  ChevronUp,
  ArrowUp,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

type Tab = "create" | "library" | "settings"
type GenerationStep = "input" | "analysis" | "storyboard" | "video"

// HeyGen API Configuration
// Using your actual HeyGen API token as provided by HeyGen
const HEYGEN_API_KEY = 'NDkzMWIyMzUxMzY1NDZhZWE0ZGFmZmU5ZWJlYmQ4ZTMtMTc1MDUyNDk5Mg==' // Your actual HeyGen API token

const HEYGEN_BASE_URL = 'https://api.heygen.com'

// Pexels API Configuration
const PEXELS_API_KEY = 'hib9VuJK7n90ypzjwcD2Y0pCqeOwUALpICzvld0CZKdfXYB8p0xLPPqb'
const PEXELS_BASE_URL = 'https://api.pexels.com/videos'


// Helper function to get the API key
const getApiKey = () => {
  // Use the API token directly as provided by HeyGen
  return HEYGEN_API_KEY
}


// HeyGen API Functions
const heygenAPI = {
  // Helper function to clean timestamps and technical directions from script
  cleanScriptForSpeech: (script: string): string => {
    // Remove timestamp patterns like [0:00-0:05], [0:05-0:10], etc.
    let cleanScript = script.replace(/\[\d+:\d+-\d+:\d+\]/g, '')
    
    // Remove **Presenter** labels with asterisks
    cleanScript = cleanScript.replace(/\*\*Presenter\*\*/gi, '')
    
    // Remove Presenter labels with timestamps like "Presenter (00:00-00:03):"
    cleanScript = cleanScript.replace(/Presenter\s*\(\d+:\d+-\d+:\d+\)\s*:\s*/gi, '')
    
    // Remove standalone timestamps in parentheses like (00:00-00:03)
    cleanScript = cleanScript.replace(/\(\d+:\d+-\d+:\d+\)\s*:\s*/g, '')
    
    // Remove any remaining **text** patterns (asterisk formatting)
    cleanScript = cleanScript.replace(/\*\*(.*?)\*\*/g, '$1')
    
    // Remove "A-ROLL:" and "B-ROLL:" labels
    cleanScript = cleanScript.replace(/A-ROLL:\s*/gi, '')
    cleanScript = cleanScript.replace(/B-ROLL:\s*/gi, '')
    
    // Remove stage directions in parentheses
    cleanScript = cleanScript.replace(/\([^)]*\)/g, '')
    
    // Remove extra whitespace and line breaks
    cleanScript = cleanScript.replace(/\n\s*\n/g, '\n').trim()
    
    // Split by lines and keep only the actual spoken content
    const lines = cleanScript.split('\n')
    const spokenLines = lines.filter(line => {
      const trimmed = line.trim()
      // Skip empty lines, stage directions, and technical notes
      return trimmed && 
             !trimmed.startsWith('(') && 
             !trimmed.startsWith('[') &&
             !trimmed.toLowerCase().includes('b-roll') &&
             !trimmed.toLowerCase().includes('a-roll') &&
             !trimmed.toLowerCase().includes('medium shot') &&
             !trimmed.toLowerCase().includes('close-up') &&
             !trimmed.toLowerCase().includes('wide shot') &&
             !trimmed.toLowerCase().startsWith('presenter')
    })
    
    return spokenLines.join(' ').replace(/\s+/g, ' ').trim()
  },

  // Test API key validity
  async testApiKey() {
    try {
      // Get the API key (HeyGen token format)
      const apiKey = getApiKey()
      console.log('Testing HeyGen API token (first 10 chars):', apiKey.substring(0, 10) + '...')
      console.log('API token length:', apiKey.length)
      console.log('API token format check:', {
        isBase64Format: /^[A-Za-z0-9+/]*={0,2}$/.test(apiKey),
        length: apiKey.length,
        endsWithEquals: apiKey.endsWith('=') || apiKey.endsWith('==')
      })
      
      const response = await fetch(`${HEYGEN_BASE_URL}/v2/avatars?limit=1`, {
        headers: {
          'Accept': 'application/json',
          'X-Api-Key': apiKey,
        },
      })
      
      console.log('API Response status:', response.status)
      console.log('API Response headers:', Object.fromEntries(response.headers.entries()))
      
      if (response.status === 401) {
        throw new Error('Invalid API token - Check if your HeyGen API token is correct and has proper permissions')
      }
      
      if (response.status === 403) {
        throw new Error('API token forbidden - Check if your HeyGen plan includes avatar access')
      }
      
      if (!response.ok) {
        const errorText = await response.text()
        console.log('API Error response:', errorText)
        throw new Error(`API request failed with status ${response.status}: ${errorText}`)
      }
      
      const data = await response.json()
      console.log('API Response data:', data)
      return response.ok && (data.error === null || data.error === undefined)
    } catch (error) {
      console.error('API token test failed:', error)
      return false
    }
  },

  async getAvatars() {
    try {
      const response = await fetch(`${HEYGEN_BASE_URL}/v2/avatars`, {
        headers: {
          'Accept': 'application/json',
          'X-Api-Key': getApiKey(),
        },
      })
      
      if (response.status === 401) {
        throw new Error('Unauthorized: Invalid API key')
      }
      
      const data = await response.json()
      return data.data?.avatars || []
    } catch (error) {
      console.error('Error fetching avatars:', error)
      return []
    }
  },

  async getVoices() {
    try {
      const response = await fetch(`${HEYGEN_BASE_URL}/v2/voices`, {
        headers: {
          'Accept': 'application/json',
          'X-Api-Key': getApiKey(),
        },
      })
      
      if (response.status === 401) {
        throw new Error('Unauthorized: Invalid API key')
      }
      
      const data = await response.json()
      return data.data?.voices || []
    } catch (error) {
      console.error('Error fetching voices:', error)
      return []
    }
  },

  async uploadAsset(file: File) {
    try {
      const response = await fetch('https://upload.heygen.com/v1/asset', {
        method: 'POST',
        headers: {
          'Content-Type': file.type,
          'X-Api-Key': getApiKey(),
        },
        body: file
      })
      
      const data = await response.json()
      
      // Check for HeyGen's success response format
      if (data.code !== 100) {
        throw new Error(data.message || data.msg || 'Upload failed')
      }
      
      // Return the asset data
      return data.data
    } catch (error) {
      console.error('Error uploading asset:', error)
      throw error
    }
  },

  // Simulated avatar creation process
  async createInstantAvatar(assetId: string, avatarName: string) {
    // In a real implementation, this would trigger HeyGen's avatar creation process
    // For now, we'll simulate the process and provide instructions
    try {
      // This would be the actual API call when available:
      // const response = await fetch(`${HEYGEN_BASE_URL}/v2/avatars/instant`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'X-Api-Key': atob(HEYGEN_API_KEY),
      //   },
      //   body: JSON.stringify({
      //     asset_id: assetId,
      //     avatar_name: avatarName
      //   })
      // })
      
      // For now, return a simulated response
      return {
        avatar_creation_id: `sim_${Date.now()}`,
        status: 'processing',
        estimated_time: '10-15 minutes'
      }
    } catch (error) {
      console.error('Error creating instant avatar:', error)
      throw error
    }
  },

  async generateVideo(avatarId: string, voiceId: string, script: string, brollFootage: any[] = []) {
    try {
      // Clean the script to remove timestamps and technical directions
      const cleanScript = heygenAPI.cleanScriptForSpeech(script)
      
      console.log('Original script:', script)
      console.log('Cleaned script for speech:', cleanScript)
      console.log('B-roll footage available:', brollFootage.length)
      
      // For now, generate a standard avatar video since HeyGen may not support video_background
      // The B-roll footage is logged for future integration when HeyGen supports it
      const response = await fetch(`${HEYGEN_BASE_URL}/v2/video/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': getApiKey(),
        },
        body: JSON.stringify({
          video_inputs: [
            {
              character: {
                type: "avatar",
                avatar_id: avatarId,
                avatar_style: "normal"
              },
              voice: {
                type: "text",
                input_text: cleanScript,
                voice_id: voiceId,
                speed: 1.0
              }
            }
          ],
          dimension: {
            width: 720,
            height: 1280 // Vertical format for TikTok/Instagram
          },
          caption: true, // Enable captions
          caption_templates: {
            font_name: "Poppins",
            font_size: 20,
            font_color: "#FFFFFF",
            font_color_highlight: "#FFD700", // Gold highlight for emphasis
            background_color: "rgba(0,0,0,0.7)", // Semi-transparent black background
            background_style: "rounded", // Rounded background for captions
            position: "bottom", // Position captions at bottom
            line_count: 2, // Maximum 2 lines per caption
            word_count: 8 // Maximum 8 words per line
          }
        })
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('HeyGen API Error:', errorText)
        throw new Error(`HeyGen API Error: ${response.status} - ${errorText}`)
      }
      
      const data = await response.json()
      if (data.error) {
        throw new Error(data.error)
      }
      return data.data?.video_id
    } catch (error) {
      console.error('Error generating video:', error)
      throw error
    }
  },

  async getVideoStatus(videoId: string) {
    try {
      const response = await fetch(`${HEYGEN_BASE_URL}/v1/video_status.get?video_id=${videoId}`, {
        headers: {
          'Accept': 'application/json',
          'X-Api-Key': getApiKey(),
        },
      })
      const data = await response.json()
      return data.data
    } catch (error) {
      console.error('Error checking video status:', error)
      throw error
    }
  },

  // Parse script into A-roll and B-roll segments with timestamps
  parseScriptSegments(script: string, brollFootage: any[] = []) {
    const lines = script.split('\n').filter(line => line.trim())
    const segments = []
    
    for (const line of lines) {
      // Extract timestamp [0:00-0:05]
      const timeMatch = line.match(/\[(\d+):(\d+)-(\d+):(\d+)\]/)
      if (!timeMatch) continue
      
      const startMinutes = parseInt(timeMatch[1])
      const startSeconds = parseInt(timeMatch[2]) 
      const endMinutes = parseInt(timeMatch[3])
      const endSeconds = parseInt(timeMatch[4])
      
      const startTime = startMinutes * 60 + startSeconds
      const endTime = endMinutes * 60 + endSeconds
      const duration = endTime - startTime
      
      // Remove timestamp and determine type
      let content = line.replace(/\[\d+:\d+-\d+:\d+\]/, '').trim()
      let type = 'A-ROLL'
      let text = content
      
      if (content.toLowerCase().includes('a-roll')) {
        type = 'A-ROLL'
        text = content.replace(/A-ROLL[:\s]*/gi, '').trim()
      } else if (content.toLowerCase().includes('b-roll')) {
        type = 'B-ROLL'
        text = content.replace(/B-ROLL[:\s]*/gi, '').trim()
        
        // Find matching B-roll footage for this segment
        const matchingFootage = brollFootage.find(footage => 
          footage.timeRange === `${timeMatch[1]}:${timeMatch[2]}-${timeMatch[3]}:${timeMatch[4]}`
        )
        
        segments.push({
          type,
          startTime,
          endTime,
          duration,
          text: '', // No voice over B-roll footage
          originalText: text,
          brollVideo: matchingFootage,
          timeRange: `${timeMatch[1]}:${timeMatch[2]}-${timeMatch[3]}:${timeMatch[4]}`
        })
        continue
      }
      
      // Only add A-roll segments with actual speech
      if (type === 'A-ROLL' && text.trim()) {
        segments.push({
          type,
          startTime,
          endTime, 
          duration,
          text: text.trim(),
          timeRange: `${timeMatch[1]}:${timeMatch[2]}-${timeMatch[3]}:${timeMatch[4]}`
        })
      }
    }
    
    return segments.sort((a, b) => a.startTime - b.startTime)
  }
}

// Pexels API Functions
const pexelsAPI = {
  async searchVideos(query: string, perPage: number = 5) {
    try {
      const response = await fetch(`${PEXELS_BASE_URL}/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`, {
        headers: {
          'Authorization': PEXELS_API_KEY
        }
      })
      
      if (!response.ok) {
        throw new Error(`Pexels API error: ${response.status}`)
      }
      
      const data = await response.json()
      return data.videos || []
    } catch (error) {
      console.error('Error fetching Pexels videos:', error)
      return []
    }
  },

  // Extract keywords from B-roll script for video search
  extractBrollKeywords(brollScript: string): Array<{keyword: string, timeRange: string, description: string}> {
    const lines = brollScript.split('\n').filter(line => line.trim())
    const keywords = []
    
    for (const line of lines) {
      // Extract timestamp pattern [0:00-0:05]
      const timeMatch = line.match(/\[(\d+):(\d+)-(\d+):(\d+)\]/)
      const timeRange = timeMatch ? timeMatch[1] : ''
      
      // Skip A-ROLL lines, focus on B-ROLL
      if (line.toLowerCase().includes('b-roll')) {
        let description = line.replace(/\[\d+:\d+-\d+:\d+\]/g, '').replace(/B-ROLL[:\s]*/gi, '').trim()
        
        // Extract key search terms from description
        const searchTerms = []
        
        // Technology related terms
        if (description.toLowerCase().includes('code') || description.toLowerCase().includes('coding')) {
          searchTerms.push('programming code computer')
        }
        if (description.toLowerCase().includes('laptop') || description.toLowerCase().includes('computer')) {
          searchTerms.push('laptop computer typing')
        }
        if (description.toLowerCase().includes('office') || description.toLowerCase().includes('workspace')) {
          searchTerms.push('modern office workspace')
        }
        if (description.toLowerCase().includes('hackathon') || description.toLowerCase().includes('conference')) {
          searchTerms.push('tech conference presentation')
        }
        if (description.toLowerCase().includes('startup') || description.toLowerCase().includes('business')) {
          searchTerms.push('startup business meeting')
        }
        if (description.toLowerCase().includes('social media') || description.toLowerCase().includes('phone')) {
          searchTerms.push('social media smartphone')
        }
        if (description.toLowerCase().includes('city') || description.toLowerCase().includes('urban')) {
          searchTerms.push('city skyline urban')
        }
        if (description.toLowerCase().includes('coffee') || description.toLowerCase().includes('cafe')) {
          searchTerms.push('coffee cafe working')
        }
        
        // If no specific terms found, use generic tech terms
        if (searchTerms.length === 0) {
          searchTerms.push('technology business modern')
        }
        
        keywords.push({
          keyword: searchTerms[0] || 'technology',
          timeRange,
          description
        })
      }
    }
    
    return keywords
  },

  // Get B-roll footage for the entire script
  async getBrollFootage(brollScript: string) {
    const keywords = this.extractBrollKeywords(brollScript)
    const brollFootage = []
    
    console.log('Extracted B-roll keywords:', keywords)
    
    for (const item of keywords) {
      try {
        const videos = await this.searchVideos(item.keyword, 3)
        if (videos.length > 0) {
          // Get the best quality video (prefer HD)
          const bestVideo = videos.find((v: any) => v.video_files.some((f: any) => f.quality === 'hd')) || videos[0]
          const hdFile = bestVideo.video_files.find((f: any) => f.quality === 'hd') || bestVideo.video_files[0]
          
          brollFootage.push({
            timeRange: item.timeRange,
            description: item.description,
            keyword: item.keyword,
            videoUrl: hdFile.link,
            thumbnail: bestVideo.image,
            duration: bestVideo.duration || 10
          })
        }
      } catch (error) {
        console.error(`Error fetching B-roll for "${item.keyword}":`, error)
      }
    }
    
    return brollFootage
  }
}


// Video Post-Processing API for combining avatar + B-roll
const videoProcessingAPI = {
  // Parse script timestamps into timeline segments
  parseTimeline(script: string) {
    const lines = script.split('\n').filter(line => line.trim())
    const timeline = []
    
    for (const line of lines) {
      const timeMatch = line.match(/\[(\d+):(\d+)-(\d+):(\d+)\]/)
      if (!timeMatch) continue
      
      const startMinutes = parseInt(timeMatch[1])
      const startSeconds = parseInt(timeMatch[2])
      const endMinutes = parseInt(timeMatch[3])
      const endSeconds = parseInt(timeMatch[4])
      
      const startTime = startMinutes * 60 + startSeconds
      const endTime = endMinutes * 60 + endSeconds
      const duration = endTime - startTime
      
      let content = line.replace(/\[\d+:\d+-\d+:\d+\]/, '').trim()
      let type = 'A-ROLL'
      
      if (content.toLowerCase().includes('a-roll')) {
        type = 'A-ROLL'
        content = content.replace(/A-ROLL[:\s]*/gi, '').trim()
      } else if (content.toLowerCase().includes('b-roll')) {
        type = 'B-ROLL'
        content = content.replace(/B-ROLL[:\s]*/gi, '').trim()
      }
      
      timeline.push({
        type,
        startTime,
        endTime,
        duration,
        content,
        timeRange: `${timeMatch[1]}:${timeMatch[2]}-${timeMatch[3]}:${timeMatch[4]}`
      })
    }
    
    return timeline.sort((a, b) => a.startTime - b.startTime)
  },

  // Create video composition instructions
  createCompositionPlan(timeline: any[], brollFootage: any[], avatarVideoUrl: string) {
    const composition = []
    
    for (const segment of timeline) {
      if (segment.type === 'A-ROLL') {
        // Avatar segment
        composition.push({
          type: 'avatar',
          source: avatarVideoUrl,
          startTime: segment.startTime,
          duration: segment.duration,
          trim: {
            start: segment.startTime,
            end: segment.endTime
          }
        })
      } else if (segment.type === 'B-ROLL') {
        // Find matching B-roll footage
        const matchingFootage = brollFootage.find(footage => 
          footage.timeRange === segment.timeRange
        )
        
        if (matchingFootage) {
          composition.push({
            type: 'broll',
            source: matchingFootage.videoUrl,
            startTime: segment.startTime,
            duration: segment.duration,
            description: matchingFootage.description
          })
        } else {
          // Fallback to avatar if no B-roll found
          composition.push({
            type: 'avatar',
            source: avatarVideoUrl,
            startTime: segment.startTime,
            duration: segment.duration,
            trim: {
              start: segment.startTime,
              end: segment.endTime
            }
          })
        }
      }
    }
    
    return composition
  },

  // Simulate video composition (in a real implementation, this would use FFmpeg or similar)
  async composeVideo(composition: any[], totalDuration: number, progressCallback?: (progress: number, stage: string) => void) {
    console.log('🎬 Starting video composition...')
    console.log('Composition plan:', composition)
    
    // Simulate video processing time
    const processingSteps = [
      'Downloading B-roll footage...',
      'Extracting avatar segments...',
      'Synchronizing audio tracks...',
      'Compositing video layers...',
      'Rendering final video...',
      'Optimizing for mobile...'
    ]
    
    for (let i = 0; i < processingSteps.length; i++) {
      const stage = processingSteps[i]
      console.log(`📹 ${stage}`)
      
      // Update progress callback if provided
      const progress = ((i + 1) / processingSteps.length) * 100
      if (progressCallback) {
        progressCallback(Math.round(progress), stage)
      }
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500))
    }
    
    // In a real implementation, this would return the actual composed video URL
    // For demo purposes, we'll return a simulated result
    const composedVideoUrl = `/composed_video_${Date.now()}.mp4`
    
    console.log('✅ Video composition complete!')
    console.log('Composed video URL:', composedVideoUrl)
    
    return {
      videoUrl: composedVideoUrl,
      duration: totalDuration,
      composition: composition,
      segments: composition.length
    }
  },

  // Main function to process avatar video with B-roll
  async processVideoWithBroll(avatarVideoUrl: string, script: string, brollFootage: any[], progressCallback?: (progress: number, stage: string) => void) {
    try {
      console.log('🚀 Starting post-processing integration...')
      
      // Step 1: Parse the script timeline
      const timeline = this.parseTimeline(script)
      console.log('📋 Parsed timeline:', timeline)
      
      // Step 2: Create composition plan
      const totalDuration = Math.max(...timeline.map(t => t.endTime))
      const composition = this.createCompositionPlan(timeline, brollFootage, avatarVideoUrl)
      console.log('🎯 Composition plan created:', composition)
      
      // Step 3: Compose the final video
      const result = await this.composeVideo(composition, totalDuration, progressCallback)
      
      return result
    } catch (error) {
      console.error('❌ Video processing failed:', error)
      throw error
    }
  }
}


interface DynamicAnalysis {
  [key: string]: any
}

interface ContentItem {
  id: number
  title: string
  thumbnail: string
  createdAt: string
  type: string
  script: string
  videoUrl?: string
  analysis?: DynamicAnalysis
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("create")
  const [contentInput, setContentInput] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false)
  const [isGeneratingScripts, setIsGeneratingScripts] = useState(false)
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState<GenerationStep>("input")
  const [aRollScript, setARollScript] = useState("")
  const [bRollScript, setBRollScript] = useState("")
  const [generationPhase, setGenerationPhase] = useState("")
  const [generationProgress, setGenerationProgress] = useState(0)
  const [visitedSteps, setVisitedSteps] = useState<Set<GenerationStep>>(new Set(["input"]))
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState({ title: "", description: "" })
  // showToast state replaced with toastState for better management
  const [contentLibrary, setContentLibrary] = useState<Array<{
    id: number;
    title: string;
    thumbnail: string;
    createdAt: string;
    type: string;
    script: string;
  }>>([])
  const [dynamicAnalysis, setDynamicAnalysis] = useState<DynamicAnalysis | null>(null)
  // const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)
  const [heygenavatarId, setHeygenAvatarId] = useState<string>("")
  const [showSocialsModal, setShowSocialsModal] = useState(false)
  const [socialUrls, setSocialUrls] = useState({
    youtube: "",
    linkedin: ""
  })
  const [personalData, setPersonalData] = useState<any>(null)
  const [isScrapingSocials, setIsScrapingSocials] = useState(false)


  // HeyGen API state
  const [availableAvatars, setAvailableAvatars] = useState<any[]>([])
  const [availableVoices, setAvailableVoices] = useState<any[]>([])
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>('')
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>('')
  const [currentVideoId, setCurrentVideoId] = useState<string>('')
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string>('')

  // Video upload state
  const [uploadedVideo, setUploadedVideo] = useState<{
    file: File | null;
    assetId: string | null;
    url: string | null;
    uploading: boolean;
  }>({
    file: null,
    assetId: null,
    url: null,
    uploading: false
  })

  // User's custom avatar ID (created from uploaded video)
  const [customAvatarId, setCustomAvatarId] = useState<string>('')

  // Track if user has uploaded a video for avatar creation
  const [hasUploadedVideo, setHasUploadedVideo] = useState<boolean>(false)

  // Avatar creation state
  const [avatarCreation, setAvatarCreation] = useState<{
    isProcessing: boolean;
    progress: number;
    phase: string;
    creationId: string | null;
    estimatedTime: string;
  }>({
    isProcessing: false,
    progress: 0,
    phase: '',
    creationId: null,
    estimatedTime: ''
  })

  // Auto-refresh avatars when creation is in progress
  const [avatarRefreshInterval, setAvatarRefreshInterval] = useState<NodeJS.Timeout | null>(null)

  // API connection status
  const [apiStatus, setApiStatus] = useState<{
    connected: boolean;
    testing: boolean;
    error: string | null;
  }>({
    connected: false,
    testing: true,
    error: null
  })

  // Toast state management
  const [toastState, setToastState] = useState<{
    show: boolean;
    type: 'avatar_created' | 'video_uploaded' | 'library_added';
    hasShownAvatarCreated: boolean;
  }>({
    show: false,
    type: 'library_added',
    hasShownAvatarCreated: false
  })

  // B-roll footage state
  const [brollFootage, setBrollFootage] = useState<Array<{
    timeRange: string;
    description: string;
    keyword: string;
    videoUrl: string;
    thumbnail: string;
    duration: number;
  }>>([])
  const [loadingBroll, setLoadingBroll] = useState(false)

  // Video processing state
  const [videoProcessing, setVideoProcessing] = useState({
    isProcessing: false,
    stage: '',
    progress: 0,
    composedVideoUrl: ''
  })

  // Video generation modal state
  const [showGenerationModal, setShowGenerationModal] = useState(false)
  const [generationStages, setGenerationStages] = useState([
    { name: 'Initializing generation...', completed: false, active: false },
    { name: 'Loading avatar...', completed: false, active: false },
    { name: 'Processing script...', completed: false, active: false },
    { name: 'Generating voice...', completed: false, active: false },
    { name: 'Creating video...', completed: false, active: false },
    { name: 'Adding captions...', completed: false, active: false },
    { name: 'Finalizing...', completed: false, active: false }
  ])

  // Load avatars and voices on component mount
  useEffect(() => {
    const loadHeyGenData = async () => {
      setApiStatus(prev => ({ ...prev, testing: true, error: null }))
      
      try {
        // First test the API key
        const isValidKey = await heygenAPI.testApiKey()
        if (!isValidKey) {
          setApiStatus({
            connected: false,
            testing: false,
            error: 'Invalid API key'
          })
          console.error('Invalid HeyGen API key')
          return
        }

        const [avatars, voices] = await Promise.all([
          heygenAPI.getAvatars(),
          heygenAPI.getVoices()
        ])
        
        setAvailableAvatars(avatars)
        setAvailableVoices(voices)
        
        // Auto-select Kevin's custom avatar and voice if available, otherwise fallback to instant avatars
        const kevinAvatar = avatars.find((a: any) => 
          a.avatar_name?.toLowerCase().includes('kevin') || 
          (a.avatar_name?.toLowerCase().includes('instant') && customAvatarId && a.avatar_id === customAvatarId)
        )
        const instantAvatar = avatars.find((a: any) => a.avatar_name?.includes('Instant') || a.avatar_name?.includes('My'))
        
        if (kevinAvatar) {
          setSelectedAvatarId(kevinAvatar.avatar_id)
          // Only set as custom avatar if user has uploaded a video
          if (hasUploadedVideo) {
            setCustomAvatarId(kevinAvatar.avatar_id)
          }
        } else if (instantAvatar) {
          setSelectedAvatarId(instantAvatar.avatar_id)
          // Only set as custom avatar if user has uploaded a video
          if (hasUploadedVideo) {
            setCustomAvatarId(instantAvatar.avatar_id)
          }
        } else if (avatars.length > 0) {
          setSelectedAvatarId(avatars[0].avatar_id)
        }
        
        if (voices.length > 0) {
          // Prefer Kevin's voice, then English voices
          const kevinVoice = voices.find((v: any) => v.name?.toLowerCase().includes('kevin'))
          const englishVoice = voices.find((v: any) => v.language === 'English')
          setSelectedVoiceId(kevinVoice?.voice_id || englishVoice?.voice_id || voices[0].voice_id)
        }

        setApiStatus({
          connected: true,
          testing: false,
          error: null
        })
      } catch (error) {
        console.error('Error loading HeyGen data:', error)
        let errorMessage = 'Connection failed'
        
        if (error instanceof Error) {
          if (error.message.includes('Unauthorized')) {
            errorMessage = 'Invalid API key'
          } else if (error.message.includes('network') || error.message.includes('fetch')) {
            errorMessage = 'Network error'
          } else {
            errorMessage = error.message
          }
        }
        
        setApiStatus({
          connected: false,
          testing: false,
          error: errorMessage
        })
      }
    }
    
    loadHeyGenData()
  }, [])


  // Handle video events
  // useEffect(() => {
  //   if (currentStep === "video") {
  //     const video = document.getElementById("phone-video") as HTMLVideoElement
  //     const overlay = document.getElementById("video-overlay")
  //     const endedOverlay = document.getElementById("video-ended")

  //     if (video && overlay && endedOverlay) {
  //       const handleVideoLoaded = () => {
  //         video.currentTime = 0.5
  //       }
  //       const handleVideoCanPlay = () => {
  //         if (video.paused) video.currentTime = 0.5
  //       }
  //       const handleVideoError = (e: Event) => console.error("Video loading error:", e)
  //       const handleVideoEnded = () => {
  //         overlay.style.opacity = "1"
  //         overlay.style.pointerEvents = "auto"
  //         endedOverlay.style.opacity = "1"
  //         endedOverlay.style.pointerEvents = "auto"
  //       }
  //       const handleVideoPlay = () => {
  //         overlay.style.opacity = "0"
  //         overlay.style.pointerEvents = "none"
  //         endedOverlay.style.opacity = "0"
  //         endedOverlay.style.pointerEvents = "none"
  //       }
  //       const handleVideoPause = () => {
  //         overlay.style.opacity = "1"
  //         overlay.style.pointerEvents = "auto"
  //       }

  //       video.addEventListener("loadedmetadata", handleVideoLoaded)
  //       video.addEventListener("canplay", handleVideoCanPlay)
  //       video.addEventListener("error", handleVideoError)
  //       video.addEventListener("ended", handleVideoEnded)
  //       video.addEventListener("play", handleVideoPlay)
  //       video.addEventListener("pause", handleVideoPause)

  //       video.src = generatedVideoUrl
  //       video.load()

  //       return () => {
  //         video.removeEventListener("loadedmetadata", handleVideoLoaded)
  //         video.removeEventListener("canplay", handleVideoCanPlay)
  //         video.removeEventListener("error", handleVideoError)
  //         video.removeEventListener("ended", handleVideoEnded)
  //         video.removeEventListener("play", handleVideoPlay)
  //         video.removeEventListener("pause", handleVideoPause)
  //       }
  //     }
  //   }
  // }, [currentStep, generatedVideoUrl])

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

      // Initialize B-roll demo if we have footage
      if (brollFootage.length === 0 && bRollScript.includes('B-ROLL')) {
        console.log('🎬 Initializing B-roll demo for video preview...')
        loadBrollFootage(bRollScript)
      }
    }
  }, [currentStep, brollFootage.length, bRollScript]);

  const phases = [
    { name: "Initializing HeyGen AI...", duration: 2000 },
    { name: "Processing Avatar and Voice...", duration: 4000 },
    { name: "Generating Speech Synthesis...", duration: 3500 },
    { name: "Creating Visual Elements...", duration: 4500 },
    { name: "Rendering Final Video...", duration: 5000 },
    { name: "Finalizing Output...", duration: 2000 },
  ]

  const handleGenerate = async () => {
    if (!contentInput.trim()) return

    setIsGenerating(true)
    setIsGeneratingAnalysis(true)
    setApiError(null)
    setCurrentStep("analysis")
    setVisitedSteps((prev) => new Set([...prev, "analysis"]))

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          idea: contentInput,
          linkedinUrl: socialUrls.linkedin,
          youtubeUrl: socialUrls.youtube
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate content")
      }
      
      const data = await response.json()
      
      // Set the generated data
      setARollScript(data.aRollScript)
      setBRollScript(data.bRollScript)
      setDynamicAnalysis(data.marketAnalysis)
      setPersonalData(data.personalizedContent?.profileSummary ? JSON.parse(data.personalizedContent.profileSummary) : null)
      
      setToastMessage({ 
        title: data.personalizedContent?.isPersonalized ? "Personalized Content Generated!" : "Content Generated!", 
        description: data.personalizedContent?.isPersonalized 
          ? "Your content has been personalized using LangChain AI agents!" 
          : "Your A-roll and B-roll scripts are ready for review."
      })
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      
    } catch (error: any) {
      console.error("Generation error:", error)
      setApiError(error.message)
      
      setToastMessage({ 
        title: "Generation Failed", 
        description: error.message 
      })
      setShowToast(true)
      setTimeout(() => setShowToast(false), 5000)
    } finally {
      setIsGenerating(false)
      setIsGeneratingAnalysis(false)
    }
  }

  // Load B-roll footage based on script
  const loadBrollFootage = async (brollScript: string) => {
    setLoadingBroll(true)
    try {
      const footage = await pexelsAPI.getBrollFootage(brollScript)
      setBrollFootage(footage)
      console.log('Loaded B-roll footage:', footage)
    } catch (error) {
      console.error('Error loading B-roll footage:', error)
    } finally {
      setLoadingBroll(false)
    }
  }


  const handleGenerateVideo = async () => {
    if (!aRollScript || !selectedAvatarId || !selectedVoiceId) {
      alert('Please ensure you have a script and selected avatar/voice')
      return
    }
    
    // Show the modal and reset stages
    setShowGenerationModal(true)
    setGenerationStages([
      { name: 'Initializing generation...', completed: false, active: true },
      { name: 'Loading avatar...', completed: false, active: false },
      { name: 'Processing script...', completed: false, active: false },
      { name: 'Generating voice...', completed: false, active: false },
      { name: 'Creating video...', completed: false, active: false },
      { name: 'Adding captions...', completed: false, active: false },
      { name: 'Finalizing...', completed: false, active: false }
    ])
    
    setIsGenerating(true)
    setGenerationPhase('Starting video generation...')
    setGenerationProgress(10)
    
    // Helper function to update stages
    const updateStage = (stageIndex: number, completed: boolean = false, active: boolean = true) => {
      setGenerationStages(prev => prev.map((stage, index) => ({
        ...stage,
        completed: index < stageIndex ? true : (index === stageIndex ? completed : false),
        active: index === stageIndex ? active : false
      })))
    }
    
    try {
      // Stage 1: Initializing (already active)
      await new Promise(resolve => setTimeout(resolve, 1500))
      updateStage(0, true, false)
      
      // Stage 2: Loading avatar
      updateStage(1, false, true)
      await new Promise(resolve => setTimeout(resolve, 1000))
      updateStage(1, true, false)
      
      // Stage 3: Processing script
      updateStage(2, false, true)
      await new Promise(resolve => setTimeout(resolve, 800))
      updateStage(2, true, false)
      
      // Stage 4: Generating voice
      updateStage(3, false, true)
      
      // Step 1: Generate avatar video using HeyGen API
      const videoId = await heygenAPI.generateVideo(
        selectedAvatarId,
        selectedVoiceId,
        aRollScript,
        brollFootage
      )
      
      setCurrentVideoId(videoId)
      updateStage(3, true, false)
      
      // Stage 5: Creating video
      updateStage(4, false, true)
      setGenerationPhase('HeyGen avatar video generation in progress...')
      setGenerationProgress(30)
      
      // Step 2: Poll for HeyGen video completion
      const pollVideoStatus = async () => {
        try {
          const status = await heygenAPI.getVideoStatus(videoId)
          
          console.log('HeyGen video status response:', status)
          console.log('Video status:', status.status)
          console.log('Video URL (no captions):', status.video_url)
          console.log('Video URL (with captions):', status.video_url_caption)
          
          if (status.status === 'completed') {
            updateStage(4, true, false)
            
            // Stage 6: Adding captions
            updateStage(5, false, true)
            await new Promise(resolve => setTimeout(resolve, 1500))
            updateStage(5, true, false)
            
            // Stage 7: Finalizing
            updateStage(6, false, true)
            
            // Use the captioned video URL instead of the regular one
            const avatarVideoUrl = status.video_url_caption 
            
            // Validate the video URL
            if (!avatarVideoUrl || !avatarVideoUrl.startsWith('http')) {
              console.error('Invalid video URL received:', avatarVideoUrl)
              throw new Error('Invalid video URL received from HeyGen')
            }
            
            console.log('✅ HeyGen video completed! Using captioned URL:', avatarVideoUrl)
            
            // Use HeyGen video directly (with captions)
            setGeneratedVideoUrl(avatarVideoUrl)
            setGenerationProgress(100)
            setGenerationPhase('HeyGen video with captions ready!')
            
            await new Promise(resolve => setTimeout(resolve, 1000))
            updateStage(6, true, false)
            
            setTimeout(() => {
              setShowGenerationModal(false)
              setCurrentStep('video')
              setVisitedSteps(prev => new Set([...prev, 'video']))
              setIsGenerating(false)
              setGenerationPhase('')
              setGenerationProgress(0)
            }, 1500)
            
          } else if (status.status === 'processing' || status.status === 'pending') {
            console.log(`🔄 Video still processing... Status: ${status.status}`)
            setGenerationProgress(prev => Math.min(prev + 5, 85))
            setTimeout(pollVideoStatus, 5000) // Check again in 5 seconds
          } else if (status.status === 'failed') {
            console.error('❌ HeyGen video generation failed:', status.error)
            throw new Error(status.error?.message || 'Video generation failed')
          } else {
            console.log(`🤔 Unknown status: ${status.status}`)
            setTimeout(pollVideoStatus, 5000) // Continue polling for unknown statuses
          }
        } catch (error) {
          console.error('Error polling video status:', error)
          setShowGenerationModal(false)
          setIsGenerating(false)
          setGenerationPhase('')
          alert(`Video generation failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`)
        }
      }
      
      // Start polling after initial delay
      setTimeout(pollVideoStatus, 3000)
      
    } catch (error) {
      console.error('Error generating video:', error)
      setShowGenerationModal(false)
      setIsGenerating(false)
      setGenerationPhase('')
      alert('Failed to start video generation. Please check your API key and try again.')
    }
  }

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('video/')) {
      alert('Please select a video file')
      return
    }

    // Check file size (limit to 500MB)
    if (file.size > 500 * 1024 * 1024) {
      alert('File size must be less than 500MB')
      return
    }

    setUploadedVideo(prev => ({
      ...prev,
      file,
      uploading: true
    }))

    // Reset avatar creation toast flag for new upload
    setToastState(prev => ({
      ...prev,
      hasShownAvatarCreated: false
    }))

    try {
      // Demo Mode: Simulate upload process instead of actual HeyGen upload
      console.log('Demo mode: Simulating video upload...')
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000)) // 2 second upload simulation
      
      // Create simulated asset data
      const simulatedAssetData = {
        id: `demo_asset_${Date.now()}`,
        url: URL.createObjectURL(file), // Create local URL for the uploaded file
        filename: file.name,
        size: file.size
      }
      
      setUploadedVideo(prev => ({
        ...prev,
        assetId: simulatedAssetData.id,
        url: simulatedAssetData.url,
        uploading: false
      }))

      // Mark that user has uploaded a video
      setHasUploadedVideo(true)

      // Step 2: Start avatar creation process
      const avatarName = `Kevin_Avatar_${Date.now()}`
      
      setAvatarCreation({
        isProcessing: true,
        progress: 10,
        phase: 'Initiating avatar creation...',
        creationId: null,
        estimatedTime: '30 seconds' // Much faster for demo
      })

      try {
        // Demo Mode: Skip actual HeyGen avatar creation API call
        console.log('Demo mode: Simulating avatar creation...')
        
        // Start the simulated avatar creation monitoring
        startAvatarCreationMonitoring(avatarName)

      } catch (error) {
        console.error('Error starting avatar creation:', error)
        setAvatarCreation(prev => ({
          ...prev,
          isProcessing: false,
          phase: 'Avatar creation failed'
        }))
      }

      // Show success message for upload
      setToastState({
        show: true,
        type: 'video_uploaded',
        hasShownAvatarCreated: false
      })
      setTimeout(() => {
        setToastState(prev => ({ ...prev, show: false }))
      }, 3000)

    } catch (error) {
      console.error('Error in demo upload simulation:', error)
      setUploadedVideo(prev => ({
        ...prev,
        uploading: false
      }))
      
      alert('Demo upload simulation failed. Please try again.')
    }
  }

    // Monitor avatar creation progress
    const startAvatarCreationMonitoring = (avatarName: string) => {
      let progress = 25
      const phases = [
        { name: 'Analyzing your video...', duration: 1500 }, // Faster for demo
        { name: 'Extracting facial features...', duration: 1000 }, // Faster for demo
        { name: 'Training AI model...', duration: 1500 }, // Faster for demo
        { name: 'Generating avatar...', duration: 1000 }, // Faster for demo
        { name: 'Finalizing avatar...', duration: 500 } // Much faster for demo
      ]
  
      let currentPhaseIndex = 0
      
      const updateProgress = () => {
        if (currentPhaseIndex < phases.length) {
          const phase = phases[currentPhaseIndex]
          
          setAvatarCreation(prev => ({
            ...prev,
            progress: Math.min(progress, 95), // Cap at 95% during simulation
            phase: phase.name
          }))
  
          progress += 18 // Faster progress increments
          currentPhaseIndex++
  
          setTimeout(updateProgress, phase.duration)
        } else {
          // Demo: Simulate instant avatar creation success
          setTimeout(() => {
            // Create a simulated Kevin avatar
            const simulatedKevinAvatar = {
              avatar_id: `kevin_demo_${Date.now()}`,
              avatar_name: `Kevin_Avatar_${Date.now()}`,
              gender: 'male',
              preview_image_url: '/placeholder-avatar.jpg',
              preview_video_url: '/HackAI Demo.mp4'
            }
            
            // Add to available avatars
            setAvailableAvatars(prev => [simulatedKevinAvatar, ...prev])
            
            // Set as Kevin's custom avatar
            setCustomAvatarId(simulatedKevinAvatar.avatar_id)
            setSelectedAvatarId(simulatedKevinAvatar.avatar_id)
            
            // Also select Kevin's voice if available
            const kevinVoice = availableVoices.find((v: any) => v.name?.toLowerCase().includes('kevin'))
            if (kevinVoice) {
              setSelectedVoiceId(kevinVoice.voice_id)
            }
            
            setAvatarCreation({
              isProcessing: false,
              progress: 100,
              phase: 'Kevin\'s avatar created successfully!',
              creationId: null,
              estimatedTime: ''
            })
  
            // Show success notification
            setToastState({
              show: true,
              type: 'avatar_created',
              hasShownAvatarCreated: true
            })
            setTimeout(() => {
              setToastState(prev => ({ ...prev, show: false }))
            }, 4000)
            
          }, 1000) // Very short delay for demo
        }
      }
  
      updateProgress()
    }

    useEffect(() => {
      return () => {
        if (avatarRefreshInterval) {
          clearInterval(avatarRefreshInterval)
        }
      }
    }, [avatarRefreshInterval])
  
    const handleTabChange = (tab: Tab) => {
      setActiveTab(tab)
      setIsMobileMenuOpen(false)
    }

  const handleRegenerateScripts = async () => {
    if (!contentInput.trim() || !dynamicAnalysis) return

    setIsGeneratingScripts(true)
    setApiError(null)
    
    try {
      const scriptRes = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          idea: contentInput, 
          analysis: dynamicAnalysis, 
          personalData: personalData,
          regenerate: true 
        }),
      })
      
      if (!scriptRes.ok) {
        const errorData = await scriptRes.json()
        throw new Error(errorData.error || "Failed to regenerate scripts")
      }
      
      const scriptData = await scriptRes.json()
      
      // Validate scripts
      if (!scriptData.aRollScript || !scriptData.bRollScript) {
        throw new Error("Incomplete scripts received during regeneration")
      }
      
      setARollScript(scriptData.aRollScript)
      setBRollScript(scriptData.bRollScript)
      
      setToastMessage({ 
        title: "Scripts Regenerated!", 
        description: scriptData.isPersonalized 
          ? "New personalized A-Roll and B-Roll scripts are ready." 
          : "New A-Roll and B-Roll scripts are ready."
      })
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      
    } catch (error: any) {
      console.error("Script regeneration error:", error)
      setApiError(error.message)
      
      setToastMessage({ 
        title: "Regeneration Failed", 
        description: error.message 
      })
      setShowToast(true)
      setTimeout(() => setShowToast(false), 5000)
    } finally {
      setIsGeneratingScripts(false)
    }
  }

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setAvatarFile(file)

      // Upload to HeyGen AI and get avatar ID
      try {
        const formData = new FormData()
        formData.append("video", file)

        const uploadRes = await fetch("/api/upload-avatar", {
          method: "POST",
          body: formData,
        })

        if (uploadRes.ok) {
          const { avatarId } = await uploadRes.json()
          setHeygenAvatarId(avatarId)
          setToastMessage({
            title: "Avatar Uploaded!",
            description: `${file.name} has been processed by HeyGen AI.`,
          })
        } else {
          throw new Error("Failed to upload avatar")
        }
      } catch (error) {
        console.error("Avatar upload error:", error)
        setToastMessage({
          title: "Upload Failed",
          description: "Could not upload avatar to HeyGen AI. Using default avatar.",
        })
      }

      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
    }
  }

  const handleStepChange = (stepId: string) => {
    if (stepId === "storyboard" && (!aRollScript || !bRollScript)) {
      setToastMessage({ title: "Missing Scripts", description: "Please generate market analysis and scripts first." })
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }
    if (stepId === "video" && !generatedVideoUrl) {
      setToastMessage({ title: "Missing Video", description: "Please generate the video first." })
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }
    setCurrentStep(stepId as GenerationStep)
    setVisitedSteps((prev) => new Set([...prev, stepId as GenerationStep]))
  }

  const steps = [
    { id: "analysis", title: "Market Analysis", number: 1 },
    { id: "storyboard", title: "Storyboard", number: 2 },
    { id: "video", title: "Final Video", number: 3 },
  ]

  const getStepStatus = (stepId: string) => {
    const stepOrder = ["analysis", "storyboard", "video"]
    const currentIndex = stepOrder.indexOf(currentStep)
    const stepIndex = stepOrder.indexOf(stepId)

    if (stepIndex < currentIndex) return "complete"
    if (stepIndex === currentIndex) return "active"
    return "pending"
  }

  const canNavigateToStep = (stepId: string) => {
    if (!visitedSteps.has(stepId as GenerationStep) || !contentInput.trim()) return false
    if (stepId === "analysis" && !dynamicAnalysis && currentStep !== "input") return false
    if (stepId === "storyboard" && (!aRollScript || !bRollScript) && currentStep !== "analysis") return false
    if (stepId === "video" && !generatedVideoUrl && currentStep !== "storyboard") return false
    return true
  }

  const generateVideoThumbnail = (videoSrc: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video')
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      video.crossOrigin = 'anonymous'
      video.src = videoSrc
      
      video.onloadedmetadata = () => {
        // Set canvas to horizontal thumbnail dimensions (16:9 aspect ratio)
        canvas.width = 300
        canvas.height = 180
        
        // Calculate scaling to fit vertical video within horizontal canvas
        const videoAspectRatio = video.videoWidth / video.videoHeight
        const canvasAspectRatio = canvas.width / canvas.height
        
        let drawWidth, drawHeight, offsetX, offsetY
        
        if (videoAspectRatio > canvasAspectRatio) {
          // Video is wider relative to canvas - fit by width
          drawWidth = canvas.width
          drawHeight = canvas.width / videoAspectRatio
          offsetX = 0
          offsetY = (canvas.height - drawHeight) / 2
        } else {
          // Video is taller relative to canvas - fit by height
          drawHeight = canvas.height
          drawWidth = canvas.height * videoAspectRatio
          offsetX = (canvas.width - drawWidth) / 2
          offsetY = 0
        }
        
        // Seek to 1 second into the video for thumbnail
        video.currentTime = 1
      }
      
      video.onseeked = () => {
        if (ctx) {
          // Fill canvas with black background (letterboxing)
          ctx.fillStyle = '#000000'
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          
          // Calculate scaling to fit vertical video within horizontal canvas
          const videoAspectRatio = video.videoWidth / video.videoHeight
          const canvasAspectRatio = canvas.width / canvas.height
          
          let drawWidth, drawHeight, offsetX, offsetY
          
          if (videoAspectRatio > canvasAspectRatio) {
            // Video is wider relative to canvas - fit by width
            drawWidth = canvas.width
            drawHeight = canvas.width / videoAspectRatio
            offsetX = 0
            offsetY = (canvas.height - drawHeight) / 2
          } else {
            // Video is taller relative to canvas - fit by height
            drawHeight = canvas.height
            drawWidth = canvas.height * videoAspectRatio
            offsetX = (canvas.width - drawWidth) / 2
            offsetY = 0
          }
          
          // Draw video frame to canvas with proper scaling and centering
          ctx.drawImage(video, offsetX, offsetY, drawWidth, drawHeight)
          
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
    try {
      let thumbnail = "/api/placeholder/300/180" // Default fallback
      
      // If we have a generated video URL, try to generate thumbnail from it
      if (generatedVideoUrl) {
        try {
          thumbnail = await generateVideoThumbnail(generatedVideoUrl)
        } catch (error) {
          console.warn('Failed to generate thumbnail from HeyGen video, using fallback:', error)
        }
      }
      
      // Create new content item
      const newContent = {
        id: Date.now(),
        title: contentInput.trim() || "HeyGen AI Video",
        thumbnail: thumbnail,
        createdAt: new Date().toISOString().split('T')[0],
        type: "HeyGen AI Generated",
        script: aRollScript
      }
      
      // Add to library
      setContentLibrary(prev => [newContent, ...prev])
      
      setToastState({
        show: true,
        type: 'library_added',
        hasShownAvatarCreated: false
      })
      // Hide toast and redirect after 2 seconds
      setTimeout(() => {
        setToastState(prev => ({ ...prev, show: false }))
        // Reset to create new content
        handleStepChange('input')
        setContentInput('')
        setARollScript('')
        setBRollScript('')
        setGeneratedVideoUrl('')
        setCurrentVideoId('')
        setVisitedSteps(new Set(['input']))
      }, 2000)
    } catch (error) {
      console.error('Failed to add to library:', error)
      alert('Failed to save to library. Please try again.')
    }
  }

  const renderDynamicAnalysis = () => {
    if (isGeneratingAnalysis) {
      return (
        <div className="text-center py-16">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-4 text-indigo-600" />
            <p className="text-slate-600 font-medium">Analyzing market trends with AI...</p>
            <p className="text-sm text-slate-500 mt-2">Fetching real-time data from multiple sources</p>
          </div>
        </div>
      )
    }

    // Add loading state for script generation
    if (isGeneratingScripts) {
      return (
        <div className="text-center py-16">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <div className="relative">
                <Sparkles className="w-8 h-8 text-white animate-pulse" />
                <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-spin"></div>
              </div>
            </div>
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-4 text-emerald-600" />
            <p className="text-slate-600 font-medium">
              {personalData ? 'Generating personalized scripts...' : 'Creating your A-roll and B-roll scripts...'}
            </p>
            <p className="text-sm text-slate-500 mt-2">
              {personalData 
                ? 'Using your social media analysis for personalization' 
                : 'Optimizing content based on market analysis'
              }
            </p>
            
            {/* Progress indicator */}
            <div className="max-w-xs mx-auto mt-6">
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse" style={{ width: '60%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>Analyzing content...</span>
                <span>60%</span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (apiError && currentStep === "analysis") {
      return (
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-lg bg-red-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-red-900 mb-2">
                {apiError.includes('Script') ? 'Script Generation Failed' : 'Analysis Failed'}
              </h3>
              <p className="text-red-700 text-sm mb-4">{apiError}</p>
              <div className="space-y-2">
                <Button 
                  onClick={handleGenerate} 
                  variant="outline" 
                  className="w-full border-red-300 text-red-700 hover:bg-red-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {apiError.includes('Script') ? 'Retry Script Generation' : 'Retry Analysis'}
                </Button>
                {apiError.includes('Script') && dynamicAnalysis && (
                  <Button 
                    onClick={() => {
                      setApiError(null)
                      // Allow user to continue to storyboard with empty scripts to manually enter
                      setCurrentStep("storyboard")
                      setVisitedSteps((prev) => new Set([...prev, "storyboard"]))
                    }}
                    variant="ghost" 
                    className="w-full text-slate-600 hover:bg-slate-50"
                  >
                    Continue to Storyboard (Manual Entry)
                  </Button>
                )}
            </div>
          </CardContent>
        </Card>
        </div>
      )
    }

    if (!dynamicAnalysis) {
      return (
        <div className="max-w-md mx-auto">
          <Card className="border-0 shadow-lg bg-slate-50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-400 to-slate-500 rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-50">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <p className="text-slate-500 font-medium">Generate market analysis to see insights</p>
          </CardContent>
        </Card>
        </div>
      )
    }

    // Helper function to convert text values to numeric for charts
    const getNumericValue = (value: string) => {
      const lowercaseValue = value?.toLowerCase() || ''
      if (lowercaseValue.includes('high')) return 85
      if (lowercaseValue.includes('medium')) return 60
      if (lowercaseValue.includes('low')) return 30
      if (lowercaseValue.includes('large')) return 80
      if (lowercaseValue.includes('small')) return 40
      if (lowercaseValue.includes('growing')) return 75
      if (lowercaseValue.includes('stable')) return 50
      if (lowercaseValue.includes('declining')) return 25
      return 50
    }

    // Prepare chart data
    const marketMetricsData = dynamicAnalysis.marketSummary ? [
      { name: 'Viral Potential', value: getNumericValue(dynamicAnalysis.marketSummary.viralPotential), color: '#8b5cf6' },
      { name: 'Audience Size', value: getNumericValue(dynamicAnalysis.marketSummary.audienceSize), color: '#10b981' },
      { name: 'Market Trend', value: getNumericValue(dynamicAnalysis.marketSummary.trend), color: '#3b82f6' },
      { name: 'Competition', value: 100 - getNumericValue(dynamicAnalysis.marketSummary.competitionLevel), color: '#f59e0b' }
    ] : []

    const platformData = dynamicAnalysis.audience?.platforms ? 
      dynamicAnalysis.audience.platforms.map((platform: string, index: number) => ({
        name: platform,
        engagement: Math.floor(Math.random() * 40) + 60, // Mock engagement data
        color: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]
      })) : []

    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center mb-12 relative">
          <Button
            variant="outline"
            onClick={() => handleStepChange("input")}
            className="absolute top-0 left-0 flex items-center bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-full mb-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-slate-700">Live Market Data</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Market Analysis
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            AI-powered insights for <span className="font-semibold text-indigo-600">"{contentInput}"</span>
          </p>
        </div>

        {/* Enhanced Market Summary with Progress Bars */}
        {dynamicAnalysis.marketSummary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="w-8 h-8 text-blue-600" />
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-900">
                      {dynamicAnalysis.marketSummary.trend || "Growing"}
                    </p>
                    <p className="text-sm text-blue-700">Market Trend</p>
                  </div>
                </div>
                <Progress 
                  value={getNumericValue(dynamicAnalysis.marketSummary.trend)} 
                  className="h-2"
                />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-50 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-emerald-600" />
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-900">
                      {dynamicAnalysis.marketSummary.audienceSize || "Large"}
                    </p>
                    <p className="text-sm text-emerald-700">Audience Size</p>
                  </div>
                </div>
                <Progress 
                  value={getNumericValue(dynamicAnalysis.marketSummary.audienceSize)} 
                  className="h-2"
                />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Sparkles className="w-8 h-8 text-purple-600" />
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-900">
                      {dynamicAnalysis.marketSummary.viralPotential || "High"}
                    </p>
                    <p className="text-sm text-purple-700">Viral Potential</p>
                  </div>
                </div>
                <Progress 
                  value={getNumericValue(dynamicAnalysis.marketSummary.viralPotential)} 
                  className="h-2"
                />
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <BarChart3 className="w-8 h-8 text-orange-600" />
                  <div className="text-right">
                    <p className="text-2xl font-bold text-orange-900">
                      {dynamicAnalysis.marketSummary.competitionLevel || "Medium"}
                    </p>
                    <p className="text-sm text-orange-700">Competition</p>
                  </div>
                </div>
                <Progress 
                  value={getNumericValue(dynamicAnalysis.marketSummary.competitionLevel)} 
                  className="h-2"
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* ENHANCED COMPETITIVE ANALYSIS - Make it more prominent */}
        {dynamicAnalysis.competitors && (
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
            <CardHeader className="bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center text-xl">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                Competitive Landscape Analysis
                <Badge className="ml-auto bg-white/20 text-white border-white/30">
                  Critical Insights
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {typeof dynamicAnalysis.competitors === 'object' && !Array.isArray(dynamicAnalysis.competitors) ? (
                <div className="space-y-6">
                  {/* Top Competitors */}
                  {dynamicAnalysis.competitors.topCompetitors && (
                    <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                      <h4 className="font-bold text-orange-900 mb-3 flex items-center">
                        <Users className="w-5 h-5 mr-2" />
                        Top Competitors
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Array.isArray(dynamicAnalysis.competitors.topCompetitors) ? (
                          dynamicAnalysis.competitors.topCompetitors.map((competitor: string, index: number) => (
                            <div key={index} className="flex items-center space-x-3 bg-orange-50 rounded-lg p-3">
                              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-sm font-bold">#{index + 1}</span>
                              </div>
                              <span className="text-slate-800 font-medium">{competitor}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-700 col-span-2">{String(dynamicAnalysis.competitors.topCompetitors)}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Competitor Strategies */}
                  {dynamicAnalysis.competitors.competitorStrategies && (
                    <div className="bg-white rounded-lg p-4 border-l-4 border-red-500">
                      <h4 className="font-bold text-red-900 mb-3 flex items-center">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        Competitor Strategies
                      </h4>
                      <div className="bg-red-50 rounded-lg p-4">
                        <p className="text-slate-800 leading-relaxed">
                          {String(dynamicAnalysis.competitors.competitorStrategies)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Differentiation Opportunity */}
                  {dynamicAnalysis.competitors.differentiationOpportunity && (
                    <div className="bg-white rounded-lg p-4 border-l-4 border-emerald-500">
                      <h4 className="font-bold text-emerald-900 mb-3 flex items-center">
                        <Sparkles className="w-5 h-5 mr-2" />
                        Your Differentiation Opportunity
                      </h4>
                      <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                        <p className="text-slate-800 leading-relaxed font-medium">
                          {String(dynamicAnalysis.competitors.differentiationOpportunity)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Additional competitor data */}
                  {Object.entries(dynamicAnalysis.competitors)
                    .filter(([key]) => !['topCompetitors', 'competitorStrategies', 'differentiationOpportunity'].includes(key))
                    .map(([key, value]) => (
                      <div key={key} className="bg-white rounded-lg p-4 border-l-4 border-slate-300">
                        <h4 className="font-bold text-slate-900 mb-3 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h4>
                        <p className="text-slate-700 leading-relaxed">
                          {Array.isArray(value) ? value.join(', ') : String(value)}
                        </p>
                      </div>
                    ))}
                </div>
              ) : Array.isArray(dynamicAnalysis.competitors) ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dynamicAnalysis.competitors.map((competitor: any, index: number) => (
                    <div key={index} className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">#{index + 1}</span>
                        </div>
                        <span className="font-medium text-slate-900">Competitor {index + 1}</span>
                      </div>
                      <p className="text-slate-700 text-sm">
                        {typeof competitor === 'object' ? JSON.stringify(competitor) : String(competitor)}
                      </p>
                    </div>
                  ))}
                        </div>
                      ) : (
                <div className="bg-white rounded-lg p-4 border-l-4 border-orange-500">
                  <p className="text-slate-700 leading-relaxed">{String(dynamicAnalysis.competitors)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Market Metrics Chart */}
        {marketMetricsData.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                  <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                Market Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={marketMetricsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12 }}
                      className="text-slate-600"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      className="text-slate-600"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                      }}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {marketMetricsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                </div>
            </CardContent>
          </Card>
        )}

        {/* Platform Engagement Chart */}
        {platformData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-3">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  Platform Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={platformData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="engagement"
                      >
                        {platformData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Engagement']}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {platformData.map((platform: any, index: number) => (
                    <div key={platform.name} className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-sm text-slate-600">{platform.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Target Audience Details */}
            {dynamicAnalysis.audience && (
              <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-3">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    Target Audience
              </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {typeof dynamicAnalysis.audience === 'object' ? (
                      Object.entries(dynamicAnalysis.audience).map(([key, value]) => (
                        <div key={key} className="border-l-4 border-emerald-200 pl-4 bg-emerald-50/50 rounded-r-lg p-3">
                          <p className="font-semibold text-slate-900 capitalize mb-1">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </p>
                          <p className="text-slate-700 text-sm leading-relaxed">
                            {Array.isArray(value) ? value.join(', ') : String(value)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-700 leading-relaxed">{String(dynamicAnalysis.audience)}</p>
                    )}
                  </div>
            </CardContent>
          </Card>
            )}
          </div>
        )}

        {/* Content Strategy with Visual Indicators */}
        {dynamicAnalysis.strategy && (
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-3">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                Content Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {typeof dynamicAnalysis.strategy === 'object' ? (
                  Object.entries(dynamicAnalysis.strategy).map(([key, value]) => (
                    <div key={key} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-300">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <p className="font-semibold text-slate-900 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </p>
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed ml-4">
                        {Array.isArray(value) ? value.join(', ') : String(value)}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-700 leading-relaxed col-span-2">{String(dynamicAnalysis.strategy)}</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Opportunities & Insights with Enhanced Visuals */}
        {(dynamicAnalysis.opportunities || dynamicAnalysis.insights) && (
          <Card className="border-0 shadow-lg bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                Key Opportunities & Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dynamicAnalysis.opportunities && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-indigo-900 mb-3 flex items-center">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Opportunities
                      </h4>
                    {Array.isArray(dynamicAnalysis.opportunities) ? (
                      dynamicAnalysis.opportunities.map((opportunity, index) => (
                        <div key={index} className="flex items-start space-x-3 bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-indigo-100">
                          <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">{index + 1}</span>
                        </div>
                          <p className="text-slate-700 text-sm leading-relaxed">{String(opportunity)}</p>
                        </div>
                      ))
                      ) : (
                      <p className="text-slate-700 leading-relaxed">{String(dynamicAnalysis.opportunities)}</p>
                      )}
                    </div>
                )}
                {dynamicAnalysis.insights && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Key Insights
                    </h4>
                    {Array.isArray(dynamicAnalysis.insights) ? (
                      dynamicAnalysis.insights.map((insight, index) => (
                        <div key={index} className="flex items-start space-x-3 bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-purple-100">
                          <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                          <p className="text-slate-700 text-sm leading-relaxed">{String(insight)}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-700 leading-relaxed">{String(dynamicAnalysis.insights)}</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Market Trends Timeline */}
        {dynamicAnalysis.marketTrends && Array.isArray(dynamicAnalysis.marketTrends) && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                Market Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dynamicAnalysis.marketTrends.map((trend, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-l-4 border-green-400">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-800 font-medium">{String(trend)}</p>
                    </div>
                    <div className="flex-shrink-0">
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Trending
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-center items-center pt-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleGenerate}
              disabled={isGeneratingScripts || isGeneratingAnalysis}
              className="flex items-center bg-white text-indigo-600 border-indigo-300 hover:bg-indigo-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Analysis
          </Button>
          <Button
            onClick={() => handleStepChange("storyboard")}
              className={`bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 flex items-center text-white shadow-lg transition-all duration-300 ${
                isGeneratingScripts ? 'cursor-not-allowed opacity-90' : 'hover:scale-105'
              }`}
            disabled={isGeneratingScripts || !aRollScript || !bRollScript}
          >
            {isGeneratingScripts ? (
              <>
                  <div className="relative">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-pulse"></div>
                  </div>
                  <span className="animate-pulse">Generating Scripts...</span>
              </>
            ) : (
                <>
                  {aRollScript && bRollScript ? (
              <>
                Continue to Storyboard
                <ArrowLeft className="w-4 h-4 ml-2 transform rotate-180" />
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                      Generate Scripts First
                    </>
                  )}
              </>
            )}
          </Button>
          </div>
        </div>
      </div>
    )
  }

  const handleScrapeData = async () => {
    if (!socialUrls.youtube.trim() && !socialUrls.linkedin.trim()) {
      setToastMessage({ 
        title: "Missing URLs", 
        description: "Please provide at least one social media URL." 
      })
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)
      return
    }

    setIsScrapingSocials(true)
    try {
      const response = await fetch("/api/scrape-socials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          youtube: socialUrls.youtube.trim(),
          linkedin: socialUrls.linkedin.trim()
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to scrape social data")
      }

      const scrapedData = await response.json()
      setPersonalData(scrapedData)
      setShowSocialsModal(false)
      
      setToastMessage({ 
        title: "Social Data Collected!", 
        description: "Your personal data has been analyzed for content personalization." 
      })
      setShowToast(true)
      setTimeout(() => setShowToast(false), 3000)

    } catch (error: any) {
      console.error("Scraping error:", error)
      setToastMessage({ 
        title: "Scraping Failed", 
        description: error.message 
      })
      setShowToast(true)
      setTimeout(() => setShowToast(false), 5000)
    } finally {
      setIsScrapingSocials(false)
    }
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
      <div
        className={`${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-800 text-white flex flex-col transition-transform duration-300 ease-in-out`}
      >
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-slate-300 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-4 border-b border-slate-700">
          <button
            onClick={() => {
              setActiveTab("create")
              setCurrentStep("input")
              setIsMobileMenuOpen(false)
            }}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">supernova</span>
          </button>
        </div>

        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            <li>
              <button
                onClick={() => handleTabChange("create")}
                className={`w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === "create"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">Create</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleTabChange("library")}
                className={`w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === "library"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <Folder className="w-4 h-4" />
                <span className="text-sm">Library</span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="p-3 border-t border-slate-700 space-y-1">
          <button
            onClick={() => handleTabChange("settings")}
            className={`w-full flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === "settings"
                ? "bg-indigo-600 text-white"
                : "text-slate-300 hover:bg-slate-700 hover:text-white"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </button>
          <div className="flex items-center space-x-2 px-3 py-1.5">
            <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center">
              <User className="w-3 h-3" />
            </div>
            <span className="text-xs text-slate-300">Kevin Valencia</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <div className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
          <button
            onClick={() => {
              setActiveTab("create")
              setCurrentStep("input")
              setIsMobileMenuOpen(false)
            }}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity duration-200"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold">supernova</span>
          </button>
          <div className="w-10" />
        </div>

        {currentStep !== "input" && (
          <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                  const status = getStepStatus(step.id)
                  const canNav = canNavigateToStep(step.id)
                  return (
                    <div key={step.id} className="flex items-center">
                      <div className="flex items-center">
                        <button
                          onClick={() => canNav && handleStepChange(step.id)}
                          disabled={!canNav}
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                            status === "complete"
                              ? "bg-emerald-500 text-white hover:bg-emerald-600"
                              : status === "active"
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-200 text-gray-400"
                          } ${canNav ? "cursor-pointer" : "cursor-not-allowed"}`}
                        >
                          {step.number}
                        </button>
                        <div className="ml-3">
                          <button
                            onClick={() => canNav && handleStepChange(step.id)}
                            disabled={!canNav}
                            className={`text-left ${canNav ? "cursor-pointer hover:text-indigo-600" : "cursor-not-allowed"}`}
                          >
                            <p
                              className={`text-sm font-medium transition-colors ${
                                status === "active"
                                  ? "text-indigo-600"
                                  : status === "complete"
                                    ? "text-emerald-600"
                                    : "text-gray-400"
                              }`}
                            >
                              {step.title}
                            </p>
                          </button>
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`mx-4 lg:mx-8 h-0.5 w-16 lg:w-24 transition-colors duration-300 ${
                            getStepStatus(steps[index + 1].id) !== "pending" ? "bg-emerald-500" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        <div className="p-4 lg:p-8">
          {activeTab === "create" && (
            <div className="max-w-6xl mx-auto relative">
              {isGeneratingVideo && generationPhase && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-auto p-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Video className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">Creating Your Video</h3>
                      <p className="text-slate-600 mb-8">HeyGen AI is processing your content...</p>
                      <div className="mb-8">
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden mb-2">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${generationProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-slate-500">{Math.round(generationProgress)}% complete</p>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center justify-center space-x-3">
                          <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                          <span className="text-slate-700 font-medium">{generationPhase}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === "input" && (
                <>
                  <div className="relative text-center mb-20 mt-16 max-w-4xl mx-auto">
                    <div className="absolute inset-0 -z-10 overflow-hidden">
                      <div className="absolute top-5 left-5 w-16 h-16 bg-indigo-100 rounded-full blur-2xl opacity-30"></div>
                      <div className="absolute top-10 right-8 w-12 h-12 bg-purple-100 rounded-full blur-xl opacity-40"></div>
                      <div className="absolute bottom-5 left-1/3 w-14 h-14 bg-pink-100 rounded-full blur-2xl opacity-25"></div>
                    </div>
                    <div className="flex items-center justify-center mb-4 animate-fade-in">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center mr-2 shadow-lg">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                        supernova
                      </span>
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4 leading-tight">
                      Generate{" "}
                      <span className="relative inline-block">
                        <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                          viral content
                        </span>
                        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full opacity-60"></div>
                      </span>{" "}
                      in seconds.
                    </h1>
                    <p className="text-base lg:text-lg text-slate-600 mb-6 max-w-2xl mx-auto leading-relaxed font-light">
                      Transform any idea into engaging video content using HeyGen AI digital twin. From articles to
                      trending topics - we've got you covered.
                    </p>
                  </div>
                  <div className="max-w-2xl mx-auto mb-16 relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-lg"></div>
                    <div className="relative bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-xl">
                      <div className="relative">
                        <Input
                          value={contentInput}
                          onChange={(e) => setContentInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey && contentInput.trim() && !isGenerating) {
                              e.preventDefault()
                              handleGenerate()
                            }
                          }}
                          placeholder="Describe your short video content idea..."
                          className="h-16 px-6 pr-16 text-lg border-2 border-slate-200/50 focus:border-indigo-400 focus:ring-0 focus:outline-none rounded-xl bg-white/90 backdrop-blur-sm shadow-md placeholder:text-slate-400"
                          disabled={isGenerating}
                        />
                        <Button
                          onClick={handleGenerate}
                          disabled={!contentInput.trim() || isGenerating}
                          className="absolute right-3 top-4 h-8 w-8 p-0 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                        >
                          {isGeneratingAnalysis ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <ArrowUp className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      
                      {/* Enhanced status indicators with personal data */}
                      <div className="flex items-center justify-center mt-3 space-x-4">
                        <div className="flex items-center space-x-1 text-slate-500">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-xs font-medium">AI Ready</span>
                        </div>
                        <div className="flex items-center space-x-1 text-slate-500">
                          <Video className="w-3 h-3 text-indigo-500" />
                          <span className="text-xs font-medium">HeyGen AI</span>
                        </div>
                        <div className="flex items-center space-x-1 text-slate-500">
                          <Sparkles className="w-3 h-3 text-purple-500" />
                          <span className="text-xs font-medium">Digital Twin</span>
                        </div>
                        {personalData && (
                          <div className="flex items-center space-x-1 text-emerald-600">
                            <User className="w-3 h-3" />
                            <span className="text-xs font-medium">Personalized</span>
                      </div>
                        )}
                      </div>

                      {/* Add Socials Button */}
                      <div className="flex justify-center mt-3">
                        <Dialog open={showSocialsModal} onOpenChange={setShowSocialsModal}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-white/50 border-indigo-200 text-indigo-700 hover:bg-indigo-50 transition-all duration-300 hover:scale-105 text-xs"
                            >
                              <Users className="w-3 h-3 mr-1" />
                              {personalData ? "Update Socials" : "Add Socials"}
                              {personalData && (
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full ml-1"></div>
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle className="flex items-center">
                                <Users className="w-5 h-5 mr-2 text-indigo-600" />
                                Connect Your Social Profiles
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="youtube-url" className="text-sm font-medium text-slate-700">
                                  YouTube Channel URL
                                </Label>
                                <Input
                                  id="youtube-url"
                                  value={socialUrls.youtube}
                                  onChange={(e) => setSocialUrls(prev => ({ ...prev, youtube: e.target.value }))}
                                  placeholder="https://youtube.com/@yourchannel"
                                  className="w-full"
                                />
                                <p className="text-xs text-slate-500">We'll analyze your content style and audience engagement</p>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="linkedin-url" className="text-sm font-medium text-slate-700">
                                  LinkedIn Profile URL
                                </Label>
                                <Input
                                  id="linkedin-url"
                                  value={socialUrls.linkedin}
                                  onChange={(e) => setSocialUrls(prev => ({ ...prev, linkedin: e.target.value }))}
                                  placeholder="https://linkedin.com/in/yourprofile"
                                  className="w-full"
                                />
                                <p className="text-xs text-slate-500">We'll understand your professional background and expertise</p>
                              </div>

                              <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                                <div className="flex items-start space-x-3">
                                  <Sparkles className="w-5 h-5 text-indigo-600 mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium text-indigo-900">Personalized Content</p>
                                    <p className="text-xs text-indigo-700 mt-1">
                                      Your social data helps us create scripts that match your unique voice, style, and expertise.
                                    </p>
                                  </div>
                                </div>
                              </div>

                              <div className="flex space-x-3">
                                <Button
                                  onClick={() => setShowSocialsModal(false)}
                                  variant="outline"
                                  className="flex-1"
                                >
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleScrapeData}
                                  disabled={isScrapingSocials || (!socialUrls.youtube.trim() && !socialUrls.linkedin.trim())}
                                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                                >
                                  {isScrapingSocials ? (
                                    <>
                                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                      Analyzing...
                                    </>
                                  ) : (
                                    <>
                                      <Users className="w-4 h-4 mr-2" />
                                      Analyze Profiles
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      {/* Personal Data Preview */}
                      {personalData && (
                        <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                          <div className="flex items-center space-x-2 mb-2">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-xs font-medium text-emerald-900">Personal Data Loaded</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                            {personalData.youtube && (
                              <div className="bg-white/50 rounded p-2">
                                <p className="font-medium text-slate-700 text-xs">YouTube Insights</p>
                                <p className="text-slate-600 text-xs">{personalData.youtube.channelName || "Channel data analyzed"}</p>
                              </div>
                            )}
                            {personalData.linkedin && (
                              <div className="bg-white/50 rounded p-2">
                                <p className="font-medium text-slate-700 text-xs">LinkedIn Profile</p>
                                <p className="text-slate-600 text-xs">{personalData.linkedin.name || "Professional data analyzed"}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">HeyGen AI Avatar</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Create your personalized AI avatar with HeyGen's advanced technology
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                        <TrendingUp className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Dynamic Analysis</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        AI-powered content optimization based on real market data
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                        <Video className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">Instant Videos</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Generate professional videos instantly with HeyGen AI technology
                      </p>
                    </div>
                  </div>
                </>
              )}

              {currentStep === "analysis" && renderDynamicAnalysis()}

              {currentStep === "storyboard" && (
                <div className="space-y-8">
                  <div className="text-center mb-12 relative">
                    <Button
                      variant="outline"
                      onClick={() => handleStepChange("input")}
                      className="absolute top-0 left-0 flex items-center bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <div className="flex items-center justify-center mb-4">
                      {personalData && (
                        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-2 rounded-full border border-emerald-200 mr-4">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-emerald-700">AI-Personalized Scripts</span>
                        </div>
                      )}
                      <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2 rounded-full border border-indigo-200">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        <span className="text-sm font-medium text-indigo-700">LangChain Powered</span>
                      </div>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Generated Script & Visual Plan</h1>
                    <p className="text-slate-600 mb-4">
                      {personalData 
                        ? "Personalized content tailored to your unique voice and audience based on your social media analysis" 
                        : "Review and customize your content before generating the final video with HeyGen AI"
                      }
                    </p>
                    {personalData && (
                      <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg p-4 max-w-2xl mx-auto">
                        <div className="flex items-center justify-center space-x-6 text-sm">
                          {personalData.urls?.youtube && (
                            <div className="flex items-center space-x-2 text-emerald-700">
                              <Video className="w-4 h-4" />
                              <span>YouTube Profile Analyzed</span>
                            </div>
                          )}
                          {personalData.urls?.linkedin && (
                            <div className="flex items-center space-x-2 text-emerald-700">
                              <Users className="w-4 h-4" />
                              <span>LinkedIn Profile Analyzed</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2 text-emerald-700">
                            <TrendingUp className="w-4 h-4" />
                            <span>Content Personalized</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {apiError && (
                    <Card className="border-l-4 border-l-red-500">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 text-red-700">
                          <AlertCircle className="w-5 h-5" />
                          <span>Error: {apiError}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Personalization Insights Panel */}
                  {personalData && personalData.personalizedContent && (
                    <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 via-indigo-50 to-emerald-50 mb-8">
                      <CardHeader className="bg-gradient-to-r from-purple-600 to-emerald-600 text-white rounded-t-lg">
                        <CardTitle className="flex items-center text-xl">
                          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                            <Sparkles className="w-5 h-5 text-white" />
                          </div>
                          Personalization Intelligence
                          <Badge className="ml-auto bg-white/20 text-white border-white/30">
                            LangChain AI
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Analysis Summary */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-slate-900 flex items-center">
                              <Users className="w-5 h-5 mr-2 text-purple-600" />
                              Profile Analysis Summary
                            </h4>
                            {personalData.urls?.youtube && (
                              <div className="bg-white/70 rounded-lg p-4 border border-purple-200">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Video className="w-4 h-4 text-red-600" />
                                  <span className="font-medium text-slate-900">YouTube Insights</span>
                                </div>
                                <div className="text-sm text-slate-700 space-y-1">
                                  <p><span className="font-medium">Content Style:</span> Analyzed from channel patterns</p>
                                  <p><span className="font-medium">Audience:</span> Tailored to your viewer demographics</p>
                                  <p><span className="font-medium">Voice:</span> Matched to your presentation style</p>
                                </div>
                              </div>
                            )}
                            {personalData.urls?.linkedin && (
                              <div className="bg-white/70 rounded-lg p-4 border border-indigo-200">
                                <div className="flex items-center space-x-2 mb-2">
                                  <Users className="w-4 h-4 text-blue-600" />
                                  <span className="font-medium text-slate-900">LinkedIn Insights</span>
                                </div>
                                <div className="text-sm text-slate-700 space-y-1">
                                  <p><span className="font-medium">Professional Tone:</span> Matched to your communication style</p>
                                  <p><span className="font-medium">Expertise:</span> Leveraged your industry knowledge</p>
                                  <p><span className="font-medium">Authority:</span> Reflected your professional positioning</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Personalization Features */}
                          <div className="space-y-4">
                            <h4 className="font-semibold text-slate-900 flex items-center">
                              <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" />
                              Personalization Features Applied
                            </h4>
                            <div className="space-y-3">
                              <div className="flex items-center space-x-3 bg-white/70 rounded-lg p-3 border border-emerald-200">
                                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-sm text-slate-700">Voice tone matched to your style</span>
                              </div>
                              <div className="flex items-center space-x-3 bg-white/70 rounded-lg p-3 border border-emerald-200">
                                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                  <Check className="w-4 h-4 text-white" />
                                </div>
                                <span className="text-sm text-slate-700">Content format aligned with your preferences</span>
                              </div>
                              <div className="flex items-center space-x-3 bg-white/70 rounded-lg p-3 border border-emerald-200">
                                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                                <span className="text-sm text-slate-700">Audience targeting based on your followers</span>
                              </div>
                              <div className="flex items-center space-x-3 bg-white/70 rounded-lg p-3 border border-emerald-200">
                                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                  <Sparkles className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-sm text-slate-700">Expertise and credibility integrated</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {personalData.personalizedContent.personalizationNotes && (
                          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
                            <h5 className="font-medium text-slate-900 mb-2 flex items-center">
                              <Sparkles className="w-4 h-4 mr-2 text-indigo-600" />
                              AI Personalization Notes
                            </h5>
                            <p className="text-sm text-slate-700 leading-relaxed">
                              {personalData.personalizedContent.personalizationNotes}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  <div className="grid lg:grid-cols-2 gap-8">
                    <Card className={`${personalData ? 'border-2 border-emerald-200 shadow-lg' : 'shadow-md'}`}>
                      <CardHeader className={personalData ? 'bg-gradient-to-r from-emerald-50 to-green-50' : ''}>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center">
                            <User className="w-5 h-5 mr-2 text-indigo-600" />
                            A-Roll Script
                            {personalData && (
                              <Badge className="ml-2 bg-emerald-100 text-emerald-700 border-emerald-300">
                                Personalized
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {personalData && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                                onClick={() => {
                                  setToastMessage({
                                    title: "Personalized Script",
                                    description: "This script was generated using your social media analysis data"
                                  })
                                  setShowToast(true)
                                  setTimeout(() => setShowToast(false), 3000)
                                }}
                              >
                                <Sparkles className="w-3 h-3 mr-1" />
                                Info
                              </Button>
                            )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleRegenerateScripts}
                            disabled={isGeneratingScripts}
                            className="bg-white text-indigo-600 border-indigo-300 hover:bg-indigo-50"
                          >
                            {isGeneratingScripts && currentStep === "storyboard" ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                Regen...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Regenerate
                              </>
                            )}
                          </Button>
                          </div>
                        </CardTitle>
                        {personalData && (
                          <div className="text-xs text-emerald-600 flex items-center mt-2">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Generated using your personal voice and audience insights
                          </div>
                        )}
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          value={aRollScript}
                          onChange={(e) => setARollScript(e.target.value)}
                          className={`min-h-[400px] text-sm leading-relaxed ${personalData ? 'border-emerald-200 focus:border-emerald-400' : ''}`}
                          placeholder={
                            isGeneratingScripts
                              ? "Generating personalized A-Roll script..."
                              : personalData 
                                ? "Your personalized spoken content will appear here..."
                              : "Your spoken content will appear here..."
                          }
                          disabled={isGeneratingScripts}
                        />
                        {personalData && aRollScript && (
                          <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                            <div className="flex items-center space-x-2 text-emerald-700 text-xs">
                              <Check className="w-3 h-3" />
                              <span>Script personalized based on your social media analysis</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className={`${personalData ? 'border-2 border-emerald-200 shadow-lg' : 'shadow-md'}`}>
                      <CardHeader className={personalData ? 'bg-gradient-to-r from-emerald-50 to-green-50' : ''}>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Video className="w-5 h-5 mr-2 text-emerald-600" />
                            B-Roll Script
                            {personalData && (
                              <Badge className="ml-2 bg-emerald-100 text-emerald-700 border-emerald-300">
                                Personalized
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            {personalData && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                                onClick={() => {
                                  setToastMessage({
                                    title: "Personalized Visuals",
                                    description: "Visual directions tailored to your content style"
                                  })
                                  setShowToast(true)
                                  setTimeout(() => setShowToast(false), 3000)
                                }}
                              >
                                <Sparkles className="w-3 h-3 mr-1" />
                                Info
                              </Button>
                            )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleRegenerateScripts}
                            disabled={isGeneratingScripts}
                            className="bg-white text-emerald-600 border-emerald-300 hover:bg-emerald-50"
                          >
                            {isGeneratingScripts && currentStep === "storyboard" ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                Regen...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Regenerate
                              </>
                            )}
                          </Button>
                          </div>
                        </CardTitle>
                        {personalData && (
                          <div className="text-xs text-emerald-600 flex items-center mt-2">
                            <Video className="w-3 h-3 mr-1" />
                            Visual directions matched to your content format preferences
                          </div>
                        )}
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          value={bRollScript}
                          onChange={(e) => setBRollScript(e.target.value)}
                          className={`min-h-[400px] text-sm leading-relaxed font-mono ${personalData ? 'border-emerald-200 focus:border-emerald-400' : ''}`}
                          placeholder={
                            isGeneratingScripts
                              ? "Generating personalized B-Roll script..."
                              : personalData
                                ? "Personalized visual cues and B-roll instructions will appear here..."
                              : "Visual cues and B-roll instructions will appear here..."
                          }
                          disabled={isGeneratingScripts}
                        />
                        {personalData && bRollScript && (
                          <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                            <div className="flex items-center space-x-2 text-emerald-700 text-xs">
                              <Check className="w-3 h-3" />
                              <span>Visual directions tailored to your established content style</span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Enhanced Generate Video Button */}
                  {/* Generate Video Button */}
                  <div className="flex justify-center">
                    <div className="text-center">
                      {/* Caption info */}
                      <div className="mb-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">CC</span>
                </div>
                          <span className="text-sm font-semibold text-indigo-900">Auto-Generated Captions</span>
                        </div>
                        <p className="text-xs text-indigo-700">
                          Your video will include stylized captions with gold highlights and rounded backgrounds
                        </p>
          </div>

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
                            Generate Video with Captions
                          </>
                        )}
                    </Button>
                    </div>
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
                              key={generatedVideoUrl || "/HackAI Demo.mp4"}
                              onError={(e) => {
                                console.error('Video playback error:', e)
                                // Fallback to demo video if HeyGen video fails
                                const video = e.target as HTMLVideoElement
                                if (video.src !== "/HackAI Demo.mp4" && !generatedVideoUrl) {
                                  video.src = "/HackAI Demo.mp4"
                                }
                              }}
                              onLoadedData={() => {
                                console.log('Video loaded successfully:', generatedVideoUrl || "/HackAI Demo.mp4")
                              }}
                            >
                              {/* Use HeyGen generated video if available, otherwise fallback to demo */}
                              <source 
                                src={generatedVideoUrl || "/HackAI Demo.mp4"} 
                                type="video/mp4" 
                              />
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
                            <p className="text-lg font-semibold text-slate-900">
                              {generatedVideoUrl && generatedVideoUrl.startsWith('http') ? 'AI Generated' : 'Demo Video'}
                            </p>
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
                            <p className="text-lg font-semibold text-slate-900">HeyGen AI</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardContent className="p-4 text-center">
                            <div className="w-8 h-8 mx-auto mb-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">CC</span>
                            </div>
                            <p className="text-sm text-slate-600">Captions</p>
                            <p className="text-lg font-semibold text-slate-900">
                              {generatedVideoUrl && generatedVideoUrl.includes('caption') ? 'Embedded' : 'Auto-Generated'}
                            </p>
                          </CardContent>
                        </Card>
          </div>

                      {/* Performance Prediction */}
                      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                          <CardTitle className="flex items-center text-green-800">
                            <TrendingUp className="w-5 h-5 mr-2" />
                            {generatedVideoUrl && generatedVideoUrl.startsWith('http') ? 'HeyGen AI Generated Video' : 'Demo Video'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                          <div className="text-center">
                            <div>
                              <p className="text-2xl font-bold text-green-700">
                                {generatedVideoUrl && generatedVideoUrl.startsWith('http') ? '✨ AI Avatar Video' : '🎬 Demo Video'}
                              </p>
                              <p className="text-sm text-green-600">
                                {generatedVideoUrl && generatedVideoUrl.startsWith('http') ? 
                                  'Generated using HeyGen API with auto-captions' : 
                                  'Demo video - Generate with HeyGen for real results'
                                }
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <Button 
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-lg py-3"
                          onClick={() => {
                            const videoUrl = generatedVideoUrl
                            if (videoUrl && videoUrl.startsWith('http')) {
                              window.open(videoUrl, '_blank')
                            } else if (videoUrl) {
                              const link = document.createElement('a')
                              link.href = videoUrl
                              link.download = 'generated-video.mp4'
                              document.body.appendChild(link)
                              link.click()
                              document.body.removeChild(link)
                            } else {
                              alert('No video available for download')
                            }
                          }}
                          disabled={!generatedVideoUrl}
                        >
                          <Download className="w-5 h-5 mr-2" />
                          {generatedVideoUrl && generatedVideoUrl.startsWith('http') ? 'Open Video' : 'Download Video'}
                        </Button>
                        <div className="grid grid-cols-2 gap-3">
                          <Button 
                            variant="outline" 
                            className="py-3"
                            onClick={() => {
                              navigator.clipboard.writeText(aRollScript)
                            }}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy Script
                          </Button>
                          <Button 
                            variant="outline" 
                            className="py-3"
                            onClick={handleAddToLibrary}
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save to Library
                          </Button>
                    </div>
                  </div>

                      {/* Success Message */}
                      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 text-emerald-700">
                          <Check className="w-5 h-5" />
                          <span className="font-medium">
                            {generatedVideoUrl && generatedVideoUrl.startsWith('http')
                              ? generatedVideoUrl.includes('caption') 
                                ? 'Video generated successfully with embedded HeyGen captions!' 
                                : 'Video generated successfully with HeyGen AI!'
                              : 'Demo video ready - Generate with HeyGen for real AI video with captions!'
                            }
                          </span>
                        </div>
                        
                        {/* Add caption info */}
                        {generatedVideoUrl && generatedVideoUrl.includes('caption') && (
                          <div className="mt-2 text-sm text-emerald-600">
                            ✨ This video includes stylized captions with gold highlights and rounded backgrounds as configured in your HeyGen settings.
                          </div>
                        )}
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
                        <Input id="name" defaultValue="Kevin Valencia" />
                    </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="alex@example.com" />
                  </div>
                    </div>
                  </CardContent>
                </Card>

                {/* HeyGen Configuration */}
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle>HeyGen AI Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                <div className="space-y-4">
                      <div>
                        <Label htmlFor="avatar-select">Select Avatar</Label>
                        <select
                          id="avatar-select"
                          value={selectedAvatarId}
                          onChange={(e) => setSelectedAvatarId(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Select an avatar...</option>
                          {availableAvatars.map((avatar) => (
                            <option key={avatar.avatar_id} value={avatar.avatar_id}>
                              {avatar.avatar_name} ({avatar.gender})
                            </option>
                          ))}
                        </select>
                        <p className="text-sm text-slate-600 mt-1">
                          {availableAvatars.length} avatars available
                        </p>
                    </div>
                      
                      <div>
                        <Label htmlFor="voice-select">Select Voice</Label>
                        <select
                          id="voice-select"
                          value={selectedVoiceId}
                          onChange={(e) => setSelectedVoiceId(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Select a voice...</option>
                          {availableVoices.map((voice) => (
                            <option key={voice.voice_id} value={voice.voice_id}>
                              {voice.name} ({voice.language} - {voice.gender})
                            </option>
                          ))}
                        </select>
                        <p className="text-sm text-slate-600 mt-1">
                          {availableVoices.length} voices available
                        </p>
                  </div>
                      
                      {/* Caption Feature Info */}
                      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">CC</span>
                    </div>
                          <h4 className="font-semibold text-indigo-900">Automatic Captions</h4>
                  </div>
                        <p className="text-sm text-indigo-700 mb-2">
                          All generated videos include stylized captions with:
                        </p>
                        <ul className="text-xs text-indigo-600 space-y-1 ml-4">
                          <li>• Gold highlighted text for emphasis</li>
                          <li>• Semi-transparent rounded backgrounds</li>
                          <li>• Bottom positioning for mobile viewing</li>
                          <li>• Automatic timestamp removal from speech</li>
                        </ul>
                    </div>
                  </div>
                    
                    {/* Connection Status */}
                    <div className={`rounded-lg p-4 border ${
                      apiStatus.testing ? 'bg-yellow-50 border-yellow-200' :
                      apiStatus.connected ? 'bg-green-50 border-green-200' : 
                      'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-3 h-3 rounded-full ${
                          apiStatus.testing ? 'bg-yellow-500' :
                          apiStatus.connected ? 'bg-green-500' : 'bg-red-500'
                        }`}></div>
                        <span className={`text-sm font-medium ${
                          apiStatus.testing ? 'text-yellow-900' :
                          apiStatus.connected ? 'text-green-900' : 'text-red-900'
                        }`}>
                          {apiStatus.testing ? 'Testing HeyGen API...' :
                           apiStatus.connected ? 'HeyGen API Connected' : 
                           'HeyGen API Disconnected'}
                        </span>
                      </div>
                      
                      {apiStatus.error && (
                        <p className="text-sm text-red-600 mb-2">
                          Error: {apiStatus.error}
                        </p>
                      )}
                      
                      {apiStatus.connected && (
                        <>
                          <p className="text-sm text-green-600">
                            Avatar: {availableAvatars.find(a => a.avatar_id === selectedAvatarId)?.avatar_name || 'None selected'}
                            {(customAvatarId === selectedAvatarId && hasUploadedVideo) && (
                              <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Custom</span>
                            )}
                          </p>
                          <p className="text-sm text-green-600">
                            Voice: {availableVoices.find(v => v.voice_id === selectedVoiceId)?.name || 'None selected'}
                          </p>
                          {uploadedVideo.assetId && (
                            <p className="text-sm text-green-600 mt-2">
                              Training Video: Uploaded (Asset ID: {uploadedVideo.assetId})
                            </p>
                          )}
                        </>
                      )}
                      
                      {!apiStatus.connected && !apiStatus.testing && (
                        <div className="mt-2">
                          <p className="text-sm text-red-600 mb-2">
                            Please check your HeyGen API key configuration.
                          </p>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              setApiStatus(prev => ({ ...prev, testing: true, error: null }))
                              try {
                                const isValid = await heygenAPI.testApiKey()
                                if (isValid) {
                                  // Reload data
                                  const [avatars, voices] = await Promise.all([
                                    heygenAPI.getAvatars(),
                                    heygenAPI.getVoices()
                                  ])
                                  setAvailableAvatars(avatars)
                                  setAvailableVoices(voices)
                                  setApiStatus({ connected: true, testing: false, error: null })
                                } else {
                                  setApiStatus({ connected: false, testing: false, error: 'Invalid API key' })
                                }
                              } catch (error) {
                                setApiStatus({ 
                                  connected: false, 
                                  testing: false, 
                                  error: error instanceof Error ? error.message : 'Connection failed' 
                                })
                              }
                            }}
                            disabled={apiStatus.testing}
                          >
                            {apiStatus.testing ? (
                              <>
                                <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                                Testing...
                              </>
                            ) : (
                              <>
                                <RefreshCw className="w-3 h-3 mr-2" />
                                Retry Connection
                              </>
                            )}
                          </Button>
                        </div>
                      )}
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
                    <CardTitle>AI Avatar Video Upload</CardTitle>
              </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-slate-600 mb-4">
                      Upload a video of yourself to create a custom AI avatar. Your avatar will be automatically processed and ready for content generation.
                    </p>
                    
                    {/* Avatar Creation Progress */}
                    {avatarCreation.isProcessing && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 mb-4">
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-white" />
                  </div>
                          <div>
                            <h4 className="font-semibold text-blue-900">Creating Your AI Avatar</h4>
                            <p className="text-sm text-blue-700">Estimated time: {avatarCreation.estimatedTime}</p>
                  </div>
                  </div>
                        
                        {/* Progress Bar */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-blue-900">{avatarCreation.phase}</span>
                            <span className="text-sm text-blue-700">{avatarCreation.progress}%</span>
                  </div>
                          <div className="w-full bg-blue-200 rounded-full h-2">
                            <div 
                              className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 ease-out" 
                              style={{ width: `${avatarCreation.progress}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        
                        {/* Current Phase Indicator */}
                        <div className="flex items-center space-x-2 text-blue-700">
                          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm">{avatarCreation.phase}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Video Upload Section */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="video-upload">Upload Avatar Training Video</Label>
                        <div className="mt-2">
                          <input
                            id="video-upload"
                            type="file"
                            accept="video/*"
                            onChange={handleVideoUpload}
                            disabled={uploadedVideo.uploading || avatarCreation.isProcessing}
                            className="hidden"
                          />
                          <Button
                            onClick={() => document.getElementById('video-upload')?.click()}
                            variant="outline"
                            className="w-full"
                            disabled={uploadedVideo.uploading || avatarCreation.isProcessing}
                          >
                            {uploadedVideo.uploading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                                Uploading...
                              </>
                            ) : avatarCreation.isProcessing ? (
                              <>
                                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2" />
                                Creating Avatar...
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 mr-2" />
                                Choose Video File
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          Supported formats: MP4, WebM. Max size: 500MB. Recommended: 2-minute video with clear face visibility.
                        </p>
                      </div>
                    </div>
                    
                    {/* Video Preview */}
                    {(uploadedVideo.file || uploadedVideo.url) && (
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <div className="flex items-start space-x-4">
                          {/* Video Preview */}
                          <div className="flex-shrink-0">
                            <div className="relative w-32 h-24 bg-black rounded-lg overflow-hidden">
                              {uploadedVideo.url ? (
                                <video 
                                  className="w-full h-full object-cover"
                                  controls
                                  preload="metadata"
                                >
                                  <source src={uploadedVideo.url} type={uploadedVideo.file?.type || 'video/mp4'} />
                                  Your browser does not support the video tag.
                                </video>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-slate-200">
                                  <Video className="w-8 h-8 text-slate-400" />
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Video Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className={`w-3 h-3 rounded-full ${
                                avatarCreation.isProcessing ? 'bg-blue-500' :
                                uploadedVideo.uploading ? 'bg-yellow-500' : 
                                uploadedVideo.assetId ? 'bg-green-500' : 'bg-gray-400'
                              }`}></div>
                              <span className="text-sm font-medium text-slate-900">
                                {avatarCreation.isProcessing ? 'Creating Avatar...' :
                                 uploadedVideo.uploading ? 'Uploading...' :
                                 uploadedVideo.assetId ? 'Upload Complete' : 'Ready to Upload'}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 mb-1">
                              {uploadedVideo.file?.name || 'No file selected'}
                            </p>
                            <p className="text-xs text-slate-500">
                              {uploadedVideo.file ? `Size: ${(uploadedVideo.file.size / (1024 * 1024)).toFixed(1)}MB` : ''}
                              {uploadedVideo.assetId && (
                                <span className="block">Asset ID: {uploadedVideo.assetId}</span>
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Avatar Creation Status */}
                    <div className={`rounded-lg p-4 border ${
                      (customAvatarId && hasUploadedVideo) ? 'bg-green-50 border-green-200' : 
                      avatarCreation.isProcessing ? 'bg-blue-50 border-blue-200' : 
                      'bg-blue-50 border-blue-200'
                    }`}>
                      <h4 className={`font-medium mb-2 ${
                        (customAvatarId && hasUploadedVideo) ? 'text-green-900' : 
                        avatarCreation.isProcessing ? 'text-blue-900' : 
                        'text-blue-900'
                      }`}>
                        {(customAvatarId && hasUploadedVideo) ? '✅ Kevin\'s Custom Avatar is Ready!' : 
                         avatarCreation.isProcessing ? '🔄 Creating Kevin\'s Avatar...' : 
                         '📝 Create Kevin\'s AI Avatar'}
                      </h4>
                      <div className={`text-sm space-y-1 ${
                        (customAvatarId && hasUploadedVideo) ? 'text-green-700' : 
                        avatarCreation.isProcessing ? 'text-blue-700' : 
                        'text-blue-700'
                      }`}>
                        {(customAvatarId && hasUploadedVideo) ? (
                          <>
                            <p>✅ Kevin's custom avatar has been created and is ready to use!</p>
                            <p>✅ It will be automatically selected for video generation</p>
                            <p>✅ You can now create videos with Kevin's personal AI avatar</p>
                          </>
                        ) : avatarCreation.isProcessing ? (
                          <>
                            <p>🔄 Your video is being processed to create Kevin's custom avatar</p>
                            <p>⏱️ Demo mode: ~{avatarCreation.estimatedTime} (accelerated for demo)</p>
                            <p>🔔 You'll be notified when Kevin's avatar is ready</p>
                          </>
                        ) : (
                          <>
                            <p>1. Upload a 2-minute video of Kevin speaking clearly</p>
                            <p>2. Our AI will automatically process the video</p>
                            <p>3. Kevin's custom avatar will be ready in ~30 seconds</p>
                            <p>4. Start creating videos with Kevin's personal AI avatar!</p>
                            <div className="mt-3 p-2 bg-blue-100 border border-blue-300 rounded text-xs">
                              <p><strong>Demo Mode:</strong> Avatar creation is accelerated for demonstration purposes. The system creates a fully functional Kevin avatar that can be used for video generation.</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Avatar Stats */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-indigo-50 rounded-lg p-3 text-center">
                        <p className="text-lg font-semibold text-indigo-600">{availableAvatars.length}</p>
                        <p className="text-xs text-indigo-600">Available Avatars</p>
                      </div>
                      <div className="bg-emerald-50 rounded-lg p-3 text-center">
                        <p className="text-lg font-semibold text-emerald-600">
                          {(customAvatarId && hasUploadedVideo) ? 'Ready' : 
                           avatarCreation.isProcessing ? 'Processing' : 'Pending'}
                        </p>
                        <p className="text-xs text-emerald-600">Kevin's Avatar</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={async () => {
                          try {
                            const avatars = await heygenAPI.getAvatars()
                            setAvailableAvatars(avatars)
                            
                            // Check for new custom avatar
                            const newCustomAvatar = avatars.find((a: any) => 
                              a.avatar_name.toLowerCase().includes('instant') ||
                              a.avatar_name.toLowerCase().includes('my') ||
                              (uploadedVideo.file && a.avatar_name.includes(uploadedVideo.file.name.split('.')[0]))
                            )
                            
                            if (newCustomAvatar && !customAvatarId) {
                              setCustomAvatarId(newCustomAvatar.avatar_id)
                              setSelectedAvatarId(newCustomAvatar.avatar_id)
                              setAvatarCreation(prev => ({
                                ...prev,
                                isProcessing: false,
                                progress: 100,
                                phase: 'Avatar created successfully!'
                              }))
                            }
                          } catch (error) {
                            console.error('Error refreshing avatars:', error)
                          }
                        }}
                        disabled={avatarCreation.isProcessing}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh Avatars
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          if (customAvatarId) {
                            const avatar = availableAvatars.find(a => a.avatar_id === customAvatarId)
                            if (avatar?.preview_video_url) {
                              window.open(avatar.preview_video_url, '_blank')
                            }
                          } else if (uploadedVideo.url) {
                            window.open(uploadedVideo.url, '_blank')
                          } else if (selectedAvatarId) {
                            const avatar = availableAvatars.find(a => a.avatar_id === selectedAvatarId)
                            if (avatar?.preview_video_url) {
                              window.open(avatar.preview_video_url, '_blank')
                            }
                          }
                        }}
                        disabled={!uploadedVideo.url && !customAvatarId && !selectedAvatarId}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview Avatar
                      </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
          )}
        </div>
      </div>

      {/* Floating Avatar Creation Status */}
      {avatarCreation.isProcessing && activeTab !== 'settings' && (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 duration-300">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 rounded-lg shadow-lg max-w-sm">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">Creating Kevin's Avatar (Demo)</p>
                <p className="text-xs opacity-90 truncate">{avatarCreation.phase}</p>
                <div className="w-full bg-blue-400 rounded-full h-1 mt-2">
                  <div 
                    className="h-1 bg-white rounded-full transition-all duration-500" 
                    style={{ width: `${avatarCreation.progress}%` }}
                  ></div>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('settings')}
                className="text-white/80 hover:text-white transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {showToast && (
        <div className="fixed top-4 right-4 z-[100] animate-in slide-in-from-top-2 duration-300">
          <div
            className={`${toastMessage.title.toLowerCase().includes("error") ? "bg-red-600" : "bg-emerald-600"} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3`}
          >
            <div
              className={`w-6 h-6 ${toastMessage.title.toLowerCase().includes("error") ? "bg-red-500" : "bg-emerald-500"} rounded-full flex items-center justify-center`}
            >
              {toastMessage.title.toLowerCase().includes("error") ? (
                <X className="w-4 h-4 text-white" />
              ) : (
                <Check className="w-4 h-4 text-white" />
              )}
            </div>
            <div>
              <p className="font-semibold">{toastMessage.title}</p>
              <p
                className={`text-sm ${toastMessage.title.toLowerCase().includes("error") ? "text-red-100" : "text-emerald-100"}`}
              >
                {toastMessage.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Script Generation Loading Overlay */}
      {isGeneratingScripts && currentStep === "analysis" && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <div className="relative">
                  <Sparkles className="w-8 h-8 text-white animate-pulse" />
                  <div className="absolute inset-0 rounded-full border-2 border-white/50 animate-spin"></div>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {personalData ? 'Creating Personalized Scripts' : 'Generating Your Scripts'}
              </h3>
              <p className="text-slate-600 mb-6">
                {personalData 
                  ? 'Analyzing your social media data to create personalized A-roll and B-roll scripts...'
                  : 'Creating engaging A-roll and B-roll scripts based on market analysis...'
                }
              </p>
              
              {/* Enhanced progress bar */}
              <div className="mb-6">
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden mb-2">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-1000 ease-out animate-pulse" style={{ width: '75%' }}></div>
                </div>
                <p className="text-sm text-slate-500">Processing your content...</p>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center justify-center space-x-3">
                  <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                  <span className="text-slate-700 font-medium">
                    {personalData ? 'LangChain AI Personalizing...' : 'AI Script Generation...'}
                  </span>
                </div>
                {personalData && (
                  <div className="mt-3 flex items-center justify-center space-x-4 text-xs text-slate-500">
                    {personalData.urls?.youtube && (
                      <div className="flex items-center space-x-1">
                        <Video className="w-3 h-3" />
                        <span>YouTube</span>
                      </div>
                    )}
                    {personalData.urls?.linkedin && (
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>LinkedIn</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Generation Loading Modal */}
      {showGenerationModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 p-8">
            <div className="text-center">
              {/* Header */}
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Video className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Generating Your Video
              </h3>
              <p className="text-slate-600 mb-8">
                Creating your AI-powered video with captions
              </p>
              
              {/* Loading Stages */}
              <div className="space-y-4 mb-8">
                {generationStages.map((stage, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    {/* Stage Icon */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                      stage.completed 
                        ? 'bg-emerald-500 text-white' 
                        : stage.active 
                          ? 'bg-indigo-500 text-white animate-pulse' 
                          : 'bg-slate-200 text-slate-400'
                    }`}>
                      {stage.completed ? (
                        <Check className="w-4 h-4" />
                      ) : stage.active ? (
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-current" />
                      )}
                    </div>
                    
                    {/* Stage Text */}
                    <div className="flex-1 text-left">
                      <p className={`text-sm font-medium transition-all duration-300 ${
                        stage.completed 
                          ? 'text-emerald-600' 
                          : stage.active 
                            ? 'text-indigo-600' 
                            : 'text-slate-400'
                      }`}>
                        {stage.name}
                      </p>
                    </div>
                    
                    {/* Status Indicator */}
                    <div className="flex-shrink-0">
                      {stage.completed && (
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                      )}
                      {stage.active && (
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${(generationStages.filter(s => s.completed).length / generationStages.length) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {generationStages.filter(s => s.completed).length} of {generationStages.length} stages complete
                </p>
              </div>
              
              {/* Footer Message */}
              <div className="bg-indigo-50 rounded-xl p-4">
                <p className="text-sm text-indigo-700">
                  This may take a few moments. Please don't close this window.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
