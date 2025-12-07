import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";
import { useColorMode } from "@/contexts/ColorModeContext";

const NotFound = () => {
  const location = useLocation();
  const { isColorModeEnabled } = useColorMode();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-card-minimal border-minimal shadow-minimal-lg glass-minimal">
          <CardHeader className="card-minimal-sm text-center">
            <CardTitle className={`text-minimal-2xl font-bold ${isColorModeEnabled ? 'text-gradient-minimal' : 'text-foreground'}`}>
              404
            </CardTitle>
          </CardHeader>
          <CardContent className="card-minimal-sm pt-0 text-center">
            <p className="text-minimal-sm text-muted-foreground mb-4">
              Oops! The page you're looking for doesn't exist.
            </p>
            <div className="space-y-2">
              <Link to="/">
                <Button className="w-full btn-minimal">
                  <Home className="mr-2 icon-minimal-sm" />
                  <span className="text-minimal-sm">Go Home</span>
                </Button>
              </Link>
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="w-full btn-minimal"
              >
                <ArrowLeft className="mr-2 icon-minimal-sm" />
                <span className="text-minimal-sm">Go Back</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
