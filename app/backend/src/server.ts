import { app } from "./api/app.js";

const PORT = Number(process.env.PORT ?? 3000);

app.listen(PORT, () => {
  console.log(`CivicConnect API running on port ${PORT}`);
});