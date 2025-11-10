import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';

import Home from './pages/Home'
import Login from './pages/Login'
import Layout from './Layout';
import NotFound from './pages/NotFound';
import Profile from './protectedRoutes/Profile';
import ProtectedRoute from './protectedRoutes/ProtectedRoutes';

function App() {

  return (

    <div>
      <ToastContainer theme="dark" />
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/profile' element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Route>
        <Route path='/signup' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>

  )
}

export default App
