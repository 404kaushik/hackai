import { NextRequest, NextResponse } from 'next/server'

const PEXELS_API_KEY = process.env.PEXELS_API_KEY
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY

interface MediaSearchResult {
  timeRange: string
  primaryVisual: string
  secondaryVisual: string
  textOverlay: string
  suggestedMedia: {
    primary: MediaItem[]
    secondary: MediaItem[]
  }
}

interface MediaItem {
  id: string
  url: string
  thumbnail: string
  type: 'video' | 'image'
  duration?: number
  title?: string
  source: 'pexels' | 'unsplash'
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  const type = searchParams.get('type') || 'both' // 'video', 'image', or 'both'
  const source = searchParams.get('source') || 'both' // 'pexels', 'unsplash', or 'both'

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 })
  }

  try {
    const media: any[] = []

    // Search Pexels for videos
    if ((type === 'video' || type === 'both') && (source === 'pexels' || source === 'both')) {
      try {
        const pexelsVideos = await searchPexels(query, 'video', 10)
        const formattedVideos = pexelsVideos.map(video => ({
          id: video.id,
          url: video.url,
          thumbnail: video.thumbnail,
          type: 'video',
          duration: video.duration || 0,
          title: video.title,
          source: 'pexels'
        }))
        media.push(...formattedVideos)
      } catch (error) {
        console.error('Pexels video search error:', error)
      }
    }

    // Search Pexels for images
    if ((type === 'image' || type === 'both') && (source === 'pexels' || source === 'both')) {
      try {
        const pexelsImages = await searchPexels(query, 'image', 10)
        const formattedImages = pexelsImages.map(image => ({
          id: image.id,
          url: image.url,
          thumbnail: image.thumbnail,
          type: 'image',
          title: image.title,
          source: 'pexels'
        }))
        media.push(...formattedImages)
      } catch (error) {
        console.error('Pexels image search error:', error)
      }
    }

    // Search Unsplash for images
    if ((type === 'image' || type === 'both') && (source === 'unsplash' || source === 'both')) {
      try {
        if (UNSPLASH_ACCESS_KEY) {
          const unsplashImages = await searchUnsplash(query, 10)
          const formattedImages = unsplashImages.map(image => ({
            id: image.id,
            url: image.url,
            thumbnail: image.thumbnail,
            type: 'image',
            title: image.title,
            source: 'unsplash'
          }))
          media.push(...formattedImages)
        }
      } catch (error) {
        console.error('Unsplash search error:', error)
      }
    }

    // Add some fallback media if no results found
    if (media.length === 0) {
      media.push(
        {
          id: 'fallback_1',
          url: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
          thumbnail: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400',
          type: 'image',
          title: 'Technology Workspace',
          source: 'pexels'
        },
        {
          id: 'fallback_2', 
          url: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg',
          thumbnail: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400',
          type: 'image',
          title: 'Coding Setup',
          source: 'pexels'
        },
        {
          id: 'fallback_3',
          url: 'https://images.pexels.com/photos/2104152/pexels-photo-2104152.jpeg',
          thumbnail: 'https://images.pexels.com/photos/2104152/pexels-photo-2104152.jpeg?auto=compress&cs=tinysrgb&w=400',
          type: 'image',
          title: 'Business Meeting',
          source: 'pexels'
        }
      )
    }

    return NextResponse.json({
      media: media.slice(0, 20), // Limit to 20 results
      total: media.length,
      query,
      type,
      source
    })

  } catch (error) {
    console.error('Media search error:', error)
    return NextResponse.json(
      { error: 'Failed to search media' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { brollScript, searchTerms } = await request.json()

    if (!brollScript) {
      return NextResponse.json(
        { error: 'B-roll script is required' },
        { status: 400 }
      )
    }

    console.log('🔍 Searching for enhanced B-roll media...')
    
    // Parse B-roll segments
    const segments = parseBrollSegments(brollScript)
    
    if (segments.length === 0) {
      return NextResponse.json(
        { error: 'No valid B-roll segments found in script' },
        { status: 400 }
      )
    }

    // Search for media for each segment
    const mediaResults: MediaSearchResult[] = []
    
    for (const segment of segments) {
      console.log(`Searching media for segment: ${segment.timeRange}`)
      
      // Extract keywords from primary and secondary visuals
      const primaryKeywords = extractKeywords(segment.primaryVisual)
      const secondaryKeywords = extractKeywords(segment.secondaryVisual)
      
      // Search for primary media (prefer videos for dynamic content)
      const primaryMedia = await searchMultipleSources(primaryKeywords, 'video', 4)
      
      // Search for secondary media (prefer images for overlays)
      const secondaryMedia = await searchMultipleSources(secondaryKeywords, 'image', 3)
      
      mediaResults.push({
        timeRange: segment.timeRange,
        primaryVisual: segment.primaryVisual,
        secondaryVisual: segment.secondaryVisual,
        textOverlay: segment.textOverlay,
        suggestedMedia: {
          primary: primaryMedia,
          secondary: secondaryMedia
        }
      })
    }

    console.log(`✅ Found media for ${mediaResults.length} segments`)

    return NextResponse.json({
      success: true,
      segments: mediaResults,
      totalSegments: segments.length,
      message: `Enhanced B-roll media search completed for ${segments.length} segments`
    })

  } catch (error: any) {
    console.error('❌ Enhanced media search error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to search for enhanced B-roll media',
        details: error.message 
      },
      { status: 500 }
    )
  }
}

