import express from "express";
import { body } from "express-validator";
import { checkLogin } from "../middleware/auth.js";
import { addReview, removeReview } from "../controllers/reviewController.js";

const router = express.Router();
const reviewRules = [
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Choose a rating from 1 to 5 stars."),
  body("title").trim().isLength({ max: 100 }).withMessage("Review title must be 100 characters or fewer."),
  body("body").trim().notEmpty().withMessage("Review text is required."),
];

router.post("/vehicle/:vehicleId", checkLogin, reviewRules, addReview);
router.post("/:reviewId/delete", checkLogin, removeReview);
export default router;
