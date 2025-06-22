# Dynamic Media Integration Guide

This guide shows how to integrate the new dynamic video/image insertion functionality into your existing HeyGen AI project.

## 🚀 What's New

### 1. **VideoComposer** (`lib/video-composer.ts`)
- Client-side video composition using FFmpeg.js
- Merge avatar videos with B-roll footage and images
- Timeline parsing and segment management
- Real-time progress tracking

### 2. **MediaSelector** (`components/media-selector.tsx`)
- Dynamic media selection UI for each B-roll segment
- Search Pexels/Unsplash for stock media
- User file upload support
- Preview and management interface

### 3. **CompositionPreview** (`components/composition-preview.tsx`)
- Timeline visualization of the composition
- Mock video preview with playback controls
- Segment status and validation

### 4. **APIs**
- `/api/search-media` - Search stock media from Pexels/Unsplash
- `/api/compose-video` - Server-side video composition with progress streaming

## 🔧 Integration Steps

### Step 1: Add State Management to Dashboard

Add these state variables to your dashboard component:

```typescript
// Dynamic media state
const [selectedMedia, setSelectedMedia] = useState<{[timeRange: string]: MediaItem}>({})
const [compositionSegments, setCompositionSegments] = useState<VideoSegment[]>([])
const [isComposing, setIsComposing] = useState(false)
const [compositionProgress, setCompositionProgress] = useState(0)
const [compositionStage, setCompositionStage] = useState('')
const [finalComposedVideo, setFinalComposedVideo] = useState<string | null>(null)
```

### Step 2: Parse B-roll Script into Segments

Add this function to parse your B-roll script:

```typescript
const parseBrollSegments = useCallback((brollScript: string): BrollSegment[] => {
  const lines = brollScript.split('\n').filter(line => line.trim())
  const segments: BrollSegment[] = []
  
  for (const line of lines) {
    const timeMatch = line.match(/\[(\d+):(\d+)-(\d+):(\d+)\]/)
    if (!timeMatch) continue
    
    const startMinutes = parseInt(timeMatch[1])
    const startSeconds = parseInt(timeMatch[2])
    const endMinutes = parseInt(timeMatch[3])
    const endSeconds = parseInt(timeMatch[4])
    
    const startTime = startMinutes * 60 + startSeconds
    const endTime = endMinutes * 60 + endSeconds
    
    segments.push({
      timeRange: `${timeMatch[1]}:${timeMatch[2]}-${timeMatch[3]}:${timeMatch[4]}`,
      startTime,
      endTime,
      duration: endTime - startTime,
      description: line.replace(/\[\d+:\d+-\d+:\d+\]/, '').replace(/B-ROLL[:\s]*/gi, '').trim(),
      selectedMedia: selectedMedia[`${timeMatch[1]}:${timeMatch[2]}-${timeMatch[3]}:${timeMatch[4]}`]
    })
  }
  
  return segments
}, [selectedMedia])
```

### Step 3: Add Media Selection Handlers

```typescript
const handleMediaSelect = (timeRange: string, media: MediaItem) => {
  setSelectedMedia(prev => ({
    ...prev,
    [timeRange]: media
  }))
}

const handleMediaRemove = (timeRange: string) => {
  setSelectedMedia(prev => {
    const updated = { ...prev }
    delete updated[timeRange]
    return updated
  })
}
```

### Step 4: Update the Storyboard Step

Replace or enhance your existing storyboard step with:

```tsx
{currentStep === "storyboard" && (
  <div className="space-y-8">
    {/* Existing script display */}
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            A-Roll Script (Your Avatar)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm">{aRollScript}</pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            B-Roll Script (Visual Elements)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm">{bRollScript}</pre>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* NEW: Dynamic Media Selection */}
    <MediaSelector
      segments={parseBrollSegments(bRollScript)}
      onMediaSelect={handleMediaSelect}
      onMediaRemove={handleMediaRemove}
    />

    {/* NEW: Composition Preview */}
    {compositionSegments.length > 0 && (
      <CompositionPreview
        segments={compositionSegments}
        totalDuration={Math.max(...compositionSegments.map(s => s.endTime))}
        avatarVideoUrl={generatedVideoUrl}
        isProcessing={isComposing}
        processingProgress={compositionProgress}
        processingStage={compositionStage}
        onStartComposition={handleStartComposition}
      />
    )}

    {/* Action buttons */}
    <div className="flex gap-4 justify-center">
      <Button
        onClick={handleRegenerateScripts}
        variant="outline"
        disabled={isGeneratingScripts}
      >
        {isGeneratingScripts ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <RefreshCw className="w-4 h-4 mr-2" />
        )}
        Regenerate Scripts
      </Button>

      <Button
        onClick={handleGenerateVideo}
        disabled={isGeneratingVideo || !selectedAvatarId}
        className="bg-gradient-to-r from-purple-600 to-blue-600"
      >
        {isGeneratingVideo ? (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        ) : (
          <Video className="w-4 h-4 mr-2" />
        )}
        Generate Avatar Video
      </Button>
    </div>
  </div>
)}
```

