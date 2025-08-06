// Widget build file for embedding
import React from 'react';
import { createRoot } from 'react-dom/client';
import { ChatWidget } from './components/ChatWidget';
import './index.css';

interface ChatWidgetConfig {
  token: string;
  baseUrl: string;
  position?: 'bottom-right' | 'bottom-left';
  theme?: 'light' | 'dark';
}

interface EmbedConfig extends ChatWidgetConfig {
  selector: string;
}

// Global function to create and mount the chat widget
function createChatWidget(config: EmbedConfig) {
  const container = document.querySelector(config.selector);
  if (!container) {
    console.error(`Chat widget container not found: ${config.selector}`);
    return;
  }

  // Remove selector from config as it's not needed for the component
  const { selector, ...widgetConfig } = config;

  // Create React root and render the widget
  const root = createRoot(container);
  root.render(React.createElement(ChatWidget, { config: widgetConfig }));
}

// Make the function globally available
(window as any).createChatWidget = createChatWidget;

// Also export for module usage
export { createChatWidget };
export type { ChatWidgetConfig, EmbedConfig };