import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { TopSongsTable } from "@/components/TopSongsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Database, 
  Music, 
  PlayCircle, 
  RefreshCw, 
  Download, 
  Upload,
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Star,
  Folder,
  Heart,
  Pin,
  Link,
  Activity,
  Calendar,
  BarChart3,
  PieChart,
  Zap,
  Target,
  Award,
  Timer,
  AlertTriangle,
  XCircle,
  Wifi,
  Server
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useColorMode } from "@/contexts/ColorModeContext";
import { useSongs } from "@/contexts/SongsContext";

const Index = () => {
  const { isColorModeEnabled } = useColorMode();
  const { folders } = useSongs();

  // Calculate folder stats
  const likedSongs = folders.find(f => f.name === 'Liked')?.songIds.length || 0;
  const pinnedSongs = folders.find(f => f.name === 'Pinned')?.songIds.length || 0;
  const linkableSongs = folders.find(f => f.name === 'Linkable')?.songIds.length || 0;
  const totalFolders = folders.length;
  const customFolders = folders.filter(f => !['Liked', 'Pinned', 'Linkable'].includes(f.name)).length;

  const handleRescrapeAll = () => {
    toast("Rescraping Started: All songs are being rescraped...");
  };

  const handleRescrapePlaylists = () => {
    toast("Playlist Rescrape Started: All playlists are being rescraped...");
  };

  const handleScrapePlaylists = () => {
    toast("Scraping Started: New playlists are being scraped...");
  };

  const handleQuickAction = (action: string) => {
    toast(`${action} initiated...`);
  };

  const recentActivities = [
    { action: "Song added to Liked", time: "2 minutes ago", icon: Heart, type: "like" },
    { action: "Watched songs recently became unplayable (3 songs)", time: "25 minutes ago", icon: AlertTriangle, type: "warning" },
    { action: "New playlist scraped", time: "15 minutes ago", icon: PlayCircle, type: "scrape" },
    { action: "Song pinned", time: "1 hour ago", icon: Pin, type: "pin" },
    { action: "Folder created", time: "2 hours ago", icon: Folder, type: "folder" },
    { action: "Bulk rescrape completed", time: "3 hours ago", icon: RefreshCw, type: "rescrape" }
  ];

  const alerts = [
    { 
      id: 1, 
      message: "API connection unstable", 
      time: "5 minutes ago", 
      icon: Wifi, 
      type: "warning",
      severity: "high"
    },
    { 
      id: 2, 
      message: "Database query timeout", 
      time: "12 minutes ago", 
      icon: Database, 
      type: "error",
      severity: "critical"
    },
    { 
      id: 3, 
      message: "Server response slow", 
      time: "18 minutes ago", 
      icon: Server, 
      type: "warning",
      severity: "medium"
    }
  ];

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'like': return 'text-red-400';
      case 'pin': return 'text-blue-400';
      case 'folder': return 'text-yellow-400';
      case 'scrape': return 'text-green-400';
      case 'rescrape': return 'text-purple-400';
      case 'warning': return 'text-orange-400';
      default: return 'text-muted-foreground';
    }
  };

  const getAlertColor = (type: string, severity: string) => {
    if (type === 'error' || severity === 'critical') return 'text-red-500';
    if (severity === 'high') return 'text-orange-500';
    if (severity === 'medium') return 'text-yellow-500';
    return 'text-blue-500';
  };

  const todayStreams = "2.3M";
  const weeklyGrowth = 8.5;
  const topArtist = "Ed Sheeran";
  const activeScrapingJobs = 3;

  return (
    <div className="h-full flex flex-col space-y-3 container-minimal">
      {/* Header with enhanced info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className={`text-minimal-2xl font-bold ${isColorModeEnabled ? 'text-gradient-minimal' : 'text-foreground'}`}>
            SOAN Dashboard
          </h1>
          <p className="text-minimal-sm text-muted-foreground mt-1">
            Monitor your music streaming performance and manage scraping operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1 btn-minimal-sm glass-minimal">
            <Activity className="icon-minimal-xs" />
            <span className="text-minimal-xs">Live</span>
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1 btn-minimal-sm glass-minimal">
            <Timer className="icon-minimal-xs" />
            <span className="hidden sm:inline text-minimal-xs">{activeScrapingJobs} jobs running</span>
            <span className="sm:hidden text-minimal-xs">{activeScrapingJobs} jobs</span>
          </Badge>
        </div>
      </div>

      {/* Enhanced Stats Grid */}
      <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard
          title="Total Songs"
          value="12,847"
          description="in database"
          icon={Music}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Playlists"
          value="1,234"
          description="tracked playlists"
          icon={PlayCircle}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Today's Streams"
          value={todayStreams}
          description="last 24 hours"
          icon={TrendingUp}
          trend={{ value: weeklyGrowth, isPositive: true }}
        />
        <StatCard
          title="Total Folders"
          value={totalFolders}
          description={`${customFolders} custom`}
          icon={Folder}
        />
        <StatCard
          title="Liked Songs"
          value={likedSongs}
          description="favorited tracks"
          icon={Heart}
        />
        <StatCard
          title="Pinned Items"
          value={pinnedSongs}
          description="priority tracks"
          icon={Pin}
        />
      </div>

      {/* Quick Actions, Recent Activity & Alerts */}
      <div className="grid gap-4 lg:grid-cols-4">
        {/* Quick Actions */}
        <Card className="bg-card-minimal border-minimal shadow-minimal glass-minimal">
          <CardHeader className="card-minimal-sm">
            <CardTitle className="flex items-center gap-2 text-minimal-lg">
              <Zap className={`icon-minimal ${isColorModeEnabled ? 'text-primary' : 'text-foreground'}`} />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="card-minimal-sm pt-0 space-y-2">
            <Button 
              onClick={handleRescrapeAll}
              className="w-full justify-start btn-minimal hover-minimal"
              variant="outline"
            >
              <RefreshCw className="mr-2 icon-minimal-sm" />
              <span className="text-minimal-sm">Rescrape All Songs</span>
            </Button>
            <Button 
              onClick={handleRescrapePlaylists}
              className="w-full justify-start btn-minimal hover-minimal"
              variant="outline"
            >
              <Download className="mr-2 icon-minimal-sm" />
              <span className="text-minimal-sm">Rescrape Playlists</span>
            </Button>
            <Button 
              onClick={handleScrapePlaylists}
              className="w-full justify-start btn-minimal hover-minimal"
              variant="outline"
            >
              <Upload className="mr-2 icon-minimal-sm" />
              <span className="text-minimal-sm">Scrape New Playlists</span>
            </Button>
            <Separator />
            <Button 
              onClick={() => handleQuickAction("Database cleanup")}
              className="w-full justify-start btn-minimal-sm hover-minimal"
              variant="ghost"
            >
              <Database className="mr-2 icon-minimal-xs" />
              <span className="text-minimal-xs">Clean Database</span>
            </Button>
            <Button 
              onClick={() => handleQuickAction("Export data")}
              className="w-full justify-start btn-minimal-sm hover-minimal"
              variant="ghost"
            >
              <Download className="mr-2 icon-minimal-xs" />
              <span className="text-minimal-xs">Export Data</span>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-card-minimal border-minimal shadow-minimal glass-minimal lg:col-span-2">
          <CardHeader className="card-minimal-sm">
            <CardTitle className="flex items-center gap-2 text-minimal-lg">
              <Activity className={`icon-minimal ${isColorModeEnabled ? 'text-primary' : 'text-foreground'}`} />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="card-minimal-sm pt-0">
            <div className="space-y-2">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-2 py-1 hover-minimal rounded-md px-1">
                  <activity.icon className={`icon-minimal-sm ${getActivityColor(activity.type)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-minimal-sm font-medium text-foreground truncate">
                      {activity.action}
                    </p>
                    <p className="text-minimal-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="bg-card-minimal border-2 border-red-500/30 shadow-minimal glass-minimal">
          <CardHeader className="card-minimal-sm">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="icon-minimal text-red-500" />
              <span className="text-red-500 text-minimal-lg">Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="card-minimal-sm pt-0">
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-2 py-1 hover-minimal rounded-md px-1">
                  <alert.icon className={`icon-minimal-sm mt-0.5 ${getAlertColor(alert.type, alert.severity)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-minimal-sm font-medium text-foreground truncate">
                      {alert.message}
                    </p>
                    <p className="text-minimal-xs text-muted-foreground">
                      {alert.time}
                    </p>
                    <Badge 
                      variant="outline" 
                      className={`text-minimal-xs mt-1 ${
                        alert.severity === 'critical' ? 'border-red-500 text-red-500' :
                        alert.severity === 'high' ? 'border-orange-500 text-orange-500' :
                        alert.severity === 'medium' ? 'border-yellow-500 text-yellow-500' :
                        'border-blue-500 text-blue-500'
                      }`}
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="text-center py-4">
                  <XCircle className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-minimal-sm text-muted-foreground">No active alerts</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Key Metrics */}
        <Card className="bg-card-minimal border-minimal shadow-minimal glass-minimal">
          <CardHeader className="card-minimal-sm">
            <CardTitle className="flex items-center gap-2 text-minimal-lg">
              <Target className={`icon-minimal ${isColorModeEnabled ? 'text-primary' : 'text-foreground'}`} />
              Key Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="card-minimal-sm pt-0 space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-minimal-sm">
                <span className="text-muted-foreground">Database Growth</span>
                <span className="font-medium">12% this month</span>
              </div>
              <Progress value={72} className="h-1.5" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-minimal-sm">
                <span className="text-muted-foreground">Scraping Success Rate</span>
                <span className="font-medium">98.5%</span>
              </div>
              <Progress value={98.5} className="h-1.5" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-minimal-sm">
                <span className="text-muted-foreground">API Response Time</span>
                <span className="font-medium">234ms avg</span>
              </div>
              <Progress value={85} className="h-1.5" />
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-3 text-minimal-sm">
              <div>
                <p className="text-muted-foreground text-minimal-xs">Top Artist</p>
                <p className="font-medium text-minimal-sm">{topArtist}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-minimal-xs">Avg. Daily Streams</p>
                <p className="font-medium text-minimal-sm">1.8M</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="bg-card-minimal border-minimal shadow-minimal glass-minimal">
          <CardHeader className="card-minimal-sm">
            <CardTitle className="flex items-center gap-2 text-minimal-lg">
              <Award className={`icon-minimal ${isColorModeEnabled ? 'text-primary' : 'text-foreground'}`} />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="card-minimal-sm pt-0 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="status-dot bg-green-400"></div>
                  <span className="text-minimal-xs text-muted-foreground">API Status</span>
                </div>
                <p className="text-minimal-lg font-bold text-green-400">Operational</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="status-dot bg-blue-400"></div>
                  <span className="text-minimal-xs text-muted-foreground">Database</span>
                </div>
                <p className="text-minimal-lg font-bold text-blue-400">Healthy</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="status-dot bg-yellow-400"></div>
                  <span className="text-minimal-xs text-muted-foreground">Queue</span>
                </div>
                <p className="text-minimal-lg font-bold text-yellow-400">3 jobs</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="status-dot bg-purple-400"></div>
                  <span className="text-minimal-xs text-muted-foreground">Cache</span>
                </div>
                <p className="text-minimal-lg font-bold text-purple-400">85% hit</p>
              </div>
            </div>
            <Separator />
            <div className="text-minimal-xs text-muted-foreground">
              <p>Last system check: 5 minutes ago</p>
              <p>Uptime: 99.9% (30 days)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Songs Table */}
      <TopSongsTable />
    </div>
  );
};

export default Index;
