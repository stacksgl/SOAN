import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  Database, 
  Terminal,
  Key,
  Download,
  Upload,
  RefreshCw,
  Settings as SettingsIcon,
  CheckCircle,
  AlertTriangle,
  Activity,
  Server,
  HardDrive,
  Cpu,
  BarChart3,
  Users,
  Clock,
  Zap
} from "lucide-react";
import { useState } from "react";
import { useLogs } from "@/contexts/LogContext";
import { useColorMode } from "@/contexts/ColorModeContext";
import { toast } from "@/components/ui/sonner";

const Admin = () => {
  const { isLogWindowVisible, setLogWindowVisible } = useLogs();
  const { isColorModeEnabled } = useColorMode();

  const exportSettings = () => {
    const settings = {
      scrapingInterval: 6,
      autoScraping: true,
      playlistTracking: false,
      retryFailed: true,
      apiKey: "***",
      rateLimit: 100,
      debugLevel: "info"
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'admin-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Admin settings exported successfully');
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target?.result as string);
        toast.success('Admin settings imported successfully');
      } catch (error) {
        toast.error('Failed to import settings - invalid file format');
      }
    };
    reader.readAsText(file);
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all admin settings to defaults? This action cannot be undone.')) {
      toast.success('Admin settings reset to defaults');
    }
  };

  const clearLogs = () => {
    if (window.confirm('Are you sure you want to clear all system logs?')) {
      toast.success('System logs cleared');
    }
  };

  const restartService = (serviceName: string) => {
    toast.info(`Restarting ${serviceName}...`);
    setTimeout(() => {
      toast.success(`${serviceName} restarted successfully`);
    }, 2000);
  };

  return (
    <div className="container-minimal space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className={`text-minimal-2xl font-bold ${isColorModeEnabled ? 'text-gradient-minimal' : 'text-foreground'}`}>
            Admin Panel
          </h1>
          <p className="text-minimal-sm text-muted-foreground mt-1">
            System administration, scraping configuration, and developer tools
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="default" className="flex items-center gap-1 btn-minimal-sm">
            <CheckCircle className="icon-minimal-xs" />
            <span className="text-minimal-xs">System Healthy</span>
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="scraping" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 bg-muted/20 border-minimal relative z-10 mb-8 lg:mb-4">
          <TabsTrigger value="scraping" className="flex items-center gap-1 btn-minimal-sm">
            <Database className="icon-minimal-sm" />
            <span className="hidden sm:inline text-minimal-sm">Scraping</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-1 btn-minimal-sm">
            <Server className="icon-minimal-sm" />
            <span className="hidden sm:inline text-minimal-sm">System</span>
          </TabsTrigger>
          <TabsTrigger value="developer" className="flex items-center gap-1 btn-minimal-sm">
            <Terminal className="icon-minimal-sm" />
            <span className="hidden sm:inline text-minimal-sm">Developer</span>
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center gap-1 btn-minimal-sm">
            <BarChart3 className="icon-minimal-sm" />
            <span className="hidden sm:inline text-minimal-sm">Monitoring</span>
          </TabsTrigger>
        </TabsList>

        {/* Scraping Tab */}
        <TabsContent value="scraping" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="bg-card-minimal border-minimal shadow-minimal">
              <CardHeader className="card-minimal-sm">
                <CardTitle className="flex items-center gap-2 text-minimal-lg">
                  <Database className={`icon-minimal ${isColorModeEnabled ? 'text-primary' : 'text-foreground'}`} />
                  Scraping Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="card-minimal-sm pt-0 space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="scrape-interval" className="text-minimal-sm">Scrape Interval (hours)</Label>
                  <Input 
                    id="scrape-interval"
                    type="number" 
                    defaultValue="6"
                    className="input-minimal bg-background border-border text-minimal-sm"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-scrape" className="text-minimal-sm">Auto Scraping</Label>
                  <Switch id="auto-scrape" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="playlist-tracking" className="text-minimal-sm">Track New Playlists</Label>
                  <Switch id="playlist-tracking" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="retry-failed" className="text-minimal-sm">Retry Failed Requests</Label>
                  <Switch id="retry-failed" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="parallel-processing" className="text-minimal-sm">Parallel Processing</Label>
                  <Switch id="parallel-processing" defaultChecked />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card-minimal border-minimal shadow-minimal">
              <CardHeader className="card-minimal-sm">
                <CardTitle className="flex items-center gap-2 text-minimal-lg">
                  <Shield className={`icon-minimal ${isColorModeEnabled ? 'text-primary' : 'text-foreground'}`} />
                  API Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="card-minimal-sm pt-0 space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="api-key" className="flex items-center gap-2 text-minimal-sm">
                    <Key className="icon-minimal-sm" />
                    Spotify API Key
                  </Label>
                  <Input 
                    id="api-key"
                    type="password" 
                    placeholder="Enter your API key"
                    className="input-minimal bg-background border-border text-minimal-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate-limit" className="text-minimal-sm">Rate Limit (requests/minute)</Label>
                  <Input 
                    id="rate-limit"
                    type="number" 
                    defaultValue="100"
                    className="input-minimal bg-background border-border text-minimal-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeout" className="text-minimal-sm">Request Timeout (seconds)</Label>
                  <Input 
                    id="timeout"
                    type="number" 
                    defaultValue="30"
                    className="input-minimal bg-background border-border text-minimal-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-minimal-sm">API Health</Label>
                  <div className="flex items-center gap-2">
                    <div className="status-dot bg-green-400"></div>
                    <span className="text-minimal-sm text-green-400">Connected</span>
                    <Badge variant="secondary" className="ml-auto text-minimal-xs">98.5% uptime</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card-minimal border-minimal shadow-minimal">
              <CardHeader className="card-minimal-sm">
                <CardTitle className="flex items-center gap-2 text-minimal-lg">
                  <Activity className={`icon-minimal ${isColorModeEnabled ? 'text-primary' : 'text-foreground'}`} />
                  Scraping Status
                </CardTitle>
              </CardHeader>
              <CardContent className="card-minimal-sm pt-0 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-minimal-sm">
                  <div>
                    <p className="text-muted-foreground text-minimal-xs">Songs Processed</p>
                    <p className="text-minimal-xl font-bold">12,847</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-minimal-xs">Success Rate</p>
                    <p className="text-minimal-xl font-bold text-green-400">98.5%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-minimal-xs">Queue Size</p>
                    <p className="text-minimal-xl font-bold">234</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-minimal-xs">Avg. Speed</p>
                    <p className="text-minimal-xl font-bold">45/min</p>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1 btn-minimal">
                    <RefreshCw className="mr-2 icon-minimal-sm" />
                    <span className="text-minimal-sm">Start Scraping</span>
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 btn-minimal">
                    <AlertTriangle className="mr-2 icon-minimal-sm" />
                    <span className="text-minimal-sm">Stop All</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card-minimal border-minimal shadow-minimal">
              <CardHeader className="card-minimal-sm">
                <CardTitle className="flex items-center gap-2 text-minimal-lg">
                  <Clock className={`icon-minimal ${isColorModeEnabled ? 'text-primary' : 'text-foreground'}`} />
                  Schedule Management
                </CardTitle>
              </CardHeader>
              <CardContent className="card-minimal-sm pt-0 space-y-3">
                <div className="space-y-2">
                  <Label className="text-minimal-sm">Scrape Schedule</Label>
                  <Select defaultValue="every-6h">
                    <SelectTrigger className="input-minimal bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="every-1h">Every Hour</SelectItem>
                      <SelectItem value="every-3h">Every 3 Hours</SelectItem>
                      <SelectItem value="every-6h">Every 6 Hours</SelectItem>
                      <SelectItem value="every-12h">Every 12 Hours</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="manual">Manual Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-minimal-sm">Peak Hours Mode</Label>
                  <div className="flex items-center justify-between">
                    <span className="text-minimal-xs text-muted-foreground">Reduce scraping during 9-17h</span>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="text-minimal-xs text-muted-foreground">
                  <p>Next scheduled run: Today 18:00</p>
                  <p>Last run: Today 12:00 (Success)</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="bg-card-minimal border-minimal shadow-minimal">
              <CardHeader className="card-minimal-sm">
                <CardTitle className="flex items-center gap-2 text-minimal-lg">
                  <Server className={`icon-minimal ${isColorModeEnabled ? 'text-primary' : 'text-foreground'}`} />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="card-minimal-sm pt-0 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="status-dot bg-green-400"></div>
                      <span className="text-minimal-xs text-muted-foreground">Web Server</span>
                    </div>
                    <p className="text-minimal-lg font-bold text-green-400">Running</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="status-dot bg-green-400"></div>
                      <span className="text-minimal-xs text-muted-foreground">Database</span>
                    </div>
                    <p className="text-minimal-lg font-bold text-green-400">Connected</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="status-dot bg-yellow-400"></div>
                      <span className="text-minimal-xs text-muted-foreground">Queue Worker</span>
                    </div>
                    <p className="text-minimal-lg font-bold text-yellow-400">3 jobs</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="status-dot bg-blue-400"></div>
                      <span className="text-minimal-xs text-muted-foreground">Cache</span>
                    </div>
                    <p className="text-minimal-lg font-bold text-blue-400">85% hit</p>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => restartService('Web Server')} className="btn-minimal">
                    <RefreshCw className="mr-2 icon-minimal-sm" />
                    <span className="text-minimal-sm">Restart Server</span>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => restartService('Queue Worker')} className="btn-minimal">
                    <Zap className="mr-2 icon-minimal-sm" />
                    <span className="text-minimal-sm">Restart Queue</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card-minimal border-minimal shadow-minimal">
              <CardHeader className="card-minimal-sm">
                <CardTitle className="flex items-center gap-2 text-minimal-lg">
                  <Cpu className={`icon-minimal ${isColorModeEnabled ? 'text-primary' : 'text-foreground'}`} />
                  Resource Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="card-minimal-sm pt-0 space-y-3">
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-minimal-xs mb-1">
                      <span>CPU Usage</span>
                      <span>23%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: '23%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-minimal-xs mb-1">
                      <span>Memory Usage</span>
                      <span>67%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: '67%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-minimal-xs mb-1">
                      <span>Disk Usage</span>
                      <span>34%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className="bg-green-400 h-1.5 rounded-full" style={{ width: '34%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-minimal-xs mb-1">
                      <span>Network I/O</span>
                      <span>12 MB/s</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div className="bg-blue-400 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card-minimal border-minimal shadow-minimal">
              <CardHeader className="card-minimal-sm">
                <CardTitle className="flex items-center gap-2 text-minimal-lg">
                  <HardDrive className={`icon-minimal ${isColorModeEnabled ? 'text-primary' : 'text-foreground'}`} />
                  Database Management
                </CardTitle>
              </CardHeader>
              <CardContent className="card-minimal-sm pt-0 space-y-3">
                <div className="grid grid-cols-2 gap-3 text-minimal-sm">
                  <div>
                    <p className="text-muted-foreground text-minimal-xs">Total Records</p>
                    <p className="text-minimal-lg font-bold">14,081</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-minimal-xs">Database Size</p>
                    <p className="text-minimal-lg font-bold">156 MB</p>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 btn-minimal">
                    <Download className="mr-2 icon-minimal-sm" />
                    <span className="text-minimal-sm">Backup</span>
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 btn-minimal">
                    <RefreshCw className="mr-2 icon-minimal-sm" />
                    <span className="text-minimal-sm">Optimize</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card-minimal border-minimal shadow-minimal">
              <CardHeader className="card-minimal-sm">
                <CardTitle className="flex items-center gap-2 text-minimal-lg">
                  <Users className={`icon-minimal ${isColorModeEnabled ? 'text-primary' : 'text-foreground'}`} />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent className="card-minimal-sm pt-0 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-minimal-sm">Active Sessions</span>
                    <Badge variant="secondary" className="text-minimal-xs">1</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-minimal-sm">Total Users</span>
                    <span className="text-minimal-sm font-mono">1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-minimal-sm">Admin Access</span>
                    <Badge variant="default" className="text-minimal-xs">Enabled</Badge>
                  </div>
                </div>
                <Separator />
                <Button size="sm" variant="outline" className="w-full btn-minimal">
                  <Shield className="mr-2 icon-minimal-sm" />
                  <span className="text-minimal-sm">Manage Permissions</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Developer Tab */}
        <TabsContent value="developer" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="bg-card-minimal border-minimal shadow-minimal">
              <CardHeader className="card-minimal-sm">
                <CardTitle className="flex items-center gap-2 text-minimal-lg">
                  <Terminal className={`icon-minimal ${isColorModeEnabled ? 'text-primary' : 'text-foreground'}`} />
                  Developer Tools
                </CardTitle>
              </CardHeader>
              <CardContent className="card-minimal-sm pt-0 space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-logs" className="text-minimal-sm">Show System Logs</Label>
                  <Switch 
                    id="show-logs" 
                    checked={isLogWindowVisible}
                    onCheckedChange={setLogWindowVisible}
                  />
                </div>
                <p className="text-minimal-xs text-muted-foreground">
                  Display a draggable log window for debugging and monitoring.
                </p>

                <Separator />

                <div className="space-y-2">
                  <Label className="text-minimal-sm">Debug Level</Label>
                  <Select defaultValue="info">
                    <SelectTrigger className="input-minimal bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="warn">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="debug">Debug</SelectItem>
                      <SelectItem value="verbose">Verbose</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="hot-reload" className="text-minimal-sm">Hot Reload</Label>
                  <Switch id="hot-reload" defaultChecked />
                </div>

                <Button onClick={clearLogs} variant="outline" className="w-full btn-minimal">
                  <AlertTriangle className="mr-2 icon-minimal-sm" />
                  <span className="text-minimal-sm">Clear Logs</span>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card-minimal border-minimal shadow-minimal">
              <CardHeader className="card-minimal-sm">
                <CardTitle className="flex items-center gap-2 text-minimal-lg">
                  <SettingsIcon className={`icon-minimal ${isColorModeEnabled ? 'text-primary' : 'text-foreground'}`} />
                  Configuration Management
                </CardTitle>
              </CardHeader>
              <CardContent className="card-minimal-sm pt-0 space-y-3">
                <div className="grid gap-2">
                  <Button onClick={exportSettings} variant="outline" className="w-full btn-minimal">
                    <Download className="mr-2 icon-minimal-sm" />
                    <span className="text-minimal-sm">Export Admin Settings</span>
                  </Button>
                  
                  <label htmlFor="import-admin-settings">
                    <Button variant="outline" className="w-full btn-minimal" asChild>
                      <span>
                        <Upload className="mr-2 icon-minimal-sm" />
                        <span className="text-minimal-sm">Import Admin Settings</span>
                      </span>
                    </Button>
                    <input
                      id="import-admin-settings"
                      type="file"
                      accept=".json"
                      onChange={importSettings}
                      className="hidden"
                    />
                  </label>

                  <Button onClick={resetToDefaults} variant="destructive" className="w-full btn-minimal">
                    <RefreshCw className="mr-2 icon-minimal-sm" />
                    <span className="text-minimal-sm">Reset Admin Defaults</span>
                  </Button>
                </div>

                <Separator />

                <div className="space-y-2 text-minimal-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-minimal-xs">App Version</span>
                    <Badge variant="secondary" className="text-minimal-xs">v1.0.0</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-minimal-xs">API Version</span>
                    <Badge variant="secondary" className="text-minimal-xs">v2.1</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-minimal-xs">Environment</span>
                    <Badge variant="default" className="text-minimal-xs">Production</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Monitoring Tab */}
        <TabsContent value="monitoring" className="space-y-4">
          <div className="grid gap-4">
            <Card className="bg-card-minimal border-minimal shadow-minimal">
              <CardHeader className="card-minimal-sm">
                <CardTitle className="flex items-center gap-2 text-minimal-lg">
                  <BarChart3 className={`icon-minimal ${isColorModeEnabled ? 'text-primary' : 'text-foreground'}`} />
                  System Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent className="card-minimal-sm pt-0">
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-8 w-8 mx-auto mb-3 opacity-50" />
                  <p className="text-minimal-sm">Real-time monitoring charts will be displayed here</p>
                  <p className="text-minimal-xs">API performance, scraping metrics, and system health</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
