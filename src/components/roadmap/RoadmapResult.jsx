import React from 'react'
import { motion } from "motion/react"
import { FiCheckCircle, FiClock, FiMap, FiTarget, FiX } from 'react-icons/fi'
import ModuleCard from './ModuleCard'

const RoadmapResult = ({ roadmap, onClear }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >

            <motion.div className='relative overflow-hiiden bg-[#000000]/90 backdrop-blur-2xl border
            border-white/10 rounded-2xl p-5 mb-5 shadow-[0_8px_32px_rgba(0,0,0,0.22)]'>
                <div className='absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent
                pointer-events-none'/>

                <div className='relative flex items-start justify-between mb-4'>
                    <div>
                        <p className='text-xs text-white/35 tracking-widest uppercase mb-1'>Your Roadmap</p>
                        <h2 className='text-xl font-bold text-white'>{roadmap.title}</h2>
                        <p className='text-sm text-white/45 mt-0.5'>
                            Target: <span className='text-violet-400 font-medium'>{roadmap.targetPackage}</span>
                        </p>
                    </div>
                    <button onClick={onClear} className='text-white/30 hover:text-white/70 transition-colors mt-0.5'>
                        <FiX size={16} />
                    </button>
                </div>

                <div className='relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'>
                    {[
                        {icon:FiTarget, label:"Difficulty",value:roadmap.level},
                        {icon:FiClock, label:"Duration",value:roadmap.duration},
                        {icon: FiCheckCircle, label:"Modules",value:`${roadmap.modules.length} topics` },
                    ].map(({icon:ICON, label,value})=>(
                        <div key={label} className='rounded-xl p-3 bg-white/5 border border-white/8'>
                            <div className='flex items-center gap-1.5 mb-1'>
                                <ICON size={11} className='text-white/30'/>
                                <span className='text-xs text-white/30'>{label}</span>
                            </div>
                            <p className='text-sm font-semibold text-white'>{value}</p>

                        </div>
                    ))}
                </div>

            </motion.div>

            <div className='mb-4'>
                <p className='text-xs text-black/40 font-semibold uppercase tracking-widest
                mb-3 flex items-center gap-2'>
                    <FiMap size={12}/> Learning Modules
                </p>
                <div className='flex flex-col gap-2'>
                    {roadmap.modules.map((m,i)=>(
                        <ModuleCard key={m.title}
                        mod={m} index={i}
                        />
                    ))}
                </div>
                
            </div>

        </motion.div>
    )
}

export default RoadmapResult