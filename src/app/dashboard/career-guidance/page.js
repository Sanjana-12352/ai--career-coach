// src/app/dashboard/career-guidance/page.js
'use client';

import { useState, useRef, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import toast from 'react-hot-toast';
import styles from './career-guidance.module.css';

export default function CareerGuidancePage() {
  const { user } = useUser();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${user?.firstName || 'there'}! 👋 I'm your AI career coach. I'm here to help you with career advice, job search strategies, skill development, and more. What would you like to discuss today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');

    // Add user message to chat
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Call AI API
      const response = await fetch('/api/ai/career-guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages.slice(1), // Exclude initial greeting
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages([...newMessages, { role: 'assistant', content: data.response }]);
      } else {
        toast.error('Failed to get AI response');
        setMessages([...newMessages, { 
          role: 'assistant', 
          content: 'Sorry, I encountered an error. Please try again.' 
        }]);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to connect to AI');
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    "How can I negotiate a higher salary?",
    "What skills should I learn for career growth?",
    "How do I transition to a new industry?",
    "Tips for networking effectively?",
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/dashboard" className={styles.backButton}>
          ← Back to Dashboard
        </Link>
        <h1 className={styles.title}>AI Career Guidance</h1>
        <p className={styles.subtitle}>Get personalized career advice powered by AI</p>
      </header>

      <div className={styles.content}>
        {/* Chat Messages */}
        <div className={styles.messagesContainer}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                message.role === 'user' ? styles.userMessage : styles.aiMessage
              }`}
            >
              <div className={styles.messageAvatar}>
                {message.role === 'user' ? (
                  <img src={user?.imageUrl} alt="You" className={styles.avatar} />
                ) : (
                  <div className={styles.aiAvatar}>🤖</div>
                )}
              </div>
              <div className={styles.messageContent}>
                <div className={styles.messageBubble}>
                  {message.content}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className={`${styles.message} ${styles.aiMessage}`}>
              <div className={styles.messageAvatar}>
                <div className={styles.aiAvatar}>🤖</div>
              </div>
              <div className={styles.messageContent}>
                <div className={styles.messageBubble}>
                  <div className={styles.typing}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length === 1 && (
          <div className={styles.quickPrompts}>
            <p className={styles.quickPromptsTitle}>Quick questions to get started:</p>
            <div className={styles.promptsGrid}>
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  className={styles.promptButton}
                  onClick={() => {
                    setInput(prompt);
                    setTimeout(() => handleSend(), 100);
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className={styles.inputContainer}>
          <textarea
            className={styles.input}
            placeholder="Ask me anything about your career..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            rows={3}
            disabled={loading}
          />
          <button
            className={styles.sendButton}
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            {loading ? '⏳' : '📤'} Send
          </button>
        </div>
      </div>
    </div>
  );
}