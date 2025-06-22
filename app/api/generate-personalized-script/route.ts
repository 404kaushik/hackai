import { NextRequest, NextResponse } from 'next/server'
import { PersonalizationAgent } from '@/lib/langchain-agents'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { idea, personalData, analysis } = await req.json()

    if (!idea) {
      return NextResponse.json(
        { error: 'Content idea is required' },
        { status: 400 }
      )
    }

    let aRollScript = ''
    let bRollScript = ''
    let personalizationLevel = 'basic'

    if (personalData && personalData.personalizedContent) {
      // Use the already generated personalized content
      const content = personalData.personalizedContent
      aRollScript = content.aRollScript || ''
      bRollScript = content.bRollScript || ''
      personalizationLevel = 'advanced'
    } else if (personalData && (personalData.urls?.youtube || personalData.urls?.linkedin)) {
      // Generate new personalized scripts using the agent
      try {
        const agent = new PersonalizationAgent()
        const result = await agent.personalizeContent(
          idea,
          personalData.urls?.youtube,
          personalData.urls?.linkedin
        )

        const parsed = JSON.parse(result)
        aRollScript = parsed.aRollScript || ''
        bRollScript = parsed.bRollScript || ''
        personalizationLevel = 'advanced'
      } catch (agentError) {
        console.error('Agent error, falling back to OpenAI:', agentError)
        personalizationLevel = 'enhanced'
      }
    }

    // Fallback to standard OpenAI generation if no personalization available
    if (!aRollScript && !bRollScript) {
      const prompt = `
Create A-roll and B-roll scripts for: "${idea}"

${analysis ? `Market Analysis: ${JSON.stringify(analysis, null, 2)}` : ''}
${personalData ? `Personal Context: ${JSON.stringify(personalData, null, 2)}` : ''}

Return as JSON with aRollScript and bRollScript keys.
`

      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a professional content script writer. Create engaging A-roll and B-roll scripts."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      })

      const result = JSON.parse(completion.choices[0]?.message?.content || '{}')
      aRollScript = result.aRollScript || 'Generated A-roll script'
      bRollScript = result.bRollScript || 'Generated B-roll directions'
    }

    return NextResponse.json({
      aRollScript,
      bRollScript,
      personalizationLevel,
      generatedAt: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('Script generation error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate scripts' },
      { status: 500 }
    )
  }
} 