import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { isLogin } from "../utils/auth";
import { LogIn } from "lucide-react";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Alert } from "../components/ui/Alert";
import { Card, CardContent } from "../components/ui/Card";

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
        setError("Invalid email or password");
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-zinc-50 flex items-center justify-center py-12 px-4">
      <Container size="sm" className="w-full">
        <Card>
          <CardContent className="p-8 md:p-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-zinc-900">Welcome back</h1>
              <p className="text-sm text-zinc-500 mt-1">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <Alert variant="error">{error}</Alert>}

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
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit" fullWidth icon={LogIn}>
                Sign In
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-500">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="font-medium text-zinc-900 hover:underline">
                Register
              </Link>
            </p>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default Login;
