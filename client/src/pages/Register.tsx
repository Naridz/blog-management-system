import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { isLogin } from "../utils/auth";
import { UserPlus } from "lucide-react";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Alert } from "../components/ui/Alert";
import { Card, CardContent } from "../components/ui/Card";

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

  const handleSubmit = async (e: React.FormEvent) => {
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
    <div className="min-h-[calc(100vh-3.5rem)] bg-zinc-50 dark:bg-[#0f0f11] flex items-center justify-center py-12 px-4">
      <Container size="sm" className="w-full">
        <Card>
          <CardContent className="p-8 md:p-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Create account</h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Get started with Blog</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <Alert variant="error">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Input
                type="text"
                label="Username"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <Input
                type="email"
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                type="password"
                label="Password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Input
                type="password"
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmpassword(e.target.value)}
              />

              <Button type="submit" fullWidth icon={UserPlus}>
                Sign Up
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-zinc-900 dark:text-zinc-50 hover:underline">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default Register;
