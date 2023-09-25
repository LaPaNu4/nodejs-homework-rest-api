import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import jimp from "jimp";
import path from "path";
import fs from "fs/promises";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";
import gravatar from "gravatar";

const { JWT_SECRET } = process.env;

const signup = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email, {
    s: "200",
    r: "pg",
    d: "identicon",
  });
  const newUser = await User.create({
    ...req.body,
    password: hashPassword,
    avatarURL,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
      subscription: "starter",
      avatarURL: newUser.avatarURL,
    },
  });
};
const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(401, "Email or password invalid");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }
  const { _id: id } = user;
  const payload = {
    id,
  };
  const token = jwt.sign(payload, JWT_SECRET);
  await User.findByIdAndUpdate(id, { token });
  res.json({
    token,
    user: {
      email: user.email,
      subscription: "starter",
    },
  });
};

const getCurrent = (req, res) => {
  const { subscription, email } = req.user;
  res.json({
    email,
    subscription,
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.json({
    messege: "logout successfully",
  });
};
const subscription = async (req, res) => {
  const { subscription } = req.body;
  const { _id: userId } = req.user;
  const validSubscriptions = ["starter", "pro", "business"];
  if (!validSubscriptions.includes(subscription)) {
    throw HttpError(400, "Invalid subscription value.");
  }
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { subscription },
    { new: true }
  );

  if (!updatedUser) {
    throw HttpError(404, "User not found.");
  }
  res.json({
    user: {
      email: updatedUser.email,
      subscription: updatedUser.subscription,
    },
  });
};

const avatars = async (req, res) => {
  const { _id: userId } = req.user;
  if (!userId) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const uniqueFileName = `${userId}_${Date.now()}${path.extname(
      req.file.originalname
    )}`;

    const publicAvatarsDir = path.join(process.cwd(), "public/avatars");
    const imagePath = path.join(publicAvatarsDir, uniqueFileName);
    const tmpImagePath = req.file.path;
    const image = await jimp.read(tmpImagePath);
    image.resize(250, 250);
    await image.writeAsync(tmpImagePath);
     await fs.rename(tmpImagePath, imagePath);
    const avatarURL = `/avatars/${uniqueFileName}`;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatarURL },
      { new: true }
    );

    res.status(200).json({ updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export default {
  signup: ctrlWrapper(signup),
  signin: ctrlWrapper(signin),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  subscription: ctrlWrapper(subscription),
  avatars: ctrlWrapper(avatars),
};
