import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { topic } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `You are a market research analyst specializing in content creation and social media trends. 
      Generate comprehensive market analysis data for content topics. 
      Return your response as a JSON object with the following structure:
      {
        "trendingTopics": ["keyword1", "keyword2", ...],
        "targetAudience": {
          "ageRange": "age range with percentages",
          "genderSplit": "gender breakdown with percentages", 
          "topLocations": "top geographic locations",
          "interests": "main interest categories"
        },
        "competitorInsights": [
          {
            "channel": "channel name",
            "subs": "subscriber count",
            "engagement": "engagement rate"
          }
        ]
      }`,
      prompt: `Analyze the market potential and audience for content about: "${topic}". 
      Provide trending keywords, target audience demographics, and competitive landscape insights. 
      Make the data realistic and specific to this topic.`,
    })

    // Parse the AI response as JSON
    const analysisData = JSON.parse(text)

    return NextResponse.json(analysisData)
  } catch (error) {
    console.error("Error generating market analysis:", error)
    return NextResponse.json({ error: "Failed to generate market analysis" }, { status: 500 })
  }
}
