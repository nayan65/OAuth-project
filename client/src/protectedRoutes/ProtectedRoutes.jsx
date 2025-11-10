import  { useContext } from 'react';
import { Navigate,useLocation  } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const ProtectedRoute = ({ children }) => {
  const { isLoggedin } = useContext(AppContext);
  const location = useLocation();

  if (!isLoggedin) {

    return <Navigate to="/login" state={{ from: location }} replace />;
  }
    return children;
  };


export default ProtectedRoute;
