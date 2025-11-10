import { useContext, useState, useEffect } from 'react'
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast, Zoom } from 'react-toastify';

const UpdateProfile = () => {
    const navigate = useNavigate();

    const { userData, backendUrl, setUserData, logout } = useContext(AppContext)

    const [name, setName] = useState(userData?.name || '');
    const [email, setEmail] = useState(userData?.email || '');
    const [phone, setPhone] = useState(userData?.phone || '');

    useEffect(() => {
        if (userData) {
            setName(userData.name || '');
            setEmail(userData.email || '');
            setPhone(userData.phone || '');
        }
    }, [userData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${backendUrl}/user/update-profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, phone }),
                credentials: 'include',
            });
            const data = await res.json();
            // console.log("handlesubmit updateprofile: ",data)
            if (data.success===false) {
                toast.warning("Session expired. Please log in again.", { transition: Zoom, autoClose: 2000 });
                logout();
                navigate("/login");
                return null;
            }

            if (res.ok) {
                await setUserData(data.user);
                toast.success(data.message, { transition: Zoom, draggable: true, autoClose: 1500 });
                navigate('/profile');
            } else {
                toast.error(data.message, { theme: 'colored', draggable: true, });
            }
        } catch (error) {
            console.error(error);
            toast.error('Something went wrong. Please try again.', { theme: 'colored', draggable: true, });
        }
    };

    return (
        <>
            <div className='min-h-screen bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 text-white'>
                <div className='flex justify-center items-center min-h-[calc(100vh-4rem)] bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 text-white pt-16 '>
                    <div className='flex flex-col gap-3 bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300'>

                        <h1 className="text-2xl font-semibold text-center text-white">Update Profile</h1>

                        <div className="flex justify-center">
                            <div className="w-22 h-22 flex justify-center items-center rounded-full bg-black text-white text-3xl">
                                {name ? name[0].toUpperCase() : userData?.name?.[0]?.toUpperCase()}
                            </div>
                        </div>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-300 font-medium" htmlFor="name">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    onChange={e => {
                                        const input = e.target.value;
                                        setName(input.charAt(0).toUpperCase() + input.slice(1));
                                    }}
                                    value={name}
                                    className="bg-[#333A5C] outline-none w-full text-white px-4 py-2.5 rounded-md focus:ring-2 focus:ring-indigo-500 capitalize"
                                    type="text"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-300 font-medium" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    onChange={e => setEmail(e.target.value.toLowerCase())}
                                    value={email}
                                    className="bg-[#333A5C] outline-none w-full text-white px-4 py-2.5 rounded-md focus:ring-2 focus:ring-indigo-500 lowercase"
                                    type="email"
                                    placeholder="Enter your email address"
                                    required

                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm text-gray-300 font-medium" htmlFor="phone">
                                    Phone Number
                                </label>
                                <input
                                    id="phone"
                                    onChange={e => {
                                        const digitsOnly = e.target.value.replace(/\D/g, '');
                                        const limited = digitsOnly.slice(0, 10);
                                        setPhone(limited);
                                    }}
                                    value={phone}
                                    className="bg-[#333A5C] outline-none w-full text-white px-4 py-2.5 rounded-md focus:ring-2 focus:ring-indigo-500"
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    pattern="[0-9]{10}"
                                    inputMode="numeric"

                                />
                            </div>

                            <button
                                type="submit"
                                className="mt-4 w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium hover:cursor-pointer hover:opacity-90 transition-all"
                            >
                                Save Changes
                            </button>
                        </form>
                    </div>


                </div>
            </div>
        </>
    )
}

export default UpdateProfile