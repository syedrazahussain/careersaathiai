import React, { useEffect, useState } from 'react'
import Step3report from '../components/interview/Step3report'
import { useNavigate, useParams } from 'react-router-dom'
import { getInterview } from '../apis/interview.api'

const InterviewReport = ({user,setuser}) => {
   const { id } = useParams()
  const [loading, setloading] = useState(true)
  const [report, setreport] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchReport = async () => {
      const response = await getInterview(id)
      const data = response?.interview
      if (data?.status !== "completed") {
        navigate(`/interview/${id}`, { replace: true });
        return;

      }

      setreport(data)
      setloading(false)
    }
    fetchReport()
  }, [id, navigate])

  if (loading) {
    return (
      <div className='min-h-screen bg-[#07000F] flex items-center justify-center'>
        <div className='w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin' />


      </div>
    )
  }

  if (!report) {
    return null
  }


  return (
   <Step3report
   user={user}
   setuser={setuser}
   report={report}
   />
  )
}

export default InterviewReport