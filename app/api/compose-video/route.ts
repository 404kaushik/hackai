import { NextRequest, NextResponse } from 'next/server'
import { advancedVideoProcessor, BrollSegment, CompositionSettings } from '@/lib/advanced-video-processor'

export const maxDuration = 60 // Maximum for Vercel Hobby plan

interface MediaItem {
  id: string
  url: string
  thumbnail: string
  type: 'video' | 'image'
  duration?: number
  title?: string
  source: 'pexels' | 'unsplash' | 'user_upload'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      aRollScript, 
      bRollScript, 
      avatarVideoUrl, 
      selectedMedia, 
      settings = { width: 720, height: 1280, fps: 30, format: 'mp4', quality: 'medium' }
    } = body

    console.log('🎬 Starting ADVANCED video composition with timeline overlays...')
    console.log('Avatar video URL:', avatarVideoUrl)
    console.log('Selected media count:', Object.keys(selectedMedia || {}).length)

    if (!aRollScript || !bRollScript || !avatarVideoUrl) {
      return NextResponse.json(
        { error: 'Missing required parameters: aRollScript, bRollScript, avatarVideoUrl' },
        { status: 400 }
      )
    }

    // Parse B-roll segments from script
    const brollSegments = parseBrollSegments(bRollScript, selectedMedia || {})
    console.log('Parsed B-roll segments:', brollSegments.length)
    console.log('Segments with media:', brollSegments.filter(s => s.selectedMedia).length)

    if (brollSegments.filter(s => s.selectedMedia).length === 0) {
      return NextResponse.json(
        { error: 'No B-roll media selected. Please select videos or images for at least one segment.' },
        { status: 400 }
      )
    }

    // Set up Server-Sent Events for real-time progress
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Start advanced video composition with timeline overlays
          const composedVideoUrl = await advancedVideoProcessor.composeVideoWithOverlays(
            avatarVideoUrl,
            brollSegments,
            settings as CompositionSettings,
            (progress) => {
              // Send progress updates via SSE
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                stage: progress.stage,
                progress: progress.progress,
                currentSegment: progress.currentSegment,
                totalSegments: progress.totalSegments
              })}\n\n`))
            }
          )

          // Send completion message
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            stage: 'Complete!',
            progress: 100,
            videoUrl: composedVideoUrl,
            success: true,
            message: 'Advanced video composition with timeline overlays completed successfully!',
            composition: {
              type: 'timeline_overlay',
              avatarVideo: avatarVideoUrl,
              overlaySegments: brollSegments.filter(s => s.selectedMedia).length,
              totalDuration: Math.max(...brollSegments.map(s => s.endTime), 60)
            }
          })}\n\n`))

          controller.close()
        } catch (error) {
          console.error('❌ Advanced video composition failed:', error)
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({
            error: 'Advanced video composition failed',
            message: error instanceof Error ? error.message : 'Unknown error',
            stage: 'Failed'
          })}\n\n`))
          controller.close()
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('❌ Video composition API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

function parseBrollSegments(brollScript: string, selectedMedia: {[timeRange: string]: MediaItem}): BrollSegment[] {
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
    const contentAfterTime = line.replace(timeMatch[0], '').trim()
    
    // Parse the new format: Primary visual | Secondary visual | Text overlay
    const visualElements = contentAfterTime.split('|').map(s => s.trim())
    const primaryVisual = visualElements[0] || ''
    const secondaryVisual = visualElements[1] || ''
    const textOverlay = visualElements[2] || ''
    
    segments.push({
      timeRange,
      startTime,
      endTime,
      description: contentAfterTime,
      primaryVisual,
      secondaryVisual,
      textOverlay,
      selectedMedia: selectedMedia[timeRange] ? [selectedMedia[timeRange]] : undefined,
      visualElements: {
        primary: selectedMedia[timeRange],
        secondary: undefined, // Can be extended to support multiple media selection
        textOverlay
      }
    })
  }
  
  return segments
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// API route complete - now with ADVANCED timeline-based video composition! 