"use client"

import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Play, 
  Video, 
  User, 
  Download,
  Loader2,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import { MediaSelector, MediaItem, BrollSegment } from './media-selector'
import { CompositionPreview } from './composition-preview'
import { videoComposer, VideoSegment } from '@/lib/video-composer'

export const DynamicMediaDemo: React.FC = () => {
  // Demo data - your B-roll script with timestamps
  const demoArollScript = `Welcome to our revolutionary AI platform that's changing how creators make content. In just minutes, you can transform a simple idea into a professional-quality video that engages your audience and drives results.`

  const demoBrollScript = `[0:00-0:03] B-ROLL: Close-up shot of hands typing code on a laptop, showing development in progress
[0:03-0:06] B-ROLL: Wide shot of a modern startup office with team members collaborating
[0:06-0:09] B-ROLL: Screen recording of the AI platform interface with user interactions
[0:09-0:12] B-ROLL: Montage of different social media platforms showing viral content
[0:12-0:15] B-ROLL: Split screen of before/after content creation results`

  // State management
  const [selectedMedia, setSelectedMedia] = useState<{[timeRange: string]: MediaItem}>({})
  const [compositionSegments, setCompositionSegments] = useState<VideoSegment[]>([])
  const [isComposing, setIsComposing] = useState(false)
  const [compositionProgress, setCompositionProgress] = useState(0)
  const [compositionStage, setCompositionStage] = useState('')
  const [currentStep, setCurrentStep] = useState<'script' | 'media' | 'preview' | 'compose'>('script')

  // Mock avatar video URL (replace with actual HeyGen video)
  const mockAvatarVideoUrl = "/HackAI Demo.mp4"

  // Parse B-roll script into segments
  const parseBrollSegments = useCallback((brollScript: string): BrollSegment[] => {
    const lines = brollScript.split('\n').filter(line => line.trim())
    const segments: BrollSegment[] = []
    
    for (const line of lines) {
      const timeMatch = line.match(/\[(\d+):(\d+)-(\d+):(\d+)\]/)
      if (!timeMatch) continue
      
      const startMinutes = parseInt(timeMatch[1])
      const startSeconds = parseInt(timeMatch[2])
      const endMinutes = parseInt(timeMatch[3])
      const endSeconds = parseInt(timeMatch[4])
      
      const startTime = startMinutes * 60 + startSeconds
      const endTime = endMinutes * 60 + endSeconds
      
      const timeRange = `${timeMatch[1]}:${timeMatch[2]}-${timeMatch[3]}:${timeMatch[4]}`
      
      segments.push({
        timeRange,
        startTime,
        endTime,
        duration: endTime - startTime,
        description: line.replace(/\[\d+:\d+-\d+:\d+\]/, '').replace(/B-ROLL[:\s]*/gi, '').trim(),
        selectedMedia: selectedMedia[timeRange]
      })
    }
    
    return segments
  }, [selectedMedia])

  // Media selection handlers
  const handleMediaSelect = (timeRange: string, media: MediaItem) => {
    setSelectedMedia(prev => ({
      ...prev,
      [timeRange]: media
    }))
  }

  const handleMediaRemove = (timeRange: string) => {
    setSelectedMedia(prev => {
      const updated = { ...prev }
      delete updated[timeRange]
      return updated
    })
  }

  // Generate composition preview
  const handleGeneratePreview = async () => {
    try {
      const timeline = videoComposer.parseScriptTimeline(demoArollScript, demoBrollScript)
      const composition = videoComposer.createComposition(timeline, mockAvatarVideoUrl, selectedMedia)
      setCompositionSegments(composition)
      setCurrentStep('preview')
    } catch (error) {
      console.error('Preview generation failed:', error)
      alert('Failed to generate preview')
    }
  }

  // Start video composition
  const handleStartComposition = async () => {
    setIsComposing(true)
    setCompositionProgress(0)
    setCompositionStage('Initializing composition...')
    setCurrentStep('compose')

    // Simulate composition process
    const stages = [
      'Preparing video assets...',
      'Creating video timeline...',
      'Processing avatar segments...',
      'Integrating B-roll footage...',
      'Rendering final video...',
      'Optimizing for social media...',
      'Composition complete!'
    ]

    for (let i = 0; i < stages.length; i++) {
      setCompositionStage(stages[i])
      setCompositionProgress(((i + 1) / stages.length) * 100)
      await new Promise(resolve => setTimeout(resolve, 1500))
    }

    setIsComposing(false)
    alert('🎉 Video composition complete! In a real implementation, this would download your composed video.')
  }

  const getStepStatus = (step: string) => {
    const steps = ['script', 'media', 'preview', 'compose']
    const currentIndex = steps.indexOf(currentStep)
    const stepIndex = steps.indexOf(step)
    
    if (stepIndex < currentIndex) return 'complete'
    if (stepIndex === currentIndex) return 'active'
    return 'pending'
  }

  const brollSegments = parseBrollSegments(demoBrollScript)
  const hasAllMedia = brollSegments.every(segment => segment.selectedMedia)

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold">Dynamic Media Integration Demo</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          This demo shows how users can dynamically select videos and images for each B-roll segment in their AI-generated reels.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {[
          { id: 'script', label: 'Script Review', icon: User },
          { id: 'media', label: 'Select Media', icon: Video },
          { id: 'preview', label: 'Preview', icon: Play },
          { id: 'compose', label: 'Compose', icon: Download }
        ].map((step, index) => {
          const Icon = step.icon
          const status = getStepStatus(step.id)
          
          return (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                status === 'complete' ? 'bg-green-100 text-green-700' :
                status === 'active' ? 'bg-blue-100 text-blue-700' :
                'bg-gray-100 text-gray-500'
              }`}>
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{step.label}</span>
              </div>
              {index < 3 && (
                <ArrowRight className="w-4 h-4 text-gray-400 mx-2" />
              )}
            </div>
          )
        })}
      </div>

      {/* Step 1: Script Review */}
      {currentStep === 'script' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Step 1: Review Your Scripts</h2>
            <p className="text-gray-600">AI-generated A-roll and B-roll scripts with timestamps</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  A-Roll Script (Avatar Speech)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm leading-relaxed">{demoArollScript}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-green-600" />
                  B-Roll Script (Visual Elements)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 p-4 rounded-lg">
                  <pre className="text-xs leading-relaxed whitespace-pre-wrap">{demoBrollScript}</pre>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button
              onClick={() => setCurrentStep('media')}
              className="bg-gradient-to-r from-purple-600 to-blue-600"
            >
              Continue to Media Selection
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Media Selection */}
      {currentStep === 'media' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Step 2: Select Dynamic Media</h2>
            <p className="text-gray-600">Choose videos or images for each B-roll segment</p>
          </div>

          <MediaSelector
            segments={brollSegments}
            onMediaSelect={handleMediaSelect}
            onMediaRemove={handleMediaRemove}
          />

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep('script')}
            >
              Back to Scripts
            </Button>
            
            <Button
              onClick={handleGeneratePreview}
              disabled={!hasAllMedia}
              className="bg-gradient-to-r from-green-600 to-blue-600"
            >
              {hasAllMedia ? 'Generate Preview' : `Select Media (${Object.keys(selectedMedia).length}/${brollSegments.length})`}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Composition Preview */}
      {currentStep === 'preview' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Step 3: Preview Your Composition</h2>
            <p className="text-gray-600">See how your avatar and B-roll will work together</p>
          </div>

          <CompositionPreview
            segments={compositionSegments}
            totalDuration={Math.max(...compositionSegments.map(s => s.endTime))}
            avatarVideoUrl={mockAvatarVideoUrl}
            onStartComposition={handleStartComposition}
          />

          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => setCurrentStep('media')}
            >
              Back to Media Selection
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Video Composition */}
      {currentStep === 'compose' && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Step 4: Composing Your Video</h2>
            <p className="text-gray-600">Merging avatar video with your selected B-roll content</p>
          </div>

          <Card className="max-w-md mx-auto">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                {isComposing ? (
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                ) : (
                  <Video className="w-5 h-5 text-green-600" />
                )}
                <span className="font-medium">
                  {isComposing ? 'Processing...' : 'Composition Complete!'}
                </span>
              </div>
              
              <Progress value={compositionProgress} className="h-2" />
              
              <div className="text-sm text-gray-600 text-center">
                {compositionStage}
              </div>

              {!isComposing && compositionProgress === 100 && (
                <div className="space-y-4">
                  <div className="text-center text-green-600 font-medium">
                    🎉 Your video is ready!
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                      onClick={() => alert('Download would start here!')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setCurrentStep('script')
                        setCompositionProgress(0)
                        setCompositionStage('')
                        setSelectedMedia({})
                        setCompositionSegments([])
                      }}
                    >
                      Start Over
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Features Overview */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">✨ Key Features</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="text-center space-y-2">
              <Video className="w-8 h-8 mx-auto text-purple-600" />
              <div className="font-medium">Dynamic Media Selection</div>
              <div className="text-gray-600">Choose videos/images for each B-roll segment</div>
            </div>
            <div className="text-center space-y-2">
              <Play className="w-8 h-8 mx-auto text-blue-600" />
              <div className="font-medium">Real-time Preview</div>
              <div className="text-gray-600">See composition before final rendering</div>
            </div>
            <div className="text-center space-y-2">
              <Download className="w-8 h-8 mx-auto text-green-600" />
              <div className="font-medium">Professional Output</div>
              <div className="text-gray-600">High-quality video composition</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 