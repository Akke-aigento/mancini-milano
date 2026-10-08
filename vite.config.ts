import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Stamps each build with an id (__BUILD_ID__ in the bundle, dist/version.json)
// so open tabs can detect a newer publish. Dev gets "dev" and skips the check.
function buildIdPlugin(): Plugin {
  const buildId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    name: "mancini-build-id",
    config(_, { command }) {
      return { define: { __BUILD_ID__: JSON.stringify(command === "build" ? buildId : "dev") } };
    },
    generateBundle() {
      this.emitFile({ type: "asset", fileName: "version.json", source: JSON.stringify({ build: buildId }) });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), buildIdPlugin(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
