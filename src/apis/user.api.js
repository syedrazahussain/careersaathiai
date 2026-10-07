import api from "../utils/axios"

export const getcurrentUser = async()=>{
    try {
        const response = await api.get("/api/me")
        return response.data
    } catch (error) {
        console.log(error)
        return null
        
    }
}

export const useCoins = async(data)=>{
    try {
        const response = await api.post('/api/auth/use-coins',data)
        
        console.log(response.data)
        return response.data

    } catch (error) {
        
        console.log(error)
        
        throw error;
    }

}

export const refundCoins = async (data) => {
    try {

        const response = await api.post(
            "/api/auth/refund-coins",
            data
        )

        return response.data

    } catch (error) {

        console.error(
            "Refund coins error:",
            error
        )

        throw error
    }
}