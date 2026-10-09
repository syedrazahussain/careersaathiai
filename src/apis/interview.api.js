import api from "../utils/axios"


export const startInterview = async(data)=>{
    try {
        const response = await api.post("/api/interview/start",data)
        
        return response.data
    } catch (error) {
        console.log(error)
        return null
        
    }

}

export const getInterview = async(id) =>{
    try {
        const response = await api.get(`/api/interview/${id}`)
        return response.data;
    } catch (error) {
        console.log(error)
        return null
        
    }
}

export const submitAnswer = async (data)=>{
      try {
        const response = await api.post(`/api/interview/answer`,data)
        return response.data;
    } catch (error) {
        console.log(error)
        return null
        
    }
}

export const getAllInterviews = async ()=>{
      try {
        const response = await api.get(`/api/interview/all`)
        return response.data;
    } catch (error) {
        console.log(error)
        return null
        
    }
}