"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { 
  Settings, 
  Monitor, 
  Smartphone, 
  Tablet,
  Zap,
  Clock,
  HardDrive,
  Eye,
  Square,
  Maximize2,
  PictureInPicture
} from 'lucide-react'
import { cn } from "@/lib/utils"

export interface CompositionSettings {
  width: number
  height: number
  fps: number
  format: 'mp4' | 'webm'
  quality: 'high' | 'medium' | 'low'
  overlayStyle: 'pip' | 'split' | 'fullscreen'
  overlaySize: number // Percentage for PIP mode
}

interface CompositionSettingsProps {
  settings: CompositionSettings
  onSettingsChange: (settings: CompositionSettings) => void
  className?: string
}

const presetResolutions = [
  { name: 'TikTok/Reels', width: 720, height: 1280, icon: Smartphone, aspect: '9:16' },
  { name: 'YouTube Shorts', width: 1080, height: 1920, icon: Smartphone, aspect: '9:16' },
  { name: 'Instagram Story', width: 1080, height: 1920, icon: Smartphone, aspect: '9:16' },
  { name: 'YouTube Video', width: 1920, height: 1080, icon: Monitor, aspect: '16:9' },
  { name: 'Square (Instagram)', width: 1080, height: 1080, icon: Square, aspect: '1:1' },
]

const qualityPresets = [
  { 
    name: 'High', 
    value: 'high' as const, 
    icon: Zap,
    description: 'Best quality, larger file size',
    estimatedSize: '~50MB/min',
    renderTime: '~3x longer'
  },
  { 
    name: 'Medium', 
    value: 'medium' as const, 
    icon: Eye,
    description: 'Balanced quality and file size',
    estimatedSize: '~25MB/min',
    renderTime: '~2x longer'
  },
  { 
    name: 'Low', 
    value: 'low' as const, 
    icon: Clock,
    description: 'Faster processing, smaller files',
    estimatedSize: '~15MB/min',
    renderTime: '~1x baseline'
  }
]

const overlayStyles = [
  {
    name: 'Picture-in-Picture',
    value: 'pip' as const,
    icon: PictureInPicture,
    description: 'B-roll appears in corner overlay'
  },
  {
    name: 'Split Screen',
    value: 'split' as const,
    icon: Square,
    description: 'Avatar and B-roll side by side'
  },
  {
    name: 'Full Screen',
    value: 'fullscreen' as const,
    icon: Maximize2,
    description: 'B-roll replaces avatar during segments'
  }
]

export const CompositionSettings: React.FC<CompositionSettingsProps> = ({
  settings,
  onSettingsChange,
  className
}) => {
  const updateSettings = (updates: Partial<CompositionSettings>) => {
    onSettingsChange({ ...settings, ...updates })
  }

  const selectedResolution = presetResolutions.find(
    preset => preset.width === settings.width && preset.height === settings.height
  )

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Settings className="w-5 h-5" />
          <span>Composition Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="resolution" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="resolution">Resolution</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
            <TabsTrigger value="overlay">Overlay</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="resolution" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {presetResolutions.map((preset) => {
                const Icon = preset.icon
                const isSelected = preset.width === settings.width && preset.height === settings.height
                
                return (
                  <button
                    key={preset.name}
                    onClick={() => updateSettings({ width: preset.width, height: preset.height })}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all text-left",
                      isSelected 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className={cn("w-5 h-5 mt-0.5", isSelected ? "text-blue-600" : "text-gray-500")} />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{preset.name}</div>
                        <div className="text-xs text-gray-500">{preset.width}×{preset.height}</div>
                        <Badge variant="outline" className="text-xs mt-1">{preset.aspect}</Badge>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {selectedResolution && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-sm font-medium text-blue-900">Selected: {selectedResolution.name}</div>
                <div className="text-xs text-blue-700">
                  {selectedResolution.width}×{selectedResolution.height} ({selectedResolution.aspect})
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="quality" className="space-y-4">
            <div className="space-y-3">
              {qualityPresets.map((preset) => {
                const Icon = preset.icon
                const isSelected = preset.value === settings.quality
                
                return (
                  <button
                    key={preset.value}
                    onClick={() => updateSettings({ quality: preset.value })}
                    className={cn(
                      "w-full p-4 rounded-lg border-2 transition-all text-left",
                      isSelected 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className={cn("w-5 h-5 mt-0.5", isSelected ? "text-blue-600" : "text-gray-500")} />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{preset.name} Quality</div>
                        <div className="text-xs text-gray-600 mb-2">{preset.description}</div>
                        <div className="flex space-x-4 text-xs">
                          <div className="flex items-center space-x-1">
                            <HardDrive className="w-3 h-3" />
                            <span>{preset.estimatedSize}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{preset.renderTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="overlay" className="space-y-4">
            <div className="space-y-3">
              {overlayStyles.map((style) => {
                const Icon = style.icon
                const isSelected = style.value === settings.overlayStyle
                
                return (
                  <button
                    key={style.value}
                    onClick={() => updateSettings({ overlayStyle: style.value })}
                    className={cn(
                      "w-full p-4 rounded-lg border-2 transition-all text-left",
                      isSelected 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className={cn("w-5 h-5 mt-0.5", isSelected ? "text-blue-600" : "text-gray-500")} />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{style.name}</div>
                        <div className="text-xs text-gray-600">{style.description}</div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {settings.overlayStyle === 'pip' && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="text-sm font-medium">Picture-in-Picture Size</div>
                <div className="space-y-2">
                  <Slider
                    value={[settings.overlaySize]}
                    onValueChange={([value]) => updateSettings({ overlaySize: value })}
                    min={20}
                    max={50}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Small (20%)</span>
                    <span className="font-medium">{settings.overlaySize}%</span>
                    <span>Large (50%)</span>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Frame Rate (FPS)</label>
                <div className="mt-2 space-y-2">
                  <Slider
                    value={[settings.fps]}
                    onValueChange={([value]) => updateSettings({ fps: value })}
                    min={24}
                    max={60}
                    step={6}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>24 FPS</span>
                    <span className="font-medium">{settings.fps} FPS</span>
                    <span>60 FPS</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Output Format</label>
                <div className="flex space-x-3">
                  <button
                    onClick={() => updateSettings({ format: 'mp4' })}
                    className={cn(
                      "px-4 py-2 rounded-lg border text-sm transition-all",
                      settings.format === 'mp4'
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    MP4 (Recommended)
                  </button>
                  <button
                    onClick={() => updateSettings({ format: 'webm' })}
                    className={cn(
                      "px-4 py-2 rounded-lg border text-sm transition-all",
                      settings.format === 'webm'
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                  >
                    WebM
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 