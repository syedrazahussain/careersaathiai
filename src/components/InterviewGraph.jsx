import React from 'react'
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts'
import { motion } from "motion/react"

function CustomTooltip({active , payload}){
    if(active && payload?.length){
        return (
            <div className='bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10
            rounded-lg px-2.5 py-1.5 text-[11px] text-white shadow-2xl'>
                <p className='text-white/40 mb-0.5'>{payload[0]?.payload?.skill}</p>
                <p className='text-white font-bold'>{payload[0]?.value}%</p>
            </div>
        )
    }
}

function RadarCard({title,data,color,index}){
    return(
        <motion.div
        
        initial={{opacity:0,y:24}}
              animate={{opacity:1,y:0}}
              transition={{duration:0.45,delay:0.2+index * 0.1}}
              whileHover={{y:-4}}
         className="relative overflow-hidden bg-[#000000]/90 backdrop-blur-2xl
        border border-white/10 rounded-xl p-3 md:p-4 flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.18)]
        hover:border-white/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.28)] transition-all">
            <div className='absolute inset-0 bg-gradient-to-br from-white/[0.08] 
            via_transparent to-transparent pointer-events-none'/>

            <div className='relative'>
                <ResponsiveContainer width="100%" height={180}>
                    <RadarChart data={data} cx="50%" cy="50%" outerRadius="68%">
                        <PolarGrid stroke='rgba(255,255,255,0.08' gridType='circle'/>
                        <PolarAngleAxis dataKey="skill" tick={{fill:"rgba(255,255,255,0.35)",fontSize:9,fontWeight:500 }}/>
                        <Radar name={title}
                        dataKey="score"
                        stroke={color}
                        fill={color}
                        fillOpacity={0.15}
                        strokeWidth={2}
                        dot={{r:2.5,fill:color,strokeWidth:0}}
                        />

                        <Tooltip content={<CustomTooltip/>}/>

                    </RadarChart>
                </ResponsiveContainer>

                <p className='text-white font-semibold text-xs text-center mt-2'>
                    {title}
                </p>
            </div>

        </motion.div>
    )
}

const InterviewGraph = ({ technicalData, hrData, technicalCount, hrCount }) => {
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4'>
            <RadarCard title={`Technical Interview (${technicalCount})`}
            data={technicalData} color="rgba(255,255,255,0.85)" index={0}            />
            <RadarCard title={`HR Interview (${hrCount})`}
            data={hrData} color="rgba(180,180,180,0.85)" index={1}            />

        </div>
    )
}

export default InterviewGraph