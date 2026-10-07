import React, { useEffect, useRef, useState } from 'react'
import maleVideo from "../../assets/male-ai.mp4"
import femaleVideo from "../../assets/female-ai.mp4"
import { AnimatePresence, motion } from "motion/react"
import { FiArrowRight, FiCamera, FiCameraOff, FiClock, FiCode, FiCodepen, FiMessageSquare, FiMic, FiMicOff } from 'react-icons/fi'
import CodeEditor from './CodeEditor'
import Timer from './Timer'
import { submitAnswer } from '../../apis/interview.api'
import { useNavigate } from 'react-router-dom'

const Step2setup = ({ interviewData, user }) => {

  const navigate = useNavigate();

  const [question, setquestion] = useState(interviewData.question)
  const [currentIndex, setcurrentIndex] = useState(interviewData.currentQuestion || 0);
  const [answer, setanswer] = useState("");
  const [feedback, setfeedback] = useState(null)
  const [loading, setloading] = useState(false)
  const [timeleft, settimeleft] = useState(interviewData.question.timer || 60);
  const [timeractive, settimeractive] = useState(true);
  const [micon, setmicon] = useState(true);
  const [cameraon, setcameraon] = useState(false)
  const [codeopen, setcodeopen] = useState(false)
  const [isaiplaying, setisaiplaying] = useState(false);
  const [subtitle, setsubtitle] = useState("");
  const [selectedvoice, setselectedvoice] = useState(null)
  const [voicegender, setvoicegender] = useState("female");
  const [introspoken, setintrospoken] = useState(false);
  const aivideoref = useRef(null)
  const uservideoref = useRef(null);
  const recognitionref = useRef(null);
  const streamref = useRef(null)
  const videoSource = voicegender === "female" ? femaleVideo : maleVideo
  const progress = ((currentIndex + 1) / (interviewData.totalQuestions)) * 100

  const showmicon = micon && !isaiplaying

  // speech recognition

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;
    const rec = new window.webkitSpeechRecognition()
    rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (e) => {
      const t = e.results[e.results.length - 1][0].transcript;

      setanswer((prev) => prev + " " + t)
    }
    recognitionref.current = rec
  }, [])

  const startMic = () => {
    try {
      recognitionref.current?.start();
    } catch (error) {
      if (error.name !== "InvalidStateError") {
        console.error("Mic start error:", error);
      }
    }
  };
  const stopMic = () => {
    try {
      recognitionref.current?.stop();
    } catch (error) {
      if (error.name !== "InvalidStateError") {
        console.error("Mic stop error:", error);
      }
    }
  };

  const toggleMic = () => {
    if (micon) {
      stopMic()
    }
    else {
      startMic()
    }
    setmicon(!micon)
  }

  const togglecamera = async () => {
    if (cameraon) {
      streamref.current?.getTracks().forEach((t) => t.stop()); 
      streamref.current = null
      setcameraon(false);
    }
    else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        streamref.current = stream 
        setcameraon(true)
        setTimeout(() => { if (uservideoref.current) uservideoref.current.srcObject = stream }, 100)
      } catch (error) { setcameraon(false) }
    }
  }

  const handlesubmitcode = (code) => {
    setanswer((prev) => {
      const separtor = prev.trim() ? "\n\n--- Code ---\n" : "--- Code ---\n";
      return prev + separtor + code
    });
    setcodeopen(false)


  }

  useEffect(() => {
    if (timeleft <= 0 || !timeractive) return;
    const t = setInterval(() => settimeleft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeleft, timeractive])

  useEffect(() => {
    const load = () => {
      const voices = window.speechSynthesis.getVoices()
      if (!voices.length) return;
      const female = voices.find(v => /zira|samantha|female/i.test(v.name));
      const male = voices.find(v => /david|mark|male/i.test(v.name));
      if (female) { setselectedvoice(female); setvoicegender("female"); }
      else if (male) { setselectedvoice(male); setvoicegender("male"); }
      else { setselectedvoice(voices[0]); setvoicegender("female"); }
    }
    load()
    window.speechSynthesis.onvoiceschanged = load

  }, [])

  const speakText = (text) =>
    new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedvoice || !text?.trim()) { resolve(); return; }

      window.speechSynthesis.cancel()

      setTimeout(() => {
        const utter = new SpeechSynthesisUtterance(text.replace(/,/g, ", ... ").replace(/\./g, ". ... "))
        utter.voice = selectedvoice;
        utter.rate = 0.92;
        utter.pitch = 1.05;

        utter.onstart = () => {
          setisaiplaying(true)
          stopMic()
          aivideoref.current?.play()
        }
        utter.onend = () => {
          aivideoref.current?.pause()
          setisaiplaying(false)
          if (micon) startMic()
          setTimeout(() => {
            setsubtitle(""); resolve()
          }, 300)
        }

        setsubtitle(text)
        window.speechSynthesis.speak(utter)

      }, 150)
    })


  useEffect(() => {
    if (!selectedvoice || introspoken) return;
    const runIntro = async () => {
      setintrospoken(true)
      await new Promise((r) => setTimeout(r, 1200));
      await speakText(`Welcome ${user?.name.split(" ")[0]}! Let's begin your interview.`)
      await new Promise((r) => setTimeout(r, 900));
      await speakText(interviewData.question.question)
    }
    runIntro()
  }, [selectedvoice])


  useEffect(() => {
    setquestion(interviewData.question)
    setcurrentIndex(interviewData.currentQuestion);
    settimeleft(interviewData.question.timer || 60)
  }, [interviewData])

  useEffect(() => {
    if (!selectedvoice || !introspoken) return;
    const speakQuestion = async () => {
      await new Promise((r) => setTimeout(r, 900));
      await speakText(question.question)
    }
    speakQuestion()
  }, [question])




  useEffect(() => {
    settimeleft(question.timer || 60)
    settimeractive(true);
  }, [question])

  useEffect(() => {
    if (timeleft !== 0) return;
    const autoSubmit = async () => {
      await speakText("Time is up. Submitting your answer now.");
      const finalAnswer = answer.trim() || "No answer provided. Time over.";

      setloading(true);

      try {
        const response = await submitAnswer({
          interviewId: interviewData.interviewId,
          answer: finalAnswer,
        });

        if (!response) {
          throw new Error("No response received from server");
        }

        if (response.completed) {
          setfeedback(response.feedback);

          await new Promise((r) => setTimeout(r, 700));

          await speakText(
            response.feedback?.feedback ||
            "Great job! Your interview is complete. Preparing your report now."
          );

          navigate(`/interview/${interviewData.interviewId}/report`);
          return;
        }

        setfeedback(response.feedback);

        await new Promise((r) => setTimeout(r, 700));

        await speakText(
          response.feedback?.feedback ||
          "Noted your answer. Let's move to the next question."
        );

        setquestion(response.question);
        setcurrentIndex(response.currentQuestion);
        setanswer("");
        setfeedback(null);

      } catch (error) {
        console.error("Submit answer error:", error);

        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to submit your answer. Please try again.";

        alert(message);

      } finally {
        setloading(false);
      }
    }

    autoSubmit()
  }, [timeleft])

  const submit = async () => {
    if (!answer.trim() || loading) return;

    settimeractive(false);
    setloading(true);

    try {
      const response = await submitAnswer({
        interviewId: interviewData.interviewId,
        answer: answer.trim(),
      });

      if (!response) {
        throw new Error("No response received from server");
      }

      if (response.completed) {
        setfeedback(response.feedback);

        await new Promise((r) => setTimeout(r, 700));

        await speakText(
          response.feedback?.feedback ||
          "Great job! Your interview is complete. Preparing your report now."
        );

        navigate(`/interview/${interviewData.interviewId}/report`);
        return;
      }

      setfeedback(response.feedback);

      await new Promise((r) => setTimeout(r, 700));

      await speakText(
        response.feedback?.feedback ||
        "Noted your answer. Let's move to the next question."
      );

      setquestion(response.question);
      setcurrentIndex(response.currentQuestion);
      setanswer("");
      setfeedback(null);

    } catch (error) {
      console.error("Submit answer error:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to submit your answer. Please try again.";

      alert(message);

    } finally {
      setloading(false);
    }
  };








  return (
    <div className='min-h-screen bg-white flex items-center justify-center p-3 sm:p-5'>
      {codeopen && <CodeEditor onclose={() => setcodeopen(false)} onsubmitcode={handlesubmitcode} />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className='w-full max-w-5xl bg-[#0e1016] border border-white/10 rounded-2xl sm:rounded-[24px]  overflow-hidden
      shadow-[0_0_60px_rgba{255,255,255,.03}] grid lg:grid-cols-[36%_64%]'>

        {/* left */}
        <div className='flex flex-col border-b lg:border-b-0 lg:border-r
         border-white/8 p-4 sm:p-5 gap-3'>
          {/* AI video */}
          <div className='relative rounded-xl overflow-hidden bg-black aspect-video'>
            <video src={videoSource} ref={aivideoref} muted playsInline preload='auto' loop className='w-full h-full object-cover' />
            {isaiplaying && (
              <div className='absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60
              backdrop-blur-sm rounded-full px-2.5 py-1'>
                <div className='flex gap-0.5 items-end h-3'>
                  {[1, 2, 3].map(i => (
                    <motion.div
                      key={i}
                      className='w-0.5 bg-white rounded-full'
                      animate={{ height: ["4px", "12px", "4px"] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}


                </div>
                <span className='text-[10px] text-white/80'>AI Speaking</span>
              </div>
            )}

          </div>

          <div className='min-h-[52px] flex items-center'>
            <AnimatePresence>

              {subtitle && <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className='w-full rounded-xl bg-white/5 border border-white/8 px-3 py-2'>
                <p className='text-xs text-white/65 leading-relaxed text-center'>{subtitle}</p>

              </motion.div>}

            </AnimatePresence>
          </div>

          <div className='relative rounded-xl overflow-hidden bg-[#17181E] border
          border-white/8 aspect-video flex items-center justify-center'>
            {
              cameraon ? <>
                <video
                  ref={uservideoref}
                  autoPlay
                  muted
                  playsInline
                  className='w-full h-full object-cover scale-x-[-1]'
                />
                <div className='absolute top-2 left-2  bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5'>

                  <span className='text-[10px] text-white/70'>You
                  </span>
                </div>
              </>
                : <div className='flex flex-col items-center gap-2'>
                  <div className='w-14 h-14 rounded-full bg-white/10 border border-white/15
                  flex items-center justify-center'>
                    <span className='text-2xl font-bold text-white'>{user?.name?.charAt(0)?.toUpperCase() || "U"}</span>

                  </div>
                  <span className='text-xs text-white/35'>{user?.name.split(" ")[0]}</span>
                </div>
            }

          </div>

          <div className='flex flex-col items-center gap-1.5 pt-1'>
            <div className='flex items-center justify-center gap-2'>
              <motion.button
                onClick={toggleMic}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${showmicon
                  ? "bg-white/10 border-white/15 text-white" : "bg-red-500/10 border-red-500/30 text-red-400"
                  }`}
              >
                {showmicon ? <FiMic size={15} /> : <FiMicOff size={15} />}


              </motion.button>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                onClick={togglecamera}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${cameraon
                  ? "bg-white/10 border-white/15 text-white" : "bg-white/5 border-white/10 text-white/45 hover:text-white/70"
                  }`}
              >
                {cameraon ? <FiCamera size={15} /> : <FiCameraOff size={15} />}



              </motion.button>
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => setcodeopen(true)}
                className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all 
                bg-white/5 border-white/10 text-white/45 hover:text-white hover:border-white/20"

              >
                <FiCode size={15} />




              </motion.button>
            </div>
            <div className='min-h-[14px] flex items-center justify-center'>
              {micon && isaiplaying && (<span className='text-[10px] text-red-400/80'>Mic paused - Ai is speaking</span>)}

            </div>

            <span className='text-[10px] text-white/35 text-center'>Coding question? Use <FiCode size={9} className='inline -mt-0.5' /> to write &amp; add code
            </span>
          </div>
        </div>

        {/* right */}
        <div className='flex flex-col p-4 sm:p-6'>

          <div className='flex items-start justify-between mb-4'></div>
          <div>
            <h2 className='text-base sm:text-lg font-semibold text-white'>
              AI Interview
            </h2>
            <div className='flex items-center gap-2 text-zinc-500 text-xs mt-0.5'>
              <FiClock size={11} />
              <span>{question.difficulty}</span>

            </div>
          </div>
          <div className='flex flex-col items-end mb-3 gap-1.5 min-w-[110px]'>
            <Timer timeLeft={timeleft} totalTime={question.timer || 60} />

          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='relative overflow-hidden rounded-xl bg-[#17181E] border border-white/8 p-4 sm:p-5 mb-4'>
            <div className='absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none' />
            <div className='relative flex items-center gap-2.5 mb-3'>
              <div className='w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center shrink-0'>
                <FiMessageSquare size={14} />
              </div>
              <p className='text-xs text-zinc-500'>Question {currentIndex + 1}</p>
            </div>
            <p className='relative text-white text-sm sm:text-base leading-7'>{question.question}</p>



          </motion.div>

          <div className='mb-3'>
            <div className='flex justify-between text-[10px] text-white/35 mb-1'>
              <span>Progress</span>
              <span>
                {currentIndex + 1}/{interviewData.totalQuestions}
              </span>
            </div>

            <div className='w-full h-1 rounded-full bg-white/10 overflow-hidden'>
              <div
                className='h-full bg-white rounded-full transition-all duration-500'
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className='flex-1 flex flex-col min-h-0'>
            <label className='text-xs font-medium text-zinc-400 mb-1.5'>
              Your Answer
            </label>

            <textarea
              onChange={(e) => setanswer(e.target.value)}
              value={answer}
              rows={5}
              onKeyDown={(e) => { if (e.ctrlKey && e.key === "Enter") submit() }}
              placeholder='Write your answer here... or speak if mic is on'
              className='flex-1 w-full rounded-xl bg-[#17181E] border border-white/8 p-4
              text-sm text-white outline-none resize-none focus:border-white/25
              transition placeholder-white/20'
            />
          </div>

          <div className='mt-3 min-h-[0px]'>
            <AnimatePresence>
              {feedback && (

                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className='rounded-xl border border-green-500/5 p-4 max-h-40 overflow-y-auto'>
                  <p className='text-xs uppercase tracking-widest text-green-400 mb-2'>Ai Feedback</p>
                  <p className='text-sm text-zinc-300 leading-6'>{feedback.feedback}</p>

                </motion.div>
              )}
            </AnimatePresence>

          </div>

          <div className='flex items-center justify-between mt-4 pt-3 border-t border-white/8'>
            <span className='text-xs text-zinc-600 hidden sm:block'>Press{" "}
              <span className='mx-1 rounded bg-white/10 px-1.5 py-0.5 text-white text-[10px]'>
                Ctrl+Enter</span>to Submit
            </span>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={submit}
              disabled={loading || !answer.trim()}
              className='ml-auto h-10 min-w-[150px] justify-center px-5 rounded-xl bg-white text-black text-sm
                font-semibold flex items-center gap-2 disabled:opacity-40 transition'
            >
              {loading ? (
                <>
                  <div className='w-3.5 h-3.5 rounded-full border-2 border-black border-t-transparent animate-spin' />
                  Submitting...
                </>
              ) : (
                <>Submit Answer <FiArrowRight size={15} /></>
              )}

            </motion.button>
          </div>
        </div>

      </motion.div>

    </div>
  )
}

export default Step2setup