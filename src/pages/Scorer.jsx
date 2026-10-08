import React from 'react'
import { useNavigate } from 'react-router-dom'

import { motion } from "motion/react"
import { useState } from 'react'
import {
    FiAlertCircle,
    FiTrendingUp,
    FiUploadCloud,
    FiUser,
    FiZap,
    FiCheckCircle,
    FiLoader
} from 'react-icons/fi'

import api from '../utils/axios'
import { useDispatch, useSelector } from 'react-redux'
import { setResume } from '../redux/resumeSlice'
import {
    PolarAngleAxis,
    RadialBar,
    RadialBarChart
} from "recharts"

import {
    useCoins,
    refundCoins
} from '../apis/user.api'


const MAX_FILE_SIZE = 20 * 1024 * 1024


const ScoreRing = ({ score = 0 }) => {
    const safeScore = Math.max(
        0,
        Math.min(100, Number(score) || 0)
    )

    const color =
        safeScore >= 75
            ? "#7c3aed"
            : safeScore >= 50
                ? "#f59e0b"
                : "#ef4444";

    return (
        <div className='relative flex items-center justify-center'>

            <RadialBarChart
                width={110}
                height={110}
                cx={55}
                cy={55}
                innerRadius={40}
                outerRadius={53}
                startAngle={90}
                endAngle={-270}
                data={[
                    {
                        value: safeScore,
                        fill: color
                    }
                ]}
                barSize={8}
            >

                <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    ticks={[]}
                />

                <RadialBar
                    background={{ fill: "#e5e7eb" }}
                    dataKey="value"
                    cornerRadius={8}
                />

            </RadialBarChart>


            <div className='absolute flex items-center'>

                <span className='text-lg font-bold text-white leading-none'>
                    {safeScore}
                </span>

                <span className='text-[9px] text-gray-200 mt-0.5'>
                    /100
                </span>

            </div>

        </div>
    )
}


const Tag = ({ text, color }) => {

    const styles = {
        purple: "bg-purple-50 text-purple-700 border-purple-200",
        red: "bg-red-50 text-red-700 border-red-200",
        green: "bg-green-50 text-green-700 border-green-200",
        yellow: "bg-yellow-50 text-yellow-700 border-yellow-200"
    }

    return (
        <div
            className={`text-[10px] px-1.5 py-1 rounded-md border font-medium ${styles[color]}`}
        >
            {text}
        </div>
    )
}


const Navbar = ({ label }) => {

    const navigate = useNavigate()

    return (
        <motion.nav
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                duration: 0.5,
                ease: "easeOut"
            }}
            className='fixed inset-x-0 top-0 z-20 border-b border-black/8 bg-white/80 backdrop-blur-xl'
        >

            <div className='mx-auto flex h-12 max-w-7xl items-center justify-start px-3 sm:px-5'>

                <div
                    onClick={() => navigate("/dashboard")}
                    className='flex cursor-pointer items-center gap-1.5'
                >

                    <span className='text-sm font-extrabold sm:text-base text-[#0a0a0a]'>
                        RisbenAI
                    </span>

                    <span className='hidden rounded bg-black/5 px-1.5 py-0.5 text-[10px] text-black/50 sm:block'>
                        {label}
                    </span>

                </div>

            </div>

        </motion.nav>
    )
}


