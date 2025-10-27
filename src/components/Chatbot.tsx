import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { MessageSquare, Send, Bot, User } from 'lucide-react';
import '../styles/Chatbot.css';

interface Message {
  text: string;
  isUser: boolean;
}

const TypingIndicator: React.FC = () => (
  <div className="typing-indicator">
    <span />
    <span />
    <span />
  </div>
);

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isIdle, setIsIdle] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const welcomeTimer = setTimeout(() => {
      if (!isOpen) setShowWelcome(true);
    }, 1500);

    const welcomeHideTimer = setTimeout(() => setShowWelcome(false), 6500);

    return () => {
      clearTimeout(welcomeTimer);
      clearTimeout(welcomeHideTimer);
    };
  }, []);

  useEffect(() => {
    let idleTimeout: NodeJS.Timeout;
    if (!isOpen) {
      idleTimeout = setTimeout(() => setIsIdle(true), 10000);
    } else {
      setIsIdle(false);
    }
    return () => clearTimeout(idleTimeout);
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    const userMessage: Message = { text: inputValue, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    const prompt = inputValue;
    setInputValue('');
    setIsLoading(true);
    setIsIdle(false);

    try {
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      const botMessage: Message = { text: data.reply, isUser: false };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error contacting backend:', error);
      const botMessage: Message = { text: 'Sorry, I cannot respond right now. Try again later.', isUser: false };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showWelcome && (
        <div className="fixed bottom-24 right-4 bg-primary text-primary-foreground p-3 rounded-lg shadow-lg z-50 welcome-popup">
          Hi there 👋 Need help?
        </div>
      )}

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            className={`fixed bottom-4 right-4 h-16 w-16 rounded-full shadow-lg z-50 chat-icon-hover ${isIdle ? 'chatbot-idle' : ''}`}
          >
            <MessageSquare size={32} />
          </Button>
        </SheetTrigger>

        <SheetContent className="w-[400px] sm:w-[540px] flex flex-col chatbot-enter">
          <SheetHeader>
            <SheetTitle>CoPi</SheetTitle>
          </SheetHeader>

          <div className="flex-grow overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex items-start gap-3 ${msg.isUser ? 'justify-end' : ''} message-enter`}>
                {!msg.isUser && <Bot className="h-8 w-8 text-primary" />}
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${msg.isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                >
                  
                  <div className="text-sm markdown">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
                {msg.isUser && <User className="h-8 w-8 text-muted-foreground" />}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start gap-3 message-enter">
                <Bot className="h-8 w-8 text-primary" />
                <div className="rounded-lg px-4 py-2 max-w-[80%] bg-muted flex items-center">
                  <TypingIndicator />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t">
            <div className="relative">
              <Input
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setIsIdle(false);
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything..."
                className="pr-12"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute top-1/2 right-2 -translate-y-1/2"
                onClick={handleSendMessage}
                disabled={isLoading}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Chatbot;
