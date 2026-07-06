const STOP_WORDS = new Set([
  "about", "after", "again", "also", "and", "are", "but", "can", "did",
  "for", "from", "has", "have", "into", "its", "job", "our", "per", "role",
  "that", "the", "this", "to", "was", "will", "with", "you", "your", "their",
  "they", "them", "who", "what", "when", "where", "which", "while", "using",
]);

const SECTION_PATTERNS = {
  contact: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
  summary: /\b(summary|profile|objective|about)\b/i,
  experience: /\b(experience|employment|work history|professional experience)\b/i,
  skills: /\b(skills|technologies|tools|expertise|technical skills)\b/i,
  education: /\b(education|degree|university|college|bachelor|master|certification)\b/i,
  certifications: /\b(certifications|certificates|certified|license)\b/i,
  achievements: /\b(achievements|awards|honors|accomplishments)\b/i,
  projects: /\b(projects|portfolio)\b/i,
  linkedin: /linkedin\.com/i,
  portfolio: /\b(portfolio|github\.com|website|personal site)\b/i,
};

const SKILL_CATEGORIES = {
  Frontend: ["react", "javascript", "typescript", "html", "css", "tailwind", "redux", "next.js", "vue", "angular"],
  Backend: ["node.js", "node", "express", "api", "rest", "graphql", "java", "python", "django", "spring"],
  Databases: ["mongodb", "postgresql", "postgres", "mysql", "sql", "redis", "firebase", "oracle"],
  Cloud: ["aws", "azure", "gcp", "docker", "kubernetes", "ci/cd", "jenkins", "vercel", "netlify"],
  Tools: ["git", "github", "postman", "figma", "jira", "linux", "webpack", "vite"],
  Data: ["excel", "tableau", "power bi", "pandas", "numpy", "machine learning", "analytics"],
};

const WEAK_VERBS = [
  { phrase: "worked on", alternatives: ["Developed", "Implemented", "Delivered"] },
  { phrase: "helped", alternatives: ["Collaborated", "Supported", "Enabled"] },
  { phrase: "responsible for", alternatives: ["Owned", "Led", "Managed"] },
  { phrase: "did", alternatives: ["Executed", "Built", "Completed"] },
  { phrase: "made", alternatives: ["Created", "Designed", "Produced"] },
  { phrase: "handled", alternatives: ["Managed", "Coordinated", "Directed"] },
];

const ACTION_VERBS = /\b(achieved|architected|built|created|delivered|designed|developed|implemented|improved|increased|launched|led|managed|optimized|reduced|streamlined|owned|scaled)\b/i;

export const normalizeText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9+#./\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const getWords = (value) =>
  normalizeText(value)
    .split(" ")
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));

export const getResumeText = (resumeData, resumeText = "") => {
  if (resumeText?.trim()) return resumeText;

  const info = resumeData?.personal_info || {};
  const experience = resumeData?.experience || [];
  const education = resumeData?.education || [];
  const projects = resumeData?.project || [];
  const skills = resumeData?.skills || [];

  return [
    info.full_name,
    info.profession,
    info.email,
    info.phone,
    info.location,
    info.linkedin,
    info.website,
    resumeData?.professional_summary,
    skills.join(" "),
    experience.map((item) => [item.position, item.company, item.description].join(" ")).join(" "),
    education.map((item) => [item.degree, item.field, item.institution].join(" ")).join(" "),
    projects.map((item) => [item.name, item.type, item.description].join(" ")).join(" "),
  ].join(" ");
};

const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(value)));

const scoreFromChecks = (checks) => {
  const earned = checks.reduce((total, check) => total + (check.passed ? check.weight : 0), 0);
  const possible = checks.reduce((total, check) => total + check.weight, 0);
  return possible ? clamp((earned / possible) * 100) : 0;
};

const getTopKeywords = (text) => {
  const counts = getWords(text).reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 24)
    .map(([word]) => word);
};

