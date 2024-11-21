import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "./user.model.js";
const router = express.Router();

router.post("/", async (req, res, next) => {
  const { name, email, password } = req.body;

  //validation
  if (!name || !email || !password) {
    next(new Error("all fields are required!"));

    // res.status(400).json({ message: "all fields are required!" });
    //return;
  }

  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const result = await User.create({
      name,
      email,
      password: hash,
    });
    res.status(201).json({ id: result._id });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  // fetching details
  const { email, password } = req.body;

  // validation
  if (!email || !password) {
    const error = new Error({ message: "all fields are required" });
    error.statusCode(400);
    next(error);
  }

  // finding user in DB using email
  const user = await User.findOne({
    email,
  });

  //if user does'nt exist, error
  if (!user) {
    const error = new Error("invalid credentials");
    error.statusCode = 401;
    next(error);
    return;
  }

  //if exist , check passsword
  const matched = bcrypt.compareSync(password, user.password);

  if (!matched) {
    const error = new Error("invalid credentials");
    error.statusCode = 401;
    next(error);
    return;
  }

  // till now , if email and password have matched then we are going to use json web tocken.

  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: 60 * 60,
  });

  res.json({ token });
});

export default router;
