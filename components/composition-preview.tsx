"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Maximize2,
  Download,
  Clock,
  User,
  Image as ImageIcon,
  Video,
  Loader2
} from 'lucide-react'
import { cn } from "@/lib/utils"
import { VideoSegment } from "@/lib/video-composer"

interface CompositionPreviewProps {
  segments: VideoSegment[]
  totalDuration: number
  avatarVideoUrl: string
  isProcessing?: boolean
  processingProgress?: number
  processingStage?: string
  onStartComposition?: () => void
  onDownload?: (blob: Blob) => void
  className?: string
}

export const CompositionPreview: React.FC<CompositionPreviewProps> = ({
  segments,
  totalDuration,
  avatarVideoUrl,
  isProcessing = false,
  processingProgress = 0,
  processingStage = '',
  onStartComposition,
  onDownload,
  className
}) => {
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [previewScale, setPreviewScale] = useState(1)
  const timelineRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Calculate timeline segments for visualization
  const timelineSegments = segments.map(segment => ({
    ...segment,
    widthPercentage: (segment.duration / totalDuration) * 100,
    leftPercentage: (segment.startTime / totalDuration) * 100
  }))

  // Get current playing segment
  const currentSegment = segments.find(
    segment => currentTime >= segment.startTime && currentTime < segment.endTime
  )

  // Start/stop playback simulation
  useEffect(() => {
    if (isPlaying && !isProcessing) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + 0.1
          if (next >= totalDuration) {
            setIsPlaying(false)
            return 0
          }
          return next
        })
      }, 100)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, totalDuration, isProcessing])

  const handlePlayPause = () => {
    if (isProcessing) return
    setIsPlaying(!isPlaying)
  }

  const handleStop = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || isProcessing) return
    
    const rect = timelineRef.current.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width
    const newTime = percentage * totalDuration
    
    setCurrentTime(Math.max(0, Math.min(newTime, totalDuration)))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getSegmentColor = (segment: VideoSegment) => {
    switch (segment.type) {
      case 'avatar':
        return 'bg-blue-500'
      case 'broll':
        return 'bg-green-500'
      case 'image':
        return 'bg-purple-500'
      default:
        return 'bg-gray-500'
    }
  }

  const hasAllMedia = segments.every(segment => 
    segment.type === 'avatar' || segment.source
  )

  return (
    <div className={cn("space-y-6", className)}>
      {/* Preview Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Composition Preview</h3>
          <p className="text-sm text-gray-600">
            Duration: {formatTime(totalDuration)} • {segments.length} segments
          </p>
        </div>
        
        {!isProcessing && hasAllMedia && onStartComposition && (
          <Button onClick={onStartComposition} className="bg-gradient-to-r from-purple-600 to-blue-600">
            <Video className="w-4 h-4 mr-2" />
            Generate Final Video
          </Button>
        )}
      </div>

      {/* Video Preview Area */}
      <Card className="relative">
        <CardContent className="p-6">
          <div className="aspect-[9/16] max-w-sm mx-auto bg-black rounded-lg overflow-hidden relative">
            {/* Mock Phone Frame */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black">
              {/* Preview Content */}
              <div className="absolute inset-4 bg-gray-800 rounded-lg overflow-hidden">
                {currentSegment ? (
                  <div className="w-full h-full flex items-center justify-center relative">
                    {/* Avatar Background */}
                    {currentSegment.type === 'avatar' && (
                      <div className="absolute inset-0 bg-gradient-to-b from-blue-600 to-blue-800 opacity-20" />
                    )}
                    
                    {/* Media Preview */}
                    {currentSegment.source && currentSegment.type !== 'avatar' ? (
                      <img
                        src={currentSegment.source}
                        alt="B-roll preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-white text-center">
                        {currentSegment.type === 'avatar' ? (
                          <div className="space-y-2">
                            <User className="w-8 h-8 mx-auto" />
                            <p className="text-sm">Avatar Speaking</p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <ImageIcon className="w-8 h-8 mx-auto" />
                            <p className="text-sm">B-roll Content</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Segment Info Overlay */}
                    <div className="absolute top-2 left-2">
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "text-xs",
                          currentSegment.type === 'avatar' ? 'bg-blue-600' : 'bg-green-600'
                        )}
                      >
                        {currentSegment.type === 'avatar' ? 'Avatar' : 'B-roll'}
                      </Badge>
                    </div>

                    {/* Time Display */}
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 rounded px-2 py-1">
                      <span className="text-white text-xs">
                        {formatTime(currentTime)} / {formatTime(totalDuration)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center space-y-2">
                      <Square className="w-8 h-8 mx-auto" />
                      <p className="text-sm">Preview Ready</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="mt-4 space-y-4">
            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleStop}
                disabled={isProcessing}
              >
                <Square className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handlePlayPause}
                disabled={isProcessing}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMuted(!isMuted)}
                disabled={isProcessing}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              <div
                ref={timelineRef}
                className="relative h-12 bg-gray-100 rounded-lg cursor-pointer overflow-hidden"
                onClick={handleTimelineClick}
              >
                {/* Timeline Segments */}
                {timelineSegments.map((segment, index) => (
                  <div
                    key={index}
                    className={cn(
                      "absolute top-0 h-full border-r border-white/20",
                      getSegmentColor(segment),
                      !segment.source && segment.type !== 'avatar' && 'opacity-30 border-dashed border-gray-400'
                    )}
                    style={{
                      left: `${segment.leftPercentage}%`,
                      width: `${segment.widthPercentage}%`
                    }}
                    title={`${segment.type}: ${segment.description}`}
                  >
                    <div className="p-1 h-full flex items-center">
                      <span className="text-xs text-white font-medium truncate">
                        {segment.type === 'avatar' ? 'A' : segment.type === 'broll' ? 'B' : 'I'}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Playhead */}
                <div
                  className="absolute top-0 w-0.5 h-full bg-red-500 z-10"
                  style={{
                    left: `${(currentTime / totalDuration) * 100}%`
                  }}
                />
              </div>

              {/* Timeline Labels */}
              <div className="flex justify-between text-xs text-gray-500">
                <span>0:00</span>
                <span>{formatTime(totalDuration)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing Status */}
      {isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="font-medium">Generating Video...</span>
              </div>
              
              <Progress value={processingProgress} className="h-2" />
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>{processingStage}</span>
                <span>{Math.round(processingProgress)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Segment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Composition Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {segments.map((segment, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border",
                  currentSegment === segment ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
                )}
              >
                <div className={cn("w-4 h-4 rounded", getSegmentColor(segment))} />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {formatTime(segment.startTime)} - {formatTime(segment.endTime)}
                    </Badge>
                    <span className="text-sm font-medium capitalize">{segment.type}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {segment.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {segment.source || segment.type === 'avatar' ? (
                    <Badge variant="default" className="text-xs bg-green-600">
                      Ready
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs text-orange-600 border-orange-200">
                      No Media
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Warnings */}
      {!hasAllMedia && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-800">
                  Missing Media
                </p>
                <p className="text-sm text-orange-600">
                  Some B-roll segments don't have selected media. Please select videos or images for all segments before generating the final video.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 