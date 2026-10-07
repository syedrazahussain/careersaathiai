import React, { useEffect, useRef, useState } from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import DownloadBtn from './DownloadBtn'
import ATSTemplate from './ATSTemplate'

const PreviewResume = ({ data, onBack, user, setuser }) => {

    const resumeRef = useRef(null)
    const [scale, setscale] = useState(1)

    useEffect(() => {
        const updateScale = () => {


            if (window.innerWidth < 640) {
                setscale(0.42)
            }
            else if (window.innerWidth < 768) {
                setscale(0.58)
            } else if (window.innerWidth < 1024) {
                setscale(0.72)
            } else {
                setscale(0.9)
            }
        };

        updateScale();

        window.addEventListener("resize", updateScale);
        return () =>
            window.removeEventListener("resize", updateScale)


    }, [])
    return (
        <div className='min-h-screen bg-white text-[#0a0a0a]'>
        {/* //header */}
            <div className='sticky top-0 z-20 border-b border-black/8 bg-white/80 backdrop-blur-xl'>
                <div className='mx-auto flex max-w-7xl flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between
        sm:px-5'>
                    <div className=''>
                        <h2 className='text-base font-bold sm:text-lg'>Resume Preview</h2>
                        <p className='mt-0.5 text-[10px] text-gray-400 sm:text-xs'>
                            Review your resume before downloading
                        </p>

                    </div>

                    <div className='flex items-center justify-between lg:justify-end gap-2.5'>
                        <button onClick={onBack} className='flex h-8 items-center justify-center gap-1.5 rounded-lg
                border border-black/15 px-2.5 sm:px-3 text-xs text-black/60 transition hover:border-black/35
                hover:text-[#0a0a0a]'>
                            <FiArrowLeft size={15} />
                            <span className='hidden sm:block'>Back to Edit</span>
                        </button>
                        <DownloadBtn docRef={resumeRef} user={user} setuser={setuser} />

                    </div>

                </div>

            </div>

            <div className='overflow-auto bg-[#f8f9fa] px-3 py-4 sm:px-6 sm:py-8'>
                <div className='mx-auto flex justify-center'>
                    <div
                    style={{
                        transform:`scale(${scale})`,
                        transformOrigin:"top-center"
                    }}
                    >
                        <div ref={resumeRef} className='rounded-md bg-white shadow-[0_0_50px_rgba(0,0,0,.6)]'>
                            <ATSTemplate data={data}/>
                        </div>
                    </div>
                </div>

            </div>
        </div>


    )
}

export default PreviewResume