import React from "react";
import {
  AlertCircle,
  BarChart3,
  CheckCircle2,
  Clipboard,
  ClipboardCheck,
  FileSearch,
  Gauge,
  Layers3,
  ListChecks,
  SearchCheck,
  Sparkles,
  Target,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { analyzeATS } from "../utils/atsAnalysis";

const scoreTone = (score) => {
  if (score >= 80) return { text: "text-emerald-300", bar: "from-emerald-500 to-teal-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
  if (score >= 60) return { text: "text-amber-300", bar: "from-amber-500 to-orange-400", bg: "bg-amber-500/10", border: "border-amber-500/20" };
  return { text: "text-rose-300", bar: "from-rose-500 to-pink-400", bg: "bg-rose-500/10", border: "border-rose-500/20" };
};

const ATSAnalyzer = ({
  resumeData,
  resumeText = "",
  sourceLabel = "Current resume",
  jobDescription,
  onJobDescriptionChange,
  analysis: providedAnalysis,
}) => {
  const analysis = providedAnalysis || analyzeATS({ resumeData, resumeText, jobDescription });
  const overallTone = scoreTone(analysis.scores.overall);
  const scoreRing = `conic-gradient(${analysis.scores.overall >= 80 ? "#34d399" : analysis.scores.overall >= 60 ? "#f59e0b" : "#fb7185"} ${analysis.scores.overall * 3.6}deg, rgba(255,255,255,0.08) 0deg)`;

  const copySuggestion = async (suggestion) => {
    try {
      await navigator.clipboard.writeText(suggestion);
      toast.success("Suggestion copied.");
    } catch {
      toast.error("Could not copy suggestion.");
    }
  };

  return (
    <div className="space-y-6" id="ats-analysis">
      <section className="glass-card rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-2.5">
            <FileSearch className="size-5 text-white/40" />
            <div>
              <h2 className="text-lg font-semibold text-white">ATS Score Analysis</h2>
              <p className="text-xs text-white/35 mt-0.5">Checks structure, keywords, readability, and recruiter scan quality.</p>
            </div>
          </div>
          <div className="size-24 rounded-full p-1 shrink-0" style={{ background: scoreRing }}>
            <div className="size-full rounded-full bg-[#111119] border border-white/[0.06] flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${overallTone.text}`}>{analysis.scores.overall}</span>
              <span className="text-[10px] text-white/35">/ 100</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-cyan-500/5 border border-cyan-500/15 px-4 py-3 mb-5">
          <p className="text-xs font-medium text-cyan-200">{sourceLabel}</p>
          <p className="text-xs text-white/35 mt-1">
            {analysis.hasResumeContent ? "Resume content is ready for ATS scoring." : "Add resume content on this page to start the analysis."}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-3 mb-5">
          <MetricCard icon={ClipboardCheck} label="Passed Checks" value={`${analysis.checks.filter((item) => item.passed).length}/${analysis.checks.length}`} />
          <MetricCard icon={Target} label="Keyword Match" value={analysis.keywords.jobKeywords.length ? `${analysis.keywords.score}%` : "Add JD"} />
          <MetricCard icon={Sparkles} label="Impact Metrics" value={analysis.impactCount} />
        </div>

        <label className="block text-sm font-medium text-white/70 mb-2" htmlFor="job-description">
          Target job description
        </label>
        <textarea
          id="job-description"
          rows={5}
          value={jobDescription}
          onChange={(event) => onJobDescriptionChange?.(event.target.value)}
          placeholder="Paste a job description here to compare important keywords..."
          className="w-full"
        />
      </section>

      <Dashboard scores={analysis.scores} />
      <Completeness checks={analysis.checks} completion={analysis.completion} />
      <Stats stats={analysis.stats} />
      <KeywordAnalysis keywords={analysis.keywords} />
      <SectionAnalysis sections={analysis.sectionAnalysis} />

      <div className="grid lg:grid-cols-2 gap-6">
        <HealthReport health={analysis.health} />
        <Checklist items={analysis.compatibility} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Readability readability={analysis.readability} />
        <Formatting issues={analysis.formattingIssues} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ActionVerbs weakVerbs={analysis.weakVerbs} onCopy={copySuggestion} />
        <Priorities priorities={analysis.priorities} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <RecruiterScan scan={analysis.recruiterScan} />
        <SkillsCategorization skills={analysis.skills} />
      </div>
    </div>
  );
};

const MetricCard = ({ icon, label, value }) => {
  const iconElement = React.createElement(icon, { className: "size-4 text-cyan-300 mb-3" });
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
      {iconElement}
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-xs text-white/35 mt-0.5">{label}</p>
    </div>
  );
};

const Card = ({ icon, title, children }) => {
  const iconElement = icon ? React.createElement(icon, { className: "size-5 text-white/40" }) : null;
  return (
    <section className="glass-card rounded-2xl p-6">
      <div className="flex items-center gap-2.5 mb-5">
        {iconElement}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      {children}
    </section>
  );
};

const Progress = ({ value, label }) => {
  const tone = scoreTone(value);
  return (
    <div>
      <div className="flex justify-between items-center text-sm mb-2">
        <span className="text-white/60">{label}</span>
        <span className={`font-semibold ${tone.text}`}>{value}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${tone.bar}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
};

const Dashboard = ({ scores }) => (
  <Card icon={Gauge} title="Resume Strength Dashboard">
    <div className="grid sm:grid-cols-2 gap-4">
      {Object.entries({
        "Overall ATS Score": scores.overall,
        Structure: scores.structure,
        Keywords: scores.keywords,
        Formatting: scores.formatting,
        Experience: scores.experience,
        Skills: scores.skills,
        Readability: scores.readability,
      }).map(([label, value]) => (
        <Progress key={label} label={label} value={value} />
      ))}
    </div>
  </Card>
);

const Completeness = ({ checks, completion }) => {
  const tone = scoreTone(completion);
  return (
    <Card icon={ListChecks} title="Resume Completeness Tracker">
      <div className="flex items-center justify-between gap-4 mb-5">
        <div>
          <p className="text-sm text-white/40">Resume Complete</p>
          <p className={`text-3xl font-bold ${tone.text}`}>{completion}%</p>
        </div>
        <div className="flex-1 max-w-sm">
          <Progress label="Completion" value={completion} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        {checks.map((item) => <StatusRow key={item.id} label={item.label} passed={item.passed} />)}
      </div>
    </Card>
  );
};

const Stats = ({ stats }) => (
  <Card icon={BarChart3} title="Resume Statistics">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        ["Pages", stats.pages],
        ["Words", stats.words],
        ["Characters", stats.characters],
        ["Bullet Points", stats.bullets],
        ["Sections", stats.sections],
        ["Skills", stats.skills],
        ["Reading Time", `${stats.readingTime}m`],
      ].map(([label, value]) => (
        <div key={label} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
          <p className="text-xl font-bold text-white">{value}</p>
          <p className="text-xs text-white/35 mt-1">{label}</p>
        </div>
      ))}
    </div>
  </Card>
);

