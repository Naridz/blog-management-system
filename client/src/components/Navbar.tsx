import { Link, useLocation } from "react-router-dom";
import { isLogin } from "../utils/auth";
import { FileText, Plus, LayoutGrid, LogOut, User } from "lucide-react";
import { Button } from "./ui/Button";

const Navbar = () => {
  const location = useLocation();
  const loggedIn = isLogin();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-zinc-900">Blog</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-1">
            {loggedIn ? (
              <>
                <Link
                  to="/post"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/post")
                      ? "bg-zinc-100 text-zinc-900"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4" />
                    <span className="hidden sm:inline">Posts</span>
                  </span>
                </Link>
                <Link
                  to="/create"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/create")
                      ? "bg-zinc-100 text-zinc-900"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">New</span>
                  </span>
                </Link>
                <div className="h-4 w-px bg-zinc-200 mx-2" />
                <Button
                  variant="ghost"
                  size="sm"
                  icon={LogOut}
                  onClick={handleLogout}
                >
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive("/login")
                      ? "bg-zinc-100 text-zinc-900"
                      : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>Login</span>
                  </span>
                </Link>
                <Link to="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;