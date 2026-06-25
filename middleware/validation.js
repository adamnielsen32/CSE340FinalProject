import { body, validationResult } from "express-validator";

export const registrationRules = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First name is required."),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last name is required."),

  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email.")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
];

export const loginRules = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email.")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required."),
];

export function checkRegistrationData(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("account/register", {
      title: "Register",
      errors: errors.array(),
      oldData: req.body,
    });
  }

  next();
}

export function checkLoginData(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("account/login", {
      title: "Login",
      errors: errors.array(),
      oldData: req.body,
    });
  }

  next();
}