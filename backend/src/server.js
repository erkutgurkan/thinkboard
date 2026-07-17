import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./config/db.js";
import notesRoutes from "./routes/notesRoutes.js";
import rateLimiter from "./middleware/rateLimiter.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// middleware
app.use(express.json()); // this middleware will parse the JSON bodies: allows to access to req.body
app.use(rateLimiter);
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);

// custom middleware
// app.use((req, res, next) => {
//   console.log(`Req method is ${req.method} & Req url is ${req.url}`);
//   next();
// });

app.use("/api", (req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.use("/api/notes", notesRoutes);

// fist database run than server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on PORT:", PORT);
  });
});
