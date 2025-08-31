import { Link, Navigate } from "react-router-dom";
import { isLogin } from "../utils/auth";
import { useEffect, useState } from "react";

interface PostType {
  id: number;
  title: string;
  content: string;
  username: string;
  created_at: string;
}

const Post = () => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  if (!isLogin()) {
    return <Navigate to="/login" replace />;
  }

  const fetchPosts = async (query = "") => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = query
        ? `http://localhost:4000/api/posts/search/q?q=${encodeURIComponent(query)}`
        : "http://localhost:4000/api/posts";

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setPosts(data.posts || []);
      } else {
        setError(data.message || "Failed to load posts");
      }
    } catch (error) {
      setError("Error fetching posts");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchPosts(search);
    setSearch("");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <form onSubmit={handleSearch} className="mb-6">
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-400 rounded-full py-2 px-3 mr-2"
          />
          <button
            type="submit"
            className="bg-sky-600 text-white py-2 px-4 rounded-full hover:bg-sky-700 transition"
          >
            Search
          </button>
        </form>
        <button>
          <Link
            className="bg-green-600 text-white py-3 px-4 rounded-full hover:bg-green-700 transition"
            to={"/create"}
          >
            Create New Post
          </Link>
        </button>
      </div>
      {error && <p className="text-red-600">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {posts.length === 0 && !loading && <p>No posts found.</p>}
        {posts.map((post) => (
          <div
            key={post.id}
            className="border-2 rounded-xl p-4 flex flex-col justify-between min-h-[250px] shadow-md"
          >
            <Link to={`/post/${post.id}`}>
              <h2 className="text-3xl p-2 hover:bg-gray-200 rounded-lg font-semibold mb-2">
                {post.title}
              </h2>
            </Link>
            <hr className="my-2" />
            <p className="my-3 line-clamp-3">{post.content}</p>
            <div className="text-sm text-gray-600 mt-auto">
              <p>
                By: <span className="font-bold">{post.username}</span>
              </p>
              <p>
                Created:{" "}
                {new Date(post.created_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Post;