function parseBrollSegments(brollScript: string) {
  const lines = brollScript.split('\n').filter(line => line.trim())
  const segments: Array<{
    timeRange: string
    primaryVisual: string
    secondaryVisual: string
    textOverlay: string
  }> = []
  
  for (const line of lines) {
    const timeMatch = line.match(/\[(\d+):(\d+)-(\d+):(\d+)\]/)
    if (!timeMatch) continue
    
    const timeRange = `${timeMatch[1]}:${timeMatch[2]}-${timeMatch[3]}:${timeMatch[4]}`
    const contentAfterTime = line.replace(timeMatch[0], '').trim()
    
    // Parse the format: Primary visual | Secondary visual | Text overlay
    const visualElements = contentAfterTime.split('|').map(s => s.trim())
    const primaryVisual = visualElements[0] || ''
    const secondaryVisual = visualElements[1] || ''
    const textOverlay = visualElements[2] || ''
    
    segments.push({
      timeRange,
      primaryVisual,
      secondaryVisual,
      textOverlay
    })
  }
  
  return segments
}

function extractKeywords(description: string): string {
  if (!description) return ''
  
  // Remove common words and extract meaningful keywords
  const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must']
  
  const words = description.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.includes(word))
  
  return words.slice(0, 3).join(' ') // Take top 3 keywords
}

async function searchMultipleSources(query: string, type: 'video' | 'image', limit: number = 5): Promise<MediaItem[]> {
  const results: MediaItem[] = []
  
  try {
    // Search Pexels (videos and photos)
    if (PEXELS_API_KEY) {
      const pexelsResults = await searchPexels(query, type, Math.ceil(limit / 2))
      results.push(...pexelsResults)
    }
    
    // Search Unsplash (photos only)
    if (type === 'image' && UNSPLASH_ACCESS_KEY) {
      const unsplashResults = await searchUnsplash(query, Math.ceil(limit / 2))
      results.push(...unsplashResults)
    }
    
    // Return requested number of results
    return results.slice(0, limit)
    
  } catch (error) {
    console.error(`Error searching for ${type} with query "${query}":`, error)
    return []
  }
}

async function searchPexels(query: string, type: 'video' | 'image', limit: number): Promise<MediaItem[]> {
  if (!PEXELS_API_KEY || !query.trim()) return []
  
  const endpoint = type === 'video' 
    ? `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${limit}&size=medium`
    : `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${limit}&size=medium`
  
  const response = await fetch(endpoint, {
    headers: {
      'Authorization': PEXELS_API_KEY
    }
  })
  
  if (!response.ok) return []
  
  const data = await response.json()
  
  if (type === 'video') {
    return (data.videos || []).map((video: any) => ({
      id: `pexels-video-${video.id}`,
      url: video.video_files?.[0]?.link || '',
      thumbnail: video.image || '',
      type: 'video' as const,
      duration: video.duration || 10,
      title: `Video by ${video.user?.name || 'Pexels'}`,
      source: 'pexels' as const
    })).filter((item: MediaItem) => item.url)
  } else {
    return (data.photos || []).map((photo: any) => ({
      id: `pexels-photo-${photo.id}`,
      url: photo.src?.large || photo.src?.original || '',
      thumbnail: photo.src?.medium || photo.src?.small || '',
      type: 'image' as const,
      title: photo.alt || `Photo by ${photo.photographer}`,
      source: 'pexels' as const
    })).filter((item: MediaItem) => item.url)
  }
}

async function searchUnsplash(query: string, limit: number): Promise<MediaItem[]> {
  if (!UNSPLASH_ACCESS_KEY || !query.trim()) return []
  
  const response = await fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${limit}&orientation=portrait`,
    {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    }
  )
  
  if (!response.ok) return []
  
  const data = await response.json()
  
  return (data.results || []).map((photo: any) => ({
    id: `unsplash-${photo.id}`,
    url: photo.urls?.regular || photo.urls?.full || '',
    thumbnail: photo.urls?.small || photo.urls?.thumb || '',
    type: 'image' as const,
    title: photo.alt_description || `Photo by ${photo.user?.name}`,
    source: 'unsplash' as const
  })).filter((item: MediaItem) => item.url)
} 