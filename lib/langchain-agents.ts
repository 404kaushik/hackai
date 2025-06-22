import { ChatOpenAI } from "@langchain/openai"
import { DynamicTool } from "@langchain/core/tools"
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts"
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents"

// Helper functions for URL analysis
function extractChannelInfo(url: string) {
  try {
    const urlObj = new URL(url)
    let channelHandle = ''
    let channelId = ''
    
    if (url.includes('/@')) {
      channelHandle = url.split('/@')[1].split('?')[0].split('/')[0]
    } else if (url.includes('/channel/')) {
      channelId = url.split('/channel/')[1].split('?')[0].split('/')[0]
    } else if (url.includes('/c/')) {
      channelHandle = url.split('/c/')[1].split('?')[0].split('/')[0]
    } else if (url.includes('/user/')) {
      channelHandle = url.split('/user/')[1].split('?')[0].split('/')[0]
    }
    
    return {
      domain: urlObj.hostname,
      channelHandle,
      channelId,
      platform: 'YouTube'
    }
  } catch (error) {
    return { error: 'Invalid URL format' }
  }
}

function extractLinkedInInfo(url: string) {
  try {
    const urlObj = new URL(url)
    let profileId = ''
    
    if (url.includes('/in/')) {
      profileId = url.split('/in/')[1].split('?')[0].split('/')[0]
    } else if (url.includes('/pub/')) {
      profileId = url.split('/pub/')[1].split('?')[0].split('/')[0]
    }
    
    return {
      domain: urlObj.hostname,
      profileId,
      platform: 'LinkedIn'
    }
  } catch (error) {
    return { error: 'Invalid URL format' }
  }
}

function parseAnalysisResponse(content: string, platform: string) {
  try {
    // Try to extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    // Fallback parsing for non-JSON responses
    return parseTextResponse(content, platform)
  } catch (error) {
    return parseTextResponse(content, platform)
  }
}

function parseTextResponse(content: string, platform: string) {
  if (platform === 'youtube') {
    return {
      channelName: extractFromText(content, ['channel', 'creator', 'name']),
      contentStyle: extractFromText(content, ['style', 'format', 'type']),
      targetAudience: extractFromText(content, ['audience', 'viewers', 'demographic']),
      contentFormat: 'Mixed Content',
      engagementStyle: 'Interactive',
      postingFrequency: 'Regular',
      professionalLevel: 'Semi-Professional',
      estimatedNiche: extractFromText(content, ['niche', 'category', 'topic']),
      audienceSize: 'Medium',
      contentThemes: ['general', 'lifestyle', 'entertainment']
    }
  } else {
    return {
      name: extractFromText(content, ['name', 'professional']),
      industry: extractFromText(content, ['industry', 'sector', 'field']),
      expertiseLevel: 'Professional',
      professionalTone: 'Professional',
      contentStyle: 'Business-focused',
      networkSize: 'Medium',
      businessFocus: extractFromText(content, ['business', 'focus', 'specialization']),
      communicationStyle: 'Professional',
      authorityLevel: 'Established',
      contentPreferences: ['industry insights', 'professional updates']
    }
  }
}

function extractFromText(text: string, keywords: string[]): string {
  const lines = text.split('\n')
  for (const line of lines) {
    for (const keyword of keywords) {
      if (line.toLowerCase().includes(keyword)) {
        return line.trim().substring(0, 100)
      }
    }
  }
  return 'General'
}

function getYouTubeFallback(url: string) {
  const channelInfo = extractChannelInfo(url)
  return {
    channelName: channelInfo.channelHandle || 'Creator',
    contentStyle: 'Educational/Entertainment',
    targetAudience: 'Young adults and professionals',
    contentFormat: 'Mixed video content',
    engagementStyle: 'Interactive and authentic',
    postingFrequency: 'Weekly',
    professionalLevel: 'Semi-Professional',
    estimatedNiche: 'Lifestyle and education',
    audienceSize: 'Growing',
    contentThemes: ['education', 'lifestyle', 'trending topics']
  }
}

function getLinkedInFallback(url: string) {
  const profileInfo = extractLinkedInInfo(url)
  return {
    name: 'Professional User',
    industry: 'Technology/Business',
    expertiseLevel: 'Experienced Professional',
    professionalTone: 'Professional and approachable',
    contentStyle: 'Industry insights and thought leadership',
    networkSize: 'Established',
    businessFocus: 'Business growth and innovation',
    communicationStyle: 'Professional',
    authorityLevel: 'Industry contributor',
    contentPreferences: ['industry insights', 'professional development']
  }
}

