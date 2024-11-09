"use client";

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar/LoginNavbar';
import { getUserByID } from '@/apis/userApis';

interface UserData {
    first_name: string;
    last_name: string;
    email: string;
    id: string;
}

const ProfilePage = () => {
    // const router = useRouter();
    const [data, setData] = useState<UserData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const user = localStorage.getItem("user")
        if(user) {
            let jsonUser = JSON.parse(user);
            jsonUser = jsonUser["user_data"]
            getUserByID(jsonUser?.id, setData, setError);
            setLoading(false);
        }
    }, [data]);

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    if (loading || !data) {
        return <div className="text-center">Loading user profile...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-3xl mx-auto py-12 px-6">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        {data.first_name} {data.last_name}
                    </h2>
                    <p className="text-gray-600">{data.email}</p>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
