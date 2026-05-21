import { FilePenLineIcon, LoaderCircleIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloud, UploadCloudIcon, XIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import {dummyResumeData} from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import api from '../configs/api.js'
import toast from 'react-hot-toast'
import pdfToText from 'react-pdftotext'

const Dashboard = () => {

  const {user, token} = useSelector(state => state.auth);

  const colors=["#9333ea", "#d97706", "#dc2626", "#0284c7", "#16a34a"]
  const [allResumes, setallResumes]=useState([]);

  const [showCreateResume, setShowCreateResume] = useState(false);
  const [showUploadResume, setShowUploadResume] = useState(false);
  const [title, setTitle] = useState('');
  const [resume, setResume] = useState(null);
  const [editResumeId, setEditResumeId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate()

  const loadAllResumes = async() =>{
    try {
      const { data } = await api.get('/api/users/resumes', {headers:{Authorization: token}})
      setallResumes(data.resumes)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  }

  const createResume = async (event) =>{

    try {
      event.preventDefault()
      const { data }= await api.post('/api/resumes/create', {title}, {headers: {Authorization: token}})
      setallResumes([...allResumes, data.resume])
      setTitle('')
      setShowCreateResume(false)
      navigate(`/app/builder/${data.resume._id}`)
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
  }

  const uploadResume = async (event) =>{
    event.preventDefault()
    setIsLoading(true);
    try {
      const resumeText = await pdfToText(resume)
      const { data } = await api.post('/api/ai/upload-resume', {title, resumeText}, {headers: {Authorization : token}});
      setTitle('')
      setResume(null)
      setShowUploadResume(false)
      console.log("Upload response:", data)
      navigate(`/app/builder/${data.resumeId}`)


    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
    setIsLoading(false);
  }

  const editResume = async (event) =>{
    try {
      event.preventDefault();
      const {data} = await api.put(`/api/resumes/update`, {resumeId: editResumeId, resumeData: {title}}, {headers : {Authorization: token}});
      setallResumes(allResumes.map(resume => resume._id === editResumeId ? {...resume, title} : resume));
      setTitle('');
      setEditResumeId('')
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  }

  const deleteResume =  async (resumeId) =>{
    try {
      const confirm = window.confirm('Are you sure you want to delete this resume?')
      if(confirm){
        const {data} = await api.delete(`/api/resumes/delete/${resumeId}`, {headers : {Authorization: token}})
        setallResumes(allResumes.filter(resume => resume._id !== resumeId))
        toast.success(data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message)
    }
    
  }

  useEffect(() =>{
    loadAllResumes();
  },[])

  return (
    <div>
        <div className='max-w-7xl mx-auto px-4 py-10'>
          <p className='text-3xl font-semibold mb-8 bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent sm:hidden'>Welcome, {user?.name}!</p>

          <div className='flex gap-5'>
            <button onClick={() => setShowCreateResume(true)} className='w-full bg-white sm:max-w-40 h-52 flex flex-col items-center justify-center rounded-xl gap-3 text-slate-600 border-2 border-dashed border-slate-200 group hover:border-green-400 hover:shadow-lg hover:bg-green-50/30 transition-all duration-300 cursor-pointer card-hover'>
              <div className='p-3 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full shadow-md group-hover:scale-110 transition-transform duration-300'>
                <PlusIcon className='size-6' />
              </div>
              <p className='text-sm font-medium group-hover:text-green-600 transition-colors duration-300'>Create Resume</p>
            </button>

            <button onClick={() => setShowUploadResume(true)} className='w-full bg-white sm:max-w-40 h-52 flex flex-col items-center justify-center rounded-xl gap-3 text-slate-600 border-2 border-dashed border-slate-200 group hover:border-blue-400 hover:shadow-lg hover:bg-blue-50/30 transition-all duration-300 cursor-pointer card-hover'>
              <div className='p-3 bg-gradient-to-br from-blue-400 to-blue-600 text-white rounded-full shadow-md group-hover:scale-110 transition-transform duration-300'>
                <UploadCloudIcon className='size-6' />
              </div>
              <p className='text-sm font-medium group-hover:text-blue-600 transition-colors duration-300'>Upload Resume</p>
            </button>
          </div>

          <hr className='border-slate-200 my-8 sm:w-305px' />
        </div>

        <div className='max-w-7xl mx-auto px-4 pb-12'>
          <div className='grid grid-cols-2 sm:flex flex-wrap gap-5'>

            {allResumes?.map((resume, index) => {

              if (!resume) return null;

              const basecolor = colors[index % colors.length];

              return (
                <button
                  key={resume._id}
                  onClick={() => navigate(`/app/builder/${resume._id}`)}
                  className='relative w-full sm:max-w-40 h-52 flex flex-col items-center justify-center rounded-xl gap-3 border-2 group hover:shadow-xl transition-all duration-300 cursor-pointer card-hover'
                  style={{
                    background: `linear-gradient(135deg, ${basecolor}08, ${basecolor}25)`,
                    borderColor: basecolor + '30'
                  }}
                >
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <PencilIcon
                        className="size-4 cursor-pointer hover:scale-110 transition-transform"
                        style={{ color: basecolor }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditResumeId(resume._id);
                          setTitle(resume.title);
                        }}
                      />

                      <TrashIcon
                        className="size-4 cursor-pointer hover:scale-110 transition-transform"
                        style={{ color: basecolor }}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteResume(resume._id);
                        }}
                      />
                  </div>

                  <div className="p-3 rounded-full bg-white/60 shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <FilePenLineIcon
                      className='size-6'
                      style={{ color: basecolor }}
                    />
                  </div>

                  <p
                    className='text-sm font-medium group-hover:scale-105 transition-all px-3 text-center line-clamp-2'
                    style={{ color: basecolor }}
                  >
                    {resume.title}
                  </p>

                  <p
                    className='absolute bottom-3 text-xs text-center opacity-70'
                    style={{ color: basecolor }}
                  >
                    {new Date(resume.updatedAt).toLocaleDateString()}
                  </p>
                  <button
                    className="absolute bottom-8 text-xs font-medium hover:underline opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ color: basecolor }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/app/builder/${resume._id}#analytics`);
                    }}>
                    Analytics
                  </button>
                </button>
              )
            })}

          </div>
        </div>


        {
          showCreateResume && (
            <form onSubmit={createResume} onClick={() => setShowCreateResume(false)} className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4'>

              <div onClick={e => e.stopPropagation()} className='relative bg-white shadow-2xl rounded-xl w-full max-w-sm p-7 border border-gray-100 card-hover'>

                <h2 className='text-xl font-semibold mb-5 text-slate-800'>Create a resume</h2>

                <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder='Enter resume title' className='w-full px-4 py-3 mb-5' required />

                <button className='w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-medium shadow-md hover:shadow-lg'>Create resume</button>

                <XIcon className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' onClick={() => {
                  setShowCreateResume(false);
                  setTitle('');
                }} />
              </div>
            </form>
          )
        }

        {
          showUploadResume && (
            <form onSubmit={uploadResume} onClick={() => setShowUploadResume(false)} className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4'>

              <div onClick={e => e.stopPropagation()} className='relative bg-white shadow-2xl rounded-xl w-full max-w-sm p-7 border border-gray-100 card-hover'>

                <h2 className='text-xl font-semibold mb-5 text-slate-800'>Upload resume</h2>

                <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder='Enter resume title' className='w-full px-4 py-3 mb-4' required />

                <div>
                  <label htmlFor="resume-input" className='block text-sm text-slate-700 font-medium'>
                    Select Resume File
                    <div className='flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-xl p-6 my-4 hover:border-green-400 hover:bg-green-50/30 hover:text-green-600 cursor-pointer transition-all duration-200'>
                      {resume ? (
                        <p className='text-green-600 font-medium'>{resume.name}</p>
                      ) : (
                        <>
                          <UploadCloud className='size-12 stroke-1 text-slate-400' />
                          <p className='text-sm text-slate-500'>Click to upload PDF</p>
                        </>
                      )}
                    </div>
                  </label>
                  <input type="file" id='resume-input' accept='.pdf' hidden onChange={(e) => setResume(e.target.files[0])} />
                </div>

                <button disabled={isLoading} className='w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-medium shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70'>
                  {isLoading && <LoaderCircleIcon className='animate-spin size-4 text-white' />}
                  {isLoading ? 'Uploading...': 'Upload Resume'}
                
                </button>
                
                <XIcon className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' onClick={() => {
                  setShowUploadResume(false);
                  setTitle('');
                }} />
              </div>
            </form>
          )
        }

        {
          editResumeId && (
            <form onSubmit={editResume} onClick={() => setEditResumeId('')} className='fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4'>

              <div onClick={e => e.stopPropagation()} className='relative bg-white shadow-2xl rounded-xl w-full max-w-sm p-7 border border-gray-100 card-hover'>

                <h2 className='text-xl font-semibold mb-5 text-slate-800'>Edit resume title</h2>

                <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder='Enter resume title' className='w-full px-4 py-3 mb-5' required />

                <button className='w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-medium shadow-md hover:shadow-lg'>Update</button>

                <XIcon className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors' onClick={() => {
                  setEditResumeId('');
                  setTitle('');
                }} />
              </div>
            </form>
          )
        }

    </div>
  )
}

export default Dashboard