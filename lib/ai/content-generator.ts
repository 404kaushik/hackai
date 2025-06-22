import OpenAI from 'openai'
import { scrapeYouTubeChannel, scrapeLinkedInProfile } from './scrapers'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface VideoGenerationInput {
  idea: string
  linkedinUrl?: string
  youtubeUrl?: string
}

export interface VideoGenerationOutput {
  aRollScript: string
  bRollScript: string
  marketAnalysis: any
  personalizedContent?: {
    isPersonalized: boolean
    personalizationNotes?: string
    profileSummary?: any
  }
  trendingTopics?: any[]
}

export class ContentGenerator {
  async generateVideoContent(input: VideoGenerationInput): Promise<VideoGenerationOutput> {
    try {
      // Step 1: Scrape profiles if provided
      let profileData = null
      if (input.linkedinUrl || input.youtubeUrl) {
        profileData = await this.scrapeProfiles(input.linkedinUrl, input.youtubeUrl)
      }

      // Step 2: Generate market analysis
      const marketAnalysis = await this.generateMarketAnalysis(input.idea)

      // Step 3: Generate personalized scripts
      const scripts = await this.generateScripts(input.idea, profileData, marketAnalysis)

      return {
        aRollScript: scripts.aRoll,
        bRollScript: scripts.bRoll,
        marketAnalysis: marketAnalysis,
        personalizedContent: profileData ? {
          isPersonalized: true,
          personalizationNotes: scripts.personalizationNotes || undefined,
          profileSummary: profileData
        } : {
          isPersonalized: false
        }
      }

    } catch (error: any) {
      console.error("Content generation error:", error)
      throw new Error(`Failed to generate content: ${error.message}`)
    }
  }

  private async scrapeProfiles(linkedinUrl?: string, youtubeUrl?: string) {
    const results: any = {
      urls: { linkedin: linkedinUrl, youtube: youtubeUrl },
      linkedin: null,
      youtube: null,
    }

    if (linkedinUrl) {
      try {
        results.linkedin = await scrapeLinkedInProfile(linkedinUrl)
      } catch (error) {
        console.error("LinkedIn scraping error:", error)
        results.linkedin = { error: "Failed to fetch LinkedIn data" }
      }
    }

    if (youtubeUrl) {
      try {
        results.youtube = await scrapeYouTubeChannel(youtubeUrl)
      } catch (error) {
        console.error("YouTube scraping error:", error)
        results.youtube = { error: "Failed to fetch YouTube data" }
      }
    }

    return results
  }

