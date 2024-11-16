import api from "@/axios/axios";
import { toast } from "react-toastify";

export const handleSignup = async (e, formData, setFormData, router) => {
    e.preventDefault();

    try {
        const response = await api.post('/user/signup/', formData);

        if (response.data?.status == "error") {
            toast.error(response.data?.message, { autoClose: 2000 });
            return;
        }

        const data = response.data;
        console.log(data);
        setFormData({
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            user_type: '',
        });
        router.push('/login')
        // toast.success('Signup success!', { autoClose: 2000 });
    } catch (error) {
        console.log('Error signing up:', error);
        toast.error(error?.message, { autoClose: 2000 });
    }
};

export const handleLogin = async (e, loginData, setLoginData, router, setUser, setIsLoggedIn) => {
    e.preventDefault();

    try {
        const response = await api.post('/user/login/', loginData);

        const data = response.data;
        if (data?.stat === "error") {
            toast.error('Invalid credentials!', { autoClose: 2000 });
            return;
        }

        setLoginData({
            email: '',
            password: '',
        });

        setUser(data["user_data"]);
        setIsLoggedIn(true);
        localStorage.setItem("user", JSON.stringify(data));
        router.push("/");

        // toast.success('Login success!', { autoClose: 2000 });
    } catch (error) {
        console.log('Error logging in:', error);
        toast.error('Login failed!', { autoClose: 2000 });
    }
};

export const handleLogout = async (router, setUser, setIsLoggedIn) => {
    try {
        localStorage.removeItem("user");
        setUser(null);
        setIsLoggedIn(false);

        router.push("/login");

        toast.success('Logout successful!', { autoClose: 2000 });
    } catch (error) {
        console.log('Error logging out:', error);
        toast.error('Error logging out!', { autoClose: 2000 });
    }
};

export const getUserByID = async(id, setData, setError, setLoading) => {
    try {
        const response = await api.get(`/user/users/${id}`);
        const data = response.data?.data;
        if (data) {
            let userObj = {
                first_name: data.first_name,
                last_name: data.last_name,
                email: data.email,
                id: data._id, // Update the ID field as per API response
                user_type: data.user_type,
            };
            setData(userObj);
        } else {
            setError("User not found");
        }
    } catch (error) {
        setError(error?.message || 'An error occurred');
        console.log('Error fetching user by ID:', error);
    } finally {
        setLoading(false);
    }
};
