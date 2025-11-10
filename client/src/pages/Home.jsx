import Navbar from '../components/Navbar'
import Header from '../components/Header'

const Home = () => {
  
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600'>
        <Navbar/>
        <Header/>
    </div>
  )
}

export default Home