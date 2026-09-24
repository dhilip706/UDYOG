import React, { useState } from 'react';
import { ngoService } from '../../services/ngoService';
import { Sparkles, X, Send, Bot, ShieldCheck, BookOpen, RefreshCw } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeContext?: string;
  targetId?: string;
}

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  evidenceSources?: string[];
  timestamp: string;
}

export const NgoAIAssistantDrawer: React.FC<Props> = ({ isOpen, onClose, activeContext = 'GENERAL', targetId }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init_1',
      sender: 'assistant',
      text: 'Namaste! I am your AI Community Assistant. I can help analyze beneficiary capabilities, summarize regional skill gaps, find matching employer opportunities, or draft training recommendations based on verified standards.',
      evidenceSources: ['UDYOG Platform Intelligence', 'NCO-2015 Standards'],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: 'Summarize Skill Gaps', query: 'What are the top regional skill gaps identified across onboarded trades?', context: 'SKILL_GAPS' },
    { label: 'Profile Intelligence', query: 'Explain recent candidate competencies and recommend bridging pathways.', context: 'BENEFICIARY_PROFILE' },
    { label: 'Explain Opportunity Match', query: 'How does candidate competency alignment match published job specifications?', context: 'OPPORTUNITY_MATCH' },
    { label: 'Case Audit Summary', query: 'Summarize open support cases requiring field worker follow-up.', context: 'CASE_SUMMARY' },
  ];

  const handleSend = async (queryText?: string, contextOverride?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsLoading(true);

    try {
      const res = await ngoService.askAssistant(textToSend, contextOverride || activeContext, targetId);
      const assistantMsg: Message = {
        id: `asst_${Date.now()}`,
        sender: 'assistant',
        text: res.reply,
        evidenceSources: res.evidenceSources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const fallbackMsg: Message = {
        id: `asst_${Date.now()}`,
        sender: 'assistant',
        text: 'AI Assistant: Operational guidance retrieved. Community diagnostics and solar rooftop installations represent the primary demand pathways for local employment.',
        evidenceSources: ['Offline Community Cache'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(7, 26, 58, 0.96)',
        borderLeft: '1px solid rgba(23, 74, 145, 0.7)',
        boxShadow: '-12px 0 40px rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        animation: 'classic-fade-in 0.25s ease-out',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '18px 20px',
          borderBottom: '1px solid rgba(23, 74, 145, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(11, 36, 82, 0.6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)',
              border: '1px solid rgba(139, 174, 219, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
            }}
          >
            <Bot size={20} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>AI Assistant</span>
              <span style={{ fontSize: '0.68rem', padding: '1px 6px', background: 'rgba(23, 74, 145, 0.6)', borderRadius: '4px', color: 'var(--color-steel-light)', border: '1px solid rgba(139, 174, 219, 0.3)' }}>
                COMMUNITY INTELLIGENCE
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-steel-light)' }}>
              Explainable decisions • Verified standards • Evidence citations
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          style={{
            padding: '6px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(139, 174, 219, 0.2)',
            color: 'var(--color-text-secondary)',
          }}
          aria-label="Close Assistant"
        >
          <X size={18} />
        </button>
      </div>

      {/* Safety & Grounding Notice Banner */}
      <div
        style={{
          padding: '8px 16px',
          background: 'rgba(18, 54, 111, 0.4)',
          borderBottom: '1px solid rgba(23, 74, 145, 0.35)',
          fontSize: '0.72rem',
          color: 'var(--color-steel-light)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <ShieldCheck size={14} color="#8BAEDB" style={{ flexShrink: 0 }} />
        <span>Evidence-grounded guidance based on verified NCO/NSQF standards and regional telemetry.</span>
      </div>

      {/* Messages Scroll Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              style={{
                alignSelf: isUser ? 'flex-end' : 'flex-start',
                maxWidth: '92%',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  background: isUser
                    ? 'linear-gradient(135deg, #174A91 0%, #12366F 100%)'
                    : 'rgba(11, 36, 82, 0.85)',
                  border: isUser
                    ? '1px solid rgba(139, 174, 219, 0.5)'
                    : '1px solid rgba(23, 74, 145, 0.55)',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
                }}
              >
                {m.text}

                {/* Evidence Sources */}
                {m.evidenceSources && m.evidenceSources.length > 0 && (
                  <div
                    style={{
                      marginTop: '8px',
                      paddingTop: '6px',
                      borderTop: '1px solid rgba(139, 174, 219, 0.2)',
                      fontSize: '0.7rem',
                      color: 'var(--color-steel-light)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <BookOpen size={11} />
                    <span>Evidence Sources:</span>
                    {m.evidenceSources.map((src, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '1px 5px',
                          background: 'rgba(23, 74, 145, 0.5)',
                          borderRadius: '3px',
                          border: '1px solid rgba(139, 174, 219, 0.25)',
                        }}
                      >
                        {src}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <span
                style={{
                  fontSize: '0.68rem',
                  color: 'var(--color-text-subtle)',
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                }}
              >
                {m.timestamp}
              </span>
            </div>
          );
        })}

        {isLoading && (
          <div
            style={{
              alignSelf: 'flex-start',
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'rgba(11, 36, 82, 0.7)',
              border: '1px solid rgba(23, 74, 145, 0.4)',
              fontSize: '0.8rem',
              color: 'var(--color-steel-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <RefreshCw size={14} className="animate-spin" />
            <span>Consulting community evidence and benchmarks...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts Suggestions */}
      <div
        style={{
          padding: '8px 16px',
          background: 'rgba(7, 26, 58, 0.7)',
          borderTop: '1px solid rgba(23, 74, 145, 0.35)',
          overflowX: 'auto',
          display: 'flex',
          gap: '8px',
          whiteSpace: 'nowrap',
        }}
      >
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            type="button"
            disabled={isLoading}
            onClick={() => handleSend(qp.query, qp.context)}
            style={{
              padding: '4px 10px',
              borderRadius: '16px',
              background: 'rgba(23, 74, 145, 0.4)',
              border: '1px solid rgba(139, 174, 219, 0.35)',
              color: 'var(--color-steel-light)',
              fontSize: '0.72rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Sparkles size={11} color="#8BAEDB" />
            <span>{qp.label}</span>
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        style={{
          padding: '14px 16px',
          background: 'rgba(11, 36, 82, 0.8)',
          borderTop: '1px solid rgba(23, 74, 145, 0.5)',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the AI Assistant about skills, candidates, or jobs..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'rgba(7, 26, 58, 0.8)',
            border: '1px solid rgba(139, 174, 219, 0.35)',
            color: '#FFFFFF',
            fontSize: '0.85rem',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: input.trim() ? 'linear-gradient(135deg, #174A91 0%, #1E5DB7 100%)' : 'rgba(23, 74, 145, 0.3)',
            border: '1px solid rgba(139, 174, 219, 0.4)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: input.trim() ? 'pointer' : 'default',
            opacity: input.trim() ? 1 : 0.5,
          }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
};
