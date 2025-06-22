import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { idea, timestamp, includeRealTimeData, personalData } = await req.json()

    if (!idea || typeof idea !== 'string') {
      return NextResponse.json(
        { error: 'Content idea is required and must be a string' },
        { status: 400 }
      )
    }

    // Enhanced prompt that includes personal data
    const basePrompt = `
Analyze the following content idea for social media marketing and provide a comprehensive market analysis in VALID JSON format only.

Content Idea: "${idea}"
`

    const personalizedPrompt = personalData ? `
Personal Context:
- User Profile: ${JSON.stringify(personalData.userProfile || {})}
- YouTube Insights: ${JSON.stringify(personalData.youtube || {})}
- LinkedIn Profile: ${JSON.stringify(personalData.linkedin || {})}

Consider this personal context when analyzing market opportunities and audience alignment.
` : ''

    const prompt = basePrompt + personalizedPrompt + `
Please provide analysis in this exact JSON structure:
{
  "marketSummary": {
    "trend": "Growing/Stable/Declining",
    "audienceSize": "Large/Medium/Small", 
    "viralPotential": "High/Medium/Low",
    "competitionLevel": "High/Medium/Low",
    "personalAlignment": "${personalData ? 'High/Medium/Low based on user profile' : 'Not analyzed'}"
  },
  "audience": {
    "primaryDemographic": "Target age group and characteristics",
    "interests": ["interest1", "interest2", "interest3"],
    "platforms": ["platform1", "platform2", "platform3"],
    "behaviorPatterns": "How they consume content"
  },
  "strategy": {
    "contentType": "Best content format for this idea",
    "postingTime": "Optimal posting schedule",
    "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
    "engagementTactics": "How to maximize engagement"
  },
  "opportunities": [
    "Opportunity 1 description",
    "Opportunity 2 description", 
    "Opportunity 3 description"
  ],
  "insights": [
    "Key insight 1",
    "Key insight 2",
    "Key insight 3"
  ],
  "competitors": {
    "topCompetitors": ["Competitor 1", "Competitor 2"],
    "competitorStrategies": "What competitors are doing",
    "differentiationOpportunity": "How to stand out"
  },
  "marketTrends": [
    "Current trend 1",
    "Current trend 2",
    "Emerging trend 1"
  ],
  "riskFactors": [
    "Potential risk 1",
    "Potential risk 2"
  ]
}

IMPORTANT: Return ONLY the JSON object, no additional text or explanation.`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a professional social media marketing analyst. Respond only with valid JSON data as requested. No additional text, explanations, or formatting."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const analysisText = completion.choices[0]?.message?.content?.trim()
    
    if (!analysisText) {
      throw new Error('No response received from OpenAI')
    }

    console.log('Raw OpenAI Response:', analysisText)

    // Clean the response text to ensure it's valid JSON
    let cleanedResponse = analysisText
    
    // Remove any potential markdown code blocks
    cleanedResponse = cleanedResponse.replace(/```json\s*/g, '').replace(/```\s*/g, '')
    
    // Remove any leading/trailing whitespace
    cleanedResponse = cleanedResponse.trim()
    
    // Find the JSON object boundaries
    const jsonStart = cleanedResponse.indexOf('{')
    const jsonEnd = cleanedResponse.lastIndexOf('}')
    
    if (jsonStart === -1 || jsonEnd === -1) {
      throw new Error('No valid JSON object found in response')
    }
    
    cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd + 1)

    let analysisData
    try {
      analysisData = JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError)
      console.error("Cleaned response text:", cleanedResponse)
      
      // Fallback to a structured response if JSON parsing fails
      analysisData = {
        marketSummary: {
          trend: "Growing",
          audienceSize: "Large", 
          viralPotential: "High",
          competitionLevel: "Medium"
        },
        audience: {
          primaryDemographic: "Young adults aged 18-35 interested in the topic",
          interests: ["trending topics", "social media", "entertainment"],
          platforms: ["TikTok", "Instagram", "YouTube"],
          behaviorPatterns: "Highly engaged with short-form video content"
        },
        strategy: {
          contentType: "Short-form video with engaging visuals",
          postingTime: "Peak hours: 6-9 PM weekdays",
          hashtags: ["#trending", "#viral", "#content"],
          engagementTactics: "Use trending sounds, interactive elements, and clear call-to-actions"
        },
        opportunities: [
          "High engagement potential due to current market interest",
          "Opportunity to establish thought leadership in this space", 
          "Potential for viral reach with proper execution"
        ],
        insights: [
          "Content in this category shows strong performance metrics",
          "Audience is highly receptive to authentic, relatable content",
          "Visual storytelling is key to success in this market"
        ],
        competitors: {
          topCompetitors: ["Major content creators in this niche"],
          competitorStrategies: "Focus on trending topics with personal perspectives",
          differentiationOpportunity: "Unique angle or personal experience"
        },
        marketTrends: [
          "Increasing demand for authentic content",
          "Short-form video continues to dominate",
          "Interactive content gaining traction"
        ],
        riskFactors: [
          "High competition in popular content categories",
          "Algorithm changes may affect reach"
        ],
        analysisNote: "This is a fallback analysis due to parsing issues. Please try again for more specific insights."
      }
    }

    // Validate that we have the expected structure
    if (!analysisData || typeof analysisData !== 'object') {
      throw new Error('Invalid analysis data structure')
    }

    // Add timestamp for cache control
    analysisData.timestamp = timestamp || Date.now()
    analysisData.generatedAt = new Date().toISOString()

    return NextResponse.json(analysisData)

  } catch (error: any) {
    console.error('Market analysis error:', error)
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate market analysis',
        timestamp: Date.now(),
        fallback: true
      },
      { status: 500 }
    )
  }
}

