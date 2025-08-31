import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { isLogin } from "../utils/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (isLogin()) {
    return <Navigate to="/post" replace />;
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.status === "ok") {
        localStorage.setItem("token", data.token);
        alert("Login success");
        window.location.href = "/post";
      } else {
        setError("Invalid password");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex-grow">
      <div className="flex justify-center items-center">
        <div className="w-[400px] shadow-xl p-10 mt-5 rounded-xl">
          <h3 className="text-2xl">Login</h3>
          <hr className="my-3 text-gray-200" />
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-600 w-fit text-white text-sm py-1 px-3 mt-2 rounded-md">
                {error}
              </div>
            )}
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-200 py-2 px-3 rounded text-lg my-2"
              placeholder="Enter your email"
            />
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-200 py-2 px-3 rounded text-lg my-2"
              placeholder="Enter your password"
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white border py-2 px-3 my-2 rounded text-lg"
            >
              Sign In
            </button>
            <hr className="my-3 text-gray-200" />
            <p>
              <Link className="text-blue-700 hover:underline" to="/register">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
