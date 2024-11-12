"use client";

import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar/LoginNavbar';
import { getUserByID } from '@/apis/userApis';
import {capitalizeFirstLetter} from '../../utils/capitalizeFirstLetter'

interface UserData {
    first_name: string;
    last_name: string;
    email: string;
    id: string;
    user_type: string;
}

const ProfilePage = () => {
    const [data, setData] = useState<UserData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            const jsonUser = JSON.parse(user)?.user_data;
            getUserByID(jsonUser?.id, setData, setError, setLoading);
        } else {
            setLoading(false);
            setError("User not logged in!");
        }
    }, []);

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center text-red-600 text-xl font-semibold">{error}</div>
            </div>
        );
    }

    if (loading || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center text-gray-600 text-xl font-semibold">Loading user profile...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="max-w-3xl mx-auto p-6">
                <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-blue-400 flex items-center justify-center text-3xl text-white font-semibold mb-4">
                        {capitalizeFirstLetter(data.first_name[0])}{capitalizeFirstLetter(data.last_name[0])}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">
                        {capitalizeFirstLetter(data.first_name)} {capitalizeFirstLetter(data.last_name)}
                    </h2>
                    <p className="text-gray-600 mb-3 mt-1">{data.email}</p>
                    <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                        {data.user_type.toUpperCase()}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
