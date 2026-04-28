import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background mono"
         style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
      <div className="border-2 border-foreground p-12 text-center">
        <div className="label mb-2">ERROR 404</div>
        <div className="data-num text-6xl mb-4">404</div>
        <p className="mono text-sm mb-1 opacity-70">PAGE NOT FOUND</p>
        <p className="mono text-[11px] opacity-40 mb-6">
          PATH: <span className="text-yellow">{location.pathname}</span>
        </p>
        <Link to="/" className="key-btn inline-block">
          ← RETURN TO HOME
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
