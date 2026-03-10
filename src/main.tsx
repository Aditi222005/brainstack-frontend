import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App.tsx";
import "./index.css";

// Use a placeholder client ID, the user should replace this in production
const GOOGLE_CLIENT_ID = "151558869000-kut440heq09ltjkd3k19s6meeqrsfiqm.apps.googleusercontent.com";

createRoot(document.getElementById("root")!).render(
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <App />
    </GoogleOAuthProvider>
);
