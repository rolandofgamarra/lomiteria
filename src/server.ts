import { createServer } from "http";
import { app } from "./app.js";
import { env } from "./config/env.js";
import { socketManager } from "./core/socket/socket.manager.js";

const PORT = env.PORT;
const httpServer = createServer(app);

// Initialize Real-time Layer
socketManager.initialize(httpServer);

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`
  🚀 ZarfPizzas API is ready!
  --------------------------
  Local: http://localhost:${PORT}
  Network: http://0.0.0.0:${PORT}
  --------------------------
  `);
});
