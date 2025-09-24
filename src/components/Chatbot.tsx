import { useEffect, useRef, useState } from "react";
import { askAI, type ChatMessage } from "@/lib/ai";
import { Send, MessageCircle, X } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export default function Chatbot() {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: t('chatbot.greeting') },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const send = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setIsLoading(true);
    const reply = await askAI(next, language);
    setMessages([...next, { role: "assistant", content: reply }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed right-4 bottom-4 z-50">
      {isOpen ? (
        <div className="w-80 sm:w-96 h-96 bg-white rounded-xl shadow-2xl border border-border flex flex-col overflow-hidden absolute bottom-16 right-0">
          <div className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span className="font-semibold">{t('chatbot.title')}</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="opacity-90 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 p-3 space-y-3 overflow-y-auto bg-muted/40">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-white border border-border text-foreground"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="text-xs text-muted-foreground">{t('chatbot.thinking')}</div>
            )}
            <div ref={endRef} />
          </div>
          <div className="p-2 border-t border-border flex items-center space-x-2">
            <input
              className="flex-1 h-9 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder={t('chatbot.placeholder')}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button
              onClick={send}
              className="inline-flex items-center justify-center rounded-md bg-primary px-3 h-9 text-primary-foreground disabled:opacity-50"
              disabled={isLoading}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => setIsOpen(true)}
            className="rounded-full w-16 h-16 flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-500 text-white shadow-xl ring-4 ring-green-400/30 hover:opacity-95 animate-[pulse_2.5s_ease-in-out_infinite] floating-button"
            aria-label="Open EcoLearn Assistant"
          >
            <MessageCircle className="w-7 h-7" />
          </button>
          <div className="text-[11px] px-2.5 py-1 rounded-full bg-black/70 text-white shadow-md whitespace-nowrap">{t('chatbot.ask.anything')}</div>
        </div>
      )}
    </div>
  );
}
