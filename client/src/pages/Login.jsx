import { useContext, useState } from 'react'
import { IoMdPerson } from "react-icons/io";
import { MdOutlineEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { useGoogleLogin } from '@react-oauth/google';
import { toast, Zoom } from 'react-toastify';
import logo from '../assets/logo.png'

const Login = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    // console.log(from)

    const { backendUrl, isLoggedin, setIsLoggedin, getUserData } = useContext(AppContext)

    const [state, setState] = useState('Sign Up');
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const responseGoogle = async (response) => {

        try {
            if (response.code) {
                // console.log("Google login success, code:", response.code);

                const res = await fetch("http://localhost:3000/google", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        code: response.code
                    }),
                    credentials: "include"
                })
                if (res.ok) {
                    const data = await res.json();
                    // console.log(data);
                    if (data.success) {
                        setIsLoggedin(true)
                        await getUserData();
                        toast.success(data.message, { transition: Zoom, autoClose: 1500 })
                        navigate(from, { replace: true })
                        // navigate('/')
                    } else {
                        toast.error(data.message, { theme: "colored", draggable: true, })
                        console.log(data.message);

                    }
                } else {
                    console.error("Server responded with an error:", res.statusText);
                }

            } else {
                console.error("Google login failed, no code received");
            }
        } catch (error) {
            console.error('Error while requesting google code:', error)
        }


    }

    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: (err) => {
            console.error("Google login error:", err);
        },
        flow: 'auth-code',
    });


    const onSubmitHandler = async (e) => {
        try {
            e.preventDefault();
            if (!backendUrl) {
                console.error('Backend URL is not defined');
                return;
            }
            if (state === 'Sign Up') {
                const response = await fetch(backendUrl + '/register', { //await fetch(`${backendUrl}/register`) can use this way url
                    method: "POST", headers: {
                        "Content-Type": "application/json",  // Add headers
                    }, body: JSON.stringify({ name, email, password }), credentials: 'include'
                })
                const data = await response.json();
                // console.log(data);
                if (data.success) {
                    // setIsLoggedin(true)
                    // getUserData();
                    toast.success(data.message, { transition: Zoom, draggable: true, autoClose: 1500 })
                    setState('Login');
                    setName('');
                    setEmail('');
                    setPassword('');
                    navigate('/login', { state: location.state })
                } else {
                    toast.error(data.message,{theme: "colored", draggable: true, autoClose: 1500 })
                    // console.log(data.message);

                }
            } else {

                const response = await fetch(backendUrl + '/login', {
                    method: "POST", headers: {
                        "Content-Type": "application/json",  // Add headers
                    }, body: JSON.stringify({ email, password }), credentials: 'include'
                })
                if (response.ok) {
                    const data = await response.json();
                    console.log(data);
                    if (data.success) {
                        setIsLoggedin(true)
                        await getUserData();
                        toast.success(data.message, { transition: Zoom, draggable: true, autoClose: 1500 })
                        // console.log("login", from)
                        navigate(from, { replace: true })
                        // navigate('/')
                        // navigate('/other')
                    } else {
                        toast.error(data.message, { theme: "colored", draggable: true, autoClose: 2000 })
                        // console.log(data.message);

                    }
                }
            }
        } catch (error) {
            // toast.error(error.message,{theme: "colored"})
            console.log(error.message);

        }
    }

    return (
        <>
            {isLoggedin ? <Navigate to="/" />
                :
                <div>
                    <div onClick={() => navigate('/')} className='absolute left-5 sm:left-24 top-6 w-20 cursor-pointer text-white'><img src={logo} alt="logo" /></div>

                    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600'>

                        <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
                            <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign Up' ? "Create account" : "Login"}</h2>
                            <p className='text-center text-sm mb-6'>{state === 'Sign Up' ? "Create your account" : "Login to your account!"}</p>

                            <form onSubmit={onSubmitHandler} >
                                {state === 'Sign Up' && (<div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                                    <IoMdPerson />
                                    <input onChange={e => setName(e.target.value)} value={name} className='bg-transparent outline-none' type="text" placeholder='Full Name' required />
                                </div>
                                )}

                                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                                    <MdOutlineEmail />
                                    <input onChange={e => setEmail(e.target.value)} value={email} className='bg-transparent outline-none' type="email" placeholder='Email Id' required />
                                </div>
                                <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
                                    <FaLock />
                                    <input onChange={e => setPassword(e.target.value)} value={password} className='bg-transparent outline-none' type="password" placeholder='Password' required />
                                </div>
                                <p className='cursor-pointer mb-4 text-indigo-500'>Forget Password</p>

                                <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium hover:cursor-pointer'>{state}</button>
                            </form>
                            <p className="flex items-center text-sm mt-4 text-white">
                                <span className="flex-grow border-t border-gray-200"></span>
                                <span className="mx-3 text-gray-200">Or continue</span>
                                <span className="flex-grow border-t border-gray-200"></span>
                            </p>

                            <button onClick={googleLogin} className='w-full py-2.5 my-2 rounded-full bg-gradient-to-r from-slate-200 to-slate-400 text-gray-800 font-medium hover:cursor-pointer'>{state === 'Sign Up' ? "Sign Up" : "Login"} With Google</button>

                            {state === 'Sign Up' ? (<p className='text-gray-200 text-center text-sm mt-4'>Already have an account?{' '}
                                <span onClick={() => { setState('Login'); navigate('/login', { state: location.state }); setName(''); setEmail(''); setPassword(''); }} className='text-indigo-500 cursor-pointer underline'>Login here</span>
                            </p>)
                                : (<p className='text-gray-400 text-center text-sm mt-4'>Don't have an account?{' '}
                                    <span onClick={() => { setState('Sign Up'); navigate('/signup', { state: location.state }); setName(''); setEmail(''); setPassword(''); }} className='text-indigo-500 cursor-pointer underline'>Sign Up</span>
                                </p>
                                )}

                        </div>
                    </div>
                </div>
            }

        </>
    )
}

export default Login