const countSections = (text) =>
  Object.values(SECTION_PATTERNS).filter((pattern) => pattern.test(text)).length;

const getSkillCategories = (resumeWords, text) => {
  const normalizedText = normalizeText(text);
  const found = {};
  const known = new Set();

  Object.entries(SKILL_CATEGORIES).forEach(([category, skills]) => {
    const matches = skills.filter((skill) => normalizedText.includes(skill));
    if (matches.length) {
      found[category] = [...new Set(matches)];
      matches.forEach((skill) => known.add(skill));
    }
  });

  const uncategorized = [...resumeWords]
    .filter((word) => word.length > 3 && !known.has(word))
    .slice(0, 12);

  if (uncategorized.length) found.Uncategorized = uncategorized;
  return found;
};

const getReadability = (text, bulletCount) => {
  const sentences = text.split(/[.!?]+/).map((item) => item.trim()).filter(Boolean);
  const words = getWords(text);
  const averageSentenceLength = sentences.length ? words.length / sentences.length : 0;
  const bulletLines = text.split("\n").filter((line) => /^\s*[-*•]/.test(line));
  const averageBulletLength = bulletLines.length
    ? bulletLines.reduce((total, line) => total + getWords(line).length, 0) / bulletLines.length
    : 0;
  const longSentences = sentences.filter((sentence) => getWords(sentence).length > 28).length;
  const passiveVoice = (text.match(/\b(was|were|is|are|been|being)\s+\w+ed\b/gi) || []).length;
  const readingTime = Math.max(1, Math.ceil(words.length / 220));
  const score = clamp(100 - longSentences * 7 - passiveVoice * 4 - Math.max(0, averageSentenceLength - 22) * 2 + Math.min(bulletCount, 8));

  return {
    readingTime,
    averageSentenceLength: Math.round(averageSentenceLength),
    averageBulletLength: Math.round(averageBulletLength),
    longSentences,
    passiveVoice,
    score,
  };
};

const getFormattingIssues = (text, checks, bulletCount) => {
  const issues = [];
  if (/\s{3,}/.test(text)) issues.push("Multiple spaces detected");
  if (/[!?.,]{2,}/.test(text)) issues.push("Repeated punctuation detected");
  if (bulletCount < 3) issues.push("Few bullet points detected");
  if (!checks.find((item) => item.id === "contact")?.passed) issues.push("Missing contact details");
  if (text.split("\n").some((line) => line.trim().length > 240)) issues.push("Very long paragraph detected");
  if (/\n\s*\n\s*\n/.test(text)) issues.push("Large empty spacing detected");
  if (/\b[A-Z]{8,}\b/.test(text)) issues.push("Possible inconsistent capitalization");
  return issues;
};

const getSectionAnalysis = ({ checks, scores, impactCount, keywordScore }) => {
  const sectionMap = [
    ["Experience", scores.experience, ["Add measurable achievements", "Start bullets with stronger action verbs"]],
    ["Skills", scores.skills, ["Add more target-role technologies", "Group tools by category where possible"]],
    ["Projects", checks.find((item) => item.id === "projects")?.passed ? 90 : 55, ["Add project impact metrics", "Mention tools used in each project"]],
    ["Education", checks.find((item) => item.id === "education")?.passed ? 88 : 45, ["Add degree, school, and dates"]],
    ["Keywords", keywordScore || 50, ["Mirror important job description wording naturally"]],
  ];

  return sectionMap.map(([section, score, suggestions]) => ({
    section,
    score,
    rating: Math.max(1, Math.ceil(score / 20)),
    feedback: score >= 80 ? "Strong ATS signal." : score >= 60 ? "Solid, but can be sharper." : "Needs attention for ATS screening.",
    suggestions: score >= 85 && impactCount >= 2 ? suggestions.slice(0, 1) : suggestions,
  }));
};

