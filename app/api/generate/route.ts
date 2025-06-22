import { NextRequest, NextResponse } from 'next/server'
import { contentGenerator, type VideoGenerationInput } from '@/lib/ai/content-generator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const input: VideoGenerationInput = {
      idea: body.idea,
      linkedinUrl: body.linkedinUrl,
      youtubeUrl: body.youtubeUrl
    }

    // Validate input
    if (!input.idea || input.idea.trim().length === 0) {
      return NextResponse.json(
        { error: 'Video idea is required' },
        { status: 400 }
      )
    }

    console.log('Generating video content for:', input.idea)

    // Generate content using simple AI calls
    const result = await contentGenerator.generateVideoContent(input)

    return NextResponse.json({
      success: true,
      ...result
    })

  } catch (error: any) {
    console.error('Video generation error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate video content',
        details: error.message,
        success: false
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Video content generation API',
    endpoints: {
      POST: '/api/generate - Generate video content from idea and optional social profiles'
    }
  })
} 