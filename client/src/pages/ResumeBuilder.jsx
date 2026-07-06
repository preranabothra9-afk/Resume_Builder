import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeftIcon, Briefcase, DownloadIcon, EyeIcon, EyeOff, FileText, FolderIcon, GraduationCap, LoaderCircleIcon, Share2Icon, Sparkles, User } from 'lucide-react';
import PersonalInfoForm from '../components/PersonalInfoForm';
import ResumePreview from '../components/ResumePreview';
import TemplateSelector from '../components/TemplateSelector';
import ColorPicker from '../components/ColorPicker';
import ProfessionalSummaryform from '../components/ProfessionalSummaryform';
import ExperienceForm from '../components/ExperienceForm';
import EducationForm from '../components/EducationForm';
import ProjectForm from '../components/ProjectForm';
import SkillsForm from '../components/SkillsForm';
import api from '../configs/api.js';
import toast from 'react-hot-toast'
import ResumeAnalytics from '../components/ResumeAnalytics';
import ATSAnalyzer from '../components/ATSAnalyzer';

const ResumeBuilder = () => {

  const { resumeId } = useParams();

  const [resumeData, setResumeData] = useState({
    _id: '',
    title: '',
    personal_info: {},
    professional_summary: "",
    experience: [],
    education: [],
    project: [],
    skills: [],
    template: 'classic',
    accent_color: "#8B5CF6",
    public: false
  })

  const loadExistingResume = async () => {
    try {
      const { data } = await api.get(`/api/resumes/get/${resumeId}`)
      if (data.resume) {
        setResumeData(data.resume)
        document.title = data.resume.title;
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [savingStatus, setSavingStatus] = useState("idle");

  const sections = [
    { id: "personal", name: "Personal", icon: User },
    { id: "summary", name: "Summary", icon: FileText },
    { id: "experience", name: "Experience", icon: Briefcase },
    { id: "education", name: "Education", icon: GraduationCap },
    { id: "projects", name: "Projects", icon: FolderIcon },
    { id: "skills", name: "Skills", icon: Sparkles },
  ]

  const activeSection = sections[activeSectionIndex];
  const [loaded, setLoaded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const saveResume = async () => {
    try {
      setSavingStatus("saving");
      let updatedResumeData = structuredClone(resumeData);
      if (typeof resumeData.personal_info.image === 'object') {
        delete updatedResumeData.personal_info.image;
      }
      const formData = new FormData();
      formData.append("resumeId", resumeId);
      formData.append("resumeData", JSON.stringify(updatedResumeData));
      removeBackground && formData.append("removeBackground", "yes");
      typeof resumeData.personal_info.image === 'object' && formData.append("image", resumeData.personal_info.image)

      const { data } = await api.put('/api/resumes/update', formData);
      if (data.resume) {
        setResumeData(prev => ({ ...prev, ...data.resume }));
      }
      setSavingStatus("saved");
      setTimeout(() => { setSavingStatus("idle"); }, 2000);
    } catch (error) {
      console.error("Error saving resume", error);
      setSavingStatus("idle");
    }
  }

  useEffect(() => {
    if (resumeId && !resumeData._id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadExistingResume();
    }
  }, [resumeId]);

  useEffect(() => {
    if (resumeData._id) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoaded(true);
    }
  }, [resumeData._id]);

  useEffect(() => {
    if (!loaded || !isEditing) return;
    const timer = setTimeout(() => {
      saveResume();
      setIsEditing(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [resumeData, removeBackground]);

  const changeResumeVisibility = async () => {
    try {
      const formData = new FormData()
      formData.append("resumeId", resumeId)
      formData.append("resumeData", JSON.stringify({ public: !resumeData.public }))
      const { data } = await api.put('/api/resumes/update', formData);
      setResumeData({ ...resumeData, public: !resumeData.public })
      toast.success(data.message);
    } catch (error) {
      console.error("error saving resume", error);
    }
  }

  const handleShare = () => {
    const frontendUrl = window.location.href.split('/app/')[0];
    const resumeUrl = frontendUrl + '/view/' + resumeId
    if (navigator.share) {
      navigator.share({ url: resumeUrl, text: "My Resume" })
    } else {
      alert("Share is not supported on this browser")
    }
  }

  const exportResume = async (type) => {
    try {
      const res = await api.get(`/api/resumes/export/${resumeId}?format=${type}`, {
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `resume.${type}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      api.post(`/api/resumes/download/${resumeId}`).catch(() => {});
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='app-bg min-h-screen'>
      <div className='max-w-7xl mx-auto px-4 py-6'>
        {/* Top bar */}
        <div className='flex items-center justify-between mb-6'>
          <Link to='/app' className='inline-flex gap-2 items-center text-white/40 hover:text-violet-400 transition-colors font-medium text-sm'>
            <ArrowLeftIcon className='size-4' />Back to Dashboard
          </Link>
          <div className='flex items-center gap-2'>
            <TemplateSelector selectedTemplate={resumeData.template} onChange={(template) => setResumeData(prev => ({ ...prev, template }))} />
            <ColorPicker selectedColor={resumeData.accent_color} onChange={(color) => setResumeData(prev => ({ ...prev, accent_color: color }))} />
          </div>
        </div>

        <div className='grid lg:grid-cols-12 gap-8'>
          {/* Left Panel - Form */}
          <div className='lg:col-span-5'>
            <div className='glass-card rounded-2xl overflow-hidden'>
              {/* Neon progress bar */}
              <div className='h-0.75 bg-white/5'>
                <div className='h-full bg-linear-to-r from-violet-500 via-fuchsia-500 to-cyan-500 transition-all duration-500 glow' style={{ width: `${((activeSectionIndex + 1) / sections.length) * 100}%` }} />
              </div>

              <div className='p-5'>
                {/* Section tabs */}
                <div className='flex gap-1 mb-5 overflow-x-auto pb-1 scrollbar-hide'>
                  {sections.map((section, index) => {
                    const Icon = section.icon;
                    const isActive = index === activeSectionIndex;
                    return (
                      <button key={section.id}
                        onClick={() => setActiveSectionIndex(index)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${isActive
                          ? 'bg-violet-500/15 text-violet-300 border border-violet-500/20'
                          : 'text-white/40 hover:bg-white/4 hover:text-white/60 border border-transparent'
                          }`}>
                        <Icon className='size-3.5' />
                        <span className='max-sm:hidden'>{section.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Save status + heading */}
                <div className='flex items-center justify-between mb-4'>
                  <h2 className='text-lg font-semibold text-white'>{activeSection.name}</h2>
                  <div className='text-xs font-medium'>
                    {savingStatus === "saving" && (
                      <span className='text-cyan-400 flex items-center gap-1'>
                        <LoaderCircleIcon className='size-3 animate-spin' /> Saving...
                      </span>
                    )}
                    {savingStatus === "saved" && (
                      <span className='text-emerald-400'>Saved ✓</span>
                    )}
                  </div>
                </div>

                {/* Form content */}
                <div className='space-y-6 min-h-75'>
                  {activeSection.id === 'personal' && (
                    <PersonalInfoForm data={resumeData.personal_info}
                      onChange={(data) => { setIsEditing(true); setResumeData(prev => ({ ...prev, personal_info: data })) }}
                      removeBackground={removeBackground} setRemoveBackground={setRemoveBackground}
                      setIsEditing={setIsEditing} savingStatus={savingStatus} />
                  )}
                  {activeSection.id === 'summary' && (
                    <ProfessionalSummaryform data={resumeData.professional_summary}
                      onChange={(data) => { setIsEditing(true); setResumeData(prev => ({ ...prev, professional_summary: data })) }}
                      setResumeData={setResumeData} />
                  )}
                  {activeSection.id === 'experience' && (
                    <ExperienceForm data={resumeData.experience}
                      onChange={(data) => { setIsEditing(true); setResumeData(prev => ({ ...prev, experience: data })) }} />
                  )}
                  {activeSection.id === 'education' && (
                    <EducationForm data={resumeData.education}
                      onChange={(data) => { setIsEditing(true); setResumeData(prev => ({ ...prev, education: data })) }} />
                  )}
                  {activeSection.id === 'projects' && (
                    <ProjectForm data={resumeData.project}
                      onChange={(data) => { setIsEditing(true); setResumeData(prev => ({ ...prev, project: data })) }} />
                  )}
                  {activeSection.id === 'skills' && (
                    <SkillsForm data={resumeData.skills}
                      onChange={(data) => { setIsEditing(true); setResumeData(prev => ({ ...prev, skills: data })) }} />
                  )}
                </div>

                <button onClick={() => toast.promise(saveResume(), { loading: "Saving...", success: "Saved", error: "Failed" })}
                  className='w-full gradient-btn rounded-xl px-6 py-2.5 mt-6 text-sm glow'>
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className='lg:col-span-7 max-lg:mt-6'>
            <div className='flex items-center justify-end gap-2 mb-4 flex-wrap'>
              {resumeData.public && (
                <button onClick={handleShare}
                  className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-white/10 text-white/50 hover:text-cyan-400 hover:border-cyan-500/30 hover:bg-cyan-500/10 transition-all'>
                  <Share2Icon className='size-3.5' /> Share
                </button>
              )}
              <button onClick={changeResumeVisibility}
                className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-white/10 text-white/50 hover:text-violet-400 hover:border-violet-500/30 hover:bg-violet-500/10 transition-all'>
                {resumeData.public ? <EyeIcon className='size-3.5' /> : <EyeOff className='size-3.5' />}
                {resumeData.public ? 'Public' : 'Private'}
              </button>
              <button onClick={() => setShowExport(true)}
                className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg gradient-btn'>
                <DownloadIcon className='size-3.5' /> Export
              </button>
            </div>

            {/* Resume preview */}
            {resumeData && (
              <div className='glass-card rounded-2xl overflow-hidden'>
                <div className='p-1'>
                  <ResumePreview data={resumeData} template={resumeData.template}
                    accentColor={resumeData.accent_color} classes='p-6' />
                </div>
              </div>
            )}

            {/* ATS Analysis */}
            <div className="mt-8">
              <ATSAnalyzer resumeData={resumeData} />
            </div>

            {/* Analytics */}
            <div className="mt-8" id="analytics">
              <ResumeAnalytics analytics={resumeData} />
            </div>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      {showExport && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowExport(false)}>
          <div className="bg-[#12121a] border border-white/8 rounded-2xl w-80 p-6 shadow-2xl shadow-black/50"
            onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-white mb-4">Export Resume</h2>
            <div className="flex flex-col gap-2">
              {[
                { label: 'PDF', gradient: 'from-violet-600 to-fuchsia-600' },
                { label: 'DOCX', gradient: 'from-cyan-600 to-blue-600' },
                { label: 'JSON', gradient: 'from-amber-600 to-orange-600' },
                { label: 'HTML Portfolio', gradient: 'from-emerald-600 to-teal-600' }
              ].map(({ label, gradient }) => (
                <button key={label}
                  onClick={() => exportResume(label.toLowerCase().split(' ')[0])}
                  className={`bg-linear-to-r ${gradient} text-white rounded-xl p-3 text-sm font-medium hover:opacity-90 transition-all shadow-lg`}>
                  Export as {label}
                </button>
              ))}
            </div>
            <button onClick={() => setShowExport(false)}
              className="mt-3 text-sm text-white/40 hover:text-white/60 font-medium transition-colors w-full py-2 rounded-xl border border-white/10 hover:bg-white/5">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResumeBuilder
