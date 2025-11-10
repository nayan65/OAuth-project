import { createContext, useEffect, useState } from "react";
import { toast, Zoom } from 'react-toastify';
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const navigate = useNavigate();

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [userData, setUserData] = useState(() => {
        const saved = localStorage.getItem("userData");
        return saved ? JSON.parse(saved) : null;
    });
    const [isLoggedin, setIsLoggedin] = useState(() => {
        // Initialize from localStorage
        return localStorage.getItem('isLoggedin') === 'true';
    });

    useEffect(() => {
        if (userData) {
            localStorage.setItem("userData", JSON.stringify(userData));
        } else {
            localStorage.removeItem("userData");
        }
    }, [userData]);


    useEffect(() => {
        localStorage.setItem('isLoggedin', isLoggedin);
    }, [isLoggedin]);
    const getAuthState = async () => {
        // console.log("get auth state")
        try {
            const response = await fetch(backendUrl + '/is-Auth', {
                method: "get", credentials: 'include'
            })
            const data = await response.json();
            // console.log(`get auth state ${data}`)

            if (data.success) {
                setIsLoggedin(true)
                getUserData()
            }else{
                setIsLoggedin(false)
                setUserData(null)
            }
        } catch (error) {
            // toast.error(error.message,{theme: "colored"})
            console.log(error.message);

        }
    }

    useEffect(() => {
        getAuthState();

    }, [])

    const getUserData = async () => {
        // console.log("user data")
        try {
            const response = await fetch(backendUrl + '/user/data', {
                method: "get",
                credentials: "include" // Include cookies in the request
            })
            const data = await response.json();
            // console.log("res getuserdata",data);
            if (data.success === false) {
                toast.warning("Session expired. Please log in again.", { transition: Zoom, autoClose: 2000 });
                logout();
                navigate("/login");
                return null;
            }
            
            // console.log("user data",data);

            data.success ? setUserData(data.userData) : toast.error(data.message, { theme: "colored" })


        } catch (error) {
            // toast.error(data.message,{theme: "colored"})
            console.log(error.message);
            // console.log(data.message);

        }
    }

    const logout = async () => {
        try {
            const response = await fetch(backendUrl + '/logout', {
                method: "POST", credentials: 'include'
            })
            const data = await response.json();

            data.success && setIsLoggedin(false)
            data.success && setUserData(false)
            localStorage.removeItem("userData");
            toast.success(data.message, { transition: Zoom, autoClose: 1500, draggable: true, });
            navigate("/login")

        } catch (error) {
            // toast.error(error.message,{theme: "colored"});
            console.log(error.message);

        }
    }

    const value = {
        backendUrl, isLoggedin, setIsLoggedin, userData, setUserData, getUserData, logout
    }


    return (
        <AppContext.Provider value={value}>
            {props.children}

        </AppContext.Provider>
    )
}