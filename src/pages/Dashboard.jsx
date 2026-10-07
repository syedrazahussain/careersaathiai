import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { useNavigate } from "react-router-dom"
import api from '../utils/axios'
import { motion } from "motion/react"
import { FiSidebar } from 'react-icons/fi'
import { getAllInterviews } from '../apis/interview.api'
import Statbox from '../components/Statbox'
import InterviewGraph from '../components/InterviewGraph'

const Dashboard = ({ user, setuser }) => {
  const [sidebarOpen, setsidebarOpen] = useState(true)
  const [mobileOpen, setmobileOpen] = useState(false)
  const [stats, setstats] = useState({
    totalInterviews:0,
    totalQuestions:0,
    completed:0,
    averageScore:0,
  });
  const [technicalData, settechnicalData] = useState([])
  const [hrData, setHrData] = useState([]);
  const [technicalCount, settechnicalCount] = useState(0);
  const [hrCount, sethrCount] = useState(0);

  const navigate = useNavigate()

  useEffect(()=>{
    const fetchInterviews= async()=>{
      const response = await getAllInterviews()
      setstats(response?.stats)
      settechnicalData(response?.technicalData);
      setHrData(response?.hrData)
      settechnicalCount(response?.technicalCount);
      sethrCount(response?.hrCount)
    }
    fetchInterviews()
  },[])

  const handlelogout = async () => {
    try {
      const response = await api.get("/api/auth/logout")
      if (response.data.success) {
        setuser(null)
        navigate("/")
      }
    } catch (error) {
      console.log(error)

    }
  }

  return (
    <div className='bg-white min-h-screen text-[#0a0a0a] font-sans flex'>
      <Sidebar
        user={user}
        onNewInterview={() => navigate("/interview")}
        onLogout={handlelogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setsidebarOpen}
        
        mobileOpen={mobileOpen}
        setMobileOpen={setmobileOpen}
      />

      <motion.main className={`flex-1 min-h-screen  px-3 sm:px-4 md:px-6 py-4 md:py-6 transition-all
        duration-300 ${sidebarOpen ? "md:ml-[260px]" : "md:ml-[72px]"}`}>
            {/* top area */}
          <div className='flex items-center justify-between mb-5 md:mb-6'>
            <div className='flex items-center gap-2.5'>
              <motion.button 
              whileHover={{scale:1.1}}
              whileTap={{scale:0.95}}
              onClick={()=>setmobileOpen(true)}
              className='md:hidden text-black/40 hover:text-[#0a0a0a] transition-colors'>
              <FiSidebar size={17}/>

              </motion.button>

              <motion.div
              initial={{opacity:0,y:-12}}
              animate={{opacity:1,y:0}}
              transition={{duration:0.4}}
               className=''>
                <p className='text-black/40 text-[11px] md:text-xs font-medium mb-0.50'>Overview</p>
                <h2 className='text-lg md:text-xl font-bold text-[#0a0a0a]'>Hello,{user?.name?.split(" ")} 👋 </h2>

              </motion.div>
            </div>

          </div>

          <div className='h-px bg-black/8 mb-5 md:mb-6'/>

          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2.5'>
            <Statbox
            label="Total Interviews"

            value={stats?.totalInterviews}

            subHighlight="All Time"

            sub="Interviews created"

            index={0}
            />
            <Statbox
            label="Questions solved"

            value={stats?.totalQuestions}

            subHighlight="Answered"

            sub="Across All Interviews"

            index={1}
            />
            <Statbox
            label="Completed"

            value={stats?.completed}

            subHighlight={`${stats?.totalInterviews || 0} Total`}

            sub="Interviews Finished"

            index={2}
            />
            <Statbox
            label="Average Score"

            value={`${Math.round(stats?.averageScore || 0)}/100`}

            subHighlight="Completed only"

            sub="Average Performance"

            index={3}
            />
          </div>

          <motion.div 
          initial={{opacity:0}}
              animate={{opacity:1}}
              transition={{duration:0.4,delay:0.3}}
              className='mb-3 md:mb-4'

          >

            <p className='text-black/40 text-[10px] font-semibold uppercase tracking-widest
            mt-2.5 mb-1'>Performance</p>

            <h3 className='text-[#0a0a0a] font-bold text-sm md:text-base mb-3 md:mb-4'>
              Interview History
            </h3>

          </motion.div>

            <InterviewGraph
            technicalData={technicalData}
            technicalCount={technicalCount}
            hrData={hrData}
            hrCount={hrCount}
            />


      </motion.main>

    </div>

  )
}

export default Dashboard