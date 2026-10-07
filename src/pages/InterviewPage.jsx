import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import { getInterview } from '../apis/interview.api'
import Step2setup from '../components/interview/Step2setup'

const InterviewPage = ({user,setuser}) => {
  const { id } = useParams()
  const [loading, setloading] = useState(true)
  const [interview, setinterview] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchInterview = async () => {
      const response = await getInterview(id)
      const data = response?.interview
      if (data?.status === "completed") {
        navigate(`/interview/${id}/report`, { replace: true });
        return;

      }

      setinterview(data)
      setloading(false)
    }
    fetchInterview()
  }, [id, navigate])

  if (loading) {
    return (
      <div className='min-h-screen bg-[#07000F] flex items-center justify-center'>
        <div className='w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin' />


      </div>
    )
  }

  if (!interview) {
    return null
  }
  return (
    <Step2setup
      interviewData={{
        interviewId: interview._id,
        currentQuestion: interview.currentQuestion,
        totalQuestions: interview.questions.length,
        question: interview.questions[interview.currentQuestion]
      }} user={user}
    />
  )
}

export default InterviewPage