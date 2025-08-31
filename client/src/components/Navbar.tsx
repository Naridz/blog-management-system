import { Link } from "react-router-dom"
import { isLogin } from "../utils/auth"
import reactLogo from '../assets/react.svg';

const Navbar = () => {

  const handleLogout = (e:any) =>{
    e.preventDefault();
    alert("Logout")
    localStorage.removeItem("token");
    window.location.href = '/login'
  }
  return (
    <nav className="shadow-xl text-gray-300 bg-gray-800">
      <div className="container mx-auto">
        <div className="flex justify-between items-center p-8">
          <div>
            <Link to={"/"}><img src={reactLogo} alt="React Logo" className="w-10 h-10" /></Link>
          </div>
          <ul className="flex">
            {!isLogin() ? (
              <>
              <li className='mx-3'><Link className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition duration-300" to={"/login"}>Login</Link></li>
              <li className='mx-3'><Link className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300" to={"/register"}>Register</Link></li>
              </>
            ):(
            <li className='mx-3'>
                <Link to="/post" className='bg-gray-500 hover:bg-gray-600 text-white mx-4 font-semibold py-2 px-4 rounded transition duration-300'>Post</Link>
						    <button onClick={handleLogout} className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded cursor-pointer transition duration-300'>Logout</button>
            </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar