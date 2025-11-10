import { useContext } from 'react'
import { GoArrowRight } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast, Zoom } from 'react-toastify';
import { useGoogleLogin } from '@react-oauth/google';
import logo from '../assets/logo.png'
const Navbar = () => {

  const navigate = useNavigate()
  const { userData, backendUrl, setUserData, setIsLoggedin, getUserData, logout } = useContext(AppContext)

 

  const linkGoogleAccount = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (response) => {
      try {
        const res = await fetch(`${backendUrl}/user/link/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ code: response.code }),
          credentials: "include"
        });
        if (res.status === 401 || res.status === 403) {
          toast.warning("Session expired. Please log in again.", {transition: Zoom, autoClose: 2000 });
          logout();
          navigate("/login");
          return null;
        }
        const data = await res.json();
        if (data.success) {
          toast.success("Google account linked!", { transition: Zoom, autoClose: 1500 });
          await getUserData();
        } else {
          toast.error(data.message, { transition: Zoom, autoClose: 1500 });
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  const unlinkGoogle = async () => {
    const confirmed = window.confirm("Are you sure you want to unlink your Google account?");
    if (!confirmed) return;
    try {
      const res = await fetch(`${backendUrl}/user/unlink/google`, {
        method: "POST",
        credentials: "include"
      });
      if (res.status === 401 || res.status === 403) {
        toast.warning("Session expired. Please log in again.", {transition: Zoom, autoClose: 2000 });
        logout();
        navigate("/login");
        return null;
      }
      const data = await res.json();

      if (data.success) {
        toast.success("Google account unlinked", { transition: Zoom, autoClose: 1500 });
        await getUserData();
      } else {
        toast.error(data.message, { transition: Zoom, autoClose: 1500 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0 text-white'>
      <div className='w-20 hover:cursor-pointer' onClick={() => navigate('/')}>
        <img src={logo} alt="logo" />
      </div>
      
      {userData ? (
        <div className="relative group">
          {/* Profile Circle */}
          <div className="w-9 h-9 flex justify-center items-center rounded-full bg-gray-900 text-white font-semibold cursor-pointer shadow-md hover:shadow-lg transition-all duration-200 ">
            {userData.name?.[0]?.toUpperCase()}
          </div>
          <div className="absolute top-8 right-0 w-48 h-4 bg-transparent"></div>
          {/* Dropdown */}
          <div
            className="absolute right-0 top-10 hidden group-hover:flex flex-col w-52 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden animate-fadeIn z-20"
          >
            <button
              onClick={() => navigate('/profile')}
              className="px-4 py-2 text-[16px] text-gray-700 hover:bg-gray-100 transition-colors text-left hover:cursor-pointer"
            >
              Profile
            </button>

            {/* Show only if account NOT linked */}
            {!userData?.providers?.google && (
              <button
                onClick={() => linkGoogleAccount()}
                className="px-4 py-2 text-[16px] text-gray-700 hover:bg-gray-100 transition-colors text-left hover:cursor-pointer"
              >
                Link Google Account
              </button>
            )}

            {/* Show only if account IS linked */}
            {userData?.providers?.google && (
              <button
                onClick={() => unlinkGoogle()}
                className="px-4 py-2 text-[16px] text-gray-700 hover:bg-gray-100 transition-colors text-left hover:cursor-pointer"
              >
                Unlink Google Account
              </button>
            )}

            <button
              onClick={logout}
              className="px-4 py-2 text-[16px] text-red-600 hover:bg-red-50 transition-colors text-left border-t border-gray-200 hover:cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate('/signup')}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-white bg-[#2C3E50] hover:cursor-pointer transition-all duration-200 hover:scale-105"
        >
          Sign Up <GoArrowRight />
        </button>
      )}


    </div>
  )
}

export default Navbar