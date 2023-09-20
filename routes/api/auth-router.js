import express from "express";
import * as userSchema from "../../models/User.js";
import { validateBody } from "../../decorators/index.js";
import authControler from "../../controllers/auth-controler.js";
import { authenticate } from "../../middlewares/index.js";

const authRouter = express.Router();

const userSugnupValidate = validateBody(userSchema.userSignupSchema);
const userSigninSchema = validateBody(userSchema.userSigninSchema);

authRouter.post("/users/register", userSugnupValidate, authControler.signup);
authRouter.post("/users/login", userSigninSchema, authControler.signin);
authRouter.get("/users/current", authenticate, authControler.getCurrent);
authRouter.post("/users/logout", authenticate, authControler.logout);
authRouter.patch("/users", authenticate, authControler.subscription);

export default authRouter;
