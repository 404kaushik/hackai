export const maxDuration = 120

export async function POST(req: Request) {
  try {
    const { aRollScript, bRollScript, avatarId, contentIdea } = await req.json()

    if (!aRollScript || !bRollScript) {
      return Response.json({ error: "A-Roll and B-Roll scripts are required." }, { status: 400 })
    }

    const heygenapiKey = process.env.HEYGEN_API_KEY
    if (!heygenapiKey) {
      console.warn("HEYGEN_API_KEY not set. Returning placeholder video.")
      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 8000))
      return Response.json({
        videoUrl: "/placeholder.svg?width=360&height=640&text=HeyGen+Video+Placeholder",
      })
    }

    // HeyGen AI Integration
    try {
      // Step 1: Create video generation request
      const videoRequest = {
        video_inputs: [
          {
            character: {
              type: "avatar",
              avatar_id: avatarId || "default_avatar_id", // Use uploaded avatar or default
              avatar_style: "normal",
            },
            voice: {
              type: "text",
              input_text: aRollScript.replace(/\[.*?\]/g, ""), // Remove timestamps for voice
              voice_id: "default_voice_id", // You can customize this
            },
            background: {
              type: "color",
              value: "#ffffff", // White background, can be customized
            },
          },
        ],
        aspect_ratio: "9:16", // Vertical video for social media
        test: false, // Set to true for testing
      }

      // Step 2: Submit video generation request to HeyGen
      const generateResponse = await fetch("https://api.heygen.com/v2/video/generate", {
        method: "POST",
        headers: {
          "X-API-KEY": heygenapiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(videoRequest),
      })

      if (!generateResponse.ok) {
        const errorData = await generateResponse.json()
        throw new Error(`HeyGen API error: ${errorData.message || "Unknown error"}`)
      }

      const generateData = await generateResponse.json()
      const videoId = generateData.data.video_id

      // Step 3: Poll for video completion
      let videoUrl = null
      let attempts = 0
      const maxAttempts = 60 // 5 minutes max wait time

      while (!videoUrl && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 5000)) // Wait 5 seconds

        const statusResponse = await fetch(`https://api.heygen.com/v1/video_status.get?video_id=${videoId}`, {
          headers: {
            "X-API-KEY": heygenapiKey,
          },
        })

        if (statusResponse.ok) {
          const statusData = await statusResponse.json()

          if (statusData.data.status === "completed") {
            videoUrl = statusData.data.video_url
            break
          } else if (statusData.data.status === "failed") {
            throw new Error("HeyGen video generation failed")
          }
          // If status is 'processing', continue polling
        }

        attempts++
      }

      if (!videoUrl) {
        throw new Error("HeyGen video generation timed out")
      }

      return Response.json({ videoUrl })
    } catch (heygenError: any) {
      console.error("HeyGen API error:", heygenError)

      // Fallback to placeholder if HeyGen fails
      await new Promise((resolve) => setTimeout(resolve, 5000))
      return Response.json({
        videoUrl: "/placeholder.svg?width=360&height=640&text=HeyGen+Processing+Error",
        error: `HeyGen processing failed: ${heygenError.message}`,
      })
    }
  } catch (error: any) {
    console.error("Error in video generation API:", error)
    return Response.json({ error: `Failed to generate video: ${error.message}` }, { status: 500 })
  }
}
