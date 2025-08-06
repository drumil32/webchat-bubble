import { useState } from 'react';
import { ChatWidget } from '@/components/ChatWidget';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, ExternalLink, MessageCircle } from 'lucide-react';

export default function Demo() {
  const [showWidget, setShowWidget] = useState(false);
  const [config, setConfig] = useState<{
    token: string;
    baseUrl: string;
    position: 'bottom-right' | 'bottom-left';
  }>({
    token: 'demo-token-123',
    baseUrl: 'https://api.example.com',
    position: 'bottom-right',
  });

  const embedCode = `<!-- Add this to your website -->
<script src="https://yourdomain.com/chat-widget.js"></script>
<div id="chat-widget"></div>

<script>
  createChatWidget({
    selector: '#chat-widget',
    token: '${config.token}',
    baseUrl: '${config.baseUrl}',
    position: '${config.position}'
  });
</script>`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[hsl(var(--chat-background))] to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-4">
            <MessageCircle className="h-8 w-8 text-[hsl(var(--chat-primary))]" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[hsl(var(--chat-primary))] to-[hsl(var(--chat-primary-glow))] bg-clip-text text-transparent">
              Embeddable Chat Widget
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            A lightweight, customizable chatbot widget that can be embedded into any website with just a few lines of code.
          </p>
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={() => setShowWidget(true)}
              className="bg-[hsl(var(--chat-primary))] hover:bg-[hsl(var(--chat-primary-hover))]"
            >
              Try Demo
            </Button>
            <Button variant="outline">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Docs
            </Button>
          </div>
        </div>

        {/* Configuration Demo */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Code className="h-5 w-5" />
                <span>Configuration</span>
              </CardTitle>
              <CardDescription>
                Customize your chat widget settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="token">API Token</Label>
                <Input
                  id="token"
                  value={config.token}
                  onChange={(e) => setConfig({ ...config, token: e.target.value })}
                  placeholder="your-api-token"
                />
              </div>
              <div>
                <Label htmlFor="baseUrl">Base URL</Label>
                <Input
                  id="baseUrl"
                  value={config.baseUrl}
                  onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                  placeholder="https://your-api.com"
                />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <select
                  id="position"
                  value={config.position}
                  onChange={(e) => setConfig({ ...config, position: e.target.value as 'bottom-right' | 'bottom-left' })}
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Embed Code</CardTitle>
              <CardDescription>
                Copy this code to embed the widget on your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                <code>{embedCode}</code>
              </pre>
              <Button 
                variant="outline" 
                className="mt-4 w-full"
                onClick={() => navigator.clipboard.writeText(embedCode)}
              >
                Copy Code
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardContent className="pt-8">
              <div className="w-12 h-12 bg-gradient-to-r from-[hsl(var(--chat-primary))] to-[hsl(var(--chat-primary-glow))] rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Easy Integration</h3>
              <p className="text-muted-foreground text-sm">
                Add to any website with just a script tag and one function call
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-8">
              <div className="w-12 h-12 bg-gradient-to-r from-[hsl(var(--chat-primary))] to-[hsl(var(--chat-primary-glow))] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Code className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Lightweight</h3>
              <p className="text-muted-foreground text-sm">
                Minimal bundle size with optimized performance
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="pt-8">
              <div className="w-12 h-12 bg-gradient-to-r from-[hsl(var(--chat-primary))] to-[hsl(var(--chat-primary-glow))] rounded-lg flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Customizable</h3>
              <p className="text-muted-foreground text-sm">
                Configure position, theme, and behavior to match your brand
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Demo Widget */}
      {showWidget && (
        <ChatWidget 
          config={config}
          onClose={() => setShowWidget(false)}
        />
      )}
    </div>
  );
}