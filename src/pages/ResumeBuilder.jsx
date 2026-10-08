import React, { useState } from 'react'
import ResumeForm from '../components/resume/ResumeForm'
import initialData from '../components/resume/initialData'
import { motion } from "motion/react"
import { FiArrowLeft, FiArrowRight, FiEye } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PreviewResume from '../components/resume/PreviewResume';

const STEPS = [
    { step: 1, title: "Personal Information", subtitle: "Your basic contact details" },
    { step: 2, title: "Professional Summary", subtitle: "A Quick intro about yourself" },
    { step: 3, title: "Skills", subtitle: "Your technical skills" },
    { step: 4, title: "Work Experience", subtitle: "Your past jobs & internships" },
    { step: 5, title: "Projects", subtitle: "Projects you have built" },
    { step: 6, title: "Education", subtitle: "Your academic background" },
];

const TOTAL_STEPS = STEPS.length;

const ResumeBuilder = ({ user, setuser }) => {
    const [currentStep, setcurrentStep] = useState(1)
    const [data, setdata] = useState(initialData)
    const [showPreview, setshowPreview] = useState(false)
    const navigate = useNavigate();
    const ProgressPct = ((currentStep) / (TOTAL_STEPS)) * 100;
    const activeStep = STEPS.find((s) => s.step == currentStep);

    const goPrev = () => {
        if (currentStep > 1) {
            setcurrentStep(currentStep - 1)
        }
    }
    const goNext = () => {
        if (currentStep < TOTAL_STEPS) {
            setcurrentStep(currentStep + 1)
        }
    }

    const isLastSTep = currentStep === STEPS.length

    if(showPreview){
        return <PreviewResume data={data} user={user} setuser={setuser} onBack={()=>
            setshowPreview(false)
        }/>
    }
    return (
        <div className='min-h-screen bg-white text-[#0a0a0a] flex flex-col'>

            <motion.nav
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className='sticky inset-x-0 top-0 z-20 border-b border-black/8 bg-white/80 backdrop-blur-xl'>
                <div className='mx-auto flex h-12 max-w-7xl items-center justify-between px-3 sm:px-5'>
                    <div onClick={() => navigate("/dashboard")} className='flex cursor-pointer items-center gap-1.5'>
                        <span className='text-sm font-extrabold sm:text-base text-[#0a0a0a]'>RisbenAI</span>
                        <span className='hidden rounded bg-black/5 px-1.5 py-0.5 text-[10px] text-black/50 sm:block'>Resume Builder</span>
                    </div>
                    <button onClick={()=>setshowPreview(true)} className='flex h-8 items-center justify-center rounded-lg border
                border-black/15 text-black/60 transition px-2 hover:border-[#0a0a0a] hover:text-[#0a0a0a]'>
                        <FiEye size={13} />
                    </button>
                </div>

            </motion.nav>

            {/* main container */}

            <div className='flex-1 px-3 py-4 sm:px-6 sm:py-8'>
                <div className='mx-auto w-full max-w-2xl'>
                    <div className='mb-4'>
                        <div className='flex items-center justify-between mb-1.5'>
                            <p className='text-[10px] text-black/40 font-medium'>
                                STEP {currentStep} OF {TOTAL_STEPS} </p>

                            <p className='hidden text-[10px] text-black/40 sm:block'>
                                {Math.round(ProgressPct)}% complete

                            </p>

                        </div>

                        <div className='w-full h-1 bg-black/8 rounded-full overflow-hidden'>
                            <div className='h-full bg-[#0a0a0a] rounded-full transition-all duration-300' style={{ width: `${ProgressPct}%` }}>

                            </div>

                        </div>
                        <div className='mt-3'>
                            <h2 className='text-xl font-bold sm:text-2xl'>{activeStep.title}</h2>
                            <p className='mt-1 text-xs text-black/45 sm:text-sm'>{activeStep.subtitle}</p>


                        </div>

                    </div>
                    <div className='border-t border-black/8 mb-4' />
                    <ResumeForm step={currentStep} data={data} setdata={setdata} />

                    <div className='border-t border-black/8 mt-6 mb-4' />

                    {/* Navigation button */}

                    <div className='flex items-center justify-between'>
                        <button
                            onClick={goPrev}
                            disabled={currentStep === 1}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg 
                            text-xs font-medium border transition-all
                            ${currentStep === 1}
                            ? "border-black/8 text-black/25 cursor-not-allowed"
                            :"border-black/20 text-black/60 hover:hover-black/40 hover:text-[#0a0a0a]"
                        }`}>
                            <FiArrowLeft size={15} />
                            <span className='hidden sm:block'>Previous</span>

                        </button>

                        <div className='flex items-center gap-1.5'>
                            {STEPS.map((s) => (
                                <button
                                    onClick={() => setcurrentStep(s.step)}
                                    key={s.step} className={`rounded-full transition-all ${s.step === currentStep

                                        ? "w-4 h-1.5 bg-[#0a0a0a]"
                                        : s.step < currentStep
                                            ? "w-1.5 h-1.5 bg-black/35"
                                            : "w-1.5 h-1.5 bg-black/12"
                                        }`}>

                                </button>
                            ))}

                        </div>

                        {isLastSTep ? (
                            <button onClick={()=>setshowPreview(true)} className='flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold
                            bg-[#000000]/90 backdrop-blur-2xl border border-white/20 text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)]
                            hover:border-white/20 transition-all'>
                                <FiEye size={15} />
                                <span className='hiddem sm:block'>Preview Resume</span>
                            </button>

                        ) : (<button onClick={goNext} className='flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold
                            bg-[#000000]/90 backdrop-blur-2xl border border-white/20 text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)]
                            hover:border-white/20 transition-all'>
                           
                            <span className='hidden sm:block'>Next</span> <FiArrowRight size={15} />

                        </button>)}

                    </div>
                </div>

            </div>
        </div>
    )
}

export default ResumeBuilder