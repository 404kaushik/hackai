// Browser-only video composition using FFmpeg.js
// This file should only be used in client-side components

export interface VideoSegment {
  type: 'avatar' | 'broll' | 'image'
  source: string
  startTime: number
  duration: number
  endTime: number
  description?: string
  position?: 'full' | 'pip' | 'split'
  transition?: 'fade' | 'slide' | 'cut'
}

export interface CompositionSettings {
  width: number
  height: number
  fps: number
  format: 'mp4' | 'webm'
  quality: 'high' | 'medium' | 'low'
}

export interface MediaItem {
  id: string
  url: string
  thumbnail: string
  type: 'video' | 'image'
  duration?: number
  title?: string
  source: 'pexels' | 'unsplash' | 'user_upload'
}

export interface BrollSegment {
  timeRange: string
  startTime: number
  endTime: number
  description: string
}

// Simple parser functions for client-side use
export function parseScriptTimeline(aRollScript: string, bRollScript: string) {
  const brollSegments = parseBrollSegments(bRollScript)
  
  return {
    totalDuration: Math.max(...brollSegments.map(s => s.endTime), 60),
    brollSegments,
    aRollScript
  }
}

export function parseBrollSegments(brollScript: string): BrollSegment[] {
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
    const description = line.replace(timeMatch[0], '').trim()
    
    segments.push({
      timeRange,
      startTime,
      endTime,
      description
    })
  }
  
  return segments
}

export function createComposition(
  timeline: any,
  avatarVideoUrl: string,
  selectedMedia: {[timeRange: string]: MediaItem}
): VideoSegment[] {
  const segments: VideoSegment[] = []
  
  // Add avatar video as base layer
  segments.push({
    type: 'avatar',
    source: avatarVideoUrl,
    startTime: 0,
    duration: timeline.totalDuration,
    endTime: timeline.totalDuration,
    position: 'full'
  })
  
  // Add B-roll segments as overlays
  timeline.brollSegments.forEach((segment: BrollSegment) => {
    const mediaItem = selectedMedia[segment.timeRange]
    if (mediaItem) {
      segments.push({
        type: mediaItem.type === 'video' ? 'broll' : 'image',
        source: mediaItem.url,
        startTime: segment.startTime,
        duration: segment.endTime - segment.startTime,
        endTime: segment.endTime,
        description: segment.description,
        position: 'pip' // Picture-in-picture by default
      })
    }
  })
  
  return segments
}

// Browser-only video composition class
export class VideoComposer {
  private initialized = false

  async initialize() {
    // Check if we're in browser environment
    if (typeof window === 'undefined') {
      throw new Error('VideoComposer can only be used in browser environment')
    }
    
    this.initialized = true
    return true
  }

  parseScriptTimeline(aRollScript: string, bRollScript: string) {
    return parseScriptTimeline(aRollScript, bRollScript)
  }

  createComposition(timeline: any, avatarVideoUrl: string, selectedMedia: {[timeRange: string]: MediaItem}) {
    return createComposition(timeline, avatarVideoUrl, selectedMedia)
  }

  // Note: Actual video composition would require FFmpeg.js
  // For now, this is a placeholder for client-side composition
  async composeVideo(segments: VideoSegment[], settings: CompositionSettings, onProgress?: (progress: number, stage: string) => void) {
    if (!this.initialized) {
      await this.initialize()
    }

    throw new Error('Client-side video composition not yet implemented. Use server-side API instead.')
  }
}

// Export singleton instance
export const videoComposer = new VideoComposer() 