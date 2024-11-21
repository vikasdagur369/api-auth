import express from "express";
import cors from "cors";
import { connectDB } from "./src/config/db.js";
import userRouter from "./src/user/user.route.js";

const app = express();

try {
  connectDB();
  console.log("db connected");
} catch (err) {
  console.error(err);
  process.exit(1);
}

//Global middlewares: - it will be apply for every request
app.use(cors());

// json use karne ke liye yeh middleware use krna pdega
app.use(express.json());

const reqLogger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

app.use("/api/users", userRouter);

app.use(reqLogger);

app.get("/", reqLogger, (req, res) => {
  // res.json({
  //     "message":"everything is working fine"
  // })
  res.send("HI");
});

// global error handler sbse last me hona chahiye

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 4000;

app.listen(4000, () => {
  console.log(`server is running on port ${PORT}`);
});
