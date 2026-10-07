import React from 'react'
import { motion } from "motion/react"
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { GiTwoCoins } from 'react-icons/gi';
import PricingCard from '../components/PricingCard';
import api from '../utils/axios';

const plan = [
    {
        title: "Free",
        price: "Free",
        coins: 150,
        button: "Claimed Coins",
        popular: false,
        disabled: true,
        features: [
            "150 Interview Coins",
            "Resume Builder",
            "Resume Scorer",
            "Roadmap Generator",
        ],
    },
    {
        title: "Starter",
        price: "199",
        coins: 300,
        button: "Buy Now",
        popular: true,
        disabled: false,
        features: [
            "300 Interview Coins",
            "Priority AI Response",
            "Unlimited Resume Scorer",
            "Unlimited Roadmap",
        ],
    }
]

const Billing = ({ user, setuser }) => {
    const navigate = useNavigate();
    const [showMenu, setshowMenu] = useState(false)

    const handlePayment = async (plan) => {
        if (plan.disabled) return;

        try {
            const result = await api.post("/api/billing/create", 
                { planId: plan.title.toLowerCase() })
            const options = {
                key:import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount:result.data.order.amount,
                currency:result.data.order.currency,
                name:"FresherAI",
                description:`${plan.title} - ${plan.coins} Interview Coins`,
                order_id:result.data.order.id,

                handler:async function(response){
                    try {
                        await api.post("/api/billing/verify",response)

                        const coinRes = await api.post("/api/auth/add-coins",{coins:plan.coins})

                        setuser((prev)=>({
                            ...prev, interviewCoins:coinRes.data.interviewCoins
                        }))

                        alert("Payment successfull")
                        navigate("/dashboard")
                    } catch (error) {
                        console.log(error)

                        alert(
                            error?.response?.data?.message ||
                            "Payment verification failed"
                        )
                    }
                },
                theme:{
                    color:"#000000"
                }
            }
                const razorpay = new window.Razorpay(options)
                razorpay.open()


        } catch (error) {
            console.log(error)

        }
    }
    return (
        <div className='min-h-screen bg-white text-[#0a0a0a]'>

            <motion.nav
                initial={{ y: -60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className='sticky inset-x-0 top-0 z-20 border-b border-black/8 bg-white/80 backdrop-blur-xl'>
                <div className='mx-auto flex h-12 max-w-7xl items-center justify-between px-3 sm:px-5'>
                    <div onClick={() => navigate("/dashboard")} className='flex cursor-pointer items-center gap-1.5'>
                        <span className='text-sm font-extrabold sm:text-base text-[#0a0a0a]'>FresherAI</span>
                        <span className='hidden rounded bg-black/5 px-1.5 py-0.5 text-[10px] text-black/50 sm:block'>Interview Coins</span>
                    </div>
                    <button onClick={() => setshowMenu(!showMenu)} className='flex w-8 h-8 items-center justify-center rounded-lg border
                        border-black/15 text-black/60 transition hover:border-black/35 hover:text-[#0a0a0a]'>
                        {showMenu ? <FiX size={16} /> : <FiMenu size={16} />}

                    </button>

                    {showMenu && (
                        <>
                            <div onClick={() => setshowMenu(false)} className='fixed inset-0 z-30 bg-black/20 lg:hidden' />

                            <div className='absolute right-1 top-11 z-40 w-[240px] max-w-[calc(100vw-24px)] rounded-xl overflow-hidden
                                    bg-[#000000]/90 backdrop-blur-2xl border border-white/10 p-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.25)]'>
                                <div className='absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent pointer-events-none' />

                                <div className='relative flex items-center gap-2 border-b border-white/10 pb-3'>
                                    <div className='flex h-9 w-9 items-center justify-center
                                    rounded-lg bg-yellow-500/15 border border-yellow-400/20'>
                                        <GiTwoCoins className='text-yellow-400 text-sm' />
                                    </div>

                                    <div>
                                        <p className='text-[10px] text-white/40'>Available Coins</p>
                                        <h3 className='text-lg font-bold text-white'>{user?.interviewCoins}</h3>
                                    </div>
                                </div>

                                <div className='relative mt-3.5 space-y-1.5'>
                                    {[
                                        { title: "Resume Builder", coin: "-10" },
                                        { title: "Resume Scorer", coin: "-10" },
                                        { title: "Roadmap Generator", coin: "-20" },
                                        { title: "AI Interview", coin: "-50" },
                                    ].map((item) => (
                                        <div key={item.title} className='flex items-center
                                        justify-between rounded-lg bg-white/5 border border-white/8
                                        px-2.5 py-1.5'>
                                            <span className='text-xs text-white/70'>{item.title}</span>
                                            <span className='text-xs font-bold text-red-400'>{item.coin}</span>
                                        </div>
                                    ))}

                                </div>

                                <div className='relative mt-3.5 rounded-lg border border-violet-400/20 bg-voilet-500/10 p-2.5'>
                                    <p className='text-[10px] leading-4 text-violet-300'>
                                        Every AI feature uses Interview Coins.
                                        Buy more coins anytime to continue using
                                        Resume Builder, Resume Scorer,
                                        AI Interview and Roadmap Generator.
                                    </p>
                                </div>
                            </div>
                        </>
                    )}
                </div>

            </motion.nav>

            <div className='mx-auto max-w-4xl px-4 py-6'>
                <div className='text-center'>
                    <h1 className='text-3xl font-bold text-[#0a0a0a]'>
                        Interview Coins
                    </h1>
                    <p className='mt-2 text-sm text-black/45'>
                        Use Coins for Resume Scoring, Resume Builder, AI Interviews, and Roadmap Generation.
                    </p>
                </div>

                <div className='mt-8 grid place-items-center gap-3 md:grid-cols-2'>
                    {plan.map((plan) => (
                        <PricingCard key={plan.title} {...plan} onBuy={() => handlePayment(plan)} />
                    ))}

                </div>
            </div>
        </div>
    )
}

export default Billing