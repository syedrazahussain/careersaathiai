import React, { useState } from "react";
import { motion } from "motion/react";
import {
    FiArrowLeft,
    FiArrowRight,
    FiBriefcase,
    FiCheck,
    FiCheckCircle,
    FiFileText,
    FiUploadCloud,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    useCoins as deductCoins,
    refundCoins,
} from "../../apis/user.api";
import { startInterview } from "../../apis/interview.api";
import { setResume } from "../../redux/resumeSlice";
import api from "../../utils/axios";

const MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5MB

const Step1setup = ({ user, setuser }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { resume } = useSelector((state) => state.resume);

    const [role, setRole] = useState("");
    const [type, setType] = useState("technical");
    const [useResume, setUseResume] = useState(Boolean(resume));

    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [starting, setStarting] = useState(false);

    // ----------------------------------------
    // Resume file selection
    // ----------------------------------------
    const handleFileChange = (event) => {
        const selectedFile = event.target.files?.[0];

        if (!selectedFile) {
            return;
        }

        if (selectedFile.type !== "application/pdf") {
            alert("Please select a PDF file.");
            event.target.value = "";
            return;
        }

        if (selectedFile.size > MAX_RESUME_SIZE) {
            alert("Resume file must be less than 5MB.");
            event.target.value = "";
            return;
        }

        setFile(selectedFile);
    };

    // ----------------------------------------
    // Upload Resume
    // ----------------------------------------
    const uploadResume = async () => {

        if (!file) {
            alert("Please select a PDF.");
            return;
        }

        if (file.type !== "application/pdf") {
            alert("Please select a valid PDF file.");
            return;
        }

        if (file.size > MAX_RESUME_SIZE) {
            alert("Resume file must be less than 5MB.");
            return;
        }

        if (uploading) {
            return;
        }

        let coinDeducted = false;

        try {

            setUploading(true);


            // ========================================
            // DEDUCT COIN
            // ========================================

            const coinResponse = await deductCoins({
                coins: 1,
                action: "resume-Scorer",
            });


            if (!coinResponse?.success) {

                alert(
                    coinResponse?.message ||
                    "Unable to deduct coins. Please try again."
                );

                return;
            }


            coinDeducted = true;


            // ========================================
            // UPDATE COIN BALANCE
            // ========================================

            if (
                setuser &&
                coinResponse?.interviewCoins !== undefined
            ) {

                setuser((prev) => ({
                    ...prev,
                    interviewCoins:
                        coinResponse.interviewCoins,
                }));
            }


            // ========================================
            // FORM DATA
            // ========================================

            const formData = new FormData();

            formData.append(
                "resume",
                file
            );


            // ========================================
            // UPLOAD
            // ========================================

            const response = await api.post(
                "/api/resume/upload",
                formData
            );


            const uploadedResume =
                response?.data?.data;


            if (!uploadedResume) {
                throw new Error(
                    "Invalid resume response from server."
                );
            }


            // ========================================
            // SUCCESS
            // ========================================

            dispatch(
                setResume(uploadedResume)
            );

            setFile(null);

            alert(
                "Resume uploaded successfully!"
            );


        } catch (error) {

            console.error(
                "Resume upload failed:",
                error
            );


            // ========================================
            // REFUND COIN
            // ========================================

            if (coinDeducted) {

                try {

                    console.log(
                        "Resume upload failed. Refunding coin..."
                    );


                    const refundResponse =
                        await refundCoins({
                            coins: 1,
                            action: "resume-Scorer-refund",
                        });


                    if (refundResponse?.success) {

                        console.log(
                            "Resume upload coin refunded:",
                            refundResponse
                        );


                        if (
                            setuser &&
                            refundResponse?.interviewCoins !== undefined
                        ) {

                            setuser((prev) => ({
                                ...prev,
                                interviewCoins:
                                    refundResponse.interviewCoins,
                            }));
                        }

                    } else {

                        console.error(
                            "Resume refund failed:",
                            refundResponse
                        );
                    }


                } catch (refundError) {

                    console.error(
                        "Resume refund request failed:",
                        refundError
                    );
                }
            }


            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Upload failed. Your coin has been refunded if the deduction was successful.";


            alert(message);


        } finally {

            setUploading(false);

        }
    };

    // ----------------------------------------
    // Start Interview
    // ----------------------------------------
    const start = async () => {

        const trimmedRole = role.trim();

        if (!trimmedRole) {
            alert("Please enter a target role.");
            return;
        }

        if (starting) {
            return;
        }

        if (useResume && !resume) {
            alert(
                "Please upload your resume before starting the interview."
            );
            return;
        }


        let coinDeducted = false;


        try {

            setStarting(true);


            // ========================================
            // DEDUCT INTERVIEW COIN
            // ========================================

            const coinResponse = await deductCoins({
                coins: 1,
                action: "start-interview",
            });


            if (!coinResponse?.success) {

                alert(
                    coinResponse?.message ||
                    "Unable to deduct coins. Please try again."
                );

                return;
            }


            coinDeducted = true;


            // ========================================
            // UPDATE COIN BALANCE
            // ========================================

            if (
                setuser &&
                coinResponse?.interviewCoins !== undefined
            ) {

                setuser((prev) => ({
                    ...prev,
                    interviewCoins:
                        coinResponse.interviewCoins,
                }));
            }


            // ========================================
            // CREATE INTERVIEW
            // ========================================

            const response = await startInterview({
                role: trimmedRole,
                type,
                useResume,
                resume: useResume
                    ? resume
                    : null,
            });


            if (!response?.interviewId) {

                throw new Error(
                    "Failed to create interview."
                );
            }


            // ========================================
            // SUCCESS
            // ========================================

            navigate(
                `/interview/${response.interviewId}`
            );


        } catch (error) {

            console.error(
                "Start interview failed:",
                error
            );


            // ========================================
            // REFUND INTERVIEW COIN
            // ========================================

            if (coinDeducted) {

                try {

                    console.log(
                        "Interview creation failed. Refunding coin..."
                    );


                    const refundResponse =
                        await refundCoins({
                            coins: 1,
                            action: "start-interview-refund",
                        });


                    if (refundResponse?.success) {

                        console.log(
                            "Interview coin refunded:",
                            refundResponse
                        );


                        if (
                            setuser &&
                            refundResponse?.interviewCoins !== undefined
                        ) {

                            setuser((prev) => ({
                                ...prev,
                                interviewCoins:
                                    refundResponse.interviewCoins,
                            }));
                        }

                    } else {

                        console.error(
                            "Interview refund failed:",
                            refundResponse
                        );
                    }


                } catch (refundError) {

                    console.error(
                        "Interview refund request failed:",
                        refundError
                    );
                }
            }


            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to start interview. Your coin has been refunded if the deduction was successful.";


            alert(message);


        } finally {

            setStarting(false);

        }
    };
    // ----------------------------------------
    // Features
    // ----------------------------------------
    const features = [
        "Personalized AI Questions",
        "Resume Based Interview",
        "Detailed Performance Report",
        "Real Interview Experience",
    ];

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-3 sm:p-5">
            <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="w-full max-w-4xl bg-[#0e1016] border border-white/10 rounded-2xl sm:rounded-[24px] overflow-hidden grid lg:grid-cols-[40%_60%] shadow-[0_0_60px_rgba(255,255,255,.03)]"
            >
                {/* ================= LEFT SIDE ================= */}
                <div className="p-5 sm:p-7 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-start gap-4">
                    <div>
                        <button
                            type="button"
                            onClick={() => navigate("/dashboard")}
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 cursor-pointer"
                        >
                            <FiArrowLeft size={12} />
                            <span className="text-xs text-zinc-300">
                                Back
                            </span>
                        </button>

                        <h2 className="mt-4 text-lg sm:text-2xl font-bold text-white leading-snug">
                            Welcome back,
                            <br />
                            {user?.name || "there"}
                        </h2>

                        <p className="mt-2 text-xs sm:text-sm leading-6 text-zinc-400">
                            Practise realistic AI interviews, receive instant
                            feedback, and improve before your next job
                            interview.
                        </p>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                        {features.map((item, index) => (
                            <motion.div
                                whileHover={{ x: 4 }}
                                key={index}
                                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3"
                            >
                                <div className="w-7 h-7 shrink-0 rounded-lg bg-white flex items-center justify-center">
                                    <FiCheck
                                        className="text-black"
                                        size={13}
                                    />
                                </div>

                                <span className="text-xs sm:text-sm text-zinc-300">
                                    {item}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* ================= RIGHT SIDE ================= */}
                <div className="p-5 sm:p-7 flex flex-col">
                    <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-white">
                            Start Interview
                        </h2>

                        <p className="mt-1 text-xs text-zinc-500">
                            Configure your interview preferences.
                        </p>
                    </div>

                    <div className="mt-5 flex-1 space-y-4 overflow-y-auto">
                        {/* ================= ROLE ================= */}
                        <div>
                            <label className="text-xs font-medium text-zinc-400">
                                Target Role
                            </label>

                            <div className="mt-1.5 relative">
                                <FiBriefcase
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
                                    size={14}
                                />

                                <input
                                    type="text"
                                    value={role}
                                    onChange={(e) =>
                                        setRole(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            e.key === "Enter" &&
                                            !starting
                                        ) {
                                            start();
                                        }
                                    }}
                                    placeholder="Backend Developer"
                                    maxLength={100}
                                    className="w-full h-11 rounded-xl bg-[#17181E] border border-white/10 pl-10 pr-4 text-sm text-white outline-none focus:border-white/30 transition"
                                />
                            </div>
                        </div>

                        {/* ================= INTERVIEW TYPE ================= */}
                        <div>
                            <label className="text-xs font-medium text-zinc-400">
                                Interview Type
                            </label>

                            <div className="mt-1.5 flex rounded-xl bg-[#17181E] p-1 border border-white/10">
                                {["technical", "hr"].map((item) => (
                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() => setType(item)}
                                        className={`flex-1 h-9 rounded-lg text-xs sm:text-sm font-medium capitalize transition-all ${type === item
                                            ? "bg-white text-black"
                                            : "text-zinc-400 hover:text-white"
                                            }`}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ================= RESUME TOGGLE ================= */}
                        <div className="rounded-xl border border-white/10 bg-[#17181E] p-4">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-sm font-medium text-white">
                                        Use Resume
                                    </h2>

                                    <p className="mt-0.5 text-xs text-zinc-500">
                                        AI will personalize questions using
                                        your resume.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    aria-label="Toggle resume usage"
                                    aria-pressed={useResume}
                                    onClick={() =>
                                        setUseResume((prev) => !prev)
                                    }
                                    className={`relative shrink-0 w-12 h-7 rounded-full transition ${useResume
                                        ? "bg-white"
                                        : "bg-zinc-700"
                                        }`}
                                >
                                    <div
                                        className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-black transition-transform ${useResume
                                            ? "translate-x-5"
                                            : "translate-x-0"
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>

                        {/* ================= RESUME READY ================= */}
                        {resume && useResume && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.45 }}
                                className="rounded-xl border border-green-500/20 bg-green-500/5 p-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 shrink-0 rounded-lg bg-green-500 flex items-center justify-center">
                                        <FiFileText
                                            size={15}
                                            className="text-white"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-semibold text-white truncate">
                                            Resume Ready{" "}
                                            {resume?.suggestedRole && (
                                                <span className="text-gray-400 font-normal">
                                                    ({resume.suggestedRole})
                                                </span>
                                            )}
                                        </h4>

                                        <p className="text-xs text-zinc-400">
                                            Resume detected successfully.
                                        </p>
                                    </div>

                                    <FiCheckCircle
                                        size={18}
                                        className="text-green-400 shrink-0"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* ================= RESUME UPLOAD ================= */}
                        {useResume && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.45 }}
                                className="rounded-xl border-2 border-dashed border-white/10 bg-[#17181E] p-4"
                            >
                                <label className="cursor-pointer flex flex-col items-center">
                                    <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center">
                                        <FiUploadCloud
                                            size={20}
                                            className="text-black"
                                        />
                                    </div>

                                    <h3 className="mt-3 text-sm font-semibold text-white">
                                        Upload Resume
                                    </h3>

                                    <p className="mt-1 text-xs text-zinc-500 text-center">
                                        {resume
                                            ? "Resume detected. Upload a new resume anytime to update your interview questions."
                                            : "Upload your resume to generate personalized interview questions."}
                                    </p>

                                    <p className="mt-1 text-[11px] text-zinc-600">
                                        PDF only • Max 5MB
                                    </p>

                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="application/pdf,.pdf"
                                        onChange={handleFileChange}
                                        disabled={uploading}
                                    />
                                </label>

                                {/* Selected file */}
                                {file && (
                                    <div className="mt-4">
                                        <div className="rounded-lg bg-black/20 border border-white/10 p-2.5">
                                            <p className="text-xs text-zinc-300 truncate">
                                                {file.name}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            disabled={uploading}
                                            onClick={uploadResume}
                                            className="mt-3 w-full h-10 rounded-xl bg-white text-black text-sm font-semibold hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                        >
                                            {uploading
                                                ? "Uploading..."
                                                : "Upload"}
                                        </button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* ================= START BUTTON ================= */}
                    <motion.button
                        type="button"
                        onClick={start}
                        whileHover={
                            !starting ? { scale: 1.01 } : undefined
                        }
                        whileTap={
                            !starting ? { scale: 0.98 } : undefined
                        }
                        disabled={
                            !role.trim() ||
                            starting ||
                            (useResume && !resume)
                        }
                        className="mt-5 h-12 rounded-xl bg-white text-black text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                        {starting ? (
                            "Starting Interview..."
                        ) : (
                            <>
                                Start Interview
                                <FiArrowRight size={15} />
                            </>
                        )}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default Step1setup;