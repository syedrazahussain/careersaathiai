import { useEffect, useRef, useState } from "react"
import { FiArrowUp, FiMessageCircle } from "react-icons/fi"
import ResumeChatMessage from "./ResumeChatMessage"

const quickQuestions = [
    "Review my resume and identify the biggest weaknesses.",
    "What mistakes should I fix in my resume?",
    "How can I improve my resume structure?",
    "Which parts of my resume need more clarity?"
]

const ResumeChat = ({
    messages,
    onSend,
    loading,
    resumeReady = false
}) => {

    const [input, setInput] = useState("")

    // Chat scroll container
    const messagesContainerRef = useRef(null)

    // Automatically scroll to latest message
    useEffect(() => {
        const container = messagesContainerRef.current

        if (!container) return

        container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth"
        })
    }, [messages, loading])

    const submitMessage = async (event) => {

        event.preventDefault()

        const message = input.trim()

        if (!message || loading) return

        setInput("")

        await onSend(message)
    }

    const askQuickQuestion = async (question) => {

        if (loading || !resumeReady) return

        setInput("")

        await onSend(question)
    }

    return (
        <div className="flex h-[650px] min-h-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

            {/* HEADER */}

            <div className="border-b border-gray-100 px-5 py-4">

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                        <FiMessageCircle size={18} />
                    </div>

                    <div>

                        <h2 className="text-sm font-bold text-black">
                            Resume AI Assistant
                        </h2>

                        <p className="mt-0.5 text-xs text-gray-500">
                            Ask anything about your resume
                        </p>

                    </div>

                </div>

            </div>


            {/* CHAT MESSAGES */}

            <div
                ref={messagesContainerRef}
                className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5"
            >

                {messages.length === 0 ? (

                    <div className="flex min-h-[450px] flex-col items-center justify-center text-center">

                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-black">
                            <FiMessageCircle size={24} />
                        </div>

                        <h3 className="text-lg font-bold text-black">
                            Start a conversation
                        </h3>

                        <p className="mt-2 max-w-md text-sm leading-6 text-gray-500">
                            Upload your resume and ask the AI about mistakes,
                            improvements, structure, clarity and more.
                        </p>

                        <div className="mt-6 grid w-full max-w-lg gap-2">

                            {quickQuestions.map((question) => (

                                <button
                                    key={question}
                                    type="button"
                                    onClick={() => askQuickQuestion(question)}
                                    className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-xs text-gray-600 shadow-sm transition hover:border-gray-400 hover:bg-gray-50 hover:text-black"
                                >
                                    {question}
                                </button>

                            ))}

                        </div>

                    </div>

                ) : (

                    <>

                        {messages.map((message, index) => (

                            <ResumeChatMessage
                                key={`${message.role}-${index}`}
                                role={message.role}
                                content={message.content}
                            />

                        ))}


                        {/* LOADING */}

                        {loading && (

                            <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-black text-white">

                                    <span className="h-2 w-2 animate-pulse rounded-full bg-white" />

                                </div>

                                <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500 shadow-sm">

                                    <div className="flex items-center gap-2">

                                        <span>
                                            Analyzing your resume
                                        </span>

                                        <span className="flex gap-1">

                                            <span className="h-1 w-1 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />

                                            <span className="h-1 w-1 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />

                                            <span className="h-1 w-1 animate-bounce rounded-full bg-gray-400" />

                                        </span>

                                    </div>

                                </div>

                            </div>

                        )}

                    </>

                )}

            </div>


            {/* INPUT */}

            <div className="border-t border-gray-100 p-4">

                <form
                    onSubmit={submitMessage}
                    className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-2 focus-within:border-black"
                >

                    <textarea
                        value={input}
                        disabled={!resumeReady || loading}
                        onChange={(event) => setInput(event.target.value)}
                        onKeyDown={(event) => {

                            if (
                                event.key === "Enter" &&
                                !event.shiftKey
                            ) {

                                event.preventDefault()

                                submitMessage(event)

                            }

                        }}
                        rows={1}
                        placeholder="Ask something about your resume..."
                        className="max-h-32 min-h-[42px] flex-1 resize-none bg-transparent px-3 py-2 text-sm text-black outline-none placeholder:text-gray-400"
                    />


                    <button
                        type="submit"
                        disabled={
                            !resumeReady ||
                            !input.trim() ||
                            loading
                        }
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <FiArrowUp size={18} />
                    </button>

                </form>


                <p className="mt-2 text-center text-[11px] text-gray-400">
                    AI suggestions are based on the resume information available to the system.
                </p>

            </div>

        </div>
    )
}

export default ResumeChat