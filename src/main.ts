import * as dotenv from "dotenv";
dotenv.config();

import app from "./app";
import { dbConfig, settings } from "./configs";

// main server function
async function bootstrap() {
  // config database
  await dbConfig(); // mongodb config
  app.listen(settings.PORT, settings.HOST, () => {
    console.log(
      `🚀 Server started at http://${settings.HOST}:${settings.PORT}\n🚨️ Environment: ${process.env.NODE_ENV}\n[*] Quit the server with CTRL-BREAK.`
    );
  });
}

bootstrap();
