"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { ChatPanel } from "@/components/ChatPanel";
import { RtiPreviewPanel } from "@/components/RtiPreviewPanel";
import { FilingGuideModal } from "@/components/FilingGuideModal";
import { TemplateLibraryModal } from "@/components/TemplateLibraryModal";
import { initialRtiData, ScenarioTemplate } from "@/lib/rti-template";
import { ChatMessage, RtiApplicationData, RtiStage } from "@/types/rti";
import { MessageSquare, FileText } from "lucide-react";

export default function Home() {
  const [rtiData, setRtiData] = useState<RtiApplicationData>(initialRtiData);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome-1",
      sender: "agent",
      text: "Welcome to NyayaRTI.\n\nThis platform prepares legally compliant Right to Information (RTI) applications, Section 19(1) First Appeals, and Section 2(j) on-site inspection notices under the RTI Act, 2005.\n\nDescribe your issue or public record request below (in English, Hindi, or Hinglish), or choose from standard precedents in the template library above. The live legal document on the right updates automatically.",
      timestamp: "Just now",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [clarifyingQuestions, setClarifyingQuestions] = useState<string[]>([
    "Which government department or municipal authority holds jurisdiction over this matter?",
    "Do you have an existing application number, grievance tracking ID, or date of filing?",
  ]);
  const [categoryDetected, setCategoryDetected] = useState<string>("Civic Infrastructure & Public Works");
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [mobileTab, setMobileTab] = useState<"chat" | "preview">("chat");

  const currentStage: RtiStage = rtiData.stage || "section6_application";

  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: newMessages.map((m) => ({ sender: m.sender, text: m.text })),
          currentRti: rtiData,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to process grievance");
      }

      const data = await res.json();

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: "agent",
        text: data.replyMessage || "The RTI application draft on the right has been updated with relevant statutory inquiries.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        stageSuggested: data.stageSuggested,
      };

      setMessages((prev) => [...prev, agentMsg]);

      if (data.updatedRti) {
        setRtiData((prev) => ({
          ...prev,
          ...data.updatedRti,
          stage: data.stageSuggested || data.updatedRti.stage || prev.stage,
        }));
      }

      if (data.clarifyingQuestions) {
        setClarifyingQuestions(data.clarifyingQuestions);
      }

      if (data.categoryDetected) {
        setCategoryDetected(data.categoryDetected);
      }
    } catch (err) {
      console.error("Chat error:", err);
      const fallbackAgentMsg: ChatMessage = {
        id: `agent-err-${Date.now()}`,
        sender: "agent",
        text: "The particulars have been recorded and updated in the draft dossier. You can review and edit specific clauses directly in the right panel.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, fallbackAgentMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectScenario = (sc: ScenarioTemplate) => {
    setRtiData((prev) => ({
      ...prev,
      ...sc.sampleData,
      stage: sc.stage,
    }));
    setCategoryDetected(sc.category);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: sc.initialPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const stageLabel =
      sc.stage === "first_appeal_19_1"
        ? "Section 19(1) First Appeal Memorandum"
        : sc.stage === "inspection_2_j"
        ? "Section 2(j) Physical Inspection Notice"
        : "Section 6(1) RTI Application";

    const agentMsg: ChatMessage = {
      id: `agent-${Date.now()}`,
      sender: "agent",
      text: `Loaded precedent: **${sc.title}** (${stageLabel}).\n\nTarget Public Authority: **${sc.sampleData.publicAuthority}**.\n\n${sc.legalCitation ? `Legal Foundation: *${sc.legalCitation}*\n\n` : ''}The application draft is prepared in the right panel and ready for export.`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      stageSuggested: sc.stage,
    };

    setMessages((prev) => [...prev, userMsg, agentMsg]);
  };

  const handleReset = () => {
    setRtiData(initialRtiData);
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "agent",
        text: "Draft reset. Enter a grievance description or select a standard precedent to begin.",
        timestamp: "Just now",
      },
    ]);
    setClarifyingQuestions([
      "Which government department or municipal authority holds jurisdiction over this matter?",
      "Do you have an existing application number, grievance tracking ID, or date of filing?",
    ]);
    setCategoryDetected("Civic Infrastructure & Public Works");
  };

  const handleUpdateRti = (newData: Partial<RtiApplicationData>) => {
    setRtiData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-100">
      {/* Navigation Header */}
      <Header
        stage={currentStage}
        onOpenLibrary={() => setIsLibraryOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onReset={handleReset}
      />

      {/* Mobile Tab Toggle */}
      <div className="md:hidden flex bg-white border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setMobileTab("chat")}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition ${
            mobileTab === "chat"
              ? "border-amber-700 text-amber-900 bg-amber-50/50"
              : "border-transparent text-slate-600"
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Intake</span>
        </button>

        <button
          onClick={() => setMobileTab("preview")}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 border-b-2 transition ${
            mobileTab === "preview"
              ? "border-amber-700 text-amber-900 bg-amber-50/50"
              : "border-transparent text-slate-600"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Dossier ({currentStage === "first_appeal_19_1" ? "First Appeal" : currentStage === "inspection_2_j" ? "Inspection" : "Sec 6(1)"})</span>
        </button>
      </div>

      {/* Main Split-Screen Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Side: Conversational Intake */}
        <section
          className={`w-full md:w-[45%] lg:w-[40%] h-full flex flex-col ${
            mobileTab === "chat" ? "flex" : "hidden md:flex"
          }`}
        >
          <ChatPanel
            messages={messages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            onSelectScenario={handleSelectScenario}
            onOpenLibrary={() => setIsLibraryOpen(true)}
            onSwitchStage={(st) => handleUpdateRti({ stage: st })}
            clarifyingQuestions={clarifyingQuestions}
            categoryDetected={categoryDetected}
            currentStage={currentStage}
          />
        </section>

        {/* Right Side: Live RTI Dossier & Preview */}
        <section
          className={`w-full md:w-[55%] lg:w-[60%] h-full flex flex-col ${
            mobileTab === "preview" ? "flex" : "hidden md:flex"
          }`}
        >
          <RtiPreviewPanel
            rtiData={rtiData}
            onUpdateRti={handleUpdateRti}
          />
        </section>
      </main>

      {/* Template Library Modal (12 Pre-configured Templates) */}
      <TemplateLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onSelectTemplate={handleSelectScenario}
      />

      {/* Filing Guide Modal */}
      <FilingGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
