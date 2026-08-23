"use client";

import React, { useState } from "react";
import { sampleScenarios, ScenarioTemplate } from "@/lib/rti-template";
import { 
  X, 
  Search, 
  Sparkles, 
  Scale, 
  ArrowRight, 
  CheckCircle2,
  GraduationCap,
  Shield,
  Briefcase,
  Activity,
  Car,
  Zap,
  Building,
  FileSearch,
  AlertTriangle
} from "lucide-react";

interface TemplateLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: ScenarioTemplate) => void;
}

export const TemplateLibraryModal: React.FC<TemplateLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  if (!isOpen) return null;

  const categories = [
    "All",
    "Civic & Infrastructure",
    "Education & Exams",
    "Police & Law",
    "Labor & Benefits",
    "Public Health",
    "Transport & RTO",
    "Utilities & Power",
    "Land & Revenue",
    "Civil Supplies",
    "First Appeals (Sec 19)",
  ];

  const filteredScenarios = sampleScenarios.filter((sc) => {
    const matchesCategory = selectedCategory === "All" || sc.category === selectedCategory;
    const matchesSearch =
      sc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.badge.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Education & Exams": return <GraduationCap className="w-4 h-4 text-indigo-500" />;
      case "Police & Law": return <Shield className="w-4 h-4 text-rose-500" />;
      case "Labor & Benefits": return <Briefcase className="w-4 h-4 text-emerald-500" />;
      case "Public Health": return <Activity className="w-4 h-4 text-teal-500" />;
      case "Transport & RTO": return <Car className="w-4 h-4 text-orange-500" />;
      case "Utilities & Power": return <Zap className="w-4 h-4 text-amber-500" />;
      case "Land & Revenue": return <Building className="w-4 h-4 text-lime-600" />;
      case "First Appeals (Sec 19)": return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default: return <FileSearch className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-lg text-slate-100 flex items-center gap-2">
                <span>RTI Template & Precedent Library</span>
                <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-mono">
                  12 Categories
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Statutorily grounded templates citing landmark Supreme Court & High Court rulings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Pills */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by topic, keyword, or authority (e.g., 'answer sheet', 'police', 'epfo', 'pothole', 'appeal')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-hidden"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap transition font-medium ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-amber-400 shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredScenarios.map((template) => (
            <div
              key={template.id}
              onClick={() => {
                onSelectTemplate(template);
                onClose();
              }}
              className="bg-white hover:bg-amber-50/40 border border-slate-200 hover:border-amber-400 rounded-xl p-4 transition shadow-2xs hover:shadow-md cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    {getCategoryIcon(template.category)}
                    <span>{template.category}</span>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 font-mono">
                    {template.badge}
                  </span>
                </div>

                {/* Title */}
                <h4 className="font-serif font-bold text-slate-900 text-sm group-hover:text-amber-900 transition mb-1">
                  {template.title}
                </h4>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                  {template.shortDesc}
                </p>

                {/* Legal Citation if available */}
                {template.legalCitation && (
                  <div className="text-[11px] bg-slate-50 text-slate-700 p-2 rounded-md border border-slate-200/80 mb-2 font-mono flex items-start gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{template.legalCitation}</span>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-amber-700 font-semibold">
                <span className="text-[11px] text-slate-400 font-mono">
                  {template.sampleData.queries?.length || 4} Specific Queries
                </span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition">
                  Load Template <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}

          {filteredScenarios.length === 0 && (
            <div className="col-span-2 text-center py-12 text-slate-400 text-sm">
              No matching RTI templates found for &quot;{searchQuery}&quot;. You can still type your grievance directly in the chat!
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Click any card to immediately populate and structure the RTI dossier.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
