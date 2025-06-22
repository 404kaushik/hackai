export interface MarketAnalysisData {
    executiveSummary: {
      targetAudience: string
      bestHook: string
      contentFormat: string
      topCompetitors: string[]
      opportunityGap: string
      confidenceLevel: string // e.g., "85% audience targeting • 92% content trends"
    }
    audienceProfile: {
      demographics: {
        ageRange: string
        gender: string
        location: string
        interests: string // Changed from education for broader scope
      }
      viewingPreferences: {
        primaryPlatform: string
        bestTimes: string
        duration: string // e.g., "15-60 seconds"
        keyMotivators: string
      }
    }
    contentStrategy: {
      topPerformingContent: Array<{ title: string; engagement: string }> // e.g., engagement: "12.3%"
      winningFormats: {
        popularHooks: string[]
        contentTypes: string[]
      }
    }
    keyCompetitors: Array<{
      name: string
      stats: string // e.g., "1.2M followers • 8.5% engagement"
      strengths: string
      opportunity: string // Your opportunity when comparing to this competitor
    }>
    growthOpportunities: {
      underservedAudiences: Array<{ title: string; description: string }>
      contentAngles: {
        categorySpecific: string[] // e.g., "Canadian-Specific Tech Content"
        trendingMicrotrends: string[]
      }
    }
  }
  
  // Schema for structured output from AI for Market Analysis
  import { z } from "zod"
  
  export const MarketAnalysisSchema = z.object({
    executiveSummary: z.object({
      targetAudience: z.string().describe("Detailed description of the primary target audience."),
      bestHook: z.string().describe("The most effective hook to capture attention."),
      contentFormat: z.string().describe("Recommended content format (e.g., fast-paced storytelling)."),
      topCompetitors: z.array(z.string()).describe("List of key competitor creators or content types."),
      opportunityGap: z.string().describe("Identified gap in the current market or content landscape."),
      confidenceLevel: z
        .string()
        .describe("AI's confidence in these insights, e.g., '85% audience targeting • 92% content trends'."),
    }),
    audienceProfile: z.object({
      demographics: z.object({
        ageRange: z.string().describe("Primary age range of the target audience."),
        gender: z.string().describe("Gender distribution."),
        location: z.string().describe("Key geographical locations."),
        interests: z
          .string()
          .describe("Primary interests, hobbies, or professional background (e.g., CS students, tech enthusiasts)."),
      }),
      viewingPreferences: z.object({
        primaryPlatform: z.string().describe("Main social media platform(s) where the audience consumes content."),
        bestTimes: z.string().describe("Optimal times for posting content."),
        duration: z.string().describe("Preferred video duration."),
        keyMotivators: z.string().describe("What motivates the audience to engage with content."),
      }),
    }),
    contentStrategy: z.object({
      topPerformingContent: z
        .array(
          z.object({
            title: z.string().describe("Example title of top-performing content."),
            engagement: z
              .string()
              .describe("Typical engagement rate or metric, e.g., '10.5% engagement' or 'High virality'."),
          }),
        )
        .describe("Examples of content titles and their typical engagement metrics."),
      winningFormats: z.object({
        popularHooks: z.array(z.string()).describe("List of effective hook strategies or phrases."),
        contentTypes: z.array(z.string()).describe("Popular content types (e.g., Tutorial, BTS, Challenge)."),
      }),
    }),
    keyCompetitors: z
      .array(
        z.object({
          name: z.string().describe("Name of the competitor."),
          stats: z.string().describe("Brief stats like follower count and engagement rate."),
          strengths: z.string().describe("Key strengths of the competitor."),
          opportunity: z.string().describe("Potential opportunity for differentiation."),
        }),
      )
      .describe("Analysis of key competitors."),
    growthOpportunities: z.object({
      underservedAudiences: z
        .array(
          z.object({
            title: z.string().describe("Name of the underserved audience segment."),
            description: z.string().describe("Brief description of this audience and their needs."),
          }),
        )
        .describe("Niche audiences that are currently underserved."),
      contentAngles: z.object({
        categorySpecific: z.array(z.string()).describe("Specific content angles relevant to the idea's category."),
        trendingMicrotrends: z.array(z.string()).describe("Current microtrends to leverage."),
      }),
    }),
  })
  
  export const ScriptGenerationSchema = z.object({
    aRollScript: z
      .string()
      .describe("The A-Roll script (spoken content with timestamps, e.g., [0:00-0:05] A-ROLL: ...)."),
    bRollScript: z
      .string()
      .describe(
        "The B-Roll script (visual cues and instructions aligned with A-Roll timestamps, e.g., [0:00-0:05] B-ROLL: ...).",
      ),
  })
  