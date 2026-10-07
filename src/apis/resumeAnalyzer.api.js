import api from "../utils/axios"


export const uploadResume = async (file) => {
    try {
        const formData = new FormData()

        formData.append("resume", file)

        const response = await api.post(
            "/api/resume/uploadresumeintelligence",
            formData,
            {
                headers: {
                    "Content-Type":
                        "multipart/form-data"
                }
            }
        )

        return response.data
    } catch (error) {
        console.error(
            "Resume upload error:",
            error
        )

        throw new Error(
            error?.response?.data?.message ||
            "Unable to upload resume right now."
        )
    }
}


export const analyzeResume = async ({
    resumeId,
    input,
    history = []
}) => {
    try {
        const response = await api.post(
            "/api/resume/ai",
            {
                resumeId,
                input: input.trim(),
                history
            }
        )

        return response.data
    } catch (error) {
        console.error(
            "Resume analysis error:",
            error
        )

        throw new Error(
            error?.response?.data?.message ||
            "Unable to analyze resume right now."
        )
    }
}


export const deleteResumeSession = async (
    resumeId
) => {
    try {
        await api.delete(
            `/api/resume/${resumeId}`
        )
    } catch (error) {
        console.error(
            "Resume session delete error:",
            error
        )
    }
}