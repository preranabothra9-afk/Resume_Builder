import React, { memo } from "react";
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
  if (score == null) return { text: "text-white/20", bar: "from-white/10 to-white/5", bg: "bg-white/5", border: "border-white/10" };
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
  const scoreRing = analysis.scores.overall != null
    ? `conic-gradient(${analysis.scores.overall >= 80 ? "#34d399" : analysis.scores.overall >= 60 ? "#f59e0b" : "#fb7185"} ${analysis.scores.overall * 3.6}deg, rgba(255,255,255,0.08) 0deg)`
    : "none";

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
              <span className={`text-3xl font-bold ${overallTone.text}`}>{analysis.scores.overall != null ? analysis.scores.overall : "--"}</span>
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
          <MetricCard icon={ClipboardCheck} label="Passed Checks" value={analysis.checks.length ? `${analysis.checks.filter((item) => item.passed).length}/${analysis.checks.length}` : "--"} />
          <MetricCard icon={Target} label="Keyword Match" value={analysis.keywords.score != null ? `${analysis.keywords.score}%` : "--"} />
          <MetricCard icon={Sparkles} label="Impact Metrics" value={analysis.impactCount != null ? analysis.impactCount : "--"} />
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
        <HealthReport health={analysis.health} hasResumeContent={analysis.hasResumeContent} />
        <Checklist items={analysis.compatibility} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Readability readability={analysis.readability} />
        <Formatting issues={analysis.formattingIssues} hasResumeContent={analysis.hasResumeContent} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ActionVerbs weakVerbs={analysis.weakVerbs} onCopy={copySuggestion} hasResumeContent={analysis.hasResumeContent} />
        <Priorities priorities={analysis.priorities} hasResumeContent={analysis.hasResumeContent} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <RecruiterScan scan={analysis.recruiterScan} hasResumeContent={analysis.hasResumeContent} />
        <SkillsCategorization skills={analysis.skills} />
      </div>
    </div>
  );
};

const MetricCard = memo(({ icon, label, value }) => {
  const iconElement = React.createElement(icon, { className: "size-4 text-cyan-300 mb-3" });
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
      {iconElement}
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-xs text-white/35 mt-0.5">{label}</p>
    </div>
  );
});

const Card = memo(({ icon, title, children }) => {
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
});

