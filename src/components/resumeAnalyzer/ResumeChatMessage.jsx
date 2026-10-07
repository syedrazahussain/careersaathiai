import { useEffect, useMemo, useState } from "react"
import ReactMarkdown from "react-markdown"
import { FiCpu, FiUser } from "react-icons/fi"

const ResumeChatMessage = ({
    role,
    content
}) => {

    const isUser = role === "user"

    const [visibleWords, setVisibleWords] = useState(
        isUser ? content : ""
    )

    const [isTyping, setIsTyping] = useState(
        !isUser
    )


    /*
    |--------------------------------------------------------------------------
    | Split response into words while preserving whitespace
    |--------------------------------------------------------------------------
    */

    const words = useMemo(() => {

        if (!content) return []

        return content.match(/\S+\s*/g) || []

    }, [content])


    /*
    |--------------------------------------------------------------------------
    | AI typing animation
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        if (isUser) {

            setVisibleWords(content)

            setIsTyping(false)

            return

        }


        if (!content) {

            setVisibleWords("")

            setIsTyping(false)

            return

        }


        let currentIndex = 0

        let cancelled = false

        setVisibleWords("")
        setIsTyping(true)


        const typeNextWord = () => {

            if (cancelled) return


            if (currentIndex >= words.length) {

                setIsTyping(false)

                return

            }


            const nextWord = words[currentIndex]

            currentIndex += 1


            setVisibleWords(
                words
                    .slice(0, currentIndex)
                    .join("")
            )


            /*
            |--------------------------------------------------------------------------
            | Speed
            |
            | Smaller number = faster
            | Larger number = slower
            |--------------------------------------------------------------------------
            */

            const delay =
                nextWord.length > 18
                    ? 45
                    : 28


            setTimeout(
                typeNextWord,
                delay
            )

        }


        typeNextWord()


        return () => {

            cancelled = true

        }

    }, [content, isUser, words])


    return (

        <div
            className={`flex gap-3 ${
                isUser
                    ? "justify-end"
                    : "justify-start"
            }`}
        >

            {/* AI ICON */}

            {!isUser && (

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-black text-white">

                    <FiCpu size={16} />

                </div>

            )}


            {/* MESSAGE */}

            <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                    isUser
                        ? "bg-black text-white"
                        : "border border-gray-200 bg-white text-black"
                }`}
            >

                {isUser ? (

                    <p className="whitespace-pre-wrap text-sm leading-6">
                        {content}
                    </p>

                ) : (

                    <div className="prose prose-sm max-w-none text-black prose-headings:text-black prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-black">

                        <ReactMarkdown>

                            {visibleWords}

                        </ReactMarkdown>


                        {/* Typing cursor */}

                        {isTyping && (

                            <span className="ml-0.5 inline-block animate-pulse font-normal text-black">
                                ▌
                            </span>

                        )}

                    </div>

                )}

            </div>


            {/* USER ICON */}

            {isUser && (

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-black">

                    <FiUser size={16} />

                </div>

            )}

        </div>

    )
}

export default ResumeChatMessage