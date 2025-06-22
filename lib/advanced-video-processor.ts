import ffmpeg from 'fluent-ffmpeg'
import { promises as fs } from 'fs'
import path from 'path'

export interface MediaItem {
  id: string
  url: string
  thumbnail: string
  type: 'video' | 'image'
  duration?: number
  title?: string
  source: 'pexels' | 'unsplash' | 'user_upload'
}

export interface BrollSegment {
  timeRange: string
  startTime: number
  endTime: number
  description: string
  primaryVisual?: string
  secondaryVisual?: string
  textOverlay?: string
  selectedMedia?: MediaItem[]
  visualElements?: {
    primary?: MediaItem
    secondary?: MediaItem
    textOverlay?: string
  }
}

export interface CompositionSettings {
  width: number
  height: number
  fps: number
  format: 'mp4' | 'webm'
  quality: 'high' | 'medium' | 'low'
}

export interface ProcessingProgress {
  stage: string
  progress: number
  currentSegment?: number
  totalSegments?: number
}

export class AdvancedVideoProcessor {
  private tempDir: string
  private outputDir: string

  constructor() {
    this.tempDir = path.join(process.cwd(), 'temp', 'video-processing')
    this.outputDir = path.join(process.cwd(), 'public', 'generated-videos')
  }

  async initialize() {
    await fs.mkdir(this.tempDir, { recursive: true })
    await fs.mkdir(this.outputDir, { recursive: true })
  }

