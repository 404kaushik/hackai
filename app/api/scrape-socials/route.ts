import { NextRequest, NextResponse } from 'next/server'
import { PersonalizationAgent } from '@/lib/langchain-agents'

export async function POST(req: NextRequest) {
  try {
    const { youtube, linkedin, contentIdea } = await req.json()

    if (!youtube && !linkedin) {
      return NextResponse.json(
        { error: 'At least one social media URL is required' },
        { status: 400 }
      )
    }

    // Initialize the personalization agent
    const agent = new PersonalizationAgent()

    // Generate personalized analysis
    const personalizedContent = await agent.personalizeContent(
      contentIdea || 'General content creation',
      youtube,
      linkedin
    )

    let parsedContent
    try {
      parsedContent = JSON.parse(personalizedContent)
    } catch (error) {
      parsedContent = {
        aRollScript: personalizedContent,
        bRollScript: 'Generated visual directions',
        personalizationNotes: 'Content analyzed with AI agents'
      }
    }

    return NextResponse.json({
      success: true,
      personalizedContent: parsedContent,
      analyzedAt: new Date().toISOString(),
      urls: { youtube, linkedin },
      dataSource: 'LangChain AI Agents'
    })

  } catch (error: any) {
    console.error('Personalization agent error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate personalized content' },
      { status: 500 }
    )
  }
} 