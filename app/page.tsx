"use client"

import React, { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Video, Mic, Brain, Zap, Users, TrendingUp, Play } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({})
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const workflowRef = useRef(null)

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

  const parallaxTransform = (speed: number) => ({
    transform: `translateY(${scrollY * speed}px)`
  })

  const AnimatedCard = ({ children, delay = 0, id }: { children: React.ReactNode, delay?: number, id: string }) => (
    <div
      id={id}
      data-animate
      className={`transition-all duration-1000 ease-out ${
        isVisible[id] 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-gray-100 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight">Supernova</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-600 hover:text-black font-medium">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-black hover:bg-gray-800 text-white rounded-full px-6 font-medium">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background elements */}
        <div 
          className="absolute inset-0 opacity-5"
          style={parallaxTransform(0.1)}
        >
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-gradient-to-br from-gray-900 to-black blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-gradient-to-br from-black to-gray-800 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <div 
            className="mb-8"
            style={parallaxTransform(0.05)}
          >
            <Badge className="mb-6 bg-gray-100 text-gray-800 hover:bg-gray-100 border-0 px-4 py-2 rounded-full font-medium">
              Your Personal AI Production Studio
            </Badge>
          </div>
          
          <div 
            className="space-y-6 mb-12"
            style={parallaxTransform(0.02)}
          >
            <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-none">
              Create Content at
              <br />
              <span className="text-gray-400">Superhuman</span> Speed
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
              Transform from a single creator into a content powerhouse. Generate videos, scripts, and B-roll using your own
              AI digital twin. Built for creators, by creators.
            </p>
          </div>

          <div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            style={parallaxTransform(-0.02)}
          >
            <Link href="/dashboard/create">
              <Button
                size="lg"
                className="bg-black hover:bg-gray-800 text-white rounded-full px-8 py-6 text-lg font-medium transition-all duration-300 hover:scale-105"
              >
                Start Creating <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full px-8 py-6 text-lg font-medium transition-all duration-300 hover:scale-105 group"
            >
              <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
          style={parallaxTransform(0.1)}
        >
          <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section ref={featuresRef} className="relative py-32 bg-gray-50">
        <div 
          className="absolute inset-0 opacity-30"
          style={parallaxTransform(0.05)}
        >
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <AnimatedCard id="features-title">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">Everything You Need to Scale Your Content</h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
                From your personal digital twin to AI-powered content strategies, Supernova gives you superpowers.
              </p>
            </AnimatedCard>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatedCard delay={0} id="feature-0">
              <Card className="border-0 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-2 group">
                <CardHeader className="p-8">
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Video className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-semibold mb-4 tracking-tight">Your Digital Twin</CardTitle>
                  <CardDescription className="text-gray-600 text-lg leading-relaxed font-light">
                    Create a high-fidelity avatar and voice clone of yourself. Generate videos without ever picking up a
                    camera.
                  </CardDescription>
                </CardHeader>
              </Card>
            </AnimatedCard>

            <AnimatedCard delay={100} id="feature-1">
              <Card className="border-0 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-2 group">
                <CardHeader className="p-8">
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-semibold mb-4 tracking-tight">AI Content Engine</CardTitle>
                  <CardDescription className="text-gray-600 text-lg leading-relaxed font-light">
                    Transform articles into videos, generate topical explainers, and create engaging content from any input.
                  </CardDescription>
                </CardHeader>
              </Card>
            </AnimatedCard>

            <AnimatedCard delay={200} id="feature-2">
              <Card className="border-0 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-2 group">
                <CardHeader className="p-8">
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-semibold mb-4 tracking-tight">Smart B-Roll Assistant</CardTitle>
                  <CardDescription className="text-gray-600 text-lg leading-relaxed font-light">
                    Upload your main footage and let AI automatically generate and insert perfect B-roll clips.
                  </CardDescription>
                </CardHeader>
              </Card>
            </AnimatedCard>

            <AnimatedCard delay={300} id="feature-3">
              <Card className="border-0 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-2 group">
                <CardHeader className="p-8">
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-semibold mb-4 tracking-tight">Content Strategy AI</CardTitle>
                  <CardDescription className="text-gray-600 text-lg leading-relaxed font-light">
                    Analyze your niche, find content gaps, and discover trending topics that resonate with your audience.
                  </CardDescription>
                </CardHeader>
              </Card>
            </AnimatedCard>

            <AnimatedCard delay={400} id="feature-4">
              <Card className="border-0 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-2 group">
                <CardHeader className="p-8">
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Mic className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-semibold mb-4 tracking-tight">Creative Control Panel</CardTitle>
                  <CardDescription className="text-gray-600 text-lg leading-relaxed font-light">
                    Fine-tune tone, pacing, and visual style. Edit scripts and B-roll prompts with real-time previews.
                  </CardDescription>
                </CardHeader>
              </Card>
            </AnimatedCard>

            <AnimatedCard delay={500} id="feature-5">
              <Card className="border-0 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-2 group">
                <CardHeader className="p-8">
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-semibold mb-4 tracking-tight">Brand Deal Co-Pilot</CardTitle>
                  <CardDescription className="text-gray-600 text-lg leading-relaxed font-light">
                    Generate high-quality ad concepts using your digital twin to command higher rates and streamline
                    approvals.
                  </CardDescription>
                </CardHeader>
              </Card>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={workflowRef} className="relative py-32 bg-white">
        <div 
          className="absolute inset-0 opacity-20"
          style={parallaxTransform(-0.03)}
        >
          <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <AnimatedCard id="workflow-title">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">From Idea to Video in Minutes</h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
                Our streamlined workflow takes you from concept to published content faster than ever.
              </p>
            </AnimatedCard>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <AnimatedCard delay={0} id="step-0">
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-black rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3">
                    <span className="text-3xl font-bold text-white">1</span>
                  </div>
                  <div className="hidden md:block absolute top-1/2 left-full w-12 h-0.5 bg-gray-200 transform -translate-y-1/2"></div>
                </div>
                <h3 className="text-2xl font-semibold mb-4 tracking-tight">Setup Your Digital Twin</h3>
                <p className="text-gray-600 text-lg leading-relaxed font-light">
                  Upload a few videos and audio samples to create your personalized AI avatar and voice clone.
                </p>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={200} id="step-1">
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-black rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3">
                    <span className="text-3xl font-bold text-white">2</span>
                  </div>
                  <div className="hidden md:block absolute top-1/2 left-full w-12 h-0.5 bg-gray-200 transform -translate-y-1/2"></div>
                </div>
                <h3 className="text-2xl font-semibold mb-4 tracking-tight">Choose Your Content Type</h3>
                <p className="text-gray-600 text-lg leading-relaxed font-light">
                  Select from article-to-video, topical explainers, brand deals, or custom content generation.
                </p>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={400} id="step-2">
              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="w-24 h-24 bg-black rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 group-hover:rotate-3">
                    <span className="text-3xl font-bold text-white">3</span>
                  </div>
                </div>
                <h3 className="text-2xl font-semibold mb-4 tracking-tight">Generate & Customize</h3>
                <p className="text-gray-600 text-lg leading-relaxed font-light">
                  Let AI create your content, then use our control panel to fine-tune every detail to perfection.
                </p>
              </div>
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-black text-white overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={parallaxTransform(0.05)}
        >
          <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-gradient-to-br from-white to-gray-300 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-gradient-to-br from-gray-200 to-white blur-3xl"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <AnimatedCard id="cta-section">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              Ready to 10x Your
              <br />
              <span className="text-gray-400">Content Output?</span>
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
              Join thousands of creators who've transformed their content strategy with Supernova.
            </p>
            <Link href="/dashboard/create">
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-gray-100 rounded-full px-8 py-6 text-lg font-medium transition-all duration-300 hover:scale-105"
              >
                Start Your Free Trial <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </AnimatedCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-semibold tracking-tight">Supernova</span>
            </div>
            <p className="text-gray-500 font-light">© 2024 Supernova. Built for creators, by creators.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
