import { Link, Navigate } from "react-router-dom";
import { isLogin } from "../utils/auth";
import { useState } from "react";
import { ArrowLeft, PenLine } from "lucide-react";
import { Container } from "../components/ui/Container";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Alert } from "../components/ui/Alert";
import { Card, CardContent } from "../components/ui/Card";

const Create = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!isLogin()) {
    return <Navigate to="/login" replace />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !content) {
      setError("Please fill in all inputs");
      setSuccess("");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();

      if (res.ok && data.status === "ok") {
        setSuccess("Post Created Successfully!");
        setError("");
        setTitle("");
        setContent("");
      } else {
        setError(data.message || "Failed to create post.");
        setSuccess("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-zinc-50 py-8">
      <Container size="md">
        <Link
          to="/post"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to posts
        </Link>

        <PageHeader
          title="Create Post"
          description="Share your thoughts with the community."
        />

        <Card className="mt-6">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <Alert variant="error">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <Input
                label="Title"
                placeholder="Enter a catchy title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <Textarea
                label="Content"
                placeholder="Write your story here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button type="submit" icon={PenLine}>
                  Create Post
                </Button>
                <Link to="/post" className="sm:ml-auto">
                  <Button variant="secondary">Cancel</Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default Create;