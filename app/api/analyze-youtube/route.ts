import { ChatOpenAI } from "@langchain/openai"
import { PromptTemplate } from "@langchain/core/prompts"
import { LLMChain } from "langchain/chains"
import { type NextRequest, NextResponse } from "next/server"

interface YouTubeVideo {
  title: string
  description: string
  viewCount: number
  publishedAt: string
  duration: string
  tags: string[]
  transcript?: string
}

interface ChannelAnalysis {
  channelName: string
  subscriberCount: string
  totalVideos: number
  channelDescription: string
  recentVideos: YouTubeVideo[]
  styleProfile: {
    tone: string
    topics: string[]
    avgVideoLength: string
    contentStyle: string
    audience: string
    uniqueElements: string[]
    energyLevel: string
    catchphrases: string[]
    speakingStyle: string
    personalityTraits: string[]
    contentPatterns: string[]
    interactionStyle: string
    targetAudience: {
      demographics: string
      interests: string[]
      skillLevel: string
      ageRange: string
      profession: string[]
    }
  }
}

// Helper function to extract channel ID from various YouTube URL formats
function extractChannelId(input: string): { channelId?: string; channelHandle?: string; error?: string } {
  try {
    if (input.match(/^UC[a-zA-Z0-9_-]{22}$/)) {
      return { channelId: input }
    }

    const url = input.includes("youtube.com") ? input : `https://youtube.com/${input}`
    const urlObj = new URL(url)
    const pathname = urlObj.pathname

    const channelMatch = pathname.match(/\/channel\/([a-zA-Z0-9_-]+)/)
    if (channelMatch) {
      return { channelId: channelMatch[1] }
    }

    const handleMatch = pathname.match(/\/@([a-zA-Z0-9_-]+)/)
    if (handleMatch) {
      return { channelHandle: handleMatch[1] }
    }

    const customMatch = pathname.match(/\/c\/([a-zA-Z0-9_-]+)/)
    if (customMatch) {
      return { channelHandle: customMatch[1] }
    }

    const userMatch = pathname.match(/\/user\/([a-zA-Z0-9_-]+)/)
    if (userMatch) {
      return { channelHandle: userMatch[1] }
    }

    const cleanInput = input.replace(/[@/]/g, "")
    return { channelHandle: cleanInput }
  } catch (error) {
    return { error: "Invalid URL format" }
  }
}

// YouTube Data API v3 functions
async function getChannelData(channelId: string, apiKey: string) {
  const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${apiKey}`

  const response = await fetch(channelUrl)
  if (!response.ok) {
    throw new Error(`YouTube API error: ${response.status}`)
  }

  const data = await response.json()
  if (!data.items || data.items.length === 0) {
    throw new Error("Channel not found")
  }

  return data.items[0]
}

async function getChannelVideos(channelId: string, apiKey: string, maxResults = 25) {
  const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`
  const channelResponse = await fetch(channelUrl)
  const channelData = await channelResponse.json()

  if (!channelData.items || channelData.items.length === 0) {
    throw new Error("Channel not found")
  }

  const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads

  const videosUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=${maxResults}&key=${apiKey}`
  const videosResponse = await fetch(videosUrl)
  const videosData = await videosResponse.json()

  if (!videosData.items) {
    return []
  }

  const videoIds = videosData.items.map((item: any) => item.snippet.resourceId.videoId).join(",")
  const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoIds}&key=${apiKey}`
  const detailsResponse = await fetch(detailsUrl)
  const detailsData = await detailsResponse.json()

  return detailsData.items || []
}

