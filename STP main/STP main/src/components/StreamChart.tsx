import { useEffect, useState } from "react";
import { fetchSongDetails } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, TrendingUp } from "lucide-react";

interface StreamData {
  date: string;
  streams: number;
  label: string;
}

interface StreamChartProps {
  songId: string;
  songTitle: string;
  avgEvolution?: number; // soundcharts_avg_evolution from backend
}

type Period = 'week' | 'month' | '3months' | '9months' | 'year';

const periodLabels = {
  week: 'Week',
  month: 'Month', 
  '3months': '3 Months',
  '9months': '9 Months',
  year: 'Year'
};

const periodDays = {
  week: 7,
  month: 30,
  '3months': 90,
  '9months': 270,
  year: 365
};

// Generate data from backend or fallback
const generateMockData = (period: Period): StreamData[] => {
  const days = periodDays[period];
  const data: StreamData[] = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Generate realistic stream data with some variation
    const baseStreams = 15000 + Math.random() * 10000;
    const weekendBoost = date.getDay() === 0 || date.getDay() === 6 ? 1.3 : 1;
    const trendFactor = 1 + (Math.random() - 0.5) * 0.4; // ±20% variation
    
    const streams = Math.floor(baseStreams * weekendBoost * trendFactor);
    
    let label: string;
    if (period === 'week') {
      label = date.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (period === 'month') {
      label = date.getDate().toString();
    } else if (period === '3months' || period === '9months') {
      label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      label = date.toLocaleDateString('en-US', { month: 'short' });
    }
    
    data.push({
      date: date.toISOString().split('T')[0],
      streams,
      label
    });
  }
  
  return data;
};

export function StreamChart({ songId, songTitle, avgEvolution }: StreamChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');
  const [chartData, setChartData] = useState<StreamData[]>([]);

  useEffect(() => {
    (async () => {
      const details = await fetchSongDetails(songId);
      if (details?.ok && Array.isArray(details.items) && details.items.length > 0) {
        const mapped: StreamData[] = details.items.map((p) => ({
          date: p?.date || "",
          streams: Number(p?.value || 0),
          label: (p?.date || "").slice(5),
        }));
        setChartData(mapped);
      } else {
        setChartData(generateMockData('month'));
      }
    })();
  }, [songId]);

  const handlePeriodChange = (period: Period) => {
    setSelectedPeriod(period);
    if (chartData.length === 0) {
      setChartData(generateMockData(period));
    }
  };

  const calculateAverageStreams = () => {
    // Prefer backend-provided average (soundcharts_avg_evolution)
    if (typeof avgEvolution === 'number' && Number.isFinite(avgEvolution)) {
      return Math.floor(avgEvolution);
    }
    if (chartData.length === 0) return 0;
    const total = chartData.reduce((sum, item) => sum + item.streams, 0);
    return Math.floor(total / chartData.length);
  };

  const calculateTotalStreams = () => {
    return chartData.reduce((sum, item) => sum + item.streams, 0);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  const averageStreams = calculateAverageStreams();
  const totalStreams = calculateTotalStreams();

  // Determine chart type based on period
  const useLineChart = selectedPeriod === '3months' || selectedPeriod === '9months' || selectedPeriod === 'year';

  return (
    <Card className="bg-card-minimal border-minimal shadow-minimal">
      <CardHeader className="card-minimal-sm">
        <CardTitle className="flex items-center gap-1 text-minimal-sm">
          <Calendar className="icon-minimal-xs" />
          Daily Streams - {songTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="card-minimal-sm pt-0 space-y-2">
        {/* Period Selection */}
        <div className="flex flex-wrap gap-1">
          {(Object.keys(periodLabels) as Period[]).map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => handlePeriodChange(period)}
              className="btn-minimal-sm"
            >
              <span className="text-minimal-xs">{periodLabels[period]}</span>
            </Button>
          ))}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-muted/30 rounded-md p-1.5">
            <div className="flex items-center gap-1 mb-0.5">
              <TrendingUp className="icon-minimal-xs text-blue-500" />
              <span className="text-minimal-xs font-medium">Average Daily</span>
            </div>
            <div className="text-minimal-sm font-bold text-muted-foreground">unavailable</div>
            <div className="text-minimal-xs text-muted-foreground">
              Data not available
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-md p-1.5">
            <div className="flex items-center gap-1 mb-0.5">
              <Calendar className="icon-minimal-xs text-green-500" />
              <span className="text-minimal-xs font-medium">Total Period</span>
            </div>
            <div className="text-minimal-sm font-bold text-muted-foreground">unavailable</div>
            <div className="text-minimal-xs text-muted-foreground">
              Data not available
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="h-24 w-full flex items-center justify-center bg-muted/20 rounded-md">
          <span className="text-sm text-muted-foreground">unavailable</span>
        </div>

      </CardContent>
    </Card>
  );
}
