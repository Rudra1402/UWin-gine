import { toast } from "react-toastify";

export const handleSignup = async (e, formData, setFormData) => {
    e.preventDefault();

    try {
        const response = await fetch('http://54.147.167.63:8000/user/signup/', {
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
            return
        }

        const data = await response.json();
        console.log(data)
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

export const handleLogin = async (e, loginData, setLoginData, router, setUser, setIsLoggedIn) => {
    e.preventDefault();

    try {
        const response = await fetch('http://54.147.167.63:8000/user/login/', {
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
            return
        }


        const data = await response.json();
        
        if(data?.stat == "error") {
            toast.error('Invalid credentials!', {
                autoClose: 2000
            })
            return
        }

        setLoginData({
            email: '',
            password: '',
        })

        setUser(data["user_data"])
        setIsLoggedIn(true)
        localStorage.setItem("user", JSON.stringify(data))
        router.push("/")

        toast.success('Login success!', {
            autoClose: 2000
        });
    } catch (error) {
        console.error('Error logging in:', error);
    }
};