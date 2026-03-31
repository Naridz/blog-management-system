import { useEffect, useState } from "react";
import { isLogin } from "../utils/auth";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ArrowLeft, User, Calendar, Edit2, Trash2, FileText } from "lucide-react";
import { Container } from "../components/ui/Container";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Card, CardContent } from "../components/ui/Card";
import { LoadingPage } from "../components/ui/Loading";

interface Post {
  id: number;
  title: string;
  content: string;
  author_id: number;
  username: string;
  created_at: string;
}

interface TokenPayload {
  id: number;
  email: string;
  exp: number;
}

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  if (!isLogin()) {
    return <Navigate to="/login" replace />;
  }

  const token = localStorage.getItem("token");
  let currentUserId: number | null = null;

  if (token) {
    const decoded = jwtDecode<TokenPayload>(token);
    currentUserId = decoded.id;
  }

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://localhost:4000/api/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.status === "ok") {
          setPost(data.post);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`http://localhost:4000/api/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert("Post deleted successfully!");
        navigate("/post");
      } else {
        alert(data.message || "Delete failed.");
      }
    } catch (err) {
      alert("Something went wrong.");
    }
  };

  if (loading) {
    return <LoadingPage text="Loading post..." />;
  }

  if (!post) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-zinc-50 dark:bg-[#0f0f11] py-8">
        <Container size="md">
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">Post not found</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 mb-6">The post may have been deleted.</p>
            <Link to="/post">
              <Button variant="secondary" icon={ArrowLeft}>Back to Posts</Button>
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const isAuthor = currentUserId === post.author_id;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-zinc-50 dark:bg-[#0f0f11] py-8">
      <Container size="lg">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/post"
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to posts
          </Link>

          {isAuthor && (
            <div className="flex items-center gap-2">
              <Link to={`/edit/${post.id}`}>
                <Button variant="secondary" size="sm" icon={Edit2}>
                  Edit
                </Button>
              </Link>
              <Button variant="danger" size="sm" icon={Trash2} onClick={handleDelete}>
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Post Content */}
        <Card>
          <CardContent className="p-8 md:p-12">
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <Badge variant="secondary">
                <User className="w-3 h-3 mr-1" />
                {post.username}
              </Badge>
              <Badge variant="outline">
                <Calendar className="w-3 h-3 mr-1" />
                {new Date(post.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight mb-8">
              {post.title}
            </h1>

            {/* Content */}
            <div className="prose prose-zinc prose-lg max-w-none">
              <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-200 leading-relaxed">
                {post.content}
              </p>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default PostDetail;