const Progress = memo(({ value, label }) => {
  const tone = scoreTone(value);
  return (
    <div>
      <div className="flex justify-between items-center text-sm mb-2">
        <span className="text-white/60">{label}</span>
        <span className={`font-semibold ${tone.text}`}>{value != null ? `${value}%` : "--"}</span>
      </div>
      <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${tone.bar}`} style={{ width: value != null ? `${value}%` : "0%" }} />
      </div>
    </div>
  );
});

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
      {completion != null ? (
        <>
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
        </>
      ) : (
        <p className="text-sm text-white/30">Upload a resume to see completeness analysis.</p>
      )}
    </Card>
  );
};

const Stats = ({ stats }) => (
  <Card icon={BarChart3} title="Resume Statistics">
    {stats.pages != null ? (
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
    ) : (
      <p className="text-sm text-white/30">Upload a resume to see statistics.</p>
    )}
  </Card>
);

const KeywordAnalysis = ({ keywords }) => {
  const hasJd = keywords.jobKeywords.length > 0;
  const total = keywords.jobKeywords.length;
  const matchedCount = keywords.matched.length;

  return (
    <Card icon={SearchCheck} title="Enhanced Keyword Analysis">
      {hasJd ? (
        <>
          <div className="flex items-center justify-between gap-4 mb-3">
            <div>
              <Progress label="Keyword Match" value={keywords.score} />
            </div>
            <div className="text-right shrink-0">
              <p className="text-2xl font-bold text-white">{keywords.score != null ? `${keywords.score}%` : "--"}</p>
              <p className="text-xs text-white/30">{matchedCount} of {total} keywords</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <KeywordGroup title={`Matched Keywords (${matchedCount})`} keywords={keywords.matched} tone="matched" />
            <KeywordGroup title={`Missing Keywords (${total - matchedCount})`} keywords={keywords.missing} tone="missing" />
          </div>
        </>
      ) : (
        <div className="py-6 text-center">
          <p className="text-sm text-white/30">Paste a job description above to calculate keyword match.</p>
        </div>
      )}
    </Card>
  );
};

const KeywordGroup = memo(({ title, keywords, tone }) => {
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
});

const SectionAnalysis = ({ sections }) => (
  <Card icon={Layers3} title="Section-wise Resume Analysis">
    {sections.length > 0 ? (
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
    ) : (
      <p className="text-sm text-white/30">Upload a resume to see section-wise analysis.</p>
    )}
  </Card>
);

const Stars = memo(({ rating }) => (
  <div className="flex gap-0.5 justify-end">
    {Array.from({ length: 5 }).map((_, index) => (
      <Sparkles key={index} className={`size-3.5 ${index < rating ? "text-amber-300 fill-amber-300" : "text-white/15"}`} />
    ))}
  </div>
));

const HealthReport = ({ health, hasResumeContent }) => (
  <Card icon={CheckCircle2} title="Resume Health Report">
    {hasResumeContent ? (
      <>
        <ReportList title="Strengths" items={health.strengths} empty="No major strengths detected yet." positive />
        <div className="mt-5">
          <ReportList title="Weaknesses" items={health.weaknesses} empty="No major weaknesses detected." />
        </div>
      </>
    ) : (
      <p className="text-sm text-white/30">Upload a resume to see health report.</p>
    )}
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
    {items.length > 0 ? (
      <div className="space-y-2">
        {items.map((item) => <StatusRow key={item.label} label={item.label} passed={item.passed} />)}
      </div>
    ) : (
      <p className="text-sm text-white/30">Upload a resume to see ATS compatibility checklist.</p>
    )}
  </Card>
);

const Readability = ({ readability }) => (
  <Card icon={Gauge} title="Resume Readability Analysis">
    {readability.score != null ? (
      <>
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
      </>
    ) : (
      <p className="text-sm text-white/30">Upload a resume to see readability analysis.</p>
    )}
  </Card>
);

const Formatting = ({ issues, hasResumeContent }) => (
  <Card icon={AlertCircle} title="Formatting Checker">
    {hasResumeContent ? (
      <div className="space-y-2">
        {issues.length ? issues.map((issue) => (
          <StatusRow key={issue} label={issue} passed={false} soft />
        )) : <StatusRow label="No common formatting issues detected" passed />}
      </div>
    ) : (
      <p className="text-sm text-white/30">Upload a resume to check formatting.</p>
    )}
  </Card>
);

const ActionVerbs = ({ weakVerbs, onCopy, hasResumeContent }) => (
  <Card icon={Sparkles} title="Action Verb Checker">
    {hasResumeContent ? (
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
    ) : (
      <p className="text-sm text-white/30">Upload a resume to check for weak action verbs.</p>
    )}
  </Card>
);

const Priorities = ({ priorities, hasResumeContent }) => (
  <Card icon={Target} title="Improvement Priority Panel">
    <div className="space-y-2">
      {!hasResumeContent ? (
        <StatusRow label="Complete analysis to see recommendations." passed />
      ) : priorities.length ? priorities.map((item) => (
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

const RecruiterScan = ({ scan, hasResumeContent }) => (
  <Card icon={SearchCheck} title="Recruiter Scan Simulation">
    {hasResumeContent ? (
      <div className="grid sm:grid-cols-2 gap-4">
        <ReportList title="Likely noticed" items={scan.noticed} empty="No standout signals detected yet." positive />
        <ReportList title="May be overlooked" items={scan.overlooked} empty="Nothing important appears overlooked." />
      </div>
    ) : (
      <p className="text-sm text-white/30">Upload a resume to see recruiter scan results.</p>
    )}
  </Card>
);

const SkillsCategorization = ({ skills }) => {
  const entries = Object.entries(skills);
  const totalSkills = entries.reduce((sum, [, items]) => sum + items.length, 0);

  return (
    <Card icon={Layers3} title="Skills Categorization">
      {entries.length > 0 ? (
        <>
          <p className="text-xs text-white/30 mb-4">{totalSkills} skill{totalSkills !== 1 ? "s" : ""} recognized across {entries.length} categor{entries.length !== 1 ? "ies" : "y"}</p>
          <div className="space-y-4">
            {entries.map(([category, items]) => (
              <div key={category}>
                <p className="text-sm font-semibold text-white/70 mb-2">{category} <span className="text-xs font-normal text-white/30">({items.length})</span></p>
                <div className="flex flex-wrap gap-2">
                  {items.map((skill) => (
                    <span key={`${category}-${skill}`} className="px-2.5 py-1 rounded-full text-xs border bg-violet-500/10 text-violet-200 border-violet-500/20">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-sm text-white/30">No recognizable skills detected yet.</p>
      )}
    </Card>
  );
};

const StatusRow = memo(({ label, passed, soft }) => {
  const Icon = passed ? CheckCircle2 : soft ? AlertCircle : XCircle;
  return (
    <div className="flex items-center gap-2 rounded-lg bg-white/[0.02] border border-white/[0.05] px-3 py-2">
      <Icon className={`size-4 shrink-0 ${passed ? "text-emerald-400" : soft ? "text-amber-400" : "text-rose-400"}`} />
      <span className="text-sm text-white/60">{label}</span>
    </div>
  );
});

export default ATSAnalyzer;
