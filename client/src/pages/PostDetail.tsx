import { useEffect, useState } from "react";
import { isLogin } from "../utils/auth";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ArrowLeft, User, Calendar, Edit2, Trash2, FileText } from "lucide-react";

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 text-lg font-medium">Post not found</p>
          <Link 
            to="/post" 
            className="inline-flex items-center gap-2 mt-4 text-blue-600 font-medium hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <Link
          to="/post"
          className="group inline-flex items-center gap-2 mb-8 text-slate-600 font-medium transition-all duration-300 hover:text-slate-900"
        >
          <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
          <span>Back to Posts</span>
        </Link>

        <article className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-12 border border-slate-100">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 leading-tight mb-6">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="font-medium text-slate-700">{post.username}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-lg prose-slate max-w-none">
            <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">
              {post.content}
            </p>
          </div>

          {/* Actions */}
          {currentUserId === post.author_id && (
            <div className="mt-12 pt-8 border-t border-slate-100 flex gap-4">
              <Link
                to={`/edit/${post.id}`}
                className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 ease-out hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit Post</span>
              </Link>
              <button
                onClick={handleDelete}
                className="group flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-red-500/25 transition-all duration-300 ease-out hover:shadow-xl hover:shadow-red-500/30 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </article>
      </div>
    </div>
  );
};

export default PostDetail;
