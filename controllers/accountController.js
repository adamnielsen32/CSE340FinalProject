import bcrypt from "bcryptjs";
import {
  createUser,
  getUserByEmail,
} from "../models/accountModel.js";

export function showRegister(req, res) {
  res.render("account/register", {
    title: "Register",
    errors: [],
    oldData: {},
  });
}

export async function registerUser(req, res, next) {
  try {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.render("account/register", {
        title: "Register",
        errors: [{ msg: "That email is already registered." }],
        oldData: req.body,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await createUser(firstName, lastName, email, hashedPassword);

    res.redirect("/account/login");
  } catch (error) {
    next(error);
  }
}

export function showLogin(req, res) {
  res.render("account/login", {
    title: "Login",
    errors: [],
    oldData: {},
  });
}

export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await getUserByEmail(email);

    if (!user) {
      return res.render("account/login", {
        title: "Login",
        errors: [{ msg: "Invalid email or password." }],
        oldData: req.body,
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.render("account/login", {
        title: "Login",
        errors: [{ msg: "Invalid email or password." }],
        oldData: req.body,
      });
    }

    req.session.user = {
      userId: user.user_id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      role: user.role,
    };

    res.redirect("/account/dashboard");
  } catch (error) {
    next(error);
  }
}

export function showDashboard(req, res) {
  res.render("account/dashboard", {
    title: "My Dashboard",
  });
}

export function logoutUser(req, res) {
  req.session.destroy(() => {
    res.redirect("/");
  });
}