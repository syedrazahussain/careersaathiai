import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from "motion/react"
import { FiCheck, FiChevronDown, FiClock, FiFileText, FiSend, FiX, FiZap } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { SiRocket } from "react-icons/si";
import { BsRocketTakeoff } from "react-icons/bs";
import {
    useCoins,
    refundCoins
} from '../apis/user.api';
import api from '../utils/axios';
import { useSelector } from 'react-redux'
import RoadmapResult from '../components/roadmap/RoadmapResult';

const PACKAGE_OPTIONS = ["10 LPA", "15 LPA", "20 LPA", "30 LPA", "40 LPA"]
const Roadmap = ({ user, setuser }) => {
    const navigate = useNavigate();
    const [historyOpen, sethistoryOpen] = useState(false)
    const [roadmap, setroadmap] = useState(null)
    const [role, setrole] = useState("")
    const [targetPackage, settargetPackage] = useState(PACKAGE_OPTIONS[2]);
    const [packageOpen, setpackageOpen] = useState(false)
    const [useResume, setuseResume] = useState(false)
    const [loading, setloading] = useState(false)
    const [historyLoading, sethistoryLoading] = useState(false)
    const [history, sethistory] = useState([]);
    const [error, seterror] = useState("")

    const { resume } = useSelector((state) => state.resume)

    useEffect(() => {

        getAllRoadmap()

    }, [])

    const getAllRoadmap = async () => {
        sethistoryLoading(true)
        try {
            const response = await api.get("/api/roadmap/all")
            console.log(response.data)
            sethistory(response.data.data)
            sethistoryLoading(false)
        } catch (error) {
            sethistoryLoading(false)
        }
    }

    const getRoadmapById = async (id) => {
        try {

            const response = await api.get(`/api/roadmap/${id}`);
            console.log(response.data)
            setroadmap(response.data.data)
        } catch (error) {
            console.log(error)
        }
    }
    const handleGenerate = async () => {

        if (!role.trim() || loading) return;

        setloading(true);
        seterror("");

        let coinDeducted = false;

        try {

            // =================================================
            // DEDUCT COIN
            // =================================================

            const coinResponse = await useCoins({
                coins: 1,
                action: "Roadmap-builder"
            });


            if (!coinResponse?.success) {

                alert(
                    coinResponse?.message ||
                    "Unable to deduct coins. Please try again."
                );

                return;
            }


            // Coin successfully deducted
            coinDeducted = true;


            console.log(
                "Coin response:",
                coinResponse
            );


            setuser((prev) => ({
                ...prev,
                interviewCoins:
                    coinResponse?.interviewCoins
            }));


            // =================================================
            // GENERATE ROADMAP
            // =================================================

            const response = await api.post(
                "/api/roadmap/generate",
                {
                    role: role.trim(),
                    targetPackage,
                    useResume,
                    resume
                }
            );


            // =================================================
            // SUCCESS
            // =================================================

            setroadmap(response.data.data);

            getAllRoadmap();


        } catch (error) {

            console.error(
                "Failed to generate roadmap:",
                error
            );


            // =================================================
            // REFUND COIN
            // =================================================

            if (coinDeducted) {

                try {

                    console.log(
                        "Roadmap generation failed. Refunding coin..."
                    );


                    const refundResponse =
                        await refundCoins({
                            coins: 1,
                            action: "Roadmap-builder-refund"
                        });


                    if (refundResponse?.success) {

                        console.log(
                            "Roadmap coin refunded:",
                            refundResponse
                        );


                        setuser((prev) => ({
                            ...prev,
                            interviewCoins:
                                refundResponse?.interviewCoins
                        }));


                    } else {

                        console.error(
                            "Roadmap coin refund failed:",
                            refundResponse
                        );
                    }


                } catch (refundError) {

                    console.error(
                        "Roadmap refund request failed:",
                        refundError
                    );
                }
            }


            seterror(
                error?.response?.data?.message ||
                "Something went wrong while generating your roadmap. Your coin has been refunded if the deduction was successful."
            );


        } finally {

            setloading(false);

        }
    };

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
                        <span className='hidden rounded bg-black/5 px-1.5 py-0.5 text-[10px] text-black/50 sm:block'>Roadmap Builder</span>
                    </div>
                    <button onClick={() => sethistoryOpen(!historyOpen)} className='flex h-8 items-center justify-center gap-1 rounded-lg border
                border-black/15 text-black/60 transition px-2 hover:border-[#0a0a0a] hover:text-[#0a0a0a] text-[10px]'>
                        <FiClock />
                        <span className='hidden sm:inline '>History</span>
                    </button>
                </div>

            </motion.nav>

            <main className='flex-1 overflow-y-auto pb-28 sm:pb-32 pt-16 sm:pt-20'>
                <div className='max-w-3xl mx-auto px-3 sm:px-4 pt-5 sm:pt-6'>
                    <AnimatePresence mode='wait'>
                        {!roadmap ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.97 }}
                                transition={{ duration: 0.4 }}
                                className='flex flex-col items-center justify-center
                            min-h-[60vh] text-center px-2 sm:px-4'>

                                <div className='text-4xl sm:text-5xl mb-4 sm:mb-5'>
                                    <BsRocketTakeoff className='text-gray-700' />
                                </div>
                                <h3 className='text-xl sm:text-2xl font-bold text-[#0a0a0a]
                                mb-2'>AI Roadmap Generator</h3>
                                <p className='text-black/45 text-sm max-w-xs sm:max-w-md mb-1'>
                                    Generate a personalised roadmap for your dream job.
                                </p>
                                <p className='text-black/35 text-xs sm:text-sm max-w-xs sm:max-w-md '>
                                    Choose a role and let AI build a complete learning path.
                                </p>

                                {error && <p className='mt-4 text-xs text-red-500 max-w-xs
                                sm:max-w-md'>{error}</p>}

                                <div className='mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-3 w-full
                                max-w-xs sm:max-w-sm'>
                                    {
                                        ["Frontend Dev", "Backend Eng", "ML Engineer"].map((r) => (
                                            <motion.button
                                                key={r}
                                                onClick={() => setrole(r)}
                                                whileHover={{ y: -2 }}
                                                whileTap={{ scale: 0.97 }}
                                                className='relative overflow-hidden text-xs py-2 sm:py-2.5
                                            px-2 sm:px-3 rounded-xl bg-[#000000]/90 backdrop-blur-2xl
                                            border border-white/10 text-white/55 hover:text-white
                                            hover:border-white/25 shadow-[0_4px_14px_rgba(0,0,0,0.18)] transition-all'
                                            >
                                                <div className='absolute inset-0 bg-gradient-to-br from-white/[0.07] via-transparent
                                                to-transparent pointer-events-none'/>
                                                <span className='relative'>{r}</span>


                                            </motion.button>
                                        ))
                                    }
                                </div>

                            </motion.div>
                        ) : (
                            <RoadmapResult
                                roadmap={roadmap}
                                onClear={() => setroadmap(null)}
                            />
                        )
                        }


                    </AnimatePresence>
                </div>
            </main>

            <div className='fixed bottom-0 left-0 right-0 z-30 pb-3 sm:pb-4 pt-3 px-3 sm:px-4 
                bg-gradient-to-t from-white via-white/95 to-transparent'>
                <div className='max-w-3xl mx-auto'>
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className='relative overflow-visible flex items-center gap-1.5 sm:gap-2
                        p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-[#000000]/90 backdrop-blur-2xl border border-white/10
                        shadow-[0_8px_32px_rgba(0,0,0,0.25)]'>

                        <input type='text' placeholder='Backend Developer' onChange={(e) => setrole(e.target.value)}
                            value={role} className='relative flex-1 min-w-0 bg-transparent text-xs sm:text-sm text-white
                            placeholder-white/30 outline-none px-2 py-1.5'/>

                        <div className='relative'>
                            <motion.button
                                type='button'
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setpackageOpen(!packageOpen)}
                                className='relative flex items-center gap-1 text-xs px-2.5
                                py-2 rounded-xl border border-white/10 text-white/60 hover:text-white/90 hover:border-white/20
                                transition-all whitespace-nowrap bg-white/5'>
                                {targetPackage}
                                <FiChevronDown size={11} className={`transition-transform ${packageOpen ? "rotate-180" : ""}`} />

                            </motion.button>

                            <AnimatePresence>
                                {packageOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 6, scale: 0.97 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 6, scale: 0.97 }}
                                        transition={{ duration: 0.15 }}
                                        className='absolute bottom-full mb-4 right-0 w-28
                                        rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0a]
                                        shadow-[0_8px_24px_rgba(0,0,0,0.35)] z-10'

                                    >
                                        {
                                            PACKAGE_OPTIONS.map((pkg) => (
                                                <button
                                                    onClick={() => {
                                                        settargetPackage(pkg);
                                                        setpackageOpen(false)
                                                    }}
                                                    key={pkg} className={`w-full text-left text-xs px-3
                                                    py-2 transition-colors ${pkg === targetPackage ? "bg-white/10 text-white"
                                                            : "text-white/55 hover:bg-white/5 hover:text-white/90"
                                                        }`}>
                                                    {pkg}
                                                </button>
                                            ))
                                        }

                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            type='button'
                            onClick={() => setuseResume(!useResume)}
                            className={`flex items-center text-xs gap-1 px-5 py-2 rounded-xl 
                                ${useResume
                                    ? "bg-emerald-500/10 text-emerald-400"
                                    : "bg-white/5 text-white/60"
                                }`}>
                            {useResume ? (
                                <>
                                    <FiCheck size={12} />
                                    Added
                                </>
                            ) : (
                                <>
                                    <FiFileText size={12} />
                                    Resume
                                </>
                            )}

                        </motion.button>

                        <motion.button
                            onClick={handleGenerate}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            disabled={loading || !role.trim()}
                            className='relative flex items-center gap-1.5 text-xs px-3 sm:px-4 py-2 rounded-xl font-semibold
                        text-[#0a0a0a] bg-white hover:bg-white/9- shadw-[0_2px_10px_rgba(255,255,255,0.12)] transition-all
                        disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap'
                        >
                            {loading ? (
                                <>
                                    <motion.span
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        className='inline-block'
                                    >
                                        <FiZap size={12} />


                                    </motion.span>
                                    <span className='hidden sm:inline'>
                                        Generating...

                                    </span>
                                </>

                            ) : (
                                <>
                                    <FiSend size={12} />
                                    <span className='hidden sm:inline'>Generate</span>
                                </>
                            )}

                        </motion.button>


                    </motion.div>

                </div>
            </div>

            <AnimatePresence>
                {
                    historyOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => sethistoryOpen(false)}
                                className='fixed inset-0 z-40 bg-black/20 backdrop-blur-sm' />

                            <motion.aside
                                initial={{ x: 320 }}
                                animate={{ x: 0 }}
                                exit={{ x: 320 }}
                                transition={{ type: "spring", stiffness: 320, damping: 32 }}
                                className='fixed right-0 top-0 bottom-0 z-50 w-[280px] sm:w-[300px]
                                max-w-[85vw] bg-white border-1 border-black/8 flex flex-col overflow-y-auto
                                shadow-[0_0_40px_rgba(0,0,0,0.1)]'
                            >
                                <div className='flex items-center justify-between px-4 py-3 sm:py-4 border-b border-black/8
                                sticky top-0 bg-white/90 backdrop-blur-xl'>
                                    <span className='text-sm font-semibold text-[#0a0a0a]'>Previous Roadmaps</span>
                                    <button onClick={() => sethistoryOpen(false)} className='text-black/35 hover:text-[#0a0a0a]
                                    transitin-colors'><FiX size={16} /></button>

                                </div>

                                <div className='flex flex-col gap-2 p-3'>
                                    {historyLoading ? (
                                        <p className='text-xs text-black/35 text-center py-6'>Loading...</p>
                                    ) : history.length === 0 ?
                                        (
                                            <p className='text-xs text-black/35 text-center py-6'>No roadmaps yet.</p>
                                        ) : (
                                            history.map((h, i) => (
                                                <button key={i} onClick={() => {
                                                    getRoadmapById(h._id);
                                                    sethistoryOpen(false)
                                                }} className='relative overflow-hidden text-left p-4 
                                                rounded-xl bg-[#000]/90 border border-white/10'>
                                                    <h3 className='text-white font-semibold'>{h.title}</h3>
                                                    <div className='flex justify-between my-1'>
                                                        <span className='text-violet-400 text-xs'>{h.targetPackage}</span>
                                                        <p className='text-xs text-white/40'>{h.duration}</p>
                                                    </div>
                                                    <p className='text-xs text-white/30 mt-1'>
                                                        {new Date(h.createdAt).toLocaleDateString()}</p>
                                                </button>
                                            ))
                                        )
                                    }
                                </div>


                            </motion.aside>
                        </>


                    )
                }
            </AnimatePresence>
        </div>
    )
}

export default Roadmap