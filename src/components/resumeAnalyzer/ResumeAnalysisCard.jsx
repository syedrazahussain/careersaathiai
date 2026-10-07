import {
    FiAlertCircle,
    FiCheckCircle,
    FiInfo,
    FiTrendingUp
} from "react-icons/fi"

const ResumeAnalysisCard = ({
    title,
    description,
    items = [],
    type = "default"
}) => {

    const getIcon = () => {

        if (type === "success") {
            return <FiCheckCircle size={18} />
        }

        if (type === "warning") {
            return <FiAlertCircle size={18} />
        }

        if (type === "improvement") {
            return <FiTrendingUp size={18} />
        }

        return <FiInfo size={18} />
    }


    return (

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

            {/* HEADER */}

            <div className="flex items-start gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white">

                    {getIcon()}

                </div>


                <div className="min-w-0">

                    <h3 className="text-sm font-bold text-black">
                        {title}
                    </h3>

                    {description && (

                        <p className="mt-1 text-xs leading-5 text-gray-500">
                            {description}
                        </p>

                    )}

                </div>

            </div>


            {/* ITEMS */}

            {items.length > 0 && (

                <div className="mt-5 space-y-3">

                    {items.map((item, index) => (

                        <div
                            key={index}
                            className="animate-[fadeInUp_0.4s_ease-out_both] rounded-xl border border-gray-100 bg-gray-50 p-3"
                            style={{
                                animationDelay: `${index * 120}ms`
                            }}
                        >

                            <div className="flex items-start gap-3">

                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-black" />

                                <p className="text-sm leading-6 text-gray-700">
                                    {item}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </section>

    )
}

export default ResumeAnalysisCard