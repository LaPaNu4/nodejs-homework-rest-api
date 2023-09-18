import express from "express";
import * as userSchema from "../../models/User.js"
import { validateBody } from "../../decorators/index.js";
import authControler from "../../controllers/auth-controler.js";




const authRouter = express.Router();

const userSugnupValidate = validateBody(userSchema.userSignupSchema);
const userSigninSchema = validateBody(userSchema.userSigninSchema);

authRouter.post("/users/register", userSugnupValidate, authControler.signup);
authRouter.post("/users/login", userSigninSchema, authControler.signin);

export default authRouter