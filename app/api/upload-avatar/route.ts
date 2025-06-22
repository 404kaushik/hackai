export const maxDuration = 120

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const videoFile = formData.get("video") as File

    if (!videoFile) {
      return Response.json({ error: "No video file provided." }, { status: 400 })
    }

    const heygenapiKey = process.env.HEYGEN_API_KEY
    if (!heygenapiKey) {
      console.warn("HEYGEN_API_KEY not set. Returning mock avatar ID.")
      return Response.json({
        avatarId: `mock_avatar_${Date.now()}`,
        message: "Mock avatar created (HeyGen API key not configured)",
      })
    }

    try {
      // Step 1: Upload video to HeyGen for avatar creation
      const uploadFormData = new FormData()
      uploadFormData.append("video", videoFile)

      const uploadResponse = await fetch("https://api.heygen.com/v1/avatar.upload", {
        method: "POST",
        headers: {
          "X-API-KEY": heygenapiKey,
        },
        body: uploadFormData,
      })

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json()
        throw new Error(`HeyGen upload error: ${errorData.message || "Unknown error"}`)
      }

      const uploadData = await uploadResponse.json()
      const avatarId = uploadData.data.avatar_id

      // Step 2: Wait for avatar processing (this might take a while)
      let avatarReady = false
      let attempts = 0
      const maxAttempts = 60 // 5 minutes max wait time

      while (!avatarReady && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 5000)) // Wait 5 seconds

        const statusResponse = await fetch(`https://api.heygen.com/v1/avatar.get?avatar_id=${avatarId}`, {
          headers: {
            "X-API-KEY": heygenapiKey,
          },
        })

        if (statusResponse.ok) {
          const statusData = await statusResponse.json()

          if (statusData.data.status === "ready") {
            avatarReady = true
            break
          } else if (statusData.data.status === "failed") {
            throw new Error("HeyGen avatar creation failed")
          }
          // If status is 'processing', continue polling
        }

        attempts++
      }

      if (!avatarReady) {
        // Return avatar ID even if not fully processed yet
        return Response.json({
          avatarId,
          message: "Avatar uploaded and processing. You can use this ID for video generation.",
        })
      }

      return Response.json({
        avatarId,
        message: "Avatar successfully created and ready for use!",
      })
    } catch (heygenError: any) {
      console.error("HeyGen avatar upload error:", heygenError)

      // Return a mock ID if HeyGen fails
      return Response.json({
        avatarId: `fallback_avatar_${Date.now()}`,
        error: `HeyGen upload failed: ${heygenError.message}`,
        message: "Using fallback avatar ID",
      })
    }
  } catch (error: any) {
    console.error("Error in avatar upload API:", error)
    return Response.json({ error: `Failed to upload avatar: ${error.message}` }, { status: 500 })
  }
}
