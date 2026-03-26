import { Link } from "react-router-dom";
import { FileText, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Container } from "../components/ui/Container";
import { isLogin } from "../utils/auth";

const Home = () => {
  const loggedIn = isLogin();

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-zinc-50">
      {/* Hero Section */}
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16">
        <Container size="lg" className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Simple. Clean. Modern.</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 max-w-4xl mx-auto">
            Share your stories with the world
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-zinc-600 max-w-2xl mx-auto leading-relaxed">
            A minimal blogging platform designed for writers who value clarity and focus. No distractions, just pure writing.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            {loggedIn ? (
              <Link to="/post">
                <Button size="lg" icon={ArrowRight}>
                  View Posts
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" icon={ArrowRight}>
                    Start Writing
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="secondary" size="lg">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="py-12 border-t border-zinc-200">
        <Container size="lg">
          <div className="grid sm:grid-cols-3 gap-8">
            <FeatureCard 
              icon={FileText}
              title="Clean Writing"
              description="Distraction-free editor designed for focused writing sessions."
            />
            <FeatureCard 
              icon={Sparkles}
              title="Modern Design"
              description="Minimal interface that puts your content front and center."
            />
            <FeatureCard 
              icon={ArrowRight}
              title="Instant Publish"
              description="Share your thoughts with a single click. No setup required."
            />
          </div>
        </Container>
      </section>
    </div>
  );
};

function FeatureCard({ icon: Icon, title, description }: { icon: typeof FileText; title: string; description: string }) {
  return (
    <div className="text-center sm:text-left">
      <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center mb-4 mx-auto sm:mx-0">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="font-semibold text-zinc-900">{title}</h3>
      <p className="mt-2 text-sm text-zinc-600 leading-relaxed">{description}</p>
    </div>
  );
}

export default Home;