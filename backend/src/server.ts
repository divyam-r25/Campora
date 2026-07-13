import { app } from "./app";
import { env } from "./config/env";

app.listen(env.port, () => {
  console.log(`Campus Connect API running on http://localhost:${env.port}`);
});