// YouTube Analysis Tool
export const createYouTubeAnalysisTool = () => {
  return new DynamicTool({
    name: "youtube_analyzer",
    description: "Analyzes YouTube channel data from URL patterns and generates insights about content style and audience",
    func: async (channelUrl: string): Promise<string> => {
      try {
        const channelInfo = extractChannelInfo(channelUrl)
        
        if (channelInfo.error) {
          throw new Error(channelInfo.error)
        }
        
        const llm = new ChatOpenAI({
          modelName: "gpt-4o-mini",
          temperature: 0.7,
        })

        const analysisPrompt = `
Analyze this YouTube channel URL: ${channelUrl}

Based on the URL structure (${JSON.stringify(channelInfo)}) and typical YouTube patterns, provide realistic insights in JSON format:

{
  "channelName": "estimated channel name",
  "contentStyle": "content style (Educational/Entertainment/Review/Vlog/etc)",
  "targetAudience": "target demographic", 
  "contentFormat": "video format preferences",
  "engagementStyle": "how they engage with audience",
  "postingFrequency": "estimated posting schedule",
  "professionalLevel": "Hobbyist/Semi-Pro/Professional",
  "estimatedNiche": "content niche/category",
  "audienceSize": "Small/Medium/Large",
  "contentThemes": ["theme1", "theme2", "theme3"]
}

Provide realistic estimates based on the channel handle/ID pattern and typical YouTube creator behavior.
`

        const response = await llm.invoke(analysisPrompt)
        const analysis = parseAnalysisResponse(response.content as string, 'youtube')
        
        return JSON.stringify({
          ...analysis,
          url: channelUrl,
          analysisType: 'AI-Enhanced Pattern Analysis',
          confidence: 'High',
          dataSource: 'URL Pattern + AI Analysis'
        })

      } catch (error) {
        console.error('YouTube analysis error:', error)
        return JSON.stringify({
          error: 'Failed to analyze YouTube channel',
          fallbackData: getYouTubeFallback(channelUrl)
        })
      }
    }
  })
}

// LinkedIn Analysis Tool  
export const createLinkedInAnalysisTool = () => {
  return new DynamicTool({
    name: "linkedin_analyzer", 
    description: "Analyzes LinkedIn profile URL patterns and generates professional insights",
    func: async (profileUrl: string): Promise<string> => {
      try {
        const profileInfo = extractLinkedInInfo(profileUrl)
        
        if (profileInfo.error) {
          throw new Error(profileInfo.error)
        }
        
        const llm = new ChatOpenAI({
          modelName: "gpt-4o-mini",
          temperature: 0.7,
        })

        const analysisPrompt = `
Analyze this LinkedIn profile URL: ${profileUrl}

Based on the URL structure (${JSON.stringify(profileInfo)}) and typical LinkedIn patterns, provide realistic insights in JSON format:

{
  "name": "estimated professional name",
  "industry": "likely industry/sector",
  "expertiseLevel": "Entry/Mid/Senior/Expert Level",
  "professionalTone": "communication style",
  "contentStyle": "content sharing patterns", 
  "networkSize": "Small/Medium/Large",
  "businessFocus": "business focus areas",
  "communicationStyle": "how they communicate",
  "authorityLevel": "influence level in industry",
  "contentPreferences": ["type1", "type2", "type3"]
}

Provide realistic professional insights based on LinkedIn URL patterns and professional behavior.
`

        const response = await llm.invoke(analysisPrompt)
        const analysis = parseAnalysisResponse(response.content as string, 'linkedin')
        
        return JSON.stringify({
          ...analysis,
          url: profileUrl,
          analysisType: 'AI-Enhanced Pattern Analysis',
          confidence: 'High',
          dataSource: 'URL Pattern + AI Analysis'
        })

      } catch (error) {
        console.error('LinkedIn analysis error:', error)
        return JSON.stringify({
          error: 'Failed to analyze LinkedIn profile',
          fallbackData: getLinkedInFallback(profileUrl)
        })
      }
    }
  })
}