const KeywordAnalysis = ({ keywords }) => (
  <Card icon={SearchCheck} title="Enhanced Keyword Analysis">
    <div className="mb-5">
      <Progress label="Keyword Match" value={keywords.jobKeywords.length ? keywords.score : 0} />
      {!keywords.jobKeywords.length && <p className="text-xs text-white/30 mt-2">Paste a job description to calculate keyword match.</p>}
    </div>
    <div className="grid md:grid-cols-2 gap-4">
      <KeywordGroup title="Matched Keywords" keywords={keywords.matched} tone="matched" />
      <KeywordGroup title="Missing Keywords" keywords={keywords.missing} tone="missing" />
    </div>
  </Card>
);

const KeywordGroup = ({ title, keywords, tone }) => {
  const matched = tone === "matched";
  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
      <p className="text-sm font-semibold text-white/70 mb-3">{title}</p>
      <div className="flex flex-wrap gap-2">
        {keywords.length > 0 ? keywords.map((keyword) => (
          <span key={keyword} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border ${matched ? "bg-emerald-500/10 text-emerald-200 border-emerald-500/20" : "bg-amber-500/10 text-amber-200 border-amber-500/20"}`}>
            {matched ? <CheckCircle2 className="size-3" /> : <XCircle className="size-3" />}
            {keyword}
          </span>
        )) : (
          <span className="text-xs text-white/30">{matched ? "No matches yet" : "No missing keywords found"}</span>
        )}
      </div>
    </div>
  );
};

const SectionAnalysis = ({ sections }) => (
  <Card icon={Layers3} title="Section-wise Resume Analysis">
    <div className="space-y-3">
      {sections.map((section) => (
        <details key={section.section} className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 open:bg-white/[0.035]">
          <summary className="cursor-pointer list-none flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white/80">{section.section}</p>
              <p className="text-xs text-white/35 mt-1">{section.feedback}</p>
            </div>
            <div className="text-right">
              <Stars rating={section.rating} />
              <p className="text-xs text-white/30 mt-1">{section.score}%</p>
            </div>
          </summary>
          <div className="mt-4 space-y-2">
            {section.suggestions.map((suggestion) => (
              <StatusRow key={suggestion} label={suggestion} passed={false} soft />
            ))}
          </div>
        </details>
      ))}
    </div>
  </Card>
);

const Stars = ({ rating }) => (
  <div className="flex gap-0.5 justify-end">
    {Array.from({ length: 5 }).map((_, index) => (
      <Sparkles key={index} className={`size-3.5 ${index < rating ? "text-amber-300 fill-amber-300" : "text-white/15"}`} />
    ))}
  </div>
);

const HealthReport = ({ health }) => (
  <Card icon={CheckCircle2} title="Resume Health Report">
    <ReportList title="Strengths" items={health.strengths} empty="Add resume content to surface strengths." positive />
    <div className="mt-5">
      <ReportList title="Weaknesses" items={health.weaknesses} empty="No major weaknesses detected." />
    </div>
  </Card>
);

const ReportList = ({ title, items, empty, positive }) => (
  <div>
    <p className="text-sm font-semibold text-white/70 mb-3">{title}</p>
    <div className="space-y-2">
      {items.length ? items.map((item) => (
        <StatusRow key={item} label={item} passed={positive} soft={!positive} />
      )) : <p className="text-xs text-white/30">{empty}</p>}
    </div>
  </div>
);

const Checklist = ({ items }) => (
  <Card icon={ClipboardCheck} title="ATS Compatibility Checklist">
    <div className="space-y-2">
      {items.map((item) => <StatusRow key={item.label} label={item.label} passed={item.passed} />)}
    </div>
  </Card>
);

const Readability = ({ readability }) => (
  <Card icon={Gauge} title="Resume Readability Analysis">
    <Progress label="Readability Score" value={readability.score} />
    <div className="grid grid-cols-2 gap-3 mt-5">
      {[
        ["Reading Time", `${readability.readingTime}m`],
        ["Avg Sentence", `${readability.averageSentenceLength} words`],
        ["Avg Bullet", `${readability.averageBulletLength} words`],
        ["Long Sentences", readability.longSentences],
        ["Passive Voice", readability.passiveVoice],
      ].map(([label, value]) => (
        <div key={label} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
          <p className="text-sm font-semibold text-white">{value}</p>
          <p className="text-xs text-white/35 mt-1">{label}</p>
        </div>
      ))}
    </div>
  </Card>
);

const Formatting = ({ issues }) => (
  <Card icon={AlertCircle} title="Formatting Checker">
    <div className="space-y-2">
      {issues.length ? issues.map((issue) => (
        <StatusRow key={issue} label={issue} passed={false} soft />
      )) : <StatusRow label="No common formatting issues detected" passed />}
    </div>
  </Card>
);

const ActionVerbs = ({ weakVerbs, onCopy }) => (
  <Card icon={Sparkles} title="Action Verb Checker">
    <div className="space-y-3">
      {weakVerbs.length ? weakVerbs.map((item) => {
        const suggestion = item.alternatives.join(", ");
        return (
          <div key={item.phrase} className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
            <p className="text-sm text-rose-200">Weak: {item.phrase}</p>
            <div className="flex items-center justify-between gap-3 mt-2">
              <p className="text-xs text-white/40">Try: {suggestion}</p>
              <button type="button" onClick={() => onCopy(suggestion)} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-white/10 text-white/50 hover:text-cyan-300 hover:border-cyan-500/30 text-xs">
                <Clipboard className="size-3" />
                Copy
              </button>
            </div>
          </div>
        );
      }) : (
        <StatusRow label="No weak action verb patterns detected" passed />
      )}
    </div>
  </Card>
);

const Priorities = ({ priorities }) => (
  <Card icon={Target} title="Improvement Priority Panel">
    <div className="space-y-2">
      {priorities.length ? priorities.map((item) => (
        <div key={`${item.level}-${item.text}`} className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-white/80">{item.text}</p>
            <span className={`px-2 py-1 rounded-lg text-[11px] border ${item.level === "High" ? "text-rose-200 bg-rose-500/10 border-rose-500/20" : item.level === "Medium" ? "text-amber-200 bg-amber-500/10 border-amber-500/20" : "text-cyan-200 bg-cyan-500/10 border-cyan-500/20"}`}>
              {item.level}
            </span>
          </div>
        </div>
      )) : <StatusRow label="No urgent improvements detected" passed />}
    </div>
  </Card>
);

const RecruiterScan = ({ scan }) => (
  <Card icon={SearchCheck} title="Recruiter Scan Simulation">
    <div className="grid sm:grid-cols-2 gap-4">
      <ReportList title="Likely noticed" items={scan.noticed} empty="Add content to reveal recruiter signals." positive />
      <ReportList title="May be overlooked" items={scan.overlooked} empty="Nothing important appears overlooked." />
    </div>
  </Card>
);

const SkillsCategorization = ({ skills }) => (
  <Card icon={Layers3} title="Skills Categorization">
    <div className="space-y-4">
      {Object.keys(skills).length ? Object.entries(skills).map(([category, items]) => (
        <div key={category}>
          <p className="text-sm font-semibold text-white/70 mb-2">{category}</p>
          <div className="flex flex-wrap gap-2">
            {items.map((skill) => (
              <span key={`${category}-${skill}`} className="px-2.5 py-1 rounded-full text-xs border bg-violet-500/10 text-violet-200 border-violet-500/20">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )) : <p className="text-xs text-white/30">No recognizable skills detected yet.</p>}
    </div>
  </Card>
);

const StatusRow = ({ label, passed, soft }) => {
  const Icon = passed ? CheckCircle2 : soft ? AlertCircle : XCircle;
  return (
    <div className="flex items-center gap-2 rounded-lg bg-white/[0.02] border border-white/[0.05] px-3 py-2">
      <Icon className={`size-4 shrink-0 ${passed ? "text-emerald-400" : soft ? "text-amber-400" : "text-rose-400"}`} />
      <span className="text-sm text-white/60">{label}</span>
    </div>
  );
};

export default ATSAnalyzer;
