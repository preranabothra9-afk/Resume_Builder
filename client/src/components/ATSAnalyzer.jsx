import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  Sparkles,
  Target,
} from "lucide-react";

const STOP_WORDS = new Set([
  "about", "after", "again", "also", "and", "are", "but", "can", "did",
  "for", "from", "has", "have", "into", "its", "job", "our", "per", "role",
  "that", "the", "this", "to", "was", "will", "with", "you", "your",
]);

const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getWords = (value) =>
  normalizeText(value)
    .split(" ")
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));

const getResumeText = (resumeData) => {
  const info = resumeData?.personal_info || {};
  const experience = resumeData?.experience || [];
  const education = resumeData?.education || [];
  const projects = resumeData?.project || [];
  const skills = resumeData?.skills || [];

  return [
    info.full_name,
    info.profession,
    info.location,
    info.linkedin,
    info.website,
    resumeData?.professional_summary,
    skills.join(" "),
    experience
      .map((item) => [item.position, item.company, item.description].join(" "))
      .join(" "),
    education
      .map((item) => [item.degree, item.field, item.institution].join(" "))
      .join(" "),
    projects
      .map((item) => [item.name, item.type, item.description].join(" "))
      .join(" "),
  ].join(" ");
};

const getTopKeywords = (text) => {
  const counts = getWords(text).reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 18)
    .map(([word]) => word);
};

const scoreFromChecks = (checks) => {
  const earned = checks.reduce((total, check) => total + (check.passed ? check.weight : 0), 0);
  const possible = checks.reduce((total, check) => total + check.weight, 0);
  return possible ? Math.round((earned / possible) * 100) : 0;
};

