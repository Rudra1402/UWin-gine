import axios from "axios";

const uri = "http://54.147.167.63:8000"

const api = axios.create({
    baseURL: uri,
    headers: { 'Content-Type': 'application/json' }
})

export default api