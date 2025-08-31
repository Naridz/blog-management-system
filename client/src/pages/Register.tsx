import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { isLogin } from "../utils/auth";

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
      setError("Wrong password");
      return;
    }
    if (!username || !email || !password || !confirmPassword) {
      setSuccess("");
      setError("Complete all your inputs");
      return;
    }
    if (username.length < 4 || username.length > 20) {
      setSuccess("");
      setError("username must be 4-20 characters");
      return;
    }
    if (password.length < 8) {
      setSuccess("");
      setError("password must not less than 8");
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
        setError("email already exists");
        return;
      }
      if (data.status === "ok") {
        setError("");
        setSuccess("Registered successfully");
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
    <div className="flex-grow">
      <div className="flex justify-center items-center">
        <div className="w-[400px] shadow-xl p-10 mt-5 rounded-xl">
          <h3 className="text-2xl">Register</h3>
          <hr className="my-3 text-gray-200" />
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-600 w-fit text-white text-sm py-1 px-3 mt-2 rounded-md">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-600 w-fit text-white text-sm py-1 px-3 mt-2 rounded-md">
                {success}
              </div>
            )}
            <input
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-200 py-2 px-3 rounded text-lg my-2"
              value={username}
              placeholder="Enter your name"
            />
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-200 py-2 px-3 rounded text-lg my-2"
              value={email}
              placeholder="Enter your email"
            />
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-200 py-2 px-3 rounded text-lg my-2"
              value={password}
              placeholder="Enter your password"
            />
            <input
              type="password"
              onChange={(e) => setConfirmpassword(e.target.value)}
              className="w-full bg-gray-200 py-2 px-3 rounded text-lg my-2"
              value={confirmPassword}
              placeholder="Confirm your password"
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white border py-2 px-3 my-2 rounded text-lg"
            >
              Sign Up
            </button>
            <hr className="my-3 text-gray-200" />
            <p>
              <Link className="text-blue-700 hover:underline" to="/login">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
