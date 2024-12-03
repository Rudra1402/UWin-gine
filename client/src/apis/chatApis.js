import api from "@/axios/axios";
import { v4 as uuidv4 } from 'uuid';
import { toast } from "react-toastify";
import { getUserId } from "@/utils/getUser";

export const fetchChatHistoryApi = async (threadId, setIsPageLoading) => {
    try {
        const response = await api.get(`/user/chat/session/history/${threadId}`);

        if (response.data?.status !== "success") {
            return [{
                prompt: "Prompt",
                answer: `Error fetching chat history: ${response.data?.message || 'No details provided.'}`,
                isError: true
            }];
        }

        // Access the data directly from response.data
        return response.data.data;
    } catch (error) {
        console.log('Failed to fetch chat history:', error);
        return [{
            prompt: "Prompt",
            answer: `Failed to retrieve chat history. Please try again later!`,
            isError: true
        }]; // Return an empty array if there's an error
    } finally {
        setIsPageLoading(false);
    }
};

export const sendMessageApi = async (requestBody, setIsNewChat, setChatSessions, setCurrentSession, currentSession) => {
    try {
        const userId = getUserId();

        if (requestBody.thread_id == "") {
            requestBody = { ...requestBody, thread_id: uuidv4().replace(/-/g, '').substring(0, 24) }
        }

        let headers = {};
        if (currentSession) {
            headers['currentsession'] = JSON.stringify(currentSession?.session_id);
        }
        const response = await api.post('/user/chat', requestBody, { headers });

        if (response.data?.status === "error") {
            toast.error('Server processing error.', {
                autoClose: 2000
            });
            return { message: 'Error retrieving response from server.' };
        }

        // toast.success('Message sent successfully!', {
        //     autoClose: 2000
        // });
        console.log(response.data)
        if (userId) {
            setIsNewChat(false)
            setCurrentSession(response.data?.session);

            setChatSessions((prevSessions) => {
                const sessionExists = prevSessions.some(session => session?.session_id === response.data?.session?.session_id);
                if (!sessionExists) {
                    return [...prevSessions, response.data.session];
                }
                return prevSessions;
            });
        }

        return response.data;
    } catch (error) {
        console.log('Failed to send message:', error);

        toast.error('Communication error.', {
            autoClose: 2000
        });

        return { message: 'We are currently experiencing technical difficulties. Our team is actively working on resolving the issue. Please try again shortly.' };
    }
};

export const sendDateMessageApi = async (requestBody) => {
    try {
        if (requestBody.thread_id == "") {
            requestBody = { ...requestBody, thread_id: uuidv4().replace(/-/g, '').substring(0, 24) }
        }

        const response = await api.post('/user/datechat', requestBody);

        if (response.data?.status === "error") {
            toast.error('Server processing error.', {
                autoClose: 2000
            });
            return { message: 'Error retrieving response from server.' };
        }

        // toast.success('Message sent successfully!', {
        //     autoClose: 2000
        // });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.log('Failed to send message:', error);

        toast.error('Communication error.', {
            autoClose: 2000
        });

        return { message: 'We are currently experiencing technical difficulties. Our team is actively working on resolving the issue. Please try again shortly.' };
    }
};

export const fetchDateChatHistoryApi = async (threadId, setIsPageLoading) => {
    try {
        const response = await api.get(`/user/chat/datehistory/${threadId}`);

        if (response.data?.status !== "success") {
            return [{
                prompt: "Prompt",
                answer: `Error fetching chat history: ${response.data?.message || 'No details provided.'}`,
                isError: true
            }];
        }

        return response.data.data;
    } catch (error) {
        console.log('Failed to fetch chat history:', error);
        return [{
            prompt: "Prompt",
            answer: `Failed to retrieve chat history. Please try again later!`,
            isError: true
        }];
    } finally {
        setIsPageLoading(false);
    }
};

export const fetchSessionIdsByUser = async (ctype, uid, setChatSessions, setCurrentSession, setIsNewChat) => {
    try {
        const res = await api.get(`/user/sessions/${ctype}/${uid}`)
        console.log(res.data)
        setChatSessions(res.data)
        if (res.data.length > 0) {
            setCurrentSession(res.data[0])
        } else {
            setIsNewChat(true)
        }
    } catch (error) {
        console.log('Failed to fetch sessions:', error);
        toast.error('Failed to fetch sessions.', {
            autoClose: 2000
        });
        return { message: 'We are currently experiencing technical difficulties. Our team is actively working on resolving the issue. Please try again shortly.' };
    }
}