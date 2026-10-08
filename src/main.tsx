import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { ensureSessionForLegacyCart } from "./integrations/sellqo/session";
import { startVersionCheck } from "./lib/versionCheck";

ensureSessionForLegacyCart();
startVersionCheck();

createRoot(document.getElementById("root")!).render(<App />);
