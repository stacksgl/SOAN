import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Trash2, Terminal } from "lucide-react";
import { useLogs } from "@/contexts/LogContext";

export function LogWindow() {
  const { logs, isLogWindowVisible, setLogWindowVisible, clearLogs } = useLogs();
  const [position, setPosition] = useState({ x: 20, y: 100 });
  const [size, setSize] = useState({ width: 400, height: 300 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.resize-handle')) return;
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setDragStart({
      x: e.clientX - size.width,
      y: e.clientY - size.height
    });
  }, [size]);

  const handleResizeMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing) {
      setSize({
        width: Math.max(300, e.clientX - dragStart.x),
        height: Math.max(200, e.clientY - dragStart.y)
      });
    }
  }, [isResizing, dragStart]);

  // Add event listeners
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousemove', handleResizeMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, handleMouseMove, handleResizeMouseMove, handleMouseUp]);

  if (!isLogWindowVisible) return null;

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-destructive';
      case 'warning': return 'text-warning';
      case 'success': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error': return '✕';
      case 'warning': return '⚠';
      case 'success': return '✓';
      default: return 'ℹ';
    }
  };

  return (
    <div
      ref={windowRef}
      className="fixed z-50 select-none"
      style={{
        left: position.x,
        top: position.y,
        width: size.width,
        height: size.height
      }}
    >
      <Card className="h-full bg-card/95 backdrop-blur-sm border-border shadow-2xl">
        <CardHeader 
          className="pb-2 cursor-move flex flex-row items-center justify-between space-y-0"
          onMouseDown={handleMouseDown}
        >
          <CardTitle className="text-sm flex items-center gap-2">
            <Terminal className="h-4 w-4 text-primary" />
            System Logs
          </CardTitle>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-muted"
              onClick={clearLogs}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => setLogWindowVisible(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-2 h-full">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-1">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="text-xs font-mono p-2 rounded bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className={getLevelColor(log.level)}>
                      {getLevelIcon(log.level)}
                    </span>
                    <span className="text-muted-foreground">
                      {log.timestamp}
                    </span>
                    <span className={`font-semibold ${getLevelColor(log.level)}`}>
                      {log.level.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-1 text-foreground">
                    {log.message}
                  </div>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No logs to display
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        
        {/* Resize handle */}
        <div
          className="resize-handle absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-50 hover:opacity-100"
          onMouseDown={handleResizeMouseDown}
        >
          <div className="absolute bottom-1 right-1 w-2 h-2 bg-muted-foreground"></div>
        </div>
      </Card>
    </div>
  );
}