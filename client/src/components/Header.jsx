import { useContext } from 'react'
import { MdBackHand } from "react-icons/md";
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const {userData}=useContext(AppContext)
  const navigate = useNavigate();
  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800 '>
        {/* <img src="" alt="" className='w-36 h-36 rounded-full mb-6' /> */}
        <h1 className='flex
         items-center gap-2 text-xl sm:text-3xl font-medium mb-2 text-[#D1D5DB]'>Hey {userData?userData.name.charAt(0).toUpperCase() + userData.name.slice(1):"Developer"}! <MdBackHand className='w-8 aspect-square'/>
         </h1>
        <h2 className='text-3xl sm:text-5xl font-semibold mb-4 text-[#FBBF24]'>Welcome to our app</h2>
        <p className='mb-5
         max-w-md text-[#D1D5DB]'>Let's start with quick product tour and we will have you up and running in no time!</p>
        <button 
        onClick={() => navigate('/profile')}
        className='border
         border-gray-500 rounded-full px-8 py-2.5 bg-[#2C3E50] text-white hover:cursor-pointer transition-all duration-200 hover:scale-105'>Go to Profile</button>
        

    </div>
  )
}

export default Header