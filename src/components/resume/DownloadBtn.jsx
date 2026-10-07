import React from 'react'
import { FiDownload } from 'react-icons/fi'
import { useReactToPrint } from 'react-to-print'
import {
    useCoins,
    refundCoins
} from '../../apis/user.api'

const DownloadBtn = ({ docRef, user, setuser }) => {
    const handlePdf = useReactToPrint({
        contentRef: docRef,
        documentTitle: "FresherAIPDF"
    })

    const handleDownload = async () => {

        let coinDeducted = false

        try {

            // =========================================
            // DEDUCT COIN
            // =========================================

            const coinResponse = await useCoins({
                coins: 1,
                action: "Download-PDF"
            })


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


            // =========================================
            // GENERATE / PRINT PDF
            // =========================================

            await handlePdf()


            // =========================================
            // SUCCESS
            // =========================================

            setuser((prev) => ({
                ...prev,
                interviewCoins:
                    coinResponse?.interviewCoins
            }))


        } catch (error) {

            console.error(
                "PDF download error:",
                error
            )


            // =========================================
            // REFUND COIN
            // =========================================

            if (coinDeducted) {

                try {

                    console.log(
                        "PDF generation failed. Refunding coin..."
                    )


                    const refundResponse =
                        await refundCoins({
                            coins: 1,
                            action: "Download-PDF-refund"
                        })


                    if (refundResponse?.success) {

                        console.log(
                            "PDF download coin refunded:",
                            refundResponse
                        )


                        setuser((prev) => ({
                            ...prev,
                            interviewCoins:
                                refundResponse?.interviewCoins
                        }))


                    } else {

                        console.error(
                            "PDF refund failed:",
                            refundResponse
                        )
                    }


                } catch (refundError) {

                    console.error(
                        "PDF refund request failed:",
                        refundError
                    )
                }
            }


            // =========================================
            // ERROR MESSAGE
            // =========================================

            if (error.response?.status === 403) {

                alert("Not enough Interview coins.")

                return
            }


            alert(
                error.response?.data?.message ||
                "Something went wrong. Your coin has been refunded if the deduction was successful."
            )
        }
    }
    return (
        <button onClick={handleDownload} className='flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-xs text-white'>
            <FiDownload />
            Download PDF
        </button>


    )
}

export default DownloadBtn