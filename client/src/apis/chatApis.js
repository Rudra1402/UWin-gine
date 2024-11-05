import { toast } from "react-toastify";

export const sendMessageApi = async (requestBody) => {
    try {
        const response = await fetch('http://54.147.167.63:8000/user/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            toast.error('Failed to send message.', {
                autoClose: 2000
            });
            return { message: 'We are currently experiencing technical difficulties. Our team is actively working on resolving the issue. Please try again shortly.' };
                }

        const data = await response.json();

        if(data?.status === "error") {
            toast.error('Server processing error.', {
                autoClose: 2000
            });
            return { message: 'Error retrieving response from server.' }; 
        }

        toast.success('Message sent successfully!', {
            autoClose: 2000
        });

        return data; // Returns the response data from the server
    } catch (error) {
        console.error('Failed to send message:', error);
        toast.error('Communication error.', {
            autoClose: 2000
        });
        return { message: 'Error retrieving response from server.' };
    }
};