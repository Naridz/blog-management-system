import { Navigate, useNavigate, useParams } from "react-router-dom";
import { isLogin } from "../utils/auth";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { ArrowLeft, AlertCircle, Save } from "lucide-react";

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
  if (!isLogin()) {
    return <Navigate to="/login" replace />;
  }

  const decoded: DecodedToken = jwtDecode(token!);
  const currentUserId = decoded.id;

  useEffect(() => {
    const fetchPost = async () => {
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
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="flex items-center gap-3 p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 font-medium">
        <AlertCircle className="w-5 h-5" />
        {error}
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 md:p-10 border border-slate-100">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 mb-8 text-slate-600 font-medium transition-all duration-300 hover:text-slate-900 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Go Back</span>
          </button>

          <h1 className="text-3xl font-bold text-slate-800 mb-8">Edit Post</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Title</label>
              <input
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 focus:bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Content</label>
              <textarea
                placeholder="Write your content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100/50 focus:bg-white h-48 resize-none leading-relaxed"
              />
            </div>

            <div className="pt-4 flex gap-4">
              <button
                type="submit"
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3.5 px-8 rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300 ease-out hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3.5 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Edit;