const getPriorities = ({ missingKeywords, checks, impactCount, readability, formattingIssues }) => {
  const priorities = [];
  if (missingKeywords.length) priorities.push({ level: "High", text: "Add missing target keywords naturally", impact: 95 });
  if (impactCount < 2) priorities.push({ level: "High", text: "Add measurable achievements with numbers", impact: 90 });
  checks.filter((item) => !item.passed && ["contact", "experience", "skills"].includes(item.id))
    .forEach((item) => priorities.push({ level: "High", text: item.priority, impact: item.weight * 6 }));
  checks.filter((item) => !item.passed && ["summary", "education", "certifications"].includes(item.id))
    .forEach((item) => priorities.push({ level: "Medium", text: item.priority, impact: item.weight * 5 }));
  if (readability.score < 75) priorities.push({ level: "Medium", text: "Shorten long sentences and dense paragraphs", impact: 65 });
  if (formattingIssues.length) priorities.push({ level: "Low", text: "Clean formatting issues before exporting", impact: 45 });
  checks.filter((item) => !item.passed && ["portfolio", "linkedin", "achievements"].includes(item.id))
    .forEach((item) => priorities.push({ level: "Low", text: item.priority, impact: item.weight * 4 }));
  return priorities.sort((a, b) => b.impact - a.impact).slice(0, 10);
};

