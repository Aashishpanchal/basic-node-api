import Env from "../core/env";

const env = new Env();

// node env
export const NODE_ENV = env.str("NODE_ENV");
export const DEBUG = NODE_ENV !== "production";
// server
export const PORT = env.num("PORT", 8000);
export const HOST = env.str("HOST", "localhost");

// mongodb
export const DB = {
  type: env.get<"remote" | "local">("DATABASE_ENV", "local"),
  username: env.str("DATABASE_USER", ""),
  password: env.str("DATABASE_PASSWORD", ""),
  host: env.str("DATABASE_HOST"),
  port: env.num("DATABASE_PORT"),
  database_name: env.str("DATABASE_NAME"),
};

// jwt auth
export const JWT = {
  refresh_secret_key: env.str("REFRESH_SECRET_KEY"),
  access_secret_key: env.str("ACCESS_SECRET_KEY"),
};

export const ENCRYPT_SALT = 10;
