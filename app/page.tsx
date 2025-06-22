"use client"
import React, { useEffect, useRef, useState } from "react"
import { ArrowRight, Sparkles, Video, Mic, Brain, Zap, TrendingUp, Play } from "lucide-react"

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
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">supernova</span>
          </div>
          <div className="flex items-center">
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg text-base font-medium transition-all duration-300 hover:scale-105"
            >
              get started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center px-4">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-relaxed break-words">
                <div>create content at</div>
                <div><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 italic whitespace-nowrap inline-block px-1 py-1" style={{WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>lightning</span> speed.</div>
              </h1>
              
              <p className="text-base text-gray-500 leading-relaxed max-w-lg">
                transform from a single creator into a content powerhouse. generate videos, scripts, and b-roll using your own
                ai digital twin.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={async () => {
                    const btn = document.activeElement as HTMLButtonElement;
                    btn.disabled = true;
                    window.location.href = '/dashboard';
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg text-base font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center disabled:opacity-75"
                >
                  start creating <ArrowRight className="ml-2 w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleClick('Watch Demo')}
                  className="px-6 py-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-base font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center"
                >
                  <Play className="mr-2 w-4 h-4" />
                  watch demo
                </button>
              </div>

              {/* Trust indicators */}
              <div className="pt-6">
                <p className="text-sm text-gray-500 uppercase tracking-wider font-medium mb-4">
                  built for leading social media platforms
                </p>
                <div className="flex items-center space-x-8 opacity-60">
                  <div className="text-2xl font-bold text-gray-400">youtube</div>
                  <div className="text-2xl font-bold text-gray-400">tiktok</div>
                  <div className="text-2xl font-bold text-gray-400">instagram</div>
                  <div className="text-2xl font-bold text-gray-400">linkedin</div>
                </div>
              </div>
            </div>

            {/* Right Illustration Area */}
            <div className="relative lg:h-[600px] flex items-center justify-center">
              <div className="relative w-full h-full flex items-center justify-center">
                <img 
                  src="/hero-illustration.png" 
                  alt="Person interacting with mobile app interface" 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">everything you need to scale your content.</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              from your personal digital twin to ai-powered content strategies, supernova gives you superpowers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Video,
                title: "your digital twin",
                description: "upload videos to heygen and create your ai avatar. generate personalized content using your digital voice and appearance."
              },
              {
                icon: Brain,
                title: "ai content engine",
                description: "enter any content idea and get ai-generated a-roll scripts and b-roll directions optimized for viral potential."
              },
              {
                icon: Zap,
                title: "smart b-roll assistant",
                description: "automatically source relevant b-roll footage from pexels based on your script content and visual requirements."
              },
              {
                icon: TrendingUp,
                title: "content strategy ai",
                description: "analyze youtube and linkedin profiles to create personalized content that matches your unique style and audience."
              },
              {
                icon: Mic,
                title: "creative control panel",
                description: "review and edit ai-generated scripts, customize visual directions, and fine-tune your content before production."
              },
              {
                icon: Play,
                title: "ai video production",
                description: "generate complete videos using heygen api with automatic captions, voice synthesis, and vertical formatting for social media."
              }
            ].map((feature, index) => {
              const Icon = feature.icon
              return (
                <div 
                  key={index}
                  className="bg-white rounded-3xl p-8 border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 hover:shadow-lg group"
                >
                  <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-200 transition-colors duration-300">
                    <Icon className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">from idea to video in minutes.</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              our streamlined workflow takes you from concept to published content faster than ever.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "enter your content idea",
                description: "input your video concept, youtube url, or linkedin profile to generate personalized scripts and market analysis."
              },
              {
                step: "2",
                title: "review ai-generated content",
                description: "get custom a-roll scripts, b-roll directions, and market insights tailored to your audience and style."
              },
              {
                step: "3",
                title: "create with heygen",
                description: "use your uploaded avatar to generate the final video with ai voice and automatically sourced b-roll footage."
              }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <span className="text-xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ready to 10x your content output?
          </h2>
          <p className="text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
            join thousands of creators who've transformed their content strategy with supernova.
          </p>
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="px-8 py-3 bg-white text-indigo-600 hover:bg-gray-50 rounded-lg text-lg font-medium transition-all duration-300 hover:scale-105 inline-flex items-center shadow-lg"
          >
            start creating <ArrowRight className="ml-2 w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">supernova</span>
            </div>
            <p className="text-gray-500">© 2024 supernova. built for creators, by creators.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}