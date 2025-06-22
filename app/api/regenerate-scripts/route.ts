import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { topic, scriptType, currentScript } = await request.json()

    if (!topic || !scriptType) {
      return NextResponse.json({ error: "Topic and script type are required" }, { status: 400 })
    }

    let systemPrompt = ""
    let userPrompt = ""

    if (scriptType === "aRoll") {
      systemPrompt = `You are a professional content creator and scriptwriter. Create engaging, conversational scripts for video content that sound natural when spoken aloud. Focus on:
      - Hook the audience in the first 10 seconds
      - Use conversational, engaging language
      - Include personal anecdotes or relatable examples
      - Structure with clear sections and smooth transitions
      - End with a strong call-to-action
      - Keep paragraphs short for easy reading
      - Write in first person as if the creator is speaking directly to the audience
      
      Create a DIFFERENT version from the previous script while maintaining the same quality and engagement level.`

      userPrompt = `Create a new, different version of a video script about: "${topic}". 
      Here's the previous version to avoid repeating:
      
      ${currentScript}
      
      Generate a fresh take with different examples, structure, or approach while covering the same topic.`
    } else {
      systemPrompt = `You are a video production specialist creating detailed B-roll instructions. Generate specific, actionable visual directions that complement the spoken content. Include:
      - Specific shot types (close-up, wide shot, etc.)
      - Visual elements and props needed
      - Camera movements and angles
      - Timing suggestions
      - Visual metaphors and supporting imagery
      - Text overlays or graphics suggestions
      Format as clear scene-by-scene instructions.
      
      Create a DIFFERENT visual approach from the previous version.`

      userPrompt = `Create new, different B-roll visual instructions for a video about: "${topic}". 
      Here's the previous version to create something different:
      
      ${currentScript}
      
      Generate fresh visual ideas and shot suggestions while maintaining professional quality.`
    }

    const { text: newScript } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: userPrompt,
    })

    return NextResponse.json({
      script: newScript,
    })
  } catch (error) {
    console.error("Error regenerating script:", error)
    return NextResponse.json({ error: "Failed to regenerate script" }, { status: 500 })
  }
}
