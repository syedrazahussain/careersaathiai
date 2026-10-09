import { Navigate, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import { useEffect, useState } from "react"
import { getcurrentUser } from "./apis/user.api"
import Scorer from "./pages/Scorer"
import { getResume } from "./apis/resume.api"
import { useDispatch } from "react-redux"
import { setResume } from "./redux/resumeSlice"
import ResumeBuilder from "./pages/ResumeBuilder"
import InterviewStart from "./pages/InterviewStart"
import InterviewPage from "./pages/InterviewPage"
import InterviewReport from "./pages/InterviewReport"
import Roadmap from "./pages/Roadmap"
import Billing from "./pages/Billing"
import ResumeAnalyzer from "./pages/ResumeAnalyzer/ResumeAnalyzer"
import useBackendWarmup from "./hooks/useBackendWarmup";


const App = () => {

  useBackendWarmup();

  const [user, setuser] = useState(null);
  const [loading, setloading] = useState(true)
  const dispatch = useDispatch()
  useEffect(() => {
    const getUser = async () => {
      const data = await getcurrentUser()
      setuser(data?.user)
      setloading(false)
    }
    getUser()
  }, [])

 
useEffect(() => {
  const getResumeData = async () => {
    try {
      const result = await getResume();
      dispatch(setResume(result?.data));
    } catch (error) {
      console.error("Failed to load resume:", error);
    } finally {
      setloading(false);
    }
  };

  getResumeData();
}, [dispatch]);

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full z-[9999]">
        <div className="h-1 bg-black animate-pulse w-full" />
      </div>

    )
  }
  return (
    <Routes>
      <Route path='/' element={user ? <Navigate to="/dashboard" replace /> :
        <Home setuser={setuser} />
      } />

      <Route path='/dashboard' element={user ? <Dashboard user={user} setuser={setuser} /> : <Navigate to="/" replace />} />
      <Route path='/scorer' element={user ? <Scorer user={user} setuser={setuser} /> : <Navigate to="/" replace />} />
      <Route path='/resume' element={user ? <ResumeBuilder user={user} setuser={setuser} /> : <Navigate to="/" replace />} />
      <Route path='/interview' element={user ? <InterviewStart user={user} setuser={setuser} /> : <Navigate to="/" replace />} />
      <Route path='/interview/:id' element={user ? <InterviewPage user={user} setuser={setuser} /> : <Navigate to="/" replace />} />
      <Route path='/interview/:id/report' element={user ? <InterviewReport user={user} setuser={setuser} /> : <Navigate to="/" replace />} />
      <Route path='/roadmap' element={user ? <Roadmap user={user} setuser={setuser} /> : <Navigate to="/" replace />} />
      <Route path='/billing' element={user ? <Billing user={user} setuser={setuser} /> : <Navigate to="/" replace />} />
      <Route
        path="/resume-analyzer"
        element={
          user
            ? <ResumeAnalyzer user={user} setuser={setuser} />
            : <Navigate to="/" replace />
        }
      />
    </Routes>
  )
}

export default App