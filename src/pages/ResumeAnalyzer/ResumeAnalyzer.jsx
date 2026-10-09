import { useState } from "react"

import {
    FiCheckCircle,
    FiFileText,
    FiInfo
} from "react-icons/fi"
import {
    useCoins as deductCoins,
    refundCoins
} from "../../apis/user.api"

import { motion } from "motion/react"
import ResumeUpload from "../../components/resumeAnalyzer/ResumeUpload"
import ResumeChat from "../../components/resumeAnalyzer/ResumeChat"
import ResumeAnalysisCard from "../../components/resumeAnalyzer/ResumeAnalysisCard"

import {
    uploadResume,
    analyzeResume,
    deleteResumeSession
} from "../../apis/resumeAnalyzer.api"
import { useNavigate } from "react-router-dom"


const ResumeAnalyzer = ({
    
    setuser
}) => {

    const navigate = useNavigate();

    const [
        sidebarOpen
        
    ] = useState(true)

    const [
        selectedFile,
        setSelectedFile
    ] = useState(null)

    const [
        resumeId,
        setResumeId
    ] = useState(null)

    const [
        messages,
        setMessages
    ] = useState([])

    const [
        loading,
        setLoading
    ] = useState(false)

    const [
        uploading,
        setUploading
    ] = useState(false)

    const [
        error,
        setError
    ] = useState("")

    const [
        analysis,
        setAnalysis
    ] = useState({
        strengths: [],
        weaknesses: [],
        recommendations: []
    })


    // ==================================================
    // FILE SELECT
    // ==================================================

    let coinDeducted = false

    const handleFileSelect = async (
        file
    ) => {

        if (!file) {

            if (resumeId) {
                await deleteResumeSession(
                    resumeId
                )
            }

            setSelectedFile(null)
            setResumeId(null)

            setMessages([])

            setAnalysis({
                strengths: [],
                weaknesses: [],
                recommendations: []
            })

            setError("")

            return
        }


        setError("")
        setSelectedFile(file)
        setUploading(true)

        setMessages([])

        setAnalysis({
            strengths: [],
            weaknesses: [],
            recommendations: []
        })


        try {

            // Delete previous session

            if (resumeId) {
                await deleteResumeSession(
                    resumeId
                )
            }

            const coinResponse = await deductCoins({
                coins: 1,
                action: "resume-Analyzer"
            })




            if (!coinResponse) {

                throw new Error(
                    "Unable to deduct credits. Please try again."
                )

            }


            console.log(
                "Resume Analyzer coin response:",
                coinResponse
            )

            coinDeducted = true

            // Update user coins in frontend

            setuser((prev) => ({
                ...prev,
                interviewCoins:
                    coinResponse?.interviewCoins
            }))


            const result = await uploadResume(file)

            console.log("========== UPLOAD RESULT ==========")
            console.log(result)
            console.log("resumeId from response:", result?.resumeId)
            console.log("===================================")

            if (!result?.success) {
                throw new Error(result?.message || "Resume upload failed.")
            }

            const newResumeId = result?.resumeId

            if (!newResumeId) {
                throw new Error("Resume uploaded but resume ID was not returned.")
            }

            setResumeId(newResumeId)

            if (!newResumeId) {
                throw new Error(
                    "Resume uploaded but resume ID was not returned."
                )
            }

            console.log("NEW RESUME ID:", newResumeId)
            setResumeId(newResumeId)
            console.log(resumeId)



        } catch (error) {

            console.error(
                error
            )

            // =========================================
            // REFUND COIN
            // =========================================

            if (coinDeducted) {

                try {

                    const refundResponse =
                        await refundCoins({
                            coins: 1,
                            action: "resume-Analyzer-refund"
                        })


                    if (refundResponse?.success) {

                        setuser((prev) => ({
                            ...prev,
                            interviewCoins:
                                refundResponse.interviewCoins
                        }))

                        console.log(
                            "Resume Analyzer coin refunded"
                        )

                    }

                } catch (refundError) {

                    console.error(
                        "Coin refund failed:",
                        refundError
                    )

                }
            }


            setSelectedFile(null)
            setResumeId(null)

            setError(
                error?.message ||
                "Unable to process resume."
            )

        } finally {

            setUploading(false)

        }
    }


    // ==================================================
    // SEND MESSAGE
    // ==================================================

    const handleSendMessage = async (
        question
    ) => {

        if (
            !question.trim() ||
            loading
        ) {
            return
        }


        if (!resumeId) {

            setError(
                "Please upload your resume first."
            )

            return
        }


        setError("")


        const userMessage = {
            role: "user",
            content: question.trim()
        }


        const updatedMessages = [
            ...messages,
            userMessage
        ]


        setMessages(
            updatedMessages
        )

        setLoading(true)


        try {

            const result =
                await analyzeResume({
                    resumeId,
                    input: question,
                    history: messages
                })


            if (!result?.success) {
                throw new Error(
                    result?.message ||
                    "Unable to analyze resume."
                )
            }


            const assistantMessage = {
                role: "assistant",
                content:
                    result.ai ||
                    "I could not generate a response."
            }


            setMessages(prev => [
                ...prev,
                assistantMessage
            ])


            // Structured AI analysis

            if (result.analysis) {

                setAnalysis({
                    strengths:
                        result.analysis.strengths ||
                        [],

                    weaknesses:
                        result.analysis.weaknesses ||
                        [],

                    recommendations:
                        result.analysis.recommendations ||
                        []
                })

            }

        } catch (error) {

            console.error(
                error
            )

            setError(
                error?.message ||
                "Something went wrong while analyzing your resume."
            )

            // Remove user message if request failed

            setMessages(
                messages
            )

        } finally {

            setLoading(false)

        }
    }


    return (
        <div className="min-h-screen bg-white text-black">
            <motion.nav
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className='sticky inset-x-0 top-0 z-20 border-b border-black/8 bg-white/80 backdrop-blur-xl'>
                <div className='mx-auto flex h-12 max-w-7xl items-center justify-between px-3 sm:px-5'>
                    <div onClick={() => navigate("/dashboard")} className='flex cursor-pointer items-center gap-1.5'>
                        <span className='text-sm font-extrabold sm:text-base text-[#0a0a0a]'>RisbenAI</span>
                        <span className='hidden rounded bg-black/5 px-1.5 py-0.5 text-[10px] text-black/50 sm:block'>Resume Intelligence</span>
                    </div>

                </div>

            </motion.nav>



            <main
                className={`
                    min-h-screen
                    transition-all duration-300
                    ${sidebarOpen
                        ? "md:ml-[260px]"
                        : "md:ml-[72px]"
                    }
                `}
            >

                <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">

                    {/* HEADER */}

                    <div className="mb-7">

                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
                            AI Resume Tools
                        </p>

                        <h1 className="mt-2 text-3xl font-bold tracking-tight text-black">
                            Resume Analyzer
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                            Upload your resume, understand
                            its strengths, identify mistakes
                            and chat with AI about possible
                            improvements.
                        </p>

                    </div>


                    {/* ERROR */}

                    {error && (
                        <div className="mb-5 flex items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">

                            <FiInfo className="mt-0.5 shrink-0 text-black" />

                            <div>

                                <p className="text-sm font-semibold text-black">
                                    Something went wrong
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    {error}
                                </p>

                            </div>

                        </div>
                    )}


                    {/* MAIN */}

                    <div className="grid min-h-0 gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">

                        {/* LEFT */}

                        <div className="space-y-5">

                            {/* UPLOAD */}

                            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                                <div className="mb-5">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">

                                            <FiFileText
                                                size={18}
                                            />

                                        </div>

                                        <div>

                                            <h2 className="text-sm font-bold text-black">
                                                Your Resume
                                            </h2>

                                            <p className="mt-0.5 text-xs text-gray-500">
                                                Upload a file to get started
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                <ResumeUpload
                                    selectedFile={
                                        selectedFile
                                    }
                                    onFileSelect={
                                        handleFileSelect
                                    }
                                    uploading={
                                        uploading
                                    }
                                />


                                {selectedFile &&
                                    resumeId &&
                                    !uploading && (
                                        <div className="mt-4 flex items-center gap-2 rounded-xl bg-gray-50 p-3">

                                            <FiCheckCircle className="shrink-0 text-black" />

                                            <p className="text-xs leading-5 text-gray-600">
                                                Resume processed successfully.
                                                You can now ask the AI questions.
                                            </p>

                                        </div>
                                    )}

                            </section>


                            {/* QUESTIONS */}

                            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                                <h3 className="text-sm font-bold text-black">
                                    What can you ask?
                                </h3>

                                <div className="mt-4 space-y-3">

                                    {[
                                        "Find mistakes in my resume",
                                        "Review my resume structure",
                                        "What should I improve?",
                                        "Make my project descriptions clearer",
                                        "Which sections are weak?",
                                        "Help me make my resume more professional"
                                    ].map(item => (

                                        <div
                                            key={item}
                                            className="flex items-center gap-3 text-sm text-gray-600"
                                        >

                                            <span className="h-1.5 w-1.5 rounded-full bg-black" />

                                            {item}

                                        </div>

                                    ))}

                                </div>

                            </section>

                        </div>


                        {/* CHAT */}

                        <div className="min-h-0 min-w-0">

                            <ResumeChat
                                messages={messages}
                                onSend={handleSendMessage}
                                loading={loading}
                                resumeReady={Boolean(resumeId)}
                            />

                        </div>

                    </div>


                    {/* ANALYSIS */}

                    {(messages.length > 0 ||
                        analysis.strengths.length > 0 ||
                        analysis.weaknesses.length > 0 ||
                        analysis.recommendations.length > 0) && (

                            <div className="mt-5 grid gap-5 lg:grid-cols-3">

                                <ResumeAnalysisCard
                                    title="Strengths"
                                    description="Positive points identified from your resume."
                                    type="success"
                                    items={
                                        analysis.strengths
                                    }
                                />

                                <ResumeAnalysisCard
                                    title="Weaknesses"
                                    description="Areas that may need attention."
                                    type="warning"
                                    items={
                                        analysis.weaknesses
                                    }
                                />

                                <ResumeAnalysisCard
                                    title="Recommendations"
                                    description="Practical improvements based on the AI analysis."
                                    type="improvement"
                                    items={
                                        analysis.recommendations
                                    }
                                />

                            </div>

                        )}

                </div>

            </main>

        </div>
    )
}

export default ResumeAnalyzer