export const analyzeATS = ({ resumeData, resumeText = "", jobDescription = "" }) => {
  const text = getResumeText(resumeData, resumeText);
  const normalized = normalizeText(text);
  const resumeWords = new Set(getWords(text));
  const jobKeywords = getTopKeywords(jobDescription);
  const matchedKeywords = jobKeywords.filter((word) => resumeWords.has(word));
  const missingKeywords = jobKeywords.filter((word) => !resumeWords.has(word));
  const keywordScore = jobKeywords.length ? clamp((matchedKeywords.length / jobKeywords.length) * 100) : 0;
  const bulletCount = (text.match(/(^|\n)\s*[-*•]/g) || []).length;
  const impactCount = (text.match(/\d+%|\$\d+|\b\d+x\b|\b\d+\+/gi) || []).length;
  const wordCount = getWords(text).length;
  const characterCount = text.replace(/\s/g, "").length;
  const pageCount = Math.max(1, Math.ceil(wordCount / 520));
  const skills = getSkillCategories(resumeWords, text);
  const skillCount = Object.values(skills).flat().length;

  const checks = [
    { id: "contact", label: "Contact Information", passed: SECTION_PATTERNS.contact.test(text) && /(\+?\d[\d\s().-]{7,})/.test(text), weight: 12, priority: "Add email and phone number" },
    { id: "summary", label: "Summary", passed: SECTION_PATTERNS.summary.test(text) || wordCount > 80, weight: 10, priority: "Add a concise professional summary" },
    { id: "experience", label: "Experience", passed: SECTION_PATTERNS.experience.test(text), weight: 18, priority: "Add a work experience section" },
    { id: "skills", label: "Skills", passed: SECTION_PATTERNS.skills.test(text) && skillCount >= 4, weight: 14, priority: "Add a stronger skills section" },
    { id: "education", label: "Education", passed: SECTION_PATTERNS.education.test(text), weight: 8, priority: "Add education details" },
    { id: "certifications", label: "Certifications", passed: SECTION_PATTERNS.certifications.test(text), weight: 5, priority: "Add relevant certifications" },
    { id: "achievements", label: "Achievements", passed: SECTION_PATTERNS.achievements.test(text) || impactCount >= 3, weight: 8, priority: "Add achievements with outcomes" },
    { id: "projects", label: "Projects", passed: SECTION_PATTERNS.projects.test(text), weight: 8, priority: "Add project examples" },
    { id: "linkedin", label: "LinkedIn", passed: SECTION_PATTERNS.linkedin.test(text), weight: 3, priority: "Add LinkedIn profile" },
    { id: "portfolio", label: "Portfolio Link", passed: SECTION_PATTERNS.portfolio.test(text), weight: 4, priority: "Add portfolio or GitHub link" },
  ];

  const readability = getReadability(text, bulletCount);
  const formattingIssues = getFormattingIssues(text, checks, bulletCount);
  const formatScore = clamp(100 - formattingIssues.length * 10 + Math.min(bulletCount, 8));
  const structureScore = scoreFromChecks(checks.filter((item) => ["contact", "summary", "experience", "education", "projects"].includes(item.id)));
  const experienceScore = clamp((checks.find((item) => item.id === "experience")?.passed ? 60 : 25) + Math.min(impactCount * 12, 30) + (ACTION_VERBS.test(text) ? 10 : 0));
  const skillsScore = clamp((checks.find((item) => item.id === "skills")?.passed ? 60 : 25) + Math.min(skillCount * 5, 35));
  const keywordBlend = jobKeywords.length ? keywordScore : 65;
  const scores = {
    overall: clamp(structureScore * 0.28 + keywordBlend * 0.22 + formatScore * 0.16 + experienceScore * 0.16 + skillsScore * 0.1 + readability.score * 0.08),
    structure: structureScore,
    keywords: keywordBlend,
    formatting: formatScore,
    experience: experienceScore,
    skills: skillsScore,
    readability: readability.score,
  };

  const compatibility = [
    { label: "Standard headings", passed: countSections(text) >= 4 },
    { label: "ATS-friendly PDF text", passed: wordCount > 80 },
    { label: "Bullet points", passed: bulletCount >= 3 },
    { label: "Contact information", passed: checks.find((item) => item.id === "contact")?.passed },
    { label: "Skills section", passed: checks.find((item) => item.id === "skills")?.passed },
    { label: "Education", passed: checks.find((item) => item.id === "education")?.passed },
    { label: "Certifications", passed: checks.find((item) => item.id === "certifications")?.passed },
    { label: "Portfolio link", passed: checks.find((item) => item.id === "portfolio")?.passed },
    { label: "LinkedIn", passed: checks.find((item) => item.id === "linkedin")?.passed },
  ];

  const weakVerbMatches = WEAK_VERBS.filter(({ phrase }) => normalized.includes(phrase));
  const sectionAnalysis = getSectionAnalysis({ checks, scores, impactCount, keywordScore: keywordBlend });
  const priorities = getPriorities({ missingKeywords, checks, impactCount, readability, formattingIssues });
  const completion = scoreFromChecks(checks);
  const strengths = [
    formatScore >= 80 && "Good formatting",
    checks.find((item) => item.id === "projects")?.passed && "Strong projects section",
    structureScore >= 80 && "Clear structure",
    impactCount >= 2 && "Measurable achievements",
    keywordScore >= 70 && "Strong keyword alignment",
  ].filter(Boolean);
  const weaknesses = [
    !checks.find((item) => item.id === "certifications")?.passed && "Missing certifications",
    jobKeywords.length && keywordScore < 70 && "Weak keyword match",
    impactCount < 2 && "Limited measurable achievements",
    readability.score < 75 && "Dense readability",
    formattingIssues.length && "Formatting cleanup needed",
  ].filter(Boolean);

  return {
    text,
    hasResumeContent: text.trim().length > 0,
    scores,
    checks,
    completion,
    stats: {
      pages: pageCount,
      words: wordCount,
      characters: characterCount,
      bullets: bulletCount,
      sections: countSections(text),
      skills: skillCount,
      readingTime: readability.readingTime,
    },
    impactCount,
    keywords: {
      jobKeywords,
      matched: matchedKeywords,
      missing: missingKeywords,
      score: keywordScore,
    },
    readability,
    formattingIssues,
    weakVerbs: weakVerbMatches,
    sectionAnalysis,
    priorities,
    compatibility,
    skills,
    health: { strengths, weaknesses },
    recruiterScan: {
      noticed: checks.filter((item) => item.passed).slice(0, 5).map((item) => item.label),
      overlooked: checks.filter((item) => !item.passed).slice(0, 5).map((item) => item.label),
    },
  };
};