  async downloadMedia(url: string, filename: string): Promise<string> {
    const filePath = path.join(this.tempDir, filename)
    
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to download media: ${response.statusText}`)
      }
      
      const buffer = await response.arrayBuffer()
      await fs.writeFile(filePath, Buffer.from(buffer))
      
      return filePath
    } catch (error) {
      console.error(`Error downloading media from ${url}:`, error)
      throw error
    }
  }

  async getVideoDuration(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          reject(err)
          return
        }
        
        const duration = metadata.format.duration || 0
        resolve(duration)
      })
    })
  }

  async composeVideoWithOverlays(
    avatarVideoUrl: string,
    segments: BrollSegment[],
    settings: CompositionSettings = {
      width: 720,
      height: 1280,
      fps: 30,
      format: 'mp4',
      quality: 'medium'
    },
    onProgress?: (progress: ProcessingProgress) => void
  ): Promise<string> {
    await this.initialize()
    
    const sessionId = Date.now().toString()
    const tempSessionDir = path.join(this.tempDir, sessionId)
    await fs.mkdir(tempSessionDir, { recursive: true })

    try {
      onProgress?.({
        stage: 'Downloading avatar video...',
        progress: 10
      })

      // Download avatar video
      const avatarPath = await this.downloadMedia(
        avatarVideoUrl,
        path.join(sessionId, 'avatar.mp4')
      )

      // Get avatar video duration
      const avatarDuration = await this.getVideoDuration(avatarPath)
      console.log('Avatar video duration:', avatarDuration)

      onProgress?.({
        stage: 'Processing B-roll media...',
        progress: 20
      })

      // Download and prepare B-roll media
      const mediaFiles: { [timeRange: string]: string[] } = {} // Changed to support multiple files per segment
      const segmentsWithMedia = segments.filter(s => s.selectedMedia && s.selectedMedia.length > 0)
      
      for (let i = 0; i < segmentsWithMedia.length; i++) {
        const segment = segmentsWithMedia[i]
        
        onProgress?.({
          stage: `Downloading B-roll ${i + 1}/${segmentsWithMedia.length}...`,
          progress: 20 + (i / segmentsWithMedia.length) * 30,
          currentSegment: i + 1,
          totalSegments: segmentsWithMedia.length
        })

        if (segment.selectedMedia && segment.selectedMedia.length > 0) {
          mediaFiles[segment.timeRange] = []
          
          for (let j = 0; j < segment.selectedMedia.length; j++) {
            const media = segment.selectedMedia[j]
            const extension = media.type === 'image' ? 'jpg' : 'mp4'
            const mediaPath = await this.downloadMedia(
              media.url,
              path.join(sessionId, `broll_${i}_${j}.${extension}`)
            )
            mediaFiles[segment.timeRange].push(mediaPath)
          }
        }
      }

      onProgress?.({
        stage: 'Creating video composition...',
        progress: 60
      })

      // Create the final composition with overlays
      const outputFileName = `composed_${sessionId}.mp4`
      const outputPath = path.join(this.outputDir, outputFileName)

      await this.createTimelineComposition(
        avatarPath,
        mediaFiles,
        segments,
        outputPath,
        settings,
        avatarDuration,
        (progress) => {
          onProgress?.({
            stage: 'Rendering final video...',
            progress: 60 + (progress * 0.35) // 60% to 95%
          })
        }
      )

      onProgress?.({
        stage: 'Finalizing...',
        progress: 95
      })

      // Cleanup temp files
      await this.cleanup(tempSessionDir)

      onProgress?.({
        stage: 'Complete!',
        progress: 100
      })

      return `/generated-videos/${outputFileName}`

    } catch (error) {
      await this.cleanup(tempSessionDir)
      throw error
    }
  }

  private async createTimelineComposition(
    avatarPath: string,
    mediaFiles: { [timeRange: string]: string[] },
    segments: BrollSegment[],
    outputPath: string,
    settings: CompositionSettings,
    avatarDuration: number,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const command = ffmpeg()
      
      // Add avatar video as input 0
      command.input(avatarPath)
      
      // Add all B-roll media as additional inputs
      const mediaInputMap: { [key: string]: number } = {} // Changed to support multiple inputs per segment
      let inputIndex = 1
      
      Object.entries(mediaFiles).forEach(([timeRange, filePaths]) => {
        filePaths.forEach((filePath, fileIndex) => {
          command.input(filePath)
          mediaInputMap[`${timeRange}_${fileIndex}`] = inputIndex
          inputIndex++
        })
      })

      // Build complex filter for overlays
      let filterComplex = ''
      let currentStream = '0:v' // Start with avatar video
      
      // Sort segments by start time to ensure proper overlay order
      const sortedSegments = segments
        .filter(s => s.selectedMedia && mediaFiles[s.timeRange] && mediaFiles[s.timeRange].length > 0)
        .sort((a, b) => a.startTime - b.startTime)

      sortedSegments.forEach((segment, index) => {
        const duration = segment.endTime - segment.startTime
        
        if (segment.selectedMedia && segment.selectedMedia.length > 0) {
          segment.selectedMedia.forEach((mediaItem, mediaIndex) => {
            const inputIndex = mediaInputMap[`${segment.timeRange}_${mediaIndex}`]
            const scaledStream = `scaled_${index}_${mediaIndex}`
            const overlayStream = `overlay_${index}_${mediaIndex}`
            
            // Create different overlay positions for multiple media items
            let pipX, pipY, pipWidth, pipHeight
            
            if (mediaIndex === 0) {
              // Primary media - larger, top-right
              pipWidth = Math.floor(settings.width * 0.4) // 40% of main video width
              pipHeight = Math.floor(settings.height * 0.35) // 35% of main video height
              pipX = settings.width - pipWidth - 10
              pipY = 10
            } else {
              // Secondary media - smaller, bottom-right
              pipWidth = Math.floor(settings.width * 0.25) // 25% of main video width
              pipHeight = Math.floor(settings.height * 0.2) // 20% of main video height
              pipX = settings.width - pipWidth - 10
              pipY = settings.height - pipHeight - 10
            }
            
            if (mediaItem.type === 'image') {
              // For images, create a video stream with the specified duration
              filterComplex += `[${inputIndex}:v]scale=${pipWidth}:${pipHeight}:force_original_aspect_ratio=decrease,pad=${pipWidth}:${pipHeight}:(ow-iw)/2:(oh-ih)/2,setpts=PTS-STARTPTS,loop=loop=-1:size=1:start=0[${scaledStream}];`
            } else {
              // For videos, scale and loop if necessary
              filterComplex += `[${inputIndex}:v]scale=${pipWidth}:${pipHeight}:force_original_aspect_ratio=decrease,pad=${pipWidth}:${pipHeight}:(ow-iw)/2:(oh-ih)/2,setpts=PTS-STARTPTS[${scaledStream}];`
            }
            
            // Overlay B-roll on current stream at specific time
            filterComplex += `[${currentStream}][${scaledStream}]overlay=${pipX}:${pipY}:enable='between(t,${segment.startTime},${segment.endTime})'[${overlayStream}];`
            
            currentStream = overlayStream
          })
        }
      })

      // Remove the trailing semicolon
      if (filterComplex.endsWith(';')) {
        filterComplex = filterComplex.slice(0, -1)
      }

      console.log('FFmpeg filter complex:', filterComplex)

      if (filterComplex) {
        command.complexFilter(filterComplex)
        command.outputOptions(['-map', `[${currentStream}]`, '-map', '0:a'])
      } else {
        // No overlays, just use original avatar video
        command.outputOptions(['-map', '0:v', '-map', '0:a'])
      }

      command
        .size(`${settings.width}x${settings.height}`)
        .fps(settings.fps)
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions([
          '-preset', this.getPreset(settings.quality),
          '-crf', this.getCRF(settings.quality),
          '-pix_fmt', 'yuv420p',
          '-movflags', '+faststart',
          '-t', avatarDuration.toString() // Limit to avatar duration
        ])
        .output(outputPath)
        .on('progress', (progress) => {
          onProgress?.(progress.percent || 0)
        })
        .on('end', () => {
          console.log('✅ Video composition completed successfully!')
          resolve()
        })
        .on('error', (err) => {
          console.error('❌ FFmpeg composition error:', err)
          reject(err)
        })
        .run()
    })
  }

  private async cleanup(sessionDir: string) {
    try {
      await fs.rm(sessionDir, { recursive: true, force: true })
    } catch (error) {
      console.warn('Cleanup warning:', error)
    }
  }

  private getPreset(quality: string): string {
    switch (quality) {
      case 'high': return 'slow'
      case 'medium': return 'medium'
      case 'low': return 'fast'
      default: return 'medium'
    }
  }

  private getCRF(quality: string): string {
    switch (quality) {
      case 'high': return '18'
      case 'medium': return '23'
      case 'low': return '28'
      default: return '23'
    }
  }
}

export const advancedVideoProcessor = new AdvancedVideoProcessor() 