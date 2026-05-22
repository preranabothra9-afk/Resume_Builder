import { Loader2, Sparkles } from 'lucide-react'
import React from 'react'
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux'
import api from '../configs/api';

const ProfessionalSummaryform = ({ data, onChange, setResumeData }) => {

  const { token } = useSelector((state) => state.auth);
  const [isgenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    if (!data) {
      toast.error("Please write a summary first");
      return;
    }
    try {
      setIsGenerating(true);
      const prompt = `Improve this resume summary in 3–4 professional sentences. Do not shorten important skills or experience. ${data}`;
      const response = await api.post('/api/ai/enhance-pro-sum', { userContent: prompt }, { headers: { Authorization: token } })
      setResumeData(prev => ({ ...prev, professional_summary: response.data.enhancedContent }))
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-white/40'>Add a compelling professional summary.</p>
        <button disabled={isgenerating} onClick={generateSummary}
          className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-violet-500/15 text-violet-300 hover:bg-violet-500/25 transition-colors disabled:opacity-50 border border-violet-500/20'>
          {isgenerating ? <Loader2 className='size-3.5 animate-spin' /> : <Sparkles className='size-3.5' />}
          {isgenerating ? "Enhancing..." : "AI Enhance"}
        </button>
      </div>

      <textarea value={data || ""} onChange={(e) => onChange(e.target.value)} rows={7}
        className='w-full resize-none bg-white/[0.03]'
        placeholder='Write a compelling professional summary...' />
      <p className='text-xs text-white/20 text-center'>Tip: Keep it concise (3-4 sentences) and focus on achievements.</p>
    </div>
  )
}

export default ProfessionalSummaryform