const ATSAnalyzer = ({ resumeData }) => {
  const [jobDescription, setJobDescription] = useState("");

  const analysis = useMemo(() => {
    const info = resumeData?.personal_info || {};
    const experience = resumeData?.experience || [];
    const education = resumeData?.education || [];
    const projects = resumeData?.project || [];
    const skills = resumeData?.skills || [];
    const resumeText = getResumeText(resumeData);
    const resumeWords = new Set(getWords(resumeText));
    const jobKeywords = getTopKeywords(jobDescription);
    const matchedKeywords = jobKeywords.filter((word) => resumeWords.has(word));
    const missingKeywords = jobKeywords.filter((word) => !resumeWords.has(word));
    const keywordScore = jobKeywords.length
      ? Math.round((matchedKeywords.length / jobKeywords.length) * 100)
      : 0;

    const impactCount = (resumeText.match(/\d+%|\$\d+|\b\d+x\b|\b\d+\+/gi) || []).length;
    const hasActionVerbs = /\b(led|built|created|improved|reduced|increased|managed|launched|optimized|delivered|designed|developed|implemented)\b/i.test(resumeText);

    const checks = [
      {
        label: "Contact details",
        detail: "Name, email, phone, and location are easier for recruiters to parse.",
        passed: Boolean(info.full_name && info.email && info.phone && info.location),
        weight: 12,
      },
      {
        label: "Professional summary",
        detail: "A concise summary gives ATS software a clear profile signal.",
        passed: Boolean(resumeData?.professional_summary?.trim()?.length >= 80),
        weight: 12,
      },
      {
        label: "Work experience",
        detail: "Add role, company, dates, and achievement-focused descriptions.",
        passed: experience.length > 0 && experience.every((item) => item.position && item.company && item.description),
        weight: 18,
      },
      {
        label: "Skills coverage",
        detail: "List 6 or more relevant hard skills from the target role.",
        passed: skills.length >= 6,
        weight: 14,
      },
      {
        label: "Education",
        detail: "Include at least one education entry.",
        passed: education.length > 0,
        weight: 8,
      },
      {
        label: "Projects",
        detail: "Projects can add searchable tools, domains, and outcomes.",
        passed: projects.length > 0,
        weight: 8,
      },
      {
        label: "Measurable impact",
        detail: "Numbers like percentages, revenue, time saved, or scale improve ranking.",
        passed: impactCount >= 2,
        weight: 12,
      },
      {
        label: "Action verbs",
        detail: "Start bullets with clear ownership and result verbs.",
        passed: hasActionVerbs,
        weight: 6,
      },
      {
        label: "Keyword match",
        detail: "Paste a job description to compare important terms.",
        passed: !jobKeywords.length || keywordScore >= 55,
        weight: 10,
      },
    ];

    const baseScore = scoreFromChecks(checks);
    const score = jobKeywords.length
      ? Math.round(baseScore * 0.75 + keywordScore * 0.25)
      : baseScore;

    return {
      score,
      keywordScore,
      matchedKeywords,
      missingKeywords,
      checks,
      impactCount,
      jobKeywords,
    };
  }, [jobDescription, resumeData]);

  const scoreColor = analysis.score >= 80
    ? "text-emerald-300"
    : analysis.score >= 60
      ? "text-amber-300"
      : "text-rose-300";

  const scoreRing = `conic-gradient(${analysis.score >= 80 ? "#34d399" : analysis.score >= 60 ? "#f59e0b" : "#fb7185"} ${analysis.score * 3.6}deg, rgba(255,255,255,0.08) 0deg)`;

  return (
    <section className="glass-card rounded-2xl p-6" id="ats-analysis">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-2.5">
          <FileSearch className="size-5 text-white/40" />
          <div>
            <h2 className="text-lg font-semibold text-white">ATS Score Analysis</h2>
            <p className="text-xs text-white/35 mt-0.5">Checks structure, keywords, and recruiter scan quality.</p>
          </div>
        </div>
        <div className="size-20 rounded-full p-1 shrink-0" style={{ background: scoreRing }}>
          <div className="size-full rounded-full bg-[#111119] border border-white/[0.06] flex flex-col items-center justify-center">
            <span className={`text-2xl font-bold ${scoreColor}`}>{analysis.score}</span>
            <span className="text-[10px] text-white/35">/ 100</span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-3 mb-5">
        <MetricCard icon={ClipboardCheck} label="Passed Checks" value={`${analysis.checks.filter((item) => item.passed).length}/${analysis.checks.length}`} />
        <MetricCard icon={Target} label="Keyword Match" value={analysis.jobKeywords.length ? `${analysis.keywordScore}%` : "Add JD"} />
        <MetricCard icon={Sparkles} label="Impact Metrics" value={analysis.impactCount} />
      </div>

      <label className="block text-sm font-medium text-white/70 mb-2" htmlFor="job-description">
        Target job description
      </label>
      <textarea
        id="job-description"
        rows={5}
        value={jobDescription}
        onChange={(event) => setJobDescription(event.target.value)}
        placeholder="Paste a job description here to compare important keywords..."
        className="w-full"
      />

      {analysis.jobKeywords.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4 mt-5">
          <KeywordGroup title="Matched Keywords" keywords={analysis.matchedKeywords} tone="matched" />
          <KeywordGroup title="Missing Keywords" keywords={analysis.missingKeywords} tone="missing" />
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-sm font-semibold text-white/70 mb-3">Recommendations</h3>
        <div className="space-y-2">
          {analysis.checks.map((check) => {
            const Icon = check.passed ? CheckCircle2 : AlertCircle;
            return (
              <div key={check.label} className="flex gap-3 rounded-xl bg-white/[0.02] border border-white/[0.05] p-3">
                <Icon className={`size-4 mt-0.5 shrink-0 ${check.passed ? "text-emerald-400" : "text-amber-400"}`} />
                <div>
                  <p className="text-sm font-medium text-white/80">{check.label}</p>
                  <p className="text-xs text-white/35 mt-0.5">{check.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const MetricCard = ({ icon, label, value }) => {
  const iconElement = React.createElement(icon, {
    className: "size-4 text-cyan-300 mb-3",
  });

  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
      {iconElement}
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-xs text-white/35 mt-0.5">{label}</p>
    </div>
  );
};

const KeywordGroup = ({ title, keywords, tone }) => {
  const emptyText = tone === "matched"
    ? "No matches yet"
    : "All top keywords are covered";
  const toneClasses = tone === "matched"
    ? "bg-emerald-500/10 text-emerald-200 border-emerald-500/20"
    : "bg-amber-500/10 text-amber-200 border-amber-500/20";

  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
      <p className="text-sm font-semibold text-white/70 mb-3">{title}</p>
      <div className="flex flex-wrap gap-2">
        {keywords.length > 0 ? keywords.map((keyword) => (
          <span key={keyword} className={`px-2.5 py-1 rounded-full text-xs border ${toneClasses}`}>
            {keyword}
          </span>
        )) : (
          <span className="text-xs text-white/30">{emptyText}</span>
        )}
      </div>
    </div>
  );
};

export default ATSAnalyzer;
