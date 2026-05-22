import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ResumePreview from '../components/ResumePreview'
import Loader from '../components/Loader'
import { ArrowLeft } from 'lucide-react'
import api from '../configs/api'

const Preview = () => {

  const { resumeId } = useParams()
  const [resumeData, setResumeData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadResume = async () => {
    try {
      const { data } = await api.get('/api/resumes/public/' + resumeId);
      setResumeData(data.resume);
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadResume()
  }, [])

  return resumeData ? (
    <div className='app-bg min-h-screen'>
      <div className='max-w-3xl mx-auto py-10 px-4'>
        <div className='glass-card rounded-2xl overflow-hidden'>
          <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} classes='p-6' />
        </div>
      </div>
    </div>
  ) : (
    <div>
      {isLoading ? <Loader /> : (
        <div className='app-bg flex flex-col items-center justify-center min-h-screen'>
          <div className='text-center'>
            <div className='text-6xl font-bold gradient-text mb-4'>404</div>
            <p className='text-lg text-white/50 font-medium'>Resume Not Found</p>
            <a href="/" className='inline-flex items-center gap-2 mt-6 gradient-btn rounded-xl px-6 py-2.5 text-sm glow'>
              <ArrowLeft className='size-4' />
              Go to home
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default Preview
