import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Target,
  DollarSign,
  TrendingUp,
  ArrowLeft,
  Sparkles,
  BarChart3,
  Users,
  Eye,
  Heart,
  Download,
  Send,
  CheckCircle,
} from "lucide-react"
import NextLink from "next/link"

export default function BrandDealsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <NextLink href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </NextLink>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Brand Deal Co-Pilot
              </span>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Deal Analytics
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Overview */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Brand Partnership Co-Pilot</h1>
          <p className="text-gray-600 mb-6">
            Analyze brand opportunities, generate high-quality ad concepts, and command higher rates with AI-powered
            insights.
          </p>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">$12,500</div>
                <div className="text-sm text-gray-600">This Month's Earnings</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">8</div>
                <div className="text-sm text-gray-600">Active Partnerships</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">94%</div>
                <div className="text-sm text-gray-600">Approval Rate</div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">$2,100</div>
                <div className="text-sm text-gray-600">Avg. Deal Value</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="analyze" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="analyze">Analyze Deal</TabsTrigger>
                <TabsTrigger value="generate">Generate Ad</TabsTrigger>
                <TabsTrigger value="negotiate">Negotiate</TabsTrigger>
              </TabsList>

              <TabsContent value="analyze" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Brand Deal Analysis</CardTitle>
                    <CardDescription>
                      Paste the product link or brand details to get AI-powered insights and recommendations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="productUrl">Product/Brand URL</Label>
                        <Input
                          id="productUrl"
                          placeholder="https://brand.com/product"
                          defaultValue="https://techgadgets.com/wireless-earbuds-pro"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="dealValue">Offered Amount</Label>
                          <Input id="dealValue" placeholder="$1,500" defaultValue="$2,000" />
                        </div>
                        <div>
                          <Label htmlFor="deliverables">Deliverables</Label>
                          <Select defaultValue="video">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="video">Video Review</SelectItem>
                              <SelectItem value="post">Social Media Post</SelectItem>
                              <SelectItem value="story">Instagram Story</SelectItem>
                              <SelectItem value="multiple">Multiple Formats</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <Button className="w-full">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analyze Brand & Market
                      </Button>
                    </div>

                    {/* Analysis Results */}
                    <Card className="bg-blue-50 border-blue-200">
                      <CardContent className="p-6">
                        <h4 className="font-semibold mb-4 flex items-center">
                          <TrendingUp className="w-5 h-5 mr-2 text-blue-600" />
                          AI Analysis Results
                        </h4>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <h5 className="font-medium mb-2">Brand Health</h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Brand Recognition:</span>
                                <Badge variant="default">High</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Market Position:</span>
                                <Badge variant="default">Premium</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span>Customer Sentiment:</span>
                                <Badge variant="default">Positive (4.2/5)</Badge>
                              </div>
                            </div>
                          </div>

                          <div>
                            <h5 className="font-medium mb-2">Deal Assessment</h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Market Rate:</span>
                                <span className="font-medium">$1,800-$2,500</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Your Offer:</span>
                                <span className="text-green-600 font-medium">Fair</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Audience Match:</span>
                                <Badge variant="default">92%</Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 p-3 bg-green-100 rounded-lg">
                          <p className="text-sm text-green-800">
                            <strong>Recommendation:</strong> This is a good fit for your audience. The offer is fair,
                            but you could negotiate up to $2,300 based on your engagement rates.
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Audience Alignment */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Audience Alignment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Demographics Match</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: "88%" }}></div>
                              </div>
                              <span className="text-sm font-medium">88%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Interest Overlap</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: "92%" }}></div>
                              </div>
                              <span className="text-sm font-medium">92%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Purchase Intent</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: "76%" }}></div>
                              </div>
                              <span className="text-sm font-medium">76%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="generate" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>AI Ad Concept Generator</CardTitle>
                    <CardDescription>
                      Create a high-quality ad concept using your digital twin to impress brands and streamline
                      approvals.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="adStyle">Ad Style</Label>
                          <Select defaultValue="review">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="review">Product Review</SelectItem>
                              <SelectItem value="unboxing">Unboxing Experience</SelectItem>
                              <SelectItem value="lifestyle">Lifestyle Integration</SelectItem>
                              <SelectItem value="comparison">Product Comparison</SelectItem>
                              <SelectItem value="tutorial">How-to Tutorial</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="duration">Video Duration</Label>
                          <Select defaultValue="60s">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30s">30 seconds</SelectItem>
                              <SelectItem value="60s">60 seconds</SelectItem>
                              <SelectItem value="90s">90 seconds</SelectItem>
                              <SelectItem value="120s">2 minutes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="keyPoints">Key Selling Points</Label>
                        <Textarea
                          id="keyPoints"
                          placeholder="What should be highlighted about this product?"
                          defaultValue="Wireless freedom, premium sound quality, 24-hour battery life, noise cancellation, comfortable fit for all-day wear"
                        />
                      </div>

                      <div>
                        <Label htmlFor="callToAction">Call to Action</Label>
                        <Input
                          id="callToAction"
                          placeholder="e.g., Use code ALEX20 for 20% off"
                          defaultValue="Get 15% off with code ALEX15 - link in description!"
                        />
                      </div>

                      <Button className="w-full">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate Ad Concept
                      </Button>
                    </div>

                    {/* Generated Ad Concept */}
                    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                      <CardContent className="p-6">
                        <h4 className="font-semibold mb-4">Generated Ad Concept</h4>

                        <div className="space-y-4">
                          <div>
                            <h5 className="font-medium mb-2">Hook (0-5s)</h5>
                            <p className="text-sm bg-white p-3 rounded-lg">
                              "I've tested over 50 wireless earbuds this year, but these just changed everything..."
                            </p>
                          </div>

                          <div>
                            <h5 className="font-medium mb-2">Product Showcase (5-35s)</h5>
                            <p className="text-sm bg-white p-3 rounded-lg">
                              "The TechGadgets Wireless Pro delivers studio-quality sound with industry-leading noise
                              cancellation. Watch this - [demonstrates noise cancellation test]. The 24-hour battery
                              means I never worry about charging, and the comfort level is unmatched for long work
                              sessions."
                            </p>
                          </div>

                          <div>
                            <h5 className="font-medium mb-2">Social Proof & CTA (35-60s)</h5>
                            <p className="text-sm bg-white p-3 rounded-lg">
                              "Over 100,000 creators are already using these, and I can see why. If you want to upgrade
                              your audio game, use my code ALEX15 for 15% off. Link is in the description - but hurry,
                              this deal ends soon!"
                            </p>
                          </div>
                        </div>

                        <div className="flex space-x-4 mt-6">
                          <Button className="flex-1">
                            <Eye className="w-4 h-4 mr-2" />
                            Preview with Digital Twin
                          </Button>
                          <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Export Script
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* B-Roll Suggestions */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Suggested B-Roll Shots</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-3 text-sm">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">Product close-ups:</span> Earbuds rotating, charging case
                            opening
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">Lifestyle shots:</span> Working at desk, commuting, exercising
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">Comparison shots:</span> Side-by-side with competitors
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">Feature demos:</span> Noise cancellation test, battery
                            indicator
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="negotiate" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Negotiation Assistant</CardTitle>
                    <CardDescription>
                      Get AI-powered negotiation strategies and email templates to maximize your deal value.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Current Deal Summary */}
                    <Card className="bg-gray-50">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-3">Current Deal Summary</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Brand:</span> TechGadgets Pro
                          </div>
                          <div>
                            <span className="font-medium">Offered Amount:</span> $2,000
                          </div>
                          <div>
                            <span className="font-medium">Deliverables:</span> 1 YouTube video + 3 Instagram posts
                          </div>
                          <div>
                            <span className="font-medium">Timeline:</span> 2 weeks
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Negotiation Strategy */}
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-3 text-green-800">AI Negotiation Strategy</h4>
                        <div className="space-y-3 text-sm text-green-700">
                          <div className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
                            <p>
                              <strong>Counter with $2,300:</strong> Based on your 45K subscriber count and 8.2%
                              engagement rate
                            </p>
                          </div>
                          <div className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
                            <p>
                              <strong>Highlight value:</strong> Your tech-focused audience has 92% alignment with their
                              target market
                            </p>
                          </div>
                          <div className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
                            <p>
                              <strong>Offer bonus:</strong> Include Instagram Stories at no extra cost to sweeten the
                              deal
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Email Templates */}
                    <div className="space-y-4">
                      <Label>Negotiation Email Template</Label>
                      <Textarea
                        className="min-h-[200px]"
                        defaultValue="Hi [Brand Contact],

