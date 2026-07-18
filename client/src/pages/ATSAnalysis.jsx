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
import { analyzeATS } from "../utils/atsAnalysis";

const ATSAnalysis = () => {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef(null);

  const sourceLabel = useMemo(() => {
    if (fileName) return `Analyzing ${fileName}`;
    if (resumeText.trim()) return "Analyzing pasted resume text";
    return "No resume selected";
  }, [fileName, resumeText]);

  const analysis = useMemo(
    () => analyzeATS({ resumeText, jobDescription }),
    [resumeText, jobDescription]
  );

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

  const downloadReport = async () => {
    if (!resumeText.trim()) {
      toast.error("Add resume content before exporting.");
      return;
    }

    if (isExporting) return;

    setIsExporting(true);
    try {
      const reportWindow = window.open("", "_blank");
      if (!reportWindow) {
        toast.error("Allow popups to export the ATS report.");
        return;
      }

      reportWindow.document.write(getReportHtml(analysis, fileName));
      reportWindow.document.close();
      reportWindow.focus();
      setTimeout(() => {
        reportWindow.print();
        setIsExporting(false);
      }, 300);
    } catch (error) {
      toast.error(error?.message || "Failed to export ATS report.");
      setIsExporting(false);
    }
  };

  return (
    <div className="app-bg min-h-screen">
      <header className="sticky top-0 z-40 backdrop-blur-xl border-b" style={{ backgroundColor: 'var(--bg-nav)', borderColor: 'var(--border-light)' }}>
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
        <nav className="relative flex items-center justify-between max-w-7xl mx-auto py-3.5 px-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="size-9 rounded-xl gradient-btn flex items-center justify-center text-sm font-bold shadow-lg shadow-violet-500/30 group-hover:scale-105 transition-transform">
              RB
            </div>
            <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>ResumeBuilder</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/" className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text-dim)' }}>
              Home
            </Link>
            <Link to="/app" className="gradient-btn rounded-xl px-4 py-2 text-sm glow">
              Dashboard
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex gap-2 items-center text-subtle hover:text-violet-400 transition-colors font-medium text-sm mb-8">
          <ArrowLeft className="size-4" />
          Back to Home
        </Link>

        <section className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5">
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="h-[3px] bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 glow" />
              <div className="p-6">
                <div className="flex items-center gap-2.5 mb-2">
                  <FileSearch className="size-5 text-subtle" />
                  <h1 className="text-2xl font-bold text-primary">ATS Analysis</h1>
                </div>
                <p className="text-sm text-subtle leading-relaxed mb-6">
                  Upload a PDF resume or paste resume text, then compare it with a target job description.
                </p>

                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isParsing}
                    className="w-full flex flex-col items-center justify-center gap-3 border-2 border-dashed border-theme rounded-xl p-6 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all disabled:opacity-60"
                  >
                    {isParsing ? (
                      <LoaderCircle className="size-9 animate-spin text-cyan-300" />
                    ) : (
                      <UploadCloud className="size-10 stroke-1 text-hidden" />
                    )}
                    <span className="text-sm font-medium text-muted">
                      {isParsing ? "Parsing resume..." : fileName || "Upload PDF Resume"}
                    </span>
                    <span className="text-xs text-faint">PDF text is extracted in your browser.</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    hidden
                    onChange={handleFileUpload}
                  />

                  <div>
                    <label htmlFor="resume-text" className="block text-sm font-medium text-muted mb-2">
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
                      disabled={isExporting || !resumeText.trim()}
                      className="gradient-btn-cyan rounded-xl px-4 py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isExporting ? <LoaderCircle className="size-4 animate-spin" /> : <Download className="size-4" />}
                      {isExporting ? "Generating..." : "Export PDF"}
                    </button>
                    <button
                      type="button"
                      onClick={clearResume}
                      className="rounded-xl px-4 py-2.5 text-sm border border-theme text-dim flex items-center justify-center gap-2"
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
                <h2 className="text-sm font-semibold text-body">What gets checked</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-2 text-xs text-faint">
                {["Keyword match", "Missing keywords", "Contact details", "Summary strength", "Skills coverage", "Measurable impact", "Education", "Projects"].map((item) => (
                  <div key={item} className="rounded-lg bg-glass-3 border border-theme-light px-3 py-2">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <ATSAnalyzer
              resumeText={resumeText}
              sourceLabel={sourceLabel}
              jobDescription={jobDescription}
              onJobDescriptionChange={setJobDescription}
              analysis={analysis}
            />
          </div>
        </section>
      </main>
    </div>
  );
};

const rows = (items, render) => items.map(render).join("");

const getReportHtml = (analysis, fileName) => {
  const scoreRows = rows(Object.entries(analysis.scores), ([label, value]) => `
    <tr><td class="score-label">${label}</td><td class="score-value">${value != null ? `${value}%` : "--"}</td></tr>
  `);
  const statRows = rows(Object.entries(analysis.stats), ([label, value]) => `
    <tr><td class="score-label">${label}</td><td class="score-value">${value != null ? value : "--"}</td></tr>
  `);
  const checkRows = rows(analysis.checks, (item) => `
    <li class="${item.passed ? "pass" : "fail"}">${item.passed ? "✅" : "⚠️"} ${item.label}</li>
  `);
  const sectionRows = rows(analysis.sectionAnalysis, (section) => `
    <li><strong>${section.section}</strong> <span class="badge">${section.score}%</span> — ${section.feedback}${section.suggestions.length ? `<br/><span class="suggestion">Suggestions: ${section.suggestions.join("; ")}</span>` : ""}</li>
  `);
  const priorityRows = rows(analysis.priorities, (item) => `<li class="priority-${item.level.toLowerCase()}"><strong>${item.level}</strong>: ${item.text}</li>`);
  const skillEntries = Object.entries(analysis.skills);
  const totalSkills = skillEntries.reduce((s, [, v]) => s + v.length, 0);
  const skillRows = skillEntries.length ? skillEntries.map(([cat, items]) => {
    const tags = items.map((s) => '<span class="skill-tag">' + s + "</span>").join("");
    return '<div class="skill-cat"><strong>' + cat + '</strong> <span class="badge">' + items.length + '</span><div class="skill-tags">' + tags + "</div></div>";
  }).join("") : '<p class="muted">No skills detected.</p>';
  const formattingRows = analysis.formattingIssues.length ? analysis.formattingIssues.map(i => '<li class="fail">⚠️ ' + i + '</li>').join("") : '<li class="pass">✅ No common formatting issues</li>';
  const verbRows = analysis.weakVerbs.length ? analysis.weakVerbs.map(v => '<li class="fail">⚠️ <strong>' + v.phrase + '</strong> → Try: ' + v.alternatives.join(", ") + '</li>').join("") : '<li class="pass">✅ No weak action verb patterns</li>';

  return `
    <!doctype html>
    <html>
      <head>
        <title>ATS Analysis Report${fileName ? ` - ${fileName}` : ""}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
            color: #1e293b; margin: 0; padding: 0;
            background: #f8fafc; line-height: 1.6;
          }
          .header {
            background: linear-gradient(135deg, #1e1b4b, #312e81);
            color: #fff; padding: 36px 48px;
          }
          .header h1 { font-size: 28px; font-weight: 700; letter-spacing: -0.5px; }
          .header .meta { color: #a5b4fc; font-size: 13px; margin-top: 6px; }
          .header .overall {
            display: inline-block; margin-top: 16px;
            background: rgba(255,255,255,0.12); border-radius: 12px;
            padding: 12px 28px;
          }
          .header .overall .num { font-size: 42px; font-weight: 800; color: #e0e7ff; }
          .header .overall .label { font-size: 12px; color: #a5b4fc; margin-top: 2px; }
          .body { padding: 36px 48px; }
          section { margin-bottom: 32px; }
          h2 {
            font-size: 16px; font-weight: 600; color: #1e293b;
            border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 14px;
            display: flex; align-items: center; gap: 8px;
          }
          .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
          table { width: 100%; border-collapse: collapse; font-size: 14px; }
          td { padding: 8px 12px; border-bottom: 1px solid #f1f5f9; }
          .score-label { color: #64748b; }
          .score-value { text-align: right; font-weight: 600; color: #1e293b; }
          ul { list-style: none; padding: 0; }
          li { padding: 6px 0; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
          li:last-child { border-bottom: none; }
          .pass { color: #059669; }
          .fail { color: #d97706; }
          .muted { color: #94a3b8; font-size: 13px; }
          .badge {
            display: inline-block; background: #e0e7ff; color: #4338ca;
            font-size: 12px; font-weight: 600; padding: 2px 8px;
            border-radius: 6px;
          }
          .suggestion { color: #64748b; font-size: 13px; }
          .priority-high { color: #dc2626; }
          .priority-medium { color: #d97706; }
          .priority-low { color: #2563eb; }
          .skill-cat { margin-bottom: 12px; }
          .skill-cat strong { font-size: 14px; color: #1e293b; }
          .skill-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }
          .skill-tag {
            display: inline-block; background: #eef2ff; color: #4338ca;
            font-size: 12px; padding: 3px 10px; border-radius: 6px;
          }
          .tag-matched { background: #d1fae5; color: #065f46; }
          .tag-missing { background: #fef3c7; color: #92400e; }
          .keyword-section { margin-top: 12px; }
          .keyword-section h3 { font-size: 14px; color: #475569; margin-bottom: 8px; }
          .keyword-tags { display: flex; flex-wrap: wrap; gap: 6px; }
          .keyword-tag { display: inline-block; font-size: 12px; padding: 3px 10px; border-radius: 6px; }
          .recruiter-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
          .recruiter-col h3 { font-size: 14px; color: #475569; margin-bottom: 8px; }
          @media print {
            body { background: #fff; }
            .header { padding: 24px 36px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .body { padding: 24px 36px; }
            .skill-tag, .badge, .keyword-tag, .tag-matched, .tag-missing { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>ATS Analysis Report</h1>
          <p class="meta">Generated ${new Date().toLocaleString()}${fileName ? ` &middot; Source: ${fileName}` : ""}</p>
          <div class="overall">
            <div class="num">${analysis.scores.overall != null ? `${analysis.scores.overall}/100` : "--/100"}</div>
            <div class="label">Overall ATS Score</div>
          </div>
        </div>

        <div class="body">
          <section>
            <h2>📊 Category Scores</h2>
            <div class="grid-2">
              <div>
                <h2 style="font-size:14px;border:none;margin-bottom:6px;">Scores</h2>
                <table>${scoreRows}</table>
              </div>
              <div>
                <h2 style="font-size:14px;border:none;margin-bottom:6px;">Statistics</h2>
                <table>${statRows}</table>
              </div>
            </div>
          </section>

          <section>
            <h2>✅ Resume Completeness</h2>
            <p style="margin-bottom:8px;"><strong>${analysis.completion != null ? `${analysis.completion}% complete` : "--"}</strong></p>
            <ul>${checkRows}</ul>
          </section>

          <section>
            <h2>🔑 Keyword Analysis</h2>
            <p><strong>Keyword Match:</strong> ${analysis.keywords.score != null ? `${analysis.keywords.score}%` : "--"}</p>
            ${analysis.keywords.jobKeywords.length ? `
            <div class="keyword-section">
              <h3>Matched Keywords (${analysis.keywords.matched.length})</h3>
              <div class="keyword-tags">${analysis.keywords.matched.length ? analysis.keywords.matched.map(k => `<span class="keyword-tag tag-matched">${k}</span>`).join("") : '<span class="muted">None</span>'}</div>
            </div>
            <div class="keyword-section">
              <h3>Missing Keywords (${analysis.keywords.missing.length})</h3>
              <div class="keyword-tags">${analysis.keywords.missing.length ? analysis.keywords.missing.map(k => `<span class="keyword-tag tag-missing">${k}</span>`).join("") : '<span class="muted">None</span>'}</div>
            </div>
            ` : '<p class="muted">No job description provided for keyword analysis.</p>'}
          </section>

          <section>
            <h2>🧠 Resume Health</h2>
            <div class="grid-2">
              <div>
                <h3 style="font-size:14px;color:#059669;margin-bottom:6px;">Strengths</h3>
                <ul>${analysis.health.strengths.length ? analysis.health.strengths.map(s => `<li class="pass">✅ ${s}</li>`).join("") : '<li class="muted">None detected yet</li>'}</ul>
              </div>
              <div>
                <h3 style="font-size:14px;color:#d97706;margin-bottom:6px;">Weaknesses</h3>
                <ul>${analysis.health.weaknesses.length ? analysis.health.weaknesses.map(w => `<li class="fail">⚠️ ${w}</li>`).join("") : '<li class="muted">None detected</li>'}</ul>
              </div>
            </div>
          </section>

          <section>
            <h2>📋 ATS Compatibility Checklist</h2>
            <ul>${analysis.compatibility.length ? rows(analysis.compatibility, (item) => `<li class="${item.passed ? "pass" : "fail"}">${item.passed ? "✅" : "⚠️"} ${item.label}</li>`) : '<li class="muted">Upload a resume to see checklist.</li>'}</ul>
          </section>

          <section>
            <h2>📖 Readability Analysis</h2>
            <table>
              <tr><td class="score-label">Readability Score</td><td class="score-value">${analysis.readability.score != null ? `${analysis.readability.score}%` : "--"}</td></tr>
              <tr><td class="score-label">Reading Time</td><td class="score-value">${analysis.readability.readingTime != null ? `${analysis.readability.readingTime} min` : "--"}</td></tr>
              <tr><td class="score-label">Avg Sentence Length</td><td class="score-value">${analysis.readability.averageSentenceLength != null ? `${analysis.readability.averageSentenceLength} words` : "--"}</td></tr>
              <tr><td class="score-label">Avg Bullet Length</td><td class="score-value">${analysis.readability.averageBulletLength != null ? `${analysis.readability.averageBulletLength} words` : "--"}</td></tr>
              <tr><td class="score-label">Long Sentences</td><td class="score-value">${analysis.readability.longSentences != null ? analysis.readability.longSentences : "--"}</td></tr>
              <tr><td class="score-label">Passive Voice</td><td class="score-value">${analysis.readability.passiveVoice != null ? analysis.readability.passiveVoice : "--"}</td></tr>
            </table>
          </section>

          <section>
            <h2>📁 Section-wise Analysis</h2>
            <ul>${sectionRows || '<li class="muted">Upload a resume to see section analysis.</li>'}</ul>
          </section>

          <section>
            <h2>🛠 Formatting Checker</h2>
            <ul>${formattingRows}</ul>
          </section>

          <section>
            <h2>💪 Action Verb Checker</h2>
            <ul>${verbRows}</ul>
          </section>

          <section>
            <h2>🏷 Skills Categorization</h2>
            ${skillEntries.length ? `<p class="muted" style="margin-bottom:10px;">${totalSkills} skill${totalSkills !== 1 ? "s" : ""} recognized across ${skillEntries.length} categor${skillEntries.length !== 1 ? "ies" : "y"}</p>` : ""}
            ${skillRows}
          </section>

          <section>
            <h2>🎯 Improvement Priorities</h2>
            <ul>${priorityRows || "<li class=\"muted\">No urgent improvements detected</li>"}</ul>
          </section>

          <section>
            <h2>👀 Recruiter Scan Simulation</h2>
            <div class="recruiter-grid">
              <div class="recruiter-col">
                <h3>✅ Likely Noticed</h3>
                <ul>${analysis.recruiterScan.noticed.length ? analysis.recruiterScan.noticed.map(s => `<li class="pass">✅ ${s}</li>`).join("") : '<li class="muted">No standout signals.</li>'}</ul>
              </div>
              <div class="recruiter-col">
                <h3>⚠️ May Be Overlooked</h3>
                <ul>${analysis.recruiterScan.overlooked.length ? analysis.recruiterScan.overlooked.map(s => `<li class="fail">⚠️ ${s}</li>`).join("") : '<li class="muted">Nothing overlooked.</li>'}</ul>
              </div>
            </div>
          </section>

          <p class="muted" style="text-align:center;margin-top:24px;padding-top:16px;border-top:1px solid #e2e8f0;">
            Generated by ResumeBuilder ATS Analyzer
          </p>
        </div>
      </body>
    </html>
  `;
};

export default ATSAnalysis;
