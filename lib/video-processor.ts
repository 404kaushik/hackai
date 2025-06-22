import ffmpeg from 'fluent-ffmpeg'
import { promises as fs } from 'fs'
import path from 'path'
import { Readable } from 'stream'

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
  selectedMedia?: MediaItem
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

export class VideoProcessor {
  private tempDir: string
  private outputDir: string

  constructor() {
    this.tempDir = path.join(process.cwd(), 'temp', 'video-processing')
    this.outputDir = path.join(process.cwd(), 'public', 'generated-videos')
  }

  async initialize() {
    // Create directories if they don't exist
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

  async createVideoSegment(
    inputPath: string,
    startTime: number,
    duration: number,
    outputPath: string,
    settings: CompositionSettings
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .seekInput(startTime)
        .duration(duration)
        .size(`${settings.width}x${settings.height}`)
        .fps(settings.fps)
        .videoCodec('libx264')
        .audioCodec('aac')
        .outputOptions([
          '-preset', this.getPreset(settings.quality),
          '-crf', this.getCRF(settings.quality),
          '-pix_fmt', 'yuv420p'
        ])
        .output(outputPath)
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run()
    })
  }

  async createImageSegment(
    imagePath: string,
    duration: number,
    outputPath: string,
    settings: CompositionSettings
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(imagePath)
        .inputOptions([
          '-loop', '1',
          '-t', duration.toString()
        ])
        .size(`${settings.width}x${settings.height}`)
        .fps(settings.fps)
        .videoCodec('libx264')
        .outputOptions([
          '-preset', this.getPreset(settings.quality),
          '-crf', this.getCRF(settings.quality),
          '-pix_fmt', 'yuv420p'
        ])
        .output(outputPath)
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run()
    })
  }

  async composeVideo(
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

      onProgress?.({
        stage: 'Processing B-roll segments...',
        progress: 20
      })

      // Download and prepare B-roll media
      const segmentPaths: string[] = []
      let segmentIndex = 0

      for (const segment of segments) {
        if (segment.selectedMedia) {
          onProgress?.({
            stage: `Processing segment ${segmentIndex + 1}/${segments.length}...`,
            progress: 20 + (segmentIndex / segments.length) * 30,
            currentSegment: segmentIndex + 1,
            totalSegments: segments.length
          })

          const mediaPath = await this.downloadMedia(
            segment.selectedMedia.url,
            path.join(sessionId, `segment_${segmentIndex}.${segment.selectedMedia.type === 'image' ? 'jpg' : 'mp4'}`)
          )

          const outputSegmentPath = path.join(tempSessionDir, `processed_segment_${segmentIndex}.mp4`)

          if (segment.selectedMedia.type === 'image') {
            await this.createImageSegment(
              mediaPath,
              segment.endTime - segment.startTime,
              outputSegmentPath,
              settings
            )
          } else {
            await this.createVideoSegment(
              mediaPath,
              0, // Start from beginning of B-roll video
              segment.endTime - segment.startTime,
              outputSegmentPath,
              settings
            )
          }

          segmentPaths.push(outputSegmentPath)
        }
        segmentIndex++
      }

      onProgress?.({
        stage: 'Creating composition timeline...',
        progress: 60
      })

      // Create the final composition
      const outputFileName = `composed_${sessionId}.mp4`
      const outputPath = path.join(this.outputDir, outputFileName)

      await this.createFinalComposition(
        avatarPath,
        segmentPaths,
        segments,
        outputPath,
        settings,
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

      // Return the URL path for the generated video
      return `/generated-videos/${outputFileName}`

    } catch (error) {
      // Cleanup on error
      await this.cleanup(tempSessionDir)
      throw error
    }
  }

  private async createFinalComposition(
    avatarPath: string,
    segmentPaths: string[],
    segments: BrollSegment[],
    outputPath: string,
    settings: CompositionSettings,
    onProgress?: (progress: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // For now, we'll create a simple composition where B-roll segments replace avatar segments
      // In a more advanced implementation, you could overlay B-roll as picture-in-picture
      
      const command = ffmpeg()
      
      // Add avatar video as main input
      command.input(avatarPath)
      
      // Add all B-roll segments as inputs
      segmentPaths.forEach(segmentPath => {
        command.input(segmentPath)
      })

      // Create filter complex for timeline composition
      let filterComplex = ''
      let currentInput = 0 // Avatar video input
      
      // For simplicity, we'll concatenate segments in order
      // More advanced: overlay B-roll on avatar during specific time ranges
      
      if (segmentPaths.length > 0) {
        // Create a simple concatenation of avatar + B-roll segments
        const inputs = ['0:v:0', '0:a:0'] // Avatar video and audio
        
        segmentPaths.forEach((_, index) => {
          inputs.push(`${index + 1}:v:0`)
          if (index === 0) {
            inputs.push(`${index + 1}:a:0`) // Only use audio from first B-roll if available
          }
        })
        
        filterComplex = `concat=n=${segmentPaths.length + 1}:v=1:a=1[outv][outa]`
        
        command
          .complexFilter(filterComplex)
          .outputOptions([
            '-map', '[outv]',
            '-map', '[outa]'
          ])
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
          '-movflags', '+faststart' // Optimize for web playback
        ])
        .output(outputPath)
        .on('progress', (progress) => {
          onProgress?.(progress.percent || 0)
        })
        .on('end', () => resolve())
        .on('error', (err) => {
          console.error('FFmpeg composition error:', err)
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

export const videoProcessor = new VideoProcessor() 