import React, { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  FileSearch,
  LoaderCircle,
  Sparkles,
  UploadCloud,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import pdfToText from "react-pdftotext";
import ATSAnalyzer from "../components/ATSAnalyzer";

const ATSAnalysis = () => {
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef(null);

  const sourceLabel = useMemo(() => {
    if (fileName) return `Analyzing ${fileName}`;
    if (resumeText.trim()) return "Analyzing pasted resume text";
    return "No resume selected";
  }, [fileName, resumeText]);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF resume.");
      event.target.value = "";
      return;
    }

    setIsParsing(true);
    try {
      const text = await pdfToText(file);
      if (!text?.trim()) {
        toast.error("Could not read text from this PDF.");
        return;
      }
      setResumeText(text);
      setFileName(file.name);
      toast.success("Resume parsed successfully.");
    } catch (error) {
      toast.error(error?.message || "Failed to parse the resume.");
    } finally {
      setIsParsing(false);
      event.target.value = "";
    }
  };

  const clearResume = () => {
    setResumeText("");
    setFileName("");
  };

  const downloadReport = () => {
    if (!resumeText.trim()) {
      toast.error("Add resume content before exporting.");
      return;
    }

    const report = [
      "ATS Analysis Input",
      `Generated: ${new Date().toLocaleString()}`,
      fileName ? `Source: ${fileName}` : "Source: pasted resume text",
      "",
      resumeText,
    ].join("\n");

    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ats-analysis-report.txt";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app-bg min-h-screen">
      <header className="sticky top-0 z-40 bg-[#0e0e1a]/90 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
        <nav className="relative flex items-center justify-between max-w-7xl mx-auto py-3.5 px-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="size-9 rounded-xl gradient-btn flex items-center justify-center text-sm font-bold shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform">
              RB
            </div>
            <span className="text-white font-semibold text-sm">ResumeBuilder</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/" className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/30 transition-all text-sm">
              Home
            </Link>
            <Link to="/app" className="gradient-btn rounded-xl px-4 py-2 text-sm glow">
              Dashboard
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex gap-2 items-center text-white/40 hover:text-violet-400 transition-colors font-medium text-sm mb-8">
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>

        <section className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="h-[3px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 glow" />
              <div className="p-6">
                <div className="flex items-center gap-2.5 mb-2">
                  <FileSearch className="size-5 text-white/40" />
                  <h1 className="text-2xl font-bold text-white">ATS Analysis</h1>
                </div>
                <p className="text-sm text-white/40 leading-relaxed mb-6">
                  Upload a PDF resume or paste resume text, then compare it with a target job description.
                </p>

                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isParsing}
                    className="w-full flex flex-col items-center justify-center gap-3 border-2 border-dashed border-white/10 rounded-xl p-6 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all disabled:opacity-60"
                  >
                    {isParsing ? (
                      <LoaderCircle className="size-9 animate-spin text-cyan-300" />
                    ) : (
                      <UploadCloud className="size-10 stroke-1 text-white/25" />
                    )}
                    <span className="text-sm font-medium text-white/70">
                      {isParsing ? "Parsing resume..." : fileName || "Upload PDF Resume"}
                    </span>
                    <span className="text-xs text-white/30">PDF text is extracted in your browser.</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    hidden
                    onChange={handleFileUpload}
                  />

                  <div>
                    <label htmlFor="resume-text" className="block text-sm font-medium text-white/70 mb-2">
                      Resume text
                    </label>
                    <textarea
                      id="resume-text"
                      rows={13}
                      value={resumeText}
                      onChange={(event) => {
                        setResumeText(event.target.value);
                        if (fileName) setFileName("");
                      }}
                      placeholder="Paste your resume text here..."
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={downloadReport}
                      className="gradient-btn-cyan rounded-xl px-4 py-2.5 text-sm flex items-center justify-center gap-2"
                    >
                      <Download className="size-4" />
                      Export
                    </button>
                    <button
                      type="button"
                      onClick={clearResume}
                      className="rounded-xl px-4 py-2.5 text-sm border border-white/10 text-white/50 hover:text-rose-300 hover:border-rose-500/30 hover:bg-rose-500/10 flex items-center justify-center gap-2"
                    >
                      <X className="size-4" />
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 mt-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="size-4 text-amber-300" />
                <h2 className="text-sm font-semibold text-white/80">What gets checked</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-2 text-xs text-white/35">
                {["Keyword match", "Missing keywords", "Contact details", "Summary strength", "Skills coverage", "Measurable impact", "Education", "Projects"].map((item) => (
                  <div key={item} className="rounded-lg bg-white/[0.03] border border-white/[0.05] px-3 py-2">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ATSAnalyzer resumeText={resumeText} sourceLabel={sourceLabel} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default ATSAnalysis;
