import React from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'

function Input({ label, value, onChange, placeholder, type = "text" }) {
    return (
        <div className='flex flex-col gap-1'>
            <label className='text-[10px] font-semibold text-black/70 uppercase tracking-wider'>
                {label}
            </label>
            <input type={type}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                value={value}
                className='bg-white border-2 border-black/25 text-[#0a0a0a] text-xs
            rounded-lg px-2.5 py-2 outline-none focus:border/60 transition-colors placeholder-black/30 
            shadow-[0_2px_8px_rgba(0,0,0,0,04)]
            '
            />

        </div>
    )
}

function TextArea({ label, value, onChange, placeholder, rows = 3 }) {
    return (
        <div className='flex flex-col gap-1'>
            <label className='text-[10px] font-semibold text-black/70 uppercase tracking-wider'>
                {label}
            </label>
            <textarea
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                value={value}
                rows={rows}
                className='bg-white border-2 border-black/25 text-[#0a0a0a] text-xs
            rounded-lg px-2.5 py-2 outline-none resize-none focus:border/60 transition-colors placeholder-black/30 
            shadow-[0_2px_8px_rgba(0,0,0,0,04)]
            '
            />

        </div>
    )
}

function EntryCard({ children, onRemove }) {
    return (
        <div className='relative overflow-hidden bg-[#f8f9fa] border-2 border-black/15
        rounded-xl p-3 shadow-[0_2px_10px_rgba(0,0,0,0.05)]'>
            <button
                onClick={onRemove}
                className='absolute top-2.5 right-2.5 z-10 text-black/35 hover:text-2xl-500
            transition-colors'>
                <FiTrash2 size={13} />
            </button>
            <div className='relative flex flex-col gap-2.5 pr-6'>{children}</div>

        </div>
    )
}
const ResumeForm = ({ step, data, setdata }) => {
    if (step === 1) {
        return (
            <div className='flex flex-col gap-3'>
                <Input label="Full Name" placeholder="Rahul Sharma" onChange={(v) => setdata({ ...data, name: v })} value={data.name} />
                <Input label="Email" placeholder="rahul@gmail.com" onChange={(v) => setdata({ ...data, email: v })} value={data.email} />
                <Input label="Phone" placeholder="+91 8785739394" onChange={(v) => setdata({ ...data, phone: v })} value={data.phone} />
                <Input label="Location" placeholder="Jhansi, UP" onChange={(v) => setdata({ ...data, location: v })} value={data.location} />
                <Input label="LinkedIn URL" placeholder="linkedin.com/in/rahul" onChange={(v) => setdata({ ...data, linkedin: v })} value={data.linkedin} />
                <Input label="GitHub URL" placeholder="github.com/rahul" onChange={(v) => setdata({ ...data, github: v })} value={data.github} />

            </div>
        )

    }

    if (step === 2) {
        return (
            <div className='flex flex-col gap-3' >
                <TextArea label="Professional Summary" placeholder="Backend Developer with 2+ years of experience building scalable Node.js and MongoDB applications..."
                    rows={5} onChange={(v) => setdata({ ...data, summary: v })} value={data.summary} />

                <p className='text-[10px] text-black/40'>
                    Leave empty to skip this</p>

            </div>
        )
    }

    if (step === 3) {
        return (
            <div className='flex flex-col gap-3' >
                <TextArea label="Skills (comma separated)" placeholder="JavaScript, TypeScript, React, Node.js, Express, MongoDB, Redis, Docker, AWS, Git"
                    rows={5} onChange={(v) => setdata({ ...data, skills: v })} value={data.skills} />

                <p className='text-[10px] text-black/40'>
                    Separate Each Skill With Comma.</p>

            </div>
        )
    }

    if (step === 4) {
        const addExp = () => {
            setdata({
                ...data, experience: [...data.experience, {
                    company: "", role: "", duration: "",
                    description: ""
                }]
            }
            )
        }

        const removeExp = (index) => {
            setdata({
                ...data, experience: data.experience.filter((_, i) => i !== index)
            })

        }

        const updateExp = (index, field, value) => {
            const updated = data.experience.map((exp, i) => i === index ? { ...exp, [field]: value } : exp);
            setdata({ ...data, experience: updated })

        }
        return (
            <div className='flex flex-col gap-3'>
                {data.experience.length === 0 &&
                    <p className='text-xs text-black/40 text-center py-3'>
                        No experience added yet. Click below to add.</p>}

                {data.experience.map((exp, index) => (
                    <EntryCard key={index} onRemove={() => removeExp(index)} >
                        <Input label="Company" placeholder="ABC Technologies" onChange={(v) => updateExp(index, "company", v)} value={exp.company} />
                        <Input label="Role" placeholder="Backend Developer" onChange={(v) => updateExp(index, "role", v)} value={exp.role} />
                        <Input label="Duration" placeholder="Jan 2023 - Dec 2024" onChange={(v) => updateExp(index, "duration", v)} value={exp.duration} />
                        <TextArea label="Description" placeholder={"• Built REST API\n• Improved performance bt 40%"} onChange={(v) => updateExp(index, "description", v)} value={exp.description} />

                    </EntryCard>
                ))}
                <button onClick={addExp} className='flex items-center justify-center gap-1.5 w-full py-2.5
                         border border-dashed border-black/20 rounded-xl text-xs text-black/45 hover:border-black/40
                         hover:text-[#0a0a0a] transition-all'>
                    <FiPlus size={13} />Add Experience

                </button>


            </div>
        )
    }

      if (step === 5) {
        const addPro = () => {
            setdata({
                ...data, projects: [...data.projects, {
                    name: "", techStack: "", github: "",
                    description: ""
                }]
            }
            )
        }

        const removePro = (index) => {
            setdata({
                ...data, projects: data.projects.filter((_, i) => i !== index)
            })

        }

        const updatePro = (index, field, value) => {
            const updated = data.projects.map((pro, i) => i === index ? { ...pro, [field]: value } : pro);
            setdata({ ...data, projects: updated })

        }
        return (
            <div className='flex flex-col gap-3'>
                {data.projects.length === 0 &&
                    <p className='text-xs text-black/40 text-center py-3'>
                        No Projects added yet. Click below to add.</p>}

                {data.projects.map((pro, index) => (
                    <EntryCard key={index} onRemove={() => removePro(index)} >
                        <Input label="Project Name" placeholder="InterViewIQ" on onChange={(v) => updatePro(index, "name", v)} value={pro.name} />
                        <Input label="Tech Stack" placeholder="React, Node.js, MongoDB" onChange={(v) => updatePro(index, "techStack", v)} value={pro.techStack} />
                        <Input label="Github Link" placeholder="github.com/rahul/interviewIQ" onChange={(v) => updatePro(index, "github", v)} value={pro.github} />
                        <TextArea label="Description" placeholder={"• AI-powered interview preparation platform with mock interviews and resume"} onChange={(v) => updatePro(index, "description", v)} value={pro.description} />

                    </EntryCard>
                ))}
                <button onClick={addPro} className='flex items-center justify-center gap-1.5 w-full py-2.5
                         border border-dashed border-black/20 rounded-xl text-xs text-black/45 hover:border-black/40
                         hover:text-[#0a0a0a] transition-all'>
                    <FiPlus size={13} />Add Projects

                </button>


            </div>
        )
    }
      if (step === 6) {
        const addEdu = () => {
            setdata({
                ...data, education: [...data.education, {
                    college: "", degree: "", branch: "",
                    cgpa: "",year:""
                }]
            })
        }

        const removeEdu = (index) => {
            setdata({
                ...data, education: data.education.filter((_, i) => i !== index)
            })

        }

        const updateEdu = (index, field, value) => {
            const updated = data.education.map((edu, i) => i === index ? { ...edu, [field]: value } : edu);
            setdata({ ...data, education: updated })

        }
        return (
            <div className='flex flex-col gap-3'>
                {data.education.length === 0 &&
                    <p className='text-xs text-black/40 text-center py-3'>
                        No Educations added yet. Click below to add.</p>}

                {data.education.map((edu, index) => (
                    <EntryCard key={index} onRemove={() => removeEdu(index)} >
                        <Input label="College / University " placeholder="B.E.S.T Innovation University" onChange={(v) => updateEdu(index, "college", v)} value={edu.college} />
                        <Input label="Degree" placeholder="B.tech" onChange={(v) => updateEdu(index, "degree", v)} value={edu.degree} />
                        <Input label="Branch" placeholder="Computer Science" onChange={(v) => updateEdu(index, "branch", v)} value={edu.branch} />
                        <Input label="CGPA" placeholder="9.57" onChange={(v) => updateEdu(index, "cgpa", v)} value={edu.cgpa} />
                         <Input label="Year" placeholder="2022-2026" onChange={(v) => updateEdu(index, "year", v)} value={edu.year} />

                    </EntryCard>
                ))}
                <button onClick={addEdu} className='flex items-center justify-center gap-1.5 w-full py-2.5
                         border border-dashed border-black/20 rounded-xl text-xs text-black/45 hover:border-black/40
                         hover:text-[#0a0a0a] transition-all'>
                    <FiPlus size={13} />Add Educations

                </button>


            </div>
        )
    }


}



export default ResumeForm