const Scorer = ({ user, setuser }) => {

    const [file, setFile] = useState(null)

    const [loading, setloading] = useState(false)

    // File selection / preparation state
    const [filePreparing, setFilePreparing] = useState(false)
    const [fileReady, setFileReady] = useState(false)

    // Actual server upload progress
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadComplete, setUploadComplete] = useState(false)

    // Drag state
    const [isDragging, setIsDragging] = useState(false)

    const dispatch = useDispatch()

    const { resume } = useSelector(
        (state) => state.resume
    )

    console.log({ resume })


    // =========================================================
    // PROCESS SELECTED FILE
    // =========================================================

    const processSelectedFile = async (selectedFile) => {

        if (!selectedFile) return

        setFilePreparing(true)
        setFileReady(false)
        setFile(null)

        setUploadProgress(0)
        setUploadComplete(false)

        try {

            // -------------------------------------------------
            // PDF validation
            // -------------------------------------------------

            const isPdf =
                selectedFile.type === "application/pdf" ||
                selectedFile.name
                    .toLowerCase()
                    .endsWith(".pdf")


            if (!isPdf) {

                alert("Please select a PDF file.")

                return
            }


            // -------------------------------------------------
            // File size validation
            // -------------------------------------------------

            if (selectedFile.size > MAX_FILE_SIZE) {

                alert("PDF must be smaller than 20MB.")

                return
            }


            // -------------------------------------------------
            // Let React render "Preparing..." first
            // -------------------------------------------------

            await new Promise((resolve) => {
                requestAnimationFrame(() => {
                    resolve()
                })
            })


            // -------------------------------------------------
            // Small async yield.
            //
            // We are NOT synchronously reading the entire PDF.
            // File object can be passed directly to FormData.
            // -------------------------------------------------

            await new Promise((resolve) => {
                setTimeout(resolve, 0)
            })


            // -------------------------------------------------
            // File is ready
            // -------------------------------------------------

            setFile(selectedFile)
            setFileReady(true)

        } catch (error) {

            console.error(
                "File preparation error:",
                error
            )

            setFile(null)
            setFileReady(false)

            alert(
                "Unable to prepare this file. Please try another PDF."
            )

        } finally {

            setFilePreparing(false)
            setIsDragging(false)

        }
    }


    // =========================================================
    // INPUT CHANGE
    // =========================================================

    const handleFileChange = async (event) => {

        const selectedFile =
            event.target.files?.[0]

        await processSelectedFile(selectedFile)

        // Allows selecting the same file again
        event.target.value = ""
    }


    // =========================================================
    // DRAG EVENTS
    // =========================================================

    const handleDragOver = (event) => {

        event.preventDefault()
        event.stopPropagation()

        if (loading || filePreparing) return

        setIsDragging(true)
    }


    const handleDragLeave = (event) => {

        event.preventDefault()
        event.stopPropagation()

        setIsDragging(false)
    }


    const handleDrop = async (event) => {

        event.preventDefault()
        event.stopPropagation()

        if (loading || filePreparing) return

        setIsDragging(false)

        const droppedFile =
            event.dataTransfer.files?.[0]

        await processSelectedFile(droppedFile)
    }


    // =========================================================
    // UPLOAD RESUME
    // =========================================================

