import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Timeout wrapper for operations
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
    )
  ])
}

// Helper function to extract scripts from non-JSON responses
const extractScriptsFromText = (content: string) => {
  const lines = content.split('\n').filter(line => line.trim())
  
  // Try to find JSON in the response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.aRollScript && parsed.bRollScript) {
        return { aRollScript: parsed.aRollScript, bRollScript: parsed.bRollScript };
      }
    } catch (e) {
      // Continue to text parsing
    }
  }

  // Look for A-Roll and B-Roll sections
  let aRollScript = '';
  let bRollScript = '';
  let currentSection = '';
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    if (lowerLine.includes('a-roll') || lowerLine.includes('aroll') || lowerLine.includes('spoken content')) {
      currentSection = 'aroll';
      continue;
    }
    if (lowerLine.includes('b-roll') || lowerLine.includes('broll') || lowerLine.includes('visual') || lowerLine.includes('directions')) {
      currentSection = 'broll';
      continue;
    }
    
    if (currentSection === 'aroll' && !lowerLine.includes('script') && line.trim().length > 10) {
      aRollScript += line + '\n';
    }
    if (currentSection === 'broll' && !lowerLine.includes('script') && line.trim().length > 10) {
      bRollScript += line + '\n';
    }
  }

  // If sections are found, return them
  if (aRollScript.trim() && bRollScript.trim()) {
    return { 
      aRollScript: aRollScript.trim(), 
      bRollScript: bRollScript.trim() 
    };
  }

  // Last resort: split content in half
  const midpoint = Math.floor(lines.length / 2);
  return {
    aRollScript: lines.slice(0, midpoint).join('\n').trim() || 'Generated A-roll content',
    bRollScript: lines.slice(midpoint).join('\n').trim() || 'Generated B-roll content'
  };
}

export async function POST(req: NextRequest) {
  try {
    const { idea, analysis, personalData, regenerate = false } = await req.json()

    if (!idea) {
      return NextResponse.json(
        { error: 'Content idea is required' },
        { status: 400 }
      )
    }

    let aRollScript = ''
    let bRollScript = ''
    let personalizationLevel = 'basic'
    let usePersonalizedContent = false

    // Check if we have pre-generated personalized content (from LangChain agents)
    if (personalData && personalData.personalizedContent && !regenerate) {
      const personalizedContent = personalData.personalizedContent
      if (personalizedContent.aRollScript && personalizedContent.bRollScript) {
        aRollScript = personalizedContent.aRollScript
        bRollScript = personalizedContent.bRollScript
        personalizationLevel = 'langchain_personalized'
        usePersonalizedContent = true
      }
    }

    // If we don't have personalized content or need to regenerate, use OpenAI
    if (!usePersonalizedContent) {
      const systemPrompt = `You are a professional content creator specializing in viral short-form videos. Create engaging A-roll and B-roll scripts that are optimized for social media platforms like TikTok, Instagram Reels, and YouTube Shorts.

IMPORTANT: Always respond with valid JSON in this exact format:
{
  "aRollScript": "Your complete spoken content script here...",
  "bRollScript": "Your detailed visual directions here..."
}

A-roll script should be:
- Direct, engaging spoken content ONLY
- Hook within first 3 seconds  
- Clear value proposition
- Natural, conversational tone
- 20-30 seconds when spoken
- Include natural pauses and emphasis
- NO presenter labels, timestamps, or asterisk formatting
- Write as if speaking directly to the audience

B-roll script should be:
- Specific visual directions
- Shot descriptions and transitions
- Text overlays and graphics
- Timing cues
- Visual hooks and attention-grabbers
- Platform optimization notes

CRITICAL: The A-roll script must contain ONLY the spoken words without any labels, timestamps, or formatting. The voice agent will speak this content directly.`

      let userPrompt = `Create A-roll and B-roll scripts for: "${idea}"`

      // Add personalization context if available
      if (personalData) {
        userPrompt += `\n\nPersonalization Context:`
        if (personalData.urls?.youtube) {
          userPrompt += `\n- YouTube creator with established audience`
        }
        if (personalData.urls?.linkedin) {
          userPrompt += `\n- Professional LinkedIn presence`
        }
        if (personalData.personalizedContent?.personalizationNotes) {
          userPrompt += `\n- Previous analysis: ${personalData.personalizedContent.personalizationNotes}`
        }
        personalizationLevel = 'enhanced'
      }

      // Add market analysis context
      if (analysis) {
        userPrompt += `\n\nMarket Analysis Context:`
        if (analysis.marketSummary) {
          userPrompt += `\n- Target Audience: ${analysis.audience || 'General'}`
          userPrompt += `\n- Viral Potential: ${analysis.marketSummary.viralPotential || 'Medium'}`
          userPrompt += `\n- Competition Level: ${analysis.marketSummary.competitionLevel || 'Medium'}`
        }
      }

      userPrompt += `\n\nIMPORTANT: Respond ONLY with valid JSON in the format specified above. Do not include any other text or explanations.`

      console.log('Generating scripts with OpenAI...')

      // Generate with timeout
      const completion = await withTimeout(
        openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
        15000 // 15 second timeout
      )

      const content = completion.choices[0]?.message?.content
      console.log('OpenAI Response:', content?.substring(0, 200) + '...')

      if (!content) {
        throw new Error('No content generated from OpenAI')
      }

      // Try to parse as JSON first
      try {
        const result = JSON.parse(content)
        if (result.aRollScript && result.bRollScript) {
          aRollScript = result.aRollScript
          bRollScript = result.bRollScript
        } else {
          throw new Error('Missing required script properties')
        }
      } catch (parseError) {
        console.log('JSON parsing failed, attempting text extraction...')
        
        // Try to extract scripts from text format
        const extracted = extractScriptsFromText(content)
        
        if (!extracted.aRollScript || !extracted.bRollScript) {
          console.error('Failed to extract scripts from content:', content)
          throw new Error('Unable to extract valid scripts from AI response')
        }
        
        aRollScript = extracted.aRollScript
        bRollScript = extracted.bRollScript
        console.log('Successfully extracted scripts from text format')
      }
    }

    // Validate final scripts
    if (!aRollScript.trim() || !bRollScript.trim()) {
      throw new Error('Generated scripts are empty or invalid')
    }

    console.log('Scripts generated successfully')

    return NextResponse.json({
      aRollScript,
      bRollScript,
      personalizationLevel,
      isPersonalized: personalizationLevel === 'langchain_personalized',
      usedPersonalizedContent: usePersonalizedContent,
      generatedAt: new Date().toISOString(),
      personalDataUsed: !!personalData
    })

  } catch (error: any) {
    console.error('Script generation error:', error)
    
    // Return proper error without fallback
    let errorMessage = 'Failed to generate scripts'
    
    if (error.message.includes('timed out')) {
      errorMessage = 'Script generation timed out. Please try again.'
    } else if (error.message.includes('No content generated')) {
      errorMessage = 'AI failed to generate content. Please try again.'
    } else if (error.message.includes('Unable to extract')) {
      errorMessage = 'AI generated malformed response. Please try again.'
    } else if (error.message.includes('empty or invalid')) {
      errorMessage = 'Generated scripts were incomplete. Please try again.'
    } else if (error.message === 'Content idea is required') {
      errorMessage = 'Content idea is required'
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
