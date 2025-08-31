import { useEffect, useState } from "react";
import { isLogin } from "../utils/auth";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

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
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you ?")) return;

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
  if (!post) return <div className="p-8">Post not found.</div>;
  return (
    <div className="container mx-auto p-8">
      <Link
        to="/post"
        className="inline-block mb-6 px-4 py-3 rounded-full font-medium transition cursor-pointer bg-slate-800 text-white hover:bg-slate-700"
      >
        ← Back
      </Link>
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-gray-500 text-sm mb-4">
        By <p className="inline font-bold">{post.username}</p> on {new Date(post.created_at).toLocaleString()}
      </p>
      <hr/>
      <p className="text-lg my-2">{post.content}</p>

      {currentUserId === post.author_id && (
        <div className="mt-10 flex gap-4">
          <Link
            to={`/edit/${post.id}`}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
