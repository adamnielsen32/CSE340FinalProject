import express from "express";
import { body } from "express-validator";
import { showContactForm, submitContactForm } from "../controllers/contactController.js";

const router = express.Router();

const contactRules = [
  body("name").trim().notEmpty().withMessage("Name is required.").isLength({ max: 100 }).withMessage("Name must be 100 characters or fewer."),
  body("email").trim().isEmail().withMessage("Enter a valid email address.").normalizeEmail(),
  body("phone").trim().isLength({ max: 25 }).withMessage("Phone must be 25 characters or fewer."),
  body("subject").trim().notEmpty().withMessage("Subject is required.").isLength({ max: 120 }).withMessage("Subject must be 120 characters or fewer."),
  body("message").trim().notEmpty().withMessage("Message is required."),
];

router.get("/", showContactForm);
router.post("/", contactRules, submitContactForm);

export default router;