Thank you for reaching out about the TechGadgets Pro partnership opportunity. I'm excited about the potential collaboration!

After reviewing the proposal, I'd like to discuss the compensation structure. Based on my audience analytics and recent campaign performance:

• My tech-focused audience of 45K subscribers shows 92% alignment with your target demographic
• My average engagement rate of 8.2% is significantly above industry standards
• Recent brand partnerships have generated an average of 15K+ views and 1,200+ clicks

Given these metrics and the deliverables requested (YouTube video + 3 Instagram posts), I'd like to propose $2,300 for this campaign. To add extra value, I'm happy to include Instagram Stories coverage at no additional cost.

I've attached a sample ad concept I created using my digital twin technology - this shows the quality and style you can expect from our collaboration.

I'm confident this partnership will deliver exceptional results for TechGadgets Pro. Would you be available for a quick call this week to discuss?

Best regards,
Alex"
                      />
                    </div>

                    <div className="flex space-x-4">
                      <Button className="flex-1">
                        <Send className="w-4 h-4 mr-2" />
                        Send Negotiation Email
                      </Button>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Save Template
                      </Button>
                    </div>

                    {/* Alternative Strategies */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Alternative Strategies</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="p-3 border rounded-lg">
                            <h5 className="font-medium mb-1">Package Deal Approach</h5>
                            <p className="text-sm text-gray-600">
                              Offer a 3-month partnership at $6,500 total (saving them $400) for consistent brand
                              presence
                            </p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <h5 className="font-medium mb-1">Performance-Based Bonus</h5>
                            <p className="text-sm text-gray-600">
                              Accept $2,000 base + $300 bonus if video reaches 20K views within 30 days
                            </p>
                          </div>
                          <div className="p-3 border rounded-lg">
                            <h5 className="font-medium mb-1">Value-Add Proposition</h5>
                            <p className="text-sm text-gray-600">
                              Include product in your monthly "Tech Favorites" roundup video for ongoing exposure
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Active Deals */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Deals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { brand: "TechGadgets Pro", status: "Negotiating", value: "$2,000", deadline: "3 days" },
                    { brand: "ProductivityApp", status: "In Progress", value: "$1,500", deadline: "1 week" },
                    { brand: "CreatorTools", status: "Completed", value: "$2,200", deadline: "Done" },
                  ].map((deal, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{deal.brand}</span>
                        <Badge
                          variant={
                            deal.status === "Completed"
                              ? "default"
                              : deal.status === "In Progress"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          {deal.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{deal.value}</span>
                        <span>{deal.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Subscribers</span>
                    </div>
                    <span className="font-semibold">45.2K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Avg. Views</span>
                    </div>
                    <span className="font-semibold">12.8K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-red-600" />
                      <span className="text-sm">Engagement Rate</span>
                    </div>
                    <span className="font-semibold">8.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-purple-600" />
                      <span className="text-sm">Growth Rate</span>
                    </div>
                    <span className="font-semibold">+12%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Market Rates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Market Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>YouTube (10K-50K subs):</span>
                    <span className="font-medium">$500-$2,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Instagram Post:</span>
                    <span className="font-medium">$100-$500</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Instagram Story:</span>
                    <span className="font-medium">$50-$200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tech Niche Premium:</span>
                    <span className="font-medium text-green-600">+20-30%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button size="sm" className="w-full" variant="outline">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Rate Calculator
                </Button>
                <Button size="sm" className="w-full" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Media Kit
                </Button>
                <Button size="sm" className="w-full" variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Performance Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
