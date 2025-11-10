import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className='w-full h-screen flex flex-col justify-center items-center bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 text-white gap-4'>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <button onClick={handleGoHome} className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-white bg-[#2C3E50] hover:cursor-pointer transition-all duration-200 hover:scale-105'>Go Home</button>
    </div>
  )
}

export default NotFound