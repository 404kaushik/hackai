"use client"
import React, { useEffect, useRef, useState } from "react"
import { ArrowRight, Sparkles, Video, Mic, Brain, Zap, Users, TrendingUp, Play } from "lucide-react"

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState({})

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }))
        })
      },
      { threshold: 0.1 }
    )

    const elements = document.querySelectorAll('[data-animate]')
    elements.forEach(el => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const handleClick = (action: string) => {
    console.log(`Clicked: ${action}`)
    alert(`Action: ${action}`)
  }

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">Supernova</span>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => handleClick('Sign In')}
              className="px-4 py-2 text-gray-600 hover:text-black font-medium transition-colors"
            >
              Sign In
            </button>
            <button 
              onClick={() => handleClick('Get Started')}
              className="px-6 py-2 bg-black hover:bg-gray-800 text-white rounded-full font-medium transition-all duration-200 hover:scale-105"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
              Your Personal AI Production Studio
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Create Content at
            <br />
            <span className="text-gray-400">Superhuman</span> Speed
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
            Transform from a single creator into a content powerhouse. Generate videos, scripts, and B-roll using your own
            AI digital twin. Built for creators, by creators.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => handleClick('Start Creating')}
              className="px-8 py-3 bg-black hover:bg-gray-800 text-white rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 flex items-center"
            >
              Start Creating <ArrowRight className="ml-2 w-5 h-5" />
            </button>
            <button 
              onClick={() => handleClick('Watch Demo')}
              className="px-8 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 flex items-center"
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Everything You Need to Scale Your Content</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From your personal digital twin to AI-powered content strategies, Supernova gives you superpowers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Video,
                title: "Your Digital Twin",
                description: "Create a high-fidelity avatar and voice clone of yourself. Generate videos without ever picking up a camera."
              },
              {
                icon: Brain,
                title: "AI Content Engine",
                description: "Transform articles into videos, generate topical explainers, and create engaging content from any input."
              },
              {
                icon: Zap,
                title: "Smart B-Roll Assistant",
                description: "Upload your main footage and let AI automatically generate and insert perfect B-roll clips."
              },
              {
                icon: TrendingUp,
                title: "Content Strategy AI",
                description: "Analyze your niche, find content gaps, and discover trending topics that resonate with your audience."
              },
              {
                icon: Mic,
                title: "Creative Control Panel",
                description: "Fine-tune tone, pacing, and visual style. Edit scripts and B-roll prompts with real-time previews."
              },
              {
                icon: Users,
                title: "Brand Deal Co-Pilot",
                description: "Generate high-quality ad concepts using your digital twin to command higher rates and streamline approvals."
              }
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                >
                  <div className="w-16 h-16 bg-black rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">From Idea to Video in Minutes</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined workflow takes you from concept to published content faster than ever.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                title: "Setup Your Digital Twin",
                description: "Upload a few videos and audio samples to create your personalized AI avatar and voice clone."
              },
              {
                step: "2",
                title: "Choose Your Content Type",
                description: "Select from article-to-video, topical explainers, brand deals, or custom content generation."
              },
              {
                step: "3",
                title: "Generate & Customize",
                description: "Let AI create your content, then use our control panel to fine-tune every detail to perfection."
              }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to 10x Your
            <br />
            <span className="text-gray-400">Content Output?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join thousands of creators who've transformed their content strategy with Supernova.
          </p>
          <button 
            onClick={() => handleClick('Start Free Trial')}
            className="px-8 py-3 bg-white text-black hover:bg-gray-100 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 inline-flex items-center"
          >
            Start Your Free Trial <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">Supernova</span>
            </div>
            <p className="text-gray-500">© 2024 Supernova. Built for creators, by creators.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}