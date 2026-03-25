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
        <div className='max-w-7xl mx-auto px-4 py-8'>
          <p className='text-2xl font-medium mb-6 bg-linear-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden'>Welcome, Prerana!</p>

          <div className='flex gap-4'>
            <button onClick={() => setShowCreateResume(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300 cursor-pointer'>
              <PlusIcon className='size-11 transition-all duration-300 p-2.5 bg-linear-to-r from-indigo-300 to indigo-500 text-white rounded-full' />
              <p className='text-sm group-hover:text-indigo-600 transition-all duration-300'>Create Resume</p>
            </button>

            <button onClick={() => setShowUploadResume(true)} className='w-full bg-white sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300 cursor-pointer'>
              <UploadCloudIcon className='size-11 transition-all duration-300 p-2.5 bg-linear-to-r from-purple-300 to purple-500 text-white rounded-full' />
              <p className='text-sm group-hover:text-purple-600 transition-all duration-300'>Upload existing.</p>
            </button>
          </div>

          <hr className='border-slate-300 my-6 sm:w-305px' />
        </div>

        <div className='max-w-7xl mx-auto px-4'>
          <div className='grid grid-cols-2 sm:flex flex-wrap gap-4'>

            {allResumes?.map((resume, index) => {

              if (!resume) return null;

              const basecolor = colors[index % colors.length];

              return (
                <button
                  key={resume._id}
                  onClick={() => navigate(`/app/builder/${resume._id}`)}
                  className='relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300 cursor-pointer'
                  style={{
                    background: `linear-gradient(135deg, ${basecolor}10, ${basecolor}40)`,
                    borderColor: basecolor + '40'
                  }}
                >
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                      <PencilIcon
                        className="size-4 cursor-pointer"
                        style={{ color: basecolor }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditResumeId(resume._id);
                          setTitle(resume.title);
                        }}
                      />

                      <TrashIcon
                        className="size-4 cursor-pointer"
                        style={{ color: basecolor }}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteResume(resume._id);
                        }}
                      />
                  </div>

                  <FilePenLineIcon
                    className='size-7 group-hover:scale-105 transition-all'
                    style={{ color: basecolor }}
                  />

                  <p
                    className='text-sm group-hover:scale-105 transition-all px-2 text-center'
                    style={{ color: basecolor }}
                  >
                    {resume.title}
                  </p>

                  <p
                    className='absolute bottom-1 text-xs text-center'
                    style={{ color: basecolor + '90' }}
                  >
                    Updated on {new Date(resume.updatedAt).toLocaleDateString()}
                  </p>
                  <button
                    className="absolute bottom-6 text-xs text-blue-600 hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/app/builder/${resume._id}#analytics`);
                    }}>
                    📊 Analytics
                  </button>
                </button>
              )
            })}

          </div>
        </div>


        {
          showCreateResume && (
            <form onSubmit={createResume} onClick={() => setShowCreateResume(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>

              <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>

                <h2 className='text-xl font-bold mb-4'>Create a resume.</h2>

                <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder='Enter resume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required />

                <button className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>Create resume</button>

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
            <form onSubmit={uploadResume} onClick={() => setShowUploadResume(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>

              <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>

                <h2 className='text-xl font-bold mb-4'>Upload resume</h2>

                <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder='Enter resume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required />

                <div>
                  <label htmlFor="resume-input" className='block text-sm text-slate-700'>
                    Select Resume File
                    <div className='flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 my-4 hover:border-green-500 hover:text-green-700 cursor-pointer transition-colors'>
                      {resume ? (
                        <p className='text-green-700'>{resume.name}</p>
                      ) : (
                        <>
                          <UploadCloud className='size-14 stroke-1' />
                          <p>Upload resume.</p>
                        </>
                      )}
                    </div>
                  </label>
                  <input type="file" id='resume-input' accept='.pdf' hidden onChange={(e) => setResume(e.target.files[0])} />
                </div>

                <button disabled={isLoading} className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center justify-center gap-2'>
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
            <form onSubmit={editResume} onClick={() => setEditResumeId('')} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>

              <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>

                <h2 className='text-xl font-bold mb-4'>Edit resume title</h2>

                <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" placeholder='Enter resume title' className='w-full px-4 py-2 mb-4 focus:border-green-600 ring-green-600' required />

                <button className='w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors'>Update</button>

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