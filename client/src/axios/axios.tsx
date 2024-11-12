import axios from "axios";

const uri = "http://localhost:8000"

const api = axios.create({
    baseURL: uri,
    headers: { 'Content-Type': 'application/json' }
})

export default api