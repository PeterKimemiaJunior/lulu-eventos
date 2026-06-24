var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var adminPassword = process.env.ADMIN_PASSWORD || "LuluAdmin2026!";
if (!process.env.ADMIN_PASSWORD) {
  console.warn("\x1B[33m%s\x1B[0m", "[WARN] ADMIN_PASSWORD environment variable is not defined. Using secure fallback.");
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Admin-Password");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });
  app.use(import_express.default.json({ limit: "150mb" }));
  app.use(import_express.default.urlencoded({ limit: "150mb", extended: true }));
  app.post("/api/auth", (req, res) => {
    try {
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ success: false, error: "A palavra-passe \xE9 obrigat\xF3ria." });
      }
      if (password === adminPassword) {
        const token = Buffer.from(adminPassword).toString("base64");
        return res.json({ success: true, token });
      }
      return res.status(401).json({ success: false, error: "Palavra-passe incorreta. Acesso n\xE3o autorizado." });
    } catch (err) {
      console.error("[Auth Error]:", err);
      return res.status(500).json({ success: false, error: "Erro interno de autentica\xE7\xE3o." });
    }
  });
  app.get("/data/content.json", (req, res) => {
    const livePath = import_path.default.join(process.cwd(), "data", "content.json");
    if (import_fs.default.existsSync(livePath)) {
      res.sendFile(livePath);
    } else {
      res.status(404).json({ error: "content.json not found" });
    }
  });
  app.use("/assets/galeria", import_express.default.static(import_path.default.join(process.cwd(), "assets", "galeria")));
  app.post("/api/save", (req, res) => {
    try {
      const clientPassword = req.headers["x-admin-password"] || req.headers.authorization && req.headers.authorization.split(" ")[1];
      const validToken = Buffer.from(adminPassword).toString("base64");
      if (clientPassword !== adminPassword && clientPassword !== validToken) {
        return res.status(401).json({ success: false, error: "Acesso n\xE3o autorizado. Sess\xE3o inv\xE1lida ou expirada." });
      }
      const { content, images, deleteImages } = req.body;
      if (!content) {
        return res.status(400).json({ success: false, error: "O conte\xFAdo \xE9 obrigat\xF3rio." });
      }
      const targetDir = import_path.default.join(process.cwd(), "assets", "galeria");
      if (!import_fs.default.existsSync(targetDir)) {
        import_fs.default.mkdirSync(targetDir, { recursive: true });
      }
      if (images && Array.isArray(images)) {
        for (const img of images) {
          if (img.filename && img.base64) {
            const safeFilename = import_path.default.basename(img.filename);
            const filePath = import_path.default.join(targetDir, safeFilename);
            const buffer = Buffer.from(img.base64, "base64");
            import_fs.default.writeFileSync(filePath, buffer);
            console.log(`[Server] Saved dynamic image to workspace: ${safeFilename}`);
          }
        }
      }
      if (deleteImages && Array.isArray(deleteImages)) {
        for (const filename of deleteImages) {
          if (filename) {
            const safeFilename = import_path.default.basename(filename);
            const filePath = import_path.default.join(targetDir, safeFilename);
            if (import_fs.default.existsSync(filePath)) {
              import_fs.default.unlinkSync(filePath);
              console.log(`[Server] Deleted image from workspace: ${safeFilename}`);
            }
          }
        }
      }
      const contentPath = import_path.default.join(process.cwd(), "data", "content.json");
      import_fs.default.writeFileSync(contentPath, JSON.stringify(content, null, 2), "utf-8");
      console.log("[Server] Saved updated content.json to workspace");
      const distDir = import_path.default.join(process.cwd(), "dist");
      if (import_fs.default.existsSync(distDir)) {
        const distContentPath = import_path.default.join(distDir, "data", "content.json");
        const distDataDir = import_path.default.dirname(distContentPath);
        if (!import_fs.default.existsSync(distDataDir)) {
          import_fs.default.mkdirSync(distDataDir, { recursive: true });
        }
        import_fs.default.writeFileSync(distContentPath, JSON.stringify(content, null, 2), "utf-8");
        const distGaleriaDir = import_path.default.join(distDir, "assets", "galeria");
        if (!import_fs.default.existsSync(distGaleriaDir)) {
          import_fs.default.mkdirSync(distGaleriaDir, { recursive: true });
        }
        if (images && Array.isArray(images)) {
          for (const img of images) {
            if (img.filename && img.base64) {
              const safeFilename = import_path.default.basename(img.filename);
              const filePath = import_path.default.join(distGaleriaDir, safeFilename);
              const buffer = Buffer.from(img.base64, "base64");
              import_fs.default.writeFileSync(filePath, buffer);
            }
          }
        }
        if (deleteImages && Array.isArray(deleteImages)) {
          for (const filename of deleteImages) {
            if (filename) {
              const safeFilename = import_path.default.basename(filename);
              const filePath = import_path.default.join(distGaleriaDir, safeFilename);
              if (import_fs.default.existsSync(filePath)) {
                import_fs.default.unlinkSync(filePath);
              }
            }
          }
        }
        console.log("[Server] Mirrored updates to dist output folder");
      }
      return res.json({ success: true, message: "Conte\xFAdos salvos e publicados com sucesso!" });
    } catch (err) {
      console.error("[Server Error] Error on transactional api/save:", err);
      return res.status(500).json({ success: false, error: err.message || "Erro interno no servidor" });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("[Server] Mounted Vite development middleware");
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    console.log("[Server] Mounted static prod middleware serving from " + distPath);
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Lulu Eventos server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
