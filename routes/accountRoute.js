import express from "express";

import {
  showRegister,
  registerUser,
  showLogin,
  loginUser,
  showDashboard,
  logoutUser,
} from "../controllers/accountController.js";

import { checkLogin } from "../middleware/auth.js";

import {
  registrationRules,
  loginRules,
  checkRegistrationData,
  checkLoginData,
} from "../middleware/validation.js";

const router = express.Router();

router.get("/register", showRegister);

router.post(
  "/register",
  registrationRules,
  checkRegistrationData,
  registerUser
);

router.get("/login", showLogin);

router.post(
  "/login",
  loginRules,
  checkLoginData,
  loginUser
);

router.get("/dashboard", checkLogin, showDashboard);

router.get("/logout", logoutUser);

export default router;