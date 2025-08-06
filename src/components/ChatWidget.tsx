import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatWidgetConfig {
  token: string;
  baseUrl: string;
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'light' | 'dark';
}

interface ChatWidgetProps {
  config: ChatWidgetConfig;
  onClose?: () => void;
}

export function ChatWidget({ config, onClose }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! How can I help you today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(`${config.baseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          token: config.token,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        // Fallback message on error
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: 'Sorry, I encountered an error. Please try again.',
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I could not connect to the chat service. Please try again later.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const positionClasses = config.position === 'bottom-left' ? 'bottom-4 left-4' : 'bottom-4 right-4';

  return (
    <div className={cn('fixed z-50', positionClasses)}>
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 animate-slide-in-right">
          <div className="w-80 h-96 bg-card rounded-lg shadow-[var(--shadow-chat)] border border-border overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[hsl(var(--chat-primary))] to-[hsl(var(--chat-primary-glow))] p-4 text-primary-foreground">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageCircle className="h-5 w-5" />
                  <span className="font-medium">Chat Support</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClose}
                  className="text-primary-foreground hover:bg-white/20 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea ref={scrollAreaRef} className="h-64 p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex transition-all duration-300 ease-out',
                      'animate-fade-in',
                      message.isUser ? 'justify-end' : 'justify-start'
                    )}
                    style={{ 
                      animationDelay: `${index * 50}ms`,
                      transform: 'translateY(0)'
                    }}
                  >
                    <div
                      className={cn(
                        'max-w-[80%] px-3 py-2 rounded-lg text-sm shadow-[var(--shadow-message)]',
                        'transition-all duration-200 hover:shadow-lg',
                        message.isUser
                          ? 'bg-[hsl(var(--chat-user-message))] text-primary-foreground rounded-br-sm'
                          : 'bg-[hsl(var(--chat-bot-message))] text-foreground rounded-bl-sm'
                      )}
                    >
                      {message.isUser ? (
                        <span>{message.content}</span>
                      ) : (
                        <div className="prose prose-sm prose-slate dark:prose-invert max-w-none">
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                              code: ({ children }) => (
                                <code className="bg-muted px-1 py-0.5 rounded text-xs">{children}</code>
                              ),
                              pre: ({ children }) => (
                                <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">{children}</pre>
                              ),
                              ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                              ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                              li: ({ children }) => <li className="mb-1">{children}</li>,
                              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                              em: ({ children }) => <em className="italic">{children}</em>,
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="bg-[hsl(var(--chat-bot-message))] px-3 py-2 rounded-lg rounded-bl-sm text-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="border-t border-border p-4">
              <form onSubmit={handleSubmit} className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-[hsl(var(--chat-primary))] focus:ring-opacity-20"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className={cn(
                    "bg-[hsl(var(--chat-primary))] hover:bg-[hsl(var(--chat-primary-hover))] px-3",
                    "transition-all duration-200 hover:scale-105 active:scale-95",
                    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  )}
                >
                  <Send className={cn(
                    "h-4 w-4 transition-transform duration-200",
                    isLoading && "animate-pulse"
                  )} />
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Chat Bubble */}
      <Button
        onClick={toggleChat}
        className={cn(
          "h-12 w-12 rounded-full shadow-[var(--shadow-glow)] transition-all duration-300",
          "bg-gradient-to-r from-[hsl(var(--chat-primary))] to-[hsl(var(--chat-primary-glow))]",
          "hover:scale-110 hover:shadow-[var(--shadow-glow)]",
          !isOpen && "animate-bounce-in"
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-primary-foreground" />
        ) : (
          <MessageCircle className="h-6 w-6 text-primary-foreground" />
        )}
      </Button>
    </div>
  );
}

// Global function to create and mount the chat widget
declare global {
  interface Window {
    createChatWidget: (config: ChatWidgetConfig & { selector: string }) => void;
  }
}

export function initializeChatWidget() {
  window.createChatWidget = (config: ChatWidgetConfig & { selector: string }) => {
    const container = document.querySelector(config.selector);
    if (!container) {
      console.error(`Chat widget container not found: ${config.selector}`);
      return;
    }

    // Remove selector from config as it's not needed for the component
    const { selector, ...widgetConfig } = config;

    // Create React root and render the widget
    import('react-dom/client').then(({ createRoot }) => {
      import('react').then(({ createElement }) => {
        const root = createRoot(container);
        root.render(createElement(ChatWidget, { config: widgetConfig }));
      });
    });
  };
}