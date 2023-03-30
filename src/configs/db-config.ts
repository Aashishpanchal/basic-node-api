import mongoose from "mongoose";
import { DB } from "./settings";

// some event of mongoose
mongoose.connection.on("open", () => {
  console.log("mongodb connection established successfully");
});
mongoose.connection.on("error", (err) => {
  console.log("connection to mongo failed " + err);
  process.exit(1);
});

export default async function dbConfig() {
  const uri =
    DB.type === "local"
      ? `mongodb://0.0.0.0:${DB.port}/${DB.database_name}`
      : `mongodb+srv://${DB.username}:${DB.password}@${DB.host}/${DB.database_name}?retryWrites=true&w=majority`;

  await mongoose.connect(uri, {
    dbName: DB.database_name,
  });
}
