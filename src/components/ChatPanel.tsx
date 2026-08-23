"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, RtiStage } from "@/types/rti";
import { sampleScenarios, ScenarioTemplate } from "@/lib/rti-template";
import { 
  Send, 
  User, 
  Scale,
  HelpCircle, 
  ArrowRight, 
  Loader2, 
  LayoutGrid,
  AlertTriangle,
  FileText
} from "lucide-react";

interface ChatPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
  onSelectScenario: (scenario: ScenarioTemplate) => void;
  onOpenLibrary: () => void;
  onSwitchStage?: (stage: RtiStage) => void;
  clarifyingQuestions?: string[];
  categoryDetected?: string;
  currentStage?: RtiStage;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onSelectScenario,
  onOpenLibrary,
  clarifyingQuestions = [],
  categoryDetected,
  currentStage = "section6_application",
}) => {
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, clarifyingQuestions]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const displayedScenarios = sampleScenarios.slice(0, 6);

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 shadow-sm">
      {/* Top Banner: Quick Scenario Chips & Library Trigger */}
      <div className="p-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-amber-700" />
            Common Grievance Scenarios & Precedents
          </span>
          <button
            onClick={onOpenLibrary}
            className="text-[11px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 transition"
          >
            <LayoutGrid className="w-3 h-3" />
            <span>View All (12)</span>
          </button>
        </div>

        {/* Horizontal Scroll Scenario Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {displayedScenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => onSelectScenario(sc)}
              className="text-left text-xs bg-white hover:bg-amber-50/60 border border-slate-200 hover:border-amber-400 rounded-lg p-2 transition group shrink-0 min-w-[140px] max-w-[170px] shadow-2xs cursor-pointer"
            >
              <div className="font-semibold text-slate-800 group-hover:text-amber-950 truncate text-[11px]">
                {sc.title}
              </div>
              <div className="text-[10px] text-slate-400 group-hover:text-amber-800 font-mono">
                {sc.badge}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 text-sm ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === "user"
                  ? "bg-amber-700 text-white font-medium text-xs shadow-sm"
                  : "bg-slate-900 text-amber-400 shadow-sm"
              }`}
            >
              {msg.sender === "user" ? <User className="w-4 h-4" /> : <Scale className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 ${
                msg.sender === "user"
                  ? "bg-amber-700 text-white rounded-tr-none shadow-sm"
                  : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200 shadow-2xs"
              }`}
            >
              <p className="whitespace-pre-wrap leading-relaxed text-xs sm:text-sm">{msg.text}</p>
              <div
                className={`text-[10px] mt-1.5 text-right ${
                  msg.sender === "user" ? "text-amber-200" : "text-slate-400"
                }`}
              >
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 text-sm items-center text-slate-500">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div className="bg-slate-100 rounded-2xl rounded-tl-none p-3 border border-slate-200 flex items-center gap-2 text-xs">
              <Loader2 className="w-4 h-4 animate-spin text-amber-700" />
              <span>Structuring legal queries and identifying Public Authority...</span>
            </div>
          </div>
        )}

        {/* Stage Notice Banner */}
        {currentStage === "first_appeal_19_1" && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-700 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Section 19(1) First Appeal Active:</strong>
              <div className="text-rose-700 mt-0.5">
                The live draft on the right is formatted as a formal Appeal Memorandum before the First Appellate Authority claiming certified records Free of Cost under Section 7(6).
              </div>
            </div>
          </div>
        )}

        {/* Suggested Clarification Chips (Interactive) */}
        {!isLoading && clarifyingQuestions && clarifyingQuestions.length > 0 && (
          <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3 space-y-2 mt-2">
            <div className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
              <span>Key particulars to specify:</span>
            </div>
            <div className="space-y-1.5">
              {clarifyingQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(`Particulars regarding: ${q}`)}
                  className="w-full text-left text-xs bg-white hover:bg-amber-100/60 border border-amber-200 text-slate-800 p-2 rounded-lg transition flex items-center justify-between group cursor-pointer"
                >
                  <span className="line-clamp-2">{q}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-600 shrink-0 opacity-0 group-hover:opacity-100 transition" />
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3.5 bg-slate-50 border-t border-slate-200">
        {categoryDetected && (
          <div className="mb-2 flex items-center justify-between text-[11px] text-slate-500">
            <span>
              Target Authority Domain: <strong className="text-slate-800">{categoryDetected}</strong>
            </span>
            <span className="text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded border border-slate-300 font-mono text-[10px]">
              Draft Synchronized
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={3}
            placeholder="State your grievance or the specific public records you require (e.g., 'road repair contractor details in Ward 14', 'delayed scholarship application SCH-8812', 'answer sheet copy for roll 99124')..."
            className="w-full text-xs sm:text-sm bg-white border border-slate-300 rounded-xl p-3 pr-12 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-hidden transition resize-none placeholder:text-slate-400 text-slate-800 shadow-inner"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className={`absolute right-3 bottom-3.5 p-2 rounded-lg transition flex items-center justify-center ${
              inputText.trim() && !isLoading
                ? "bg-slate-900 hover:bg-slate-800 text-amber-400 shadow-sm cursor-pointer"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
            title="Submit"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
        <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
          <span>Press <strong>Enter</strong> to submit, <strong>Shift + Enter</strong> for newline</span>
        </div>
      </div>
    </div>
  );
};
