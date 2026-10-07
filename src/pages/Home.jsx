
import { motion } from "motion/react"
import { GiArtificialHive } from "react-icons/gi";
import { FaArrowRight } from "react-icons/fa";
import LoginModel from "../components/LoginModel";
import { useState } from "react";
import dashboard from "../assets/image.png"
import { FiBarChart2, FiFileText, FiMap, FiMic } from "react-icons/fi";
import { RiBrainLine } from "react-icons/ri";

const Home = ({ setuser }) => {
  const [showLogin, setshowLogin] = useState(false)

  return (
    <div className='bg-white text-[#0a0a0a]  font-sans min-h-screen overflow-x-hidden'>
      {/* navbar */}

      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 h-[52px] flex items-center
      justify-between px-5 bg-white/70 backdrop-blur-xl border-b border-black/5">

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#0a0a0a] flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.18)]">
            <GiArtificialHive size={15} color='white' /></div>
          <span className="font-extrabold text-base tracking-tight text-[#0a0a0a]">FresherAI</span>
        </div>

        <motion.button
          onClick={() => setshowLogin(true)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="bg-[#0a0a0a]/80 backdrop-blur-2xl text-white font-semibold border border-white/10 rounded-md px-3 py-1 text-xs cursor-pointer 
        transition-all hover:border-white/20 
        shadow-[0_8px_24px_rgba(0,0,0,0.25)] flex items-center gap-2">
          Log In <FaArrowRight />

        </motion.button>
      </motion.nav>

      <section className="relative pt-20 pb-14 overflow-hidden bg-[#f8f9fa]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full
         bg-black/[0.04] blur-[90px] pointer-events-none"/>

        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="inline-flex items-center px-3 py-1.5 rounded-full border
          border-black/15 bg-black/5 text-black/70 text-xs font-medium mb-4">
            Multi-Agent Interview Platform

          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="text-3xl md:text-5xl font-extrabold leading-[1.1] tracking-tight
          mb-4 text-[#0a0a0a] [text-shadow:0_4px_24px_rgba(0,0,0,0.12)]">
            Job Interviews<br />
            <span className="text-black/30">
              Don't Have To Suck
            </span><br />
            Anymore!


          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="text-black/45 text-sm leading-relaxed max-w-md
          mx-auto mb-6 [text-shadow:0_2px_10px_rgba(0,0,0,0.06)]">
            Fresher.AI is an innovative Ai-powered interview preparation Platform
            designed to help job seekers excel in their interviews.

          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.28 }}
          >
            <motion.button
              onClick={() => setshowLogin(true)}
              whileHover={{ scale: 1.05, boxShadow: "0 0 36px rgba(0,0,0,0.18)" }}
              whileTap={{ scale: 0.97 }}

              className="relative gap-2 overflow-hidden bg-[#0a0a0a]/80 backdrop-blur-2xl text-white font-bold px-5 py-2.5
            rounded-lg text-xs cursor-pointer border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all
            hover:border-white/20">
              <span className="flex items-center justify-center gap-2">

                Get Started For Free <FaArrowRight />
              </span>
              <span className="absolute inset-0 bg-gradient-to-br from-white/[0.1] via-transparent to-transparent 
              pointer-events-none rounded-lg"/>


            </motion.button>

          </motion.div>

        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -10, scale: 1.02 }}
          transition={{ duration: 0.7, delay: 0.3 }}

          className="mt-10 rounded-lg overflow-hidden 
        shadow-[0_0_69px_rgba(0,0,0,0.6)] max-w-2xl mx-auto">
          <img src={dashboard} alt="dashboard img" className="w-full h-auto object-cover block" />


        </motion.div>



      </section>

      {/* AGents */}

      <section className="py-16 bg-[#f8f9fa]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full border
            border-black/15 text-black/70 text-xs font-medium mb-4">
              Ai Powered Agents
            </div>


            <h2 className="text-2xl md:text-4xl font-extrabold tracking-tight text-[#0a0a0a]
            [text-shadow:0_4px_20px_rgba(0,0,0,0.1)]">
              Specialized Agents For
              <span className="block text-black/30">
                Every Interview Stage

              </span>

            </h2>


            <p className="text-black/40 text-sm max-w-2xl mx-auto mt-4 leading-relaxed">
              Fresher.Ai combines multiple AI agents that work together
              to help you build your resume,practise interviews,
              receive detailed feedback, and follow a personalized roadmap
              to land your dream job.

            </p>

          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {
              [
                {
                  icon: <FiFileText />,
                  title: "Resume Agent",
                  desc: "Create ATS-friendly resumes,improve profile strength and maximize interview opportunities",
                },
                {
                  icon: <FiMic />,
                  title: "Interview Agent",
                  desc: "Conduct realistic HR, Technical and coding interviews with AI-powered simulation",
                },
                {
                  icon: <FiBarChart2 />,
                  title: "Feedback Agent",
                  desc: "Get detailed answer analysis, scoring reports and improvement recommendations.",
                },
                {
                  icon: <FiMap />,
                  title: "Roadmap Agent",
                  desc: "Generate personalized learning roadmaps based on goals, skills and performance.",
                },
                {
                  icon: <RiBrainLine />,
                  title: "Resume Intelligence",
                  desc: "Analyze resumes with AI to identify strengths, weaknesses, mistakes and improvements.",
                },
              ].map((agent, i) => {
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.08 }}
                    whileHover={{ y: -10, scale: 1.02 }}

                    className="group relative overflow-hidden bg-[#0a0a0a]/80 backdrop-blur-2xl
              border border-white/10 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.25)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)] hover:border-white/20 transition-all">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent
                pointer-events-none"/>
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10
                  rounded-full blur-3xl opacity-0 group-hover:opacity-100
                  transition-opacity duration-500"/>


                    <div className="relative">
                      <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-md 
        border border-white/15 flex items-center justify-center 
        text-white text-lg mb-4 shadow-inner">
                        {agent.icon}
                      </div>

                      <h2 className="text-white font-bold text-lg">
                        {agent.title}
                      </h2>

                      <p className="text-white/50 text-sm mt-2 leading-relaxed">
                        {agent.desc}
                      </p>
                    </div>

                  </motion.div>
                );
              })
            }

          </div>
        </div>
      </section>



      {showLogin && <LoginModel onClose={() => setshowLogin(false)} setuser={setuser} />}

      <footer className="border-t border-black/7 py-6 text-center bg-white">
        <div className="flex items-center justify-center gap-3 mb-1.5">
          <div className="w-5 h-5 rounded-md bg-[#0a0a0a] flex items-center justify-center">
            <GiArtificialHive size={11} color='white' />

          </div>
          <span className="font-bold text-xs text-[#0a0a0a]/70">
            FresherAI
          </span>

        </div>

        <div className="text-black/60 text-xs">
          © {new Date().getFullYear()} Fresher.AI . All rights reserved

        </div>

      </footer>
    </div>
  )
}

export default Home