### Step 5: Add Video Composition Handler

```typescript
const handleStartComposition = async () => {
  if (!generatedVideoUrl || !aRollScript || !bRollScript) {
    alert('Please generate the avatar video first')
    return
  }

  setIsComposing(true)
  setCompositionProgress(0)
  setCompositionStage('Preparing composition...')

  try {
    // Parse timeline
    const timeline = videoComposer.parseScriptTimeline(aRollScript, bRollScript)
    const composition = videoComposer.createComposition(timeline, generatedVideoUrl, selectedMedia)
    setCompositionSegments(composition)

    // Start server-side composition with streaming
    const response = await fetch('/api/compose-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        aRollScript,
        bRollScript,
        avatarVideoUrl: generatedVideoUrl,
        selectedMedia,
        settings: {
          width: 720,
          height: 1280,
          fps: 30,
          format: 'mp4',
          quality: 'medium'
        }
      }),
    })

    if (!response.body) {
      throw new Error('No response body')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n')

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))
            
            switch (data.type) {
              case 'progress':
                setCompositionProgress(data.progress)
                setCompositionStage(data.stage)
                break
                
              case 'complete':
                // Convert base64 back to blob and create URL
                const byteCharacters = atob(data.videoData)
                const byteNumbers = new Array(byteCharacters.length)
                for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i)
                }
                const byteArray = new Uint8Array(byteNumbers)
                const blob = new Blob([byteArray], { type: data.mimeType })
                const composedVideoUrl = URL.createObjectURL(blob)
                
                setFinalComposedVideo(composedVideoUrl)
                setCompositionProgress(100)
                setCompositionStage('Video composition complete!')
                
                // Navigate to video step
                setCurrentStep('video')
                setVisitedSteps(prev => new Set([...prev, 'video']))
                break
                
              case 'error':
                throw new Error(data.error)
            }
          } catch (parseError) {
            console.warn('Failed to parse SSE data:', parseError)
          }
        }
      }
    }
  } catch (error) {
    console.error('Composition failed:', error)
    alert(`Video composition failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  } finally {
    setIsComposing(false)
  }
}
```

### Step 6: Update Video Step to Show Final Result

```tsx
{currentStep === "video" && (
  <div className="space-y-6">
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">
        {finalComposedVideo ? 'Your Composed Video is Ready!' : 'Your Avatar Video is Ready!'}
      </h2>
      <p className="text-gray-600 mb-6">
        {finalComposedVideo 
          ? 'Avatar video with your selected B-roll footage and images'
          : 'Avatar video with AI-generated speech'
        }
      </p>
    </div>

    {/* Video Player */}
    <div className="max-w-sm mx-auto">
      <div className="aspect-[9/16] bg-black rounded-2xl overflow-hidden relative shadow-2xl">
        <video
          id="final-video"
          className="w-full h-full object-cover"
          controls
          preload="metadata"
          src={finalComposedVideo || generatedVideoUrl}
        />
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex gap-4 justify-center">
      {!finalComposedVideo && Object.keys(selectedMedia).length > 0 && (
        <Button
          onClick={handleStartComposition}
          disabled={isComposing}
          className="bg-gradient-to-r from-green-600 to-blue-600"
        >
          {isComposing ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Video className="w-4 h-4 mr-2" />
          )}
          Compose with B-roll
        </Button>
      )}

      <Button
        onClick={() => {
          const videoUrl = finalComposedVideo || generatedVideoUrl
          const a = document.createElement('a')
          a.href = videoUrl
          a.download = 'supernova-video.mp4'
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }}
        className="bg-gradient-to-r from-purple-600 to-pink-600"
      >
        <Download className="w-4 h-4 mr-2" />
        Download Video
      </Button>

      <Button
        onClick={handleAddToLibrary}
        variant="outline"
      >
        <Save className="w-4 h-4 mr-2" />
        Save to Library
      </Button>
    </div>
  </div>
)}
```

## 🎯 Key Features

### Dynamic Media Selection
- Users can select different videos/images for each B-roll segment
- Automatic keyword extraction and media search
- Upload custom files
- Preview selected media

### Real-time Composition Preview
- Timeline visualization showing avatar and B-roll segments
- Mock playback controls
- Segment validation and status

### Video Composition
- Client-side FFmpeg.js processing
- Server-side composition with progress streaming
- Support for videos and images
- Customizable output settings

## 🚀 Next Steps

1. **Install Dependencies**: Run `npm install` to install FFmpeg.js
2. **Environment Variables**: Add Unsplash API key to `.env.local`
3. **Test Integration**: Try the new workflow end-to-end
4. **Customize**: Adjust video settings, add more media sources, enhance UI

## 💡 Benefits

- **User Control**: Users can customize B-roll content dynamically
- **Professional Results**: Combine avatar with relevant visuals
- **Scalable**: Easy to add more media sources
- **Real-time**: Immediate preview and feedback
- **Flexible**: Support for both videos and images

Your users will now be able to create much more engaging and dynamic reels with their custom B-roll content! 