import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

class RedisClient {
  constructor() {
    this.client = createClient({
      username: "default",
      password: process.env.REDIS_PASSWORD, // depuis ton .env
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        // tls: true  <-- NE PAS METTRE pour le port standard
      },
    });

    this.client.on("error", (err) => {
      console.error("Redis error:", err);
    });
  }

  async connect() {
    if (!this.client.isOpen) {
      await this.client.connect();
      console.log("✅ Redis Cloud connecté");
    }
  }

  getClient() {
    return this.client;
  }
}

export default new RedisClient();
