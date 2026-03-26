import { Link, Navigate } from "react-router-dom";
import { isLogin } from "../utils/auth";
import { useEffect, useState } from "react";
import { Search, Plus, User, Calendar, FileText } from "lucide-react";
import { Container } from "../components/ui/Container";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";
import { Loading } from "../components/ui/Loading";

interface PostType {
  id: number;
  title: string;
  content: string;
  username: string;
  created_at: string;
}

const Post = () => {
  const [allPosts, setAllPosts] = useState<PostType[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  if (!isLogin()) {
    return <Navigate to="/login" replace />;
  }

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        setAllPosts(data.posts || []);
        setFilteredPosts(data.posts || []);
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

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredPosts(allPosts);
    } else {
      const filtered = allPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.content.toLowerCase().includes(search.toLowerCase()) ||
          post.username.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [search, allPosts]);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-zinc-50 py-8">
      <Container size="xl">
        <PageHeader
          title="Posts"
          description="Discover stories, ideas, and insights from the community."
          action={
            <Link to="/create">
              <Button icon={Plus}>New Post</Button>
            </Link>
          }
        />

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-zinc-900 focus:ring-4 focus:ring-zinc-100 transition-all"
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <Loading text="Loading posts..." />
        ) : (
          <>
            {/* Results Count */}
            <p className="text-sm text-zinc-500 mb-4">
              {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
            </p>

            {/* Posts Grid */}
            {filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-zinc-400" />
                </div>
                <h3 className="text-lg font-medium text-zinc-900">No posts found</h3>
                <p className="text-sm text-zinc-500 mt-1">Try adjusting your search</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/post/${post.id}`}
                    className="group bg-white border border-zinc-100 rounded-2xl p-6 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-200/50 transition-all duration-200"
                  >
                    <h2 className="font-semibold text-lg text-zinc-900 line-clamp-2 group-hover:text-zinc-700">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm text-zinc-600 line-clamp-3 leading-relaxed">
                      {post.content}
                    </p>
                    <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        {post.username}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </Container>
    </div>
  );
};

export default Post;
