import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { isLogin } from "../utils/auth";
import { User, Mail, Lock, CheckCircle, AlertCircle, UserPlus } from "lucide-react";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmpassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (isLogin()) {
    return <Navigate to="/post" replace />;
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (password != confirmPassword) {
      setSuccess("");
      setError("Passwords do not match");
      return;
    }
    if (!username || !email || !password || !confirmPassword) {
      setSuccess("");
      setError("Please complete all fields");
      return;
    }
    if (username.length < 4 || username.length > 20) {
      setSuccess("");
      setError("Username must be 4-20 characters");
      return;
    }
    if (password.length < 8) {
      setSuccess("");
      setError("Password must be at least 8 characters");
      return;
    }
    try {
      const res = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (data.status === "exist") {
        setSuccess("");
        setError("Email already exists");
        return;
      }
      if (data.status === "ok") {
        setError("");
        setSuccess("Registered successfully! Please login.");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmpassword("");
      } else {
        console.log("Register failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-10 border border-slate-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Create Account</h1>
            <p className="text-slate-500">Join our community today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium animate-pulse">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                {success}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 focus:bg-white"
                  placeholder="Choose a username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 focus:bg-white"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 focus:bg-white"
                  placeholder="Create a password"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  onChange={(e) => setConfirmpassword(e.target.value)}
                  value={confirmPassword}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 focus:bg-white"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300 ease-out hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              <UserPlus className="w-5 h-5" />
              <span>Sign Up</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account?{" "}
              <Link 
                className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors" 
                to="/login"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
