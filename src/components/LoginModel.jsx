import React from 'react'
import { FiX } from "react-icons/fi"
import { FcGoogle } from "react-icons/fc";
import { motion } from "motion/react"
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import api from '../utils/axios';

const LoginModel = ({ onClose,setuser }) => {

    const handleGoogleAuth = async () => {
        try {
            const result = await signInWithPopup(auth, provider)
            const token = await result.user.getIdToken()

            const response = await api.post("/api/auth/login", { token })
            setuser(response?.data?.user)
            onClose()

        } catch (error) {
            console.log("Login error:", error);
            console.log("Response:", error.response?.data);
            console.log("Status:", error.response?.status);

        }
    }
    return (
        <div className='fixed inset-0 z-50 flex items-center
        justify-center bg-black/40 backdrop-blur-md px-4'>
            <div className='relative w-full max-w-sm bg-[#0a0a0a]/80 backdrop-blur-2xl 
            border border-white/10
            rounded-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.25)]'>
                <div className='absolute inset-0 bg-gradient-to-br from-white/[0.08] 
                via-transparent pointer-events-none' />
                <div className='relative p-7'>
                    <button onClick={onClose} className='absolute top-4 right-4 text-white/30 hover:text-white transition-colors'>
                        <FiX size={16} />
                    </button>
                    <h2 className='text-lg font-bold text-center mb-2 text-white'>
                        Sign In to {" "}
                        <span className='font-extrabold text-lg tracking-tight
                        text-white'>RisbenAI</span>
                    </h2>
                    <p className='text-white/45 text-center text-xs '>
                        Continue your AI Interview journey
                    </p>
                    <div className='mt-7'>
                        <motion.button onClick={handleGoogleAuth} className='w-full flex items-center justify-center gap-3 py-3
                        rounded-xl border border-white/15 bg-white/10 backdrop-blur-md hover:bg-white/[0.14] shadow-inner transition-all'
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}>
                            <FcGoogle size={18} />
                            <span className='text-white font-medium text-sm'>
                                Continue with Google
                            </span>


                        </motion.button>
                    </div>
                </div>

                <div className='relative border-t border-white/10 bg-black/30 p-4 text-center'>
                    <p className='text-white/30 text-xs'>
                        Secure authentication powered by Firebase</p>

                </div>


            </div>
        </div>
    )
}

export default LoginModel