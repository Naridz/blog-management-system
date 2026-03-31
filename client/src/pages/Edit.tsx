import { Navigate, useNavigate, useParams } from "react-router-dom";
import { isLogin } from "../utils/auth";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { ArrowLeft, Save } from "lucide-react";
import { Container } from "../components/ui/Container";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Textarea } from "../components/ui/Textarea";
import { Alert } from "../components/ui/Alert";
import { Card, CardContent } from "../components/ui/Card";
import { LoadingPage } from "../components/ui/Loading";

type DecodedToken = {
  id: number;
  email: string;
  exp: number;
};

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  if (!isLogin()) {
    return <Navigate to="/login" replace />;
  }

  const decoded: DecodedToken = jwtDecode(token!);
  const currentUserId = decoded.id;

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:4000/api/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.status === "ok") {
          const post = data.post;
          if (currentUserId !== post.author_id) {
            alert("You are not authorized to edit this post.");
            navigate("/post");
            return;
          }
          setTitle(post.title);
          setContent(post.content);
        } else {
          setError("Post not found.");
        }
      } catch (err) {
        setError("Error loading post.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/api/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Post updated successfully!");
        navigate(`/post/${id}`);
      } else {
        setError(data.message || "Failed to update post.");
      }
    } catch (err) {
      setError("Something went wrong.");
    }
  };

  if (loading) {
    return <LoadingPage text="Loading editor..." />;
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-zinc-50 dark:bg-[#0f0f11] py-8">
        <Container size="md">
          <Alert variant="error">{error}</Alert>
          <Button variant="secondary" className="mt-4" onClick={() => navigate("/post")}>
            Back to Posts
          </Button>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-zinc-50 dark:bg-[#0f0f11] py-8">
      <Container size="md">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </button>

        <PageHeader title="Edit Post" description="Make changes to your post." />

        <Card className="mt-6">
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Title"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <Textarea
                label="Content"
                placeholder="Write your content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button type="submit" icon={Save}>
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate(-1)}
                  className="sm:ml-auto"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default Edit;
