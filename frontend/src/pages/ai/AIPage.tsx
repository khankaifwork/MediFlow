import { useState, useRef, useEffect } from "react";
import AppLayout from "../../components/layout/AppLayout";
import { askAIChat, getAIBusinessSummary, askPharmacyAgent } from "../../services/ai.service";
import toast from "react-hot-toast";
import {
  Sparkles,
  Bot,
  Send,
  Loader2,
  TrendingUp,
  Database,
  Copy,
  Check,
  RefreshCw,
  Lightbulb,
} from "lucide-react";

type Message = {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  mode?: string;
};

let messageIdCounter = 0;
function getNextId(prefix: string) {
  messageIdCounter += 1;
  return `${prefix}-${messageIdCounter}`;
}

export default function AIPage() {
  const [activeTab, setActiveTab] = useState<"chat" | "executive" | "agent">("chat");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "ai",
      text: "Hello! I am your **MediFlow AI Intelligence Assistant**, powered by Google Gemini. Ask me about medicine interactions, stock recommendations, or analyze pharmacy revenue.",
      timestamp: "Today",
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [executiveSummary, setExecutiveSummary] = useState<string | null>(null);
  const [executiveLoading, setExecutiveLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSendMessage(overrideText?: string) {
    const textToSend = overrideText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = {
      id: getNextId("msg"),
      sender: "user",
      text: textToSend.trim(),
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!overrideText) setInputQuery("");
    setLoading(true);

    try {
      let answer = "";
      if (activeTab === "agent") {
        answer = await askPharmacyAgent(userMessage.text);
      } else {
        answer = await askAIChat(userMessage.text);
      }

      const aiMessage: Message = {
        id: getNextId("ai"),
        sender: "ai",
        text: answer,
        timestamp: "Just now",
        mode: activeTab === "agent" ? "Database Agent" : "Clinical Consultant",
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch AI response.");
      setMessages((prev) => [
        ...prev,
        {
          id: getNextId("ai-err"),
          sender: "ai",
          text: "⚠️ Sorry, I could not complete that request. Please check the backend connection and Gemini API key.",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }


  async function generateExecutiveBriefing() {
    setExecutiveLoading(true);
    try {
      const summary = await getAIBusinessSummary();
      setExecutiveSummary(summary);
      toast.success("AI Executive Business Briefing generated!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate executive briefing.");
    } finally {
      setExecutiveLoading(false);
    }
  }

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  }

  const promptSuggestions = [
    "Which medicines are running low in stock right now?",
    "Summarize today's sales and revenue metrics",
    "What are common drug interactions with Metformin?",
    "Suggest a reorder plan based on sales velocity",
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col justify-between gap-4 rounded-3xl border border-teal-500/20 bg-gradient-to-r from-teal-900 via-slate-900 to-slate-950 p-6 md:p-8 text-white shadow-xl shadow-teal-950/20 md:flex-row md:items-center">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-xs font-semibold text-teal-300 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 animate-pulse text-teal-300" />
              <span>Gemini 2.5 Pharmacy Intelligence</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              MediFlow AI Assistant & Copilot
            </h1>
            <p className="max-w-2xl text-xs md:text-sm text-slate-300">
              Autonomous clinical insights, live inventory queries, and real-time executive summaries
              grounded in your pharmacy's live database.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab("executive");
                if (!executiveSummary) generateExecutiveBriefing();
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-teal-500/20 hover:from-teal-400 hover:to-cyan-400 transition active:scale-95"
            >
              <TrendingUp className="h-4 w-4" />
              <span>Executive Briefing</span>
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition ${
              activeTab === "chat"
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Bot className="h-4 w-4" />
            <span>Clinical Assistant</span>
          </button>

          <button
            onClick={() => setActiveTab("agent")}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition ${
              activeTab === "agent"
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Database className="h-4 w-4" />
            <span>Live DB Agent</span>
            <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-bold text-teal-800 uppercase">
              Tool Calling
            </span>
          </button>

          <button
            onClick={() => setActiveTab("executive")}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition ${
              activeTab === "executive"
                ? "border-teal-600 text-teal-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>Executive Insights</span>
          </button>
        </div>

        {/* Tab Content: Executive Briefing */}
        {activeTab === "executive" && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  AI Pharmacy Health & Sales Summary
                </h3>
                <p className="text-xs text-slate-500">
                  Aggregates today's revenue, low stock alerts, and high-margin product movements
                </p>
              </div>

              <button
                onClick={generateExecutiveBriefing}
                disabled={executiveLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${executiveLoading ? "animate-spin" : ""}`} />
                <span>{executiveLoading ? "Analyzing Data..." : "Regenerate Briefing"}</span>
              </button>
            </div>

            <div className="mt-6">
              {executiveLoading ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Loader2 className="h-10 w-10 animate-spin text-teal-600 mb-3" />
                  <p className="text-sm font-semibold text-slate-800">
                    Gemini AI is auditing live sales and stock figures...
                  </p>
                  <p className="text-xs text-slate-500">
                    Computing trends across daily orders, inventory thresholds, and profitability.
                  </p>
                </div>
              ) : executiveSummary ? (
                <div className="prose prose-slate max-w-none rounded-2xl bg-slate-50/80 p-6 border border-slate-200/70">
                  <div className="whitespace-pre-line text-sm leading-relaxed text-slate-800">
                    {executiveSummary}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-sm text-slate-500 mb-4">No executive summary generated yet.</p>
                  <button
                    onClick={generateExecutiveBriefing}
                    className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition"
                  >
                    Generate Initial Business Health Report
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab Content: Chat & Agent Interface */}
        {(activeTab === "chat" || activeTab === "agent") && (
          <div className="flex flex-col h-[650px] rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
            {/* Mode Banner */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-6 py-3 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                <span className="font-semibold text-slate-900">
                  {activeTab === "agent"
                    ? "Tool-Grounded Agent Mode (Direct DB Context: Inventory, Sales, Thresholds)"
                    : "Clinical & Pharmacy Consultant Mode (General & Medical Guidance)"}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">Gemini Flash Model</span>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-2xl rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "bg-teal-600 text-white"
                        : "border border-slate-200/80 bg-slate-50/90 text-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 mb-1 text-[11px] opacity-75">
                      <span className="font-bold">
                        {msg.sender === "user" ? "You" : msg.mode || "MediFlow AI"}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div className="whitespace-pre-line">{msg.text}</div>

                    {msg.sender === "ai" && (
                      <div className="mt-3 flex justify-end border-t border-slate-200/50 pt-2">
                        <button
                          onClick={() => copyToClipboard(msg.text, msg.id)}
                          className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800 transition"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="h-3 w-3 text-green-600" />
                              <span className="text-green-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy Response</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50 p-4 text-sm text-slate-600 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
                    <span>
                      {activeTab === "agent"
                        ? "Querying pharmacy database tools & compiling response..."
                        : "Gemini AI is analyzing..."}
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Prompt Suggestions */}
            <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-2.5 overflow-x-auto flex gap-2">
              <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 shrink-0">
                <Lightbulb className="h-3.5 w-3.5 text-amber-500" />
                <span>Try asking:</span>
              </span>
              {promptSuggestions.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSendMessage(prompt)}
                  disabled={loading}
                  className="shrink-0 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 hover:border-teal-400 hover:bg-teal-50/50 transition disabled:opacity-50"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-3 border-t border-slate-200/80 bg-white p-4"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={
                  activeTab === "agent"
                    ? "Ask a question about live inventory, stock counts, or sales..."
                    : "Ask about clinical medications, interactions, dosages..."
                }
                disabled={loading}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 placeholder-slate-400 transition focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 disabled:bg-slate-50"
              />

              <button
                type="submit"
                disabled={loading || !inputQuery.trim()}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-teal-600 text-white shadow-md shadow-teal-600/20 transition hover:bg-teal-700 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
          </div>
        )}
      </div>
    </AppLayout>
  );
}