// Content Personalization Tool
export const createPersonalizationTool = () => {
  return new DynamicTool({
    name: "content_personalizer",
    description: "Creates personalized A-roll and B-roll scripts based on social media analysis and content ideas",
    func: async (input: string): Promise<string> => {
      try {
        const { idea, youtubeData, linkedinData } = JSON.parse(input)
        
        const llm = new ChatOpenAI({
          modelName: "gpt-4o",
          temperature: 0.8,
        })

        const personalizationPrompt = `
Create ultra-personalized A-roll and B-roll scripts for: "${idea}"

YouTube Analysis:
${youtubeData ? JSON.stringify(youtubeData, null, 2) : 'No YouTube data available'}

LinkedIn Analysis:  
${linkedinData ? JSON.stringify(linkedinData, null, 2) : 'No LinkedIn data available'}

PERSONALIZATION REQUIREMENTS:
1. Match the creator's established content style and tone
2. Reference their expertise and background authentically  
3. Use their typical engagement patterns and audience preferences
4. Incorporate their personal brand and professional positioning
5. Maintain consistency with their posting frequency and format preferences

Generate scripts that feel like THIS SPECIFIC PERSON created them, not generic templates.

Return in this JSON format:
{
  "aRollScript": "Main spoken content that matches their voice and style...",
  "bRollScript": "Visual directions and B-roll suggestions that match their format...",
  "personalizationNotes": "Explanation of how the scripts were personalized..."
}

Make the scripts authentically match this creator's voice, expertise, and audience.
`

        const response = await llm.invoke(personalizationPrompt)
        
        try {
          const jsonMatch = response.content?.toString().match(/\{[\s\S]*\}/)
          if (jsonMatch) {
            return jsonMatch[0]
          }
        } catch (parseError) {
          // Fallback if JSON parsing fails
          return JSON.stringify({
            aRollScript: response.content?.toString().substring(0, 1000) || '',
            bRollScript: 'Standard visual directions and B-roll suggestions',
            personalizationNotes: 'Generated with available personalization data'
          })
        }

        return response.content as string

      } catch (error) {
        console.error('Personalization error:', error)
        return JSON.stringify({
          aRollScript: 'Error generating personalized script',
          bRollScript: 'Error generating B-roll directions',
          personalizationNotes: 'Failed to personalize content',
          error: error instanceof Error ? error.message : 'Unknown error'
        })
      }
    }
  })
}

// Main Agent System
export class PersonalizationAgent {
  private llm: ChatOpenAI
  private tools: any[]

  constructor() {
    this.llm = new ChatOpenAI({
      modelName: "gpt-4o",
      temperature: 0.1,
    })

    this.tools = [
      createYouTubeAnalysisTool(),
      createLinkedInAnalysisTool(), 
      createPersonalizationTool()
    ]
  }

  async personalizeContent(contentIdea: string, youtubeUrl?: string, linkedinUrl?: string) {
    try {
      const prompt = ChatPromptTemplate.fromMessages([
        ["system", `You are a specialized content personalization agent. Your role is to:
        1. Analyze social media profiles to understand the creator's style and expertise
        2. Extract meaningful patterns from their online presence
        3. Generate highly personalized scripts that feel authentically created by that person
        
        Use the available tools to gather comprehensive data and create amazing personalized content.
        Always be thorough in your analysis before generating scripts.`],
        ["human", "{input}"],
        new MessagesPlaceholder("agent_scratchpad"),
      ])

      const agent = await createOpenAIFunctionsAgent({
        llm: this.llm,
        tools: this.tools,
        prompt,
      })

      const agentExecutor = new AgentExecutor({
        agent,
        tools: this.tools,
        verbose: true,
        maxIterations: 5
      })

      const input = `
      Create personalized A-roll and B-roll scripts for: "${contentIdea}"
      
      ${youtubeUrl ? `YouTube URL: ${youtubeUrl}` : ''}
      ${linkedinUrl ? `LinkedIn URL: ${linkedinUrl}` : ''}
      
      Please analyze the provided social media profiles thoroughly and create scripts that feel authentically created by this person.
      `

      const result = await agentExecutor.invoke({ input })
      return result.output

    } catch (error) {
      console.error('Agent execution error:', error)
      
      // Fallback to direct personalization
      return await this.fallbackPersonalization(contentIdea, youtubeUrl, linkedinUrl)
    }
  }

  private async fallbackPersonalization(contentIdea: string, youtubeUrl?: string, linkedinUrl?: string) {
    try {
      // Analyze profiles individually if agent fails
      let youtubeData = null
      let linkedinData = null

      if (youtubeUrl) {
        const youtubeTool = createYouTubeAnalysisTool()
        const youtubeResult = await youtubeTool.func(youtubeUrl)
        youtubeData = JSON.parse(youtubeResult)
      }

      if (linkedinUrl) {
        const linkedinTool = createLinkedInAnalysisTool()
        const linkedinResult = await linkedinTool.func(linkedinUrl)
        linkedinData = JSON.parse(linkedinResult)
      }

      // Generate personalized content
      const personalizationTool = createPersonalizationTool()
      const result = await personalizationTool.func(JSON.stringify({
        idea: contentIdea,
        youtubeData,
        linkedinData
      }))

      return result

    } catch (error) {
      console.error('Fallback personalization error:', error)
      return JSON.stringify({
        aRollScript: `Engaging script for: ${contentIdea}`,
        bRollScript: 'Standard visual directions and B-roll suggestions',
        personalizationNotes: 'Basic personalization applied due to technical limitations',
        error: 'Advanced personalization unavailable'
      })
    }
  }
} 