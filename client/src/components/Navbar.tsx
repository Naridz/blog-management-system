import { Link } from "react-router-dom"
import { isLogin } from "../utils/auth"
import { FileText, LogIn, UserPlus, LayoutGrid, LogOut } from "lucide-react";

const Navbar = () => {

  const handleLogout = (e: any) =>{
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.href = '/login'
  }
  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <Link to={"/"} className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-2 rounded-xl shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              BlogApp
            </span>
          </Link>

          <ul className="flex items-center gap-3">
            {!isLogin() ? (
              <>
                <li>
                  <Link 
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all duration-300" 
                    to={"/login"}
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all duration-300" 
                    to={"/register"}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register</span>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link 
                    to="/post" 
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300"
                  >
                    <LayoutGrid className="w-4 h-4" />
                    <span>Posts</span>
                  </Link>
                </li>
                <li>
                  <button 
                    onClick={handleLogout} 
                    className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navbar