async function resolveChannelHandle(handle: string, apiKey: string): Promise<string> {
  const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${handle}&type=channel&maxResults=1&key=${apiKey}`
  const response = await fetch(searchUrl)
  const data = await response.json()

  if (data.items && data.items.length > 0) {
    return data.items[0].snippet.channelId
  }

  throw new Error(`Could not resolve channel handle: ${handle}`)
}

// Enhanced content analysis function
async function analyzeContentAccurately(channelData: any, videosData: any[]): Promise<any> {
  const model = new ChatOpenAI({
    modelName: "gpt-4o",
    temperature: 0.1, // Lower temperature for more accurate analysis
    openAIApiKey: process.env.OPENAI_API_KEY,
  })

  // Create comprehensive content analysis with more data
  const channelDescription = channelData.snippet.description || ""
  const channelTitle = channelData.snippet.title || ""

  // Process video data more thoroughly
  const detailedVideoAnalysis = videosData.slice(0, 20).map((video, index) => {
    const snippet = video.snippet
    const statistics = video.statistics
    const contentDetails = video.contentDetails

    // Extract more meaningful data
    const title = snippet.title || ""
    const description = snippet.description || ""
    const tags = snippet.tags || []
    const viewCount = Number.parseInt(statistics.viewCount || "0")
    const likeCount = Number.parseInt(statistics.likeCount || "0")
    const commentCount = Number.parseInt(statistics.commentCount || "0")

    // Parse duration
    const duration = contentDetails.duration || ""
    const durationMatch = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    const hours = Number.parseInt(durationMatch?.[1] || "0")
    const minutes = Number.parseInt(durationMatch?.[2] || "0")
    const seconds = Number.parseInt(durationMatch?.[3] || "0")
    const totalMinutes = hours * 60 + minutes + seconds / 60

    return {
      index: index + 1,
      title,
      description: description.substring(0, 800), // More description text
      tags,
      viewCount,
      likeCount,
      commentCount,
      durationMinutes: Math.round(totalMinutes * 10) / 10,
      publishedAt: snippet.publishedAt,
      // Calculate engagement rate
      engagementRate: viewCount > 0 ? (((likeCount + commentCount) / viewCount) * 100).toFixed(2) : "0",
    }
  })

  // Create detailed analysis prompt
  const contentAnalysisText = detailedVideoAnalysis
    .map(
      (video) => `
VIDEO ${video.index}: "${video.title}"
Duration: ${video.durationMinutes} minutes
Views: ${video.viewCount.toLocaleString()} | Likes: ${video.likeCount.toLocaleString()} | Comments: ${video.commentCount.toLocaleString()}
Engagement Rate: ${video.engagementRate}%
Tags: ${video.tags.join(", ")}
Description: ${video.description}
Published: ${new Date(video.publishedAt).toLocaleDateString()}
---`,
    )
    .join("\n")

  // Calculate average video length
  const avgDuration =
    detailedVideoAnalysis.reduce((sum, video) => sum + video.durationMinutes, 0) / detailedVideoAnalysis.length

  const accurateAnalysisPrompt = PromptTemplate.fromTemplate(`
You are an expert YouTube content analyst with deep expertise in audience demographics, content categorization, and creator personality analysis. Your job is to provide EXTREMELY ACCURATE analysis based on REAL DATA.

CHANNEL INFORMATION:
Channel Name: {channelName}
Channel Description: {channelDescription}
Subscribers: {subscriberCount}
Total Videos: {totalVideos}
Average Video Length: {avgDuration} minutes

DETAILED VIDEO ANALYSIS (20 Recent Videos):
{contentAnalysis}

CRITICAL ANALYSIS REQUIREMENTS:

1. TARGET AUDIENCE ANALYSIS:
   - Analyze video titles, descriptions, and tags to determine EXACT target audience
   - Consider technical complexity, language used, topics covered
   - Identify specific demographics (age, profession, skill level, interests)
   - Be SPECIFIC: "Software developers, CS students, tech professionals" NOT "young people interested in tech"

2. CATCHPHRASE EXTRACTION:
   - Look for REPEATED phrases in video titles and descriptions
   - Find patterns in how they start/end videos (from descriptions)
   - Identify signature expressions or terminology they use consistently
   - Extract EXACT phrases, not generic ones

3. CONTENT CATEGORIZATION:
   - Analyze video titles and tags to determine EXACT content categories
   - Identify specific niches (e.g., "React tutorials", "System design", "Coding interviews")
   - Look at technical complexity and subject matter

4. PERSONALITY TRAITS:
   - Based on video titles, descriptions, and engagement patterns
   - Look for teaching style, communication approach
   - Identify energy level from title formatting (CAPS, emojis, etc.)

5. AUDIENCE DEMOGRAPHICS:
   - Software content → Software developers, CS students, bootcamp graduates
   - Gaming content → Gamers, specific game communities, age groups
   - Lifestyle content → Age-specific demographics, interest groups
   - Educational content → Students, professionals, skill level

Return a JSON object with this EXACT structure:
{{
  "tone": "specific description based on actual content style",
  "topics": ["exact content categories from video analysis"],
  "avgVideoLength": "{avgDuration} minutes",
  "contentStyle": "detailed description of their content approach",
  "audience": "general audience description",
  "uniqueElements": ["specific unique traits found in content"],
  "energyLevel": "energy level based on title/description analysis",
  "catchphrases": ["EXACT phrases found in multiple videos"],
  "speakingStyle": "communication style based on content",
  "personalityTraits": ["specific traits based on content analysis"],
  "contentPatterns": ["patterns found in video structure/topics"],
  "interactionStyle": "how they engage based on descriptions",
  "targetAudience": {{
    "demographics": "specific demographic groups",
    "interests": ["specific interest areas from content analysis"],
    "skillLevel": "beginner/intermediate/advanced based on content complexity",
    "ageRange": "age range based on content style and complexity",
    "profession": ["specific professions that would watch this content"]
  }}
}}

EXAMPLES of ACCURATE analysis:
- Software channel → Target: "Software developers, CS students, bootcamp graduates, tech professionals"
- Gaming channel → Target: "Gamers aged 16-25, esports enthusiasts, specific game communities"
- Cooking channel → Target: "Home cooks, food enthusiasts, people learning to cook, ages 25-45"

Be EXTREMELY specific and base everything on the actual video data provided. NO GENERIC RESPONSES.
`)

  const chain = new LLMChain({
    llm: model,
    prompt: accurateAnalysisPrompt,
  })

  console.log("Running accurate content analysis...")

  const result = await chain.call({
    channelName: channelTitle,
    channelDescription: channelDescription,
    subscriberCount: channelData.statistics.subscriberCount,
    totalVideos: channelData.statistics.videoCount,
    avgDuration: avgDuration.toFixed(1),
    contentAnalysis: contentAnalysisText,
  })

  try {
    const parsedResult = JSON.parse(result.text)
    console.log("Analysis complete - found catchphrases:", parsedResult.catchphrases)
    console.log("Target audience:", parsedResult.targetAudience)
    return parsedResult
  } catch (error) {
    console.error("Failed to parse analysis result:", result.text)

    // Create a more intelligent fallback based on the actual data
    const fallbackAnalysis = createIntelligentFallback(channelData, detailedVideoAnalysis)
    return fallbackAnalysis
  }
}

// Intelligent fallback analysis
function createIntelligentFallback(channelData: any, videosData: any[]) {
  const titles = videosData.map((v) => v.title.toLowerCase())
  const descriptions = videosData.map((v) => v.description.toLowerCase()).join(" ")
  const allTags = videosData.flatMap((v) => v.tags).map((tag) => tag.toLowerCase())

  // Analyze content type based on actual data
  const isTechContent = titles.some(
    (title) =>
      title.includes("tutorial") ||
      title.includes("coding") ||
      title.includes("programming") ||
      title.includes("javascript") ||
      title.includes("python") ||
      title.includes("react") ||
      title.includes("web development") ||
      title.includes("software"),
  )

  const isGamingContent = titles.some(
    (title) =>
      title.includes("gaming") ||
      title.includes("gameplay") ||
      title.includes("game") ||
      title.includes("playing") ||
      allTags.includes("gaming"),
  )

  const isEducationalContent = titles.some(
    (title) =>
      title.includes("how to") ||
      title.includes("tutorial") ||
      title.includes("learn") ||
      title.includes("explained") ||
      title.includes("guide"),
  )

  // Extract actual repeated phrases from titles
  const titleWords = titles.join(" ").split(" ")
  const phraseFrequency: { [key: string]: number } = {}

  // Look for repeated 2-3 word phrases
  for (let i = 0; i < titleWords.length - 1; i++) {
    const phrase = titleWords.slice(i, i + 2).join(" ")
    if (phrase.length > 3) {
      phraseFrequency[phrase] = (phraseFrequency[phrase] || 0) + 1
    }
  }

  const commonPhrases = Object.entries(phraseFrequency)
    .filter(([phrase, count]) => count >= 2)
    .map(([phrase]) => phrase)
    .slice(0, 5)

  // Determine target audience based on content
  let targetAudience = {
    demographics: "General audience",
    interests: ["Entertainment"],
    skillLevel: "Beginner",
    ageRange: "18-35",
    profession: ["General public"],
  }

  if (isTechContent) {
    targetAudience = {
      demographics: "Software developers, CS students, tech professionals",
      interests: ["Programming", "Web development", "Software engineering", "Technology"],
      skillLevel: "Beginner to Advanced",
      ageRange: "20-40",
      profession: ["Software developers", "CS students", "Bootcamp graduates", "Tech professionals"],
    }
  } else if (isGamingContent) {
    targetAudience = {
      demographics: "Gamers, gaming enthusiasts, esports fans",
      interests: ["Gaming", "Esports", "Game reviews", "Gaming culture"],
      skillLevel: "Casual to Hardcore gamers",
      ageRange: "16-30",
      profession: ["Students", "Gamers", "Content creators", "Esports professionals"],
    }
  } else if (isEducationalContent) {
    targetAudience = {
      demographics: "Students, professionals seeking to learn new skills",
      interests: ["Education", "Skill development", "Learning"],
      skillLevel: "Beginner to Intermediate",
      ageRange: "18-45",
      profession: ["Students", "Professionals", "Career changers"],
    }
  }

  return {
    tone: isEducationalContent
      ? "Educational and informative"
      : isGamingContent
        ? "Energetic and entertaining"
        : "Engaging and conversational",
    topics: isTechContent
      ? ["Programming", "Web Development", "Software Engineering"]
      : isGamingContent
        ? ["Gaming", "Game Reviews", "Gameplay"]
        : ["General Content", "Entertainment"],
    avgVideoLength: `${videosData.reduce((sum, v) => sum + v.durationMinutes, 0) / videosData.length} minutes`,
    contentStyle: isEducationalContent ? "Tutorial-based educational content" : "Entertainment-focused content",
    audience: targetAudience.demographics,
    uniqueElements: commonPhrases.length > 0 ? commonPhrases : ["Consistent content creation"],
    energyLevel: isGamingContent ? "High energy" : isTechContent ? "Moderate, focused" : "Moderate",
    catchphrases: commonPhrases,
    speakingStyle: isEducationalContent ? "Clear, instructional" : "Conversational",
    personalityTraits: [isEducationalContent ? "Teaching-focused" : "Entertainment-focused"],
    contentPatterns: [`Regular ${isTechContent ? "tutorial" : isGamingContent ? "gaming" : "content"} uploads`],
    interactionStyle: "Direct audience engagement",
    targetAudience,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { channelId, channelUrl } = await request.json()

    if (!channelId && !channelUrl) {
      return NextResponse.json({ error: "Channel ID or URL is required" }, { status: 400 })
    }

    const youtubeApiKey = process.env.YOUTUBE_API_KEY
    if (!youtubeApiKey) {
      return NextResponse.json(
        {
          error: "YouTube API key not configured. Please add YOUTUBE_API_KEY to your environment variables.",
          setup: "Get your API key from Google Cloud Console → YouTube Data API v3",
        },
        { status: 500 },
      )
    }

    console.log("Input received:", { channelId, channelUrl })

    const input = channelId || channelUrl
    const { channelId: extractedChannelId, channelHandle, error: extractError } = extractChannelId(input)

    if (extractError) {
      return NextResponse.json({ error: extractError }, { status: 400 })
    }

    let finalChannelId = extractedChannelId

    if (!finalChannelId && channelHandle) {
      try {
        finalChannelId = await resolveChannelHandle(channelHandle, youtubeApiKey)
        console.log("Resolved channel ID:", finalChannelId)
      } catch (error) {
        return NextResponse.json(
          { error: `Could not resolve channel handle: ${channelHandle}. Please provide the channel ID instead.` },
          { status: 400 },
        )
      }
    }

    if (!finalChannelId) {
      return NextResponse.json({ error: "Could not extract or resolve channel ID" }, { status: 400 })
    }

    console.log("Fetching channel data from YouTube API...")
    const channelData = await getChannelData(finalChannelId, youtubeApiKey)

    console.log("Fetching videos data from YouTube API...")
    const videosData = await getChannelVideos(finalChannelId, youtubeApiKey, 25)

    if (videosData.length === 0) {
      return NextResponse.json(
        { error: "No videos found for this channel. The channel might be empty or private." },
        { status: 400 },
      )
    }

    const recentVideos = videosData.map((video: any) => ({
      title: video.snippet.title,
      description: video.snippet.description || "",
      viewCount: Number.parseInt(video.statistics.viewCount || "0"),
      publishedAt: video.snippet.publishedAt,
      duration: video.contentDetails.duration,
      tags: video.snippet.tags || [],
    }))

    console.log("Running accurate content analysis...")
    const styleProfile = await analyzeContentAccurately(channelData, videosData)

    const analysis: ChannelAnalysis = {
      channelName: channelData.snippet.title,
      subscriberCount: Number.parseInt(channelData.statistics.subscriberCount).toLocaleString(),
      totalVideos: Number.parseInt(channelData.statistics.videoCount),
      channelDescription: channelData.snippet.description || "",
      recentVideos,
      styleProfile,
    }

    console.log("Analysis complete for:", analysis.channelName)
    console.log("Target audience found:", styleProfile.targetAudience)
    console.log("Catchphrases extracted:", styleProfile.catchphrases)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Error analyzing YouTube channel:", error)

    let errorMessage = "Failed to analyze YouTube channel"
    const errorDetails = error instanceof Error ? error.message : "Unknown error"

    if (errorDetails.includes("quotaExceeded")) {
      errorMessage = "YouTube API quota exceeded. Please try again tomorrow or use a different API key."
    } else if (errorDetails.includes("keyInvalid")) {
      errorMessage = "Invalid YouTube API key. Please check your YOUTUBE_API_KEY environment variable."
    } else if (errorDetails.includes("channel not found") || errorDetails.includes("404")) {
      errorMessage = "Channel not found. Please check the channel ID or URL."
    } else if (errorDetails.includes("403")) {
      errorMessage = "Access forbidden. Channel might be private or API key lacks permissions."
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
        suggestions: [
          "Make sure you have a valid YouTube Data API v3 key in YOUTUBE_API_KEY",
          "Ensure the channel ID is correct and starts with 'UC'",
          "Check that the channel is public and has recent videos",
          "Verify your API key has YouTube Data API v3 enabled",
        ],
      },
      { status: 500 },
    )
  }
}
