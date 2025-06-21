import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Video,
  Plus,
  TrendingUp,
  Clock,
  Eye,
  Heart,
  Settings,
  User,
  FileText,
  Sparkles,
  BarChart3,
  Target,
  Zap,
} from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Supernova
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" size="sm">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Alex! 👋</h1>
          <p className="text-gray-600">Ready to create some amazing content today?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Link href="/dashboard/digital-twin">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-purple-50 to-white border-purple-200">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">Digital Twin</CardTitle>
                    <CardDescription className="text-xs">Setup your AI avatar</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/content-engine">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-white border-blue-200">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Video className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">Content Engine</CardTitle>
                    <CardDescription className="text-xs">Generate new content</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/brand-deals">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-green-50 to-white border-green-200">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">Brand Deals</CardTitle>
                    <CardDescription className="text-xs">Co-pilot for partnerships</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/analytics">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-br from-orange-50 to-white border-orange-200">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">Analytics</CardTitle>
                    <CardDescription className="text-xs">Track performance</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="recent" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="recent">Recent Content</TabsTrigger>
                <TabsTrigger value="trending">Trending Ideas</TabsTrigger>
                <TabsTrigger value="drafts">Drafts</TabsTrigger>
              </TabsList>

              <TabsContent value="recent" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Your Recent Videos</h3>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Create New
                  </Button>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      title: "10 AI Tools That Will Change Your Life",
                      type: "Topical Explainer",
                      status: "Published",
                      views: "12.5K",
                      engagement: "8.2%",
                      thumbnail: "/placeholder.svg?height=80&width=120",
                    },
                    {
                      title: "How I Built My SaaS in 30 Days",
                      type: "Article-to-Video",
                      status: "Processing",
                      views: "-",
                      engagement: "-",
                      thumbnail: "/placeholder.svg?height=80&width=120",
                    },
                    {
                      title: "Brand Partnership: TechGadget Review",
                      type: "Brand Deal",
                      status: "Draft",
                      views: "-",
                      engagement: "-",
                      thumbnail: "/placeholder.svg?height=80&width=120",
                    },
                  ].map((video, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <img
                            src={video.thumbnail || "/placeholder.svg"}
                            alt={video.title}
                            className="w-20 h-12 rounded-lg object-cover bg-gray-200"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">{video.title}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <Badge variant="secondary" className="text-xs">
                                {video.type}
                              </Badge>
                              <span className="flex items-center">
                                <Eye className="w-3 h-3 mr-1" />
                                {video.views}
                              </span>
                              <span className="flex items-center">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                {video.engagement}
                              </span>
                            </div>
                          </div>
                          <Badge
                            variant={
                              video.status === "Published"
                                ? "default"
                                : video.status === "Processing"
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {video.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="trending" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">AI-Generated Content Ideas</h3>
                  <Button size="sm" variant="outline">
                    <Zap className="w-4 h-4 mr-2" />
                    Refresh Ideas
                  </Button>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      title: "The Future of Remote Work in 2024",
                      trend: "Rising 📈",
                      difficulty: "Easy",
                      potential: "High",
                    },
                    {
                      title: "5 Productivity Hacks for Entrepreneurs",
                      trend: "Hot 🔥",
                      difficulty: "Medium",
                      potential: "Very High",
                    },
                    {
                      title: "AI vs Human Creativity: The Debate",
                      trend: "Trending 🚀",
                      difficulty: "Hard",
                      potential: "Medium",
                    },
                  ].map((idea, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium mb-2">{idea.title}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>{idea.trend}</span>
                              <Badge variant="outline" className="text-xs">
                                {idea.difficulty}
                              </Badge>
                              <span className="text-green-600">{idea.potential} potential</span>
                            </div>
                          </div>
                          <Button size="sm">Create Video</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="drafts" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Work in Progress</h3>
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    New Draft
                  </Button>
                </div>

                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No drafts yet. Start creating to see your work here!</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Digital Twin Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Digital Twin Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Avatar Training</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Voice Clone</span>
                      <span>92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <Link href="/dashboard/digital-twin">
                    <Button size="sm" className="w-full">
                      Complete Setup
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Video className="w-4 h-4 text-blue-600" />
                      <span className="text-sm">Videos Created</span>
                    </div>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4 text-green-600" />
                      <span className="text-sm">Total Views</span>
                    </div>
                    <span className="font-semibold">45.2K</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4 text-red-600" />
                      <span className="text-sm">Engagement Rate</span>
                    </div>
                    <span className="font-semibold">7.8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span className="text-sm">Time Saved</span>
                    </div>
                    <span className="font-semibold">24h</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Video published: "AI Tools Guide"</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Digital twin training updated</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span>New brand deal opportunity</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Content idea generated</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