const uploadResume = async () => {

    if (!file) {
        alert("Please select a PDF")
        return
    }

    if (!fileReady) {
        alert("Please wait until the resume is ready.")
        return
    }

    let coinDeducted = false

    try {

        setloading(true)
        setUploadProgress(0)
        setUploadComplete(false)


        // =================================================
        // DEDUCT COIN
        // =================================================

        const coinResponse = await useCoins({
            coins: 1,
            action: "resume-Scorer"
        })


        // Agar coin deduction fail hua
        if (!coinResponse?.success) {

            alert(
                coinResponse?.message ||
                "Unable to deduct coins. Please try again."
            )

            return
        }


        // Coin successfully deducted
        coinDeducted = true


        console.log(
            "Coin response:",
            coinResponse
        )


        setuser((prev) => ({
            ...prev,
            interviewCoins:
                coinResponse?.interviewCoins
        }))


        // =================================================
        // FORM DATA
        // =================================================

        const formData = new FormData()

        formData.append(
            "resume",
            file
        )


        // =================================================
        // ACTUAL SERVER UPLOAD
        // =================================================

        const response = await api.post(
            "/api/resume/upload",
            formData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data"
                },

                onUploadProgress:
                    (progressEvent) => {

                        if (!progressEvent.total) {
                            return
                        }

                        const percentCompleted =
                            Math.round(
                                (
                                    progressEvent.loaded *
                                    100
                                ) /
                                progressEvent.total
                            )

                        setUploadProgress(
                            percentCompleted
                        )

                        if (
                            percentCompleted >= 100
                        ) {
                            setUploadComplete(true)
                        }
                    }
            }
        )


        // =================================================
        // SUCCESS
        // =================================================

        setUploadProgress(100)
        setUploadComplete(true)


        dispatch(
            setResume(
                response?.data?.data
            )
        )


        setloading(false)

    } catch (error) {

        console.error(
            "Resume upload error:",
            error
        )


        // =================================================
        // REFUND COIN
        // =================================================

        if (coinDeducted) {

            try {

                console.log(
                    "Upload failed. Refunding coin..."
                )

                const refundResponse =
                    await refundCoins({
                        coins: 1,
                        action: "resume-Scorer-refund"
                    })


                if (refundResponse?.success) {

                    console.log(
                        "Coin refunded:",
                        refundResponse
                    )

                    setuser((prev) => ({
                        ...prev,
                        interviewCoins:
                            refundResponse?.interviewCoins
                    }))

                } else {

                    console.error(
                        "Coin refund failed:",
                        refundResponse
                    )
                }

            } catch (refundError) {

                console.error(
                    "Coin refund request failed:",
                    refundError
                )
            }
        }


        alert(
            error?.response?.data?.message ||
            "Resume upload failed. Your coin has been refunded if the deduction was successful."
        )


        setloading(false)

        setUploadProgress(0)
        setUploadComplete(false)
    }
}

    // =========================================================
    // RESUME SCORER SECTION
    // =========================================================

    if (resume) return (

        <div className='min-h-screen bg-white text-[#0a0a0a]'>

            <Navbar label="Resume Scorer" />


            <section className='max-w-6xl mx-auto pt-18 sm:pt-20 pb-8 space-y-3.5'>


                <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>

                    <div>

                        <p className='text-[10px] text-black/40 tracking-widest uppercase mb-0.5'>
                            Resume Analysis
                        </p>

                        <h2 className='text-lg font-bold text-black'>
                            {resume?.name}
                        </h2>

                    </div>


                    <button
                        onClick={() => {

                            setFile(null)
                            setFileReady(false)
                            setUploadProgress(0)
                            setUploadComplete(false)

                            dispatch(setResume(null))

                        }}
                        className='text-[10px] sm:text-xs text-black/50 hover:text-[#0a0a0a] border
                        border-black/15 hover:border-black/35 px-2.5 py-1 rounded-lg transition-colors'
                    >
                        Re-upload
                    </button>

                </div>


                <motion.div
                    initial={{
                        y: 20,
                        opacity: 0
                    }}
                    animate={{
                        y: 0,
                        opacity: 1
                    }}
                    transition={{
                        duration: 0.5,
                        delay: 0.05
                    }}
                    className='relative overflow-hidden bg-[#000000]/90 backdrop-blur-2xl
                    border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-4
                    sm:flex-row shadow-[0_8px_32px_rgba(0,0,0,0.2)]'
                >

                    <div className='absolute inset-0 bg-gradient-to-br from-white/[0.08]
                    via-transparent to-transparent pointer-events-none' />


                    <div className='relative'>

                        <ScoreRing
                            score={resume?.score}
                        />

                    </div>


                    <div className='relative'>

                        <p className='text-white/50 text-xs mb-0.5'>
                            Resume Score
                        </p>


                        <p className='text-lg sm:text-xl font-bold mb-1.5 text-white'>

                            {
                                resume?.score >= 75
                                    ? "Strong"
                                    : resume?.score >= 50
                                        ? "Average"
                                        : "Needs Work"
                            }

                        </p>


                        <div className='flex items-center gap-1.5'>

                            <FiUser
                                className='text-purple-400 text-xs'
                            />

                            <span className='text-xs text-purple-300'>
                                {resume?.suggestedRole}
                            </span>

                        </div>

                    </div>

                </motion.div>


                {/* =====================================================
                    STRENGTHS & WEAKNESSES
                ===================================================== */}

                <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>


                    <motion.div
                        initial={{
                            y: 20,
                            opacity: 0
                        }}
                        animate={{
                            y: 0,
                            opacity: 1
                        }}
                        transition={{
                            duration: 0.5,
                            delay: 0.07
                        }}
                        className='relative overflow-hidden bg-[#000000]/90 backdrop-blur-2xl
                        border border-white/10 rounded-2xl p-4 sm:flex-row
                        shadow-[0_8px_32px_rgba(0,0,0,0.2)]'
                    >

                        <div className='absolute inset-0 bg-gradient-to-br from-white/[0.08]
                        via-transparent to-transparent pointer-events-none' />


                        <div className='relative flex items-center gap-1.5 mb-2.5'>

                            <FiAlertCircle
                                className='text-green-400'
                                size={14}
                            />

                            <span className='text-xs font-semibold text-white'>
                                Strengths
                            </span>

                        </div>


                        <div className='relative flex flex-wrap gap-1.5'>

                            {resume?.strengths?.map(
                                (s, index) => (

                                    <Tag
                                        key={`${s}-${index}`}
                                        text={s}
                                        color="green"
                                    />

                                )
                            )}

                        </div>

                    </motion.div>


                    <motion.div
                        initial={{
                            y: 20,
                            opacity: 0
                        }}
                        animate={{
                            y: 0,
                            opacity: 1
                        }}
                        transition={{
                            duration: 0.5,
                            delay: 0.07
                        }}
                        className='relative overflow-hidden bg-[#000000]/90 backdrop-blur-2xl
                        border border-white/10 rounded-2xl p-4 sm:flex-row
                        shadow-[0_8px_32px_rgba(0,0,0,0.2)]'
                    >

                        <div className='absolute inset-0 bg-gradient-to-br from-white/[0.08]
                        via-transparent to-transparent pointer-events-none' />


                        <div className='relative flex items-center gap-1.5 mb-2.5'>

                            <FiAlertCircle
                                className='text-yellow-400'
                                size={14}
                            />

                            <span className='text-xs font-semibold text-white'>
                                Weakness
                            </span>

                        </div>


                        <div className='relative flex flex-wrap gap-1.5'>

                            {resume?.weaknesses?.map(
                                (s, index) => (

                                    <Tag
                                        key={`${s}-${index}`}
                                        text={s}
                                        color="yellow"
                                    />

                                )
                            )}

                        </div>

                    </motion.div>

                </div>


                {/* =====================================================
                    MISSING SKILLS
                ===================================================== */}

                <motion.div
                    initial={{
                        y: 20,
                        opacity: 0
                    }}
                    animate={{
                        y: 0,
                        opacity: 1
                    }}
                    transition={{
                        duration: 0.5,
                        delay: 0.09
                    }}
                    className='relative overflow-hidden bg-[#000000]/90 backdrop-blur-2xl
                    border border-white/10 rounded-2xl p-4 sm:flex-row
                    shadow-[0_8px_32px_rgba(0,0,0,0.2)]'
                >

                    <div className='absolute inset-0 bg-gradient-to-br from-white/[0.08]
                    via-transparent to-transparent pointer-events-none' />


                    <div className='relative flex items-center gap-1.5 mb-2.5'>

                        <FiZap
                            className='text-red-400'
                            size={14}
                        />

                        <span className='text-xs font-semibold text-white'>
                            Missing Skills
                        </span>

                    </div>


                    <div className='relative flex flex-wrap gap-1.5'>

                        {resume?.missingSkills?.map(
                            (s, index) => (

                                <Tag
                                    key={`${s}-${index}`}
                                    text={s}
                                    color="red"
                                />

                            )
                        )}

                    </div>

                </motion.div>


                {/* =====================================================
                    RECOMMENDATIONS
                ===================================================== */}

                <motion.div
                    initial={{
                        y: 20,
                        opacity: 0
                    }}
                    animate={{
                        y: 0,
                        opacity: 1
                    }}
                    transition={{
                        duration: 0.5,
                        delay: 0.12
                    }}
                    className='relative overflow-hidden bg-[#000000]/90 backdrop-blur-2xl
                    border border-white/10 rounded-2xl p-4 sm:flex-row
                    shadow-[0_8px_32px_rgba(0,0,0,0.2)]'
                >

                    <div className='absolute inset-0 bg-gradient-to-br from-white/[0.08]
                    via-transparent to-transparent pointer-events-none' />


                    <div className='relative flex items-center gap-1.5 mb-2.5'>

                        <FiTrendingUp
                            className='text-purple-400'
                            size={14}
                        />

                        <span className='text-xs font-semibold text-white'>
                            Recommendation
                        </span>

                    </div>


                    <div className='relative flex flex-wrap gap-1.5'>

                        {resume?.recommendations?.map(
                            (s, index) => (

                                <Tag
                                    key={`${s}-${index}`}
                                    text={s}
                                    color="purple"
                                />

                            )
                        )}

                    </div>

                </motion.div>


            </section>

        </div>
    )


    // =========================================================
    // UPLOAD SECTION
    // =========================================================

    return (

        <div className='min-h-screen bg-white text-[#0a0a0a]'>

            <Navbar label="Resume Scorer" />


            <section className='flex min-h-screen items-center justify-center px-3 pt-18 pb-6'>

                <motion.div
                    initial={{
                        y: 60,
                        opacity: 0
                    }}
                    animate={{
                        y: 0,
                        opacity: 1
                    }}
                    transition={{
                        duration: 0.5,
                        delay: 0.05
                    }}
                    className='relative w-full max-w-sm rounded-3xl overflow-hidden bg-[#000000]/90
                    backdrop-blur-2xl border border-white/10 p-4
                    shadow-[0_8px_32px_rgba(0,0,0,0.25)] sm:p-6'
                >

                    <div className='absolute inset-0 bg-gradient-to-br from-white/[0.08]
                    via-transparent to-transparent pointer-events-none' />


                    <p className='relative text-[10px] text-white/40 tracking-widest uppercase mb-1.5'>
                        Step 1 to 2
                    </p>


                    <div className='relative w-full h-1 bg-white/10 rounded-full mb-4'>

                        <div className='h-1 bg-white rounded-full w-1/2' />

                    </div>


                    <h2 className='relative text-lg font-bold mb-1 text-white'>
                        Upload Your Resume
                    </h2>


                    <p className='relative text-white/45 text-xs mb-4'>
                        We'll score and give you actionable feedback
                    </p>


                    {/* =================================================
                        FILE DROP / SELECT AREA
                    ================================================= */}

                    <label
                        onDragOver={handleDragOver}
                        onDragEnter={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`relative flex flex-col items-center justify-center
                        w-full h-40 sm:h-48 rounded-2xl border-2 border-dashed
                        cursor-pointer transition-all duration-200
                        ${isDragging
                                ? "border-purple-400 bg-purple-400/[0.10] scale-[1.01]"
                                : filePreparing
                                    ? "border-white/40 bg-white/[0.06]"
                                    : fileReady
                                        ? "border-green-400/50 bg-green-400/[0.05]"
                                        : "border-white/15 bg-white/[0.03] hover:border-white/30"
                            }`}
                    >


                        {/* =============================================
                            PREPARING FILE
                        ============================================= */}

                        {filePreparing ? (

                            <>

                                <FiLoader
                                    className='text-4xl sm:text-5xl mb-2.5 text-white animate-spin'
                                />


                                <p className='text-xs font-medium text-white/90'>
                                    Preparing your resume...
                                </p>


                                <p className='text-[10px] text-white/35 mt-1'>
                                    Checking selected PDF
                                </p>

                            </>

                        ) : isDragging ? (

                            /* =========================================
                               DRAGGING
                            ========================================= */

                            <>

                                <FiUploadCloud
                                    className='text-4xl sm:text-5xl mb-2.5 text-purple-300'
                                />


                                <p className='text-xs font-medium text-white/90'>
                                    Drop your resume here
                                </p>


                                <p className='text-[10px] text-purple-300/60 mt-1'>
                                    Release to select PDF
                                </p>

                            </>

                        ) : fileReady ? (

                            /* =========================================
                               FILE READY
                            ========================================= */

                            <>

                                <FiCheckCircle
                                    className='text-4xl sm:text-5xl mb-2.5 text-green-400'
                                />


                                <p className='text-xs font-medium text-white/90 max-w-[85%] truncate'>
                                    {file?.name}
                                </p>


                                <p className='text-[10px] text-green-400/70 mt-1'>
                                    Resume ready ✓
                                </p>

                            </>

                        ) : (

                            /* =========================================
                               DEFAULT
                            ========================================= */

                            <>

                                <FiUploadCloud
                                    className='text-4xl sm:text-5xl mb-2.5 text-white/30'
                                />


                                <p className='text-xs font-medium text-white/80'>
                                    Click or drag PDF here
                                </p>


                                <p className='text-[10px] text-white/35 mt-1'>
                                    PDF only - max 20MB
                                </p>

                            </>

                        )}


                        <input
                            type='file'
                            accept='.pdf,application/pdf'
                            className='hidden'
                            disabled={
                                loading ||
                                filePreparing
                            }
                            onChange={handleFileChange}
                        />

                    </label>


                    {/* =================================================
                        FILE PREPARING STATUS
                    ================================================= */}

                    {filePreparing && (

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 6
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            className='relative mt-3 rounded-xl border
                            border-white/10 bg-white/[0.04] p-3'
                        >

                            <div className='flex items-center gap-2'>

                                <FiLoader
                                    className='text-white animate-spin'
                                    size={13}
                                />

                                <span className='text-[10px] text-white/55'>
                                    Preparing selected PDF...
                                </span>

                            </div>


                            <div className='mt-2 h-1 w-full rounded-full bg-white/10 overflow-hidden'>

                                <motion.div
                                    className='h-full w-1/3 rounded-full bg-white'
                                    animate={{
                                        x: [
                                            "-120%",
                                            "350%"
                                        ]
                                    }}
                                    transition={{
                                        duration: 1.2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />

                            </div>

                        </motion.div>

                    )}


                    {/* =================================================
                        UPLOAD PROGRESS
                    ================================================= */}

                    {loading && (

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 8
                            }}
                            animate={{
                                opacity: 1,
                                y: 0
                            }}
                            className='relative mt-4 rounded-2xl border
                            border-white/10 bg-white/[0.05] p-3.5'
                        >

                            <div className='flex items-center justify-between mb-2'>

                                <div className='flex items-center gap-2'>

                                    {uploadComplete ? (

                                        <FiCheckCircle
                                            className='text-green-400'
                                            size={14}
                                        />

                                    ) : (

                                        <FiLoader
                                            className='text-white animate-spin'
                                            size={14}
                                        />

                                    )}


                                    <span className='text-[11px] font-medium text-white/80'>

                                        {
                                            uploadComplete
                                                ? "Upload complete"
                                                : "Uploading resume..."
                                        }

                                    </span>

                                </div>


                                <span className='text-[11px] font-semibold text-white'>
                                    {uploadProgress}%
                                </span>

                            </div>


                            <div className='w-full h-2 rounded-full bg-white/10 overflow-hidden'>

                                <motion.div
                                    className='h-full rounded-full bg-white'
                                    initial={{
                                        width: "0%"
                                    }}
                                    animate={{
                                        width: `${uploadProgress}%`
                                    }}
                                    transition={{
                                        duration: 0.25,
                                        ease: "easeOut"
                                    }}
                                />

                            </div>


                            <div className='mt-2 flex items-center justify-between'>

                                <span className='text-[9px] text-white/35'>

                                    {
                                        uploadComplete
                                            ? "Your resume is uploaded successfully"
                                            : "Please don't close this page"
                                    }

                                </span>


                                {uploadComplete && (

                                    <span className='text-[9px] text-purple-300'>
                                        Analyzing...
                                    </span>

                                )}

                            </div>


                            {uploadComplete && (

                                <div className='mt-3 overflow-hidden rounded-full h-[2px] bg-white/10'>

                                    <motion.div
                                        className='h-full w-1/3 bg-purple-400 rounded-full'
                                        animate={{
                                            x: [
                                                "-100%",
                                                "300%"
                                            ]
                                        }}
                                        transition={{
                                            duration: 1.2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }}
                                    />

                                </div>

                            )}

                        </motion.div>

                    )}


                    {/* =================================================
                        ANALYZE BUTTON
                    ================================================= */}

                    <motion.button
                        onClick={uploadResume}
                        whileHover={
                            !loading &&
                                !filePreparing
                                ? { scale: 1.03 }
                                : {}
                        }
                        whileTap={
                            !loading &&
                                !filePreparing
                                ? { scale: 0.97 }
                                : {}
                        }
                        disabled={
                            !file ||
                            !fileReady ||
                            filePreparing ||
                            loading
                        }
                        className='relative mt-4 w-full h-10 rounded-xl font-semibold
                        text-xs bg-white text-[#0a0a0a]
                        shadow-[0_4px_14px_rgba(255,255,255,0.15)]
                        hover:bg-white/90 disabled:cursor-not-allowed
                        disabled:opacity-60 transition-all'
                    >

                        {

                            filePreparing

                                ? "Preparing Resume..."

                                : loading

                                    ? uploadComplete
                                        ? "Analyzing Resume..."
                                        : `Uploading ${uploadProgress}%`

                                    : fileReady
                                        ? "Analyze Resume"
                                        : "Select Resume"

                        }

                    </motion.button>


                </motion.div>

            </section>


            {/* =========================================================
                FULL SCREEN UPLOAD/ANALYSIS OVERLAY
            ========================================================= */}

            {loading && (

                <motion.div
                    initial={{
                        opacity: 0
                    }}
                    animate={{
                        opacity: 1
                    }}
                    className='fixed inset-0 z-50 flex items-center justify-center
                    bg-black/45 backdrop-blur-sm'
                >

                    <motion.div
                        initial={{
                            scale: 0.95,
                            opacity: 0
                        }}
                        animate={{
                            scale: 1,
                            opacity: 1
                        }}
                        className='w-[calc(100%-32px)] max-w-sm rounded-3xl
                        border border-white/10 bg-[#090909]/95
                        shadow-[0_20px_70px_rgba(0,0,0,0.45)]
                        p-5'
                    >

                        <div className='flex items-center gap-3 mb-5'>

                            <div className='h-10 w-10 rounded-xl bg-white/[0.08]
                            border border-white/10 flex items-center justify-center'>

                                {uploadComplete ? (

                                    <FiCheckCircle
                                        className='text-green-400'
                                        size={19}
                                    />

                                ) : (

                                    <FiUploadCloud
                                        className='text-white'
                                        size={19}
                                    />

                                )}

                            </div>


                            <div>

                                <p className='text-sm font-semibold text-white'>

                                    {
                                        uploadComplete
                                            ? "Resume uploaded"
                                            : "Uploading resume"
                                    }

                                </p>


                                <p className='text-[10px] text-white/40'>

                                    {
                                        uploadComplete
                                            ? "AI is analyzing your resume..."
                                            : "Please wait while your resume is being uploaded"
                                    }

                                </p>

                            </div>

                        </div>


                        <div className='flex items-end justify-between mb-2'>

                            <span className='text-[10px] uppercase tracking-widest text-white/35'>

                                {
                                    uploadComplete
                                        ? "Processing"
                                        : "Upload progress"
                                }

                            </span>


                            <span className='text-2xl font-bold text-white'>
                                {uploadProgress}%
                            </span>

                        </div>


                        <div className='relative w-full h-2.5 rounded-full bg-white/10 overflow-hidden'>

                            <motion.div
                                className={`h-full rounded-full ${uploadComplete
                                    ? "bg-purple-400"
                                    : "bg-white"
                                    }`}
                                initial={{
                                    width: "0%"
                                }}
                                animate={{
                                    width: `${uploadProgress}%`
                                }}
                                transition={{
                                    duration: 0.3,
                                    ease: "easeOut"
                                }}
                            />

                        </div>


                        {uploadComplete && (

                            <div className='relative mt-3 h-1 overflow-hidden rounded-full bg-white/10'>

                                <motion.div
                                    className='absolute h-full w-1/4 rounded-full bg-purple-400'
                                    animate={{
                                        x: [
                                            "-150%",
                                            "500%"
                                        ]
                                    }}
                                    transition={{
                                        duration: 1.3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />

                            </div>

                        )}


                        <div className='mt-4 flex items-center justify-between'>

                            <div className='flex items-center gap-1.5'>

                                <FiLoader
                                    className={`animate-spin ${uploadComplete
                                        ? "text-purple-400"
                                        : "text-white/40"
                                        }`}
                                    size={11}
                                />

                                <span className='text-[10px] text-white/45'>

                                    {
                                        uploadComplete
                                            ? "Analyzing resume..."
                                            : "Uploading..."
                                    }

                                </span>

                            </div>


                            <span className='text-[9px] text-white/25'>
                                Please don't refresh
                            </span>

                        </div>

                    </motion.div>

                </motion.div>

            )}

        </div>
    )
}


export default Scorer