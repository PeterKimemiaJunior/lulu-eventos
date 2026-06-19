import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

// Default password falls back to a production-grade default, warned in development if missing.
const adminPassword = process.env.ADMIN_PASSWORD || "LuluAdmin2026!";
if (!process.env.ADMIN_PASSWORD) {
  console.warn("\x1b[33m%s\x1b[0m", "[WARN] ADMIN_PASSWORD environment variable is not defined. Using secure fallback.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Permit access from any development origin / sandbox iframe
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Admin-Password");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // Crucial: body size limits to allow saving multiple high-res Base64 images at once
  app.use(express.json({ limit: "150mb" }));
  app.use(express.urlencoded({ limit: "150mb", extended: true }));

  // Authenticate Admin access request
  app.post("/api/auth", (req, res) => {
    try {
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ success: false, error: "A palavra-passe é obrigatória." });
      }
      if (password === adminPassword) {
        // Return success and a standard Base64-derived payload session token
        const token = Buffer.from(adminPassword).toString("base64");
        return res.json({ success: true, token });
      }
      return res.status(401).json({ success: false, error: "Palavra-passe incorreta. Acesso não autorizado." });
    } catch (err: any) {
      console.error("[Auth Error]:", err);
      return res.status(500).json({ success: false, error: "Erro interno de autenticação." });
    }
  });

  // API to fetch dynamic live content.json
  app.get("/data/content.json", (req, res) => {
    const livePath = path.join(process.cwd(), "data", "content.json");
    if (fs.existsSync(livePath)) {
      res.sendFile(livePath);
    } else {
      res.status(404).json({ error: "content.json not found" });
    }
  });

  // Serve live gallery images directly from workspace "assets/galeria" folder
  app.use("/assets/galeria", express.static(path.join(process.cwd(), "assets", "galeria")));

  // Transactional save endpoint for content state, new images, and deleted images
  app.post("/api/save", (req, res) => {
    try {
      // 0. Authorization Check
      const clientPassword = req.headers["x-admin-password"] || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
      const validToken = Buffer.from(adminPassword).toString("base64");

      if (clientPassword !== adminPassword && clientPassword !== validToken) {
        return res.status(401).json({ success: false, error: "Acesso não autorizado. Sessão inválida ou expirada." });
      }

      const { content, images, deleteImages } = req.body;

      if (!content) {
        return res.status(400).json({ success: false, error: "O conteúdo é obrigatório." });
      }

      const targetDir = path.join(process.cwd(), "assets", "galeria");
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      // 1. Save new uploaded images (coming in as base64 string)
      if (images && Array.isArray(images)) {
        for (const img of images) {
          if (img.filename && img.base64) {
            // Mitigate path traversal vulnerability by extracting only the base file name
            const safeFilename = path.basename(img.filename);
            const filePath = path.join(targetDir, safeFilename);
            const buffer = Buffer.from(img.base64, "base64");
            fs.writeFileSync(filePath, buffer);
            console.log(`[Server] Saved dynamic image to workspace: ${safeFilename}`);
          }
        }
      }

      // 2. Delete removed images
      if (deleteImages && Array.isArray(deleteImages)) {
        for (const filename of deleteImages) {
          if (filename) {
            // Mitigate path traversal vulnerability by extracting only the base file name
            const safeFilename = path.basename(filename);
            const filePath = path.join(targetDir, safeFilename);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              console.log(`[Server] Deleted image from workspace: ${safeFilename}`);
            }
          }
        }
      }

      // 3. Write content.json in workspace
      const contentPath = path.join(process.cwd(), "data", "content.json");
      fs.writeFileSync(contentPath, JSON.stringify(content, null, 2), "utf-8");
      console.log("[Server] Saved updated content.json to workspace");

      // ====== MULTI-ENVIRONMENT COHERENCE ======
      // If "dist/" bundle folder exists, also mirror updates instantly to avoid stale caches
      const distDir = path.join(process.cwd(), "dist");
      if (fs.existsSync(distDir)) {
        const distContentPath = path.join(distDir, "data", "content.json");
        const distDataDir = path.dirname(distContentPath);
        if (!fs.existsSync(distDataDir)) {
          fs.mkdirSync(distDataDir, { recursive: true });
        }
        fs.writeFileSync(distContentPath, JSON.stringify(content, null, 2), "utf-8");

        const distGaleriaDir = path.join(distDir, "assets", "galeria");
        if (!fs.existsSync(distGaleriaDir)) {
          fs.mkdirSync(distGaleriaDir, { recursive: true });
        }

        if (images && Array.isArray(images)) {
          for (const img of images) {
            if (img.filename && img.base64) {
              const safeFilename = path.basename(img.filename);
              const filePath = path.join(distGaleriaDir, safeFilename);
              const buffer = Buffer.from(img.base64, "base64");
              fs.writeFileSync(filePath, buffer);
            }
          }
        }

        if (deleteImages && Array.isArray(deleteImages)) {
          for (const filename of deleteImages) {
            if (filename) {
              const safeFilename = path.basename(filename);
              const filePath = path.join(distGaleriaDir, safeFilename);
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
              }
            }
          }
        }
        console.log("[Server] Mirrored updates to dist output folder");
      }

      return res.json({ success: true, message: "Conteúdos salvos e publicados com sucesso!" });
    } catch (err: any) {
      console.error("[Server Error] Error on transactional api/save:", err);
      return res.status(500).json({ success: false, error: err.message || "Erro interno no servidor" });
    }
  });

  // Vite development middleware vs Static built asset serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("[Server] Mounted Vite development middleware");
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    console.log("[Server] Mounted static prod middleware serving from " + distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Lulu Eventos server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
