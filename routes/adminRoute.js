import express from "express";
import { checkEmployee, checkOwner } from "../middleware/auth.js";
import { showAllRequests, changeStatus } from "../controllers/serviceController.js";
import { showContactMessages } from "../controllers/contactController.js";

const router = express.Router();

router.get("/dashboard", checkEmployee, (req, res) => {
  res.render("admin/dashboard", {
    title: "Admin Dashboard",
  });
});

router.get("/owner", checkOwner, (req, res) => {
  res.render("admin/owner", {
    title: "Owner Dashboard",
  });
});

router.get("/service-requests", checkEmployee, showAllRequests);
router.post("/service-requests/:id/status", checkEmployee, changeStatus);
router.get("/contact-messages", checkEmployee, showContactMessages);

export default router;
