import api from "@/axios/axios";
import {v4 as uuidv4} from 'uuid';
import { toast } from "react-toastify";

export const fetchChatHistoryApi = async (threadId) => {
    try {
        const response = await api.get(`/user/chat/history/${threadId}`);

        if (response.data?.status !== "success") {
            throw new Error(`Error fetching chat history: ${response.statusText}`);
        }

        // Access the data directly from response.data
        return response.data.data;
    } catch (error) {
        console.error('Failed to fetch chat history:', error);
        return []; // Return an empty array if there's an error
    }
};

export const sendMessageApi = async (requestBody) => {
    try {
        // Make the POST request with Axios
        if (requestBody.thread_id == "") {
            requestBody = {...requestBody, thread_id: uuidv4().replace(/-/g, '').substring(0, 24)}
        }
        console.log(requestBody)
        const response = await api.post('/user/chat', requestBody);

        // Check if the response indicates an error status in the data
        if (response.data?.status === "error") {
            toast.error('Server processing error.', {
                autoClose: 2000
            });
            return { message: 'Error retrieving response from server.' }; 
        }

        toast.success('Message sent successfully!', {
            autoClose: 2000
        });
        console.log(response.data)
        // Return the response data
        return response.data;
    } catch (error) {
        console.error('Failed to send message:', error);

        // Handle any other errors, including network issues
        toast.error('Communication error.', {
            autoClose: 2000
        });

        return { message: 'We are currently experiencing technical difficulties. Our team is actively working on resolving the issue. Please try again shortly.' };
    }
};