  private async generateMarketAnalysis(idea: string) {
    const prompt = `
Analyze the market potential for this video idea: "${idea}"

Return ONLY a valid JSON object (no markdown, no extra text) with this exact structure:
{
  "marketSummary": {
    "trend": "Growing",
    "audienceSize": "Large", 
    "competitionLevel": "Medium",
    "viralPotential": "High"
  },
  "audience": {
    "primaryDemographic": "Tech-savvy professionals aged 25-40",
    "platforms": ["YouTube", "TikTok", "Instagram"],
    "interests": ["technology", "productivity", "innovation"]
  },
  "competitors": {
    "topCompetitors": ["TechReviewer", "GadgetGuru", "InnovationHub"],
    "competitorStrategies": "Focus on detailed tutorials and product comparisons",
    "differentiationOpportunity": "Create more beginner-friendly content with practical examples"
  },
  "strategy": {
    "contentAngle": "Educational with entertainment value",
    "keyMessages": ["Simplify complex topics", "Provide actionable insights"],
    "callToAction": "Subscribe for more tech tips"
  },
  "opportunities": ["Beginner tutorials", "Comparison content", "Behind-the-scenes"],
  "insights": ["High engagement on how-to content", "Visual learners prefer step-by-step guides"]
}`

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
      })

      const content = response.choices[0]?.message?.content?.trim() || '{}'
      
      // Clean the response - remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      
      try {
        const parsed = JSON.parse(cleanContent)
        return parsed
      } catch (parseError) {
        console.error("JSON parse error:", parseError)
        console.error("Raw content:", content)
        return this.getFallbackAnalysis(idea)
      }
    } catch (error: any) {
      console.error("OpenAI API error:", error)
      return this.getFallbackAnalysis(idea)
    }
  }

  private getFallbackAnalysis(idea: string) {
    return {
      marketSummary: {
        trend: "Growing",
        audienceSize: "Medium",
        competitionLevel: "Medium",
        viralPotential: "Medium"
      },
      audience: {
        primaryDemographic: `General audience interested in ${idea}`,
        platforms: ["YouTube", "TikTok", "Instagram"],
        interests: [idea, "content creation", "trends"]
      },
      competitors: {
        topCompetitors: ["Creator 1", "Creator 2", "Creator 3"],
        competitorStrategies: "Educational content with strong engagement",
        differentiationOpportunity: "Focus on unique perspective and storytelling"
      },
      strategy: {
        contentAngle: "Educational and entertaining",
        keyMessages: ["Provide value", "Engage audience"],
        callToAction: "Like and subscribe"
      },
      opportunities: ["Tutorial content", "Behind-the-scenes", "Q&A sessions"],
      insights: ["Audience prefers visual content", "Consistency drives engagement"]
    }
  }

  private async generateScripts(idea: string, profileData: any, marketAnalysis: any) {
    const profileContext = profileData ? `
PROFILE ANALYSIS:
${JSON.stringify(profileData, null, 2)}

Please personalize the scripts to match this creator's style and voice.
` : ""

    const prompt = `
Create engaging video scripts for: "${idea}"

MARKET CONTEXT:
${JSON.stringify(marketAnalysis, null, 2)}

${profileContext}

Generate two scripts:

1. A-ROLL SCRIPT (What the speaker says):
- Hook in first 3 seconds
- Clear, engaging narrative
- ${profileData ? 'Match the creator\'s established tone and style' : 'Professional but conversational tone'}
- Include trending keywords naturally
- Strong call-to-action
- 20-30 seconds of content
- IMPORTANT: Write only the spoken dialogue - NO presenter labels, timestamps, or asterisk formatting

2. B-ROLL SCRIPT (Visual directions with timestamps):
Format: [MM:SS-MM:SS] Visual description
- Specific visual cues synchronized with speech
- Text overlays and graphics
- Transitions and effects
- Platform-optimized elements

${profileData ? `
3. PERSONALIZATION NOTES:
Explain how the scripts were customized based on the creator's profile.
` : ''}

Make it engaging and optimized for viral potential.

CRITICAL: The A-roll script should contain ONLY the spoken words without any labels, timestamps, or formatting. The voice agent will speak this directly.`

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const content = response.choices[0]?.message?.content || ""

    // Parse the response - look for both asterisk and non-asterisk patterns
    const aRollMatch = content.match(/(?:\*\*)?A-ROLL SCRIPT(?:\*\*)?:?([\s\S]*?)(?=(?:\*\*)?B-ROLL SCRIPT(?:\*\*)?|$)/i)
    const bRollMatch = content.match(/(?:\*\*)?B-ROLL SCRIPT(?:\*\*)?:?([\s\S]*?)(?=(?:\*\*)?PERSONALIZATION NOTES(?:\*\*)?|$)/i)
    const notesMatch = content.match(/(?:\*\*)?PERSONALIZATION NOTES(?:\*\*)?:?([\s\S]*?)$/i)

    return {
      aRoll: aRollMatch?.[1]?.trim() || "Script generation failed - please try again",
      bRoll: bRollMatch?.[1]?.trim() || "[00:00-00:30] Visual content to match the A-roll script",
      personalizationNotes: notesMatch?.[1]?.trim() || null
    }
  }
}

export const contentGenerator = new ContentGenerator() 