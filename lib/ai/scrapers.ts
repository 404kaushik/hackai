import puppeteer from 'puppeteer'

export async function scrapeLinkedInProfile(url: string) {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  
  try {
    const page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
    
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })

    const profileData = await page.evaluate(() => {
      const getTextContent = (selector: string) => {
        const element = document.querySelector(selector)
        return element?.textContent?.trim() || null
      }

      return {
        name: getTextContent('h1.text-heading-xlarge') || getTextContent('.pv-text-details__left-panel h1'),
        headline: getTextContent('.text-body-medium.break-words') || getTextContent('.pv-text-details__left-panel .text-body-medium'),
        about: getTextContent('#about + * .pv-shared-text-with-see-more .visually-hidden') || 
               getTextContent('.pv-about-section .pv-about__summary-text')
      }
    })

    return profileData
  } finally {
    await browser.close()
  }
}

export async function scrapeYouTubeChannel(url: string) {
  const channelMatch = url.match(/(?:channel\/|@|user\/)([^\/\?]+)/)
  if (!channelMatch) {
    throw new Error("Invalid YouTube URL format")
  }

  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    throw new Error("YouTube API key not configured")
  }

  try {
    let channelId = channelMatch[1]
    
    // If it's a handle (starts with @), get channel ID first
    if (url.includes('@')) {
      const searchResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${channelId}&key=${apiKey}`
      )
      const searchData = await searchResponse.json()
      channelId = searchData.items?.[0]?.snippet?.channelId
    }

    // Get channel details
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`
    )
    const channelData = await channelResponse.json()

    // Get recent videos
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=5&key=${apiKey}`
    )
    const videosData = await videosResponse.json()

    const channel = channelData.items?.[0]
    const videos = videosData.items || []

    return {
      channelName: channel?.snippet?.title,
      description: channel?.snippet?.description,
      subscriberCount: channel?.statistics?.subscriberCount,
      recentVideos: videos.map((video: any) => ({
        title: video.snippet.title,
        description: video.snippet.description,
        publishedAt: video.snippet.publishedAt
      })),
      contentStyle: analyzeContentStyle(videos)
    }
  } catch (error: any) {
    throw new Error(`YouTube API error: ${error.message}`)
  }
}

function analyzeContentStyle(videos: any[]) {
  const titles = videos.map(v => v.snippet?.title?.toLowerCase() || '').join(' ')
  const descriptions = videos.map(v => v.snippet?.description?.toLowerCase() || '').join(' ')
  
  const styleIndicators = {
    educational: /tutorial|how to|learn|guide|explain|tips/.test(titles + descriptions),
    entertainment: /funny|fun|comedy|reaction|challenge/.test(titles + descriptions),
    professional: /business|professional|industry|strategy|analysis/.test(titles + descriptions),
    personal: /my|personal|story|experience|journey/.test(titles + descriptions),
  }

  return Object.entries(styleIndicators)
    .filter(([_, matches]) => matches)
    .map(([style]) => style)
} 