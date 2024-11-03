import { toast } from "react-toastify";

export const handleSignup = async (e, formData, setFormData) => {
    e.preventDefault();

    try {
        const response = await fetch('http://127.0.0.1:8000/user/signup/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            toast.error('Signup failed!', {
                autoClose: 2000
            });
            throw new Error('Signup failed');
        }

        const data = await response.json();
        console.log('User signed up successfully:', data);
        setFormData({
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            user_type: '',
        })
        toast.success('Signup success!', {
            autoClose: 2000
        });
    } catch (error) {
        console.error('Error signing up:', error);
    }
};

export const handleLogin = async (e, loginData, setLoginData) => {
    e.preventDefault();

    try {
        const response = await fetch('http://localhost:8000/user/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        });

        if (!response.ok) {
            toast.error('Login failed!', {
                autoClose: 2000
            });
            throw new Error('Login failed');
        }

        const data = await response.json();
        console.log('User logged in successfully:', data);
        setFormData({
            email: '',
            password: '',
        })
        toast.success('Login success!', {
            autoClose: 2000
        });
    } catch (error) {
        console.error('Error logging in:', error);
    }
};