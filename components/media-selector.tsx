"use client"

import React, { useState, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Upload, 
  Search, 
  Play, 
  Image as ImageIcon, 
  Video, 
  Clock, 
  Check, 
  X,
  Loader2,
  RefreshCw
} from 'lucide-react'
import { cn } from "@/lib/utils"

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
  duration: number
  description: string
  selectedMedia?: MediaItem
}

interface MediaSelectorProps {
  segments: BrollSegment[]
  onMediaSelect: (timeRange: string, media: MediaItem) => void
  onMediaRemove: (timeRange: string) => void
  className?: string
}

export const MediaSelector: React.FC<MediaSelectorProps> = ({
  segments,
  onMediaSelect,
  onMediaRemove,
  className
}) => {
  const [searchResults, setSearchResults] = useState<MediaItem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [activeSegment, setActiveSegment] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Search for media on Pexels and Unsplash
  const searchMedia = async (query: string, type: 'video' | 'image' | 'both' = 'both') => {
    if (!query.trim()) return

    setIsSearching(true)
    try {
      const results: MediaItem[] = []

      // Search Pexels for videos
      if (type === 'video' || type === 'both') {
        const pexelsResponse = await fetch(`/api/search-media?query=${encodeURIComponent(query)}&type=video&source=pexels`)
        if (pexelsResponse.ok) {
          const pexelsData = await pexelsResponse.json()
          results.push(...pexelsData.media)
        }
      }

      // Search Unsplash for images
      if (type === 'image' || type === 'both') {
        const unsplashResponse = await fetch(`/api/search-media?query=${encodeURIComponent(query)}&type=image&source=unsplash`)
        if (unsplashResponse.ok) {
          const unsplashData = await unsplashResponse.json()
          results.push(...unsplashData.media)
        }
      }

      setSearchResults(results)
    } catch (error) {
      console.error('Media search failed:', error)
    } finally {
      setIsSearching(false)
    }
  }

  // Handle file upload
  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files || !activeSegment) return

    Array.from(files).forEach(file => {
      const isVideo = file.type.startsWith('video/')
      const isImage = file.type.startsWith('image/')
      
      if (!isVideo && !isImage) return

      const url = URL.createObjectURL(file)
      const media: MediaItem = {
        id: `upload_${Date.now()}_${Math.random()}`,
        url,
        thumbnail: isImage ? url : url, // For videos, we'd generate thumbnail
        type: isVideo ? 'video' : 'image',
        title: file.name,
        source: 'user_upload'
      }

      onMediaSelect(activeSegment, media)
      setActiveSegment(null)
    })
  }, [activeSegment, onMediaSelect])

  // Auto-search based on segment description
  const autoSearchForSegment = async (segment: BrollSegment) => {
    const keywords = extractKeywords(segment.description)
    if (keywords.length > 0) {
      await searchMedia(keywords.join(' '))
    }
  }

  // Extract relevant keywords from B-roll description
  const extractKeywords = (description: string): string[] => {
    const cleanDesc = description.toLowerCase()
    const keywords: string[] = []

    // Technology terms
    if (cleanDesc.includes('code') || cleanDesc.includes('programming')) {
      keywords.push('programming', 'code', 'developer')
    }
    if (cleanDesc.includes('laptop') || cleanDesc.includes('computer')) {
      keywords.push('laptop', 'computer', 'technology')
    }
    if (cleanDesc.includes('office') || cleanDesc.includes('workspace')) {
      keywords.push('office', 'workspace', 'business')
    }
    if (cleanDesc.includes('meeting') || cleanDesc.includes('team')) {
      keywords.push('business meeting', 'team collaboration')
    }
    if (cleanDesc.includes('city') || cleanDesc.includes('urban')) {
      keywords.push('city', 'urban', 'skyline')
    }

    // If no specific keywords, use the description directly
    if (keywords.length === 0) {
      keywords.push(description.split(' ').slice(0, 3).join(' '))
    }

    return keywords
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className={cn("space-y-6", className)}>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Dynamic Media Selection</h3>
        <p className="text-sm text-gray-600">
          Select videos or images for each B-roll segment. You can search stock media or upload your own files.
        </p>
      </div>

      {/* Segment List */}
      <div className="space-y-4">
        {segments.map((segment) => (
          <Card key={segment.timeRange} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {segment.timeRange}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    ({segment.duration}s)
                  </span>
                </div>
                
                {segment.selectedMedia ? (
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs">
                      {segment.selectedMedia.type === 'video' ? (
                        <Video className="w-3 h-3 mr-1" />
                      ) : (
                        <ImageIcon className="w-3 h-3 mr-1" />
                      )}
                      Selected
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onMediaRemove(segment.timeRange)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setActiveSegment(segment.timeRange)
                      autoSearchForSegment(segment)
                    }}
                  >
                    Select Media
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-gray-700 mb-3">{segment.description}</p>
              
              {/* Selected Media Preview */}
              {segment.selectedMedia && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="relative w-16 h-16 rounded overflow-hidden bg-gray-200">
                    <img
                      src={segment.selectedMedia.thumbnail}
                      alt="Selected media"
                      className="w-full h-full object-cover"
                    />
                    {segment.selectedMedia.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {segment.selectedMedia.title || 'Selected Media'}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {segment.selectedMedia.source} • {segment.selectedMedia.type}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Media Selection Modal */}
      {activeSegment && (
        <Card className="fixed inset-4 z-50 bg-white shadow-xl rounded-lg overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <CardTitle className="text-lg">
              Select Media for {activeSegment}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveSegment(null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <CardContent className="p-0 h-full overflow-hidden">
            <Tabs defaultValue="search" className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-2 rounded-none border-b">
                <TabsTrigger value="search">Search Stock Media</TabsTrigger>
                <TabsTrigger value="upload">Upload Files</TabsTrigger>
              </TabsList>

              <TabsContent value="search" className="flex-1 overflow-hidden p-4">
                <div className="space-y-4 h-full flex flex-col">
                  {/* Search Input */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search for videos and images..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchMedia(searchQuery)}
                    />
                    <Button
                      onClick={() => searchMedia(searchQuery)}
                      disabled={isSearching}
                    >
                      {isSearching ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  {/* Search Results */}
                  <div className="flex-1 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {searchResults.map((media) => (
                          <div
                            key={media.id}
                            className="group cursor-pointer"
                            onClick={() => {
                              onMediaSelect(activeSegment, media)
                              setActiveSegment(null)
                            }}
                          >
                            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-200">
                              <img
                                src={media.thumbnail}
                                alt={media.title || 'Media'}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                                {media.type === 'video' ? (
                                  <Play className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                ) : (
                                  <ImageIcon className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                              </div>
                              <div className="absolute top-2 left-2">
                                <Badge variant="secondary" className="text-xs">
                                  {media.type}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 truncate">
                              {media.title || 'Untitled'}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                        <Search className="w-12 h-12 mb-4" />
                        <p>Search for videos and images to add to your reel</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="upload" className="flex-1 p-4">
                <div className="h-full flex flex-col items-center justify-center space-y-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="video/*,image/*"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                  
                  <div className="text-center space-y-4">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                      <h3 className="text-lg font-medium">Upload Your Media</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Upload videos (MP4, MOV, AVI) or images (JPG, PNG, GIF)
                      </p>
                    </div>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-4"
                    >
                      Choose Files
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Backdrop */}
      {activeSegment && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setActiveSegment(null)}
        />
      )}
    </div>
  )
} 