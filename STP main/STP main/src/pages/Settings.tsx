import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  Palette, 
  Monitor,
  Moon,
  Sun,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Zap,
  Settings as SettingsIcon,
  BarChart3,
  Calendar,
  TrendingUp,
  Building,
  Music
} from "lucide-react";
import { HexColorPicker } from "react-colorful";
import { useState, useEffect } from "react";
import { useColorMode } from "@/contexts/ColorModeContext";
import { useColumnVisibility } from "@/contexts/ColumnVisibilityContext";
import { toast } from "@/components/ui/sonner";

const Settings = () => {
  const [primaryColor, setPrimaryColor] = useState("#8b5cf6");
  const [accentColor, setAccentColor] = useState("#a855f7");
  const [backgroundColor, setBackgroundColor] = useState("#0f0f23");
  const [cardColor, setCardColor] = useState("#1a1a2e");
  const [showPrimaryPicker, setShowPrimaryPicker] = useState(false);
  const [showAccentPicker, setShowAccentPicker] = useState(false);
  const [showBackgroundPicker, setShowBackgroundPicker] = useState(false);
  const [showCardPicker, setShowCardPicker] = useState(false);
  
  // Enhanced settings
  const [autoSave, setAutoSave] = useState(true);
  
  const { isColorModeEnabled, setColorModeEnabled } = useColorMode();
  const { columnVisibility, setColumnVisibility } = useColumnVisibility();

  // Column configuration
  const columnConfig = [
    {
      key: 'streams',
      label: 'Streams',
      description: 'Total stream count',
      icon: BarChart3,
      defaultVisible: true
    },
    {
      key: 'genre',
      label: 'Genre',
      description: 'Music genre/category',
      icon: Music,
      defaultVisible: true
    },
    {
      key: 'releaseDate',
      label: 'Release Date',
      description: 'Song release date',
      icon: Calendar,
      defaultVisible: true
    },
    {
      key: 'dailyStreams',
      label: 'Daily Streams (Last Day)',
      description: 'Streams from the last 24 hours',
      icon: TrendingUp,
      defaultVisible: true
    },
    {
      key: 'averageDailyStreams',
      label: 'Daily Streams (Average)',
      description: 'Average daily streams',
      icon: BarChart3,
      defaultVisible: true
    },
    {
      key: 'distributor',
      label: 'Distributor',
      description: 'Music distributor/label',
      icon: Building,
      defaultVisible: false
    },
    {
      key: 'trendPercentage',
      label: 'Trend Percentage',
      description: 'Growth/decline percentage with trend arrow',
      icon: TrendingUp,
      defaultVisible: true
    }
  ];

  // Theme presets
  const themePresets = [
    { name: " ", primary: "auto", accent: "auto", bg: "auto", card: "auto", isDefault: true, isAuto: true },
    { name: "Purple", primary: "#8b5cf6", accent: "#a855f7", bg: "#0f0f23", card: "#1a1a2e" },
    { name: "Blue Ocean", primary: "#3b82f6", accent: "#06b6d4", bg: "#0c1620", card: "#1e293b" },
    { name: "Green Forest", primary: "#10b981", accent: "#059669", bg: "#0f1419", card: "#1f2937" },
    { name: "Orange Sunset", primary: "#f59e0b", accent: "#d97706", bg: "#1c1917", card: "#292524" },
    { name: "Pink Dream", primary: "#ec4899", accent: "#be185d", bg: "#1f1726", card: "#312e40" },
    { name: "Monochrome", primary: "#6b7280", accent: "#4b5563", bg: "#111827", card: "#1f2937" }
  ];

  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  const handlePrimaryColorChange = (color: string) => {
    setPrimaryColor(color);
    const hsl = hexToHsl(color);
    document.documentElement.style.setProperty('--primary', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
    // Update primary foreground for contrast
    const foregroundL = hsl.l > 50 ? 10 : 98;
    document.documentElement.style.setProperty('--primary-foreground', `0 0% ${foregroundL}%`);
  };

  const handleAccentColorChange = (color: string) => {
    setAccentColor(color);
    const hsl = hexToHsl(color);
    document.documentElement.style.setProperty('--accent', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
    // Update accent foreground for contrast
    const foregroundL = hsl.l > 50 ? 10 : 98;
    document.documentElement.style.setProperty('--accent-foreground', `0 0% ${foregroundL}%`);
  };

  const handleBackgroundColorChange = (color: string) => {
    setBackgroundColor(color);
    const hsl = hexToHsl(color);
    document.documentElement.style.setProperty('--background', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
    // Update foreground for contrast
    const foregroundL = hsl.l > 50 ? 4 : 98;
    document.documentElement.style.setProperty('--foreground', `0 0% ${foregroundL}%`);
  };

  const handleCardColorChange = (color: string) => {
    setCardColor(color);
    const hsl = hexToHsl(color);
    document.documentElement.style.setProperty('--card', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
    // Update card foreground for contrast
    const foregroundL = hsl.l > 50 ? 4 : 98;
    document.documentElement.style.setProperty('--card-foreground', `0 0% ${foregroundL}%`);
    // Update secondary and muted colors to match
    const secondaryL = Math.max(5, Math.min(95, hsl.l + (hsl.l > 50 ? -10 : 10)));
    document.documentElement.style.setProperty('--secondary', `${hsl.h} ${Math.max(10, hsl.s - 10)}% ${secondaryL}%`);
    document.documentElement.style.setProperty('--muted', `${hsl.h} ${Math.max(10, hsl.s - 10)}% ${secondaryL}%`);
  };

  // Auto-save effect
  useEffect(() => {
    if (autoSave) {
      const saveSettings = () => {
        localStorage.setItem('userSettings', JSON.stringify({
          primaryColor, accentColor, backgroundColor, cardColor, isColorModeEnabled
        }));
      };
      const timeoutId = setTimeout(saveSettings, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [autoSave, primaryColor, accentColor, backgroundColor, cardColor, isColorModeEnabled]);

  const applyThemePreset = (preset: typeof themePresets[0]) => {
    if (preset.isAuto) {
      // Reset to CSS defaults
      setPrimaryColor("#8b5cf6");
      setAccentColor("#a855f7");
      setBackgroundColor("#0f0f23");
      setCardColor("#1a1a2e");
      
      // Reset CSS variables to system defaults
      document.documentElement.style.setProperty('--primary', '263 70% 50%');
      document.documentElement.style.setProperty('--primary-foreground', '0 0% 98%');
      document.documentElement.style.setProperty('--accent', '280 80% 60%');
      document.documentElement.style.setProperty('--accent-foreground', '0 0% 98%');
      document.documentElement.style.setProperty('--background', '240 10% 3.9%');
      document.documentElement.style.setProperty('--foreground', '0 0% 98%');
      document.documentElement.style.setProperty('--card', '240 10% 7%');
      document.documentElement.style.setProperty('--card-foreground', '0 0% 98%');
      document.documentElement.style.setProperty('--secondary', '240 4% 16%');
      document.documentElement.style.setProperty('--muted', '240 6% 13%');
      
      toast.success(`Applied ${preset.name} theme (system default)`);
    } else {
      setPrimaryColor(preset.primary);
      setAccentColor(preset.accent);
      setBackgroundColor(preset.bg);
      setCardColor(preset.card);
      
      handlePrimaryColorChange(preset.primary);
      handleAccentColorChange(preset.accent);
      handleBackgroundColorChange(preset.bg);
      handleCardColorChange(preset.card);
      
      toast.success(`Applied ${preset.name} theme`);
    }
  };

  const exportSettings = () => {
    const settings = {
      primaryColor, accentColor, backgroundColor, cardColor, isColorModeEnabled
    };
    
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stream-tuner-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Settings exported successfully');
  };

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target?.result as string);
        
        // Apply imported settings
        if (settings.primaryColor) handlePrimaryColorChange(settings.primaryColor);
        if (settings.accentColor) handleAccentColorChange(settings.accentColor);
        if (settings.backgroundColor) handleBackgroundColorChange(settings.backgroundColor);
        if (settings.cardColor) handleCardColorChange(settings.cardColor);
        if (settings.isColorModeEnabled !== undefined) setColorModeEnabled(settings.isColorModeEnabled);
        
        toast.success('Settings imported successfully');
      } catch (error) {
        toast.error('Failed to import settings - invalid file format');
      }
    };
    reader.readAsText(file);
  };

  const resetToDefaults = () => {
    setPrimaryColor("#8b5cf6");
    setAccentColor("#a855f7");
    setBackgroundColor("#0f0f23");
    setCardColor("#1a1a2e");
    setColorModeEnabled(true);
    
    // Reset CSS variables to defaults
    document.documentElement.style.setProperty('--primary', '263 70% 50%');
    document.documentElement.style.setProperty('--primary-foreground', '0 0% 98%');
    document.documentElement.style.setProperty('--accent', '280 80% 60%');
    document.documentElement.style.setProperty('--accent-foreground', '0 0% 98%');
    document.documentElement.style.setProperty('--background', '240 10% 3.9%');
    document.documentElement.style.setProperty('--foreground', '0 0% 98%');
    document.documentElement.style.setProperty('--card', '240 10% 7%');
    document.documentElement.style.setProperty('--card-foreground', '0 0% 98%');
    document.documentElement.style.setProperty('--secondary', '240 4% 16%');
    document.documentElement.style.setProperty('--muted', '240 6% 13%');
    
    toast.success('Settings reset to defaults');
  };


  return (
    <div className="container-minimal space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className={`text-minimal-2xl font-bold ${isColorModeEnabled ? 'text-gradient-minimal' : 'text-foreground'}`}>
            Settings
          </h1>
          <p className="text-minimal-sm text-muted-foreground mt-1">
            Configure your experience, performance, and preferences
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={autoSave ? "default" : "secondary"} className="flex items-center gap-1 btn-minimal-sm">
            <Zap className="icon-minimal-xs" />
            <span className="text-minimal-xs">{autoSave ? "Auto-save ON" : "Auto-save OFF"}</span>
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="appearance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-muted/20 border-minimal">
          <TabsTrigger value="appearance" className="flex items-center gap-1 btn-minimal-sm">
            <Palette className="icon-minimal-sm" />
            <span className="hidden sm:inline text-minimal-sm">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="columns" className="flex items-center gap-1 btn-minimal-sm">
            <SettingsIcon className="icon-minimal-sm" />
            <span className="hidden sm:inline text-minimal-sm">Columns</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-1 btn-minimal-sm">
            <Bell className="icon-minimal-sm" />
            <span className="hidden sm:inline text-minimal-sm">Notifications</span>
          </TabsTrigger>
        </TabsList>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-4">
          {/* Theme Presets */}
          <Card className="bg-card-minimal border-minimal shadow-minimal">
            <CardHeader className="card-minimal-sm">
              <CardTitle className="flex items-center gap-2 text-minimal-lg">
                <Palette className={`icon-minimal ${isColorModeEnabled ? 'text-primary' : 'text-foreground'}`} />
                Theme Presets
              </CardTitle>
            </CardHeader>
            <CardContent className="card-minimal-sm pt-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {themePresets.map((preset) => (
                  <div
                    key={preset.name}
                    className={`relative group cursor-pointer rounded-md border-2 ${preset.isDefault ? 'border-primary' : 'border-border'} hover:border-primary/50 transition-all p-2 min-h-[50px] hover-minimal animate-scale-in`}
                    onClick={() => applyThemePreset(preset)}
                  >
                    <div className="space-y-1 h-full flex flex-col justify-between">
                      <div className="flex gap-1 justify-center">
                        {preset.isAuto ? (
                          <div className="flex items-center justify-center w-full h-4 text-minimal-xs font-medium text-muted-foreground">
                            <Zap className="icon-minimal-xs mr-1" />
                            AUTO
                          </div>
                        ) : (
                          <>
                            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: preset.primary }} />
                            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: preset.accent }} />
                            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: preset.bg }} />
                          </>
                        )}
                      </div>
                      <div className="flex flex-col items-center gap-0.5">
                        <p className="text-minimal-xs font-medium text-center leading-tight">{preset.name}</p>
                        {preset.isDefault && (
                          <span className="text-minimal-xs text-primary font-medium">Default</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Custom Colors */}
          <Card className="bg-card-minimal border-minimal shadow-minimal">
            <CardHeader className="card-minimal-sm">
              <CardTitle className="flex items-center gap-2 text-minimal-lg">
                <Eye className={`icon-minimal ${isColorModeEnabled ? 'text-primary' : 'text-foreground'}`} />
                Custom Colors
              </CardTitle>
            </CardHeader>
            <CardContent className="card-minimal-sm pt-0 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Primary Color */}
                <div className="space-y-2">
                  <Label className="text-minimal-sm">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-md border-2 border-border cursor-pointer hover:scale-105 transition-transform shadow-minimal"
                      style={{ backgroundColor: primaryColor }}
                      onClick={() => setShowPrimaryPicker(!showPrimaryPicker)}
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => handlePrimaryColorChange(e.target.value)}
                      className="input-minimal bg-background border-border font-mono text-minimal-sm"
                      placeholder="#8b5cf6"
                    />
                  </div>
                  {showPrimaryPicker && (
                    <div className="mt-2 p-3 bg-muted/20 rounded-md">
                      <HexColorPicker color={primaryColor} onChange={handlePrimaryColorChange} />
                    </div>
                  )}
                </div>

                {/* Accent Color */}
                <div className="space-y-2">
                  <Label className="text-minimal-sm">Accent Color</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-md border-2 border-border cursor-pointer hover:scale-105 transition-transform shadow-minimal"
                      style={{ backgroundColor: accentColor }}
                      onClick={() => setShowAccentPicker(!showAccentPicker)}
                    />
                    <Input
                      value={accentColor}
                      onChange={(e) => handleAccentColorChange(e.target.value)}
                      className="input-minimal bg-background border-border font-mono text-minimal-sm"
                      placeholder="#a855f7"
                    />
                  </div>
                  {showAccentPicker && (
                    <div className="mt-2 p-3 bg-muted/20 rounded-md">
                      <HexColorPicker color={accentColor} onChange={handleAccentColorChange} />
                    </div>
                  )}
                </div>

                {/* Background Color */}
                <div className="space-y-2">
                  <Label className="text-minimal-sm">Background Color</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-md border-2 border-border cursor-pointer hover:scale-105 transition-transform shadow-minimal"
                      style={{ backgroundColor: backgroundColor }}
                      onClick={() => setShowBackgroundPicker(!showBackgroundPicker)}
                    />
                    <Input
                      value={backgroundColor}
                      onChange={(e) => handleBackgroundColorChange(e.target.value)}
                      className="input-minimal bg-background border-border font-mono text-minimal-sm"
                      placeholder="#0f0f23"
                    />
                  </div>
                  {showBackgroundPicker && (
                    <div className="mt-2 p-3 bg-muted/20 rounded-md">
                      <HexColorPicker color={backgroundColor} onChange={handleBackgroundColorChange} />
                    </div>
                  )}
                </div>

                {/* Card Color */}
                <div className="space-y-2">
                  <Label className="text-minimal-sm">Card Color</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-md border-2 border-border cursor-pointer hover:scale-105 transition-transform shadow-minimal"
                      style={{ backgroundColor: cardColor }}
                      onClick={() => setShowCardPicker(!showCardPicker)}
                    />
                    <Input
                      value={cardColor}
                      onChange={(e) => handleCardColorChange(e.target.value)}
                      className="input-minimal bg-background border-border font-mono text-minimal-sm"
                      placeholder="#1a1a2e"
                    />
                  </div>
                  {showCardPicker && (
                    <div className="mt-2 p-3 bg-muted/20 rounded-md">
                      <HexColorPicker color={cardColor} onChange={handleCardColorChange} />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* UI Preferences */}
          <Card className="bg-card-minimal border-minimal shadow-minimal">
            <CardHeader className="card-minimal-sm">
              <CardTitle className="flex items-center gap-2 text-minimal-lg">
                <Monitor className={`icon-minimal ${isColorModeEnabled ? 'text-primary' : 'text-foreground'}`} />
                UI Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="card-minimal-sm pt-0 space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="color-mode" className="flex items-center gap-2 text-minimal-sm">
                  {isColorModeEnabled ? <Sun className="icon-minimal-sm" /> : <Moon className="icon-minimal-sm" />}
                  Colorful UI
                </Label>
                <Switch 
                  id="color-mode" 
                  checked={isColorModeEnabled}
                  onCheckedChange={setColorModeEnabled}
                />
              </div>
              <p className="text-minimal-xs text-muted-foreground">
                Disable to use a minimal monochrome interface similar to terminal applications.
              </p>
            </CardContent>
          </Card>

          {/* Configuration Management */}
          <Card className="bg-card-minimal border-minimal shadow-minimal">
            <CardHeader className="card-minimal-sm">
              <CardTitle className="flex items-center gap-2 text-minimal-lg">
                <RefreshCw className={`icon-minimal ${isColorModeEnabled ? 'text-primary' : 'text-foreground'}`} />
                Configuration Management
              </CardTitle>
            </CardHeader>
            <CardContent className="card-minimal-sm pt-0 space-y-3">
              <div className="grid gap-2">
                <Button onClick={exportSettings} variant="outline" className="w-full btn-minimal">
                  <Download className="mr-2 icon-minimal-sm" />
                  <span className="text-minimal-sm">Export Settings</span>
                </Button>
                
                <label htmlFor="import-settings">
                  <Button variant="outline" className="w-full btn-minimal" asChild>
                    <span>
                      <Upload className="mr-2 icon-minimal-sm" />
                      <span className="text-minimal-sm">Import Settings</span>
                    </span>
                  </Button>
                  <input
                    id="import-settings"
                    type="file"
                    accept=".json"
                    onChange={importSettings}
                    className="hidden"
                  />
                </label>

                <Button onClick={resetToDefaults} variant="destructive" className="w-full btn-minimal">
                  <RefreshCw className="mr-2 icon-minimal-sm" />
                  <span className="text-minimal-sm">Reset to Defaults</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Columns Tab */}
        <TabsContent value="columns" className="space-y-4">
          <Card className="bg-card-minimal border-minimal shadow-minimal">
            <CardHeader className="card-minimal-sm">
              <CardTitle className="flex items-center gap-2 text-minimal-lg">
                <SettingsIcon className={`icon-minimal ${isColorModeEnabled ? 'text-primary' : 'text-foreground'}`} />
                Column Visibility
              </CardTitle>
              <p className="text-minimal-sm text-muted-foreground">
                Choose which information to display in the songs list
              </p>
            </CardHeader>
            <CardContent className="card-minimal-sm pt-0 space-y-3">
              <div className="grid gap-2">
                {columnConfig.map((column) => {
                  const IconComponent = column.icon;
                  return (
                    <div key={column.key} className="flex items-center justify-between p-2 rounded-md border border-border/50 hover:bg-muted/30 transition-colors hover-minimal">
                      <div className="flex items-center gap-2">
                        <IconComponent className="icon-minimal-sm text-muted-foreground" />
                        <div>
                          <Label htmlFor={`column-${column.key}`} className="font-medium cursor-pointer text-minimal-sm">
                            {column.label}
                          </Label>
                          <p className="text-minimal-xs text-muted-foreground">
                            {column.description}
                          </p>
                        </div>
                      </div>
                      <Switch
                        id={`column-${column.key}`}
                        checked={columnVisibility[column.key as keyof typeof columnVisibility]}
                        onCheckedChange={(checked) => 
                          setColumnVisibility({
                            ...columnVisibility,
                            [column.key]: checked
                          })
                        }
                      />
                    </div>
                  );
                })}
              </div>
              
              <div className="pt-3 border-t border-border/50">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="btn-minimal-sm"
                    onClick={() => {
                      const allVisible = columnConfig.reduce((acc, col) => {
                        acc[col.key] = true;
                        return acc;
                      }, {} as typeof columnVisibility);
                      setColumnVisibility(allVisible);
                    }}
                  >
                    <span className="text-minimal-xs">Show All</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="btn-minimal-sm"
                    onClick={() => {
                      const allHidden = columnConfig.reduce((acc, col) => {
                        acc[col.key] = false;
                        return acc;
                      }, {} as typeof columnVisibility);
                      setColumnVisibility(allHidden);
                    }}
                  >
                    <span className="text-minimal-xs">Hide All</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="btn-minimal-sm"
                    onClick={() => {
                      const defaults = columnConfig.reduce((acc, col) => {
                        acc[col.key] = col.defaultVisible;
                        return acc;
                      }, {} as typeof columnVisibility);
                      setColumnVisibility(defaults);
                    }}
                  >
                    <span className="text-minimal-xs">Reset to Defaults</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="bg-card-minimal border-minimal shadow-minimal">
              <CardHeader className="card-minimal-sm">
                <CardTitle className="flex items-center gap-2 text-minimal-lg">
                  <Bell className={`icon-minimal ${isColorModeEnabled ? 'text-primary' : 'text-foreground'}`} />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="card-minimal-sm pt-0 space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="scrape-complete" className="text-minimal-sm">Scrape Complete</Label>
                  <Switch id="scrape-complete" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="errors" className="text-minimal-sm">Error Notifications</Label>
                  <Switch id="errors" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="weekly-report" className="text-minimal-sm">Weekly Reports</Label>
                  <Switch id="weekly-report" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="new-songs" className="text-minimal-sm">New Songs Added</Label>
                  <Switch id="new-songs" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="trending-alerts" className="text-minimal-sm">Trending Alerts</Label>
                  <Switch id="trending-alerts" />
                </div>
              </CardContent>
            </Card>

          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default Settings;