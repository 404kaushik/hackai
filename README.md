# Enhanced AI Avatar Video Generator with Advanced B-roll

## New B-roll Features

### Enhanced B-roll Script Generation
The system now generates detailed B-roll scripts with multiple visual elements per segment:

```
[00:00-00:03] Close-up product demonstration | Trending zoom transition | "Game Changer Alert!"
[00:03-00:06] Split-screen before/after | Animated arrow pointing | "See The Difference"
[00:06-00:09] User testimonial footage | Floating text bubble | "Real Results"
```

Each segment includes:
- **Primary Visual**: Main B-roll footage/image
- **Secondary Visual**: Additional overlays, effects, or graphics  
- **Text Overlay**: Specific text, statistics, or call-to-action

### Advanced Video Composition
- **Multiple Media per Segment**: Support for both primary and secondary media overlays
- **Dynamic Positioning**: Primary media appears larger (40% of screen) in top-right, secondary media smaller (25% of screen) in bottom-right
- **Enhanced Visual Impact**: More detailed and granular B-roll segments (10-15 segments per video)
- **Vertical Video Optimization**: Optimized for 9:16 aspect ratio social media platforms

### Smart Media Search
New `/api/search-media` endpoint automatically finds relevant media for each B-roll segment:
- Extracts keywords from visual descriptions
- Searches multiple sources (Pexels, Unsplash)
- Returns multiple media options per segment
- Prioritizes videos for primary visuals, images for secondary overlays

## Usage

### 1. Generate Enhanced Scripts
```bash
POST /api/generate-script
{
  "idea": "top 5 parks in toronto",
  "analysis": {...},
  "personalData": {...}
}
```

### 2. Auto-Search B-roll Media
```bash
POST /api/search-media
{
  "brollScript": "[00:00-00:03] Park scenery | People walking | 'Best Parks'"
}
```

### 3. Compose Video with Multiple Overlays
```bash
POST /api/compose-video
{
  "aRollScript": "...",
  "bRollScript": "...",
  "avatarVideoUrl": "...",
  "selectedMedia": {
    "00:00-00:03": [primaryMedia, secondaryMedia]
  }
}
```

## Key Improvements

✅ **More B-roll Segments**: 10-15 segments vs previous 3-5 segments
✅ **Multiple Visual Elements**: 2-3 visual elements per segment
✅ **Better Positioning**: Dynamic overlay positioning for multiple media
✅ **Smart Media Search**: Automatic media discovery based on visual descriptions
✅ **Enhanced Composition**: Support for primary and secondary overlays
✅ **Vertical Video Focus**: Optimized for social media platforms

The enhanced system provides significantly more B-roll opportunities and visual variety in your AI avatar videos. 